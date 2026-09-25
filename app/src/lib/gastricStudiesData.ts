import type { StudyItem } from "@/components/StudyCard";

export const GASTRIC_STUDIES: StudyItem[] = [
  {
    id: "toga_2010",
    title: "Trastuzumab in combination with chemotherapy versus chemotherapy alone for treatment of HER2-positive advanced gastric or gastro-oesophageal junction cancer (ToGA)",
    journal: "Lancet",
    year: 2010,
    patientN: 584,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S0140-6736(10)61121-X",
    pubmedId: "20728210",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(10)61121-X/fulltext",
    keyConclusions: [
      "HER2 阳性 (IHC 3+ 或 FISH+) 晚期胃癌患者加用曲妥珠单抗联合化疗，中位总生存期从 11.1 个月提升至 13.8 个月 (高表达亚组达 16.0 个月)，死亡风险降低 26% (HR=0.74)。",
      "正式确立了胃癌 HER2 靶点筛查作为全球一线治疗不可或缺的诊疗金标准。"
    ],
    relevantFactors: ["HER2", "曲妥珠单抗", "ToGA", "靶向治疗", "胃腺癌"],
    applicableStages: ["III", "IV"],
    biomarkerDetails: "HER2 阳性 (IHC 3+ 或 IHC 2+/FISH+)",
    interventionArm: "曲妥珠单抗 + 顺铂/氟尿嘧啶 vs 单纯化疗",
    riskReduction: "死亡风险降低 26% (HR=0.74, P=0.0046)"
  },
  {
    id: "spotlight_2023",
    title: "Zolbetuximab plus mFOLFOX6 in patients with CLDN18.2-positive, HER2-negative, untreated, locally advanced unresectable or metastatic gastric or gastro-oesophageal junction adenocarcinoma (SPOTLIGHT)",
    journal: "Lancet",
    year: 2023,
    patientN: 565,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S0140-6736(23)00620-7",
    pubmedId: "37068504",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(23)00620-7/fulltext",
    keyConclusions: [
      "针对 Claudin 18.2 阳性（≥75% 肿瘤细胞呈中强膜染色）、HER2 阴性晚期胃癌，佐妥昔单抗 (Zolbetuximab) 联合 mFOLFOX6 使中位无进展生存期延长至 10.6 个月，中位 OS 提升至 18.2 个月。",
      "开启了继 HER2 之后胃癌最具革命性的特异性细胞紧密连接蛋白靶向治疗新时代。"
    ],
    relevantFactors: ["Claudin 18.2", "佐妥昔单抗", "SPOTLIGHT", "一线靶向", "CLDN18.2"],
    applicableStages: ["III", "IV"],
    biomarkerDetails: "CLDN18.2 阳性 (≥75% 膜染色 ≥2+) / HER2-",
    interventionArm: "Zolbetuximab + mFOLFOX6 vs 安慰剂 + mFOLFOX6",
    riskReduction: "疾病进展或死亡风险降低 25% (HR=0.75, P=0.0066)"
  },
  {
    id: "checkmate_649_2021",
    title: "First-line nivolumab plus chemotherapy versus chemotherapy alone for advanced gastric, gastro-oesophageal junction, and oesophageal adenocarcinoma (CheckMate 649)",
    journal: "Lancet",
    year: 2021,
    patientN: 1581,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S0140-6736(21)00797-2",
    pubmedId: "34102137",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(21)00797-2/fulltext",
    keyConclusions: [
      "在 PD-L1 CPS ≥ 5 的晚期胃癌/胃食管结合部腺癌中，纳武利尤单抗 (O药) 联合化疗显著延长中位总生存期至 14.4 个月 (vs 单纯化疗 11.1 个月，HR=0.71)。",
      "全人群总生存期亦实现显著获益 (13.8 vs 11.6 个月)，被国内外指南全线列为一线首选 I 级推荐。"
    ],
    relevantFactors: ["PD-L1", "CPS", "纳武利尤单抗", "CheckMate-649", "免疫治疗"],
    applicableStages: ["III", "IV"],
    biomarkerDetails: "PD-L1 CPS ≥ 5 / HER2-",
    interventionArm: "Nivolumab + XELOX/FOLFOX vs 单纯化疗",
    riskReduction: "死亡风险降低 29% (HR=0.71, P<0.0001)"
  },
  {
    id: "resolve_2021",
    title: "Perioperative or postoperative adjuvant oxaliplatin with S-1 versus postoperative oxaliplatin with capecitabine in patients with locally advanced gastric or gastro-oesophageal junction adenocarcinoma undergoing D2 gastrectomy (RESOLVE)",
    journal: "Lancet Oncology",
    year: 2021,
    patientN: 1028,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(21)00297-9",
    pubmedId: "34252374",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(21)00297-9/fulltext",
    keyConclusions: [
      "中国自主设计开展的里程碑 III 期研究：证实术后辅助 SOX (替吉奥+奥沙利铂) 方案在 D2 根治术后 3 年无病生存率 (DFS) 不劣于经典 XELOX 方案 (62.1% vs 60.3%)。",
      "围手术期 SOX 方案（术前 3 周期 + 术后 5 周期）相比术后 XELOX 进一步显著降低复发风险 23% (HR=0.77)。"
    ],
    relevantFactors: ["D2根治术", "SOX方案", "替吉奥", "RESOLVE", "围手术期化疗"],
    applicableStages: ["IIA", "IIB", "IIIA", "IIIB", "IIIC"],
    biomarkerDetails: "局部进展期 cT4a/N+ 或 cT4b/Nx D2切除术后",
    interventionArm: "围手术期SOX vs 术后SOX vs 术后XELOX",
    riskReduction: "围手术期SOX降低疾病复发风险 23% (HR=0.77)"
  },
  {
    id: "classic_2012",
    title: "Adjuvant capecitabine and oxaliplatin for gastric cancer after D2 gastrectomy (CLASSIC): a phase 3 open-label, randomised controlled trial",
    journal: "Lancet",
    year: 2012,
    patientN: 1035,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S0140-6736(11)61873-4",
    pubmedId: "22226517",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(11)61873-4/fulltext",
    keyConclusions: [
      "在亚洲 D2 根治性切除术后的 II-III 期胃癌中，术后辅助 XELOX (卡培他滨+奥沙利铂) 治疗 6 个月使 3 年 DFS 达 74% (单纯手术组 59%)，显著降低复发风险 44% (HR=0.56)。",
      "奠定了 D2 根治术后含铂两药方案作为标准辅助治疗的基石地位。"
    ],
    relevantFactors: ["CLASSIC", "XELOX", "D2切除", "卡培他滨", "奥沙利铂", "辅助化疗"],
    applicableStages: ["II", "III"],
    biomarkerDetails: "D2 淋巴结清扫术后 II~IIIB 期",
    interventionArm: "XELOX 辅助化疗 6 个月 vs 单纯手术随访",
    riskReduction: "复发风险降低 44% (HR=0.56, P<0.0001)"
  }
];
