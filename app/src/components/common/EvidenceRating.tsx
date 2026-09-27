"use client";

import React from "react";
import { Star } from "lucide-react";

interface EvidenceRatingProps {
  level?: number | string; // e.g. 5, 4, 3, 2, 1, or string "5", "⭐⭐⭐⭐⭐"
  rating?: number | string; // alias for level
  max?: number;
  maxLevel?: number; // alias for max
  showText?: boolean;
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "stars" | "badge" | "compact";
  className?: string;
}

const LEVEL_TEXT_MAP: Record<number, string> = {
  5: "1A级 (最高级 RCT / Meta 分析)",
  4: "1B级 (高质量多中心临床研究)",
  3: "2A级 (大型前瞻性队列研究)",
  2: "2B级 (回顾性队列 / 观察研究)",
  1: "3级 (临床专家共识 / 观点)",
};

const LEVEL_SHORT_MAP: Record<number, string> = {
  5: "Level 1A",
  4: "Level 1B",
  3: "Level 2A",
  2: "Level 2B",
  1: "Level 3",
};

export function parseEvidenceLevel(input?: number | string): number {
  if (typeof input === "number") return Math.min(Math.max(Math.round(input), 1), 5);
  if (!input) return 4;
  
  // If string contains star emojis
  if (input.includes("⭐") || input.includes("★")) {
    const stars = (input.match(/[⭐★]/g) || []).length;
    return Math.min(Math.max(stars, 1), 5);
  }

  const parsed = parseInt(input, 10);
  if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
    return parsed;
  }

  return 4;
}

export default function EvidenceRating({
  level,
  rating,
  max = 5,
  maxLevel,
  showText = false,
  text,
  size = "md",
  variant = "stars",
  className = "",
}: EvidenceRatingProps) {
  const effectiveInput = level !== undefined ? level : rating !== undefined ? rating : 4;
  const effectiveMax = maxLevel !== undefined ? maxLevel : max;
  const numericLevel = parseEvidenceLevel(effectiveInput);

  const starSizeClasses = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const textClasses = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  if (variant === "badge") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium border tabular-nums ${
          numericLevel >= 4
            ? "bg-sky-50 text-sky-800 border-sky-200"
            : numericLevel === 3
            ? "bg-teal-50 text-teal-800 border-teal-200"
            : "bg-slate-50 text-slate-700 border-slate-200"
        } ${textClasses[size]}${className ? ` ${className}` : ""}`}
      >
        <span className="flex items-center gap-0.5">
          {Array.from({ length: max }).map((_, i) => (
            <Star
              key={i}
              className={`${starSizeClasses[size]} ${
                i < numericLevel
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-300"
              }`}
            />
          ))}
        </span>
        <span>{text || LEVEL_SHORT_MAP[numericLevel] || `Level ${numericLevel}`}</span>
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <span
        className={`inline-flex items-center gap-1 text-slate-600 font-medium tabular-nums ${textClasses[size]}${className ? ` ${className}` : ""}`}
        title={LEVEL_TEXT_MAP[numericLevel]}
      >
        <Star className={`${starSizeClasses[size]} fill-amber-400 text-amber-400`} />
        <span>{numericLevel}.0</span>
        {showText && <span className="text-slate-500 font-normal">({text || LEVEL_SHORT_MAP[numericLevel]})</span>}
      </span>
    );
  }

  // Default "stars" variant
  return (
    <div
      className={`inline-flex items-center gap-1.5${className ? ` ${className}` : ""}`}
      title={text || LEVEL_TEXT_MAP[numericLevel]}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: effectiveMax }).map((_, i) => (
          <Star
            key={i}
            className={`${starSizeClasses[size]} ${
              i < numericLevel
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-100 text-slate-200"
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className={`text-slate-600 font-medium tabular-nums ${textClasses[size]}`}>
          {text || LEVEL_TEXT_MAP[numericLevel]}
        </span>
      )}
    </div>
  );
}

export { EvidenceRating };

export interface DualEvidenceBadgeProps {
  nccnCategory?: "1" | "2A" | "2B" | "3";
  cscoLevel?: "I" | "II" | "III";
  cscoGrade?: "A" | "B" | "C";
  className?: string;
}

const NCCN_BADGE_STYLES = {
  "1":  "bg-blue-600 text-white",
  "2A": "bg-sky-600 text-white",
  "2B": "bg-sky-200 text-sky-950",
  "3":  "bg-slate-200 text-slate-700",
};

const CSCO_BADGE_STYLES = {
  "I":   "bg-emerald-600 text-white",
  "II":  "bg-emerald-500 text-white",
  "III": "bg-slate-300 text-slate-800",
};

export function DualEvidenceBadge({
  nccnCategory = "1",
  cscoLevel = "I",
  cscoGrade = "A",
  className = "",
}: DualEvidenceBadgeProps) {
  const nccnClass = NCCN_BADGE_STYLES[nccnCategory] || NCCN_BADGE_STYLES["1"];
  const cscoClass = CSCO_BADGE_STYLES[cscoLevel] || CSCO_BADGE_STYLES["I"];

  return (
    <div className={`inline-flex rounded-lg overflow-hidden border border-slate-200 shadow-2xs font-mono text-[10px] select-none font-bold ${className}`}>
      <span className={`px-2 py-0.5 ${nccnClass}`}>
        NCCN {nccnCategory}类
      </span>
      <span className={`px-2 py-0.5 border-l border-white/20 ${cscoClass}`}>
        CSCO {cscoLevel}{cscoGrade}
      </span>
    </div>
  );
}
