import type { TargetedDrug, ChronicDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

export const BREAST_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "tamoxifen",
    genericName: "枸橼酸他莫昔芬片",
    brandName: "三苯氧胺 (Nolvadex)",
    generation: "内分泌一线 SERM",
    target: "ER" as any,
    standardDosage: "20mg 每日一次口服",
    metabolismPathway: "主要经肝脏 CYP2D6 及 CYP3A4 代谢转化为超高活性产物恩多昔芬 (Endoxifen)",
    phDependent: false
  },
  {
    id: "letrozole",
    genericName: "来曲唑片",
    brandName: "芙隆 (Femara)",
    generation: "第三代非甾体类芳香化酶抑制剂 (AI)",
    target: "ER" as any,
    standardDosage: "2.5mg 每日一次口服",
    metabolismPathway: "经肝脏 CYP3A4 及 CYP2A6 缓慢代谢",
    phDependent: false
  },
  {
    id: "anastrozole",
    genericName: "阿那曲唑片",
    brandName: "瑞宁得 (Arimidex)",
    generation: "第三代非甾体类芳香化酶抑制剂 (AI)",
    target: "ER" as any,
    standardDosage: "1mg 每日一次口服",
    metabolismPathway: "经肝脏 N-脱烷基化及葡萄糖醛酸结合代谢",
    phDependent: false
  },
  {
    id: "exemestane",
    genericName: "依西美坦片",
    brandName: "阿诺新 (Aromasin)",
    generation: "第三代不可逆甾体类芳香化酶灭活剂 (AI)",
    target: "ER" as any,
    standardDosage: "25mg 每日一次饭后口服",
    metabolismPathway: "主要经肝脏 CYP3A4 及 17-酮甾类还原酶代谢",
    phDependent: false
  },
  {
    id: "fulvestrant",
    genericName: "氟维司群注射液",
    brandName: "芙仕得 (Faslodex)",
    generation: "选择性雌激素受体下调降解剂 (SERD)",
    target: "ER" as any,
    standardDosage: "500mg 每月一次肌肉注射 (首月第1/15/29天给药)",
    metabolismPathway: "主要经 CYP3A4 氧化途径代谢清除",
    phDependent: false
  },
  {
    id: "abemaciclib",
    genericName: "阿贝西利片",
    brandName: "唯择 (Verzenio)",
    generation: "新一代高活性 CDK4/6 抑制剂",
    target: "HER2" as any,
    standardDosage: "150mg 每日两次口服（与内分泌合用）",
    metabolismPathway: "主要经肝脏 CYP3A4 代谢为活性代谢物 M2 与 M20",
    phDependent: false
  },
  {
    id: "palbociclib",
    genericName: "哌柏西利胶囊",
    brandName: "爱博新 (Ibrance)",
    generation: "经典选择性 CDK4/6 抑制剂",
    target: "HER2" as any,
    standardDosage: "125mg 每日一次连续21天停7天 (28天一周期)",
    metabolismPathway: "主要经肝脏 CYP3A4 及 SULT2A1 硫酸化代谢",
    phDependent: false
  },
  {
    id: "ribociclib",
    genericName: "琥珀酸瑞博西利片",
    brandName: "凯丽隆 (Kisqali)",
    generation: "高选择性 CDK4/6 抑制剂",
    target: "HER2" as any,
    standardDosage: "600mg 每日一次连续21天停7天 (28天一周期)",
    metabolismPathway: "主要经 CYP3A4 代谢，存在明显浓度依赖性 QTc 延长效应",
    phDependent: false
  },
  {
    id: "trastuzumab",
    genericName: "注射用曲妥珠单抗",
    brandName: "赫赛汀 (Herceptin)",
    generation: "经典抗 HER2 人源化单克隆抗体",
    target: "HER2",
    standardDosage: "首剂 8mg/kg，维持 6mg/kg 每3周一次静脉滴注",
    metabolismPathway: "非特异性网状内皮系统蛋白酶水解清除，不经肝脏 CYP450 酶代谢",
    phDependent: false
  },
  {
    id: "pertuzumab",
    genericName: "帕妥珠单抗注射液",
    brandName: "帕捷特 (Perjeta)",
    generation: "靶向 HER2 结构域II异源二聚化抑制单抗",
    target: "HER2",
    standardDosage: "首剂 840mg，维持 420mg 每3周一次静脉滴注 (与曲妥珠联用)",
    metabolismPathway: "非特异性抗体分解代谢，无已知 CYP450 药物代谢相互作用",
    phDependent: false
  },
  {
    id: "trastuzumab_emtansine",
    genericName: "注射用恩美曲妥珠单抗",
    brandName: "赫赛莱 / Kadcyla (T-DM1)",
    generation: "新一代 HER2 靶向抗体偶联药物 (ADC)",
    target: "HER2",
    standardDosage: "3.6mg/kg 每3周一次静脉滴注 (辅助治疗14周期)",
    metabolismPathway: "溶酶体降解后释放活性小分子 DM1，DM1 部分经 CYP3A4/5 代谢",
    phDependent: false
  },
  {
    id: "trastuzumab_deruxtecan",
    genericName: "注射用德曲妥珠单抗",
    brandName: "优赫得 / Enhertu (T-DXd)",
    generation: "突破性高 DAR 裂解型 HER2-ADC",
    target: "HER2",
    standardDosage: "5.4mg/kg 每3周一次静脉滴注",
    metabolismPathway: "载荷 DXd 经 CYP3A4 极少代谢，主要经原形胆道转运排泄",
    phDependent: false
  },
  {
    id: "olaparib",
    genericName: "奥拉帕利片",
    brandName: "利普卓 (Lynparza)",
    generation: "小分子 PARP1/2 抑制剂 (针对 BRCA1/2 突变)",
    target: "Other",
    standardDosage: "300mg 每日两次口服 (连续服用1年)",
    metabolismPathway: "主要经肝脏 CYP3A4 代谢清除",
    phDependent: false
  },
  {
    id: "pembrolizumab",
    genericName: "帕博利珠单抗注射液",
    brandName: "可瑞达 / Keytruda (K药)",
    generation: "抗 PD-1 免疫检查点抑制剂",
    target: "Other",
    standardDosage: "200mg 每3周一次或 400mg 每6周一次静脉滴注",
    metabolismPathway: "非特异性蛋白水解清除，与肝药酶无直接代谢竞争",
    phDependent: false
  }
];

export const BREAST_DDI_RULES: DdiRule[] = [
  // 1. 他莫昔芬 vs 强 CYP2D6 抑制剂（帕罗西汀/氟西汀）- 严重禁忌
  {
    targetDrugIds: ["tamoxifen"],
    chronicDrugId: "paroxetine",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 导致抗癌失败",
    title: "强效阻断他莫昔芬抗癌活性转化 (Endoxifen 暴跌 75%)",
    mechanism: "他莫昔芬本身是前体药物，必须依赖肝脏 CYP2D6 酶转化为具有 100 倍结合力的活性产物「恩多昔芬 (Endoxifen)」。强效 CYP2D6 抑制剂（帕罗西汀）会使恩多昔芬血药浓度暴跌 70%~75%，直接导致内分泌防复发全面失效！",
    clinicalGuidance: "严禁合用帕罗西汀！若因术后焦虑、抑郁或潮热需使用抗抑郁药，指南强烈推荐替代为对 CYP2D6 几乎无影响的文拉法辛 (Venlafaxine) 或舍曲林 (Sertraline)。",
    evidenceLevel: "FDA/NMPA说明书"
  },
  {
    targetDrugIds: ["tamoxifen"],
    chronicDrugId: "fluoxetine",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 导致抗癌失败",
    title: "强效阻断他莫昔芬抗癌活性转化 (Endoxifen 暴跌 70%)",
    mechanism: "氟西汀为强效 CYP2D6 抑制剂，合用使他莫昔芬活性代谢产物浓度大幅下降，导致肿瘤复发风险显著升高。",
    clinicalGuidance: "严禁合用氟西汀！推荐换用舍曲林或文拉法辛。",
    evidenceLevel: "FDA/NMPA说明书"
  },
  // 2. 他莫昔芬 vs 华法林 (凝血抑制激增)
  {
    targetDrugIds: ["tamoxifen"],
    chronicDrugId: "warfarin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重警戒 · 出血风险暴增",
    title: "显著增强华法林抗凝作用，致使 INR 严重超标出血",
    mechanism: "他莫昔芬可竞争性抑制华法林主要代谢酶 CYP2C9，显著延长华法林半衰期，导致凝血酶原时间 (INR) 剧烈升高，引发消化道或脑部出血危险。",
    clinicalGuidance: "如必须合用，必须将华法林剂量减低至少 30%~50%，并在合用前两周每 2~3 天严密监测一次 INR 凝血指标；或遵医嘱换用新型口服抗凝药 (NOAC 如利伐沙班)。",
    evidenceLevel: "FDA/NMPA说明书"
  },
  // 3. 他莫昔芬 vs 强 CYP3A4 诱导剂 (圣约翰草/贯叶连翘)
  {
    targetDrugIds: ["tamoxifen"],
    chronicDrugId: "st_johns_wort",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 加速药物清除",
    title: "诱导 CYP3A4 加速他莫昔芬清除，显著降低防复发疗效",
    mechanism: "圣约翰草提取物为强效 CYP3A4 诱导剂，会使他莫昔芬血药谷浓度下降 40%~50%，降低内分泌治疗防复发保护屏障。",
    clinicalGuidance: "内分泌治疗期间严禁自行服用含圣约翰草 (贯叶连翘 / 路优泰) 的中草药与保健品。",
    evidenceLevel: "权威前瞻临床研究"
  },
  // 4. CDK4/6 抑制剂 (阿贝西利/哌柏西利/瑞博西利) vs 强效 CYP3A4 抑制剂 (克拉霉素/酮康唑/伊曲康唑)
  {
    targetDrugIds: ["abemaciclib", "palbociclib", "ribociclib"],
    chronicDrugId: "clarithromycin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重警戒 · 暴露量翻倍激增毒性",
    title: "显著升高 CDK4/6 抑制剂血药浓度，剧烈加重骨髓抑制与腹泻",
    mechanism: "CDK4/6 抑制剂主要经肝脏 CYP3A4 代谢。强效 CYP3A4 抑制剂会使其暴露量 (AUC) 增加 2~3 倍以上，极易诱发致命性中性粒细胞缺乏伴发热 (FN) 与重度腹泻。",
    clinicalGuidance: "避免合用强效 CYP3A4 抑制剂；如必须短期使用克拉霉素，阿贝西利剂量必须减半或暂停，并密切监测血常规。",
    evidenceLevel: "FDA/NMPA说明书"
  },
  {
    targetDrugIds: ["abemaciclib", "palbociclib", "ribociclib"],
    chronicDrugId: "ketoconazole",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 抑制代谢引发重度骨髓抑制",
    title: "强效抑制 CYP3A4 引起抗癌药血药浓度暴增",
    mechanism: "唑类抗真菌药是强效 CYP3A4 抑制剂，使 CDK4/6 抑制剂清除率下降超过 80%，毒副反应显著放大。",
    clinicalGuidance: "严禁合用口服酮康唑/伊曲康唑。如需抗真菌治疗，建议选用对 CYP3A4 影响极小的局部外用制剂或氟康唑低剂量谨慎使用。",
    evidenceLevel: "FDA/NMPA说明书"
  },
  // 5. CDK4/6 抑制剂 vs 强效 CYP3A4 诱导剂 (利福平/卡马西平/苯妥英钠)
  {
    targetDrugIds: ["abemaciclib", "palbociclib", "ribociclib"],
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    riskLabel: "绝对禁忌 · 疗效彻底丧失",
    title: "强效诱导 CYP3A4 使 CDK4/6 抑制剂暴露量暴跌 90%",
    mechanism: "利福平是极强效的肝酶诱导剂，可使阿贝西利/哌柏西利血药浓度下降 85%~95%，直接导致靶向抗癌作用近乎归零！",
    clinicalGuidance: "靶向治疗期间严禁合用利福平！抗结核方案需由感染科与肿瘤内科多学科专家会诊替换为非酶诱导方案。",
    evidenceLevel: "FDA/NMPA说明书"
  },
  {
    targetDrugIds: ["abemaciclib", "palbociclib", "ribociclib"],
    chronicDrugId: "phenytoin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 加速抗肿瘤药物代谢",
    title: "抗癫痫药诱导 CYP3A4 导致抗癌血药浓度不足",
    mechanism: "苯妥英钠诱导 CYP3A4 与 P-糖蛋白，显著降低 CDK4/6 抑制剂活性暴露。",
    clinicalGuidance: "抗癫痫治疗建议咨询神经科更换为对 CYP3A4 无诱导作用的左乙拉西坦 (开浦兰)。",
    evidenceLevel: "药代动力学PK证据"
  },
  // 6. CDK4/6 抑制剂 vs 西柚/葡萄柚
  {
    targetDrugIds: ["abemaciclib", "palbociclib", "ribociclib"],
    chronicDrugId: "grapefruit",
    riskLevel: "severe_contraindication",
    riskLabel: "绝对禁忌 · 严禁食用",
    title: "西柚中呋喃香豆素不可逆抑制肠道 CYP3A4，暴增毒性风险",
    mechanism: "西柚会使口服 CDK4/6 抑制剂吸收生物利用度成倍增加，极易诱发严重白细胞抑制与 QTc 间期延长。",
    clinicalGuidance: "服药期间严禁食用西柚、红心柚及鲜榨柚汁。",
    evidenceLevel: "FDA/NMPA说明书"
  },
  // 7. 芳香化酶抑制剂 (来曲唑/阿那曲唑/依西美坦) vs 钙剂与骨吸收
  {
    targetDrugIds: ["letrozole", "anastrozole", "exemestane"],
    chronicDrugId: "calcium_vitd",
    riskLevel: "compatible_safe",
    riskLabel: "推荐联用 · 黄金搭档",
    title: "抵御芳香化酶抑制剂所致骨质疏松的必备基石",
    mechanism: "芳香化酶抑制剂深度剥夺体内雌激素，导致破骨细胞活跃与骨钙快速丢失。每日足量补充碳酸钙/柠檬酸钙及活性维生素 D3 是 NCCN/CSCO 指南公认的护骨基石。",
    clinicalGuidance: "安全且强烈推荐联合服用！建议随餐或饭后服用钙剂以减少胃部刺激，每 6~12 个月复查骨密度 (DXA)。",
    evidenceLevel: "权威前瞻临床研究"
  },
  // 8. PARP 抑制剂 (奥拉帕利) vs 强效 CYP3A4 抑制剂/诱导剂
  {
    targetDrugIds: ["olaparib"],
    chronicDrugId: "clarithromycin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重警戒 · 显著升高奥拉帕利血药浓度",
    title: "强效抑制代谢，大幅增加严重贫血与血小板减少风险",
    mechanism: "奥拉帕利主要经 CYP3A4 代谢，合用强效抑制剂使奥拉帕利平均 AUC 增加 2.7 倍，引发重度骨髓抑制。",
    clinicalGuidance: "避免合用强效 CYP3A4 抑制剂；若必须短期使用，奥拉帕利剂量推荐下调至 100mg 或 150mg 每日两次。",
    evidenceLevel: "FDA/NMPA说明书"
  },
  {
    targetDrugIds: ["olaparib"],
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    riskLabel: "绝对禁忌 · 靶向疗效剧降 87%",
    title: "强诱导剂加速奥拉帕利分解，失去抗癌防护",
    mechanism: "利福平使奥拉帕利平均 AUC 骤降 87%，体内药物暴露量不足以维持 PARP 酶抑制活性。",
    clinicalGuidance: "严禁合用利福平及含贯叶连翘制剂。",
    evidenceLevel: "FDA/NMPA说明书"
  }
];

export function checkBreastDdi(targetedDrugId: string, chronicDrugIds: string[]): DdiAnalysisResult {
  const targetedDrug = BREAST_TARGETED_DRUGS.find(d => d.id === targetedDrugId) || null;
  const selectedChronicDrugs = ALL_CHRONIC_DRUGS.filter(c => chronicDrugIds.includes(c.id));

  const interactions: Array<{ chronicDrug: ChronicDrug; rule: DdiRule }> = [];
  let severeCount = 0;
  let cautionCount = 0;
  let safeCount = 0;

  for (const chronicDrug of selectedChronicDrugs) {
    const matchedRule = BREAST_DDI_RULES.find(
      r => (r.targetDrugIds.includes(targetedDrugId) || r.targetDrugIds.includes("*")) &&
           r.chronicDrugId === chronicDrug.id
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
  let summaryText = "当前选中的药物未见明确临床危险相互作用，可按常规医嘱服用。";

  if (severeCount > 0) {
    overallStatus = "danger";
    summaryText = `检测到 ${severeCount} 项严重配伍禁忌！存在阻断抗癌活性或引发严重毒性的风险，请务必遵医嘱调整！`;
  } else if (cautionCount > 0) {
    overallStatus = "warning";
    summaryText = `检测到 ${cautionCount} 项需注意服药时序的相互作用，建议错峰服药。`;
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
        timeSlot: "早晨 07:30 (随早餐)",
        drugs: [targetedDrug?.genericName || "内分泌抗肿瘤药物", "护骨钙剂 (600mg)"],
        note: "随餐服用胃肠道耐受更佳，吸收更充分。"
      },
      {
        timeSlot: "晚上 20:00 (睡前)",
        drugs: ["必要时代替的抗抑郁/安神药物 (如文拉法辛)"],
        note: "与早间药物间隔 12 小时，避免峰浓度重叠。"
      }
    ]
  };
}

export const checkBreastDrugInteractions = checkBreastDdi;
