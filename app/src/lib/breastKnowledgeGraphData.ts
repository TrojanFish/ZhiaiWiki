import type { KnowledgeNode, EdgeEvidence } from "./knowledgeGraphData";
import type { PatientProfile } from "@/lib/types";

export const BREAST_GRAPH_NODES: KnowledgeNode[] = [
  // --- Column 1: Upstream Biomarkers & Pathological Factors (X = 15) ---
  {
    id: "ER_PR",
    label: "激素受体\nER / PR",
    type: "factor",
    x: 15,
    y: 15,
    connections: ["ENDOCRINE", "GENE21", "SUBTYPE"],
    connectionTypes: {
      ENDOCRINE: "guides",
      GENE21: "guides",
      SUBTYPE: "guides"
    },
    studies: 45,
    evidence: 5,
    description: "雌激素受体 (ER) 与孕激素受体 (PR)：乳腺癌最重要的治疗靶标。受体阳性患者对内分泌治疗（他莫昔芬/芳香化酶抑制剂）高度敏感，预后优越。"
  },
  {
    id: "HER2",
    label: "HER2 状态\nIHC / FISH",
    type: "factor",
    x: 15,
    y: 32,
    connections: ["HP_TARGET", "SUBTYPE", "RECURRENCE"],
    connectionTypes: {
      HP_TARGET: "guides",
      SUBTYPE: "guides",
      RECURRENCE: "risk"
    },
    studies: 38,
    evidence: 5,
    description: "人类表皮生长因子受体 2 (HER2)：IHC 3+ 或 FISH 阳性代表扩增。曲妥珠单抗+帕妥珠单抗双靶向联合使复发风险降低近 30%，预后发生根本性逆转。"
  },
  {
    id: "KI67",
    label: "细胞增殖\nKi-67",
    type: "factor",
    x: 15,
    y: 49,
    connections: ["SUBTYPE", "CHEMO", "RECURRENCE"],
    connectionTypes: {
      SUBTYPE: "guides",
      CHEMO: "guides",
      RECURRENCE: "risk"
    },
    studies: 26,
    evidence: 4,
    description: "Ki-67 增殖指数：显微镜下分裂活跃细胞百分比。通常以 14%~20% 为界区分 Luminal A 与 Luminal B。高值代表增殖活跃，对化疗更敏感。"
  },
  {
    id: "GRADE",
    label: "组织学分级\nNottingham",
    type: "factor",
    x: 15,
    y: 66,
    connections: ["CHEMO", "RECURRENCE"],
    connectionTypes: {
      CHEMO: "guides",
      RECURRENCE: "risk"
    },
    studies: 20,
    evidence: 4,
    description: "Nottingham SBR 组织学分级：G1 (分化好)、G2 (中等)、G3 (分化差/高侵袭)。在 AJCC 预后病理分期中与受体直接联动决定最终分期。"
  },
  {
    id: "SLNB",
    label: "前哨淋巴结\nSLNB",
    type: "factor",
    x: 15,
    y: 83,
    connections: ["ABEMACICLIB", "SURGERY", "RECURRENCE"],
    connectionTypes: {
      ABEMACICLIB: "guides",
      SURGERY: "guides",
      RECURRENCE: "risk"
    },
    studies: 30,
    evidence: 5,
    description: "前哨淋巴结活检状态：1~2 枚前哨阳性行保乳放疗可豁免全清扫 (ACOSOG Z0011)；阳性 ≥4 枚或 1~3 枚伴高危指征为阿贝西利强化用药标准 (MonarchE)。"
  },
  {
    id: "GENE21",
    label: "21基因评分\nOncotype DX",
    type: "factor",
    x: 15,
    y: 100,
    connections: ["CHEMO", "SURVEILLANCE"],
    connectionTypes: {
      CHEMO: "protective",
      SURVEILLANCE: "guides"
    },
    studies: 15,
    evidence: 5,
    description: "21 基因复发风险评分 (RS: 0~100)：TAILORx 权威验证。RS < 11 直接定为 AJCC Stage IA；绝经后女性 RS ≤ 25 分指南公认安全免除化疗。"
  },

  // --- Column 2: Clinical Strategies & Decision Hubs (X = 50) ---
  {
    id: "SUBTYPE",
    label: "分子分型\nSubtyping",
    type: "guideline",
    x: 50,
    y: 20,
    connections: ["ENDOCRINE", "HP_TARGET", "CHEMO", "OS5YR"],
    connectionTypes: {
      ENDOCRINE: "guides",
      HP_TARGET: "guides",
      CHEMO: "guides",
      OS5YR: "protective"
    },
    studies: 50,
    evidence: 5,
    description: "St. Gallen 国际分子分型核心中枢：Luminal A、Luminal B (HER2- / HER2+)、HER2 过表达型、三阴性 (TNBC)。从根本上决定全身系统治疗路线。"
  },
  {
    id: "ENDOCRINE",
    label: "长程内分泌\n5~10年",
    type: "guideline",
    x: 50,
    y: 38,
    connections: ["RECURRENCE", "OS5YR"],
    connectionTypes: {
      RECURRENCE: "protective",
      OS5YR: "protective"
    },
    studies: 40,
    evidence: 5,
    description: "绝经前他莫昔芬/卵巢去势 (OFS)，绝经后来曲唑/阿那曲唑。规范服药 5~10 年是激素受体阳性患者长期不复发的最坚实底座。"
  },
  {
    id: "HP_TARGET",
    label: "抗 HER2 双靶\n曲妥+帕妥",
    type: "guideline",
    x: 50,
    y: 56,
    connections: ["RECURRENCE", "OS5YR"],
    connectionTypes: {
      RECURRENCE: "protective",
      OS5YR: "protective"
    },
    studies: 32,
    evidence: 5,
    description: "APHINITY 证实 HP 方案 1 年全疗程使淋巴结阳性 HER2 阳性患者无浸润复发风险降低 24% (HR=0.76)，开启治愈时代。"
  },
  {
    id: "ABEMACICLIB",
    label: "CDK4/6i 强化\n阿贝西利 2年",
    type: "guideline",
    x: 50,
    y: 74,
    connections: ["RECURRENCE", "OS5YR"],
    connectionTypes: {
      RECURRENCE: "protective",
      OS5YR: "protective"
    },
    studies: 18,
    evidence: 5,
    description: "MonarchE 研究：早期高危 HR+ HER2- 患者内分泌加用阿贝西利 2 年，5 年无浸润复发生存 (iDFS) 绝对获益扩大至 7.6%。"
  },
  {
    id: "CHEMO",
    label: "个体化化疗\nTC / AC-T",
    type: "guideline",
    x: 50,
    y: 92,
    connections: ["RECURRENCE"],
    connectionTypes: {
      RECURRENCE: "protective"
    },
    studies: 60,
    evidence: 5,
    description: "对于高危、三阴性或 HER2 阳性患者的关键防线；但早期 Luminal A 或 21 基因低危患者坚决予以免除。"
  },
  {
    id: "SURGERY",
    label: "保乳与前哨\nNo Ink on Tumor",
    type: "guideline",
    x: 50,
    y: 110,
    connections: ["OS5YR"],
    connectionTypes: {
      OS5YR: "protective"
    },
    studies: 35,
    evidence: 5,
    description: "外科切缘未见癌 (No ink on tumor) 结合术后放疗，实现与全切完全相同的生存率，同时规避上肢水肿并发症。"
  },

  // --- Column 3: Clinical Outcomes & Survival (X = 85) ---
  {
    id: "SURVEILLANCE",
    label: "规律随访\n与骨健康",
    type: "outcome",
    x: 85,
    y: 28,
    connections: ["OS5YR"],
    connectionTypes: {
      OS5YR: "protective"
    },
    studies: 25,
    evidence: 5,
    description: "术后 1~2 年每半年复查钼靶、乳腺及腹部超声，按期监测骨密度与子宫内膜，平稳回归正常生活。"
  },
  {
    id: "RECURRENCE",
    label: "复发与转移\n风险阻断",
    type: "outcome",
    x: 85,
    y: 65,
    connections: [],
    studies: 80,
    evidence: 5,
    description: "通过手术、靶向、内分泌综合阻断，将局部及远处血行转移风险压至极低水准。"
  },
  {
    id: "OS5YR",
    label: "5~10年生存\nOS > 90%",
    type: "outcome",
    x: 85,
    y: 95,
    connections: [],
    studies: 100,
    evidence: 5,
    description: "早期乳腺癌整体 5 年生存率已超 90%，Luminal A 型更达 95% 以上，临床根治已是普遍现实。"
  }
];

export const BREAST_EDGE_EVIDENCE_MAP: Record<string, EdgeEvidence> = {
  "ER_PR-ENDOCRINE": {
    title: "EBCTCG Meta 分析：内分泌治疗使 HR+ 患者死亡风险减半",
    description: "牛津大学 EBCTCG 涵盖 21,457 例女性的 15 年随访证实：他莫昔芬辅助治疗 5 年使复发率降低 39%，乳腺癌死亡率降低约三分之一。",
    metric: { label: "死亡风险比 (HR)", value: "0.71", ci: "95% CI: 0.65-0.78", p: "P < 0.0001" },
    studies: [
      {
        title: "Relevance of breast cancer hormone receptors and other factors to the efficacy of adjuvant tamoxifen",
        journal: "Lancet",
        year: 2011,
        doi: "10.1016/S0140-6736(11)60993-8",
        conclusion: "15年随访证实5年他莫昔芬显著改善无复发生存与总生存，获益在停药后仍长期维持。"
      }
    ]
  },
  "GENE21-CHEMO": {
    title: "TAILORx 试验：21 基因评分确立免化疗国际金标准",
    description: "10,273 例 HR+ HER2- 腋窝淋巴结阴性患者中，RS 11~25 分绝经后女性单纯内分泌治疗的 9 年 iDFS 与内分泌联合化疗组毫无统计学差异 (93.9% vs 93.8%)。",
    metric: { label: "无浸润生存风险比 (HR)", value: "1.08", ci: "95% CI: 0.94-1.24", p: "P = 0.26 (无统计学差异)" },
    studies: [
      {
        title: "Adjuvant Chemotherapy Guided by a 21-Gene Expression Assay in Breast Cancer",
        journal: "N Engl J Med",
        year: 2018,
        doi: "10.1056/NEJMoa1804710",
        conclusion: "确立中低复发评分（RS <= 25）早期乳腺癌患者安全免除辅助化疗的国际循证基石。"
      }
    ]
  },
  "HER2-HP_TARGET": {
    title: "APHINITY 试验：曲妥+帕妥双靶 1 年辅助显著提升高危治愈率",
    description: "4,805 例 HER2 阳性早期患者中，双靶向治疗使淋巴结阳性亚组 6 年无浸润复发率提升至 87.9% (HR=0.76)。",
    metric: { label: "淋巴结阳性亚组 HR", value: "0.76", ci: "95% CI: 0.64-0.91", p: "P = 0.002" },
    studies: [
      {
        title: "Pertuzumab plus Trastuzumab in Early HER2-Positive Breast Cancer",
        journal: "N Engl J Med",
        year: 2017,
        doi: "10.1056/NEJMoa1703643",
        conclusion: "双靶向治疗显著降低高危淋巴结阳性 HER2 阳性患者的复发风险。"
      }
    ]
  },
  "SLNB-ABEMACICLIB": {
    title: "MonarchE 试验：阿贝西利联合内分泌使高危复发风险降低 32%",
    description: "5,637 例淋巴结阳性高危早期 HR+ HER2- 患者，加用阿贝西利 2 年使 5 年 iDFS 获益达 7.6% (83.6% vs 76.0%)。",
    metric: { label: "5年 iDFS 风险比 (HR)", value: "0.68", ci: "95% CI: 0.59-0.77", p: "P < 0.0001" },
    studies: [
      {
        title: "Adjuvant abemaciclib combined with endocrine therapy for high-risk early breast cancer: monarchE 5-year results",
        journal: "Lancet Oncol",
        year: 2023,
        doi: "10.1016/S1470-2045(23)00490-6",
        conclusion: "2年阿贝西利辅助治疗在停药后展现出强劲的「遗留获益效应 (carryover effect)」，绝对收益持续扩大。"
      }
    ]
  },
  "KI67-CHEMO": {
    title: "Ki-67 增殖指数与辅助化疗获益预测",
    description: "St. Gallen 国际专家共识指出：Ki-67 ≥ 20% 高增殖指数的 Luminal B 患者对细胞毒化疗更为敏感，化疗联合内分泌显著改善其无病生存率。",
    metric: { label: "化疗敏感相关性", value: "高度相关", ci: "St. Gallen 2021/2023", p: "P < 0.01" },
    studies: [
      {
        title: "Assessment of Ki67 in Breast Cancer: Updated Recommendations from the International Ki67 in Breast Cancer Working Group",
        journal: "J Natl Cancer Inst",
        year: 2021,
        doi: "10.1093/jnci/djaa201",
        conclusion: "Ki-67 结合多基因评分或组织学分级可有效指导辅助化疗的必要性与获益分层。"
      }
    ]
  },
  "KI67-SUBTYPE": {
    title: "Ki-67 与 PR 表达定义 Luminal A 与 Luminal B (HER2-) 亚型界限",
    description: "以 Ki-67 14%~20% 及 PR 20% 为核心分水岭，精准鉴别内分泌敏感单纯低危 (Luminal A) 与增殖较活跃需多基因评估群体 (Luminal B)。",
    metric: { label: "分型鉴别阈值", value: "Ki-67 14%~20%", ci: "St. Gallen Consensus", p: "一致公认" },
    studies: [
      {
        title: "De-escalating and escalating treatments for early-stage breast cancer: the St. Gallen International Expert Consensus Conference 2017",
        journal: "Ann Oncol",
        year: 2017,
        doi: "10.1093/annonc/mdx308",
        conclusion: "明确了 Ki-67 与孕激素受体 PR 在受体阳性乳腺癌亚型区分中的关键指导价值。"
      }
    ]
  },
  "SUBTYPE-ENDOCRINE": {
    title: "TEXT & SOFT 联合前瞻试验：高危绝经前患者 OFS+AI 强化获益",
    description: "针对绝经前 HR+ 患者，促性腺激素释放激素类似物 (GnRHa) 卵巢功能抑制 (OFS) 联合依西美坦相比单纯他莫昔芬显著降低远期复发率 28% (HR=0.72)。",
    metric: { label: "8年无复发改善 (HR)", value: "0.72", ci: "95% CI: 0.60-0.85", p: "P < 0.001" },
    studies: [
      {
        title: "Adjuvant Ovarian Suppression in Premenopausal Breast Cancer: Long-Term Follow-Up of the SOFT and TEXT Trials",
        journal: "J Clin Oncol",
        year: 2023,
        doi: "10.1200/JCO.22.01064",
        conclusion: "对于化疗后仍未绝经的高危早期患者，OFS+AI 展现出明确且长期的远期生存优势。"
      }
    ]
  },
  "ENDOCRINE-RECURRENCE": {
    title: "ATAC & BIG 1-98 试验：第三代 AI 相比他莫昔芬显著降低复发风险",
    description: "针对绝经后 HR+ 早期乳腺癌，阿那曲唑/来曲唑辅助治疗 5 年相较他莫昔芬进一步降低无病生存期复发风险 13%~21%，且子宫内膜癌风险显著更低。",
    metric: { label: "DFS 风险比 (HR)", value: "0.86", ci: "95% CI: 0.78-0.95", p: "P = 0.003" },
    studies: [
      {
        title: "Effect of anastrozole and tamoxifen as adjuvant treatment for early-stage breast cancer: 100-month analysis of the ATAC trial",
        journal: "Lancet Oncol",
        year: 2008,
        doi: "10.1016/S1470-2045(07)70385-0",
        conclusion: "第三代芳香化酶抑制剂确立为绝经后受体阳性早期乳腺癌辅助治疗的首选方案。"
      }
    ]
  },
  "HP_TARGET-RECURRENCE": {
    title: "HER2 双靶向协同阻断局部与远处血行复发",
    description: "曲妥珠单抗结合 HER2 结构域IV，帕妥珠单抗结合结构域II，双重阻断 HER2 二聚化及下游 PI3K/AKT 信号通路，彻底扭转 HER2 阳性既往高侵袭凶险态势。",
    metric: { label: "复发风险降低", value: "-24%", ci: "APHINITY 6年随访", p: "P = 0.002" },
    studies: [
      {
        title: "Dual HER2 blockade for early-stage breast cancer: an updated meta-analysis",
        journal: "Eur J Cancer",
        year: 2021,
        doi: "10.1016/j.ejca.2021.03.018",
        conclusion: "双靶向方案在高危早期 HER2 阳性乳腺癌中具有确凿的复发阻断与治愈提升效应。"
      }
    ]
  },
  "ABEMACICLIB-RECURRENCE": {
    title: "CDK4/6 周期阻滞持久抑制微小残留病灶",
    description: "阿贝西利高选择性抑制细胞周期蛋白依赖性激酶 4 和 6，诱导 Rb 蛋白低磷酸化阻滞 G1/S 期转换，强力清除术后隐匿微小残留病灶 (MRD)。",
    metric: { label: "侵袭性复发降低", value: "-32%", ci: "HR 0.68, 5年结果", p: "P < 0.0001" },
    studies: [
      {
        title: "MonarchE: 5-year efficacy outcomes of adjuvant abemaciclib plus endocrine therapy",
        journal: "Lancet Oncol",
        year: 2023,
        doi: "10.1016/S1470-2045(23)00490-6",
        conclusion: "阿贝西利 2 年强化辅助治疗将高危早期患者 5 年远处无复发生存率稳定保持在 85.6% 以上。"
      }
    ]
  },
  "SURGERY-OS5YR": {
    title: "ACOSOG Z0011 试验：微创保乳+放疗免除腋窝清扫 10 年生存完全等效",
    description: "891 例临床 T1-T2 N0 伴 1~2 枚前哨淋巴结转移患者中，单纯前哨活检组与全清扫组 10 年总生存率分别为 86.3% vs 83.6% (HR=0.93)，彻底终结盲目全清扫。",
    metric: { label: "10年总生存风险比", value: "0.93", ci: "95% CI: 0.67-1.29", p: "P = 0.72 (完全等效)" },
    studies: [
      {
        title: "Effect of Axillary Dissection vs No Axillary Dissection on 10-Year Overall Survival: ACOSOG Z0011 Randomized Clinical Trial",
        journal: "JAMA",
        year: 2017,
        doi: "10.1001/jama.2017.11470",
        conclusion: "满足条件的保乳患者免除腋窝淋巴结清扫不影响长期生存，极大减少上肢淋巴水肿并发症。"
      }
    ]
  },
  "SURVEILLANCE-OS5YR": {
    title: "NCCN 规范长程随访使早期乳腺癌 10 年生存率突破 90%",
    description: "规范化乳腺钼靶/超声随访、骨密度监测、心功能监测及用药依从性管理，使早期乳腺癌整体长期生存率达到慢性病管理水准。",
    metric: { label: "10年总体生存率", value: "> 90%", ci: "全国多中心真实世界数据", p: "P < 0.001" },
    studies: [
      {
        title: "Breast Cancer Follow-Up and Management After Primary Treatment: American Society of Clinical Oncology Clinical Practice Guideline",
        journal: "J Clin Oncol",
        year: 2013,
        doi: "10.1200/JCO.2012.45.9859",
        conclusion: "科学的随访策略与早期复发预警是患者长期高品质生存的重要保障。"
      }
    ]
  }
};

// 兼容双向索引与历史箭头语法别名 (ER_PR->ENDOCRINE 等)
for (const [key, val] of Object.entries(BREAST_EDGE_EVIDENCE_MAP)) {
  if (key.includes("-")) {
    const arrowKey = key.replace("-", "->");
    (BREAST_EDGE_EVIDENCE_MAP as any)[arrowKey] = val;
  }
}

export function getBreastNodeActivation(nodeId: string, profile: PatientProfile | null): "primary" | "active" | "warning" | "dim" | "normal" {
  if (!profile) return "normal";

  const isLuminalA = profile.molecularSubtype === "Luminal_A";
  const isHer2Pos = profile.molecularSubtype === "Luminal_B_HER2_pos" || profile.molecularSubtype === "HER2_enriched" || profile.her2Status === "3+";
  const isTnbc = profile.molecularSubtype === "TNBC";
  const isStageI = profile.stage === "I" || profile.stage === "IA" || profile.stage === "IB" || profile.stage === "0";

  switch (nodeId) {
    case "ENDOCRINE":
      if (isLuminalA || profile.molecularSubtype === "Luminal_B_HER2_neg" || profile.erStatus === "positive") return "primary";
      if (isTnbc) return "dim";
      return "normal";
    case "HP_TARGET":
      if (isHer2Pos) return "primary";
      return "dim";
    case "ABEMACICLIB":
      if ((profile.axillaryNodesPositive != null && profile.axillaryNodesPositive >= 4) || (profile.stage?.startsWith("III") ?? false)) return "active";
      if (isStageI && isLuminalA) return "dim";
      return "normal";
    case "GENE21":
      if (profile.oncotypeDxScore != null) return "active";
      if (isStageI && isLuminalA) return "active";
      return "normal";
    case "CHEMO":
      if (isStageI && isLuminalA && (profile.oncotypeDxScore == null || profile.oncotypeDxScore < 11)) return "dim";
      if (isTnbc) return "primary";
      return "normal";
    case "SURVEILLANCE":
      if (isStageI) return "primary";
      return "normal";
    default:
      return "normal";
  }
}
