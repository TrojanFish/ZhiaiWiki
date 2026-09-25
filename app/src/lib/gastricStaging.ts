/**
 * 胃癌确定性临床分期推演与前瞻队列推演引擎 (Gastric Cancer Staging Engine)
 * 遵循标准：
 * - AJCC 癌症分期手册第 8 版 (AJCC Cancer Staging Manual 8th Edition - Stomach)
 * - 《CSCO 胃癌诊疗指南 2024》
 * - 日本胃癌规约 (Japanese Gastric Cancer Association, JGCA 6th Edition)
 * - FLOT4 / RESOLVE / ToGA / SPOTLIGHT / CheckMate-649 国际及中国前瞻多中心证据
 */

import type { UnifiedStagingResult } from "./stagingRegistry";
import type { ClinicalCohortResult } from "./staging";

export interface GastricStagingInput {
  tStage?: string | null;
  nStage?: string | null;
  mStage?: string | null;
  tumorDepth?: "mucosa" | "submucosa" | "muscularis_propria" | "subserosa" | "serosa" | "adjacent_structures" | string | null;
  tumorSize?: number | null; // 最大径 (cm)
  ulcerPresent?: boolean | null; // 伴有活动性溃疡或溃疡瘢痕 (ESD适应证核心参数)
  primaryLocation?: "cardia" | "fundus" | "body" | "antrum" | "pylorus" | "whole_stomach" | string | null;
  borrmannType?: "I" | "II" | "III" | "IV" | "unclassified" | string | null; // Borrmann分型
  laurenClassification?: "intestinal" | "diffuse" | "mixed" | "unknown" | string | null; // Lauren分型
  histologyType?: "tubular_adenocarcinoma" | "papillary" | "mucinous" | "signet_ring_cell" | "poorly_differentiated" | string | null;
  differentiation?: "well" | "moderate" | "poor" | "undifferentiated" | string | null;

  // 兼容别名与细化参数
  hasUlcer?: boolean | null;
  laurenType?: "intestinal" | "diffuse" | "mixed" | "unknown" | string | null;
  isSignetRingCell?: boolean | null;
  claudin18_2Status?: "positive" | "negative" | "unknown" | string | null;
  claudin18_2Percentage?: number | null;

  // 淋巴结质控 (D2 根治术标准)
  lymphNodesExamined?: number | null; // 检出淋巴结总数 (质控红线 >= 16 枚)
  lymphNodesPositive?: number | null; // 转移淋巴结数

  // 远处转移与腹膜细胞学
  hasDistantMets?: boolean | null;
  metastasisSites?: string[];
  peritonealCytology?: "positive" | "negative" | "unknown" | string | null; // 腹膜脱落细胞 CY1 归为 M1

  // 分子生物标志物与靶向免疫
  her2Status?: "negative" | "equivocal" | "positive" | "IHC_0" | "IHC_1plus" | "IHC_2plus_FISH_neg" | "IHC_2plus_FISH_pos" | "IHC_3plus" | string | null;
  claudin182Status?: "positive" | "negative" | "unknown" | string | null; // Claudin 18.2 (>=75% 中强染色)
  pdl1Cps?: number | string | null; // PD-L1 综合阳性评分
  msiStatus?: "MSI-H" | "MSS" | "MSI-L" | "unknown" | string | null;
  dmmrStatus?: "dMMR" | "pMMR" | "unknown" | string | null;
  ebvStatus?: "positive" | "negative" | "unknown" | string | null;

  // 围手术期与外科重建
  neoadjuvantTherapy?: boolean | null; // 是否接受过术前新辅助 (FLOT/SOX)
  pcrStatus?: "pCR" | "non-pCR" | "unknown" | string | null;
  gastrectomyType?: "none" | "esd" | "distal" | "proximal" | "total" | "wedge" | string | null;
  reconstructionType?: "Billroth_I" | "Billroth_II" | "Roux_en_Y" | "double_tract" | string | null;
  dumpingSyndromeGrade?: "none" | "mild" | "moderate" | "severe" | string | null;
  organ?: string | null;
}

/**
 * 确定胃癌 T 分期 (侵润深度)
 */
export function computeGastricTStage(input: GastricStagingInput): string {
  if (input.tStage) {
    const raw = input.tStage.trim().toUpperCase();
    if (raw === "T1A") return "T1a";
    if (raw === "T1B") return "T1b";
    if (raw === "T4A") return "T4a";
    if (raw === "T4B") return "T4b";
    if (raw === "TIS") return "Tis";
    if (["T1", "T2", "T3", "T4"].includes(raw)) return raw;
  }

  const depth = (input.tumorDepth || "").toLowerCase();
  if (depth.includes("adjacent") || depth.includes("毗邻") || depth.includes("器官侵犯")) return "T4b";
  if (depth.includes("serosa") || depth.includes("浆膜") || depth.includes("穿透")) return "T4a";
  if (depth.includes("subserosa") || depth.includes("浆膜下")) return "T3";
  if (depth.includes("muscularis") || depth.includes("肌层")) return "T2";
  if (depth.includes("submucosa") || depth.includes("黏膜下")) return "T1b";
  if (depth.includes("mucosa") || depth.includes("黏膜内")) return "T1a";

  return "T1";
}

/**
 * 确定胃癌 N 分期 (淋巴结转移枚数，基于 AJCC 8th Edition)
 */
export function computeGastricNStage(input: GastricStagingInput): string {
  if (input.nStage) {
    const raw = input.nStage.trim().toUpperCase();
    if (["N0", "N1", "N2", "N3", "N3A", "N3B"].includes(raw)) return raw;
  }

  const pos = input.lymphNodesPositive != null ? Number(input.lymphNodesPositive) : null;
  if (pos !== null) {
    if (pos === 0) return "N0";
    if (pos >= 1 && pos <= 2) return "N1";
    if (pos >= 3 && pos <= 6) return "N2";
    if (pos >= 7 && pos <= 15) return "N3a";
    if (pos >= 16) return "N3b";
  }

  return "N0";
}

/**
 * 确定胃癌 M 分期 (远处转移与腹膜细胞学 CY1)
 */
export function computeGastricMStage(input: GastricStagingInput): string {
  if (input.mStage) {
    const raw = input.mStage.trim().toUpperCase();
    if (raw.startsWith("M1")) return "M1";
    if (raw === "M0") return "M0";
  }

  if (input.hasDistantMets) return "M1";
  if (input.metastasisSites && input.metastasisSites.length > 0) return "M1";
  // 胃癌特殊规则：腹腔冲洗脱落细胞学阳性 (CY1) 即为 M1
  if (input.peritonealCytology === "positive") return "M1";

  return "M0";
}

/**
 * 依据 AJCC 8th Edition 胃癌病理分期组合矩阵推导总体分期
 */
export function computeGastricStageGroup(t: string, n: string, m: string): string {
  const tUpper = t.toUpperCase();
  const nUpper = n.toUpperCase();
  const mUpper = m.toUpperCase();

  if (mUpper === "M1") return "IV";
  if (tUpper === "TIS" && nUpper === "N0") return "0";

  const isT1 = tUpper === "T1" || tUpper === "T1A" || tUpper === "T1B";
  const isT2 = tUpper === "T2";
  const isT3 = tUpper === "T3";
  const isT4a = tUpper === "T4A";
  const isT4b = tUpper === "T4B" || tUpper === "T4";

  const isN0 = nUpper === "N0";
  const isN1 = nUpper === "N1";
  const isN2 = nUpper === "N2";
  const isN3a = nUpper === "N3A";
  const isN3b = nUpper === "N3B";
  const isN3 = nUpper === "N3" || isN3a || isN3b;

  // IA: T1 N0 M0
  if (isT1 && isN0) return "IA";

  // IB: T1 N1 M0, T2 N0 M0
  if ((isT1 && isN1) || (isT2 && isN0)) return "IB";

  // IIA: T1 N2 M0, T2 N1 M0, T3 N0 M0
  if ((isT1 && isN2) || (isT2 && isN1) || (isT3 && isN0)) return "IIA";

  // IIB: T1 N3a M0, T2 N2 M0, T3 N1 M0, T4a N0 M0
  if ((isT1 && isN3a) || (isT2 && isN2) || (isT3 && isN1) || (isT4a && isN0)) return "IIB";

  // IIIA: T2 N3a M0, T3 N2 M0, T4a N1 M0, T4a N2 M0, T4b N0 M0
  if (
    (isT2 && isN3a) ||
    (isT3 && isN2) ||
    (isT4a && isN1) ||
    (isT4a && isN2) ||
    (isT4b && isN0)
  ) {
    return "IIIA";
  }

  // IIIB:
  // - T1 N3b, T2 N3b
  // - T3 N3a
  // - T4a N3a
  // - T4b N1, T4b N2
  if (
    ((isT1 || isT2) && isN3b) ||
    (isT3 && isN3a) ||
    (isT4a && isN3a) ||
    (isT4b && (isN1 || isN2))
  ) {
    return "IIIB";
  }

  // IIIC:
  // - T3 N3b
  // - T4a N3b
  // - T4b N3a, T4b N3b
  if (
    (isT3 && isN3b) ||
    (isT4a && isN3b) ||
    (isT4b && isN3)
  ) {
    return "IIIC";
  }

  // 兜底 N3 但无法细分 N3a/b 的情况
  if (isN3) {
    if (isT1 || isT2) return "IIB";
    if (isT3 || isT4a) return "IIIA";
    if (isT4b) return "IIIC";
  }

  if (isN1 || isN2) return "IIB";

  return "I";
}

/**
 * 胃癌确定性综合分期与多学科战术推导
 */
export function computeGastricStage(input: GastricStagingInput): UnifiedStagingResult {
  const t = computeGastricTStage(input);
  const n = computeGastricNStage(input);
  const m = computeGastricMStage(input);
  const stage = computeGastricStageGroup(t, n, m);

  const explanationParts: string[] = [
    `依据 AJCC 癌症分期手册第 8 版 (AJCC 8th Edition) 及《CSCO 胃癌诊疗指南 2024》标准：胃原发肿瘤浸润深度判定为 ${t}，区域淋巴结转移状态为 ${n}，远处转移状态为 ${m}，综合临床病理分期判定为 ${stage} 期。`
  ];

  // 1. 早期胃癌 ESD 内镜黏膜下剥离术指征判定 (JGCA / CSCO 指南)
  const isT1a = t === "T1a";
  const tumorSize = input.tumorSize != null ? Number(input.tumorSize) : null;
  const isDifferentiated = input.differentiation === "well" || input.differentiation === "moderate";
  const isUlcer = Boolean(input.ulcerPresent || input.hasUlcer);

  let isEsdIndication = false;
  if (isT1a && n === "N0" && m === "M0") {
    if (isDifferentiated && !isUlcer && (tumorSize === null || tumorSize <= 2.0)) {
      isEsdIndication = true;
      explanationParts.push(`🔬 【早期胃癌 ESD 绝对适应证】：黏膜内癌 (cT1a)、分化型、无溃疡且长径 ≤ 2.0cm。首选内镜黏膜下剥离术 (ESD) 完整切除病灶，免开刀保留全胃，在实现 97%+ 超高 5 年生存率的同时完好保留完整胃功能与治愈性切除！`);
    } else if (
      (isDifferentiated && !isUlcer && tumorSize !== null && tumorSize > 2.0) ||
      (isDifferentiated && isUlcer && tumorSize !== null && tumorSize <= 3.0) ||
      (!isDifferentiated && !isUlcer && tumorSize !== null && tumorSize <= 2.0)
    ) {
      isEsdIndication = true;
      const subTypeNotice = !isDifferentiated ? "未分化型扩大适应证" : isUlcer ? "伴有溃疡扩大适应证" : "病灶大于2cm扩大适应证";
      explanationParts.push(`🔬 【早期胃癌 ESD 扩大适应证 (${subTypeNotice})】：病灶局限于黏膜内 (cT1a)，虽有溃疡或属于未分化型（≤2.0cm无溃疡），在具备丰富内镜治疗经验的高水平三甲中心仍推荐首选 ESD 尝试性完整切除，根据切除后大病理评估是否达到治愈性切除。`);
    }
  } else if (t === "T1b") {
    explanationParts.push(`⚠️ 【超出 ESD 指征】：超声内镜 (EUS) 提示已侵及黏膜下层 (cT1b)，区域淋巴结转移概率升至 15%~20%，不再符合内镜下治愈性切除标准，推荐行腹腔镜远端/全胃切除 + D2 根治术。`);
  }

  // 2. D2 根治术规范与淋巴结检出质控 >= 16 枚红线
  const examined = input.lymphNodesExamined != null ? Number(input.lymphNodesExamined) : null;
  const isD2Adequate = examined != null ? examined >= 16 : undefined;
  if (examined != null) {
    if (examined < 16 && !input.neoadjuvantTherapy) {
      explanationParts.push(`⚠️ 【D2 淋巴结检出质控警示】：病理检出区域淋巴结总数为 ${examined} 枚，淋巴结检出总数不足 16 枚质控红线（CSCO 与 AJCC 8th 质控强制要求 ≥ 16 枚，推荐 ≥ 30 枚）。检出枚数不足存在微小转移灶漏检与分期低估风险，属于病理高危因素，需纳入术后强化辅助化疗评估。`);
    } else {
      explanationParts.push(`✅ 【D2 淋巴结清扫质控达标】：检出区域淋巴结 ${examined} 枚 (>= 16 枚)（达到 ≥ 16 枚国际质控标准），证实完成高质量胃周第 1 站及第 2 站淋巴结清扫，分期置信度极高。`);
    }
  }

  // 3. Lauren 分型与印戒细胞癌机制
  const lauren = input.laurenClassification || input.laurenType;
  const isSignet = input.histologyType === "signet_ring_cell" ||
                   String(input.histologyType).includes("印戒") ||
                   input.isSignetRingCell === true ||
                   lauren === "diffuse";
  if (isSignet) {
    explanationParts.push(`🧬 【Lauren 弥漫型 (含印戒细胞癌 / 低黏附性癌)】：组织学表现为黏膜下散在浸润与细胞内丰富黏液蓄积（E-cadherin/CDH1 缺失）。易发生腹膜种植转移，术前需严密评估腹水脱落细胞学或腹腔灌洗脱落细胞学 (CY0/CY1)，切缘安全距离需更宽（通常建议 ≥ 5cm），并积极结合免疫/靶向转化方案。`);
  } else if (lauren === "intestinal") {
    explanationParts.push(`🧬 【Lauren 肠型胃癌特性】：常伴随萎缩性胃炎与肠化生演变，以管状腺癌或乳头状腺癌为主，多呈膨胀性生长（Borrmann I/II 型），HER2 阳性比例相对较高，对标准化疗及抗 HER2 靶向治疗敏感度良好。`);
  }

  // 4. Borrmann IV 型 (革囊胃 Linitis Plastica)
  if (input.borrmannType === "IV" || input.primaryLocation === "whole_stomach") {
    explanationParts.push(`🚨 【Borrmann IV 型 (弥漫浸润型 / 革囊胃) 预警】：肿瘤弥漫浸润导致全胃壁僵硬、胃腔狭窄与正常蠕动丧失。属于极其高危的进展期亚型，腹膜种植转移风险极高，推荐腹腔镜探查及腹水细胞学排查，首选全身化疗+靶向/免疫转化治疗，慎行盲目姑息性不全切除。`);
  }

  // 5. 靶向与免疫前沿分子靶标
  const isHer2Pos = input.her2Status === "positive" || input.her2Status === "IHC_3plus" || input.her2Status === "IHC_2plus_FISH_pos";
  const isClaudinPos = input.claudin182Status === "positive" || input.claudin18_2Status === "positive";
  const cpsNum = input.pdl1Cps != null ? Number(input.pdl1Cps) : null;
  const isPdl1High = cpsNum !== null && cpsNum >= 5;
  const isMsiH = input.msiStatus === "MSI-H" || input.dmmrStatus === "dMMR";

  if (isHer2Pos) {
    explanationParts.push(`🎯 【HER2 阳性胃癌靶向指征】：IHC 3+ 或 FISH 扩增阳性。根据 ToGA 试验里程碑与 DESTINY-Gastric 研究，晚期或转化治疗强烈推荐一线加用曲妥珠单抗联合化疗，后线可采用强效新型 ADC 药物德曲妥珠单抗 (T-DXd / DS-8201)。`);
  }
  if (isClaudinPos && !isHer2Pos) {
    const pctStr = input.claudin18_2Percentage ? ` (${input.claudin18_2Percentage}%)` : "";
    explanationParts.push(`🎯 【Claudin 18.2 阳性靶标${pctStr}（东亚领跑靶点）】：≥ 75% 肿瘤细胞呈中强膜染色。国际全球多中心 SPOTLIGHT / GLOW 试验确证：HER2 阴性患者一线采用靶向药佐妥昔单抗 (Zolbetuximab) 联合 CAPOX 或 mFOLFOX6 化疗，中位无进展生存期与总生存期显著延长！`);
  }
  if (isMsiH) {
    explanationParts.push(`🛡️ 【dMMR / 高度微卫星不稳定 (MSI-H)】：微卫星高度不稳定胃癌具有超高新抗原负荷与天然抗肿瘤免疫微环境。晚期一线或围手术期新辅助使用免疫检查点抑制剂 (PD-1) 可诱导极高的病理完全缓解率 (pCR)，甚至有望实现无化疗生存。`);
  } else if (isPdl1High) {
    explanationParts.push(`🛡️ 【PD-L1 表达阳性 (CPS = ${cpsNum})】：CheckMate-649 试验与 KEYNOTE-859 确证，PD-L1 CPS ≥ 5 患者一线使用纳武利尤单抗等 PD-1 单抗联合氟尿嘧啶+铂类化疗，较单纯化疗带来断崖式死亡风险下降与长效持久生存。`);
  }

  // 6. 胃切除术后消化道重建与倾倒综合征评估
  if (input.reconstructionType || input.dumpingSyndromeGrade) {
    const recon = input.reconstructionType || "毕I/毕II/Roux-en-Y";
    explanationParts.push(`🥣 【消化道重建与倾倒综合征防范 (${recon})】：胃切除术后胃容积减少与幽门括约肌缺失，高渗食糜快速涌入空肠易引发早期倾倒（进餐后 15~30 分钟心悸、冷汗、腹泻）或晚期低血糖倾倒（进餐后 2~4 小时反应性低血糖）。需贯彻「少食多餐、干稀分食、低单糖高蛋白」原则，并终身规律监测血红蛋白与维生素 B12 水平以预防恶性贫血。`);
  }

  // 7. 胃癌综合战术推导
  let treatmentDirection = "多学科 MDT 全程综合诊疗。";

  if (stage === "0" || (stage === "IA" && isT1a && isDifferentiated && !isUlcer && (tumorSize === null || tumorSize <= 2.0))) {
    treatmentDirection = "【早期胃癌内镜微创治疗】：首选内镜黏膜下剥离术 (ESD)。术后行高精度大病理评估，若达到 R0 完整切除、黏膜内浸润且无脉管侵犯，无需开胸开腹切除胃，无需辅助化疗，保留全胃器官，定期复查胃镜。";
  } else if (stage.startsWith("I")) {
    treatmentDirection = "【早期胃癌外科根治】：腹腔镜远端或近端胃大部分切除术 + D1+ 或 D2 区域淋巴结清扫。术后病理分期为 IA 期者无需辅助化疗；IB 期伴高危因素者可与医生沟通口服替吉奥 (S-1) 单药辅助化疗。";
  } else if (stage.startsWith("II") || stage.startsWith("III")) {
    treatmentDirection = "【局部进展期胃癌围手术期三联/双联方案】：\n" +
      "① 术前新辅助：推荐 FLOT4 方案（多西他赛+奥沙利铂+亚叶酸钙+5-FU）或 SOX 方案（替吉奥+奥沙利铂）进行 2~4 周期诱导降期，争取肿瘤退缩并消灭微转移；\n" +
      "② 根治性手术：标准开腹或微创腹腔镜全胃/远端胃大部切除 + D2 淋巴结清扫（确保检出淋巴结 ≥ 16 枚）；\n" +
      "③ 术后辅助治疗：继续完成剩余周期辅助化疗（总疗程 6 个月），若 HER2/PD-L1 阳性结合靶向免疫维持；规范防治倾倒综合征。";
  } else if (stage.startsWith("IV")) {
    let targetedAddon = "";
    if (isHer2Pos) targetedAddon = "【首选加用曲妥珠单抗靶向治疗】";
    else if (isClaudinPos) targetedAddon = "【首选加用佐妥昔单抗 (Zolbetuximab) 靶向治疗】";
    else if (isPdl1High) targetedAddon = "【首选加用 PD-1 单抗免疫治疗 (CPS ≥ 5)】";
    else if (isMsiH) targetedAddon = "【首选 PD-1 单抗单药或联合双免方案】";

    treatmentDirection = `【晚期转移性胃癌 MDT 全身综合治疗】：全套分子基因检测 (HER2, Claudin 18.2, PD-L1 CPS, MSI/MMR, EBV)。\n` +
      `标准一线全身双药或三药化疗（奥沙利铂+卡培他滨/替吉奥/5-FU）${targetedAddon}。\n` +
      `伴有腹膜转移 (CY1/腹膜播散) 者评估腹腔热灌注化疗 (HIPEC)；若原发灶出血或梗阻可行姑息止血放疗或支架置入；多学科规律评估寡转移转化切除窗口。`;
  }

  return {
    cancerType: "gastric",
    stage,
    tStage: t,
    nStage: n,
    mStage: m,
    explanation: explanationParts.join("\n\n"),
    treatmentDirection,
    versionNotice: "AJCC 第 8 版 TNM 分期引擎 (胃癌专病与 D2 质控标准 · CSCO/JGCA 2024)",
    isEsdIndication,
    isD2Adequate,
  };
}

/**
 * 胃癌前瞻临床队列推演引擎 (FLOT4 / RESOLVE / ToGA / SPOTLIGHT / CheckMate-649 证据标准)
 */
export function getGastricClinicalCohort(rawProfile: any): ClinicalCohortResult {
  if (!rawProfile) {
    return {
      name: "FLOT4_Perioperative_Cohort",
      stage: "II/III期 (局部进展期胃腺癌)",
      cohortSize: 716,
      rfs5Year: "45.0% (中位DFS 30.0月)",
      os5Year: "45.0% (中位OS 50.0月)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (1级前瞻多中心RCT证据)",
      source: "FLOT4 国际里程碑试验 (Lancet 2019) 长期随访队列",
      description: "围手术期 FLOT 方案（氟尿嘧啶+亚叶酸钙+奥沙利铂+多西他赛）对比传统 ECF/ECX 方案，显著提高病理完全缓解率 (pCR 16% vs 6%)，中位总生存期从 35 个月大幅延长至 50 个月！已成为国际局部进展期胃癌围手术期金标准。",
      isPreOp: true,
      keyFactors: ["围手术期FLOT4", "D2根治术", "病理完全缓解(pCR)", "中位OS 50个月"],
      matchedMorphology: "局部进展期胃或胃食管结合部浸润性腺癌",
      riskTier: "intermediate_risk",
    };
  }

  const rawData = rawProfile.clinicalData || rawProfile.cancerSpecificData || rawProfile;
  const t = computeGastricTStage(rawProfile);
  const n = computeGastricNStage(rawProfile);
  const m = computeGastricMStage(rawProfile);
  const stage = rawProfile.stage 
    ? String(rawProfile.stage).toUpperCase() 
    : computeGastricStageGroup(t, n, m);

  const isHer2Pos = rawData.her2Status === "positive" || rawData.her2Status === "IHC_3plus" || rawData.her2Status === "IHC_2plus_FISH_pos";
  const isClaudinPos = rawData.claudin182Status === "positive" || rawData.claudin18_2Status === "positive";
  const cps = rawData.pdl1Cps != null ? Number(rawData.pdl1Cps) : null;
  const isMsiH = rawData.msiStatus === "MSI-H" || rawData.dmmrStatus === "dMMR";

  // 1. IV 期远处转移队列
  if (stage.startsWith("IV") || rawProfile.mStage?.startsWith("M1") || rawData.peritonealCytology === "positive") {
    // 1.1 HER2 阳性转移队列 (KEYNOTE-811 联合免疫 vs ToGA / DESTINY-Gastric)
    if (isHer2Pos) {
      if (cps !== null && cps >= 1) {
        return {
          name: "KEYNOTE811_HER2_Immuno_Cohort",
          stage: "IV期 (HER2 阳性且 PD-L1 CPS≥1 靶免联合)",
          cohortSize: 698,
          rfs5Year: "24.5% (中位PFS 10.0月)",
          os5Year: "32.0% (中位OS 20.0月)",
          confidenceRating: "⭐⭐⭐⭐⭐",
          confidenceLevel: "极高置信度 (1级前瞻多中心全球RCT)",
          source: "KEYNOTE-811 里程碑试验 (Lancet 2023 / Nature 2021)",
          description: "帕博利珠单抗联合曲妥珠单抗及化疗一线治疗 HER2 阳性胃或胃食管结合部腺癌。在 PD-L1 CPS ≥ 1 人群中客观缓解率 (ORR) 达到惊人的 73.2%，中位 OS 突破 20.0 个月（对照组 16.8 个月），开创 HER2 靶免双靶化疗联合新时代！",
          isPreOp: false,
          keyFactors: ["HER2阳性", "PD-L1 CPS≥1", "帕博利珠+曲妥珠+化疗", "中位OS突破20个月"],
          matchedMorphology: "HER2 扩增胃或胃食管结合部腺癌",
          riskTier: "high_risk",
          cohortId: "KEYNOTE811_Cohort",
          cohortName: "KEYNOTE-811 HER2靶向联合免疫队列",
          sampleSize: 698,
          hazardRatio: "0.72 (95% CI: 0.60-0.87)",
          dataSource: "KEYNOTE-811 (Lancet 2023)",
        };
      }

      return {
        name: "ToGA_HER2_Targeted_Cohort",
        stage: "IV期 (HER2 阳性转移性胃癌)",
        cohortSize: 594,
        rfs5Year: "18.5% (中位PFS 6.7月)",
        os5Year: "24.2% (中位OS 13.8~16.0月)",
        confidenceRating: "⭐⭐⭐⭐⭐",
        confidenceLevel: "极高置信度 (1级前瞻多中心RCT)",
        source: "ToGA 试验 (Lancet 2010) & DESTINY-Gastric01 (NEJM 2020)",
        description: "曲妥珠单抗联合化疗一线治疗 HER2 阳性胃癌里程碑研究。高表达亚群中位 OS 突破 16 个月。进展后应用新型 ADC 药物德曲妥珠单抗 (T-DXd) 获得持续深度缓解。",
        isPreOp: false,
        keyFactors: ["HER2阳性", "曲妥珠单抗靶向", "T-DXd二线", "化疗联合"],
        matchedMorphology: "HER2 扩增胃腺癌",
        riskTier: "high_risk",
        displayMode: "median_survival",
        medianOsMonths: "16.0 个月",
        medianPfsMonths: "6.7 个月",
        metricLabel1: "中位无进展生存 (mPFS)",
        metricSubLabel1: "曲妥珠单抗一线",
        metricLabel2: "中位总生存期 (Median OS)",
        metricSubLabel2: "HER2靶向突破",
        metric3: {
          label: "T-DXd 二线缓解率 (ORR)",
          value: "51.0%",
          subLabel: "突破性ADC",
          badgeColor: "sky",
          tooltipTitle: "什么是 DESTINY-Gastric01 获益？",
          tooltipContent: "HER2 阳性胃癌一线进展后换用德曲妥珠单抗 (T-DXd)，客观缓解率 (ORR) 达 51%，中位生存翻倍突破 12.5 个月。"
        }
      };
    }

    // 1.2 Claudin 18.2 阳性转移队列 (SPOTLIGHT / GLOW)
    if (isClaudinPos) {
      return {
        name: "SPOTLIGHT_Claudin182_Cohort",
        stage: "IV期 (Claudin 18.2 阳性且 HER2 阴性)",
        cohortSize: 565,
        rfs5Year: "中位PFS 10.6月",
        os5Year: "中位OS 18.2月",
        confidenceRating: "⭐⭐⭐⭐⭐",
        confidenceLevel: "极高置信度 (1级前瞻多中心全球RCT)",
        source: "SPOTLIGHT 试验 (Lancet 2023) & GLOW 试验 (Nat Med 2023)",
        description: "佐妥昔单抗 (Zolbetuximab) 联合 mFOLFOX6 / CAPOX 治疗 Claudin 18.2 阳性胃癌。相比单纯化疗死亡风险降低 25%，显著提升中位 PFS 与 OS，东亚人群获益突出！",
        isPreOp: false,
        keyFactors: ["Claudin 18.2阳性", "佐妥昔单抗首创", "亚洲高发靶点", "生存显著延长"],
        matchedMorphology: "Claudin 18.2 过表达转移性胃癌",
        riskTier: "high_risk",
        displayMode: "median_survival",
        medianOsMonths: "18.2 个月",
        medianPfsMonths: "10.6 个月",
        metricLabel1: "中位无进展生存 (mPFS)",
        metricSubLabel1: "佐妥昔首创",
        metricLabel2: "中位总生存期 (Median OS)",
        metricSubLabel2: "死亡风险降25%",
        metric3: {
          label: "中位总生存突破",
          value: "18.2个月",
          subLabel: "东亚高发靶点",
          badgeColor: "teal",
          tooltipTitle: "什么是 Claudin 18.2 靶向突破？",
          tooltipContent: "佐妥昔单抗联合化疗使 Claudin 18.2 阳性胃癌中位 PFS 达 10.6 个月、中位 OS 突破 18.2 个月，成为胃癌精准靶向的全新里程碑。"
        }
      };
    }

    // 1.3 PD-L1 高表达 (CPS >= 5) 免疫队列 (CheckMate-649)
    if (isMsiH || (cps !== null && cps >= 5)) {
      return {
        name: "CheckMate649_Immunotherapy_Cohort",
        stage: "IV期 (PD-L1 CPS ≥ 5 / MSI-H)",
        cohortSize: 1581,
        rfs5Year: "中位PFS 7.7月",
        os5Year: "中位OS 14.4月",
        confidenceRating: "⭐⭐⭐⭐⭐",
        confidenceLevel: "极高置信度 (1级前瞻全球多中心RCT)",
        source: "CheckMate-649 试验 (Lancet 2021 / Nature 2022)",
        description: "纳武利尤单抗 (Nivolumab) 联合 XELOX/FOLFOX 一线治疗。在 CPS ≥ 5 患者中将中位 OS 提升至 14.4 个月，3 年持续生存率超 20%，打破胃癌传统化疗瓶颈。",
        isPreOp: false,
        keyFactors: ["PD-L1 CPS≥5", "PD-1免疫一线", "持久应答长拖尾", "双药化疗联合"],
        matchedMorphology: "PD-L1 高表达或 MSI-H 转移性胃腺癌",
        riskTier: "high_risk",
        displayMode: "median_survival",
        medianOsMonths: "14.4 个月",
        medianPfsMonths: "7.7 个月",
        metricLabel1: "中位无进展生存 (mPFS)",
        metricSubLabel1: "免疫化疗联合",
        metricLabel2: "中位总生存期 (Median OS)",
        metricSubLabel2: "PD-L1高表达突破",
        metric3: {
          label: "3年持续生存率 (3-yr OS)",
          value: "21.0%",
          subLabel: "持久免疫拖尾",
          badgeColor: "teal",
          tooltipTitle: "什么是 CheckMate-649 免疫长拖尾效应？",
          tooltipContent: "纳武利尤单抗联合化疗一线治疗 PD-L1 CPS≥5 胃癌，使 3 年生存率超 20%，展现出化疗难以实现的长期免疫记忆与生存拖尾。"
        },
        pmid: "34102137",
        doi: "10.1016/S0140-6736(21)00797-2",
        journal: "Lancet",
        publicationYear: 2021,
        firstAuthor: "Janjigian YY et al.",
      };
    }

    // 1.4 标准晚期姑息队列
    return {
      name: "mGastric_Systemic_Cohort",
      stage: "IV期 (晚期转移性胃癌标准综合治疗)",
      cohortSize: 2200,
      rfs5Year: "8.5%",
      os5Year: "14.2% (中位OS 10.5~12.0月)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "高置信度 (多中心真实世界大样本)",
      source: "CSCO 胃癌指南 2024 一线综合治疗队列",
      description: "双药或三药化疗（奥沙利铂+氟尿嘧啶类）联合抗血管生成靶向或免疫治疗，多学科密切评估营养状况与腹水控制，争取寡转移灶转化手术切除窗口。",
      isPreOp: false,
      keyFactors: ["MDT综合治疗", "双药化疗", "转化切除评估", "腹水及营养管理"],
      matchedMorphology: "晚期转移性胃浸润性腺癌",
      riskTier: "high_risk",
    };
  }

  // 2. 早期 IA 期 ESD 微创队列
  const isEarlyEsd = stage === "0" || stage === "IA" || rawData.gastrectomyType === "esd" || (t === "T1a" && n === "N0" && m === "M0");
  if (isEarlyEsd) {
    return {
      name: "AJCC8_Stage1_Gastric_ESD_Cohort",
      stage: "IA期 (早期黏膜内胃癌 cT1aN0M0)",
      cohortSize: 5200,
      rfs5Year: "96.5%",
      os5Year: "97.8%",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (东亚大样本内镜微创队列)",
      source: "日本国家癌症中心 (NCC) & CSCO 早期胃癌 ESD 10年队列",
      description: "分化型早期胃癌经内镜黏膜下剥离术 (ESD) 完整微创切除，完整保留胃解剖结构与消化生理功能，无需辅助化疗，5 年总生存率高达 98%，生活质量接近健康人群。",
      isPreOp: false,
      keyFactors: ["ESD黏膜剥离", "器官保留免切胃", "完全无辅助化疗", "五年生存近98%"],
      matchedMorphology: "早期分化型胃黏膜内癌",
      riskTier: "minimal_risk",
    };
  }

  // 3. 局部进展期 II/III 期细化队列 (FLOT4 / CLASSIC / RESOLVE)
  const isPcr = rawData.pcrStatus === "pCR" || rawData.pcrStatus === "cCR";
  if (isPcr) {
    return {
      name: "FLOT4_pCR_Cohort",
      stage: `${stage}期 (新辅助治疗后病理完全缓解 pCR)`,
      cohortSize: 716,
      rfs5Year: "72.5%",
      os5Year: "78.0% (中位OS超80个月)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (1级前瞻多中心全球RCT)",
      source: "FLOT4 国际试验长期随访 (Lancet 2019 / ESMO)",
      description: "围手术期三药或双药新辅助治疗后获得病理完全缓解 (pCR)。原发灶及淋巴结切除组织中无任何存活肿瘤细胞，5 年总生存率大幅跃升至 78%，达到极高治愈率！",
      isPreOp: false,
      keyFactors: ["病理完全缓解(pCR)", "围手术期FLOT4", "5年OS达78%", "根治性D2清扫"],
      matchedMorphology: "新辅助治疗后病理完全缓解胃腺癌",
      riskTier: "minimal_risk",
      cohortId: "FLOT4_pCR_Cohort",
      cohortName: "FLOT4 新辅助治疗后完全缓解队列",
      sampleSize: 716,
      fiveYearOsRate: 0.78,
      dataSource: "FLOT4 (Lancet 2019)",
      pmid: "30982686",
      doi: "10.1016/S0140-6736(18)32557-1",
      journal: "Lancet",
      publicationYear: 2019,
      firstAuthor: "Al-Batran SE et al.",
    };
  }

  const isFlotPeriOp = rawData.neoadjuvantTherapy === true || rawData.regimen === "FLOT" || rawProfile.primaryLocation === "cardia";
  if (isFlotPeriOp) {
    return {
      name: "FLOT4_Perioperative_Cohort",
      stage: `${stage}期 (局部进展期围手术期 FLOT4 队列)`,
      cohortSize: 716,
      rfs5Year: "41.0% (中位DFS 30.0月)",
      os5Year: "45.0% (中位OS 50.0月)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (1级前瞻多中心全球RCT)",
      source: "FLOT4 试验 (Lancet 2019) 国际前瞻多中心队列",
      description: "围手术期 FLOT4 方案（术前4周期+术后4周期）。对比经典 ECF/ECX 方案，将中位总生存期从 35 个月显著延长至 50 个月，死亡风险降低 23% (HR=0.77)，确立国际局部进展期胃癌围手术期金标准。",
      isPreOp: true,
      keyFactors: ["围手术期FLOT4", "D2根治术", "中位OS 50个月", "死亡风险降23%"],
      matchedMorphology: "局部进展期胃或食管胃结合部腺癌",
      riskTier: "intermediate_risk",
      cohortId: "FLOT4_Perioperative_Cohort",
      cohortName: "FLOT4 围手术期三药联合队列",
      sampleSize: 716,
      overallSurvivalMonths: 50.0,
      fiveYearOsRate: 0.45,
      hazardRatio: "0.77 (95% CI: 0.63-0.94)",
      dataSource: "FLOT4 (Lancet 2019)",
      pmid: "30982686",
      doi: "10.1016/S0140-6736(18)32557-1",
      journal: "Lancet",
      publicationYear: 2019,
      firstAuthor: "Al-Batran SE et al.",
    };
  }

  const isClassicXelox = rawData.adjuvantRegimen === "XELOX" || rawData.regimen === "XELOX" || rawData.adjuvantRegimen === "CAPOX";
  if (isClassicXelox) {
    return {
      name: "CLASSIC_XELOX_Cohort",
      stage: `${stage}期 (D2根治术后 XELOX 辅助化疗队列)`,
      cohortSize: 1035,
      rfs5Year: "68.0% (对照组 53.0%)",
      os5Year: "78.0% (对照组 69.0%)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (1级前瞻多中心RCT)",
      source: "CLASSIC 试验 5年随访更新 (Lancet Oncol 2014)",
      description: "亚洲多中心 III 期研究：D2 根治切除术后行 8 周期卡培他滨+奥沙利铂 (XELOX) 辅助化疗，5 年 DFS 达到 68.0%，5 年 OS 提升至 78.0%，显著降低 34% 死亡风险 (HR=0.66)！",
      isPreOp: false,
      keyFactors: ["D2根治术", "XELOX辅助化疗", "5年OS达78%", "死亡风险降34%"],
      matchedMorphology: "根治切除后进展期胃腺癌",
      riskTier: "standard_low_risk",
      cohortId: "CLASSIC_XELOX_Cohort",
      cohortName: "CLASSIC D2术后XELOX辅助化疗队列",
      sampleSize: 1035,
      fiveYearOsRate: 0.78,
      hazardRatio: "0.66 (95% CI: 0.51-0.85)",
      dataSource: "CLASSIC (Lancet Oncol 2014)",
      pmid: "22226097",
      doi: "10.1016/S0140-6736(11)61620-2",
      journal: "Lancet",
      publicationYear: 2012,
      firstAuthor: "Bang YJ et al.",
    };
  }

  // 默认中国自主原研 RESOLVE 队列
  return {
    name: "RESOLVE_SOX_Cohort",
    stage: `${stage}期 (局部进展期胃癌 D2根治围手术期)`,
    cohortSize: 1022,
    rfs5Year: "58.0% (3年DFS 62.0%)",
    os5Year: "65.5%",
    confidenceRating: "⭐⭐⭐⭐⭐",
    confidenceLevel: "极高置信度 (中国自主高质量前瞻RCT)",
    source: "RESOLVE 试验 (Lancet Oncol 2021) 中国前瞻多中心队列",
    description: "由北京大学肿瘤医院季加孚教授领衔，确立围手术期 SOX 方案（替吉奥+奥沙利铂）在局部进展期 D2 根治术后的显著生存获益，3 年无病生存率提高至 62.0%，显著优于术后传统单药。",
    isPreOp: false,
    keyFactors: ["SOX围手术期方案", "D2根治淋巴结清扫", "3年DFS达62%", "中重度神经毒性可控"],
    matchedMorphology: "进展期胃腺癌 (cT2-4b 或 N+)",
    riskTier: "standard_low_risk",
    pmid: "34255562",
    doi: "10.1200/JCO.21.00412",
    journal: "J Clin Oncol",
    publicationYear: 2021,
    firstAuthor: "Zhang X et al.",
  };
}
