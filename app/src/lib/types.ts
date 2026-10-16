// Shared type definitions for ZhiaiWiki
export interface HistologyItem {
  type: string;
  percentage?: number;
}

export interface SecondaryNodule {
  id: string;
  location: string;          // e.g. "右肺下叶背段", "左肺上叶"
  sizeMm: number;            // 结节大小毫米 e.g. 4
  type: "pure_ggo" | "mixed_ggo" | "solid" | "calcification" | string;
  isBenignTendency?: boolean;// 是否具有良性/陈旧倾向
  imagingFeatures?: string[];
  note?: string;             // e.g. "微小钙化结节，考虑陈旧性病灶"
}

export interface FollowUpRecord {
  id: string;
  date: string;              // "2023-08-15" 或 "2024-03"
  tumorSize: number;         // 结节全径 cm
  solidSize: number;         // 实性浸润 cm
  ctr: number;               // CTR 0~1
  noduleType?: string;
  lungRads?: string;
  hospital?: string;
  note?: string;             // e.g. "较前片相仿，未见明显增大"
}

export interface TumorMarkersData {
  id?: string;
  cea?: number | null;       // 癌胚抗原 ng/mL (正常 0~5.0)
  cyfra211?: number | null;  // 细胞角蛋白19片段 ng/mL (正常 0~3.3)
  nse?: number | null;       // 神经元特异性烯醇化酶 ng/mL (正常 0~16.3)
  scc?: number | null;       // 鳞状细胞癌抗原 ng/mL (正常 0~1.5)
  proGrp?: number | null;    // 胃泌素释放肽前体 pg/mL (正常 0~65.0)
  ca125?: number | null;     // 糖类抗原 125 U/mL (正常 0~35.0)
  ca199?: number | null;     // 糖类抗原 19-9 U/mL (正常 0~27.0)
  ca153?: number | null;     // 糖类抗原 15-3 U/mL (正常 0~25.0)
  ferritin?: number | null;  // 血清铁蛋白 ng/mL (正常 20~300)
  testDate?: string | null;  // 化验日期
  hospital?: string | null;  // 化验医院
  note?: string | null;
}

export type CancerType = "lung" | "breast";

/**
 * 肺癌专有临床与病理数据插槽 (IASLC / AJCC 第 9 版)
 */
export interface LungSpecificData {
  noduleLocation?: string | null;       // e.g. "右肺上叶尖后段"
  noduleType?: "mixed_ggo" | "pure_ggo" | "pure_solid" | "unknown" | string | null;
  morphology?: "pure_ggo" | "mixed_ggo" | "pure_solid" | "unknown" | string | null;
  solidSize?: number | null;            // 浸润性实性成分最大径 (cm)
  ctr?: number | null;                  // 实性成分占比 CTR (0~1)
  
  // IASLC / AJCC 第 9 版病理维度
  pathologyTumorSize?: number | null;   // 标本大体肿瘤全径 (cm)
  pathologyInvasiveSize?: number | null;// 镜下浸润成分最大径 (cm, 决定 pT)
  pathologyLepidicPercent?: number | null; // 贴壁/伏壁生长亚型占比 (0~100)
  pathologyReportMode?: "explicit" | "percentage" | "unspecified" | string | null;
  adjacentLobeInvasion?: boolean | null;// T2a: 直接侵犯相邻肺叶
  lungRads?: string | null;             // Lung-RADS 分级 (1/2/3/4A/4B/4X)
  versionBridgeNotice?: string;         // 第9版与第8版演变桥接释疑

  // 多发结节管理
  isMultipleNodules?: boolean;
  secondaryNodules?: SecondaryNodule[];

  // 高危病理因素
  stas?: "negative" | "positive" | "unknown" | "not_applicable" | null;
  lvi?: "negative" | "positive" | "unknown" | "not_applicable" | null;
  vpi?: "negative" | "positive" | "unknown" | "not_applicable" | null;
  iaslcGrade?: "1" | "2" | "3" | "unknown" | null | string;
  egfr?: "positive" | "negative" | "unknown" | "not_tested" | string | null;
}

/**
 * 乳腺癌专有临床与病理数据插槽 (AJCC 第 8/9 版 & St. Gallen 共识)
 */
export interface BreastSpecificData {
  biRads?: "1" | "2" | "3" | "4A" | "4B" | "4C" | "5" | "6" | string | null;
  breastLaterality?: "left" | "right" | "bilateral" | string | null;
  calcificationType?: string | null;    // 粗大良性 / 泥沙样微钙化 / 簇状多形性微钙化
  
  // 免疫组化受体核心四项与分型
  erStatus?: "positive" | "negative" | "unknown" | string | null;
  erPercent?: number | null;            // 雌激素受体阳性百分比 (0 ~ 100%)
  prStatus?: "positive" | "negative" | "unknown" | string | null;
  prPercent?: number | null;            // 孕激素受体阳性百分比 (0 ~ 100%)
  
  // HER2 状态精细分型 (v3.1: positive / low / zero)
  her2Status?: "0" | "1+" | "2+" | "3+" | "positive" | "negative" | "low" | "zero" | "unknown" | string | null;
  her2Fish?: "positive" | "negative" | "equivocal" | "amplified" | "not_amplified" | "not_performed" | string | null;
  her2Low?: boolean | null;             // 是否为 HER2 低表达 (IHC 1+ 或 IHC 2+/FISH-)
  her2StatusCategory?: "positive" | "low" | "zero" | "unknown" | null; // DESTINY-Breast04 证据细分
  
  molecularSubtype?: "Luminal_A" | "Luminal_B_HER2_neg" | "Luminal_B_HER2_pos" | "HER2_enriched" | "TNBC" | "Triple_Negative" | "unknown" | string | null;
  nottinghamGrade?: "1" | "2" | "3" | "unknown" | string | null; // Nottingham SBR 组织学分级
  histologyType?: "IDC" | "ILC" | "DCIS" | "other" | string | null; // 浸润性导管癌 / 浸润性小叶癌 / 原位癌
  menopauseStatus?: "pre" | "post" | "peri" | "unknown" | string | null; // 绝经状态 (对内分泌选药至关重要)
  oncotypeDxScore?: number | null;      // 21 基因复发风险评分 (0 ~ 100, TAILORx/RxPONDER 证据)
  
  // 淋巴结清扫详细计数
  sentinelNodesPositive?: number | null;
  sentinelNodesTotal?: number | null;
  axillaryNodesPositive?: number | null;
  axillaryNodesTotal?: number | null;
  clinicalAxillaryNodes?: "negative" | "positive" | "suspicious" | "unknown" | string | null;

  // AJCC 8th/9th 双轨分期
  prognosticStage?: string | null;      // AJCC 病理预后分期
  anatomicalStage?: string | null;      // AJCC 纯解剖学分期

  // 遗传学与致病突变
  brca1?: "positive" | "negative" | "unknown" | string | null;
  brca2?: "positive" | "negative" | "unknown" | string | null;
  pik3ca?: "positive" | "negative" | "unknown" | string | null;
  chestCt?: "negative" | "positive" | "not_performed" | string | null;

  // 新辅助化疗与病理缓解 (v3.1: ypTNM 警示与 pCR 追踪)
  neoadjuvantChemo?: boolean | null;    // 是否接受过术前新辅助化疗/靶向
  pcrStatus?: "ypT0isN0" | "partial_response" | "non_pcr" | "pCR" | "non_pCR" | string | null;
  ypTnmNotice?: {
    title: string;
    warning: string;
    guidelineRef: string;
    recommendation: string;
  } | null;

  // Ki-67 临界灰区 (v3.1: 14%~20% 争议区说明)
  isKi67GrayZone?: boolean | null;
  ki67GrayZoneNotice?: string | null;

  // 辅助妇科与骨密度评估
  pelvicUltrasound?: "normal" | "thickened_endometrium" | "not_performed" | string | null;
  dxaScan?: "normal" | "osteopenia" | "osteoporosis" | "not_performed" | string | null;

  // 绝经前卵巢功能抑制 (OFS) 评估 (SOFT/TEXT 试验) 与双向器官保护
  ofsStatus?: "not_needed" | "recommended" | "receiving" | "unknown" | string | null;
  ofsDrug?: "goserelin" | "leuprorelin" | "triptorelin" | string | null;
  endocrineOrganProtection?: {
    boneProtectionRequired?: boolean;
    dxaStatus?: "normal" | "osteopenia" | "osteoporosis" | "not_performed" | string | null;
    endometrialMonitoringRequired?: boolean;
    pelvicUltrasoundStatus?: "normal" | "thickened_endometrium" | "not_performed" | string | null;
  } | null;
}



/**
 * 跨癌种共有患者基础档案基类
 */
export interface BasePatientProfile {
  id?: string;
  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  age?: number | null;
  gender?: "female" | "male" | "unknown" | string | null;
  sex?: "female" | "male" | "unknown" | string | null;
  stage: string;
  organ?: string;
  tumorSize?: number | null;
  reportType?: "ct_imaging" | "pathology" | "mammography" | "ultrasound" | "comprehensive" | string;
  stageExplanation?: string;
  
  // TNM Staging Common
  tStage?: "Tx" | "T0" | "Tis" | "T1mi" | "T1a" | "T1b" | "T1c" | "T2" | "T2a" | "T2b" | "T3" | "T4" | string;
  nStage?: "N0" | "N1" | "N1mi" | "N1a" | "N2" | "N2a" | "N2b" | "N3" | "N3a" | "unknown" | string;
  mStage?: "M0" | "M1" | "M1a" | "M1b" | "M1c" | "M1c1" | "M1c2" | "unknown" | string;
  lymphNodes?: string;

  // 影像征象与建议
  imagingFeatures?: string[];
  malignancyRisk?: "low" | "moderate" | "high" | string | null;
  clinicalRecommendation?: string | null;
  /** @deprecated 结节随访生长时序轨迹与历次老片补录（结节倍增时间/生长动力学主要用于良恶性筛查初判，与确诊实体瘤生存率循证不直接相关，全站已停止录入与展示；保留字段仅供数据库历史归档向下平滑兼容） */
  followUpHistory?: FollowUpRecord[];

  // 肿瘤标志物 (血象生化指标与 12 实体瘤权威生存率循证均无直接相关性，全站 12 癌种已全面停采；保留字段仅供数据库历史归档向下平滑兼容)
  tumorMarkers?: TumorMarkersData;
  tumorMarkersHistory?: TumorMarkersData[];

  // 全身排查与 M0 确认
  brainMri?: "negative" | "positive" | "not_performed" | string;
  abdominalUltrasound?: "negative" | "benign_findings" | "positive" | "not_performed" | string;
  boneScan?: "negative" | "positive" | "not_performed" | string;
  neckLymphNodes?: "negative" | "positive" | "not_performed" | string;
  petCt?: "negative" | "positive" | "not_performed" | string;
  benignFindings?: string[];
  systemicStagingConfirmed?: boolean;

  // 基因与分子检测
  molecular?: MolecularPanelData;
  geneMutations?: GeneMutationItem[];
  molecularTestStatus?: "tested" | "negative" | "not_tested" | "in_progress" | string;
  pdl1Tps?: "<1%" | "1-49%" | ">=50%" | "unknown" | string;

  // 通用病理与手术
  margin?: "negative" | "positive" | "unknown" | "not_applicable" | null;
  marginStatus?: "negative" | "positive" | "unknown" | "not_applicable" | string | null;
  grade?: "1" | "2" | "3" | "unknown" | null | string;
  ki67?: number | string | null;
  histology?: any;
  surgeryType?: string | null;
  treatmentPlan?: string | null;
  notes?: string;

  // 决策状态机
  currentStage?: string;
  riskLevel?: string;
  nextAction?: string;
  psychologicalState?: string;

  // 报告生成与临床复核
  reportMarkdown?: string;
  reportGeneratedAt?: string | Date;
  reportDate?: string | Date | null;
  reportSourceType?: string | null;
  reportReviewStatus?: "needs_review" | "confirmed" | "rejected" | string | null;
  reportEvidenceSpans?: any;
  cancerSpecificData?: any;

  // 平铺字段兼容支持（向下兼容平铺访问）
  noduleLocation?: string | null;
  noduleType?: "mixed_ggo" | "pure_ggo" | "pure_solid" | "unknown" | string | null;
  morphology?: "pure_ggo" | "mixed_ggo" | "pure_solid" | "unknown" | string | null;
  solidSize?: number | null;
  ctr?: number | null;
  pathologyTumorSize?: number | null;
  pathologyInvasiveSize?: number | null;
  pathologyLepidicPercent?: number | null;
  pathologyReportMode?: "explicit" | "percentage" | "unspecified" | string | null;
  adjacentLobeInvasion?: boolean | null;
  lungRads?: string | null;
  versionBridgeNotice?: string;
  isMultipleNodules?: boolean;
  secondaryNodules?: SecondaryNodule[];
  stas?: "negative" | "positive" | "unknown" | "not_applicable" | null;
  lvi?: "negative" | "positive" | "unknown" | "not_applicable" | null;
  vpi?: "negative" | "positive" | "unknown" | "not_applicable" | null;
  iaslcGrade?: "1" | "2" | "3" | "unknown" | null | string;
  egfr?: "positive" | "negative" | "unknown" | "not_tested" | string | null;

  biRads?: "1" | "2" | "3" | "4A" | "4B" | "4C" | "5" | "6" | string | null;
  breastLaterality?: "left" | "right" | "bilateral" | string | null;
  calcificationType?: string | null;
  erStatus?: "positive" | "negative" | "unknown" | string | null;
  erPercent?: number | null;
  prStatus?: "positive" | "negative" | "unknown" | string | null;
  prPercent?: number | null;
  her2Status?: "0" | "1+" | "2+" | "3+" | "positive" | "negative" | "low" | "zero" | "unknown" | string | null;
  her2Fish?: "positive" | "negative" | "equivocal" | "amplified" | "not_amplified" | "not_performed" | string | null;
  her2Low?: boolean | null;
  her2StatusCategory?: "positive" | "low" | "zero" | "unknown" | null;
  molecularSubtype?: "Luminal_A" | "Luminal_B_HER2_neg" | "Luminal_B_HER2_pos" | "HER2_enriched" | "TNBC" | "Triple_Negative" | "unknown" | string | null;
  nottinghamGrade?: "1" | "2" | "3" | "unknown" | string | null;
  histologyType?: "IDC" | "ILC" | "DCIS" | "other" | string | null;
  menopauseStatus?: "pre" | "post" | "peri" | "unknown" | string | null;
  oncotypeDxScore?: number | null;
  sentinelNodesPositive?: number | null;
  sentinelNodesTotal?: number | null;
  axillaryNodesPositive?: number | null;
  axillaryNodesTotal?: number | null;
  prognosticStage?: string | null;
  anatomicalStage?: string | null;
  clinicalAxillaryNodes?: "negative" | "positive" | "suspicious" | "unknown" | string | null;
  brca1?: "positive" | "negative" | "unknown" | string | null;
  brca2?: "positive" | "negative" | "unknown" | string | null;
  pik3ca?: "positive" | "negative" | "unknown" | string | null;
  chestCt?: "negative" | "positive" | "not_performed" | string | null;
  neoadjuvantChemo?: boolean | null;
  pcrStatus?: "ypT0isN0" | "partial_response" | "non_pcr" | "pCR" | "non_pCR" | string | null;
  ypTnmNotice?: any;
  isKi67GrayZone?: boolean | null;
  ki67GrayZoneNotice?: string | null;
  pelvicUltrasound?: "normal" | "thickened_endometrium" | "not_performed" | string | null;
  dxaScan?: "normal" | "osteopenia" | "osteoporosis" | "not_performed" | string | null;
}

/**
 * 肺癌患者档案 (强类型 Discriminant Union 分支)
 */
export interface LungPatientProfile extends BasePatientProfile {
  cancerType?: "lung";
  clinicalData?: LungSpecificData;
}

/**
 * 乳腺癌患者档案 (强类型 Discriminant Union 分支)
 */
export interface BreastPatientProfile extends BasePatientProfile {
  cancerType: "breast";
  clinicalData?: BreastSpecificData;
}

/**
 * 知癌维基 ZhiaiWiki 患者数字档案 (Discriminant Union 联合类型)
 * 支持基于 cancerType 属性的强类型自动收窄 (Type Narrowing)
 */
export type PatientProfile = 
  | LungPatientProfile 
  | BreastPatientProfile;

export interface GeneMutationItem {
  id: string;
  gene: "EGFR" | "ALK" | "KRAS" | "ROS1" | "BRAF" | "MET" | "RET" | "HER2" | "TP53" | "RB1" | "PIK3CA" | "Other" | string;
  subtype?: string;              // 如 "19del", "L858R", "20-ins", "T790M", "G12C", "EML4-ALK", "Exon 5-8 Missense"
  abundance?: string | number;  // 突变丰度 / VAF (%) 如 "23.5%"
  status?: "positive" | "negative" | "unknown";
  isComutation?: boolean;       // 是否为伴随突变 (如 TP53, RB1)
  note?: string;                // 备注说明
}

export interface MolecularPanelData {
  testStatus: "tested" | "not_tested" | "in_progress" | "not_indicated" | string;
  testMethod?: "NGS_panel" | "PCR" | "IHC_FISH" | "liquid_biopsy" | "other" | string;
  mutations: GeneMutationItem[];
  pdl1Tps?: "<1%" | "1-49%" | ">=50%" | "unknown" | string;
  tmb?: string | number;
  msi?: string;
  rawDetails?: string;
}
