import type { CancerPluginSpec } from "../types";
import { 
  computeCervicalStage, 
  computeCervicalClinicalCohort, 
  type CervicalStagingInput 
} from "@/lib/cervicalStaging";
import { 
  CERVICAL_TARGETED_DRUGS, 
  checkCervicalDrugInteractions 
} from "@/lib/cervicalDdiData";
import { CERVICAL_STUDIES } from "@/lib/cervicalStudiesData";
import { CERVICAL_WIKI_TOPICS } from "@/lib/cervicalWikiData";
import { CERVICAL_DRUG_POLICIES } from "@/lib/cervicalReimbursementData";
import { CERVICAL_GRAPH_NODES, CERVICAL_EDGE_EVIDENCE } from "@/lib/gynecologicalKnowledgeGraphData";

/**
 * 宫颈癌 (Cervical Cancer - CC) 独立标准化系统插件
 * 核心特色：FIGO 2018 影像与病理结合分期体系 (含 IIIC1/IIIC2 淋巴结升期)、
 * 局部进展期 (IB3/IIA2/IIB~IVA) 根治性同步放化疗 (CCRT) + MRI 引导后装放疗绝对金标准、
 * 早期微浸润 (IA1/IA2) 宫颈锥切 (CKC/LEEP) 切缘质控与保生育广泛宫颈切除术 (Trachelectomy)、
 * LACC 试验开腹根治金标准警示、晚期 KEYNOTE-826 帕博利珠单抗+化疗+抗血管联合
 */
export const cervicalPlugin: CancerPluginSpec = {
  id: "cervical",
  name: "宫颈癌",
  enName: "Cervical Cancer",
  icon: "🌺",
  organ: "cervical",
  guidelineStandard: "FIGO 2018 分期标准 · AJCC 第 9 版 · CSCO 宫颈癌 2024 · NCCN 2024",
  theme: {
    primaryColor: "text-fuchsia-600",
    badgeColor: "bg-white text-fuchsia-600",
    bgColor: "bg-fuchsia-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const ccInput: CervicalStagingInput = {
        histologyType: input.histologyType ?? rawData.histologyType ?? "squamous_cell",
        differentiation: input.differentiation ?? rawData.differentiation,
        tumorSize: input.tumorSize ?? rawData.tumorSize,
        stromalInvasionMm: input.stromalInvasionMm ?? rawData.stromalInvasionMm,
        horizontalSpreadMm: input.horizontalSpreadMm ?? rawData.horizontalSpreadMm,
        tStage: input.tStage ?? rawData.tStage,
        nStage: input.nStage ?? rawData.nStage,
        mStage: input.mStage ?? rawData.mStage,
        vaginalInvolvement: input.vaginalInvolvement ?? rawData.vaginalInvolvement,
        parametrialInvasion: input.parametrialInvasion ?? rawData.parametrialInvasion,
        pelvicSidewallOrHydronephrosis: input.pelvicSidewallOrHydronephrosis ?? rawData.pelvicSidewallOrHydronephrosis,
        pelvicNodesPositive: input.pelvicNodesPositive ?? rawData.pelvicNodesPositive,
        paraAorticNodesPositive: input.paraAorticNodesPositive ?? rawData.paraAorticNodesPositive,
        nodalStagingMethod: input.nodalStagingMethod ?? rawData.nodalStagingMethod,
        bladderRectalMucosaInvasion: input.bladderRectalMucosaInvasion ?? rawData.bladderRectalMucosaInvasion,
        hasDistantMets: input.hasDistantMets ?? rawData.hasDistantMets,
        metastasisSites: input.metastasisSites ?? rawData.metastasisSites,
        coneMarginStatus: input.coneMarginStatus ?? rawData.coneMarginStatus,
        surgicalMethod: input.surgicalMethod ?? rawData.surgicalMethod,
        fertilityPreservationDesired: input.fertilityPreservationDesired ?? rawData.fertilityPreservationDesired,
        trachelectomyCandidate: input.trachelectomyCandidate ?? rawData.trachelectomyCandidate,
        hpvStatus: input.hpvStatus ?? rawData.hpvStatus,
        pdl1Cps: input.pdl1Cps ?? rawData.pdl1Cps,
        sccAntigen: input.sccAntigen ?? rawData.sccAntigen,
      };

      return computeCervicalStage(ccInput);
    },
    getCohort: (profile: any) => computeCervicalClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: CERVICAL_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => 
      checkCervicalDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "cisplatin",
  },
  content: {
    featuredStudies: CERVICAL_STUDIES,
    graphNodes: CERVICAL_GRAPH_NODES,
    edgeEvidences: CERVICAL_EDGE_EVIDENCE,
    wikiTopics: CERVICAL_WIKI_TOPICS,
    drugPolicies: CERVICAL_DRUG_POLICIES,
  },
};
