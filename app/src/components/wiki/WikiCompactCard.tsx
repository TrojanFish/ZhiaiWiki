"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { WikiTopic } from "@/lib/wikiData";
import { RISK_LEVEL_CONFIG } from "@/lib/wikiData";
import type { CancerType } from "@/lib/types";
import WikiTopicIcon from "./WikiTopicIcon";
import { cn } from "@/lib/cn";

interface WikiCompactCardProps {
  topic: WikiTopic;
  isMatchedProfile?: boolean;
  isHighlighted?: boolean;
  onClick: () => void;
  cancerType?: CancerType;
}

/** 风险等级对应的 dot 颜色 */
const RISK_DOT: Record<string, string> = {
  high:     "bg-rose-500",
  moderate: "bg-amber-400",
  low:      "bg-emerald-500",
  safe:     "bg-teal-500",
};

/** 提炼主标题与英文/简短副标，消除括号长机制造成的视觉噪点 */
function parseTopicTitle(rawTitle: string, subtitle?: string): { main: string; sub: string } {
  const match = rawTitle.match(/^(.*?)\s*[(（](.*?)[)）]$/);
  if (!match) {
    return {
      main: rawTitle,
      sub: subtitle || "",
    };
  }
  const main = match[1].trim();
  // 提取括号第一段（通常为英文缩写或核心定性短词，如 Spiculation / CTR / STAS 阳性）
  const segments = match[2].split(/[/、]/).map((s) => s.trim());
  const sub = segments[0] || subtitle || "";
  return { main, sub };
}

export function WikiCompactCard({
  topic,
  isMatchedProfile,
  isHighlighted,
  onClick,
}: WikiCompactCardProps) {
  const riskCfg = RISK_LEVEL_CONFIG[topic.riskLevel];
  const dotColor = RISK_DOT[topic.riskLevel] ?? "bg-slate-400";
  const { main, sub } = parseTopicTitle(topic.title, topic.subtitle);

  return (
    <button
      type="button"
      id={`topic-${topic.id}`}
      onClick={onClick}
      className={cn(
        "group relative w-full text-left rounded-2xl bg-white",
        "border border-slate-200/90 shadow-2xs",
        "hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300/90",
        "active:scale-[0.99] active:shadow-2xs",
        "transition-all duration-200 cursor-pointer p-3.5 sm:p-4 flex flex-col justify-between",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
        isHighlighted && "ring-2 ring-blue-500/50 border-blue-300 shadow-blue-100 bg-blue-50/20",
        isMatchedProfile && !isHighlighted && "ring-1 ring-teal-400/50 border-teal-200 bg-teal-50/15"
      )}
      aria-label={`查看 ${topic.title} 详细解读`}
    >
      {/* 个人档案匹配角标 */}
      {isMatchedProfile && (
        <span className="absolute -top-2 right-3 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs z-10">
          档案相关
        </span>
      )}

      {/* 顶栏：图标 + 主标题/英文副标 + 纯净风险胶囊 */}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 min-w-0">
            {/* 纯净轻量图标容器 */}
            <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors mt-0.5">
              <WikiTopicIcon icon={topic.icon} topicId={topic.id} size={15} />
            </div>

            {/* 标题层级：主标题加粗清晰 + 浅色英文副标 */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-snug truncate group-hover:text-blue-600 transition-colors">
                  {main}
                </h3>
                {topic.visualComponent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" title="含动态交互图解" />
                )}
              </div>
              {sub && (
                <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                  {sub}
                </div>
              )}
            </div>
          </div>

          {/* 纯净极简风险等级胶囊 */}
          <span className={`shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${riskCfg.bg} ${riskCfg.color} ${riskCfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span>{riskCfg.label.split("·")[0].trim()}</span>
          </span>
        </div>

        {/* 中间：精炼一句话核心定性，去除两行密集大段排版 */}
        <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed group-hover:text-slate-600 transition-colors mt-2.5">
          {topic.metaphor}
        </p>
      </div>

      {/* 底部：高价值数据亮点胶囊 + 优雅微箭头 */}
      <div className="flex items-center justify-between gap-2 pt-2.5 mt-3 border-t border-slate-100/80">
        <div className="min-w-0 flex items-center gap-1.5 text-[11px] truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          <span className="font-bold text-blue-700 truncate">
            {topic.keyMetric ? topic.keyMetric.value.slice(0, 32) : (topic.faq?.length ? `${topic.faq.length} 条循证答疑` : "点击进入深度解读")}
          </span>
        </div>

        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" strokeWidth={2.5} />
      </div>
    </button>
  );
}
