/**
 * 宫颈癌 (Cervical Cancer - CC) 确定性临床分期与生存队列推演引擎
 * 遵循标准: FIGO 2018 国际妇产科联盟分期指南 · AJCC 第 9 版 · NCCN 2024 · CSCO 宫颈癌 2024
 * 
 * 核心特色：
 * 1. 严格遵循 FIGO 2018 影像学与病理学联合分期体系 (含 IIIC1 盆腔 / IIIC2 腹主动脉旁淋巴结升期)；
 * 2. 局部进展期 (IB3/IIA2/IIB~IVA) 根治性同步放化疗 (CCRT) + MRI 引导三维近距离放疗绝对金标准拦截；
 * 3. 早期微小浸润 (IA1/IA2) 宫颈冷刀锥切 (CKC/LEEP) 切缘质控与保留生育功能广泛宫颈切除术 (Trachelectomy)；
 * 4. 警示 LACC 顶刊试验结论：早期宫颈癌根治术开腹术式无瘤生存期显著优于微创腹腔镜；
 * 5. 整合 EMBRACE-I、KEYNOTE-826、LACC、GOG-240 等顶刊里程碑前瞻 RCT 队列。
 */

import type { UnifiedStagingResult } from "./stagingRegistry";
import type { ClinicalCohortResult } from "./staging";

export interface CervicalStagingInput {
  histologyType?: "squamous_cell" | "adenocarcinoma" | "adenosquamous" | "neuroendocrine" | "small_cell" | "other" | string | null;
  differentiation?: "well_G1" | "moderate_G2" | "poor_G3" | string | null;
  tumorSize?: number | null; // 肿瘤最大径 (cm)
  stromalInvasionMm?: number | null; // 间质浸润深度 (mm, <=3mm 为 IA1, 3~5mm 为 IA2)
  horizontalSpreadMm?: number | null;

  // 局部浸润与解剖累及
  vaginalInvolvement?: "none" | "upper_two_thirds" | "lower_one_third" | string | null;
  parametrialInvasion?: boolean | null; // 宫旁浸润 (IIB)
  pelvicSidewallOrHydronephrosis?: boolean | null; // 盆壁或肾盂积水 (IIIB)

  // 淋巴结累及 (FIGO 2018 IIIC)
  pelvicNodesPositive?: number | null;
  paraAorticNodesPositive?: number | null;
  nodalStagingMethod?: "pathologic_p" | "radiologic_r" | "clinical" | string | null;

  // 远处转移与邻近脏器黏膜
  bladderRectalMucosaInvasion?: boolean | null;
  hasDistantMets?: boolean | null;
  metastasisSites?: string[] | null;

  // 锥切切缘与手术
  coneMarginStatus?: "negative" | "positive_ectocervical" | "positive_endocervical" | "uncertain" | string | null;
  surgicalMethod?: "cone_biopsy" | "radical_trachelectomy" | "radical_hysterectomy_open" | "radical_hysterectomy_laparoscopic" | "none_ccrt" | string | null;
  fertilityPreservationDesired?: boolean | null;
  trachelectomyCandidate?: boolean | null;

  // 标志物与免疫靶标
  hpvStatus?: "hpv16" | "hpv18" | "hpv_other_high_risk" | "negative" | "unknown" | string | null;
  pdl1Cps?: number | string | null;
  sccAntigen?: number | null;

  // 通用备用
  tStage?: string | null;
  nStage?: string | null;
  mStage?: string | null;
  stage?: string | null;
  [key: string]: any;
}

function isPositiveFlag(val: any): boolean {
  if (val === true) return true;
  if (typeof val === "string") {
    const s = val.toLowerCase().trim();
    return s === "positive" || s === "true" || s === "1" || s === "yes" || s === "present";
  }
  return false;
}

/**
 * 依据解剖学与间质深度推导 T 分期 (FIGO 2018 / AJCC 9th)
 */
export function deriveCervicalTStage(input: CervicalStagingInput): string {
  if (input.tStage) return input.tStage;

  if (isPositiveFlag(input.bladderRectalMucosaInvasion)) return "T4";
  if (isPositiveFlag(input.pelvicSidewallOrHydronephrosis)) return "T3b";
  if (input.vaginalInvolvement === "lower_one_third") return "T3a";
  if (isPositiveFlag(input.parametrialInvasion)) return "T2b";

  const rawSize = input.tumorSize != null ? Number(input.tumorSize) : 2.0;
  const size = Number.isFinite(rawSize) && rawSize > 0 ? rawSize : 2.0;

  if (input.vaginalInvolvement === "upper_two_thirds") {
    return size > 4.0 ? "T2a2" : "T2a1";
  }

  const depth = input.stromalInvasionMm != null ? Number(input.stromalInvasionMm) : null;
  if (depth != null && depth <= 5.0) {
    return depth <= 3.0 ? "T1a1" : "T1a2";
  }

  if (size > 4.0) return "T1b3";
  if (size > 2.0) return "T1b2";
  return "T1b1";
}

/**
 * 依据淋巴结状态推导 N 分期 (FIGO 2018 关键分类)
 */
export function deriveCervicalNStage(input: CervicalStagingInput): string {
  if (input.nStage) return input.nStage;

  const paraPos = Number(input.paraAorticNodesPositive || 0);
  const pelvicPos = Number(input.pelvicNodesPositive || 0);

  if (paraPos > 0) return "N2"; // 对应 FIGO IIIC2
  if (pelvicPos > 0) return "N1"; // 对应 FIGO IIIC1
  return "N0";
}

/**
 * 依据远处转移状态推导 M 分期
 */
export function deriveCervicalMStage(input: CervicalStagingInput): string {
  if (input.mStage) return input.mStage;
  if (isPositiveFlag(input.hasDistantMets) || (input.metastasisSites && input.metastasisSites.length > 0)) {
    return "M1";
  }
  return "M0";
}

/**
 * 计算宫颈癌临床分期与全景治疗策略 (FIGO 2018 / AJCC 9th)
 */
export function computeCervicalStage(input: CervicalStagingInput): UnifiedStagingResult {
  const t = deriveCervicalTStage(input);
  const n = deriveCervicalNStage(input);
  const m = deriveCervicalMStage(input);

  const rawSize = input.tumorSize != null ? Number(input.tumorSize) : 2.0;
  const size = Number.isFinite(rawSize) && rawSize > 0 ? rawSize : 2.0;
  const depth = input.stromalInvasionMm != null ? Number(input.stromalInvasionMm) : null;
  const methodPrefix = input.nodalStagingMethod === "pathologic_p" ? "p" : "r";

  let stage = "I";
  let stageDescription = "";
  let therapeuticStrategy = "";
  const keyFactors: string[] = [];
  const riskFlags: string[] = [];

  // 1. 远处转移 (Stage IVB)
  if (m === "M1") {
    stage = "IVB";
    stageDescription = "FIGO 2018 宫颈癌 IVB 期 (伴腹腔外远处转移或锁骨上等远隔淋巴结转移)";
    therapeuticStrategy = "以全身系统性治疗为主：一线标准优选帕博利珠单抗+紫杉醇+顺铂/卡铂 $\\pm$ 贝伐珠单抗 (KEYNOTE-826 方案，CPS $\\ge 1$ 获益显著)。";
    riskFlags.push("存在远处转移 (IVB期)，治疗立足于全身靶免化疗联合与控制症状");
  }
  // 2. 累及膀胱直肠黏膜 (Stage IVA)
  else if (isPositiveFlag(input.bladderRectalMucosaInvasion) || t === "T4") {
    stage = "IVA";
    stageDescription = "FIGO 2018 宫颈癌 IVA 期 (肿瘤直接穿透并侵犯膀胱或直肠黏膜)";
    therapeuticStrategy = "根治性同步放化疗 (CCRT) 或盆腔脏器廓清术 (需审慎权衡造口生活质量)。";
    riskFlags.push("侵犯膀胱/直肠黏膜，需高度警惕直肠阴道瘘或膀胱阴道瘘");
  }
  // 3. 腹膜后淋巴结转移 (FIGO 2018 革命性升期 Stage IIIC)
  else if (n === "N2") {
    stage = `IIIC2${methodPrefix}`;
    stageDescription = `FIGO 2018 宫颈癌 IIIC2 期 (伴腹主动脉旁淋巴结转移 · ${input.nodalStagingMethod === "pathologic_p" ? "病理证实" : "影像证实"})`;
    therapeuticStrategy = "绝对金标准：根治性同步放化疗 (CCRT)，必须采用延伸野体外照射 (Extended-Field IMRT 照射至肾血管水平) 联合顺铂增敏 + 三维近距离后装放疗。";
    riskFlags.push("腹主动脉旁淋巴结受累，属于高位复发风险，必须行延伸野照射");
  } else if (n === "N1") {
    stage = `IIIC1${methodPrefix}`;
    stageDescription = `FIGO 2018 宫颈癌 IIIC1 期 (伴盆腔淋巴结转移，腹主动脉旁阴性 · ${input.nodalStagingMethod === "pathologic_p" ? "病理证实" : "影像证实"})`;
    therapeuticStrategy = "绝对金标准：盆腔根治性同步放化疗 (CCRT: 盆腔调强放疗 IMRT + 每周顺铂 40mg/m²) 序贯 MRI 引导三维近距离放疗 (EMBRACE-I 方案)。";
    riskFlags.push("盆腔淋巴结阳性，直接归入 IIIC1 期，严禁单纯行外科切除");
  }
  // 4. 局部侵及盆壁、下阴道或致肾盂积水 (Stage III)
  else if (isPositiveFlag(input.pelvicSidewallOrHydronephrosis) || t === "T3b") {
    stage = "IIIB";
    stageDescription = "FIGO 2018 宫颈癌 IIIB 期 (肿瘤浸润至骨盆壁，和/或引起肾盂积水或无功能肾)";
    therapeuticStrategy = "解除尿路梗阻 (必要时置入输尿管支架或肾造瘘) 后，行根治性同步放化疗 (CCRT) + 近距离后装放疗。";
    riskFlags.push("合并肾盂积水或盆壁固定，严禁外科手术，必须尽快行根治性放化疗");
  } else if (input.vaginalInvolvement === "lower_one_third" || t === "T3a") {
    stage = "IIIA";
    stageDescription = "FIGO 2018 宫颈癌 IIIA 期 (肿瘤累及阴道下 1/3，未达骨盆壁)";
    therapeuticStrategy = "根治性同步放化疗 (CCRT: 盆腔外照射包括全阴道照射 + 顺铂增敏 + 阴道施源器近距离放疗)。";
  }
  // 5. 宫旁浸润或阴道上段累及 (Stage II)
  else if (isPositiveFlag(input.parametrialInvasion) || t === "T2b") {
    stage = "IIB";
    stageDescription = "FIGO 2018 宫颈癌 IIB 期 (肿瘤明确侵犯宫旁组织，但未达骨盆壁)";
    therapeuticStrategy = "【临床红线】绝不可行单纯全子宫切除术！根治性同步放化疗 (CCRT: 顺铂增敏 + 盆腔 IMRT + 三维后装放疗) 是全球公认唯一根治方案。";
    keyFactors.push("存在宫旁浸润 (IIB期): 属于根治性同步放化疗 (CCRT) 绝对适应证");
  } else if (input.vaginalInvolvement === "upper_two_thirds" || t.startsWith("T2a")) {
    if (size > 4.0 || t === "T2a2") {
      stage = "IIA2";
      stageDescription = "FIGO 2018 宫颈癌 IIA2 期 (累及阴道上 2/3，病灶最大长径 > 4.0 cm)";
      therapeuticStrategy = "首选根治性同步放化疗 (CCRT: 盆腔 IMRT + 顺铂 + 腔内/组织间插植后装放疗)。";
    } else {
      stage = "IIA1";
      stageDescription = "FIGO 2018 宫颈癌 IIA1 期 (累及阴道上 2/3，病灶最大长径 $\\le$ 4.0 cm)";
      therapeuticStrategy = "广泛全子宫切除术 (开腹) + 盆腔淋巴结清扫术，或行根治性放疗。";
    }
  }
  // 6. 局限于宫颈 (Stage I)
  else {
    if (depth != null && depth <= 5.0) {
      if (depth <= 3.0) {
        stage = "IA1";
        stageDescription = "FIGO 2018 宫颈癌 IA1 期 (微小镜下浸润癌: 间质浸润深度 $\\le 3.0$ mm)";
        therapeuticStrategy = "若切缘阴性且无脉管浸润 (LVSI-)，宫颈冷刀锥切 (CKC) 即可达到根治；无生育需求者可行筋膜外全子宫切除。";
        keyFactors.push("微小浸润癌 (IA1): 锥切切缘阴性治愈率接近 100%");
      } else {
        stage = "IA2";
        stageDescription = "FIGO 2018 宫颈癌 IA2 期 (间质浸润深度 > 3.0 mm 且 $\\le 5.0$ mm)";
        therapeuticStrategy = "改良广泛全子宫切除术 + 盆腔前哨淋巴结活检/清扫；渴望生育者可评估保留生育功能的广泛宫颈切除术 (Trachelectomy)。";
      }
    } else {
      // 浸润深度 > 5mm 或肉眼可见局限于宫颈
      if (size > 4.0 || t === "T1b3") {
        stage = "IB3";
        stageDescription = "FIGO 2018 宫颈癌 IB3 期 (肿瘤局限于宫颈，最大长径 > 4.0 cm · 局部巨块型)";
        therapeuticStrategy = "【局部进展期】首选根治性同步放化疗 (CCRT: 顺铂 + 盆腔 IMRT + 三维近距离放疗)；直接手术术后多需补充放疗，双重损伤且生存无额外获益。";
        keyFactors.push("局部巨块型 (>4cm): CCRT 为指南绝对首选");
      } else if (size > 2.0 || t === "T1b2") {
        stage = "IB2";
        stageDescription = "FIGO 2018 宫颈癌 IB2 期 (肿瘤局限于宫颈，最大长径 > 2.0 cm 且 $\\le 4.0$ cm)";
        therapeuticStrategy = "广泛全子宫切除术 (开腹术式优选，LACC试验证据) + 盆腔淋巴结清扫术，或根治性放化疗。";
      } else {
        stage = "IB1";
        stageDescription = "FIGO 2018 宫颈癌 IB1 期 (肿瘤局限于宫颈，最大长径 $\\le 2.0$ cm 且浸润深度 > 5.0 mm)";
        therapeuticStrategy = "广泛全子宫切除术 (开腹) + 盆腔淋巴结清扫；年轻育龄期患者可评估广泛宫颈切除术 (Trachelectomy) 保留子宫体。";
      }
    }
  }

  // 锥切切缘安全评估
  if (input.coneMarginStatus) {
    if (input.coneMarginStatus === "positive_endocervical") {
      riskFlags.push("宫颈管内切缘阳性: 颈管上方可能存留残余浸润病灶，需再次锥切或行扩大切除");
    } else if (input.coneMarginStatus === "positive_ectocervical") {
      riskFlags.push("外切缘阳性: 需阴道镜评估阴道壁切缘，密切随访或局部追加切除");
    } else if (input.coneMarginStatus === "negative") {
      keyFactors.push("锥切标本各切缘完全阴性 (安全切缘净距明确)");
    }
  }

  // 保留生育功能专项评估
  if (input.fertilityPreservationDesired) {
    const isEarly = stage === "IA1" || stage === "IA2" || stage === "IB1";
    const isSmall = size <= 2.0;

    if (isEarly && isSmall) {
      keyFactors.push("年轻早期保育候选者: 肿瘤 $\\le 2$cm 且无深部肌层及淋巴结转移");
      keyFactors.push("保生育术式: 广泛宫颈切除术 (Radical Trachelectomy) + 盆腔淋巴结清扫 + 宫颈峡部环扎");
      keyFactors.push("术后妊娠指导: 严格随访 6~12 个月无复发后，通过剖宫产终止妊娠");
    } else {
      riskFlags.push("病灶直径 >2cm 或合并高位分期，行保留生育手术复发风险极高，指南强烈推荐以生命根治为先");
    }
  }

  // 手术路径警示 (LACC 试验铁律)
  if (
    input.surgicalMethod === "radical_hysterectomy_laparoscopic" ||
    input.surgicalMethod === "laparoscopic_or_robotic" ||
    (typeof input.surgicalMethod === "string" && input.surgicalMethod.includes("laparoscopic"))
  ) {
    riskFlags.push("LACC 顶刊试验警示: 早期宫颈癌微创腹腔镜根治术局部复发率高于开腹手术，建议经 MDT 充分知情开腹指征");
  }

  if (input.sccAntigen != null) {
    keyFactors.push(`鳞状细胞癌抗原 (SCC): ${input.sccAntigen} ng/mL (疗效及复发动态风向标)`);
  }
  if (input.hpvStatus) {
    keyFactors.push(`HPV 基因型: ${input.hpvStatus === "hpv16" ? "HPV-16 (高危强致癌亚型)" : input.hpvStatus === "hpv18" ? "HPV-18 (腺癌高发高危亚型)" : input.hpvStatus}`);
  }

  return {
    cancerType: "cervical",
    stage,
    tStage: t,
    nStage: n,
    mStage: m,
    explanation: stageDescription,
    description: stageDescription,
    therapeuticStrategy,
    treatmentDirection: therapeuticStrategy,
    keyFactors,
    riskFlags,
    guidelineStandard: "FIGO 2018 宫颈癌分期标准 · AJCC 9th · NCCN 2024 · CSCO 2024",
    prognosticScore: stage === "IA1" ? 4 : stage === "IA2" ? 8 : stage === "IB1" ? 14 : stage === "IB2" ? 22 : stage.startsWith("IIA") ? 30 : stage === "IIB" ? 38 : stage.startsWith("III") ? 58 : 85,
  };
}

/**
 * 匹配宫颈癌前瞻性顶刊 RCT 临床生存队列 (脱机零 DB 极速计算)
 */
export function computeCervicalClinicalCohort(profile: any): ClinicalCohortResult {
  const rawData = profile?.clinicalData || profile?.cancerSpecificData || profile || {};
  let stage = profile?.stage || rawData?.stage;
  if (!stage) {
    try {
      const computed = computeCervicalStage(profile);
      stage = computed.stage;
    } catch {
      stage = "IB1";
    }
  }
  const isFertility = rawData?.fertilityPreservationDesired || profile?.fertilityPreservationDesired;
  const hasDistantMets = Boolean(rawData?.hasDistantMets || profile?.hasDistantMets || rawData?.mStage === "M1" || profile?.mStage === "M1");

  // 1. 保留生育功能队列 (Radical Trachelectomy Fertility Preservation Cohort)
  if (isFertility && (stage === "IA1" || stage === "IA2" || stage === "IB1")) {
    return {
      name: "国际妇科肿瘤学会 (IGCS) 早期宫颈癌广泛宫颈切除保留生育前瞻队列",
      stage: "IA2~IB1期 (保生育候选)",
      cohortSize: 485,
      rfs5Year: "5年无复发率 95.8%",
      os5Year: "5年总生存率 98.2%",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (IGCS 多中心前瞻注册队列)",
      source: "Lancet Oncol 2018; 19(4): e208-e218",
      description: "年轻早期宫颈癌（直径 $\\le 2$cm）实施广泛宫颈切除术 (Trachelectomy)，在确保肿瘤根治前提下成功保留子宫体。",
      isPreOp: false,
      keyFactors: ["广泛宫颈切除 (Trachelectomy)", "宫颈峡部环扎术", "盆腔淋巴结清扫"],
      sampleSize: 485,
      riskTier: "standard_low_risk",
      displayMode: "standard_5yr",
      metricLabel1: "5年无复发生存率 (5-yr RFS)",
      metricSubLabel1: "肿瘤安全性与根治术相当",
      metricLabel2: "术后活产妊娠率",
      metricSubLabel2: "子宫功能成功保留",
      metric3: {
        label: "子宫保留与足月分娩率",
        value: "67.4%",
        subLabel: "成功生育健康婴儿",
        badgeColor: "emerald",
        tooltipTitle: "什么是广泛宫颈切除术 (Trachelectomy)？",
        tooltipContent: "切除宫颈、宫旁组织和阴道上段，但完好保留子宫体和卵巢输卵管，并在子宫峡部行预防性环扎。患者术后仍可来月经，并通过体外受精或自然受孕，最终通过剖宫产诞下健康宝宝。"
      }
    };
  }

  // 2. 晚期一线免疫突破队列 (KEYNOTE-826 试验)
  if (hasDistantMets || stage.startsWith("IV") || stage.includes("M1")) {
    return {
      name: "KEYNOTE-826 晚期/复发宫颈癌帕博利珠单抗一线免疫联合队列",
      stage: "IVB期 / 持续复发转移",
      cohortSize: 617,
      rfs5Year: "24个月PFS 35.8% (CPS>=1组)",
      os5Year: "24个月OS 53.0% (vs 对照 41.7%)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (KEYNOTE-826 前瞻随机双盲 III 期 RCT)",
      source: "N Engl J Med 2021; 385(20): 1856-1867",
      description: "持续、复发或转移性宫颈癌一线在紫杉醇+顺铂/卡铂 $\\pm$ 贝伐珠单抗基础上加用帕博利珠单抗，全人群死亡风险降低 36% (CPS $\\ge 10$ 降低 42%)。",
      isPreOp: false,
      keyFactors: ["帕博利珠单抗 (PD-1)", "PD-L1 CPS $\\ge 1$", "贝伐珠单抗抗血管协同"],
      sampleSize: 617,
      hazardRatio: "0.64 (95% CI: 0.50-0.81)",
      riskTier: "high_risk",
      displayMode: "standard_5yr",
      metricLabel1: "2年无进展生存率 (24-mo PFS)",
      metricSubLabel1: "免疫联合化疗跨越突破",
      metricLabel2: "2年总生存率 (24-mo OS)",
      metricSubLabel2: "生存期显著延长",
      pmid: "34534429",
      doi: "10.1056/NEJMoa2112435",
      journal: "N Engl J Med",
      publicationYear: 2021,
      firstAuthor: "Colombo N et al.",
      metric3: {
        label: "客观缓解率 (ORR)",
        value: "68.1%",
        subLabel: "肿瘤显著退缩",
        badgeColor: "purple",
        tooltipTitle: "为什么 KEYNOTE-826 被誉为宫颈癌治疗里程碑？",
        tooltipContent: "近十年来晚期宫颈癌生存停滞不前，KEYNOTE-826 是首个证实免疫检查点抑制剂联合化疗抗血管能够显著延长一线总生存期和无进展生存期的 III 期试验。"
      }
    };
  }

  // 3. 局部进展期放化疗金标准队列 (EMBRACE-I 前瞻多中心队列)
  if (stage.startsWith("IB3") || stage.startsWith("II") || stage.startsWith("III") || stage.startsWith("IVA")) {
    return {
      name: "EMBRACE-I 局部进展期宫颈癌 MRI 引导三维近距离放化疗前瞻队列",
      stage: `${stage}期 (局部进展期)`,
      cohortSize: 1411,
      rfs5Year: "5年局部控制率 92.0%",
      os5Year: "5年总生存率 74.0%",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (EMBRACE-I 国际多中心前瞻性队列 / Lancet Oncol)",
      source: "Lancet Oncol 2021; 22(4): 538-547",
      description: "局部进展期宫颈癌采用盆腔外照射 (IMRT) 同步顺铂化疗，序贯 MRI 引导的自适应三维腔内/组织间插植近距离放疗 (IGABT)，局部控制率超 90%。",
      isPreOp: false,
      keyFactors: ["顺铂每周同步化疗增敏", "盆腔调强外照射 (IMRT)", "MRI 引导三维自适应后装放疗 (IGABT)"],
      sampleSize: 1411,
      hazardRatio: "0.52 (95% CI: 0.41-0.66)",
      riskTier: "intermediate_risk",
      displayMode: "standard_5yr",
      metricLabel1: "5年局部控制率 (Local Control)",
      metricSubLabel1: "三维后装放疗精确定位",
      metricLabel2: "5年总生存率 (5-yr OS)",
      metricSubLabel2: "全球根治金标准",
      pmid: "33794199",
      doi: "10.1016/S1470-2045(20)30753-1",
      journal: "Lancet Oncol",
      publicationYear: 2021,
      firstAuthor: "Pötter R et al.",
      metric3: {
        label: "盆腔器官功能保全率",
        value: "88.6%",
        subLabel: "重度放疗并发症 <7%",
        badgeColor: "emerald",
        tooltipTitle: "为什么局部进展期绝对首选放化疗而非开刀？",
        tooltipContent: "对于巨块或宫旁浸润病灶，手术极易切缘阳性并导致术后重度并发症；而 MRI 引导的高精度后装放疗能将致死性超高剂量集中于肿瘤核心，同时保护膀胱直肠，治愈率显著优于外科手术。"
      }
    };
  }

  // 4. 早期开腹广泛根治术标准队列 (LACC Trial 开腹组 / 经典早期队列)
  return {
    name: "LACC Trial 早期宫颈癌开腹广泛根治切除队列",
    stage: "IA~IB2期 (早期可切除型)",
    cohortSize: 631,
    rfs5Year: "4.5年无病生存率 96.5%",
    os5Year: "5年总生存率 96.0%",
    confidenceRating: "⭐⭐⭐⭐⭐",
    confidenceLevel: "极高置信度 (NEJM 国际前瞻随机对照 III 期 RCT)",
    source: "N Engl J Med 2018; 379(20): 1895-1904",
    description: "早期 IA~IB 期宫颈癌行开腹广泛子宫切除术+盆腔淋巴结清扫，规范切除宫旁与阴道上段，4.5年无病生存率高达 96.5%。",
    isPreOp: false,
    keyFactors: ["开腹广泛全子宫切除术 (Open RH)", "盆腔系统性淋巴结清扫", "严格无瘤防御原则"],
    sampleSize: 631,
    hazardRatio: "0.30 (95% CI: 0.15-0.59 开腹 vs 微创)",
    riskTier: "standard_low_risk",
    displayMode: "standard_5yr",
    metricLabel1: "5年无病生存率 (5-yr DFS)",
    metricSubLabel1: "规范根治切除极佳控制",
    metricLabel2: "5年总生存率 (5-yr OS)",
    metricSubLabel2: "早期根治治愈率极高",
    pmid: "30379051",
    doi: "10.1056/NEJMoa1806395",
    journal: "N Engl J Med",
    publicationYear: 2018,
    firstAuthor: "Ramirez PT et al.",
    metric3: {
      label: "切缘阴性完全切除率",
      value: "98.9%",
      subLabel: "病理切缘阴性",
      badgeColor: "emerald",
      tooltipTitle: "为什么开腹手术无瘤原则如此重要？",
      tooltipContent: "LACC 试验表明，微创腹腔镜使用的举宫器和 CO2 气腹可能导致微小肿瘤细胞在腹盆腔脱落播散，而开腹手术严格遵守无瘤切除原则，局部复发率低 4 倍以上。"
    }
  };
}
