import type { CancerPluginSpec } from "../types";
import { 
  computeThyroidStage, 
  computeThyroidClinicalCohort, 
  type ThyroidStagingInput 
} from "@/lib/thyroidStaging";
import { 
  THYROID_TARGETED_DRUGS, 
  checkThyroidDrugInteractions 
} from "@/lib/thyroidDdiData";
import { THYROID_STUDIES } from "@/lib/thyroidStudiesData";
import { THYROID_WIKI_TOPICS } from "@/lib/thyroidWikiData";
import { THYROID_DRUG_POLICIES } from "@/lib/thyroidReimbursementData";
import { THYROID_GRAPH_NODES, THYROID_EDGE_EVIDENCE } from "@/lib/thyroidKnowledgeGraphData";

/**
 * 甲状腺癌 (Thyroid Cancer) 独立标准化系统插件 (Thyroid Dedicated Plugin)
 * 核心特色：AJCC 第 8 版以 55 岁为切点的年龄保护与特异性分期、
 * 超声 C-TIRADS 1~5 类恶性风险与 FNA 穿刺评估、
 * 外科术式与质控 (腺叶+峡部切除 vs 全切、中央区 VI 区 vs 颈侧区 II-V 区清扫)、
 * 喉返神经保护 (IONM) 与甲状旁腺低钙抽搐救治、
 * 优甲乐 (L-T4) 晨起空腹顿服与钙/铁/豆奶 4 小时隔离法则、
 * ATA 2015 术后动态复发风险分层与 TSH 抑制治疗窗口、
 * 碘-131 (RAI) 清甲清灶与低碘饮食、RAIR-DTC 碘难治判定与 RET/TKI 靶向、
 * 血清标志物特异双雄 (Tg + TgAb 抗体联动、降钙素 Calcitonin)
 */
export const thyroidPlugin: CancerPluginSpec = {
  id: "thyroid",
  name: "甲状腺癌",
  enName: "Thyroid Cancer",
  icon: "🦋",
  organ: "thyroid",
  guidelineStandard: "AJCC 8th (55岁切点) · 2015 ATA 指南 · CSCO 甲状腺癌 2024 · C-TIRADS 2020",
  theme: {
    primaryColor: "text-rose-600",
    badgeColor: "bg-white text-rose-600",
    bgColor: "bg-rose-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const thyroidInput: ThyroidStagingInput = {
        patientAge: input.patientAge ?? input.age ?? rawData.patientAge ?? rawData.age ?? 45,
        histologyType: input.histologyType ?? rawData.histologyType ?? "PTC_classic",
        tumorSize: input.tumorSize ?? rawData.tumorSize,
        tStage: input.tStage ?? rawData.tStage,
        nStage: input.nStage ?? rawData.nStage,
        mStage: input.mStage ?? rawData.mStage,
        extrathyroidalExtension: input.extrathyroidalExtension ?? rawData.extrathyroidalExtension,
        centralNodesPositive: input.centralNodesPositive ?? rawData.centralNodesPositive,
        lateralNodesPositive: input.lateralNodesPositive ?? rawData.lateralNodesPositive,
        hasDistantMets: input.hasDistantMets ?? rawData.hasDistantMets,
        metastasisSites: input.metastasisSites ?? rawData.metastasisSites,
        ultrasoundTirads: input.ultrasoundTirads ?? rawData.ultrasoundTirads,
        aspectRatioGtOne: input.aspectRatioGtOne ?? rawData.aspectRatioGtOne,
        microcalcifications: input.microcalcifications ?? rawData.microcalcifications,
        hypoechoic: input.hypoechoic ?? rawData.hypoechoic,
        irregularMargin: input.irregularMargin ?? rawData.irregularMargin,
        extrathyroidalUltrasound: input.extrathyroidalUltrasound ?? rawData.extrathyroidalUltrasound,
        brafV600e: input.brafV600e ?? rawData.brafV600e,
        tertPromoter: input.tertPromoter ?? rawData.tertPromoter,
        retAlteration: input.retAlteration ?? rawData.retAlteration,
        tgLevel: input.tgLevel ?? rawData.tgLevel,
        tgAbLevel: input.tgAbLevel ?? rawData.tgAbLevel,
        calcitoninLevel: input.calcitoninLevel ?? rawData.calcitoninLevel,
        surgicalMethod: input.surgicalMethod ?? rawData.surgicalMethod,
      };

      return computeThyroidStage(thyroidInput);
    },
    getCohort: (profile: any) => computeThyroidClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: THYROID_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => 
      checkThyroidDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "levothyroxine",
  },
  content: {
    featuredStudies: THYROID_STUDIES,
    graphNodes: THYROID_GRAPH_NODES,
    edgeEvidences: THYROID_EDGE_EVIDENCE,
    wikiTopics: THYROID_WIKI_TOPICS,
    drugPolicies: THYROID_DRUG_POLICIES,
  },
};
