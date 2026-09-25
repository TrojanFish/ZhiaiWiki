"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface ZhiaiWikiLogoProps {
  className?: string;
  size?: number | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  variant?: "full" | "icon-only" | "badge";
}

/**
 * ZhiaiWiki (知癌维基) Official Brand Logo
 * Triple Homophonic Symbolism:
 * - Knowledge Shield & Open Book: 知癌 (Evidence-based Knowledge)
 * - Clinical Medical Cross & Helix: 治癌 (Scientific Therapy & Pathways)
 * - Embracing Heart & Caring Arc: 至爱/挚爱 (Humanistic Empathy & Family Care)
 */
export default function ZhiaiWikiLogo({
  className = "",
  size = "md",
  showText = true,
  showTagline = false,
  variant = "full",
}: ZhiaiWikiLogoProps) {
  const pixelSize = typeof size === "number" 
    ? size 
    : size === "sm" ? 28 
    : size === "md" ? 36 
    : size === "lg" ? 44 
    : 56;

  const iconOnly = variant === "icon-only" || !showText;

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      {/* Precision Vector Emblem (Icon Mark) */}
      <div 
        className="relative shrink-0 rounded-xl overflow-hidden shadow-2xs transition-transform duration-200 group-hover:scale-105 bg-white flex items-center justify-center"
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      >
        <img 
          src="/logo.svg" 
          alt="知癌维基 ZhiaiWiki" 
          className="w-full h-full object-contain"
          width={pixelSize}
          height={pixelSize}
        />
      </div>

      {/* Typography Block */}
      {!iconOnly && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg leading-none">
            知癌维基
          </span>
          {showTagline && (
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80 tracking-tight hidden sm:inline-block">
              知癌 · 治癌 · 挚爱
            </span>
          )}
        </div>
      )}
    </div>
  );
}
