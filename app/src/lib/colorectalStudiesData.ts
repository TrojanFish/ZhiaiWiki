import type { StudyItem } from "@/components/StudyCard";

export const COLORECTAL_STUDIES: StudyItem[] = [
  {
    id: "idea_collaboration_2018",
    title: "Duration of Adjuvant Chemotherapy for Stage III Colon Cancer (IDEA Collaboration)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2018,
    patientN: 12834,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1713709",
    pubmedId: "29590608",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1713709",
    keyConclusions: [
      "全球 6 项前瞻 RCT 联合分析证实：对于低危 III 期 (T1-3 N1) 结肠癌患者，3 个月 CAPOX 辅助化疗疗效完全非劣于 6 个月（3年 DFS 83.1% vs 83.3%）。",
      "3 个月方案将重度蓄积性外周神经毒性发生率从 16% 断崖式降至 3%，彻底确立了早期结肠癌辅助化疗「减毒增效、精准降阶梯」的全球临床指南新基准。"
    ],
    relevantFactors: ["IDEA试验", "CAPOX", "3个月减毒", "III期低危", "神经毒性规避"],
    applicableStages: ["III", "IIIA", "IIIB"],
    biomarkerDetails: "Stage III / T1-3 N1 (低危亚群)",
    interventionArm: "3个月 CAPOX/FOLFOX vs 6个月 CAPOX/FOLFOX",
    riskReduction: "低危组非劣效性确立 (3度神经毒性下降 81%)"
  },
  {
    id: "mosaic_2004",
    title: "Oxaliplatin, Fluorouracil, and Leucovorin as Adjuvant Treatment for Colon Cancer (MOSAIC)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2004,
    patientN: 2246,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa032709",
    pubmedId: "15175436",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa032709",
    keyConclusions: [
      "在经典 5-FU/LV 方案基础上加用奥沙利铂 (FOLFOX4)，使 III 期结肠癌术后复发风险显著降低 23% (HR=0.77)。",
      "奠定了以奥沙利铂为核心的辅助联合化疗国际黄金金标准地位，是结直肠癌辅助治疗发展史上的里程碑基石。"
    ],
    relevantFactors: ["MOSAIC", "FOLFOX", "奥沙利铂", "III期辅助化疗"],
    applicableStages: ["IIB", "IIC", "IIIA", "IIIB", "IIIC"],
    biomarkerDetails: "II 期高危或 III 期切除术后",
    interventionArm: "FOLFOX4 (含奥沙利铂) vs LV5FU2 (单用氟尿嘧啶)",
    riskReduction: "-23% 复发或死亡风险 (HR=0.77, P=0.002)"
  },
  {
    id: "keynote177_2020",
    title: "Pembrolizumab in Microsatellite-Instability-High Advanced Colorectal Cancer (KEYNOTE-177)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2020,
    patientN: 307,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2020694",
    pubmedId: "33264544",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2020694",
    keyConclusions: [
      "针对 MSI-H / dMMR 转移性结直肠癌患者，一线帕博利珠单抗单药免疫治疗对比标准双药化疗联合靶向，中位 PFS 翻倍 (16.5 个月 vs 8.2 个月)。",
      "3 级以上严重不良反应发生率大幅降低 (22% vs 66%)，全面开启了晚期结直肠癌去化疗、单药免疫一线一线治疗的新纪元。"
    ],
    relevantFactors: ["KEYNOTE-177", "MSI-H", "dMMR", "帕博利珠单抗", "去化疗免疫单药"],
    applicableStages: ["IV", "IVA", "IVB", "IVC"],
    biomarkerDetails: "MSI-H / dMMR 错配修复缺陷转移性结直肠癌",
    interventionArm: "帕博利珠单抗 200mg Q3W vs 临床医生选择标准一线化疗±靶向",
    riskReduction: "-40% 疾病进展或死亡风险 (HR=0.60, P=0.0002)"
  },
  {
    id: "calgb_swog80405_2017",
    title: "Effect of First-Line Chemotherapy Combined with Cetuximab or Bevacizumab on Overall Survival in Patients with KRAS Wild-Type mCRC (CALGB/SWOG 80405)",
    journal: "JAMA",
    year: 2017,
    patientN: 2334,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1001/jama.2017.7105",
    pubmedId: "28632865",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2633215",
    keyConclusions: [
      "大型前瞻临床试验确立了结直肠癌「原发部位左右半 (Sidedness)」的巨大生物学差异：左半结肠癌患者接受抗 EGFR 西妥昔单抗中位生存期显著长达 36.0 个月（vs 贝伐珠单抗 31.4 个月）。",
      "彻底确立了临床指南关于「左半+RAS野生型优先西妥昔单抗，右半优先贝伐珠单抗」的精准用药分型准则。"
    ],
    relevantFactors: ["CALGB 80405", "左右半结肠", "Sidedness", "西妥昔单抗", "贝伐珠单抗"],
    applicableStages: ["IV", "IVA", "IVB", "IVC"],
    biomarkerDetails: "KRAS/NRAS 外显子 2/3/4 野生型",
    interventionArm: "FOLFIRI/mFOLFOX6 + 西妥昔单抗 vs + 贝伐珠单抗",
    riskReduction: "左半野生型西妥昔单抗中位 OS 突破 36 个月"
  },
  {
    id: "fire3_2014",
    title: "FOLFIRI plus cetuximab versus FOLFIRI plus bevacizumab as first-line treatment for patients with metastatic colorectal cancer (FIRE-3)",
    journal: "The Lancet Oncology",
    year: 2014,
    patientN: 592,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(14)70330-4",
    pubmedId: "25088940",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(14)70330-4/fulltext",
    keyConclusions: [
      "在全 RAS 野生型亚组中，一线 FOLFIRI 联合西妥昔单抗的中位总生存期比联合贝伐珠单抗显著延长近 8 个月 (33.1 个月 vs 25.0 个月，HR=0.70)。",
      "早期深度退缩 (ETS) 与肿瘤退缩深度 (DpR) 证实抗 EGFR 药物能带来更迅速的病灶体积缩小，显著提升潜在肝转移转化根治切除机会。"
    ],
    relevantFactors: ["FIRE-3", "全RAS野生型", "ETS早期深度退缩", "转化治疗"],
    applicableStages: ["IV", "IVA", "IVB"],
    biomarkerDetails: "全 RAS 野生型 (KRAS/NRAS exon 2, 3, 4)",
    interventionArm: "FOLFIRI + 西妥昔单抗 vs FOLFIRI + 贝伐珠单抗",
    riskReduction: "-30% 死亡风险 (HR=0.70, 中位OS延长 8.1 个月)"
  },
  {
    id: "beacon_crc_2019",
    title: "Encorafenib, Binimetinib, and Cetuximab in BRAF V600E-Mutated Colorectal Cancer (BEACON CRC)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2019,
    patientN: 665,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1908077",
    pubmedId: "31566309",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1908077",
    keyConclusions: [
      "既往预后极差、化疗耐药的 BRAF V600E 突变转移性结直肠癌患者，恩考芬尼联合西妥昔单抗双靶方案将中位总生存期几乎翻倍 (9.3 个月 vs 5.9 个月，HR=0.60)。",
      "客观缓解率 (ORR) 提升至 20%（标准对照化疗仅 2%），成为全球首个特异性攻克 BRAF 突变难治性肠癌的无化疗靶向金标准方案。"
    ],
    relevantFactors: ["BEACON CRC", "BRAF V600E", "恩考芬尼", "西妥昔单抗", "难治靶向突破"],
    applicableStages: ["IV", "IVA", "IVB", "IVC"],
    biomarkerDetails: "BRAF V600E 突变 mCRC",
    interventionArm: "恩考芬尼 + 西妥昔单抗 (±比美替尼) vs 临床医生标准对照化疗",
    riskReduction: "-40% 死亡风险 (HR=0.60, P<0.001)"
  },
  {
    id: "fresco2_2023",
    title: "Fruquintinib versus placebo in patients with refractory metastatic colorectal cancer (FRESCO-2)",
    journal: "The Lancet",
    year: 2023,
    patientN: 691,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S0140-6736(23)00226-5",
    pubmedId: "37075782",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(23)00226-5/fulltext",
    keyConclusions: [
      "中国自主原研强效选择性口服 VEGFR 抑制剂呋喹替尼，在经历多线既往重度治疗耐药的全球多中心 mCRC 患者中，使中位总生存期延长至 7.4 个月（安慰剂组 4.8 个月，HR=0.66）。",
      "继中国 FRESCO 研究之后，FRESCO-2 国际临床试验使中国原创抗肿瘤创新药成功获得美国 FDA 与欧洲 EMA 全面批准走向世界。"
    ],
    relevantFactors: ["FRESCO-2", "呋喹替尼", "中国原研", "晚期三线", "高选择性VEGFR"],
    applicableStages: ["IV", "IVA", "IVB", "IVC"],
    biomarkerDetails: "晚期化疗及抗血管/EGFR耐药后难治性 mCRC",
    interventionArm: "口服呋喹替尼 5mg QD (连服21天停7天) + 最佳支持 vs 安慰剂",
    riskReduction: "-34% 死亡风险 (HR=0.66, P<0.0001)"
  },
  {
    id: "rapido_2021",
    title: "Short-course radiotherapy followed by chemotherapy before total mesorectal excision (TME) in locally advanced rectal cancer (RAPIDO)",
    journal: "The Lancet Oncology",
    year: 2021,
    patientN: 920,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(20)30555-6",
    pubmedId: "33301740",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(20)30555-6/fulltext",
    keyConclusions: [
      "短程放疗 (5×5Gy) 紧接着序贯强化 CAPOX 全程新辅助化疗 (TNT) 再行根治手术，病理完全缓解率 (pCR) 达到惊人的 28.4%（传统长程放化疗仅 14.3%，近乎翻倍）。",
      "显著将 3 年疾病治疗失败率 (DrTF) 从 30.4% 降低至 23.7%，彻底树立了局部晚期直肠癌保肛降期与远期防复发的新标杆。"
    ],
    relevantFactors: ["RAPIDO", "直肠癌", "TNT全程新辅助", "短程放疗", "pCR完全缓解"],
    applicableStages: ["IIB", "IIC", "IIIA", "IIIB", "IIIC"],
    biomarkerDetails: "局部晚期直肠癌 (cT4 或 cN2 或 CRM受累 或 EMVI+)",
    interventionArm: "短程放疗 (5×5Gy) + 6周期 CAPOX (TNT) vs 传统术前长程同步放化疗",
    riskReduction: "pCR 病理完全缓解率翻倍 (28.4% vs 14.3%)"
  },
  {
    id: "prospect_2023",
    title: "Neoadjuvant Chemotherapy with FOLFOX and Selectively Omission of Radiotherapy in Locally Advanced Rectal Cancer (PROSPECT)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2023,
    patientN: 1128,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2303269",
    pubmedId: "37272534",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2303269",
    keyConclusions: [
      "对于具备保肛条件的局部晚期直肠癌，新辅助 FOLFOX 化疗在病灶退缩 ≥20% 时可安全豁免盆腔骨盆放疗，5 年无病生存率 (DFS) 完全非劣于传统放化疗（80.8% vs 78.6%）。",
      "成功避免了盆腔放疗引起的严重生殖性腺破坏、放射性直肠炎及长期膀胱肠道排便功能障碍，极大改善了中青年直肠癌患者长期生活质量。"
    ],
    relevantFactors: ["PROSPECT", "直肠癌", "放疗豁免", "功能保护", "FOLFOX新辅助"],
    applicableStages: ["IIA", "IIB", "IIIA", "IIIB"],
    biomarkerDetails: "候选保肛手术的中高位局部晚期直肠癌 (T2-T3, 任何N)",
    interventionArm: "新辅助 FOLFOX 依退缩选择性豁免放疗 vs 术前常规氟尿嘧啶放化疗",
    riskReduction: "5年 DFS 确立非劣效性 (HR=0.92, 保护排便控便与生育功能)"
  },
  {
    id: "niche2_2022",
    title: "Neoadjuvant immune checkpoint inhibition in locally advanced MMR-deficient colon cancer (NICHE-2)",
    journal: "ESMO Congress 2022 Presidential Symposium",
    year: 2022,
    patientN: 112,
    studyType: "cohort",
    evidenceLevel: 4,
    doi: "10.1016/j.annonc.2022.08.016",
    pubmedId: "36099884",
    url: "https://doi.org/10.1016/j.annonc.2022.08.016",
    keyConclusions: [
      "纳武利尤单抗联合低剂量伊匹木单抗 (双免疫检查点阻断) 术前新辅助治疗 dMMR/MSI-H 局部晚期结肠癌，病理学缓解率高达 95%，其中 67% 的患者达到原发灶完全消失 (pCR)！",
      "中位随访 13 个月时无一名患者发生术后疾病复发，被誉为早期实体瘤新辅助免疫治疗史上最震撼的突破性临床研究之一。"
    ],
    relevantFactors: ["NICHE-2", "dMMR结肠癌", "双免疫新辅助", "67% pCR", "免化疗突破"],
    applicableStages: ["IIA", "IIB", "IIC", "IIIA", "IIIB", "IIIC"],
    biomarkerDetails: "dMMR / MSI-H 局部晚期结肠腺癌",
    interventionArm: "术前单疗程双免疫 (Nivolumab 3mg/kg + Ipilimumab 1mg/kg) 随后手术",
    riskReduction: "95% 病理显著缓解，67% 病理完全缓解 (pCR)"
  },
  {
    id: "recourse_2015",
    title: "Randomized Trial of TAS-102 for Refractory Metastatic Colorectal Cancer (RECOURSE)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2015,
    patientN: 800,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1414325",
    pubmedId: "25970050",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1414325",
    keyConclusions: [
      "口服新型核苷抗癌复方药 TAS-102 (曲氟尿苷替匹嘧啶片) 在对所有标准疗法均耐药的难治性晚期结直肠癌中，显著延长总生存期 (7.1 个月 vs 5.3 个月，HR=0.68)。",
      "疾病控制率 (DCR) 达到 44%，为经历奥沙利铂、伊立替康和靶向药物多轮化疗后的中国患者提供了关键的后线口服有效防守武器。"
    ],
    relevantFactors: ["RECOURSE", "TAS-102", "曲氟尿苷替匹嘧啶", "难治后线", "口服化疗"],
    applicableStages: ["IV", "IVA", "IVB", "IVC"],
    biomarkerDetails: "氟尿嘧啶、奥沙利铂、伊立替康、贝伐珠/西妥昔耐药的 mCRC",
    interventionArm: "TAS-102 (35mg/m² bid) + 最佳支持 vs 安慰剂 + 最佳支持",
    riskReduction: "-32% 死亡风险 (HR=0.68, P<0.001)"
  },
  {
    id: "destiny_crc01_2022",
    title: "Trastuzumab Deruxtecan (T-DXd) in Patients with HER2-Expressing Metastatic Colorectal Cancer (DESTINY-CRC01)",
    journal: "The Lancet Oncology",
    year: 2022,
    patientN: 86,
    studyType: "cohort",
    evidenceLevel: 4,
    doi: "10.1016/S1470-2045(22)00344-9",
    pubmedId: "35753335",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(22)00344-9/fulltext",
    keyConclusions: [
      "靶向抗体偶联药物 (ADC) 德曲妥珠单抗 (T-DXd) 在 HER2 扩增/高表达 (IHC 3+ 或 IHC 2+/FISH+) 难治性结直肠癌中，确认的客观缓解率 (ORR) 达到突破性的 45.3%。",
      "中位无进展生存期达 6.9 个月，颠覆了既往 HER2 扩增肠癌缺乏强效高响应靶向治疗的历史认知空白。"
    ],
    relevantFactors: ["DESTINY-CRC01", "HER2扩增", "德曲妥珠单抗", "T-DXd", "ADC精准打击"],
    applicableStages: ["IV", "IVA", "IVB", "IVC"],
    biomarkerDetails: "HER2 扩增型 (IHC 3+ 或 IHC 2+/FISH+) RAS 野生型 mCRC",
    interventionArm: "T-DXd 6.4mg/kg 静滴 Q3W",
    riskReduction: "45.3% 客观缓解率 (ORR)，中位PFS 6.9 个月"
  }
];
