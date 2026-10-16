import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allStudiesPath = path.join(__dirname, 'all-studies.json');
const incomingDir = path.join(__dirname, '..', 'data', 'incoming-papers');
const targetPapersDir = path.join(__dirname, '..', 'app', 'public', 'papers');

if (!fs.existsSync(incomingDir)) fs.mkdirSync(incomingDir, { recursive: true });
if (!fs.existsSync(targetPapersDir)) fs.mkdirSync(targetPapersDir, { recursive: true });

const studies = JSON.parse(fs.readFileSync(allStudiesPath, 'utf8'));

console.log(`========================================================`);
console.log(`ZhiaiWiki 多源开放获取原版论文自动检索与下载器`);
console.log(`待检索文献总数: ${studies.length}`);
console.log(`========================================================\n`);

async function downloadPdf(url, targetPath) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/pdf,*/*'
      }
    });
    clearTimeout(timeout);

    if (!res.ok) return { success: false, reason: `HTTP ${res.status}` };
    const buffer = Buffer.from(await res.arrayBuffer());
    
    // Check if it's a real PDF (starts with %PDF) and size > 40KB
    if (buffer.length < 40 * 1024) {
      return { success: false, reason: `File too small (${(buffer.length / 1024).toFixed(1)} KB)` };
    }
    const header = buffer.subarray(0, 5).toString('ascii');
    if (!header.startsWith('%PDF')) {
      return { success: false, reason: `Not a PDF format (header: ${header})` };
    }

    fs.writeFileSync(targetPath, buffer);
    return { success: true, sizeBytes: buffer.length };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

async function findPdfUrl(study) {
  const doi = study.doi?.trim();
  const pmid = study.pmid?.trim();

  // 1. Check Europe PMC via PMID or DOI
  if (pmid || doi) {
    const query = pmid ? `EXT_ID:${pmid}` : `DOI:"${doi}"`;
    try {
      const res = await fetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&resultType=core`, {
        headers: { 'User-Agent': 'ZhiaiWikiEvidenceBot/1.0 (evidence@zhiaiwiki.org)' }
      });
      if (res.ok) {
        const data = await res.json();
        const item = data.resultList?.result?.[0];
        if (item?.pmcid) {
          return {
            source: 'Europe PMC (PMCID: ' + item.pmcid + ')',
            url: `https://europepmc.org/backend/ptpmcrender.fcgi?accid=${item.pmcid}&blobtype=pdf`
          };
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 2. Check Unpaywall via DOI
  if (doi) {
    try {
      const res = await fetch(`https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=evidence-bot@zhiaiwiki.org`);
      if (res.ok) {
        const data = await res.json();
        if (data.is_oa && data.best_oa_location?.url_for_pdf) {
          return {
            source: `Unpaywall (${data.best_oa_location.host_type || 'repository'})`,
            url: data.best_oa_location.url_for_pdf
          };
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Check OpenAlex via DOI
  if (doi) {
    try {
      const res = await fetch(`https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}`, {
        headers: { 'User-Agent': 'mailto:evidence-bot@zhiaiwiki.org' }
      });
      if (res.ok) {
        const data = await res.json();
        const pdfUrl = data.best_oa_location?.pdf_url || data.primary_location?.pdf_url;
        if (pdfUrl) {
          return {
            source: 'OpenAlex',
            url: pdfUrl
          };
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 4. Check Semantic Scholar via DOI
  if (doi) {
    try {
      const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(doi)}?fields=openAccessPdf`);
      if (res.ok) {
        const data = await res.json();
        if (data.openAccessPdf?.url) {
          return {
            source: 'Semantic Scholar',
            url: data.openAccessPdf.url
          };
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return null;
}

async function run() {
  let downloadedCount = 0;
  let alreadyHasRealCount = 0;
  let paywalledCount = 0;

  for (let i = 0; i < studies.length; i++) {
    const study = studies[i];
    const targetFile = path.join(targetPapersDir, `${study.id}.pdf`);

    // Check if target file already exists and is a real multi-page PDF (> 60KB)
    if (fs.existsSync(targetFile)) {
      const stat = fs.statSync(targetFile);
      if (stat.size > 60 * 1024) {
        console.log(`[${i + 1}/${studies.length}] [已归档] ${study.id}: ${(stat.size / 1024).toFixed(0)} KB`);
        alreadyHasRealCount++;
        continue;
      }
    }

    console.log(`[${i + 1}/${studies.length}] [检索中] ${study.id} (${study.trial || study.title.slice(0, 30)}...)...`);
    const result = await findPdfUrl(study);

    if (result) {
      console.log(`  └─> 找到开放获取源 [${result.source}]: ${result.url}`);
      // Save directly to targetPapersDir
      const dl = await downloadPdf(result.url, targetFile);
      if (dl.success) {
        console.log(`  └─> ✅ 下载成功! 原始论文大小: ${(dl.sizeBytes / 1024).toFixed(1)} KB`);
        downloadedCount++;
      } else {
        console.log(`  └─> ⚠️ 下载失败 (${dl.reason})`);
        paywalledCount++;
      }
    } else {
      console.log(`  └─> 🔒 商业订阅期刊付费墙限制 (无公共开放获取源)`);
      paywalledCount++;
    }

    // Rate limiting gentle pause
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n========================================================`);
  console.log(`检索完成统计:`);
  console.log(`- 已有真实论文: ${alreadyHasRealCount}`);
  console.log(`- 本次成功下载: ${downloadedCount}`);
  console.log(`- 付费墙限制需内网/校园网获取: ${paywalledCount}`);
  console.log(`========================================================\n`);
}

run();
