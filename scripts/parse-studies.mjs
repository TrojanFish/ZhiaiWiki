import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const libDir = path.join(__dirname, '..', 'app', 'src', 'lib');

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

function extractStudiesFromFile(filePath, defaultCancer) {
  const content = fs.readFileSync(filePath, 'utf8');
  const studies = [];

  // Remove comments
  const clean = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

  // Extract objects in export const ... = [ ... ]
  // Match each { id: "...", ... }
  // Split by id: "
  const parts = clean.split(/\{\s*id:\s*["']/);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const idMatch = part.match(/^([^"']+)/);
    if (!idMatch) continue;
    const id = idMatch[1];
    if (['STAS', 'CTR', 'VPI', 'GGO', 'TUMOR_SIZE', 'MARGIN', 'HISTOLOGY'].includes(id)) {
      // These are factor IDs in EVIDENCE_FACTORS, not studies
      continue;
    }

    const titleMatch = part.match(/title:\s*["']([^"']+)["']/);
    const journalMatch = part.match(/journal:\s*["']([^"']+)["']/);
    const yearMatch = part.match(/year:\s*(\d+)/);
    const patientNMatch = part.match(/patientN:\s*(\d+)/);
    const studyTypeMatch = part.match(/studyType:\s*["']([^"']+)["']/);
    const evidenceLevelMatch = part.match(/evidenceLevel:\s*(\d+)/);
    const doiMatch = part.match(/doi:\s*["']([^"']+)["']/);
    const pubmedIdMatch = part.match(/pubmedId:\s*["']([^"']+)["']/);
    const urlMatch = part.match(/url:\s*["']([^"']+)["']/);
    const biomarkerMatch = part.match(/biomarkerDetails:\s*["']([^"']+)["']/);
    const interventionMatch = part.match(/interventionArm:\s*["']([^"']+)["']/);
    const riskReductionMatch = part.match(/riskReduction:\s*["']([^"']+)["']/);

    // Extract keyConclusions array
    const conclusions = [];
    const concMatch = part.match(/keyConclusions:\s*\[([\s\S]*?)\]/);
    if (concMatch) {
      const strings = concMatch[1].match(/["']([^"']+)["']/g);
      if (strings) {
        strings.forEach(s => conclusions.push(s.replace(/^["']|["']$/g, '')));
      }
    }

    // Extract relevantFactors array
    const factors = [];
    const factorMatch = part.match(/relevantFactors:\s*\[([\s\S]*?)\]/);
    if (factorMatch) {
      const strings = factorMatch[1].match(/["']([^"']+)["']/g);
      if (strings) {
        strings.forEach(s => factors.push(s.replace(/^["']|["']$/g, '')));
      }
    }

    // Extract applicableStages array
    const stages = [];
    const stageMatch = part.match(/applicableStages:\s*\[([\s\S]*?)\]/);
    if (stageMatch) {
      const strings = stageMatch[1].match(/["']([^"']+)["']/g);
      if (strings) {
        strings.forEach(s => stages.push(s.replace(/^["']|["']$/g, '')));
      }
    }

    if (titleMatch && journalMatch) {
      studies.push({
        id,
        cancerType: defaultCancer,
        title: titleMatch[1],
        journal: journalMatch[1],
        year: yearMatch ? parseInt(yearMatch[1], 10) : 2023,
        patientN: patientNMatch ? parseInt(patientNMatch[1], 10) : 0,
        studyType: studyTypeMatch ? studyTypeMatch[1] : 'rct',
        evidenceLevel: evidenceLevelMatch ? parseInt(evidenceLevelMatch[1], 10) : 5,
        doi: doiMatch ? doiMatch[1] : undefined,
        pubmedId: pubmedIdMatch ? pubmedIdMatch[1] : undefined,
        url: urlMatch ? urlMatch[1] : undefined,
        biomarkerDetails: biomarkerMatch ? biomarkerMatch[1] : undefined,
        interventionArm: interventionMatch ? interventionMatch[1] : undefined,
        riskReduction: riskReductionMatch ? riskReductionMatch[1] : undefined,
        keyConclusions: conclusions,
        relevantFactors: factors,
        applicableStages: stages,
      });
    }
  }

  return studies;
}

const allStudies = [];
const seenIds = new Set();

for (const { file, cancerType } of studyFiles) {
  const filePath = path.join(libDir, file);
  if (!fs.existsSync(filePath)) continue;
  const list = extractStudiesFromFile(filePath, cancerType);
  for (const s of list) {
    if (!seenIds.has(s.id)) {
      seenIds.add(s.id);
      allStudies.push(s);
    }
  }
}

console.log(`Successfully extracted ${allStudies.length} unique landmark studies.`);
fs.writeFileSync(path.join(__dirname, 'all-studies.json'), JSON.stringify(allStudies, null, 2), 'utf8');
console.log(`Saved metadata to scripts/all-studies.json`);
