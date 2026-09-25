import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { KnowledgeNode, EdgeEvidence } from '@/lib/knowledgeGraphData';
import { DEFAULT_GRAPH_NODES, DEFAULT_EDGE_EVIDENCES } from '@/lib/defaultGraphData';
import { BREAST_GRAPH_NODES, BREAST_EDGE_EVIDENCE_MAP } from '@/lib/breastKnowledgeGraphData';
import { COLORECTAL_GRAPH_NODES, COLORECTAL_EDGE_EVIDENCE } from '@/lib/colorectalKnowledgeGraphData';
import { GASTRIC_GRAPH_NODES, GASTRIC_EDGE_EVIDENCE } from '@/lib/gastricKnowledgeGraphData';
import { LIVER_GRAPH_NODES, LIVER_EDGE_EVIDENCE } from '@/lib/liverKnowledgeGraphData';
import { ESOPHAGEAL_GRAPH_NODES, ESOPHAGEAL_EDGE_EVIDENCE } from '@/lib/esophagealKnowledgeGraphData';
import { THYROID_GRAPH_NODES, THYROID_EDGE_EVIDENCE } from '@/lib/thyroidKnowledgeGraphData';
import { 
  ENDOMETRIAL_GRAPH_NODES, ENDOMETRIAL_EDGE_EVIDENCE,
  CERVICAL_GRAPH_NODES, CERVICAL_EDGE_EVIDENCE 
} from '@/lib/gynecologicalKnowledgeGraphData';

const CACHE_HEADERS = {
  headers: {
    'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cancerType = searchParams.get('cancerType');

    if (cancerType === 'breast') {
      return NextResponse.json({
        nodes: BREAST_GRAPH_NODES,
        edgeEvidences: BREAST_EDGE_EVIDENCE_MAP
      }, CACHE_HEADERS);
    }

    if (cancerType === 'colorectal' || cancerType === 'colon' || cancerType === 'rectal') {
      return NextResponse.json({
        nodes: COLORECTAL_GRAPH_NODES,
        edgeEvidences: COLORECTAL_EDGE_EVIDENCE
      }, CACHE_HEADERS);
    }

    if (cancerType === 'gastric') {
      return NextResponse.json({
        nodes: GASTRIC_GRAPH_NODES,
        edgeEvidences: GASTRIC_EDGE_EVIDENCE
      }, CACHE_HEADERS);
    }

    if (cancerType === 'liver') {
      return NextResponse.json({
        nodes: LIVER_GRAPH_NODES,
        edgeEvidences: LIVER_EDGE_EVIDENCE
      }, CACHE_HEADERS);
    }

    if (cancerType === 'esophageal') {
      return NextResponse.json({
        nodes: ESOPHAGEAL_GRAPH_NODES,
        edgeEvidences: ESOPHAGEAL_EDGE_EVIDENCE
      }, CACHE_HEADERS);
    }

    if (cancerType === 'thyroid') {
      return NextResponse.json({
        nodes: THYROID_GRAPH_NODES,
        edgeEvidences: THYROID_EDGE_EVIDENCE
      }, CACHE_HEADERS);
    }

    if (cancerType === 'endometrial') {
      return NextResponse.json({
        nodes: ENDOMETRIAL_GRAPH_NODES,
        edgeEvidences: ENDOMETRIAL_EDGE_EVIDENCE
      }, CACHE_HEADERS);
    }

    if (cancerType === 'cervical') {
      return NextResponse.json({
        nodes: CERVICAL_GRAPH_NODES,
        edgeEvidences: CERVICAL_EDGE_EVIDENCE
      }, CACHE_HEADERS);
    }

    // 1. Fetch nodes and their outgoing edges from DB
    const rawNodes = await prisma.node.findMany({
      include: {
        sourceEdges: true,
      }
    });

    if (!rawNodes || rawNodes.length === 0) {
      // Return pre-seeded robust baseline graph nodes & evidences
      return NextResponse.json({
        nodes: DEFAULT_GRAPH_NODES,
        edgeEvidences: DEFAULT_EDGE_EVIDENCES
      });
    }

    const nodes: KnowledgeNode[] = rawNodes.map((n: any) => {
      const connections: string[] = [];
      const connectionTypes: Record<string, "risk" | "protective" | "guides"> = {};

      n.sourceEdges.forEach((edge: any) => {
        connections.push(edge.targetNodeId);
        connectionTypes[edge.targetNodeId] = edge.relationshipType as any;
      });

      return {
        id: n.id,
        label: n.label,
        type: n.type as any,
        x: n.x,
        y: n.y,
        connections,
        connectionTypes,
        studies: 18,
        evidence: 5,
        description: n.description || '',
      };
    });

    // 2. Fetch all edges with their evidence, studies, and forest data
    const rawEdges = await prisma.edge.findMany({
      include: {
        evidence: true,
        studies: {
          include: {
            study: true
          }
        },
        forestData: true
      }
    });

    const edgeEvidences: Record<string, EdgeEvidence> = { ...DEFAULT_EDGE_EVIDENCES };

    rawEdges.forEach((edge: any) => {
      if (!edge.evidence) return;
      
      const edgeKey = `${edge.sourceNodeId}-${edge.targetNodeId}`;
      
      const metric = edge.evidence.metricLabel ? {
        label: edge.evidence.metricLabel,
        value: edge.evidence.metricValue || '',
        ci: edge.evidence.metricCi || '',
        p: edge.evidence.metricP || ''
      } : undefined;

      const studies = edge.studies.map((s: any) => ({
        title: s.study.title,
        journal: s.study.journal || '',
        year: s.study.publishedYear || 0,
        doi: s.study.doi || '',
        conclusion: s.study.conclusion || ''
      }));

      const forestData = edge.forestData.map((f: any) => ({
        study: f.studyName,
        year: f.year || 0,
        hr: f.hr,
        ciLow: f.ciLow,
        ciHigh: f.ciHigh
      }));

      edgeEvidences[edgeKey] = {
        title: edge.evidence.title,
        description: edge.evidence.description,
        metric,
        studies: studies.length > 0 ? studies : (DEFAULT_EDGE_EVIDENCES[edgeKey]?.studies || []),
        forestData: forestData.length > 0 ? forestData : (DEFAULT_EDGE_EVIDENCES[edgeKey]?.forestData || [])
      };
    });

    return NextResponse.json({
      nodes: nodes.length > 0 ? nodes : DEFAULT_GRAPH_NODES,
      edgeEvidences
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Failed to fetch graph data from DB, using pre-seeded fallback:', error);
    return NextResponse.json({
      nodes: DEFAULT_GRAPH_NODES,
      edgeEvidences: DEFAULT_EDGE_EVIDENCES
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600'
      }
    });
  }

}
