# 📥 原版学术论文导入目录 (Original Research Papers Drop-in)

在此目录下放入您通过图书馆、医院内网、CNKI、EndNote、PubMed 或学术数据库下载的**真实期刊原版论文 PDF**。

## 🚀 自动匹配与导入说明：
1. 您可以将下载到的任意原版 PDF 直接放入本目录（文件名随意，如 `nejm_tailorx.pdf`、`JCOG0802.pdf` 等）。
2. 在项目根目录运行匹配脚本：
   ```bash
   node scripts/import-original-papers.mjs
   ```
3. 脚本会自动根据 PDF 内容中的 **DOI**、**PMID** 或 **标题关键词** 智能匹配全站 95 篇临床研究，自动重命名并归档至 `app/public/papers/<studyId>.pdf`。
4. 归档后，全站文献卡片将自动点亮 **「📄 顶刊原版论文全文」** 真实徽章！
