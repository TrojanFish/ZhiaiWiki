const fs = require('fs');
const path = require('path');

// Target directory
const libDir = path.join(__dirname, '..', 'app', 'src', 'lib');

// Study files to parse
const studyFiles = [
  { file: 'evidence-data.ts', cancerType: 'lung' },
  { file: 'breastStudiesData.ts', cancerType: 'breast' },
  { file: 'colorectalStudiesData.ts', cancerType: 'colorectal' },
  { file: 'gastricStudiesData.ts', cancerType: 'gastric' },
  { file: 'liverStudiesData.ts', cancerType: 'liver' },
  { file: 'esophagealStudiesData.ts', cancerType: 'esophageal' },
  { file: 'thyroidStudiesData.ts', cancerType: 'thyroid' },
  { file: 'endometrialStudiesData.ts', cancerType: 'endometrial' },
  { file: 'cervicalStudiesData.ts', cancerType: 'cervical' },
  { file: 'pancreaticStudiesData.ts', cancerType: 'pancreatic' },
];

function extractStudies() {
  const allStudies = [];
  const seenIds = new Set();

  for (const { file, cancerType } of studyFiles) {
    const fullPath = path.join(libDir, file);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, 'utf8');

    // Parse array objects manually or with regex
    // Each object has { id: "...", title: "...", ... }
    const objectRegex = /{\s*id:\s*["']([^"']+)["'][\s\S]*?applicableStages:\s*\[[\s\S]*?\][\s\S]*?}/g;
    
    // Fallback parser if regex doesn't catch all
    const idRegex = /id:\s*["']([^"']+)["']/g;
    let match;
    const ids = [];
    while ((match = idRegex.exec(content)) !== null) {
      if (match[1] !== 'STAS' && match[1] !== 'CTR' && match[1] !== 'GGO' && match[1] !== 'VPI') {
        ids.push(match[1]);
      }
    }

    console.log(`${file} (${cancerType}): detected ${ids.length} potential studies.`);
  }
}

extractStudies();
