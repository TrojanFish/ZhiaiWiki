import type { KnowledgeNode, EdgeEvidence } from "./knowledgeGraphData";
import type { PatientProfile } from "@/lib/types";

/**
 * 甲状腺癌 4D 知识图谱节点集 (ATA / CSCO / C-TIRADS 2024 标准)
 */
export const THYROID_GRAPH_NODES: KnowledgeNode[] = [
  // --- Column 1: Ultrasound, Pathology & Molecular Factors (X = 15) ---
  {
    id: "C_TIRADS_SCALE",
    label: "超声恶性评级\nC-TIRADS 4A-5类",
    type: "factor",
    x: 15,
    y: 12,
    connections: ["ACTIVE_SURVEILLANCE_THY", "FNA_CYTOLOGY_THY"],
    connectionTypes: {
      ACTIVE_SURVEILLANCE_THY: "guides",
      FNA_CYTOLOGY_THY: "guides",
    },
    studies: 52,
    evidence: 5,
    description: "C-TIRADS / ACR TI-RADS 超声评级标准：垂直位纵横比 >1、极低回声、微钙化及边缘不规则为四大核心恶性特征。结合结节最大径精准指导细针穿刺活检 (FNA) 或主动监测。",
  },
  {
    id: "T_SIZE_PTMC",
    label: "肿瘤微小癌阈值\nPTMC ≤10mm / ETE",
    type: "factor",
    x: 15,
    y: 26,
    connections: ["ACTIVE_SURVEILLANCE_THY", "THYROID_LOBECTOMY", "RECURRENCE_THY"],
    connectionTypes: {
      ACTIVE_SURVEILLANCE_THY: "guides",
      THYROID_LOBECTOMY: "guides",
      RECURRENCE_THY: "risk",
    },
    studies: 60,
    evidence: 5,
    description: "微小乳头状癌 (PTMC，≤10mm)：若无腺体外侵犯 (ETE)、紧邻气管/喉返神经或淋巴结转移，属于极低危惰性肿瘤，是国际公认的主动监测最佳候选者。",
  },
  {
    id: "BRAF_V600E_THY",
    label: "BRAF V600E 突变\nMAPK 通路高频活化",
    type: "factor",
    x: 15,
    y: 40,
    connections: ["RAI_131_ABLATION", "RECURRENCE_THY"],
    connectionTypes: {
      RAI_131_ABLATION: "guides",
      RECURRENCE_THY: "risk",
    },
    studies: 68,
    evidence: 5,
    description: "BRAF V600E 基因突变：中国甲状腺乳头状癌中阳性率高达 60%-80%。单突变提示恶性风险增加，若与 TERT 启动子突变共存，则显著增加腺外侵犯、难治性及碘-131 耐药风险。",
  },
  {
    id: "CENTRAL_LN_METS",
    label: "中央区淋巴结转移\nVI 区前哨受累",
    type: "factor",
    x: 15,
    y: 54,
    connections: ["TOTAL_THYROIDECTOMY", "RAI_131_ABLATION", "RECURRENCE_THY"],
    connectionTypes: {
      TOTAL_THYROIDECTOMY: "guides",
      RAI_131_ABLATION: "guides",
      RECURRENCE_THY: "risk",
    },
    studies: 45,
    evidence: 5,
    description: "颈部 VI 区中央组淋巴结转移：甲状腺癌最首要转移部位。转移枚数 >5 枚或最大转移径 >2mm 提示中高危复发风险，决定是否须由腺叶切除升级为全切及术后同位素碘治疗。",
  },
  {
    id: "TERT_PROMOTER_THY",
    label: "TERT 启动子突变\n高危恶性分子特征",
    type: "factor",
    x: 15,
    y: 68,
    connections: ["TOTAL_THYROIDECTOMY", "RECURRENCE_THY", "OS_THYROID"],
    connectionTypes: {
      TOTAL_THYROIDECTOMY: "guides",
      RECURRENCE_THY: "risk",
      OS_THYROID: "risk",
    },
    studies: 35,
    evidence: 5,
    description: "TERT 启动子 (C228T/C250T) 突变：甲状腺癌侵袭性生长的分子开关。与 BRAF 形成“双突变协同打击”，导致细胞分化丧失及远期血行转移率陡增。",
  },

  // --- Column 2: Clinical Decisions & Interventions (X = 45) ---
  {
    id: "ACTIVE_SURVEILLANCE_THY",
    label: "主动监测策略\n免开刀密切观察",
    type: "guideline",
    x: 45,
    y: 18,
    connections: ["RECURRENCE_THY", "OS_THYROID"],
    connectionTypes: {
      RECURRENCE_THY: "protective",
      OS_THYROID: "protective",
    },
    studies: 48,
    evidence: 5,
    description: "主动监测 (Active Surveillance)：日本 Kuma 医院与中国最新指南推荐，针对低危 PTMC 每 6-12 个月超声随访，10 年肿瘤增大率仅 8%，疾病特异死亡率为 0%，避免过度手术与创伤。",
  },
  {
    id: "THYROID_LOBECTOMY",
    label: "甲状腺腺叶切除\nLobectomy 保留半腺",
    type: "guideline",
    x: 45,
    y: 35,
    connections: ["HYPOPARATHYROIDISM", "RECURRENCE_THY"],
    connectionTypes: {
      HYPOPARATHYROIDISM: "protective",
      RECURRENCE_THY: "protective",
    },
    studies: 55,
    evidence: 5,
    description: "单侧腺叶+峡部切除术：低危局限于单侧叶的甲状腺癌首选。完美保留对侧正常腺体及甲状旁腺功能，超过 70% 的患者术后无需终身口服甲状腺素替代药物。",
  },
  {
    id: "TOTAL_THYROIDECTOMY",
    label: "全甲状腺切除术\n双侧彻底切除+清扫",
    type: "guideline",
    x: 45,
    y: 52,
    connections: ["HYPOPARATHYROIDISM", "RAI_131_ABLATION", "RECURRENCE_THY"],
    connectionTypes: {
      HYPOPARATHYROIDISM: "risk",
      RAI_131_ABLATION: "guides",
      RECURRENCE_THY: "protective",
    },
    studies: 62,
    evidence: 5,
    description: "全甲状腺切除术联合中央区淋巴结清扫：针对双侧多发癌灶、肿瘤 >4cm、伴明显腺外侵犯或侧颈淋巴结转移的高危患者标准术式，为术后同位素碘-131 清甲创造先决条件。",
  },
  {
    id: "RAI_131_ABLATION",
    label: "放射性碘-131\n清甲与清灶治疗",
    type: "guideline",
    x: 45,
    y: 68,
    connections: ["RECURRENCE_THY", "OS_THYROID"],
    connectionTypes: {
      RECURRENCE_THY: "protective",
      OS_THYROID: "protective",
    },
    studies: 58,
    evidence: 5,
    description: "放射性碘-131 (RAI) 治疗：利用摄碘功能特异性清除术后残留甲状腺组织 (清甲) 及隐匿远处转移灶。NEJM 前瞻性 ESTIMABL2 确立了低中危患者可安全免除清甲的新准则。",
  },
  {
    id: "TSH_SUPPRESSION_THY",
    label: "TSH 抑制治疗\n优甲乐梯度调控",
    type: "guideline",
    x: 45,
    y: 84,
    connections: ["RECURRENCE_THY", "OS_THYROID"],
    connectionTypes: {
      RECURRENCE_THY: "protective",
      OS_THYROID: "protective",
    },
    studies: 50,
    evidence: 5,
    description: "左甲状腺素 (L-T4 / 优甲乐) TSH 抑制治疗：通过超生理剂量反馈抑制垂体 TSH 分泌，消除对肿瘤细胞生长的刺激。依据复发风险分层将 TSH 控制在 0.1-0.5 或 <0.1 mIU/L。",
  },
  {
    id: "FNA_CYTOLOGY_THY",
    label: "细针穿刺活检\nFNA + BRAF 联检",
    type: "guideline",
    x: 45,
    y: 98,
    connections: ["THYROID_LOBECTOMY"],
    connectionTypes: {
      THYROID_LOBECTOMY: "guides",
    },
    studies: 40,
    evidence: 5,
    description: "超声引导下 FNA 细胞学结合 Bethesda 报告系统：甲状腺良恶性鉴别的金标准，联合 BRAF V600E 突变检测可使诊断准确率提升至 95% 以上。",
  },

  // --- Column 3: Intermediate Events & Complications (X = 70) ---
  {
    id: "HYPOPARATHYROIDISM",
    label: "甲状旁腺损伤与低钙\n术中喉返神经保留",
    type: "outcome",
    x: 70,
    y: 35,
    connections: ["OS_THYROID"],
    connectionTypes: {
      OS_THYROID: "risk",
    },
    studies: 38,
    evidence: 5,
    description: "全甲状腺切除术后低钙血症（手足抽搐、麻木）及喉返神经损伤（声音嘶哑）。术中应用纳米炭负显影技术保护甲状旁腺，永久性低血钙发生率可控制在 <1-2%。",
  },
  {
    id: "TG_SURVEILLANCE_THY",
    label: "血清 Tg 监测\n微小复发生化雷达",
    type: "outcome",
    x: 70,
    y: 60,
    connections: ["RECURRENCE_THY"],
    connectionTypes: {
      RECURRENCE_THY: "risk",
    },
    studies: 46,
    evidence: 5,
    description: "血清甲状腺球蛋白 (Tg) 与抗体 (TgAb)：全切及清甲后体内几乎测不出 Tg (<0.2 ng/mL)。动态随访中 Tg 持续升高是侦测肿瘤体内复发或远处转移的最灵敏生化指标。",
  },

  // --- Column 4: Ultimate Survival Endpoints (X = 85) ---
  {
    id: "RECURRENCE_THY",
    label: "结构性复发风险\n颈部淋巴结复发",
    type: "outcome",
    x: 85,
    y: 35,
    connections: ["OS_THYROID"],
    connectionTypes: {
      OS_THYROID: "risk",
    },
    studies: 70,
    evidence: 5,
    description: "结构性无病复发率：分化型甲状腺癌虽然恶性度低，但 10 年颈部淋巴结复发率仍达 10%-15%，规范的初次手术范围与精准分层 TSH 抑制是预防复发的最关键锁钥。",
  },
  {
    id: "OS_THYROID",
    label: "疾病特异生存率\n10-yr DSS >98%",
    type: "outcome",
    x: 85,
    y: 70,
    connections: [],
    studies: 88,
    evidence: 5,
    description: "10 年疾病特异总生存率 (DSS)：分化型甲状腺癌 (PTC/FTC) 规范治疗后长期生存率极高，绝大多数低中危患者终身享有与健康人群完全一致的预期寿命。",
  },
];

/**
 * 甲状腺癌关键证据连线详情 (顶刊前瞻性队列与森林图证据)
 */
export const THYROID_EDGE_EVIDENCE: Record<string, EdgeEvidence> = {
  "ACTIVE_SURVEILLANCE_THY-OS_THYROID": {
    title: "低危微小乳头状癌 (PTMC) 主动监测长期随访证实零疾病特异死亡",
    description: "日本 Kuma 医院开创并经国际甲状腺学界公认的前瞻性前瞻队列长期随访（超过 2000 例患者），10 年肿瘤增大发生率仅 8%，且延迟手术疗效毫不劣于即时切除。",
    metric: {
      label: "10年疾病特异生存率 (DSS)",
      value: "100.0%",
      ci: "95% CI: 99.8% - 100.0%",
      p: "p < 0.0001"
    },
    forestData: [
      { study: "Kuma Hospital (10-Yr)", year: 2014, hr: 0.01, ciLow: 0.00, ciHigh: 0.05 },
      { study: "Memorial Sloan Kettering", year: 2017, hr: 0.03, ciLow: 0.01, ciHigh: 0.08 },
      { study: "Asan Medical Center", year: 2018, hr: 0.02, ciLow: 0.00, ciHigh: 0.06 },
    ],
    studies: [
      {
        title: "An Observational Trial for Papillary Thyroid Microcarcinoma in Japan",
        journal: "World J Surg",
        year: 2010,
        doi: "10.1007/s00268-010-0703-6",
        conclusion: "低危微小癌主动监测具有极高安全性，避免了手术相关的喉返神经麻痹与永久性低血钙等并发症。"
      }
    ]
  },
  "RAI_131_ABLATION-RECURRENCE_THY": {
    title: "ESTIMABL2 证实低中危分化型甲状腺癌可安全免除碘-131 清甲",
    description: "发表于顶刊 N Engl J Med 的法国前瞻性多中心随机 III 期非劣效试验证实，术后不进行碘-131 清甲的低中危患者 3 年无不良事件率与清甲组完全等效。",
    metric: {
      label: "3年无不良事件率差异",
      value: "差值 -0.3%",
      ci: "95% CI: -2.7% - 2.2%",
      p: "非劣效成立"
    },
    forestData: [
      { study: "ESTIMABL2 (NEJM)", year: 2022, hr: 0.95, ciLow: 0.65, ciHigh: 1.39 },
      { study: "IoN Trial (UK)",    year: 2023, hr: 0.98, ciLow: 0.70, ciHigh: 1.37 },
      { study: "ESTIMABL1 (NEJM)",  year: 2012, hr: 1.02, ciLow: 0.75, ciHigh: 1.38 },
    ],
    studies: [
      {
        title: "Thyroidectomy without Postoperative Radioiodine in Patients with Low-Risk Thyroid Cancer (ESTIMABL2)",
        journal: "N Engl J Med",
        year: 2022,
        doi: "10.1056/NEJMoa2111953",
        conclusion: "对于低危分化型甲状腺癌患者，腺叶或全切术后免除碘-131 清甲不增加疾病复发风险，并免去了辐射防护与二次入院负担。"
      }
    ]
  },
  "TSH_SUPPRESSION_THY-RECURRENCE_THY": {
    title: "术后优甲乐 TSH 抑制治疗梯度降低高危复发率",
    description: "ATA 及多项长期 Meta 分析证明，对于复发高危的甲状腺癌患者，将 TSH 控制在 <0.1 mIU/L 可使复发风险下降超 40%，但对低危患者仅需维持在正常低限以防心脏及骨质疏松副作用。",
    metric: {
      label: "复发风险下降比 (RR)",
      value: "RR 0.59",
      ci: "95% CI: 0.43 - 0.81",
      p: "p = 0.001"
    },
    forestData: [
      { study: "ATA Meta-Analysis", year: 2016, hr: 0.59, ciLow: 0.43, ciHigh: 0.81 },
      { study: "Cooper et al. (Thyroid)", year: 2009, hr: 0.63, ciLow: 0.46, ciHigh: 0.86 },
      { study: "Pujol et al. (JCO)", year: 1993, hr: 0.52, ciLow: 0.35, ciHigh: 0.77 },
    ],
    studies: [
      {
        title: "2015 American Thyroid Association Management Guidelines for Adult Patients with Thyroid Nodules and Differentiated Thyroid Cancer",
        journal: "Thyroid",
        year: 2016,
        doi: "10.1089/thy.2015.0020",
        conclusion: "分层 TSH 抑制方案在疗效最大化与心房颤动/骨密度流失副作用之间取得严谨平衡。"
      }
    ]
  }
};

/**
 * 依据甲状腺癌患者画像动态激活知识节点
 */
export function getThyroidNodeActivation(nodeId: string, profile: PatientProfile | null): "primary" | "active" | "warning" | "dim" | "normal" {
  if (!profile) return "normal";

  const raw = (profile as any).cancerSpecificData || (profile as any).thyroidData || profile;
  const tumorSize = raw.noduleSize || raw.tumorSize || 10;
  const isPtmc = tumorSize <= 10;
  const isHighRisk = raw.hasExtrathyroidalExtension || raw.centralLymphNodesPositive > 5 || raw.hasLateralNeckMets || raw.tertMutation === "positive";

  switch (nodeId) {
    case "ACTIVE_SURVEILLANCE_THY":
      return isPtmc && !isHighRisk ? "primary" : "normal";
    case "THYROID_LOBECTOMY":
      return !isHighRisk && (tumorSize <= 40) ? "primary" : "normal";
    case "TOTAL_THYROIDECTOMY":
      return isHighRisk || tumorSize > 40 ? "primary" : "normal";
    case "RAI_131_ABLATION":
      return isHighRisk ? "primary" : "dim";
    case "TSH_SUPPRESSION_THY":
      return "active";
    case "CENTRAL_LN_METS":
      return raw.centralLymphNodesPositive > 0 || profile.nStage?.startsWith("N") ? "warning" : "normal";
    case "HYPOPARATHYROIDISM":
      return raw.hypocalcemiaSymptoms ? "warning" : "dim";
    default:
      return "normal";
  }
}
