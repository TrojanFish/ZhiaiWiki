/**
 * 确定性分期规则调度注册中心 (Staging Engine Registry)
 * 基于 CancerRegistry 插件架构，依据 cancerType 自动分发至对应的权威国际指南分期引擎：
 * - lung: IASLC / AJCC 第 9 版肺癌 TNM 引擎 (staging.ts)
 * - breast: AJCC 第 8/9 版乳腺癌双轨解剖与病理预后分期引擎 (breastStaging.ts)
 * - colorectal/future: 任意新接入癌种插件引擎
 */

import { CancerRegistry } from "./cancerRegistry";
import type { CancerType, PatientProfile } from "./types";
import type { ClinicalCohortResult, KmCurvePoint, KmCurveArm, MetricDisplayMode } from "./staging";

export type { ClinicalCohortResult, KmCurvePoint, KmCurveArm, MetricDisplayMode };
export { computeClinicalTnmStage } from "./staging";
export { computeBreastClinicalStage } from "./breastStaging";
export { computeColonStage, computeRectalStage, computeColorectalStage } from "./colorectalStaging";
export { computeGastricStage, getGastricClinicalCohort } from "./gastricStaging";
export { computeCnlcStage, computeLiverClinicalCohort } from "./liverStaging";
export { computeEsophagealStage, computeEsophagealClinicalCohort } from "./esophagealStaging";
export { computeThyroidStage, computeThyroidClinicalCohort } from "./thyroidStaging";
export { computeEndometrialStage, computeEndometrialClinicalCohort } from "./endometrialStaging";
export { computeCervicalStage, computeCervicalClinicalCohort } from "./cervicalStaging";
export { computePancreaticStage, getPancreaticClinicalCohort } from "./pancreaticStaging";

export interface UnifiedStagingResult {
  cancerType: CancerType;
  stage: string;               // 核心主分期 (e.g. "IA", "IB", "IIA", "IIB", "IIIA", "IVA")
  tStage: string;
  nStage: string;
  mStage: string;
  prognosticStage?: string;    // 乳腺癌专属预后分期
  anatomicalStage?: string;    // 乳腺癌专属解剖分期
  molecularSubtype?: string;   // 乳腺癌分子分型 (Luminal A, Luminal B, etc.)
  molecularSubtypeLabel?: string;
  explanation: string;
  treatmentDirection?: string;
  isDownstagedByGenomics?: boolean;
  versionNotice?: string;

  // v3.1 临床细节精修字段
  isNeoadjuvant?: boolean;
  ypTnmNotice?: {
    title: string;
    warning: string;
    guidelineRef: string;
    recommendation: string;
  } | null;
  her2Category?: "positive" | "low" | "zero" | "unknown";
  her2LowNotice?: string | null;
  isKi67GrayZone?: boolean;
  ki67Notice?: string | null;

  // 胃癌专属质控与微创字段
  isEsdIndication?: boolean;
  isD2Adequate?: boolean;

  // 肝癌 CNLC 专属字段
  cnlcStage?: string;
  childPughScore?: number | null;
  childPughGrade?: string;
  albiGrade?: string;
  isMilanEligible?: boolean;

  // 食管癌专科字段
  subsite?: string;
  isFistulaRisk?: boolean;
  isLymphNodeAdequate?: boolean;
  sccElevated?: boolean;

  // 通用置信度、指南、预警与风险分层
  confidence?: string;
  evidenceLevel?: string;
  riskTier?: string;
  guidelines?: string[];
  warnings?: string[];

  // 专科策略、关键要素与预后评分
  description?: string;
  therapeuticStrategy?: string;
  keyFactors?: string[];
  riskFlags?: string[];
  guidelineStandard?: string;
  prognosticScore?: number;
}

export function normalizeCancerType(cancerType?: string | null, organ?: string | null): CancerType {
  const raw = (cancerType || organ || "").toLowerCase().trim();
  if (raw === "breast" || raw === "乳腺" || raw === "乳腺癌") return "breast";
  if (raw === "colon" || raw === "结肠" || raw === "结肠癌") return "colon";
  if (raw === "rectal" || raw === "rectum" || raw === "直肠" || raw === "直肠癌") return "rectal";
  if (raw === "gastric" || raw === "stomach" || raw === "胃" || raw === "胃癌") return "gastric";
  if (raw === "liver" || raw === "hcc" || raw === "hepatocellular" || raw === "肝" || raw === "肝癌") return "liver";
  if (raw === "esophageal" || raw === "escc" || raw === "esophagus" || raw === "食管" || raw === "食管癌" || raw === "食道癌") return "esophageal";
  if (raw === "thyroid" || raw === "甲状腺" || raw === "甲状腺癌") return "thyroid";
  if (raw === "colorectal" || raw === "结直肠" || raw === "结直肠癌") return "colorectal";
  if (raw === "endometrial" || raw === "子宫内膜" || raw === "子宫内膜癌" || raw === "子宫体癌" || raw === "uterine" || raw === "子宫" || raw === "子宫癌") return "endometrial";
  if (raw === "cervical" || raw === "cervix" || raw === "宫颈" || raw === "宫颈癌") return "cervical";
  if (raw === "pancreatic" || raw === "pancreas" || raw === "胰腺" || raw === "胰腺癌") return "pancreatic";
  if (CancerRegistry.has(raw)) return raw as CancerType;
  return "lung";
}

/**
 * 统一分期计算入口
 * 委托至 CancerRegistry 对应的癌种插件
 */
export function computeCancerStage(
  cancerType: CancerType | string | null | undefined,
  input: any
): UnifiedStagingResult {
  const normalizedType = normalizeCancerType(cancerType, input?.organ);
  const plugin = CancerRegistry.get(normalizedType);
  return plugin.staging.computeStage(input);
}

/**
 * 统一前瞻临床队列与五年生存率匹配计算入口
 * 彻底消除分期引擎跨癌种硬编码，通过插件分发
 */
export function getClinicalCohortUnified(profile: PatientProfile | any): ClinicalCohortResult {
  const normalizedType = normalizeCancerType(profile?.cancerType, profile?.organ);
  const plugin = CancerRegistry.get(normalizedType);
  return plugin.staging.getCohort(profile);
}

