/**
 * 药理学与药物相互作用 (DDI) 统一调度中心
 * 基于 CancerRegistry 插件，解耦不同癌种的靶向药物库与相互作用分析引擎
 */

import { CancerRegistry } from "./cancerRegistry";
import type { CancerType } from "./types";
import type { TargetedDrugItem, DdiAnalysisResult } from "./ddiData";
import { CHRONIC_DRUG_CATEGORIES, ALL_CHRONIC_DRUGS } from "./ddiData";

export type { TargetedDrugItem, DdiAnalysisResult };
export { CHRONIC_DRUG_CATEGORIES, ALL_CHRONIC_DRUGS };

/**
 * 获取指定癌种的靶向药物列表
 * 若未指定或传入无效癌种，默认回退至肺癌靶向药
 */
export function getTargetedDrugsForCancer(cancerType?: CancerType | string | null): TargetedDrugItem[] {
  const plugin = CancerRegistry.get(cancerType);
  return plugin.pharmacology.targetedDrugs;
}

/**
 * 统一药物相互作用 (DDI) 分析计算入口
 * 优先依据显式 cancerType 调度；若未指定则遍历已注册插件匹配靶向药归属
 */
export function checkDrugInteractionsUnified(
  cancerTypeOrOptions: CancerType | string | null | undefined | { cancerType?: string | null; targetedDrugId: string; chronicDrugIds: string[] },
  targetId?: string,
  chronicIds: string[] = []
): DdiAnalysisResult {
  let cancerType: CancerType | string | null | undefined;
  let actualTargetId: string;
  let actualChronicIds: string[];

  if (typeof cancerTypeOrOptions === "object" && cancerTypeOrOptions !== null && "targetedDrugId" in cancerTypeOrOptions) {
    cancerType = cancerTypeOrOptions.cancerType;
    actualTargetId = cancerTypeOrOptions.targetedDrugId;
    actualChronicIds = cancerTypeOrOptions.chronicDrugIds || [];
  } else {
    cancerType = cancerTypeOrOptions;
    actualTargetId = targetId || "";
    actualChronicIds = chronicIds || [];
  }

  // 1. 若显式指定已知癌种，直接通过插件检测
  if (cancerType && CancerRegistry.has(cancerType)) {
    return CancerRegistry.get(cancerType).pharmacology.checkInteractions(actualTargetId, actualChronicIds);
  }

  // 2. 若未显式指定，遍历所有已注册插件寻找该靶向药归属
  for (const plugin of CancerRegistry.getAll()) {
    if (plugin.pharmacology.targetedDrugs.some((d) => d.id === actualTargetId)) {
      return plugin.pharmacology.checkInteractions(actualTargetId, actualChronicIds);
    }
  }

  // 3. 兜底默认回退
  return CancerRegistry.get("lung").pharmacology.checkInteractions(actualTargetId, actualChronicIds);
}

/**
 * 获取指定癌种的默认选中靶向药 ID
 */
export function getDefaultTargetDrugId(cancerType?: CancerType | string | null): string {
  const plugin = CancerRegistry.get(cancerType);
  return plugin.pharmacology.defaultTargetDrugId;
}
