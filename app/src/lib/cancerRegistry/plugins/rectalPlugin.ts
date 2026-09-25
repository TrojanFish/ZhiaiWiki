import type { CancerPluginSpec } from "../types";
import { 
  computeRectalStage, 
  getRectalClinicalCohort, 
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
import { RECTAL_WIKI_TOPICS } from "@/lib/rectalWikiData";
import { COLORECTAL_DRUG_POLICIES } from "@/lib/colorectalReimbursementData";

/**
 * 直肠癌独立标准化系统插件 (Rectal Cancer Dedicated Plugin)
 * 核心特色：TME 全直肠系膜切除、骨盆高分辨率薄层 HR-MRI、CRM 环周切缘评估、
 * 距肛门保肛决策 (ISR vs Miles)、RAPIDO/PRODIGE 23 全程新辅助 (TNT)、
 * cCR 观察等待 (Watch & Wait) 器官保留、保护性回肠造口与术后 LARS 排便综合征康复
 */
export const rectalPlugin: CancerPluginSpec = {
  id: "rectal",
  name: "直肠癌",
  enName: "Rectal Cancer",
  icon: "🍃",
  organ: "rectal",
  guidelineStandard: "CSCO 直肠癌 2024 · AJCC 8th · RAPIDO/PRODIGE 23 TNT · TME",
  theme: {
    primaryColor: "text-teal-700",
    badgeColor: "bg-white text-teal-700",
    bgColor: "bg-teal-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const rectalInput: ColorectalStagingInput = {
        tStage: input.tStage ?? rawData.tStage,
        nStage: input.nStage ?? rawData.nStage,
        mStage: input.mStage ?? rawData.mStage,
        tumorDepth: input.tumorDepth ?? rawData.tumorDepth,
        primaryLocation: "rectum",
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
        organ: "rectal",
      };

      return computeRectalStage(rectalInput);
    },
    getCohort: (profile: any) => getRectalClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: COLORECTAL_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => 
      checkColorectalDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "bevacizumab",
  },
  content: {
    featuredStudies: COLORECTAL_STUDIES.filter(s => 
      ["rapido_2021", "prospect_2023", "keynote177_2020", "fresco2_2023", "destiny_crc01_2022", "recourse_2015"].includes(s.id)
    ),
    graphNodes: COLORECTAL_GRAPH_NODES,
    edgeEvidences: COLORECTAL_EDGE_EVIDENCE,
    wikiTopics: RECTAL_WIKI_TOPICS,
    drugPolicies: COLORECTAL_DRUG_POLICIES,
  },
};
