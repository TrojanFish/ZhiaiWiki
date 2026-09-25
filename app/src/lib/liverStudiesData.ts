import type { StudyItem } from "@/components/StudyCard";

export const LIVER_STUDIES: StudyItem[] = [
  {
    id: "orient_32_2021",
    title: "Sintilimab plus a bevacizumab biosimilar (IBI305) versus sorafenib in first-line treatment for unresectable hepatocellular carcinoma (ORIENT-32)",
    journal: "Lancet Oncology",
    year: 2021,
    patientN: 571,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(21)00252-9",
    pubmedId: "34143970",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(21)00252-9/fulltext",
    keyConclusions: [
      "中国首个自主原研大型 III 期试验：信迪利单抗联合贝伐珠单抗生物类似物 (达伯舒+达攸同) 一线治疗中国不可切除肝癌，使中位总生存期显著优于索拉非尼 (NE vs 10.4 个月, HR=0.57)，死亡风险降低 43%。",
      "中位 PFS 显著延长至 4.6 vs 2.8 个月，树立了中国乙肝背景晚期肝细胞癌一线“双达”治疗新标杆。"
    ],
    relevantFactors: ["信迪利单抗", "贝伐珠单抗", "ORIENT-32", "双达方案", "乙肝肝癌"],
    applicableStages: ["CNLC IIb", "CNLC IIIa", "CNLC IIIb", "IV"],
    biomarkerDetails: "HBV 相关晚期肝细胞癌 / Child-Pugh A级",
    interventionArm: "信迪利单抗 + 贝伐珠单抗类似物 vs 索拉非尼单药",
    riskReduction: "死亡风险显著降低 43% (HR=0.57, P<0.0001)"
  },
  {
    id: "imbrave150_2020",
    title: "Atezolizumab plus Bevacizumab in Unresectable Hepatocellular Carcinoma (IMbrave150)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2020,
    patientN: 501,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1915745",
    pubmedId: "32402160",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1915745",
    keyConclusions: [
      "全球多中心 III 期里程碑试验：阿替利珠单抗联合贝伐珠单抗 (T+A 方案) 一线治疗晚期肝细胞癌，12 个月总生存率高达 67.2% (vs 索拉非尼 54.6%)，死亡风险降低 42% (HR=0.58)。",
      "终结了索拉非尼长达 13 年的单药垄断，奠定了免疫联合抗血管生成靶向在晚期肝癌一线治疗的基石地位。"
    ],
    relevantFactors: ["阿替利珠单抗", "贝伐珠单抗", "IMbrave150", "T+A方案", "一线靶免"],
    applicableStages: ["CNLC IIb", "CNLC IIIa", "CNLC IIIb", "IV"],
    biomarkerDetails: "不可切除肝细胞癌 / 未经系统治疗 / Child-Pugh A级",
    interventionArm: "Atezolizumab + Bevacizumab vs 索拉非尼",
    riskReduction: "死亡风险降低 42% (HR=0.58, P<0.001)"
  },
  {
    id: "reflect_2018",
    title: "Lenvatinib versus sorafenib in first-line treatment of patients with unresectable hepatocellular carcinoma (REFLECT): a randomised phase 3 non-inferiority trial",
    journal: "Lancet",
    year: 2018,
    patientN: 954,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S0140-6736(18)30207-1",
    pubmedId: "29433850",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)30207-1/fulltext",
    keyConclusions: [
      "仑伐替尼 (乐伐替尼) 一线单药对比索拉非尼总生存达到统计学非劣效 (中位 OS 13.6 vs 12.3 个月)，在中国亚组中位 OS 更是突破 15.0 个月。",
      "客观缓解率 (ORR mRECIST 达 40.6% vs 12.4%) 与中位无进展生存期 (PFS 7.4 vs 3.7 个月) 呈现成倍优势，成为肿瘤负荷大或伴血管癌栓患者的高缓解率首选靶向药物。"
    ],
    relevantFactors: ["仑伐替尼", "REFLECT", "高客观缓解率", "门脉癌栓", "TKI靶向"],
    applicableStages: ["CNLC IIa", "CNLC IIb", "CNLC IIIa"],
    biomarkerDetails: "Child-Pugh A级 / 不可切除肝细胞癌",
    interventionArm: "仑伐替尼单药口服 vs 索拉非尼单药口服",
    riskReduction: "PFS 与 ORR 翻倍，OS 达到统计学非劣效"
  },
  {
    id: "zgdh9_donafenib_2021",
    title: "Donafenib versus sorafenib in first-line treatment of patients with advanced hepatocellular carcinoma (ZGDH9)",
    journal: "Lancet Oncology",
    year: 2021,
    patientN: 668,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(21)00216-5",
    pubmedId: "34143969",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(21)00216-5/fulltext",
    keyConclusions: [
      "中国自主研发的多激酶抑制剂多纳非尼 (重水多纳非尼) 在大型 III 期试验中，中位总生存期显著优于索拉非尼 (12.1 vs 10.3 个月，HR=0.83)，死亡风险降低 17%。",
      "≥3 级药物不良事件发生率明显更低，特别是在手足皮肤反应和胃肠道毒性方面表现出更优良的耐受性。"
    ],
    relevantFactors: ["多纳非尼", "ZGDH9", "中国原研单药", "靶向治疗", "低不良反应"],
    applicableStages: ["CNLC IIb", "CNLC IIIa", "CNLC IIIb"],
    biomarkerDetails: "不可切除或转移性肝细胞癌 / Child-Pugh A级",
    interventionArm: "多纳非尼片 0.2g bid vs 索拉非尼片 0.4g bid",
    riskReduction: "死亡风险降低 17% (HR=0.83, P=0.0245)"
  }
];
