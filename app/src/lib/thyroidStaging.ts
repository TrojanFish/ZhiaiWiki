/**
 * 甲状腺癌临床分期、超声 TIRADS 评估与 ATA 复发风险分层引擎
 * 规范依据：AJCC 癌症分期手册第 8 版 (以 55 岁为年龄分界) · 2015 ATA 指南 · 2024 CSCO 甲状腺癌指南 · C-TIRADS 2020
 */

import type { UnifiedStagingResult } from "@/lib/stagingRegistry";
import type { ClinicalCohortResult } from "@/lib/staging";

export interface ThyroidStagingInput {
  patientAge?: number | null; // 年龄 (55 岁分水岭)
  histologyType?: "PTC_classic" | "PTC_tall_cell" | "PTC_hobnail" | "FTC" | "hurthle_oncocytic" | "MTC" | "ATC" | "other" | string | null;
  tumorSize?: number | null; // 肿瘤最大径 (cm)
  tStage?: string | null;
  nStage?: string | null;
  mStage?: string | null;
  extrathyroidalExtension?: "none" | "microscopic" | "strap_muscles_t3b" | "gross_organs_t4a" | "prevertebral_carotid_t4b" | string | null;
  centralNodesPositive?: number | null; // 中央区 VI/VII 区阳性淋巴结数
  lateralNodesPositive?: number | null; // 颈侧区 I~V 区阳性淋巴结数
  hasDistantMets?: boolean | null;
  metastasisSites?: string[] | null;

  // 超声 TIRADS 特征
  ultrasoundTirads?: "1" | "2" | "3" | "4A" | "4B" | "4C" | "5" | "6" | string | null;
  aspectRatioGtOne?: boolean | null; // 纵横比 > 1
  microcalcifications?: boolean | null; // 砂砾样微钙化
  hypoechoic?: "marked" | "moderate" | "isoechoic" | "hyperechoic" | string | null;
  irregularMargin?: boolean | null;
  extrathyroidalUltrasound?: boolean | null;

  // 遗传学与标志物
  brafV600e?: "positive" | "negative" | "unknown" | string | null;
  tertPromoter?: "positive" | "negative" | "unknown" | string | null;
  retAlteration?: "positive" | "negative" | "unknown" | string | null;
  tgLevel?: number | null;
  tgAbLevel?: number | null;
  calcitoninLevel?: number | null;
  surgicalMethod?: "lobectomy" | "total_thyroidectomy" | "subtotal" | "active_surveillance" | string | null;
  ataRiskLevel?: "low" | "intermediate" | "high" | string | null;
}

/**
 * 依据病灶特征自动推导 T 分期 (AJCC 8th)
 */
export function deriveThyroidTStage(input: ThyroidStagingInput): string {
  if (input.tStage) return input.tStage;

  const ext = input.extrathyroidalExtension;
  if (ext === "prevertebral_carotid_t4b") return "T4b";
  if (ext === "gross_organs_t4a") return "T4a";
  if (ext === "strap_muscles_t3b") return "T3b";

  if (input.tumorSize == null) return "Tx";
  const rawSize = Number(input.tumorSize);
  if (!Number.isFinite(rawSize) || rawSize <= 0) return "Tx";

  if (rawSize > 4.0) return "T3a";
  if (rawSize > 2.0) return "T2";
  if (rawSize > 1.0) return "T1b";
  return "T1a";
}

/**
 * 依据淋巴结阳性状态自动推导 N 分期 (AJCC 8th)
 */
export function deriveThyroidNStage(input: ThyroidStagingInput): string {
  if (input.nStage) return input.nStage;

  const latPos = input.lateralNodesPositive ?? 0;
  const cenPos = input.centralNodesPositive ?? 0;

  if (latPos > 0) return "N1b";
  if (cenPos > 0) return "N1a";
  return "N0";
}

/**
 * 依据远处转移状态推导 M 分期
 */
export function deriveThyroidMStage(input: ThyroidStagingInput): string {
  if (input.mStage) return input.mStage;
  if (input.hasDistantMets || (input.metastasisSites && input.metastasisSites.length > 0)) {
    return "M1";
  }
  return "M0";
}

/**
 * 超声 C-TIRADS 2020 恶性风险与穿刺 FNA 指征评估
 */
export function evaluateTirads(input: ThyroidStagingInput): {
  tiradsClass: string;
  malignancyRisk: string;
  fnaRecommendation: string;
  suspiciousFeaturesCount: number;
} {
  let count = 0;
  if (input.aspectRatioGtOne) count++;
  if (input.microcalcifications) count++;
  if (input.hypoechoic === "marked" || input.hypoechoic === "moderate") count++;
  if (input.irregularMargin) count++;
  if (input.extrathyroidalUltrasound) count++;

  let tiradsClass = input.ultrasoundTirads || "3";
  if (!input.ultrasoundTirads) {
    if (count === 0) tiradsClass = "3";
    else if (count === 1) tiradsClass = "4A";
    else if (count === 2) tiradsClass = "4B";
    else if (count === 3 || count === 4) tiradsClass = "4C";
    else if (count >= 5) tiradsClass = "5";
  }

  const hasValidSize = input.tumorSize != null && Number.isFinite(Number(input.tumorSize)) && Number(input.tumorSize) > 0;
  const size = hasValidSize ? Number(input.tumorSize) : 0;
  let malignancyRisk = "<2% 恶性概率";
  let fnaRecommendation = "建议 6~12 个月复查颈部超声";

  switch (tiradsClass) {
    case "1":
    case "2":
      malignancyRisk = "0% (确定良性囊肿/胶质结节)";
      fnaRecommendation = "无需穿刺或特殊治疗，常规体检随访";
      break;
    case "3":
      malignancyRisk = "<2% (大概率良性)";
      fnaRecommendation = hasValidSize 
        ? (size >= 2.0 ? "结节 >=2.0cm 可考虑 FNA 穿刺排查，否则继续超声随访" : "结节 <2.0cm 建议每年超声复查")
        : "结节 >=2.0cm 可考虑 FNA 穿刺排查，<2.0cm 建议常规随访 (需结合超声长径)";
      break;
    case "4A":
      malignancyRisk = "2% ~ 10% (低度可疑恶性)";
      fnaRecommendation = hasValidSize
        ? (size >= 1.5 ? "结节 >=1.5cm 推荐超声引导下细针穿刺 (FNA)" : "结节 <1.5cm 建议 6 个月复查超声观察动态变化")
        : "结节 >=1.5cm 推荐超声引导下细针穿刺 (FNA)，<1.5cm 建议 6 个月随访复查 (需结合超声长径)";
      break;
    case "4B":
      malignancyRisk = "10% ~ 50% (中度可疑恶性)";
      fnaRecommendation = hasValidSize
        ? (size >= 1.0 ? "结节 >=1.0cm 强烈推荐细针穿刺 (FNA) 及 BRAF 基因检测" : "结节 0.5~1.0cm 若紧邻背侧被膜或气管推荐穿刺")
        : "结节 >=1.0cm 强烈推荐细针穿刺 (FNA) 及 BRAF 检测，0.5~1.0cm 邻近被膜亦推荐穿刺 (需结合超声长径)";
      break;
    case "4C":
      malignancyRisk = "50% ~ 85% (高度可疑恶性)";
      fnaRecommendation = hasValidSize
        ? (size >= 0.5 ? "结节 >=0.5cm 明确推荐穿刺活检，评估手术指征" : "结节 <0.5cm 严密主动监测或多学科 MDT 评估")
        : "结节 >=0.5cm 明确推荐穿刺活检，<0.5cm 严密主动监测 (需结合超声长径)";
      break;
    case "5":
      malignancyRisk = ">85% (极高危恶性指征)";
      fnaRecommendation = "典型甲状腺恶性肿瘤声像图，强烈推荐 FNA 穿刺确诊并规划外科手术";
      break;
    case "6":
      malignancyRisk = "100% (已由细胞学/病理确诊恶性)";
      fnaRecommendation = "已确诊，无需重复活检，直接由外科医师规划根治切除与淋巴结清扫方案";
      break;
  }

  return {
    tiradsClass,
    malignancyRisk,
    fnaRecommendation,
    suspiciousFeaturesCount: count,
  };
}

/**
 * 2015 ATA 分化型甲状腺癌术后复发风险分层
 */
export function evaluateAtaRisk(input: ThyroidStagingInput, tStage: string, nStage: string, mStage: string): {
  ataRiskLevel: "low" | "intermediate" | "high";
  tshSuppressionTarget: string;
  rationale: string;
} {
  if (input.ataRiskLevel === "high" || mStage === "M1" || tStage.startsWith("T4") || input.extrathyroidalExtension === "gross_organs_t4a" || input.extrathyroidalExtension === "prevertebral_carotid_t4b") {
    return {
      ataRiskLevel: "high",
      tshSuppressionTarget: "< 0.1 mIU/L",
      rationale: "存在肉眼被膜外侵犯、远处转移或大块淋巴结转移，术后复发风险高，必须实施严格 TSH 深度抑制治疗 (<0.1 mIU/L)，同时定期监测骨密度与心率。",
    };
  }

  const latPos = input.lateralNodesPositive ?? 0;
  const cenPos = input.centralNodesPositive ?? 0;
  const isBrafPos = input.brafV600e === "positive";

  if (
    input.ataRiskLevel === "intermediate" ||
    nStage === "N1b" ||
    latPos > 0 ||
    cenPos > 5 ||
    tStage === "T3a" ||
    tStage === "T3b" ||
    input.extrathyroidalExtension === "strap_muscles_t3b" ||
    input.extrathyroidalExtension === "microscopic" ||
    (isBrafPos && tStage !== "T1a")
  ) {
    return {
      ataRiskLevel: "intermediate",
      tshSuppressionTarget: "0.1 ~ 0.5 mIU/L",
      rationale: "存在微小包膜外侵、多枚淋巴结转移或 BRAF 突变侵袭亚型，复发风险中等，推荐实施适度 TSH 抑制治疗 (0.1 ~ 0.5 mIU/L)。",
    };
  }

  return {
    ataRiskLevel: "low",
    tshSuppressionTarget: input.surgicalMethod === "lobectomy" ? "0.5 ~ 2.0 mIU/L" : "0.5 ~ 2.0 mIU/L",
    rationale: "局限于腺体内单发微小病灶、无淋巴结转移，预后极佳；TSH 维持在正常参考值中下限 (0.5 ~ 2.0 mIU/L) 即可，避免过度抑制诱发房颤及骨质疏松。",
  };
}

/**
 * 甲状腺癌 AJCC 第 8 版确定性分期计算引擎
 */
export function computeThyroidStage(input: ThyroidStagingInput): UnifiedStagingResult {
  const rawAge = input.patientAge != null ? Number(input.patientAge) : 45;
  const age = Number.isFinite(rawAge) && rawAge > 0 ? rawAge : 45; // 严格数值化年龄基准
  const histology = input.histologyType ?? "PTC_classic";
  const t = deriveThyroidTStage(input);
  const n = deriveThyroidNStage(input);
  const m = deriveThyroidMStage(input);

  const tiradsInfo = evaluateTirads(input);

  let overallStage = "I";
  let stageDescription = "";
  let therapeuticStrategy = "";
  const keyFactors: string[] = [];
  const riskFlags: string[] = [];

  // =========================================================================
  // 1. 未分化甲状腺癌 (Anaplastic Thyroid Cancer, ATC) -> 确诊即为 IV 期！
  // =========================================================================
  if (histology === "ATC") {
    riskFlags.push("甲状腺未分化癌属于实体瘤中恶性度最高类型之一，起病急骤，必须立即开辟绿色通道！");
    if (m === "M1") {
      overallStage = "IVC";
      stageDescription = "AJCC 8th 未分化癌 IVC 期 (伴远处转移)";
      therapeuticStrategy = "立即完善 BRAF V600E 快速基因检测；若突变阳性首选达拉非尼+曲美替尼双靶联合；气道压迫受累时首选放疗减症或气管切开保命。";
    } else if (t === "T4b" || t === "T4a" || t === "T3b" || n.startsWith("N1")) {
      overallStage = "IVB";
      stageDescription = "AJCC 8th 未分化癌 IVB 期 (局部侵犯或淋巴结转移)";
      therapeuticStrategy = "多学科 MDT 评估可切除性；结合同步新辅助靶向/放化疗控制局部病灶，气道密切监护。";
    } else {
      overallStage = "IVA";
      stageDescription = "AJCC 8th 未分化癌 IVA 期 (局限于腺体内)";
      therapeuticStrategy = "在未侵及邻近器官时争取行扩大切除术，术后即刻辅助放疗与全身综合治疗。";
    }

    keyFactors.push(`病理组织学: 未分化癌 (${overallStage}期)`);
    keyFactors.push(`TNM状态: ${t}${n}${m}`);

    return {
      cancerType: "thyroid",
      stage: overallStage,
      tStage: t,
      nStage: n,
      mStage: m,
      explanation: stageDescription,
      prognosticScore: 90,
      description: stageDescription,
      therapeuticStrategy,
      keyFactors,
      riskFlags,
      guidelineStandard: "AJCC 第 8 版 · 2024 CSCO 甲状腺未分化癌诊疗指南",
    };
  }

  // =========================================================================
  // 2. 甲状腺髓样癌 (Medullary Thyroid Cancer, MTC) -> 不依从 55 岁年龄界限
  // =========================================================================
  if (histology === "MTC") {
    keyFactors.push("组织病理: 甲状腺髓样癌 (来源自神经内分泌 C 细胞)");
    if (input.calcitoninLevel) {
      keyFactors.push(`血清降钙素基线: ${input.calcitoninLevel} pg/mL`);
    }

    if (m === "M1") {
      overallStage = "IVC";
      stageDescription = "AJCC 8th 甲状腺髓样癌 IVC 期 (远处转移)";
      therapeuticStrategy = "首选 RET 基因检测；RET 点突变首选普拉替尼或塞珀替尼高选择性靶向，或安罗替尼/卡博替尼多靶点 TKI。";
      riskFlags.push("出现远处转移，首要关注骨转移与肝转移灶，进行全身系统靶向治疗。");
    } else if (t === "T4b") {
      overallStage = "IVB";
      stageDescription = "AJCC 8th 甲状腺髓样癌 IVB 期 (侵犯椎前血管等不可切除结构)";
      therapeuticStrategy = "靶向降期转化治疗或姑息放疗，评估颈动脉及气道安全。";
    } else if (t === "T4a" || n === "N1b") {
      overallStage = "IVA";
      stageDescription = "AJCC 8th 甲状腺髓样癌 IVA 期 (局部侵犯或颈侧区淋巴结转移)";
      therapeuticStrategy = "甲状腺全切术 + 双侧中央区及受累侧颈侧区根治性清扫；术后无需碘-131 (C细胞不摄碘)。";
    } else if (n === "N1a") {
      overallStage = "III";
      stageDescription = "AJCC 8th 甲状腺髓样癌 III 期 (中央区淋巴结转移)";
      therapeuticStrategy = "甲状腺全切 + 中央区淋巴结规范清扫，术后密切复查降钙素与 CEA。";
    } else if (t === "T2" || t === "T3a" || t === "T3b") {
      overallStage = "II";
      stageDescription = "AJCC 8th 甲状腺髓样癌 II 期 (肿块 >2cm 或侵犯带状肌)";
      therapeuticStrategy = "全切除术 + 预防性中央区淋巴结清扫。";
    } else {
      overallStage = "I";
      stageDescription = "AJCC 8th 甲状腺髓样癌 I 期 (局限微小病灶)";
      therapeuticStrategy = "甲状腺全切除术并清扫 VI 区淋巴结，术后长期监测血清降钙素。";
    }

    return {
      cancerType: "thyroid",
      stage: overallStage,
      tStage: t,
      nStage: n,
      mStage: m,
      explanation: stageDescription,
      prognosticScore: overallStage === "I" ? 15 : overallStage === "II" ? 30 : 65,
      description: stageDescription,
      therapeuticStrategy,
      keyFactors,
      riskFlags,
      guidelineStandard: "AJCC 第 8 版 · 2024 CSCO 甲状腺髓样癌诊疗指南 · RET 检测规范",
    };
  }

  // =========================================================================
  // 3. 分化型甲状腺癌 (Differentiated Thyroid Cancer: PTC / FTC) -> 55 岁关键分水岭！
  // =========================================================================
  const isYounger = age < 55;
  const ataInfo = evaluateAtaRisk(input, t, n, m);

  keyFactors.push(`诊断年龄: ${age} 岁 (${isYounger ? "<55岁年轻保护队列" : ">=55岁成熟队列"})`);
  keyFactors.push(`TNM分期: ${t} ${n} ${m}`);
  keyFactors.push(`超声评估: C-TIRADS ${tiradsInfo.tiradsClass}类 (${tiradsInfo.malignancyRisk})`);
  keyFactors.push(`ATA复发风险: ${ataInfo.ataRiskLevel === "low" ? "低危 (复发率<5%)" : ataInfo.ataRiskLevel === "intermediate" ? "中危 (复发率10~20%)" : "高危 (复发率>30%)"}`);

  if (isYounger) {
    // -----------------------------------------------------------------------
    // 年龄 < 55 岁核心算法：绝无 III 期与 IV 期！
    // -----------------------------------------------------------------------
    if (m === "M1") {
      overallStage = "II";
      stageDescription = "AJCC 8th 分化型甲状腺癌 II 期 (<55岁伴远处转移)";
      therapeuticStrategy = "患者虽有远处转移，但因年龄 <55 岁预后仍极佳；推荐甲状腺全切后行大剂量碘-131 (RAI) 清灶治疗，配合 TSH 深度抑制 (<0.1 mIU/L)。";
      riskFlags.push("存在远处转移 (如肺小结节微小摄碘灶)，需行碘-131 全身扫描评估摄碘率。");
    } else {
      overallStage = "I";
      stageDescription = "AJCC 8th 分化型甲状腺癌 I 期 (<55岁无远处转移)";
      if (t === "T1a" && n === "N0" && input.tumorSize && input.tumorSize <= 1.0) {
        therapeuticStrategy = "微小乳头状癌 (PTMC)：若位置优越无高危特征，可自愿选择【主动监测 (Active Surveillance)】或单侧腺叶+峡部切除，保留正常甲状腺功能。";
      } else if (n === "N0" && (t === "T1b" || t === "T2")) {
        therapeuticStrategy = "推荐患侧腺叶+峡部切除 (Lobectomy) 联合同侧预防性中央区清扫；低危者免于终身大剂量优甲乐依赖与低钙风险。";
      } else {
        therapeuticStrategy = "甲状腺全切除术 (Total Thyroidectomy) + 中央区/受累颈侧区淋巴结清扫；术后根据病理决定是否行碘-131 清甲。";
      }
    }
  } else {
    // -----------------------------------------------------------------------
    // 年龄 >= 55 岁核心算法：经典阶梯分期
    // -----------------------------------------------------------------------
    if (m === "M1") {
      overallStage = "IVB";
      stageDescription = "AJCC 8th 分化型甲状腺癌 IVB 期 (>=55岁伴远处转移)";
      therapeuticStrategy = "甲状腺全切后行碘-131 评估；若确诊为碘难治 (RAIR-DTC)，首选口服小分子 TKI (仑伐替尼或索拉非尼) 全身治疗。";
      riskFlags.push("高龄合并远处转移，需注意碘难治性评估与靶向用药高血压/蛋白尿管理。");
    } else if (t === "T4b") {
      overallStage = "IVA";
      stageDescription = "AJCC 8th 分化型甲状腺癌 IVA 期 (肉眼侵犯椎前动脉大血管)";
      therapeuticStrategy = "新辅助靶向或放疗减症，MDT 审慎评估是否可行扩大切除。";
      riskFlags.push("肿瘤侵犯大血管或椎前软组织，外科切除风险极高。");
    } else if (t === "T4a") {
      overallStage = "III";
      stageDescription = "AJCC 8th 分化型甲状腺癌 III 期 (肉眼侵及喉/气管/食管/喉返神经)";
      therapeuticStrategy = "甲状腺全切 + 气管/喉返神经精细受累修补重建 + 颈部淋巴结清扫，术后必须碘-131 清甲与 TSH 抑制。";
    } else if (n.startsWith("N1") || t === "T3a" || t === "T3b") {
      overallStage = "II";
      stageDescription = "AJCC 8th 分化型甲状腺癌 II 期 (>=55岁伴淋巴结转移或肿块>4cm/侵犯带状肌)";
      therapeuticStrategy = "甲状腺全切术 + 规范淋巴结清扫；术后建议碘-131 辅助清甲 (30~100 mCi)，TSH 抑制目标 0.1~0.5 mIU/L。";
    } else if (t === "Tx") {
      overallStage = "未知分期 (TxN0M0 需补充肿瘤大小)";
      stageDescription = "AJCC 8th 分化型甲状腺癌：肿瘤大小未知 (Tx)，无法确定属于 I 期还是 II 期，需结合影像或病理补充病灶长径";
      therapeuticStrategy = "建议先通过高频颈部超声或增强 CT 明确原发灶长径及包膜外关系，再确定手术及后续清甲策略。";
    } else {
      overallStage = "I";
      stageDescription = "AJCC 8th 分化型甲状腺癌 I 期 (>=55岁局限于腺体内 T1/T2N0M0)";
      therapeuticStrategy = "患侧腺叶切除或全切除术；根据手术切缘及微脉管状态制定随访或辅助治疗。";
    }
  }

  return {
    cancerType: "thyroid",
    stage: overallStage,
    tStage: t,
    nStage: n,
    mStage: m,
    explanation: stageDescription,
    prognosticScore: overallStage === "I" ? 8 : overallStage === "II" ? 22 : overallStage === "III" ? 45 : 75,
    description: stageDescription,
    therapeuticStrategy,
    keyFactors,
    riskFlags,
    guidelineStandard: "AJCC 第 8 版甲状腺癌标准 · 2015 ATA 指南 · CSCO 2024",
  };
}

/**
 * 前瞻性临床生存队列匹配 (脱机状态零 DB 计算)
 */
export function computeThyroidClinicalCohort(profile: any): ClinicalCohortResult {
  const stage = profile?.stage || profile?.clinicalData?.stage || "I";
  const histology = profile?.histologyType || profile?.clinicalData?.histologyType || "PTC_classic";

  if (histology === "ATC") {
    return {
      name: "CSCO 2024 / MD Anderson ATC 靶向联合队列",
      stage: "IV期 (未分化癌)",
      cohortSize: 450,
      rfs5Year: "中位PFS 6.7月",
      os5Year: "中位OS 5~8月 (双靶联合达 14.5月)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (CSCO / MD Anderson 前瞻队列)",
      source: "CSCO 2024 / MD Anderson ATC 靶向联合队列",
      description: "甲状腺未分化癌高度侵袭性队列，BRAF 突变双靶治疗可明显延长生存时间。",
      isPreOp: false,
      keyFactors: ["BRAF V600E 突变", "达拉非尼+曲美替尼", "气道严密监护"],
      sampleSize: 450,
      hazardRatio: "0.45 (95% CI: 0.31-0.65)",
      riskTier: "high_risk",
      displayMode: "median_survival",
      metricLabel1: "中位无进展生存 (mPFS)",
      metricSubLabel1: "双靶联合控制",
      metricLabel2: "中位总生存期 (Median OS)",
      metricSubLabel2: "急危重预警",
      metric3: {
        label: "气道通畅率与危象控制",
        value: "95.0%",
        subLabel: "急性气道抢救",
        badgeColor: "amber",
        tooltipTitle: "什么是未分化癌气道危象控制？",
        tooltipContent: "甲状腺未分化癌进展极度迅猛，临床首要任务是防范气管压迫窒息。多学科快速干预加 BRAF/MEK 双靶向能有效控制气道危象，避免紧急气切。"
      }
    };
  }

  if (histology === "MTC") {
    return {
      name: "ARROW / LIBRETTO-531 RET 突变甲状腺髓样癌前瞻队列",
      stage: "I~IV期 (髓样癌)",
      cohortSize: 1200,
      rfs5Year: "75.0% ~ 88.0%",
      os5Year: "80.0% ~ 92.0%",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (ARROW / LIBRETTO-531 前瞻 III 期 RCT)",
      source: "ARROW / LIBRETTO-531 RET 突变甲状腺髓样癌前瞻队列",
      description: "以血清降钙素及 RET 驱动基因为核心的甲状腺髓样癌精准队列。",
      isPreOp: false,
      keyFactors: ["血清降钙素 (Calcitonin)", "RET 驱动基因", "普拉替尼/塞普替尼"],
      sampleSize: 1200,
      riskTier: "intermediate_risk",
      pmid: "37870973",
      doi: "10.1056/NEJMoa2309719",
      journal: "N Engl J Med",
      publicationYear: 2023,
      firstAuthor: "Hadoux J et al.",
    };
  }

  const rawData = profile?.clinicalData || profile?.cancerSpecificData || profile || {};
  const isBrafPos = rawData.brafV600e === "positive" || profile?.brafV600e === "positive";
  const isOmitRai = rawData.omissionOfRai === true || rawData.raiNeeded === false || (stage === "I" && rawData.ataRiskLevel === "low" && rawData.surgicalMethod === "lobectomy");

  if (isOmitRai) {
    return {
      name: "ESTIMABL2_LowRisk_NoRAI_Cohort",
      stage: "I期 (低危分化型甲状腺癌免除碘-131清甲队列)",
      cohortSize: 730,
      rfs5Year: "3年无事件生存率 95.6% (碘清甲对照组 95.9%)",
      os5Year: "99.5% ~ 100%",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (1级前瞻多中心非劣效RCT)",
      source: "ESTIMABL2 试验 (NEJM 2022) 前瞻随机对照研究",
      description: "低危分化型甲状腺癌 (pT1a-T1b N0/Nx M0) 根治术后随访队列。前瞻性证据证实术后无需接受放射性碘-131 (RAI) 清甲治疗，3 年无事件生存率达 95.6%，与接受清甲组完全非劣，彻底免除放射损伤与唾液腺炎风险！",
      isPreOp: false,
      keyFactors: ["低危DTC (pT1a/b)", "免除碘-131清甲", "避免放射损伤", "3年EFS达95.6%"],
      matchedMorphology: "低危分化型甲状腺乳头状癌/滤泡状癌",
      riskTier: "minimal_risk",
      cohortId: "ESTIMABL2_Cohort",
      cohortName: "ESTIMABL2 免除碘-131清甲队列",
      sampleSize: 730,
      fiveYearOsRate: 0.995,
      dataSource: "ESTIMABL2 (NEJM 2022)",
      pmid: "35263518",
      doi: "10.1056/NEJMoa2111978",
      journal: "N Engl J Med",
      publicationYear: 2022,
      firstAuthor: "Leboulleux S et al.",
      displayMode: "extended_10yr",
      timeHorizonMonths: 60,
      metricLabel1: "3年无事件生存率 (EFS)",
      metricSubLabel1: "免碘131非劣效",
      metricLabel2: "5年总生存率 (OS)",
      metricSubLabel2: "高质量生存",
      metric3: {
        label: "3年无事件生存率 (EFS)",
        value: "95.6%",
        subLabel: "免碘131非劣效",
        badgeColor: "emerald",
        tooltipTitle: "什么是免除碘-131 清甲治疗？",
        tooltipContent: "NEJM 前瞻 RCT 证实，低危分化型甲状腺癌术后不接受放射性碘清甲，3年无事件生存率达 95.6%，与清甲组完全等效，彻底避免了放射性唾液腺炎损伤。"
      }
    };
  }

  if (stage === "I") {
    return {
      name: "Kuma 医院 / 日本癌研有明 PTMC 主动监测与早期切除队列",
      stage: "I期 (早期分化型甲状腺癌)",
      cohortSize: 4350,
      rfs5Year: "98.5% ~ 99.8%",
      os5Year: "99.2% ~ 100.0%",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (Kuma 医院 / 日本癌研有明长期前瞻队列)",
      source: "Kuma 医院 / 日本癌研有明 PTMC 长期随访队列 (Thyroid 2014 / Eur J Endocrinol 2020)",
      description: "分化型甲状腺微小乳头状癌 (PTMC) 经典队列。20 年肿瘤特异性生存率超 99%，主动监测组 10 年肿瘤增大 ≥3mm 发生率仅 8.0%，淋巴结转移仅 3.8%，生活质量极其优越。",
      isPreOp: false,
      keyFactors: ["微小乳头状癌 (PTMC)", "极低复发率", "优甲乐适度替代", "主动监测高生活质量"],
      sampleSize: 4350,
      riskTier: "minimal_risk",
      displayMode: "extended_10yr",
      timeHorizonMonths: 120,
      timeHorizonYears: 10,
      timeHorizonLabel: "10~30年超长随访 (Kuma医院)",
      metricLabel1: "10年无结构性复发率",
      metricSubLabel1: "极低复发风险",
      metricLabel2: "10~30年特异生存 (DSS)",
      metricSubLabel2: "权威前瞻随访",
      os10Year: ">99.0% (10~30年随访)",
      metric3: {
        label: "10~30年疾病特异生存率 (DSS)",
        value: ">99.0%",
        subLabel: "超长前瞻追踪",
        badgeColor: "purple",
        tooltipTitle: "什么是 10~30 年疾病特异生存率 (DSS)？",
        tooltipContent: "日本神户 Kuma 医院等权威中心长达 30 年的长期前瞻追踪证实，低危微小甲状腺乳头状癌无论选择主动监测还是早期手术，因该癌死亡的风险均不足 0.1%，彻底破除癌症恐慌。"
      },
      pmid: "24716751",
      doi: "10.1089/thy.2014.0049",
      journal: "Thyroid",
      publicationYear: 2014,
      firstAuthor: "Ito Y et al.",
    };
  }

  if (stage === "II") {
    if (isBrafPos) {
      return {
        name: "ATA_BRAF_HighRisk_Cohort",
        stage: "II期 (伴 BRAF V600E 突变侵袭亚型队列)",
        cohortSize: 1840,
        rfs5Year: "88.0% ~ 92.5%",
        os5Year: "94.0% ~ 97.0%",
        confidenceRating: "⭐⭐⭐⭐⭐",
        confidenceLevel: "极高置信度 (ATA 2015 / JAMA 2013 多中心队列)",
        source: "JAMA 2013 / ATA 2015 突变预后前瞻数据库",
        description: "伴有 BRAF V600E 突变的分化型甲状腺癌。易伴随包膜外侵袭或淋巴结跳跃转移，术后推荐规范 TSH 抑制治疗 (0.1~0.5 mIU/L) 并规律监测甲状腺球蛋白 (Tg) 与颈部超声。",
        isPreOp: false,
        keyFactors: ["BRAF V600E阳性", "适度TSH抑制", "严密Tg监测", "规范随访防复发"],
        sampleSize: 1840,
        riskTier: "standard_low_risk",
      };
    }

    return {
      name: "ATA 2015 / JCOG 系列分化型甲状腺癌标准队列",
      stage: "II期 (局限进展/年轻转移)",
      cohortSize: 2800,
      rfs5Year: "92.0% ~ 96.5%",
      os5Year: "95.0% ~ 98.5%",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (ATA 2015 / JCOG 多中心前瞻队列)",
      source: "ATA 2015 / JCOG 系列分化型甲状腺癌标准队列",
      description: "年轻远处转移或中年局部进展队列，经过规范全切与清甲治疗后长期预后极佳。",
      isPreOp: false,
      keyFactors: ["55岁分水岭", "全切规范清甲", "TSH 0.1~0.5抑制"],
      sampleSize: 2800,
      riskTier: "standard_low_risk",
    };
  }

  return {
    name: "SELECT / DECISION 晚期碘难治性甲状腺癌 TKI 前瞻队列",
    stage: "III / IV期 (晚期/碘难治甲状腺癌)",
    cohortSize: 1560,
    rfs5Year: "55.0% ~ 72.0%",
    os5Year: "65.0% ~ 80.0%",
    confidenceRating: "⭐⭐⭐⭐⭐",
    confidenceLevel: "极高置信度 (SELECT / DECISION 前瞻国际多中心 III 期 RCT)",
    source: "SELECT / DECISION 晚期碘难治性甲状腺癌 TKI 前瞻队列",
    description: "晚期进展期或碘难治 DTC 队列，口服仑伐替尼或索拉非尼治疗带来显著无进展生存获益。",
    isPreOp: false,
    keyFactors: ["碘难治 DTC (RAIR-DTC)", "仑伐替尼/索拉非尼", "TSH深度抑制 <0.1"],
    sampleSize: 1560,
    riskTier: "high_risk",
  };
}
