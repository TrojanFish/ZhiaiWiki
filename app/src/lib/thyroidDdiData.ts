import type { TargetedDrug, ChronicDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

/**
 * 甲状腺癌 (Thyroid Cancer) 临床主流内分泌抑制、靶向及甲状旁腺支持药物库 (10 种代表性核心药物)
 */
export const THYROID_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "levothyroxine",
    genericName: "左甲状腺素钠片",
    brandName: "优甲乐 / 雷替斯 (Euthyrox / Levothyroxine)",
    generation: "内分泌术后替代与 TSH 促甲状腺激素负反馈抑制双重金标准基石药物",
    target: "Thyroid Hormone Receptor" as any,
    standardDosage: "每日清晨空腹口服一次，依 ATA 复发风险阶梯滴定 (全切术后通常 1.5~2.2 μg/kg/天)",
    metabolismPathway: "在肝脏、肾脏及外周组织经脱碘酶脱碘转化为活性 T3，极易受小肠上段吸收环境与多价金属离子络合影响",
    phDependent: true,
  },
  {
    id: "lenvatinib",
    genericName: "甲磺酸仑伐替尼胶囊",
    brandName: "乐卫玛 (Lenvima / Lenvatinib)",
    generation: "多靶点受体酪氨酸激酶抑制剂 (SELECT 试验确证碘难治性分化型甲状腺癌 RAIR-DTC 一线金标准)",
    target: "VEGFR" as any,
    standardDosage: "24mg 每日一次 (QD) 口服，高龄或低体重者可自 14~20mg 起始滴定",
    metabolismPathway: "主要由肝脏 CYP3A4 介导氧化代谢及醛氧化酶代谢，为小分子多靶点抑制剂",
    phDependent: false,
  },
  {
    id: "sorafenib",
    genericName: "甲苯磺酸索拉非尼片",
    brandName: "多吉美 (Nexavar / Sorafenib)",
    generation: "多激酶口服抑制剂 (DECISION 试验确立局部复发或转移性进展期 RAIR-DTC 治疗标准)",
    target: "VEGFR" as any,
    standardDosage: "400mg (2片) 每日两次 (BID) 口服，空腹或进食低脂/中脂餐后服用",
    metabolismPathway: "经肝脏 CYP3A4 氧化及 UGT1A9 葡萄糖醛酸偶联代谢消除",
    phDependent: false,
  },
  {
    id: "donafenib",
    genericName: "甲苯磺酸多纳非尼片",
    brandName: "泽普生 (Zepzelca / Donafenib)",
    generation: "中国原研重水氘代多靶点 TKI，改善药代动力学稳定性，用于进展期甲状腺癌转化治疗",
    target: "VEGFR" as any,
    standardDosage: "0.2g (2片) 每日两次口服，温开水送服",
    metabolismPathway: "主要经 CYP1A2、CYP2C9 和 CYP3A4 多途径代谢",
    phDependent: false,
  },
  {
    id: "anlotinib",
    genericName: "盐酸安罗替尼胶囊",
    brandName: "福可维 (Focus V / Anlotinib)",
    generation: "中国自主原研高选择性抗血管生成多靶点 TKI (ALTER 01031 确证甲状腺髓样癌 MTC 一线适应证)",
    target: "VEGFR" as any,
    standardDosage: "12mg 每日一次，早餐前口服，连服 2 周停 1 周 (21 天为一周期)",
    metabolismPathway: "主要由肝微粒体酶 CYP3A4 代谢消除",
    phDependent: false,
  },
  {
    id: "pralsetinib",
    genericName: "普拉替尼胶囊",
    brandName: "普吉华 (Gavreto / Pralsetinib)",
    generation: "强效、高选择性口服 RET 抑制剂 (ARROW 试验确证 RET 突变甲状腺髓样癌与 RET 融合 DTC 突破)",
    target: "RET" as any,
    standardDosage: "400mg 每日一次空腹口服 (服药前后 2 小时禁食)",
    metabolismPathway: "主要通过肝脏 CYP3A4 和部分 CYP2D6 代谢清除",
    phDependent: false,
  },
  {
    id: "selpercatinib",
    genericName: "塞珀替尼胶囊",
    brandName: "睿妥 (Retevmo / Selpercatinib)",
    generation: "新一代高穿透选择性 RET 受体酪氨酸激酶抑制剂 (LIBRETTO-531 确立晚期甲状腺髓样癌一线最优地位)",
    target: "RET" as any,
    standardDosage: "体重 <50kg: 120mg bid; 体重 >=50kg: 160mg bid 口服",
    metabolismPathway: "主要依赖肝脏 CYP3A4 代谢",
    phDependent: false,
  },
  {
    id: "dabrafenib_trametinib",
    genericName: "甲磺酸达拉非尼+曲美替尼",
    brandName: "泰菲乐+迈吉宁 (Tafinlar + Mekinist)",
    generation: "BRAF + MEK 联合双靶抑制剂 (FDA/CSCO 批准用于 BRAF V600E 突变甲状腺未分化癌 ATC 奇迹靶向)",
    target: "BRAF" as any,
    standardDosage: "达拉非尼 150mg bid + 曲美替尼 2mg qd 空腹口服",
    metabolismPathway: "达拉非尼主要经 CYP2C8 和 CYP3A4 代谢；曲美替尼主要经非酶促去乙酰化清除",
    phDependent: false,
  },
  {
    id: "cabozantinib",
    genericName: "苹果酸卡博替尼片",
    brandName: "妥克利 / 卡博替尼 (Cabometyx / Cometriq)",
    generation: "广谱多受体酪氨酸激酶抑制剂 (EXAM 试验获批进展期甲状腺髓样癌 MTC 二线)",
    target: "VEGFR" as any,
    standardDosage: "60mg 每日一次空腹口服 (服药前 2 小时及服药后 1 小时内不进食)",
    metabolismPathway: "经肝脏 CYP3A4 代谢消除",
    phDependent: false,
  },
  {
    id: "calcium_vitd",
    genericName: "碳酸钙D3咀嚼片",
    brandName: "钙尔奇 D3 (Caltrate)",
    generation: "甲状腺术后暂时性/永久性甲状旁腺功能减退与低钙血症对症补充基石药物",
    target: "Calcium" as any,
    standardDosage: "每日 600~1800mg 钙元素，分次餐中嚼服，常联合骨化三醇 0.25~0.5 μg bid",
    metabolismPathway: "在酸性胃液中转化为游离钙离子，由十二指肠主动转运和空肠被动吸收",
    phDependent: true,
  },
];

/**
 * 甲状腺癌关键药物相互作用规则库 (包含全医学最核心的优甲乐“2~4小时隔离法则”)
 */
export interface ThyroidDdiRuleItem {
  id: string;
  targetedDrugId: string;
  chronicDrugId: string;
  riskLevel: "severe_contraindication" | "timing_warning" | "timing_caution" | "moderate_caution" | "compatible_safe";
  severityScore: number;
  mechanism: string;
  clinicalManifestation: string;
  management: string;
  evidenceSource: string;
}

const RAW_THYROID_DDI_RULES: ThyroidDdiRuleItem[] = [
  // 1. 优甲乐 (Levothyroxine) + 钙片 (碳酸钙/钙尔奇) —— 4小时隔离法则
  {
    id: "thyroid-ddi-lt4-calcium",
    targetedDrugId: "levothyroxine",
    chronicDrugId: "calcium_vitd",
    riskLevel: "timing_warning",
    severityScore: 2,
    mechanism: "碳酸钙在胃肠道中解离出的二价钙离子会与左甲状腺素钠分子牢固结合形成极难溶解的络合物，导致左甲状腺素的吸收率骤降 30%~50%，引发血清 TSH 显著反弹升高，破坏肿瘤抑制目标。",
    clinicalManifestation: "患者出现甲状腺功能减退症状（嗜睡、乏力、畏寒、水肿），复查发现 TSH 水平严重不达标，甚至误以为优甲乐耐药而盲目加大剂量导致心肌耗氧增加。",
    management: "【严格间隔 4 小时法则】：优甲乐与任何钙剂（包括含钙多维元素片、碳酸钙、葡萄糖酸钙）必须【严格间隔至少 4 小时】！推荐用药时间表：早晨 6:30~7:00 晨起空腹白水送服优甲乐，中午 12:00 或晚上睡前进食餐中服用钙片。",
    evidenceSource: "ATA 2015 甲状腺癌指南 · UpToDate 药物相互作用数据库",
  },

  // 2. 优甲乐 (Levothyroxine) + 补铁剂 (硫酸亚铁/多糖铁) —— 4小时隔离法则
  {
    id: "thyroid-ddi-lt4-iron",
    targetedDrugId: "levothyroxine",
    chronicDrugId: "ferrous_sulfate",
    riskLevel: "timing_warning",
    severityScore: 2,
    mechanism: "铁离子与左甲状腺素在十二指肠酸性环境中易形成不可逆沉淀，严重阻断甲状腺素吸收途径。",
    clinicalManifestation: "术后贫血患者合用补铁药后 TSH 持续控制不良，乏力气短症状加重。",
    management: "【严格间隔 4 小时】：服用硫酸亚铁、琥珀酸亚铁或多糖铁复合物必须与优甲乐错开至少 4 小时以上，不可同一顿温水吞服。",
    evidenceSource: "Endocrine Practice 甲状腺素药物相互作用临床指南",
  },

  // 3. 优甲乐 (Levothyroxine) + 质子泵抑制剂 PPI (奥美拉唑/雷贝拉唑)
  {
    id: "thyroid-ddi-lt4-ppi",
    targetedDrugId: "levothyroxine",
    chronicDrugId: "omeprazole",
    riskLevel: "timing_warning",
    severityScore: 2,
    mechanism: "优甲乐在胃内的充分水解解离极其依赖正常的胃酸分泌环境 (pH 1~2)。长期服用质子泵抑制剂 (PPI) 导致胃内酸度大幅降低，从而显著减少左甲状腺素在小肠上段的主动吸收。",
    clinicalManifestation: "甲癌术后患者因胃炎长期口服奥美拉唑，复查 TSH 从 0.1 mIU/L 异常飙升至 4.5 mIU/L 以上，肿瘤抑制治疗窗失守。",
    management: "【错峰用药与剂量监测】：① 尽量避免在早晨与优甲乐同时服用 PPI 胃药，PPI 改为睡前或晚餐前服用；② 长期使用 PPI 者，需在专科医生指导下将优甲乐每日剂量适当调高 12.5~25 μg，并在服药后 4~6 周复查甲功三项调整。",
    evidenceSource: "Journal of Clinical Endocrinology & Metabolism (JCEM) 研究",
  },

  // 4. 优甲乐 (Levothyroxine) + 华法林 (Warfarin) 抗凝作用致命放大
  {
    id: "thyroid-ddi-lt4-warfarin",
    targetedDrugId: "levothyroxine",
    chronicDrugId: "warfarin",
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "外源性补充甲状腺素可加速机体维生素 K 依赖性凝血因子的分解代谢，使华法林的抗凝活性成倍剧增，患者凝血酶原时间国际标准化比值 (INR) 易剧烈飙升。",
    clinicalManifestation: "轻者牙龈出血、皮下大片淤青紫斑；重者消化道大出血、血尿甚至自发性颅内出血危及生命。",
    management: "【严密监测 INR 并预先减量】：甲癌术后刚开始服用或增加优甲乐剂量时，华法林必须在心血管科医生指导下通常预先减量 20%~30%，并在前 2 周内每 3~5 天严密检测凝血 INR，调整至目标安全范围 (2.0~3.0)。",
    evidenceSource: "FDA 华法林说明书与左甲状腺素药物相互作用黑框警示",
  },

  // 5. 优甲乐 (Levothyroxine) + 降糖药 (二甲双胍/胰岛素)
  {
    id: "thyroid-ddi-lt4-metformin",
    targetedDrugId: "levothyroxine",
    chronicDrugId: "metformin",
    riskLevel: "moderate_caution",
    severityScore: 1,
    mechanism: "甲状腺激素可促进外周肝糖原分解并轻度降低靶细胞胰岛素敏感性，使糖尿病患者口服降糖药疗效发生微小波动。",
    clinicalManifestation: "优甲乐剂量调整期，空腹及餐后血糖可有一过性轻度上浮 (0.5~1.5 mmol/L)。",
    management: "【定期监测血糖】：糖尿病合并甲状腺癌术后患者，在优甲乐调整剂量初期增加指尖血糖自测频次，必要时内分泌科随访微调降糖药剂量即可，两药可安全长期共存。",
    evidenceSource: "中国 2 型糖尿病防治指南 · 甲状腺功能异常合并糖尿病共识",
  },

  // 6. 仑伐替尼 (Lenvatinib) + 强 CYP3A4 抑制剂 (克拉霉素/酮康唑)
  {
    id: "thyroid-ddi-lenva-cyp3a4-inhibitor",
    targetedDrugId: "lenvatinib",
    chronicDrugId: "clarithromycin",
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "仑伐替尼在体内主要依赖肝脏 CYP3A4 酶代谢。克拉霉素、伊曲康唑等强抑制剂阻断其消除，导致仑伐替尼血药暴露量 (AUC) 剧增 2~3 倍。",
    clinicalManifestation: "突发恶性高血压危象、大量蛋白尿、手足皮肤坏死开裂、甚至后部可逆性脑病综合征 (PRES) 及动静脉血栓。",
    management: "【严禁联合强抑制剂】：抗感染必须优先选用阿奇霉素、头孢类或青霉素类；服药期间禁食西柚及西柚汁制品。如必须合用中度抑制剂，仑伐替尼每日剂量需从 24mg 下调至 10~14mg。",
    evidenceSource: "FDA/NMPA 仑伐替尼处方信息 · SELECT 研究药代动力学分析",
  },

  // 7. 仑伐替尼 (Lenvatinib) + 强 CYP3A4 诱导剂 (利福平/卡马西平)
  {
    id: "thyroid-ddi-lenva-cyp3a4-inducer",
    targetedDrugId: "lenvatinib",
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "强 CYP3A4 诱导剂使肝药酶活性暴增，仑伐替尼被极速分解代谢，稳态血药浓度急剧降低 70% 以上。",
    clinicalManifestation: "靶向药物无法维持抗肿瘤治疗浓度，导致碘难治甲癌病灶迅速进展增大。",
    management: "【绝对禁忌】：禁止仑伐替尼与利福平、苯妥英钠等强诱导剂同用；抗癫痫应改用丙戊酸钠或左乙拉西坦。",
    evidenceSource: "CSCO 甲状腺癌靶向药物毒副反应与相互作用临床实践指南",
  },

  // 8. 仑伐替尼 (Lenvatinib) + 降压药 (氨氯地平/缬沙坦) —— 安全增效
  {
    id: "thyroid-ddi-lenva-antihypertensive",
    targetedDrugId: "lenvatinib",
    chronicDrugId: "amlodipine",
    riskLevel: "compatible_safe",
    severityScore: 0,
    mechanism: "仑伐替尼阻断 VEGF 信号引发外周血管强烈痉挛收缩与内皮损伤，引起血压升高 (高血压发生率超 70%)；降压治疗是维持靶向足量使用的护航基石。",
    clinicalManifestation: "合用钙拮抗剂 (CCB) 或 ARB 类降压药，患者血压控制在 130/80 mmHg 以下，靶向耐受良好无心脑并发症。",
    management: "【安全规范配伍】：每天早晚自测血压，首选氨氯地平、硝苯地平控释片或缬沙坦平稳降压；若血压高于 160/100 mmHg 需加用第二种降压药，避免因轻度血压升高而轻易停用仑伐替尼。",
    evidenceSource: "欧洲肿瘤内科学会 (ESMO) 酪氨酸激酶抑制剂高血压管理共识",
  },

  // 9. 普拉替尼 / 塞珀替尼 (Pralsetinib / Selpercatinib) + 强 CYP3A4 抑制剂
  {
    id: "thyroid-ddi-ret-cyp3a4-inhibitor",
    targetedDrugId: "pralsetinib",
    chronicDrugId: "clarithromycin",
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "高选择性 RET 抑制剂普拉替尼/塞珀替尼主要由 CYP3A4 介导代谢。强 CYP3A4 抑制剂会导致血药浓度成倍升高，诱发 QT 间期延长与严重转氨酶爆发性升高。",
    clinicalManifestation: "心悸、恶性心律失常、QTc 间期 >500ms、黄疸、重度肝损伤与间质性肺病。",
    management: "【严禁联合强 CYP3A4 抑制剂】：抗生素避免大环内酯类；若必须合用，普拉替尼剂量需削减 50% 并规律复查心电图与肝功能指标。",
    evidenceSource: "ARROW 试验与 LIBRETTO-531 处方规范",
  },

  // 10. 安罗替尼 (Anlotinib) + 阿司匹林 / 抗凝药出血风险叠加
  {
    id: "thyroid-ddi-anlotinib-anticoagulant",
    targetedDrugId: "anlotinib",
    chronicDrugId: "aspirin",
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "安罗替尼强效抑制血管内皮细胞迁移与基底膜生成，本身具有咯血、气道及消化道出血风险；联合抗血小板药阿司匹林会极大破坏血小板血栓形成保护机制。",
    clinicalManifestation: "咳血痰、大咯血、颈部手术创面深部血肿压迫气管引起窒息、消化道大出血。",
    management: "【谨慎权衡与禁忌联用】：安罗替尼用药期间尽量避免合用全剂量阿司匹林或双抗血小板治疗；若出现任何咯血（哪怕仅是痰中带鲜血丝），必须立即永久停用安罗替尼！",
    evidenceSource: "NMPA 安罗替尼说明书黑框出血警报 · ALTER-01031 试验",
  },
];

export const THYROID_DDI_RULES: DdiRule[] = RAW_THYROID_DDI_RULES.map((r) => ({
  ...r,
  targetDrugIds: [r.targetedDrugId],
  clinicalGuidance: r.management,
}));

/**
 * 甲状腺癌专属药物相互作用 (DDI) 分析计算引擎
 */
export function checkThyroidDrugInteractions(
  targetDrugId: string,
  chronicDrugIds: string[]
): DdiAnalysisResult {
  const targetedDrug = THYROID_TARGETED_DRUGS.find((d) => d.id === targetDrugId);
  if (!targetedDrug) {
    return {
      targetedDrug: {
        id: targetDrugId,
        genericName: "未收录药物",
        brandName: "未知",
        generation: "未明确分类",
        target: "Thyroid Hormone Receptor" as any,
        standardDosage: "遵医嘱",
        metabolismPathway: "未知",
        phDependent: false,
      },
      chronicDrugs: [],
      selectedChronicDrugs: [],
      totalChecked: 0,
      severeCount: 0,
      cautionCount: 0,
      safeCount: 0,
      interactions: [],
      overallStatus: "safe",
      summaryText: "未见明确相互作用",
      dailySchedulePlan: [],
      dangerCount: 0,
      warningCount: 0,
    };
  }

  const chronicDrugs = chronicDrugIds
    .map((id) => ALL_CHRONIC_DRUGS.find((c) => c.id === id))
    .filter((c): c is ChronicDrug => Boolean(c));

  // 检索匹配所有触发的规则
  const interactions = THYROID_DDI_RULES.filter(
    (rule) =>
      (rule.targetedDrugId === targetDrugId || rule.targetDrugIds?.includes(targetDrugId)) &&
      chronicDrugIds.includes(rule.chronicDrugId)
  ).map((rule) => {
    const chronicDrug = ALL_CHRONIC_DRUGS.find((c) => c.id === rule.chronicDrugId)!;
    return {
      rule,
      targetedDrug,
      chronicDrug,
    };
  });

  const dangerCount = interactions.filter((i) => i.rule.riskLevel === "severe_contraindication").length;
  const warningCount = interactions.filter(
    (i) => i.rule.riskLevel === "timing_warning" || i.rule.riskLevel === "timing_caution" || i.rule.riskLevel === "moderate_caution"
  ).length;
  const safeCount = interactions.filter((i) => i.rule.riskLevel === "compatible_safe").length;

  let overallStatus: "safe" | "caution" | "danger" = "safe";
  if (dangerCount > 0) {
    overallStatus = "danger";
  } else if (warningCount > 0) {
    overallStatus = "caution";
  }

  return {
    targetedDrug,
    chronicDrugs,
    selectedChronicDrugs: chronicDrugs,
    totalChecked: chronicDrugs.length,
    severeCount: dangerCount,
    cautionCount: warningCount,
    safeCount,
    dangerCount,
    warningCount,
    overallStatus,
    summaryText: dangerCount > 0 ? `检测到 ${dangerCount} 项高风险配伍禁忌，请立即调整！` : warningCount > 0 ? `检测到 ${warningCount} 项时序管理提醒` : "未见明确危险相互作用",
    interactions,
    dailySchedulePlan: [],
  };
}
