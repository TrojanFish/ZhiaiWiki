import { WIKI_TOPICS } from '../src/lib/wikiData';
import { BREAST_WIKI_TOPICS } from '../src/lib/breastWikiData';
import { COLON_WIKI_TOPICS } from '../src/lib/colonWikiData';
import { RECTAL_WIKI_TOPICS } from '../src/lib/rectalWikiData';
import { COLORECTAL_WIKI_TOPICS } from '../src/lib/colorectalWikiData';
import { GASTRIC_WIKI_TOPICS } from '../src/lib/gastricWikiData';
import { LIVER_WIKI_TOPICS } from '../src/lib/liverWikiData';
import { ESOPHAGEAL_WIKI_TOPICS } from '../src/lib/esophagealWikiData';
import { THYROID_WIKI_TOPICS } from '../src/lib/thyroidWikiData';

const datasets = [
  { name: '肺癌 (Lung)', topics: WIKI_TOPICS },
  { name: '乳腺癌 (Breast)', topics: BREAST_WIKI_TOPICS },
  { name: '结肠癌 (Colon)', topics: COLON_WIKI_TOPICS },
  { name: '直肠癌 (Rectal)', topics: RECTAL_WIKI_TOPICS },
  { name: '胃癌 (Gastric)', topics: GASTRIC_WIKI_TOPICS },
  { name: '原发性肝癌 (Liver)', topics: LIVER_WIKI_TOPICS },
  { name: '食管鳞癌 (Esophageal)', topics: ESOPHAGEAL_WIKI_TOPICS },
  { name: '甲状腺癌 (Thyroid)', topics: THYROID_WIKI_TOPICS },
];

for (const d of datasets) {
  console.log(`\n=================== ${d.name} (共 ${d.topics.length} 篇) ===================`);
  const catMap: Record<string, number> = {};
  const riskMap: Record<string, number> = {};
  let visualCount = 0;
  const missingVisuals: string[] = [];
  d.topics.forEach((t, i) => {
    catMap[t.category] = (catMap[t.category] || 0) + 1;
    riskMap[t.riskLevel] = (riskMap[t.riskLevel] || 0) + 1;
    if (t.visualComponent) {
      visualCount++;
    } else {
      missingVisuals.push(`[${t.category}] ${t.id} (${t.title})`);
    }
    console.log(`  ${i + 1}. [${t.category}] [${t.riskLevel}] ${t.id}: ${t.title} ${t.visualComponent ? '🎨(' + t.visualComponent + ')' : '❌'}`);
  });
  console.log(`  📊 分类分布:`, catMap);
  console.log(`  ⚠️ 风险分级:`, riskMap);
  console.log(`  🎨 视觉模拟器装配率: ${visualCount}/${d.topics.length} (${Math.round(visualCount / d.topics.length * 100)}%)`);
  if (missingVisuals.length > 0) {
    console.log(`  🔍 尚未装配图解的词条 (${missingVisuals.length} 篇):`);
    missingVisuals.forEach((m) => console.log(`     - ${m}`));
  }
}


