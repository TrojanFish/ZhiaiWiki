import type { CancerPluginSpec } from "../types";
import { 
  computeColorectalStage, 
  getColorectalClinicalCohort, 
  type ColorectalStagingInput 
} from "@/lib/colorectalStaging";
import { 
  COLORECTAL_TARGETED_DRUGS, 
  checkColorectalDrugInteractions 
} from "@/lib/colorectalDdiData";
import { COLORECTAL_STUDIES } from "@/lib/colorectalStudiesData";
import { 
  COLORECTAL_GRAPH_NODES, 
  COLORECTAL_EDGE_EVIDENCE 
} from "@/lib/colorectalKnowledgeGraphData";
import { COLORECTAL_WIKI_TOPICS } from "@/lib/colorectalWikiData";
import { COLORECTAL_DRUG_POLICIES } from "@/lib/colorectalReimbursementData";

/**
 * 结直肠癌标准化系统插件 (Colorectal Cancer Standard Plugin)
 * 封装 AJCC 第 8 版 TNM 分期引擎、IDEA 协作组减毒队列推演、15 大靶向药物 DDI、4D 因果图谱与医保政策
 */
export const colorectalPlugin: CancerPluginSpec = {
  id: "colorectal",
  name: "结直肠癌",
  enName: "Colorectal Cancer",
  icon: "🔵",
  organ: "colorectal",
  guidelineStandard: "CSCO / NCCN 2024 · AJCC 8th · IDEA 协作组",
  theme: {
    primaryColor: "text-emerald-600",
    badgeColor: "bg-white text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const crcInput: ColorectalStagingInput = {
        tStage: input.tStage ?? rawData.tStage,
        nStage: input.nStage ?? rawData.nStage,
        mStage: input.mStage ?? rawData.mStage,
        tumorDepth: input.tumorDepth ?? rawData.tumorDepth,
        primaryLocation: input.primaryLocation ?? rawData.primaryLocation,
        distanceFromAnalVerge: input.distanceFromAnalVerge ?? rawData.distanceFromAnalVerge,
        lymphNodesExamined: input.lymphNodesExamined ?? rawData.lymphNodesExamined,
        lymphNodesPositive: input.lymphNodesPositive ?? rawData.lymphNodesPositive,
        tumorDeposits: input.tumorDeposits ?? rawData.tumorDeposits,
        hasDistantMets: input.hasDistantMets ?? rawData.hasDistantMets,
        metastasisSites: input.metastasisSites ?? rawData.metastasisSites,
        peritonealMets: input.peritonealMets ?? rawData.peritonealMets,
        msiStatus: input.msiStatus ?? rawData.msiStatus,
        dmmrStatus: input.dmmrStatus ?? rawData.dmmrStatus,
        krasMutation: input.krasMutation ?? rawData.krasMutation,
        nrasMutation: input.nrasMutation ?? rawData.nrasMutation,
        brafMutation: input.brafMutation ?? rawData.brafMutation,
        her2Amplified: input.her2Amplified ?? rawData.her2Amplified,
        crmStatus: input.crmStatus ?? rawData.crmStatus,
        crmDistance: input.crmDistance ?? rawData.crmDistance,
        emviStatus: input.emviStatus ?? rawData.emviStatus,
        neoadjuvantTherapy: input.neoadjuvantTherapy ?? rawData.neoadjuvantTherapy,
        pcrStatus: input.pcrStatus ?? rawData.pcrStatus,
        bowelObstruction: input.bowelObstruction ?? rawData.bowelObstruction,
        bowelPerforation: input.bowelPerforation ?? rawData.bowelPerforation,
        differentiation: input.differentiation ?? rawData.differentiation,
        histologyType: input.histologyType ?? rawData.histologyType,
        organ: input.organ ?? rawData.organ,
      };

      return computeColorectalStage(crcInput);
    },
    getCohort: (profile: any) => getColorectalClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: COLORECTAL_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => 
      checkColorectalDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "cetuximab",
  },
  content: {
    featuredStudies: COLORECTAL_STUDIES,
    graphNodes: COLORECTAL_GRAPH_NODES,
    edgeEvidences: COLORECTAL_EDGE_EVIDENCE,
    wikiTopics: COLORECTAL_WIKI_TOPICS,
    drugPolicies: COLORECTAL_DRUG_POLICIES,
  },
};
