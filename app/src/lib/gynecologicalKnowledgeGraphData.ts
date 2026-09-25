import type { KnowledgeNode, EdgeEvidence } from "./knowledgeGraphData";
import type { PatientProfile } from "@/lib/types";

// ============================================================================
// 子宫内膜癌 4D 知识图谱节点与证据集 (FIGO 2023 / NCCN / ESGO 标准)
// ============================================================================

export const ENDOMETRIAL_GRAPH_NODES: KnowledgeNode[] = [
  // --- Column 1: Pathological & Molecular Factors (X = 15) ---
  {
    id: "TCGA_MOLECULAR_ENDO",
    label: "TCGA 四分子分型\nPOLE/MSI/低拷贝/p53",
    type: "factor",
    x: 15,
    y: 12,
    connections: ["PORTEC_ADJ_CHEMORT", "LENVA_PEMBRO_ENDO", "RECURRENCE_ENDO"],
    connectionTypes: {
      PORTEC_ADJ_CHEMORT: "guides",
      LENVA_PEMBRO_ENDO: "guides",
      RECURRENCE_ENDO: "risk",
    },
    studies: 65,
    evidence: 5,
    description: "TCGA 综合分子分型（国际金标准）：① POLE 突变型（极佳预后，可豁免化疗）；② MSI-H / dMMR 型（高度免疫敏感）；③ 低拷贝/无特异分子改变 NSMP（中危）；④ p53 异常高拷贝型（极高危侵袭，需强化化放疗）。",
  },
  {
    id: "FIGO_2023_STAGING",
    label: "FIGO 2023 分期\n分子病理整合分期",
    type: "factor",
    x: 15,
    y: 26,
    connections: ["STAGING_SURGERY_SLNB", "PORTEC_ADJ_CHEMORT", "RECURRENCE_ENDO"],
    connectionTypes: {
      STAGING_SURGERY_SLNB: "guides",
      PORTEC_ADJ_CHEMORT: "guides",
      RECURRENCE_ENDO: "risk",
    },
    studies: 50,
    evidence: 5,
    description: "FIGO 2023 最新分期系统：破天荒地将分子分型整合入解剖分期。例如 I-II 期 POLE 突变直接降级至 IA 分类免化疗；反之局限子宫但伴 p53 突变直接升级为 IIC 期强化治疗。",
  },
  {
    id: "MYOMETRIAL_INVASION",
    label: "肌层浸润深度\n<50% vs ≥50%",
    type: "factor",
    x: 15,
    y: 40,
    connections: ["STAGING_SURGERY_SLNB", "PORTEC_ADJ_CHEMORT"],
    connectionTypes: {
      STAGING_SURGERY_SLNB: "guides",
      PORTEC_ADJ_CHEMORT: "guides",
    },
    studies: 45,
    evidence: 5,
    description: "子宫肌层浸润深度：浸润深度 ≥50%（外 1/2 肌层受累）或累及宫颈间质，淋巴结转移风险自 <3% 跃升至 20%-30%，是术后评估体外照射放疗的关键分界线。",
  },
  {
    id: "LVSI_VASCULAR_ENDO",
    label: "脉管间隙浸润\n广泛 LVSI 侵袭",
    type: "factor",
    x: 15,
    y: 54,
    connections: ["PORTEC_ADJ_CHEMORT", "RECURRENCE_ENDO"],
    connectionTypes: {
      PORTEC_ADJ_CHEMORT: "guides",
      RECURRENCE_ENDO: "risk",
    },
    studies: 40,
    evidence: 5,
    description: "淋巴血管间隙浸润 (LVSI)：病理高危红线指标。广泛性 LVSI 显著增加隐匿远处血行转移与盆腔局部复发率，即使早期患者亦需强化后装/体外放疗保护。",
  },

  // --- Column 2: Clinical Decisions & Interventions (X = 45) ---
  {
    id: "STAGING_SURGERY_SLNB",
    label: "全面分期手术\n全子宫+双附件+SLNB",
    type: "guideline",
    x: 45,
    y: 18,
    connections: ["RECURRENCE_ENDO", "OS_ENDOMETRIAL"],
    connectionTypes: {
      RECURRENCE_ENDO: "protective",
      OS_ENDOMETRIAL: "protective",
    },
    studies: 70,
    evidence: 5,
    description: "筋膜外全子宫切除 + 双侧输卵管卵巢切除 + 前哨淋巴结活检 (SLNB)：早期及进展期根治基石。荧光示踪 SLNB 免去系统性盆腔清扫，显著降低下肢淋巴水肿并发症。",
  },
  {
    id: "PORTEC_ADJ_CHEMORT",
    label: "辅助放化疗\nPORTEC-3 联合方案",
    type: "guideline",
    x: 45,
    y: 35,
    connections: ["RECURRENCE_ENDO", "OS_ENDOMETRIAL"],
    connectionTypes: {
      RECURRENCE_ENDO: "protective",
      OS_ENDOMETRIAL: "protective",
    },
    studies: 52,
    evidence: 5,
    description: "PORTEC-3 研究指导的高危辅助方案：体外盆腔放疗 (EBRT) 联合顺铂同步放疗后接续卡铂+紫杉醇化疗，使高危子宫内膜癌 5 年总生存率提升至 81.4%。",
  },
  {
    id: "LENVA_PEMBRO_ENDO",
    label: "靶免联合二线\n仑伐替尼+帕博利珠",
    type: "guideline",
    x: 45,
    y: 52,
    connections: ["OS_ENDOMETRIAL"],
    connectionTypes: {
      OS_ENDOMETRIAL: "protective",
    },
    studies: 48,
    evidence: 5,
    description: "KEYNOTE-775 确立的晚期 pMMR 破局方案：多靶点口服 TKI 仑伐替尼联合 PD-1 帕博利珠单抗，使既往化疗进展的错配修复完整型 (pMMR) 患者死亡风险显著降低 38%。",
  },
  {
    id: "PD1_MONO_MSI_ENDO",
    label: "单药免疫治疗\n帕博利珠/多塔利单抗",
    type: "guideline",
    x: 45,
    y: 70,
    connections: ["OS_ENDOMETRIAL"],
    connectionTypes: {
      OS_ENDOMETRIAL: "protective",
    },
    studies: 44,
    evidence: 5,
    description: "dMMR / MSI-H 靶向免疫疗法：KEYNOTE-158 及 RUBY 研究证实，PD-1 单抗带来高达 45%-50% 的客观缓解率与长达数年的持久无病应答。",
  },

  // --- Column 3: Intermediate Events & Complications (X = 70) ---
  {
    id: "POLE_EXCELLENT_OUTCOME",
    label: "POLE 极佳预后\n免化疗低复发生存",
    type: "outcome",
    x: 70,
    y: 20,
    connections: ["OS_ENDOMETRIAL"],
    connectionTypes: {
      OS_ENDOMETRIAL: "protective",
    },
    studies: 35,
    evidence: 5,
    description: "POLE 核酸外切酶结构域突变型患者因超高突变负荷诱发强大的机体自身抗肿瘤 T 细胞反应，5 年复发率 <3%，临床可安全豁免毒副化疗与过度放疗。",
  },
  {
    id: "LYMPHEDEMA_ENDO",
    label: "下肢淋巴水肿\n术后淋巴囊肿并发症",
    type: "outcome",
    x: 70,
    y: 45,
    connections: [],
    studies: 28,
    evidence: 4,
    description: "广泛盆腔及腹主动脉旁淋巴结清扫后的不可逆淋巴回流受阻，前哨淋巴结示踪技术 (SLNB) 已将该并发症风险大幅压减 70% 以上。",
  },

  // --- Column 4: Ultimate Survival Endpoints (X = 85) ---
  {
    id: "RECURRENCE_ENDO",
    label: "阴道残端/盆腔复发\n5年 DFS 结局指标",
    type: "outcome",
    x: 85,
    y: 30,
    connections: ["OS_ENDOMETRIAL"],
    connectionTypes: {
      OS_ENDOMETRIAL: "risk",
    },
    studies: 60,
    evidence: 5,
    description: "规范化局部放疗与分型精准化疗可将绝大多数局限性子宫内膜癌的盆腔复发风险遏制在 5% 以内。",
  },
  {
    id: "OS_ENDOMETRIAL",
    label: "总生存率\n5-yr OS 治愈指标",
    type: "outcome",
    x: 85,
    y: 65,
    connections: [],
    studies: 75,
    evidence: 5,
    description: "早期子宫内膜癌 5 年生存率 >90%；即使晚期患者在靶免方案支持下，生存期也获得了质的跨越。",
  },
];

export const ENDOMETRIAL_EDGE_EVIDENCE: Record<string, EdgeEvidence> = {
  "PORTEC_ADJ_CHEMORT-OS_ENDOMETRIAL": {
    title: "PORTEC-3 试验确立高危子宫内膜癌同步放化疗联合维持标准",
    description: "顶刊 Lancet Oncol 发布的 PORTEC-3 随机对照 III 期试验证实，同步放化疗联合辅助化疗使高危患者 5 年总生存率达 81.4%。",
    metric: {
      label: "总生存风险比 (OS)",
      value: "HR 0.70",
      ci: "95% CI: 0.51 - 0.97",
      p: "p = 0.034"
    },
    forestData: [
      { study: "PORTEC-3 (Lancet Oncol)", year: 2019, hr: 0.70, ciLow: 0.51, ciHigh: 0.97 },
      { study: "GOG-258 Trial",          year: 2019, hr: 0.84, ciLow: 0.65, ciHigh: 1.09 },
      { study: "PORTEC-2 (阴道近距离)",   year: 2010, hr: 0.78, ciLow: 0.55, ciHigh: 1.10 },
    ],
    studies: [
      {
        title: "Adjuvant chemoradiotherapy versus radiotherapy alone for women with high-risk endometrial cancer (PORTEC-3): final results of an international, open-label, multicentre, randomised, phase 3 trial",
        journal: "Lancet Oncol",
        year: 2019,
        doi: "10.1016/S1470-2045(19)30082-3",
        conclusion: "对于伴深肌层浸润、高分级或浆液性特征的高危患者，辅助放化疗联合方案显著改善总体生存。"
      }
    ]
  },
  "LENVA_PEMBRO_ENDO-OS_ENDOMETRIAL": {
    title: "KEYNOTE-775 突破晚期 pMMR 子宫内膜癌生存获益瓶颈",
    description: "新英格兰医学杂志 (NEJM) 发表的 KEYNOTE-775 全球前瞻性 III 期试验证明，仑伐替尼联合帕博利珠单抗使 pMMR 晚期患者死亡风险降低 38%。",
    metric: {
      label: "死亡风险比 (OS)",
      value: "HR 0.62",
      ci: "95% CI: 0.51 - 0.75",
      p: "p < 0.001"
    },
    forestData: [
      { study: "KEYNOTE-775 (NEJM)", year: 2022, hr: 0.62, ciLow: 0.51, ciHigh: 0.75 },
      { study: "pMMR 亚组",         year: 2022, hr: 0.68, ciLow: 0.56, ciHigh: 0.84 },
      { study: "dMMR 亚组",         year: 2022, hr: 0.37, ciLow: 0.22, ciHigh: 0.62 },
    ],
    studies: [
      {
        title: "Lenvatinib plus Pembrolizumab for Advanced Endometrial Cancer",
        journal: "N Engl J Med",
        year: 2022,
        doi: "10.1056/NEJMoa2108330",
        conclusion: "仑伐替尼联合帕博利珠单抗显著延长了晚期子宫内膜癌全人群的中位无进展生存期与总生存期 (18.3月 vs 11.4月)。"
      }
    ]
  }
};

// ============================================================================
// 宫颈癌 4D 知识图谱节点与证据集 (FIGO / CSCO / NCCN 标准)
// ============================================================================

export const CERVICAL_GRAPH_NODES: KnowledgeNode[] = [
  // --- Column 1: Pathological & Viral Factors (X = 15) ---
  {
    id: "HPV_16_18_PERSIST",
    label: "高危 HPV 感染\n16 / 18 型整合致癌",
    type: "factor",
    x: 15,
    y: 12,
    connections: ["LEEP_CONIZATION", "CCRT_CERVICAL", "RECURRENCE_CERVICAL"],
    connectionTypes: {
      LEEP_CONIZATION: "guides",
      CCRT_CERVICAL: "guides",
      RECURRENCE_CERVICAL: "risk",
    },
    studies: 70,
    evidence: 5,
    description: "高危型人乳头瘤病毒 (HPV)：99.7% 的宫颈癌直接病因。HPV 16 和 18 型表达 E6/E7 癌蛋白降解 p53 和 Rb 抑癌基因，导致上皮内瘤变 (CIN) 向浸润癌恶化演进。",
  },
  {
    id: "FIGO_CERVICAL_STAGE",
    label: "FIGO 宫颈癌分期\nIa1 - IVb 临床分期",
    type: "factor",
    x: 15,
    y: 26,
    connections: ["RADICAL_HYSTERECTOMY", "CCRT_CERVICAL", "RECURRENCE_CERVICAL"],
    connectionTypes: {
      RADICAL_HYSTERECTOMY: "guides",
      CCRT_CERVICAL: "guides",
      RECURRENCE_CERVICAL: "risk",
    },
    studies: 55,
    evidence: 5,
    description: "FIGO 2018/2023 分期：Ia-IIa 期适合手术切除；IIb 期及以上（累及宫旁间质侵犯者）手术并发症激增且切缘难以保证，严禁首选开刀，必须进入根治性同步放化疗 (CCRT)。",
  },
  {
    id: "PDL1_CPS_CERVICAL",
    label: "PD-L1 表达状态\nCPS ≥1 / ≥10",
    type: "factor",
    x: 15,
    y: 40,
    connections: ["KEYNOTE826_PEMBRO", "OS_CERVICAL"],
    connectionTypes: {
      KEYNOTE826_PEMBRO: "guides",
      OS_CERVICAL: "protective",
    },
    studies: 46,
    evidence: 5,
    description: "PD-L1 CPS 综合阳性评分：宫颈癌中阳性率超 80%。KEYNOTE-826 研究确立了 CPS ≥1 患者接受帕博利珠单抗联合化疗±贝伐珠单抗的绝对一线生存延长地位。",
  },
  {
    id: "TUMOR_SIZE_CERVIX",
    label: "原发灶外生大小\n≤4cm vs >4cm 巨块",
    type: "factor",
    x: 15,
    y: 54,
    connections: ["RADICAL_HYSTERECTOMY", "CCRT_CERVICAL"],
    connectionTypes: {
      RADICAL_HYSTERECTOMY: "guides",
      CCRT_CERVICAL: "guides",
    },
    studies: 42,
    evidence: 5,
    description: "肿瘤最大径 >4cm (Ib3 / IIa2 期) 属于局部巨块型宫颈癌，直接手术切缘阳性及术后复发率极高，指南强烈建议首选根治性同步放化疗替代单纯手术。",
  },

  // --- Column 2: Clinical Decisions & Interventions (X = 45) ---
  {
    id: "LEEP_CONIZATION",
    label: "宫颈锥切微创\nLEEP / CKC 锥切术",
    type: "guideline",
    x: 45,
    y: 18,
    connections: ["RECURRENCE_CERVICAL", "OS_CERVICAL"],
    connectionTypes: {
      RECURRENCE_CERVICAL: "protective",
      OS_CERVICAL: "protective",
    },
    studies: 50,
    evidence: 5,
    description: "宫颈电热圈切除 (LEEP) 或冷刀锥切术 (CKC)：CIN 2/3 级高级别病变及极早期 Ia1 期保留生育功能者的首选方案，切净病变并完整保留生育能力。",
  },
  {
    id: "RADICAL_HYSTERECTOMY",
    label: "广泛全子宫切除\n根治术 + 盆腔清扫",
    type: "guideline",
    x: 45,
    y: 35,
    connections: ["RECURRENCE_CERVICAL", "OS_CERVICAL"],
    connectionTypes: {
      RECURRENCE_CERVICAL: "protective",
      OS_CERVICAL: "protective",
    },
    studies: 65,
    evidence: 5,
    description: "Piver-Rutledge III 型广泛性子宫切除术联合盆腔淋巴结清扫术：早期 (Ib1-Ib2, IIa1) 经典根治手术，切除主韧带及骶韧带至盆壁以保阴性切缘。",
  },
  {
    id: "CCRT_CERVICAL",
    label: "根治同步放化疗\nCCRT 体外+后装放疗",
    type: "guideline",
    x: 45,
    y: 52,
    connections: ["RECURRENCE_CERVICAL", "OS_CERVICAL"],
    connectionTypes: {
      RECURRENCE_CERVICAL: "protective",
      OS_CERVICAL: "protective",
    },
    studies: 75,
    evidence: 5,
    description: "顺铂同步放化疗 (CCRT)：IIb 期以上局部进展期宫颈癌的金标准！包括体外照射 (EBRT 45-50 Gy) + 图像引导腔内近距离后装放疗 (Brachytherapy 30-40 Gy)，根治率极高。",
  },
  {
    id: "KEYNOTE826_PEMBRO",
    label: "一线免疫联合靶向\n帕博利珠+化疗±贝伐",
    type: "guideline",
    x: 45,
    y: 70,
    connections: ["OS_CERVICAL"],
    connectionTypes: {
      OS_CERVICAL: "protective",
    },
    studies: 45,
    evidence: 5,
    description: "KEYNOTE-826 确立的晚期宫颈癌一线全球标杆：PD-1 单抗联合紫杉醇+顺铂±贝伐珠单抗，使 CPS ≥1 患者中位总生存期从 16.5 个月飙升至 28.6 个月。",
  },

  // --- Column 3: Intermediate Events & Complications (X = 70) ---
  {
    id: "RADIATION_ENTERITIS",
    label: "放射性直肠/膀胱炎\n放疗后期黏膜损伤",
    type: "outcome",
    x: 70,
    y: 35,
    connections: [],
    studies: 30,
    evidence: 4,
    description: "盆腔高剂量放疗后可能引发的放射性直肠炎（便血、里急后重）或放射性膀胱炎，调强适形放疗 (IMRT) 与精确腔内三维后装技术大幅减少周围脏器受照剂量。",
  },

  // --- Column 4: Ultimate Survival Endpoints (X = 85) ---
  {
    id: "RECURRENCE_CERVICAL",
    label: "盆腔局部复发风险\n5年局部控制率",
    type: "outcome",
    x: 85,
    y: 30,
    connections: ["OS_CERVICAL"],
    connectionTypes: {
      OS_CERVICAL: "risk",
    },
    studies: 62,
    evidence: 5,
    description: "标准 CCRT 与广泛手术将局部复发率严格控制在较低水平，腔内后装放疗剂量充足与否是决定盆腔复发的头号指标。",
  },
  {
    id: "OS_CERVICAL",
    label: "总生存率\n5-yr OS 治愈指标",
    type: "outcome",
    x: 85,
    y: 65,
    connections: [],
    studies: 80,
    evidence: 5,
    description: "早期宫颈癌 5 年生存率可达 80%-90% 以上；晚期复发患者在四联靶免联合方案护航下，中位生存期已突破 2 年大关。",
  },
];

export const CERVICAL_EDGE_EVIDENCE: Record<string, EdgeEvidence> = {
  "KEYNOTE826_PEMBRO-OS_CERVICAL": {
    title: "KEYNOTE-826 奠定帕博利珠单抗一线治疗持续、复发或转移性宫颈癌新标准",
    description: "新英格兰医学杂志 (NEJM) 全球前瞻随机对照 III 期试验表明，帕博利珠单抗联合化疗±贝伐珠单抗使死亡风险骤降 36%，中位 OS 突破 28.6 个月。",
    metric: {
      label: "总生存风险比 (CPS ≥1)",
      value: "HR 0.64",
      ci: "95% CI: 0.50 - 0.81",
      p: "p < 0.001"
    },
    forestData: [
      { study: "KEYNOTE-826 (NEJM)", year: 2021, hr: 0.64, ciLow: 0.50, ciHigh: 0.81 },
      { study: "CPS ≥10 亚组",     year: 2021, hr: 0.61, ciLow: 0.44, ciHigh: 0.84 },
      { study: "GOG-240 (贝伐珠)",  year: 2014, hr: 0.74, ciLow: 0.58, ciHigh: 0.94 },
    ],
    studies: [
      {
        title: "Pembrolizumab for Persistent, Recurrent, or Metastatic Cervical Cancer",
        journal: "N Engl J Med",
        year: 2021,
        doi: "10.1056/NEJMoa2112435",
        conclusion: "帕博利珠单抗联合化疗显著延长了晚期宫颈癌患者的总生存期与无进展生存期。"
      }
    ]
  },
  "CCRT_CERVICAL-OS_CERVICAL": {
    title: "根治性同步放化疗 (CCRT) 确立局部进展期宫颈癌生存基石",
    description: "多项前瞻随机 III 期临床与 Meta 分析证实，与单纯放疗相比，含顺铂同步放化疗使死亡风险显著下降 29%-35%，是 IIb-IVa 期绝对首选治疗方案。",
    metric: {
      label: "死亡风险比 (OS)",
      value: "HR 0.71",
      ci: "95% CI: 0.61 - 0.83",
      p: "p < 0.0001"
    },
    forestData: [
      { study: "Cochrane Meta-Analysis", year: 2010, hr: 0.71, ciLow: 0.61, ciHigh: 0.83 },
      { study: "GOG 120 Trial",         year: 1999, hr: 0.61, ciLow: 0.46, ciHigh: 0.81 },
      { study: "RTOG 90-01",            year: 2004, hr: 0.67, ciLow: 0.49, ciHigh: 0.91 },
    ],
    studies: [
      {
        title: "Reducing uncertainties about the effects of chemoradiotherapy for cervical cancer: a systematic review and meta-analysis of individual patient data from 18 randomized trials",
        journal: "J Clin Oncol",
        year: 2008,
        doi: "10.1200/JCO.2008.16.4368",
        conclusion: "顺铂同步放化疗带来确凿的 5 年总生存期绝对获益 (提高约 8%) 并显著降低局部复发率。"
      }
    ]
  }
};

/**
 * 依据子宫内膜癌患者画像激活知识节点
 */
export function getEndometrialNodeActivation(nodeId: string, profile: PatientProfile | null): "primary" | "active" | "warning" | "dim" | "normal" {
  if (!profile) return "normal";

  const raw = (profile as any).cancerSpecificData || (profile as any).endometrialData || profile;
  const isEarly = profile.stage?.startsWith("I") || profile.stage?.startsWith("II");
  const isAdvanced = profile.stage?.startsWith("III") || profile.stage?.startsWith("IV");
  const isMsiH = raw.msiStatus === "MSI-H" || raw.dmmrStatus === "dMMR";

  switch (nodeId) {
    case "STAGING_SURGERY_SLNB":
      return isEarly ? "primary" : "normal";
    case "PORTEC_ADJ_CHEMORT":
      return isAdvanced || raw.myometrialInvasion === "deep" ? "primary" : "normal";
    case "LENVA_PEMBRO_ENDO":
      return isAdvanced && !isMsiH ? "primary" : "normal";
    case "PD1_MONO_MSI_ENDO":
      return isMsiH ? "primary" : "normal";
    case "TCGA_MOLECULAR_ENDO":
      return "active";
    default:
      return "normal";
  }
}

/**
 * 依据宫颈癌患者画像激活知识节点
 */
export function getCervicalNodeActivation(nodeId: string, profile: PatientProfile | null): "primary" | "active" | "warning" | "dim" | "normal" {
  if (!profile) return "normal";

  const raw = (profile as any).cancerSpecificData || (profile as any).cervicalData || profile;
  const isEarly = profile.stage === "Ia" || profile.stage === "Ia1" || profile.stage === "Ia2" || profile.stage === "Ib1" || profile.stage === "Ib2";
  const isLocallyAdvanced = profile.stage?.startsWith("IIb") || profile.stage?.startsWith("III") || profile.stage === "IIA2" || profile.stage === "IB3";
  const isMetastatic = profile.stage?.startsWith("IV");

  switch (nodeId) {
    case "LEEP_CONIZATION":
      return profile.stage === "Ia1" || profile.stage === "0" ? "primary" : "normal";
    case "RADICAL_HYSTERECTOMY":
      return isEarly ? "primary" : "normal";
    case "CCRT_CERVICAL":
      return isLocallyAdvanced ? "primary" : "normal";
    case "KEYNOTE826_PEMBRO":
      return isMetastatic ? "primary" : "normal";
    default:
      return "normal";
  }
}
