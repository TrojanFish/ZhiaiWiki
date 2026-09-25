import type { TargetedDrug, ChronicDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

/**
 * 结直肠癌临床主流与前沿靶向、免疫及口服化疗药物库 (15 种精准覆盖)
 */
export const COLORECTAL_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "cetuximab",
    genericName: "西妥昔单抗注射液",
    brandName: "爱必妥 (Erbitux)",
    generation: "经典重组嵌合人鼠抗 EGFR 单抗",
    target: "EGFR" as any,
    standardDosage: "初始 400mg/m² 静滴 120min，维持 250mg/m² 每周一次，或 500mg/m² 每两周一次",
    metabolismPathway: "网状内皮系统吞噬介导的清除，不经肝脏细胞色素 P450 酶系代谢",
    phDependent: false,
  },
  {
    id: "panitumumab",
    genericName: "帕尼单抗注射液",
    brandName: "维泰普 (Vectibix)",
    generation: "全人源化抗 EGFR 单克隆抗体",
    target: "EGFR" as any,
    standardDosage: "6mg/kg 静脉滴注 每两周一次 (Q2W)",
    metabolismPathway: "通过网状内皮系统被吸收清除为氨基酸与肽段",
    phDependent: false,
  },
  {
    id: "bevacizumab",
    genericName: "贝伐珠单抗注射液",
    brandName: "安维汀 / 达攸同 (Avastin)",
    generation: "重组人源化抗 VEGF 血管内皮生长因子单抗",
    target: "VEGF" as any,
    standardDosage: "5mg/kg 每2周一次，或 7.5mg/kg 每3周一次 (联合化疗)",
    metabolismPathway: "经全身组织蛋白水解酶代谢，无明确肝药酶依赖",
    phDependent: false,
  },
  {
    id: "fruquintinib",
    genericName: "呋喹替尼胶囊",
    brandName: "爱优特 (Elunate)",
    generation: "中国自主原研高选择性 VEGFR 1/2/3 小分子 TKI",
    target: "VEGFR" as any,
    standardDosage: "5mg 每日一次 口服，连服21天停7天 (28天一周期)",
    metabolismPathway: "主要经肝脏 CYP3A4、CYP2C8 氧化代谢，部分经 UGT1A9 葡萄糖醛酸化",
    phDependent: false,
  },
  {
    id: "regorafenib",
    genericName: "瑞戈非尼片",
    brandName: "拜万戈 (Stivarga)",
    generation: "口服多激酶多靶点血管生成与微环境抑制剂",
    target: "VEGFR" as any,
    standardDosage: "160mg 每日一次 随清淡低脂早餐口服，连服21天停7天",
    metabolismPathway: "主要经肝脏 CYP3A4 介导氧化代谢及 UGT1A9 介导的葡萄糖醛酸化结合",
    phDependent: false,
  },
  {
    id: "pembrolizumab",
    genericName: "帕博利珠单抗注射液",
    brandName: "可瑞达 (Keytruda)",
    generation: "高亲和力抗 PD-1 人源化 IgG4 单克隆抗体",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每3周一次 (Q3W)，或 400mg 每6周一次",
    metabolismPathway: "非特异性蛋白质分解代谢途径清除，无 P450 药物相互作用",
    phDependent: false,
  },
  {
    id: "envafolimab",
    genericName: "恩沃利单抗注射液",
    brandName: "恩维达 (Envafolimab)",
    generation: "中国特有单域抗体片段 Fc 融合皮下注射抗 PD-L1",
    target: "PD-L1" as any,
    standardDosage: "150mg 每周一次 或 300mg 每两周一次 皮下注射",
    metabolismPathway: "经内源性蛋白质分解代谢水解为小肽与游离氨基酸",
    phDependent: false,
  },
  {
    id: "tislelizumab",
    genericName: "替雷利珠单抗注射液",
    brandName: "百泽安 (Baizean)",
    generation: "经 Fc 段改造防巨噬细胞 ADCP 效应的抗 PD-1 单抗",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每3周一次 (Q3W)",
    metabolismPathway: "网状内皮系统分解代谢，不经肝药酶",
    phDependent: false,
  },
  {
    id: "encorafenib",
    genericName: "恩考芬尼胶囊",
    brandName: "Braftovi",
    generation: "高选择性小分子 ATP 竞争性 BRAF 激酶抑制剂",
    target: "BRAF" as any,
    standardDosage: "300mg 每日一次口服 (联合西妥昔单抗)",
    metabolismPathway: "主要经肝脏 CYP3A4 代谢 (约 86%)，少量经 CYP2C19 及 CYP2D6 代谢",
    phDependent: false,
  },
  {
    id: "trastuzumab_deruxtecan",
    genericName: "注射用德曲妥珠单抗",
    brandName: "优赫得 / Enhertu (T-DXd)",
    generation: "新一代 HER2-ADC 靶向抗体偶联药物 (DESTINY-CRC01)",
    target: "HER2" as any,
    standardDosage: "6.4mg/kg 静脉滴注 每3周一次 (Q3W)",
    metabolismPathway: "抗体蛋白片段降解；载荷 DXd 经 CYP3A4 缓慢代谢",
    phDependent: false,
  },
  {
    id: "capecitabine",
    genericName: "卡培他滨片",
    brandName: "希罗达 (Xeloda) / 类似物",
    generation: "口服氟尿嘧啶氨基甲酸酯前体化疗药 (CAPOX/单药基石)",
    target: "Chemotherapy" as any,
    standardDosage: "1000~1250mg/m² 每日两次 早晚饭后半小时口服，连服14天停7天",
    metabolismPathway: "肠道吸收后在肝脏羧酸酯酶及肿瘤组织胸苷磷酸化酶 (TP) 级联转化为 5-FU",
    phDependent: true,
  },
  {
    id: "oxaliplatin",
    genericName: "注射用奥沙利铂",
    brandName: "乐沙定 (Eloxatin)",
    generation: "第三代有机铂类抗肿瘤化疗药物 (MOSAIC/IDEA基石)",
    target: "Chemotherapy" as any,
    standardDosage: "130mg/m² 静滴 2小时 每3周一次 (CAPOX)，或 85mg/m² 每2周一次 (FOLFOX)",
    metabolismPathway: "主要通过非酶促水解转变为具有烷化活性的二氨基环己烷铂 (DACH-Pt)",
    phDependent: false,
  },
  {
    id: "irinotecan",
    genericName: "盐酸伊立替康注射液",
    brandName: "开普拓 (Campto)",
    generation: "半合成喜树碱衍生物 DNA 拓扑异构酶 I 抑制剂 (FOLFIRI基石)",
    target: "Chemotherapy" as any,
    standardDosage: "180mg/m² 静滴 90min 每2周一次 (联合 5-FU/LV)",
    metabolismPathway: "经羧酸酯酶水解为高活性 SN-38；SN-38 经肝脏 UGT1A1 葡萄糖醛酸结合解毒",
    phDependent: false,
  },
  {
    id: "trifluridine_tipiracil",
    genericName: "曲氟尿苷替匹嘧啶片",
    brandName: "朗斯弗 (TAS-102 / Lonsurf)",
    generation: "新型口服胸苷类似物与胸苷磷酸化酶抑制剂复方制剂 (NMPA晚期三线)",
    target: "Nucleoside" as any,
    standardDosage: "35mg/m²/次 每日两次 随早晚餐后口服，第1-5天及第8-12天服药，28天一周期",
    metabolismPathway: "曲氟尿苷掺入肿瘤 DNA；替匹嘧啶阻断其降解，不主要依赖 CYP 酶系",
    phDependent: false,
  },
  {
    id: "sotorasib",
    genericName: "索托拉西布片 (探索性)",
    brandName: "Lumakras / Sotorasib",
    generation: "KRAS G12C 突变特异性共价结合抑制剂 (⚠️ CRC非中国NMPA获批适应症)",
    target: "KRAS" as any,
    standardDosage: "960mg 口服 每日一次 (需与抗 EGFR 单抗联合探索)",
    metabolismPathway: "主要经 CYP3A4 氧化代谢与非酶水解",
    phDependent: true,
  },
];

/**
 * 结直肠癌专病药物相互作用 (DDI) 循证排雷规则库
 */
export const COLORECTAL_DDI_RULES: DdiRule[] = [
  // 1. 卡培他滨 ✕ 华法林 (极其严重的致死性出血风险)
  {
    targetDrugIds: ["capecitabine"],
    chronicDrugId: "warfarin",
    riskLevel: "severe_contraindication",
    riskLabel: "严禁配伍 · 致死性凝血异常",
    title: "卡培他滨 ✕ 华法林：强烈抑制抗凝药代谢导致 INR 骤升与严重出血",
    mechanism: "卡培他滨及其代谢产物在体内显著下调细胞色素 P450 CYP2C9 同工酶活性，而华法林的活性 S-异构体几乎全部依赖 CYP2C9 清除。合用可使华法林半衰期成倍延长，凝血酶原时间 (PT) 及国际标准化比值 (INR) 出现无法预测的暴发性升高，极易诱发致命性消化道或颅内出血！",
    clinicalGuidance: "【FDA/NMPA 黑框警告】：接受卡培他滨治疗的患者强烈推荐立即停用口服华法林，转为使用对 CYP 酶无影响的低分子肝素 (LMWH) 皮下注射抗凝；若必须维持华法林，必须自服药第 1 天起每日严密监测 INR 并准备随时减量停药。",
    evidenceLevel: "FDA/NMPA说明书",
    timingRecommendation: "不可通过分时错峰解决，须遵医嘱直接换用低分子肝素皮下注射。",
  },

  // 2. 卡培他滨 ✕ 别嘌醇 (化疗减效)
  {
    targetDrugIds: ["capecitabine"],
    chronicDrugId: "allopurinol",
    riskLevel: "timing_caution",
    riskLabel: "配伍注意 · 化疗疗效折损",
    title: "卡培他滨 ✕ 别嘌醇：阻断嘧啶合成旁路削弱抗肿瘤杀伤力",
    mechanism: "痛风降尿酸药别嘌醇可抑制乳清酸核苷酸脱羧酶，干扰氟尿嘧啶类化合物在肿瘤细胞内活化为活性产物 (FdUMP) 的转化级联，前瞻药理研究显示合用可能削弱卡培他滨的抗癌疗效。",
    clinicalGuidance: "结直肠癌化疗期间如需降尿酸，优先推荐非布司他 (Febuxostat)，或在密切监测尿酸的前提下错峰服用，避免削弱抗肿瘤功效。",
    evidenceLevel: "权威前瞻临床研究",
    timingRecommendation: "降尿酸药物建议早晨空腹服用，卡培他滨晚间及早间随餐服用，必要时换用非布司他。",
  },

  // 3. 卡培他滨 ✕ PPI 质子泵抑制剂 (奥美拉唑/雷贝拉唑/埃索美拉唑)
  {
    targetDrugIds: ["capecitabine"],
    chronicDrugId: "omeprazole",
    riskLevel: "timing_caution",
    riskLabel: "时序注意 · 胃内溶出度影响",
    title: "卡培他滨 ✕ 质子泵抑制剂 (PPI)：胃内 pH 改变影响吸收峰",
    mechanism: "卡培他滨片剂的体外崩解与胃内吸收具有一定酸依赖性。强效抑酸剂升高胃内 pH 值可能减慢卡培他滨溶出速度，降低血药暴露量。",
    clinicalGuidance: "若合并反流性食管炎或胃炎必须使用 PPI，建议奥美拉唑晨起空腹服用，卡培他滨严格在早餐及晚餐后半小时服用，两药物理间隔至少 2 小时以上。",
    evidenceLevel: "药代动力学PK证据",
    timingRecommendation: "奥美拉唑晨起 07:00 空腹服用；卡培他滨早餐后 08:30 服用，严格间隔 1.5~2 小时。",
  },
  {
    targetDrugIds: ["capecitabine"],
    chronicDrugId: "rabeprazole",
    riskLevel: "timing_caution",
    riskLabel: "时序注意 · 胃内溶出度影响",
    title: "卡培他滨 ✕ 雷贝拉唑：胃酸抑制导致片剂溶出减慢",
    mechanism: "雷贝拉唑强效持久抑制胃酸分泌，使胃液 pH 上升至 4~6，可能降低口服卡培他滨的生物利用度。",
    clinicalGuidance: "雷贝拉唑建议晨起空腹一次服用，卡培他滨早晚餐后半小时口服，避免与抑酸药同服。",
    evidenceLevel: "药代动力学PK证据",
    timingRecommendation: "晨起 07:00 服用雷贝拉唑，早饭后 08:30 服用卡培他滨。",
  },
  {
    targetDrugIds: ["capecitabine"],
    chronicDrugId: "esomeprazole",
    riskLevel: "timing_caution",
    riskLabel: "时序注意 · 胃内溶出度影响",
    title: "卡培他滨 ✕ 埃索美拉唑：建议错开服药时间",
    mechanism: "强抑酸改变胃内微环境，延缓卡培他滨吸收达峰时间。",
    clinicalGuidance: "埃索美拉唑于早间空腹服用，卡培他滨随早晚餐后半小时温水送服。",
    evidenceLevel: "药代动力学PK证据",
    timingRecommendation: "间隔 2 小时以上服用。",
  },

  // 4. 呋喹替尼 / 瑞戈非尼 ✕ 强 CYP3A4 诱导剂 (利福平 / 卡马西平 / 苯妥英钠)
  {
    targetDrugIds: ["fruquintinib", "regorafenib", "encorafenib", "sotorasib"],
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 靶向药彻底失效",
    title: "呋喹替尼 / 瑞戈非尼 ✕ 利福平：CYP3A4 强诱导致血药浓度骤降 80%",
    mechanism: "利福平是机体最强的 CYP3A4 及 P-gp 转运体诱导剂。合用可使呋喹替尼或瑞戈非尼的血浆暴露量 (AUC) 暴跌 70%~85%，靶向抗血管生成作用完全无法达到有效抑瘤浓度，直接导致肿瘤进展与抗药！",
    clinicalGuidance: "【严禁合用】：抗结核治疗期间必须绝对避免使用利福平，请感染科协助换用不诱导 CYP3A4 的乙胺丁醇、链霉素或氟喹诺酮类方案。",
    evidenceLevel: "FDA/NMPA说明书",
    timingRecommendation: "不可错峰，严禁配伍。",
  },
  {
    targetDrugIds: ["fruquintinib", "regorafenib", "encorafenib"],
    chronicDrugId: "carbamazepine",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 靶向浓度大幅削弱",
    title: "小分子 TKI ✕ 卡马西平：强酶诱导削弱抗癌活性",
    mechanism: "抗癫痫药卡马西平强效诱导肝脏 CYP3A4，显著加快结直肠癌小分子靶向药的消除代谢速率，使抗癌血药浓度减半以上。",
    clinicalGuidance: "合并癫痫或神经痛患者，请神经科调整为对 CYP 酶系无明显影响的左乙拉西坦 (Levetiracetam) 或加巴喷丁。",
    evidenceLevel: "FDA/NMPA说明书",
  },

  // 5. 呋喹替尼 / 瑞戈非尼 ✕ 强 CYP3A4 抑制剂 (西柚 / 克拉霉素 / 酮康唑)
  {
    targetDrugIds: ["fruquintinib", "regorafenib", "encorafenib"],
    chronicDrugId: "grapefruit",
    riskLevel: "severe_contraindication",
    riskLabel: "饮食红线 · 毒性指数级加剧",
    title: "小分子 TKI ✕ 西柚 / 葡萄柚汁：不可逆抑制肠道 CYP3A4 诱发重度毒性",
    mechanism: "西柚所含呋喃香豆素强烈不可逆灭活小肠黏膜 CYP3A4，导致呋喹替尼/瑞戈非尼首过消除受阻，血药峰浓度猛增 2~3 倍，诱发难控性 3/4 级手足皮肤反应、恶性高血压甚至胃肠穿孔！",
    clinicalGuidance: "靶向用药全周期内严格禁食西柚、葡萄柚、红柚汁及其浓缩果膏制品。",
    evidenceLevel: "FDA/NMPA说明书",
  },
  {
    targetDrugIds: ["fruquintinib", "regorafenib", "encorafenib"],
    chronicDrugId: "clarithromycin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重注意 · 毒性激增",
    title: "小分子 TKI ✕ 克拉霉素：强抑 CYP3A4 导致 TKI 蓄积中毒",
    mechanism: "大环内酯类抗生素克拉霉素强烈抑制 CYP3A4，使靶向 TKI 代谢停滞蓄积，不良反应急剧增加。",
    clinicalGuidance: "抗感染请换用阿莫西林克拉维酸钾、头孢克肟或阿奇霉素（阿奇霉素对 CYP3A4 抑制极弱）。",
    evidenceLevel: "FDA/NMPA说明书",
  },

  // 6. 贝伐珠单抗 ✕ 抗凝药 (阿司匹林 / 华法林) - 出血排查
  {
    targetDrugIds: ["bevacizumab"],
    chronicDrugId: "aspirin",
    riskLevel: "timing_caution",
    riskLabel: "时序谨慎 · 出血风险叠加监测",
    title: "贝伐珠单抗 ✕ 阿司匹林：抗血小板与抗血管生成叠加增加出血机率",
    mechanism: "贝伐珠单抗阻断 VEGF 会损伤血管内皮细胞自我修复更新能力；合用抗血小板聚集药物阿司匹林可能增加胃肠道黏膜出血、鼻衄或手术创口渗血几率。",
    clinicalGuidance: "若合并冠心病支架术后需维持阿司匹林，应优先选用小剂量肠溶剂型 (100mg QD)，并密切观察便潜血、黑便及牙龈渗血；若需大手术或拔牙，贝伐珠单抗必须停用至少 4~6 周。",
    evidenceLevel: "权威前瞻临床研究",
    timingRecommendation: "阿司匹林随晚餐服用，定期复查便常规及血常规血红蛋白。",
  },

  // 7. 伊立替康 ✕ 酮康唑 / 依曲康唑 (严重骨髓抑制)
  {
    targetDrugIds: ["irinotecan"],
    chronicDrugId: "ketoconazole",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 致死性中性粒细胞减少",
    title: "伊立替康 ✕ 唑类抗真菌药：抑制代谢导致活性 SN-38 浓度暴增",
    mechanism: "酮康唑强烈抑制 CYP3A4 介导的伊立替康旁路氧化代谢，迫使其大量转化为超高毒性代谢物 SN-38，引发极度致命的 4 级中性粒细胞缺乏合并脓毒症及重度难治性腹泻！",
    clinicalGuidance: "【严禁配伍】：接受伊立替康化疗期间若发生深部真菌感染，推荐选用氟康唑（对 CYP3A4 抑制显著较弱）或棘白菌素类（卡泊芬净）。",
    evidenceLevel: "FDA/NMPA说明书",
  },
];

/**
 * 结直肠癌专病 DDI 检查调度引擎
 */
export function checkColorectalDdi(targetedDrugId: string, chronicDrugIds: string[]): DdiAnalysisResult {
  const targetedDrug = COLORECTAL_TARGETED_DRUGS.find(d => d.id === targetedDrugId) || null;
  const selectedChronicDrugs = ALL_CHRONIC_DRUGS.filter(c => chronicDrugIds.includes(c.id));

  const interactions: Array<{ chronicDrug: ChronicDrug; rule: DdiRule }> = [];
  let severeCount = 0;
  let cautionCount = 0;
  let safeCount = 0;

  for (const chronicDrug of selectedChronicDrugs) {
    const matchedRule = COLORECTAL_DDI_RULES.find(
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
  let summaryText = "当前选中的慢病合并用药未见明确严重相互作用，可按规范医嘱服用。";

  if (severeCount > 0) {
    overallStatus = "danger";
    summaryText = `⚠️ 检测到 ${severeCount} 项高危配伍禁忌！存在引发严重内出血、药物蓄积中毒或化疗靶向完全失效的风险，请务必遵医嘱调整！`;
  } else if (cautionCount > 0) {
    overallStatus = "warning";
    summaryText = `检测到 ${cautionCount} 项需注意服药时序与吸收影响的相互作用，建议错峰 2 小时以上服药。`;
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
        drugs: ["若有奥美拉唑/雷贝拉唑等抑酸药", "甲状腺素/降压药"],
        note: "空腹吸收好，且与化疗口服药彻底错峰 1.5~2 小时。"
      },
      {
        timeSlot: "早晨 08:30 (早餐后30分钟)",
        drugs: [targetedDrug?.genericName || "结直肠癌专科口服靶向/化疗药物 (如卡培他滨/呋喹替尼)"],
        note: "随餐或餐后温水送服，胃肠道刺激小，吸收均匀。"
      },
      {
        timeSlot: "晚间 20:30 (晚餐后30分钟)",
        drugs: ["卡培他滨晚间剂量 (若为每日两次方案)"],
        note: "与早间剂量严格保持 12 小时间隔，维持平稳血药杀伤浓度。"
      }
    ]
  };
}

export const checkColorectalDrugInteractions = checkColorectalDdi;
