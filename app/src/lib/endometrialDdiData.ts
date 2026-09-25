import type { TargetedDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

/**
 * 子宫内膜癌 (Endometrial Cancer) 临床主流靶向、免疫、内分泌激素逆转及化疗药物库
 */
export const ENDOMETRIAL_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "dostarlimab",
    genericName: "多塔利单抗注射液",
    brandName: "安吉优 (Jemperli / Dostarlimab)",
    generation: "PD-1 免疫检查点抑制剂 (RUBY 试验确证 dMMR/MSI-H 晚期子宫内膜癌一线突破首选)",
    target: "PD-1" as any,
    standardDosage: "500mg 静脉滴注 Q3W (每3周1次，前6周期)，之后 1000mg Q6W (每6周1次)",
    metabolismPathway: "经网状内皮系统分解为小肽与氨基酸，无典型肝药酶代谢路径",
    phDependent: false,
  },
  {
    id: "pembrolizumab",
    genericName: "帕博利珠单抗注射液",
    brandName: "可瑞达 (Keytruda / Pembrolizumab)",
    generation: "PD-1 抑制剂 (KEYNOTE-158 / NRG-GY018 / KEYNOTE-775 全线确证)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉输注 Q3W 或 400mg Q6W",
    metabolismPathway: "通过非特异性蛋白质分解消除",
    phDependent: false,
  },
  {
    id: "lenvatinib",
    genericName: "甲磺酸仑伐替尼胶囊",
    brandName: "乐卫玛 (Lenvima / Lenvatinib)",
    generation: "多靶点受体酪氨酸激酶抑制剂 (KEYNOTE-775 / LEAP-001 联合帕博利珠单抗用于 pMMR 晚期患者)",
    target: "VEGFR" as any,
    standardDosage: "20mg 每日一次 (与帕博利珠单抗联用时推荐起始剂量 20mg QD)",
    metabolismPathway: "主要由肝脏 CYP3A4 酶和醛氧化酶代谢清除",
    phDependent: false,
  },
  {
    id: "megestrol_acetate",
    genericName: "醋酸甲地孕酮口服混悬液/分散片",
    brandName: "美适亚 (Megace / Megestrol Acetate)",
    generation: "高效孕激素 (早期年轻患者保留生育功能逆转内膜病灶 & 晚期内分泌治疗基石)",
    target: "Progesterone Receptor" as any,
    standardDosage: "保生育逆转推荐 160mg 每日一次口服，连续服用 3~6 个月直至宫腔镜完全缓解",
    metabolismPathway: "在肝脏广泛代谢，经胆道及尿液排泄，可引起轻度水钠潴留及食欲大增",
    phDependent: false,
  },
  {
    id: "medroxyprogesterone",
    genericName: "醋酸甲羟孕酮片",
    brandName: "安宫黄体酮 (Provera / MPA)",
    generation: "大剂量孕激素 (早期分化良好内膜癌保育替代方案与复发内分泌维持)",
    target: "Progesterone Receptor" as any,
    standardDosage: "保生育治疗高剂量 250~500mg 每日一次口服",
    metabolismPathway: "主要经肝脏 CYP3A4 酶代谢为葡萄糖醛酸偶联物",
    phDependent: false,
  },
  {
    id: "trastuzumab",
    genericName: "曲妥珠单抗注射液",
    brandName: "赫赛汀 (Herceptin / Trastuzumab)",
    generation: "HER2 单克隆抗体 (用于 HER2 阳性子宫浆液性癌一线联合 TC 化疗)",
    target: "HER2" as any,
    standardDosage: "首剂 8mg/kg，维持剂量 6mg/kg 每3周一次 (Q3W)",
    metabolismPathway: "网状内皮系统分解清除",
    phDependent: false,
  },
  {
    id: "carboplatin_paclitaxel",
    genericName: "注射用卡铂 + 紫杉醇注射液 (TC 方案)",
    brandName: "TC 联合化疗方案 (Carboplatin + Paclitaxel)",
    generation: "局部高危及晚期子宫内膜癌权威首选全身辅助与姑息化疗基石方案 (GOG-258 / PORTEC-3)",
    target: "DNA/Microtubule" as any,
    standardDosage: "紫杉醇 175mg/m² + 卡铂 AUC 5~6 每3周静脉滴注一次，共 4~6 周期",
    metabolismPathway: "紫杉醇经 CYP2C8/CYP3A4 代谢；卡铂主要经肾小球滤过原型排泄",
    phDependent: false,
  },
];

/**
 * 子宫内膜癌临床药物相互作用 (DDI) 专家级规则库
 */
export const ENDOMETRIAL_DDI_RULES: DdiRule[] = [
  {
    id: "DDI-EC-001",
    targetDrugIds: ["lenvatinib"],
    targetedDrugId: "lenvatinib",
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    riskLabel: "绝对禁忌 · 靶向严重失效",
    title: "利福平强效诱导 CYP3A4 致仑伐替尼血药浓度暴跌 80%",
    mechanism: "利福平为极强效 CYP3A4 诱导剂，可使仑伐替尼血药浓度暴跌 80% 以上，导致抗肿瘤靶向严重失效",
    clinicalGuidance: "【绝对禁忌】严禁仑伐替尼与利福平联用；抗结核治疗需换用对 CYP3A4 无诱导作用的备选方案。",
    severity: "danger",
    clinicalEffect: "靶向暴露量急剧降低，内膜癌复发或进展风险激增",
    actionAdvice: "【绝对禁忌】严禁仑伐替尼与利福平联用；抗结核治疗需换用对 CYP3A4 无诱导作用的备选方案。",
    evidenceLevel: "FDA/NMPA说明书",
  },
  {
    id: "DDI-EC-002",
    targetDrugIds: ["lenvatinib"],
    targetedDrugId: "lenvatinib",
    chronicDrugId: "warfarin",
    riskLevel: "severe_contraindication",
    riskLabel: "致命警示 · 致死性内脏大出血",
    title: "仑伐替尼抗血管生成联用华法林诱发致命出血",
    mechanism: "仑伐替尼强力抑制 VEGFR 阻碍血管内皮修复，合并华法林抗凝极易诱发致命性消化道、生殖道或腹腔大出血",
    clinicalGuidance: "【致命警示】严禁合用华法林；若存在深静脉血栓抗凝刚需，应在严密监测下优选低分子肝素，并密切监测血红蛋白与凝血指标。",
    severity: "danger",
    clinicalEffect: "致死性内脏大出血风险升高 4~6 倍",
    actionAdvice: "【致命警示】严禁合用华法林；若存在深静脉血栓抗凝刚需，应在严密监测下优选低分子肝素，并密切监测血红蛋白与凝血指标。",
    evidenceLevel: "权威前瞻临床研究",
  },
  {
    id: "DDI-EC-003",
    targetDrugIds: ["megestrol_acetate", "medroxyprogesterone"],
    targetedDrugId: "megestrol_acetate",
    chronicDrugId: "warfarin",
    riskLevel: "timing_caution",
    riskLabel: "时序监测 · 血栓与抗凝平衡",
    title: "大剂量孕激素合并抗凝药需严密监测凝血谱与 VTE 征象",
    mechanism: "大剂量孕激素 (甲地孕酮 MA/MPA) 本身可增加静脉血栓栓塞 (VTE) 风险，合并抗凝药治疗时需密切监测凝血 INR",
    clinicalGuidance: "【时序监测】高剂量甲地孕酮保育治疗期间应常规排查 D-二聚体，避免长时间卧床，必要时加用物理预防或调整抗凝方案。",
    severity: "caution",
    clinicalEffect: "影响抗凝平稳度，需权衡高剂量孕激素血栓风险",
    actionAdvice: "【时序监测】高剂量甲地孕酮保育治疗期间应常规排查 D-二聚体，避免长时间卧床，必要时加用物理预防或调整抗凝方案。",
    evidenceLevel: "权威前瞻临床研究",
  },
  {
    id: "DDI-EC-004",
    targetDrugIds: ["lenvatinib"],
    targetedDrugId: "lenvatinib",
    chronicDrugId: "clarithromycin",
    riskLevel: "timing_caution",
    riskLabel: "剂量滴定 · 靶向毒性倍增",
    title: "克拉霉素强抑制 CYP3A4 显著升高仑伐替尼浓度",
    mechanism: "克拉霉素为强效 CYP3A4 抑制剂，抑制仑伐替尼代谢清除，导致其血药浓度明显升高",
    clinicalGuidance: "【剂量滴定】合用克拉霉素期间建议监测血压与尿蛋白，必要时将仑伐替尼剂量由 20mg 暂时下调至 14mg 或换用阿奇霉素。",
    severity: "caution",
    clinicalEffect: "高血压危象、手足皮肤反应、高蛋白尿等靶向毒性风险显著增加",
    actionAdvice: "【剂量滴定】合用克拉霉素期间建议监测血压与尿蛋白，必要时将仑伐替尼剂量由 20mg 暂时下调至 14mg 或换用阿奇霉素。",
    evidenceLevel: "药代动力学PK证据",
  },
  {
    id: "DDI-EC-005",
    targetDrugIds: ["carboplatin_paclitaxel"],
    targetedDrugId: "carboplatin_paclitaxel",
    chronicDrugId: "furosemide",
    riskLevel: "timing_caution",
    riskLabel: "肾毒性防御 · 协同内耳损害",
    title: "卡铂化疗联用强效利尿剂加剧肾小管与耳蜗毛细胞损害",
    mechanism: "卡铂与呋塞米等强效利尿剂联用可加剧肾小管细胞毒性及前庭耳蜗神经损害",
    clinicalGuidance: "【肾毒性防御】化疗给药期间需保证充足水化 (每日尿量 >2000mL)，避免大剂量呋塞米急推，监测肌酐清除率。",
    severity: "caution",
    clinicalEffect: "肾功能急性衰竭或高频听力进行性下降",
    actionAdvice: "【肾毒性防御】化疗给药期间需保证充足水化 (每日尿量 >2000mL)，避免大剂量呋塞米急推，监测肌酐清除率。",
    evidenceLevel: "权威前瞻临床研究",
  },
];

/**
 * 子宫内膜癌专用 DDI 冲突分析引擎
 */
export function checkEndometrialDrugInteractions(
  targetId: string,
  chronicIds: string[]
): DdiAnalysisResult {
  const target = ENDOMETRIAL_TARGETED_DRUGS.find((d) => d.id === targetId) || null;
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

  const matchedRules = ENDOMETRIAL_DDI_RULES.filter(
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

  let summaryText = "当前靶向/内分泌药物与所选慢病用药无已知显著不良相互作用，可遵医嘱安心服用。";
  if (dangerCount > 0) {
    summaryText = `检测到 ${dangerCount} 项高危用药禁忌！存在药物降解失效或严重出血风险，请立即联系主管医生调整方案。`;
  } else if (cautionCount > 0) {
    summaryText = `检测到 ${cautionCount} 项需密切监护的用药相互作用，建议遵医嘱调整给药剂量或加强生化监测。`;
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
        timeSlot: "早晨 08:00 (早餐后)",
        drugs: [target.brandName.split(" / ")[0] || target.genericName],
        note: "规律作息服药，温水送服；若伴随恶心可遵医嘱对症止吐。"
      }
    ],
    severity: overallStatus === "warning" ? "caution" : overallStatus,
    rules: matchedRules,
    targetDrug: target,
    summary: summaryText,
  };
}
