import type { CancerPluginSpec } from "../types";
import { 
  computeCnlcStage, 
  computeLiverClinicalCohort, 
  type LiverStagingInput 
} from "@/lib/liverStaging";
import { 
  LIVER_TARGETED_DRUGS, 
  checkLiverDrugInteractions 
} from "@/lib/liverDdiData";
import { LIVER_STUDIES } from "@/lib/liverStudiesData";
import { LIVER_WIKI_TOPICS } from "@/lib/liverWikiData";
import { LIVER_DRUG_POLICIES } from "@/lib/liverReimbursementData";
import { LIVER_GRAPH_NODES, LIVER_EDGE_EVIDENCE } from "@/lib/liverKnowledgeGraphData";

/**
 * 原发性肝癌 (HCC) 独立标准化系统插件 (Liver Cancer Dedicated Plugin)
 * 核心特色：CNLC 2024 国家指南分期、Child-Pugh (A/B/C) 与 ALBI 肝功能量化双核评估、
 * 乙肝病毒学阻断 (HBV DNA / 恩替卡韦/TAF 终身防复发)、TACE / 中国特色 HAIC-FO 灌注介入转化、
 * IMbrave150 (T+A) 与中国原研 ORIENT-32 (双达方案) 靶免一线、AFP / PIVKA-II / AFP-L3 三重标志物联动
 */
export const liverPlugin: CancerPluginSpec = {
  id: "liver",
  name: "原发性肝癌",
  enName: "Hepatocellular Carcinoma",
  icon: "🌿",
  organ: "liver",
  guidelineStandard: "CNLC 2024 国家指南 · CSCO 肝癌 2024 · IMbrave150 / ORIENT-32 · HAIC-FO",
  theme: {
    primaryColor: "text-emerald-600",
    badgeColor: "bg-white text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const liverInput: LiverStagingInput = {
        tumorCount: input.tumorCount ?? rawData.tumorCount,
        tumorSize: input.tumorSize ?? rawData.tumorSize,
        maxTumorDiameter: input.maxTumorDiameter ?? rawData.maxTumorDiameter ?? input.tumorSize,
        vascularInvasion: input.vascularInvasion ?? rawData.vascularInvasion,
        extrahepaticMetastasis: input.extrahepaticMetastasis ?? rawData.extrahepaticMetastasis,
        metastasisSites: input.metastasisSites ?? rawData.metastasisSites,
        mStage: input.mStage ?? rawData.mStage,
        childPughGrade: input.childPughGrade ?? rawData.childPughGrade,
        childPughScore: input.childPughScore ?? rawData.childPughScore,
        totalBilirubin: input.totalBilirubin ?? rawData.totalBilirubin,
        serumAlbumin: input.serumAlbumin ?? rawData.serumAlbumin,
        prothrombinTimeInr: input.prothrombinTimeInr ?? rawData.prothrombinTimeInr,
        ascitesStatus: input.ascitesStatus ?? rawData.ascitesStatus,
        hepaticEncephalopathy: input.hepaticEncephalopathy ?? rawData.hepaticEncephalopathy,
        albiGrade: input.albiGrade ?? rawData.albiGrade,
        albiScore: input.albiScore ?? rawData.albiScore,
        icgR15: input.icgR15 ?? rawData.icgR15,
        ecogPs: input.ecogPs ?? rawData.ecogPs,
        hbvStatus: input.hbvStatus ?? rawData.hbvStatus,
        hbvDnaLoad: input.hbvDnaLoad ?? rawData.hbvDnaLoad,
        antiviralTherapy: input.antiviralTherapy ?? rawData.antiviralTherapy,
        mviGrade: input.mviGrade ?? rawData.mviGrade,
        afpLevel: input.afpLevel ?? rawData.afpLevel,
        pivkaIiLevel: input.pivkaIiLevel ?? rawData.pivkaIiLevel,
        afpL3Percent: input.afpL3Percent ?? rawData.afpL3Percent,
        cnlcStage: input.cnlcStage ?? rawData.cnlcStage,
        stage: input.stage ?? rawData.stage,
        tStage: input.tStage ?? rawData.tStage,
        nStage: input.nStage ?? rawData.nStage,
      };

      return computeCnlcStage(liverInput);
    },
    getCohort: (profile: any) => computeLiverClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: LIVER_TARGETED_DRUGS as any,
    checkInteractions: (targetId: string, chronicIds: string[]) => checkLiverDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "atezolizumab",
  },
  content: {
    featuredStudies: LIVER_STUDIES,
    graphNodes: LIVER_GRAPH_NODES,
    edgeEvidences: LIVER_EDGE_EVIDENCE,
    wikiTopics: LIVER_WIKI_TOPICS,
    drugPolicies: LIVER_DRUG_POLICIES,
  },
};
