/**
 * 临床标签与试验名称人本化转译字典 (Clinical Tag & Trial Humanizer)
 * 遵循 Clinical Evidence Design Triad 规范，彻底消除未转译的原始代码枚举。
 */

export interface HumanizedTag {
  label: string;
  theme?: "slate" | "sky" | "teal" | "emerald" | "amber" | "purple" | "rose";
}

const TAG_TRANSLATION_MAP: Record<string, HumanizedTag> = {
  // 肺癌专科流行病学与筛查
  CHINA_COHORT: { label: "中国本土队列", theme: "teal" },
  NON_SMOKING: { label: "非吸烟人群", theme: "sky" },
  SCREENING: { label: "早筛早诊", theme: "emerald" },
  NODULE_VOLUME: { label: "三维结节体积", theme: "slate" },
  VDT: { label: "倍增时间 (VDT)", theme: "slate" },
  CTR: { label: "实性占比 (CTR)", theme: "slate" },
  pGGO: { label: "纯磨玻璃结节", theme: "sky" },

  // 手术与病理
  SURGERY_TYPE: { label: "手术术式", theme: "sky" },
  TUMOR_SIZE: { label: "肿瘤大小", theme: "slate" },
  OVERTREATMENT_PREVENTION: { label: "避免过度治疗", theme: "emerald" },
  STAS: { label: "气道播散 (STAS)", theme: "amber" },
  IASLC_GRADE: { label: "IASLC 分级", theme: "slate" },
  MICROPAPILLARY: { label: "微乳头成分", theme: "rose" },
  SOLID_PATTERN: { label: "实性成分", theme: "rose" },
  TNM_STAGE: { label: "TNM 分期", theme: "slate" },
  VPI: { label: "脏层胸膜浸润", theme: "amber" },
  N2_SUBSTATION: { label: "N2 纵隔淋巴结", theme: "purple" },
  N2_LYMPH_NODES: { label: "N2 淋巴结转移", theme: "purple" },
  LYMPH_NODES: { label: "淋巴结评估", theme: "slate" },
  M1_OLIGOMETASTATIC: { label: "寡转移管理", theme: "rose" },
  SURVEILLANCE: { label: "规范随访", theme: "teal" },
  REHABILITATION: { label: "术后肺康复", theme: "teal" },
  SURVIVAL_LANDMARK: { label: "长期生存里程碑", theme: "emerald" },

  // 靶向治疗与基因驱动
  EGFR: { label: "EGFR 突变", theme: "sky" },
  ALK: { label: "ALK 融合", theme: "sky" },
  RET: { label: "RET 融合", theme: "sky" },
  KRAS: { label: "KRAS 突变", theme: "sky" },
  MET: { label: "MET 异常", theme: "sky" },
  HER2: { label: "HER2 突变/表达", theme: "purple" },
  TARGETED: { label: "分子靶向", theme: "sky" },
  MOLECULAR_TARGET: { label: "靶向治疗", theme: "sky" },
  FIRST_LINE: { label: "一线优选方案", theme: "emerald" },
  T790M: { label: "T790M 耐药突变", theme: "amber" },
  RESISTANCE: { label: "耐药机制", theme: "amber" },
  BRAIN_METASTASIS: { label: "脑转移防控", theme: "rose" },
  ADC: { label: "抗体偶联药 (ADC)", theme: "purple" },
  ADVERSE_EFFECTS: { label: "不良反应管理", theme: "amber" },

  // 免疫治疗与微小残留病灶
  IMMUNOTHERAPY: { label: "免疫治疗", theme: "teal" },
  PDL1: { label: "PD-L1 表达", theme: "teal" },
  PERIOPERATIVE: { label: "围手术期免疫", theme: "teal" },
  NEOADJUVANT: { label: "新辅助治疗", theme: "teal" },
  MRD: { label: "微小残留病灶 (MRD)", theme: "emerald" },
  ctDNA: { label: "ctDNA 动态监测", theme: "emerald" },
  CHEMOTHERAPY: { label: "系统辅助化疗", theme: "slate" },
  CHEMORADIOTHERAPY: { label: "同步放化疗", theme: "purple" },
  RADIOTHERAPY: { label: "术后放疗", theme: "slate" },
  UNRESECTABLE: { label: "不可切除/局部晚期", theme: "amber" },

  // 乳腺癌特定标签
  "21基因": { label: "21 基因 (RS评分)", theme: "teal" },
  "Oncotype DX": { label: "Oncotype DX 检测", theme: "teal" },
  "ER+": { label: "雌激素受体阳性 (ER+)", theme: "sky" },
  "免化疗": { label: "免除辅助化疗", theme: "emerald" },
  "Luminal A": { label: "Luminal A 型", theme: "teal" },
  "1~3个淋巴结阳性": { label: "1~3 枚淋巴结受累", theme: "slate" },
  "绝经后": { label: "绝经后群体", theme: "slate" },
  "阿贝西利": { label: "阿贝西利 (CDK4/6i)", theme: "sky" },
  "CDK4/6i": { label: "CDK4/6 抑制剂", theme: "sky" },
  "高危早期": { label: "高危早期乳腺癌", theme: "amber" },
  "淋巴结>=4": { label: "淋巴结 ≥4 枚", theme: "rose" },
  "T-DXd": { label: "德曲妥珠单抗 (T-DXd)", theme: "purple" },
  "优赫得": { label: "优赫得 (T-DXd)", theme: "purple" },
  "HER2阳性": { label: "HER2 阳性", theme: "purple" },
  "ADC生物导弹": { label: "ADC 靶向生物导弹", theme: "purple" },
  "HER2低表达": { label: "HER2 低表达 (HER2-Low)", theme: "purple" },
  "HER2-low": { label: "HER2-Low 表达", theme: "purple" },
  "HER2超低表达": { label: "HER2 超低表达 (Ultralow)", theme: "purple" },
  "HER2-Ultralow": { label: "HER2-Ultralow 突破", theme: "purple" },
  "内分泌耐药": { label: "内分泌耐药破局", theme: "amber" },
  "前哨淋巴结": { label: "前哨淋巴结活检 (SLNB)", theme: "sky" },
  "SLNB": { label: "SLNB 活检", theme: "sky" },
  "免除腋窝清扫": { label: "免除腋窝清扫 (ALND)", theme: "emerald" },
  "保乳放疗": { label: "保乳全乳放疗", theme: "slate" },
  "三阴性": { label: "三阴性乳腺癌 (TNBC)", theme: "rose" },
  "TNBC": { label: "三阴性 (TNBC)", theme: "rose" },
  "帕博利珠单抗": { label: "帕博利珠单抗", theme: "teal" },
  "pCR": { label: "病理完全缓解 (pCR)", theme: "emerald" },
  "non-pCR": { label: "残存病灶 (non-pCR)", theme: "amber" },
  "残存病灶": { label: "新辅助后残存病灶", theme: "amber" },
  "新辅助残存": { label: "残存强化方案", theme: "amber" },
  "免疫治疗": { label: "免疫综合治疗", theme: "teal" },
  "奥拉帕利": { label: "奥拉帕利 (PARPi)", theme: "sky" },
  "PARP抑制剂": { label: "PARP 抑制剂", theme: "sky" },
  "遗传性乳腺癌": { label: "BRCA 遗传性乳腺癌", theme: "purple" },
  "帕妥珠单抗": { label: "帕妥珠单抗", theme: "sky" },
  "曲妥珠单抗": { label: "曲妥珠单抗", theme: "sky" },
  "HP双靶": { label: "HP 双靶向辅助强化", theme: "sky" },
  "T-DM1": { label: "恩美曲妥珠 (T-DM1)", theme: "purple" },
  "卡培他滨": { label: "卡培他滨口服强化", theme: "slate" },
  "三阴性强化": { label: "三阴性术后辅助强化", theme: "rose" },
  "绝经前强化": { label: "绝经前 OFS 强化", theme: "purple" },
};

export function humanizeClinicalTag(rawTag: string): HumanizedTag {
  if (!rawTag) return { label: "", theme: "slate" };

  // 1. Direct dictionary match
  if (TAG_TRANSLATION_MAP[rawTag]) {
    return TAG_TRANSLATION_MAP[rawTag];
  }

  // 2. Case-insensitive dictionary match
  const upper = rawTag.toUpperCase();
  if (TAG_TRANSLATION_MAP[upper]) {
    return TAG_TRANSLATION_MAP[upper];
  }

  // 3. If tag is already Chinese or clean formatted (no underscores)
  if (/[\u4e00-\u9fa5]/.test(rawTag)) {
    return { label: rawTag, theme: "slate" };
  }

  // 4. Fallback: clean underscores and format cleanly
  const cleaned = rawTag.replace(/_/g, " ").trim();
  return { label: cleaned, theme: "slate" };
}

/**
 * 从论文标题与 ID 中智能提取国际公认的里程碑试验代号 (Trial Acronym)
 * 如 LUNG-ART, KEYNOTE-042, MARIPOSA, NELSON, DESTINY-Breast03, TAILORx
 */
export function extractStudyAcronym(study: { id?: string; title: string }): string | null {
  const title = study.title || "";
  const id = study.id || "";

  // 1. Match trailing parentheses with trial acronyms, e.g. "(KEYNOTE-042)" or "(DESTINY-Breast06)"
  const parenMatch = title.match(/\(([A-Za-z0-9\-\/]{3,24})\)$/);
  if (parenMatch && parenMatch[1]) {
    return parenMatch[1];
  }

  // 2. Match mid-title parentheses trial names, e.g. "(LUNG-ART)", "(ADAURA)", "(NELSON)"
  const midParenMatch = title.match(/\(([A-Z0-9\-\/]{3,24})\)/);
  if (midParenMatch && midParenMatch[1]) {
    const candidate = midParenMatch[1];
    // Filter out common non-acronym abbreviations like (CT), (MRI), (IHC), (FISH), (R0)
    if (!["CT", "MRI", "PET", "IHC", "FISH", "R0", "R1", "HR", "OS", "PFS", "DFS", "EFS"].includes(candidate.toUpperCase())) {
      return candidate;
    }
  }

  // 3. Match "[Name] Trial", e.g. "PACIFIC Trial"
  const trialWordMatch = title.match(/([A-Za-z0-9\-]{3,20})\s+Trial/i);
  if (trialWordMatch && trialWordMatch[1]) {
    return trialWordMatch[1];
  }

  // 4. Special well-known trials by ID prefix
  const knownPrefixes: Record<string, string> = {
    JCOG0802: "JCOG0802",
    CALGB140503: "CALGB 140503",
    JCOG1211: "JCOG1211",
    JCOG0804: "JCOG0804",
    ADAURA: "ADAURA",
    ALINA: "ALINA",
    KEYNOTE671: "KEYNOTE-671",
    CheckMate816: "CheckMate 816",
    IMpower010: "IMpower010",
    TRACERx: "TRACERx",
    MARIPOSA: "MARIPOSA",
    FLAURA: "FLAURA",
    CROWN: "CROWN",
    Neotorch: "Neotorch",
    RATIONALE: "RATIONALE-315",
    TAILORx: "TAILORx",
    RxPONDER: "RxPONDER",
    monarchE: "monarchE",
    destiny_breast03: "DESTINY-Breast03",
    destiny_breast04: "DESTINY-Breast04",
    destiny_breast06: "DESTINY-Breast06",
    KEYNOTE522: "KEYNOTE-522",
    OlympiA: "OlympiA",
    APHINITY: "APHINITY",
    KATHERINE: "KATHERINE",
    CREATE_X: "CREATE-X",
  };

  for (const [key, name] of Object.entries(knownPrefixes)) {
    if (id.toLowerCase().startsWith(key.toLowerCase()) || title.toLowerCase().includes(key.toLowerCase())) {
      return name;
    }
  }

  // 5. If title mentions urban China 100万人 cohort
  if (title.includes("Low-Dose CT Screening for Lung Cancer in Urban China")) {
    return "中国百万早筛队列";
  }

  return null;
}
