/**
 * 胰腺癌 (Pancreatic Ductal Adenocarcinoma, PDAC) 确定性临床病理分期与生存队列推演引擎
 * 遵循权威指南标准: NCCN 2024 · AJCC 第 8 版 · CSCO 胰腺癌诊疗指南 2024
 */

import type { UnifiedStagingResult } from "./stagingRegistry";
import type { ClinicalCohortResult } from "./staging";

export interface PancreaticStagingInput {
  tStage?: string | null;
  nStage?: string | null;
  mStage?: string | null;
  tumorSize?: number | null;
  regionalNodesPositive?: number | null;
  lymphNodesPositive?: number | null;
  hasDistantMets?: boolean | null;
  smvPvInvolvement?: boolean | null;
  smvPvDegree?: "<=180" | ">180" | "occluded" | string | null;
  celiacInvolvement?: boolean | null;
  smaInvolvement?: boolean | null;
  chaInvolvement?: boolean | null;
  ca199?: number | null;
  brcaMutation?: "positive" | "negative" | "unknown" | string | null;
  krasStatus?: string | null;
  resectabilityStatus?: "resectable" | "borderline_resectable" | "locally_advanced" | "metastatic" | string | null;
  surgicalProcedure?: "whipple" | "distal_pancreatectomy_ramps" | "total_pancreatectomy" | "none" | string | null;
  marginStatus?: "R0" | "R1" | "R2" | "unknown" | string | null;
  stage?: string | null;
  organ?: string | null;
  [key: string]: any;
}

/**
 * 评估胰腺癌解剖学可切除性三分类 (NCCN / CSCO 指南核心标准)
 */
export function evaluatePancreaticResectability(input: PancreaticStagingInput): {
  status: "resectable" | "borderline_resectable" | "locally_advanced" | "metastatic";
  statusLabel: string;
  rationale: string;
} {
  if (input.hasDistantMets || (input.mStage && input.mStage.toUpperCase().startsWith("M1"))) {
    return {
      status: "metastatic",
      statusLabel: "转移性 (Metastatic)",
      rationale: "已发生肝、肺、腹膜或远处淋巴结转移，丧失根治性切除意义，首选一线系统化疗转化或带瘤维持。",
    };
  }

  // 动脉广泛侵犯 > 180° 或无法重建
  if (input.celiacInvolvement || input.smaInvolvement) {
    return {
      status: "locally_advanced",
      statusLabel: "局部进展不可切除 (Locally Advanced)",
      rationale: "病灶包绕腹腔干 (CA) 或肠系膜上动脉 (SMA) >180°，缺乏手术根治性安全解剖平面，推荐系统转化治疗。",
    };
  }

  // 静脉严重受侵或短段闭塞但可重建，或动脉临近粘连 <= 180°
  if (input.smvPvDegree === ">180" || input.smvPvDegree === "occluded" || input.chaInvolvement) {
    return {
      status: "borderline_resectable",
      statusLabel: "交界可切除 (Borderline Resectable)",
      rationale: "病灶浸润肠系膜上静脉/门静脉 >180° 或伴局部闭塞但远近端血管具备重建条件。强烈推荐 4~6 周期新辅助化疗降期。",
    };
  }

  return {
    status: "resectable",
    statusLabel: "可直接切除 (Resectable)",
    rationale: "病灶与腹腔干、SMA、CHA 脂肪间隙清晰，未累及或仅轻度接触 SMV/PV (≤180°)，具备直接 R0 根治切除解剖指征。",
  };
}

/**
 * 计算胰腺癌确定性临床病理分期 (AJCC 第 8 版 TNM 体系)
 */
export function computePancreaticStage(input: PancreaticStagingInput): UnifiedStagingResult {
  // 若传入已确诊分期且未传入细化 TNM 参数，直接解析该分期
  if (input.stage && !input.tStage && !input.nStage && !input.mStage && input.tumorSize === undefined && !input.celiacInvolvement && !input.smaInvolvement && !input.hasDistantMets) {
    const cleanStage = String(input.stage).toUpperCase().replace(/期/g, "").trim();
    return {
      cancerType: "pancreatic",
      stage: cleanStage,
      tStage: input.tStage || "Tx",
      nStage: input.nStage || "Nx",
      mStage: input.mStage || (cleanStage.startsWith("IV") ? "M1" : "M0"),
      explanation: `依据 AJCC 第 8 版标准：临床已确诊阶段为 ${cleanStage} 期。`,
      treatmentDirection: cleanStage.startsWith("IV")
        ? "IV 期晚期一线强效系统化疗 (mFOLFIRINOX 或 AG 方案)；若携带胚系 BRCA 突变，化疗稳态后推荐奥拉帕利靶向维持。"
        : cleanStage.startsWith("III")
        ? "局部晚期或交界可切除：强烈推荐 4~6 周期新辅助转化化疗 (mFOLFIRINOX/AG)，复查 CT/MRI 评估肿瘤退缩后再行 R0 根治术。"
        : "局限性可切除：优先推荐三甲专科医院 MDT 讨论后行 R0 根治手术 (Whipple 或 RAMPS)，术后序贯 6 个月 mFOLFIRINOX 辅助化疗。",
      versionNotice: "NCCN 2024 · AJCC 第 8 版 · CSCO 胰腺癌诊疗指南 2024",
    };
  }

  const rawSize = input.tumorSize != null ? Number(input.tumorSize) : null;
  const hasValidSize = rawSize != null && Number.isFinite(rawSize) && rawSize > 0;

  // 1. T 分期逻辑 (AJCC 8th: T1 <= 2cm, T2 >2且<=4cm, T3 >4cm, T4 侵犯腹腔干或SMA)
  let t = input.tStage;
  if (!t) {
    if (input.celiacInvolvement || input.smaInvolvement) {
      t = "T4";
    } else if (hasValidSize) {
      if (rawSize <= 2.0) {
        t = "T1";
      } else if (rawSize <= 4.0) {
        t = "T2";
      } else {
        t = "T3";
      }
    } else {
      t = "Tx";
    }
  }

  // 2. N 分期逻辑 (N0: 0个, N1: 1~3个区域淋巴结转移, N2: >=4个区域淋巴结转移)
  let n = input.nStage;
  const nodes = Number(input.regionalNodesPositive ?? input.lymphNodesPositive);
  if (!n) {
    if (Number.isFinite(nodes)) {
      if (nodes === 0) n = "N0";
      else if (nodes <= 3) n = "N1";
      else n = "N2";
    } else {
      n = "Nx";
    }
  }

  // 3. M 分期逻辑
  const m = input.hasDistantMets || (input.mStage && input.mStage.toUpperCase().startsWith("M1")) ? "M1" : "M0";

  // 4. 复合分期判定
  let stage = "I";
  if (m === "M1") {
    stage = "IV";
  } else if (t.startsWith("T4") || n.startsWith("N2")) {
    stage = "III";
  } else if (n.startsWith("N1")) {
    stage = "IIB";
  } else {
    // N0
    if (t.startsWith("T3")) stage = "IIA";
    else if (t.startsWith("T2")) stage = "IB";
    else if (t.startsWith("T1")) stage = "IA";
    else stage = "未知分期 (TxN0M0 需补充肿瘤大小)";
  }

  const resectability = evaluatePancreaticResectability(input);

  const isTxUnknown = t === "Tx" && stage.startsWith("未知分期");
  const explanation = isTxUnknown
    ? `依据 AJCC 第 8 版与 NCCN 2024 标准：${t}${n}${m}。由于缺少原发肿瘤最大长径 (cm) 或血管受累范围描述，T 分期标记为 Tx，暂无法给出确切的早期解剖分期 (IA/IB/IIA)；解剖学评估为【${resectability.statusLabel}】。${resectability.rationale}`
    : `依据 AJCC 第 8 版与 NCCN 2024 标准：${t}${n}${m}，综合临床病理分期判定为 ${stage} 期；解剖学评估为【${resectability.statusLabel}】。${resectability.rationale}`;

  let treatmentDirection = `${stage} 期胰腺癌多学科综合诊疗 (MDT)。`;
  if (isTxUnknown) {
    treatmentDirection = "建议先完善胰腺薄层增强 CT 或增强 MRI 检查，以明确肿瘤最大长径及腹腔大血管关系后再确定后续根治性手术或新辅助方案。";
  } else if (stage === "IV") {
    treatmentDirection = "IV 期晚期一线强效系统化疗 (mFOLFIRINOX 或 AG 方案)；若携带胚系 BRCA 突变，化疗稳态后推荐奥拉帕利靶向维持。";
  } else if (stage === "III" || resectability.status === "borderline_resectable") {
    treatmentDirection = "局部晚期或交界可切除：强烈推荐 4~6 周期新辅助转化化疗 (mFOLFIRINOX/AG)，复查 CT/MRI 评估肿瘤退缩后再行 R0 根治术。";
  } else {
    treatmentDirection = "局限性可切除：优先推荐三甲专科医院 MDT 讨论后行 R0 根治手术 (Whipple 或 RAMPS)，术后序贯 6 个月 mFOLFIRINOX 辅助化疗。";
  }

  return {
    cancerType: "pancreatic",
    stage,
    tStage: t,
    nStage: n,
    mStage: m,
    explanation,
    treatmentDirection,
    versionNotice: "NCCN 2024 · AJCC 第 8 版 · CSCO 胰腺癌诊疗指南 2024",
  };
}

/**
 * 匹配胰腺癌前瞻顶刊里程碑临床队列与生存推演 (真实 PubMed / DOI 穿透)
 */
export function getPancreaticClinicalCohort(profile: any): ClinicalCohortResult {
  const rawData = profile?.clinicalData || profile?.cancerSpecificData || profile || {};
  let stage = profile?.stage || profile?.clinicalStage || profile?.pathologicalStage;
  if (!stage) {
    const stageRes = computePancreaticStage(profile || {});
    stage = stageRes.stage;
  }
  const cleanStage = String(stage || "I").toUpperCase().replace(/期/g, "").trim();
  const isBrcaPositive = profile?.brcaMutation === "positive" || 
                         rawData?.brcaMutation === "positive" ||
                         profile?.molecularProfile?.brca === "positive" ||
                         profile?.molecularProfile?.brca1_2 === "mutated";

  if (cleanStage.startsWith("IV") || cleanStage.startsWith("4")) {
    if (isBrcaPositive) {
      return {
        name: "POLO_Trial_BRCA_Maintenance_Cohort",
        stage: "IV期 (gBRCA突变晚期胰腺癌维持队列)",
        cohortSize: 154,
        rfs5Year: "中位PFS 7.4月 (vs 安慰剂 3.8月, HR 0.53)",
        os5Year: "中位OS 18.9月 (化疗联合维持组)",
        confidenceRating: "⭐⭐⭐⭐⭐",
        confidenceLevel: "极高置信度 (1级前瞻双盲国际多中心 RCT)",
        source: "NEJM 2019 · POLO Study · PMID: 31157963",
        description: "对携带胚系 BRCA1/2 突变且一线含铂化疗未进展的转移性胰腺癌患者，奥拉帕利维持治疗降低 47% 疾病进展或死亡风险。",
        isPreOp: false,
        keyFactors: ["胚系BRCA1/2突变", "一线含铂化疗应答", "PARP抑制剂维持"],
        matchedMorphology: "转移性胰腺导管腺癌",
        riskTier: "high_risk",
        doi: "10.1056/NEJMoa1908639",
        pmid: "31157963",
        journal: "New England Journal of Medicine",
        publicationYear: 2019,
      };
    }

    return {
      name: "MPACT_NAPOLI_Systemic_Cohort",
      stage: "IV期 (转移性胰腺癌一线系统联合化疗队列)",
      cohortSize: 861,
      rfs5Year: "中位PFS 5.5~6.4月",
      os5Year: "中位OS 8.5~11.1月 (2年OS约 9%~10%)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (前瞻多中心国际 Phase III RCT)",
      source: "NEJM 2013 (MPACT) / NEJM 2011 (ACCORD 11)",
      description: "转移性胰腺癌一线 mFOLFIRINOX 或白蛋白紫杉醇联合吉西他滨 (AG) 方案，显著延长生存并显著优于传统吉西他滨单药。",
      isPreOp: false,
      keyFactors: ["ECOG PS评分 0-1", "CA19-9降幅", "三联化疗耐受性"],
      matchedMorphology: "转移性胰腺腺癌",
      riskTier: "high_risk",
      doi: "10.1056/NEJMoa1304369",
      pmid: "24131140",
      journal: "New England Journal of Medicine",
      publicationYear: 2013,
    };
  }

  if (cleanStage.startsWith("III") || cleanStage.startsWith("3")) {
    return {
      name: "PREOPANC_Neoadjuvant_Cohort",
      stage: "III期 (局部进展与交界可切除新辅助转化队列)",
      cohortSize: 246,
      rfs5Year: "新辅助转化组中位无病生存 11.2月",
      os5Year: "5年总生存率 20.5% (vs 直接手术组 6.5%, HR 0.73)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (前瞻多中心 Phase III RCT)",
      source: "JCO 2022 · PREOPANC 长期随访 · PMID: 35640799",
      description: "新辅助系统治疗使交界可切除患者 R0 根治切除率翻倍 (71% vs 40%)，5 年总生存率显著提升 3 倍以上。",
      isPreOp: true,
      keyFactors: ["新辅助转化方案", "R0切除率", "CA19-9转阴"],
      matchedMorphology: "交界可切除/局部进展期胰腺导管腺癌",
      riskTier: "high_risk",
      doi: "10.1200/JCO.21.02233",
      pmid: "35640799",
      journal: "Journal of Clinical Oncology",
      publicationYear: 2022,
    };
  }

  // 早期局限性 IA ~ IIB 期
  return {
    name: "PRODIGE_24_Adjuvant_Cohort",
    stage: `${cleanStage}期 (胰腺癌根治术后辅助化疗金标准队列)`,
    cohortSize: 493,
    rfs5Year: "3年无病生存率 39.7% (mFOLFIRINOX组)",
    os5Year: "中位OS 54.4月 (5年总生存率 43.2%)",
    confidenceRating: "⭐⭐⭐⭐⭐",
    confidenceLevel: "极高置信度 (1级前瞻多中心国际 Phase III RCT)",
    source: "NEJM 2018 · PRODIGE 24/CCTG PA.6 · PMID: 30575490",
    description: "R0/R1 根治术后，改良 mFOLFIRINOX 方案将中位生存期显著提升至 54.4 个月 (vs 吉西他滨组 35.0 个月, HR 0.64)，确立全球辅助化疗黄金标准。",
    isPreOp: false,
    keyFactors: ["R0阴性切缘", "术后辅助化疗周期数", "淋巴结检出总数 >=15"],
    matchedMorphology: "局限性可切除胰腺导管腺癌",
    riskTier: "intermediate_risk",
    doi: "10.1056/NEJMoa1809775",
    pmid: "30575490",
    journal: "New England Journal of Medicine",
    publicationYear: 2018,
  };
}
