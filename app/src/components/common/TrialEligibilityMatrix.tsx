"use client";

import React, { useState, useMemo } from "react";
import { Check, X, HelpCircle, Sparkles } from "lucide-react";

export type CriterionMatchStatus = "met" | "not_met" | "partial" | "unknown";

export interface TrialCriterion {
  id: string;
  criterion: string;      // 入组/排除条件描述
  type: "inclusion" | "exclusion";
  patientMatch: CriterionMatchStatus;
  importance: "mandatory" | "preferred" | "optional";
  detail?: string;        // 临床说明或患者档案匹配解释
}

export interface TrialEligibilityMatrixProps {
  trialTitle: string;
  phase?: string;         // 如 "Phase III" 或 "注册临床试验"
  criteria: TrialCriterion[];
  overallSummary?: string;
  onContactCrc?: () => void;
  className?: string;
}

const MATCH_STATUS_MAP: Record<CriterionMatchStatus, {
  bg: string;
  text: string;
  border: string;
  badge: string;
  icon: string;
  label: string;
}> = {
  met: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    icon: "✓",
    label: "符合",
  },
  not_met: {
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    badge: "bg-rose-100 text-rose-800 border-rose-300",
    icon: "✗",
    label: "不符合",
  },
  partial: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800 border-amber-300",
    icon: "~",
    label: "部分符合",
  },
  unknown: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-700 border-slate-300",
    icon: "?",
    label: "待专科确认",
  },
};

export function TrialEligibilityMatrix({
  trialTitle,
  phase = "Phase III",
  criteria,
  overallSummary,
  onContactCrc,
  className = "",
}: TrialEligibilityMatrixProps) {
  const [filterType, setFilterType] = useState<"all" | "inclusion" | "exclusion">("all");

  const filteredCriteria = useMemo(() => {
    if (filterType === "all") return criteria;
    return criteria.filter(c => c.type === filterType);
  }, [criteria, filterType]);

  // Calculate matching stats
  const totalMandatory = criteria.filter(c => c.importance === "mandatory").length;
  const metMandatory = criteria.filter(c => c.importance === "mandatory" && c.patientMatch === "met").length;
  const hasExclusionConflict = criteria.some(c => c.type === "exclusion" && c.patientMatch === "not_met");

  const matchPercent = Math.round(
    (criteria.filter(c => c.patientMatch === "met").length / Math.max(1, criteria.length)) * 100
  );

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0 ${className}`}>
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono">
                {phase}
              </span>
              <span className="text-xs text-slate-500 font-semibold">入排标准智能比对</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              {trialTitle}
            </h3>
          </div>

          {/* Match Score Indicator */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs self-start sm:self-auto">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">条件匹配度</div>
              <div className="text-base font-black font-mono tabular-nums text-slate-900">
                {matchPercent}%
                <span className="text-[10px] text-slate-500 font-normal ml-1">
                  ({criteria.filter(c => c.patientMatch === "met").length}/{criteria.length})
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              {hasExclusionConflict ? (
                <X className="w-5 h-5 text-rose-600" />
              ) : metMandatory === totalMandatory && totalMandatory > 0 ? (
                <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
              ) : (
                <HelpCircle className="w-5 h-5 text-amber-600" />
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-200/60 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              filterType === "all"
                ? "bg-slate-900 text-white font-bold"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            全部标准 ({criteria.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("inclusion")}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              filterType === "inclusion"
                ? "bg-blue-600 text-white font-bold"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            入组标准 ({criteria.filter(c => c.type === "inclusion").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("exclusion")}
            className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
              filterType === "exclusion"
                ? "bg-rose-600 text-white font-bold"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            排除标准 ({criteria.filter(c => c.type === "exclusion").length})
          </button>
        </div>
      </div>

      {/* Criteria Rows List */}
      <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredCriteria.map((item) => {
          const status = MATCH_STATUS_MAP[item.patientMatch];
          const isMandatory = item.importance === "mandatory";

          return (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 transition-colors flex items-start gap-3 hover:bg-slate-50/80 ${
                item.patientMatch === "not_met" && item.type === "inclusion" ? "bg-rose-50/20" : ""
              }`}
            >
              {/* Match Status Icon Badge */}
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border ${status.badge}`}
                aria-label={status.label}
              >
                {status.icon}
              </span>

              {/* Criterion Content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    item.type === "inclusion" ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-700"
                  }`}>
                    {item.type === "inclusion" ? "入组条件" : "排除条件"}
                  </span>

                  {isMandatory && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                      硬性关键条目
                    </span>
                  )}

                  <span className={`text-[11px] font-bold ${status.text}`}>
                    {status.label}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${isMandatory ? "font-bold text-slate-900" : "text-slate-800"}`}>
                  {item.criterion}
                </p>

                {item.detail && (
                  <p className="text-[11px] text-slate-500 leading-normal bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-600">匹配解析：</span>
                    {item.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="text-slate-600">
          {overallSummary || (
            <span>
              已结合患者临床档案完成智能初筛，最终入组资格以试验中心 PI（主要研究者）签署的筛选访视评估为准。
            </span>
          )}
        </div>

        {onContactCrc && (
          <button
            type="button"
            onClick={onContactCrc}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>咨询试验协调员 (CRC)</span>
          </button>
        )}
      </div>
    </div>
  );
}
