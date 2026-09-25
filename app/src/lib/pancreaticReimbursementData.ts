/**
 * 胰腺癌 (Pancreatic Cancer) 医保准入、支付限制与慈善援助 (PAP) 政策库
 * 遵循标准: 国家医疗保障局 2024 国谈双目录 · 真实价格与报销红线
 */

import type { DrugPolicy } from "./reimbursementData";

export const PANCREATIC_DRUG_POLICIES: DrugPolicy[] = [
  {
    id: "olaparib",
    name: "利普卓 (Lynparza)",
    genericName: "奥拉帕利片 (150mg*56片/盒)",
    manufacturer: "阿斯利康 (AstraZeneca)",
    target: "BRCA1 / BRCA2 / PARP 抑制剂",
    categoryTag: "targeted",
    originalPrice: 24000,
    negotiatedPrice: 5800,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "携带有害或疑似有害胚系 BRCA 突变 (gBRCAm) 的晚期转移性胰腺癌患者在一线含铂化疗维持治疗。",
    reimbursementLimits: "限经国家认可的三方或院内检测证实携带 gBRCA 突变，且一线含铂化疗至少 16 周未进展的晚期患者报销。",
    offLabelNotice: "非胚系突变（如仅为体细胞突变）或未检测 BRCA 者无法享受医保报销，需全额自费或申请特药商业险理赔。",
    papProgram: "利普卓患者关爱援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "对符合医学标准但自费负担过重的经济困难患者，在自费完成指定周期后提供后续药品慈善赠药救助。"
  },
  {
    id: "nab_paclitaxel",
    name: "凯素 / 艾素 (Abraxane)",
    genericName: "注射用紫杉醇 (白蛋白结合型) (100mg/支)",
    manufacturer: "恒瑞医药 / 石药集团 / 原研新基",
    target: "微管蛋白稳定剂 (化疗基石)",
    categoryTag: "chemo",
    originalPrice: 4800,
    negotiatedPrice: 740,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "联合吉西他滨用于转移性胰腺癌的一线治疗；交界可切除新辅助转化治疗。",
    reimbursementLimits: "国家医保集采常态化覆盖品种。符合转移性胰腺癌一线联合化疗适应证的参保患者享受医保报销待遇。",
    papProgram: "国家带量集采直接惠民",
    papFoundation: "国家医疗保障局",
    papRule: "国家带量集采中标后单支降幅超过 80%，患者每月化疗自费药品费用降至数百元，基本消除因病致贫风险。"
  },
  {
    id: "irinotecan_liposome",
    genericName: "盐酸伊立替康脂质体注射液 (10ml:43mg/支)",
    name: "易安达 (Onivyde)",
    manufacturer: "施维雅 (Servier) / 绿叶制药",
    target: "拓扑异构酶 I 抑制剂 (纳米脂质体)",
    categoryTag: "targeted",
    originalPrice: 5900,
    negotiatedPrice: 2180,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "联合氟尿嘧啶 (5-FU) 和亚叶酸 (LV)，用于既往接受吉西他滨治疗后进展的局部晚期或转移性胰腺腺癌患者。",
    reimbursementLimits: "限既往接受含吉西他滨治疗失败且身体状况评分 ECOG 0-1 的二线胰腺癌患者报销。",
    offLabelNotice: "一线初治超适应证使用无法进入统筹报销渠道。",
    papProgram: "易安达患者援助项目",
    papFoundation: "北京康盟慈善基金会",
    papRule: "针对符合适应证自费购药达指定周期的晚期患者提供买赠循环慈善救助。"
  },
  {
    id: "gemcitabine",
    name: "泽菲 (Gemzar)",
    genericName: "注射用盐酸吉西他滨 (1.0g/支)",
    manufacturer: "江苏豪森 / 礼来制药",
    target: "核苷酸代谢拮抗剂 (基础化疗)",
    categoryTag: "chemo",
    originalPrice: 650,
    negotiatedPrice: 45,
    insuranceCategory: "甲类 (全额统筹)",
    inInsurance: true,
    officialIndication: "胰腺癌各期全身化疗、术后辅助化疗与局部进展期同步放化疗增敏。",
    reimbursementLimits: "全额纳入医保基本目录，符合说明书适应证住院患者全额按基本医疗统筹比例报销。",
    papProgram: "国家基本药物常态化覆盖",
    papFoundation: "国家卫生健康委",
    papRule: "单疗程药物费用仅数十元，城乡居民与职工医保实现无门槛全覆盖。"
  },
  {
    id: "pert_creon",
    name: "得每通 (Creon)",
    genericName: "胰酶肠溶胶囊 (10,000单位*20粒/盒)",
    manufacturer: "雅培制药 (Abbott)",
    target: "外源性胰消化酶替代 (PERT)",
    categoryTag: "supportive",
    originalPrice: 120,
    negotiatedPrice: 42,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "胰腺手术切除后或晚期肿瘤压迫引起的胰腺外分泌功能不全 (PEI)、脂肪泻与吸收不良综合征。",
    reimbursementLimits: "限经确诊胰腺切除术后或慢性胰腺疾病伴严重消化吸收功能障碍患者门诊特病/住院报销。",
    papProgram: "特病慢病门诊统筹覆盖",
    papFoundation: "各地医疗保障局",
    papRule: "门诊特慢病纳入门诊统筹结算，月自付仅数十元，有效支持长期随餐足量服用。"
  }
];
