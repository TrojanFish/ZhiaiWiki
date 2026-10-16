import type { CancerPluginSpec } from "../types";
import { computeBreastClinicalStage, getBreastClinicalCohort, type BreastStagingInput, type BreastStagingResult } from "@/lib/breastStaging";
import { BREAST_TARGETED_DRUGS, checkBreastDrugInteractions } from "@/lib/breastDdiData";
import { BREAST_STUDIES } from "@/lib/breastStudiesData";
import { BREAST_GRAPH_NODES, BREAST_EDGE_EVIDENCE_MAP } from "@/lib/breastKnowledgeGraphData";
import { BREAST_WIKI_TOPICS } from "@/lib/breastWikiData";
import { BREAST_DRUG_POLICIES } from "@/lib/breastReimbursementData";

/**
 * 乳腺癌标准化系统插件 (Breast Cancer Standard Plugin)
 * 封装 AJCC 8/9th 双轨分期、St. Gallen 分型、HER2-Low、ypTNM、14 大靶向药及前瞻队列
 */
export const breastPlugin: CancerPluginSpec = {
  id: "breast",
  name: "乳腺癌",
  enName: "Breast Cancer",
  icon: "🎗️",
  organ: "breast",
  guidelineStandard: "AJCC 第 8/9 版 · St. Gallen 国际共识",
  theme: {
    primaryColor: "text-pink-600",
    badgeColor: "bg-white text-pink-600",
    bgColor: "bg-pink-50",
  },
  staging: {
    computeStage: (input: any) => {
      const breastInput: BreastStagingInput = {
        tumorSize: input.tumorSize ?? input.pathologyTumorSize,
        tStage: input.tStage,
        nStage: input.nStage ?? input.lymphNodes,
        mStage: input.mStage,
        erStatus: input.erStatus,
        erPercent: input.erPercent,
        prStatus: input.prStatus,
        prPercent: input.prPercent,
        her2Status: input.her2Status,
        her2Fish: input.her2Fish,
        her2Low: input.her2Low,
        ki67: input.ki67,
        grade: input.nottinghamGrade ?? input.grade,
        histologyType: input.histologyType,
        oncotypeDxScore: input.oncotypeDxScore,
        brca1: input.brca1,
        brca2: input.brca2,
        menopauseStatus: input.menopauseStatus,
        age: input.age != null ? Number(input.age) : null,
        ofsStatus: input.ofsStatus ?? input.cancerSpecificData?.ofsStatus,
        ofsDrug: input.ofsDrug ?? input.cancerSpecificData?.ofsDrug,
        endocrineOrganProtection: input.endocrineOrganProtection ?? input.cancerSpecificData?.endocrineOrganProtection,
        sentinelNodesPositive: input.sentinelNodesPositive,
        sentinelNodesTotal: input.sentinelNodesTotal,
        axillaryNodesPositive: input.axillaryNodesPositive,
        axillaryNodesTotal: input.axillaryNodesTotal,
        micrometastasisOnly: input.micrometastasisOnly,
        neoadjuvantChemo: input.neoadjuvantChemo ?? input.cancerSpecificData?.neoadjuvantChemo,
        pcrStatus: input.pcrStatus ?? input.cancerSpecificData?.pcrStatus,
      };

      const res: BreastStagingResult = computeBreastClinicalStage(breastInput);

      return {
        cancerType: "breast",
        stage: res.stage,
        tStage: res.tStage,
        nStage: res.nStage,
        mStage: res.mStage,
        prognosticStage: res.prognosticStage,
        anatomicalStage: res.anatomicalStage,
        molecularSubtype: res.molecularSubtype,
        molecularSubtypeLabel: res.molecularSubtypeLabel,
        explanation: res.explanation,
        treatmentDirection: res.treatmentDirection,
        isDownstagedByGenomics: res.isDownstagedByGenomics,
        versionNotice: res.prognosticNote,
        isNeoadjuvant: res.isNeoadjuvant,
        ypTnmNotice: res.ypTnmNotice,
        her2Category: res.her2Category,
        her2LowNotice: res.her2LowNotice,
        isKi67GrayZone: res.isKi67GrayZone,
        ki67Notice: res.ki67Notice,
        ofsNotice: res.ofsNotice,
        organProtectionNotice: res.organProtectionNotice,
      };
    },
    getCohort: (profile: any) => getBreastClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: BREAST_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => checkBreastDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "tamoxifen",
  },
  content: {
    featuredStudies: BREAST_STUDIES,
    graphNodes: BREAST_GRAPH_NODES,
    edgeEvidences: BREAST_EDGE_EVIDENCE_MAP,
    wikiTopics: BREAST_WIKI_TOPICS,
    drugPolicies: BREAST_DRUG_POLICIES,
  },
};
