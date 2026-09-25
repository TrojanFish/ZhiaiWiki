import type { CancerPluginSpec } from "../types";
import { 
  computeGastricStage, 
  getGastricClinicalCohort, 
  type GastricStagingInput 
} from "@/lib/gastricStaging";
import { 
  GASTRIC_TARGETED_DRUGS, 
  checkGastricDrugInteractions 
} from "@/lib/gastricDdiData";
import { GASTRIC_STUDIES } from "@/lib/gastricStudiesData";
import { GASTRIC_WIKI_TOPICS } from "@/lib/gastricWikiData";
import { GASTRIC_DRUG_POLICIES } from "@/lib/gastricReimbursementData";
import { GASTRIC_GRAPH_NODES, GASTRIC_EDGE_EVIDENCE } from "@/lib/gastricKnowledgeGraphData";

/**
 * 胃癌独立标准化系统插件 (Gastric Cancer Dedicated Plugin)
 * 核心特色：ESD 适应证判定、D2 根治淋巴结清扫质控 (>=16枚)、Lauren/Borrmann分型破恐、
 * HER2/Claudin 18.2/PD-L1 CPS 前沿靶向免疫、毕I/毕II/Roux-en-Y 吻合与倾倒综合征营养重塑
 */
export const gastricPlugin: CancerPluginSpec = {
  id: "gastric",
  name: "胃癌",
  enName: "Gastric Cancer",
  icon: "🥣",
  organ: "gastric",
  guidelineStandard: "CSCO 胃癌 2024 · 日本胃癌规约 JGCA · AJCC 8th · FLOT4 / SPOTLIGHT",
  theme: {
    primaryColor: "text-amber-600",
    badgeColor: "bg-white text-amber-600",
    bgColor: "bg-amber-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const gastricInput: GastricStagingInput = {
        tStage: input.tStage ?? rawData.tStage,
        nStage: input.nStage ?? rawData.nStage,
        mStage: input.mStage ?? rawData.mStage,
        tumorDepth: input.tumorDepth ?? rawData.tumorDepth,
        tumorSize: input.tumorSize ?? rawData.tumorSize,
        ulcerPresent: input.ulcerPresent ?? rawData.ulcerPresent,
        primaryLocation: input.primaryLocation ?? rawData.primaryLocation ?? "stomach",
        borrmannType: input.borrmannType ?? rawData.borrmannType,
        laurenClassification: input.laurenClassification ?? rawData.laurenClassification,
        histologyType: input.histologyType ?? rawData.histologyType,
        differentiation: input.differentiation ?? rawData.differentiation,
        lymphNodesExamined: input.lymphNodesExamined ?? rawData.lymphNodesExamined,
        lymphNodesPositive: input.lymphNodesPositive ?? rawData.lymphNodesPositive,
        peritonealCytology: input.peritonealCytology ?? rawData.peritonealCytology,
        hasDistantMets: input.hasDistantMets ?? rawData.hasDistantMets,
        metastasisSites: input.metastasisSites ?? rawData.metastasisSites,
        her2Status: input.her2Status ?? rawData.her2Status,
        claudin182Status: input.claudin182Status ?? rawData.claudin182Status,
        pdl1Cps: input.pdl1Cps ?? rawData.pdl1Cps,
        msiStatus: input.msiStatus ?? rawData.msiStatus,
        dmmrStatus: input.dmmrStatus ?? rawData.dmmrStatus,
        ebvStatus: input.ebvStatus ?? rawData.ebvStatus,
        neoadjuvantTherapy: input.neoadjuvantTherapy ?? rawData.neoadjuvantTherapy,
        pcrStatus: input.pcrStatus ?? rawData.pcrStatus,
        gastrectomyType: input.gastrectomyType ?? rawData.gastrectomyType,
        reconstructionType: input.reconstructionType ?? rawData.reconstructionType,
        dumpingSyndromeGrade: input.dumpingSyndromeGrade ?? rawData.dumpingSyndromeGrade,
        organ: "gastric",
      };

      return computeGastricStage(gastricInput);
    },
    getCohort: (profile: any) => getGastricClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: GASTRIC_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => 
      checkGastricDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "zolbetuximab",
  },
  content: {
    featuredStudies: GASTRIC_STUDIES,
    graphNodes: GASTRIC_GRAPH_NODES,
    edgeEvidences: GASTRIC_EDGE_EVIDENCE,
    wikiTopics: GASTRIC_WIKI_TOPICS,
    drugPolicies: GASTRIC_DRUG_POLICIES,
  },
};
