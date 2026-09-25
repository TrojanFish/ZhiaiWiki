import type { CancerPluginSpec } from "../types";
import { 
  computePancreaticStage, 
  getPancreaticClinicalCohort, 
  type PancreaticStagingInput 
} from "@/lib/pancreaticStaging";
import { 
  PANCREATIC_TARGETED_DRUGS, 
  checkPancreaticDrugInteractions 
} from "@/lib/pancreaticDdiData";
import { PANCREATIC_STUDIES } from "@/lib/pancreaticStudiesData";
import { PANCREATIC_WIKI_TOPICS } from "@/lib/pancreaticWikiData";
import { PANCREATIC_DRUG_POLICIES } from "@/lib/pancreaticReimbursementData";

export const pancreaticPlugin: CancerPluginSpec = {
  id: "pancreatic",
  name: "胰腺癌",
  enName: "Pancreatic Cancer",
  icon: "🫐",
  organ: "pancreas",
  guidelineStandard: "NCCN 2024 · AJCC 第 8 版 · CSCO 胰腺癌诊疗指南 2024",
  theme: {
    // 严格遵循 Playbook §9.2 独立色阶，选用活力暖橙色，杜绝撞色
    primaryColor: "text-orange-600 dark:text-orange-400",
    badgeColor: "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const parsedInput: PancreaticStagingInput = {
        ...rawData,
        ...input,
        organ: "pancreas",
      };
      return computePancreaticStage(parsedInput);
    },
    getCohort: (profile: any) => getPancreaticClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: PANCREATIC_TARGETED_DRUGS,
    checkInteractions: (targetId: string, chronicIds: string[]) =>
      checkPancreaticDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "pancreatic_olaparib",
  },
  content: {
    featuredStudies: PANCREATIC_STUDIES,
    graphNodes: [
      { id: "KRAS_G12D", label: "KRAS G12D", type: "biomarker", nameZh: "KRAS G12D 突变" },
      { id: "BRCA2", label: "BRCA2 胚系突变", type: "biomarker", nameZh: "BRCA2 胚系突变" },
      { id: "CA199", label: "CA19-9", type: "biomarker", nameZh: "糖类抗原 19-9" },
      { id: "WHIPPLE", label: "Whipple Procedure", type: "treatment", nameZh: "胰十二指肠切除术" },
      { id: "MFOLFIRINOX", label: "mFOLFIRINOX", type: "treatment", nameZh: "改良 FOLFIRINOX 方案" },
      { id: "OLAPARIB", label: "Olaparib", type: "drug", nameZh: "奥拉帕利片" },
    ],
    edgeEvidences: {
      "KRAS_G12D->PANCREAS": {
        relation: "driver_mutation",
        title: "KRAS 突变驱动 90% 胰腺导管腺癌发生",
        evidenceLevel: "Level 1A · 92% 突变频率",
        source: "Nature Reviews Clinical Oncology 2021",
      },
      "BRCA2->OLAPARIB": {
        relation: "guides_targeted_therapy",
        title: "胚系 BRCA 突变指导奥拉帕利维持治疗",
        evidenceLevel: "Level 1A · 1级前瞻多中心 RCT",
        source: "NEJM 2019 · POLO Study · PMID: 31157963",
      },
    },
    wikiTopics: PANCREATIC_WIKI_TOPICS,
    drugPolicies: PANCREATIC_DRUG_POLICIES,
  },
};
