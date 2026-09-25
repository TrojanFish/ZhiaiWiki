import type { TargetedDrug, ChronicDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

/**
 * 食管癌/食管鳞癌 (ESCC) 临床主流靶向、免疫及核心化疗药物库 (10 种代表性核心药物)
 */
export const ESOPHAGEAL_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "camrelizumab",
    genericName: "卡瑞利珠单抗注射液",
    brandName: "艾瑞卡 (AiRuiKa)",
    generation: "中国原研人源化抗 PD-1 单克隆抗体 (ESCORT-1st 一线方案核心)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每3周一次 (Q3W)，联合紫杉醇与顺铂",
    metabolismPathway: "通过体内免疫球蛋白非特异性肽链降解消除，无 P450 代谢负担",
    phDependent: false,
  },
  {
    id: "tislelizumab",
    genericName: "替雷利珠单抗注射液",
    brandName: "百泽安 (Baizean)",
    generation: "中国原研改造 Fc 段抗 PD-1 单抗 (RATIONALE-306 获 NMPA/FDA 批准)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每3周一次 (Q3W)，联合含铂双药化疗",
    metabolismPathway: "通过单核巨噬细胞系统水解降解消除",
    phDependent: false,
  },
  {
    id: "pembrolizumab",
    genericName: "帕博利珠单抗注射液",
    brandName: "可瑞达 (Keytruda)",
    generation: "全人源化抗 PD-1 单克隆抗体 (KEYNOTE-590 权威证据)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每3周一次 或 400mg 每6周一次",
    metabolismPathway: "通过组织分解酶降解清除",
    phDependent: false,
  },
  {
    id: "toripalimab",
    genericName: "特瑞普利单抗注射液",
    brandName: "拓益 (Tuoyi)",
    generation: "中国自主原研重组人源化抗 PD-1 单抗 (JUPITER-06 方案核心)",
    target: "PD-1" as any,
    standardDosage: "240mg 静脉滴注 每3周一次 (Q3W)，联合紫杉醇与顺铂",
    metabolismPathway: "体内免疫球蛋白正常分解代谢途径",
    phDependent: false,
  },
  {
    id: "serplulimab",
    genericName: "斯鲁利单抗注射液",
    brandName: "汉斯状 (Hansizhuang)",
    generation: "中国原研抗 PD-1 单克隆抗体 (ASTRUM-007 一线食管鳞癌适应证)",
    target: "PD-1" as any,
    standardDosage: "3mg/kg 静脉滴注 每2周一次 或 200mg 每3周一次",
    metabolismPathway: "通过体内蛋白水解消除",
    phDependent: false,
  },
  {
    id: "cisplatin",
    genericName: "顺铂注射液",
    brandName: "诺欣 / 普莱乐",
    generation: "细胞周期非特异性铂类烷化剂 (食管癌新辅助/晚期一线化疗基石)",
    target: "DNA" as any,
    standardDosage: "60~75mg/m² 分1~3天静脉滴注，每3周重复，必须强化充分水化利尿",
    metabolismPathway: "主要以原型及含铂复合物经肾脏排泄，具有蓄积性肾毒性与耳毒性",
    phDependent: false,
  },
  {
    id: "paclitaxel",
    genericName: "紫杉醇注射液 / 白蛋白结合型紫杉醇",
    brandName: "泰素 / 克艾力",
    generation: "微管蛋白聚合促进与稳定剂 (食管鳞癌一线高敏感药物)",
    target: "Microtubule" as any,
    standardDosage: "135~175mg/m² 静脉滴注 3小时，每3周重复（需预处理预防过敏反应）",
    metabolismPathway: "主要经肝脏 CYP2C8 和 CYP3A4 酶代谢，经胆道随粪便排出",
    phDependent: false,
  },
  {
    id: "nedaplatin",
    genericName: "奈达铂注射液",
    brandName: "奥先达",
    generation: "第二代有机铂类抗肿瘤药 (头颈鳞癌与食管鳞癌中国指南优先推荐)",
    target: "DNA" as any,
    standardDosage: "80~100mg/m² 静脉滴注，每3~4周重复，肾毒性较顺铂显著减轻",
    metabolismPathway: "主要通过肾脏排泄，剂量限制性毒性为骨髓抑制（尤其是血小板减少）",
    phDependent: false,
  },
  {
    id: "vinorelbine",
    genericName: "重酒石酸长春瑞滨注射液",
    brandName: "盖诺 (Navelbine)",
    generation: "半合成半长春花生物碱 (NEOCRTEC5010 中国新辅助放化疗标准方案)",
    target: "Microtubule" as any,
    standardDosage: "25mg/m² 静脉滴注，第1、8天给药，每3周重复",
    metabolismPathway: "广泛经肝脏 CYP3A4 代谢，主要经胆道和粪便排泄",
    phDependent: false,
  },
  {
    id: "anlotinib",
    genericName: "盐酸安罗替尼胶囊",
    brandName: "福可维 (Focus V)",
    generation: "多靶点受体酪氨酸激酶抑制剂 (VEGFR/FGFR/PDGFR/c-Kit)",
    target: "VEGFR" as any,
    standardDosage: "12mg 每日一次 口服，连服2周停1周 (3周为一周期)",
    metabolismPathway: "主要经肝脏 CYP3A4 代谢，伴中重度高血压与穿孔出血风险",
    phDependent: false,
  },
];

export const ESOPHAGEAL_DRUGS = ESOPHAGEAL_TARGETED_DRUGS;

/**
 * 食管癌专科药物配伍相互作用规则 (DDI Rules)
 */
export const ESOPHAGEAL_DDI_RULES: DdiRule[] = [
  {
    id: "esophageal-ddi-anlotinib-anticoagulant",
    targetDrugIds: ["anlotinib"],
    chronicDrugId: "warfarin",
    riskLevel: "severe_contraindication",
    title: "安罗替尼合并华法林/抗凝药：食管坏死致死性大出血红线警报",
    riskLabel: "穿孔大出血禁忌",
    mechanism: "安罗替尼强效抑制 VEGFR2 及 PDGFR，造成毛细血管通透性降低与食管内皮缺血坏死，叠加华法林强抗凝极易诱发致命性食管原发灶或降主动脉破溃大出血。",
    clinicalGuidance: "安罗替尼为强效抗血管生成激酶抑制剂。食管癌患者（特别是溃疡型或伴气管/主动脉侵犯者）合并华法林等全量抗凝药时，肿瘤缺血坏死可导致食管穿孔、气管瘘甚至降主动脉破裂致死性大出血！必须严格评估肿瘤部位，禁忌两药联合使用。",
    evidenceLevel: "FDA/NMPA说明书",
    timingRecommendation: "存在溃疡型食管病变或未控制的出血风险者绝对禁用；如需抗凝，优先在肿瘤外科评估后单药微量调整或停用抗血管生成药物。",
  },
  {
    id: "esophageal-ddi-anlotinib-rivaroxaban",
    targetDrugIds: ["anlotinib"],
    chronicDrugId: "rivaroxaban",
    riskLevel: "severe_contraindication",
    title: "安罗替尼合并利伐沙班：新型口服抗凝药诱发消化道大出血风险",
    riskLabel: "消化道穿孔出血",
    mechanism: "利伐沙班直接拮抗凝血因子 Xa，与安罗替尼内皮抑制协同破坏创面止血机制，引发出血甚至食管穿孔破裂。",
    clinicalGuidance: "利伐沙班直接抑制凝血因子Xa，与抗血管药安罗替尼合用时，缺乏特异性逆转剂情况下可诱发致命性食管原发灶穿孔出血。",
    evidenceLevel: "FDA/NMPA说明书",
    timingRecommendation: "严格禁忌合用。必须经心内科与胸部肿瘤科多学科（MDT）会诊权衡血栓与穿孔出血风险。",
  },
  {
    id: "esophageal-ddi-cisplatin-aminoglycoside",
    targetDrugIds: ["cisplatin"],
    chronicDrugId: "gentamicin",
    riskLevel: "severe_contraindication",
    title: "顺铂合并氨基糖苷类抗生素：双重重度不可逆肾衰与听力丧失",
    riskLabel: "不可逆耳肾毒性",
    mechanism: "顺铂与氨基糖苷类抗生素均经肾小管排泄并在近端肾小管上皮及内耳毛细胞高浓度蓄积，双重机制叠加造成永久性感音神经性耳聋和急性肾小管坏死。",
    clinicalGuidance: "顺铂本身具有强蓄积性肾小管上皮细胞毒性及内耳毛细胞损伤，氨基糖苷类抗生素（庆大霉素/阿米卡星）同样经肾排泄并具有耳肾毒性。两者联用导致永久性双耳听力丧失与急性肾衰竭风险呈几何倍数增加，严禁合用！",
    evidenceLevel: "FDA/NMPA说明书",
    timingRecommendation: "化疗期间严禁使用氨基糖苷类；抗感染优先换用三代头孢菌素、哌拉西林他唑巴坦或碳青霉烯类，顺铂给药前后必须规范水化（每日液体量 2000~3000mL）。",
  },
  {
    targetDrugIds: ["cisplatin"],
    chronicDrugId: "furosemide",
    riskLevel: "timing_caution",
    title: "顺铂化疗期间速尿利尿：耳毒性加剧与脱水肾损伤警示",
    riskLabel: "耳毒性叠加/脱水风险",
    mechanism: "速尿强效抑制髓袢升支粗段 Na+-K+-2Cl- 同向转运蛋白，骤然增加内耳淋巴液渗透压并使未排泄顺铂血药峰浓度骤升，协同诱发内耳毛细胞脱水坏死。",
    clinicalGuidance: "顺铂水化过程中，只有在充分水化（滴注 1000mL 以上生理盐水）后尿量仍不足时方可谨慎使用小剂量甘露醇或速尿。大剂量强效袢利尿剂（呋塞米）可导致内耳淋巴液电解质紊乱并使血铂浓度骤升，造成永久性听力损害。",
    evidenceLevel: "权威前瞻临床研究",
    timingRecommendation: "严禁在顺铂充分补液前盲目推注速尿；首选生理盐水静脉水化维持尿量 >100mL/h，必要时选用甘露醇低剂量脱水。",
  },
  {
    targetDrugIds: ["paclitaxel", "vinorelbine"],
    chronicDrugId: "clarithromycin",
    riskLevel: "timing_caution",
    title: "紫杉醇/长春瑞滨合并克拉霉素：CYP3A4 强抑制加重重度骨髓抑制",
    riskLabel: "代谢延缓/骨髓毒性增加",
    mechanism: "克拉霉素为强效 CYP3A4 竞争性抑制剂，阻断紫杉醇与长春瑞滨的肝微粒体氧化代谢，使全身血药清除率降低 40%~60%，重度骨髓抑制风险陡增。",
    clinicalGuidance: "紫杉醇与长春瑞滨主要经肝脏微粒体 CYP3A4 与 CYP2C8 代谢。克拉霉素等大环内酯类抗生素属于 CYP3A4 强抑制剂，可延缓化疗药物清除，使全身血药暴露量 (AUC) 上升 50% 以上，显著加剧 IV 度粒细胞缺乏与外周神经病变。",
    evidenceLevel: "药代动力学PK证据",
    timingRecommendation: "化疗期间如需抗菌治疗，建议选用阿奇霉素（无明显 CYP3A4 抑制）或头孢类抗生素，避免使用克拉霉素。",
  },
  {
    targetDrugIds: ["camrelizumab", "tislelizumab", "pembrolizumab", "toripalimab", "serplulimab"],
    chronicDrugId: "dexamethasone",
    riskLevel: "timing_caution",
    title: "PD-1 免疫单抗合并大剂量皮质激素：免疫抗肿瘤疗效减弱风险",
    riskLabel: "免疫应答抑制",
    mechanism: "高剂量全身性糖皮质激素通过细胞质 GR 受体抑制 NF-κB 与 AP-1 活性，全面下调 CD8+ T 细胞扩增与细胞因子分泌，降低免疫检查点抑制剂长期缓解率。",
    clinicalGuidance: "基础剂量的泼尼松（>10mg/天或等效地塞米松）具有全身免疫抑制作用，在 PD-1 单抗启始治疗时合用可显著削弱 T 细胞激活与抗肿瘤长期应答。但化疗止吐预处理所用短期单次地塞米松不影响长期疗效，出现免疫相关不良反应 (irAE) 时则应规范足量使用糖皮质激素拯救治疗。",
    evidenceLevel: "权威前瞻临床研究",
    timingRecommendation: "治疗前非必需的长期口服激素应在专科医师指导下逐渐减量至生理剂量；化疗止吐采用短程最低有效剂量，一旦疑诊免疫性心肌炎/肺炎等 irAE 立即启动高剂量冲击。",
  },
  {
    targetDrugIds: ["*"],
    chronicDrugId: "omeprazole",
    riskLevel: "compatible_safe",
    title: "质子泵抑制剂 (PPI)：术后胸胃反流保护与微量元素监测",
    riskLabel: "抗反流保护剂",
    mechanism: "不可逆共价结合胃壁细胞 H+/K+-ATP 酶阻断胃酸终末分泌，减少胸胃酸液反流刺激食管残端吻合口与气管黏膜。",
    clinicalGuidance: "食管切除管状胃重建术后，食管下括约肌 (LES) 结构切除导致抗反流屏障消失，胃酸及胆汁极易反流至残存颈段/胸段食管引发严重灼痛与吻合口炎。口服奥美拉唑等 PPI 是防治反流与保护吻合口的基石药物，但长期服用需警惕维生素 B12 及钙离子吸收不良。",
    evidenceLevel: "权威前瞻临床研究",
    timingRecommendation: "术后空腹或进食前半小时服用；睡前保持 30°~45° 半卧位抬高床头，避免平卧导致反流误吸窒息。",
  },
];

/**
 * 食管癌专科 DDI 交互核查引擎
 */
export function checkEsophagealDdi(
  targetedDrugId: string,
  chronicDrugIds: string[]
): DdiAnalysisResult {
  const targetedDrug = ESOPHAGEAL_DRUGS.find((d) => d.id === targetedDrugId) || null;
  const selectedChronicDrugs = ALL_CHRONIC_DRUGS.filter((d) =>
    chronicDrugIds.includes(d.id)
  );

  const interactions: Array<{ chronicDrug: ChronicDrug; rule: DdiRule }> = [];
  let severeCount = 0;
  let cautionCount = 0;
  let safeCount = 0;

  for (const chronicDrug of selectedChronicDrugs) {
    const matchedRule = ESOPHAGEAL_DDI_RULES.find((rule) => {
      const drugMatch =
        rule.targetDrugIds.includes("*") ||
        rule.targetDrugIds.includes(targetedDrugId);
      const chronicMatch = rule.chronicDrugId === chronicDrug.id;
      return drugMatch && chronicMatch;
    });

    if (matchedRule) {
      interactions.push({ chronicDrug, rule: matchedRule });
      if (matchedRule.riskLevel === "severe_contraindication") {
        severeCount++;
      } else if (matchedRule.riskLevel === "timing_caution") {
        cautionCount++;
      } else {
        safeCount++;
      }
    } else {
      safeCount++;
    }
  }

  let overallStatus: "safe" | "warning" | "danger" = "safe";
  let summaryText = "经食管癌专科用药配伍核查，未发现高危配伍禁忌。";

  if (severeCount > 0) {
    overallStatus = "danger";
    summaryText = `警报！检测到 ${severeCount} 项严重配伍禁忌（如安罗替尼诱发穿孔大出血、顺铂与氨基糖苷类耳肾双重毒性），请务必经 MDT 专家评估！`;
  } else if (cautionCount > 0) {
    overallStatus = "warning";
    summaryText = `检测到 ${cautionCount} 项需注意服药时序（如顺铂水化利尿、CYP3A4 强抑制剂加重紫杉醇骨髓毒性）的协同规则，建议依规调整服药方案。`;
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
        timeSlot: "早晨 07:00 (空腹 / 晨起)",
        drugs: ["质子泵抑制剂奥美拉唑等 (术后抗反流)", "降压药 (若有)"],
        note: "保护管状胃与残端吻合口黏膜，控制清晨晨峰血压。"
      },
      {
        timeSlot: "上午 09:00 (化疗/免疫滴注阶段)",
        drugs: [targetedDrug?.genericName || "食管癌专科治疗 (如卡瑞利珠/替雷利珠单抗或顺铂+紫杉醇)"],
        note: "含顺铂方案必须足量水化补液，维持每小时尿量 >100mL；注意避光滴注与过敏预处理。"
      },
      {
        timeSlot: "夜间 21:00 (睡前半小时)",
        drugs: ["抗反流黏膜保护剂 (铝碳酸镁嚼服或胃动力药)"],
        note: "睡前 2 小时禁食禁水，睡眠时床头抬高 30 度，预防夜间胃酸反流呛咳。"
      }
    ]
  };
}

export const checkEsophagealDrugInteractions = checkEsophagealDdi;
