import type { KnowledgeNode, EdgeEvidence } from "./knowledgeGraphData";
import type { PatientProfile } from "@/lib/types";

export const COLORECTAL_GRAPH_NODES: KnowledgeNode[] = [
  // --- Column 1: Upstream Pathological & Molecular Factors (X = 15) ---
  {
    id: "T_DEPTH",
    label: "浸润深度\nT1 - T4",
    type: "factor",
    x: 15,
    y: 12,
    connections: ["SURGERY_TME", "IDEA_CAPOX", "RECURRENCE_RISK"],
    connectionTypes: {
      SURGERY_TME: "guides",
      IDEA_CAPOX: "guides",
      RECURRENCE_RISK: "risk",
    },
    studies: 52,
    evidence: 5,
    description: "T 分期浸润深度：从黏膜下层 (T1)、固有肌层 (T2)、浆膜下 (T3) 到穿透脏层腹膜 (T4a) 或侵犯邻近器官 (T4b)。T4 属于重大高危病理指标，决定辅助化疗强化强度。",
  },
  {
    id: "N_NODES",
    label: "淋巴结清扫\n≥12枚 / N+",
    type: "factor",
    x: 15,
    y: 26,
    connections: ["IDEA_CAPOX", "RECURRENCE_RISK"],
    connectionTypes: {
      IDEA_CAPOX: "guides",
      RECURRENCE_RISK: "risk",
    },
    studies: 48,
    evidence: 5,
    description: "区域淋巴结清扫总数及转移枚数：国际质控红线要求送检 ≥12 枚。转移淋巴结数量将患者精准分流至 N1a (1枚)、N1b (2-3枚)、N2a (4-6枚) 或 N2b (≥7枚)。",
  },
  {
    id: "TUMOR_DEPOSITS",
    label: "肿瘤沉积\nTD / N1c",
    type: "factor",
    x: 15,
    y: 40,
    connections: ["IDEA_CAPOX", "RECURRENCE_RISK"],
    connectionTypes: {
      IDEA_CAPOX: "guides",
      RECURRENCE_RISK: "risk",
    },
    studies: 30,
    evidence: 4,
    description: "肿瘤沉积 (Tumor Deposits)：无淋巴结残存结构的浆膜下独立癌结节。AJCC 8th 标准下若无淋巴结转移但存在 TD，严格判定为 N1c 期，提示高侵袭与化疗指征。",
  },
  {
    id: "MSI_MMR",
    label: "错配修复\ndMMR / MSI-H",
    type: "factor",
    x: 15,
    y: 54,
    connections: ["PD1_IMMUNO", "IDEA_CAPOX", "LONG_TERM_OS"],
    connectionTypes: {
      PD1_IMMUNO: "guides",
      IDEA_CAPOX: "guides",
      LONG_TERM_OS: "protective",
    },
    studies: 42,
    evidence: 5,
    description: "错配修复缺陷 (dMMR / MSI-H)：导致超高肿瘤突变负荷 (TMB)。II期结肠癌提示良好预后且对单药氟尿嘧啶化疗耐药（推荐免化疗）；晚期患者则对 PD-1 免疫单抗产生惊艳持久应答 (KEYNOTE-177)。",
  },
  {
    id: "RAS_GENE",
    label: "RAS 状态\nKRAS / NRAS",
    type: "factor",
    x: 15,
    y: 68,
    connections: ["ANTI_EGFR", "ANTI_VEGF"],
    connectionTypes: {
      ANTI_EGFR: "guides",
      ANTI_VEGF: "guides",
    },
    studies: 56,
    evidence: 5,
    description: "KRAS / NRAS 外显子 2/3/4 突变状态：抗 EGFR 单抗（西妥昔单抗/帕尼单抗）的绝对疗效预测标志物。突变型患者 MAPK 通路下游持续活化，抗 EGFR 单抗完全无效，须选用贝伐珠单抗方案。",
  },
  {
    id: "BRAF_GENE",
    label: "BRAF 突变\nV600E",
    type: "factor",
    x: 15,
    y: 82,
    connections: ["BEACON_RX", "RECURRENCE_RISK"],
    connectionTypes: {
      BEACON_RX: "guides",
      RECURRENCE_RISK: "risk",
    },
    studies: 28,
    evidence: 5,
    description: "BRAF V600E 基因突变：结直肠癌最凶险的难治亚型，传统化疗耐药。BEACON CRC 研究确立了恩考芬尼 (BRAF抑制剂) 联合西妥昔单抗的双靶无化疗破局方案。",
  },
  {
    id: "SIDEDNESS",
    label: "原发部位\n左半 vs 右半",
    type: "factor",
    x: 15,
    y: 95,
    connections: ["ANTI_EGFR", "ANTI_VEGF"],
    connectionTypes: {
      ANTI_EGFR: "guides",
      ANTI_VEGF: "guides",
    },
    studies: 35,
    evidence: 5,
    description: "左右半结肠生物学差异：脾曲以远的左半结直肠癌对西妥昔单抗极度敏感；盲肠至横结肠的右半结肠癌多伴高突变与免疫抑制，推荐抗 VEGF 联合方案。",
  },

  // --- Column 2: Clinical Decisions & Interventions (X = 45) ---
  {
    id: "SURGERY_TME",
    label: "根治切除\nTME / ESD",
    type: "guideline",
    x: 45,
    y: 18,
    connections: ["RECURRENCE_RISK", "LONG_TERM_OS"],
    connectionTypes: {
      RECURRENCE_RISK: "protective",
      LONG_TERM_OS: "protective",
    },
    studies: 60,
    evidence: 5,
    description: "全直肠系膜切除术 (TME) 及完整结肠系膜切除 (CME)：实体肿瘤治愈的最核心基石。确保环周切缘 (CRM) 阴性与足够淋巴结清扫。",
  },
  {
    id: "IDEA_CAPOX",
    label: "辅助化疗\nIDEA 3月/6月",
    type: "guideline",
    x: 45,
    y: 35,
    connections: ["NEUROTOXICITY", "RECURRENCE_RISK"],
    connectionTypes: {
      NEUROTOXICITY: "risk",
      RECURRENCE_RISK: "protective",
    },
    studies: 45,
    evidence: 5,
    description: "IDEA 研究指导的辅助化疗：低危 III 期 (T1-3 N1) 推荐 3 个月 CAPOX 减毒方案；高危 III 期 (T4 或 N2) 推荐 6 个月 CAPOX 或 FOLFOX 足疗程强化。",
  },
  {
    id: "PD1_IMMUNO",
    label: "免疫治疗\nPD-1 单抗",
    type: "guideline",
    x: 45,
    y: 52,
    connections: ["RECURRENCE_RISK", "LONG_TERM_OS"],
    connectionTypes: {
      RECURRENCE_RISK: "protective",
      LONG_TERM_OS: "protective",
    },
    studies: 38,
    evidence: 5,
    description: "PD-1 免疫检查点抑制剂（帕博利珠单抗/替雷利珠单抗/恩沃利单抗）：针对 dMMR/MSI-H 患者带来持久抗肿瘤应答与长期高质量生存。",
  },
  {
    id: "ANTI_EGFR",
    label: "抗 EGFR 单抗\n西妥昔单抗",
    type: "guideline",
    x: 45,
    y: 70,
    connections: ["LONG_TERM_OS"],
    connectionTypes: {
      LONG_TERM_OS: "protective",
    },
    studies: 50,
    evidence: 5,
    description: "抗 EGFR 单抗：严格限定用于全 RAS/BRAF 野生型且原发于左半结直肠癌的患者，诱发早期肿瘤深度退缩 (ETS) 并显著延长中位总生存期。",
  },
  {
    id: "ANTI_VEGF",
    label: "抗血管生成\n贝伐珠/呋喹替尼",
    type: "guideline",
    x: 45,
    y: 86,
    connections: ["LONG_TERM_OS"],
    connectionTypes: {
      LONG_TERM_OS: "protective",
    },
    studies: 55,
    evidence: 5,
    description: "抗血管生成治疗体系：一线贝伐珠单抗联合化疗作为右半或 RAS 突变患者基石；三线呋喹替尼与瑞戈非尼提供强效后线阻击生存延长。",
  },

  // --- Column 3: Intermediate Outcomes & Toxicity (X = 70) ---
  {
    id: "NEUROTOXICITY",
    label: "外周神经毒性\n奥沙利铂蓄积",
    type: "outcome",
    x: 70,
    y: 35,
    connections: [],
    studies: 25,
    evidence: 5,
    description: "奥沙利铂剂量累积性神经毒性：长期用药引发肢端麻木或感觉异常。IDEA 3 个月 CAPOX 方案可使 3 级神经毒性风险骤降 81%。",
  },

  // --- Column 4: Ultimate Survival Endpoints (X = 88) ---
  {
    id: "RECURRENCE_RISK",
    label: "5年复发风险\nDFS / RFS",
    type: "outcome",
    x: 88,
    y: 35,
    connections: ["LONG_TERM_OS"],
    connectionTypes: {
      LONG_TERM_OS: "risk",
    },
    studies: 80,
    evidence: 5,
    description: "无病生存率 (DFS)：结直肠癌术后复发 85% 发生在 3 年内，满 5 年未复发即达到临床治愈标准。",
  },
  {
    id: "LONG_TERM_OS",
    label: "长期总生存率\n5-Year OS",
    type: "outcome",
    x: 88,
    y: 65,
    connections: [],
    studies: 90,
    evidence: 5,
    description: "5 年总生存率 (OS)：早期结直肠癌根治切除后 5 年 OS >90%；通过 MDT 多学科转化切除与精准靶向免疫，晚期 mCRC 中位生存期已突破 3 年以上。",
  },
];

export const COLORECTAL_EDGE_EVIDENCE: Record<string, EdgeEvidence> = {
  "T_DEPTH->IDEA_CAPOX": {
    title: "T 分期浸润深度指导辅助化疗疗程决策",
    description: "IDEA 研究证实 T4 病变具有极高复发风险，即便 N1 也建议完成 6 个月足疗程强化辅助化疗以保障局部与远处控制。",
    metric: { label: "T4复发风险增幅", value: "+42%", ci: "1.24 - 1.63", p: "<0.001" },
    studies: [
      {
        title: "Duration of Adjuvant Chemotherapy for Stage III Colon Cancer",
        journal: "NEJM",
        year: 2018,
        doi: "10.1056/NEJMoa1713709",
        conclusion: "T4 及 N2 患者归入高危组，推荐 6 个月 CAPOX 或 FOLFOX 辅助化疗。"
      }
    ]
  },
  "N_NODES->IDEA_CAPOX": {
    title: "淋巴结转移数目驱动 IDEA 低危 vs 高危分流",
    description: "N1 (1-3枚) 与 N2 (≥4枚) 是结直肠癌辅助化疗最坚实的独立预后分流标尺，指导 CAPOX 3个月减毒或6个月强化。",
    metric: { label: "N2 vs N1 复发风险比 (HR)", value: "1.85", ci: "1.62 - 2.11", p: "<0.0001" },
    studies: [
      {
        title: "Adjuvant Chemotherapy for Stage III Colon Cancer: JCO 2020",
        journal: "JCO",
        year: 2020,
        doi: "10.1200/JCO.20.01800",
        conclusion: "低危亚组 (T1-3N1) 3 个月 CAPOX 生存完全非劣于 6 个月。"
      }
    ]
  },
  "MSI_MMR->PD1_IMMUNO": {
    title: "dMMR/MSI-H 驱动 PD-1 免疫单抗一线颠覆性疗效",
    description: "KEYNOTE-177 里程碑 RCT 证实单药帕博利珠单抗使 dMMR/MSI-H 晚期结直肠癌 PFS 翻倍，疾病进展风险降低 40%。",
    metric: { label: "PFS 风险比 (HR)", value: "0.60", ci: "0.45 - 0.80", p: "0.0002" },
    studies: [
      {
        title: "Pembrolizumab in Microsatellite-Instability-High Advanced Colorectal Cancer",
        journal: "NEJM",
        year: 2020,
        doi: "10.1056/NEJMoa2020694",
        conclusion: "一线单药帕博利珠单抗成为 dMMR 转移性结直肠癌新的金标准。"
      }
    ]
  },
  "RAS_GENE->ANTI_EGFR": {
    title: "全 RAS 野生型作为西妥昔单抗敏感性的先决红线",
    description: "全 RAS 外显子 2/3/4 检测是结直肠癌靶向治疗的金标准前置检查，野生型左半患者使用抗 EGFR 可显著延长总生存期。",
    metric: { label: "野生型中位OS延长", value: "+8.1月", ci: "5.4 - 11.2", p: "0.004" },
    studies: [
      {
        title: "FIRE-3: FOLFIRI plus cetuximab vs bevacizumab in mCRC",
        journal: "Lancet Oncol",
        year: 2014,
        doi: "10.1016/S1470-2045(14)70330-4",
        conclusion: "RAS 野生型患者接受西妥昔单抗带来显著的总生存期获益。"
      }
    ]
  }
};

/**
 * 依据结直肠癌患者真实画像激活对应知识图谱节点高亮
 */
export function getColorectalNodeActivation(nodeId: string, profile: PatientProfile | null): "primary" | "active" | "warning" | "dim" | "normal" {
  if (!profile) return "normal";

  const rawData = (profile as any).clinicalData || (profile as any).cancerSpecificData || profile;
  const isMsiH = rawData.msiStatus === "MSI-H" || rawData.dmmrStatus === "dMMR";
  const isRasMut = rawData.krasMutation && rawData.krasMutation !== "wildtype" && rawData.krasMutation !== "unknown";
  const stage = String(profile.stage || profile.tStage || "").toUpperCase();

  switch (nodeId) {
    case "MSI_MMR":
      return isMsiH ? "active" : "normal";
    case "PD1_IMMUNO":
      return isMsiH ? "primary" : "normal";
    case "RAS_GENE":
      return isRasMut ? "warning" : "active";
    case "ANTI_EGFR":
      return !isRasMut && rawData.primaryLocation === "left_colon" ? "primary" : isRasMut ? "dim" : "normal";
    case "ANTI_VEGF":
      return isRasMut || rawData.primaryLocation === "right_colon" ? "primary" : "normal";
    case "IDEA_CAPOX":
      return stage.startsWith("III") ? "primary" : "normal";
    case "T_DEPTH":
      return profile.tStage?.startsWith("T4") ? "warning" : "normal";
    case "N_NODES":
      return profile.nStage && profile.nStage !== "N0" ? "warning" : "normal";
    default:
      return "normal";
  }
}
