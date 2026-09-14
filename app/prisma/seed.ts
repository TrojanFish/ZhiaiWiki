import { PrismaClient } from '@prisma/client';
import { DEFAULT_GRAPH_NODES, DEFAULT_EDGE_EVIDENCES } from '../src/lib/defaultGraphData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 4D Knowledge Graph nodes and edges...');

  // 1. Seed Nodes
  for (const node of DEFAULT_GRAPH_NODES) {
    await prisma.node.upsert({
      where: { id: node.id },
      update: {
        label: node.label,
        type: node.type,
        x: node.x,
        y: node.y,
        description: node.description,
      },
      create: {
        id: node.id,
        label: node.label,
        type: node.type,
        x: node.x,
        y: node.y,
        description: node.description,
      },
    });
  }

  // 2. Seed Edges and Evidence
  for (const [edgeKey, evidence] of Object.entries(DEFAULT_EDGE_EVIDENCES)) {
    const [sourceId, targetId] = edgeKey.split('-');
    if (!sourceId || !targetId) continue;

    // Defensively verify both source and target nodes exist to prevent foreign key errors
    const sourceNode = await prisma.node.findUnique({ where: { id: sourceId } });
    const targetNode = await prisma.node.findUnique({ where: { id: targetId } });
    if (!sourceNode || !targetNode) {
      console.warn(`[Seed] Skipping edge ${edgeKey}: source (${sourceId}) or target (${targetId}) node does not exist.`);
      continue;
    }

    // Determine relationship type
    let relationshipType = 'guides';
    if (targetId === 'RECURRENCE' || targetId === 'METASTASIS') {
      if (sourceId === 'TARGETED' || sourceId === 'SURGERY' || sourceId === 'ADJUVANT') {
        relationshipType = 'protective';
      } else {
        relationshipType = 'risk';
      }
    }

    const edge = await prisma.edge.upsert({
      where: {
        sourceNodeId_targetNodeId: {
          sourceNodeId: sourceId,
          targetNodeId: targetId,
        },
      },
      update: {
        relationshipType,
      },
      create: {
        sourceNodeId: sourceId,
        targetNodeId: targetId,
        relationshipType,
      },
    });

    // Upsert EdgeEvidence
    await prisma.edgeEvidence.upsert({
      where: { edgeId: edge.id },
      update: {
        title: evidence.title,
        description: evidence.description,
        metricLabel: evidence.metric?.label,
        metricValue: evidence.metric?.value,
        metricCi: evidence.metric?.ci,
        metricP: evidence.metric?.p,
      },
      create: {
        edgeId: edge.id,
        title: evidence.title,
        description: evidence.description,
        metricLabel: evidence.metric?.label,
        metricValue: evidence.metric?.value,
        metricCi: evidence.metric?.ci,
        metricP: evidence.metric?.p,
      },
    });
  }

  console.log('✅ Knowledge Graph nodes and edges seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
