import type { CancerType } from "@/lib/types";

/**
 * ZhiaiWiki Clinical Golden Evaluation Dataset (临床黄金评测基准用例库)
 * 覆盖肺癌与乳腺癌两大专区里程碑、疑难与边界临床场景
 */

export interface ClinicalGoldenCase {
  id: string;
  cancerType: CancerType;
  title: string;
  category: '分期与动力学基准' | '新辅助与病理缓解' | '靶向/免疫精准匹配' | 'DDI致命禁忌与协同' | '器官保留与去强化';
  description: string;
  profile: any;
  expectedStage: string;
  expectedTrialCohort: string;
  ddiTest?: {
    drugA: string;
    drugB: string;
    expectedLevel: 'danger' | 'caution' | 'warning' | 'safe';
    description: string;
  };
  safetyAssertion: string;
}

export const CLINICAL_GOLDEN_CASES: ClinicalGoldenCase[] = [
  // ---------------------------------------------------------------------------
  // 1. 肺癌 (Lung Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-LUNG-01',
    cancerType: 'lung',
    title: 'IASLC 第9版微浸润磨玻璃腺癌实性分期验证',
    category: '分期与动力学基准',
    description: '结节总全径 1.8cm，CT 实性成分直径 0.4cm，无胸膜侵犯与淋巴结转移。',
    profile: {
      cancerType: 'lung',
      tStage: 'T1a',
      nStage: 'N0',
      mStage: 'M0',
      subsolidType: 'part_solid',
      solidComponentSize: 0.4,
      totalSize: 1.8,
    },
    expectedStage: 'IA1',
    expectedTrialCohort: 'JCOG0804',
    safetyAssertion: '根据 IASLC 第9版，浸润 T 分期由实性成分 0.4cm (≤0.5cm) 决定为 T1a (IA1期)，严禁按全径 1.8cm 错判为 T1b。'
  },
  {
    id: 'GOLD-LUNG-02',
    cancerType: 'lung',
    title: 'CheckMate-816 新辅助化免后术后残存病灶 (non-pCR) 序贯维持',
    category: '新辅助与病理缓解',
    description: '可切除 IIIA 期肺腺癌 (T2a 单站同侧纵隔 N2a)，术前完成 3 周期新辅助化免，术后病理有残存病灶。',
    profile: {
      cancerType: 'lung',
      tStage: 'T2a',
      nStage: 'N2a',
      mStage: 'M0',
      neoadjuvant: true,
      pcrStatus: 'non-pCR',
    },
    expectedStage: 'IIIA',
    expectedTrialCohort: 'CheckMate',
    safetyAssertion: 'IASLC 第9版单站 N2a 判定为 IIIA 期，未达 pCR (non-pCR) 患者术后精准匹配强化维持随访策略。'
  },

  // ---------------------------------------------------------------------------
  // 2. 乳腺癌 (Breast Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-BREAST-01',
    cancerType: 'breast',
    title: 'AJCC 第8/9版 Luminal A 绝经后预后降期验证',
    category: '分期与动力学基准',
    description: '肿瘤 2.5cm (T2)，腋窝淋巴结阴性 (N0)，ER 90%强阳，PR 80%强阳，HER2 阴性 (IHC 1+)，Ki-67 8%，Grade 1。',
    profile: {
      cancerType: 'breast',
      tStage: 'T2',
      nStage: 'N0',
      mStage: 'M0',
      erStatus: 'positive',
      prStatus: 'positive',
      her2Status: 'negative',
      ki67: 8,
      grade: 'G1',
    },
    expectedStage: 'IA',
    expectedTrialCohort: 'TAILORx',
    safetyAssertion: '解剖分期为 IIA，但在 AJCC 预后分期系统中高激素低增殖特征下调为 Stage IA。'
  },
  {
    id: 'GOLD-BREAST-02',
    cancerType: 'breast',
    title: '他莫昔芬与抗抑郁药帕罗西汀 CYP2D6 致命配伍禁忌',
    category: 'DDI致命禁忌与协同',
    description: 'HR 阳性乳腺癌患者术后服用他莫昔芬内分泌治疗，因围绝经期焦虑抑郁开具帕罗西汀。',
    profile: {
      cancerType: 'breast',
      tStage: 'T1c',
      nStage: 'N0',
      mStage: 'M0',
      erStatus: 'positive',
      prStatus: 'positive',
      her2Status: 'negative',
    },
    expectedStage: 'IA',
    expectedTrialCohort: 'TAILORx',
    ddiTest: {
      drugA: 'tamoxifen',
      drugB: 'paroxetine',
      expectedLevel: 'danger',
      description: 'CYP2D6 强抑制剂阻断他莫昔芬向活性内芬代谢转化'
    },
    safetyAssertion: '必须强制拦截 danger 级用药冲突，推荐换用文拉法辛。'
  },
];
