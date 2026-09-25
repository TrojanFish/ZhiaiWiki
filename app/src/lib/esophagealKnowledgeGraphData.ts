import type { KnowledgeNode, EdgeEvidence } from "./knowledgeGraphData";
import type { PatientProfile } from "@/lib/types";

/**
 * 食管癌 4D 知识图谱节点集 (AJCC 8th / CSCO / NCCN 2024 标准)
 */
export const ESOPHAGEAL_GRAPH_NODES: KnowledgeNode[] = [
  // --- Column 1: Pathological, Anatomical & Molecular Factors (X = 15) ---
  {
    id: "ESOPH_HISTOLOGY",
    label: "病理组织学\n鳞癌 ESCC vs 腺癌",
    type: "factor",
    x: 15,
    y: 12,
    connections: ["NEOCRTEC5010_NCRT", "FIRSTLINE_CHEMO_IO", "RECURRENCE_ESO"],
    connectionTypes: {
      NEOCRTEC5010_NCRT: "guides",
      FIRSTLINE_CHEMO_IO: "guides",
      RECURRENCE_ESO: "risk",
    },
    studies: 58,
    evidence: 5,
    description: "病理类型分水岭：中国 90% 以上为食管鳞状细胞癌 (ESCC)，对放疗与免疫检查点抑制剂高度敏感；欧美国家则以食管胃结合部腺癌 (EAC) 为主，治疗策略侧重三联化疗。",
  },
  {
    id: "T_DEPTH_ESOPH",
    label: "浸润深度\nT1a/T1b - T4",
    type: "factor",
    x: 15,
    y: 26,
    connections: ["ESD_ENDOSCOPIC", "ESOPH_MIE_SURGERY", "RECURRENCE_ESO"],
    connectionTypes: {
      ESD_ENDOSCOPIC: "guides",
      ESOPH_MIE_SURGERY: "guides",
      RECURRENCE_ESO: "risk",
    },
    studies: 45,
    evidence: 5,
    description: "T 分期深度决定治疗分水岭：黏膜内癌 (T1a / M1-M2) 淋巴结转移率 <3%，首选内镜 ESD 微创切除保留全食管；侵犯黏膜下层 (T1b / SM) 及以上者，淋巴转移率跃升至 20%-40%，必须行规范根治术。",
  },
  {
    id: "RECURRENT_NERVE_LN",
    label: "喉返神经链淋巴结\n106组双侧前哨",
    type: "factor",
    x: 15,
    y: 40,
    connections: ["ESOPH_MIE_SURGERY", "RECURRENCE_ESO"],
    connectionTypes: {
      ESOPH_MIE_SURGERY: "guides",
      RECURRENCE_ESO: "risk",
    },
    studies: 52,
    evidence: 5,
    description: "双侧喉返神经旁淋巴结 (106recR / 106recL)：食管癌最高频转移与复发部位（转移率高达 30%-40%）。胸腹腔镜微创根治术 (MIE) 中完整清扫该组淋巴结是考验外科质控的试金石。",
  },
  {
    id: "PDL1_CPS_ESOPH",
    label: "PD-L1 表达评分\nCPS ≥10 / TAP ≥10%",
    type: "factor",
    x: 15,
    y: 54,
    connections: ["FIRSTLINE_CHEMO_IO", "CHECKMATE577_ADJ", "OS_ESOPHAGEAL"],
    connectionTypes: {
      FIRSTLINE_CHEMO_IO: "guides",
      CHECKMATE577_ADJ: "guides",
      OS_ESOPHAGEAL: "protective",
    },
    studies: 60,
    evidence: 5,
    description: "PD-L1 综合阳性评分 (CPS / TAP)：晚期一线免疫联合化疗的核心预测标志物。CPS ≥10 的食管鳞癌患者接受 PD-1 联合化疗展现出最为显著的生存延长幅度。",
  },
  {
    id: "TUMOR_LOCATION_ES",
    label: "解剖发生部位\n颈段 vs 胸中下段",
    type: "factor",
    x: 15,
    y: 68,
    connections: ["DEFINITIVE_CRT_ESO", "ESOPH_MIE_SURGERY"],
    connectionTypes: {
      DEFINITIVE_CRT_ESO: "guides",
      ESOPH_MIE_SURGERY: "guides",
    },
    studies: 38,
    evidence: 4,
    description: "肿瘤解剖节段：颈段及胸上段食管癌因毗邻喉气管及大血管，手术难度与喉功能丧失代价极大，首选根治性同步放化疗 (dCRT)；胸中段及胸下段则以新辅助联合微创手术为标准。",
  },

  // --- Column 2: Clinical Decisions & Regimens (X = 45) ---
  {
    id: "NEOCRTEC5010_NCRT",
    label: "新辅助放化疗 nCRT\n长春瑞滨+顺铂",
    type: "guideline",
    x: 45,
    y: 18,
    connections: ["PCR_RESPONSE_ESO", "ESOPH_MIE_SURGERY", "OS_ESOPHAGEAL"],
    connectionTypes: {
      PCR_RESPONSE_ESO: "protective",
      ESOPH_MIE_SURGERY: "guides",
      OS_ESOPHAGEAL: "protective",
    },
    studies: 65,
    evidence: 5,
    description: "中国自主国家级 III 期 NEOCRTEC5010 与全球 CROSS 方案：局部进展期食管鳞癌术前同步放化疗，将 R0 切除率提高至 98% 以上，病理完全缓解率 (pCR) 达到 43.2%，5年总生存率高达 60.0%。",
  },
  {
    id: "ESOPH_MIE_SURGERY",
    label: "微创食管切除术\nMIE McKeown 三切口",
    type: "guideline",
    x: 45,
    y: 35,
    connections: ["ANASTOMOTIC_LEAK_ESO", "RECURRENCE_ESO", "OS_ESOPHAGEAL"],
    connectionTypes: {
      ANASTOMOTIC_LEAK_ESO: "risk",
      RECURRENCE_ESO: "protective",
      OS_ESOPHAGEAL: "protective",
    },
    studies: 70,
    evidence: 5,
    description: "胸腹腔镜联合微创食管切除术 (MIE McKeown/Ivor Lewis)：常规行颈胸腹二野或三野淋巴结彻底清扫，管状胃替代食管颈部吻合，创伤小、术后肺部并发症显著减少。",
  },
  {
    id: "CHECKMATE577_ADJ",
    label: "术后辅助免疫\n纳武利尤单抗 1 年",
    type: "guideline",
    x: 45,
    y: 52,
    connections: ["RECURRENCE_ESO", "OS_ESOPHAGEAL"],
    connectionTypes: {
      RECURRENCE_ESO: "protective",
      OS_ESOPHAGEAL: "protective",
    },
    studies: 42,
    evidence: 5,
    description: "全球首创辅助免疫维持标杆（CheckMate-577 研究）：新辅助放化疗术后病理未达到完全缓解 (non-pCR) 的高危患者，给予纳武利尤单抗维持 1 年，中位无病生存期 (DFS) 直接翻倍 (22.4月 vs 11.0月)。",
  },
  {
    id: "FIRSTLINE_CHEMO_IO",
    label: "一线免疫联合化疗\n替雷利珠/卡瑞利珠",
    type: "guideline",
    x: 45,
    y: 70,
    connections: ["OS_ESOPHAGEAL"],
    connectionTypes: {
      OS_ESOPHAGEAL: "protective",
    },
    studies: 55,
    evidence: 5,
    description: "晚期一线标准体系：RATIONALE-306 / ESCORT-1st / JUPITER-06 证实，PD-1 单抗联合氟尿嘧啶+顺铂或紫杉醇+顺铂，使中国晚期食管鳞癌中位总生存期全面突破 15-17 个月。",
  },
  {
    id: "DEFINITIVE_CRT_ESO",
    label: "根治同步放化疗\ndCRT 保留食管",
    type: "guideline",
    x: 45,
    y: 86,
    connections: ["OS_ESOPHAGEAL"],
    connectionTypes: {
      OS_ESOPHAGEAL: "protective",
    },
    studies: 48,
    evidence: 5,
    description: "根治性同步放化疗 (dCRT 50-60 Gy)：用于拒绝手术或无法手术的患者及颈段食管癌，在完整保留天然吞咽器官功能的同时，实现与外科切除相当的长期生存。",
  },
  {
    id: "ESD_ENDOSCOPIC",
    label: "内镜黏膜下剥离\nESD 微创早诊早治",
    type: "guideline",
    x: 45,
    y: 98,
    connections: ["OS_ESOPHAGEAL"],
    connectionTypes: {
      OS_ESOPHAGEAL: "protective",
    },
    studies: 40,
    evidence: 5,
    description: "内镜 ESD 微创剥离术：对浅表黏膜内病变行一次性整块完整切除，不改变胸腹解剖结构，术后生活质量极佳，5 年治愈率高达 95% 以上。",
  },

  // --- Column 3: Intermediate Events & Complications (X = 70) ---
  {
    id: "PCR_RESPONSE_ESO",
    label: "病理完全缓解\npCR 达 43.2%",
    type: "outcome",
    x: 70,
    y: 20,
    connections: ["OS_ESOPHAGEAL"],
    connectionTypes: {
      OS_ESOPHAGEAL: "protective",
    },
    studies: 50,
    evidence: 5,
    description: "新辅助治疗后的病理完全缓解 (ypT0N0)：标本内未见任何残余活癌细胞。达到 pCR 的食管癌患者 5 年生存率高达 70%-80%，复发风险降至极低区间。",
  },
  {
    id: "ANASTOMOTIC_LEAK_ESO",
    label: "吻合口瘘与感染\n术后严重外科并发症",
    type: "outcome",
    x: 70,
    y: 45,
    connections: ["OS_ESOPHAGEAL"],
    connectionTypes: {
      OS_ESOPHAGEAL: "risk",
    },
    studies: 30,
    evidence: 4,
    description: "食管胃吻合口瘘与纵隔/肺部感染：食管手术最危险的并发症。采用颈部吻合或术中管状胃血供荧光显影质控，可将致死性纵隔脓毒症发生率降至最低。",
  },

  // --- Column 4: Ultimate Survival Endpoints (X = 85) ---
  {
    id: "RECURRENCE_ESO",
    label: "复发与纵隔转移\n无瘤生存期 DFS",
    type: "outcome",
    x: 85,
    y: 35,
    connections: ["OS_ESOPHAGEAL"],
    connectionTypes: {
      OS_ESOPHAGEAL: "risk",
    },
    studies: 65,
    evidence: 5,
    description: "术后复发与远处转移风险：规范的新辅助放化疗加辅助免疫可大幅压低纵隔淋巴结与吻合口复发率，构筑长期生存护城河。",
  },
  {
    id: "OS_ESOPHAGEAL",
    label: "总生存率\n5-yr OS 长期治愈",
    type: "outcome",
    x: 85,
    y: 70,
    connections: [],
    studies: 82,
    evidence: 5,
    description: "食管癌总生存期：中国前瞻性 NEOCRTEC5010 确立了新辅助放化疗 5 年 OS 达 60.0% 的世界领先纪录；早期经内镜微创治疗更可实现长期根治。",
  },
];

/**
 * 食管癌关键证据连线详情 (顶刊前瞻性队列与森林图证据)
 */
export const ESOPHAGEAL_EDGE_EVIDENCE: Record<string, EdgeEvidence> = {
  "NEOCRTEC5010_NCRT-OS_ESOPHAGEAL": {
    title: "NEOCRTEC5010 新辅助放化疗大幅提升局部进展期食管鳞癌 5 年生存率",
    description: "由中国领衔、发表于临床肿瘤学顶级期刊 J Clin Oncol 的多中心随机对照研究，证实新辅助放化疗使 5 年总生存率由 41.2% 跃升至 60.0%。",
    metric: {
      label: "死亡风险比 (OS)",
      value: "HR 0.60",
      ci: "95% CI: 0.44 - 0.81",
      p: "p = 0.001"
    },
    forestData: [
      { study: "NEOCRTEC5010 (JCO)", year: 2018, hr: 0.60, ciLow: 0.44, ciHigh: 0.81 },
      { study: "CROSS Trial (Lancet)", year: 2015, hr: 0.68, ciLow: 0.53, ciHigh: 0.88 },
      { study: "FFCD 9901 Trial", year: 2014, hr: 0.99, ciLow: 0.69, ciHigh: 1.44 },
    ],
    studies: [
      {
        title: "Neoadjuvant Chemoradiotherapy Followed by Surgery Versus Surgery Alone for Locally Advanced Squamous Cell Carcinoma of the Esophagus (NEOCRTEC5010): A Phase III Multicenter, Randomized, Open-Label Clinical Trial",
        journal: "J Clin Oncol",
        year: 2018,
        doi: "10.1200/JCO.2017.77.5098",
        conclusion: "新辅助顺铂+长春瑞滨同步放化疗显著延长局部进展期食管鳞癌患者总生存期 (中位 OS 100.1月 vs 66.5月)。"
      }
    ]
  },
  "CHECKMATE577_ADJ-OS_ESOPHAGEAL": {
    title: "CheckMate-577 奠定新辅助术后辅助免疫治疗全球新标准",
    description: "新英格兰医学杂志 (NEJM) 发布的全球双盲 III 期研究证实，对新辅助放化疗术后病理残留 (non-pCR) 的食管癌患者，纳武利尤单抗辅助维持带来无病生存期倍增获益。",
    metric: {
      label: "疾病复发或死亡风险 (DFS)",
      value: "HR 0.69",
      ci: "95% CI: 0.56 - 0.86",
      p: "p < 0.001"
    },
    forestData: [
      { study: "CheckMate-577 (NEJM)", year: 2021, hr: 0.69, ciLow: 0.56, ciHigh: 0.86 },
      { study: "鳞癌亚组 (ESCC)", year: 2021, hr: 0.61, ciLow: 0.44, ciHigh: 0.84 },
      { study: "腺癌亚组 (EAC)",  year: 2021, hr: 0.75, ciLow: 0.59, ciHigh: 0.96 },
    ],
    studies: [
      {
        title: "Adjuvant Nivolumab in Resected Esophageal or Gastroesophageal Junction Cancer",
        journal: "N Engl J Med",
        year: 2021,
        doi: "10.1056/NEJMoa2032125",
        conclusion: "纳武利尤单抗辅助治疗使中位无病生存期从 11.0 个月显著翻倍延长至 22.4 个月。"
      }
    ]
  },
  "FIRSTLINE_CHEMO_IO-OS_ESOPHAGEAL": {
    title: "一线 PD-1 免疫联合化疗重塑晚期食管鳞癌生存格局",
    description: "ESCORT-1st、RATIONALE-306 与 JUPITER-06 多项中国牵头高质量 III 期试验一致证实，PD-1 联合化疗显著突破晚期食管癌中位生存天花板。",
    metric: {
      label: "总生存风险比 (OS)",
      value: "HR 0.70",
      ci: "95% CI: 0.56 - 0.88",
      p: "p = 0.001"
    },
    forestData: [
      { study: "ESCORT-1st (JAMA)", year: 2021, hr: 0.70, ciLow: 0.56, ciHigh: 0.88 },
      { study: "RATIONALE-306 (Lancet)", year: 2022, hr: 0.66, ciLow: 0.54, ciHigh: 0.80 },
      { study: "KEYNOTE-590 (Lancet)", year: 2021, hr: 0.73, ciLow: 0.62, ciHigh: 0.86 },
    ],
    studies: [
      {
        title: "Effect of Camrelizumab vs Placebo Added to Chemotherapy on Survival and Progression-Free Survival in Patients With Advanced or Metastatic Esophageal Squamous Cell Carcinoma (ESCORT-1st)",
        journal: "JAMA",
        year: 2021,
        doi: "10.1001/jama.2021.14736",
        conclusion: "卡瑞利珠单抗联合紫杉醇与顺铂显著改善中位总生存期 (15.3月 vs 12.0月)。"
      }
    ]
  }
};

/**
 * 依据食管癌患者画像动态激活知识节点
 */
export function getEsophagealNodeActivation(nodeId: string, profile: PatientProfile | null): "primary" | "active" | "warning" | "dim" | "normal" {
  if (!profile) return "normal";

  const raw = (profile as any).cancerSpecificData || (profile as any).esophagealData || profile;
  const isEarly = profile.stage?.startsWith("I") || profile.tStage === "T1a";
  const isLocallyAdvanced = profile.stage?.startsWith("II") || profile.stage?.startsWith("III");
  const isStageIV = profile.stage?.startsWith("IV");

  switch (nodeId) {
    case "ESD_ENDOSCOPIC":
      return isEarly && profile.tStage === "T1a" ? "primary" : "normal";
    case "NEOCRTEC5010_NCRT":
      return isLocallyAdvanced ? "primary" : "normal";
    case "ESOPH_MIE_SURGERY":
      return isLocallyAdvanced || (isEarly && profile.tStage !== "T1a") ? "primary" : "normal";
    case "CHECKMATE577_ADJ":
      return raw.pcrStatus === "non_pCR" || (isLocallyAdvanced && !raw.pcrStatus) ? "primary" : "normal";
    case "FIRSTLINE_CHEMO_IO":
      return isStageIV ? "primary" : "normal";
    case "RECURRENT_NERVE_LN":
      return raw.hasRecurrentNerveMetastasis || profile.nStage?.startsWith("N") ? "warning" : "normal";
    case "ANASTOMOTIC_LEAK_ESO":
      return raw.hasLeak ? "warning" : "dim";
    default:
      return "normal";
  }
}
