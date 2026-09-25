import type { CancerPluginSpec } from "../types";
import { 
  computeEsophagealStage, 
  computeEsophagealClinicalCohort, 
  type EsophagealStagingInput 
} from "@/lib/esophagealStaging";
import { 
  ESOPHAGEAL_TARGETED_DRUGS, 
  checkEsophagealDrugInteractions 
} from "@/lib/esophagealDdiData";
import { ESOPHAGEAL_STUDIES } from "@/lib/esophagealStudiesData";
import { ESOPHAGEAL_WIKI_TOPICS } from "@/lib/esophagealWikiData";
import { ESOPHAGEAL_DRUG_POLICIES } from "@/lib/esophagealReimbursementData";
import { ESOPHAGEAL_GRAPH_NODES, ESOPHAGEAL_EDGE_EVIDENCE } from "@/lib/esophagealKnowledgeGraphData";

/**
 * 食管癌/食管鳞癌 (ESCC) 独立标准化系统插件 (Esophageal Cancer Dedicated Plugin)
 * 核心特色：AJCC 第 8 版食管鳞癌专属分期 (解剖分段 subsite + 组织分化 grade 协同)、
 * 外科与病理质控 (≥15 枚淋巴结清扫红线、二野 vs 三野清扫)、
 * 局部进展期新辅助放化疗 (中国原研 NEOCRTEC5010、CROSS、术后辅助 CheckMate-577)、
 * 晚期一线免疫联合化疗 (卡瑞利珠单抗 ESCORT-1st / 替雷利珠单抗 RATIONALE-306 / JUPITER-06)、
 * 气管食管瘘 (TEF) 穿孔与主动脉受侵破裂致命警报、鳞癌血清双骄 (SCC + CYFRA21-1)
 */
export const esophagealPlugin: CancerPluginSpec = {
  id: "esophageal",
  name: "食管癌",
  enName: "Esophageal Cancer",
  icon: "🥢",
  organ: "esophagus",
  guidelineStandard: "AJCC 8th ESCC · CSCO 食管癌 2024 · NEOCRTEC5010 · ESCORT-1st / RATIONALE-306",
  theme: {
    primaryColor: "text-purple-600",
    badgeColor: "bg-white text-purple-600",
    bgColor: "bg-purple-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const esccInput: EsophagealStagingInput = {
        subsite: input.subsite ?? rawData.subsite,
        tumorLocation: input.tumorLocation ?? rawData.tumorLocation,
        incisorDistanceCm: input.incisorDistanceCm ?? rawData.incisorDistanceCm,
        histologyType: input.histologyType ?? rawData.histologyType,
        differentiation: input.differentiation ?? rawData.differentiation,
        tumorDepth: input.tumorDepth ?? rawData.tumorDepth,
        tumorLengthCm: input.tumorLengthCm ?? rawData.tumorLengthCm,
        airwayInvasionRisk: input.airwayInvasionRisk ?? rawData.airwayInvasionRisk,
        aorticInvasionRisk: input.aorticInvasionRisk ?? rawData.aorticInvasionRisk,
        recurrentLaryngealNerveInvasion: input.recurrentLaryngealNerveInvasion ?? rawData.recurrentLaryngealNerveInvasion,
        lymphNodesExamined: input.lymphNodesExamined ?? rawData.lymphNodesExamined,
        lymphNodesPositive: input.lymphNodesPositive ?? rawData.lymphNodesPositive,
        lymphNodeField: input.lymphNodeField ?? rawData.lymphNodeField,
        supraclavicularNodePositive: input.supraclavicularNodePositive ?? rawData.supraclavicularNodePositive,
        celiacNodePositive: input.celiacNodePositive ?? rawData.celiacNodePositive,
        hasDistantMets: input.hasDistantMets ?? rawData.hasDistantMets,
        metastasisSites: input.metastasisSites ?? rawData.metastasisSites,
        pdl1Cps: input.pdl1Cps ?? rawData.pdl1Cps,
        pdl1Tap: input.pdl1Tap ?? rawData.pdl1Tap,
        msiStatus: input.msiStatus ?? rawData.msiStatus,
        sccAntigen: input.sccAntigen ?? rawData.sccAntigen,
        cyfra211: input.cyfra211 ?? rawData.cyfra211,
        ceaBaseline: input.ceaBaseline ?? rawData.ceaBaseline,
        anastomoticStatus: input.anastomoticStatus ?? rawData.anastomoticStatus,
        pcrStatus: input.pcrStatus ?? rawData.pcrStatus,
        neoadjuvantTherapy: input.neoadjuvantTherapy ?? rawData.neoadjuvantTherapy,
        tStage: input.tStage ?? rawData.tStage,
        nStage: input.nStage ?? rawData.nStage,
        mStage: input.mStage ?? rawData.mStage,
      };

      return computeEsophagealStage(esccInput);
    },
    getCohort: (profile: any) => computeEsophagealClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: ESOPHAGEAL_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => checkEsophagealDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "camrelizumab",
  },
  content: {
    featuredStudies: ESOPHAGEAL_STUDIES,
    graphNodes: ESOPHAGEAL_GRAPH_NODES,
    edgeEvidences: ESOPHAGEAL_EDGE_EVIDENCE,
    wikiTopics: ESOPHAGEAL_WIKI_TOPICS,
    drugPolicies: ESOPHAGEAL_DRUG_POLICIES,
  },
};
