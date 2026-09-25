"use client";

import React, { useMemo } from "react";
import { Microscope, Dna, HeartPulse, LayoutGrid } from "lucide-react";
import {
  LungIcon,
  BreastRibbonIcon,
  ColonIcon,
  RectalIcon,
  GastricIcon,
  LiverIcon,
  EsophagealIcon,
  ThyroidIcon,
  EndometrialIcon,
  CervicalIcon,
} from "@/components/common/CancerIcons";
import { WIKI_TOPICS, type WikiCategory, type WikiTopic } from "@/lib/wikiData";
import { BREAST_WIKI_TOPICS } from "@/lib/breastWikiData";
import { COLORECTAL_WIKI_TOPICS } from "@/lib/colorectalWikiData";
import { COLON_WIKI_TOPICS } from "@/lib/colonWikiData";
import { RECTAL_WIKI_TOPICS } from "@/lib/rectalWikiData";
import { GASTRIC_WIKI_TOPICS } from "@/lib/gastricWikiData";
import { LIVER_WIKI_TOPICS } from "@/lib/liverWikiData";
import { ESOPHAGEAL_WIKI_TOPICS } from "@/lib/esophagealWikiData";
import { THYROID_WIKI_TOPICS } from "@/lib/thyroidWikiData";
import { ENDOMETRIAL_WIKI_TOPICS } from "@/lib/endometrialWikiData";
import { CERVICAL_WIKI_TOPICS } from "@/lib/cervicalWikiData";
import type { CancerType } from "@/lib/types";
import { useCancerType } from "@/components/common/CancerSwitch";
import { cn } from "@/lib/cn";

interface WikiScenarioTabsProps {
  activeCategory: WikiCategory | "all";
  onSelectCategory: (category: WikiCategory | "all") => void;
  cancerType?: CancerType;
  topics?: WikiTopic[];
}

export interface ScenarioTabConfig {
  category: WikiCategory | "all";
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  subline: string;
  badge: string;
  keywords: string;
  theme: {
    active: string;
    inactive: string;
    iconBg: string;
    iconBgActive: string;
    countColor: string;
    countColorActive: string;
    badgeInactive: string;
    badgeActive: string;
    dot: string;
  };
}

// 肺癌情景卡配置表
export const LUNG_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "肺癌循证指标全景大盘",
    subline: "覆盖从结节发现到术后全病程",
    badge: "全部词条",
    keywords: "随访 · 病理 · 基因 · 康复",
    theme: {
      active:   "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:shadow-md",
      iconBg:   "bg-slate-100 text-slate-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-slate-100 text-slate-600 border-slate-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-slate-500",
    },
  },
  {
    category: "nodule" as WikiCategory,
    icon: LungIcon,
    headline: "刚体检查出肺结节",
    subline: "磨玻璃/实性/毛刺，不知良恶？",
    badge: "结节消恐 · 随访路线",
    keywords: "GGO · 实性 · 毛刺 · Fleischner",
    theme: {
      active:   "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-md",
      iconBg:   "bg-emerald-50 text-emerald-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-emerald-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-emerald-500",
    },
  },
  {
    category: "pathology" as WikiCategory,
    icon: Microscope,
    headline: "刚拿到术后病理报告",
    subline: "STAS / VPI / 微乳头不知吉凶？",
    badge: "病理密码破译",
    keywords: "STAS · VPI · LVI · 切缘",
    theme: {
      active:   "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-50 text-blue-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-blue-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "genetics" as WikiCategory,
    icon: Dna,
    headline: "医生让我做基因/靶向治疗",
    subline: "EGFR、ALK、奥希替尼怎么帮我？",
    badge: "驱动基因 · 精准靶向",
    keywords: "EGFR · ALK · 奥希替尼 · ADC",
    theme: {
      active:   "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-50 text-purple-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-purple-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "recovery" as WikiCategory,
    icon: HeartPulse,
    headline: "术后身体恢复与长期随访",
    subline: "咳喘、标志物波动是复发了吗？",
    badge: "康复调适 · 症状自查",
    keywords: "咳喘 · 标志物 · 复查 · 胸闷",
    theme: {
      active:   "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:shadow-md",
      iconBg:   "bg-amber-50 text-amber-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-amber-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-amber-50 text-amber-700 border-amber-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-amber-500",
    },
  },
];

// 乳腺癌情景卡配置表
export const BREAST_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "乳腺癌循证指标全景大盘",
    subline: "覆盖从影像筛查、病理分型到辅助康复全病程",
    badge: "全部词条",
    keywords: "BI-RADS · 免疫组化 · 21基因 · 靶向内分泌",
    theme: {
      active:   "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:shadow-md",
      iconBg:   "bg-slate-100 text-slate-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-slate-100 text-slate-600 border-slate-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-slate-500",
    },
  },
  {
    category: "nodule",
    icon: BreastRibbonIcon,
    headline: "体检筛查发现结节/钙化",
    subline: "BI-RADS 3/4类、泥沙样钙化，需要穿刺吗？",
    badge: "影像评级 · 筛查穿刺",
    keywords: "BI-RADS · 钼靶微钙化 · 致密腺体 · 超声",
    theme: {
      active:   "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-md",
      iconBg:   "bg-emerald-50 text-emerald-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-emerald-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-emerald-500",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "刚拿到浸润癌病理报告",
    subline: "导管癌/组织学分级/切缘/前哨淋巴结不知吉凶？",
    badge: "病理密码破译",
    keywords: "IDC/ILC · Nottingham · 切缘 · SLNB",
    theme: {
      active:   "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-50 text-blue-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-blue-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "医生让我看受体与基因检测",
    subline: "ER/PR、HER2、Ki-67、21基因怎么指导用药？",
    badge: "受体分型 · 精准用药",
    keywords: "Luminal · HER2 · TNBC · 21基因免化疗",
    theme: {
      active:   "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-50 text-purple-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-purple-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "术后身体恢复与内分泌随访",
    subline: "患肢淋巴水肿、爬墙锻炼、潮热骨痛如何调适？",
    badge: "康复调适 · 居家护理",
    keywords: "淋巴水肿 · 爬墙操 · 潮热盗汗 · 骨质疏松",
    theme: {
      active:   "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:shadow-md",
      iconBg:   "bg-amber-50 text-amber-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-amber-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-amber-50 text-amber-700 border-amber-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-amber-500",
    },
  },
];

// 结直肠癌专区情景卡配置表
export const COLORECTAL_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "结直肠癌循证指标全景大盘",
    subline: "覆盖从息肉早筛到保肛康复全病程",
    badge: "全部词条",
    keywords: "早筛 · 浸润 · 靶向 · 保肛",
    theme: {
      active:   "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:shadow-md",
      iconBg:   "bg-slate-100 text-slate-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-slate-100 text-slate-600 border-slate-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-slate-500",
    },
  },
  {
    category: "nodule",
    icon: ColonIcon,
    headline: "肠镜息肉早筛与直肠保肛",
    subline: "腺瘤息肉阻断、距肛缘厘米数与保肛分水岭",
    badge: "早筛防线 · 保肛标尺",
    keywords: "息肉腺瘤 · 距肛距离 · 括约肌 · ISR保肛",
    theme: {
      active:   "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-md",
      iconBg:   "bg-emerald-50 text-emerald-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-emerald-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-emerald-500",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "浸润病理与核磁切缘破译",
    subline: "T分期侵犯、CRM环周切缘、EMVI脉管与淋巴结",
    badge: "病理密码 · 核磁切缘",
    keywords: "T分期 · CRM≤1mm · mrEMVI · TD肿瘤沉积",
    theme: {
      active:   "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-50 text-blue-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-blue-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "驱动基因与精准靶向免疫",
    subline: "dMMR免手术免疫新革命、RAS/BRAF与左右半分流",
    badge: "分子靶标 · 免疫突破",
    keywords: "dMMR/MSI-H · RAS突变 · 西妥昔 · 左右半",
    theme: {
      active:   "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-50 text-purple-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-purple-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "TNT全程新辅助与造口康复",
    subline: "Watch & Wait免开刀器官保留、造口防漏与LARS排便调理",
    badge: "器官保留 · 生活质量",
    keywords: "TNT新辅助 · Watch & Wait · 造口护理 · LARS康复",
    theme: {
      active:   "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:shadow-md",
      iconBg:   "bg-amber-50 text-amber-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-amber-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-amber-50 text-amber-700 border-amber-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-amber-500",
    },
  },
];

// 结肠癌专区情景卡配置表
export const COLON_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "结肠癌循证指标全景大盘",
    subline: "覆盖息肉早筛、CME手术到IDEA化疗减毒全病程",
    badge: "全部词条",
    keywords: "早筛 · CME · Sidedness · IDEA减毒",
    theme: {
      active:   "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:shadow-md",
      iconBg:   "bg-slate-100 text-slate-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-slate-100 text-slate-600 border-slate-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-slate-500",
    },
  },
  {
    category: "nodule",
    icon: ColonIcon,
    headline: "结肠镜筛查与息肉阻断",
    subline: "从管状腺瘤到高级别上皮内瘤变：把肠癌扼杀在摇篮中",
    badge: "早筛防线 · 内镜根治",
    keywords: "息肉腺瘤 · EMR/ESD · 腺瘤癌变 · 肠镜随访",
    theme: {
      active:   "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-md",
      iconBg:   "bg-emerald-50 text-emerald-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-emerald-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-emerald-500",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "左右半分水岭与CME质控",
    subline: "胚胎起源靶向分流、CME系膜完整性与≥12枚淋巴结红线",
    badge: "解剖机制 · 手术质控",
    keywords: "左右半Sidedness · CME切除 · 12枚淋巴结 · TD沉积",
    theme: {
      active:   "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-50 text-blue-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-blue-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "dMMR免化疗与精准靶向",
    subline: "错配修复缺陷II期豁免化疗、RAS/BRAF基因指导用药",
    badge: "分子靶标 · 免疫豁免",
    keywords: "dMMR/MSI-H · 5-FU免除 · 西妥昔单抗 · 贝伐珠",
    theme: {
      active:   "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-50 text-purple-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-purple-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "IDEA减毒与肝转移MDT",
    subline: "低危III期3个月CAPOX规避神经麻木、CRLM转化切除",
    badge: "减毒增效 · MDT生机",
    keywords: "IDEA协作组 · 3个月CAPOX · 神经毒性 · 肝转移切除",
    theme: {
      active:   "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:shadow-md",
      iconBg:   "bg-amber-50 text-amber-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-amber-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-amber-50 text-amber-700 border-amber-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-amber-500",
    },
  },
];

// 直肠癌专区情景卡配置表
export const RECTAL_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "直肠癌循证指标全景大盘",
    subline: "覆盖保肛标尺、骨盆薄层核磁、TNT到造口康复全病程",
    badge: "全部词条",
    keywords: "保肛标尺 · HR-MRI · TNT新辅助 · 造口LARS",
    theme: {
      active:   "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:shadow-md",
      iconBg:   "bg-slate-100 text-slate-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-slate-100 text-slate-600 border-slate-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-slate-500",
    },
  },
  {
    category: "nodule",
    icon: RectalIcon,
    headline: "直肠解剖标尺与保肛抉择",
    subline: "0~15cm三段标尺、齿状线与内外括约肌(ISR vs Miles)决断",
    badge: "保肛标尺 · 括约肌评估",
    keywords: "距肛门距离 · 内括约肌 · ISR保肛 · Miles手术",
    theme: {
      active:   "bg-teal-700 border-teal-700 text-white shadow-lg shadow-teal-700/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:shadow-md",
      iconBg:   "bg-teal-50 text-teal-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-teal-700",
      countColorActive: "text-white/70",
      badgeInactive: "bg-teal-50 text-teal-800 border-teal-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-teal-600",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "骨盆薄层核磁与TME神圣平面",
    subline: "CRM≤1mm高危预警、mrEMVI脉管与无血管间隙解剖",
    badge: "HR-MRI · TME神圣平面",
    keywords: "骨盆核磁 · CRM切缘 · mrEMVI · TME无血平面",
    theme: {
      active:   "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-50 text-blue-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-blue-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "全程新辅助TNT与器官保留",
    subline: "RAPIDO/PRODIGE 23短程放疗与Watch & Wait免开刀",
    badge: "TNT模式 · 器官保留",
    keywords: "RAPIDO · 短程放疗 · cCR · Watch & Wait",
    theme: {
      active:   "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-50 text-purple-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-purple-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "造口防漏护理与LARS排便康复",
    subline: "底盘剪裁留1~2mm防漏五步口诀与Kegel提肛排便重塑",
    badge: "造口防漏 · LARS康复",
    keywords: "保护性造口 · 底盘防漏 · LARS便频 · Kegel训练",
    theme: {
      active:   "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:shadow-md",
      iconBg:   "bg-amber-50 text-amber-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-amber-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-amber-50 text-amber-700 border-amber-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-amber-500",
    },
  },
];

// 胃癌专区情景卡配置表
export const GASTRIC_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "胃癌循证指标全景大盘",
    subline: "覆盖胃镜早筛、D2清扫到消化道重建全病程",
    badge: "全部词条",
    keywords: "ESD微创 · Lauren分型 · D2清扫 · 倾倒综合征",
    theme: {
      active:   "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:shadow-md",
      iconBg:   "bg-slate-100 text-slate-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-slate-100 text-slate-600 border-slate-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-slate-500",
    },
  },
  {
    category: "nodule",
    icon: GastricIcon,
    headline: "胃镜早筛与ESD保胃微创",
    subline: "黏膜内早癌cT1a无需切胃，5年生存率高达97%",
    badge: "早筛防线 · 内镜保胃",
    keywords: "ESD剥离 · cT1a早癌 · 幽门螺杆菌 · 放大内镜",
    theme: {
      active:   "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-md",
      iconBg:   "bg-emerald-50 text-emerald-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-emerald-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-emerald-500",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "Lauren分型与D2清扫质控",
    subline: "打破印戒绝症误区、D2血管根部清扫与≥16枚红线",
    badge: "病理密码 · D2质控",
    keywords: "Lauren印戒 · Borrmann · D2清扫 · ≥16枚淋巴结",
    theme: {
      active:   "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-50 text-blue-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-blue-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "Claudin/HER2靶向与新辅助",
    subline: "佐妥昔单抗新突破、曲妥珠单抗与FLOT/SOX降期",
    badge: "精准靶标 · 围术降期",
    keywords: "Claudin 18.2 · HER2 · FLOT/SOX · PD-L1 CPS",
    theme: {
      active:   "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-50 text-purple-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-purple-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "消化道重建与倾倒综合征",
    subline: "毕I/毕II/Roux-en-Y对比、少食多餐与B12防贫血",
    badge: "术后重塑 · 营养康复",
    keywords: "早期倾倒 · 晚期低血糖 · Roux-en-Y · 维生素B12",
    theme: {
      active:   "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:shadow-md",
      iconBg:   "bg-amber-50 text-amber-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-amber-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-amber-50 text-amber-700 border-amber-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-amber-500",
    },
  },
];

// 原发性肝癌专区情景卡配置表
export const LIVER_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "肝癌循证决策全景大盘",
    subline: "覆盖CNLC分期、介入转化到终身抗病毒全病程",
    badge: "全部词条",
    keywords: "CNLC · Child-Pugh · HAIC-FO · T+A · 恩替卡韦",
    theme: {
      active:   "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:shadow-md",
      iconBg:   "bg-slate-100 text-slate-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-slate-100 text-slate-600 border-slate-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-slate-500",
    },
  },
  {
    category: "nodule",
    icon: LiverIcon,
    headline: "CNLC分期与血清三联早筛",
    subline: "国家标准分期决策大盘、AFP+PIVKA-II防漏诊",
    badge: "国家分期 · 三联早筛",
    keywords: "CNLC 2024 · PIVKA-II · AFP-L3 · 早期筛查",
    theme: {
      active:   "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-md",
      iconBg:   "bg-emerald-50 text-emerald-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-emerald-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-emerald-500",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "肝脏储备与TACE/HAIC介入",
    subline: "Child-Pugh/ALBI防肝衰、HAIC-FO转化降期奇迹",
    badge: "储备底线 · 介入转化",
    keywords: "Child-Pugh · ALBI · TACE · HAIC-FO · ICG-R15",
    theme: {
      active:   "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-50 text-blue-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-blue-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "靶免联合一线与MDT转化",
    subline: "T+A与中国双达方案、胃镜排查静脉曲张防大出血",
    badge: "靶免一线 · 防出血",
    keywords: "T+A方案 · 双达ORIENT-32 · 仑伐替尼 · 静脉曲张",
    theme: {
      active:   "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-50 text-purple-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-purple-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "乙肝终身抗病毒与消融移植",
    subline: "恩替卡韦/TAF切断三部曲、≤3cm消融与米兰标准移植",
    badge: "病因阻断 · 重塑治愈",
    keywords: "恩替卡韦 · TAF · 微波消融 · 米兰标准",
    theme: {
      active:   "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:shadow-md",
      iconBg:   "bg-amber-50 text-amber-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-amber-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-amber-50 text-amber-700 border-amber-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-amber-500",
    },
  },
];

// 食管癌专科情景卡配置表
export const ESOPHAGEAL_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "食管鳞癌循证决策大盘",
    subline: "覆盖解剖分段、新辅助放化疗到术后造瘘全病程",
    badge: "全部词条",
    keywords: "AJCC 8th · NEOCRTEC5010 · ESCORT-1st · 吻合口瘘",
    theme: {
      active:   "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:shadow-md",
      iconBg:   "bg-slate-100 text-slate-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-slate-100 text-slate-600 border-slate-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-slate-500",
    },
  },
  {
    category: "nodule",
    icon: EsophagealIcon,
    headline: "AJCC分段与鳞癌早筛",
    subline: "门齿距离解剖决策、cT1a内镜ESD与SCC标志物",
    badge: "解剖分段 · 微创早筛",
    keywords: "门齿距离 · ESD指征 · SCC抗原 · CYFRA21-1",
    theme: {
      active:   "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-50 text-purple-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-purple-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "放化疗与二野/三野质控",
    subline: "NEOCRTEC5010自主突破、≥15枚清扫与瘘管防范",
    badge: "新辅助质控 · 防穿孔",
    keywords: "NEOCRTEC5010 · CROSS · 15枚质控 · 气管食管瘘",
    theme: {
      active:   "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-indigo-400 hover:shadow-md",
      iconBg:   "bg-indigo-50 text-indigo-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-indigo-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-indigo-50 text-indigo-700 border-indigo-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-indigo-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "晚期一线免疫与靶向突破",
    subline: "卡瑞利珠单抗/替雷利珠单抗原研领先、PD-L1分流",
    badge: "免疫一线 · 长尾生存",
    keywords: "ESCORT-1st · RATIONALE-306 · PD-L1 CPS",
    theme: {
      active:   "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-violet-400 hover:shadow-md",
      iconBg:   "bg-violet-50 text-violet-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-violet-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-violet-50 text-violet-700 border-violet-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-violet-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "术后康复与抗反流营养",
    subline: "吻合口瘘早识别、半卧位防反流、空肠造瘘营养",
    badge: "术后护命 · 肠内营养",
    keywords: "吻合口瘘 · 半卧位 · 空肠造瘘 · 饮食过渡",
    theme: {
      active:   "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:shadow-md",
      iconBg:   "bg-amber-50 text-amber-600",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-amber-600",
      countColorActive: "text-white/70",
      badgeInactive: "bg-amber-50 text-amber-700 border-amber-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-amber-500",
    },
  },
];

// 甲状腺癌情景卡配置表
export const THYROID_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "甲状腺癌循证指标全景大盘",
    subline: "覆盖超声早筛到术后内分泌全周期",
    badge: "全部词条",
    keywords: "超声 · 手术 · 优甲乐 · 碘131",
    theme: {
      active:   "bg-rose-900 border-rose-900 text-white shadow-lg shadow-rose-900/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-rose-400 hover:shadow-md",
      iconBg:   "bg-rose-100 text-rose-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-rose-50 text-rose-700 border-rose-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-rose-500",
    },
  },
  {
    category: "nodule",
    icon: ThyroidIcon,
    headline: "超声TI-RADS与穿刺监测",
    subline: "微钙化/纵横比与微小癌主动监测",
    badge: "早筛监测",
    keywords: "C-TIRADS · FNA穿刺 · Bethesda",
    theme: {
      active:   "bg-teal-700 border-teal-700 text-white shadow-lg shadow-teal-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:shadow-md",
      iconBg:   "bg-teal-100 text-teal-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-teal-50 text-teal-700 border-teal-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-teal-500",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "术式权衡与病理亚型质控",
    subline: "全切/半切、中央清扫与55岁分水岭",
    badge: "病理外科",
    keywords: "PTC · FTC · MTC · AJCC 8th",
    theme: {
      active:   "bg-purple-700 border-purple-700 text-white shadow-lg shadow-purple-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-100 text-purple-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "基因突变与碘难治精准靶向",
    subline: "BRAF/TERT双突变与RET特异靶向",
    badge: "驱动靶向",
    keywords: "BRAF · TERT · 仑伐替尼 · 普拉替尼",
    theme: {
      active:   "bg-blue-700 border-blue-700 text-white shadow-lg shadow-blue-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-100 text-blue-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "TSH抑制、低钙救治与碘131",
    subline: "优甲乐4小时隔离法则与Tg复发雷达",
    badge: "康复随访",
    keywords: "TSH窗口 · 补钙PTH · 碘131 · Tg",
    theme: {
      active:   "bg-emerald-700 border-emerald-700 text-white shadow-lg shadow-emerald-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-md",
      iconBg:   "bg-emerald-100 text-emerald-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-emerald-500",
    },
  },
];

/**
 * 子宫内膜癌专区四大专科情景卡配置
 */
export const ENDOMETRIAL_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "子宫内膜癌全景循证指引",
    subline: "FIGO 2023分子分型、保育逆转与放化联合",
    badge: "全景知识库",
    keywords: "POLEmut · MMRd · 保育逆转 · PORTEC-4a",
    theme: {
      active:   "bg-rose-700 border-rose-700 text-white shadow-lg shadow-rose-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-rose-400 hover:shadow-md",
      iconBg:   "bg-rose-100 text-rose-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-rose-50 text-rose-700 border-rose-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-rose-500",
    },
  },
  {
    category: "nodule",
    icon: EndometrialIcon,
    headline: "绝经后流血与早期排查",
    subline: "内膜厚度4mm警戒线与宫腔镜活检",
    badge: "早期预警",
    keywords: "绝经后流血 · 阴道超声 · 宫腔镜活检",
    theme: {
      active:   "bg-rose-700 border-rose-700 text-white shadow-lg shadow-rose-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-rose-400 hover:shadow-md",
      iconBg:   "bg-rose-100 text-rose-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-rose-50 text-rose-700 border-rose-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-rose-500",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "FIGO 2023分期与分子重塑",
    subline: "POLE降阶梯、p53abn升期与肌层浸润",
    badge: "病理分子",
    keywords: "POLEmut · p53abn · LVSI · PORTEC-3",
    theme: {
      active:   "bg-purple-700 border-purple-700 text-white shadow-lg shadow-purple-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-100 text-purple-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "晚期免疫突破与Lynch筛查",
    subline: "RUBY多塔利单抗与林奇综合征遗传防线",
    badge: "靶向免疫",
    keywords: "RUBY · dMMR · 多塔利单抗 · Lynch综合征",
    theme: {
      active:   "bg-blue-700 border-blue-700 text-white shadow-lg shadow-blue-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-100 text-blue-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "保育逆转、阴道放疗与康复",
    subline: "大剂量孕激素、阴道扩张器与减重管理",
    badge: "保育康复",
    keywords: "保生育MA · 阴道后装VBT · 减重 · 扩张器",
    theme: {
      active:   "bg-emerald-700 border-emerald-700 text-white shadow-lg shadow-emerald-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-md",
      iconBg:   "bg-emerald-100 text-emerald-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-emerald-500",
    },
  },
];

/**
 * 宫颈癌专区四大专科情景卡配置
 */
export const CERVICAL_SCENARIO_TABS: ScenarioTabConfig[] = [
  {
    category: "all",
    icon: LayoutGrid,
    headline: "宫颈癌全景循证指引",
    subline: "HPV感染可逆阻断、CCRT根治与保育Trachelectomy",
    badge: "全景知识库",
    keywords: "HPV · CIN · 锥切 · CCRT · KEYNOTE-826",
    theme: {
      active:   "bg-fuchsia-700 border-fuchsia-700 text-white shadow-lg shadow-fuchsia-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-fuchsia-400 hover:shadow-md",
      iconBg:   "bg-fuchsia-100 text-fuchsia-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-fuchsia-500",
    },
  },
  {
    category: "nodule",
    icon: CervicalIcon,
    headline: "HPV感染与CIN可逆演变",
    subline: "破除一过性恐慌与10年癌前阻断窗口",
    badge: "病毒与癌前",
    keywords: "高危HPV · CIN1/2/3 · 阴道镜 · 10年窗口",
    theme: {
      active:   "bg-teal-700 border-teal-700 text-white shadow-lg shadow-teal-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:shadow-md",
      iconBg:   "bg-teal-100 text-teal-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-teal-50 text-teal-700 border-teal-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-teal-500",
    },
  },
  {
    category: "pathology",
    icon: Microscope,
    headline: "锥切质控与LACC开腹根治",
    subline: "切缘净距判定与开腹优于微创警示",
    badge: "病理外科",
    keywords: "CKC · LEEP切缘 · LACC开腹 · FIGO 2018",
    theme: {
      active:   "bg-purple-700 border-purple-700 text-white shadow-lg shadow-purple-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-purple-400 hover:shadow-md",
      iconBg:   "bg-purple-100 text-purple-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-purple-50 text-purple-700 border-purple-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-purple-500",
    },
  },
  {
    category: "genetics",
    icon: Dna,
    headline: "KEYNOTE-826与双特异性抗体",
    subline: "帕博利珠单抗+化免抗血管与卡度尼利单抗",
    badge: "靶向免疫",
    keywords: "KEYNOTE-826 · PD-L1 CPS · 贝伐珠单抗 · 双抗",
    theme: {
      active:   "bg-blue-700 border-blue-700 text-white shadow-lg shadow-blue-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:shadow-md",
      iconBg:   "bg-blue-100 text-blue-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-blue-50 text-blue-700 border-blue-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-blue-500",
    },
  },
  {
    category: "recovery",
    icon: HeartPulse,
    headline: "CCRT金标准、后装放疗与康复",
    subline: "EMBRACE三维自适应后装与保生育Trachelectomy",
    badge: "放化康复",
    keywords: "CCRT · IGABT后装 · Trachelectomy · 直肠炎",
    theme: {
      active:   "bg-emerald-700 border-emerald-700 text-white shadow-lg shadow-emerald-700/20",
      inactive: "bg-white border-slate-200 text-slate-800 hover:border-emerald-400 hover:shadow-md",
      iconBg:   "bg-emerald-100 text-emerald-700",
      iconBgActive: "bg-white/15 text-white",
      countColor:   "text-slate-400",
      countColorActive: "text-white/70",
      badgeInactive: "bg-emerald-50 text-emerald-700 border-emerald-200",
      badgeActive:   "bg-white/15 text-white border-white/20",
      dot: "bg-emerald-500",
    },
  },
];

export function WikiScenarioTabs({
  activeCategory,
  onSelectCategory,
  cancerType: propCancerType,
  topics,
}: WikiScenarioTabsProps) {
  const { cancerType: contextCancerType } = useCancerType();
  const cancerType = propCancerType || contextCancerType || "lung";

  // 根据当前激活的癌种选择情景卡方案与词条集合
  const scenarioTabs = 
    cancerType === "endometrial" ? ENDOMETRIAL_SCENARIO_TABS :
    cancerType === "cervical" ? CERVICAL_SCENARIO_TABS :
    cancerType === "thyroid" ? THYROID_SCENARIO_TABS :
    cancerType === "esophageal" ? ESOPHAGEAL_SCENARIO_TABS :
    cancerType === "liver" ? LIVER_SCENARIO_TABS :
    cancerType === "gastric" ? GASTRIC_SCENARIO_TABS :
    cancerType === "colon" ? COLON_SCENARIO_TABS :
    cancerType === "rectal" ? RECTAL_SCENARIO_TABS :
    cancerType === "colorectal" ? COLORECTAL_SCENARIO_TABS : 
    cancerType === "breast" ? BREAST_SCENARIO_TABS : 
    LUNG_SCENARIO_TABS;

  const currentTopics = topics ?? (
    cancerType === "endometrial" ? ENDOMETRIAL_WIKI_TOPICS :
    cancerType === "cervical" ? CERVICAL_WIKI_TOPICS :
    cancerType === "thyroid" ? THYROID_WIKI_TOPICS :
    cancerType === "esophageal" ? ESOPHAGEAL_WIKI_TOPICS :
    cancerType === "liver" ? LIVER_WIKI_TOPICS :
    cancerType === "gastric" ? GASTRIC_WIKI_TOPICS :
    cancerType === "colon" ? COLON_WIKI_TOPICS :
    cancerType === "rectal" ? RECTAL_WIKI_TOPICS :
    cancerType === "colorectal" ? COLORECTAL_WIKI_TOPICS : 
    cancerType === "breast" ? BREAST_WIKI_TOPICS : 
    WIKI_TOPICS
  );

  // 严格基于当前装载的 topics 进行动态统计（彻底摒弃硬编码）
  const counts = useMemo(() => {
    const result: Record<string, { total: number; high: number }> = {};
    for (const tab of scenarioTabs) {
      const cat = tab.category;
      const list = cat === "all" ? currentTopics : currentTopics.filter((t) => t.category === cat);
      result[cat] = {
        total: list.length,
        high: list.filter((t) => t.riskLevel === "high").length,
      };
    }
    return result;
  }, [scenarioTabs, currentTopics]);

  return (
    <div className="w-full">
      {/* PC 端 / 平板：5 列等宽网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {scenarioTabs.map((tab) => {
          const isActive  = activeCategory === tab.category;
          const IconComp  = tab.icon;
          const stat      = counts[tab.category] ?? { total: 0, high: 0 };
          const t         = tab.theme;

          return (
            <button
              key={`${cancerType}-${tab.category}`}
              type="button"
              onClick={() => onSelectCategory(tab.category)}
              aria-pressed={isActive}
              className={cn(
                "group relative text-left rounded-2xl sm:rounded-3xl border",
                "px-3.5 py-3 sm:px-4 sm:py-4",
                "transition-all duration-200 cursor-pointer",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
                "active:scale-[0.97]",
                isActive ? t.active : t.inactive
              )}
            >
              {/* 选中态：左上角呼吸激活圆点 */}
              {isActive && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/60 animate-pulse" />
              )}

              {/* 图标 */}
              <div className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-2.5 sm:mb-3 flex-shrink-0",
                "transition-colors duration-200",
                isActive ? t.iconBgActive : t.iconBg
              )}>
                <IconComp className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </div>

              {/* 标题 */}
              <div className={`text-xs sm:text-sm font-black leading-snug tracking-tight mb-1 ${isActive ? "text-white" : "text-slate-900"}`}>
                {tab.headline}
              </div>

              {/* 副标题 */}
              <div className={`text-[10px] sm:text-xs leading-snug mb-2.5 line-clamp-2 ${isActive ? "text-white/80" : "text-slate-500"}`}>
                {tab.subline}
              </div>

              {/* 底部：Badge + 词条计数 */}
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isActive ? t.badgeActive : t.badgeInactive}`}>
                  {tab.badge}
                </span>
                <span className={`text-[10px] font-mono font-bold tabular-nums flex-shrink-0 ${isActive ? t.countColorActive : t.countColor}`}>
                  {stat.total} 词条
                  {stat.high > 0 && (
                    <span className={`ml-1 ${isActive ? "text-white/60" : "text-rose-500"}`}>
                      · {stat.high} 高危
                    </span>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
