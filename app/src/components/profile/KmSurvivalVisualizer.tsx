"use client";

import React, { useState } from "react";
import { ExternalLink, Info, Activity } from "lucide-react";
import type { ClinicalCohortResult, KmCurveArm } from "@/lib/staging";
import { getOrGenerateKmArms, getCohortTimeHorizon } from "@/lib/kmCurveHelper";

interface KmSurvivalVisualizerProps {
  cohort: ClinicalCohortResult;
}

export default function KmSurvivalVisualizer({ cohort }: KmSurvivalVisualizerProps) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const arms: KmCurveArm[] = getOrGenerateKmArms(cohort);
  const timeHorizon = getCohortTimeHorizon(cohort);
  const { maxMonth, months, isMedian, isExtended, medianMonths } = timeHorizon;

  const intervArm = arms.find((a) => a.isIntervention) || arms[0];
  const controlArm = arms.find((a) => !a.isIntervention) || arms[1];

  // SVG 坐标系尺寸常量
  const width = 560;
  const height = 210;
  const padLeft = 46;
  const padRight = 24;
  const padTop = 20;
  const padBottom = 32;

  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  // 坐标映射辅助函数（自适应时间轴跨度 maxMonth）
  const getX = (month: number) => padLeft + (Math.min(month, maxMonth) / maxMonth) * plotWidth;
  const getY = (rate: number) => padTop + (1 - rate / 100) * plotHeight;

  // 生成 Kaplan-Meier 阶梯折线 (Step Function Path)
  function makeStepPath(points: { month: number; rate: number }[]): string {
    if (!points || points.length === 0) return "";
    let d = `M ${getX(points[0].month)} ${getY(points[0].rate)}`;
    for (let i = 1; i < points.length; i++) {
      const prevY = getY(points[i - 1].rate);
      const currX = getX(points[i].month);
      const currY = getY(points[i].rate);
      // 阶梯线：先水平移动到新时间点，再垂直下降
      d += ` H ${currX} V ${currY}`;
    }
    return d;
  }

  // 生成 95% 置信区间阴影带路径 (Confidence Ribbon)
  function makeCiRibbon(points: { month: number; lowerCi?: number; upperCi?: number }[]): string {
    if (!points || points.length < 2) return "";
    let upperPath = `M ${getX(points[0].month)} ${getY(points[0].upperCi || 100)}`;
    for (let i = 1; i < points.length; i++) {
      upperPath += ` H ${getX(points[i].month)} V ${getY(points[i].upperCi || points[i].month)}`;
    }

    let lowerPath = "";
    for (let i = points.length - 1; i >= 0; i--) {
      lowerPath += ` L ${getX(points[i].month)} ${getY(points[i].lowerCi || points[i].month)}`;
    }

    return `${upperPath} ${lowerPath} Z`;
  }

  // 选中的点（默认取最大随访时间节点）
  const activeMonth = hoveredMonth ?? maxMonth;
  const activeIntervPoint = intervArm.points.find((p) => p.month === activeMonth) || intervArm.points[intervArm.points.length - 1];
  const activeCtrlPoint = controlArm?.points.find((p) => p.month === activeMonth) || controlArm?.points[controlArm.points.length - 1];

  // PubMed / DOI 链接构造
  const pubmedUrl = cohort.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${cohort.pmid}/` : null;
  const doiUrl = cohort.doi ? `https://doi.org/${cohort.doi}` : null;

  // 模型说明徽章文案
  const modelBadgeText = (() => {
    if (isExtended) return "10~12年超长随访模型 (TAILORx/RxPONDER)";
    if (isMedian) return "中位生存获益模型 (Lancet/NEJM规范)";
    return "双臂随机对照模型 (5年随访)";
  })();

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs mt-5 transition-all">
      {/* 头部标题与顶刊直达凭证 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pb-3 border-b border-slate-200/70">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>Kaplan-Meier 学术级生存随访曲线</span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                {modelBadgeText}
              </span>
            </h4>
          </div>
        </div>

        {/* 终点指标切换 & 文献直达按钮 */}
        <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
          {pubmedUrl && (
            <a
              href={pubmedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-blue-700 bg-white hover:bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 shadow-3xs transition-colors"
              title="在美国国家医学图书馆 PubMed 查看原始文献"
            >
              <span>PubMed:{cohort.pmid}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {doiUrl && (
            <a
              href={doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-teal-700 bg-white hover:bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 shadow-3xs transition-colors"
              title="在国际学术出版署 DOI 直达原文"
            >
              <span>DOI 原文</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* 图例与实时悬浮数据指示器 */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs mb-2">
        <div className="flex items-center gap-3.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-sky-700">
            <span className="w-3.5 h-0.5 bg-sky-600 rounded-full inline-block" />
            <span>{intervArm.armName}</span>
          </div>
          {controlArm && (
            <div className="flex items-center gap-1.5 font-semibold text-slate-500">
              <span className="w-3.5 h-0.5 bg-slate-400 border-b border-dashed border-slate-400 inline-block" />
              <span>{controlArm.armName}</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500 font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-3xs">
          随访: <strong>{activeMonth}</strong> 个月 | 试验组: <strong className="text-sky-700">{activeIntervPoint.rate}%</strong>
          {activeCtrlPoint && (
            <span> (对照: <strong className="text-slate-600">{activeCtrlPoint.rate}%</strong>)</span>
          )}
          {cohort.hazardRatio && (
            <span className="ml-2 text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
              HR: {cohort.hazardRatio}
            </span>
          )}
        </div>
      </div>

      {/* SVG 矢量绘制画布 */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredMonth(null)}
        >
          {/* 背景网格线与 Y 轴刻度 */}
          {[0, 25, 50, 75, 100].map((rate) => {
            const y = getY(rate);
            return (
              <g key={rate}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={rate === 0 || rate === 100 ? "" : "3 3"}
                />
                <text
                  x={padLeft - 6}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9.5"
                  fill="#64748b"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {rate}%
                </text>
              </g>
            );
          })}

          {/* X 轴动态月份刻度线 */}
          {months.map((m) => {
            const x = getX(m);
            return (
              <g key={m}>
                <line
                  x1={x}
                  y1={height - padBottom}
                  x2={x}
                  y2={height - padBottom + 4}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - padBottom + 16}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#64748b"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {m}m
                </text>
              </g>
            );
          })}

          {/* X 轴轴名（体现时间跨度） */}
          <text
            x={padLeft + plotWidth / 2}
            y={height - 2}
            textAnchor="middle"
            fontSize="10"
            fill="#475569"
            fontWeight="bold"
          >
            {maxMonth >= 120 
              ? "随访时间 (Time in Months · 10年长期随访)" 
              : maxMonth <= 36 
              ? "随访时间 (Time in Months · 3年中位生存窗口)" 
              : "随访时间 (Time in Months · 5年标准随访)"}
          </text>

          {/* 95% 置信区间透明浅色填充带 */}
          <path
            d={makeCiRibbon(intervArm.points)}
            fill="#0284c7"
            fillOpacity="0.08"
          />

          {/* 对照组阶梯曲线 */}
          {controlArm && (
            <path
              d={makeStepPath(controlArm.points)}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
          )}

          {/* 试验组阶梯曲线 */}
          <path
            d={makeStepPath(intervArm.points)}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* 中位生存截距虚线与交点 (Lancet/NEJM 顶刊标准) */}
          {isMedian && medianMonths && medianMonths <= maxMonth && (
            <g>
              <line
                x1={padLeft}
                y1={getY(50)}
                x2={getX(medianMonths)}
                y2={getY(50)}
                stroke="#d97706"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <line
                x1={getX(medianMonths)}
                y1={getY(50)}
                x2={getX(medianMonths)}
                y2={height - padBottom}
                stroke="#d97706"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(medianMonths)}
                cy={getY(50)}
                r="3.5"
                fill="#d97706"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <rect
                x={getX(medianMonths) - 26}
                y={getY(50) - 18}
                width={52}
                height={14}
                rx={3}
                fill="#fffbeb"
                stroke="#fcd34d"
                strokeWidth="0.8"
              />
              <text
                x={getX(medianMonths)}
                y={getY(50) - 7}
                textAnchor="middle"
                fontSize="8.5"
                fill="#b45309"
                fontFamily="monospace"
                fontWeight="bold"
              >
                mOS {medianMonths}m
              </text>
            </g>
          )}

          {/* 交互探针高亮竖线 */}
          {hoveredMonth != null && (
            <g>
              <line
                x1={getX(hoveredMonth)}
                y1={padTop}
                x2={getX(hoveredMonth)}
                y2={height - padBottom}
                stroke="#0284c7"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoveredMonth)}
                cy={getY(activeIntervPoint.rate)}
                r="4.5"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="2"
              />
              {activeCtrlPoint && (
                <circle
                  cx={getX(hoveredMonth)}
                  cy={getY(activeCtrlPoint.rate)}
                  r="3.5"
                  fill="#94a3b8"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              )}
            </g>
          )}

          {/* 交互热区触发器 (透明竖直矩形) */}
          {months.map((m) => {
            const x = getX(m);
            return (
              <rect
                key={m}
                x={x - 20}
                y={padTop}
                width={40}
                height={plotHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredMonth(m)}
                onTouchStart={() => setHoveredMonth(m)}
              />
            );
          })}
        </svg>
      </div>

      {/* 顶刊标志性 Number at Risk (风险受试例数表) */}
      <div className="mt-2.5 pt-2.5 border-t border-slate-200/80">
        <div className="text-[10px] font-bold text-slate-500 mb-1.5 flex items-center justify-between">
          <span className="uppercase tracking-wider">Number at Risk (随访例数表 · NEJM/Lancet 规范)</span>
          <span className="text-slate-400 font-normal">点击曲线上方月份探查对应时点</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10.5px] font-mono text-slate-600 border-collapse">
            <tbody>
              {/* 试验组 At Risk 行 */}
              <tr className="border-b border-slate-100">
                <td className="py-1 text-sky-800 font-bold whitespace-nowrap pr-2">
                  试验组
                </td>
                {months.map((m) => {
                  const pt = intervArm.points.find((p) => p.month === m);
                  const isCur = m === activeMonth;
                  return (
                    <td
                      key={m}
                      className={`text-center py-1 px-1.5 transition-colors cursor-pointer ${
                        isCur ? "bg-sky-100/70 text-sky-900 font-black rounded" : ""
                      }`}
                      onClick={() => setHoveredMonth(m)}
                    >
                      {pt?.atRisk ?? "-"}
                    </td>
                  );
                })}
              </tr>

              {/* 对照组 At Risk 行 */}
              {controlArm && (
                <tr>
                  <td className="py-1 text-slate-500 font-medium whitespace-nowrap pr-2">
                    对照组
                  </td>
                  {months.map((m) => {
                    const pt = controlArm.points.find((p) => p.month === m);
                    const isCur = m === activeMonth;
                    return (
                      <td
                        key={m}
                        className={`text-center py-1 px-1.5 transition-colors cursor-pointer ${
                          isCur ? "bg-slate-200/70 text-slate-900 font-bold rounded" : ""
                        }`}
                        onClick={() => setHoveredMonth(m)}
                      >
                        {pt?.atRisk ?? "-"}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 底部学术方法论与防行医客观说明 */}
      <div className="mt-3 p-2.5 bg-white rounded-xl border border-slate-200/70 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span>
            本曲线系依据国际同行评议前瞻性临床试验（如 {cohort.source}）随访终点数据建立的客观统计学拟合模型。阴影区域代表 95% 置信区间 (95% CI)。统计概率体现的是具有相似临床特征的患者群体宏观科研趋势，<strong>仅供学术文献参考，严禁作为个体化医学处方依据</strong>。
          </span>
        </div>
      </div>
    </div>
  );
}
