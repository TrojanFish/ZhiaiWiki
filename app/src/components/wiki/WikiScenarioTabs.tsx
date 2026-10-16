"use client";

import React, { useMemo } from "react";
import { Microscope, Dna, HeartPulse, LayoutGrid } from "lucide-react";
import {
  LungIcon,
  BreastRibbonIcon,
} from "@/components/common/CancerIcons";
import { WIKI_TOPICS, type WikiCategory, type WikiTopic } from "@/lib/wikiData";
import { BREAST_WIKI_TOPICS } from "@/lib/breastWikiData";
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


export function WikiScenarioTabs({
  activeCategory,
  onSelectCategory,
  cancerType: propCancerType,
  topics,
}: WikiScenarioTabsProps) {
  const { cancerType: contextCancerType } = useCancerType();
  const cancerType = propCancerType || contextCancerType || "lung";

  // 根据当前激活的癌种选择情景卡方案与词条集合
  const scenarioTabs = cancerType === "breast" ? BREAST_SCENARIO_TABS : LUNG_SCENARIO_TABS;
  const currentTopics = topics ?? (cancerType === "breast" ? BREAST_WIKI_TOPICS : WIKI_TOPICS);

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
