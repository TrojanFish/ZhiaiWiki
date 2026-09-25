import type { StudyItem } from "@/components/StudyCard";

export const ENDOMETRIAL_STUDIES: StudyItem[] = [
  {
    id: "ruby_part1_dostarlimab_2023",
    title: "Dostarlimab for Primary Advanced or Recurrent Endometrial Cancer (RUBY Part 1)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2023,
    patientN: 494,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2302312",
    pubmedId: "36972026",
    url: "https://www.nejm.org/doi/10.1056/NEJMoa2302312",
    keyConclusions: [
      "dMMR/MSI-H 晚期或复发性子宫内膜癌具有划时代意义的里程碑 RCT：在标准紫杉醇+卡铂化疗基础上加用多塔利单抗 (Dostarlimab)，24 个月无进展生存率达到 61.4% (单纯化疗组仅 15.7%)，进展或死亡风险暴跌 72% (HR=0.28)。",
      "全人群 24 个月总生存率由 56.0% 提升至 71.3%，确立了晚期子宫内膜癌分子分型指导下一线免疫联合治疗的全球新标杆。"
    ],
    relevantFactors: ["多塔利单抗", "RUBY研究", "dMMR", "MSI-H", "无进展生存期翻倍"],
    applicableStages: ["III", "IIIA", "IIIB", "IIIC", "IV", "IVA", "IVB"],
    biomarkerDetails: "dMMR (错配修复缺陷) 或 MSI-H (微卫星高度不稳定)",
    interventionArm: "多塔利单抗 + 卡铂/紫杉醇 vs 安慰剂 + 卡铂/紫杉醇",
    riskReduction: "dMMR 人群疾病进展风险骤降 72% (HR=0.28, P<0.001)"
  },
  {
    id: "portec4a_molecular_deescalation_2023",
    title: "Molecular-Integrated Risk Profile to Guide Adjuvant Therapy in Endometrial Cancer (PORTEC-4a)",
    journal: "Lancet Oncology",
    year: 2023,
    patientN: 420,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(23)00243-8",
    pubmedId: "37354937",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(23)00243-8/fulltext",
    keyConclusions: [
      "国际首个根据 FIGO 2023 分子分型指导术后辅助放化疗降阶梯的前瞻性 III 期试验：POLE 超突变 (POLEmut) 患者即使组织学为高级别或深肌层浸润，免除辅助放化疗后 5 年无复发率依然高达 96.8%。",
      "证实分子分型指导能使超过 45% 的早期中高危患者安全免除盆腔放疗，极大保留阴道与肠道功能，避免过度医疗。"
    ],
    relevantFactors: ["PORTEC-4a", "POLEmut", "免除放疗", "FIGO 2023分子分型", "去强化降阶梯"],
    applicableStages: ["I", "IA", "IB", "IAm_POLEmut"],
    biomarkerDetails: "POLE 催化亚基致病突变 / MMRd / NSMP / p53abn 四分法",
    interventionArm: "分子分层指导个体化放化疗 vs 标准常规辅助放疗",
    riskReduction: "POLEmut 患者免除放疗复发率仍极低 (HR=0.14)"
  },
  {
    id: "portec3_adjuvant_chemort_2019",
    title: "Adjuvant Chemoradiotherapy versus Radiotherapy Alone in Women with High-Risk Endometrial Cancer (PORTEC-3)",
    journal: "Lancet Oncology",
    year: 2019,
    patientN: 660,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(19)30395-X",
    pubmedId: "31345626",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(19)30395-X/fulltext",
    keyConclusions: [
      "高危 I~III 期子宫内膜癌里程碑随访：放疗同步顺铂序贯紫杉醇+卡铂化疗，使 5 年总生存率由 76.1% 显著提升至 81.4% (HR=0.70)，无病生存率由 68.6% 提升至 75.5%。",
      "亚组分析表明，p53 异常型 (p53abn) 及子宫浆液性癌患者从强化化疗联合放疗中获益最为突出，5 年生存率绝对提升近 22%。"
    ],
    relevantFactors: ["PORTEC-3", "同步放化疗", "高危III期", "p53异常型", "生存期延长"],
    applicableStages: ["I", "IB", "II", "IIA", "IIB", "III", "IIIC1", "IIIC2"],
    biomarkerDetails: "高危组织学 (浆液性/透明细胞) 或深肌层浸润伴 LVSI 阳性",
    interventionArm: "盆腔体外放疗同步顺铂 + TC 化疗 4 周期 vs 单纯体外放疗",
    riskReduction: "死亡风险降低 30% (HR=0.70, P=0.034)"
  },
  {
    id: "keynote775_lenvatinib_pembro_2022",
    title: "Lenvatinib plus Pembrolizumab for Advanced Endometrial Cancer (KEYNOTE-775 / Study 309)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2022,
    patientN: 827,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2108330",
    pubmedId: "35045221",
    url: "https://www.nejm.org/doi/10.1056/NEJMoa2108330",
    keyConclusions: [
      "针对既往含铂化疗耐药的 pMMR (错配修复正常) 晚期内膜癌患者，仑伐替尼联合帕博利珠单抗中位总生存期从 12.0 个月显著延长至 17.4 个月 (HR=0.68)。",
      "中位无进展生存期由 3.8 个月延长至 6.6 个月，成为全球首个在 pMMR 难治性子宫内膜癌中证实双重获益的免疫靶向联合方案。"
    ],
    relevantFactors: ["KEYNOTE-775", "仑伐替尼+帕博利珠单抗", "pMMR", "耐药挽救", "总生存期提升"],
    applicableStages: ["III", "IV", "IVB"],
    biomarkerDetails: "pMMR (错配修复功能正常) 晚期或复发转移",
    interventionArm: "仑伐替尼 20mg qd + 帕博利珠单抗 200mg q3w vs 医生自选化疗 (多柔比星或紫杉醇)",
    riskReduction: "死亡风险降低 32% (HR=0.68, P<0.001)"
  },
];
