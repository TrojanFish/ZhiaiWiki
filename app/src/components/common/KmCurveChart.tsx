"use client";

import React, { useState } from "react";
import { useHydrated } from "@/lib/useHydrated";

export interface KMDataPoint {
  time: number;           // 随访时间（月，Month）
  survival: number;       // 生存概率（0~1，KM 估计值）
  ci_lower?: number;      // 95% 置信区间下界
  ci_upper?: number;      // 95% 置信区间上界
  at_risk?: number;       // 该时间点仍在随访的患者数
  events?: number;        // 事件数
}

export interface KMSeries {
  label: string;          // 组别标签（如 "奥希替尼 (FLAURA2)"）
  color: string;          // 线条主色 Hex 或 CSS 变量
  fillColor?: string;     // CI 阴影颜色
  strokeDasharray?: string; // 线型 ("none", "6 4", "2 3")
  data: KMDataPoint[];
  medianOS?: number;      // 中位生存期（月）
  hr?: number;            // 风险比
  hrCI?: [number, number];// HR 95% CI
  pValue?: string;        // p 值 (如 "<0.001")
  trialName?: string;     // 试验名称
  nEnrolled?: number;     // 入组样本量
}

export interface KmCurveChartProps {
  title: string;
  subtitle?: string;
  endpointLabel?: string; // 如 "无进展生存率 (PFS)" 或 "总生存率 (OS)"
  timeUnit?: string;      // 默认 "随访时间 (月)"
  series: KMSeries[];
  plainExplanation?: string; // NHS 白话解读卡
  citation?: {
    trialName: string;
    journal: string;
    year: string | number;
    sampleSize: number | string;
    primaryEndpoint: string;
    doiUrl?: string;
  };
  className?: string;
}

export function KmCurveChart({
  title,
  subtitle,
  endpointLabel = "生存概率 (%)",
  timeUnit = "随访时间 (月)",
  series,
  plainExplanation,
  citation,
  className = "",
}: KmCurveChartProps) {
  const isHydrated = useHydrated();
  const [activeSeriesIdx, setActiveSeriesIdx] = useState<number | null>(null);

  if (!isHydrated) {
    return (
      <div className={`w-full aspect-[16/9] rounded-3xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-xs ${className}`}>
        <span>临床生存曲线加载中...</span>
      </div>
    );
  }

  // Calculate scales
  const allTimes = series.flatMap(s => s.data.map(d => d.time));
  const maxTimeRaw = Math.max(12, ...allTimes);
  const maxTime = Math.ceil(maxTimeRaw / 6) * 6;

  // 高清医学视口坐标系 (860 x 415)
  const svgWidth = 860;
  const svgHeight = 415;
  const pad = { top: 35, right: 35, bottom: 125, left: 65 };

  const plotW = svgWidth - pad.left - pad.right;
  const plotH = svgHeight - pad.top - pad.bottom; // 255

  const toX = (t: number) => pad.left + (t / maxTime) * plotW;
  const toY = (s: number) => pad.top + (1 - s) * plotH;

  // Build step-after path for KM curves
  const buildStepPath = (points: KMDataPoint[]) => {
    if (points.length === 0) return "";
    let d = `M ${toX(points[0].time)} ${toY(points[0].survival)}`;
    for (let i = 1; i < points.length; i++) {
      const px = toX(points[i].time);
      const py = toY(points[i].survival);
      d += ` H ${px} V ${py}`;
    }
    return d;
  };

  // Build CI Area path if ci available
  const buildCIAreaPath = (points: KMDataPoint[]) => {
    const valid = points.filter(p => p.ci_lower !== undefined && p.ci_upper !== undefined);
    if (valid.length < 2) return "";
    let d = `M ${toX(valid[0].time)} ${toY(valid[0].ci_upper!)}`;
    for (let i = 1; i < valid.length; i++) {
      d += ` H ${toX(valid[i].time)} V ${toY(valid[i].ci_upper!)}`;
    }
    for (let i = valid.length - 1; i >= 0; i--) {
      d += ` H ${toX(valid[i].time)} V ${toY(valid[i].ci_lower!)}`;
    }
    d += " Z";
    return d;
  };

  // Time ticks for X axis
  const tickStep = maxTime <= 24 ? 6 : maxTime <= 60 ? 12 : 24;
  const timeTicks: number[] = [];
  for (let t = 0; t <= maxTime; t += tickStep) {
    timeTicks.push(t);
  }

  // Y axis ticks (0%, 20%, 40%, 60%, 80%, 100%)
  const yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className={`bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-5 ${className}`}>
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Kaplan-Meier 循证曲线
            </span>
            {citation && (
              <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
                {citation.journal} ({citation.year}) · RCT
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Statistical Summary Callout Chip */}
        {series.some(s => s.hr) && (
          <div className="flex items-center gap-2 shrink-0">
            {series.filter(s => s.hr).map((s, idx) => (
              <div key={idx} className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200/80 shadow-2xs">
                <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                  复发风险降低 (HR)
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5 font-mono">
                  <span className="text-base sm:text-lg font-black text-blue-950">
                    {Math.round((1 - s.hr) * 100)}%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    (HR {s.hr})
                  </span>
                  {s.pValue && (
                    <span className="text-[10px] font-bold text-emerald-600">
                      p{s.pValue}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Interactive Segmented Pill Legend ─── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs max-w-full overflow-x-auto">
          {series.map((s, idx) => {
            const isSelected = activeSeriesIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSeriesIdx(isSelected ? null : idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 select-none ${
                  isSelected
                    ? "bg-white text-slate-900 shadow-xs ring-1 ring-black/5"
                    : activeSeriesIdx !== null
                    ? "text-slate-400 hover:text-slate-700"
                    : "text-slate-700 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <span
                  className="w-3 h-1 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span>{s.label}</span>
                {s.medianOS && (
                  <span className="text-[10px] font-mono text-slate-400 font-normal">
                    中位: {s.medianOS}月
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 font-medium hidden sm:flex items-center gap-1">
          <span>💡 点击分组可高亮聚焦单组曲线</span>
        </div>
      </div>

      {/* ─── High-Definition SVG Canvas ─── */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[650px] h-auto select-none"
          role="img"
          aria-label={`${title} 生存曲线图`}
        >
          <g style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', sans-serif" }}>
            {/* Background grid */}
            {yTicks.map((yVal, i) => (
              <g key={i}>
                <line
                  x1={pad.left}
                  y1={toY(yVal)}
                  x2={svgWidth - pad.right}
                  y2={toY(yVal)}
                  stroke="#f1f5f9"
                  strokeWidth={1}
                />
                <text
                  x={pad.left - 10}
                  y={toY(yVal) + 3.5}
                  textAnchor="end"
                  fontSize="11"
                  fill="#94a3b8"
                  fontWeight="500"
                >
                  {Math.round(yVal * 100)}%
                </text>
              </g>
            ))}

            {/* 50% Median Line indicator */}
            <line
              x1={pad.left}
              y1={toY(0.5)}
              x2={svgWidth - pad.right}
              y2={toY(0.5)}
              stroke="#e2e8f0"
              strokeWidth={1}
              strokeDasharray="4 4"
            />

            {/* X axis ticks & vertical guides */}
            {timeTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={toX(t)}
                  y1={pad.top}
                  x2={toX(t)}
                  y2={pad.top + plotH}
                  stroke="#f8fafc"
                  strokeWidth={1}
                />
                <line
                  x1={toX(t)}
                  y1={pad.top + plotH}
                  x2={toX(t)}
                  y2={pad.top + plotH + 5}
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                />
                <text
                  x={toX(t)}
                  y={pad.top + plotH + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748b"
                  fontWeight="600"
                >
                  {t}
                </text>
              </g>
            ))}

            {/* Axes Base Lines */}
            <line
              x1={pad.left}
              y1={pad.top + plotH}
              x2={svgWidth - pad.right}
              y2={pad.top + plotH}
              stroke="#cbd5e1"
              strokeWidth={1.5}
            />
            <line
              x1={pad.left}
              y1={pad.top}
              x2={pad.left}
              y2={pad.top + plotH}
              stroke="#cbd5e1"
              strokeWidth={1.5}
            />

            {/* Y Axis Label */}
            <text
              x={pad.left - 10}
              y={pad.top - 12}
              textAnchor="start"
              fontSize="11"
              fill="#475569"
              fontWeight="700"
            >
              {endpointLabel}
            </text>

            {/* X Axis Label */}
            <text
              x={svgWidth - pad.right}
              y={pad.top + plotH + 18}
              textAnchor="end"
              fontSize="11"
              fill="#475569"
              fontWeight="700"
            >
              {timeUnit}
            </text>

            {/* CI Area Bands (Soft 6% opacity) */}
            {series.map((s, idx) => {
              const ciPath = buildCIAreaPath(s.data);
              if (!ciPath) return null;
              return (
                <path
                  key={`ci-${idx}`}
                  d={ciPath}
                  fill={s.fillColor || s.color}
                  opacity={activeSeriesIdx === null || activeSeriesIdx === idx ? 0.08 : 0.02}
                  className="transition-opacity duration-200"
                />
              );
            })}

            {/* KM Curves */}
            {series.map((s, idx) => {
              const pathD = buildStepPath(s.data);
              const isDimmed = activeSeriesIdx !== null && activeSeriesIdx !== idx;
              return (
                <g key={`series-${idx}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={activeSeriesIdx === idx ? 3.0 : 2.25}
                    strokeDasharray={s.strokeDasharray || "none"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={isDimmed ? 0.25 : 1}
                    className="transition-all duration-200"
                  />

                  {/* Median OS indicator */}
                  {s.medianOS && s.medianOS <= maxTime && (
                    <g opacity={isDimmed ? 0.2 : 0.9}>
                      <line
                        x1={toX(s.medianOS)}
                        y1={toY(0.5)}
                        x2={toX(s.medianOS)}
                        y2={pad.top + plotH}
                        stroke={s.color}
                        strokeWidth={1.25}
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={toX(s.medianOS)}
                        cy={toY(0.5)}
                        r={3.5}
                        fill="#ffffff"
                        stroke={s.color}
                        strokeWidth={2}
                      />
                      <rect
                        x={toX(s.medianOS) + 5}
                        y={toY(0.5) - 16}
                        width={78}
                        height={16}
                        rx={4}
                        fill="#ffffff"
                        stroke={s.color}
                        strokeWidth={1}
                        opacity={0.95}
                      />
                      <text
                        x={toX(s.medianOS) + 44}
                        y={toY(0.5) - 4}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="700"
                        fill={s.color}
                      >
                        中位 {s.medianOS}月
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* ─── Integrated At-Risk Table Directly in SVG ─── */}
            {/* Divider line */}
            <line
              x1={pad.left - 45}
              y1={pad.top + plotH + 34}
              x2={svgWidth - pad.right}
              y2={pad.top + plotH + 34}
              stroke="#f1f5f9"
              strokeWidth={1}
            />

            {/* At Risk Table Header */}
            <text
              x={pad.left}
              y={pad.top + plotH + 52}
              fontSize="10"
              fontWeight="800"
              fill="#94a3b8"
              letterSpacing="0.05em"
            >
              随访在访例数 (NUMBER AT RISK)
            </text>

            {/* At Risk Table Rows */}
            {series.map((s, idx) => {
              const rowY = pad.top + plotH + 72 + idx * 22;
              const isDimmed = activeSeriesIdx !== null && activeSeriesIdx !== idx;
              return (
                <g key={`risk-row-${idx}`} opacity={isDimmed ? 0.3 : 1} className="transition-opacity">
                  <circle
                    cx={pad.left - 18}
                    cy={rowY - 3.5}
                    r={3}
                    fill={s.color}
                  />
                  <text
                    x={pad.left - 8}
                    y={rowY}
                    textAnchor="end"
                    fontSize="11"
                    fontWeight="600"
                    fill="#475569"
                  >
                    {s.label.split(/[(（]/)[0].trim().slice(0, 8)}
                  </text>
                  {timeTicks.map(t => {
                    const pts = s.data.filter(p => p.time <= t);
                    const nearest = pts[pts.length - 1];
                    const riskVal = nearest?.at_risk ?? (t === 0 ? s.nEnrolled : "-");
                    return (
                      <text
                        key={t}
                        x={toX(t)}
                        y={rowY}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="600"
                        fill="#334155"
                        fontFamily="monospace"
                      >
                        {riskVal ?? "-"}
                      </text>
                    );
                  })}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* ─── NHS.UK Plain-Language Health Literacy Reassurance Card ─── */}
      {plainExplanation && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50/80 via-blue-50/60 to-indigo-50/40 border border-sky-100 flex items-start gap-3.5 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 text-base shadow-2xs mt-0.5">
            💡
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-extrabold text-sky-950">
              这张生存曲线告诉我们什么？（通俗白话解读）
            </h4>
            <p className="text-xs text-sky-900 leading-relaxed font-medium">
              {plainExplanation}
            </p>
          </div>
        </div>
      )}

      {/* ─── Peer-Reviewed Four-Element Citation Block ─── */}
      {citation && (
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400">📖 顶刊循证出处：</span>
            <strong className="text-slate-900 font-bold">{citation.trialName}</strong>
            <span className="text-slate-300">·</span>
            <span>{citation.journal} ({citation.year})</span>
            <span className="text-slate-300">·</span>
            <span className="font-mono tabular-nums">n={citation.sampleSize}例</span>
            <span className="text-slate-300">·</span>
            <span className="text-blue-700 font-semibold">{citation.primaryEndpoint}</span>
          </div>

          {citation.doiUrl && (
            <a
              href={citation.doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-bold inline-flex items-center gap-1 shrink-0 transition-colors"
            >
              <span>查看 PubMed / DOI 原文</span>
              <span>↗</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
