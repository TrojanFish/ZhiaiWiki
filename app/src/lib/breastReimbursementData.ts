export interface DrugPolicy {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  target: string;
  categoryTag: "her2" | "cdk46" | "endocrine" | "adc" | "parp_immuno" | string;
  originalPrice: number;    // 国谈前月自费(元)
  negotiatedPrice: number;  // 现行国谈医保基准价月费用(元)
  insuranceCategory: "甲类 (全额统筹)" | "乙类 (先行自付5%~15%)" | "未进基本医保 (惠民保/PAP覆盖)";
  inInsurance: boolean;
  officialIndication: string;  // 官方说明书适应证
  reimbursementLimits: string; // 医保限定支付范围（报销红线）
  offLabelNotice?: string;     // 超医保范围自费提醒
  papProgram: string;          // 官方慈善赠药项目名称
  papFoundation: string;       // 主办基金会
  papRule: string;             // 具体买赠/援助规则
}

export const BREAST_DRUG_POLICIES: DrugPolicy[] = [
  // --- 抗 HER2 经典单抗与双靶 ---
  {
    id: "trastuzumab",
    name: "赫赛汀",
    genericName: "注射用曲妥珠单抗 (440mg)",
    manufacturer: "罗氏制药 (Roche) / 生物类似药",
    target: "HER2 (ERBB2)",
    categoryTag: "her2",
    originalPrice: 24500,
    negotiatedPrice: 1300,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① HER2 阳性早期浸润性乳腺癌术后辅助治疗（1年全疗程）；② HER2 阳性转移性晚期乳腺癌一线联合化疗。",
    reimbursementLimits: "限 HER2 表达为免疫组化 IHC 3+ 或 FISH 基因扩增阳性的乳腺癌患者，早期辅助支付期限定为 1 年（通常 17~18 周期）。",
    offLabelNotice: "若免疫组化为 IHC 1+ 或 2+/FISH 阴性，医保严格不予报销；超 1 年辅助维持需自费。",
    papProgram: "赫赛汀患者全程关爱项目",
    papFoundation: "中国癌症基金会",
    papRule: "原研药目前已全面进入国家医保乙类，各地门慢门特综合自付仅需原价 5%~15%（约数百元/支）。"
  },
  {
    id: "pertuzumab",
    name: "帕捷特",
    genericName: "帕妥珠单抗注射液 (420mg)",
    manufacturer: "罗氏制药 (Roche)",
    target: "HER2 结构域 II",
    categoryTag: "her2",
    originalPrice: 18800,
    negotiatedPrice: 2855,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "与曲妥珠单抗和多西他赛联合用于 HER2 阳性、局部晚期、炎性或早期高危乳腺癌的新辅助/辅助治疗。",
    reimbursementLimits: "【重要报销红线】：早期辅助治疗医保限定必须为「HER2 阳性且伴有高复发风险（腋窝淋巴结阳性，或肿块最大径 >2.0cm 伴高危因素）」；纯极早期小肿块无淋巴结转移者不予医保统筹。",
    offLabelNotice: "低危早期（T1N0）患者使用双靶需自费，建议结合医生评估是否自费使用或使用单靶。",
    papProgram: "帕捷特生命希望患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "国谈价格约 2855 元/支，符合医保限定条件的淋巴结阳性高危患者全疗程享受大病统筹报销。"
  },

  // --- CDK4/6 抑制剂体系 ---
  {
    id: "abemaciclib",
    name: "唯择",
    genericName: "阿贝西利片 (150mg/100mg/50mg)",
    manufacturer: "礼来 (Eli Lilly)",
    target: "CDK4 / CDK6 细胞周期蛋白依赖性激酶",
    categoryTag: "cdk46",
    originalPrice: 11980,
    negotiatedPrice: 3260,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① 联合内分泌治疗用于 HR+、HER2-、淋巴结阳性、高复发风险早期乳腺癌成人患者的辅助治疗（疗程 2 年）；② 晚期内分泌耐药或一线治疗。",
    reimbursementLimits: "【早期辅助报销红线·严格对齐 MonarchE】：必须符合以下两类之一：① 腋窝淋巴结阳性 ≥4 枚；或 ② 腋窝淋巴结阳性 1~3 枚，且同时满足原发肿瘤 ≥5cm 或组织学分级 Grade 3 级中至少一项。",
    offLabelNotice: "仅有 1~2 枚淋巴结阳性且肿瘤 <5cm 且分级为 1~2 级者，医保不予报销早期辅助，需自费或申请商业惠民保。",
    papProgram: "择优守护·阿贝西利患者关爱计划",
    papFoundation: "北京康盟慈善基金会",
    papRule: "晚期自费阶段可享受买 2 盒赠 2 盒援助；早期高危符合医保限定直接走门诊特病统筹（每月自付约数百元）。"
  },
  {
    id: "palbociclib",
    name: "爱博新",
    genericName: "哌柏西利胶囊 (125mg/100mg/75mg)",
    manufacturer: "辉瑞 (Pfizer) / 国产仿制齐普乐",
    target: "CDK4 / CDK6",
    categoryTag: "cdk46",
    originalPrice: 29800,
    negotiatedPrice: 3180,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "联合芳香化酶抑制剂用于 HR+、HER2- 局部晚期或转移性乳腺癌患者的一线初始治疗。",
    reimbursementLimits: "目前国家医保限定仅限「局部晚期或转移性乳腺癌」支付，早期辅助治疗尚未纳保（因 PALLAS 试验阴性）。",
    offLabelNotice: "早期乳腺癌术后切勿盲目自费吃爱博新，辅助强化仅推荐证据阳性的阿贝西利。",
    papProgram: "博新希望患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "晚期患者进入国家医保乙类，职工医保实际月自费约 400~800 元。"
  },

  // --- 新一代 ADC 生物导弹 ---
  {
    id: "tdxd_enhertu",
    name: "优赫得",
    genericName: "注射用德曲妥珠单抗 (T-DXd / 100mg)",
    manufacturer: "第一三共 (Daiichi Sankyo) / 阿斯利康",
    target: "HER2 靶向 ADC (载荷拓扑异构酶 I 抑制剂 DXd)",
    categoryTag: "adc",
    originalPrice: 8860,
    negotiatedPrice: 8860,
    insuranceCategory: "未进基本医保 (惠民保/PAP覆盖)",
    inInsurance: false,
    officialIndication: "① 既往接受过一种或一种以上抗 HER2 治疗方案的不可切除或转移性 HER2 阳性成人乳腺癌；② 既往在转移性阶段接受过化疗的 HER2 低表达 (HER2-low) 晚期乳腺癌。",
    reimbursementLimits: "目前尚未正式纳入全国基本医疗保险目录；国内绝大多数城市「城市定制型商业补充医疗险（惠民保）」已将其纳入特药报销目录（报销比例 50%~70%）。",
    offLabelNotice: "全自费每疗程约 1.7万~2.6 万元，需凭借基因病理报告在正规 DTP 药房购买并申请惠民保理赔。",
    papProgram: "优享生命患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "自费购药达指定周期后可享受后续赠药援助，极大减轻晚期患者经济负担。"
  },

  // --- PARP 抑制剂与内分泌特药 ---
  {
    id: "olaparib",
    name: "利普卓",
    genericName: "奥拉帕利片 (150mg/100mg)",
    manufacturer: "阿斯利康 (AstraZeneca)",
    target: "PARP1 / PARP2 (BRCA 突变合成致死)",
    categoryTag: "parp_immuno",
    originalPrice: 24700,
    negotiatedPrice: 5200,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① 具有有害或疑似有害胚系 BRCA 突变 (gBRCAm)、HR+ HER2- 早期高危乳腺癌成人患者的新辅助/辅助治疗（OlympiA 研究）；② gBRCA 晚期乳腺癌。",
    reimbursementLimits: "限经国家认可的二代基因测序 (NGS) 证实具有胚系 BRCA1 或 BRCA2 致病性突变、且符合早期高危或晚期转移的患者。",
    offLabelNotice: "未检测 BRCA 基因、BRCA 属于非致病性意义未明突变 (VUS) 或野生型者医保不予报销。",
    papProgram: "利普卓患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "医保乙类覆盖，大病特药门诊统筹后自费大幅下降。"
  },
  {
    id: "fulvestrant",
    name: "芙仕得",
    genericName: "氟维司群注射液 (250mg*2支)",
    manufacturer: "阿斯利康 / 正大天晴",
    target: "ER 选择性雌激素受体下调剂 (SERD)",
    categoryTag: "endocrine",
    originalPrice: 11000,
    negotiatedPrice: 4200,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "用于在抗雌激素（如他莫昔芬）治疗后进展的绝经后 HR 阳性局部晚期或转移性乳腺癌患者。",
    reimbursementLimits: "限绝经后或经药物去势后、且既往内分泌治疗失败的局部晚期或转移性乳腺癌。",
    offLabelNotice: "早期术后辅助阶段常规不首选氟维司群，首选口服芳香化酶抑制剂。",
    papProgram: "全国医保门诊特病统筹",
    papFoundation: "各地医保局",
    papRule: "肌内注射给药，每月 1 次，已完全纳保。"
  }
];
