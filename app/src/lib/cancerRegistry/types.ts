import type { CancerType, PatientProfile } from "@/lib/types";
import type { UnifiedStagingResult } from "@/lib/stagingRegistry";
import type { ClinicalCohortResult } from "@/lib/staging";
import type { TargetedDrugItem, DdiAnalysisResult } from "@/lib/ddiData";

export interface CancerTypeOption {
  type: CancerType;
  label: string;
  icon: string;
  activeColor: string;
  title: string;
  enName?: string;
  organ?: string;
}

/**
 * 标准癌种插件规范契约接口 (Cancer Plugin Specification)
 * 任何新接入的癌种只需实现该规范即可无缝插入系统
 */
export interface CancerPluginSpec<_TSpecificData = any, TStagingInput = any> {
  // 1. 基础元数据
  id: CancerType;
  name: string;             // 如 "肺癌" / "乳腺癌"
  enName: string;           // 如 "Lung Cancer" / "Breast Cancer"
  icon: string;             // 如 "🫁" / "🎗️"
  organ: string;            // 如 "lung" / "breast"
  guidelineStandard: string;// 如 "IASLC 第 9 版 / AJCC 第 9 版"
  theme: {
    primaryColor: string;
    badgeColor: string;
    bgColor: string;
  };

  // 2. 确定性分期引擎与队列契约
  staging: {
    computeStage: (input: TStagingInput) => UnifiedStagingResult;
    getCohort: (profile: PatientProfile | any) => ClinicalCohortResult;
  };

  // 3. 药学与 DDI 契约
  pharmacology: {
    targetedDrugs: TargetedDrugItem[];
    checkInteractions: (targetId: string, chronicIds: string[]) => DdiAnalysisResult;
    defaultTargetDrugId: string;
  };

  // 4. 循证资源与内容预置
  content?: {
    featuredStudies?: any[];
    graphNodes?: any[];
    edgeEvidences?: Record<string, any>;
    wikiTopics?: any[];
    drugPolicies?: any[];
  };
}
