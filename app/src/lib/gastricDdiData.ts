import type { TargetedDrug, ChronicDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

/**
 * 胃癌 (Gastric Cancer) 临床主流靶向、免疫、抗血管及标准围术期/晚期化疗药物库 (10 种代表性核心药物)
 */
export const GASTRIC_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "zolbetuximab",
    genericName: "佐妥昔单抗注射液",
    brandName: "安维莱 (Vyloy / Zolbetuximab)",
    generation: "全球首款 Claudin 18.2 靶向单克隆抗体 (SPOTLIGHT / GLOW 试验确证一线突破)",
    target: "Claudin 18.2" as any,
    standardDosage: "首剂 800mg/m² 静脉滴注，后续 600mg/m² 每3周一次 (Q3W) 或 400mg/m² 每2周一次 (Q2W)，联合 mFOLFOX6 或 CAPOX",
    metabolismPathway: "通过单核-巨噬细胞系统水解降解消除，不依赖肝脏细胞色素 P450 酶代谢",
    phDependent: false,
  },
  {
    id: "trastuzumab",
    genericName: "注射用曲妥珠单抗",
    brandName: "赫赛汀 (Herceptin)",
    generation: "重组抗 HER2 人源化 IgG1 单克隆抗体 (ToGA 试验确立 HER2 阳性胃癌一线金标准)",
    target: "HER2" as any,
    standardDosage: "首次负荷剂量 8mg/kg 静脉滴注，维持剂量 6mg/kg 每3周一次 (Q3W)，联合顺铂/奥沙利铂+氟尿嘧啶类",
    metabolismPathway: "非特异性网状内皮系统分解清除，半衰期约 28 天",
    phDependent: false,
  },
  {
    id: "trastuzumab_deruxtecan",
    genericName: "注射用德曲妥珠单抗",
    brandName: "优赫得 (Enhertu / T-DXd)",
    generation: "新型 HER2 靶向抗体偶联药物 (ADC，载荷拓扑异构酶I抑制剂，DESTINY-Gastric01/02 二线及后线突破)",
    target: "HER2" as any,
    standardDosage: "6.4mg/kg 静脉滴注 每3周一次 (Q3W)，给药前需全面评估基线肺部 HRCT",
    metabolismPathway: "游离载荷 DXd 主要经肝脏 CYP3A4 极微量代谢，绝大部分经胆汁-粪便途径清除",
    phDependent: false,
  },
  {
    id: "apatinib",
    genericName: "甲磺酸阿帕替尼片",
    brandName: "艾坦 (Apatinib / Rivoceranib)",
    generation: "中国自主原研高选择性 VEGFR-2 口服小分子酪氨酸激酶抑制剂 (胃癌三线及以上单药确证)",
    target: "VEGFR" as any,
    standardDosage: "500mg (1片) 每日一次 (QD) 口服，餐后半小时服用，温开水送服",
    metabolismPathway: "主要由肝脏 CYP3A4/5 介导代谢，CYP2D6、CYP2C9 次要参与；为 CYP2C9 和 CYP2D6 弱抑制剂",
    phDependent: false,
  },
  {
    id: "nivolumab",
    genericName: "纳武利尤单抗注射液",
    brandName: "欧狄沃 (Opdivo)",
    generation: "全人源化抗 PD-1 单克隆抗体 (CheckMate-649 胃癌/GEJ 一线 CPS>=5 核心推荐)",
    target: "PD-1" as any,
    standardDosage: "360mg 静脉滴注 Q3W 或 240mg Q2W，联合含氟尿嘧啶及奥沙利铂双药化疗",
    metabolismPathway: "通过体内免疫球蛋白正常降解途径水解清除",
    phDependent: false,
  },
  {
    id: "sintilimab",
    genericName: "信迪利单抗注射液",
    brandName: "达伯舒 (Tyvyt)",
    generation: "中国原研全人源化抗 PD-1 单抗 (ORIENT-16 试验确证不可切除局部晚期或转移性胃癌一线)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每3周一次 (Q3W)，联合 XELOX 方案化疗",
    metabolismPathway: "通过非特异性蛋白质分解代谢消除",
    phDependent: false,
  },
  {
    id: "tislelizumab",
    genericName: "替雷利珠单抗注射液",
    brandName: "百泽安 (Tisle)",
    generation: "Fc段结构优化抗 PD-1 单抗 (RATIONALE-305 试验确证 PD-L1 阳性晚期胃癌一线)",
    target: "PD-1" as any,
    standardDosage: "200mg 静脉滴注 每3周一次 (Q3W)，联合含铂和氟尿嘧啶类化疗",
    metabolismPathway: "通过机体正常抗体代谢通路分解清除",
    phDependent: false,
  },
  {
    id: "ramucirumab",
    genericName: "雷莫西尤单抗注射液",
    brandName: "希冉妥 (Cyramza / Ramucirumab)",
    generation: "重组人源化抗 VEGFR-2 单克隆抗体 (RAINBOW / REGARD 试验确立晚期胃癌二线核心地位)",
    target: "VEGFR" as any,
    standardDosage: "8mg/kg 静脉滴注 每2周一次 (Q2W)，联合紫杉醇或单药",
    metabolismPathway: "经机体网状内皮系统降解清除",
    phDependent: false,
  },
  {
    id: "flot_chemo",
    genericName: "FLOT 围术期新辅助/辅助化疗方案",
    brandName: "FLOT (氟尿嘧啶 + 亚叶酸钙 + 奥沙利铂 + 多西他赛)",
    generation: "欧洲 FLOT4 研究确立的局部进展期胃腺癌/胃食管结合部腺癌围术期金标准方案",
    target: "Chemotherapy" as any,
    standardDosage: "术前 4 周期 + 术后 4 周期，每 2 周给药一次 (多西他赛 50mg/m², 奥沙利铂 85mg/m², 亚叶酸钙 200mg/m², 5-FU 2600mg/m² 持续输注24小时)",
    metabolismPathway: "5-FU 经 DPD 酶代谢；奥沙利铂经非酶促降解；多西他赛经肝脏 CYP3A4 强依赖代谢",
    phDependent: false,
  },
  {
    id: "sox_xelox",
    genericName: "SOX / XELOX 口服化疗双药方案",
    brandName: "SOX (奥沙利铂+替吉奥 S-1) / XELOX (奥沙利铂+卡培他滨)",
    generation: "东亚地区 (中国/日本/韩国) 最广泛应用的胃癌根治术后辅助化疗与晚期一线口服基石方案",
    target: "Chemotherapy" as any,
    standardDosage: "奥沙利铂 130mg/m² 第1天静滴；联合替吉奥 40-60mg bid 或卡培他滨 1000mg/m² bid 连服14天停7天 (21天为一周期)",
    metabolismPathway: "替吉奥含有 CDHP 阻断 DPD 降解维持血药浓度；卡培他滨经肝脏胸苷磷酸化酶在肿瘤内转化为 5-FU",
    phDependent: false,
  },
];

/**
 * 胃癌关键临床药物相互作用规则 (11 条高风险拦截与临床时序管理规则)
 */
export interface GastricDdiRuleItem {
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

const RAW_GASTRIC_DDI_RULES: GastricDdiRuleItem[] = [
  // 1. 佐妥昔单抗 (Zolbetuximab) 恶心呕吐重度防治时序
  {
    id: "gastric-ddi-zolbetuximab-emesis",
    targetedDrugId: "zolbetuximab",
    chronicDrugId: "omeprazole", // 胃酸/止吐时序联动
    riskLevel: "timing_warning",
    severityScore: 2,
    mechanism: "佐妥昔单抗主要不良反应为高发生率的恶心和呕吐 (发生率超 70%，且常在输注初次发生)，单抗水解不依赖胃内酸性，但须预防用药。",
    clinicalManifestation: "若未做充分止吐预处理，患者可在开始滴注后 1~2 小时内发生中重度喷射性呕吐与水电解质紊乱。",
    management: "【输注前止吐预处理黄金三联】：在佐妥昔单抗输注前 1 小时，必须规范静脉给予：① 地塞米松 10mg；② 5-HT3 受体拮抗剂 (如昂丹司琼 8mg 或格拉司琼)；③ NK-1 受体拮抗剂 (福沙匹坦 150mg 或阿瑞匹坦)。滴注速度宜从慢速 (20~50 mL/h) 递增，必要时暂停滴注或对症加用胃复安。",
    evidenceSource: "SPOTLIGHT (Lancet 2023) & GLOW (Nature Med 2023) 胃癌临床试验预处理规范",
  },

  // 2. 曲妥珠单抗 (Trastuzumab) + 蒽环类化疗 (多柔比星/表柔比星) 心脏毒性致命叠加
  {
    id: "gastric-ddi-trastuzumab-anthracycline",
    targetedDrugId: "trastuzumab",
    chronicDrugId: "atorvastatin", // 代表合并心血管风险基线
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "曲妥珠单抗阻断 HER2 信号会破坏心肌细胞自身受损后的修复保护机制；若与蒽环类抗肿瘤抗生素同时使用，可诱发不可逆心肌坏死与充血性心力衰竭 (CHF)。",
    clinicalManifestation: "活动后气促、端坐呼吸、下肢水肿、LVEF (左室射血分数) 绝对值下降超过 10% 且低于正常下限 (50%)。",
    management: "【严禁同期联合】：在胃癌新辅助或术后化疗中，严禁曲妥珠单抗与含蒽环类 (如多柔比星/表柔比星) 方案同时输注！HER2 阳性胃癌标准方案为曲妥珠单抗联合氟尿嘧啶类加铂类 (XP/SP/SOX)。治疗基线、治疗中每 3 个月必须复查超声心动图，若 LVEF < 45% 或较基线下降 >= 10% 必须暂停靶向治疗。",
    evidenceSource: "CSCO 胃癌诊疗指南 (2024版) · ASCO 肿瘤心脏病学临床实践指南",
  },

  // 3. 德曲妥珠单抗 (T-DXd) 间质性肺病 (ILD) 预警
  {
    id: "gastric-ddi-tdxd-ild-warning",
    targetedDrugId: "trastuzumab_deruxtecan",
    chronicDrugId: "aspirin", // 基础抗凝/合并症
    riskLevel: "timing_warning",
    severityScore: 2,
    mechanism: "T-DXd 携带的高活性拓扑异构酶 I 抑制剂载荷具有肺泡巨噬细胞蓄积倾向，可诱发药物相关性间质性肺病 (ILD) / 肺炎 (发生率约 10%~15%)。",
    clinicalManifestation: "活动后干咳、劳力性气促、呼吸困难或伴低热，胸部高分辨 CT 呈双肺磨玻璃影 (GGO) 或网状纤维化浸润。",
    management: "【ILD 零容忍阶梯阻断原则】：① 给药前必须完成胸部高分辨薄层 CT 基线扫描；② 出现 1 级 ILD (无症状仅影像学异常) 必须立即暂停 T-DXd，口服泼尼松 0.5~1 mg/kg/天；③ 出现 2 级及以上 (有咳嗽气促症状) 必须【永久停用 T-DXd】，立即启动大剂量甲泼尼龙冲击治疗。",
    evidenceSource: "DESTINY-Gastric01/02 研究 & FDA/NMPA 德曲妥珠单抗黑框警示",
  },

  // 4. 阿帕替尼 (Apatinib) + 强 CYP3A4 抑制剂 (克拉霉素/酮康唑/西柚)
  {
    id: "gastric-ddi-apatinib-cyp3a4-inhibitor",
    targetedDrugId: "apatinib",
    chronicDrugId: "clarithromycin",
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "甲磺酸阿帕替尼主要通过肝脏 CYP3A4 酶系统氧化代谢。克拉霉素、伊曲康唑、酮康唑等强抑制剂能使阿帕替尼暴露量 (AUC) 暴增 2~4 倍。",
    clinicalManifestation: "血压急剧飙升 (高血压危象)、重度蛋白尿、掌跖红斑综合征 (手足皮肤开裂溃疡) 以及致命性消化道出血穿孔风险显著增高。",
    management: "【禁止联用强 CYP3A4 抑制剂】：抗感染治疗应选用对 CYP3A4 无抑制作用的头孢类、青霉素类或阿奇霉素；患者服药期间严禁食用西柚 (葡萄柚) 及其制品。如不可避免需合用弱/中度抑制剂，阿帕替尼剂量需下调至 250mg 每日一次并严密监测血压与尿蛋白。",
    evidenceSource: "国家药监局 NMPA 甲磺酸阿帕替尼说明书 · Drug Metabolism and Pharmacokinetics",
  },

  // 5. 阿帕替尼 (Apatinib) + 强 CYP3A4 诱导剂 (利福平/苯妥英钠/圣约翰草)
  {
    id: "gastric-ddi-apatinib-cyp3a4-inducer",
    targetedDrugId: "apatinib",
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "强 CYP3A4 诱导剂可极度上调肝药酶代谢活性，导致阿帕替尼在体内迅速被清除，血药稳态谷浓度下降 70% 以上。",
    clinicalManifestation: "阿帕替尼靶向血药浓度无法达到抗血管生成治疗窗，导致胃癌肿瘤迅速进展失去控制。",
    management: "【禁止联合利福平等强诱导剂】：需抗结核治疗时，建议经专科会诊换用不诱导 CYP3A4 的替代方案；抗癫痫应首选左乙拉西坦或丙戊酸钠，避免使用苯妥英钠、卡马西平或苯巴比妥。",
    evidenceSource: "CSCO 胃癌诊疗指南 (2024) 靶向药物相互作用规范",
  },

  // 6. 阿帕替尼 (Apatinib) + 华法林 (Warfarin) 致命消化道大出血绝对禁忌
  {
    id: "gastric-ddi-apatinib-warfarin",
    targetedDrugId: "apatinib",
    chronicDrugId: "warfarin",
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "阿帕替尼是 CYP2C9 弱抑制剂，能延缓 S-华法林在肝脏的清除；且抗 VEGF 类药物会破坏胃腔内溃疡病灶处的毛细血管内皮细胞，两药协同可引发凝血障碍与黏膜广泛渗血。",
    clinicalManifestation: "凝血酶原时间国际标准化比值 (INR) 剧烈飙升，出现呕血、柏油样黑便、失血性休克及胃穿孔。",
    management: "【绝对禁忌联合使用】：正在服用华法林的胃癌患者严禁启动阿帕替尼！必须抗凝者，应经心血管内科及肿瘤多学科 MDT 评估，改用不易发生相互作用且半衰期短的低分子肝素皮下注射，严密监测大便隐血与血红蛋白 (Hb)。",
    evidenceSource: "FDA 靶向抗血管抑制剂与口服抗凝药安全警报",
  },

  // 7. 阿帕替尼 (Apatinib) + 降压药 (氨氯地平/缬沙坦) 安全增效血压管理
  {
    id: "gastric-ddi-apatinib-antihypertensive",
    targetedDrugId: "apatinib",
    chronicDrugId: "amlodipine",
    riskLevel: "compatible_safe",
    severityScore: 0,
    mechanism: "阿帕替尼阻断 VEGF 导致前列环素合成减少与一氧化氮生成不足，引发外周血管收缩与高血压 (发生率约 40%~60%)；积极降压是保证靶向药足疗程使用的必要手段。",
    clinicalManifestation: "合用钙通道阻滞剂 (CCB) 或 ARB 类降压药可平稳控制血压，且血压轻度升高通常与阿帕替尼抗血管生成生物学活性良好呈正相关。",
    management: "【安全规范配伍】：推荐晨起监测血压，首选氨氯地平或缬沙坦控制血压于 140/90 mmHg 以下；避免使用地尔硫䓬 (CYP3A4中度抑制剂)。若出现 3 级高血压 (>=160/100 mmHg)，联合两种降压药仍无法控制时方可暂停阿帕替尼。",
    evidenceSource: "中国抗癌协会 (CACA) 抗血管生成药物引起高血压临床管理共识",
  },

  // 8. 替吉奥 S-1 + 索立夫定 / 氟胞嘧啶 致死性血液毒性绝对禁忌
  {
    id: "gastric-ddi-s1-sorivudine",
    targetedDrugId: "sox_xelox",
    chronicDrugId: "aspirin", // 代表抗病毒/特殊合并药机制
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "抗病毒药索立夫定 (Sorivudine) 的代谢产物溴乙烯基尿嘧啶 (BVU) 会不可逆地彻底抑制二氢嘧啶脱氢酶 (DPD)。一旦合用替吉奥或卡培他滨，氟尿嘧啶代谢完全受阻在体内暴发蓄积。",
    clinicalManifestation: "爆发性全血细胞减少、骨髓衰竭、严重伴血性口腔黏膜炎及致死性脱水性腹泻（历史上曾导致多起日本患者死亡事件）。",
    management: "【绝对致命禁忌】：替吉奥 (S-1) 严禁与索立夫定、溴夫定、氟胞嘧啶等抗病毒/抗真菌药物联用！在停用上述药物后至少 4 周内严禁开始使用 S-1 或卡培他滨化疗。",
    evidenceSource: "日本厚生劳动省 (MHLW) S-1 致命相互作用紧急安全性信息 (Yellow Letter)",
  },

  // 9. 卡培他滨 (Capecitabine) + 华法林 (Warfarin) 出血协同
  {
    id: "gastric-ddi-capecitabine-warfarin",
    targetedDrugId: "sox_xelox",
    chronicDrugId: "warfarin",
    riskLevel: "severe_contraindication",
    severityScore: 3,
    mechanism: "卡培他滨及其代谢产物对肝脏微粒体酶 CYP2C9 具有下调抑制作用，导致华法林代谢明显减慢，抗凝活性倍增。",
    clinicalManifestation: "INR 显著升高超过 4.0，皮下瘀斑、牙龈出血、呕血甚至颅内出血致命风险。",
    management: "【严禁随意联合】：接受 XELOX 方案口服卡培他滨的患者，应优先将华法林置换为低分子肝素；若必须保留华法林，必须每周复查凝血功能 PT/INR，并随时准备将华法林剂量减半或暂停。",
    evidenceSource: "FDA 卡培他滨与抗凝血药黑框安全警告",
  },

  // 10. FLOT / SOX 方案奥沙利铂 (Oxaliplatin) 神经毒性遇冷加剧
  {
    id: "gastric-ddi-oxaliplatin-cold-neurotoxicity",
    targetedDrugId: "flot_chemo",
    chronicDrugId: "metformin", // 代谢用药
    riskLevel: "timing_warning",
    severityScore: 2,
    mechanism: "奥沙利铂代谢产生的草酸盐可减慢外周感觉神经元电压门控钠离子通道失活，遇到低温刺激时突触神经元放电异常暴增，诱发急性咽喉头痉挛与肢端感觉异常。",
    clinicalManifestation: "接触冷水、冷风或进食冷饮瞬间出现指端刺痛麻木、触电样抽搐感，以及咽喉发紧、窒息感 (假性咽喉痉挛)。",
    management: "【避冷保暖三字诀】：输注奥沙利铂后 5~7 天内必须做到：① 不喝冰水冷饮，喝 40℃ 左右温水；② 不用冷水洗手洗脸，戴保暖手套；③ 开冰箱须戴隔热棉手套；④ 冬季外出必须戴厚口罩与围巾，避免冷空气直接灌入咽喉。",
    evidenceSource: "JCO 奥沙利铂周围神经毒性防护与阶梯管理临床实践指南",
  },

  // 11. PD-1 免疫单抗 (纳武利尤/信迪利/替雷利珠) + 大剂量系统性糖皮质激素
  {
    id: "gastric-ddi-pd1-steroids",
    targetedDrugId: "nivolumab",
    chronicDrugId: "dexamethasone",
    riskLevel: "moderate_caution",
    severityScore: 2,
    mechanism: "系统性糖皮质激素 (泼尼松等效剂量 > 10mg/天) 会广泛抑制 T 淋巴细胞的活化、增殖及细胞因子分泌，削弱 PD-1 单抗解除免疫刹车的作用。",
    clinicalManifestation: "减弱机体抗肿瘤免疫应答，导致胃癌无进展生存期 (PFS) 和总生存期 (OS) 出现统计学显著下降。",
    management: "【免疫治疗期间糖皮质激素精细化使用】：化疗止吐方案中短期地塞米松预处理 (1~2天) 不影响免疫疗效；但应严禁长期口服泼尼松维持治疗。若患者发生 2 级及以上免疫相关不良反应 (irAE，如免疫性心肌炎/肺炎/肠炎)，应由专科医生规范启动足量激素冲击并规律减量。",
    evidenceSource: "CSCO 免疫检查点抑制剂毒性管理指南 (2024)",
  },
];

export const GASTRIC_DDI_RULES: DdiRule[] = RAW_GASTRIC_DDI_RULES.map((r) => ({
  ...r,
  targetDrugIds: [r.targetedDrugId],
  clinicalGuidance: r.management,
}));

/**
 * 胃癌专属药物相互作用 (DDI) 分析计算引擎
 */
export function checkGastricDrugInteractions(
  targetDrugId: string,
  chronicDrugIds: string[]
): DdiAnalysisResult {
  const targetedDrug = GASTRIC_TARGETED_DRUGS.find((d) => d.id === targetDrugId);
  if (!targetedDrug) {
    return {
      targetedDrug: {
        id: targetDrugId,
        genericName: "未收录药物",
        brandName: "未知",
        generation: "未明确分类",
        target: "HER2" as any,
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
  const interactions = GASTRIC_DDI_RULES.filter(
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
