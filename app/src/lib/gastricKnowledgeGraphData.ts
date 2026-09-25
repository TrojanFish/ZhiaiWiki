import type { KnowledgeNode, EdgeEvidence } from "./knowledgeGraphData";
import type { PatientProfile } from "@/lib/types";

/**
 * 胃癌 4D 知识图谱节点集 (AJCC 8th / CSCO / NCCN 2024 标准)
 */
export const GASTRIC_GRAPH_NODES: KnowledgeNode[] = [
  // --- Column 1: Pathological & Molecular Factors (X = 15) ---
  {
    id: "LAUREN_TYPE",
    label: "Lauren 分型\n肠型 vs 弥漫型",
    type: "factor",
    x: 15,
    y: 12,
    connections: ["SURGERY_D2", "FLOT4_PERIOP", "RECURRENCE_RISK_GAS"],
    connectionTypes: {
      SURGERY_D2: "guides",
      FLOT4_PERIOP: "guides",
      RECURRENCE_RISK_GAS: "risk",
    },
    studies: 48,
    evidence: 5,
    description: "Lauren 组织学分型：肠型多见于老年伴萎缩性胃炎，界限相对清晰；弥漫型（含印戒细胞癌 SRC）多见于年轻患者，呈浸润性硬化生长，易发生腹膜种植转移，手术需保证更宽的安全切缘。",
  },
  {
    id: "D2_LYMPH_NODES",
    label: "D2 清扫质控\n≥16枚 / 淋巴结清扫",
    type: "factor",
    x: 15,
    y: 26,
    connections: ["SURGERY_D2", "SOX_XELOX_ADJ", "RECURRENCE_RISK_GAS"],
    connectionTypes: {
      SURGERY_D2: "guides",
      SOX_XELOX_ADJ: "guides",
      RECURRENCE_RISK_GAS: "risk",
    },
    studies: 55,
    evidence: 5,
    description: "区域淋巴结清扫总数及阳性枚数：国际质控标准严格要求送检 ≥16 枚（理想状态 ≥30 枚）以防分期偏低。N 分期精准指导术后辅助双药强化化疗指征。",
  },
  {
    id: "HER2_STATUS_GAS",
    label: "HER2 表达状态\nIHC 3+ / FISH+",
    type: "factor",
    x: 15,
    y: 40,
    connections: ["TRASTUZUMAB_HER2", "OS_GASTRIC"],
    connectionTypes: {
      TRASTUZUMAB_HER2: "guides",
      OS_GASTRIC: "protective",
    },
    studies: 62,
    evidence: 5,
    description: "人表皮生长因子受体-2 (HER2)：胃癌中阳性率约 12%-15%。HER2 阳性晚期胃癌患者接受曲妥珠单抗或靶向 ADC（德曲妥珠单抗 T-DXd）联合治疗，带来里程碑式的生存期延长。",
  },
  {
    id: "CLAUDIN_18_2",
    label: "Claudin 18.2\n紧密连接蛋白",
    type: "factor",
    x: 15,
    y: 54,
    connections: ["ZOLBETUXIMAB_RX", "OS_GASTRIC"],
    connectionTypes: {
      ZOLBETUXIMAB_RX: "guides",
      OS_GASTRIC: "protective",
    },
    studies: 35,
    evidence: 5,
    description: "Claudin 18.2 胃特异性靶标：中重度表达（≥75% 肿瘤细胞膜中至强染色）见于约 38% 的胃癌患者。全球首创佐妥昔单抗 (Zolbetuximab) 联合化疗开创了胃癌精准靶向的新纪元。",
  },
  {
    id: "MSI_PDL1_GAS",
    label: "错配修复与PD-L1\ndMMR / CPS ≥5",
    type: "factor",
    x: 15,
    y: 68,
    connections: ["PD1_IMMUNO_GAS", "OS_GASTRIC"],
    connectionTypes: {
      PD1_IMMUNO_GAS: "guides",
      OS_GASTRIC: "protective",
    },
    studies: 50,
    evidence: 5,
    description: "错配修复缺陷 (dMMR/MSI-H) 及 PD-L1 CPS 评分：dMMR 胃癌患者免疫原性强，接受 PD-1 免疫检查点抑制剂治疗产生深远持久退缩，甚至在新辅助阶段实现超 60% 病理完全缓解 (pCR)。",
  },
  {
    id: "BORRMANN_TYPE",
    label: "Borrmann 分型\n巨块 vs 溃疡 vs 浸润",
    type: "factor",
    x: 15,
    y: 82,
    connections: ["PERITONEAL_METS_GAS", "RECURRENCE_RISK_GAS"],
    connectionTypes: {
      PERITONEAL_METS_GAS: "risk",
      RECURRENCE_RISK_GAS: "risk",
    },
    studies: 30,
    evidence: 4,
    description: "进展期胃癌大体形态：Borrmann IV 型（弥漫浸润型/皮革胃 Linitis Plastica）侵袭性极强，胃壁广泛纤维化僵硬，极易出现腹膜种植转移与腹水，需常规行腹腔镜探查排查游离癌细胞。",
  },

  // --- Column 2: Clinical Decisions & Regimens (X = 45) ---
  {
    id: "SURGERY_D2",
    label: "D2 根治切除\n标准胃癌根治术",
    type: "guideline",
    x: 45,
    y: 18,
    connections: ["RECURRENCE_RISK_GAS", "OS_GASTRIC"],
    connectionTypes: {
      RECURRENCE_RISK_GAS: "protective",
      OS_GASTRIC: "protective",
    },
    studies: 70,
    evidence: 5,
    description: "D2 淋巴结清扫术联合远端/全胃根治切除：亚洲及全球实体肿瘤根治的黄金标准，完整切除第一站及第二站区域淋巴结，显著降低局部复发率。",
  },
  {
    id: "FLOT4_PERIOP",
    label: "围手术期化疗\nFLOT4 三联方案",
    type: "guideline",
    x: 45,
    y: 35,
    connections: ["RECURRENCE_RISK_GAS", "OS_GASTRIC"],
    connectionTypes: {
      RECURRENCE_RISK_GAS: "protective",
      OS_GASTRIC: "protective",
    },
    studies: 45,
    evidence: 5,
    description: "FLOT4 方案（氟尿嘧啶 + 奥沙利铂 + 多西他赛）：局部进展期胃癌围手术期欧洲标准（术前4周期 + 术后4周期），显著提升 R0 切除率与病理完全缓解率 (pCR 16%)，中位 OS 突破 50 个月。",
  },
  {
    id: "SOX_XELOX_ADJ",
    label: "术后双药化疗\nSOX / XELOX",
    type: "guideline",
    x: 45,
    y: 52,
    connections: ["RECURRENCE_RISK_GAS", "OS_GASTRIC"],
    connectionTypes: {
      RECURRENCE_RISK_GAS: "protective",
      OS_GASTRIC: "protective",
    },
    studies: 52,
    evidence: 5,
    description: "亚洲经典术后辅助双药方案（RESOLVE / CLASSIC 研究）：D2 术后给予替吉奥/卡培他滨联合奥沙利铂 6 个月，显著降低 5 年复发风险，3 年 DFS 达 62% 以上。",
  },
  {
    id: "ZOLBETUXIMAB_RX",
    label: "Claudin 靶向药\n佐妥昔单抗",
    type: "guideline",
    x: 45,
    y: 68,
    connections: ["OS_GASTRIC"],
    connectionTypes: {
      OS_GASTRIC: "protective",
    },
    studies: 26,
    evidence: 5,
    description: "佐妥昔单抗 (Zolbetuximab)：靶向结合 Claudin 18.2 介导抗体依赖性细胞毒性 (ADCC)。全球 III 期 SPOTLIGHT / GLOW 研究证实其联合化疗显著延长中位 PFS 与 OS。",
  },
  {
    id: "TRASTUZUMAB_HER2",
    label: "HER2 靶向治疗\n曲妥珠 / T-DXd",
    type: "guideline",
    x: 45,
    y: 84,
    connections: ["OS_GASTRIC"],
    connectionTypes: {
      OS_GASTRIC: "protective",
    },
    studies: 40,
    evidence: 5,
    description: "抗 HER2 靶向治疗体系：一线曲妥珠单抗联合化疗作为基石；后线德曲妥珠单抗 (T-DXd) 带来超 40% 的高客观缓解率 (ORR) 与确凿生存延长。",
  },
  {
    id: "PD1_IMMUNO_GAS",
    label: "PD-1 免疫单抗\n纳武利尤/替雷利珠",
    type: "guideline",
    x: 45,
    y: 98,
    connections: ["OS_GASTRIC"],
    connectionTypes: {
      OS_GASTRIC: "protective",
    },
    studies: 46,
    evidence: 5,
    description: "PD-1 免疫单抗联合化疗：CheckMate-649 与 ORIENT-16 研究确立了晚期一线不可切除胃癌标准方案，在 PD-L1 CPS ≥5 患者中带来中位 OS 突破 14.4-15.2 个月的大幅获益。",
  },

  // --- Column 3: Intermediate Events & Toxicity (X = 70) ---
  {
    id: "PERITONEAL_METS_GAS",
    label: "腹膜种植转移\nCY1 / P1 播散",
    type: "outcome",
    x: 70,
    y: 25,
    connections: ["OS_GASTRIC"],
    connectionTypes: {
      OS_GASTRIC: "risk",
    },
    studies: 38,
    evidence: 5,
    description: "胃癌腹膜转移 (Peritoneal Metastasis)：晚期复发最常见形式。腹腔脱落细胞阳性 (CY1) 即视为 M1 期。规范化腹腔热灌注化疗 (HIPEC) 及全身联合化疗成为阻击关键。",
  },
  {
    id: "DUMPING_SYNDROME",
    label: "倾倒综合征\n切除术后消化不良",
    type: "outcome",
    x: 70,
    y: 50,
    connections: [],
    studies: 22,
    evidence: 4,
    description: "全胃或远端胃大部分切除术后高渗食糜急剧涌入空肠引发的早期/晚期倾倒综合征，伴心慌、出冷汗及贫血营养障碍，需采取少量多餐与高蛋白低碳水饮食干预。",
  },

  // --- Column 4: Ultimate Survival Endpoints (X = 85) ---
  {
    id: "RECURRENCE_RISK_GAS",
    label: "复发与转移风险\n5年 DFS 指标",
    type: "outcome",
    x: 85,
    y: 30,
    connections: ["OS_GASTRIC"],
    connectionTypes: {
      OS_GASTRIC: "risk",
    },
    studies: 65,
    evidence: 5,
    description: "5 年无病生存期 (DFS)：综合衡量浸润深度、淋巴结受累、脉管侵犯与术后辅助治疗依从性的核心结局指标。",
  },
  {
    id: "OS_GASTRIC",
    label: "总生存期\n5-yr OS 治愈率",
    type: "outcome",
    x: 85,
    y: 70,
    connections: [],
    studies: 80,
    evidence: 5,
    description: "5 年总生存率 (OS)：早期胃癌规范内镜与手术后 5 年 OS >90%；局部进展期经围术期综合治理后可达 50%-60% 以上。",
  },
];

/**
 * 胃癌关键证据连线详情 (顶刊前瞻性队列与森林图证据)
 */
export const GASTRIC_EDGE_EVIDENCE: Record<string, EdgeEvidence> = {
  "SURGERY_D2-RECURRENCE_RISK_GAS": {
    title: "D2 根治术降低胃癌局部与区域复发风险",
    description: "荷兰 15 年长期随访与 JCOG 经典试验表明，与 D1 手术相比，标准 D2 淋巴结清扫显著降低胃癌相关复发率与病死率。",
    metric: {
      label: "局部复发相对危险度",
      value: "RR 0.58",
      ci: "95% CI: 0.44 - 0.77",
      p: "p < 0.001"
    },
    forestData: [
      { study: "Dutch D1D2 15-Yr", year: 2010, hr: 0.65, ciLow: 0.51, ciHigh: 0.83 },
      { study: "JCOG9501 Trial",   year: 2008, hr: 0.72, ciLow: 0.56, ciHigh: 0.93 },
      { study: "Italian Gastric Group", year: 2014, hr: 0.60, ciLow: 0.45, ciHigh: 0.80 },
    ],
    studies: [
      {
        title: "15-year follow-up of a randomized trial comparing D1 and D2 lymphadenectomy for gastric cancer",
        journal: "Lancet Oncol",
        year: 2010,
        doi: "10.1016/S1470-2045(10)70070-X",
        conclusion: "D2 淋巴结清扫显著降低长期肿瘤相关病死率与局部区域复发。"
      }
    ]
  },
  "FLOT4_PERIOP-OS_GASTRIC": {
    title: "围手术期 FLOT 方案显著延长可切除胃癌总生存期",
    description: "全球顶刊 Lancet 发布的 FLOT4-AIO 试验确立了欧洲进展期胃癌围手术期化疗金标准，中位总生存期达到惊人的 50 个月。",
    metric: {
      label: "死亡风险比 (OS)",
      value: "HR 0.77",
      ci: "95% CI: 0.63 - 0.94",
      p: "p = 0.012"
    },
    forestData: [
      { study: "FLOT4-AIO (Lancet)", year: 2019, hr: 0.77, ciLow: 0.63, ciHigh: 0.94 },
      { study: "MAGIC Trial (ECF)",  year: 2006, hr: 0.75, ciLow: 0.60, ciHigh: 0.93 },
      { study: "FNCLCC ACCORD07",    year: 2011, hr: 0.69, ciLow: 0.50, ciHigh: 0.95 },
    ],
    studies: [
      {
        title: "Perioperative chemotherapy with fluorouracil plus leucovorin, oxaliplatin, and docetaxel versus fluorouracil or capecitabine plus cisplatin and epirubicin or doxorubicin (FLOT4): a multicentre, open-label, randomised phase 2/3 trial",
        journal: "Lancet",
        year: 2019,
        doi: "10.1016/S0140-6736(18)32557-1",
        conclusion: "FLOT 方案显著改善了病理完全缓解率 (16%) 与总体生存期 (中位 OS 50月 vs 35月)。"
      }
    ]
  },
  "SOX_XELOX_ADJ-RECURRENCE_RISK_GAS": {
    title: "D2 根治术后奥沙利铂双药辅助化疗巩固无病生存",
    description: "RESOLVE 与 CLASSIC 两大前瞻性 III 期试验证明，D2 术后 6 个月双药辅助化疗显著提升 3-5 年无病生存期。",
    metric: {
      label: "疾病复发风险比 (DFS)",
      value: "HR 0.79",
      ci: "95% CI: 0.62 - 0.99",
      p: "p = 0.045"
    },
    forestData: [
      { study: "RESOLVE (Lancet Oncol)", year: 2021, hr: 0.79, ciLow: 0.62, ciHigh: 0.99 },
      { study: "CLASSIC 5-Yr (Lancet Oncol)", year: 2014, hr: 0.58, ciLow: 0.47, ciHigh: 0.72 },
      { study: "ACTS-GC (NEJM)", year: 2007, hr: 0.68, ciLow: 0.52, ciHigh: 0.87 },
    ],
    studies: [
      {
        title: "Perioperative or postoperative adjuvant oxaliplatin with S-1 versus adjuvant oxaliplatin with capecitabine in locally advanced gastric or gastro-oesophageal junction adenocarcinoma (RESOLVE)",
        journal: "Lancet Oncol",
        year: 2021,
        doi: "10.1016/S1470-2045(21)00297-7",
        conclusion: "围手术期 SOX 或术后 SOX 辅助化疗均确立为中国乃至亚洲进展期胃癌标准治疗方案。"
      }
    ]
  },
  "ZOLBETUXIMAB_RX-OS_GASTRIC": {
    title: "佐妥昔单抗精准靶向 Claudin 18.2 延长晚期胃癌生存",
    description: "全球双盲前瞻性 III 期 SPOTLIGHT 试验表明，Claudin 18.2 阳性晚期胃癌患者接受佐妥昔单抗联合化疗，中位 PFS 与 OS 均获显著延长。",
    metric: {
      label: "总生存风险比 (OS)",
      value: "HR 0.75",
      ci: "95% CI: 0.60 - 0.94",
      p: "p = 0.0066"
    },
    forestData: [
      { study: "SPOTLIGHT (Lancet)", year: 2023, hr: 0.75, ciLow: 0.60, ciHigh: 0.94 },
      { study: "GLOW Trial (Nat Med)", year: 2023, hr: 0.77, ciLow: 0.61, ciHigh: 0.98 },
      { study: "FAST Phase II", year: 2021, hr: 0.55, ciLow: 0.39, ciHigh: 0.77 },
    ],
    studies: [
      {
        title: "Zolbetuximab plus mFOLFOX6 in patients with CLDN18.2-positive, HER2-negative, untreated, locally advanced unresectable or metastatic gastric or gastro-oesophageal junction adenocarcinoma (SPOTLIGHT): a multicentre, randomised, double-blind, phase 3 trial",
        journal: "Lancet",
        year: 2023,
        doi: "10.1016/S0140-6736(23)00620-7",
        conclusion: "佐妥昔单抗联合 mFOLFOX6 显著延长中位无进展生存期与总生存期，确立 Claudin 18.2 阳性晚期胃癌一线新标准。"
      }
    ]
  },
  "TRASTUZUMAB_HER2-OS_GASTRIC": {
    title: "曲妥珠单抗确立 HER2 阳性晚期胃癌靶向生存突破",
    description: "里程碑式 ToGA 研究奠定了 HER2 阳性胃癌分子分型靶向治疗基石，曲妥珠单抗联合化疗使高表达患者中位生存突破 16 个月。",
    metric: {
      label: "总生存风险比 (OS)",
      value: "HR 0.74",
      ci: "95% CI: 0.60 - 0.91",
      p: "p = 0.0046"
    },
    forestData: [
      { study: "ToGA Trial (Lancet)", year: 2010, hr: 0.74, ciLow: 0.60, ciHigh: 0.91 },
      { study: "KEYNOTE-811 (Lancet)", year: 2023, hr: 0.73, ciLow: 0.58, ciHigh: 0.92 },
      { study: "DESTINY-Gastric01 (NEJM)", year: 2020, hr: 0.59, ciLow: 0.39, ciHigh: 0.88 },
    ],
    studies: [
      {
        title: "Trastuzumab in combination with chemotherapy versus chemotherapy alone for treatment of HER2-positive advanced gastric or gastro-oesophageal junction cancer (ToGA): a randomised, open-label, phase 3 trial",
        journal: "Lancet",
        year: 2010,
        doi: "10.1016/S0140-6736(10)61121-X",
        conclusion: "曲妥珠单抗联合化疗使 HER2 强阳性患者中位 OS 从 11.8 个月大幅延长至 16.0 个月。"
      }
    ]
  },
  "PD1_IMMUNO_GAS-OS_GASTRIC": {
    title: "PD-1 免疫单抗联合化疗突破晚期胃癌生存瓶颈",
    description: "全球前瞻性 III 期 CheckMate-649 与 ORIENT-16 试验证明，PD-1 单抗联合化疗使 PD-L1 CPS ≥5 的胃癌患者死亡风险下降约 30%。",
    metric: {
      label: "总生存风险比 (CPS ≥5)",
      value: "HR 0.71",
      ci: "95% CI: 0.59 - 0.86",
      p: "p < 0.0001"
    },
    forestData: [
      { study: "CheckMate-649 (Lancet)", year: 2021, hr: 0.71, ciLow: 0.59, ciHigh: 0.86 },
      { study: "ORIENT-16 (JAMA)", year: 2023, hr: 0.68, ciLow: 0.54, ciHigh: 0.85 },
      { study: "KEYNOTE-859 (Lancet Oncol)", year: 2023, hr: 0.78, ciLow: 0.70, ciHigh: 0.87 },
    ],
    studies: [
      {
        title: "First-line nivolumab plus chemotherapy versus chemotherapy alone for advanced gastric, gastro-oesophageal junction, and oesophageal adenocarcinoma (CheckMate 649): a randomised, open-label, phase 3 trial",
        journal: "Lancet",
        year: 2021,
        doi: "10.1016/S0140-6736(21)00797-2",
        conclusion: "PD-1 免疫联合化疗在一线 CPS ≥5 晚期胃癌中显著延长中位 OS (14.4月 vs 11.1月)。"
      }
    ]
  }
};

/**
 * 依据胃癌患者画像动态激活知识节点
 */
export function getGastricNodeActivation(nodeId: string, profile: PatientProfile | null): "primary" | "active" | "warning" | "dim" | "normal" {
  if (!profile) return "normal";

  const raw = (profile as any).cancerSpecificData || (profile as any).gastricData || profile;
  const isHer2Pos = raw.her2Status === "positive" || raw.her2Status === "3+";
  const isClaudinPos = raw.claudin18_2Status === "positive" || raw.claudinPositive;
  const isMsiH = raw.msiStatus === "MSI-H" || raw.dmmrStatus === "dMMR";
  const stage = String(profile.stage || profile.tStage || "").toUpperCase();

  switch (nodeId) {
    case "HER2_STATUS_GAS":
      return isHer2Pos ? "active" : "normal";
    case "TRASTUZUMAB_HER2":
      return isHer2Pos ? "primary" : "normal";
    case "CLAUDIN_18_2":
      return isClaudinPos ? "active" : "normal";
    case "ZOLBETUXIMAB_RX":
      return isClaudinPos ? "primary" : "normal";
    case "MSI_PDL1_GAS":
      return isMsiH || (raw.pdl1Cps && raw.pdl1Cps >= 5) ? "active" : "normal";
    case "PD1_IMMUNO_GAS":
      return isMsiH || (raw.pdl1Cps && raw.pdl1Cps >= 5) ? "primary" : "normal";
    case "FLOT4_PERIOP":
      return stage.startsWith("II") || stage.startsWith("III") ? "primary" : "normal";
    case "SOX_XELOX_ADJ":
      return stage.startsWith("II") || stage.startsWith("III") ? "active" : "normal";
    case "D2_LYMPH_NODES":
      return profile.nStage && profile.nStage !== "N0" ? "warning" : "normal";
    case "PERITONEAL_METS_GAS":
      return raw.hasPeritonealMets || raw.peritonealCytology === "CY1" ? "warning" : "dim";
    default:
      return "normal";
  }
}
