<div align="center">
  <img src="https://raw.githubusercontent.com/TrojanFish/ZhiaiWiki/main/app/public/logo.png" width="90" alt="ZhiaiWiki Logo">
  <h1>ZhiaiWiki</h1>
  <p><strong>Multi-Cancer Evidence-Based Oncology Knowledge Platform & Clinical Navigation OS</strong></p>
  <p><em>Covering 12 major solid tumors, grounded in peer-reviewed clinical literature, AJCC/IASLC guidelines, and multi-center real-world prospective cohorts.</em></p>

  <p>
    <a href="README.md"><strong>English Documentation</strong></a> |
    <a href="README.zh-CN.md"><strong>中文技术文档</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2.12-blue?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Vitest-32_Suites_466_Passed-success?style=flat-square&logo=vitest" alt="Vitest" />
    <img src="https://img.shields.io/badge/Cancer_Types-12_Major_Tumors-rose?style=flat-square" alt="12 Cancers" />
    <img src="https://img.shields.io/badge/PubMed-Europe_PMC_API-blueviolet?style=flat-square" alt="PubMed API" />
    <img src="https://img.shields.io/badge/PostgreSQL-16_pgvector-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Nginx-SSE_Streaming-009639?style=flat-square&logo=nginx" alt="Nginx" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/PIPL-Privacy_Compliant-10b981?style=flat-square" alt="PIPL" />
    <img src="https://img.shields.io/badge/Docker-Production_Ready-2496ED?style=flat-square&logo=docker" alt="Docker" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  </p>
</div>

---

## 🌟 Core Vision & Medical Principles

ZhiaiWiki bridges the communication gap between complex oncology literature and patients by strictly adhering to the **"Evidence-First, AI-Second"** standard:

1. **Zero Hallucinations & Deterministic Clinical Rules**: Core staging, hazard ratios, and clinical paths are hardcoded. Large Language Models (LLMs) are strictly restricted from making arbitrary prognostic guesses or writing prescriptions.
2. **100% Peer-Reviewed Traceability**: Direct integration with official Europe PMC / MEDLINE / PubMed databases. Every Hazard Ratio (HR) and 5-year Recurrence-Free Survival (RFS) rate is directly linked to landmark clinical trials (Lancet, JCO, JTO, NEJM, Chest) with active DOI and PubMed hyperlinks.
3. **Comprehensive Coverage across 12 Solid Tumors**: Seamlessly handles lung, breast, colon, rectal, gastric, liver, esophageal, colorectal comprehensive, thyroid, endometrial, cervical, and pancreatic cancers.
4. **Informed Consent & Clinical Collaboration**: Generates structured consultation pocket cards and A4 printable checklists empowering patients and families to communicate effectively with their attending oncologists.

---

## ✨ Key Features & Architecture

### 1. 🧬 12 Solid Tumor Plugin Staging & Reasoning Engines (Cancer Registry)
- **Covered Solid Tumors**: 🫁 Lung · 🎀 Breast · 🎗️ Colon · 🎯 Rectal · 🥣 Gastric · 🩺 Liver · 🥤 Esophageal · 🧬 Colorectal Comprehensive · 🦋 Thyroid · 🌸 Endometrial · 🌺 Cervical · 🛡️ Pancreatic.
- **Deterministic Guideline Engine**: Integrates AJCC 8th/9th edition TNM, CSCO, and NCCN clinical guidelines (e.g., mGGO solid component calculation, STAS/VPI risk factors, TNBC/HER2 molecular subtypes, MRF/CRM/EMVI rectal staging, ATA thyroid risk stratification, FIGO 2023 gynecologic molecular classifications, and NCCN pancreatic resectability criteria).
- **Multimodal AI Pathology Parser**: Extracts TNM staging, histological grades, depth of invasion, and driver mutations via photo or text.

### 2. 🔬 Admin Evidence Studio & Official Database Integration
- **Admin Studio Access**: `/admin`, equipped with brute-force defense (sliding-window rate limiting) and dual-channel HMAC-SHA256 session authentication.
- **PubMed / Europe PMC Integration**: Connects to the European Bioinformatics Institute (EMBL-EBI) open scientific REST API to retrieve MEDLINE/PubMed articles by PMID or DOI without requiring API keys.
- **Multimodal PDF Article Parser**: Directly upload PDF papers from Lancet or JCO; Gemini 2.5 Flash automatically extracts 17 structured endpoints ($n$, HR, 95% CI, 5-yr RFS, biomarker targets, and control arms).
- **Human-in-the-Loop Verification**: Enables clinical specialists to review and fine-tune extracted evidence before committing it to the PostgreSQL database.
- **Graceful Offline Fallback**: Operates smoothly in demonstration mode if the database is temporarily offline during local frontend testing.

### 3. 💊 Oncology Drug-Drug Interaction (DDI) Checker
- Evaluates over 100 oncology targeted therapies, ADCs, chemotherapies, and immune checkpoint inhibitors (e.g., Osimertinib, Aumolitinib, Trastuzumab, Pembrolizumab, PARP inhibitors, mFOLFIRINOX).
- Prevents adverse drug reactions with proton-pump inhibitors (PPIs), CYP3A4 inducers/inhibitors, anticoagulants, and herbal remedies.

### 4. 📚 Visual Encyclopedia (Wiki) & Social Infographics
- **40+ Deep Clinical Visual Guides**: Interactive SVG/Canvas diagrams explaining mediastinal lymph node map, pancreatic resectability quad-assessment, ground-glass nodule (GGO) evolution, CT windowing, EBUS-TBNA navigation, and MRD-ctDNA liquid biopsy monitoring.
- **Cross-Cancer Command Palette (⌘K)**: Multi-cancer deep search with zone-aware preset recommendations and instant full-text index penetration.
- **Consultation Cheat-sheet Sync**: One-click bookmarking of Wiki questions directly into the Doctor Consultation Card.
- **2x Retina WeChat Poster Generator**: Client-side offscreen rasterization engine producing full-length, unclipped shareable infographics with solid/RGBA fallbacks.

### 5. 📱 Mobile & Omnichannel User Experience (Apple HIG Standards)
- **Minimalist 32px Circular Mobile Action Group**: Unified 32×32px circular buttons for Search, User Avatar, Coffee Sponsorship, and Hamburger Menu on mobile viewports, eliminating noisy text labels.
- **Streamlined Navigation Drawer**: Removed redundant login/register card frames from the mobile slide-over drawer, focusing cleanly on core site navigation and direct profile access.
- **Hardware Safe-Area Clearance**: Next.js 16 SSR hydration safety with zero layout shift, fully accommodating iOS home indicators and display cutouts.

### 6. ❤️ Public Welfare & Standardized Subpages
- Standardized cross-site subpages: `About Us` (`/about`), `Love Relay` (`/love-relay`), `Terms & Disclaimer` (`/terms`), `Privacy Policy` (`/privacy`).
- **WeChat Donation Blessing Wall**: Supports manual receipt verification using the last 4 digits of WeChat transaction IDs, lighting up verified supporter badges. Persisted via offline JSON storage (`data/love_relay.json`).

### 7. 🌐 Internationalization & Privacy Compliance
- **Simplified / Traditional Chinese Conversion (`LangSwitch`)**: Client-side OpenCC engine seamlessly adapting the entire DOM, AI streams, and knowledge graphs for international Chinese communities.
- **Data Privacy (PIPL / HIPAA Compliant) & Right-to-be-Forgotten**: Automatically masks ID numbers, phone numbers, and hospital IDs; supports one-click permanent profile destruction.
- **Production-Tuned Nginx SSE Streaming**: Restores client IP with `CF-Connecting-IP`, disables buffering for smooth typewriter SSE streaming, and sets 1-year immutable caching for static assets.

---

## 🧪 Automated Testing & Quality Assurance

Run the comprehensive unit test suite covering clinical algorithms across 12 cancer types, DDI safety, and security:

```bash
cd app
npm run test:unit
```

```text
 ✓ src/__tests__/staging.test.ts                        (38 tests) - AJCC/IASLC 9th TNM Lung Staging
 ✓ src/__tests__/breastStaging.test.ts                  (43 tests) - Breast Cancer Molecular Subtypes
 ✓ src/__tests__/colorectalStaging.test.ts              (30 tests) - Colorectal Cancer TNM & Pathology
 ✓ src/__tests__/gastricStaging.test.ts                 (28 tests) - Gastric Depth of Invasion & Staging
 ✓ src/__tests__/liverStaging.test.ts                   (32 tests) - Primary Liver Cancer CNLC Staging
 ✓ src/__tests__/esophagealStaging.test.ts              (28 tests) - Esophageal Anatomical Staging
 ✓ src/__tests__/thyroidStaging.test.ts                 (20 tests) - Thyroid ATA Risk Stratification
 ✓ src/__tests__/pancreaticStaging.test.ts              (14 tests) - Pancreatic Cancer Resectability & Staging
 ✓ src/__tests__/rectalStaging.test.ts                  (12 tests) - Rectal Cancer CRM/EMVI Staging
 ✓ src/__tests__/colonStaging.test.ts                   (11 tests) - Colon Cancer AJCC 9th TNM Staging
 ✓ src/__tests__/endometrialStaging.test.ts             (11 tests) - Endometrial Cancer FIGO 2023 Staging
 ✓ src/__tests__/cervicalStaging.test.ts                (11 tests) - Cervical Cancer FIGO 2018 Staging
 ✓ src/__tests__/clinicalCohortsStratification.test.ts  (21 tests) - Real-World Cohort Prognostic Stratification
 ✓ src/__tests__/gynecologicDdi.test.ts                 (17 tests) - Gynecologic Oncology DDI
 ✓ src/__tests__/colorectalDdi.test.ts                  (15 tests) - Colorectal Target & Chemo DDI
 ✓ src/__tests__/thyroidDdi.test.ts                     (12 tests) - Thyroid Targeted Therapy DDI
 ✓ src/__tests__/gastricDdi.test.ts                     (11 tests) - Gastric Target & Immuno DDI
 ✓ src/__tests__/breastDdi.test.ts                      (11 tests) - Breast Endocrine & Targeted DDI
 ✓ src/__tests__/liverDdi.test.ts                       (5 tests)  - Liver Targeted & Immuno DDI
 ✓ src/__tests__/esophagealDdi.test.ts                  (5 tests)  - Esophageal Immuno & Chemo DDI
 ✓ src/__tests__/wikiMultiCancer.test.ts                (14 tests) - 12 Cancer Types Wiki Retrieval
 ✓ src/__tests__/mdtWorkflow.test.ts                    (10 tests) - Multidisciplinary Consultation Simulation
 ✓ src/__tests__/vdtCalculator.test.ts                  (10 tests) - Volume Doubling Time (VDT) Algorithm
 ✓ src/__tests__/cancerRegistry.test.ts                 (9 tests)  - 12 Cancer Plugin Registry Center
 ✓ src/__tests__/adminAuth.test.ts                      (8 tests)  - Admin Studio HMAC Auth Security
 ✓ src/__tests__/userAuth.test.ts                       (6 tests)  - User PBKDF2 Password Hashing & Cookie Security
 ✓ src/__tests__/securityAccessControl.test.ts          (6 tests)  - IDOR Prevention & PII Masking
 ✓ src/__tests__/tumorMarkers.test.ts                   (6 tests)  - Clinical Tumor Marker Interpretation
 ✓ src/__tests__/clinicalErrors.test.ts                 (6 tests)  - Clinical Boundary Defense & Error Handling
 ✓ src/__tests__/profileStorage.test.ts                 (6 tests)  - Multi-Cancer Profile Isolation & Storage
 ✓ src/__tests__/multiCancerProfileApi.test.ts          (4 tests)  - Multi-Cancer Profile End-to-End API
 ✓ src/__tests__/ddi.test.ts                            (6 tests)  - Core DDI Pharmacology Conflict Checker
 ... (Total of 32 test suites)

 Test Files  32 passed (32)
      Tests  466 passed (466)
   Duration  40.93s
```

---

## 🐳 VPS Production Deployment Runbook

### 1. Server Setup (Ubuntu / Debian / CentOS)
SSH into your Linux VPS and install Docker & Docker Compose:

```bash
sudo apt update && sudo apt install -y git curl docker.io docker-compose-v2
sudo systemctl enable --now docker
```

### 2. Firewall & Port Rules
Ensure the following ports are open in your cloud firewall:
* **`80`** (HTTP) & **`443`** (HTTPS) - Production Nginx Reverse Proxy Gateway

### 3. Clone Repository
```bash
git clone https://github.com/TrojanFish/ZhiaiWiki.git
cd ZhiaiWiki
```

### 4. Configure Production Environment Variables (`.env`)
```bash
cp .env.example .env
nano .env
```
Fill in the parameters:
```env
# Required: Google Gemini API Key for multimodal parsing and report generation
GEMINI_API_KEY="AIzaSyYourActualApiKeyHere"

# Required: Production admin password (must be strong)
ADMIN_PASSWORD="YourStrongAdminPassword2026!"

# Required: Production database password
POSTGRES_PASSWORD="YourStrongDbPassword2026!"

# Canonical Public URL
NEXT_PUBLIC_APP_URL="https://zhiaiwiki.org"
```

### 5. Launch Production Cluster
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
> 💡 **Architecture Note**: This command provisions **PostgreSQL 16 Database**, **Next.js 16 Web Application**, and **Nginx Reverse Proxy**, with persistent volumes for data storage and automatic Prisma schema initialization.

### 6. Verify Health Status
```bash
# Check container statuses (should show 'Up healthy')
docker compose -f docker-compose.prod.yml ps

# Test production health probe endpoint
curl http://localhost/api/health
```
Access **`http://<YOUR_VPS_PUBLIC_IP>`** to start using ZhiaiWiki!

---

## 💻 Local Development

```bash
# 1. Enter the app directory
cd app

# 2. Install dependencies & start the dev server
npm install
npm run dev

# 3. Run automated tests
npm run test:unit
```
* Patient Portal: [http://localhost:3000](http://localhost:3000)
* Admin Evidence Studio: [http://localhost:3000/admin](http://localhost:3000/admin) (Default testing credentials available with one-click autofill: `admin` / `ZhiaiWiki2026!`)

---

## 🛡️ Clinical Disclaimer

1. ZhiaiWiki strictly adheres to **AJCC 8th/9th Edition** TNM staging criteria and **CSCO / NCCN / ESMO** clinical guidelines.
2. This platform is designed as an **evidence-based scientific retrieval and patient-physician communication aid**; it **does NOT provide individualized medical diagnoses or prescription directives**.
3. All therapeutic choices, surgical selections, adjuvant chemotherapy protocols, and follow-up intervals must be made in consultation with qualified attending physicians.

---

## 📝 License
Licensed under the [MIT License](LICENSE).
