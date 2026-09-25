import type { CancerPluginSpec } from "../types";
import { 
  computeColonStage, 
  getColonClinicalCohort, 
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
import { COLON_WIKI_TOPICS } from "@/lib/colonWikiData";
import { COLORECTAL_DRUG_POLICIES } from "@/lib/colorectalReimbursementData";

/**
 * 结肠癌独立标准化系统插件 (Colon Cancer Dedicated Plugin)
 * 核心特色：CME 完整结肠系膜切除、左右半结肠靶向分流、淋巴结质控 >= 12 枚、IDEA 3 个月 CAPOX 减毒
 */
export const colonPlugin: CancerPluginSpec = {
  id: "colon",
  name: "结肠癌",
  enName: "Colon Cancer",
  icon: "🌿",
  organ: "colon",
  guidelineStandard: "CSCO 结肠癌 2024 · AJCC 8th · IDEA 协作组",
  theme: {
    primaryColor: "text-emerald-600",
    badgeColor: "bg-white text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const colonInput: ColorectalStagingInput = {
        tStage: input.tStage ?? rawData.tStage,
        nStage: input.nStage ?? rawData.nStage,
        mStage: input.mStage ?? rawData.mStage,
        tumorDepth: input.tumorDepth ?? rawData.tumorDepth,
        primaryLocation: input.primaryLocation ?? rawData.primaryLocation ?? "colon",
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
        emviStatus: input.emviStatus ?? rawData.emviStatus,
        neoadjuvantTherapy: input.neoadjuvantTherapy ?? rawData.neoadjuvantTherapy,
        pcrStatus: input.pcrStatus ?? rawData.pcrStatus,
        bowelObstruction: input.bowelObstruction ?? rawData.bowelObstruction,
        bowelPerforation: input.bowelPerforation ?? rawData.bowelPerforation,
        differentiation: input.differentiation ?? rawData.differentiation,
        histologyType: input.histologyType ?? rawData.histologyType,
        organ: "colon",
      };

      return computeColonStage(colonInput);
    },
    getCohort: (profile: any) => getColonClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: COLORECTAL_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => 
      checkColorectalDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "cetuximab",
  },
  content: {
    featuredStudies: COLORECTAL_STUDIES.filter(s => !["rapido_2021", "prospect_2023"].includes(s.id)),
    graphNodes: COLORECTAL_GRAPH_NODES,
    edgeEvidences: COLORECTAL_EDGE_EVIDENCE,
    wikiTopics: COLON_WIKI_TOPICS,
    drugPolicies: COLORECTAL_DRUG_POLICIES,
  },
};
