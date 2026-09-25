/**
 * 胰腺癌 (Pancreatic Ductal Adenocarcinoma, PDAC) 前瞻性里程碑临床研究与顶刊科研证据库
 * 遵循标准: NEJM · Lancet · JCO · NCCN 2024 一级循证医学依据
 */

import type { StudyItem } from "@/components/StudyCard";

export const PANCREATIC_STUDIES: StudyItem[] = [
  {
    id: "prodige_24_2018",
    title: "FOLFIRINOX or Gemcitabine as Adjuvant Therapy for Pancreatic Cancer (PRODIGE 24/CCTG PA.6)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2018,
    patientN: 493,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1809775",
    pubmedId: "30575490",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1809775",
    keyConclusions: [
      "改良 mFOLFIRINOX 方案作为术后辅助化疗，将局限性胰腺癌根治术后患者的中位总生存期从 35.0 个月提升至 54.4 个月 (HR 0.64, 95% CI 0.48-0.86, P=0.003)。",
      "5 年总生存率达 43.2% vs 吉西他滨单药组的 31.4%，确立了体能状态良好 (ECOG 0-1) 患者术后辅助治疗的全球黄金金标准。"
    ],
    relevantFactors: ["R0切缘", "mFOLFIRINOX", "辅助化疗", "长期生存"],
    applicableStages: ["I", "IA", "IB", "IIA", "IIB", "III"],
    biomarkerDetails: "可切除胰腺导管腺癌根治术后人群",
    interventionArm: "mFOLFIRINOX 方案 (每2周1次，共12周期) vs 吉西他滨单药 (共6周期)",
    riskReduction: "术后死亡风险降低 36% (HR 0.64)",
    cancerType: "pancreatic",
  },
  {
    id: "mpact_trial_2013",
    title: "Increased Survival in Pancreatic Cancer with Nab-Paclitaxel plus Gemcitabine (MPACT)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2013,
    patientN: 861,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1304369",
    pubmedId: "24131140",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1304369",
    keyConclusions: [
      "白蛋白结合型紫杉醇联合吉西他滨 (AG 方案) 显著延长晚期转移性胰腺癌患者中位总生存期 (8.5月 vs 6.7月, HR 0.72, P<0.001)。",
      "1 年总生存率从 22% 显著翻倍提升至 35%，2 年生存率达 9%，成为晚期一线广泛适用化疗基石。"
    ],
    relevantFactors: ["白蛋白紫杉醇", "吉西他滨", "AG方案", "晚期一线"],
    applicableStages: ["IV", "III"],
    biomarkerDetails: "初治转移性胰腺导管腺癌",
    interventionArm: "白蛋白紫杉醇 125mg/m² + 吉西他滨 1000mg/m² (d1,8,15 q4w) vs 吉西他滨单药",
    riskReduction: "晚期死亡风险降低 28% (HR 0.72)",
    cancerType: "pancreatic",
  },
  {
    id: "polo_trial_2019",
    title: "Maintenance Olaparib for Germline BRCA-Mutated Metastatic Pancreatic Cancer (POLO)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2019,
    patientN: 154,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1908639",
    pubmedId: "31157963",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1908639",
    keyConclusions: [
      "携带胚系 BRCA1/2 突变 (gBRCAm) 且一线含铂化疗至少 16 周未进展的转移性胰腺癌患者，奥拉帕利维持治疗使中位 PFS 显著翻倍 (7.4月 vs 3.8月, HR 0.53, P=0.004)。",
      "开启了胰腺癌生物标志物驱动的精准维持治疗先河，确立初诊晚期必须常规检测 BRCA 突变的指南规范。"
    ],
    relevantFactors: ["gBRCA1/2突变", "奥拉帕利", "PARP抑制剂", "无化疗维持"],
    applicableStages: ["IV"],
    biomarkerDetails: "胚系 BRCA1/2 突变阳性",
    interventionArm: "奥拉帕利片 300mg 口服 bid 维持 vs 安慰剂维持",
    riskReduction: "疾病进展或死亡风险降低 47% (HR 0.53)",
    cancerType: "pancreatic",
  },
  {
    id: "preopanc_trial_2022",
    title: "Neoadjuvant Chemoradiotherapy Versus Upfront Surgery for Pancreatic Cancer: Long-Term Results of PREOPANC",
    journal: "Journal of Clinical Oncology (JCO)",
    year: 2022,
    patientN: 246,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1200/JCO.21.02233",
    pubmedId: "35640799",
    url: "https://ascopubs.org/doi/10.1200/JCO.21.02233",
    keyConclusions: [
      "PREOPANC 长期随访证实，新辅助放化疗将可切除及交界可切除胰腺癌患者的 5 年总生存率提升至 20.5% (vs 直接手术组 6.5%, HR 0.73, P=0.025)。",
      "尤其在交界可切除亚组中，新辅助治疗使 R0 根治切除率翻倍提升至 71% (vs 直接手术组 40%)，确立新辅助转化手术的核心地位。"
    ],
    relevantFactors: ["新辅助治疗", "交界可切除", "R0切除率", "降期转化"],
    applicableStages: ["IIA", "IIB", "III"],
    biomarkerDetails: "交界可切除 / 局限进展期胰腺癌",
    interventionArm: "术前新辅助放化疗 (吉西他滨+放疗) + 手术 vs 直接根治手术",
    riskReduction: "长期死亡风险降低 27% (HR 0.73)",
    cancerType: "pancreatic",
  },
  {
    id: "napoli_3_2023",
    title: "NALIRIFOX versus Nab-Paclitaxel and Gemcitabine in Treatment-Naive Metastatic PDAC (NAPOLI 3)",
    journal: "The Lancet",
    year: 2023,
    patientN: 770,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S0140-6736(23)01366-1",
    pubmedId: "37949091",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(23)01366-1/fulltext",
    keyConclusions: [
      "NALIRIFOX 方案（脂质体伊立替康 + 奥沙利铂 + 5-FU/LV）相较于 AG 方案，进一步延长转移性胰腺癌中位总生存期至 11.1 个月 (vs 9.2月, HR 0.83, P=0.04)。",
      "为晚期胰腺癌一线系统化疗增添了全新的一级权威强效方案。"
    ],
    relevantFactors: ["脂质体伊立替康", "NALIRIFOX", "晚期一线", "PFS/OS获益"],
    applicableStages: ["IV"],
    biomarkerDetails: "初治转移性胰腺导管腺癌",
    interventionArm: "NALIRIFOX (脂质体伊立替康+奥沙利铂+5-FU/LV) vs 白蛋白紫杉醇+吉西他滨",
    riskReduction: "总生存期死亡风险降低 17% (HR 0.83)",
    cancerType: "pancreatic",
  },
];
