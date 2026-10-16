const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'app', 'src', 'lib');
const files = [
  'evidence-data.ts',
  'breastStudiesData.ts',
  'colorectalStudiesData.ts',
  'gastricStudiesData.ts',
  'liverStudiesData.ts',
  'esophagealStudiesData.ts',
  'thyroidStudiesData.ts',
  'endometrialStudiesData.ts',
  'cervicalStudiesData.ts',
  'pancreaticStudiesData.ts'
];

const all = [];

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');

  // Match study objects: id, title, journal, year, doi, pubmedId
  // We can do a simple block extraction or regex
  const regex = /id:\s*["']([^"']+)["'],\s*title:\s*["']([^"']+)["'],\s*journal:\s*["']([^"']+)["'],\s*year:\s*(\d+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    all.push({
      file,
      id: match[1],
      title: match[2],
      journal: match[3],
      year: parseInt(match[4]),
    });
  }
}

console.log('Extracted studies count:', all.length);
console.log(JSON.stringify(all, null, 2));
