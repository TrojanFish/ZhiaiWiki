import type { StudyItem } from "@/components/StudyCard";

export const ESOPHAGEAL_STUDIES: StudyItem[] = [
  {
    id: "neocrtec5010_2018",
    title: "Neoadjuvant Chemoradiotherapy Followed by Surgery Versus Surgery Alone for Locally Advanced Squamous Cell Carcinoma of the Esophagus (NEOCRTEC5010)",
    journal: "Journal of Clinical Oncology (JCO)",
    year: 2018,
    patientN: 451,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1200/JCO.2017.77.5841",
    pubmedId: "29924685",
    url: "https://ascopubs.org/doi/10.1200/JCO.2017.77.5841",
    keyConclusions: [
      "中国首个前瞻性多中心 III 期新辅助放化疗试验：长春瑞滨+顺铂联合 40Gy 放疗术前新辅助治疗胸段可切除食管鳞癌，中位 OS 突破 100.1 个月 (单手术组 66.5 个月，HR=0.71)。",
      "病理完全缓解率 (pCR) 高达 43.2%，且并未增加围术期手术死亡率，一举确立中国局部进展期食管鳞癌新辅助放化疗标准治疗规范。"
    ],
    relevantFactors: ["NEOCRTEC5010", "新辅助放化疗", "pCR 43%", "长春瑞滨顺铂", "食管鳞癌"],
    applicableStages: ["IIA", "IIB", "IIIA", "IIIB"],
    biomarkerDetails: "潜在可切除局部进展期胸段食管鳞癌 (cT1-4N1-2M0)",
    interventionArm: "术前新辅助放化疗 (40Gy+顺铂/长春瑞滨) + 手术 vs 单纯根治性手术",
    riskReduction: "死亡风险降低 29% (HR=0.71, P=0.001)"
  },
  {
    id: "cross_2012",
    title: "Preoperative Chemoradiotherapy for Esophageal or Junctional Cancer (CROSS)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2012,
    patientN: 368,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1112088",
    pubmedId: "22646630",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1112088",
    keyConclusions: [
      "国际里程碑试验：每周紫杉醇+卡铂联合 41.4Gy 同步放疗术前新辅助治疗，中位总生存期从 24.0 个月翻倍至 49.4 个月 (鳞癌亚组达 81.6 个月)。",
      "长期 10 年随访证实新辅助放化疗在局部控制和长期总生存方面获益极其持久稳定。"
    ],
    relevantFactors: ["CROSS方案", "紫杉醇卡铂", "新辅助同步放化疗", "10年随访"],
    applicableStages: ["II", "III"],
    biomarkerDetails: "局部进展期 cT1N1M0 或 cT2-3N0-1M0 食管癌",
    interventionArm: "新辅助放化疗 (41.4Gy+卡铂/紫杉醇) + 手术 vs 单纯手术",
    riskReduction: "长期死亡风险降低 34% (HR=0.66, P=0.003)"
  },
  {
    id: "escort_1st_2021",
    title: "Effect of Camrelizumab vs Placebo Added to Chemotherapy on Survival and Progression-Free Survival in Patients with Advanced or Metastatic Esophageal Squamous Cell Carcinoma (ESCORT-1st)",
    journal: "JAMA",
    year: 2021,
    patientN: 596,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1001/jama.2021.16836",
    pubmedId: "34519799",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2784157",
    keyConclusions: [
      "中国原研 PD-1 单抗卡瑞利珠单抗联合紫杉醇+顺铂一线治疗晚期食管鳞癌，中位 OS 显著延长至 15.3 个月 (vs 安慰剂化疗组 12.0 个月，HR=0.70)，死亡风险降低 30%。",
      "中位 PFS 显著提高至 6.9 vs 5.6 个月，ORR 提升至 72.1%，成为中国 CSCO 食管癌指南一线首选 I 级推荐。"
    ],
    relevantFactors: ["卡瑞利珠单抗", "ESCORT-1st", "一线免疫联合", "高有效率72%", "食管鳞癌"],
    applicableStages: ["IIIB", "IVA", "IVB"],
    biomarkerDetails: "未经系统治疗的局部晚期或转移性食管鳞癌",
    interventionArm: "卡瑞利珠单抗 + 紫杉醇/顺铂 vs 安慰剂 + 紫杉醇/顺铂",
    riskReduction: "死亡风险降低 30% (HR=0.70, P<0.001)"
  },
  {
    id: "rationale_306_2023",
    title: "Tislelizumab plus chemotherapy versus placebo plus chemotherapy as first-line treatment for advanced or metastatic oesophageal squamous cell carcinoma (RATIONALE-306)",
    journal: "Lancet Oncology",
    year: 2023,
    patientN: 649,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(23)00108-2",
    pubmedId: "37086737",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(23)00108-2/fulltext",
    keyConclusions: [
      "全球多中心 III 期试验：替雷利珠单抗联合研究者选择的含铂双药化疗一线治疗晚期 ESCC，中位 OS 突破至 17.2 个月 (vs 化疗组 10.6 个月，HR=0.66)，死亡风险降低 34%。",
      "无论 PD-L1 表达状态高低，全人群均呈现稳健的生存获益，进一步巩固了免疫治疗在食管鳞癌中的基石地位。"
    ],
    relevantFactors: ["替雷利珠单抗", "RATIONALE-306", "中位OS 17.2月", "全人群获益"],
    applicableStages: ["III", "IV"],
    biomarkerDetails: "未经治疗的晚期/不可切除食管鳞癌",
    interventionArm: "Tislelizumab + 化疗 (氟尿嘧啶/紫杉醇+顺铂) vs 安慰剂 + 化疗",
    riskReduction: "死亡风险显著降低 34% (HR=0.66, P<0.0001)"
  }
];
