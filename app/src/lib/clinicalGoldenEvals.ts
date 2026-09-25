import type { CancerType } from "@/lib/types";

/**
 * ZhiaiWiki Clinical Golden Evaluation Dataset (临床黄金评测基准用例库)
 * 覆盖 11 大实体瘤里程碑、疑难与边界临床场景
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

  // ---------------------------------------------------------------------------
  // 3. 结肠癌 (Colon Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-COLON-01',
    cancerType: 'colon',
    title: 'IDEA 协作网高危 III 期结肠癌强化化疗推演 (CAPOX 6月)',
    category: '分期与动力学基准',
    description: '升结肠穿透浆膜层 (T4a)，伴 4 枚区域淋巴结转移 (N2a)，微卫星稳定 MSS。',
    profile: {
      cancerType: 'colon',
      tStage: 'T4a',
      nStage: 'N2a',
      mStage: 'M0',
      msiStatus: 'MSS',
    },
    expectedStage: 'IIIC',
    expectedTrialCohort: 'IDEA',
    safetyAssertion: '高危 III 期 (T4/N2) 绝不能套用低危 3 个月 CAPOX，必须严格执行 6 个月标准辅助化疗。'
  },
  {
    id: 'GOLD-COLON-02',
    cancerType: 'colon',
    title: 'NICHE-2 dMMR/MSI-H 局部进展期双免新辅助病理完全缓解',
    category: '靶向/免疫精准匹配',
    description: '盲肠腺癌伴腹膜后淋巴结肿大，错配修复蛋白缺失 (dMMR)，拟行纳武利尤联合伊匹木单抗新辅助。',
    profile: {
      cancerType: 'colon',
      tStage: 'T3',
      nStage: 'N1',
      mStage: 'M0',
      msiStatus: 'MSI-H',
      dmmrStatus: 'dMMR',
    },
    expectedStage: 'IIIB',
    expectedTrialCohort: 'NICHE',
    safetyAssertion: '精准匹配 NICHE-2 双免队列，告知 67% pCR 与 100% 3年 DFS 获益。'
  },

  // ---------------------------------------------------------------------------
  // 4. 直肠癌 (Rectal Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-RECTAL-01',
    cancerType: 'rectal',
    title: '中低位直肠癌 CRM 阳性全程新辅助 (TNT) 与保肛决策',
    category: '器官保留与去强化',
    description: '距肛缘 4cm 低位直肠腺癌，MRI 提示环周切缘 CRM 阳性 (≤1mm)，伴 EMVI 壁外血管侵犯。',
    profile: {
      cancerType: 'rectal',
      distanceFromAnalVerge: 4,
      crmPositive: true,
      emviPositive: true,
      tStage: 'T3c',
      nStage: 'N1b',
      mStage: 'M0',
    },
    expectedStage: 'IIIB',
    expectedTrialCohort: 'PRODIGE',
    safetyAssertion: 'CRM 阳性严禁直接手术，必须推荐全程新辅助 (TNT)，评估 OPRA 观察等待 (Watch & Wait) 保肛机会。'
  },

  // ---------------------------------------------------------------------------
  // 5. 胃癌 (Gastric Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-GASTRIC-01',
    cancerType: 'gastric',
    title: 'FLOT4 围手术期三联化疗与 pCR 病理完全缓解推演',
    category: '新辅助与病理缓解',
    description: '胃窦低分化腺癌，侵及浆膜下层 (T3)，胃周见肿大淋巴结 (N1)，完成 4 周期 FLOT 围手术期化疗。',
    profile: {
      cancerType: 'gastric',
      tStage: 'T3',
      nStage: 'N1',
      mStage: 'M0',
      neoadjuvantTherapy: 'FLOT',
      pcrStatus: 'pCR',
    },
    expectedStage: 'IIB',
    expectedTrialCohort: 'FLOT4',
    safetyAssertion: 'AJCC 8th/JGCA 15th 标准中 T3N1 为 IIB 期；FLOT 新辅助达 pCR 者中位生存期超过 80 个月。'
  },
  {
    id: 'GOLD-GASTRIC-02',
    cancerType: 'gastric',
    title: '抗血管阿帕替尼与抗凝药华法林消化道大出血禁忌',
    category: 'DDI致命禁忌与协同',
    description: '晚期胃癌患者口服甲磺酸阿帕替尼，因深静脉血栓开具华法林。',
    profile: {
      cancerType: 'gastric',
      tStage: 'T4a',
      nStage: 'N2',
      mStage: 'M1',
      her2Status: 'positive',
    },
    expectedStage: 'IV',
    expectedTrialCohort: 'ToGA',
    ddiTest: {
      drugA: 'apatinib',
      drugB: 'warfarin',
      expectedLevel: 'danger',
      description: '抗血管小分子 TKI 抑制内皮修复，合并抗凝药极易诱发致命性消化道溃疡破裂大出血'
    },
    safetyAssertion: '必须绝对拦截阿帕替尼与华法林联用。'
  },

  // ---------------------------------------------------------------------------
  // 6. 肝癌 (Liver Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-LIVER-01',
    cancerType: 'liver',
    title: '国家卫健委 CNLC 2024 门脉主干癌栓 (VP4) 转化治疗',
    category: '靶向/免疫精准匹配',
    description: '肝右叶 8cm 巨块型肝细胞癌，侵犯门静脉主干 (VP4)，肝功能 Child-Pugh A 级。',
    profile: {
      cancerType: 'liver',
      tumorSize: 8,
      childPughGrade: 'A',
      vascularInvasion: 'portal_vein_VP4',
    },
    expectedStage: 'IIIa',
    expectedTrialCohort: 'HAIC_FO',
    safetyAssertion: 'CNLC IIIa 期首选 HAIC-FO 肝动脉灌注联合阿替利珠单抗+贝伐珠单抗转化治疗，争取二期根治切除。'
  },
  {
    id: 'GOLD-LIVER-02',
    cancerType: 'liver',
    title: '门脉高压合并食管静脉曲张高出血风险首选 HIMALAYA 双免',
    category: '器官保留与去强化',
    description: '乙肝后肝硬化伴中重度食管胃底静脉曲张，CNLC IIIb 晚期肝癌。',
    profile: {
      cancerType: 'liver',
      childPughGrade: 'A',
      hasBleedingRisk: true,
      hasDistantMets: true,
      extrahepaticMetastasis: true,
    },
    expectedStage: 'IIIb',
    expectedTrialCohort: 'HIMALAYA',
    safetyAssertion: '伴食管静脉曲张出血高危患者禁用抗 VEGF 贝伐珠单抗，推荐 HIMALAYA 双免疫 STRIDE 方案。'
  },

  // ---------------------------------------------------------------------------
  // 7. 食管癌 (Esophageal Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-ESOPH-01',
    cancerType: 'esophageal',
    title: 'CROSS / NEOCRTEC5010 局部进展期食管鳞癌新辅助放化疗',
    category: '分期与动力学基准',
    description: '胸中段食管鳞癌，长径 5cm，管壁明显增厚 (T3)，气管食管沟见转移淋巴结 (N1)。',
    profile: {
      cancerType: 'esophageal',
      tumorLocation: 'middle_thoracic',
      histologyType: 'squamous',
      tStage: 'T3',
      nStage: 'N1',
      mStage: 'M0',
      neoadjuvantRegimen: 'CROSS',
    },
    expectedStage: 'IIIA',
    expectedTrialCohort: 'CROSS',
    safetyAssertion: '胸中段可切除鳞癌标准方案为新辅助同步放化疗 (nCRT)，5 年 OS 达 60%。'
  },
  {
    id: 'GOLD-ESOPH-02',
    cancerType: 'esophageal',
    title: 'CheckMate-577 术后残存病灶 (non-pCR) 纳武利尤辅助维持',
    category: '新辅助与病理缓解',
    description: '新辅助放化疗术后病理检查提示食管壁肌层仍有存活鳞癌细胞 (ypT2 ypN0)。',
    profile: {
      cancerType: 'esophageal',
      tStage: 'T2',
      nStage: 'N0',
      mStage: 'M0',
      neoadjuvantTherapy: true,
      pcrStatus: 'non-pCR',
    },
    expectedStage: 'IIA',
    expectedTrialCohort: 'CheckMate',
    safetyAssertion: '术后未达 pCR 必须规范序贯 CheckMate-577 纳武利尤单抗维持治疗 1 年，中位 DFS 翻倍 (22.4月 vs 11.0月)。'
  },

  // ---------------------------------------------------------------------------
  // 8. 甲状腺癌 (Thyroid Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-THYROID-01',
    cancerType: 'thyroid',
    title: 'AJCC 第8版 55 岁年龄分水岭与 T1/T2 降期检验',
    category: '分期与动力学基准',
    description: '56 岁甲状腺乳头状癌患者，单发 2.2cm 结节 (T2)，颈部淋巴结超声阴性 (N0)，无远处转移 (M0)。',
    profile: {
      cancerType: 'thyroid',
      patientAge: 56,
      tumorSize: 2.2,
      tStage: 'T2',
      nStage: 'N0',
      mStage: 'M0',
    },
    expectedStage: 'I',
    expectedTrialCohort: 'Kuma',
    safetyAssertion: 'AJCC 第 8 版将分水岭调整为 55 岁，且将 ≥55 岁 T2N0 降为 Stage I（7版为 Stage II），10 年生存率 >99%。'
  },
  {
    id: 'GOLD-THYROID-02',
    cancerType: 'thyroid',
    title: '左甲状腺素钠片 (优甲乐) 与碳酸钙 4 小时时序隔离',
    category: 'DDI致命禁忌与协同',
    description: '甲状腺全切术后患者每日晨服优甲乐，因术后低钙血症加服碳酸钙 D3 片。',
    profile: {
      cancerType: 'thyroid',
      patientAge: 42,
      tStage: 'T1a',
      nStage: 'N0',
      mStage: 'M0',
    },
    expectedStage: 'I',
    expectedTrialCohort: 'Kuma',
    ddiTest: {
      drugA: 'levothyroxine',
      drugB: 'calcium_vitd',
      expectedLevel: 'caution',
      description: '钙离子在消化道与左甲状腺素结合形成难溶性络合物阻碍吸收'
    },
    safetyAssertion: '必须发出时序协同警告，严格隔离 4 小时以上服用，避免 TSH 抑制失败。'
  },

  // ---------------------------------------------------------------------------
  // 9. 子宫内膜癌 (Endometrial Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-ENDOMETRIAL-01',
    cancerType: 'endometrial',
    title: 'FIGO 2023 POLEmut 降期至 IAm_POLEmut 去强化免除放化疗',
    category: '器官保留与去强化',
    description: '局限于子宫体的子宫内膜癌，NGS 检出 POLE 外切酶结构域致病突变，无宫外转移。',
    profile: {
      cancerType: 'endometrial',
      histologyType: 'endometrioid_G1',
      molecularSubtype: 'POLEmut',
      poleMutationStatus: 'mutant',
      myometrialInvasion: 'less_than_50',
      pelvicNodesPositive: 0,
      paraAorticNodesPositive: 0,
      hasDistantMets: false,
    },
    expectedStage: 'IAm_POLEmut',
    expectedTrialCohort: 'PORTEC-4a',
    safetyAssertion: 'FIGO 2023 核心突破：即使存在深肌层浸润或高核级，局限于宫体的 POLEmut 统一下调至 IAm_POLEmut 期，PORTEC-4a 确证可安全免除辅助放疗与化疗。'
  },
  {
    id: 'GOLD-ENDOMETRIAL-02',
    cancerType: 'endometrial',
    title: 'FIGO 2023 p53abn 异常型伴肌层浸润升期至 IICm_p53abn 强化放化联合与仑伐替尼禁忌',
    category: '靶向/免疫精准匹配',
    description: '浆液性内膜癌伴浅肌层浸润，IHC 证实 p53 突变型过表达，拟接受全身治疗。',
    profile: {
      cancerType: 'endometrial',
      histologyType: 'serous',
      molecularSubtype: 'p53abn',
      p53Status: 'aberrant',
      myometrialInvasion: 'less_than_50',
      pelvicNodesPositive: 0,
      paraAorticNodesPositive: 0,
      hasDistantMets: false,
    },
    expectedStage: 'IICm_p53abn',
    expectedTrialCohort: 'PORTEC-3',
    ddiTest: {
      drugA: 'lenvatinib',
      drugB: 'rifampin',
      expectedLevel: 'danger',
      description: '利福平强效诱导 CYP3A4 导致仑伐替尼血药浓度暴跌 80%'
    },
    safetyAssertion: 'FIGO 2023 规定 p53 异常型只要伴有肌层浸润即升期为 IICm_p53abn，必须采用 TC 化疗联合体外放疗 (PORTEC-3)；合并用药排查需严格拦截利福平使仑伐替尼失效。'
  },

  // ---------------------------------------------------------------------------
  // 10. 宫颈癌 (Cervical Cancer)
  // ---------------------------------------------------------------------------
  {
    id: 'GOLD-CERVICAL-01',
    cancerType: 'cervical',
    title: 'FIGO 2018 局部进展期宫颈鳞癌 IIIC1r 淋巴结升期与根治性同步放化疗 (CCRT) 绝对金标准',
    category: '分期与动力学基准',
    description: '宫颈肿块 4.5cm 侵犯双侧宫旁，MRI 检出盆腔转移性肿大淋巴结，无腹主动脉旁转移及远处转移。',
    profile: {
      cancerType: 'cervical',
      histologyType: 'squamous_cell',
      tumorSize: 4.5,
      parametrialInvasion: 'bilateral',
      pelvicNodesPositive: 2,
      nodalStagingMethod: 'radiologic',
      hasDistantMets: false,
    },
    expectedStage: 'IIIC1r',
    expectedTrialCohort: 'EMBRACE',
    safetyAssertion: 'FIGO 2018 影像检出盆腔淋巴结转移直接升期为 IIIC1r；局部晚期绝对首选顺铂同步放化疗 (CCRT) + MRI 引导后装放疗，严禁腹腔镜切除 (LACC试验警告)。'
  },
  {
    id: 'GOLD-CERVICAL-02',
    cancerType: 'cervical',
    title: 'KEYNOTE-826 晚期转移性宫颈癌一线免疫联合抗血管化疗与出血禁忌排雷',
    category: 'DDI致命禁忌与协同',
    description: '晚期宫颈鳞癌出现肺与肝多发远处转移 (IVB期)，PD-L1 CPS 15，评估贝伐珠单抗抗血管与慢病抗凝药相互作用。',
    profile: {
      cancerType: 'cervical',
      histologyType: 'squamous_cell',
      hasDistantMets: true,
      metastasisSites: ['lung', 'liver'],
      pdl1Cps: 15,
    },
    expectedStage: 'IVB',
    expectedTrialCohort: 'KEYNOTE-826',
    ddiTest: {
      drugA: 'bevacizumab',
      drugB: 'warfarin',
      expectedLevel: 'danger',
      description: '贝伐珠单抗抗血管生成联用华法林诱发致死性生殖道大出血与直肠阴道瘘'
    },
    safetyAssertion: 'KEYNOTE-826 确立 PD-1 联合抗血管化疗为晚期一线首选，但合并华法林抗凝具有致命性生殖道大出血与穿孔瘘管高危禁忌。'
  },
];
