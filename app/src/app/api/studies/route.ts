import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { FEATURED_STUDIES } from '@/lib/evidence-data';
import { CancerRegistry } from '@/lib/cancerRegistry';
import { isSupportedCancerType } from '@/lib/stagingRegistry';

function resolveStudyPdf(studyId: string, customFileName?: string | null) {
  const fileName = customFileName || `${studyId}.pdf`;
  try {
    let papersDir = path.join(process.cwd(), 'public', 'papers');
    if (!fs.existsSync(papersDir)) {
      papersDir = path.join(process.cwd(), 'app', 'public', 'papers');
    }
    const fullPath = path.join(papersDir, fileName);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      // Real journal papers with multi-page text and publisher layout are > 50KB (dossiers are ~3-4KB)
      const isOriginalPaper = stats.size > 50 * 1024;
      return {
        hasLocalPdf: true,
        pdfUrl: `/papers/${fileName}`,
        pdfFileName: fileName,
        isOriginalPaper,
        fileSizeBytes: stats.size,
      };
    }
  } catch {
    // Non-blocking in case of filesystem permissions
  }
  return {
    hasLocalPdf: true,
    pdfUrl: `/papers/${fileName}`,
    pdfFileName: fileName,
    isOriginalPaper: false,
    fileSizeBytes: 0,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.toLowerCase() || '';
    const level = searchParams.get('level') || 'all';
    const requestedCancerType = searchParams.get('cancerType');
    const cancerType = requestedCancerType || 'all';
    if (cancerType !== 'all' && !isSupportedCancerType(cancerType)) {
      return NextResponse.json({ success: false, error: '不支持的癌种类型', code: 'UNSUPPORTED_CANCER_TYPE' }, { status: 400 });
    }

    // 1. Fetch Ingested Studies from Database
    let dbStudies: any[] = [];
    try {
      dbStudies = await prisma.ingestedStudy.findMany({
        where: cancerType === 'all' ? undefined : { cancerType },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      console.warn("Could not load ingested studies from DB, falling back to static studies", e);
    }

    // 2. Format dbStudies into uniform Study format
    const formattedDbStudies = dbStudies.map((s) => {
      let relevantFactors: string[] = [];
      let applicableStages: string[] = [];
      try {
        if (s.relevantFactors) relevantFactors = JSON.parse(s.relevantFactors);
      } catch {
        relevantFactors = s.relevantFactors ? [s.relevantFactors] : [];
      }
      try {
        if (s.applicableStages) applicableStages = JSON.parse(s.applicableStages);
      } catch {
        applicableStages = s.applicableStages ? [s.applicableStages] : [];
      }

      const conclusions: string[] = [];
      if (s.conclusion) conclusions.push(s.conclusion);
      if (s.hr) conclusions.push(`主要终点风险比 HR: ${s.hr} ${s.ciLow && s.ciHigh ? `(95% CI: ${s.ciLow}-${s.ciHigh})` : ''}`);
      if (s.rfs5Year) conclusions.push(`5年无复发生存率 (5yr RFS): ${s.rfs5Year}`);
      if (s.riskReduction) conclusions.push(`相对获益/风险降低率: ${s.riskReduction}`);

      const pdfInfo = resolveStudyPdf(s.id, s.pdfFileName);

      return {
        id: s.id,
        title: s.title,
        journal: s.journal || 'Journal',
        year: s.year || 2023,
        patientN: s.patientN || 0,
        studyType: s.studyType || 'retrospective',
        evidenceLevel: (s.evidenceLevel || 4) as 1 | 2 | 3 | 4 | 5,
        doi: s.doi || undefined,
        pubmedId: s.pubmedId || undefined,
        url: s.url || (s.doi ? `https://doi.org/${s.doi}` : (s.pubmedId ? `https://pubmed.ncbi.nlm.nih.gov/${s.pubmedId}/` : undefined)),
        pdfUrl: pdfInfo.pdfUrl,
        pdfFileName: pdfInfo.pdfFileName,
        hasLocalPdf: pdfInfo.hasLocalPdf,
        isOriginalPaper: pdfInfo.isOriginalPaper,
        fileSizeBytes: pdfInfo.fileSizeBytes,
        keyConclusions: conclusions.length > 0 ? conclusions : ['见完整研究文献'],
        relevantFactors: Array.isArray(relevantFactors) ? relevantFactors : [cancerType === 'breast' ? '乳腺癌预后' : cancerType === 'lung' ? '肺癌预后' : '全癌种循证预后'],
        applicableStages: Array.isArray(applicableStages) ? applicableStages : ['I', 'II', 'III'],
        biomarkerDetails: s.biomarkerDetails || undefined,
        interventionArm: s.interventionArm || undefined,
        riskReduction: s.riskReduction || undefined,
        isIngested: true,
      };
    });

    // 3. Merge with predefined studies (deduplicate by DOI or title)
    let baseStudies: any[] = [];
    if (cancerType === 'all') {
      const allPlugins = CancerRegistry.getAll();
      const seenIds = new Set<string>();
      for (const plugin of allPlugins) {
        if (plugin?.content?.featuredStudies && Array.isArray(plugin.content.featuredStudies)) {
          for (const s of plugin.content.featuredStudies) {
            if (!seenIds.has(s.id)) {
              seenIds.add(s.id);
              baseStudies.push({
                ...s,
                cancerType: s.cancerType || plugin.id,
              });
            }
          }
        }
      }
      if (baseStudies.length === 0) {
        baseStudies = FEATURED_STUDIES;
      }
    } else {
      try {
        const plugin = CancerRegistry.get(cancerType);
        if (plugin?.content?.featuredStudies && plugin.content.featuredStudies.length > 0) {
          baseStudies = plugin.content.featuredStudies;
        } else {
          baseStudies = FEATURED_STUDIES;
        }
      } catch {
        baseStudies = FEATURED_STUDIES;
      }
    }
    const existingDois = new Set(formattedDbStudies.map(s => s.doi).filter(Boolean));
    const staticStudies = baseStudies.filter(s => !s.doi || !existingDois.has(s.doi)).map(s => {
      const pdfInfo = resolveStudyPdf(s.id, s.pdfFileName);
      return {
        ...s,
        url: s.doi ? `https://doi.org/${s.doi}` : (s.pubmedId ? `https://pubmed.ncbi.nlm.nih.gov/${s.pubmedId}/` : undefined),
        pdfUrl: pdfInfo.pdfUrl,
        pdfFileName: pdfInfo.pdfFileName,
        hasLocalPdf: pdfInfo.hasLocalPdf,
        isOriginalPaper: pdfInfo.isOriginalPaper,
        fileSizeBytes: pdfInfo.fileSizeBytes,
      };
    });

    const combined = [...formattedDbStudies, ...staticStudies];

    // 4. Apply filtering
    let filtered = combined;
    if (level !== 'all') {
      const levelNum = parseInt(level, 10);
      filtered = filtered.filter(s => s.evidenceLevel === levelNum);
    }

    if (q) {
      filtered = filtered.filter((s: any) => 
        (s.title || '').toLowerCase().includes(q) ||
        (s.journal || '').toLowerCase().includes(q) ||
        (s.relevantFactors || []).some((f: string) => typeof f === 'string' && f.toLowerCase().includes(q)) ||
        (s.keyConclusions || []).some((c: string) => typeof c === 'string' && c.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      studies: filtered,
      totalCount: combined.length
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });

  } catch (error: any) {
    console.error("Error in /api/studies:", error);
    const safeError = process.env.NODE_ENV === 'production' ? '获取医学临床研究文献失败，请稍后重试' : (error.message || '获取医学临床研究文献失败');
    return NextResponse.json({ success: false, error: safeError }, { status: 500 });
  }
}
