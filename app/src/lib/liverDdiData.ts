import type { TargetedDrug, ChronicDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

/**
 * 原发性肝癌 (HCC) 临床主流靶向、免疫及抗病毒药物库 (10 种代表性核心药物)
 */
export const LIVER_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "atezolizumab",
    genericName: "阿替利珠单抗注射液",
    brandName: "泰圣奇 (Tecentriq)",
    generation: "全人源化抗 PD-L1 单克隆抗体 (IMbrave150 一线方案核心)",
    target: "PD-L1" as any,
    standardDosage: "1200mg 静脉滴注 每3周一次 (Q3W)，与贝伐珠单抗同日给药",
    metabolismPathway: "通过非特异性网状内皮系统分解消除，无肝药酶 P450 代谢依赖",
    phDependent: false,
  },
  {
    id: "bevacizumab",
    genericName: "贝伐珠单抗注射液",
    brandName: "安维汀 / 达攸同 (Avastin)",
    generation: "重组人源化抗 VEGF 血管内皮生长因子单抗",
    target: "VEGF" as any,
    standardDosage: "15mg/kg 静脉滴注 每3周一次 (与阿替利珠单抗或信迪利单抗联合)",
    metabolismPathway: "经组织蛋白水解清除，半衰期约 20 天",
    phDependent: false,
  },
  {
    id: "sintilimab",
    genericName: "信迪利单抗注射液",
    brandName: "达伯舒 (Tyvyt)",
    generation: "中国原研全人源抗 PD-1 单克隆抗体 (ORIENT-32 方案核心)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每3周一次 (Q3W)，联合贝伐珠单抗生物类似药",
    metabolismPathway: "通过体内免疫球蛋白正常降解途径水解清除",
    phDependent: false,
  },
  {
    id: "lenvatinib",
    genericName: "甲磺酸仑伐替尼胶囊",
    brandName: "乐卫玛 (Lenvima)",
    generation: "多靶点受体酪氨酸激酶 (VEGFR 1-3, FGFR 1-4, RET, KIT) 口服小分子抑制剂",
    target: "VEGFR" as any,
    standardDosage: "体重 <60kg: 8mg 每日一次; 体重 >=60kg: 12mg 每日一次 口服",
    metabolismPathway: "主要经肝脏 CYP3A4 代谢以及醛氧化酶途径代谢，轻中度肝损需密切监控",
    phDependent: false,
  },
  {
    id: "donafenib",
    genericName: "甲苯磺酸多纳非尼片",
    brandName: "泽普生 (Zepzelca/Donafenib)",
    generation: "中国自主原研重水氘代多靶点激酶抑制剂 (ZGDH9 一线试验确证)",
    target: "VEGFR" as any,
    standardDosage: "0.2g (2片) 每日两次 口服，空腹或进少许低脂餐后服用",
    metabolismPathway: "经肝脏 CYP1A2、CYP2C9 及 CYP3A4 多途径氧化代谢，氘代结构提高代谢稳定性",
    phDependent: false,
  },
  {
    id: "sorafenib",
    genericName: "甲苯磺酸索拉非尼片",
    brandName: "多吉美 (Nexavar)",
    generation: "经典口服多激酶抑制剂 (Raf/MEK/ERK 途径及 VEGFR/PDGFR)",
    target: "VEGFR" as any,
    standardDosage: "0.4g (2片) 每日两次 口服，空腹或伴低脂中脂饮食温水送服",
    metabolismPathway: "主要由肝脏 CYP3A4 介导氧化代谢，以及 UGT1A9 介导的葡萄糖醛酸酸化",
    phDependent: false,
  },
  {
    id: "regorafenib",
    genericName: "瑞戈非尼片",
    brandName: "拜万戈 (Stivarga)",
    generation: "二线口服多靶点激酶抑制剂 (RESORCE 试验二线金标准)",
    target: "VEGFR" as any,
    standardDosage: "160mg 每日一次 随低脂早餐口服，连服21天停7天 (28天一周期)",
    metabolismPathway: "主要经 CYP3A4 介导代谢，次要经 UGT1A9 代谢，具活性代谢产物 M-2 和 M-5",
    phDependent: false,
  },
  {
    id: "entecavir",
    genericName: "恩替卡韦片/胶囊",
    brandName: "博路定 (Baraclude)",
    generation: "慢性乙型肝炎一线强效、高耐药屏障鸟嘌呤核苷类似物抗病毒药",
    target: "Other" as any,
    standardDosage: "0.5mg 每日一次 空腹服用 (进餐前后至少2小时)",
    metabolismPathway: "不经细胞色素 P450 酶代谢，主要以原型经肾小球滤过和肾小管排泄",
    phDependent: false,
  },
  {
    id: "tenofovir_alafenamide",
    genericName: "富马酸丙酚替诺福韦片 (TAF)",
    brandName: "韦立得 (Vemlidy)",
    generation: "新型靶向肝细胞核苷酸逆转录酶抑制剂 (靶向肝脏，骨肾安全性极高)",
    target: "Other" as any,
    standardDosage: "25mg 每日一次 随食物口服",
    metabolismPathway: "在肝细胞内被羧酸酯酶-1 (CES1) 高效水解激活，全身血浆暴露量降低 89%",
    phDependent: false,
  },
  {
    id: "camrelizumab",
    genericName: "注射用卡瑞利珠单抗",
    brandName: "艾瑞卡 (AiRuiKa)",
    generation: "人源化抗 PD-1 单抗 (CARES-310 双艾方案一线获批，中位 OS 创纪录 23.8 个月)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每2周或每3周一次，联合甲磺酸阿帕替尼",
    metabolismPathway: "通过非特异性网状内皮系统分解为氨基酸与小肽，无 P450 代谢负担",
    phDependent: false,
  },
];

/**
 * 肝癌专属药物相互作用规则库 (DDI Rules)
 * 重点防范：
 * 1. 抗血管靶向药 (贝伐/仑伐) 诱发食管胃底静脉曲张大出血（与抗凝药联用时致命）；
 * 2. 靶向药 (仑伐/多纳) 诱发急剧高血压危象与降压药时序管理；
 * 3. 强效 CYP3A4 酶诱导剂削弱抗肿瘤血药浓度；
 * 4. 肝硬化低白蛋白与肾功能减退状态下的药物蓄积。
 */
export const LIVER_DDI_RULES: DdiRule[] = [
  // 1. 贝伐珠单抗与口服 TKI 抗血管靶向药与抗凝药 (致命上消化道出血预警)
  {
    id: "liver-ddi-tki-warfarin-bleeding",
    targetDrugIds: ["bevacizumab", "lenvatinib", "donafenib", "sorafenib", "regorafenib"],
    chronicDrugId: "warfarin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 消化道大出血风险",
    title: "抗血管靶向药 (贝伐珠/仑伐替尼等) ✕ 华法林：肝硬化门脉高压并发致死性曲张静脉出血",
    mechanism: "抗血管生成药物抑制内皮修复并增加毛细血管脆性，与强效抗凝药华法林合用时，在肝硬化门脉高压（常伴食管胃底静脉曲张）患者中极易诱发无法控制的致命性消化道大出血！",
    clinicalGuidance: "【致死性配伍禁忌】：在肝癌合并门脉高压患者中，抗 VEGF 靶向联合全量抗凝极度危险！用药前必须常规胃镜检查，重度静脉曲张者必须行内镜下套扎 (EVL) 或硬化剂止血后再评估；若确需抗栓，需多学科会诊严格评估并换用低分子肝素密切监测！",
    evidenceLevel: "FDA/NMPA说明书",
    timingRecommendation: "禁忌同服，严密胃镜筛查并换用低分子肝素皮下注射。",
  },
  {
    id: "liver-ddi-bevacizumab-aspirin",
    targetDrugIds: ["bevacizumab"],
    chronicDrugId: "aspirin",
    riskLevel: "timing_caution",
    riskLabel: "配伍注意 · 黏膜糜烂出血",
    title: "贝伐珠单抗 ✕ 阿司匹林：轻度增加胃黏膜糜烂出血风险",
    mechanism: "贝伐珠单抗联合抗血小板药阿司匹林可能增加胃黏膜糜烂及轻微消化道出血风险。",
    clinicalGuidance: "【出血警示】：合并服用阿司匹林期间，严密观察大便颜色（警惕黑便/柏油便），每周监测血红蛋白；必要时联合质子泵抑制剂 (PPI) 保护胃黏膜。",
    evidenceLevel: "权威前瞻临床研究",
    timingRecommendation: "早晚餐后错峰服用，警惕柏油样黑便。",
  },
  // 2. 仑伐替尼与降压药 (高血压危象与全天监测)
  {
    id: "liver-ddi-tki-bp-monitoring",
    targetDrugIds: ["lenvatinib", "donafenib", "sorafenib", "regorafenib"],
    chronicDrugId: "amlodipine",
    riskLevel: "timing_caution",
    riskLabel: "时序注意 · 强化血压控制",
    title: "多靶点 TKI ✕ 降压药：VEGFR 抑制剂所致高血压全天强化监测",
    mechanism: "抗 VEGFR 多靶点 TKI 通过抑制血管内皮一氧化氮合成导致广泛外周血管收缩，3级严重高血压发生率高达 25%~40%。",
    clinicalGuidance: "【高血压全天监测与强化控制】：开始服用靶向药前必须先将基线血压控制在 <140/90 mmHg；服药后每日早晚各测一次血压并记录血压日志。若血压 ≥160/100 mmHg，需在医生指导下加用氨氯地平或联合普利/沙坦类降压药，切勿盲目自行停用靶向药。",
    evidenceLevel: "权威前瞻临床研究",
    timingRecommendation: "降压药晨起服用，靶向药午餐或早餐后固定时间服用。",
  },
  // 3. 强效 CYP3A4 诱导剂加速 TKI 代谢
  {
    id: "liver-ddi-tki-rifampin-induction",
    targetDrugIds: ["lenvatinib", "sorafenib", "regorafenib", "donafenib"],
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 靶向药严重失效",
    title: "多靶点 TKI ✕ 利福平：强效诱导 CYP3A4 导致抗肿瘤浓度暴跌",
    mechanism: "利福平是极其强效的肝脏 CYP3A4 和 P-gp 诱导剂，可将口服小分子 TKI 的全身血药浓度 (AUC) 降低 50%~80%，导致靶向药物彻底失去抗肿瘤活性！",
    clinicalGuidance: "【抗肿瘤失效风险】：严禁将利福平等强效 CYP3A4 诱导剂与靶向 TKI 联合使用；若合并结核等感染，应咨询感染科医生换用不依赖 CYP3A4 的替代抗结核方案。",
    evidenceLevel: "药代动力学PK证据",
    timingRecommendation: "禁忌同服，须由感染科换用不经 CYP3A4 代谢的抗结核方案。",
  },
  // 4. 恩替卡韦服药时序 (食物显著降低吸收)
  {
    id: "liver-ddi-etv-fasting-timing",
    targetDrugIds: ["entecavir"],
    chronicDrugId: "*",
    riskLevel: "timing_caution",
    riskLabel: "服药时序 · 严格空腹服药",
    title: "恩替卡韦 ✕ 食物/慢病药物：食物显著降低抗病毒血药峰浓度",
    mechanism: "恩替卡韦口服吸收受食物影响极大，餐后服用会导致血药峰浓度降低 44%~46%，削弱抗乙肝病毒效能。",
    clinicalGuidance: "【严格空腹服药口诀】：恩替卡韦必须保持严格空腹，即餐前至少 2 小时或餐后至少 2 小时用温水送服（通常建议每晚睡前固定空腹服用，与早晨的降压药及午间的靶向药天然错峰）。",
    evidenceLevel: "FDA/NMPA说明书",
    timingRecommendation: "每晚 22:00 睡前空腹单药温水送服，餐前后间隔 ≥2 小时。",
  },
  // 5. 质子泵抑制剂 (PPI) 与口服靶向吸收
  {
    targetDrugIds: ["lenvatinib", "regorafenib"],
    chronicDrugId: "omeprazole",
    riskLevel: "timing_caution",
    riskLabel: "时序注意 · 抑酸药错峰间隔",
    title: "仑伐替尼/瑞戈非尼 ✕ 奥美拉唑：胃内 pH 改变可能影响小分子溶出",
    mechanism: "奥美拉唑等抑酸药显著提升胃内 pH 值，虽然对仑伐替尼溶解度影响较部分一代 EGFR-TKI 略小，但在胃肠排空迟缓者中仍可能轻微影响吸收稳态。",
    clinicalGuidance: "【服药错峰建议】：若需服用奥美拉唑抑酸护胃，建议在早晨空腹 07:00 服用，将靶向药安排在早饭后 1.5~2 小时服用，两药错开 2 小时以上以确保吸收不受影响。",
    evidenceLevel: "药代动力学PK证据",
    timingRecommendation: "晨起 07:00 空腹服用奥美拉唑，靶向药于 09:30 或午后服用。",
  },
];

/**
 * 原发性肝癌 DDI 智能核查分析器
 */
export function checkLiverDdi(
  targetedDrugId: string,
  chronicDrugIds: string[]
): DdiAnalysisResult {
  const targetedDrug = LIVER_TARGETED_DRUGS.find(d => d.id === targetedDrugId) || null;
  const selectedChronicDrugs = ALL_CHRONIC_DRUGS.filter(c => chronicDrugIds.includes(c.id));

  const interactions: Array<{ chronicDrug: ChronicDrug; rule: DdiRule }> = [];
  let severeCount = 0;
  let cautionCount = 0;
  let safeCount = 0;

  for (const chronicDrug of selectedChronicDrugs) {
    const matchedRule = LIVER_DDI_RULES.find(
      r => (r.targetDrugIds.includes(targetedDrugId) || r.targetDrugIds.includes("*")) &&
           (r.chronicDrugId === chronicDrug.id || r.chronicDrugId === "*")
    );

    if (matchedRule) {
      interactions.push({ chronicDrug, rule: matchedRule });
      if (matchedRule.riskLevel === "severe_contraindication") severeCount++;
      else if (matchedRule.riskLevel === "timing_caution") cautionCount++;
      else safeCount++;
    } else {
      safeCount++;
    }
  }

  let overallStatus: "danger" | "warning" | "safe" = "safe";
  let summaryText = "当前选中的合并用药未见明确肝癌专科配伍禁忌，可按规范医嘱持续监测服用。";

  if (severeCount > 0) {
    overallStatus = "danger";
    summaryText = `⚠️ 检测到 ${severeCount} 项高危配伍风险！重点涉及抗血管靶向药合并抗凝诱发食管胃底静脉曲张致命大出血或靶向代谢失效，请务必遵专科医嘱调整！`;
  } else if (cautionCount > 0) {
    overallStatus = "warning";
    summaryText = `检测到 ${cautionCount} 项需注意服药时序（如恩替卡韦严格空腹、靶向药诱发高血压监测）的协同规则，建议依规错峰服药。`;
  }

  return {
    targetedDrug,
    selectedChronicDrugs,
    totalChecked: selectedChronicDrugs.length,
    severeCount,
    cautionCount,
    safeCount,
    overallStatus,
    summaryText,
    interactions,
    dailySchedulePlan: [
      {
        timeSlot: "早晨 07:00 (空腹)",
        drugs: ["降压药 (如氨氯地平/缬沙坦)", "若有质子泵抑制剂奥美拉唑等"],
        note: "提前控制晨峰血压，并与靶向药错开 1.5~2 小时。"
      },
      {
        timeSlot: "上午 09:00 (早餐后1~2小时)",
        drugs: [targetedDrug?.genericName || "肝癌专科靶向药 (如仑伐替尼/多纳非尼)"],
        note: "温水整粒送服，每日相对固定时间服用，记录当日晨起血压。"
      },
      {
        timeSlot: "夜间 22:00 (睡前严格空腹)",
        drugs: ["恩替卡韦 (若在服)"],
        note: "恩替卡韦必须保持餐前/餐后至少2小时严格空腹，睡前服用吸收率最高且依从性好。"
      }
    ]
  };
}

export const checkLiverDrugInteractions = checkLiverDdi;
