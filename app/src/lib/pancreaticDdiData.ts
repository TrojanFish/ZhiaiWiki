/**
 * 胰腺癌 (Pancreatic Cancer) 专科药理学靶向药物与 DDI 药物相互作用库
 * 遵循标准: CSCO 胰腺癌诊疗指南 2024 · FDA / NMPA 药品说明书
 */

import type { TargetedDrug, ChronicDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

export const PANCREATIC_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "pancreatic_olaparib",
    genericName: "奥拉帕利片",
    brandName: "利普卓 (Lynparza)",
    generation: "PARP 抑制剂",
    target: "PARP" as any,
    standardDosage: "300mg 口服 每日两次 (BID), 随餐或空腹",
    metabolismPathway: "主要经肝脏 CYP3A4 酶代谢清除",
    phDependent: false,
  },
  {
    id: "pancreatic_erlotinib",
    genericName: "盐酸厄洛替尼片",
    brandName: "特罗凯 (Tarceva)",
    generation: "第一代 EGFR-TKI",
    target: "EGFR",
    standardDosage: "100mg 口服 每日一次 (联合吉西他滨), 饭前1小时或饭后2小时空腹",
    metabolismPathway: "主要经肝脏 CYP3A4 及 CYP1A2 代谢",
    phDependent: true, // 胃内酸性依赖吸收
  },
  {
    id: "pancreatic_irinotecan_liposome",
    genericName: "盐酸伊立替康脂质体注射液",
    brandName: "易安达 (Onivyde)",
    generation: "拓扑异构酶 I 抑制剂",
    target: "TOP1" as any,
    standardDosage: "50mg/m² 静脉滴注 每2周一次 (联合 5-FU/LV)",
    metabolismPathway: "肝脏羧酸酯酶水解为活性产物 SN-38，经 UGT1A1 葡萄糖醛酸酸化消除",
    phDependent: false,
  },
  {
    id: "pancreatic_nab_paclitaxel",
    genericName: "注射用紫杉醇 (白蛋白结合型)",
    brandName: "凯素 / 艾素 (Abraxane)",
    generation: "微管稳定剂",
    target: "Tubulin" as any,
    standardDosage: "125mg/m² 静脉滴注 第1, 8, 15天, 每28天为一个周期 (联合吉西他滨)",
    metabolismPathway: "主要经肝微粒体 CYP2C8 和 CYP3A4 代谢消除",
    phDependent: false,
  },
  {
    id: "pancreatic_pembrolizumab",
    genericName: "帕博利珠单抗注射液",
    brandName: "可瑞达 (Keytruda)",
    generation: "PD-1 免疫检查点抑制剂 (MSI-H / dMMR / TMB-H 后线)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每3周一次 或 400mg 每6周一次",
    metabolismPathway: "网状内皮系统抗体特异性分解代谢",
    phDependent: false,
  },
];

export const PANCREATIC_DDI_RULES: DdiRule[] = [
  // 1. 致命禁忌 · 强 CYP3A4 诱导剂 (导致抗肿瘤彻底失效)
  {
    id: "pancreatic-olaparib-rifampin",
    targetDrugIds: ["pancreatic_olaparib"],
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 奥拉帕利血药浓度暴跌 87%",
    title: "强 CYP3A4 诱导剂导致奥拉帕利维持抗肿瘤彻底失效",
    mechanism: "利福平强效诱导肝微粒体 CYP3A4 酶，使奥拉帕利稳态 AUC 降低 87%，血药浓度无法维持有效抗肿瘤治疗窗。",
    clinicalGuidance: "严禁同服。抗结核治疗期间必须换用不经 CYP3A 显著诱导的替代药物，或暂停奥拉帕利维持治疗。",
    evidenceLevel: "FDA/NMPA说明书",
    severity: "danger",
  },
  {
    id: "pancreatic-erlotinib-rifampin",
    targetDrugIds: ["pancreatic_erlotinib"],
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 厄洛替尼稳态暴露量降低 67%",
    title: "强 CYP3A4 诱导剂加速厄洛替尼代谢清除",
    mechanism: "利福平强烈诱导 CYP3A4 表达，使厄洛替尼中位 AUC 减少 2/3，导致靶向联合治疗彻底失去抗肿瘤活性。",
    clinicalGuidance: "严禁联合。抗结核患者推荐选用乙胺丁醇、异烟肼等非强诱导剂方案。",
    evidenceLevel: "FDA说明书黑框警告",
    severity: "danger",
  },

  // 2. 致命禁忌 · 强 CYP3A4 抑制剂 (严重骨髓抑制与毒性蓄积)
  {
    id: "pancreatic-olaparib-strong-inhibitor",
    targetDrugIds: ["pancreatic_olaparib"],
    chronicDrugId: "clarithromycin", // 克拉霉素
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 靶向血药浓度升高 2.7 倍",
    title: "强 CYP3A4 抑制剂导致奥拉帕利严重骨髓抑制",
    mechanism: "克拉霉素强效抑制奥拉帕利的肝脏消除，使稳态峰浓度升高 270%，显著增加重度贫血、中性粒细胞减少及骨髓增生异常综合征 (MDS) 风险。",
    clinicalGuidance: "避免同服。若抗感染必须使用强抑制剂，奥拉帕利必须减量至 100mg bid 或 150mg bid，并每周监测全血细胞计数。",
    evidenceLevel: "临床药代动力学指南",
    severity: "danger",
  },

  // 3. 时序隔离 · pH 依赖吸收 (PPI 与 H2RA 抑酸剂)
  {
    id: "pancreatic-erlotinib-ppi",
    targetDrugIds: ["pancreatic_erlotinib"],
    chronicDrugId: "omeprazole",
    riskLevel: "timing_caution",
    riskLabel: "时序注意 · 胃内pH升高阻碍吸收 46%",
    title: "质子泵抑制剂 (PPI) 导致厄洛替尼暴露量腰斩",
    mechanism: "厄洛替尼在酸性胃液中溶解度最佳。奥美拉唑等 PPI 使胃内 pH 升高至 4 以上，导致厄洛替尼吸收显著受阻，AUC 下降 46%。",
    clinicalGuidance: "避免同服 PPI。若必须使用抑酸药，建议换用短效 H2 受体拮抗剂（如法莫替丁），并在服用 H2 拮抗剂前 2 小时或后 10 小时空腹服用厄洛替尼。",
    evidenceLevel: "权威前瞻临床试验",
    severity: "caution",
    timingRecommendation: "严格错峰 4~10 小时：清晨空腹服用厄洛替尼，睡前服用短效抑酸剂。",
  },

  // 4. 中度注意 · 抗凝与出血风险 (胰腺癌高血栓体质)
  {
    id: "pancreatic-anticoagulation-warfarin",
    targetDrugIds: ["pancreatic_olaparib", "pancreatic_erlotinib", "pancreatic_nab_paclitaxel"],
    chronicDrugId: "warfarin",
    riskLevel: "moderate_caution",
    riskLabel: "中度注意 · 密切监测凝血 INR",
    title: "化疗与靶向治疗影响华法林抗凝活性",
    mechanism: "胰腺癌患者易合并深静脉血栓 (VTE)。全身化疗及靶向药物可能通过竞争肝代谢酶或破坏肠道菌群改变华法林抗凝强度，增加内脏大出血风险。",
    clinicalGuidance: "胰腺癌相关静脉血栓优先推荐低分子肝素 (LMWH) 或新型口服抗凝药 (DOAC)；若使用华法林，需每 3~5 天严密复查 INR，维持在 2.0~3.0。",
    evidenceLevel: "CSCO 肿瘤相关VTE指南",
    severity: "caution",
  },
];

/**
 * 胰腺癌专科 DDI 药理学校验主函数
 */
export function checkPancreaticDrugInteractions(
  targetDrugId: string,
  chronicDrugIds: string[]
): DdiAnalysisResult {
  const targetedDrug = PANCREATIC_TARGETED_DRUGS.find(d => d.id === targetDrugId) || PANCREATIC_TARGETED_DRUGS[0];
  const selectedChronicDrugs = chronicDrugIds
    .map(id => ALL_CHRONIC_DRUGS.find(c => c.id === id))
    .filter((c): c is ChronicDrug => Boolean(c));

  const interactions: Array<{ chronicDrug: ChronicDrug; rule: DdiRule }> = [];
  let severeCount = 0;
  let cautionCount = 0;
  let safeCount = 0;

  for (const chronic of selectedChronicDrugs) {
    const matched = PANCREATIC_DDI_RULES.find(
      r => (r.targetDrugIds?.includes("*") || r.targetDrugIds?.includes(targetDrugId)) && r.chronicDrugId === chronic.id
    );
    if (matched) {
      interactions.push({ chronicDrug: chronic, rule: matched });
      if (matched.riskLevel === "severe_contraindication") {
        severeCount++;
      } else {
        cautionCount++;
      }
    } else {
      safeCount++;
    }
  }

  let overallStatus: "danger" | "warning" | "safe" = "safe";
  if (severeCount > 0) overallStatus = "danger";
  else if (cautionCount > 0) overallStatus = "warning";

  let summaryText = "未见明确严重药物相互作用，可按医嘱规范服药。";
  if (severeCount > 0) {
    summaryText = `⚠️ 警告：检测到 ${severeCount} 项严重配伍禁忌！可能导致抗肿瘤治疗彻底失效或引发严重药物蓄积毒性，严禁擅自同服。`;
  } else if (cautionCount > 0) {
    summaryText = `提示：检测到 ${cautionCount} 项需注意的相互作用，建议遵医嘱错峰服药或调整监测频率。`;
  }

  // 生成服药时序规划建议
  const dailySchedulePlan: Array<{ timeSlot: string; drugs: string[]; note: string }> = [];
  if (targetedDrug.phDependent) {
    dailySchedulePlan.push({
      timeSlot: "07:00 清晨空腹",
      note: "空腹服用胃酸依赖型靶向药物，保证充足生物利用度吸收",
      drugs: [targetedDrug.genericName],
    });
    dailySchedulePlan.push({
      timeSlot: "12:00 午餐时",
      note: "随餐服用常规心血管或慢性病药物",
      drugs: selectedChronicDrugs.filter(c => c.id !== "omeprazole").map(c => c.name),
    });
    if (selectedChronicDrugs.some(c => c.id === "omeprazole")) {
      dailySchedulePlan.push({
        timeSlot: "21:30 睡前",
        note: "错峰服用抑酸护胃药物（与清晨靶向药物理隔离 10 小时以上）",
        drugs: ["抑酸药 (奥美拉唑等)"],
      });
    }
  } else {
    dailySchedulePlan.push({
      timeSlot: "08:00 早餐后",
      note: "规范按医嘱服用抗肿瘤药物与基础慢病用药",
      drugs: [targetedDrug.genericName],
    });
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
    dailySchedulePlan,
  };
}
