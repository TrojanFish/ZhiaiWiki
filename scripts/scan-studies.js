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

let total = 0;
const allStudies = [];

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');

  // Match study blocks or study entries
  const idMatches = [...content.matchAll(/id:\s*["']([^"']+)["']/g)];
  console.log(`${file}: found ${idMatches.length} id declarations`);
  total += idMatches.length;
}

console.log(`Total IDs found across files: ${total}`);
