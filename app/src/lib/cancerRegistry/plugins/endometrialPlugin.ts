import type { CancerPluginSpec } from "../types";
import { 
  computeEndometrialStage, 
  computeEndometrialClinicalCohort, 
  type EndometrialStagingInput 
} from "@/lib/endometrialStaging";
import { 
  ENDOMETRIAL_TARGETED_DRUGS, 
  checkEndometrialDrugInteractions 
} from "@/lib/endometrialDdiData";
import { ENDOMETRIAL_STUDIES } from "@/lib/endometrialStudiesData";
import { ENDOMETRIAL_WIKI_TOPICS } from "@/lib/endometrialWikiData";
import { ENDOMETRIAL_DRUG_POLICIES } from "@/lib/endometrialReimbursementData";
import { ENDOMETRIAL_GRAPH_NODES, ENDOMETRIAL_EDGE_EVIDENCE } from "@/lib/gynecologicalKnowledgeGraphData";

/**
 * 子宫内膜癌 (Endometrial Cancer - EC) 独立标准化系统插件
 * 核心特色：FIGO 2023 四大分子生物学分型 (POLEmut / MMRd / NSMP / p53abn) 决策树、
 * POLE 超突变降阶梯免除放化疗 (PORTEC-4a)、p53 异常型升期强化放化联合 (PORTEC-3)、
 * 年轻育龄女性大剂量孕激素 (MA/MPA/曼月乐) 保留生育功能逆转与随访时序、
 * 错配修复缺失 (dMMR) 与 Lynch 综合征遗传筛查
 */
export const endometrialPlugin: CancerPluginSpec = {
  id: "endometrial",
  name: "子宫内膜癌",
  enName: "Endometrial Cancer",
  icon: "🌸",
  organ: "endometrial",
  guidelineStandard: "FIGO 2023 分子分型 · AJCC 第 9 版 · CSCO 妇科肿瘤 2024 · NCCN 2024",
  theme: {
    primaryColor: "text-rose-600",
    badgeColor: "bg-white text-rose-600",
    bgColor: "bg-rose-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const ecInput: EndometrialStagingInput = {
        histologyType: input.histologyType ?? rawData.histologyType ?? "endometrioid_G1",
        differentiation: input.differentiation ?? rawData.differentiation,
        tumorSize: input.tumorSize ?? rawData.tumorSize,
        patientAge: input.patientAge ?? input.age ?? rawData.patientAge ?? rawData.age ?? 55,
        tStage: input.tStage ?? rawData.tStage,
        nStage: input.nStage ?? rawData.nStage,
        mStage: input.mStage ?? rawData.mStage,
        molecularSubtype: input.molecularSubtype ?? rawData.molecularSubtype,
        poleMutationStatus: input.poleMutationStatus ?? rawData.poleMutationStatus,
        mmrStatus: input.mmrStatus ?? rawData.mmrStatus,
        msiStatus: input.msiStatus ?? rawData.msiStatus,
        p53Status: input.p53Status ?? rawData.p53Status,
        myometrialInvasion: input.myometrialInvasion ?? rawData.myometrialInvasion,
        myometrialDepthPercent: input.myometrialDepthPercent ?? rawData.myometrialDepthPercent,
        lvsiStatus: input.lvsiStatus ?? rawData.lvsiStatus,
        cervicalInvolvement: input.cervicalInvolvement ?? rawData.cervicalInvolvement,
        serosaAdnexaInvolvement: input.serosaAdnexaInvolvement ?? rawData.serosaAdnexaInvolvement,
        vaginalParametrialInvolvement: input.vaginalParametrialInvolvement ?? rawData.vaginalParametrialInvolvement,
        pelvicNodesPositive: input.pelvicNodesPositive ?? rawData.pelvicNodesPositive,
        paraAorticNodesPositive: input.paraAorticNodesPositive ?? rawData.paraAorticNodesPositive,
        hasDistantMets: input.hasDistantMets ?? rawData.hasDistantMets,
        metastasisSites: input.metastasisSites ?? rawData.metastasisSites,
        fertilityPreservationDesired: input.fertilityPreservationDesired ?? rawData.fertilityPreservationDesired,
      };

      return computeEndometrialStage(ecInput);
    },
    getCohort: (profile: any) => computeEndometrialClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: ENDOMETRIAL_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => 
      checkEndometrialDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "megestrol_acetate",
  },
  content: {
    featuredStudies: ENDOMETRIAL_STUDIES,
    graphNodes: ENDOMETRIAL_GRAPH_NODES,
    edgeEvidences: ENDOMETRIAL_EDGE_EVIDENCE,
    wikiTopics: ENDOMETRIAL_WIKI_TOPICS,
    drugPolicies: ENDOMETRIAL_DRUG_POLICIES,
  },
};
