"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  TestTube2, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  Table as TableIcon,
  CheckCircle2,
  Check,
  AlertTriangle,
  Pin
} from "lucide-react";
import type { TumorMarkersData } from "@/lib/types";
import { evaluateTumorMarkers, TUMOR_MARKER_DEFINITIONS } from "@/lib/tumorMarkers";
import { GlossaryTooltip } from "@/components/common/GlossaryTooltip";

interface TumorMarkersCardProps {
  markers?: TumorMarkersData | null;
  markersHistory?: TumorMarkersData[] | null;
  gender?: "female" | "male" | string | null;
  cancerType?: "lung" | "breast" | "colorectal" | string | null;
  defaultView?: "snapshot" | "trend";
}

interface TrendPoint {
  date: string;
  value: number;
  hospital?: string;
  note?: string;
}

export function TumorMarkersCard({
  markers,
  markersHistory,
  gender,
  cancerType = "lung",
  defaultView = "snapshot"
}: TumorMarkersCardProps) {
  const [activeTab, setActiveTab] = useState<"snapshot" | "trend">(defaultView);
  const [showFactors, setShowFactors] = useState(false);
  const [trendSubView, setTrendSubView] = useState<"chart" | "table">("chart");
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const isBreast = cancerType === "breast";

  // 1. Current Snapshot Evaluations
  const evaluations = useMemo(() => {
    return evaluateTumorMarkers(markers, gender, cancerType);
  }, [markers, gender, cancerType]);

  const hasData = evaluations.length > 0;
  const isAllNormal = hasData && evaluations.every((item) => item.status === "normal");

  // 2. Aggregate Historical Trend Data (from props or local timeline events)
  const allHistoricalRecords = useMemo<TumorMarkersData[]>(() => {
    const list: TumorMarkersData[] = [];
    const seenDates = new Set<string>();

    // Add from props history
    if (Array.isArray(markersHistory)) {
      markersHistory.forEach((m) => {
        const d = m.testDate || "未知日期";
        if (!seenDates.has(d)) {
          seenDates.add(d);
          list.push(m);
        }
      });
    }

    // Add current snapshot if not yet in list
    if (markers && markers.testDate && !seenDates.has(markers.testDate)) {
      seenDates.add(markers.testDate);
      list.push(markers);
    } else if (markers && list.length === 0) {
      list.push(markers);
    }

    // Attempt to merge from timeline serology events stored in localStorage
    if (typeof window !== "undefined") {
      try {
        const rawTimeline = localStorage.getItem("oncopath_timeline_events");
        if (rawTimeline) {
          const events = JSON.parse(rawTimeline);
          if (Array.isArray(events)) {
            events.forEach((evt: any) => {
              if (evt.category === "serology" && evt.keyFindings) {
                const d = evt.eventDate || "未知日期";
                if (!seenDates.has(d)) {
                  seenDates.add(d);
                  list.push({
                    testDate: d,
                    hospital: evt.hospital,
                    cea: evt.keyFindings.cea,
                    cyfra211: evt.keyFindings.cyfra211,
                    nse: evt.keyFindings.nse,
                    scc: evt.keyFindings.scc,
                    proGrp: evt.keyFindings.proGrp,
                    ca125: evt.keyFindings.ca125,
                    ca199: evt.keyFindings.ca199,
                    ca153: evt.keyFindings.ca153,
                    ferritin: evt.keyFindings.ferritin,
                  });
                }
              }
            });
          }
        }
      } catch {}
    }

    // Sort chronologically ascending
    return list.sort((a, b) => {
      const timeA = a.testDate ? new Date(a.testDate).getTime() : 0;
      const timeB = b.testDate ? new Date(b.testDate).getTime() : 0;
      return timeA - timeB;
    });
  }, [markersHistory, markers]);

  // 3. Available marker keys across all records
  const availableMarkerKeys = useMemo(() => {
    const keys = new Set<string>();
    allHistoricalRecords.forEach((rec) => {
      Object.keys(TUMOR_MARKER_DEFINITIONS).forEach((k) => {
        const val = (rec as any)[k];
        if (val !== undefined && val !== null && !isNaN(Number(val))) {
          keys.add(k);
        }
      });
    });

    const list = Array.from(keys);
    if (list.length > 0) {
      // Prioritize cancer-relevant markers
      if (isBreast && list.includes("ca153")) {
        return ["ca153", ...list.filter((k) => k !== "ca153")];
      }
      if (!isBreast && list.includes("cea")) {
        return ["cea", ...list.filter((k) => k !== "cea")];
      }
      return list;
    }

    // Default fallback keys if no records
    return isBreast ? ["ca153", "cea", "ca125"] : ["cea", "cyfra211", "nse"];
  }, [allHistoricalRecords, isBreast]);

  const [activeMarkerKey, setActiveMarkerKey] = useState<string>(() => {
    if (isBreast && availableMarkerKeys.includes("ca153")) return "ca153";
    return availableMarkerKeys[0] || (isBreast ? "ca153" : "cea");
  });

  // Keep activeMarkerKey in sync if available keys change
  useEffect(() => {
    if (!availableMarkerKeys.includes(activeMarkerKey)) {
      setActiveMarkerKey(availableMarkerKeys[0] || (isBreast ? "ca153" : "cea"));
    }
  }, [availableMarkerKeys, isBreast, activeMarkerKey]);

  // 4. Points for current active marker
  const activeDef = TUMOR_MARKER_DEFINITIONS[activeMarkerKey] || TUMOR_MARKER_DEFINITIONS.cea;
  
  // Gender-specific ceiling
  let ceiling = activeDef.refMax;
  if (activeMarkerKey === "ferritin" && (gender === "female" || gender === "女")) {
    ceiling = 150.0;
  }

  const markerPoints = useMemo<TrendPoint[]>(() => {
    const pts: TrendPoint[] = [];
    allHistoricalRecords.forEach((rec) => {
      const rawVal = (rec as any)[activeMarkerKey];
      if (rawVal !== undefined && rawVal !== null && !isNaN(Number(rawVal))) {
        pts.push({
          date: rec.testDate || "基线记录",
          value: Number(rawVal),
          hospital: rec.hospital || undefined,
          note: rec.note || undefined,
        });
      }
    });
    return pts;
  }, [allHistoricalRecords, activeMarkerKey]);

  const latestPoint = markerPoints[markerPoints.length - 1];
  const isLatestSafe = latestPoint ? latestPoint.value <= ceiling : true;

  // SVG dimensions for trend chart
  const svgWidth = 560;
  const svgHeight = 160;
  const paddingX = 45;
  const paddingY = 25;
  const maxValue = Math.max(ceiling * 1.3, ...(markerPoints.map((p) => p.value) || [ceiling])) * 1.18;

  const getX = (idx: number) => {
    if (markerPoints.length <= 1) return svgWidth / 2;
    return paddingX + (idx * (svgWidth - paddingX * 2)) / (markerPoints.length - 1);
  };

  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(maxValue, val));
    return svgHeight - paddingY - (clamped / maxValue) * (svgHeight - paddingY * 2);
  };

  const safeBandY = getY(ceiling);
  const bottomY = svgHeight - paddingY;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200/90 shadow-sm space-y-5 hover:border-slate-300 transition-colors duration-200">
      
      {/* Header with View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
            isBreast ? "bg-pink-50 text-pink-600" : "bg-indigo-50 text-indigo-600"
          }`}>
            <TestTube2 className="w-4 h-4 shrink-0" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                {isBreast ? "乳腺肿瘤标志物监测与动态走势" : "血清肿瘤标志物监测与动态走势"}
              </h3>
              {markers?.testDate && activeTab === "snapshot" && (
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1 shrink-0 whitespace-nowrap bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{markers.testDate}</span>
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 truncate">
              {isBreast 
                ? "SERUM BIOMARKERS · CA15-3 / CEA · METABOLIC SAFETY BAND" 
                : "SERUM TUMOR BIOMARKERS · PANEL SNAPSHOT & TRENDS"}
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Snapshot vs Trend */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap shrink-0">
          {hasData && activeTab === "snapshot" && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 inline-flex items-center gap-1 ${
              isAllNormal 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-amber-50 text-amber-900 border-amber-200"
            }`}>
              {isAllNormal && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              <span>{isAllNormal ? "全部处于生理安全带" : `已录入 ${evaluations.length} 项生化指标`}</span>
            </span>
          )}

          <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("snapshot")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "snapshot"
                  ? "bg-white text-slate-900 shadow-xs font-extrabold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span>当前快照</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("trend")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "trend"
                  ? "bg-white text-slate-900 shadow-xs font-extrabold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
              <span>历次走势</span>
              {allHistoricalRecords.length > 1 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-indigo-100 text-indigo-700 rounded-full font-mono">
                  {allHistoricalRecords.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= VIEW 1: CURRENT SNAPSHOT ================= */}
      {activeTab === "snapshot" && (
        <>
          {!hasData ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <div className="flex justify-center mb-1">
                <TestTube2 className="w-8 h-8 text-slate-400" />
              </div>
              <div className="text-xs font-bold text-slate-800">暂未录入血液肿瘤标志物快照</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {isBreast ? (
                  <>若您的就诊化验单中包含 <strong>CA15-3 (糖类抗原 15-3)</strong>、<strong>CEA (癌胚抗原)</strong> 或 <strong>CA125</strong>，可点击顶部【修改/校准临床档案】录入，系统将自动进行良性排雷与生理波动定性。</>
                ) : (
                  <>若您的体检或就诊化验单中包含 <strong>CEA (癌胚抗原)</strong>、<strong>CYFRA21-1</strong> 或 <strong>NSE</strong>，可点击顶部【修改/校准临床档案】录入，系统将自动进行良性排雷与生理波动定性。</>
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Golden Principle Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-2 shadow-2xs">
                <div className="font-bold flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-900 font-extrabold text-xs sm:text-sm">
                      临床循证解读铁律与定心丸：
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowFactors(!showFactors)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-white/90 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <span>{showFactors ? "收起良性排查" : "查看良性波动原因"}</span>
                    {showFactors ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                  {isBreast ? (
                    <>
                      在正常参考区间（如 CA15-3 &lt; 25.0 U/mL，CEA &lt; 5.0 ng/mL）内的任何轻微起伏，<strong>均属于机体自然代谢与内分泌生理波动</strong>（良性乳腺小叶增生、轻度胃肠不适均可引起起伏），绝不代表病情恶化或复发！临床诊断与疗效评估始终以<strong>乳腺超声、钼靶与 MRI 影像为金标准</strong>。
                    </>
                  ) : (
                    <>
                      在正常参考区间（如 CEA &lt; 5.0 ng/mL，CYFRA21-1 &lt; 3.3 ng/mL）内的任何轻微数值起伏，<strong>均属于人体正常生理代谢波动</strong>（吸烟、轻微气道炎、胃肠炎均可引起轻度起伏），绝不代表病情恶化或复发！临床决策始终以<strong>胸部薄层 CT 影像为金标准</strong>。
                    </>
                  )}
                </p>

                {showFactors && (
                  <div className="pt-2.5 mt-2 border-t border-emerald-200/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-emerald-900 animate-fade-in">
                    <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 space-y-1">
                      <span className="font-bold flex items-center gap-1 text-emerald-800">
                        <Pin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{isBreast ? "良性增生与激素波动" : "吸烟与生活习惯"}</span>
                      </span>
                      <span className="leading-relaxed">
                        {isBreast 
                          ? "良性乳腺增生、经期前后或轻度内分泌调节均可伴随微幅生理起伏。" 
                          : "长期吸烟者 CEA 生理基线通常为 3.0~5.0 ng/mL，属良性非肿瘤状态。"}
                      </span>
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 space-y-1">
                      <span className="font-bold flex items-center gap-1 text-emerald-800">
                        <Pin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>良性炎性与代谢刺激</span>
                      </span>
                      <span className="leading-relaxed">
                        浅表胃炎、胆囊刺激或近期呼吸道轻微感染均可能引起单项指标一过性微浮。
                      </span>
                    </div>
                    <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 space-y-1">
                      <span className="font-bold flex items-center gap-1 text-emerald-800">
                        <Pin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>检验机台与批次系统差</span>
                      </span>
                      <span className="leading-relaxed">
                        不同医院化验设备及免疫发光检测试剂存在 ±10%~15% 正常设备容差。
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Marker Gauges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {evaluations.map((evalItem) => {
                  const maxGauge = evalItem.refMax * 1.8;
                  const percent = Math.min(100, (evalItem.value / maxGauge) * 100);
                  const isNormal = evalItem.status === "normal";

                  return (
                    <div
                      key={evalItem.key}
                      className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                        isNormal 
                          ? "bg-slate-50/80 border-slate-200 hover:border-emerald-300" 
                          : "bg-amber-50/40 border-amber-200 hover:border-amber-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                            <GlossaryTooltip term={evalItem.key === "cea" ? "CEA" : evalItem.key === "cyfra211" ? "CYFRA21-1" : evalItem.key === "nse" ? "NSE" : evalItem.nameZh}>
                              <span>{evalItem.nameZh}</span>
                            </GlossaryTooltip>
                          </div>
                          <div className="text-xs font-mono text-slate-400">生理安全带范围: {evalItem.refRange}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-base font-black font-mono tabular-nums ${
                            isNormal ? "text-emerald-700" : "text-amber-700"
                          }`}>
                            {evalItem.value} <span className="text-xs font-normal text-slate-500">{evalItem.unit}</span>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                            isNormal
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-amber-100 text-amber-900 border-amber-300"
                          }`}>
                            {evalItem.statusLabel}
                          </span>
                        </div>
                      </div>

                      {/* Visual Range Bar with Safety Band Highlight */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden relative border border-slate-200/80">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isNormal ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs font-mono tabular-nums text-slate-400">
                          <span>0</span>
                          <span className="text-emerald-700 font-bold">生理安全上限: {evalItem.refMax}</span>
                          <span>{maxGauge.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Plain Language Reassurance */}
                      <div className="text-xs text-slate-700 bg-white p-3 rounded-r-xl rounded-l-xs border border-slate-200/80 border-l-4 border-l-teal-600 leading-relaxed font-medium shadow-2xs">
                        {evalItem.reassuranceText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= VIEW 2: HISTORICAL TREND CHART & TABLE ================= */}
      {activeTab === "trend" && (
        <div className="space-y-4">
          {/* Sub-view Controller & Marker Selectors */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2">
            {/* Marker Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar flex-wrap">
              {availableMarkerKeys.map((key) => {
                const def = TUMOR_MARKER_DEFINITIONS[key];
                if (!def) return null;
                const isActive = activeMarkerKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveMarkerKey(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                      isActive
                        ? isBreast
                          ? "bg-pink-600 text-white border-pink-600 shadow-xs"
                          : "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {def.nameZh.split(" ")[0]}
                  </button>
                );
              })}
            </div>

            {/* Chart / Table Toggle (Standardized Segmented Capsule Dock) */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/90 text-xs font-bold self-start sm:self-auto shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => setTrendSubView("chart")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  trendSubView === "chart"
                    ? "bg-white text-slate-900 shadow-xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                <span>趋势折线</span>
              </button>
              <button
                type="button"
                onClick={() => setTrendSubView("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  trendSubView === "table"
                    ? "bg-white text-slate-900 shadow-xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 shrink-0" />
                <span>明细表格</span>
              </button>
            </div>
          </div>

          {/* Marker Clinical Baseline Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800">
                {activeDef.nameZh}
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                安全上限: ≤ {ceiling} {activeDef.unit}
              </span>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
              isLatestSafe 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLatestSafe ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span>{isLatestSafe ? "最新数值处于生理安全带" : "指标偏高 · 建议随访"}</span>
            </span>
          </div>

          {/* If 0 points recorded */}
          {markerPoints.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <TestTube2 className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">该指标尚无长程时序数据</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                您可通过上传新检查报告或在档案中修改录入历次化验结果，系统将自动汇总成折线走势。
              </p>
            </div>
          ) : markerPoints.length === 1 ? (
            /* Single Point Notice */
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-900">
                    已录入首期基线值：{latestPoint?.date}
                  </span>
                </div>
                <span className="text-sm font-black font-mono text-indigo-950">
                  {latestPoint?.value} {activeDef.unit}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                当前已建立 1 次血液指标基线。随着后续随访复查并追加化验单，系统将自动连线生成多期动态长程演进曲线，直观呈现指标与生理安全带的相对关系。
              </p>
            </div>
          ) : trendSubView === "chart" ? (
            /* SVG Trend Curve */
            <div className="space-y-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{activeDef.nameZh.split(" ")[0]} 动态长程轨迹</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (绿色阴影为生理安全带 ≤{ceiling})
                    </span>
                  </span>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300" />
                      <span>生理安全带</span>
                    </span>
                    <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>实测点</span>
                    </span>
                  </div>
                </div>

                <div className="relative overflow-x-auto">
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-36 min-w-[420px] overflow-visible">
                    {/* Semi-transparent Green Safety Band Area */}
                    <rect
                      x={paddingX}
                      y={safeBandY}
                      width={svgWidth - paddingX * 2}
                      height={bottomY - safeBandY}
                      fill="rgba(16, 185, 129, 0.08)"
                      stroke="rgba(16, 185, 129, 0.3)"
                      strokeDasharray="4 4"
                      rx="4"
                    />
                    <text
                      x={paddingX + 6}
                      y={safeBandY + 12}
                      fill="#059669"
                      fontSize="10"
                      fontWeight="bold"
                      className="select-none"
                    >
                      生理代谢安全带 (≤ {ceiling} {activeDef.unit})
                    </text>

                    {/* Grid Baseline */}
                    <line
                      x1={paddingX}
                      y1={bottomY}
                      x2={svgWidth - paddingX}
                      y2={bottomY}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />

                    {/* Trend Polyline */}
                    <polyline
                      fill="none"
                      stroke={isBreast ? "#db2777" : "#4f46e5"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={markerPoints.map((p, i) => `${getX(i)},${getY(p.value)}`).join(" ")}
                    />

                    {/* Data Points */}
                    {markerPoints.map((p, i) => {
                      const cx = getX(i);
                      const cy = getY(p.value);
                      const isPtSafe = p.value <= ceiling;
                      const isHovered = hoveredDate === p.date;

                      return (
                        <g 
                          key={i} 
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredDate(p.date)}
                          onMouseLeave={() => setHoveredDate(null)}
                        >
                          {isHovered && (
                            <>
                              <line
                                x1={cx}
                                y1={paddingY}
                                x2={cx}
                                y2={bottomY}
                                stroke={isBreast ? "#ec4899" : "#6366f1"}
                                strokeWidth="2"
                                strokeDasharray="3 3"
                              />
                              <circle
                                cx={cx}
                                cy={cy}
                                r="8"
                                fill={isBreast ? "#ec4899" : "#6366f1"}
                                fillOpacity="0.3"
                              />
                            </>
                          )}

                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? "6.5" : "4.5"}
                            fill={isPtSafe ? "#10b981" : "#f59e0b"}
                            stroke={isHovered ? (isBreast ? "#db2777" : "#4f46e5") : "#ffffff"}
                            strokeWidth={isHovered ? "3" : "2"}
                          />
                          <text
                            x={cx}
                            y={cy - 10}
                            textAnchor="middle"
                            fontSize={isHovered ? "11" : "10"}
                            fontWeight="bold"
                            fill={isHovered ? (isBreast ? "#9d174d" : "#4338ca") : isPtSafe ? "#047857" : "#b45309"}
                          >
                            {p.value}
                          </text>
                          <text
                            x={cx}
                            y={bottomY + 14}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight={isHovered ? "bold" : "normal"}
                            fill={isHovered ? (isBreast ? "#9d174d" : "#4338ca") : "#64748b"}
                            fontFamily="monospace"
                          >
                            {p.date.length > 5 ? p.date.slice(5) : p.date}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Grid Comparison Cards for Dates */}
              <div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                onMouseLeave={() => setHoveredDate(null)}
              >
                {markerPoints.map((pt, idx) => {
                  const ratio = (pt.value / ceiling) * 100;
                  const isSafe = pt.value <= ceiling;
                  const isHovered = hoveredDate === pt.date;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredDate(pt.date)}
                      className={`p-3.5 rounded-2xl border space-y-2 transition-all cursor-pointer ${
                        isHovered
                          ? isBreast
                            ? "bg-pink-50/90 border-pink-500 ring-2 ring-pink-300 shadow-md scale-102"
                            : "bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-300 shadow-md scale-102"
                          : "bg-slate-50 border-slate-200/70 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold font-mono tabular-nums ${isHovered ? "text-slate-900 underline" : "text-slate-700"}`}>
                          {pt.date}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-flex items-center gap-1 ${
                            isSafe 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isSafe && <Check className="w-2.5 h-2.5 shrink-0" />}
                          <span>{isSafe ? "正常" : "偏高"}</span>
                        </span>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-500 font-semibold">
                            {activeDef.nameZh.split(" ")[0]}
                          </span>
                          <span className={`text-sm font-black font-mono tabular-nums ${isSafe ? "text-emerald-700" : "text-amber-700"}`}>
                            {pt.value} <span className="text-[10px] font-normal text-slate-400">{activeDef.unit}</span>
                          </span>
                        </div>

                        <div className="w-full h-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isSafe ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.min(100, ratio)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">随访日期</th>
                    <th className="px-4 py-3">检测指标</th>
                    <th className="px-4 py-3">实测数值</th>
                    <th className="px-4 py-3">生理参考区间</th>
                    <th className="px-4 py-3">状态评估</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                  {markerPoints.map((pt, idx) => {
                    const isSafe = pt.value <= ceiling;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">{pt.date}</td>
                        <td className="px-4 py-3 font-sans text-slate-700">{activeDef.nameZh}</td>
                        <td className={`px-4 py-3 font-bold font-mono tabular-nums text-sm ${isSafe ? "text-emerald-700" : "text-amber-700"}`}>
                          {pt.value} {activeDef.unit}
                        </td>
                        <td className="px-4 py-3 text-slate-500 font-sans">{activeDef.refRange}</td>
                        <td className="px-4 py-3 font-sans">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold ${
                            isSafe ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {isSafe ? (
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            )}
                            <span>{isSafe ? "处于安全带" : "建议复查"}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

