import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const studies = JSON.parse(fs.readFileSync(path.join(__dirname, 'all-studies.json'), 'utf8'));

// Test if any DOI has an accessible Open Access URL on Unpaywall
async function checkOa() {
  const oaResults = [];
  console.log(`Checking Open Access availability for ${studies.length} studies...`);

  // Test first 15 studies
  for (let i = 0; i < Math.min(studies.length, 15); i++) {
    const s = studies[i];
    if (!s.doi) continue;
    try {
      const url = `https://api.unpaywall.org/v2/${encodeURIComponent(s.doi)}?email=evidence@zhiaiwiki.org`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.is_oa && data.best_oa_location?.url_for_pdf) {
          console.log(`[OA FOUND] ${s.id} (${s.journal}): ${data.best_oa_location.url_for_pdf}`);
          oaResults.push({ id: s.id, pdfUrl: data.best_oa_location.url_for_pdf, host: data.best_oa_location.host_type });
        } else {
          console.log(`[PAYWALLED] ${s.id} (${s.journal}): ${s.doi}`);
        }
      }
    } catch (e) {
      // ignore
    }
    // small pause
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nFound ${oaResults.length} Open Access PDF links in sample.`);
}

checkOa();
