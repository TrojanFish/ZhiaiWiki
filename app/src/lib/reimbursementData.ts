export interface DrugPolicy {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  target: string;
  categoryTag: "egfr" | "alk_ros1" | "rare_targets" | "immunotherapy" | "her2" | "cdk46" | "endocrine" | "adc" | "parp_immuno" | string;
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

export const DRUG_POLICIES: DrugPolicy[] = [
  // --- EGFR 靶向体系 ---
  {
    id: "osimertinib",
    name: "泰瑞沙",
    genericName: "甲磺酸奥希替尼片 (80mg)",
    manufacturer: "阿斯利康 (AstraZeneca)",
    target: "EGFR 19del / L858R / T790M",
    categoryTag: "egfr",
    originalPrice: 51000,
    negotiatedPrice: 5580,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① EGFR 敏感突变局部晚期或转移性 NSCLC 一线治疗；② 经既往 EGFR-TKI 治疗后进展且 T790M 突变阳性；③ IB-IIIA 期 (AJCC第7版) EGFR 敏感突变术后辅助治疗。",
    reimbursementLimits: "限 EGFR 外显子 19 缺失或 L858R 置换突变的局部晚期或转移性 NSCLC 一线，或既往进展经检验 T790M 突变阳性；术后辅助治疗（IB-IIIA期）已纳保。",
    offLabelNotice: "未行基因检测盲吃、或非小细胞肺癌以外癌种不予医保支付，需完全自费。",
    papProgram: "泰瑞沙慈善援助项目",
    papFoundation: "中华慈善总会 (CCF)",
    papRule: "符合医学条件的低保患者全额免费援助；非低保患者自付达到一定周期后提供后续免费药品援助。"
  },
  {
    id: "fumetinib",
    name: "艾弗沙",
    genericName: "甲磺酸伏美替尼片 (80mg)",
    manufacturer: "江苏艾力斯 (Allist)",
    target: "EGFR 敏感突变 / 20外显子插入",
    categoryTag: "egfr",
    originalPrice: 28000,
    negotiatedPrice: 5200,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① EGFR 19del/L858R 局部晚期或转移性 NSCLC 一线治疗；② 既往 EGFR-TKI 治疗进展后 T790M 突变二线；③ 20外显子插入突变（获批突破性疗法）。",
    reimbursementLimits: "限 EGFR 敏感突变局部晚期/转移性一线及 T790M 突变二线治疗。",
    offLabelNotice: "20 外显子插入突变在部分省份医保报销需个案审核或走惠民保特药通道。",
    papProgram: "生命之光·艾弗沙患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "自费购药达指定周期并经医学评估持续获益且耐受良好者，可申请后续周期药品援助。"
  },
  {
    id: "aumolertinib",
    name: "阿美乐",
    genericName: "甲磺酸阿美替尼片 (55mg/110mg)",
    manufacturer: "江苏豪森 (Hansoh)",
    target: "EGFR 19del / L858R / T790M",
    categoryTag: "egfr",
    originalPrice: 29000,
    negotiatedPrice: 3504,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① EGFR 敏感突变晚期一线治疗；② 既往治疗进展后 T790M 突变晚期治疗。",
    reimbursementLimits: "限 EGFR 外显子 19 缺失或 L858R 突变晚期一线，以及 T790M 突变二线。",
    offLabelNotice: "早期术后辅助尚未完全纳入统筹，多以门诊自费或双通道自付结算。",
    papProgram: "阿美乐患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "针对非医保覆盖或自付压力较大的患者提供买赠周期援助。"
  },
  {
    id: "dacomitinib",
    name: "多泽润",
    genericName: "达可替尼片 (45mg)",
    manufacturer: "辉瑞 (Pfizer)",
    target: "二代 EGFR (强效脑转移控制)",
    categoryTag: "egfr",
    originalPrice: 18000,
    negotiatedPrice: 3880,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "EGFR 敏感突变（19del / L858R）局部晚期或转移性 NSCLC 一线单药治疗。",
    reimbursementLimits: "限 EGFR 外显子 19 缺失或 L858R 突变的局部晚期或转移性 NSCLC 一线治疗。",
    offLabelNotice: "二线进展后或无基因证据者不可报销。",
    papProgram: "多泽润患者关爱项目",
    papFoundation: "中国癌症基金会",
    papRule: "阶梯式用药援助，具体依年度项目公告方案执行。"
  },
  {
    id: "gefitinib",
    name: "易瑞沙 / 吉非替尼",
    genericName: "吉非替尼片 (集采中选)",
    manufacturer: "阿斯利康 / 齐鲁制药等",
    target: "一代 EGFR 敏感突变",
    categoryTag: "egfr",
    originalPrice: 5000,
    negotiatedPrice: 260,
    insuranceCategory: "甲类 (全额统筹)",
    inInsurance: true,
    officialIndication: "EGFR 敏感突变局部晚期或转移性 NSCLC 一线治疗。",
    reimbursementLimits: "国家集中带量采购 (VBP) 药品，纳入门慢门特直接全额统筹报销，个人自付极低（月均仅几十元）。",
    papProgram: "已全额集采医保覆盖（无需 PAP）",
    papFoundation: "国家集中采购保障",
    papRule: "已降至极低基准价，基本医保直接统筹 85%~90%，无需申请慈善赠药。"
  },

  // --- ALK & ROS1 体系 ---
  {
    id: "alectinib",
    name: "安圣莎",
    genericName: "盐酸阿来替尼胶囊 (150mg)",
    manufacturer: "罗氏 (Roche)",
    target: "ALK 融合阳性 (钻石突变)",
    categoryTag: "alk_ros1",
    originalPrice: 49980,
    negotiatedPrice: 8500,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① ALK 阳性局部晚期或转移性 NSCLC 一线治疗；② ALINA 试验 ALK 阳性 IB-IIIA 期术后辅助治疗。",
    reimbursementLimits: "限 ALK 阳性的局部晚期或转移性 NSCLC 患者；术后辅助适应证在各省市医保逐步落实挂网中。",
    offLabelNotice: "术后辅助治疗用药若当地尚未完成系统编码更新，可凭处方走双通道或惠民保二次报销。",
    papProgram: "安圣莎患者援助项目",
    papFoundation: "中国癌症基金会 (CFC)",
    papRule: "自费购药满指定周期（如 4~6 个月）后，经评估无进展提供后续周期的免费药品援助。"
  },
  {
    id: "lorlatinib",
    name: "博瑞纳",
    genericName: "劳拉替尼片 / 洛拉替尼 (100mg)",
    manufacturer: "辉瑞 (Pfizer)",
    target: "三代 ALK / ROS1 难治脑转移",
    categoryTag: "alk_ros1",
    originalPrice: 42000,
    negotiatedPrice: 11800,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① ALK 阳性晚期 NSCLC 一线治疗；② 经阿来替尼/塞瑞替尼耐药进展后的后线治疗。",
    reimbursementLimits: "限 ALK 阳性晚期非小细胞肺癌患者的一线或后线治疗。",
    offLabelNotice: "ROS1 突变后线在部分省份属于超说明书用药，建议走惠民保特药通道申报。",
    papProgram: "博瑞纳患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "针对自付负担较重且持续获益的患者提供阶梯式赠药援助。"
  },
  {
    id: "entrectinib",
    name: "罗圣全",
    genericName: "恩曲替尼胶囊 (200mg)",
    manufacturer: "罗氏 (Roche)",
    target: "ROS1 融合 / NTRK 广谱突变",
    categoryTag: "alk_ros1",
    originalPrice: 37000,
    negotiatedPrice: 8900,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① ROS1 阳性局部晚期或转移性 NSCLC；② NTRK 融合阳性泛癌种晚期实体瘤。",
    reimbursementLimits: "限 ROS1 阳性晚期非小细胞肺癌，或 NTRK 阳性实体瘤。",
    papProgram: "罗圣全患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "符合入组标准的 ROS1 突变肺癌患者可申请买赠周期支持。"
  },

  // --- 罕见靶点 & ADC 体系 ---
  {
    id: "savolitinib",
    name: "沃瑞沙",
    genericName: "赛沃替尼片 (200mg)",
    manufacturer: "和黄医药 / 阿斯利康",
    target: "MET 14号外显子跳跃突变 / MET 扩增",
    categoryTag: "rare_targets",
    originalPrice: 19800,
    negotiatedPrice: 4800,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "含铂化疗后进展或不耐受标准含铂化疗的 MET 外显子 14 跳跃突变局部晚期或转移性 NSCLC。",
    reimbursementLimits: "限 MET 外显子 14 跳跃突变的局部晚期或转移性 NSCLC。",
    offLabelNotice: "EGFR-TKI 耐药后的 MET 扩增双靶联合在部分地区属于超医保限定，需自费或走特药理赔。",
    papProgram: "沃瑞沙患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "按买赠周期援助，大幅减轻罕见突变家庭负担。"
  },
  {
    id: "selpercatinib",
    name: "睿妥",
    genericName: "塞普替尼胶囊 (80mg)",
    manufacturer: "礼来 (Eli Lilly)",
    target: "RET 融合阳性 (强效高选择性)",
    categoryTag: "rare_targets",
    originalPrice: 32000,
    negotiatedPrice: 9500,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "RET 融合阳性局部晚期或转移性 NSCLC 成人患者。",
    reimbursementLimits: "限 RET 融合阳性的局部晚期或转移性非小细胞肺癌。",
    papProgram: "睿妥患者关爱援助项目",
    papFoundation: "中国癌症基金会",
    papRule: "经医学评估证实持续获益的 RET 突变患者享受赠药支持。"
  },
  {
    id: "fulzerasib",
    name: "达伯特",
    genericName: "氟泽雷塞片 (KRAS G12C抑制剂)",
    manufacturer: "信达生物 / 劲方医药",
    target: "KRAS G12C 突变突破",
    categoryTag: "rare_targets",
    originalPrice: 22000,
    negotiatedPrice: 12000,
    insuranceCategory: "未进基本医保 (惠民保/PAP覆盖)",
    inInsurance: false,
    officialIndication: "既往经至少一种系统治疗进展的 KRAS G12C 突变局部晚期或转移性 NSCLC。",
    reimbursementLimits: "2024 年全新获批，暂未进入国家基本医保目录，已被全国多地城市惠民保纳入门诊特药 0 免赔报销 70%+！",
    papProgram: "达伯特患者援助项目 (筹备启动中)",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "购药达指定疗程可申请阶段性免费赠药，结合城市惠民保二次报销自负低至 2000 元/月左右。"
  },
  {
    id: "enhertu",
    name: "优赫得",
    genericName: "注射用德曲妥珠单抗 (DS-8201 / HER2 ADC)",
    manufacturer: "第一三共 / 阿斯利康",
    target: "HER2 (ERBB2) 突变晚期肺癌",
    categoryTag: "rare_targets",
    originalPrice: 36000,
    negotiatedPrice: 18000,
    insuranceCategory: "未进基本医保 (惠民保/PAP覆盖)",
    inInsurance: false,
    officialIndication: "既往接受过系统治疗的 HER2 (ERBB2) 突变不可切除或转移性 NSCLC。",
    reimbursementLimits: "尚未纳入国家基本医保目录。已 100% 纳入上海沪惠保、北京普惠保、穗岁康等全国绝大部分城市商业补充险（惠民保）特药责任。",
    papProgram: "优赫得患者援助项目",
    papFoundation: "中国癌症基金会",
    papRule: "惠民保报销 60%~80% 叠加慈善赠药，年自负降幅超 75%。"
  },

  // --- 免疫治疗体系 (PD-1 / PD-L1) ---
  {
    id: "tislelizumab",
    name: "百泽安",
    genericName: "替雷利珠单抗注射液 (200mg)",
    manufacturer: "百济神州 (BeiGene)",
    target: "PD-1 免疫检查点 (国产四小龙)",
    categoryTag: "immunotherapy",
    originalPrice: 10688,
    negotiatedPrice: 1250,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "① 联合化疗一线治疗晚期鳞状/非鳞状 NSCLC；② 经治晚期 NSCLC 单药二线；③ II-IIIA 期术后辅助免疫治疗。",
    reimbursementLimits: "晚期非鳞状/鳞状 NSCLC 一线联合化疗全部纳保；单药治疗纳保。统筹后每 3 周个人自负仅约 200~300 元！",
    papProgram: "已全额医保乙类高比例统筹（自负极低）",
    papFoundation: "国家医保统筹直接覆盖",
    papRule: "每次输注经门慢门特报销后仅需自负数百元，无需繁琐申办 PAP。"
  },
  {
    id: "sintilimab",
    name: "达伯舒",
    genericName: "信迪利单抗注射液 (100mg)",
    manufacturer: "信达生物 (Innovent) / 礼来",
    target: "PD-1 免疫检查点",
    categoryTag: "immunotherapy",
    originalPrice: 9800,
    negotiatedPrice: 1080,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "联合培美曲塞和铂类一线治疗 EGFR/ALK 阴性不可手术的局部晚期或转移性非鳞状 NSCLC。",
    reimbursementLimits: "非鳞状及鳞状 NSCLC 一线治疗全适应证纳入国家医保乙类。",
    papProgram: "国家医保统筹直接报销",
    papFoundation: "国家医保统筹保障",
    papRule: "门特统筹报销 80% 左右，每周期自负 200 余元。"
  },
  {
    id: "durvalumab",
    name: "英飞凡",
    genericName: "度伐利尤单抗注射液 (500mg)",
    manufacturer: "阿斯利康 (AstraZeneca)",
    target: "PD-L1 (PACIFIC 模式巩固治疗)",
    categoryTag: "immunotherapy",
    originalPrice: 36000,
    negotiatedPrice: 13500,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "同步放化疗后未出现疾病进展的不可切除、局部晚期 (III期) NSCLC 巩固治疗；广泛期小细胞肺癌一线。",
    reimbursementLimits: "限同步放化疗后未进展的不可切除 III 期 NSCLC 维持巩固治疗（严格符合 PACIFIC 研究模式）。",
    offLabelNotice: "IV 期初治联合双免疫若超医保限定，需走自费或惠民保特药。",
    papProgram: "因飞凡患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "买几赠几阶段性援助方案，有效降低 III 期维持 1 年全疗程总费用。"
  },
  {
    id: "pembrolizumab",
    name: "可瑞达 (K药)",
    genericName: "帕博利珠单抗注射液 (100mg)",
    manufacturer: "默沙东 (MSD)",
    target: "PD-1 免疫检查点 (进口金标准)",
    categoryTag: "immunotherapy",
    originalPrice: 35836,
    negotiatedPrice: 17918,
    insuranceCategory: "未进基本医保 (惠民保/PAP覆盖)",
    inInsurance: false,
    officialIndication: "① PD-L1 TPS ≥1% EGFR/ALK 阴性晚期一线单药；② 联合培美曲塞和铂类晚期一线；③ 早期术后辅助治疗。",
    reimbursementLimits: "目前未进国家基本医保目录。已被全国绝大多数城市“惠民保”纳入特药报销 60%~80%！",
    papProgram: "生命之钥·肿瘤免疫治疗患者援助项目",
    papFoundation: "中国初级卫生保健基金会 (CPBPCF)",
    papRule: "执行【2+2 ➔ 2+N】年度方案：自费购买 2 周期赠 2 周期，之后再自费购买 2 周期赠药至疾病进展（最多 2 年封顶），年自负降幅超 75%。"
  }
];
