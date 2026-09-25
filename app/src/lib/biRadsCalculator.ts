/**
 * BI-RADS (Breast Imaging Reporting and Data System) 影像分级计算与临床指导引擎
 * 严格遵循 ACR (American College of Radiology) 第 5 版标准规范
 */

export interface BiRadsAssessment {
  category: "1" | "2" | "3" | "4A" | "4B" | "4C" | "5" | "6" | string;
  categoryLabel: string;
  malignancyRiskText: string;
  malignancyRiskPercent: string;
  riskLevel: "safe" | "low" | "moderate" | "high" | "confirmed";
  badgeColor: string;
  clinicalInterpretation: string;
  actionGuidance: string;
  reassurance: string;
}

export function evaluateBiRads(categoryInput?: string | null): BiRadsAssessment | null {
  if (!categoryInput || !String(categoryInput).trim()) {
    return null;
  }
  const raw = String(categoryInput).trim().toUpperCase().replace(/BI-?RADS\s*/i, "").replace(/类/g, "");

  if (raw === "1") {
    return {
      category: "1",
      categoryLabel: "BI-RADS 1类 (阴性/正常)",
      malignancyRiskText: "0% (完全正常)",
      malignancyRiskPercent: "0%",
      riskLevel: "safe",
      badgeColor: "emerald",
      clinicalInterpretation: "乳腺实质结构对称、清晰，未见肿块、钙化或结构扭曲。",
      actionGuidance: "无需任何特殊处置，遵医嘱保持每年 1 次常规体检筛查。",
      reassurance: "完全正常的健康乳腺，请彻底放下心理负担，保持良好作息。"
    };
  }

  if (raw === "2") {
    return {
      category: "2",
      categoryLabel: "BI-RADS 2类 (明确良性)",
      malignancyRiskText: "0% 恶性风险 (完全良性)",
      malignancyRiskPercent: "0%",
      riskLevel: "safe",
      badgeColor: "emerald",
      clinicalInterpretation: "发现明确的良性病灶（如单纯囊肿、乳腺假体、退化性粗大钙化或陈旧纤维腺瘤）。",
      actionGuidance: "无需穿刺或手术切除，每年常规超声或钼靶体检即可。",
      reassurance: "良性发现绝不会恶变成癌，如同脸上的小雀斑，无需恐慌。"
    };
  }

  if (raw === "3") {
    return {
      category: "3",
      categoryLabel: "BI-RADS 3类 (良性可能大)",
      malignancyRiskText: "≤ 2% 极低微恶性概率",
      malignancyRiskPercent: "< 2%",
      riskLevel: "low",
      badgeColor: "sky",
      clinicalInterpretation: "多见于边界清楚的椭圆形实性结节（考虑纤维腺瘤）或簇状微囊肿，98% 以上为良性。",
      actionGuidance: "指南公认推荐【短期随访】（3~6 个月后复查超声），观察 2~3 年无变化自动降为 2 类；常规严禁盲目穿刺或盲目过度切除！",
      reassurance: "极大概率是良性小结节，给它一点时间定期复查对比即可，无需焦虑。"
    };
  }

  if (raw === "4A" || raw === "4-A") {
    return {
      category: "4A",
      categoryLabel: "BI-RADS 4A类 (低度可疑恶性)",
      malignancyRiskText: "> 2% 且 ≤ 10% 低度可疑",
      malignancyRiskPercent: "2% ~ 10%",
      riskLevel: "moderate",
      badgeColor: "amber",
      clinicalInterpretation: "具有轻度恶性可疑征象（如部分边缘不甚清晰的结节或微小复杂囊肿），但良性几率仍高达 90% 以上。",
      actionGuidance: "建议乳腺专科门诊就诊，医生通常推荐空芯针穿刺活检 (CNB) 或微创旋切活检明确病理，也可结合增强 MRI 鉴别。",
      reassurance: "虽然进入了4类，但 10 个人中有 9 个最终病理是良性，穿刺只为彻底消除未知。"
    };
  }

  if (raw === "4B" || raw === "4-B") {
    return {
      category: "4B",
      categoryLabel: "BI-RADS 4B类 (中度可疑恶性)",
      malignancyRiskText: "> 10% 且 ≤ 50% 中度可疑",
      malignancyRiskPercent: "10% ~ 50%",
      riskLevel: "high",
      badgeColor: "orange",
      clinicalInterpretation: "病灶兼具部分良性与恶性征象（如边界欠规则、纵横比接近或稍大于 1、微细成簇钙化）。",
      actionGuidance: "必须在超声或钼靶定位下行组织学空芯针活检 (Core Needle Biopsy)，拿到金标准病理诊断。",
      reassurance: "积极就诊于三甲乳腺专科，早确诊早解决是现代医学最有效的手段。"
    };
  }

  if (raw === "4C" || raw === "4-C") {
    return {
      category: "4C",
      categoryLabel: "BI-RADS 4C类 (高度可疑恶性)",
      malignancyRiskText: "> 50% 且 < 95% 高度可疑",
      malignancyRiskPercent: "50% ~ 95%",
      riskLevel: "high",
      badgeColor: "rose",
      clinicalInterpretation: "具有典型恶性征象（如毛刺征、成簇多形性泥沙样微钙化、结构扭曲、血流信号丰富）。",
      actionGuidance: "应尽早安排空芯针穿刺活检明确病理类型及免疫组化受体（ER/PR/HER2/Ki-67），并同步进行腋窝超声排查。",
      reassurance: "即便确诊，早期乳腺癌治愈率极高（>90%），现代精准医学有丰富的武器守护健康。"
    };
  }

  if (raw === "4") {
    return {
      category: "4",
      categoryLabel: "BI-RADS 4类 (可疑恶性)",
      malignancyRiskText: "2% ~ 95% 可疑恶性",
      malignancyRiskPercent: "2% ~ 95%",
      riskLevel: "high",
      badgeColor: "amber",
      clinicalInterpretation: "报告未细分 A/B/C 亚亚型，统称为可疑恶性病变，需要组织学病理进一步明确。",
      actionGuidance: "请至三甲乳腺专科完善空芯针穿刺活检，明确组织病理与受体状态。",
      reassurance: "4类中良恶性并存，切勿自行盲目恐慌，以组织切片病理金标准为准。"
    };
  }

  if (raw === "5") {
    return {
      category: "5",
      categoryLabel: "BI-RADS 5类 (高度提示恶性)",
      malignancyRiskText: "≥ 95% 高度提示恶性",
      malignancyRiskPercent: "≥ 95%",
      riskLevel: "high",
      badgeColor: "red",
      clinicalInterpretation: "具备几乎所有恶性经典影像学特征（成簇分支状细钙化、浸润毛刺、后方回声衰减）。",
      actionGuidance: "必须立即安排空芯针穿刺活检，完善乳腺及全身转移排查，组织乳腺外科、肿瘤内科多学科 (MDT) 会诊拟定手术或新辅助方案。",
      reassurance: "现代乳腺癌治疗体系极其成熟，规范化综合治疗下生存率极佳，请积极配合专科医生。"
    };
  }

  if (raw === "6") {
    return {
      category: "6",
      categoryLabel: "BI-RADS 6类 (病理已证实恶性)",
      malignancyRiskText: "100% 活检已证实",
      malignancyRiskPercent: "100%",
      riskLevel: "confirmed",
      badgeColor: "purple",
      clinicalInterpretation: "病灶已行穿刺活检且病理组织学已明确证实为恶性肿瘤，当前检查用于评估疗效或手术切除范围。",
      actionGuidance: "遵循乳腺专科主治医生安排，按期推进新辅助治疗评估或根治性手术计划。",
      reassurance: "确诊即是战胜疾病的起点，按指南规范治疗定能赢得康复。"
    };
  }

  return {
    category: "0",
    categoryLabel: "BI-RADS 0类 (需补充其他影像检查)",
    malignancyRiskText: "评估未完成",
    malignancyRiskPercent: "待补充",
    riskLevel: "moderate",
    badgeColor: "slate",
    clinicalInterpretation: "当前检查信息不充分（如腺体极其致密致使病灶掩盖），无法做出明确分类。",
    actionGuidance: "建议结合钼靶与乳腺高频超声互补互查，必要时进行乳腺增强 MRI 进一步评估。",
    reassurance: "这并不代表病情严重，只是检查方式需要互补以避免遗漏。"
  };
}
