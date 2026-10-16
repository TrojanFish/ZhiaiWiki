import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const studies = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-studies.json'), 'utf8'));
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Export dois.txt
const dois = studies.map(s => s.doi).filter(Boolean);
fs.writeFileSync(path.join(dataDir, 'dois.txt'), dois.join('\n'), 'utf8');

// 2. Export pmids.txt
const pmids = studies.map(s => s.pubmedId).filter(Boolean);
fs.writeFileSync(path.join(dataDir, 'pmids.txt'), pmids.join('\n'), 'utf8');

// 3. Export studies-batch-download.csv
const csvHeader = 'ID,CancerType,Journal,Year,PMID,DOI,Title\n';
const csvRows = studies.map(s => {
  const cleanTitle = `"${(s.title || '').replace(/"/g, '""')}"`;
  const cleanJournal = `"${(s.journal || '').replace(/"/g, '""')}"`;
  return `${s.id},${s.cancerType},${cleanJournal},${s.year},${s.pubmedId || ''},${s.doi || ''},${cleanTitle}`;
});
fs.writeFileSync(path.join(dataDir, 'studies-batch-download.csv'), csvHeader + csvRows.join('\n'), 'utf8');

console.log(`Generated export files in data/:`);
console.log(` - data/dois.txt (${dois.length} DOIs)`);
console.log(` - data/pmids.txt (${pmids.length} PMIDs)`);
console.log(` - data/studies-batch-download.csv (${studies.length} records)`);
