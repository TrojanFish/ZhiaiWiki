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
  tg?: number | null;        // 甲状腺球蛋白 ng/mL (术后复发风向标)
  tgAb?: number | null;      // 甲状腺球蛋白抗体 IU/mL (排除假阴性干扰)
  calcitonin?: number | null;// 降钙素 pg/mL (甲状腺髓样癌 MTC 特异标志物)
  testDate?: string | null;  // 化验日期
  hospital?: string | null;  // 化验医院
  note?: string | null;
}

export type CancerType = "lung" | "breast" | "colon" | "rectal" | "gastric" | "liver" | "esophageal" | "colorectal" | "thyroid" | "endometrial" | "cervical" | "pancreatic";

/**
 * 结肠癌专有数据类型别名
 */
export type ColonSpecificData = ColorectalSpecificData;

/**
 * 直肠癌专有数据类型别名
 */
export type RectalSpecificData = ColorectalSpecificData;

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
}

/**
 * 结直肠癌专有临床与病理数据插槽 (Colorectal Specific Data Slot)
 */
export interface ColorectalSpecificData {
  primaryLocation?: "right_colon" | "left_colon" | "rectum" | string | null;
  distanceFromAnalVerge?: number | null; // 距肛门距离 (cm，直肠癌保肛核心判定)
  msiStatus?: "MSI-H" | "MSS" | "MSI-L" | "unknown" | string | null;
  dmmrStatus?: "dMMR" | "pMMR" | "unknown" | string | null;
  krasMutation?: "wildtype" | "G12D" | "G12V" | "G12C" | "mutated" | "unknown" | string | null;
  nrasMutation?: "wildtype" | "mutated" | "unknown" | string | null;
  brafMutation?: "V600E" | "wildtype" | "unknown" | string | null;
  her2Amplified?: boolean | null;
  crmStatus?: "negative" | "positive" | "unknown" | string | null; // 环周切缘 (CRM)
  crmDistance?: number | null; // 环周切缘距离 (mm)
  emviStatus?: "negative" | "positive" | "unknown" | string | null; // 肠壁外脉管侵犯 (EMVI)
  tumorDeposits?: "present" | "absent" | number | string | null; // 癌结节/肿瘤沉积 (TD, 直接归N1c)
  lymphNodesExamined?: number | null; // 检出淋巴结总数 (病理金标准需 >= 12 枚)
  lymphNodesPositive?: number | null; // 阳性淋巴结数
  neoadjuvantTherapy?: boolean | null; // 是否接受术前放化疗/TNT全程新辅助
  pcrStatus?: "pCR" | "non-pCR" | "unknown" | string | null; // 新辅助病理完全缓解
  ceaBaseline?: number | null; // CEA 癌胚抗原基线 (ng/mL)
  ca199Baseline?: number | null; // CA19-9 糖类抗原基线 (U/mL)
  histologyType?: string | null; // 组织学类型 (管状腺癌/黏液腺癌/印戒细胞癌等)
  differentiation?: "well" | "moderate" | "poor" | "undifferentiated" | string | null;
  bowelObstruction?: boolean | null; // 肠梗阻 (高危因素)
  bowelPerforation?: boolean | null; // 肠穿孔 (高危因素)
}

/**
 * 胃癌专有临床与病理数据插槽 (Gastric Specific Data Slot)
 * 核心特色：ESD 适应证判定、D2 淋巴结清扫质控 (>=16枚)、Lauren分型 (肠型/弥漫型/印戒细胞)、
 * Borrmann分型、HER2/Claudin 18.2/PD-L1 CPS、胃切除术式与倾倒综合征评估
 */
export interface GastricSpecificData {
  primaryLocation?: "cardia" | "fundus" | "body" | "antrum" | "pylorus" | "whole_stomach" | string | null;
  borrmannType?: "I" | "II" | "III" | "IV" | "unclassified" | string | null; // I结节型, II溃疡局限型, III溃疡浸润型, IV弥漫浸润型(革囊胃)
  laurenClassification?: "intestinal" | "diffuse" | "mixed" | "unknown" | string | null; // 肠型 vs 弥漫型(含印戒细胞)
  histologyType?: "tubular_adenocarcinoma" | "papillary" | "mucinous" | "signet_ring_cell" | "poorly_differentiated" | string | null;
  differentiation?: "well" | "moderate" | "poor" | "undifferentiated" | string | null;
  
  // 分子生物标志物与靶向免疫
  her2Status?: "negative" | "equivocal" | "positive" | "IHC_0" | "IHC_1plus" | "IHC_2plus_FISH_neg" | "IHC_2plus_FISH_pos" | "IHC_3plus" | string | null;
  claudin182Status?: "positive" | "negative" | "unknown" | string | null; // Claudin 18.2 表达 (>=75% 中强膜染色)
  pdl1Cps?: number | string | null; // PD-L1 综合阳性评分 (CPS >= 1, CPS >= 5)
  msiStatus?: "MSI-H" | "MSS" | "MSI-L" | "unknown" | string | null;
  dmmrStatus?: "dMMR" | "pMMR" | "unknown" | string | null;
  ebvStatus?: "positive" | "negative" | "unknown" | string | null; // EB病毒 (EBER 原位杂交)
  hpyloriStatus?: "positive" | "negative" | "eradicated" | "unknown" | string | null; // 幽门螺杆菌感染状态
  
  // 外科手术、质控与重建
  gastrectomyType?: "none" | "esd" | "distal" | "proximal" | "total" | "wedge" | string | null; // 手术范围
  lymphNodesExamined?: number | null; // 检出淋巴结总数 (D2 根治质控红线 >= 16 枚)
  lymphNodesPositive?: number | null; // 阳性转移淋巴结数
  reconstructionType?: "Billroth_I" | "Billroth_II" | "Roux_en_Y" | "double_tract" | string | null; // 消化道重建方式
  dumpingSyndromeGrade?: "none" | "mild" | "moderate" | "severe" | string | null; // 倾倒综合征严重度
  peritonealCytology?: "negative" | "positive" | "unknown" | string | null; // 腹水/腹腔脱落细胞学 (CY0 / CY1)
  
  // 围手术期与肿瘤大小
  neoadjuvantTherapy?: boolean | null; // 是否接受术前新辅助化疗 (FLOT / SOX)
  pcrStatus?: "pCR" | "non-pCR" | "unknown" | string | null;
  tumorSize?: number | null; // 肿瘤最大长径 (cm)
  ulcerPresent?: boolean | null; // 是否伴有溃疡 (ESD 适应证关键参数)
  ceaBaseline?: number | null; // CEA 基线
  ca199Baseline?: number | null; // CA19-9 基线
  ca724Baseline?: number | null; // CA72-4 胃癌特征标志物
}

/**
 * 原发性肝癌 (HCC) 专有临床与病理数据插槽 (Liver Specific Data Slot)
 * 核心特色：CNLC 2024 中国指南分期、Child-Pugh (A/B/C) + ALBI (1/2/3) 肝脏储备功能双核评估、
 * 乙肝病毒学三部曲阻断 (HBV DNA / 恩替卡韦/TAF)、介入治疗 (TACE / 中国特色 HAIC-FO)、
 * 靶免一线联合 (T+A / 双达方案 / 仑伐替尼 / 多纳非尼)、血清三重标志物 (AFP / PIVKA-II / AFP-L3%)
 */
export interface LiverSpecificData {
  // 1. 病毒学病因与基础肝病
  hbvStatus?: "positive" | "negative" | "cured" | "unknown" | string | null;
  hbvDnaLoad?: string | number | null; // 如 "< 20 IU/mL", "1.5E+04"
  antiviralTherapy?: boolean | null; // 是否规范服用恩替卡韦 (ETV) 或富马酸丙酚替诺福韦 (TAF)
  hcvStatus?: "positive" | "negative" | "cured" | "unknown" | string | null;
  cirrhosisStatus?: "none" | "compensated" | "decompensated" | "unknown" | string | null; // 肝硬化状态 (代偿期/失代偿期)

  // 2. 肝脏储备功能评估 (Child-Pugh 与 ALBI)
  childPughGrade?: "A" | "B" | "C" | "unknown" | string | null;
  childPughScore?: number | null; // 5 ~ 15 分
  totalBilirubin?: number | null; // 总胆红素 (umol/L)
  serumAlbumin?: number | null; // 血清白蛋白 (g/L)
  prothrombinTimeInr?: number | null; // 凝血酶原时间国际标准化比值 (INR) 或延长秒数
  ascitesStatus?: "none" | "mild" | "moderate_severe" | "refractory" | string | null; // 腹水情况
  hepaticEncephalopathy?: "none" | "grade_1_2" | "grade_3_4" | string | null; // 肝性脑病分级
  albiGrade?: "1" | "2" | "3" | string | null; // ALBI 1/2/3 级
  albiScore?: number | null; // ALBI 评分数值 (<= -2.60 为 1 级)
  icgR15?: number | null; // 吲哚菁绿 15 分钟滞留率 (%)，评估肝切除安全容积

  // 3. 肿瘤形态学与解剖学特征
  tumorCount?: "single" | "2-3" | "multiple_ge4" | number | string | null; // 肿瘤枚数
  maxTumorDiameter?: number | null; // 最大肿瘤长径 (cm)
  tumorLocation?: "left_lobe" | "right_lobe" | "caudate_lobe" | "bilateral" | string | null;
  vascularInvasion?: "none" | "microvascular_MVI" | "portal_vein_VP1_VP2" | "portal_vein_main_VP3_VP4" | "hepatic_vein_IVC" | "unknown" | string | null; // 门静脉/肝静脉癌栓
  extrahepaticMetastasis?: boolean | null; // 是否存在肝外远处转移 (肺/骨/肾上腺/腹膜/淋巴结)
  metastasisSites?: string[] | null;
  ecogPs?: number | null; // ECOG 体能状态评分 (0~4)

  // 4. CNLC 2024 分期
  cnlcStage?: "Ia" | "Ib" | "IIa" | "IIb" | "IIIa" | "IIIb" | "IV" | string | null;

  // 5. 局部与介入治疗
  resectionType?: "none" | "anatomical_hepatectomy" | "non_anatomical" | "laparoscopic" | "open" | "transplantation" | string | null;
  ablationType?: "none" | "RFA" | "MWA" | "cryoablation" | string | null; // 射频消融 / 微波消融
  interventionalTherapy?: "none" | "cTACE" | "DEB_TACE" | "HAIC_FO" | "TACE_plus_HAIC" | "TARE_Y90" | string | null; // 介入栓塞或灌注化疗
  mviGrade?: "M0" | "M1" | "M2" | "unknown" | string | null; // 微血管侵犯病理分级

  // 6. 血清学三联标志物
  afpLevel?: number | null; // 甲胎蛋白 AFP (ng/mL，正常 < 20)
  pivkaIiLevel?: number | null; // 异常凝血酶原 PIVKA-II / DCP (mAU/mL，正常 < 40)
  afpL3Percent?: number | null; // 甲胎蛋白异质体比率 AFP-L3% (正常 < 10%)
}

/**
 * 食管癌/食管鳞癌 (ESCC) 专有临床与病理数据插槽 (Esophageal Specific Data Slot)
 * 核心特色：AJCC 第 8 版食管鳞癌分期矩阵 (解剖部位 subsite + 组织分化 grade 协同)、
 * 外科与病理质控 (>=15 枚淋巴结清扫红线、二野 vs 三野清扫)、
 * 局部进展期围手术期放化疗 (NEOCRTEC5010 / CROSS / CheckMate-577)、
 * 晚期一线免疫联合化疗 (卡瑞利珠单抗 ESCORT-1st / 替雷利珠单抗 RATIONALE-306 / 帕博利珠单抗 KEYNOTE-590)、
 * 气管食管瘘 (TEF) 穿孔与主动脉侵犯红线预警、
 * 鳞癌血清标志物 (SCC + CYFRA21-1 + CEA)、术后吻合口瘘与空肠造瘘营养
 */
export interface EsophagealSpecificData {
  // 1. 解剖部位与大体病理
  subsite?: "cervical" | "upper_thoracic" | "middle_thoracic" | "lower_thoracic" | "egj_siewert_1" | string | null;
  incisorDistanceCm?: number | null; // 距门齿距离 (cm)
  histologyType?: "squamous_cell_carcinoma" | "adenocarcinoma" | "neuroendocrine" | "small_cell" | "other" | string | null;
  differentiation?: "G1_well" | "G2_moderate" | "G3_poor" | "Gx" | string | null;
  tumorLengthCm?: number | null; // 肿瘤长度 (cm)

  // 2. 浸润深度与邻近结构 (T分期与瘘管风险)
  tumorDepth?: "tis" | "t1a_mucosa" | "t1b_submucosa" | "t2_muscularis" | "t3_adventitia" | "t4a_resectable" | "t4b_unresectable" | string | null;
  airwayInvasionRisk?: boolean | null; // 气管/支气管受累 (气管食管瘘 TEF 高危)
  aorticInvasionRisk?: boolean | null; // 降主动脉受累 (>90度包绕为手术绝对禁忌)
  recurrentLaryngealNerveInvasion?: boolean | null; // 喉返神经侵犯 (声嘶)

  // 3. 淋巴结清扫与转移
  lymphNodesExamined?: number | null; // 检出淋巴结总数 (CSCO/AJCC 质控红线 >= 15 枚)
  lymphNodesPositive?: number | null; // 阳性淋巴结总数
  lymphNodeField?: "none" | "two_field" | "three_field" | string | null; // 二野 (胸腹) vs 三野 (颈胸腹) 清扫
  supraclavicularNodePositive?: boolean | null; // 锁骨上淋巴结转移
  celiacNodePositive?: boolean | null; // 腹腔动脉干淋巴结转移

  // 4. 生物标志物与免疫靶标
  pdl1Cps?: number | string | null; // PD-L1 CPS 评分 (CPS >= 10, CPS >= 1)
  pdl1Tap?: number | string | null; // PD-L1 TAP 评分 (特瑞普利单抗等标准)
  msiStatus?: "MSI-H" | "MSS" | "MSI-L" | "unknown" | string | null;
  her2Status?: string | null;

  // 5. 肿瘤标志物
  sccAntigen?: number | null; // 鳞状细胞癌抗原 SCC (ng/mL，正常 < 1.5)
  cyfra211?: number | null; // 细胞角蛋白 19 片段 (ng/mL，正常 < 3.3)
  ceaBaseline?: number | null; // 癌胚抗原 (ng/mL)

  // 6. 治疗阶段与手术康复
  treatmentPhase?: "endoscopic_esd" | "neoadjuvant_crt" | "radical_surgery" | "adjuvant_immunotherapy" | "first_line_systemic" | "palliative_stent" | string | null;
  neoadjuvantRegimen?: "NEOCRTEC5010_vinorelbine_cisplatin" | "CROSS_paclitaxel_carboplatin" | "chemotherapy_alone" | "none" | string | null;
  pcrStatus?: "pCR" | "non_pCR" | "unknown" | string | null;
  anastomoticStatus?: "intact" | "cervical_leak" | "thoracic_leak" | "stricture" | string | null;
  refluxGrade?: "none" | "mild" | "moderate" | "severe" | string | null;
  nutritionRoute?: "oral" | "jejunostomy" | "nasogastric" | "tpn" | string | null;
}


/**
 * 跨癌种共有患者基础档案基类
 */
export interface BasePatientProfile {
  id?: string;
  userId?: string;
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

  // 子宫内膜癌与宫颈癌 (妇科肿瘤专有扁平字段)
  myometrialInvasion?: "none" | "less_than_50" | "greater_equal_50" | string | null;
  lvsiStatus?: "negative" | "focal" | "substantial" | "positive" | "unknown" | string | null;
  cervicalInvolvement?: "none" | "glandular_only" | "stromal_invasion" | string | null;
  serosaAdnexaInvolvement?: "none" | "serosa" | "adnexa" | "both" | string | null;
  pelvicNodesPositive?: number | null;
  paraAorticNodesPositive?: number | null;
  hpvStatus?: "hpv16" | "hpv18" | "hpv_other_high_risk" | "negative" | "unknown" | string | null;
  coneMarginStatus?: "negative" | "positive_ectocervical" | "positive_endocervical" | "uncertain" | string | null;
  fertilityPreservationDesired?: boolean | null;
  trachelectomyCandidate?: boolean | null;
  ca125Level?: number | null;
  sccAntigen?: number | null;
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
 * 结直肠癌患者档案 (强类型 Discriminant Union 分支)
 */
export interface ColorectalPatientProfile extends BasePatientProfile {
  cancerType: "colorectal";
  clinicalData?: ColorectalSpecificData;
  cancerSpecificData?: ColorectalSpecificData;
  primaryLocation?: "right_colon" | "left_colon" | "rectum" | string | null;
  distanceFromAnalVerge?: number | null;
  msiStatus?: "MSI-H" | "MSS" | "MSI-L" | "unknown" | string | null;
  dmmrStatus?: "dMMR" | "pMMR" | "unknown" | string | null;
  krasMutation?: string | null;
  nrasMutation?: string | null;
  brafMutation?: string | null;
  her2Amplified?: boolean | null;
  crmStatus?: string | null;
  emviStatus?: string | null;
  tumorDeposits?: any;
  lymphNodesExamined?: number | null;
  lymphNodesPositive?: number | null;
  neoadjuvantTherapy?: boolean | null;
  pcrStatus?: string | null;
  ceaBaseline?: number | null;
  ca199Baseline?: number | null;
  histologyType?: string | null;
  differentiation?: string | null;
}

/**
 * 结肠癌患者档案 (强类型 Discriminant Union 分支)
 */
export interface ColonPatientProfile extends BasePatientProfile {
  cancerType: "colon";
  clinicalData?: ColonSpecificData;
  cancerSpecificData?: ColonSpecificData;
  primaryLocation?: "right_colon" | "left_colon" | "transverse_colon" | string | null;
  msiStatus?: "MSI-H" | "MSS" | "MSI-L" | "unknown" | string | null;
  dmmrStatus?: "dMMR" | "pMMR" | "unknown" | string | null;
  krasMutation?: string | null;
  nrasMutation?: string | null;
  brafMutation?: string | null;
  her2Amplified?: boolean | null;
  tumorDeposits?: any;
  lymphNodesExamined?: number | null;
  lymphNodesPositive?: number | null;
  neoadjuvantTherapy?: boolean | null;
  ceaBaseline?: number | null;
  ca199Baseline?: number | null;
  histologyType?: string | null;
  differentiation?: string | null;
}

/**
 * 直肠癌患者档案 (强类型 Discriminant Union 分支)
 */
export interface RectalPatientProfile extends BasePatientProfile {
  cancerType: "rectal";
  clinicalData?: RectalSpecificData;
  cancerSpecificData?: RectalSpecificData;
  distanceFromAnalVerge?: number | null;
  crmStatus?: string | null;
  emviStatus?: string | null;
  msiStatus?: "MSI-H" | "MSS" | "MSI-L" | "unknown" | string | null;
  dmmrStatus?: "dMMR" | "pMMR" | "unknown" | string | null;
  krasMutation?: string | null;
  nrasMutation?: string | null;
  brafMutation?: string | null;
  her2Amplified?: boolean | null;
  tumorDeposits?: any;
  lymphNodesExamined?: number | null;
  lymphNodesPositive?: number | null;
  neoadjuvantTherapy?: boolean | null;
  pcrStatus?: string | null;
  watchAndWait?: boolean | null;
  stomaStatus?: string | null;
  ceaBaseline?: number | null;
  ca199Baseline?: number | null;
  histologyType?: string | null;
  differentiation?: string | null;
}

/**
 * 胃癌患者档案 (强类型 Discriminant Union 分支)
 */
export interface GastricPatientProfile extends BasePatientProfile {
  cancerType: "gastric";
  clinicalData?: GastricSpecificData;
  cancerSpecificData?: GastricSpecificData;
  primaryLocation?: "cardia" | "fundus" | "body" | "antrum" | "pylorus" | "whole_stomach" | string | null;
  borrmannType?: string | null;
  laurenClassification?: string | null;
  histologyType?: string | null;
  her2Status?: string | null;
  claudin182Status?: string | null;
  pdl1Cps?: number | string | null;
  msiStatus?: string | null;
  dmmrStatus?: string | null;
  ebvStatus?: string | null;
  hpyloriStatus?: string | null;
  lymphNodesExamined?: number | null;
  lymphNodesPositive?: number | null;
  gastrectomyType?: string | null;
  reconstructionType?: string | null;
  dumpingSyndromeGrade?: string | null;
  peritonealCytology?: string | null;
  ulcerPresent?: boolean | null;
  ceaBaseline?: number | null;
  ca199Baseline?: number | null;
  ca724Baseline?: number | null;
}

/**
 * 原发性肝癌患者档案 (强类型 Discriminant Union 分支)
 */
export interface LiverPatientProfile extends BasePatientProfile {
  cancerType: "liver";
  clinicalData?: LiverSpecificData;
  cancerSpecificData?: LiverSpecificData;
  cnlcStage?: string | null;
  childPughGrade?: string | null;
  childPughScore?: number | null;
  albiGrade?: string | null;
  albiScore?: number | null;
  hbvStatus?: string | null;
  hbvDnaLoad?: string | number | null;
  antiviralTherapy?: boolean | null;
  cirrhosisStatus?: string | null;
  tumorCount?: string | number | null;
  maxTumorDiameter?: number | null;
  vascularInvasion?: string | null;
  extrahepaticMetastasis?: boolean | null;
  interventionalTherapy?: string | null;
  resectionType?: string | null;
  ablationType?: string | null;
  mviGrade?: string | null;
  afpLevel?: number | null;
  pivkaIiLevel?: number | null;
  afpL3Percent?: number | null;
}

/**
 * 食管癌患者档案 (强类型 Discriminant Union 分支)
 */
export interface EsophagealPatientProfile extends BasePatientProfile {
  cancerType: "esophageal";
  clinicalData?: EsophagealSpecificData;
  cancerSpecificData?: EsophagealSpecificData;
  subsite?: string | null;
  histologyType?: string | null;
  differentiation?: string | null;
  tumorDepth?: string | null;
  lymphNodesExamined?: number | null;
  lymphNodesPositive?: number | null;
  lymphNodeField?: string | null;
  airwayInvasionRisk?: boolean | null;
  aorticInvasionRisk?: boolean | null;
  pdl1Cps?: number | string | null;
  sccAntigen?: number | null;
  cyfra211?: number | null;
  anastomoticStatus?: string | null;
  refluxGrade?: string | null;
  nutritionRoute?: string | null;
}

/**
 * 甲状腺癌 (Thyroid Cancer - TC) 专有临床与病理数据插槽 (Thyroid Specific Data Slot)
 * 核心特色：AJCC 第 8 版以 55 岁为切点的特异性分期 (分化型 DTC <55 岁仅 I/II 期)、
 * 超声 C-TIRADS / ACR TI-RADS 1~5 类分级评估、
 * 组织病理学分类 (经典型/高细胞亚型 PTC、滤泡状癌 FTC、髓样癌 MTC、未分化癌 ATC)、
 * 外科术式与质控 (腺叶+峡部切除 vs 全切、中央区 VI 区 vs 颈侧区 II-V 区清扫)、
 * 喉返神经 (RLN) 与甲状旁腺功能保护 (PTH 与血钙监测)、
 * ATA 2015 术后动态复发风险分层 (低危/中危/高危)、
 * TSH 抑制治疗目标区间与优甲乐 (L-T4) 吸收时序、
 * 碘-131 (RAI) 清甲清灶与低碘饮食、RAIR-DTC 碘难治判定、
 * 分子遗传学 (BRAF V600E, TERT 启动子, RET 重排/突变) 与血清标志物 (Tg + TgAb, 降钙素)
 */
export interface ThyroidSpecificData {
  histologyType?: "PTC_classic" | "PTC_tall_cell" | "PTC_hobnail" | "FTC" | "hurthle_oncocytic" | "MTC" | "ATC" | "other" | string | null;
  patientAge?: number | null; // 年龄 (55 岁为 AJCC 8th 分期分水岭)
  tumorSize?: number | null; // 结节/肿瘤最大径 (cm)
  multifocality?: boolean | null; // 单发 vs 多灶性
  isBilateral?: boolean | null; // 单侧叶 vs 双侧叶累及

  // 超声 TIRADS 特征
  ultrasoundTirads?: "1" | "2" | "3" | "4A" | "4B" | "4C" | "5" | "6" | string | null;
  aspectRatioGtOne?: boolean | null; // 纵横比 A/T > 1
  microcalcifications?: boolean | null; // 砂砾样微钙化 (<=1mm)
  hypoechoic?: "marked" | "moderate" | "isoechoic" | "hyperechoic" | string | null;
  irregularMargin?: boolean | null;
  extrathyroidalUltrasound?: boolean | null;

  // 浸润深度与被膜侵犯 (T分期)
  extrathyroidalExtension?: "none" | "microscopic" | "strap_muscles_t3b" | "gross_organs_t4a" | "prevertebral_carotid_t4b" | string | null;

  // 淋巴结清扫与转移 (N分期)
  centralNodesPositive?: number | null; // 中央区 VI/VII 区阳性淋巴结数 (N1a)
  centralNodesExamined?: number | null;
  lateralNodesPositive?: number | null; // 颈侧区 I~V 区阳性淋巴结数 (N1b)
  lateralNodesExamined?: number | null;
  extranodalExtension?: boolean | null;

  // 远处转移 (M分期)
  hasDistantMets?: boolean | null;
  metastasisSites?: string[] | null;

  // ATA 2015 术后动态复发风险分层与 TSH 目标
  ataRiskLevel?: "low" | "intermediate" | "high" | string | null;
  tshSuppressionTarget?: "<0.1" | "0.1-0.5" | "0.5-2.0" | string | null;
  currentTsh?: number | null;

  // 外科术式与神经/旁腺保护
  surgicalMethod?: "lobectomy" | "total_thyroidectomy" | "subtotal" | "active_surveillance" | string | null;
  pthLevel?: number | null; // 术后甲状旁腺素 PTH (pg/mL，正常 15~65)
  serumCalcium?: number | null; // 血清总钙 (mmol/L，正常 2.11~2.52)
  vocalCordMobility?: "normal" | "unilateral_paralysis" | "bilateral_paralysis" | string | null;

  // 放射性核素碘-131 (RAI) 与碘难治
  raiAblationReceived?: boolean | null;
  raiDoseMci?: number | null;
  raiRefractory?: boolean | null;

  // 分子病理学基因变异
  brafV600e?: "positive" | "negative" | "unknown" | string | null;
  tertPromoter?: "positive" | "negative" | "unknown" | string | null;
  retAlteration?: "positive" | "negative" | "unknown" | string | null;
  rasMutation?: "positive" | "negative" | "unknown" | string | null;

  // 肿瘤标志物风向标
  tgLevel?: number | null; // 甲状腺球蛋白 Tg (ng/mL)
  tgAbLevel?: number | null; // 甲状腺球蛋白抗体 TgAb (IU/mL)
  calcitoninLevel?: number | null; // 降钙素 (pg/mL)
  ceaBaseline?: number | null;
}

export interface ThyroidPatientProfile extends BasePatientProfile {
  cancerType: "thyroid";
  clinicalData?: ThyroidSpecificData;
  cancerSpecificData?: ThyroidSpecificData;
  histologyType?: string | null;
  patientAge?: number | null;
  tumorSize?: number | null;
  ultrasoundTirads?: string | null;
  extrathyroidalExtension?: string | null;
  centralNodesPositive?: number | null;
  lateralNodesPositive?: number | null;
  ataRiskLevel?: string | null;
  tshSuppressionTarget?: string | null;
  currentTsh?: number | null;
  tgLevel?: number | null;
  tgAbLevel?: number | null;
  calcitoninLevel?: number | null;
  surgicalMethod?: string | null;
  raiRefractory?: boolean | null;
  brafV600e?: string | null;
}

/**
 * 子宫内膜癌 (Endometrial Cancer - EC) 专有临床与病理数据插槽 (Endometrial Specific Data Slot)
 * 核心特色：FIGO 2023 最新国际分期体系、TCGA 四大分子分型 (POLEmut / MMRd / NSMP / p53abn) 分期重塑、
 * 肌层浸润深度 (<50% vs >=50%)、脉管浸润 (LVSI) 阴性/局灶/显著分级、
 * 宫颈间质侵犯 (Stage II)、淋巴结转移 (盆腔 IIIC1 vs 腹主动脉旁 IIIC2)、
 * 年轻未育患者大剂量孕激素 (MA/MPA) 保育逆转评估、Lynch 综合征遗传筛查与 MMR 免疫组化
 */
export interface EndometrialSpecificData {
  histologyType?: "endometrioid_G1" | "endometrioid_G2" | "endometrioid_G3" | "serous" | "clear_cell" | "carcinosarcoma" | "mixed" | "other" | string | null;
  differentiation?: "well_G1" | "moderate_G2" | "poor_G3" | string | null;
  tumorSize?: number | null; // 肿瘤最大长径 (cm)
  patientAge?: number | null;

  // FIGO 2023 四大分子生物学亚型 (重大革命性指标)
  molecularSubtype?: "POLEmut" | "MMRd" | "NSMP" | "p53abn" | "unknown" | string | null;
  poleMutationStatus?: "pathogenic_mutant" | "wildtype" | "unknown" | string | null; // POLE 超突变 (预后极佳，免除辅助放化疗)
  mmrStatus?: "dMMR" | "pMMR" | "unknown" | string | null; // MMR 蛋白表达 (MLH1/PMS2/MSH2/MSH6)
  msiStatus?: "MSI-H" | "MSS" | "MSI-L" | "unknown" | string | null;
  p53Status?: "wildtype" | "aberrant_null_or_overexpressed" | "unknown" | string | null; // p53 异常 (预后高危，升期至 IICm_p53abn)

  // 解剖与组织病理浸润深度
  myometrialInvasion?: "none" | "less_than_50" | "greater_equal_50" | string | null; // 肌层浸润深度 (<1/2 vs >=1/2)
  myometrialDepthPercent?: number | null; // 肌层浸润实际百分比 (0~100%)
  lvsiStatus?: "negative" | "focal" | "substantial" | "positive" | "unknown" | string | null; // 脉管浸润 LVSI
  cervicalInvolvement?: "none" | "glandular_only" | "stromal_invasion" | string | null; // 宫颈受累 (腺体受累 vs 间质浸润)
  serosaAdnexaInvolvement?: "none" | "serosa" | "adnexa" | "both" | string | null; // 浆膜/附件转移 (Stage IIIA)
  vaginalParametrialInvolvement?: "none" | "vagina" | "parametrium" | "both" | string | null; // 阴道/宫旁浸润 (Stage IIIB)

  // 淋巴结清扫与转移 (Stage IIIC)
  pelvicNodesPositive?: number | null; // 盆腔阳性淋巴结数 (IIIC1)
  pelvicNodesExamined?: number | null;
  paraAorticNodesPositive?: number | null; // 腹主动脉旁阳性淋巴结数 (IIIC2)
  paraAorticNodesExamined?: number | null;
  sentinelNodeMapping?: boolean | null; // 前哨淋巴结荧光示踪活检 (SLN)

  // 远处转移与腹水
  hasDistantMets?: boolean | null;
  metastasisSites?: string[] | null;
  peritonealCytology?: "positive" | "negative" | "unknown" | string | null;

  // 免疫组化受体与靶向分子
  erStatus?: "positive" | "negative" | "unknown" | string | null; // 雌激素受体 (内分泌治疗敏感度)
  prStatus?: "positive" | "negative" | "unknown" | string | null; // 孕激素受体
  her2Status?: "positive" | "negative" | "equivocal" | string | null; // 浆液性内膜癌曲妥珠单抗靶点
  ca125Level?: number | null; // CA125 糖类抗原 (U/mL)

  // 年轻患者生育力保留需求与激素逆转
  fertilityPreservationDesired?: boolean | null; // 是否渴望保留生育功能
  progestinTherapy?: boolean | null; // 是否接受大剂量孕激素 (甲地孕酮 MA / 甲羟孕酮 MPA / 曼月乐 LNG-IUS)
  hysteroscopyFollowupMonths?: number | null; // 宫腔镜密切随访间隔月数 (通常 3~6 个月)
  lynchSyndromeScreened?: boolean | null; // Lynch 综合征家族遗传排查
}

export interface EndometrialPatientProfile extends BasePatientProfile {
  cancerType: "endometrial";
  clinicalData?: EndometrialSpecificData;
  cancerSpecificData?: EndometrialSpecificData;
  histologyType?: string | null;
  molecularSubtype?: string | null;
  myometrialInvasion?: string | null;
  lvsiStatus?: string | null;
  cervicalInvolvement?: string | null;
  pelvicNodesPositive?: number | null;
  paraAorticNodesPositive?: number | null;
  fertilityPreservationDesired?: boolean | null;
  ca125Level?: number | null;
}

/**
 * 宫颈癌 (Cervical Cancer - CC) 专有临床与病理数据插槽 (Cervical Specific Data Slot)
 * 核心特色：FIGO 2018 / AJCC 第 9 版宫颈癌分期标准、
 * 早期微小浸润 (IA1 <=3mm / IA2 3~5mm) 锥切 (LEEP/CKC) 切缘评估与管理、
 * IB1 (<=2cm) / IB2 (2~4cm) / IB3 (>4cm) 大体尺寸精细分水岭、
 * 局部进展期 (IB3/IIA2/IIB~IVA) 根治性同步放化疗 (CCRT) + MRI 引导三维近距离后装放疗绝对金标准 (严禁盲目直接开刀)、
 * 年轻早期患者保留生育功能广泛宫颈切除术 (Trachelectomy)、
 * 晚期/复发转移一线帕博利珠单抗+化疗+贝伐珠单抗 (KEYNOTE-826) 循证突破、
 * 高危型 HPV (16/18等) 持续感染与鳞状细胞癌抗原 (SCC) 动态监测
 */
export interface CervicalSpecificData {
  histologyType?: "squamous_cell" | "adenocarcinoma" | "adenosquamous" | "neuroendocrine" | "small_cell" | "other" | string | null;
  differentiation?: "well_G1" | "moderate_G2" | "poor_G3" | string | null;
  tumorSize?: number | null; // 宫颈外生病灶最大长径 (cm)
  stromalInvasionMm?: number | null; // 间质浸润深度 (mm, <=3mm 为 IA1, 3~5mm 为 IA2)
  horizontalSpreadMm?: number | null; // 水平蔓延宽度 (mm)

  // 局部浸润与解剖累及 (Stage II/III/IV)
  vaginalInvolvement?: "none" | "upper_two_thirds" | "lower_one_third" | string | null; // 阴道累及 (上2/3 IIA vs 下1/3 IIIA)
  parametrialInvasion?: boolean | null; // 宫旁浸润 (IIB，手术禁忌，CCRT 适应证)
  pelvicSidewallOrHydronephrosis?: boolean | null; // 侵犯盆壁或肾盂积水/无功能肾 (IIIB)

  // 淋巴结受累 (FIGO 2018 升期关键 IIIC)
  pelvicNodesPositive?: number | null; // 盆腔阳性淋巴结 (IIIC1)
  pelvicNodesExamined?: number | null;
  paraAorticNodesPositive?: number | null; // 腹主动脉旁阳性淋巴结 (IIIC2)
  paraAorticNodesExamined?: number | null;
  nodalStagingMethod?: "pathologic_p" | "radiologic_r" | "clinical" | string | null; // 淋巴结检出途径 (pIIIC / rIIIC)

  // 远处转移与邻近器官侵犯 (Stage IVA/IVB)
  bladderRectalMucosaInvasion?: boolean | null; // 膀胱/直肠黏膜受累 (IVA)
  hasDistantMets?: boolean | null; // 远处转移 (IVB)
  metastasisSites?: string[] | null;

  // 病毒感染学与标志物
  hpvStatus?: "hpv16" | "hpv18" | "hpv_other_high_risk" | "negative" | "unknown" | string | null;
  hpvDnaTiter?: string | number | null;
  sccAntigen?: number | null; // 鳞状细胞癌抗原 SCC (ng/mL，正常 < 1.5)
  ca125Level?: number | null;

  // 早期手术与锥切质控
  coneMarginStatus?: "negative" | "positive_ectocervical" | "positive_endocervical" | "uncertain" | string | null; // 锥切切缘
  surgicalMethod?: "cone_biopsy" | "radical_trachelectomy" | "radical_hysterectomy_open" | "radical_hysterectomy_laparoscopic" | "none_ccrt" | string | null;
  fertilityPreservationDesired?: boolean | null; // 是否强烈渴望保留生育功能
  trachelectomyCandidate?: boolean | null; // 是否符合广泛宫颈切除保生育准入标准

  // 放化疗与免疫靶向
  treatmentPhase?: "surgery" | "definitive_ccrt" | "adjuvant_rt" | "systemic_immunotherapy" | string | null;
  pdl1Cps?: number | string | null; // PD-L1 CPS 综合阳性评分 (CPS >= 1, CPS >= 10 指导帕博利珠单抗)
  bevacizumabEligible?: boolean | null; // 是否适合加用贝伐珠单抗 (需排除阴道大出血及瘘管风险)
}

export interface CervicalPatientProfile extends BasePatientProfile {
  cancerType: "cervical";
  clinicalData?: CervicalSpecificData;
  cancerSpecificData?: CervicalSpecificData;
  histologyType?: string | null;
  tumorSize?: number | null;
  stromalInvasionMm?: number | null;
  vaginalInvolvement?: string | null;
  parametrialInvasion?: boolean | null;
  pelvicNodesPositive?: number | null;
  paraAorticNodesPositive?: number | null;
  hpvStatus?: string | null;
  coneMarginStatus?: string | null;
  fertilityPreservationDesired?: boolean | null;
  pdl1Cps?: number | string | null;
  sccAntigen?: number | null;
}

export interface PancreaticSpecificData {
  primarySite?: "head" | "body" | "tail" | "uncinate" | string | null;
  tumorSize?: number | null;
  resectabilityStatus?: "resectable" | "borderline_resectable" | "locally_advanced" | "metastatic" | string | null;
  smvPvInvolvement?: boolean | null;
  smvPvDegree?: "<=180" | ">180" | "occluded" | string | null;
  celiacInvolvement?: boolean | null;
  smaInvolvement?: boolean | null;
  chaInvolvement?: boolean | null;
  regionalNodesPositive?: number | null;
  ca199?: number | null;
  ca199Status?: "normal" | "elevated" | "extremely_high" | "lewis_negative" | string | null;
  brcaMutation?: "positive" | "negative" | "unknown" | string | null;
  krasStatus?: "wild_type" | "G12D" | "G12V" | "G12R" | "other_mutant" | "unknown" | string | null;
  surgicalProcedure?: "whipple" | "distal_pancreatectomy_ramps" | "total_pancreatectomy" | "none" | string | null;
  marginStatus?: "R0" | "R1" | "R2" | "unknown" | string | null;
  peiSymptoms?: boolean | null;
  pertDosage?: string | null;
}

export interface PancreaticPatientProfile extends BasePatientProfile {
  cancerType: "pancreatic";
  clinicalData?: PancreaticSpecificData;
  cancerSpecificData?: PancreaticSpecificData;
  primarySite?: string | null;
  tumorSize?: number | null;
  resectabilityStatus?: string | null;
  smvPvInvolvement?: boolean | null;
  celiacInvolvement?: boolean | null;
  smaInvolvement?: boolean | null;
  ca199?: number | null;
  brcaMutation?: string | null;
  krasStatus?: string | null;
}

/**
 * 知癌维基 ZhiaiWiki 多癌种通用患者数字档案 (Discriminant Union 联合类型)
 * 支持基于 cancerType 属性的强类型自动收窄 (Type Narrowing)
 */
export type PatientProfile = 
  | LungPatientProfile 
  | BreastPatientProfile 
  | ColorectalPatientProfile
  | ColonPatientProfile
  | RectalPatientProfile
  | GastricPatientProfile
  | LiverPatientProfile
  | EsophagealPatientProfile
  | ThyroidPatientProfile
  | EndometrialPatientProfile
  | CervicalPatientProfile
  | PancreaticPatientProfile;

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
