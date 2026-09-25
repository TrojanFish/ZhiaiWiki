import type { KnowledgeNode, EdgeEvidence } from "./knowledgeGraphData";
import type { PatientProfile } from "@/lib/types";

/**
 * 原发性肝癌 4D 知识图谱节点集 (CNLC 2024 / CSCO / AASLD / EASL 标准)
 */
export const LIVER_GRAPH_NODES: KnowledgeNode[] = [
  // --- Column 1: Pathological, Reserve & Molecular Factors (X = 15) ---
  {
    id: "CNLC_STAGING",
    label: "CNLC 分期\n中国国家标准 Ia-IV",
    type: "factor",
    x: 15,
    y: 12,
    connections: ["SURGERY_TRANSPLANT", "TACE_HAIC_INTERV", "T_PLUS_A_IO"],
    connectionTypes: {
      SURGERY_TRANSPLANT: "guides",
      TACE_HAIC_INTERV: "guides",
      T_PLUS_A_IO: "guides",
    },
    studies: 65,
    evidence: 5,
    description: "CNLC 2024 中国肝癌临床分期标准：综合肿瘤大小、数目、血管侵犯、肝功能 Child-Pugh 及全身 PS 评分，将患者精准划分为 Ia 至 IV 期，直接导向手术、介入或靶免系统治疗路径。",
  },
  {
    id: "CHILD_PUGH_ALBI",
    label: "肝脏储备功能\nChild-Pugh / ALBI",
    type: "factor",
    x: 15,
    y: 26,
    connections: ["SURGERY_TRANSPLANT", "PHLF_FAILURE", "OS_LIVER"],
    connectionTypes: {
      SURGERY_TRANSPLANT: "guides",
      PHLF_FAILURE: "risk",
      OS_LIVER: "protective",
    },
    studies: 58,
    evidence: 5,
    description: "肝脏功能储备评估：Child-Pugh A 级是安全手术与全身靶免治疗的前提红线；ALBI 评分（仅依据白蛋白与胆红素，无主观腹水/脑病偏倚）提供更高分辨率的肝衰与预后风险分层。",
  },
  {
    id: "PVTT_CHENG",
    label: "门静脉癌栓\n程氏分型 I-IV 型",
    type: "factor",
    x: 15,
    y: 40,
    connections: ["HAIC_FO_LOCAL", "DOWNSTAGING_LIVER", "OS_LIVER"],
    connectionTypes: {
      HAIC_FO_LOCAL: "guides",
      DOWNSTAGING_LIVER: "guides",
      OS_LIVER: "risk",
    },
    studies: 42,
    evidence: 5,
    description: "门静脉瘤栓 (PVTT)：传统晚期预后不良指标。中国程氏分型（I型分枝至IV型主干）指导下，结合 HAIC-FO 灌注化疗与放疗，可实现高达 30%-50% 的转化降期切除机会。",
  },
  {
    id: "AFP_PIVKA_TRIPLE",
    label: "血清三联标志物\nAFP / PIVKA-II",
    type: "factor",
    x: 15,
    y: 54,
    connections: ["SURGERY_TRANSPLANT", "OS_LIVER"],
    connectionTypes: {
      SURGERY_TRANSPLANT: "guides",
      OS_LIVER: "risk",
    },
    studies: 50,
    evidence: 5,
    description: "血清学三联标志物：甲胎蛋白 (AFP) + 异常凝血酶原 (PIVKA-II / DCP) + 甲胎蛋白异质体 (AFP-L3)。两者联合显著减少单项 AFP 阴性漏诊，且高滴度提示早期微血管侵犯 (MVI) 风险。",
  },
  {
    id: "HBV_CIRRHOSIS",
    label: "乙肝与肝硬化\nHBV DNA / 门脉高压",
    type: "factor",
    x: 15,
    y: 68,
    connections: ["VARICEAL_HEMORRHAGE", "OS_LIVER"],
    connectionTypes: {
      VARICEAL_HEMORRHAGE: "risk",
      OS_LIVER: "protective",
    },
    studies: 54,
    evidence: 5,
    description: "基础肝炎与硬化背景：中国 85% 肝癌患者由乙型肝炎 (HBV) 发展而来。强效抗病毒药物（恩替卡韦/替诺福韦二代）全程维持可显著降低术后远期再发风险与肝衰危险。",
  },
  {
    id: "FLR_ICG_VOLUME",
    label: "预留肝体积\nFLR / ICG-R15",
    type: "factor",
    x: 15,
    y: 82,
    connections: ["SURGERY_TRANSPLANT", "PHLF_FAILURE"],
    connectionTypes: {
      SURGERY_TRANSPLANT: "guides",
      PHLF_FAILURE: "risk",
    },
    studies: 36,
    evidence: 4,
    description: "剩余肝脏体积 (FLR) 与吲哚菁绿 15 分钟滞留率 (ICG-R15)：肝硬化患者 FLR 须 ≥40%（非硬化 ≥30%）且 ICG-R15 <14%，否则严禁大范围肝切除，以防术后致死性肝衰。",
  },

  // --- Column 2: Clinical Decisions & Interventions (X = 45) ---
  {
    id: "SURGERY_TRANSPLANT",
    label: "根治性切除/移植\n解剖切除 / 米兰标准",
    type: "guideline",
    x: 45,
    y: 18,
    connections: ["PHLF_FAILURE", "OS_LIVER"],
    connectionTypes: {
      PHLF_FAILURE: "risk",
      OS_LIVER: "protective",
    },
    studies: 72,
    evidence: 5,
    description: "解剖性肝切除术与符合米兰标准 (单发 ≤5cm 或 ≤3枚每个 ≤3cm) 的原位肝移植：早期肝癌唯二的根治性外科手段，术后 5 年生存率可达 60%-75% 以上。",
  },
  {
    id: "RFA_MWA_ABLATION",
    label: "局部微创消融\nRFA / MWA 消融",
    type: "guideline",
    x: 45,
    y: 35,
    connections: ["OS_LIVER"],
    connectionTypes: {
      OS_LIVER: "protective",
    },
    studies: 48,
    evidence: 5,
    description: "射频消融 (RFA) / 微波消融 (MWA)：针对最大径 ≤3cm 的极早期单发或多发肝癌，在严格安全切缘 (≥5mm) 下可取得与外科手术等效的长期生存，创伤与并发症极低。",
  },
  {
    id: "TACE_HAIC_INTERV",
    label: "介入栓塞与灌注\nTACE / HAIC-FO",
    type: "guideline",
    x: 45,
    y: 52,
    connections: ["DOWNSTAGING_LIVER", "OS_LIVER"],
    connectionTypes: {
      DOWNSTAGING_LIVER: "protective",
      OS_LIVER: "protective",
    },
    studies: 60,
    evidence: 5,
    description: "经肝动脉化疗栓塞 (cTACE/DEB-TACE) 与经动脉持续灌注化疗 (HAIC-FO)：CNLC IIb / IIIa 期中晚期核心支柱，对大肝癌或门静脉癌栓患者提供高达 40%-60% 的客观退缩率。",
  },
  {
    id: "T_PLUS_A_IO",
    label: "T+A 一线靶免\n阿替利珠+贝伐珠",
    type: "guideline",
    x: 45,
    y: 68,
    connections: ["OS_LIVER"],
    connectionTypes: {
      OS_LIVER: "protective",
    },
    studies: 45,
    evidence: 5,
    description: "IMbrave150 确立的晚期肝癌全球一线标杆方案：PD-L1 免疫单抗阿替利珠单抗联合抗血管生成单抗贝伐珠单抗，中位总生存期突破 19.2 个月，死亡风险下降 42%。",
  },
  {
    id: "ORIENT32_COMBO",
    label: "双达中国方案\n信迪利+达攸同",
    type: "guideline",
    x: 45,
    y: 84,
    connections: ["OS_LIVER"],
    connectionTypes: {
      OS_LIVER: "protective",
    },
    studies: 38,
    evidence: 5,
    description: "ORIENT-32 全球首创中国自主知识产权一线靶免组合：信迪利单抗联合贝伐珠单抗生物类似物，在乙肝相关肝癌中展现卓越性价比与 19.2 个月的中位 OS 获益。",
  },
  {
    id: "LENVATINIB_TKIS",
    label: "多靶点 TKI 口服\n仑伐替尼 / 瑞戈非尼",
    type: "guideline",
    x: 45,
    y: 98,
    connections: ["OS_LIVER"],
    connectionTypes: {
      OS_LIVER: "protective",
    },
    studies: 52,
    evidence: 5,
    description: "靶向酪氨酸激酶抑制剂 (TKI)：一线仑伐替尼 (REFLECT 研究，高缓解率 24.1%)，及二线瑞戈非尼、阿帕替尼、卡博替尼，构建阶梯式的抗血管生成抗肿瘤屏障。",
  },

  // --- Column 3: Intermediate Events & Complications (X = 70) ---
  {
    id: "PHLF_FAILURE",
    label: "术后肝功能衰竭\nPHLF 50-50 标准",
    type: "outcome",
    x: 70,
    y: 25,
    connections: ["OS_LIVER"],
    connectionTypes: {
      OS_LIVER: "risk",
    },
    studies: 32,
    evidence: 5,
    description: "术后肝衰竭 (PHLF)：肝切除术后第 5 天凝血酶原时间 (PT <50%) 且胆红素 (>50 μmol/L) 达标即诊断，围手术期严密质控 FLR 预留体积是唯一的预防王道。",
  },
  {
    id: "VARICEAL_HEMORRHAGE",
    label: "曲张静脉破裂出血\n门脉高压危急症",
    type: "outcome",
    x: 70,
    y: 50,
    connections: ["OS_LIVER"],
    connectionTypes: {
      OS_LIVER: "risk",
    },
    studies: 28,
    evidence: 4,
    description: "重度食管胃底静脉曲张破裂大出血：接受抗血管生成靶向药（贝伐珠单抗）前必须行胃镜筛查与套扎预防，严密预防致死性消化道大出血。",
  },
  {
    id: "DOWNSTAGING_LIVER",
    label: "MDT 转化降期率\n不可切除转根治切除",
    type: "outcome",
    x: 70,
    y: 75,
    connections: ["OS_LIVER"],
    connectionTypes: {
      OS_LIVER: "protective",
    },
    studies: 35,
    evidence: 5,
    description: "转化治疗成功率：通过 HAIC-FO 联合靶免三联或双免方案，使初诊伴血管侵犯或大肿瘤的患者实现肿瘤坏死退缩，获得二期根治性切除，5年生存率跃升至 50% 以上。",
  },

  // --- Column 4: Ultimate Survival Endpoints (X = 85) ---
  {
    id: "OS_LIVER",
    label: "总生存期\n中位 OS / 5年生存",
    type: "outcome",
    x: 85,
    y: 50,
    connections: [],
    studies: 85,
    evidence: 5,
    description: "原发性肝癌长期生存期：早期根治切除 5 年 OS 达 60%-70%；中晚期在靶免与局部介入联合治理下，中位生存期由以往不足 6 个月大幅飞跃至近 2 年。",
  },
];

/**
 * 肝癌关键证据连线详情 (顶刊前瞻性队列与森林图证据)
 */
export const LIVER_EDGE_EVIDENCE: Record<string, EdgeEvidence> = {
  "T_PLUS_A_IO-OS_LIVER": {
    title: "阿替利珠单抗联合贝伐珠单抗 (T+A) 颠覆晚期肝癌一线治疗",
    description: "新英格兰医学杂志 (NEJM) 发表的 IMbrave150 研究是近 12 年来首个击败索拉非尼的全球 III 期试验，显著降低死亡风险 42%。",
    metric: {
      label: "总生存风险比 (OS)",
      value: "HR 0.58",
      ci: "95% CI: 0.42 - 0.79",
      p: "p < 0.001"
    },
    forestData: [
      { study: "IMbrave150 (NEJM)", year: 2020, hr: 0.58, ciLow: 0.42, ciHigh: 0.79 },
      { study: "HIMALAYA (双免)",    year: 2022, hr: 0.78, ciLow: 0.65, ciHigh: 0.92 },
      { study: "SHARP (索拉非尼)",    year: 2008, hr: 0.69, ciLow: 0.55, ciHigh: 0.87 },
    ],
    studies: [
      {
        title: "Atezolizumab plus Bevacizumab in Unresectable Hepatocellular Carcinoma",
        journal: "N Engl J Med",
        year: 2020,
        doi: "10.1056/NEJMoa1915745",
        conclusion: "T+A 靶免联合方案在不可切除肝癌中展现出超越单药 TKI 的总生存期与无进展生存期获益。"
      }
    ]
  },
  "ORIENT32_COMBO-OS_LIVER": {
    title: "信迪利单抗联合贝伐珠单抗生物类似物在乙肝相关肝癌获重大突破",
    description: "中国自主前瞻性 III 期 ORIENT-32 试验证明，双达方案在以乙肝感染为主的中国肝癌患者中，将中位总生存期显著延长至 19.2 个月。",
    metric: {
      label: "总生存风险比 (OS)",
      value: "HR 0.57",
      ci: "95% CI: 0.43 - 0.75",
      p: "p < 0.0001"
    },
    forestData: [
      { study: "ORIENT-32 (Lancet Oncol)", year: 2021, hr: 0.57, ciLow: 0.43, ciHigh: 0.75 },
      { study: "CARES-310 (双艾方案)",     year: 2023, hr: 0.62, ciLow: 0.49, ciHigh: 0.80 },
      { study: "RATIONALE-301",            year: 2022, hr: 0.85, ciLow: 0.71, ciHigh: 1.02 },
    ],
    studies: [
      {
        title: "Sintilimab plus a bevacizumab biosimilar versus sorafenib as first-line therapy for unresectable, hepatitis B-associated hepatocellular carcinoma (ORIENT-32): a multicentre, open-label, randomised phase 2-3 trial",
        journal: "Lancet Oncol",
        year: 2021,
        doi: "10.1016/S1470-2045(21)00252-7",
        conclusion: "信迪利单抗加贝伐珠类似物使死亡风险下降 43%，且具备优异的安全性与可及性。"
      }
    ]
  },
  "LENVATINIB_TKIS-OS_LIVER": {
    title: "仑伐替尼展现强劲抗肿瘤退缩与非劣效总生存获益",
    description: "全球前瞻性 III 期 REFLECT 试验证实，仑伐替尼一线治疗客观缓解率达 24.1%（RECIST 1.1），无进展生存期大幅优于索拉非尼。",
    metric: {
      label: "无进展生存风险比 (PFS)",
      value: "HR 0.66",
      ci: "95% CI: 0.59 - 0.74",
      p: "p < 0.0001"
    },
    forestData: [
      { study: "REFLECT (Lancet)", year: 2018, hr: 0.66, ciLow: 0.59, ciHigh: 0.74 },
      { study: "RESORCE (瑞戈非尼)", year: 2017, hr: 0.63, ciLow: 0.50, ciHigh: 0.79 },
      { study: "CELESTIAL (卡博替尼)", year: 2018, hr: 0.44, ciLow: 0.36, ciHigh: 0.53 },
    ],
    studies: [
      {
        title: "Lenvatinib versus sorafenib in first-line treatment of patients with unresectable hepatocellular carcinoma: a randomised phase 3 non-inferiority trial (REFLECT)",
        journal: "Lancet",
        year: 2018,
        doi: "10.1016/S0140-6736(18)30207-1",
        conclusion: "仑伐替尼在总生存期上达到对索拉非尼的统计学非劣效性，并显示在所有次要疗效终点（PFS、TTP、ORR）上的显著优势。"
      }
    ]
  },
  "HAIC_FO_LOCAL-DOWNSTAGING_LIVER": {
    title: "FOLFOX-HAIC 持续灌注化疗为大肝癌与癌栓患者带来极高转化切除率",
    description: "发表于顶刊 J Clin Oncol 的多项随机对照试验证明，相比单纯全身治疗，动脉灌注 FOLFOX 可将肿瘤客观缓解率提高至 50% 以上。",
    metric: {
      label: "客观缓解率比值 (ORR)",
      value: "ORR 54.1% vs 14.3%",
      ci: "95% CI: 3.20 - 9.45",
      p: "p < 0.001"
    },
    forestData: [
      { study: "Lyu et al. (JCO)", year: 2022, hr: 0.35, ciLow: 0.26, ciHigh: 0.48 },
      { study: "He et al. (JCO)",  year: 2019, hr: 0.55, ciLow: 0.41, ciHigh: 0.74 },
      { study: "Zheng et al. (Lancet Reg)", year: 2022, hr: 0.40, ciLow: 0.28, ciHigh: 0.58 },
    ],
    studies: [
      {
        title: "Hepatic Arterial Infusion Chemotherapy of Oxaliplatin, Fluorouracil, and Leucovorin Versus Sorafenib in Advanced Hepatocellular Carcinoma With Portal Vein Tumor Thrombus: A Randomized, Open-Label, Phase III Trial",
        journal: "J Clin Oncol",
        year: 2022,
        doi: "10.1200/JCO.21.01963",
        conclusion: "FOLFOX-HAIC 联合靶免显著延长门静脉癌栓晚期肝癌患者的中位生存期并提高手术转化切除率。"
      }
    ]
  }
};

/**
 * 依据肝癌患者画像动态激活知识节点
 */
export function getLiverNodeActivation(nodeId: string, profile: PatientProfile | null): "primary" | "active" | "warning" | "dim" | "normal" {
  if (!profile) return "normal";

  const raw = (profile as any).cancerSpecificData || (profile as any).liverData || profile;
  const isCnlcEarly = raw.cnlcStage === "Ia" || raw.cnlcStage === "Ib" || profile.stage?.startsWith("I");
  const isCnlcAdvanced = raw.cnlcStage === "IIIa" || raw.cnlcStage === "IIIb" || profile.stage?.startsWith("III") || profile.stage?.startsWith("IV");
  const hasPvtt = raw.vascularInvasion === "pvtt" || raw.pvttStage != null;
  const isChildA = raw.childPughClass === "A" || raw.childPughScore <= 6;

  switch (nodeId) {
    case "SURGERY_TRANSPLANT":
      return isCnlcEarly && isChildA ? "primary" : "normal";
    case "RFA_MWA_ABLATION":
      return isCnlcEarly && (raw.tumorSize == null || raw.tumorSize <= 3) ? "primary" : "normal";
    case "TACE_HAIC_INTERV":
      return raw.cnlcStage === "IIb" || raw.cnlcStage === "IIIa" || hasPvtt ? "primary" : "normal";
    case "T_PLUS_A_IO":
    case "ORIENT32_COMBO":
      return isCnlcAdvanced ? "primary" : "normal";
    case "LENVATINIB_TKIS":
      return isCnlcAdvanced ? "active" : "normal";
    case "PVTT_CHENG":
      return hasPvtt ? "warning" : "dim";
    case "CHILD_PUGH_ALBI":
      return raw.childPughClass === "B" || raw.childPughClass === "C" ? "warning" : "active";
    case "PHLF_FAILURE":
      return raw.childPughClass === "B" || (raw.icgR15 && raw.icgR15 > 14) ? "warning" : "dim";
    default:
      return "normal";
  }
}
