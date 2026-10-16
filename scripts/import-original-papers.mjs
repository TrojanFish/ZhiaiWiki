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

async function runImporter() {
  if (!fs.existsSync(studiesPath)) {
    console.error('all-studies.json not found!');
    return;
  }

  const studies = JSON.parse(fs.readFileSync(studiesPath, 'utf8'));
  const files = fs.readdirSync(incomingDir).filter(f => f.toLowerCase().endsWith('.pdf'));

  console.log(`\n========================================================`);
  console.log(`ZhiaiWiki 原版研究论文智能导入工具`);
  console.log(`扫描导入目录: ${incomingDir}`);
  console.log(`检测到待导入 PDF 文件数: ${files.length}`);
  console.log(`========================================================\n`);

  if (files.length === 0) {
    console.log(`提示: 目前 ${incomingDir} 目录下暂无待导入的 PDF 文件。`);
    console.log(`您可以将从 NEJM、The Lancet、JCO 等期刊下载的原版 PDF 复制到该目录下，再次运行本命令即可自动匹配归档。\n`);
    return;
  }

  let matchedCount = 0;

  for (const fileName of files) {
    const fullPath = path.join(incomingDir, fileName);
    const content = fs.readFileSync(fullPath);
    const textSample = content.toString('latin1', 0, Math.min(content.length, 100000));

    // Try matching by DOI
    let matchedStudy = null;

    for (const s of studies) {
      if (s.doi && textSample.toLowerCase().includes(s.doi.toLowerCase())) {
        matchedStudy = s;
        break;
      }
      if (s.pubmedId && textSample.includes(s.pubmedId)) {
        matchedStudy = s;
        break;
      }
    }

    // Fallback: match by title keywords or trial name
    if (!matchedStudy) {
      for (const s of studies) {
        // extract trial acronym e.g. JCOG0802, TAILORx, monarchE
        const acronym = s.id.split('_')[0];
        if (acronym.length >= 4 && (textSample.toUpperCase().includes(acronym.toUpperCase()) || fileName.toUpperCase().includes(acronym.toUpperCase()))) {
          matchedStudy = s;
          break;
        }
      }
    }

    if (matchedStudy) {
      const targetFileName = `${matchedStudy.id}.pdf`;
      const targetDest = path.join(targetPapersDir, targetFileName);
      fs.copyFileSync(fullPath, targetDest);
      const sizeMb = (content.length / (1024 * 1024)).toFixed(2);
      console.log(`[成功匹配] ${fileName} -> ${targetFileName} (${sizeMb} MB)`);
      console.log(`           对应研究: [${matchedStudy.journal}] ${matchedStudy.title}\n`);
      matchedCount++;
    } else {
      console.log(`[未匹配] 未能自动识别 ${fileName} 的 DOI/试验代号，请确认是否为全站 95 项研究之一。\n`);
    }
  }

  console.log(`导入完成: 成功匹配并归档 ${matchedCount} / ${files.length} 篇原版学术论文。\n`);
}

runImporter();
