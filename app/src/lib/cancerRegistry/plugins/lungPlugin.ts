import type { CancerPluginSpec } from "../types";
import { computeClinicalTnmStage, getClinicalCohortForProfile } from "@/lib/staging";
import { TARGETED_DRUGS, checkDrugInteractions } from "@/lib/ddiData";
import { FEATURED_STUDIES } from "@/lib/evidence-data";
import { DEFAULT_GRAPH_NODES, DEFAULT_EDGE_EVIDENCES } from "@/lib/defaultGraphData";
import { WIKI_TOPICS } from "@/lib/wikiData";
import { DRUG_POLICIES } from "@/lib/reimbursementData";

/**
 * 肺癌标准化系统插件 (Lung Cancer Standard Plugin)
 * 封装 IASLC 第 9 版 TNM 计算、16 大靶向药 DDI 及临床队列
 */
export const lungPlugin: CancerPluginSpec = {
  id: "lung",
  name: "肺癌",
  enName: "Lung Cancer",
  icon: "🫁",
  organ: "lung",
  guidelineStandard: "IASLC 第 9 版 / AJCC 第 9 版",
  theme: {
    primaryColor: "text-sky-700",
    badgeColor: "bg-white text-sky-700",
    bgColor: "bg-sky-50",
  },
  staging: {
    computeStage: (input: any) => {
      const res = computeClinicalTnmStage({
        noduleType: input.noduleType,
        tumorSize: input.tumorSize,
        solidSize: input.solidSize,
        ctr: input.ctr,
        pathologyTumorSize: input.pathologyTumorSize,
        pathologyInvasiveSize: input.pathologyInvasiveSize,
        pathologyLepidicPercent: input.pathologyLepidicPercent,
        pathologyReportMode: input.pathologyReportMode,
        isPathology: input.isPathology,
        tStage: input.tStage,
        nStage: input.nStage,
        mStage: input.mStage,
        vpi: input.vpi,
        adjacentLobeInvasion: input.adjacentLobeInvasion,
        stas: input.stas,
        lvi: input.lvi,
        marginStatus: input.marginStatus,
        marginDistanceMm: input.marginDistanceMm,
        isMultipleNodules: input.isMultipleNodules ?? input.cancerSpecificData?.isMultipleNodules,
        secondaryNodules: input.secondaryNodules ?? input.cancerSpecificData?.secondaryNodules,
      });

      return {
        cancerType: "lung",
        stage: res.stage,
        tStage: res.tStage,
        nStage: res.nStage,
        mStage: res.mStage,
        explanation: res.explanation,
        versionNotice: res.versionBridgeNotice,
        isMultipleNodules: res.isMultipleNodules,
        smplcNotice: res.smplcNotice,
      };
    },
    getCohort: (profile: any) => getClinicalCohortForProfile(profile),
  },
  pharmacology: {
    targetedDrugs: TARGETED_DRUGS,
    checkInteractions: (targetId: string, chronicIds: string[]) => checkDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "osimertinib",
  },
  content: {
    featuredStudies: FEATURED_STUDIES,
    graphNodes: DEFAULT_GRAPH_NODES,
    edgeEvidences: DEFAULT_EDGE_EVIDENCES,
    wikiTopics: WIKI_TOPICS,
    drugPolicies: DRUG_POLICIES,
  },
};
