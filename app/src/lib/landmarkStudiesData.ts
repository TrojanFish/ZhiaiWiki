import type { KmCurveChartProps } from "@/components/common/KmCurveChart";
import type { ForestPlotChartProps } from "@/components/common/ForestPlotChart";
import type { TrialCriterion } from "@/components/common/TrialEligibilityMatrix";

// ================= 1. LANDMARK KM SURVIVAL CURVE DATA =================
export const LANDMARK_KM_DATA: Record<string, KmCurveChartProps> = {
  lung: {
    title: "ADAURA 临床试验 · 奥希替尼术后辅助治疗生存曲线",
    subtitle: "完全切除 IB-IIIA 期 EGFR 敏感突变 NSCLC · 5 年无病生存期 (DFS) 与脑保护获益",
    endpointLabel: "无病生存率 (DFS %)",
    timeUnit: "随访时间 (月)",
    series: [
      {
        label: "奥希替尼辅助治疗组 (80mg qd, 3年)",
        color: "#2563eb",
        fillColor: "#3b82f6",
        strokeDasharray: "none",
        medianOS: 65.8,
        hr: 0.17,
        hrCI: [0.12, 0.23],
        pValue: "<0.001",
        nEnrolled: 339,
        data: [
          { time: 0, survival: 1.0, at_risk: 339 },
          { time: 6, survival: 0.97, ci_lower: 0.94, ci_upper: 0.99, at_risk: 326 },
          { time: 12, survival: 0.93, ci_lower: 0.89, ci_upper: 0.96, at_risk: 308 },
          { time: 24, survival: 0.89, ci_lower: 0.85, ci_upper: 0.93, at_risk: 284 },
          { time: 36, survival: 0.80, ci_lower: 0.74, ci_upper: 0.85, at_risk: 232 },
          { time: 48, survival: 0.73, ci_lower: 0.66, ci_upper: 0.79, at_risk: 180 },
          { time: 60, survival: 0.70, ci_lower: 0.62, ci_upper: 0.77, at_risk: 125 },
        ],
      },
      {
        label: "安慰剂对照组 (标准随访观察)",
        color: "#64748b",
        fillColor: "#94a3b8",
        strokeDasharray: "5 4",
        medianOS: 27.5,
        nEnrolled: 343,
        data: [
          { time: 0, survival: 1.0, at_risk: 343 },
          { time: 6, survival: 0.85, ci_lower: 0.81, ci_upper: 0.89, at_risk: 286 },
          { time: 12, survival: 0.68, ci_lower: 0.63, ci_upper: 0.73, at_risk: 228 },
          { time: 24, survival: 0.52, ci_lower: 0.46, ci_upper: 0.57, at_risk: 165 },
          { time: 36, survival: 0.41, ci_lower: 0.35, ci_upper: 0.47, at_risk: 120 },
          { time: 48, survival: 0.38, ci_lower: 0.32, ci_upper: 0.44, at_risk: 86 },
          { time: 60, survival: 0.35, ci_lower: 0.29, ci_upper: 0.42, at_risk: 54 },
        ],
      },
    ],
    plainExplanation: "在完全手术切除的 IB-IIIA 期 EGFR 敏感突变非小细胞肺癌患者中，术后规范口服奥希替尼辅助治疗，相比对照组将疾病复发或死亡风险降低了惊人的 83%（HR 0.17），3年无病生存率由 41% 提升至 80%，且显著保护中枢神经系统（脑转移风险降低 82%）。",
    citation: {
      trialName: "ADAURA (Phase III RCT)",
      journal: "New England Journal of Medicine (NEJM)",
      year: 2020,
      sampleSize: 682,
      primaryEndpoint: "3年 DFS: 80% vs 41% (HR 0.17, p<0.001)",
      doiUrl: "https://doi.org/10.1056/NEJMoa2027071",
    },
  },

  breast: {
    title: "MonarchE 研究：阿贝西利联合内分泌治疗 HR+/HER2- 高危早期乳腺癌生存曲线",
    subtitle: "浸润性无病生存期 (Invasive Disease-Free Survival, IDFS) 评估",
    endpointLabel: "浸润性无病生存率 (IDFS %)",
    timeUnit: "随访时间 (月)",
    series: [
      {
        label: "阿贝西利 (150mg bid) + 内分泌治疗",
        color: "#db2777",
        fillColor: "#f472b6",
        strokeDasharray: "none",
        medianOS: 60.0,
        hr: 0.66,
        hrCI: [0.58, 0.76],
        pValue: "<0.0001",
        nEnrolled: 2808,
        data: [
          { time: 0, survival: 1.0, at_risk: 2808 },
          { time: 12, survival: 0.96, ci_lower: 0.95, ci_upper: 0.97, at_risk: 2680 },
          { time: 24, survival: 0.92, ci_lower: 0.91, ci_upper: 0.93, at_risk: 2490 },
          { time: 36, survival: 0.89, ci_lower: 0.87, ci_upper: 0.90, at_risk: 2280 },
          { time: 48, survival: 0.86, ci_lower: 0.84, ci_upper: 0.87, at_risk: 1950 },
          { time: 60, survival: 0.84, ci_lower: 0.82, ci_upper: 0.85, at_risk: 1420 },
        ],
      },
      {
        label: "单纯标准内分泌治疗对照组",
        color: "#64748b",
        fillColor: "#94a3b8",
        strokeDasharray: "6 4",
        medianOS: 52.0,
        nEnrolled: 2829,
        data: [
          { time: 0, survival: 1.0, at_risk: 2829 },
          { time: 12, survival: 0.93, ci_lower: 0.92, ci_upper: 0.94, at_risk: 2610 },
          { time: 24, survival: 0.88, ci_lower: 0.86, ci_upper: 0.89, at_risk: 2360 },
          { time: 36, survival: 0.83, ci_lower: 0.81, ci_upper: 0.84, at_risk: 2090 },
          { time: 48, survival: 0.79, ci_lower: 0.77, ci_upper: 0.81, at_risk: 1720 },
          { time: 60, survival: 0.76, ci_lower: 0.74, ci_upper: 0.78, at_risk: 1180 },
        ],
      },
    ],
    plainExplanation: "在具备高复发风险（淋巴结阳性、大肿瘤或高增殖率）的 HR+/HER2- 早期乳腺癌患者中，在标准内分泌治疗基础上联合 CDK4/6 抑制剂阿贝西利治疗 2 年，5 年浸润性无病生存率由 76.0% 提升至 83.6%，将复发或死亡风险显著降低 34% (HR 0.66)，且持续显现出长程保护的翘尾延续获益。",
    citation: {
      trialName: "MonarchE (Phase III RCT)",
      journal: "Journal of Clinical Oncology (JCO)",
      year: 2023,
      sampleSize: 5637,
      primaryEndpoint: "5年 IDFS: 83.6% vs 76.0% (HR 0.66, p<0.0001)",
      doiUrl: "https://doi.org/10.1200/JCO.22.02868",
    },
  },
};

// ================= 2. LANDMARK SUBGROUP FOREST PLOT DATA =================
export const LANDMARK_FOREST_DATA: Record<string, ForestPlotChartProps> = {
  lung: {
    title: "ADAURA 临床试验亚组分析森林图 (Hazard Ratio Forest Plot)",
    subtitle: "不同亚组人群接受奥希替尼辅助治疗的疾病复发风险比 (HR) 评估",
    expLabel: "奥希替尼获益",
    ctrlLabel: "安慰剂获益",
    rows: [
      { label: "全部入组人群 (Overall)", hr: 0.17, ci_lower: 0.12, ci_upper: 0.23, isSummary: true, weight: 100 },
      { label: "病理分期", hr: 0, ci_lower: 0, ci_upper: 0, isHeader: true },
      { label: "IB 期 (AJCC 7th)", subgroup: "n=212", hr: 0.39, ci_lower: 0.18, ci_upper: 0.76, weight: 25 },
      { label: "II 期 (AJCC 7th)", subgroup: "n=236", hr: 0.17, ci_lower: 0.08, ci_upper: 0.31, weight: 35 },
      { label: "IIIA 期 (AJCC 7th)", subgroup: "n=234", hr: 0.12, ci_lower: 0.07, ci_upper: 0.20, weight: 40 },
      { label: "突变类型", hr: 0, ci_lower: 0, ci_upper: 0, isHeader: true },
      { label: "19号外显子缺失 (Exon 19del)", subgroup: "n=379", hr: 0.12, ci_lower: 0.07, ci_upper: 0.20, weight: 55 },
      { label: "21号外显子 L858R 点突变", subgroup: "n=303", hr: 0.23, ci_lower: 0.14, ci_upper: 0.36, weight: 45 },
      { label: "既往辅助化疗", hr: 0, ci_lower: 0, ci_upper: 0, isHeader: true },
      { label: "已接受术后辅助化疗", subgroup: "n=410", hr: 0.16, ci_lower: 0.10, ci_upper: 0.26, weight: 60 },
      { label: "未接受术后辅助化疗", subgroup: "n=272", hr: 0.23, ci_lower: 0.13, ci_upper: 0.40, weight: 40 },
    ],
    citation: {
      metaTitle: "ADAURA Subgroup Analysis for Disease-Free Survival",
      journal: "Lancet Oncology",
      year: 2021,
      totalN: 682,
      doiUrl: "https://doi.org/10.1016/S1470-2045(21)00348-4",
    },
  },

  breast: {
    title: "MonarchE 亚组分析森林图：各高危亚群 IDFS 风险比评估",
    subtitle: "探讨不同淋巴结负荷、组织学分级与 Ki-67 表达对阿贝西利获益的影响",
    expLabel: "阿贝西利获益",
    ctrlLabel: "单药内分泌获益",
    rows: [
      { label: "全部意向性治疗人群 (ITT)", hr: 0.66, ci_lower: 0.58, ci_upper: 0.76, isSummary: true, weight: 100 },
      { label: "淋巴结转移状态", hr: 0, ci_lower: 0, ci_upper: 0, isHeader: true },
      { label: "≥4 枚阳性淋巴结 (N2/N3)", subgroup: "n=3354", hr: 0.63, ci_lower: 0.53, ci_upper: 0.74, weight: 60 },
      { label: "1-3 枚阳性且伴大肿瘤/高分级", subgroup: "n=2283", hr: 0.71, ci_lower: 0.56, ci_upper: 0.90, weight: 40 },
      { label: "Ki-67 增殖指数", hr: 0, ci_lower: 0, ci_upper: 0, isHeader: true },
      { label: "Ki-67 高表达 (≥20%)", subgroup: "n=2555", hr: 0.62, ci_lower: 0.51, ci_upper: 0.76, weight: 48 },
      { label: "Ki-67 低表达 (<20%)", subgroup: "n=1917", hr: 0.70, ci_lower: 0.54, ci_upper: 0.91, weight: 36 },
      { label: "绝经状态", hr: 0, ci_lower: 0, ci_upper: 0, isHeader: true },
      { label: "绝经前女性", subgroup: "n=2445", hr: 0.61, ci_lower: 0.49, ci_upper: 0.76, weight: 45 },
      { label: "绝经后女性", subgroup: "n=3192", hr: 0.70, ci_lower: 0.59, ci_upper: 0.83, weight: 55 },
    ],
    citation: {
      metaTitle: "MonarchE Subgroup Outcomes at 4-Year Median Follow-up",
      journal: "Lancet Oncology",
      year: 2023,
      totalN: 5637,
      doiUrl: "https://doi.org/10.1016/S1470-2045(22)00694-9",
    },
  },
};

// ================= 3. LANDMARK CLINICAL TRIAL ELIGIBILITY CRITERIA =================
export const LANDMARK_TRIAL_CRITERIA: Record<string, {
  title: string;
  phase: string;
  criteria: TrialCriterion[];
}> = {
  lung: {
    title: "ADAURA (NCT02511106) — 奥希替尼术后辅助治疗试验入组筛查",
    phase: "Phase III · 国际多中心 RCT",
    criteria: [
      {
        id: "l1",
        criterion: "年龄 ≥ 18 岁，组织学明确诊断的原发性非小细胞肺腺癌",
        type: "inclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "患者年龄符合成年受试者入组法律要求，病理标本经中心实验室确证。",
      },
      {
        id: "l2",
        criterion: "完全性根治手术切除 (R0)，支气管残端与外切缘病理阴性",
        type: "inclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "术后病理报告确认 R0 阴性切缘，无肉眼或镜下肿瘤残余。",
      },
      {
        id: "l3",
        criterion: "经检测证实存在 EGFR 敏感突变（Exon 19del 或 Exon 21 L858R）",
        type: "inclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "二代测序 (NGS) 或 ARMS-PCR 检出敏感激活突变。",
      },
      {
        id: "l4",
        criterion: "术后病理分期为 IB ~ IIIA 期 (AJCC 第 7/8 版)",
        type: "inclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "排除纯磨玻璃 IA 期患者，避免过度治疗。",
      },
      {
        id: "l5",
        criterion: "ECOG 体能状态评分 0 ~ 1 分，器官储备功能良好",
        type: "inclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "日常生活完全自理，血常规及肝肾功能指标在入组安全阈值内。",
      },
      {
        id: "l6",
        criterion: "既往使用过任何 EGFR-TKI 类靶向药物或抗肿瘤免疫检查点抑制剂",
        type: "exclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "初治患者未曾接触靶向药，无获得性耐药突变干扰。",
      },
      {
        id: "l7",
        criterion: "存在活动性间质性肺病 (ILD) 或药物诱导的重症纤维化肺炎病史",
        type: "exclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "胸部薄层 CT 排除活动性间质性肺炎改变。",
      },
      {
        id: "l8",
        criterion: "存在无法控制的心律失常或 QTc 间期显著延长 (> 470ms)",
        type: "exclusion",
        patientMatch: "met",
        importance: "preferred",
        detail: "基线心电图检查 QTc 间期在 430ms 正常范围内。",
      },
    ],
  },

  breast: {
    title: "MonarchE (NCT03155997) — 阿贝西利联合内分泌高危早期乳腺癌入组筛查",
    phase: "Phase III · 国际多中心 RCT",
    criteria: [
      {
        id: "b1",
        criterion: "组织学确诊的浸润性乳腺癌，受体状态确认 HR 阳性且 HER2 阴性",
        type: "inclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "ER 或 PR 表达 ≥ 1%，HER2 IHC 0/1+ 或 FISH 无扩增。",
      },
      {
        id: "b2",
        criterion: "完成乳腺根治性手术切除（乳房切除术或保乳术）且切缘阴性",
        type: "inclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "切缘组织学阴性，达到 R0 根治标准。",
      },
      {
        id: "b3",
        criterion: "高复发风险特征：≥4 枚腋窝淋巴结阳性，或 1-3 枚阳性伴肿瘤≥5cm 或 G3 或 Ki-67≥20%",
        type: "inclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "符合队列 1 严格临床病理高危分层标准。",
      },
      {
        id: "b4",
        criterion: "已完成规范的辅助或新辅助化疗（如有指征）",
        type: "inclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "化疗方案已按指南疗程完整结束。",
      },
      {
        id: "b5",
        criterion: "存在远处转移证据 (Stage IV / M1)",
        type: "exclusion",
        patientMatch: "met",
        importance: "mandatory",
        detail: "全身全面分期影像排除骨、肺、肝、脑等远处转移。",
      },
      {
        id: "b6",
        criterion: "活动性慢性严重感染、活动性炎症性肠病或无法控制的重度腹泻",
        type: "exclusion",
        patientMatch: "met",
        importance: "preferred",
        detail: "胃肠道吸收功能良好，可耐受 CDK4/6 口服治疗。",
      },
    ],
  },
};
