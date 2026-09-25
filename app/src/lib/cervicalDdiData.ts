import type { TargetedDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

/**
 * 宫颈癌 (Cervical Cancer) 临床主流免疫、抗血管、放疗增敏化疗及 ADC 药物库
 */
export const CERVICAL_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "pembrolizumab",
    genericName: "帕博利珠单抗注射液",
    brandName: "可瑞达 (Keytruda / Pembrolizumab)",
    generation: "PD-1 免疫检查点抑制剂 (KEYNOTE-826 试验确立持续复发或晚期宫颈癌一线全线首选)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉输注 Q3W (每3周一次) 或 400mg Q6W，联合紫杉醇+顺铂/卡铂 ± 贝伐珠单抗",
    metabolismPathway: "经由组织蛋白水解途径消除，不依赖肝微粒体酶代谢",
    phDependent: false,
  },
  {
    id: "bevacizumab",
    genericName: "贝伐珠单抗注射液",
    brandName: "安维汀 (Avastin / Bevacizumab)",
    generation: "抗 VEGF 单克隆抗体 (GOG-240 / KEYNOTE-826 确立晚期宫颈癌一线联合标准)",
    target: "VEGF" as any,
    standardDosage: "15mg/kg 静脉滴注每 3 周一次 (Q3W)",
    metabolismPathway: "通过体内广泛蛋白分解代谢，半衰期约 20 天",
    phDependent: false,
  },
  {
    id: "cadonilimab",
    genericName: "卡度尼利单抗注射液",
    brandName: "开坦尼 (Cadonilimab / AK104)",
    generation: "全球首创 PD-1 / CTLA-4 双特异性抗体 (中国 NMPA 获批复发转移性宫颈癌适应证)",
    target: "PD-1 / CTLA-4" as any,
    standardDosage: "6mg/kg 或 10mg/kg 每 2 周静脉滴注一次 (Q2W)",
    metabolismPathway: "通过蛋白质分解酶代谢清除",
    phDependent: false,
  },
  {
    id: "cisplatin",
    genericName: "注射用顺铂",
    brandName: "顺铂 (Cisplatin / CDDP)",
    generation: "局部晚期宫颈癌根治性同步放化疗 (CCRT) 国际绝对金标准放射增敏剂",
    target: "DNA Crosslinking" as any,
    standardDosage: "每周 40mg/m² 静脉滴注 (放疗期间每周一次，共 5~6 周，需大剂量水化利尿)",
    metabolismPathway: "主要以原型和无活性铂络合物经肾脏排泄，对肾小管及听神经具有显著蓄积毒性",
    phDependent: false,
  },
  {
    id: "tisotumab_vedotin",
    genericName: "注射用替索妥单抗维多汀 (ADC)",
    brandName: "替度克 (Tivdak / Tisotumab Vedotin)",
    generation: "靶向组织因子 (Tissue Factor, TF) 的抗体偶联药物 (innovaTV 204 确立二线及后线适应证)",
    target: "Tissue Factor (TF)" as any,
    standardDosage: "2.0mg/kg 静脉输注每 3 周一次 (需配合眼部防护与冷敷)",
    metabolismPathway: "抗体部分蛋白水解，小分子毒素 MMAE 经肝脏 CYP3A4 部分代谢",
    phDependent: false,
  },
];

/**
 * 宫颈癌临床药物相互作用 (DDI) 专家级规则库
 */
export const CERVICAL_DDI_RULES: DdiRule[] = [
  {
    id: "DDI-CC-001",
    targetDrugIds: ["cisplatin"],
    targetedDrugId: "cisplatin",
    chronicDrugId: "gentamicin",
    riskLevel: "severe_contraindication",
    riskLabel: "绝对禁忌 · 致命协同肾小管坏死",
    title: "顺铂与氨基糖苷类抗生素协同导致急性肾衰竭与不可逆耳聋",
    mechanism: "顺铂与氨基糖苷类抗生素 (如庆大霉素、阿米卡星) 或万古霉素联用，具有极强的协同肾小管坏死与不可逆前庭耳毒性",
    clinicalGuidance: "【致命禁忌】严禁顺铂同步放化疗期间合用氨基糖苷类抗生素；严重感染应换用头孢菌素类、碳青霉烯类或阿莫西林克拉维酸钾。",
    severity: "danger",
    clinicalEffect: "可导致急性无尿型肾功能衰竭与永久性高频耳聋",
    actionAdvice: "【致命禁忌】严禁顺铂同步放化疗期间合用氨基糖苷类抗生素；严重感染应换用头孢菌素类、碳青霉烯类或阿莫西林克拉维酸钾。",
    evidenceLevel: "FDA/NMPA说明书",
  },
  {
    id: "DDI-CC-002",
    targetDrugIds: ["bevacizumab"],
    targetedDrugId: "bevacizumab",
    chronicDrugId: "warfarin",
    riskLevel: "severe_contraindication",
    riskLabel: "绝对禁忌 · 致死性大出血与穿孔瘘管",
    title: "贝伐珠单抗联用华法林诱发严重生殖道大出血与直肠阴道瘘",
    mechanism: "贝伐珠单抗强力抑制血管内皮新生，在宫颈肿瘤溃疡坏死或侵犯直肠阴道中膈背景下，合并抗凝药极易诱发无法控制的致命性阴道大出血与直肠阴道瘘",
    clinicalGuidance: "【致命警示】宫颈癌合并局部未控溃疡或放疗直肠炎者，严禁合用贝伐珠单抗与华法林；抗栓治疗需多学科审慎评估并优先采用物理抗栓。",
    severity: "danger",
    clinicalEffect: "生殖道/盆腔致死性失血休克及不可逆组织坏死瘘管形成",
    actionAdvice: "【致命警示】宫颈癌合并局部未控溃疡或放疗直肠炎者，严禁合用贝伐珠单抗与华法林；抗栓治疗需多学科审慎评估并优先采用物理抗栓。",
    evidenceLevel: "FDA/NMPA说明书",
  },
  {
    id: "DDI-CC-003",
    targetDrugIds: ["cisplatin"],
    targetedDrugId: "cisplatin",
    chronicDrugId: "furosemide",
    riskLevel: "timing_caution",
    riskLabel: "时序水化 · 耳毒性与低钾血症",
    title: "顺铂同步放化疗期间大剂量呋塞米急推加剧耳毒性",
    mechanism: "大剂量呋塞米与顺铂联用增加耳蜗毛细胞水肿与脱水，加重电解质 (低钾/低镁) 紊乱及耳毒性",
    clinicalGuidance: "【给药时序水化】顺铂增敏日应采用充足生理盐水 (1500~2500mL) 水化促进自然排尿，仅在尿量严重不足时谨慎小剂量使用利尿剂。",
    severity: "caution",
    clinicalEffect: "耳鸣、听力减退及突发性低钾血症",
    actionAdvice: "【给药时序水化】顺铂增敏日应采用充足生理盐水 (1500~2500mL) 水化促进自然排尿，仅在尿量严重不足时谨慎小剂量使用利尿剂。",
    evidenceLevel: "权威前瞻临床研究",
  },
  {
    id: "DDI-CC-004",
    targetDrugIds: ["bevacizumab"],
    targetedDrugId: "bevacizumab",
    chronicDrugId: "amlodipine",
    riskLevel: "timing_caution",
    riskLabel: "血压监测 · 拮抗降压平稳度",
    title: "贝伐珠单抗升高外周阻力削弱钙通道阻滞剂疗效",
    mechanism: "贝伐珠单抗抑制内皮 NO 生成导致外周血管平滑肌收缩，可能削弱氨氯地平等二氢吡啶类降压药的控制效果",
    clinicalGuidance: "【血压监测】贝伐珠单抗输注前后应每日规律监测早晚血压，如收缩压超过 160mmHg，需遵医嘱追加 ACEI/ARB 或调整钙拮抗剂剂量。",
    severity: "caution",
    clinicalEffect: "难治性高血压或血压急剧波动升高",
    actionAdvice: "【血压监测】贝伐珠单抗输注前后应每日规律监测早晚血压，如收缩压超过 160mmHg，需遵医嘱追加 ACEI/ARB 或调整钙拮抗剂剂量。",
    evidenceLevel: "药代动力学PK证据",
  },
];

/**
 * 宫颈癌专用 DDI 冲突分析引擎
 */
export function checkCervicalDrugInteractions(
  targetId: string,
  chronicIds: string[]
): DdiAnalysisResult {
  const target = CERVICAL_TARGETED_DRUGS.find((d) => d.id === targetId) || null;
  const chronicDrugs = ALL_CHRONIC_DRUGS.filter((c) => chronicIds.includes(c.id));

  if (!target) {
    return {
      targetedDrug: null,
      selectedChronicDrugs: chronicDrugs,
      chronicDrugs,
      totalChecked: chronicDrugs.length,
      severeCount: 0,
      cautionCount: 0,
      safeCount: chronicDrugs.length,
      overallStatus: "safe",
      summaryText: "未选择专科药物或未发现专科用药冲突",
      interactions: [],
      dailySchedulePlan: [],
      severity: "safe" as any,
      rules: [],
      targetDrug: target as any,
      summary: "未发现专科用药冲突",
    };
  }

  const matchedRules = CERVICAL_DDI_RULES.filter(
    (r) => (r.targetDrugIds?.includes(targetId) || r.targetedDrugId === targetId) && chronicIds.includes(r.chronicDrugId)
  );

  const dangerCount = matchedRules.filter((r) => r.riskLevel === "severe_contraindication" || r.severity === "danger").length;
  const cautionCount = matchedRules.filter((r) => r.riskLevel === "timing_caution" || r.severity === "caution").length;
  const safeCount = Math.max(0, chronicDrugs.length - matchedRules.length);

  let overallStatus: "safe" | "warning" | "danger" = "safe";
  if (dangerCount > 0) {
    overallStatus = "danger";
  } else if (cautionCount > 0) {
    overallStatus = "warning";
  }

  let summaryText = "当前靶向/化疗药物与所选慢病用药无已知显著不良相互作用，可遵医嘱安心治疗。";
  if (dangerCount > 0) {
    summaryText = `检测到 ${dangerCount} 项高危用药禁忌！存在急性肾毒性、不可逆耳聋或严重大出血风险，必须立即报告主管医生！`;
  } else if (cautionCount > 0) {
    summaryText = `检测到 ${cautionCount} 项需密切监护的用药相互作用，请做好充分水化并遵医嘱监测血压或肾功能指标。`;
  }

  const interactions = matchedRules.map((rule) => {
    const chronicDrug = chronicDrugs.find((c) => c.id === rule.chronicDrugId) || {
      id: rule.chronicDrugId,
      name: rule.chronicDrugId,
      aliases: [],
      category: "other" as any,
      categoryLabel: "慢病用药",
      typicalUse: "对症治疗",
    };
    return {
      chronicDrug,
      rule,
      targetedDrug: target,
    };
  });

  return {
    targetedDrug: target,
    selectedChronicDrugs: chronicDrugs,
    chronicDrugs,
    totalChecked: chronicDrugs.length,
    severeCount: dangerCount,
    cautionCount,
    safeCount,
    dangerCount,
    warningCount: cautionCount,
    overallStatus,
    summaryText,
    interactions,
    dailySchedulePlan: [
      {
        timeSlot: "早晨 09:00 (输注/服药后)",
        drugs: [target.brandName.split(" / ")[0] || target.genericName],
        note: "化疗或抗血管靶向期间需保持每日充足饮水 (2000mL 以上)。"
      }
    ],
    severity: overallStatus === "warning" ? "caution" : overallStatus,
    rules: matchedRules,
    targetDrug: target,
    summary: summaryText,
  };
}
