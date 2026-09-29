"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Scan,
  Microscope,
  Camera,
  Dna,
  User,
  Lightbulb,
  AlertTriangle,
  X,
  CircleDot,
  ShieldCheck,
  Activity,
  Brain,
  Stethoscope,
  FileSearch,
  Check,
  Info,
  Layers,
  Award,
  Search,
  Clock,
  Sparkles,
  RotateCcw,
  FileEdit,
  Edit3,
} from "lucide-react";
import type { SecondaryNodule, CancerType } from "@/lib/types";
import { CancerRegistry } from "@/lib/cancerRegistry";
import { computeCancerStage } from "@/lib/stagingRegistry";
import { 
  formatClinicalAiError, 
  isRateLimitOrQuotaError, 
  type ClinicalErrorInfo 
} from "@/lib/clinicalErrors";
import CancerSpecificPathologyForm from "./CancerSpecificPathologyForm";

interface ReportUploaderProps {
  onParsed: (data: any) => void;
  initialData?: any | null;
  existingProfile?: any | null;
  onCancel?: () => void;
  initialManualMode?: boolean;
  onSwitchToUpload?: () => void;
  cancerType?: CancerType;
}

interface UploadedReportImage {
  id: string;
  name: string;
  base64: string;
  mimeType: string;
  previewUrl: string;
}

// Comprehensive CT Malignant Imaging Signs with Clinical Plain-Language Definitions
const CT_SIGN_DEFINITIONS: Record<string, { label: string; enName: string; desc: string; clinicalMeaning: string }> = {
  "分叶征": {
    label: "分叶征",
    enName: "Lobulation",
    desc: "结节边缘呈现波浪状或凹凸不平的多个弧形分叶",
    clinicalMeaning: "反映肿瘤各方向细胞浸润生长速度不均，或受周围血管支气管阻挡引起的膨胀性生长"
  },
  "毛刺征": {
    label: "毛刺征",
    enName: "Spiculation",
    desc: "结节边缘向周围正常肺实质伸出放射状排列的细短线状阴影",
    clinicalMeaning: "肺腺癌高度特征性恶性征象，常由肿瘤细胞沿肺泡间隔浸润或局部成纤维收缩引起"
  },
  "胸膜牵拉征": {
    label: "胸膜牵拉/凹陷征",
    enName: "Pleural Indentation",
    desc: "结节邻近脏层胸膜，可见线状水肿或胸膜向结节方向形成帐篷样凹陷",
    clinicalMeaning: "肿瘤内部纤维收缩牵拉胸膜。需在手术和病理切片中重点排查是否突破脏层胸膜(PL1/PL2)"
  },
  "空泡征": {
    label: "空泡征 / 细支气管残腔",
    enName: "Vacuole Sign",
    desc: "结节内部出现 <5mm 的点状、小圆形透亮气体影",
    clinicalMeaning: "并非组织坏死空洞，而是肿瘤生长时保留了未被完全破坏的微小细支气管残腔，多见于早期浸润性腺癌"
  },
  "血管穿行集束征": {
    label: "血管集束 / 血管穿行",
    enName: "Vascular Convergence",
    desc: "周围肺血管受牵拉向结节聚拢汇集，或细小血管直接穿行穿过病灶",
    clinicalMeaning: "反映肿瘤对血供与微血管生成的活跃渴求，是病灶具有生物学活性的征象之一"
  },
  "磨玻璃晕征": {
    label: "磨玻璃晕征",
    enName: "Halo Sign",
    desc: "结节实性核心周围环绕一圈淡薄均匀的磨玻璃影",
    clinicalMeaning: "常代表肿瘤外围由贴壁伏壁生长方式向中心实性浸润演进的过渡带"
  },
  "支气管充气征": {
    label: "支气管充气征",
    enName: "Air Bronchogram",
    desc: "充气细支气管直接穿行于结节内部，管腔管壁可轻度僵硬或扭曲扩张",
    clinicalMeaning: "提示肿瘤细胞沿肺泡壁伏壁浸润排列而未完全压闭支气管腔"
  }
};

const PRESET_DRIVER_GENES = [
  { 
    gene: "EGFR", 
    label: "EGFR (主驱动靶点)", 
    badge: "50%~60%高频",
    subtypes: [
      { key: "19del", name: "19号外显子缺失 (19del)", isSensitive: true },
      { key: "L858R", name: "21号外显子 L858R 置换", isSensitive: true },
      { key: "20-ins", name: "20号外显子插入 (20-ins)", isSensitive: false },
      { key: "T790M", name: "20号外显子 T790M (耐药突变)", isSensitive: true },
      { key: "G719X/L861Q/S768I", name: "18/21/20外显子罕见敏感突变", isSensitive: true }
    ]
  },
  { 
    gene: "ALK", 
    label: "ALK (融合靶点)", 
    badge: "5%~8%年轻非吸烟",
    subtypes: [
      { key: "EML4-ALK", name: "EML4-ALK 融合 (阿来/洛拉替尼)", isSensitive: true },
      { key: "other_alk", name: "其他伴侣基因 ALK 融合", isSensitive: true }
    ]
  },
  { 
    gene: "KRAS", 
    label: "KRAS (突变靶点)", 
    badge: "8%~12%",
    subtypes: [
      { key: "G12C", name: "G12C 突变 (索托拉西布/格索雷塞)", isSensitive: true },
      { key: "non_G12C", name: "非 G12C 突变 (G12D/G12V等)", isSensitive: false }
    ]
  },
  { 
    gene: "ROS1", 
    label: "ROS1 (融合靶点)", 
    badge: "1%~2%",
    subtypes: [
      { key: "ROS1_fusion", name: "ROS1 阳性融合 (克唑替尼/恩曲替尼)", isSensitive: true }
    ]
  },
  { 
    gene: "MET", 
    label: "MET (异常靶点)", 
    badge: "1%~3%",
    subtypes: [
      { key: "exon14_skip", name: "14外显子跳跃突变 (赛沃替尼/谷美替尼)", isSensitive: true },
      { key: "MET_amp", name: "MET 高水平扩增", isSensitive: true }
    ]
  },
  { 
    gene: "RET", 
    label: "RET (融合靶点)", 
    badge: "1%~2%",
    subtypes: [
      { key: "RET_fusion", name: "RET 阳性融合 (普拉替尼/塞普替尼)", isSensitive: true }
    ]
  },
  { 
    gene: "HER2", 
    label: "HER2 / ERBB2", 
    badge: "2%~4%",
    subtypes: [
      { key: "HER2_exon20ins", name: "20号外显子插入突变 (德曲妥珠单抗)", isSensitive: true }
    ]
  },
  { 
    gene: "BRAF", 
    label: "BRAF", 
    badge: "1%~3%",
    subtypes: [
      { key: "V600E", name: "V600E 突变 (达拉非尼+曲美替尼)", isSensitive: true },
      { key: "non_V600E", name: "非 V600E 突变", isSensitive: false }
    ]
  }
];

const PRESET_CO_MUTATIONS = [
  {
    gene: "TP53",
    label: "TP53 (抑癌基因失活)",
    riskDesc: "最常见伴随突变(30%~50%)，提示轻度复发侵袭倾向，需关注随访",
    subtypes: [
      { key: "exon5_8", name: "外显子 5-8 错义/无义突变 (DNA结合区)" },
      { key: "other_tp53", name: "其他位点 TP53 变异" }
    ]
  },
  {
    gene: "RB1",
    label: "RB1 (转录抑制失活)",
    riskDesc: "与小细胞肺癌表型转化风险相关",
    subtypes: [
      { key: "loss_of_function", name: "RB1 功能缺失性突变" }
    ]
  },
  {
    gene: "PIK3CA",
    label: "PIK3CA (旁路激活)",
    riskDesc: "PI3K-AKT 信号通路活化突变",
    subtypes: [
      { key: "E545K_H1047R", name: "外显子 9/20 错义突变 (E545K/H1047R)" }
    ]
  }
];

const CANCER_DRIVER_GENES_MAP: Record<string, Array<{
  gene: string;
  label: string;
  badge: string;
  subtypes: Array<{ key: string; name: string; isSensitive?: boolean }>;
}>> = {
  lung: PRESET_DRIVER_GENES,
  breast: [
    {
      gene: "ER",
      label: "ER (雌激素受体)",
      badge: "内分泌靶点",
      subtypes: [
        { key: "ER_pos_high", name: "强阳性 (≥50%)", isSensitive: true },
        { key: "ER_pos_low", name: "低表达阳性 (1%~10%)", isSensitive: true },
        { key: "ER_neg", name: "阴性 (<1%)", isSensitive: false },
      ]
    },
    {
      gene: "PR",
      label: "PR (孕激素受体)",
      badge: "预后评估",
      subtypes: [
        { key: "PR_pos_high", name: "强阳性 (≥20%)", isSensitive: true },
        { key: "PR_pos_low", name: "低表达 (1%~19%)", isSensitive: true },
        { key: "PR_neg", name: "阴性 (<1%)", isSensitive: false },
      ]
    },
    {
      gene: "HER2",
      label: "HER2 (人表皮生长因子受体2)",
      badge: "靶向治疗靶点",
      subtypes: [
        { key: "HER2_pos", name: "阳性 (IHC 3+ 或 FISH+ 曲妥珠/帕妥珠)", isSensitive: true },
        { key: "HER2_low", name: "HER2 低表达 (IHC 1+ 或 2+/FISH- 德曲妥珠单抗)", isSensitive: true },
        { key: "HER2_zero", name: "HER2 零表达 (IHC 0)", isSensitive: false },
      ]
    },
    {
      gene: "Ki-67",
      label: "Ki-67 (细胞增殖指数)",
      badge: "分子分型核心",
      subtypes: [
        { key: "Ki67_high", name: "高增殖指数 (≥20% 或 ≥30%)", isSensitive: false },
        { key: "Ki67_low", name: "低增殖指数 (<14%~20%)", isSensitive: true },
      ]
    },
    {
      gene: "BRCA1/2",
      label: "BRCA1/2 (DNA同源修复)",
      badge: "PARP抑制剂",
      subtypes: [
        { key: "BRCA1_mut", name: "BRCA1 致病突变 (奥拉帕利敏感)", isSensitive: true },
        { key: "BRCA2_mut", name: "BRCA2 致病突变 (奥拉帕利敏感)", isSensitive: true },
        { key: "wt", name: "BRCA1/2 野生型", isSensitive: false },
      ]
    },
    {
      gene: "PIK3CA",
      label: "PIK3CA (PI3K通路突变)",
      badge: "阿培利司靶点",
      subtypes: [
        { key: "H1047R", name: "外显子 20 H1047R 活化突变", isSensitive: true },
        { key: "E545K", name: "外显子 9 E545K 活化突变", isSensitive: true },
        { key: "wt", name: "野生型", isSensitive: false },
      ]
    },
  ],
  colorectal: [
    {
      gene: "KRAS",
      label: "KRAS (RAS下游效应靶点)",
      badge: "西妥昔耐药指引",
      subtypes: [
        { key: "KRAS_exon2", name: "外显子 2 突变 (12/13密码子 · 西妥昔耐药)", isSensitive: false },
        { key: "KRAS_G12C", name: "G12C 突变 (特异性抑制剂敏感)", isSensitive: true },
        { key: "KRAS_wt", name: "野生型 (全阴性 · 西妥昔单抗敏感)", isSensitive: true },
      ]
    },
    {
      gene: "NRAS",
      label: "NRAS (RAS家族成员)",
      badge: "3%~5%突变",
      subtypes: [
        { key: "NRAS_mut", name: "外显子 2/3/4 活化突变 (抗EGFR耐药)", isSensitive: false },
        { key: "NRAS_wt", name: "野生型", isSensitive: true },
      ]
    },
    {
      gene: "BRAF",
      label: "BRAF (MAPK通路)",
      badge: "V600E高危预后",
      subtypes: [
        { key: "BRAF_V600E", name: "V600E 突变 (侵袭性强 · 双靶/三靶获益)", isSensitive: true },
        { key: "BRAF_wt", name: "野生型", isSensitive: true },
      ]
    },
    {
      gene: "MSI/MMR",
      label: "MSI / MMR (错配修复)",
      badge: "免疫治疗黄金靶点",
      subtypes: [
        { key: "dMMR_MSIH", name: "dMMR / MSI-H (高微卫星不稳定 · PD-1高度敏感)", isSensitive: true },
        { key: "pMMR_MSS", name: "pMMR / MSS (微卫星稳定)", isSensitive: false },
      ]
    },
    {
      gene: "HER2",
      label: "HER2 (扩增过表达)",
      badge: "双靶治疗靶点",
      subtypes: [
        { key: "HER2_amp", name: "HER2 扩增 / IHC 3+ (RAS野生型抗HER2方案)", isSensitive: true },
        { key: "HER2_neg", name: "HER2 阴性", isSensitive: false },
      ]
    }
  ],
  gastric: [
    {
      gene: "HER2",
      label: "HER2 (胃癌一线金标准)",
      badge: "曲妥珠单抗靶点",
      subtypes: [
        { key: "HER2_pos", name: "阳性 (IHC 3+ 或 IHC 2+/FISH+)", isSensitive: true },
        { key: "HER2_neg", name: "阴性", isSensitive: false },
      ]
    },
    {
      gene: "Claudin18.2",
      label: "Claudin 18.2 (紧密连接蛋白)",
      badge: "佐妥昔单抗靶点",
      subtypes: [
        { key: "CLDN_pos_high", name: "强阳性 (≥75% 肿瘤细胞膜中/强染色)", isSensitive: true },
        { key: "CLDN_pos_low", name: "中低表达 (40%~74%)", isSensitive: false },
        { key: "CLDN_neg", name: "阴性 (<40%)", isSensitive: false },
      ]
    },
    {
      gene: "PD-L1",
      label: "PD-L1 (CPS 综合阳性评分)",
      badge: "免疫一线获益",
      subtypes: [
        { key: "CPS_ge5", name: "CPS ≥ 5 (纳武利尤单抗一线联合方案)", isSensitive: true },
        { key: "CPS_ge10", name: "CPS ≥ 10 (高免疫敏感度)", isSensitive: true },
        { key: "CPS_lt5", name: "CPS < 5 (获益有限)", isSensitive: false },
      ]
    },
    {
      gene: "MSI/MMR",
      label: "MSI / MMR (错配修复)",
      badge: "免疫免化疗指引",
      subtypes: [
        { key: "dMMR_MSIH", name: "dMMR / MSI-H (围手术期免疫新辅助/一线获益)", isSensitive: true },
        { key: "pMMR", name: "pMMR / MSS", isSensitive: false },
      ]
    }
  ],
  liver: [
    {
      gene: "AFP",
      label: "AFP (甲胎蛋白基线)",
      badge: "肝癌特异性标志物",
      subtypes: [
        { key: "AFP_high", name: "显著偏高 (≥400 ng/mL)", isSensitive: false },
        { key: "AFP_mild", name: "轻度偏高 (20~400 ng/mL)", isSensitive: false },
        { key: "AFP_normal", name: "正常 (<20 ng/mL)", isSensitive: true },
      ]
    },
    {
      gene: "HBV/HCV",
      label: "病毒复制载量 (HBV-DNA)",
      badge: "抗病毒基础管控",
      subtypes: [
        { key: "HBV_pos", name: "HBV-DNA 阳性 (需口服恩替卡韦/TAF抗病毒)", isSensitive: false },
        { key: "HBV_neg", name: "HBV-DNA 阴性 / 已测不到", isSensitive: true },
      ]
    },
    {
      gene: "CTNNB1",
      label: "CTNNB1 (Wnt通路突变)",
      badge: "免疫耐药潜在标志",
      subtypes: [
        { key: "CTNNB1_mut", name: "突变激活 (冷肿瘤 · 单药免疫应答偏低)", isSensitive: false },
        { key: "wt", name: "野生型", isSensitive: true },
      ]
    },
    {
      gene: "TP53",
      label: "TP53 (抑癌基因失活)",
      badge: "高侵袭预后",
      subtypes: [
        { key: "TP53_mut", name: "致病性突变 (提示复发风险偏高)", isSensitive: false },
      ]
    }
  ],
  thyroid: [
    {
      gene: "BRAF",
      label: "BRAF (V600E 突变)",
      badge: "乳头状癌 60%~80%",
      subtypes: [
        { key: "BRAF_V600E", name: "V600E 阳性 (与侵袭性/包膜外侵相关)", isSensitive: true },
        { key: "BRAF_wt", name: "野生型 (全阴性)", isSensitive: false },
      ]
    },
    {
      gene: "TERT",
      label: "TERT (启动子突变)",
      badge: "高危复发与去分化",
      subtypes: [
        { key: "TERT_promoter", name: "启动子 C228T/C250T 突变 (侵袭高危)", isSensitive: false },
        { key: "TERT_wt", name: "野生型", isSensitive: true },
      ]
    },
    {
      gene: "RET",
      label: "RET (融合/点突变)",
      badge: "靶向治疗与髓样癌",
      subtypes: [
        { key: "RET_PTC", name: "RET 融合 (RET/PTC · 普拉替尼/塞普替尼敏感)", isSensitive: true },
        { key: "RET_MTC", name: "RET 突变 (MEN2综合征 / 髓样癌)", isSensitive: true },
      ]
    },
    {
      gene: "RAS",
      label: "RAS (NRAS / HRAS)",
      badge: "滤泡型高发",
      subtypes: [
        { key: "RAS_mut", name: "RAS 突变阳性", isSensitive: false },
      ]
    }
  ],
  endometrial: [
    {
      gene: "POLE",
      label: "POLE (外切酶结构域突变)",
      badge: "超高突变 · 预后极佳",
      subtypes: [
        { key: "POLE_mut", name: "致病性突变 (降阶梯治疗免辅助放化疗)", isSensitive: true },
      ]
    },
    {
      gene: "MMR/MSI",
      label: "MMR / MSI (错配修复状态)",
      badge: "高微卫星不稳定型",
      subtypes: [
        { key: "dMMR", name: "dMMR (MLH1/MSH2/MSH6/PMS2 缺失 · 免疫敏感)", isSensitive: true },
        { key: "pMMR", name: "pMMR (错配修复完整)", isSensitive: false },
      ]
    },
    {
      gene: "p53",
      label: "p53 (TP53 状态)",
      badge: "高危浆液性分子型",
      subtypes: [
        { key: "p53_abnormal", name: "p53 突变型/过表达 (强化化疗/放疗指征)", isSensitive: false },
        { key: "p53_wild", name: "p53 野生型/正常", isSensitive: true },
      ]
    },
    {
      gene: "ER/PR",
      label: "ER / PR (激素受体)",
      badge: "内分泌治疗指标",
      subtypes: [
        { key: "ER_PR_pos", name: "ER/PR 阳性 (孕激素/芳香化酶抑制剂敏感)", isSensitive: true },
        { key: "ER_PR_neg", name: "阴性", isSensitive: false },
      ]
    }
  ],
  cervical: [
    {
      gene: "HPV",
      label: "HPV (人乳头瘤病毒分型)",
      badge: "宫颈癌病因学核心",
      subtypes: [
        { key: "HPV16", name: "HPV 16 型阳性 (最常见高危型)", isSensitive: false },
        { key: "HPV18", name: "HPV 18 型阳性 (高侵袭/腺癌多见)", isSensitive: false },
        { key: "HPV_other_hr", name: "其他高危型阳性 (31/33/45/52/58等)", isSensitive: false },
        { key: "HPV_neg", name: "全阴性", isSensitive: true },
      ]
    },
    {
      gene: "PD-L1",
      label: "PD-L1 (CPS 评分)",
      badge: "一线免疫获益",
      subtypes: [
        { key: "CPS_ge1", name: "CPS ≥ 1 (帕博利珠单抗联合方案获益)", isSensitive: true },
        { key: "CPS_lt1", name: "CPS < 1", isSensitive: false },
      ]
    },
    {
      gene: "TMB",
      label: "TMB (肿瘤突变负荷)",
      badge: "广谱免疫标志物",
      subtypes: [
        { key: "TMB_high", name: "TMB-H (≥10 mut/Mb)", isSensitive: true },
      ]
    }
  ],
  pancreatic: [
    {
      gene: "KRAS",
      label: "KRAS (核心驱动靶点)",
      badge: "90%~95%极高频",
      subtypes: [
        { key: "G12D", name: "KRAS G12D 突变 (最常见亚型)", isSensitive: false },
        { key: "G12V", name: "KRAS G12V 突变", isSensitive: false },
        { key: "G12R", name: "KRAS G12R 突变", isSensitive: false },
        { key: "G12C", name: "KRAS G12C 突变 (靶向获益罕见亚型)", isSensitive: true },
        { key: "wt", name: "KRAS 野生型 (需排查罕见驱动靶点)", isSensitive: true },
      ]
    },
    {
      gene: "BRCA1/2",
      label: "BRCA1/2 (同源重组缺陷)",
      badge: "POLO奥拉帕利靶点",
      subtypes: [
        { key: "gBRCA_mut", name: "gBRCA1/2 致病突变 (含铂化疗与奥拉帕利敏感)", isSensitive: true },
      ]
    },
    {
      gene: "MSI/dMMR",
      label: "MSI / dMMR (错配修复)",
      badge: "罕见免疫敏感型",
      subtypes: [
        { key: "dMMR", name: "dMMR / MSI-H (PD-1单抗强效缓解)", isSensitive: true },
      ]
    },
    {
      gene: "SMAD4",
      label: "SMAD4 (DPC4 基因缺失)",
      badge: "远处转移风险评估",
      subtypes: [
        { key: "SMAD4_loss", name: "SMAD4 表达缺失 (提示转移倾向高)", isSensitive: false },
      ]
    }
  ],
  esophageal: [
    {
      gene: "PD-L1",
      label: "PD-L1 (CPS / TAP 表达)",
      badge: "食管癌一线免疫金标准",
      subtypes: [
        { key: "CPS_ge10", name: "CPS ≥ 10 或 TAP ≥ 10% (一线免疫获益确凿)", isSensitive: true },
        { key: "CPS_1_9", name: "CPS 1~9 (中度获益)", isSensitive: true },
        { key: "CPS_lt1", name: "CPS < 1 (低表达)", isSensitive: false },
      ]
    },
    {
      gene: "HER2",
      label: "HER2 (食管胃结合部/腺癌)",
      badge: "抗HER2靶向",
      subtypes: [
        { key: "HER2_pos", name: "HER2 阳性 (IHC 3+ 或 FISH+)", isSensitive: true },
      ]
    },
    {
      gene: "TP53",
      label: "TP53 (抑癌基因突变)",
      badge: "食管鳞癌高频(>80%)",
      subtypes: [
        { key: "TP53_mut", name: "致病性突变", isSensitive: false },
      ]
    }
  ]
};

export default function ReportUploader({ onParsed, initialData, existingProfile, onCancel, initialManualMode, onSwitchToUpload, cancerType = 'lung' }: ReportUploaderProps) {
  const [parsedData, setParsedData] = useState<any | null>(initialData || null);
  const currentCancer: CancerType = (parsedData?.cancerType || cancerType || 'lung') as CancerType;
  const isBreast = currentCancer === 'breast';
  const isColon = currentCancer === 'colon';
  const isRectal = currentCancer === 'rectal';
  const isColorectal = currentCancer === 'colorectal' || isColon || isRectal;
  const isGastric = currentCancer === 'gastric';
  const isLiver = currentCancer === 'liver';
  const isEsophageal = currentCancer === 'esophageal';
  const isThyroid = currentCancer === 'thyroid';
  const isEndometrial = currentCancer === 'endometrial';
  const isCervical = currentCancer === 'cervical';
  const isPancreatic = currentCancer === 'pancreatic';
  const isLung = currentCancer === 'lung';

  const [uploadTab, setUploadTab] = useState<'image' | 'text'>('image');
  const [reportText, setReportText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState("");
  const [errorInfo, setErrorInfo] = useState<ClinicalErrorInfo | null>(null);
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [parseCountdown, setParseCountdown] = useState(0);
  const [images, setImages] = useState<UploadedReportImage[]>([]);
  const [activeSignTooltip, setActiveSignTooltip] = useState<string | null>(null);
  const [newBenignInput, setNewBenignInput] = useState("");
  
  // Secondary nodules state
  const [newSecLoc, setNewSecLoc] = useState("");
  const [newSecSize, setNewSecSize] = useState("");
  const [newSecType, setNewSecType] = useState("pure_ggo");


  // Gene Mutations state
  const [customGeneName, setCustomGeneName] = useState("");
  const [customGeneSubtype, setCustomGeneSubtype] = useState("");
  const [customGeneAbundance, setCustomGeneAbundance] = useState("");
  const [customIsComutation, setCustomIsComutation] = useState(false);

  // Segmented Step Wizard state (1: Imaging/Nodules, 2: Pathology/High-Risk, 3: Molecular/Genes, 4: Serology/Systemic)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(() => {
    if (typeof window !== 'undefined') {
      const s = new URLSearchParams(window.location.search).get('step');
      if (s === '2') return 2;
      if (s === '3') return 3;
      if (s === '4') return 4;
    }
    return 1;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic staging calculation result for human-in-the-loop preview
  const [stagingPreview, setStagingPreview] = useState<any>(null);
  const hasInitializedRef = useRef<string | null>(null);

  const handleStartManualEntry = () => {
    const base = existingProfile || initialData || {};
    const currentSlot = (cancerType || base.cancerType || 'lung') as CancerType;
    hasInitializedRef.current = `manual_${Date.now()}`;
    const baseSpecific = (base.cancerSpecificData as any) || {};
    setParsedData({
      ...baseSpecific,
      ...base,
      cancerType: currentSlot,
      organ: base.organ || currentSlot,
      sex: base.sex || "unknown",
      age: base.age !== undefined && base.age !== null ? String(base.age) : "",
      smokingHistory: base.smokingHistory || "never",
      surgeryType: base.surgeryType || "unknown",
      noduleType: base.noduleType || "mixed_ggo",
      tumorSize: base.tumorSize !== undefined && base.tumorSize !== null ? String(base.tumorSize) : "",
      solidSize: base.solidSize !== undefined && base.solidSize !== null ? String(base.solidSize) : "",
      ctr: base.ctr !== undefined && base.ctr !== null ? base.ctr : null,
      pathologyReportMode: base.pathologyReportMode || "explicit",
      pathologyTumorSize: base.pathologyTumorSize !== undefined && base.pathologyTumorSize !== null ? String(base.pathologyTumorSize) : "",
      pathologyInvasiveSize: base.pathologyInvasiveSize !== undefined && base.pathologyInvasiveSize !== null ? String(base.pathologyInvasiveSize) : "",
      pathologyLepidicPercent: base.pathologyLepidicPercent !== undefined && base.pathologyLepidicPercent !== null ? String(base.pathologyLepidicPercent) : "",
      histology: base.histology || "adenocarcinoma",
      grade: base.grade || base.iaslcGrade || "",
      adjacentLobeInvasion: Boolean(base.adjacentLobeInvasion),
      vpi: base.vpi || "negative",
      stas: base.stas || "negative",
      lvi: base.lvi || "negative",
      marginStatus: base.marginStatus || "negative",
      nStage: base.nStage || "unknown",
      mStage: base.mStage || "unknown",
      brainMri: base.brainMri || "not_performed",
      abdominalUltrasound: base.abdominalUltrasound || "not_performed",
      boneScan: base.boneScan || "not_performed",
      neckLymphNodes: base.neckLymphNodes || "not_performed",
      petCt: base.petCt || "not_performed",
      geneMutations: Array.isArray(base.geneMutations) ? base.geneMutations : [],
      molecularTestStatus: base.molecularTestStatus || "not_tested",
      benignFindings: Array.isArray(base.benignFindings) ? base.benignFindings : [],
      isManualEntry: true,
    });
    setError("");
    setErrorInfo(null);
    setCurrentStep(1);
  };

  useEffect(() => {
    if (initialManualMode) {
      if (!parsedData || !parsedData.isManualEntry) {
        handleStartManualEntry();
      }
    } else {
      if (parsedData?.isManualEntry) {
        setParsedData(null);
        hasInitializedRef.current = null;
      }
    }
  }, [initialManualMode]);

  useEffect(() => {
    if (hasInitializedRef.current?.startsWith('manual_')) {
      return;
    }
    const currentTargetCancer = cancerType || 'lung';
    const isMatchingInitial = initialData && (initialData.cancerType === currentTargetCancer || !initialData.cancerType);
    const isMatchingExisting = existingProfile && (existingProfile.cancerType === currentTargetCancer || !existingProfile.cancerType);
    const sourceData = isMatchingInitial ? initialData : (isMatchingExisting ? existingProfile : null);

    if (!sourceData) {
      if (parsedData && parsedData.cancerType && parsedData.cancerType !== currentTargetCancer && !parsedData.isManualEntry) {
        setParsedData(null);
        hasInitializedRef.current = null;
      }
      return;
    }

    if (sourceData) {
      const sourceId = `${sourceData.id || ''}_${sourceData.cancerType || ''}_${initialData ? 'edit_direct' : 'exist'}`;
      if (hasInitializedRef.current === sourceId) {
        return;
      }
      hasInitializedRef.current = sourceId;

      const muts = Array.isArray(sourceData.geneMutations) 
        ? sourceData.geneMutations 
        : (Array.isArray(sourceData.molecular?.mutations) ? sourceData.molecular.mutations : []);
      const status = sourceData.molecularTestStatus || sourceData.molecular?.testStatus || (
        muts.length > 0 ? "tested" : (sourceData.egfr === 'positive' ? "tested" : (sourceData.molecularTestStatus === 'negative' ? 'negative' : "not_tested"))
      );

      // Cleanly hydrate solidSize with fallback from ctr * tumorSize
      let initialSolid = "";
      if (sourceData.solidSize !== undefined && sourceData.solidSize !== null && sourceData.solidSize !== "") {
        initialSolid = String(sourceData.solidSize);
      } else if (sourceData.noduleType === 'pure_ggo') {
        initialSolid = "0";
      } else if (sourceData.noduleType === 'pure_solid' && sourceData.tumorSize != null) {
        initialSolid = String(sourceData.tumorSize);
      } else if (sourceData.tumorSize != null && sourceData.ctr != null) {
        initialSolid = String(Math.round(Number(sourceData.tumorSize) * Number(sourceData.ctr) * 10) / 10);
      }

      setParsedData({
        ...sourceData,
        tumorSize: sourceData.tumorSize !== undefined && sourceData.tumorSize !== null ? String(sourceData.tumorSize) : "",
        solidSize: initialSolid,
        ctr: sourceData.ctr !== undefined && sourceData.ctr !== null ? sourceData.ctr : null,
        noduleType: sourceData.noduleType || (initialSolid === "0" ? "pure_ggo" : "mixed_ggo"),
        geneMutations: muts,
        molecularTestStatus: status,
        brainMri: sourceData.brainMri || "not_performed",
        abdominalUltrasound: sourceData.abdominalUltrasound || "not_performed",
        boneScan: sourceData.boneScan || "not_performed",
        neckLymphNodes: sourceData.neckLymphNodes || "not_performed",
        petCt: sourceData.petCt || "not_performed",
        benignFindings: Array.isArray(sourceData.benignFindings) ? sourceData.benignFindings : [],
        pathologyTumorSize: sourceData.pathologyTumorSize !== undefined && sourceData.pathologyTumorSize !== null ? String(sourceData.pathologyTumorSize) : "",
        pathologyInvasiveSize: sourceData.pathologyInvasiveSize !== undefined && sourceData.pathologyInvasiveSize !== null ? String(sourceData.pathologyInvasiveSize) : "",
        pathologyLepidicPercent: sourceData.pathologyLepidicPercent !== undefined && sourceData.pathologyLepidicPercent !== null ? String(sourceData.pathologyLepidicPercent) : "",
        pathologyReportMode: sourceData.pathologyReportMode || (sourceData.pathologyLepidicPercent != null && sourceData.pathologyLepidicPercent !== "" ? "percentage" : (sourceData.pathologyInvasiveSize != null && sourceData.pathologyInvasiveSize !== "" ? "explicit" : "explicit")),
      });
    }
  }, [initialData, existingProfile]);

  useEffect(() => {
    if (parsedData) {
      const parsedTumor = parsedData.tumorSize !== "" && parsedData.tumorSize != null ? parseFloat(String(parsedData.tumorSize)) : null;
      const tumorVal = parsedTumor !== null && !isNaN(parsedTumor) ? parsedTumor : null;
      const parsedSolid = parsedData.solidSize !== "" && parsedData.solidSize != null ? parseFloat(String(parsedData.solidSize)) : null;
      const solidVal = parsedSolid !== null && !isNaN(parsedSolid) ? parsedSolid : null;
      const pathTumor = parsedData.pathologyTumorSize !== "" && parsedData.pathologyTumorSize != null ? parseFloat(String(parsedData.pathologyTumorSize)) : null;
      const pathInvasive = parsedData.pathologyInvasiveSize !== "" && parsedData.pathologyInvasiveSize != null ? parseFloat(String(parsedData.pathologyInvasiveSize)) : null;
      const pathLepidic = parsedData.pathologyLepidicPercent !== "" && parsedData.pathologyLepidicPercent != null ? parseFloat(String(parsedData.pathologyLepidicPercent)) : null;

      const currentCancer = (parsedData.cancerType || cancerType || 'lung') as CancerType;
      const calc = computeCancerStage(currentCancer, {
        ...parsedData,
        tumorSize: tumorVal,
        solidSize: solidVal,
        ctr: parsedData.ctr != null ? parseFloat(String(parsedData.ctr)) : (tumorVal && solidVal !== null && tumorVal > 0 ? Math.min(1, Math.round((solidVal / tumorVal) * 100) / 100) : null),
        pathologyTumorSize: pathTumor,
        pathologyInvasiveSize: pathInvasive,
        pathologyLepidicPercent: pathLepidic,
        pathologyReportMode: parsedData.pathologyReportMode,
        tStage: parsedData.tStage,
        nStage: parsedData.nStage || "unknown",
        mStage: parsedData.mStage || "unknown",
        adjacentLobeInvasion: Boolean(parsedData.adjacentLobeInvasion),
        vpi: parsedData.vpi,
        stas: parsedData.stas,
        lvi: parsedData.lvi,
        marginStatus: parsedData.marginStatus,
      });
      setStagingPreview(calc);
    }
  }, [
    parsedData,
    cancerType,
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        
        // Client-side image scaling to ensure smooth mobile upload & optimal Gemini OCR resolution
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
            const base64 = compressedDataUrl.split(',')[1];
            setImages((prev) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(2, 9),
                name: file.name,
                base64: base64,
                mimeType: "image/jpeg",
                previewUrl: compressedDataUrl,
              },
            ]);
          } else {
            const [prefix, base64] = result.split(',');
            const mimeType = prefix.match(/:(.*?);/)?.[1] || "image/jpeg";
            setImages((prev) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(2, 9),
                name: file.name,
                base64: base64,
                mimeType: mimeType,
                previewUrl: result,
              },
            ]);
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAllImages = () => {
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleManualEntryFallback = () => {
    handleStartManualEntry();
  };

  const handleParse = async () => {
    if (!reportText.trim() && images.length === 0) return;
    setIsParsing(true);
    setError("");
    setErrorInfo(null);
    setParseCountdown(0);

    try {
      const res = await fetch("/api/parse-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          reportText, 
          images: images.map((img) => ({ base64: img.base64, mimeType: img.mimeType })),
          imageBase64: images[0]?.base64, 
          imageMimeType: images[0]?.mimeType,
          cancerType: currentCancer || cancerType,
        }),
      });
      
      const data = await res.json().catch(() => null);
      if (data && data.success) {
        setParsedData(data.data);
      } else {
        const clinical = formatClinicalAiError(data || "解析失败，请重试", 'parse');
        const finalInfo: ClinicalErrorInfo = {
          title: data?.title || clinical.title,
          message: data?.error || clinical.message,
          isRateLimit: data?.isRateLimit ?? clinical.isRateLimit,
          retryAfter: data?.retryAfter ?? clinical.retryAfter,
          suggestion: data?.suggestion || clinical.suggestion,
          badge: data?.badge || clinical.badge,
        };
        setErrorInfo(finalInfo);
        setError(finalInfo.message);
      }
    } catch (err: any) {
      const clinical = formatClinicalAiError(err, 'parse');
      setErrorInfo(clinical);
      setError(clinical.message);
    } finally {
      setIsParsing(false);
    }
  };

  useEffect(() => {
    if (errorInfo?.isRateLimit && (errorInfo?.retryAfter || 60)) {
      setParseCountdown(errorInfo.retryAfter || 60);
      const timer = setInterval(() => {
        setParseCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [errorInfo]);

  const handleConfirm = () => {
    if (parsedData) {
      const parsedTumor = parsedData.tumorSize !== "" && parsedData.tumorSize != null ? parseFloat(String(parsedData.tumorSize)) : null;
      const tumorVal = parsedTumor !== null && !isNaN(parsedTumor) ? parsedTumor : null;
      const parsedSolid = parsedData.solidSize !== "" && parsedData.solidSize != null ? parseFloat(String(parsedData.solidSize)) : null;
      const solidVal = parsedSolid !== null && !isNaN(parsedSolid) ? parsedSolid : null;
      const calculatedCtr = tumorVal && solidVal !== null && tumorVal > 0 ? Math.min(1, Math.round((solidVal / tumorVal) * 100) / 100) : null;

      // Clean Ki-67 value
      const base = existingProfile || initialData || {};
      const cleanKi67 = parsedData.ki67 !== undefined && parsedData.ki67 !== null && parsedData.ki67 !== ""
        ? String(parsedData.ki67).replace(/%/g, "").trim()
        : (base.ki67 || null);

      const cancerSpecificData = {
        ...(base.cancerSpecificData || {}),
        ...(parsedData.cancerSpecificData || {}),
        ...(parsedData || {}),
      };
      delete cancerSpecificData.stagingCalc;
      delete cancerSpecificData.stagingPreview;

      const finalData = {
        ...base,
        ...cancerSpecificData,
        cancerSpecificData,
        cancerType: currentCancer,
        organ: currentCancer,
        id: base.id,
        userId: base.userId,
        age: parsedData.age !== "" && parsedData.age != null && !isNaN(parseInt(String(parsedData.age))) ? parseInt(String(parsedData.age)) : (base.age || undefined),
        tumorSize: stagingPreview?.tumorSize !== undefined ? stagingPreview.tumorSize : tumorVal,
        solidSize: stagingPreview?.solidSize !== undefined ? stagingPreview.solidSize : solidVal,
        ctr: stagingPreview?.ctr !== undefined ? stagingPreview.ctr : calculatedCtr,
        pathologyTumorSize: parsedData.pathologyTumorSize !== "" && parsedData.pathologyTumorSize != null ? parseFloat(String(parsedData.pathologyTumorSize)) : (base.pathologyTumorSize ?? null),
        pathologyInvasiveSize: parsedData.pathologyInvasiveSize !== "" && parsedData.pathologyInvasiveSize != null ? parseFloat(String(parsedData.pathologyInvasiveSize)) : (base.pathologyInvasiveSize ?? null),
        pathologyLepidicPercent: parsedData.pathologyLepidicPercent !== "" && parsedData.pathologyLepidicPercent != null ? parseFloat(String(parsedData.pathologyLepidicPercent)) : (base.pathologyLepidicPercent ?? null),
        pathologyReportMode: parsedData.pathologyReportMode || base.pathologyReportMode || null,
        stage: stagingPreview?.stage || parsedData.stage || base.stage || "unknown",
        prognosticStage: stagingPreview?.prognosticStage || parsedData.prognosticStage || base.prognosticStage,
        anatomicalStage: stagingPreview?.anatomicalStage || parsedData.anatomicalStage || base.anatomicalStage,
        molecularSubtype: stagingPreview?.molecularSubtype || parsedData.molecularSubtype || base.molecularSubtype,
        tStage: stagingPreview?.tStage || parsedData.tStage || base.tStage || "unknown",
        noduleType: parsedData.noduleType || base.noduleType || "mixed_ggo",
        nStage: stagingPreview?.nStage || parsedData.nStage || base.nStage || "unknown",
        mStage: stagingPreview?.mStage || parsedData.mStage || base.mStage || "unknown",
        adjacentLobeInvasion: Boolean(parsedData.adjacentLobeInvasion ?? base.adjacentLobeInvasion),
        versionBridgeNotice: stagingPreview?.versionBridgeNotice,
        stas: parsedData.stas !== undefined ? parsedData.stas : (base.stas ?? null),
        vpi: parsedData.vpi !== undefined ? parsedData.vpi : (base.vpi ?? null),
        lvi: parsedData.lvi !== undefined ? parsedData.lvi : (base.lvi ?? null),
        marginStatus: parsedData.marginStatus !== undefined ? parsedData.marginStatus : (base.marginStatus ?? null),
        margin: parsedData.marginStatus !== undefined ? parsedData.marginStatus : (base.margin ?? null),
        surgeryType: parsedData.surgeryType || base.surgeryType || "unknown",
        iaslcGrade: parsedData.grade || parsedData.iaslcGrade || base.iaslcGrade || null,
        grade: parsedData.grade || parsedData.iaslcGrade || base.grade || null,
        ki67: cleanKi67,
        sex: parsedData.sex || parsedData.gender || base.sex || "unknown",
        gender: parsedData.sex || parsedData.gender || base.gender || "unknown",
        histology: parsedData.histology || base.histology || null,
        reportType: parsedData.reportType || base.reportType || "pathology",
        currentStage: (parsedData.reportType === 'ct_imaging' || parsedData.surgeryType === 'unknown') ? 'evaluation' : 'treatment',
        imagingFeatures: (Array.isArray(parsedData.imagingFeatures) && parsedData.imagingFeatures.length > 0) ? parsedData.imagingFeatures : (base.imagingFeatures || []),
        noduleLocation: parsedData.noduleLocation !== undefined ? parsedData.noduleLocation : (base.noduleLocation || ""),
        lungRads: parsedData.lungRads || base.lungRads || null,
        malignancyRisk: parsedData.malignancyRisk || base.malignancyRisk || "moderate",
        clinicalRecommendation: parsedData.clinicalRecommendation || base.clinicalRecommendation || null,

        // P0-1 Multiple Nodules
        isMultipleNodules: Boolean(parsedData.isMultipleNodules || (Array.isArray(parsedData.secondaryNodules) && parsedData.secondaryNodules.length > 0) || base.isMultipleNodules),
        secondaryNodules: Array.isArray(parsedData.secondaryNodules) ? parsedData.secondaryNodules : (base.secondaryNodules || []),

        // P2-2 Tumor Markers
        tumorMarkers: parsedData.tumorMarkers || base.tumorMarkers || null,

        // Molecular & Gene Mutations
        geneMutations: Array.isArray(parsedData.geneMutations) 
          ? parsedData.geneMutations 
          : (Array.isArray(base.geneMutations) ? base.geneMutations : (Array.isArray(base.molecular?.mutations) ? base.molecular.mutations : [])),
        molecular: {
          testStatus: parsedData.molecularTestStatus || (
            (Array.isArray(parsedData.geneMutations) && parsedData.geneMutations.length > 0) ? "tested" : (base.molecularTestStatus || base.molecular?.testStatus || "not_tested")
          ),
          testMethod: parsedData.molecular?.testMethod || base.molecular?.testMethod || "NGS_panel",
          mutations: Array.isArray(parsedData.geneMutations) ? parsedData.geneMutations : (base.geneMutations || base.molecular?.mutations || []),
          pdl1Tps: parsedData.pdl1Tps || base.pdl1Tps || base.molecular?.pdl1Tps || "unknown",
        },
        molecularTestStatus: parsedData.molecularTestStatus || (
          (Array.isArray(parsedData.geneMutations) && parsedData.geneMutations.length > 0) ? "tested" : (base.molecularTestStatus || "not_tested")
        ),
        pdl1Tps: parsedData.pdl1Tps || base.pdl1Tps || base.molecular?.pdl1Tps || undefined,
        egfr: (Array.isArray(parsedData.geneMutations) && parsedData.geneMutations.some((m: any) => m.gene === "EGFR" && m.status !== "negative" && !String(m.subtype || "").includes("阴性") && !String(m.subtype || "").includes("野生")))
          ? "positive"
          : ((parsedData.molecularTestStatus || base.molecularTestStatus) === "negative" ? "negative" : "not_tested"),

        // Systemic Staging & M0 Confirmation
        brainMri: parsedData.brainMri || base.brainMri || "not_performed",
        abdominalUltrasound: parsedData.abdominalUltrasound || base.abdominalUltrasound || "not_performed",
        boneScan: parsedData.boneScan || base.boneScan || "not_performed",
        neckLymphNodes: parsedData.neckLymphNodes || base.neckLymphNodes || "not_performed",
        petCt: parsedData.petCt || base.petCt || "not_performed",
        benignFindings: Array.isArray(parsedData.benignFindings) ? parsedData.benignFindings : (base.benignFindings || []),
        systemicStagingConfirmed: Boolean(parsedData.systemicStagingConfirmed === true || base.systemicStagingConfirmed === true),
        reportDate: parsedData.reportDate || base.reportDate || new Date().toISOString().split('T')[0],
        reportReviewStatus: "confirmed",
        reportEvidenceSpans: Array.isArray(parsedData.reportEvidenceSpans) ? parsedData.reportEvidenceSpans : [],
      };

      onParsed(finalData);
    }
  };

  const handleToggleGene = (geneName: string, defaultSubtype: string, isComutation: boolean = false) => {
    const currentList = Array.isArray(parsedData?.geneMutations) ? [...parsedData.geneMutations] : [];
    const exists = currentList.find((m: any) => m.gene === geneName);
    if (exists) {
      const updated = currentList.filter((m: any) => m.gene !== geneName);
      setParsedData({
        ...parsedData,
        geneMutations: updated,
        molecularTestStatus: updated.length > 0 ? "tested" : (parsedData.molecularTestStatus || "tested")
      });
    } else {
      const newMut = {
        id: `mut_${Date.now()}_${geneName}`,
        gene: geneName,
        subtype: defaultSubtype,
        abundance: "",
        isComutation: isComutation,
        status: "positive"
      };
      setParsedData({
        ...parsedData,
        geneMutations: [...currentList, newMut],
        molecularTestStatus: "tested"
      });
    }
  };

  const handleUpdateGeneSubtype = (geneName: string, subtype: string) => {
    const currentList = Array.isArray(parsedData?.geneMutations) ? [...parsedData.geneMutations] : [];
    const updated = currentList.map((m: any) => m.gene === geneName ? { ...m, subtype } : m);
    setParsedData({ ...parsedData, geneMutations: updated });
  };

  const handleUpdateGeneAbundance = (geneName: string, abundance: string) => {
    const currentList = Array.isArray(parsedData?.geneMutations) ? [...parsedData.geneMutations] : [];
    const updated = currentList.map((m: any) => m.gene === geneName ? { ...m, abundance } : m);
    setParsedData({ ...parsedData, geneMutations: updated });
  };

  const handleAddCustomGene = () => {
    if (!customGeneName.trim()) return;
    const currentList = Array.isArray(parsedData?.geneMutations) ? [...parsedData.geneMutations] : [];
    const newMut = {
      id: `mut_${Date.now()}`,
      gene: customGeneName.trim().toUpperCase(),
      subtype: customGeneSubtype.trim() || "突变",
      abundance: customGeneAbundance.trim(),
      isComutation: customIsComutation,
      status: "positive"
    };
    setParsedData({
      ...parsedData,
      geneMutations: [...currentList, newMut],
      molecularTestStatus: "tested"
    });
    setCustomGeneName("");
    setCustomGeneSubtype("");
    setCustomGeneAbundance("");
    setCustomIsComutation(false);
  };

  const _handleRemoveGene = (id: string) => {
    const currentList = Array.isArray(parsedData?.geneMutations) ? [...parsedData.geneMutations] : [];
    setParsedData({
      ...parsedData,
      geneMutations: currentList.filter((m: any) => m.id !== id)
    });
  };

  const handleAddBenignFinding = () => {
    if (!newBenignInput.trim()) return;
    const current = parsedData.benignFindings || [];
    if (!current.includes(newBenignInput.trim())) {
      setParsedData({
        ...parsedData,
        benignFindings: [...current, newBenignInput.trim()],
        abdominalUltrasound: parsedData.abdominalUltrasound === "not_performed" ? "benign_findings" : parsedData.abdominalUltrasound
      });
    }
    setNewBenignInput("");
  };

  const handleRemoveBenignFinding = (item: string) => {
    const current = parsedData.benignFindings || [];
    setParsedData({
      ...parsedData,
      benignFindings: current.filter((f: string) => f !== item)
    });
  };

  const handleAddSecondaryNodule = () => {
    if (!newSecLoc.trim() || !newSecSize.trim()) return;
    const current = parsedData.secondaryNodules || [];
    const newItem: SecondaryNodule = {
      id: `sec_${Date.now()}`,
      location: newSecLoc.trim(),
      sizeMm: parseFloat(newSecSize) || 4,
      type: newSecType,
      isBenignTendency: true,
      note: "微小伴随病灶，良性或常规随访"
    };
    setParsedData({
      ...parsedData,
      isMultipleNodules: true,
      secondaryNodules: [...current, newItem]
    });
    setNewSecLoc("");
    setNewSecSize("");
  };

  const handleRemoveSecondaryNodule = (id: string) => {
    const current = parsedData.secondaryNodules || [];
    const filtered = current.filter((item: any) => item.id !== id);
    setParsedData({
      ...parsedData,
      isMultipleNodules: filtered.length > 0,
      secondaryNodules: filtered
    });
  };


  if (parsedData) {
    const noduleType = parsedData.noduleType || "mixed_ggo";
    const isPureGgo = noduleType === "pure_ggo";
    const isPureSolid = noduleType === "pure_solid";

    const rawTumor = parsedData.tumorSize !== "" && parsedData.tumorSize != null ? parseFloat(String(parsedData.tumorSize)) : null;
    const tumorVal = rawTumor !== null && !isNaN(rawTumor) ? rawTumor : null;

    let solidVal: number | null = null;
    if (isPureGgo) {
      solidVal = 0;
    } else if (isPureSolid && tumorVal !== null) {
      solidVal = tumorVal;
    } else if (parsedData.solidSize !== "" && parsedData.solidSize != null) {
      const parsedSolid = parseFloat(String(parsedData.solidSize));
      solidVal = isNaN(parsedSolid) ? null : parsedSolid;
    }

    const currentCtr = isPureGgo 
      ? 0 
      : isPureSolid 
      ? 1.0 
      : (tumorVal && solidVal !== null && tumorVal > 0 ? Math.min(1, Math.round((solidVal / tumorVal) * 100) / 100) : null);

    const isSystemicM0 = 
      parsedData.brainMri === 'negative' || 
      parsedData.abdominalUltrasound === 'negative' || 
      parsedData.abdominalUltrasound === 'benign_findings' || 
      parsedData.boneScan === 'negative' || 
      parsedData.petCt === 'negative';

    return (
      <div className="max-w-7xl mx-auto w-full animate-fade-in">

        {/* ─── Header ─── */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
              parsedData?.isManualEntry 
                ? "bg-blue-50 text-blue-600 border-blue-200" 
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}>
              {parsedData?.isManualEntry ? <Edit3 className="w-4 h-4 text-blue-600" /> : <FileText className="w-4 h-4 text-emerald-600" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {parsedData?.isManualEntry 
                    ? `手动填报【${CancerRegistry.get(parsedData?.cancerType || cancerType || 'lung')?.name || '临床'}】指标` 
                    : (initialData ? "核对并校准关键指标" : "报告解析要素确认")}
                </h2>
                {parsedData?.isManualEntry && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                    免报告
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {parsedData?.isManualEntry 
                  ? `请填写已知关键临床指标，未测项可留空，系统实时推演【${CancerRegistry.get(parsedData?.cancerType || cancerType || 'lung')?.guidelineStandard || '国际权威指南'}】分期` 
                  : "系统已完成智能提取，请核对各项关键要素，支持直接修改"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {parsedData?.isManualEntry ? (
              <button
                type="button"
                onClick={() => {
                  setParsedData(null);
                  hasInitializedRef.current = null;
                  if (onSwitchToUpload) onSwitchToUpload();
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold px-3 py-1.5 rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>切换为拍照解析</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setParsedData(null);
                  hasInitializedRef.current = null;
                  if (onSwitchToUpload) onSwitchToUpload();
                }}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重新上传</span>
              </button>
            )}
            {existingProfile && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                ‹ 返回看板
              </button>
            )}
          </div>
        </div>

        {/* ─── Two-column layout ─── */}
        <div className="flex gap-5 items-start">

          {/* LEFT sidebar — PC only, sticky */}
          <aside className="w-52 shrink-0 hidden md:flex flex-col gap-4" style={{position:"sticky",top:"1rem"}}>
            <nav className="flex flex-col gap-1">
              {([
                { step: 1 as const, label: isLung ? "结节影像与部位" : isBreast ? "乳腺影像与原发灶" : isColorectal ? "肠镜与影像原发灶" : "影像诊断与原发灶" },
                { step: 2 as const, label: isBreast ? "免疫组化与分型" : isLung ? "组织病理与高危" : "组织病理与分期" },
                { step: 3 as const, label: isLung ? "驱动基因突变" : isBreast ? "受体与基因检测" : isColorectal ? "RAS/BRAF/MSI" : "分子病理与靶点" },
                { step: 4 as const, label: "全身排查与标志物" },
              ]).map(({ step, label }) => {
                const isActive = currentStep === step;
                const isDone = currentStep > step;
                return (
                  <button key={step} type="button" onClick={() => setCurrentStep(step)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer border ${isActive ? "bg-blue-50 border-blue-200 text-blue-800" : isDone ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isActive ? "bg-blue-600 text-white" : isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                      {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : step}
                    </span>
                    <span className="text-xs font-semibold leading-tight">{label}</span>
                    {isActive && <span className="ml-auto w-1 h-4 rounded-full bg-blue-500" />}
                  </button>
                );
              })}
            </nav>
            {false && stagingPreview && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{CancerRegistry.get(parsedData?.cancerType || cancerType || 'lung')?.guidelineStandard || "权威临床分期标准"}</div>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">国际标准</span>
                </div>
                <div className="text-lg font-extrabold text-emerald-900">
                  {stagingPreview.stage.includes("待定") ? "待完善指标 (Tx)" : (stagingPreview.stage.includes("期") ? stagingPreview.stage : `${stagingPreview.stage} 期`)}
                </div>
                <div className="text-xs font-bold text-emerald-800">{stagingPreview.tStage}{stagingPreview.nStage}{stagingPreview.mStage}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{stagingPreview.explanation}</p>
                {stagingPreview.versionBridgeNotice && (
                  <div className="mt-1 pt-1.5 border-t border-emerald-200/80 text-[10px] text-teal-800 font-medium leading-tight flex items-start gap-1">
                    <Lightbulb className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>新旧演变释疑</strong>: {stagingPreview.versionBridgeNotice}</span>
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* RIGHT content area */}
          <section className="flex-1 min-w-0">
            {/* Mobile pill stepper */}
            <div className="flex md:hidden mb-4 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/80 gap-1">
              {([
                { step: 1 as const, label: isLung ? "影像随访" : isBreast ? "乳腺影像" : isColorectal ? "肠镜影像" : "影像诊断" },
                { step: 2 as const, label: isBreast ? "免疫组化" : isLung ? "病理高危" : "组织病理" },
                { step: 3 as const, label: isLung ? "驱动基因" : isBreast ? "分子分型" : isColorectal ? "靶向基因" : "分子靶点" },
                { step: 4 as const, label: isBreast ? "标志排查" : "标志排查" },
              ]).map(({ step, label }) => (
                <button key={step} type="button" onClick={() => setCurrentStep(step)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentStep === step ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}
                >{label}</button>
              ))}
            </div>

            {/* Mobile Staging Preview Banner */}
            {false && stagingPreview && (
              <div className="md:hidden mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between gap-2 shadow-2xs">
                <div>
                  <div className="text-[10px] font-bold text-emerald-700 uppercase">【{CancerRegistry.get(parsedData?.cancerType || cancerType || 'lung')?.name || "临床"}】分期实时推演</div>
                  <div className="text-sm font-extrabold text-emerald-950 flex items-center gap-1.5 mt-0.5">
                    <span>{stagingPreview.stage.includes("待定") ? "待完善指标 (Tx)" : (stagingPreview.stage.includes("期") ? stagingPreview.stage : `${stagingPreview.stage} 期`)}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 font-mono">({stagingPreview.tStage}{stagingPreview.nStage}{stagingPreview.mStage})</span>
                  </div>
                </div>
                <div className="text-[10px] text-right text-slate-500 max-w-[150px] truncate">
                  {stagingPreview.explanation}
                </div>
              </div>
            )}

            {/* Step content card — key forces re-mount → triggers animate-slide-in */}
            <div key={`step-${currentStep}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-slide-in">
              <div className="p-4 sm:p-5 space-y-5">

        {currentStep === 1 && (
          <div className="space-y-6">
            
            {/* Section 1: Patient Demographics & Surgery Status (Clinical Anchor & Primary Switch) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">患者基本画像与诊疗状态</h3>
                    <p className="text-[11px] text-slate-500">决定分期计算基准与临床路径分流</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">生物学性别</label>
                  <select 
                    value={parsedData.sex || "unknown"} 
                    onChange={e => setParsedData({...parsedData, sex: e.target.value})}
                    className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
                  >
                    <option value="unknown">未提及 / 待确认</option>
                    <option value="female">女性 (Female)</option>
                    <option value="male">男性 (Male)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">患者年龄</label>
                  <input 
                    type="number" 
                    value={parsedData.age || ""} 
                    onChange={e => setParsedData({...parsedData, age: e.target.value})}
                    className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                    placeholder="如未提供可留空，如: 55"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">当前诊疗状态 / 手术术式</label>
                  {parsedData.reportType === 'ct_imaging' && (parsedData.surgeryType === 'unknown' || !parsedData.surgeryType) ? (
                    <div className="w-full h-10 px-3 py-2 bg-sky-50 border border-sky-200 rounded-xl text-xs font-bold text-sky-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                        <span>尚未手术 (随访期 / 术前)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setParsedData({ ...parsedData, surgeryType: "segmentectomy" })}
                        className="text-[11px] text-sky-700 hover:text-sky-900 underline font-semibold shrink-0 cursor-pointer"
                      >
                        改为已手术
                      </button>
                    </div>
                  ) : (
                    <select 
                      value={parsedData.surgeryType || "unknown"} 
                      onChange={e => setParsedData({...parsedData, surgeryType: e.target.value})}
                      className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
                    >
                      <option value="unknown">尚未手术 / 随访观察期</option>
                      {isBreast ? (
                        <>
                          <option value="bcs">保乳手术 (BCS)</option>
                          <option value="mastectomy">乳腺全切术 (Mastectomy)</option>
                          <option value="reconstruction">全切+一期/二期乳房重建</option>
                        </>
                      ) : isColorectal ? (
                        <>
                          <option value="colectomy">结肠切除术 (Colectomy)</option>
                          <option value="tme">直肠癌全系膜切除 (TME)</option>
                          <option value="local_excision">内镜/经肛局部切除</option>
                        </>
                      ) : isGastric ? (
                        <>
                          <option value="distal_gastrectomy">远端胃大部分切除术 (D2)</option>
                          <option value="total_gastrectomy">全胃切除术 (D2)</option>
                          <option value="proximal_gastrectomy">近端胃切除术</option>
                          <option value="esd">内镜黏膜下剥离术 (ESD)</option>
                        </>
                      ) : isLiver ? (
                        <>
                          <option value="hepatectomy">肝叶/肝段切除术</option>
                          <option value="ablation">射频/微波局部消融术</option>
                          <option value="transplant">肝脏移植术</option>
                          <option value="tace">经动脉化疗栓塞 (TACE)</option>
                        </>
                      ) : isThyroid ? (
                        <>
                          <option value="total_thyroidectomy">甲状腺全切术</option>
                          <option value="lobectomy_isthmus">单侧腺叶+峡部切除</option>
                          <option value="central_dissection">甲状腺全切+中央区淋巴结清扫</option>
                        </>
                      ) : isPancreatic ? (
                        <>
                          <option value="whipple">胰十二指肠切除术 (Whipple)</option>
                          <option value="distal_pancreatectomy">胰体尾切除术 (RAMPS)</option>
                          <option value="total_pancreatectomy">全胰切除术</option>
                        </>
                      ) : isEsophageal ? (
                        <>
                          <option value="mckeown">食管癌根治术 (McKeown 三切口)</option>
                          <option value="ivor_lewis">食管癌根治术 (Ivor Lewis 双切口)</option>
                          <option value="esd">内镜微创切除 (ESD)</option>
                        </>
                      ) : isEndometrial ? (
                        <>
                          <option value="hysterectomy_bso">全子宫双附件切除术</option>
                          <option value="staging_surgery">全面分期手术 (伴淋巴结清扫)</option>
                        </>
                      ) : isCervical ? (
                        <>
                          <option value="wertheim">广泛性全子宫切除术 (Wertheim / Piver III)</option>
                          <option value="conization">宫颈锥切术 (LEEP / CKC)</option>
                          <option value="ccrt">根治性同步化放疗 (CCRT, 免手术)</option>
                        </>
                      ) : (
                        <>
                          <option value="segmentectomy">解剖性肺段切除 (Segmentectomy)</option>
                          <option value="lobectomy">标准肺叶切除 (Lobectomy)</option>
                          <option value="wedge">肺楔形切除 (Wedge Resection)</option>
                        </>
                      )}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Nodule Morphology & Solid Size & Accurate CTR */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
                    <Scan className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {isBreast ? "乳腺影像与肿块大小 (BI-RADS 评估)" :
                       isColorectal ? "肠道影像与原发病灶浸润 (T分期)" :
                       isGastric ? "胃镜与腹盆增强 CT 原发灶 (T分期)" :
                       isLiver ? "肝脏肿瘤原发灶评估 (最大径 / 数目)" :
                       isThyroid ? "甲状腺超声与结节评估 (TI-RADS)" :
                       isEndometrial ? "盆腔 MRI 与肌层浸润深度 (FIGO分期)" :
                       isCervical ? "宫颈原发灶与盆腔 MRI 浸润 (FIGO分期)" :
                       isPancreatic ? "胰腺薄层增强 CT 原发灶 (可切除性)" :
                       isEsophageal ? "食管内镜与增强 CT 原发灶 (T分期)" :
                       "结节形态与 CT 实性成分 (CTR 核心分期依据)"}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isBreast ? "超声/钼靶测量肿块最大径与钙化" :
                       isColorectal ? "肠镜病变测量与盆腔核磁评估" :
                       isGastric ? "胃镜活检病变大小与胃壁浸润深度" :
                       isLiver ? "增强影像测量肿瘤最大径与血管受累" :
                       isThyroid ? "高分辨超声测量结节大小与钙化" :
                       isEndometrial ? "MRI 测定肌层浸润与宫颈间质受累" :
                       isCervical ? "专科检查与 MRI 判定病灶范围" :
                       isPancreatic ? "薄层 CT 测定肿瘤最大径与血管间隙" :
                       isEsophageal ? "内镜与 CT 评估病灶长度与外侵" :
                       "薄层 CT 影像原发灶测量，CTR 为临床分期重要依据"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {isLung ? `当前 CTR: ${
                    currentCtr === null 
                      ? "待影像测量确认" 
                      : isPureGgo 
                      ? "0.0 (纯磨玻璃)" 
                      : isPureSolid 
                      ? "1.0 (纯实性)" 
                      : currentCtr
                  }` : (parsedData.tumorSize ? `原发灶大小: ${parsedData.tumorSize} cm` : "待影像测量确认")}
                </span>
              </div>

              {/* CT Size Status Banner / Quick Toggle */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  {parsedData.tumorSize !== "" && parsedData.tumorSize != null ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{isLung ? "已录入胸部薄层 CT 影像测量数据" : `已录入【${CancerRegistry.get(currentCancer)?.name || '原发'}】影像测量数据`}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{isLung ? "未提供 CT 报告或结节大小数据（档案将显示待影像学确认）" : "未提供原发病灶大小数据（档案将显示待影像学确认）"}</span>
                    </>
                  )}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  {parsedData.tumorSize !== "" && parsedData.tumorSize != null ? (
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, tumorSize: "", solidSize: "", ctr: null })}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-white border border-slate-200 transition-colors cursor-pointer"
                    >
                      清空 / 标为未提供
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, tumorSize: "1.0", solidSize: isLung ? "0" : "1.0", ctr: isLung ? 0 : 1.0 })}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
                    >
                      + 录入病灶大小
                    </button>
                  )}
                </div>
              </div>

              {isLung ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">结节形态/类型</label>
                      <select 
                        value={parsedData.noduleType || "mixed_ggo"} 
                        onChange={e => {
                          const newType = e.target.value;
                          if (newType === "pure_ggo") {
                            setParsedData({
                              ...parsedData,
                              noduleType: "pure_ggo",
                              solidSize: "0",
                              ctr: 0
                            });
                          } else if (newType === "pure_solid") {
                            const curTumor = parsedData.tumorSize !== undefined && parsedData.tumorSize !== "" ? String(parsedData.tumorSize) : "";
                            setParsedData({
                              ...parsedData,
                              noduleType: "pure_solid",
                              solidSize: curTumor,
                              ctr: curTumor ? 1.0 : null
                            });
                          } else {
                            setParsedData({
                              ...parsedData,
                              noduleType: "mixed_ggo",
                              solidSize: parsedData.solidSize === "0" ? "" : (parsedData.solidSize || "")
                            });
                          }
                        }}
                        className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
                      >
                        <option value="mixed_ggo">混合磨玻璃结节 (mGGO 部分实性)</option>
                        <option value="pure_ggo">纯磨玻璃结节 (pGGO 实性=0, CTR=0)</option>
                        <option value="pure_solid">纯实性结节 (Pure Solid, CTR=1.0)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isPureSolid ? "实性病灶最大径 (cm)" : "磨玻璃/病灶最大径 (cm)"}
                      </label>
                      <input 
                        type="text" 
                        inputMode="decimal"
                        value={parsedData.tumorSize !== undefined && parsedData.tumorSize !== null ? parsedData.tumorSize : ""} 
                        onChange={e => {
                          const val = e.target.value;
                          const tumorNum = parseFloat(val);
                          const solidNum = parseFloat(String(parsedData.solidSize));
                          if (parsedData.noduleType === "pure_solid") {
                            setParsedData({
                              ...parsedData,
                              tumorSize: val,
                              solidSize: val,
                              ctr: val ? 1.0 : null
                            });
                          } else if (parsedData.noduleType === "pure_ggo") {
                            setParsedData({
                              ...parsedData,
                              tumorSize: val,
                              solidSize: "0",
                              ctr: 0
                            });
                          } else {
                            const newCtr = !isNaN(tumorNum) && tumorNum > 0 && !isNaN(solidNum) 
                              ? Math.min(1, Math.round((solidNum / tumorNum) * 100) / 100) 
                              : parsedData.ctr;
                            setParsedData({
                              ...parsedData,
                              tumorSize: val,
                              ctr: newCtr
                            });
                          }
                        }}
                        className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors font-mono"
                        placeholder="未提供可留空，如: 1.5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
                        <span>CT 实性成分最大径 (cm)</span>
                        {isPureGgo && (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            纯磨玻璃 (0 cm)
                          </span>
                        )}
                        {isPureSolid && (
                          <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            纯实性 (同全径)
                          </span>
                        )}
                        {!isPureGgo && !isPureSolid && (
                          <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            部分实性 (可直接修改)
                          </span>
                        )}
                      </label>
                      <input 
                        type="text" 
                        inputMode="decimal"
                        value={parsedData.solidSize !== undefined && parsedData.solidSize !== null ? parsedData.solidSize : ""} 
                        onChange={e => {
                          const val = e.target.value;
                          const solidNum = parseFloat(val);
                          const tumorNum = parseFloat(String(parsedData.tumorSize));

                          let newNoduleType = parsedData.noduleType || "mixed_ggo";
                          let newCtr = parsedData.ctr;

                          if (val === "" || isNaN(solidNum)) {
                            newCtr = null;
                          } else if (!isNaN(tumorNum) && tumorNum > 0) {
                            newCtr = Math.min(1, Math.round((solidNum / tumorNum) * 100) / 100);
                            if (solidNum >= tumorNum) {
                              newNoduleType = "pure_solid";
                              newCtr = 1.0;
                            } else if (solidNum === 0 && val === "0") {
                              newNoduleType = "pure_ggo";
                              newCtr = 0;
                            } else {
                              newNoduleType = "mixed_ggo";
                            }
                          } else {
                            if (solidNum === 0 && val === "0") {
                              newNoduleType = "pure_ggo";
                              newCtr = 0;
                            } else if (solidNum > 0) {
                              newNoduleType = "mixed_ggo";
                            }
                          }

                          setParsedData({
                            ...parsedData,
                            solidSize: val,
                            noduleType: newNoduleType,
                            ctr: newCtr
                          });
                        }}
                        className="w-full h-10 px-3 py-2 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        placeholder="未提供可留空，如: 0.8 (纯磨填0，纯实性填同总径)"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <span className="flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {tumorVal === null ? (
                        <span>
                          <strong>CT 影像数据待确认</strong>：暂未录入结节全径。如需准确测算实性成分比 (CTR) 与 TNM 临床分期，请根据胸部薄层 CT 报告填写。
                        </span>
                      ) : isPureGgo ? (
                        <span>
                          <strong>结节性质判定</strong>：纯磨玻璃结节 (pGGO)，实性浸润成分为 0，<strong>CTR = 0%</strong> (惰性极低危， Tis/T1mi 原位级别)
                        </span>
                      ) : isPureSolid ? (
                        <span>
                          <strong>结节性质判定</strong>：纯实性结节 (Pure Solid)，100% 软组织实性浸润，<strong>CTR = 100% (1.0)</strong> (依据实性总径严格分期)
                        </span>
                      ) : (
                        <span>
                          <strong>CTR 计算公式</strong>：<strong>CT 实性成分最大径 ({solidVal !== null ? `${solidVal}cm` : '未测'}) ÷ 结节总全径 ({tumorVal}cm) = {currentCtr !== null ? currentCtr : '待输入实性成分'}</strong>
                        </span>
                      )}
                    </span>
                    <span className="text-teal-700 font-semibold flex items-center gap-1">
                      {tumorVal === null ? (
                        <span className="text-slate-400">待影像学补录</span>
                      ) : isPureGgo ? (
                        <>
                          <Check className="w-3 h-3 text-teal-600" />
                          <span>纯磨玻璃结节 (贴壁生长，5年生存率近 100%)</span>
                        </>
                      ) : isPureSolid ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-blue-600" />
                          <span>纯实性浸润 (依据实性总径确定 T 分期与评估切缘)</span>
                        </>
                      ) : currentCtr !== null && currentCtr <= 0.5 ? (
                        <>
                          <Check className="w-3 h-3 text-teal-600" />
                          <span>CTR ≤ 0.5 (惰性浸润，5年无复发率高达99.7%)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>CTR &gt; 0.5 (浸润成分较高，需重点评估切缘)</span>
                        </>
                      )}
                    </span>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {isBreast ? "肿块最大径 (cm)" : "原发病灶最大径 (cm)"}
                    </label>
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={parsedData.tumorSize !== undefined && parsedData.tumorSize !== null ? parsedData.tumorSize : ""} 
                      onChange={e => setParsedData({ ...parsedData, tumorSize: e.target.value, solidSize: e.target.value })}
                      className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors font-mono"
                      placeholder="未提供可留空，如: 2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      {isBreast ? "BI-RADS 影像分类" : isThyroid ? "C-TIRADS 超声分级" : "原发灶 T 分期参考"}
                    </label>
                    {isBreast ? (
                      <select 
                        value={parsedData.biRads || ""} 
                        onChange={e => setParsedData({...parsedData, biRads: e.target.value})}
                        className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
                      >
                        <option value="">未分类 / 待确认</option>
                        <option value="2">2 类 (良性病变)</option>
                        <option value="3">3 类 (良性可能，恶性率&lt;2%)</option>
                        <option value="4A">4A 类 (低度可疑 2%~10%)</option>
                        <option value="4B">4B 类 (中度可疑 10%~50%)</option>
                        <option value="4C">4C 类 (高度可疑 50%~95%)</option>
                        <option value="5">5 类 (高度提示恶性 ≥95%)</option>
                        <option value="6">6 类 (病理证实恶性)</option>
                      </select>
                    ) : isThyroid ? (
                      <select 
                        value={parsedData.tiRads || ""} 
                        onChange={e => setParsedData({...parsedData, tiRads: e.target.value})}
                        className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
                      >
                        <option value="">未分级 / 待确认</option>
                        <option value="3">3 类 (良性可能)</option>
                        <option value="4A">4A 类 (轻度可疑 2%~10%)</option>
                        <option value="4B">4B 类 (中度可疑 10%~50%)</option>
                        <option value="4C">4C 类 (高度可疑 50%~90%)</option>
                        <option value="5">5 类 (高度恶性 &gt;90%)</option>
                      </select>
                    ) : (
                      <select 
                        value={parsedData.tStage || "T1"} 
                        onChange={e => setParsedData({...parsedData, tStage: e.target.value})}
                        className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
                      >
                        <option value="T1">T1 (原发灶局限 / 早期浸润)</option>
                        <option value="T2">T2 (局部浸润 / 中等体积)</option>
                        <option value="T3">T3 (穿透肌层或侵及外膜)</option>
                        <option value="T4">T4 (侵及邻近脏器/大血管)</option>
                        <option value="Tx">Tx (原发灶无法评估)</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      原发病灶解剖定位描述
                    </label>
                    <input 
                      type="text" 
                      value={parsedData.noduleLocation || parsedData.organLocation || ""} 
                      onChange={e => setParsedData({ ...parsedData, noduleLocation: e.target.value, organLocation: e.target.value })}
                      className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                      placeholder={isBreast ? "如: 左乳外上象限 2点钟" : isColorectal ? "如: 乙状结肠距肛缘18cm" : isGastric ? "如: 胃窦小弯侧" : isLiver ? "如: 右后叶 S7/S8 段" : "如: 原发解剖部位"}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: CT Malignant Imaging Signs with Plain-Language Definitions (Lung only) */}
            {isLung && (
              <>
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0">
                    <Scan className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">CT 影像征象与解剖定位</h3>
                    <p className="text-[11px] text-slate-500">恶性征象辅助识别与 Lung-RADS 影像分级</p>
                  </div>
                </div>
                {parsedData.lungRads && (
                  <span className="px-2.5 py-1 bg-sky-50 text-sky-800 rounded-full font-extrabold text-[11px] border border-sky-200">
                    Lung-RADS: {parsedData.lungRads}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">结节解剖部位</label>
                  <input 
                    type="text" 
                    value={parsedData.noduleLocation || ""} 
                    onChange={e => setParsedData({...parsedData, noduleLocation: e.target.value})}
                    className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors"
                    placeholder="如：右肺上叶尖后段"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Lung-RADS 影像分级</label>
                  <select 
                    value={parsedData.lungRads || ""} 
                    onChange={e => setParsedData({...parsedData, lungRads: e.target.value || null})}
                    className="w-full h-10 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-colors cursor-pointer"
                  >
                    <option value="">未标注 / 不适用</option>
                    <option value="2">2 类 (良性表现)</option>
                    <option value="3">3 类 (良性可能)</option>
                    <option value="4A">4A 类 (低度可疑恶性)</option>
                    <option value="4B">4B 类 (中度可疑恶性)</option>
                    <option value="4X">4X 类 (高度可疑恶性)</option>
                  </select>
                </div>
              </div>

            {/* Interactive Sign Pills */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-700">已识别的危险征象（点击增删，点击右侧查看白话医学解释）：</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(CT_SIGN_DEFINITIONS).map(sign => {
                  const isSelected = (parsedData.imagingFeatures || []).includes(sign);
                  return (
                    <button
                      key={sign}
                      type="button"
                      onClick={() => {
                        const current = parsedData.imagingFeatures || [];
                        if (isSelected) {
                          setParsedData({...parsedData, imagingFeatures: current.filter((f: string) => f !== sign)});
                        } else {
                          setParsedData({...parsedData, imagingFeatures: [...current, sign]});
                        }
                        setActiveSignTooltip(activeSignTooltip === sign ? null : sign);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-amber-100 border-amber-300 text-amber-950 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>{sign}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Multiple Pulmonary Nodules Management (P0-1) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-3.5">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
                  <CircleDot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">双肺多发病灶协同管理</h3>
                  <p className="text-[11px] text-slate-500">主病灶手术评估 vs 伴随微小病灶良性随访</p>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                parsedData.isMultipleNodules
                  ? "bg-teal-50 text-teal-800 border-teal-300"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}>
                {parsedData.isMultipleNodules ? "双肺多发结节" : "单发主病灶"}
              </span>
            </div>

            {/* Reassurance text */}
            <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 text-xs text-teal-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>多发结节良性定心丸：</span>
              </div>
              <p className="text-[11px] text-teal-800 leading-relaxed">
                体检中超过 30% 的人群伴有双肺多发微小结节，绝大多数为既往隐匿性感染留下的陈旧良性疤痕，<strong>绝不等于转移扩散</strong>！临床以【主病灶】作为手术或干预评估基准，次要微小灶以常规薄层 CT 随访观察即可。
              </p>
            </div>

            {/* Secondary nodules list */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-700">次要伴随微小结节清单：</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(parsedData.secondaryNodules || []).map((sec: any) => (
                  <div key={sec.id} className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{sec.location}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-teal-50 text-teal-800 rounded font-semibold border border-teal-100">
                          {sec.sizeMm}mm · {sec.type === "pure_ggo" ? "纯磨玻璃" : sec.type === "calcification" ? "钙化灶" : "微小结节"}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{sec.note || "良性随访"}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSecondaryNodule(sec.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 text-xs cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add secondary nodule row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="部位 (如: 右肺下叶)"
                  value={newSecLoc}
                  onChange={(e) => setNewSecLoc(e.target.value)}
                  className="h-8 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs flex-1 min-w-[120px] focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <input
                  type="number"
                  placeholder="大小(mm)"
                  value={newSecSize}
                  onChange={(e) => setNewSecSize(e.target.value)}
                  className="h-8 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs w-20 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
                <select
                  value={newSecType}
                  onChange={(e) => setNewSecType(e.target.value)}
                  className="h-8 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="pure_ggo">纯磨玻璃</option>
                  <option value="solid">实性小结节</option>
                  <option value="calcification">钙化灶</option>
                  <option value="mixed_ggo">混合磨玻璃</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSecondaryNodule}
                  className="h-8 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center"
                >
                  + 添加伴随结节
                </button>
              </div>
            </div>
          </div>


          </>
        )}
      </div>
    )}

      {/* Step 2: Pathology & High-Risk Factors */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {parsedData.reportType === 'ct_imaging' && parsedData.surgeryType === 'unknown' ? (
              <div className="p-5 bg-sky-50/80 border-2 border-sky-200 rounded-2xl text-xs text-sky-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-sky-950">
                  <Info className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>当前处于【术前随访 / 待手术评估】阶段</span>
                </div>
                <p className="text-xs leading-relaxed text-sky-800">
                  {isLung ? (
                    <>组织病理高危特征（如 STAS 气道播散、胸膜浸润 VPI、脉管癌栓 LVI、切缘状态等）需在<strong>胸外科手术切除后由病理科石蜡切片确诊</strong>。若您尚未手术，可直接进行【步骤3：基因突变】或【步骤4：标志物与全身排查】。</>
                  ) : (
                    <>组织病理高危特征（如切缘状态、脉管癌栓 LVI、神经浸润 PNI、组织学分级等）需在<strong>外科根治切除后由病理科石蜡切片确诊</strong>。若您尚未手术，可直接进行【步骤3：分子病理与生物标志物】或【步骤4：全身转移排查】。</>
                  )}
                </p>
                <div className="pt-1 flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setParsedData({ ...parsedData, surgeryType: isLung ? "segmentectomy" : "resection" })}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
                  >
                    {isLung ? "已完成胸外科微创手术，录入病理切片报告" : "已完成根治性手术，录入病理切片报告"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-3.5 py-2 bg-white border border-sky-300 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    尚未手术，跳过病理进入【步骤3：分子与基因】
                  </button>
                </div>
              </div>
            ) : null}

            {/* Section 2.5: Surgical Pathology Tumor Dimensions & Microscopic Invasive Size (IASLC / AJCC 第 9 版 pT Standard, Lung only) */}
            {isLung && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center shrink-0">
                    <Microscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      术后病理标本肿瘤大小与镜下浸润测量 (pT 标准)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      IASLC / AJCC 第 9 版金标准 · 依据显微镜下微观浸润成分最大径决定 pT 分期
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 shrink-0">
                  病理金标准 · 解决 pT 分期
                </span>
              </div>

              {/* 3 Pathology Clinical Scenarios Selector */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>病理报告浸润成分描述类型 (请选择您的报告情形)：</span>
                  <span className="text-slate-400 font-normal">覆盖国内三类主流病理报告</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "explicit",
                      title: "情形 1：明确写出浸润大小",
                      desc: "报告直接注明浸润径，如浸润 0.6cm / 微浸润 ≤0.5cm / 原位",
                    },
                    {
                      id: "percentage",
                      title: "情形 2：写明各成分百分比",
                      desc: "写明贴壁 lepidic、腺泡、乳头等比例，自动扣除贴壁折算",
                    },
                    {
                      id: "unspecified",
                      title: "情形 3：未详述浸润或比例",
                      desc: "仅写腺癌未写比例，支持一键参照术前 CT 实性成分估算",
                    },
                  ].map((mode) => {
                    const currentMode = parsedData.pathologyReportMode || "explicit";
                    const isSelected = currentMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          const gross = parseFloat(String(parsedData.pathologyTumorSize || "0")) || 0;
                          let newLepidic = parsedData.pathologyLepidicPercent;
                          let newInvasive = parsedData.pathologyInvasiveSize;
                          if (mode.id === "percentage") {
                            if (newLepidic === undefined || newLepidic === null || newLepidic === "") {
                              newLepidic = 50;
                            }
                            if (gross > 0) {
                              const lepNum = typeof newLepidic === "number" ? newLepidic : parseFloat(String(newLepidic)) || 50;
                              newInvasive = Math.max(0, Math.round(gross * (Math.max(0, 100 - lepNum) / 100) * 100) / 100).toString();
                            }
                          } else if (mode.id === "unspecified") {
                            if (!newInvasive || newInvasive === "0") {
                              if (parsedData.solidSize && parsedData.solidSize !== "0") {
                                newInvasive = String(parsedData.solidSize);
                              }
                            }
                          } else if (mode.id === "explicit") {
                            newLepidic = "";
                          }
                          setParsedData((prev: any) => ({
                            ...prev,
                            pathologyReportMode: mode.id,
                            pathologyLepidicPercent: newLepidic,
                            pathologyInvasiveSize: newInvasive
                          }));
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-purple-50/70 border-purple-500 shadow-xs ring-1 ring-purple-400/30"
                            : "bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                            isSelected ? "border-purple-600 bg-purple-600 text-white" : "border-slate-300 bg-white"
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className={isSelected ? "text-purple-950 font-extrabold" : "text-slate-800"}>
                            {mode.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {mode.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode Specific Inputs Grid */}
              {(() => {
                const currentMode = parsedData.pathologyReportMode || "explicit";

                if (currentMode === "percentage") {
                  const gross = parseFloat(String(parsedData.pathologyTumorSize || "0")) || 0;
                  const lepidic = parsedData.pathologyLepidicPercent !== undefined && parsedData.pathologyLepidicPercent !== null && parsedData.pathologyLepidicPercent !== ""
                    ? (typeof parsedData.pathologyLepidicPercent === "number" ? parsedData.pathologyLepidicPercent : parseFloat(String(parsedData.pathologyLepidicPercent)))
                    : 50;
                  const safeLepidic = isNaN(lepidic) ? 50 : Math.min(100, Math.max(0, lepidic));
                  const invasivePercent = Math.max(0, 100 - safeLepidic);
                  const derivedInvasive = gross > 0 ? Math.max(0, Math.round(gross * (invasivePercent / 100) * 100) / 100) : 0;

                  return (
                    <div className="space-y-3.5 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                            <span>标本大体肿瘤全径 (cm)</span>
                            <span className="text-[11px] text-slate-400">肉眼切面最大径</span>
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={parsedData.pathologyTumorSize !== undefined && parsedData.pathologyTumorSize !== null ? parsedData.pathologyTumorSize : ""}
                            onChange={e => {
                              const val = e.target.value;
                              const numGross = parseFloat(val);
                              let newInvasive = parsedData.pathologyInvasiveSize;
                              if (!isNaN(numGross)) {
                                newInvasive = Math.max(0, Math.round(numGross * (invasivePercent / 100) * 100) / 100).toString();
                              }
                              setParsedData({ ...parsedData, pathologyTumorSize: val, pathologyInvasiveSize: newInvasive });
                            }}
                            placeholder="如 1.8 (厘米)"
                            className="w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-purple-950 mb-1 flex items-center justify-between">
                            <span className="font-bold">贴壁生长 (Lepidic) 成分比例 (%)</span>
                            <span className="text-[11px] text-purple-600 font-bold">非浸润部分</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={parsedData.pathologyLepidicPercent !== undefined && parsedData.pathologyLepidicPercent !== null ? parsedData.pathologyLepidicPercent : ""}
                              onChange={e => {
                                const val = e.target.value;
                                const numVal = parseFloat(val);
                                let newInvasive = parsedData.pathologyInvasiveSize;
                                if (!isNaN(numVal) && gross > 0) {
                                  const invPct = Math.max(0, 100 - Math.min(100, Math.max(0, numVal)));
                                  newInvasive = Math.max(0, Math.round(gross * (invPct / 100) * 100) / 100).toString();
                                }
                                setParsedData({ ...parsedData, pathologyLepidicPercent: val, pathologyInvasiveSize: newInvasive });
                              }}
                              placeholder="如 70 (%)"
                              className="w-full h-10 px-3 py-2 pr-8 bg-slate-50 border border-purple-300 rounded-xl text-xs sm:text-sm font-bold text-purple-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono"
                            />
                            <span className="absolute right-3 top-2.5 text-xs text-purple-400 font-bold pointer-events-none">%</span>
                          </div>
                        </div>
                      </div>

                      {/* Lepidic Presets */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-slate-500 font-medium">常见贴壁比例快捷键:</span>
                        {[
                          { lep: 90, label: "贴壁 90% (极微浸润 10%)" },
                          { lep: 70, label: "贴壁 70% (腺泡/乳头 30%)" },
                          { lep: 50, label: "贴壁 50% (对半混合)" },
                          { lep: 20, label: "贴壁 20% (浸润为主 80%)" },
                          { lep: 0, label: "贴壁 0% (纯浸润腺癌)" },
                        ].map(preset => (
                          <button
                            key={preset.lep}
                            type="button"
                            onClick={() => {
                              const invPct = Math.max(0, 100 - preset.lep);
                              const newInvasive = gross > 0 ? Math.max(0, Math.round(gross * (invPct / 100) * 100) / 100).toString() : parsedData.pathologyInvasiveSize;
                              setParsedData({ ...parsedData, pathologyLepidicPercent: preset.lep, pathologyInvasiveSize: newInvasive });
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              safeLepidic === preset.lep
                                ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                                : "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      {/* Dynamic Formula Display Box */}
                      <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 text-xs text-purple-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-purple-600 shrink-0" />
                          <span>
                            <strong>自动公式折算</strong>：浸润成分占比 = 100% - {safeLepidic}% = <strong>{invasivePercent}%</strong>
                            {gross > 0 && (
                              <span> · 浸润径 = {gross}cm × {invasivePercent}% = <strong className="text-purple-700 text-sm">{derivedInvasive} cm</strong></span>
                            )}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200 shrink-0">
                          已自动作为 pT 判定尺寸 ({derivedInvasive} cm)
                        </span>
                      </div>
                    </div>
                  );
                }

                if (currentMode === "unspecified") {
                  return (
                    <div className="space-y-3.5 pt-1">
                      {/* Clinical explanation for radio-pathological correlation */}
                      <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-bold text-slate-900">
                              放射-病理学对照共识 (Radio-Pathological Correlation)：
                            </p>
                            <p className="leading-relaxed text-slate-700 text-[11px]">
                              国内部分医院病理报告仅诊断“浸润性腺癌”或“微浸润”，未测量微观浸润成分且未标注贴壁成分百分比。在胸外科权威规范中，混合磨玻璃结节的<strong>薄层 CT 实性成分大小（Solid Component）</strong>与显微镜下的浸润成分具有高度病理对应性，临床常以 CT 实性成分作为浸润大小辅助估算。
                            </p>
                          </div>
                        </div>

                        {/* One-click CT solid size helper button */}
                        {(parsedData.solidSize || parsedData.tumorSize) && (
                          <div className="pt-1 flex items-center gap-2 flex-wrap pl-6">
                            <button
                              type="button"
                              onClick={() => {
                                const solid = parsedData.solidSize !== undefined && parsedData.solidSize !== null ? String(parsedData.solidSize) : (parsedData.tumorSize ? String(parsedData.tumorSize) : "0.8");
                                setParsedData({
                                  ...parsedData,
                                  pathologyInvasiveSize: solid,
                                  pathologyReportMode: "unspecified"
                                });
                              }}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer transition-colors flex items-center gap-1.5"
                            >
                              <Search className="w-3.5 h-3.5 shrink-0" />
                              <span>参照术前 CT 实性成分 ({parsedData.solidSize || parsedData.tumorSize} cm) 一键作为浸润径估算</span>
                            </button>
                            <span className="text-[11px] text-amber-800 font-medium">
                              (术前CT: 全径 {parsedData.tumorSize ? `${parsedData.tumorSize}cm` : "未录入"} · 实性 {parsedData.solidSize ? `${parsedData.solidSize}cm` : "未录入"})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Gross & Invasive Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                            <span>标本大体肿瘤全径 (cm)</span>
                            <span className="text-[11px] text-slate-400">肉眼切面最大径</span>
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={parsedData.pathologyTumorSize !== undefined && parsedData.pathologyTumorSize !== null ? parsedData.pathologyTumorSize : ""}
                            onChange={e => setParsedData({ ...parsedData, pathologyTumorSize: e.target.value })}
                            placeholder="如 1.5 (厘米)"
                            className="w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-purple-950 mb-1 flex items-center justify-between">
                            <span className="font-bold">估算镜下浸润成分大小 (cm)</span>
                            <span className="text-[11px] text-purple-600 font-bold">决定 pT 分期</span>
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={parsedData.pathologyInvasiveSize !== undefined && parsedData.pathologyInvasiveSize !== null ? parsedData.pathologyInvasiveSize : ""}
                            onChange={e => setParsedData({ ...parsedData, pathologyInvasiveSize: e.target.value })}
                            placeholder="如 0.8 (参照CT实性成分)"
                            className="w-full h-10 px-3 py-2 bg-slate-50 border border-purple-300 rounded-xl text-xs sm:text-sm font-bold text-purple-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                // Default: Explicit mode
                return (
                  <div className="space-y-3.5 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                          <span>标本大体肿瘤全径 (cm)</span>
                          <span className="text-[11px] text-slate-400">肉眼切面最大径</span>
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={parsedData.pathologyTumorSize !== undefined && parsedData.pathologyTumorSize !== null ? parsedData.pathologyTumorSize : ""}
                          onChange={e => setParsedData({ ...parsedData, pathologyTumorSize: e.target.value })}
                          placeholder="如 1.4 (厘米)"
                          className="w-full h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-950 mb-1 flex items-center justify-between">
                          <span className="font-bold">镜下微观浸润成分大小 (cm)</span>
                          <span className="text-[11px] text-purple-600 font-bold">决定 pT 分期</span>
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={parsedData.pathologyInvasiveSize !== undefined && parsedData.pathologyInvasiveSize !== null ? parsedData.pathologyInvasiveSize : ""}
                          onChange={e => setParsedData({ ...parsedData, pathologyInvasiveSize: e.target.value })}
                          placeholder="纯原位填0，如 0.6"
                          className="w-full h-10 px-3 py-2 bg-slate-50 border border-purple-300 rounded-xl text-xs sm:text-sm font-bold text-purple-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all font-mono"
                        />
                      </div>
                    </div>

                    {/* Quick Presets for Invasive Size */}
                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      <span className="text-[11px] text-slate-500 font-medium">快速预设:</span>
                      <button
                        type="button"
                        onClick={() => setParsedData({ ...parsedData, pathologyInvasiveSize: "0" })}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 cursor-pointer transition-colors"
                      >
                        纯原位 (浸润=0cm)
                      </button>
                      <button
                        type="button"
                        onClick={() => setParsedData({ ...parsedData, pathologyInvasiveSize: "0.5" })}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 cursor-pointer transition-colors"
                      >
                        微浸润 (浸润≤0.5cm)
                      </button>
                      {parsedData.pathologyTumorSize && (
                        <button
                          type="button"
                          onClick={() => setParsedData({ ...parsedData, pathologyInvasiveSize: parsedData.pathologyTumorSize })}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 cursor-pointer transition-colors"
                        >
                          同标本全径 ({parsedData.pathologyTumorSize}cm · 纯实性)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Clinical Evidence Note & CT Cross-Check */}
              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-950 space-y-1">
                <div className="flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>IASLC / AJCC 第 9 版病理金标准说明</strong>：伴贴壁伏壁生长 (Lepidic) 的肺腺癌，病理分期 (pT) 严格依据<strong>【显微镜下微观浸润成分最大径】</strong>判定（如浸润径 ≤0.5cm 为 pT1mi 微浸润腺癌，≤1.0cm 为 pT1a）；标本大体全径反映肉眼肿物轮廓。
                  </p>
                </div>
                {(parsedData.tumorSize || parsedData.solidSize) && (
                  <div className="text-[11px] text-purple-800 pt-0.5 font-medium pl-5 flex items-center gap-1.5">
                    <Search className="w-3 h-3 text-purple-600 shrink-0" />
                    <span>术前薄层 CT 对照参考：影像结节总全径 <strong>{parsedData.tumorSize ? `${parsedData.tumorSize} cm` : '未测'}</strong> · CT实性浸润 <strong>{parsedData.solidSize ? `${parsedData.solidSize} cm` : '未测'}</strong></span>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Section 3: Pathology High-Risk Red/Green Factors & Ki-67 */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      术后高危病理特征 (红绿灯指标)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      决定辅助治疗、复发风险分层与随访密度
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-normal text-slate-400">病理切片镜下评估</span>
              </div>
              
              {/* Symmetrical 3-Column Grid: 6 Core Pathology Indicators (2 rows x 3 cols = exactly 6) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                
                {/* 1. Margin Status */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800">切缘状态 (Margin)</div>
                    <div className="text-[10px] text-slate-400">手术残留排查</div>
                  </div>
                  <div className="flex gap-1 h-[34px]">
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, marginStatus: "negative", margin: "negative" })}
                      className={`flex-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        parsedData.marginStatus === "negative" || parsedData.margin === "negative"
                          ? "bg-emerald-500 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      阴性(R0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, marginStatus: "positive", margin: "positive" })}
                      className={`flex-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        parsedData.marginStatus === "positive" || parsedData.margin === "positive"
                          ? "bg-rose-500 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      阳性(残留)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, marginStatus: null, margin: null })}
                      className={`flex-1 text-[10px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        !parsedData.marginStatus && !parsedData.margin
                          ? "bg-slate-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      未提及
                    </button>
                  </div>
                </div>

                {/* 2. Lymph Node N-Stage */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between min-h-[96px] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800">淋巴结分期 (N)</div>
                    <div className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold border border-teal-200">
                      {isLung ? "第9版标准" : "区域淋巴结"}
                    </div>
                  </div>
                  <div className="flex gap-1 h-[34px]">
                    {(isLung ? [
                      { val: "N0", label: "N0(无)" },
                      { val: "N1", label: "N1(肺门)" },
                      { val: "N2a", label: "N2a(单站)" },
                      { val: "N2b", label: "N2b(多站)" },
                      { val: "Nx", label: "Nx(未查)" },
                    ] : [
                      { val: "N0", label: "N0(无转移)" },
                      { val: "N1", label: "N1(区域)" },
                      { val: "N2", label: "N2(多枚/组)" },
                      { val: "N3", label: "N3(广泛/远处)" },
                      { val: "Nx", label: "Nx(未查)" },
                    ]).map((opt) => {
                      const currentN = parsedData.nStage || "N0";
                      const isSelected = currentN === opt.val || (opt.val === "N2a" && currentN === "N2");
                      return (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setParsedData({ ...parsedData, nStage: opt.val, lymphNodes: opt.val })}
                          className={`flex-1 text-[10px] sm:text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center px-0.5 ${
                            isSelected
                              ? opt.val === "N0"
                                ? "bg-emerald-500 text-white shadow-2xs"
                                : opt.val === "N1"
                                ? "bg-amber-500 text-white shadow-2xs"
                                : opt.val === "N2a" || opt.val === "N2"
                                ? "bg-blue-600 text-white shadow-2xs"
                                : opt.val === "Nx"
                                ? "bg-slate-700 text-white shadow-2xs"
                                : "bg-rose-500 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. VPI / PNI */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800">
                      {isLung ? "胸膜侵犯 (VPI)" : "神经浸润 (PNI)"}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isLung ? "脏层胸膜 PL1/2" : "神经束周围侵犯"}
                    </div>
                  </div>
                  <div className="flex gap-1 h-[34px]">
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, vpi: "negative", pni: "negative" })}
                      className={`flex-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        parsedData.vpi === "negative" || parsedData.pni === "negative" ? "bg-emerald-500 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      阴性(无)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, vpi: "positive", pni: "positive" })}
                      className={`flex-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        parsedData.vpi === "positive" || parsedData.pni === "positive" ? "bg-rose-500 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      阳性(有)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, vpi: null, pni: null })}
                      className={`flex-1 text-[10px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        !parsedData.vpi && !parsedData.pni ? "bg-slate-700 text-white shadow-2xs" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      未提及
                    </button>
                  </div>
                </div>

                {/* 4. STAS / Local Infiltration */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800">
                      {isLung ? "气道播散 (STAS)" : "局部外侵/浆膜侵犯"}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isLung ? "气腔微小巢漂移" : "器官外膜或包膜"}
                    </div>
                  </div>
                  <div className="flex gap-1 h-[34px]">
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, stas: "negative", ...(isLung ? { adjacentLobeInvasion: false } : {}) })}
                      className={`flex-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        parsedData.stas === "negative" ? "bg-emerald-500 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      阴性(未见)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, stas: "positive", ...(isLung ? { adjacentLobeInvasion: true } : {}) })}
                      className={`flex-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        parsedData.stas === "positive" ? "bg-rose-500 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      阳性(见外侵)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, stas: null, ...(isLung ? { adjacentLobeInvasion: false } : {}) })}
                      className={`flex-1 text-[10px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        !parsedData.stas ? "bg-slate-700 text-white shadow-2xs" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      未提及
                    </button>
                  </div>
                </div>

                {/* 5. LVI */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800">脉管癌栓 (LVI)</div>
                    <div className="text-[10px] text-slate-400">微血管/淋巴管</div>
                  </div>
                  <div className="flex gap-1 h-[34px]">
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, lvi: "negative" })}
                      className={`flex-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        parsedData.lvi === "negative" ? "bg-emerald-500 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      阴性(无栓)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, lvi: "positive" })}
                      className={`flex-1 text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        parsedData.lvi === "positive" ? "bg-rose-500 text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      阳性(有栓)
                    </button>
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, lvi: null })}
                      className={`flex-1 text-[10px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        !parsedData.lvi ? "bg-slate-700 text-white shadow-2xs" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      未提及
                    </button>
                  </div>
                </div>

                {/* 6. Histological Grade */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-800">
                      {isBreast ? "Nottingham 分级" : isLung ? "IASLC 病理分级" : "病理分化程度"}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isBreast ? "组织学分级" : isLung ? "高级别成分占比" : "G1/G2/G3"}
                    </div>
                  </div>
                  <div className="flex gap-1 h-[34px]">
                    {[
                      { val: "1", label: "G1(高分化)" },
                      { val: "2", label: "G2(中分化)" },
                      { val: "3", label: "G3(低分化)" },
                      { val: "", label: "未定" }
                    ].map(({ val, label }) => {
                      const currentGrade = String(parsedData.iaslcGrade || parsedData.grade || "");
                      const isSelected = val === "" ? !currentGrade : currentGrade === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setParsedData({ ...parsedData, grade: val || null, iaslcGrade: val || null })}
                          className={`flex-1 text-[10px] sm:text-[11px] rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? val === "1"
                                ? "bg-emerald-500 text-white shadow-2xs"
                                : val === "2"
                                ? "bg-blue-500 text-white shadow-2xs"
                                : val === "3"
                                ? "bg-rose-500 text-white shadow-2xs"
                                : "bg-slate-700 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Dedicated Full-Width Card: Ki-67 Proliferation Index (%) [Optional IHC Banner] */}
              <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-purple-600" />
                      <span>Ki-67 细胞增殖指数</span>
                    </span>
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 font-bold">
                      免疫组化 IHC 选填
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    反映细胞分裂增殖转速。若病理报告未包含免疫组化可留空，绝非复发转移概率
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:max-w-xs w-full">
                  <div className="relative flex-1 min-w-0">
                    <input 
                      type="text" 
                      inputMode="decimal"
                      value={parsedData.ki67 !== undefined && parsedData.ki67 !== null ? String(parsedData.ki67).replace(/%/g, "") : ""}
                      onChange={e => setParsedData({ ...parsedData, ki67: e.target.value })}
                      placeholder="如 5 或 15"
                      className="w-full h-10 px-3 py-2 pr-7 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-purple-400 font-mono"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold pointer-events-none">%</span>
                  </div>

                  {/* Preset Buttons: Grid on mobile so Chinese characters never wrap, inline flex on desktop */}
                  <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-1 shrink-0">
                    {[
                      { val: "5", label: "≤5% 惰性" },
                      { val: "15", label: "15% 常规" },
                      { val: "30", label: ">30% 活跃" }
                    ].map(preset => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setParsedData({ ...parsedData, ki67: preset.val })}
                        className={`h-9 sm:h-10 px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center whitespace-nowrap ${
                          String(parsedData.ki67).replace(/%/g, "") === preset.val
                            ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* IASLC 9th Special Invasive Factor: Adjacent Lobe Invasion (跨叶直接侵犯, Lung only) */}
              {isLung && (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">跨叶直接侵犯 (Adjacent Lobe Invasion)</span>
                      <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold border border-teal-200">
                        第9版明确归入 T2a
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      原发肿瘤经叶间裂直接跨叶浸润至相邻肺叶（非独立副结节），依据 IASLC 第9版金标准，T 分期自动定为 T2a。
                    </p>
                  </div>
                  <div className="flex gap-1.5 h-[34px] sm:w-48 shrink-0">
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, adjacentLobeInvasion: false })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        !parsedData.adjacentLobeInvasion ? "bg-emerald-500 text-white shadow-2xs" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      无跨叶侵犯
                    </button>
                    <button
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, adjacentLobeInvasion: true })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        parsedData.adjacentLobeInvasion ? "bg-amber-500 text-white shadow-2xs" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      见跨叶侵犯
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Section: Cancer-Specific Specialized Pathology Parameters Form (for 11 non-lung cancers) */}
            {!isLung && (
              <CancerSpecificPathologyForm
                cancerType={currentCancer}
                data={parsedData}
                onChange={(updates) => setParsedData((prev: any) => ({ ...prev, ...updates }))}
              />
            )}
          </div>
        )}

        {/* Step 3: Molecular Pathology & Driver Genes */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Section: Molecular Pathology & Driver Gene Mutation Panel (NGS / PCR / PD-L1) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
                    <Dna className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {isBreast ? "免疫组化分子分型与基因变异 (IHC / FISH / NGS)" :
                       isColorectal ? "结直肠癌分子标志物与错配修复 (RAS / BRAF / MSI)" :
                       isGastric ? "胃癌分子标志物与靶向靶点 (HER2 / CLDN18.2 / MSI)" :
                       isLiver ? "肝癌血清标志物与体细胞突变谱 (AFP / Wnt / TP53)" :
                       isThyroid ? "甲状腺癌分子标志物与基因突变 (BRAF / TERT / RET)" :
                       isEndometrial ? "子宫内膜癌分子分型四分法 (POLE / MMR / p53)" :
                       isCervical ? "宫颈癌生物学特征与免疫靶点 (HPV / PD-L1 / TMB)" :
                       isPancreatic ? "胰腺癌分子靶点与基因图谱 (KRAS / BRCA / MSI)" :
                       isEsophageal ? "食管癌免疫组化与分子指标 (PD-L1 / HER2 / TP53)" :
                       "分子病理与驱动基因突变谱 (NGS / PCR / 免疫组化)"}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isBreast ? "录入 ER、PR、HER2、Ki-67 与 BRCA1/2，指导靶向、内分泌与化疗决策" :
                       isColorectal ? "录入 KRAS、NRAS、BRAF、MSI/MMR，指导抗EGFR靶向与免疫获益分流" :
                       isGastric ? "录入 HER2、Claudin 18.2、PD-L1 (CPS) 与 MSI，指导靶向与免疫联合方案" :
                       isLiver ? "录入 AFP 基线、HBV 病毒载量与突变谱，指导抗病毒、靶靶联合与免疫治疗" :
                       isThyroid ? "录入 BRAF V600E、TERT 启动子、RET 融合，评估高危复发与靶向治疗" :
                       isEndometrial ? "录入 POLE、dMMR、p53、ER/PR 四分法，指导精准降阶梯或强化辅助治疗" :
                       isCervical ? "录入高危型 HPV、PD-L1 (CPS)、TMB，指导免疫联合系统治疗" :
                       isPancreatic ? "录入 KRAS 亚型、BRCA1/2 突变、MSI 状态，指导含铂维持与靶向探索" :
                       isEsophageal ? "录入 PD-L1 (CPS/TAP)、HER2，指导一线免疫与抗HER2联合用药" :
                       "录入驱动突变 (EGFR/ALK等)、高危伴随共突变 (TP53等) 与 PD-L1，指导靶向用药与复发监测"}
                    </p>
                  </div>
                </div>

                {/* Status Switch Pills: Default to not_tested */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { val: "not_tested", label: "未做基因检测 (常态/未送检)", color: "bg-slate-700 text-white" },
                    { val: "tested", label: "已检出突变", color: "bg-blue-600 text-white" },
                    { val: "negative", label: "全野生型(经检测全阴)", color: "bg-emerald-600 text-white" },
                    { val: "in_progress", label: "送检中", color: "bg-amber-600 text-white" }
                  ].map(s => {
                    const currentStatus = parsedData.molecularTestStatus || (
                      Array.isArray(parsedData.geneMutations) && parsedData.geneMutations.length > 0 ? "tested" : "not_tested"
                    );
                    const isSelected = currentStatus === s.val;
                    return (
                      <button
                        key={s.val}
                        type="button"
                        onClick={() => {
                          if (s.val === "negative" || s.val === "not_tested") {
                            setParsedData({ ...parsedData, molecularTestStatus: s.val, geneMutations: [] });
                          } else {
                            setParsedData({ ...parsedData, molecularTestStatus: s.val });
                          }
                        }}
                        className={`h-9 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          isSelected ? `${s.color} shadow-xs` : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

            {/* If Not Tested or Negative, Show Reassuring Guidelines info */}
            {(parsedData.molecularTestStatus === "not_tested" || parsedData.molecularTestStatus === "negative") && (
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    {parsedData.molecularTestStatus === "negative" ? "全基因野生型（全阴性）临床指引：" : "未做基因检测临床指引："}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {isLung ? (
                    stagingPreview?.stage?.startsWith("IA") || parsedData?.stage?.startsWith("IA") ? (
                      <span>对于 <strong>IA 期早期肺癌</strong>，指南（CSCO/NCCN）明文确立：彻底手术切除已实现近 100% 根治，常规不强制推荐昂贵的驱动基因大 Panel 检测，无需焦虑。</span>
                    ) : (
                      <span>对于 <strong>IB 期以上或具备高危病理因素</strong> 的肺癌患者，若后续考虑辅助靶向（如奥希替尼）治疗，可向主治医生咨询是否送检组织标本或外周血 ctDNA 基因检测。</span>
                    )
                  ) : (
                    stagingPreview?.stage?.startsWith("I") || parsedData?.stage?.startsWith("I") ? (
                      <span>对于 <strong>早期【{CancerRegistry.get(currentCancer)?.name || '原发'}】</strong>，规范根治性手术后复发风险低，若无高危病理指征通常无需过度焦虑大 Panel 盲测。</span>
                    ) : (
                      <span>对于具备中高危因素或进展期【{CancerRegistry.get(currentCancer)?.name || '原发'}】患者，建议根据多学科 MDT 意见，遵医嘱按需完善对应分型的分子病理或免疫组化指标。</span>
                    )
                  )}
                </p>
              </div>
            )}

            {/* Active Driver Mutations Selection Panel */}
            {parsedData.molecularTestStatus !== "not_tested" && parsedData.molecularTestStatus !== "negative" && (
              <div className="space-y-3.5">
                
                {/* 1. Main Driver Genes */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>
                      {isBreast ? "乳腺癌核心受体与驱动分子指标（点击选择已确诊状态）：" :
                       isColorectal ? "结直肠癌核心基因与错配修复指标（点击选择）：" :
                       isGastric ? "胃癌核心分子标志物与靶点（点击选择）：" :
                       isLiver ? "肝癌核心血清学与分子特征（点击选择）：" :
                       isThyroid ? "甲状腺癌核心基因突变（点击选择）：" :
                       isEndometrial ? "子宫内膜癌四分法分子指标（点击选择）：" :
                       isCervical ? "宫颈癌病原体与免疫标志物（点击选择）：" :
                       isPancreatic ? "胰腺癌核心驱动与易感基因（点击选择）：" :
                       isEsophageal ? "食管癌免疫与分子标志物（点击选择）：" :
                       "经典驱动基因突变（点击选择已检出的基因）："}
                    </span>
                    <span className="text-slate-400 font-normal">支持多选</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {((CANCER_DRIVER_GENES_MAP[currentCancer] || (isColorectal ? CANCER_DRIVER_GENES_MAP.colorectal : PRESET_DRIVER_GENES))).map(item => {
                      const currentMut = (parsedData.geneMutations || []).find((m: any) => 
                        m.gene === item.gene && 
                        m.status !== "negative" && 
                        !String(m.subtype || "").includes("阴性") && 
                        !String(m.subtype || "").includes("野生")
                      );
                      const isSelected = !!currentMut;
                      return (
                        <div key={item.gene} className={`p-2.5 rounded-xl border transition-all ${
                          isSelected ? "bg-white border-blue-400 shadow-xs ring-1 ring-blue-400/30" : "bg-white/80 border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <button
                              type="button"
                              onClick={() => handleToggleGene(item.gene, item.subtypes[0]?.name || "阳性", false)}
                              className="flex items-center gap-1.5 font-bold text-xs text-left cursor-pointer flex-1"
                            >
                              <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${
                                isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-slate-50"
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className={isSelected ? "text-blue-900 font-extrabold" : "text-slate-700"}>
                                {item.gene}
                              </span>
                            </button>
                            <span className="text-[9px] text-slate-400 font-medium">{item.badge}</span>
                          </div>

                          {/* If Selected, Show Subtype Selector and Abundance */}
                          {isSelected && (
                            <div className="space-y-1.5 pt-1 border-t border-slate-100">
                              <select
                                value={currentMut.subtype || item.subtypes[0]?.name}
                                onChange={e => handleUpdateGeneSubtype(item.gene, e.target.value)}
                                className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-800 outline-none"
                              >
                                {item.subtypes.map(sub => (
                                  <option key={sub.key} value={sub.name}>{sub.name}</option>
                                ))}
                              </select>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-400 shrink-0">丰度:</span>
                                <input
                                  type="text"
                                  placeholder="如 24.5%"
                                  value={currentMut.abundance || ""}
                                  onChange={e => handleUpdateGeneAbundance(item.gene, e.target.value)}
                                  className="w-full h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-800 outline-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. High-Risk Co-mutations Panel (Lung Cancer) */}
                {isLung && (
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>高危预后伴随突变（Co-mutations · 影响复发风险与耐药速度）：</span>
                    </span>
                    <span className="text-[10px] font-normal text-amber-700">可与 EGFR 等共存</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PRESET_CO_MUTATIONS.map(item => {
                      const currentMut = (parsedData.geneMutations || []).find((m: any) => 
                        m.gene === item.gene && 
                        m.status !== "negative" && 
                        !String(m.subtype || "").includes("阴性") && 
                        !String(m.subtype || "").includes("野生")
                      );
                      const isSelected = !!currentMut;
                      return (
                        <div key={item.gene} className={`p-2 rounded-xl border transition-all ${
                          isSelected ? "bg-white border-amber-400 shadow-2xs" : "bg-white/90 border-amber-200/60"
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <button
                              type="button"
                              onClick={() => handleToggleGene(item.gene, item.subtypes[0]?.name || "阳性", true)}
                              className="flex items-center gap-1.5 font-bold text-xs text-left cursor-pointer flex-1"
                            >
                              <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${
                                isSelected ? "bg-amber-600 border-amber-600 text-white" : "border-slate-300 bg-slate-50"
                              }`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className={isSelected ? "text-amber-950 font-extrabold" : "text-slate-700"}>
                                {item.gene} 伴随突变
                              </span>
                            </button>
                          </div>
                          <p className="text-[9px] text-amber-700 leading-tight mb-1">{item.riskDesc}</p>
                          {isSelected && (
                            <select
                              value={currentMut.subtype || item.subtypes[0]?.name}
                              onChange={e => handleUpdateGeneSubtype(item.gene, e.target.value)}
                              className="w-full h-8 px-2 bg-amber-50/50 border border-amber-200 rounded-lg text-[10px] font-semibold text-amber-900 outline-none"
                            >
                              {item.subtypes.map(sub => (
                                <option key={sub.key} value={sub.name}>{sub.name}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

                {/* 3. PD-L1 & Custom Mutation Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* PD-L1 Expression */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{isLung ? "PD-L1 蛋白表达 (TPS)" : (isGastric || isCervical || isEsophageal) ? "PD-L1 表达 (CPS)" : "PD-L1 免疫检查点表达"}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{isLung ? "TPS 比例" : (isGastric || isCervical || isEsophageal) ? "CPS 评分" : "免疫治疗评估"}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { val: "<1%", label: "<1% (阴性)" },
                        { val: "1-49%", label: "1%~49% (低)" },
                        { val: ">=50%", label: "≥50% (高)" },
                        { val: "unknown", label: "未检测" }
                      ].map(opt => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setParsedData({ ...parsedData, pdl1Tps: opt.val })}
                          className={`h-9 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
                            (parsedData.pdl1Tps || "unknown") === opt.val
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Custom Gene Mutation */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>+ 添加其他罕见突变/融合</span>
                      <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customIsComutation}
                          onChange={e => setCustomIsComutation(e.target.checked)}
                          className="rounded text-amber-600"
                        />
                        <span>设为伴随突变</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="基因 (如: NRG1)"
                        value={customGeneName}
                        onChange={e => setCustomGeneName(e.target.value)}
                        className="w-1/3 h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:bg-white focus:border-blue-400"
                      />
                      <input
                        type="text"
                        placeholder="位点/丰度 (如: 融合)"
                        value={customGeneSubtype}
                        onChange={e => setCustomGeneSubtype(e.target.value)}
                        className="flex-1 h-10 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:bg-white focus:border-blue-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomGene}
                        className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                      >
                        添加
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Smart Clinical Cross-Check Alert Banner */}
                {(() => {
                  const mutations = parsedData.geneMutations || [];
                  const isStageIA = stagingPreview?.stage?.startsWith("IA") || parsedData?.stage?.startsWith("IA");
                  const hasTargetable = mutations.some((m: any) => ["EGFR", "ALK", "ROS1", "RET", "MET", "BRAF"].includes(m.gene));
                  const hasTp53 = mutations.some((m: any) => m.gene === "TP53");

                  if (isLung && isStageIA && hasTargetable) {
                    return (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">早期 IA 期治愈定心丸（指南 1 类强烈推荐）：</div>
                          <div className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                            已检出敏感驱动突变，但您的病灶处于 <strong>IA 期早期</strong>。国际权威指南明确确立：IA 期经 R0 根治切除后治愈率极高（90%~100%），<strong>严禁盲目服用靶向药辅助治疗</strong>（避免过度医疗与耐药），仅需遵医嘱定期复查即可。
                          </div>
                        </div>
                      </div>
                    );
                  } else if (isLung && !isStageIA && hasTargetable) {
                    return (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                        <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">精准靶向辅助治疗获益指征确立：</div>
                          <div className="text-[11px] text-blue-800 leading-relaxed mt-0.5">
                            已检出敏感靶点，符合 <strong>ADAURA (奥希替尼) / ALINA (阿来替尼)</strong> 术后辅助治疗获益人群，III 期临床证实可降低 70%~83% 复发风险，且相关药物已纳入国家医保门特报销。
                          </div>
                        </div>
                      </div>
                    );
                  } else if (isLung && hasTp53) {
                    return (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">高危伴随突变随访提示：</div>
                          <div className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                            检出 TP53 伴随共突变，文献提示可能存在轻度增殖活性。建议术后前 2 年严格执行每 3~6 个月薄层胸部 CT 规律随访。
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Serology Biomarkers & Systemic Staging */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Section 4: Systemic Staging & M0 Confirmation Matrix (Strict 3-Column Symmetrical Grid: 5 Organs + 1 Benign Findings) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      全身转移排查与 M0 早期根治窗口确认矩阵
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      排查中枢神经、肝脏、肾上腺与骨质，确立无远处转移 (M0) 黄金手术窗口
                    </p>
                  </div>
                </div>

                {isSystemicM0 && (
                  <span className="px-3 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-full shadow-2xs flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-white" />
                    <span>全身排查阴性 · 确立 M0 根治窗口</span>
                  </span>
                )}
              </div>

            {/* Symmetrical 3-Column Grid (2 rows x 3 cols = exactly 6 cards): No wrapping, No truncation! */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              
              {/* 1. Brain MRI */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isBreast ? "脑部增强 MRI" : isColorectal ? "肝脏增强 MRI/CT" : isGastric ? "腹盆增强 CT/MRI" : isThyroid ? "颈部淋巴结超声" : isPancreatic ? "上腹部增强 MRI" : isLiver ? "胸部薄层 CT" : "脑部增强 MRI"}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">{isBreast ? "排除中枢转移" : isColorectal ? "排除肝转移" : isGastric ? "排除腹膜种植" : isThyroid ? "排查侧颈转移" : isPancreatic ? "排查肝转移" : isLiver ? "排查肺转移" : "排除中枢脑转移"}</span>
                </div>
                <div className="flex gap-1.5 h-[34px]">
                  {[
                    { val: "negative", label: "未见异常(M0)" },
                    { val: "positive", label: "提示可疑" },
                    { val: "not_performed", label: "未检查" }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, brainMri: opt.val })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        (parsedData.brainMri || "not_performed") === opt.val
                          ? opt.val === "negative"
                            ? "bg-emerald-500 text-white shadow-2xs"
                            : opt.val === "positive"
                            ? "bg-rose-500 text-white shadow-2xs"
                            : "bg-slate-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Abdominal Ultrasound / CT */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isBreast ? "腹部与肝脏超声" : isColorectal ? "胸部薄层 CT" : isGastric ? "肝脏与腹部超声" : isLiver ? "腹腔/腹膜排查" : isThyroid ? "胸部 CT 肺排查" : isLung ? "腹部与肾上腺超声" : "腹盆腔脏器超声/CT"}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">{isBreast ? "排除肝脏转移" : isColorectal ? "排除肺转移" : isGastric ? "排除肝转移" : isLiver ? "排查腹腔淋巴结" : isThyroid ? "排除肺转移" : "排除肝/肾上腺"}</span>
                </div>
                <div className="flex gap-1.5 h-[34px]">
                  {[
                    { val: "negative", label: "未见异常(M0)" },
                    { val: "positive", label: "提示可疑" },
                    { val: "not_performed", label: "未检查" }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, abdominalUltrasound: opt.val })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        (parsedData.abdominalUltrasound === "negative" || parsedData.abdominalUltrasound === "benign_findings" ? "negative" : (parsedData.abdominalUltrasound || "not_performed")) === opt.val
                          ? opt.val === "negative"
                            ? "bg-emerald-500 text-white shadow-2xs"
                            : opt.val === "positive"
                            ? "bg-rose-500 text-white shadow-2xs"
                            : "bg-slate-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Bone Scan ECT */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-slate-600" />
                    <span>全身骨显像 ECT</span>
                  </span>
                  <span className="text-[11px] text-slate-400">排除骨代谢破坏</span>
                </div>
                <div className="flex gap-1.5 h-[34px]">
                  {[
                    { val: "negative", label: "未见异常(M0)" },
                    { val: "positive", label: "提示可疑" },
                    { val: "not_performed", label: "未检查" }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, boneScan: opt.val })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        (parsedData.boneScan || "not_performed") === opt.val
                          ? opt.val === "negative"
                            ? "bg-emerald-500 text-white shadow-2xs"
                            : opt.val === "positive"
                            ? "bg-rose-500 text-white shadow-2xs"
                            : "bg-slate-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Neck / Supraclavicular Lymph Nodes */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isBreast ? "盆腔超声 (内膜)" : isColorectal ? "腹膜与大网膜状态" : isEndometrial ? "盆腔增强 MRI" : isCervical ? "盆腔增强 MRI" : isThyroid ? "甲状腺残余/对侧" : isLung ? "锁骨上淋巴结B超" : "远处区域淋巴结"}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">{isBreast ? "排查内膜基线" : isColorectal ? "排除腹膜种植" : isEndometrial ? "明确局部浸润" : isCervical ? "明确宫旁浸润" : isThyroid ? "评估术区与对侧" : "排除远处淋巴"}</span>
                </div>
                <div className="flex gap-1.5 h-[34px]">
                  {[
                    { val: "negative", label: "未见肿大(N0)" },
                    { val: "positive", label: "提示肿大" },
                    { val: "not_performed", label: "未检查" }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, neckLymphNodes: opt.val })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        (parsedData.neckLymphNodes || "not_performed") === opt.val
                          ? opt.val === "negative"
                            ? "bg-emerald-500 text-white shadow-2xs"
                            : opt.val === "positive"
                            ? "bg-rose-500 text-white shadow-2xs"
                            : "bg-slate-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Whole Body PET-CT */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Scan className="w-3.5 h-3.5 text-slate-600" />
                    <span>全身 PET-CT</span>
                  </span>
                  <span className="text-[11px] text-slate-400">全身代谢一站式</span>
                </div>
                <div className="flex gap-1.5 h-[34px]">
                  {[
                    { val: "negative", label: "无浓聚(M0)" },
                    { val: "positive", label: "见高代谢" },
                    { val: "not_performed", label: "未检查" }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setParsedData({ ...parsedData, petCt: opt.val })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                        (parsedData.petCt || "not_performed") === opt.val
                          ? opt.val === "negative"
                            ? "bg-emerald-500 text-white shadow-2xs"
                            : opt.val === "positive"
                            ? "bg-rose-500 text-white shadow-2xs"
                            : "bg-slate-700 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Benign Findings Management Card (Symmetrically Completes the 3x2 Grid!) */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between h-[96px] shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>伴发良性发现</span>
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold">非肿瘤转移</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 flex gap-1 overflow-x-auto py-0.5 no-scrollbar">
                    {(Array.isArray(parsedData.benignFindings) ? parsedData.benignFindings : []).map((item: string) => (
                      <span key={item} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-medium shrink-0">
                        <span>{item}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveBenignFinding(item)}
                          className="text-emerald-400 hover:text-emerald-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {(!parsedData.benignFindings || parsedData.benignFindings.length === 0) && (
                      <span className="text-[10px] text-slate-400 py-1">未检出/无伴发良性发现</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <input 
                      type="text" 
                      value={newBenignInput}
                      onChange={e => setNewBenignInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddBenignFinding()}
                      placeholder="如：息肉"
                      className="w-16 h-8 px-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] outline-none focus:bg-white focus:border-blue-400"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddBenignFinding}
                      className="h-8 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* IASLC 9th M-Stage Refinement Card when Distant Suspicion Detected */}
            {(parsedData.brainMri === 'positive' || parsedData.abdominalUltrasound === 'positive' || parsedData.boneScan === 'positive' || parsedData.petCt === 'positive' || (parsedData.mStage && parsedData.mStage !== 'M0')) && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 shadow-xs space-y-2.5 animate-fade-in mt-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-xs font-bold text-amber-950">IASLC 第 9 版远处转移精细分层 (M1a / M1b / M1c1 / M1c2)</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-white/90 px-2 py-0.5 rounded border border-amber-300">
                    IVA期 (寡转移局部根治机会) vs IVB期 (多系统综合治疗)
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  系统排查中标记了可疑提示。依据第9版国际金标准，远处转移已精确细分：单一胸外孤立转移 (M1b) 与对侧肺/胸膜播散 (M1a) 仍属于 <strong>IVA 期</strong>（具有积极局部根治切除或 SBRT 机会）；多发病灶则归为 <strong>IVB 期</strong>。
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { val: "M1a", label: "M1a (对侧肺/胸膜播散)", sub: "Stage IVA 期" },
                    { val: "M1b", label: "M1b (单器官孤立寡转移)", sub: "Stage IVA 期" },
                    { val: "M1c1", label: "M1c1 (单系统多发转移)", sub: "Stage IVB 期" },
                    { val: "M1c2", label: "M1c2 (多系统广泛转移)", sub: "Stage IVB 期" },
                  ].map(m => {
                    const isSelected = parsedData.mStage === m.val;
                    return (
                      <button
                        key={m.val}
                        type="button"
                        onClick={() => setParsedData({ ...parsedData, mStage: m.val })}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                            : "bg-white text-slate-700 border-amber-200 hover:bg-amber-100/60"
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight">{m.label}</span>
                        <span className={`text-[10px] mt-1 font-semibold ${isSelected ? "text-amber-100" : "text-amber-700"}`}>{m.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          </div>
        )}


              </div>

              {/* Bottom action bar */}
              <div className="border-t border-slate-100 px-4 sm:px-5 py-3 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs text-slate-400 font-medium">步骤 {currentStep} / 4</span>
                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <button type="button"
                      onClick={() => setCurrentStep((prev) => (prev > 1 ? (prev - 1) as 1 | 2 | 3 | 4 : prev))}
                      className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
                      上一步
                    </button>
                  )}
                  {currentStep < 4 ? (
                    <button type="button"
                      onClick={() => setCurrentStep((prev) => (prev < 4 ? (prev + 1) as 1 | 2 | 3 | 4 : prev))}
                      className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold btn-primary text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5">
                      <span>下一步 ({currentStep + 1}/4)</span>
                    </button>
                  ) : (
                    <button type="button" onClick={handleConfirm}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/25 hover:shadow-lg transition-all cursor-pointer flex items-center gap-2">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{initialData ? "保存修改" : "确认保存医疗档案"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-3.5 sm:p-6 md:p-8 border border-slate-200 shadow-sm max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3.5 mb-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl border border-blue-100 flex-shrink-0">
          <FileSearch className="w-6 h-6 text-blue-600" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-slate-900">
              {cancerType && cancerType !== 'lung' 
                ? `【${CancerRegistry.get(cancerType)?.name}】医疗报告多模态结构化解析` 
                : '医疗报告多模态结构化解析'}
            </h2>
            {existingProfile && (
              <span className="text-[10px] sm:text-xs text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full font-bold border border-purple-200">
                增量融合模式 · 不抹除已有记录
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">支持上传或拍摄多源报告，系统仅整理报告中明确出现的字段并检索通用循证资料</p>
          <p className="mt-2 text-[11px] leading-relaxed text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">本平台仅用于健康科普、报告字段整理和循证资料检索，不提供诊断、分期、治疗方案或在线诊疗。</p>
        </div>
      </div>

      {/* Supported Modality Strip (Clean & Compact) */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600 bg-slate-50/80 p-2.5 px-3 rounded-2xl border border-slate-200/80 mb-5">
        <span className="font-bold text-slate-700 text-[11px] mr-0.5">支持类型：</span>
        <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] flex items-center gap-1">
          <Scan className="w-3 h-3 text-sky-600" />
          <span>薄层 CT</span>
        </span>
        <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] flex items-center gap-1">
          <Microscope className="w-3 h-3 text-purple-600" />
          <span>术后病理 / IHC</span>
        </span>
        <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] flex items-center gap-1">
          <Brain className="w-3 h-3 text-indigo-600" />
          <span>脑部增强 MRI</span>
        </span>
        <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] flex items-center gap-1">
          <Stethoscope className="w-3 h-3 text-teal-600" />
          <span>腹部与浅表超声</span>
        </span>
        <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] flex items-center gap-1">
          <Activity className="w-3 h-3 text-amber-600" />
          <span>骨显像 ECT</span>
        </span>
        <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] flex items-center gap-1">
          <Scan className="w-3 h-3 text-blue-600" />
          <span>全身 PET-CT</span>
        </span>
      </div>

      <div className="space-y-4">
        {/* PIPL Privacy Protection & Masking Hint Banner */}
        <div className="p-3.5 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950 leading-relaxed shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-emerald-950 block text-xs">个人数据安全与隐私保护指引 (PIPL Standard)：</strong>
            <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
              系统已启用全自动 PII 身份脱敏过滤。建议您在拍照或上传检查单前，使用手机自带编辑涂抹功能遮挡报告单上方的<strong>真实姓名、住院号与身份证号码</strong>，仅保留影像与病理诊断结论。
            </p>
          </div>
        </div>

        <label className="flex items-start gap-2.5 p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-950 cursor-pointer">
          <input
            type="checkbox"
            checked={privacyConfirmed}
            onChange={(event) => setPrivacyConfirmed(event.target.checked)}
            className="mt-0.5 accent-amber-600"
          />
          <span>我已确认上传图片中不含未脱敏的姓名、身份证号、住院号、条形码或二维码。</span>
        </label>

        {/* Two-Stage Capsule Switch: Photo/Image vs Paste Text */}
        <div className="flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 max-w-sm sm:max-w-md mx-auto mb-2 shadow-2xs">
          <button
            type="button"
            onClick={() => setUploadTab("image")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              uploadTab === "image"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>拍照 / 上传图片</span>
            {images.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px] font-black">
                {images.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setUploadTab("text")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              uploadTab === "text"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>粘贴报告文本</span>
            {reportText.trim().length > 0 && (
              <span className="ml-1 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Tab 1: Multi-Image Upload & Preview Area */}
        {uploadTab === "image" ? (
          <div className="space-y-3">
            {images.length > 0 ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>已添加 {images.length} 张报告图片</span>
                  </span>
                  <button
                    onClick={clearAllImages}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    清空全部
                  </button>
                </div>

                {/* Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-[4/3] shadow-xs">
                      <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-900/75 text-white text-[10px] font-bold backdrop-blur-xs">
                        报告 #{idx + 1}
                      </div>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                        title="移除此图片"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add More Button */}
                  <div className="relative rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center aspect-[4/3] cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/jpg,image/heic,image/heif,image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isParsing}
                    />
                    <span className="text-xl text-blue-600 mb-0.5">+</span>
                    <span className="text-xs font-bold text-slate-600">继续添加图片</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-blue-50/20 transition-all relative cursor-pointer">
                <input 
                  type="file" 
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg,image/heic,image/heif,image/*" 
                  onChange={handleImageUpload} 
                  ref={fileInputRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isParsing}
                />
                <div className="text-center py-3 pointer-events-none flex flex-col items-center">
                  <Camera className="w-8 h-8 text-blue-500 mb-2" />
                  <div className="text-sm font-bold text-slate-700">点击拍照或从相册选择报告（支持一次多选）</div>
                  <div className="text-xs text-slate-400 mt-1">支持同时选择多张不同报告，AI 自动跨模态联合提取</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Textarea */
          <div className="space-y-2">
            <div className="relative">
              <textarea
                rows={6}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="在此粘贴检查报告诊断结论...例如：&#10;胸部薄层 CT 示：右上叶见一混杂磨玻璃结节，大小约 1.8cm × 1.2cm，实性成分约 0.8cm，边缘可见分叶征与毛刺征...&#10;（系统已启用 PIPL 隐私脱敏，姓名与身份证号将自动掩码）"
                className="w-full p-4 border border-slate-300 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono bg-white leading-relaxed"
                disabled={isParsing}
              />
              {reportText.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => setReportText("")}
                  className="absolute top-3 right-3 text-xs text-slate-400 hover:text-rose-600 font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  清空文本
                </button>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>支持薄层 CT、大体病理、IHC 免疫组化或基因检测文本</span>
              <span className="font-mono">{reportText.trim().length} 字</span>
            </div>
          </div>
        )}

        {error && (
          (errorInfo?.isRateLimit || isRateLimitOrQuotaError(error)) ? (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/95 via-sky-50/70 to-indigo-50/50 border border-amber-200/90 rounded-2xl text-slate-800 space-y-3.5 shadow-sm animate-fade-in">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-300/80 flex items-center justify-center text-amber-700 shrink-0">
                    <Clock className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                        <span>{errorInfo?.badge || "多模态解析负载保护 · 算力队列调度中"}</span>
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 mt-1">
                      {errorInfo?.title || "多模态影像病理结构化引擎缓冲中"}
                    </h4>
                  </div>
                </div>

                {parseCountdown > 0 && (
                  <div className="px-2.5 py-1 rounded-xl bg-white/90 border border-amber-200 text-amber-900 font-mono font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>缓冲等待: {parseCountdown}s</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {errorInfo?.message || error}
              </p>

              {/* Progress bar */}
              <div className="bg-white/85 p-3 rounded-xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>算力队列恢复进度</span>
                  </span>
                  <span className={`font-mono ${parseCountdown === 0 ? "text-emerald-700 font-extrabold" : "text-amber-800"}`}>
                    {parseCountdown > 0 ? `缓冲中... (${parseCountdown}s)` : "✅ 算力通道已重新就绪"}
                  </span>
                </div>
                <div className="w-full bg-amber-100/70 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-1000 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, ((60 - parseCountdown) / 60) * 100))}%` }}
                  />
                </div>
                {errorInfo?.suggestion && (
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                    💡 <strong>贴心建议</strong>：{errorInfo.suggestion}
                  </p>
                )}
              </div>

              {/* Action Buttons: manual entry bypass & retry */}
              <div className="pt-0.5 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleManualEntryFallback}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileEdit className="w-3.5 h-3.5 shrink-0" />
                  <span>无需等待 · 直接手动核对/录入指标</span>
                </button>
                <button
                  type="button"
                  onClick={handleParse}
                  disabled={isParsing}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 font-bold border border-amber-300 text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${parseCountdown > 0 ? "animate-spin-slow" : ""}`} />
                  <span>{parseCountdown === 0 ? "通道已就绪 · 重新解析" : `缓冲中 (${parseCountdown}s) · 提前重试`}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorInfo?.title || "解析提示"}</span>
              </div>
              <p className="leading-relaxed">{error}</p>
              {errorInfo?.suggestion && (
                <p className="text-[11px] text-rose-700 bg-white/60 p-2 rounded-lg border border-rose-200/60">
                  💡 <strong>建议指引</strong>：{errorInfo.suggestion}
                </p>
              )}
              <div className="pt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualEntryFallback}
                  className="px-3 py-1.5 rounded-lg bg-white text-rose-800 font-bold border border-rose-300 hover:bg-rose-100/60 text-xs cursor-pointer flex items-center gap-1"
                >
                  <FileEdit className="w-3 h-3 text-rose-700" />
                  <span>切换为手动核对录入</span>
                </button>
              </div>
            </div>
          )
        )}

        <button
          onClick={handleParse}
          disabled={isParsing || (!reportText.trim() && images.length === 0) || !privacyConfirmed}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isParsing || (!reportText.trim() && images.length === 0) || !privacyConfirmed
              ? "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.99]"
          }`}
        >
          {isParsing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>正在多模态跨报告解析与 CTR 实性成分校准...</span>
            </>
          ) : !privacyConfirmed ? (
            <>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>请先确认报告已完成隐私遮挡</span>
            </>
          ) : (!reportText.trim() && images.length === 0) ? (
            <>
              <FileSearch className="w-4 h-4 text-slate-400" />
              <span>{uploadTab === 'image' ? '请先拍照或上传报告图片后解析' : '请先粘贴报告诊断文本后解析'}</span>
            </>
          ) : (
            <>
              <FileSearch className="w-4 h-4 text-white" />
              <span>开始多模态结构化解析</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
