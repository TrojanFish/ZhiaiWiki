"use client";

import React, { useState } from "react";
import { useHydrated } from "@/lib/useHydrated";
import { Info, HelpCircle } from "lucide-react";

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
  timeUnit?: string;      // 默认 "月 (Months)"
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
      <div className={`w-full aspect-[16/9] rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-xs ${className}`}>
        <span>临床生存曲线加载中...</span>
      </div>
    );
  }

  // Calculate scales
  const allTimes = series.flatMap(s => s.data.map(d => d.time));
  const maxTimeRaw = Math.max(12, ...allTimes);
  // Round up to nice number (multiple of 6 or 12)
  const maxTime = Math.ceil(maxTimeRaw / 6) * 6;

  const svgWidth = 600;
  const svgHeight = 280;
  const pad = { top: 25, right: 30, bottom: 40, left: 50 };

  const plotW = svgWidth - pad.left - pad.right;
  const plotH = svgHeight - pad.top - pad.bottom;

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
    <div className={`bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold">
              Kaplan-Meier 统计图
            </span>
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {/* Statistical Summary Badges */}
        {series.some(s => s.hr) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {series.filter(s => s.hr).map((s, idx) => (
              <div key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono tabular-nums">
                <span className="font-bold text-slate-900">HR {s.hr}</span>
                {s.hrCI && <span className="text-slate-500 text-[10px]">[{s.hrCI[0]}-{s.hrCI[1]}]</span>}
                {s.pValue && <span className="text-blue-600 text-[10px] font-bold">p{s.pValue}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[500px] h-auto select-none"
          role="img"
          aria-label={`${title} 生存曲线图`}
        >
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
                strokeDasharray={yVal === 0.5 ? "4 4" : "none"}
              />
              <text
                x={pad.left - 8}
                y={toY(yVal) + 3.5}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-400 font-medium"
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
            stroke="#cbd5e1"
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* X axis ticks & labels */}
          {timeTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={toX(t)}
                y1={pad.top}
                x2={toX(t)}
                y2={svgHeight - pad.bottom}
                stroke="#f8fafc"
                strokeWidth={1}
              />
              <line
                x1={toX(t)}
                y1={svgHeight - pad.bottom}
                x2={toX(t)}
                y2={svgHeight - pad.bottom + 4}
                stroke="#cbd5e1"
                strokeWidth={1}
              />
              <text
                x={toX(t)}
                y={svgHeight - pad.bottom + 16}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-500 font-medium"
              >
                {t}
              </text>
            </g>
          ))}

          {/* Axes Base Lines */}
          <line
            x1={pad.left}
            y1={svgHeight - pad.bottom}
            x2={svgWidth - pad.right}
            y2={svgHeight - pad.bottom}
            stroke="#94a3b8"
            strokeWidth={1.5}
          />
          <line
            x1={pad.left}
            y1={pad.top}
            x2={pad.left}
            y2={svgHeight - pad.bottom}
            stroke="#94a3b8"
            strokeWidth={1.5}
          />

          {/* Y Axis Label */}
          <text
            x={15}
            y={pad.top - 10}
            className="text-[10px] fill-slate-500 font-semibold"
          >
            {endpointLabel}
          </text>

          {/* X Axis Label */}
          <text
            x={svgWidth - pad.right}
            y={svgHeight - 10}
            textAnchor="end"
            className="text-[10px] fill-slate-500 font-semibold"
          >
            {timeUnit}
          </text>

          {/* CI Area Bands */}
          {series.map((s, idx) => {
            const ciPath = buildCIAreaPath(s.data);
            if (!ciPath) return null;
            return (
              <path
                key={`ci-${idx}`}
                d={ciPath}
                fill={s.fillColor || s.color}
                opacity={activeSeriesIdx === null || activeSeriesIdx === idx ? 0.12 : 0.04}
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
                  strokeWidth={activeSeriesIdx === idx ? 3.5 : 2.5}
                  strokeDasharray={s.strokeDasharray || "none"}
                  opacity={isDimmed ? 0.35 : 1}
                  className="transition-all duration-200"
                />

                {/* Median OS vertical dashed guide */}
                {s.medianOS && s.medianOS <= maxTime && (
                  <g opacity={isDimmed ? 0.2 : 0.8}>
                    <line
                      x1={toX(s.medianOS)}
                      y1={toY(0.5)}
                      x2={toX(s.medianOS)}
                      y2={svgHeight - pad.bottom}
                      stroke={s.color}
                      strokeWidth={1.2}
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={toX(s.medianOS)}
                      cy={toY(0.5)}
                      r={3}
                      fill={s.color}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Series Legend Controller */}
      <div className="flex items-center gap-4 flex-wrap pt-1 text-xs">
        {series.map((s, idx) => {
          const isSelected = activeSeriesIdx === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSeriesIdx(isSelected ? null : idx)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <span
                className="w-3.5 h-1 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="font-bold">{s.label}</span>
              {s.medianOS && (
                <span className={`text-[10px] font-mono tabular-nums ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                  中位: {s.medianOS}月
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* At-Risk Table (Nordhealth Compact Density Table) */}
      <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50/60 p-2.5">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center justify-between">
          <span>随访患者在访例数 (Number at Risk Table)</span>
          <span className="text-slate-400 font-normal">时间节点以月为单位</span>
        </div>
        <table className="w-full text-left text-xs font-mono tabular-nums">
          <thead>
            <tr className="border-b border-slate-200/60 text-[10px] text-slate-400 font-semibold">
              <th className="py-1 px-2 font-sans">组别</th>
              {timeTicks.map(t => (
                <th key={t} className="py-1 px-2 text-right">{t}月</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px]">
            {series.map((s, idx) => (
              <tr key={idx} className="hover:bg-white/80 transition-colors">
                <td className="py-1 px-2 font-sans font-medium text-slate-700 truncate max-w-[140px]">
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: s.color }} />
                  {s.label}
                </td>
                {timeTicks.map(t => {
                  // Find nearest data point <= t
                  const pts = s.data.filter(p => p.time <= t);
                  const nearest = pts[pts.length - 1];
                  const riskVal = nearest?.at_risk ?? (t === 0 ? s.nEnrolled : "-");
                  return (
                    <td key={t} className="py-1 px-2 text-right text-slate-600 font-semibold">
                      {riskVal ?? "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NHS.UK Plain-Language Health Literacy Reassurance Card */}
      {plainExplanation && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3">
          <span className="text-2xl shrink-0 mt-0.5" role="img" aria-label="灯泡">💡</span>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-sky-900">这张生存曲线告诉我们什么？（通俗白话解读）</h4>
            <p className="text-xs text-sky-800 leading-relaxed font-medium">
              {plainExplanation}
            </p>
          </div>
        </div>
      )}

      {/* Four-Element Citation Block */}
      {citation && (
        <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400">📖 循证出处：</span>
            <strong className="text-slate-800">{citation.trialName}</strong>
            <span>·</span>
            <span>{citation.journal} ({citation.year})</span>
            <span>·</span>
            <span className="font-mono tabular-nums">n={citation.sampleSize}例</span>
            <span>·</span>
            <span className="text-slate-700 font-medium">{citation.primaryEndpoint}</span>
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
