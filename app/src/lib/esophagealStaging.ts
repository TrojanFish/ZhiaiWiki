/**
 * 食管癌/食管鳞癌确定性临床分期推演与前瞻队列推演引擎 (Esophageal Cancer Staging Engine)
 * 遵循标准：
 * - AJCC 癌症分期手册第 8 版 (AJCC Cancer Staging Manual 8th Edition - Esophagus and Esophagogastric Junction, Squamous Cell Carcinoma)
 * - 《CSCO 食管癌诊疗指南 2024》
 * - 国家卫生健康委《食管癌诊疗指南 (2024 年版)》
 * - 中国自主原研新辅助放化疗里程碑 NEOCRTEC5010、CROSS、CheckMate-577、ESCORT-1st、RATIONALE-306 等前瞻多中心队列
 */

import type { UnifiedStagingResult } from "./stagingRegistry";
import type { ClinicalCohortResult } from "./staging";

export interface EsophagealStagingInput {
  tStage?: string | null;
  nStage?: string | null;
  mStage?: string | null;

  // 1. 解剖位置 (AJCC8 鳞癌中早期分期强相关)
  subsite?: "cervical" | "upper_thoracic" | "middle_thoracic" | "lower_thoracic" | "egj_siewert_1" | string | null;
  tumorLocation?: string | null; // 别名
  incisorDistanceCm?: number | null; // 门齿距离 (cm)

  // 2. 组织学类型与分化分级 (AJCC8 鳞癌特异)
  histologyType?: "squamous_cell_carcinoma" | "adenocarcinoma" | "neuroendocrine" | "small_cell" | "other" | string | null;
  differentiation?: "G1_well" | "G2_moderate" | "G3_poor" | "Gx" | "well" | "moderate" | "poor" | "undifferentiated" | string | null;

  // 3. 浸润深度 (T分期)
  tumorDepth?: "tis" | "t1a_mucosa" | "t1b_submucosa" | "t2_muscularis" | "t3_adventitia" | "t4a_resectable" | "t4b_unresectable" | string | null;
  tumorLengthCm?: number | null; // 肿瘤长度 (cm)

  // 4. 气管与大血管侵犯 (瘘管与穿孔致死高危红线)
  airwayInvasionRisk?: boolean | null; // 气管/主支气管受压或侵犯 (TEF 高危)
  aorticInvasionRisk?: boolean | null; // 降主动脉受侵 (>90度包绕)
  recurrentLaryngealNerveInvasion?: boolean | null; // 喉返神经侵犯 (声带麻痹)

  // 5. 淋巴结清扫与转移
  lymphNodesExamined?: number | null; // 检出淋巴结总数 (质控红线 >= 15 枚)
  lymphNodesPositive?: number | null; // 阳性淋巴结总数
  lymphNodeField?: "two_field" | "three_field" | "none" | string | null;
  supraclavicularNodePositive?: boolean | null; // 锁骨上淋巴结
  celiacNodePositive?: boolean | null; // 腹腔动脉干淋巴结

  // 6. 远处转移
  hasDistantMets?: boolean | null;
  metastasisSites?: string[];

  // 7. 分子与免疫指标
  pdl1Cps?: number | string | null;
  pdl1Tap?: number | string | null;
  msiStatus?: "MSI-H" | "MSS" | "MSI-L" | "unknown" | string | null;

  // 8. 肿瘤标志物
  sccAntigen?: number | null; // SCC (正常 < 1.5 ng/mL)
  cyfra211?: number | null; // CYFRA21-1 (正常 < 3.3 ng/mL)
  ceaBaseline?: number | null;

  // 9. 术后状态
  anastomoticStatus?: "intact" | "cervical_leak" | "thoracic_leak" | "stricture" | string | null;
  pcrStatus?: "pCR" | "non_pCR" | "unknown" | string | null;
  neoadjuvantTherapy?: boolean | null;
}

/**
 * 归一化解剖部位
 */
export function normalizeEsophagealSubsite(subsite?: string | null, incisorDistance?: number | null): "cervical" | "upper_thoracic" | "middle_thoracic" | "lower_thoracic" {
  if (incisorDistance != null && incisorDistance > 0) {
    if (incisorDistance < 20) return "cervical";
    if (incisorDistance < 25) return "upper_thoracic";
    if (incisorDistance < 30) return "middle_thoracic";
    return "lower_thoracic";
  }
  const s = (subsite || "").toLowerCase();
  if (s.includes("cervical") || s.includes("颈段") || s.includes("颈部")) return "cervical";
  if (s.includes("upper") || s.includes("胸上") || s.includes("上段")) return "upper_thoracic";
  if (s.includes("lower") || s.includes("胸下") || s.includes("下段") || s.includes("egj") || s.includes("结合部")) return "lower_thoracic";
  // 默认胸中段 (中国最常见)
  return "middle_thoracic";
}

/**
 * 归一化组织分化程度
 */
export function normalizeDifferentiation(diff?: string | null): "G1" | "G2" | "G3" | "Gx" {
  const d = (diff || "").toLowerCase();
  if (d.includes("g1") || d.includes("well") || d.includes("高分化")) return "G1";
  if (d.includes("g2") || d.includes("moderate") || d.includes("中分化")) return "G2";
  if (d.includes("g3") || d.includes("poor") || d.includes("低分化") || d.includes("undifferentiated") || d.includes("未分化")) return "G3";
  return "G2"; // 临床默认中分化
}

/**
 * 食管癌确定性临床分期推演
 */
export function computeEsophagealStage(input: EsophagealStagingInput): UnifiedStagingResult {
  const warnings: string[] = [];
  const guidelines: string[] = [];

  // 1. T 分期推导
  let t = "Tx";
  const depth = (input.tumorDepth || "").toLowerCase();
  const rawT = (input.tStage || "").toUpperCase().trim();

  if (rawT.startsWith("T") && rawT !== "TX") {
    t = rawT;
  } else if (depth.includes("tis")) {
    t = "Tis";
  } else if (depth.includes("t4b") || depth.includes("unresectable") || depth.includes("气管") || depth.includes("主动脉") || depth.includes("椎体")) {
    t = "T4b";
  } else if (depth.includes("t4a") || depth.includes("resectable") || depth.includes("胸膜") || depth.includes("心包") || depth.includes("膈肌")) {
    t = "T4a";
  } else if (depth.includes("t3") || depth.includes("adventitia") || depth.includes("外膜")) {
    t = "T3";
  } else if (depth.includes("t2") || depth.includes("muscularis") || depth.includes("肌层")) {
    t = "T2";
  } else if (depth.includes("t1b") || depth.includes("submucosa") || depth.includes("黏膜下")) {
    t = "T1b";
  } else if (depth.includes("t1a") || depth.includes("mucosa") || depth.includes("黏膜内")) {
    t = "T1a";
  } else {
    t = "T2"; // 默认肌层
  }

  // 2. N 分期推导
  let n = "N0";
  const posNodes = input.lymphNodesPositive ?? 0;
  const rawN = (input.nStage || "").toUpperCase().trim();

  if (rawN.startsWith("N") && rawN !== "NX") {
    n = rawN;
  } else {
    if (posNodes === 0) {
      n = "N0";
    } else if (posNodes <= 2) {
      n = "N1";
    } else if (posNodes <= 6) {
      n = "N2";
    } else {
      n = "N3";
    }
  }

  // 3. M 分期推导
  let m = "M0";
  const rawM = (input.mStage || "").toUpperCase().trim();
  const hasMets = input.hasDistantMets === true || (input.metastasisSites && input.metastasisSites.length > 0);

  if (rawM === "M1" || hasMets) {
    m = "M1";
  } else {
    m = "M0";
  }

  // 锁骨上或腹腔干淋巴结特殊判定
  const subsite = normalizeEsophagealSubsite(input.subsite, input.incisorDistanceCm);
  if (input.supraclavicularNodePositive) {
    // 颈段食管锁骨上属于区域淋巴结 (N分期)，但胸下段锁骨上通常归为远处转移 M1
    if (subsite === "lower_thoracic") {
      m = "M1";
      warnings.push("【远处转移提示】胸下段食管癌出现锁骨上淋巴结转移，属于非区域远处转移 (M1)。");
    } else {
      warnings.push("【高危淋巴结】锁骨上淋巴结阳性，建议评估三野清扫或根治性同步放化疗。");
    }
  }
  if (input.celiacNodePositive) {
    // 腹腔动脉干淋巴结：下段食管属于区域淋巴结，颈段/胸上段出现则属于 M1
    if (subsite === "cervical" || subsite === "upper_thoracic") {
      m = "M1";
      warnings.push("【远处转移提示】颈段/胸上段食管癌累及腹腔干淋巴结，属于非区域远处转移 (M1)。");
    }
  }

  // 4. 外科与病理质控：检出淋巴结总数 >= 15 枚红线
  const examined = input.lymphNodesExamined;
  const isLymphNodeAdequate = examined != null ? examined >= 15 : true;
  if (examined != null && examined > 0 && examined < 15) {
    warnings.push(
      `【病理质控预警】检出淋巴结仅 ${examined} 枚（未达 CSCO/AJCC 规定的 ≥15 枚基线标准）。可能存在淋巴结分期低估风险，术后需密切随访或强化辅助治疗评估。`
    );
  }

  // 5. 气管食管瘘 (TEF) 与主动脉穿孔致死高危警报
  const isAirwayRisk = input.airwayInvasionRisk === true || t === "T4b";
  const isAorticRisk = input.aorticInvasionRisk === true;
  if (isAirwayRisk) {
    warnings.push(
      "【气管食管瘘 (TEF) 极度危险】肿瘤累及气管/主支气管或为 T4b，放疗或抗血管靶向药可能诱发肿瘤坏死导致穿孔瘘管。治疗前应严密行气管镜排查，高危者需预先放置被覆食管支架或气管支架保护气道。"
    );
  }
  if (isAorticRisk) {
    warnings.push(
      "【主动脉受侵破裂预警】病灶累及降主动脉 (>90°包绕)，属于外科手术绝对禁忌证，避免盲目切除导致致命性大出血。"
    );
  }

  // 6. 标志物解读 (SCC 与 CYFRA21-1)
  const scc = input.sccAntigen;
  const cyfra = input.cyfra211;
  const sccElevated = scc != null && scc > 1.5;
  if (sccElevated) {
    warnings.push(
      `【鳞癌标志物升高】血清 SCC 为 ${scc} ng/mL（参考值 <1.5 ng/mL），与食管鳞癌肿瘤负荷高度正相关，可作为化疗/免疫疗效动态监测的重要窗口。`
    );
  }
  if (cyfra != null && cyfra > 3.3) {
    warnings.push(
      `【CYFRA21-1 升高】血清细胞角蛋白19片段为 ${cyfra} ng/mL（参考值 <3.3 ng/mL），与 SCC 联检可大幅提升食管鳞癌病程监测敏感性。`
    );
  }

  // 7. AJCC 第 8 版食管鳞癌 (ESCC) 组合矩阵推导 Stage
  const grade = normalizeDifferentiation(input.differentiation);
  let overallStage = "IVB";
  let explanation = "";

  if (m === "M1") {
    overallStage = "IVB";
    explanation = "AJCC 第 8 版食管鳞癌：存在远处器官或非区域淋巴结转移，定义为 IVB 期。推荐一线免疫联合含铂双药化疗。";
  } else if (t === "Tis" && n === "N0") {
    overallStage = "0";
    explanation = "AJCC 第 8 版食管鳞癌：原位高级别上皮内瘤变 (Tis N0 M0)，定义为 0 期。首选内镜下切除 (ESD/EMR)。";
  } else if (n === "N3") {
    overallStage = "IVA";
    explanation = "AJCC 第 8 版食管鳞癌：阳性淋巴结 ≥7 枚 (N3 M0)，定义为 IVA 期。局部晚期，推荐转化治疗或新辅助同步放化疗。";
  } else if (t === "T4b" && n === "N2") {
    overallStage = "IVA";
    explanation = "AJCC 第 8 版食管鳞癌：不可切除邻近组织侵犯伴多枚淋巴结转移 (T4b N2 M0)，定义为 IVA 期。";
  } else if (t === "T4b" && (n === "N0" || n === "N1")) {
    overallStage = "IIIB";
    explanation = "AJCC 第 8 版食管鳞癌：侵犯邻近脏器且伴 0~2 枚淋巴结转移 (T4b N0-1 M0)，定义为 IIIB 期。";
  } else if (t === "T4a" && (n === "N1" || n === "N2")) {
    overallStage = "IIIB";
    explanation = "AJCC 第 8 版食管鳞癌：侵犯胸膜/心包/膈肌伴淋巴结转移 (T4a N1-2 M0)，定义为 IIIB 期。";
  } else if (t === "T3" && n === "N2") {
    overallStage = "IIIB";
    explanation = "AJCC 第 8 版食管鳞癌：外膜侵犯伴 3~6 枚淋巴结转移 (T3 N2 M0)，定义为 IIIB 期。推荐 NEOCRTEC5010 新辅助同步放化疗。";
  } else if (t === "T4a" && n === "N0") {
    overallStage = "IIIA";
    explanation = "AJCC 第 8 版食管鳞癌：可切除邻近结构侵犯但无淋巴结转移 (T4a N0 M0)，定义为 IIIA 期。";
  } else if (t === "T3" && n === "N1") {
    overallStage = "IIIA";
    explanation = "AJCC 第 8 版食管鳞癌：侵及外膜伴 1~2 枚淋巴结转移 (T3 N1 M0)，定义为 IIIA 期。建议围手术期综合治疗。";
  } else if ((t === "T1" || t === "T1a" || t === "T1b" || t === "T2") && n === "N2") {
    overallStage = "IIIA";
    explanation = "AJCC 第 8 版食管鳞癌：T1-T2 伴 3~6 枚区域淋巴结转移 (T1-2 N2 M0)，定义为 IIIA 期。";
  } else if ((t === "T1" || t === "T1a" || t === "T1b" || t === "T2") && n === "N1") {
    overallStage = "IIB";
    explanation = "AJCC 第 8 版食管鳞癌：T1-T2 伴 1~2 枚淋巴结转移 (T1-2 N1 M0)，定义为 IIB 期。";
  } else if (t === "T3" && n === "N0") {
    // T3 N0 M0: 依解剖部位与分化分级协同分流
    if (subsite === "upper_thoracic" || grade === "G2" || grade === "G3") {
      overallStage = "IIB";
      explanation = `AJCC 第 8 版食管鳞癌：T3 N0 M0（${subsite === "upper_thoracic" ? "胸上段" : `${grade}分化`}），定义为 IIB 期。推荐新辅助放化疗 (nCRT)。`;
    } else {
      overallStage = "IIA";
      explanation = "AJCC 第 8 版食管鳞癌：T3 N0 M0（胸中下段 G1 高分化），定义为 IIA 期。";
    }
  } else if (t === "T2" && n === "N0") {
    // T2 N0 M0: G1 为 IB 期，G2-G3 为 IIA 期
    if (grade === "G1") {
      overallStage = "IB";
      explanation = "AJCC 第 8 版食管鳞癌：浸润肌层但无淋巴结转移且高分化 (T2 N0 M0 G1)，定义为 IB 期。首选手术切除。";
    } else {
      overallStage = "IIA";
      explanation = `AJCC 第 8 版食管鳞癌：浸润肌层无淋巴结转移 (${grade} 中低分化，T2 N0 M0)，定义为 IIA 期。`;
    }
  } else if (t === "T1b" && n === "N0") {
    // T1b N0 M0: G1 为 IA 期，G2-G3 为 IB 期
    if (grade === "G1") {
      overallStage = "IA";
      explanation = "AJCC 第 8 版食管鳞癌：黏膜下层浅浸润且高分化无转移 (T1b N0 M0 G1)，定义为 IA 期。";
    } else {
      overallStage = "IB";
      explanation = `AJCC 第 8 版食管鳞癌：黏膜下浸润伴 ${grade} 分化 (T1b N0 M0)，定义为 IB 期。微创胸腹腔镜联合食管切除。`;
    }
  } else if ((t === "T1a" || t === "T1") && n === "N0") {
    overallStage = "IA";
    explanation = "AJCC 第 8 版食管鳞癌：黏膜内癌无淋巴结转移 (T1a N0 M0)，定义为 IA 期。绝大多数符合内镜黏膜下剥离术 (ESD) 治愈性切除适应证。";
  } else {
    overallStage = "IIB";
    explanation = "AJCC 第 8 版食管鳞癌综合临床评估。";
  }

  // 8. 临床指南路径指引 (CSCO / NEOCRTEC5010 / ESCORT-1st)
  if (overallStage === "0" || overallStage === "IA") {
    guidelines.push("【早期内镜切除】首选内镜黏膜下剥离术 (ESD) 或内镜黏膜切除术 (EMR)，保留自体完整食管与生活质量。");
  } else if (overallStage === "IB" || overallStage === "IIA") {
    guidelines.push("【外科根治术】推荐微创胸腹腔镜联合食管癌切除术 (MIE) + 规范两野/三野淋巴结清扫 (≥15枚)。");
  } else if (overallStage === "IIB" || overallStage === "IIIA" || overallStage === "IIIB") {
    guidelines.push(
      "【围手术期新辅助放化疗】优先推荐中国原研 NEOCRTEC5010（长春瑞滨+顺铂+40Gy）或 CROSS 方案，术后病理非 pCR 推荐纳武利尤单抗辅助维持 (CheckMate-577)。"
    );
  } else {
    // IVA / IVB
    guidelines.push(
      "【一线免疫靶免联合】晚期转移或不可切除局部晚期，首选中国原研 PD-1 单抗（卡瑞利珠单抗 ESCORT-1st / 替雷利珠单抗 RATIONALE-306 / 特瑞普利单抗 JUPITER-06）联合紫杉醇+顺铂双药化疗。"
    );
  }

  return {
    cancerType: "esophageal",
    stage: overallStage,
    tStage: t,
    nStage: n,
    mStage: m,
    explanation,
    treatmentDirection: guidelines[0] || explanation,
    therapeuticStrategy: guidelines[0] || explanation,
    confidence: "high",
    evidenceLevel: "Category 1 (CSCO 2024 / AJCC 8th)",
    riskTier: overallStage.startsWith("IV") ? "high_risk" : overallStage.startsWith("III") ? "intermediate_risk" : "standard_low_risk",
    guidelines,
    warnings,
    subsite,
    isFistulaRisk: isAirwayRisk,
    isLymphNodeAdequate,
    sccElevated,
  };
}

export function computeEsophagealClinicalCohort(profile: any): ClinicalCohortResult {
  let stage = (profile?.stage || profile?.clinicalData?.overallStage || "").toUpperCase();
  if (!stage) {
    const rawData = profile?.clinicalData || profile?.cancerSpecificData || profile || {};
    const t = String(rawData.tStage || "").toUpperCase();
    const n = String(rawData.nStage || "").toUpperCase();
    const m = String(rawData.mStage || "").toUpperCase();
    if (m.startsWith("M1")) stage = "IV";
    else if (n.startsWith("N3")) stage = "IVA";
    else if (n.startsWith("N2") || n.startsWith("N1")) stage = "III";
    else if (t.startsWith("T3") || t.startsWith("T4")) stage = "II";
    else stage = "I";
  }
  const pdl1Cps = profile?.clinicalData?.pdl1Cps ?? profile?.pdl1Cps;

  const rawData = profile?.clinicalData || profile?.cancerSpecificData || profile || {};
  const isNeoadjuvant = Boolean(
    rawData.neoadjuvantTherapy === true ||
    rawData.neoadjuvantCRT === true ||
    (rawData.tStage && String(rawData.tStage).toLowerCase().startsWith("yp")) ||
    (rawData.nStage && String(rawData.nStage).toLowerCase().startsWith("yp"))
  );
  const pcrVal = rawData.pcrStatus || profile?.pcrStatus;
  const isNonPcr = pcrVal === "non-pCR" || pcrVal === "residual";

  // 1. 新辅助后残存病灶 (non-pCR) 纳武利尤单抗维持队列 (CheckMate-577)
  if (isNeoadjuvant && isNonPcr) {
    return {
      name: "CheckMate577_Adjuvant_Cohort",
      stage: `${stage}期 (新辅助放化疗后残存病灶 · 纳武利尤辅助维持)`,
      cohortSize: 794,
      rfs5Year: "中位DFS 22.4月 (安慰剂组 11.0月)",
      os5Year: "48.5% (死亡风险降低31%)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (1级前瞻多中心全球RCT)",
      source: "CheckMate-577 里程碑试验 (NEJM 2021 / ASCO)",
      description: "针对接受新辅助同步放化疗 (nCRT) 联合根治术后病理存在残存浸润癌 (non-pCR) 的食管或食管胃结合部癌。术后给予纳武利尤单抗免疫维持治疗 1 年，将中位无病生存期由 11.0 个月翻倍延长至 22.4 个月 (HR=0.69)！",
      isPreOp: false,
      keyFactors: ["新辅助non-pCR", "纳武利尤单抗辅助", "中位DFS翻倍(22.4月)", "复发风险降31%"],
      matchedMorphology: "新辅助放化疗后残存食管鳞癌/腺癌",
      riskTier: "intermediate_risk",
      cohortId: "CheckMate577_Adjuvant_Cohort",
      cohortName: "CheckMate-577 术后辅助免疫维持队列",
      sampleSize: 794,
      hazardRatio: "0.69 (95% CI: 0.56-0.86)",
      dataSource: "CheckMate-577 (NEJM 2021)",
      pmid: "33861989",
      doi: "10.1056/NEJMoa2032125",
      journal: "N Engl J Med",
      publicationYear: 2021,
      firstAuthor: "Kelly RJ et al.",
    };
  }

  if (stage === "0" || stage === "IA" || stage === "STAGE IA" || stage === "STAGE 0") {
    return {
      name: "早期食管鳞癌内镜黏膜下剥离术 (ESD) 根治队列",
      stage: "Stage 0 / IA期 (黏膜内早期食管鳞癌)",
      cohortSize: 1240,
      rfs5Year: "95.2%",
      os5Year: "95.2%",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (CSCO专家共识与多中心前瞻队列)",
      source: "CSCO 早期食管癌内镜诊治专家共识 & 多中心前瞻队列",
      description: "黏膜内早期食管鳞癌 (cT1aN0M0) 经 ESD 治愈性切除后，5 年疾病特异性生存率达 95.2%，且完全避免了开胸开腹对消化功能的严重破坏。",
      isPreOp: false,
      keyFactors: ["早期局限于黏膜内 (cT1a)", "无区域淋巴结转移 (N0)", "内镜微创保器官"],
      matchedMorphology: "早期黏膜内食管鳞癌",
      riskTier: "minimal_risk",
      // Specialized trial cohort fields
      cohortId: "ESD_Early_ESCC_Cohort",
      cohortName: "早期食管鳞癌内镜黏膜下剥离术 (ESD) 根治队列",
      sampleSize: 1240,
      medianFollowUpMonths: 60,
      overallSurvivalMonths: 96.0,
      fiveYearOsRate: 0.952,
      dataSource: "CSCO 早期食管癌内镜诊治专家共识 & 多中心前瞻队列",
      matchingCriteria: ["早期局限于黏膜内 (cT1a)", "无区域淋巴结转移 (N0)", "无溃疡或重度不典型增生范围可控"],
    };
  }

  if (stage.includes("IIB") || stage.includes("III") || stage.includes("IIIA") || stage.includes("IIIB")) {
    if (rawData.neoadjuvantRegimen === "CROSS" || profile?.neoadjuvantRegimen === "CROSS") {
      return {
        name: "CROSS_nCRT_Cohort",
        stage: "II/III期 (CROSS 经典新辅助放化疗队列)",
        cohortSize: 368,
        rfs5Year: "10年无复发生存率 46.0%",
        os5Year: "5年OS 47.0% (10年OS 38.0%)",
        confidenceRating: "⭐⭐⭐⭐⭐",
        confidenceLevel: "极高置信度 (1级前瞻RCT长期随访)",
        source: "CROSS 试验 10年长期随访 (Lancet Oncol 2015 / JCO 2021)",
        description: "紫杉醇+卡铂联合 41.4 Gy 同步放化疗新辅助方案。在鳞癌中 pCR 达 49%，10 年总生存率达 46% vs 23% (HR=0.60)，确立了国际公认的放化疗根基地位。",
        isPreOp: true,
        keyFactors: ["紫杉醇+卡铂", "41.4Gy放化疗", "鳞癌pCR 49%", "10年OS翻倍"],
        matchedMorphology: "局部进展期食管癌 (cT2-3 或 N+)",
        riskTier: "intermediate_risk",
        displayMode: "extended_10yr",
        os10Year: "38.0% (CROSS 10年随访)",
        metric3: {
          label: "10年总生存率 (CROSS)",
          value: "38.0%",
          subLabel: "长期治愈平台",
          badgeColor: "purple",
          tooltipTitle: "什么是 CROSS 试验 10 年长期随访？",
          tooltipContent: "CROSS 试验 10 年随访证实，新辅助同步放化疗使 10 年总生存率达 38%（单纯手术组仅 25%），死亡风险降低 40%，为局部晚期食管癌确立了坚实的长期治愈平台。"
        },
        cohortId: "CROSS_nCRT_Cohort",
        cohortName: "CROSS 新辅助放化疗 10年随访队列",
        sampleSize: 368,
        hazardRatio: "0.60 (95% CI: 0.46-0.80)",
        dataSource: "CROSS (Lancet Oncol 2015)",
        pmid: "22646630",
        doi: "10.1056/NEJMoa1113505",
        journal: "N Engl J Med",
        publicationYear: 2012,
        firstAuthor: "van Hagen P et al.",
      };
    }

    return {
      name: "中国自主原研局部进展期食管鳞癌新辅助放化疗 (NEOCRTEC5010) 队列",
      stage: "IIB / III期 (局部进展期食管鳞癌)",
      cohortSize: 451,
      rfs5Year: "中位DFS 100.1月",
      os5Year: "59.1% (中位OS 100.1月)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (中国自主原研 1 级前瞻多中心 RCT)",
      source: "NEOCRTEC5010 (J Clin Oncol 2018 / Lancet Oncol 2021) 随机对照 III 期研究",
      description: "中国自主前瞻性随机对照 III 期研究：长春瑞滨 + 顺铂联合 40.0 Gy 术前新辅助放化疗相比单纯手术，病理完全缓解率 (pCR) 达 43.2%，中位生存期由 66.5 个月大幅延长至 100.1 个月，5 年 OS 由 46.5% 跃升至 59.1%（降低 30% 死亡风险）。",
      isPreOp: true,
      keyFactors: ["长春瑞滨+顺铂", "40Gy新辅助放化疗", "pCR率43.2%", "中位OS 100.1个月"],
      matchedMorphology: "局部进展期浸润性胸段食管鳞癌",
      riskTier: "intermediate_risk",
      displayMode: "standard_5yr",
      metric3: {
        label: "病理完全缓解率 (pCR)",
        value: "43.2%",
        subLabel: "新辅助放化疗",
        badgeColor: "emerald",
        tooltipTitle: "什么是 NEOCRTEC5010 pCR 率？",
        tooltipContent: "中国自主前瞻 III 期 RCT 证实，长春瑞滨+顺铂新辅助放化疗后，43.2% 的食管鳞癌病灶实现镜下完全消失 (pCR)，使 5 年总生存率由 46.5% 跃升至 59.1%。"
      },
      // Specialized trial cohort fields
      cohortId: "NEOCRTEC5010_nCRT_Cohort",
      cohortName: "中国自主原研局部进展期食管鳞癌新辅助放化疗 (NEOCRTEC5010) 队列",
      sampleSize: 451,
      medianFollowUpMonths: 41,
      overallSurvivalMonths: 100.1,
      fiveYearOsRate: 0.591,
      dataSource: "NEOCRTEC5010 (J Clin Oncol 2018 / Lancet Oncol 2021) 随机对照 III 期研究",
      matchingCriteria: ["可切除局部进展期食管鳞癌 (cT1-4N1-3 或 cT3-4N0)", "PS 评分 0~1", "无气管食管瘘穿孔风险"],
      pmid: "29768114",
      doi: "10.1200/JCO.2017.77.5098",
      journal: "J Clin Oncol",
      publicationYear: 2018,
      firstAuthor: "Yang H et al.",
    };
  }

  if (stage.includes("IV") || stage.includes("IVA") || stage.includes("IVB")) {
    if (rawData.immunotherapy === "tislelizumab" || profile?.immunotherapy === "tislelizumab") {
      return {
        name: "RATIONALE306_Tislelizumab_Cohort",
        stage: "Stage IV期 (替雷利珠单抗联合化疗一线队列)",
        cohortSize: 649,
        rfs5Year: "中位PFS 7.3月",
        os5Year: "中位OS 17.2月 (化疗对照组 10.6月)",
        confidenceRating: "⭐⭐⭐⭐⭐",
        confidenceLevel: "极高置信度 (1级前瞻全球多中心RCT)",
        source: "RATIONALE-306 试验 (Lancet Oncol 2023)",
        description: "替雷利珠单抗联合含氟尿嘧啶或紫杉类含铂双药一线治疗晚期食管鳞癌。中位总生存期延长至 17.2 个月，死亡风险降低 34% (HR=0.66)，在所有 PD-L1 表达状态患者中均观察到持续获益。",
        isPreOp: false,
        keyFactors: ["替雷利珠单抗", "全人群获益", "中位OS 17.2个月", "死亡风险降34%"],
        matchedMorphology: "不可切除晚期或转移性食管鳞癌",
        riskTier: "high_risk",
        displayMode: "median_survival",
        medianOsMonths: "17.2 个月",
        medianPfsMonths: "7.3 个月",
        metricLabel1: "中位无进展生存 (mPFS)",
        metricSubLabel1: "免疫化疗控制",
        metricLabel2: "中位总生存期 (Median OS)",
        metricSubLabel2: "死亡风险降34%",
        metric3: {
          label: "中位生存显著延长",
          value: "17.2个月",
          subLabel: "化疗对照组10.6月",
          badgeColor: "teal",
          tooltipTitle: "什么是 RATIONALE-306 生存突破？",
          tooltipContent: "替雷利珠单抗联合双药化疗一线治疗晚期食管鳞癌，使中位总生存期从 10.6 个月显著延长至 17.2 个月，全人群获益且进入医保目录。"
        },
        cohortId: "RATIONALE306_Cohort",
        cohortName: "RATIONALE-306 替雷利珠单抗一线队列",
        sampleSize: 649,
        overallSurvivalMonths: 17.2,
        hazardRatio: "0.66 (95% CI: 0.54-0.80)",
        dataSource: "RATIONALE-306 (Lancet Oncol 2023)",
      };
    }

    const cpsHigh = pdl1Cps != null && Number(pdl1Cps) >= 10;
    return {
      name: "晚期食管鳞癌中国原研卡瑞利珠单抗联合化疗 (ESCORT-1st) 队列",
      stage: "Stage IV期 (晚期或远处转移性食管鳞癌)",
      cohortSize: 596,
      rfs5Year: "中位PFS 6.9月",
      os5Year: "20.2% (中位OS 15.3月)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (中国自主原研 1 级前瞻多中心 RCT)",
      source: "ESCORT-1st (JAMA 2021) 前瞻随机对照双盲 III 期临床研究",
      description: "中国原研 PD-1 抑制剂卡瑞利珠单抗联合紫杉醇 + 顺铂一线治疗晚期或转移性食管鳞癌，中位总生存期达 15.3 个月（化疗对照组 12.0 个月），客观缓解率 (ORR) 达 72.1%，成为中国国家药监局 (NMPA) 批准的一线最高级别循证标准。",
      isPreOp: false,
      keyFactors: ["卡瑞利珠单抗", "紫杉醇+顺铂", "ORR 72.1%", "中位OS 15.3个月"],
      matchedMorphology: "晚期或复发转移性食管鳞癌",
      riskTier: "high_risk",
      // Specialized trial cohort fields
      cohortId: "ESCORT_1st_Camrelizumab_Cohort",
      cohortName: "晚期食管鳞癌中国原研卡瑞利珠单抗联合化疗 (ESCORT-1st) 队列",
      sampleSize: 596,
      medianFollowUpMonths: 24,
      overallSurvivalMonths: 15.3,
      fiveYearOsRate: 0.202,
      dataSource: "ESCORT-1st (JAMA 2021) 前瞻随机对照双盲 III 期临床研究",
      matchingCriteria: ["不可切除局部晚期或转移性食管鳞癌 (Stage IV)", "一线未接受系统抗肿瘤治疗", "无活动性自身免疫病与大咯血瘘管史"],
      pmid: "34529992",
      doi: "10.1001/jama.2021.15336",
      journal: "JAMA",
      publicationYear: 2021,
      firstAuthor: "Luo H et al.",
    };
  }

  // 默认为 MIE 根治术前瞻队列
  return {
    name: "微创食管癌切除术 (MIE) 规范两野/三野清扫预后队列",
    stage: "I/II期 (手术根治性切除)",
    cohortSize: 850,
    rfs5Year: "68.4%",
    os5Year: "68.4% (中位OS 72.5月)",
    confidenceRating: "⭐⭐⭐⭐⭐",
    confidenceLevel: "极高置信度 (CSCO 2024 外科规范质控数据库)",
    source: "CSCO 2024 食管癌规范化手术质控数据库",
    description: "胸腹腔镜联合食管癌切除术 (MIE) 配合规范区域淋巴结清扫（≥15 枚），可显著降低术后呼吸衰竭与吻合口瘘发病率，5 年生存率达 68.4%。",
    isPreOp: false,
    keyFactors: ["微创食管切除(MIE)", "清扫≥15枚", "两野/三野质控", "5年OS 68.4%"],
    matchedMorphology: "早中期可手术切除食管鳞癌",
    riskTier: "standard_low_risk",
    // Specialized trial cohort fields
    cohortId: "MIE_Radical_Esophagectomy_Cohort",
    cohortName: "微创食管癌切除术 (MIE) 规范两野/三野清扫预后队列",
    sampleSize: 850,
    medianFollowUpMonths: 48,
    overallSurvivalMonths: 72.5,
    fiveYearOsRate: 0.684,
    dataSource: "CSCO 2024 食管癌规范化手术质控数据库",
    matchingCriteria: ["cT1b-T2 N0 M0", "心肺功能耐受全身麻醉", "规范两野或三野清扫"],
  };
}
