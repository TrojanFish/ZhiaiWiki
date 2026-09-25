import type { DrugPolicy } from "./breastReimbursementData";

export const COLORECTAL_DRUG_POLICIES: DrugPolicy[] = [
  // --- 抗 EGFR 靶向单抗 ---
  {
    id: "cetuximab",
    name: "爱必妥",
    genericName: "西妥昔单抗注射液 (100mg/500mg)",
    manufacturer: "默克雪兰诺 (Merck Serono) / 齐鲁制药类似物",
    target: "EGFR 细胞外结构域",
    categoryTag: "egfr",
    originalPrice: 19800,
    negotiatedPrice: 1295,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "与化疗联合用于原发灶位于左半结肠、RAS 基因野生型转移性结直肠癌的一线及后续治疗。",
    reimbursementLimits: "【重要报销红线】：严格限定原发部位为「左半结肠（脾曲至直肠）」且经基因检测明确为「全 RAS (KRAS/NRAS) 野生型」的晚期转移性结直肠癌患者；右半或伴有 RAS 突变者医保统筹不予支付。",
    offLabelNotice: "右半结肠癌或携带 KRAS/NRAS 突变者属于超医保限定范围，无法医保报销。",
    papProgram: "爱必妥肿瘤患者援助项目",
    papFoundation: "中国癌症基金会",
    papRule: "国谈后单支价格从数千元降至约 1295 元 (100mg)，进入国家医保乙类门特统筹后，各地自付比例普遍在 10%~20% 之间。"
  },

  // --- 抗 VEGF 血管生成单抗 ---
  {
    id: "bevacizumab",
    name: "安维汀 / 达攸同",
    genericName: "贝伐珠单抗注射液 (100mg/400mg)",
    manufacturer: "罗氏制药 (Roche) / 信达生物 / 齐鲁制药",
    target: "VEGF-A 血管内皮生长因子",
    categoryTag: "vegf",
    originalPrice: 18500,
    negotiatedPrice: 1080,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "联合以 5-FU 为基础的化疗方案用于转移性结直肠癌 (mCRC) 患者的一线及二线全身治疗。",
    reimbursementLimits: "限转移性结直肠癌 (mCRC) 患者联合化疗，不限左右半部位及 RAS 突变状态，广泛享受大病医保统筹报销。",
    offLabelNotice: "早期或局部晚期可手术切除患者术前术后辅助使用不属于医保限定支付范围。",
    papProgram: "生命之钥·贝伐珠单抗患者关爱援助",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "原研药及多款生物类似药均全面纳入国家集采与医保乙类，门慢门特报销后个人每月自付仅数百元至千余元。"
  },

  // --- 中国原研抗血管生成 TKI ---
  {
    id: "fruquintinib",
    name: "爱优特",
    genericName: "呋喹替尼胶囊 (1mg/5mg)",
    manufacturer: "和黄医药 (HUTCHMED)",
    target: "VEGFR 1 / 2 / 3 激酶受体",
    categoryTag: "vegfr_tki",
    originalPrice: 7350,
    negotiatedPrice: 1980,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "用于既往接受过氟尿嘧啶、奥沙利铂和伊立替康治疗，以及既往接受过或不适合接受抗 VEGF/抗 EGFR 治疗的转移性结直肠癌成人患者。",
    reimbursementLimits: "【三线报销红线】：限既往接受过至少两线标准系统化疗方案（含氟尿嘧啶、奥沙利铂和伊立替康）治疗失败或进展的晚期结直肠癌患者。",
    offLabelNotice: "一线或二线过早使用不在医保目录限定支付范围内。",
    papProgram: "爱优特患者关爱援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "经国家医保谈判续约大幅降价后，每盒现行医保支付价约 1980 元，门特报销后个人月均自付仅需数百元。"
  },

  // --- 多靶点激酶抑制剂 ---
  {
    id: "regorafenib",
    name: "拜万戈",
    genericName: "瑞戈非尼片 (40mg)",
    manufacturer: "拜耳医药 (Bayer)",
    target: "VEGFR / TIE2 / KIT / RET / RAF",
    categoryTag: "vegfr_tki",
    originalPrice: 10080,
    negotiatedPrice: 2820,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "用于既往接受过氟尿嘧啶、奥沙利铂和伊立替康为基础的化疗，以及既往接受过或不适合接受抗 VEGF/抗 EGFR 治疗的转移性结直肠癌。",
    reimbursementLimits: "限既往化疗及靶向治疗失败的晚期转移性结直肠癌（三线治疗）。",
    offLabelNotice: "早期辅助或超适应症一线使用不可报销。",
    papProgram: "拜万戈患者救助项目",
    papFoundation: "中国癌症基金会",
    papRule: "国家医保乙类双通道特药，凭医院处方与特病证明可在定点特药药房直接结算报销。"
  },

  // --- MSI-H / dMMR 免疫治疗 ---
  {
    id: "tislelizumab",
    name: "百泽安",
    genericName: "替雷利珠单抗注射液 (200mg)",
    manufacturer: "百济神州 (BeiGene)",
    target: "PD-1 免疫检查点",
    categoryTag: "immuno",
    originalPrice: 10688,
    negotiatedPrice: 1450,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "用于不可切除或转移性微卫星高度不稳定 (MSI-H) 或错配修复缺陷 (dMMR) 的晚期实体瘤成人患者。",
    reimbursementLimits: "【基因检测红线】：必须提供二代测序 NGS、PCR 或免疫组化 IHC 检测报告，明确证实为「MSI-H 或 dMMR」，MSS (微卫星稳定) 患者医保不予报销。",
    offLabelNotice: "MSS (微卫星稳定型) 结直肠癌使用 PD-1 缺乏充分证据且医保严格不予报销。",
    papProgram: "百泽安患者关爱援助项目",
    papFoundation: "北京康盟慈善基金会",
    papRule: "国谈价格约 1450 元/支，200mg Q3W 全疗程享受国家基本医保大病门慢统筹报销。"
  },

  // --- 口服核苷类似物三线化疗 ---
  {
    id: "trifluridine_tipiracil",
    name: "朗斯弗",
    genericName: "曲氟尿苷替匹嘧啶片 (TAS-102)",
    manufacturer: "正大天晴 / 日本大鹏药品",
    target: "胸苷酸合成抑制 / DNA 掺入",
    categoryTag: "chemo_oral",
    originalPrice: 6500,
    negotiatedPrice: 1860,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "适用于既往接受过氟尿嘧啶、奥沙利铂和伊立替康为基础的化疗，以及抗 VEGF/抗 EGFR 治疗的转移性结直肠癌。",
    reimbursementLimits: "限多线化疗与靶向治疗失败的难治性晚期结直肠癌患者（三线及以上）。",
    offLabelNotice: "早期未经标准一线化疗者不可医保报销。",
    papProgram: "朗斯弗患者关爱项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "已纳入最新国家医保乙类目录，口服给药极大方便门诊居家治疗。"
  },

  // --- 经典口服氟尿嘧啶基石 ---
  {
    id: "capecitabine",
    name: "希罗达 / 类似物",
    genericName: "卡培他滨片 (0.5g)",
    manufacturer: "罗氏制药 (Roche) / 国产集采制剂",
    target: "胸苷磷酸化酶 (TP) 激活 5-FU",
    categoryTag: "chemo_oral",
    originalPrice: 1200,
    negotiatedPrice: 180,
    insuranceCategory: "甲类 (全额统筹)",
    inInsurance: true,
    officialIndication: "结直肠癌术后辅助化疗 (CAPOX方案)、晚期转移性结直肠癌一线及联合治疗。",
    reimbursementLimits: "国家甲类医保无自付门槛，门诊特病及住院 100% 纳入统筹基金按比例报销。",
    papProgram: "国家集采保障品种",
    papFoundation: "国家医保局集采惠民工程",
    papRule: "集采后价格极其亲民，每盒低至数十元，患者个人实际负担近乎为零。"
  }
];
