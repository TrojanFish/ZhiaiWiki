"use client";

import React from "react";
import { useHydrated } from "@/lib/useHydrated";

export interface ForestRow {
  label: string;          // 亚组或研究名称
  subgroup?: string;      // 亚组说明
  hr: number;             // 风险比 Hazard Ratio
  ci_lower: number;       // 95% CI 下界
  ci_upper: number;       // 95% CI 上界
  weight?: number;        // 权重 (1~100)
  n_exp?: number;         // 实验组例数
  n_ctrl?: number;        // 对照组例数
  isSummary?: boolean;    // 是否为总体 Meta 汇总菱形
  isHeader?: boolean;     // 是否为分组标题头
}

export interface ForestPlotChartProps {
  title: string;
  subtitle?: string;
  expLabel?: string;      // 实验组名称 (如 "靶向联合化疗")
  ctrlLabel?: string;     // 对照组名称 (如 "单药化疗")
  rows: ForestRow[];
  citation?: {
    metaTitle: string;
    journal: string;
    year: string | number;
    totalN: number | string;
    doiUrl?: string;
  };
  className?: string;
}

export function ForestPlotChart({
  title,
  subtitle,
  expLabel = "实验组 (新方案)",
  ctrlLabel = "对照组 (标准治疗)",
  rows,
  citation,
  className = "",
}: ForestPlotChartProps) {
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return (
      <div className={`w-full h-64 rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-xs ${className}`}>
        <span>森林图统计分析加载中...</span>
      </div>
    );
  }

  // Log scale constants
  const LOG_MIN = Math.log(0.1);
  const LOG_MAX = Math.log(5.0);

  const svgWidth = 320;
  const rowHeight = 34;
  const svgHeight = rows.length * rowHeight + 35;
  const padLeft = 10;
  const padRight = 10;
  const plotW = svgWidth - padLeft - padRight;

  const hrToX = (hr: number) => {
    const clamped = Math.max(0.08, Math.min(6.0, hr));
    const logVal = Math.log(clamped);
    const normalized = (logVal - LOG_MIN) / (LOG_MAX - LOG_MIN);
    return padLeft + normalized * plotW;
  };

  const xNull = hrToX(1.0);
  const xTicks = [0.1, 0.2, 0.5, 1.0, 2.0, 5.0];

  return (
    <div className={`bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-semibold">
              Hazard Ratio 森林图
            </span>
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Direction guidance */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            ← 优势偏向: {expLabel}
          </span>
          <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            优势偏向: {ctrlLabel} →
          </span>
        </div>
      </div>

      {/* Main 3-Column Layout Container */}
      <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
        {/* Left Column: Subgroup Labels (40% / 5 cols) */}
        <div className="col-span-5 sm:col-span-4 space-y-0 text-xs">
          <div className="h-8 font-bold text-slate-400 uppercase tracking-wide flex items-center text-[10px]">
            亚组 / 队列研究
          </div>
          {rows.map((r, i) => (
            <div
              key={i}
              className={`flex flex-col justify-center px-1 truncate ${
                r.isHeader
                  ? "h-8 font-black text-slate-900 border-b border-slate-100"
                  : r.isSummary
                  ? "h-8 font-bold text-blue-900 bg-blue-50/60 rounded-lg px-2"
                  : "h-8 text-slate-700 font-medium hover:bg-slate-50 rounded"
              }`}
            >
              <span className="truncate">{r.label}</span>
              {r.subgroup && <span className="text-[10px] text-slate-400 truncate">{r.subgroup}</span>}
            </div>
          ))}
        </div>

        {/* Middle Column: Forest Plot SVG (45% / 5 cols) */}
        <div className="col-span-4 sm:col-span-5 overflow-hidden">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto select-none"
            role="img"
            aria-label={`${title} 森林图`}
          >
            {/* Null Effect Vertical Baseline (HR = 1.0) */}
            <line
              x1={xNull}
              y1={5}
              x2={xNull}
              y2={svgHeight - 25}
              stroke="#94a3b8"
              strokeWidth={1.5}
            />

            {/* X-axis ticks (log scale) */}
            <line
              x1={padLeft}
              y1={svgHeight - 25}
              x2={svgWidth - padRight}
              y2={svgHeight - 25}
              stroke="#cbd5e1"
              strokeWidth={1}
            />
            {xTicks.map((tickVal) => {
              const tx = hrToX(tickVal);
              return (
                <g key={tickVal}>
                  <line
                    x1={tx}
                    y1={svgHeight - 25}
                    x2={tx}
                    y2={svgHeight - 20}
                    stroke="#94a3b8"
                    strokeWidth={1}
                  />
                  <text
                    x={tx}
                    y={svgHeight - 8}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-slate-500 font-bold"
                  >
                    {tickVal}
                  </text>
                </g>
              );
            })}

            {/* Rows Elements */}
            {rows.map((r, i) => {
              if (r.isHeader) return null;
              const yCenter = i * rowHeight + rowHeight / 2;
              const xHr = hrToX(r.hr);
              const xLow = hrToX(r.ci_lower);
              const xHigh = hrToX(r.ci_upper);

              if (r.isSummary) {
                // Summary Diamond (◆)
                const diamondWidth = Math.max(8, xHigh - xLow);
                const halfW = diamondWidth / 2;
                const halfH = 7;
                const points = `
                  ${xHr},${yCenter - halfH}
                  ${xHr + halfW},${yCenter}
                  ${xHr},${yCenter + halfH}
                  ${xHr - halfW},${yCenter}
                `;
                return (
                  <polygon
                    key={i}
                    points={points}
                    fill="#1d4ed8"
                    stroke="#1e40af"
                    strokeWidth={1}
                  />
                );
              }

              // Standard Subgroup Row: CI Line + Center Square
              const sqSize = Math.max(5, Math.min(12, 6 + (r.weight || 20) * 0.25));
              const isFavorable = r.hr < 1.0;

              return (
                <g key={i}>
                  {/* CI Error Bar */}
                  <line
                    x1={xLow}
                    y1={yCenter}
                    x2={xHigh}
                    y2={yCenter}
                    stroke={isFavorable ? "#0284c7" : "#ea580c"}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  />
                  {/* CI End Ticks */}
                  <line
                    x1={xLow}
                    y1={yCenter - 3}
                    x2={xLow}
                    y2={yCenter + 3}
                    stroke={isFavorable ? "#0284c7" : "#ea580c"}
                    strokeWidth={1.5}
                  />
                  <line
                    x1={xHigh}
                    y1={yCenter - 3}
                    x2={xHigh}
                    y2={yCenter + 3}
                    stroke={isFavorable ? "#0284c7" : "#ea580c"}
                    strokeWidth={1.5}
                  />
                  {/* Center Square */}
                  <rect
                    x={xHr - sqSize / 2}
                    y={yCenter - sqSize / 2}
                    width={sqSize}
                    height={sqSize}
                    fill={isFavorable ? "#2563eb" : "#f97316"}
                    rx={1.5}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Column: HR [95% CI] tabular numbers (15%~30% / 3 cols) */}
        <div className="col-span-3 sm:col-span-3 space-y-0 text-xs font-mono tabular-nums text-right pr-1">
          <div className="h-8 font-bold text-slate-400 uppercase tracking-wide flex items-center justify-end text-[10px]">
            HR (95% CI)
          </div>
          {rows.map((r, i) => (
            <div
              key={i}
              className={`h-8 flex items-center justify-end px-1 ${
                r.isHeader
                  ? "font-bold text-slate-400 text-[10px]"
                  : r.isSummary
                  ? "font-black text-blue-900 bg-blue-50/60 rounded-lg px-2 text-xs"
                  : "text-slate-800 font-semibold"
              }`}
            >
              {!r.isHeader && (
                <span>
                  {r.hr.toFixed(2)} [{r.ci_lower.toFixed(2)}-{r.ci_upper.toFixed(2)}]
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Citation Block */}
      {citation && (
        <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400">📖 Meta 分析出处：</span>
            <strong className="text-slate-800">{citation.metaTitle}</strong>
            <span>·</span>
            <span>{citation.journal} ({citation.year})</span>
            <span>·</span>
            <span className="font-mono tabular-nums">总样本量 n={citation.totalN}例</span>
          </div>

          {citation.doiUrl && (
            <a
              href={citation.doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
            >
              <span>查看原文 (DOI)</span>
              <span>↗</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
