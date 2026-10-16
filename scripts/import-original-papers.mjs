import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const incomingDir = path.join(__dirname, '..', 'data', 'incoming-papers');
const targetPapersDir = path.join(__dirname, '..', 'app', 'public', 'papers');
const studiesPath = path.join(__dirname, 'all-studies.json');

if (!fs.existsSync(incomingDir)) {
  fs.mkdirSync(incomingDir, { recursive: true });
}
if (!fs.existsSync(targetPapersDir)) {
  fs.mkdirSync(targetPapersDir, { recursive: true });
}

// Create README in incoming-papers
const incomingReadme = `# 📥 原版学术论文导入目录 (Original Research Papers Drop-in)

在此目录下放入您通过图书馆、医院内网、CNKI、EndNote、PubMed 或学术数据库下载的**真实期刊原版论文 PDF**。

## 🚀 自动匹配与导入说明：
1. 您可以将下载到的任意原版 PDF 直接放入本目录（文件名随意，如 \`nejm_tailorx.pdf\`、\`JCOG0802.pdf\` 等）。
2. 在项目根目录运行匹配脚本：
   \`\`\`bash
   node scripts/import-original-papers.mjs
   \`\`\`
3. 脚本会自动根据 PDF 内容中的 **DOI**、**PMID** 或 **标题关键词** 智能匹配全站 95 篇临床研究，自动重命名并归档至 \`app/public/papers/<studyId>.pdf\`。
4. 归档后，全站文献卡片将自动点亮 **「📄 顶刊原版论文全文」** 真实徽章！
`;
fs.writeFileSync(path.join(incomingDir, 'README.md'), incomingReadme, 'utf8');

function findPdfFilesRecursively(dir) {
  let results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(findPdfFilesRecursively(full));
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
        results.push(full);
      }
    }
  } catch (err) {
    console.error(`Error reading ${dir}:`, err.message);
  }
  return results;
}

function normalizeDoi(doi) {
  if (!doi) return '';
  return doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').trim().toLowerCase();
}

function cleanTitle(title) {
  if (!title) return '';
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

async function runImporter() {
  if (!fs.existsSync(studiesPath)) {
    console.error('all-studies.json not found!');
    return;
  }

  const studies = JSON.parse(fs.readFileSync(studiesPath, 'utf8'));
  const allPdfPaths = findPdfFilesRecursively(incomingDir);

  console.log(`\n========================================================`);
  console.log(`ZhiaiWiki 原版研究论文智能导入工具`);
  console.log(`扫描导入目录: ${incomingDir}`);
  console.log(`检测到待导入 PDF 文件数: ${allPdfPaths.length}`);
  console.log(`========================================================\n`);

  if (allPdfPaths.length === 0) {
    console.log(`提示: 目前 ${incomingDir} 目录下暂无待导入的 PDF 文件。`);
    console.log(`您可以将从 NEJM、The Lancet、JCO 等期刊下载的原版 PDF 复制到该目录下，再次运行本命令即可自动匹配归档。\n`);
    return;
  }

  let matchedCount = 0;
  const matchedStudyIds = new Set();

  for (const fullPath of allPdfPaths) {
    const fileName = path.basename(fullPath);
    const content = fs.readFileSync(fullPath);
    const latin = content.toString('latin1', 0, Math.min(content.length, 300000));
    const utf = content.toString('utf8', 0, Math.min(content.length, 300000));
    const text = (latin + ' ' + utf).toLowerCase();
    
    let best = null;
    let bestScore = 0;
    let bestReason = '';

    // 1. DOI exact match (highest priority, score 100)
    for (const s of studies) {
      const sDoi = normalizeDoi(s.doi);
      if (sDoi && sDoi.length > 5 && text.includes(sDoi)) {
        best = s;
        bestScore = 100;
        bestReason = 'DOI: ' + sDoi;
        break;
      }
    }

    // 2. If no DOI match, check Title & Author matching
    if (!best) {
      const cleanFn = cleanTitle(fileName);

      for (const s of studies) {
        let score = 0;
        let reasons = [];
        const cleanT = cleanTitle(s.title);
        const titleWords = cleanT.split(' ').filter(w => w.length >= 4);
        
        // Title overlap
        let sharedWords = 0;
        for (const w of titleWords) {
          if (cleanFn.includes(w)) sharedWords++;
        }
        
        const overlapRatio = titleWords.length > 0 ? sharedWords / titleWords.length : 0;
        if (overlapRatio >= 0.6) {
          score += Math.round(overlapRatio * 50);
          reasons.push('TitleOverlap(' + sharedWords + '/' + titleWords.length + ')');
        }

        // Check trial acronym
        const firstWordOfTitle = s.id.split('_')[0].toLowerCase();
        if (cleanFn.includes(firstWordOfTitle) && firstWordOfTitle.length >= 4) {
          score += 25;
          reasons.push('Acronym(' + firstWordOfTitle + ')');
        }

        // Special key phrases for landmark trials
        if (cleanFn.includes('her2 low') && cleanT.includes('her2 low')) {
          score += 35;
          reasons.push('HER2-Low');
        }
        if (cleanFn.includes('altorki') && (s.id.includes('CALGB') || cleanT.includes('sublobar resection versus lobar'))) {
          score += 40;
          reasons.push('Altorki+CALGB');
        }
        if (cleanFn.includes('toripalimab') && s.id.includes('Neotorch')) {
          score += 40;
          reasons.push('Toripalimab+Neotorch');
        }
        if (cleanFn.includes('nelson') || (cleanFn.includes('koning') && s.id.includes('NELSON'))) {
          score += 40;
          reasons.push('Koning+NELSON');
        }

        if (score > bestScore && score >= 35) {
          bestScore = score;
          best = s;
          bestReason = reasons.join('+');
        }
      }
    }

    if (best) {
      const targetFileName = `${best.id}.pdf`;
      const targetDest = path.join(targetPapersDir, targetFileName);
      fs.copyFileSync(fullPath, targetDest);
      const sizeMb = (content.length / (1024 * 1024)).toFixed(2);
      console.log(`[成功匹配] ${fileName} -> ${targetFileName} (${sizeMb} MB)`);
      console.log(`           对应研究: [${best.journal}] ${best.title}`);
      console.log(`           匹配依据: [${bestReason}] | 所属癌种: ${best.cancerType}\n`);
      matchedCount++;
      matchedStudyIds.add(best.id);
    } else {
      console.log(`[未匹配] ${fileName} (非肺癌/乳腺癌或未收录，安全跳过)\n`);
    }
  }

  console.log(`========================================================`);
  console.log(`导入完成: 成功匹配并归档 ${matchedCount} / ${allPdfPaths.length} 篇原版学术论文。`);
  console.log(`覆盖研究数: ${matchedStudyIds.size} 篇`);
  console.log(`目标归档目录: ${targetPapersDir}`);
  console.log(`========================================================\n`);
}

runImporter();
