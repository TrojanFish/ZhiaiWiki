"use client";

import React from "react";
import type { CancerType, PatientProfile } from "@/lib/types";
import { CancerIcon } from "@/components/common/CancerIcons";
import { Plus, CheckCircle2, ArrowRightLeft } from "lucide-react";

interface DualPrimarySwitcherProps {
  activeSlot: CancerType;
  availableSlots: CancerType[];
  lungProfile?: PatientProfile | null;
  breastProfile?: PatientProfile | null;
  onSelectSlot: (slot: CancerType) => void;
  onAddSecondCancer?: () => void;
  className?: string;
}

export default function DualPrimarySwitcher({
  activeSlot,
  availableSlots,
  lungProfile,
  breastProfile,
  onSelectSlot,
  onAddSecondCancer,
  className = "",
}: DualPrimarySwitcherProps) {
  const effectiveSlots = React.useMemo(() => {
    return Array.from(new Set([...(availableSlots || []), activeSlot])).filter(Boolean) as CancerType[];
  }, [availableSlots, activeSlot]);

  const isMultiPrimary = effectiveSlots.length >= 2;

  // Format summaries
  const lungSummary = React.useMemo(() => {
    if (!lungProfile) return { stage: "未建档", label: "肺部病案待建立", isComplete: false };
    const stg = lungProfile.stage || lungProfile.tStage || "待评估";
    const hist = lungProfile.histology || (lungProfile.noduleType === "pure_ggo" ? "磨玻璃结节" : "肺部占位");
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: `${hist}`,
      isComplete: Boolean(lungProfile.stage || lungProfile.tStage),
    };
  }, [lungProfile]);

  const breastSummary = React.useMemo(() => {
    if (!breastProfile) return { stage: "未建档", label: "乳腺病案待建立", isComplete: false };
    const stg = (breastProfile as any).prognosticStage || breastProfile.stage || breastProfile.tStage || ((breastProfile as any).biRads ? `BI-RADS ${(breastProfile as any).biRads}` : "待评估");
    const subtype = (breastProfile as any).molecularSubtype 
      ? (breastProfile as any).molecularSubtype.replace(/_/g, " ") 
      : ((breastProfile as any).histologyType || "乳腺病变");
    return {
      stage: stg.includes("期") || stg.includes("BI-RADS") ? stg : `${stg}期`,
      label: `${subtype}`,
      isComplete: Boolean(breastProfile.stage || (breastProfile as any).biRads),
    };
  }, [breastProfile]);

  const slotConfigs: Record<CancerType, {
    title: string;
    summary: { stage: string; label: string; isComplete: boolean };
    activeCardClass: string;
    inactiveCardClass: string;
    activeIconClass: string;
    inactiveIconClass: string;
    badgeClass: string;
    textColor: string;
    checkColor: string;
  }> = {
    lung: {
      title: "原发性肺恶性肿瘤",
      summary: lungSummary,
      activeCardClass: "bg-white border-sky-400 ring-2 ring-sky-400/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-sky-300",
      activeIconClass: "bg-sky-100 text-sky-600 border-sky-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-sky-100 text-sky-700",
      textColor: "text-sky-700",
      checkColor: "text-sky-600",
    },
    breast: {
      title: "原发性乳腺恶性肿瘤",
      summary: breastSummary,
      activeCardClass: "bg-white border-pink-400 ring-2 ring-pink-400/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-pink-300",
      activeIconClass: "bg-pink-100 text-pink-600 border-pink-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-pink-100 text-pink-700",
      textColor: "text-pink-700",
      checkColor: "text-pink-600",
    },
  };

  // 1. 多原发患者专案切换器 (Multi-Primary Mode)
  if (isMultiPrimary) {
    const gridCols = effectiveSlots.length === 2 
      ? "grid-cols-1 sm:grid-cols-2" 
      : "grid-cols-1";

    return (
      <div className={`p-3.5 sm:p-4 rounded-2xl bg-linear-to-r from-sky-50/80 via-purple-50/40 to-pink-50/80 border border-purple-200/70 shadow-xs mb-6 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-600 text-white shadow-2xs">
              <ArrowRightLeft className="w-3 h-3" />
              双原发肿瘤管理模式 (MPMN)
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              独立分期与分子分型 · 0ms 瞬间切换
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-[11px] text-purple-700 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              已激活跨癌种联合用药自检与就医协同
            </div>
            {onAddSecondCancer && effectiveSlots.length < 2 && (
              <button
                type="button"
                onClick={onAddSecondCancer}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 px-2 py-0.5 rounded-md border border-purple-300 bg-white/70 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>增添病案</span>
              </button>
            )}
          </div>
        </div>

        <div className={`grid ${gridCols} gap-2.5 sm:gap-3.5 mt-3`}>
          {effectiveSlots.map((slot) => {
            const cfg = slotConfigs[slot];
            if (!cfg) return null;
            const isActive = activeSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSelectSlot(slot)}
                className={`p-3 rounded-xl text-left transition-all cursor-pointer relative flex items-center justify-between border ${
                  isActive ? cfg.activeCardClass : cfg.inactiveCardClass
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                    isActive ? cfg.activeIconClass : cfg.inactiveIconClass
                  }`}>
                    <CancerIcon type={slot} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{cfg.title}</span>
                      {isActive && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold ${cfg.badgeClass}`}>
                          浏览中
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-600 truncate">
                      <span className={`font-semibold ${cfg.textColor}`}>{cfg.summary.stage}</span>
                      <span className="text-slate-300">·</span>
                      <span className="truncate">{cfg.summary.label}</span>
                    </div>
                  </div>
                </div>
                {isActive ? (
                  <CheckCircle2 className={`w-5 h-5 ${cfg.checkColor} shrink-0`} />
                ) : (
                  <span className="text-[11px] text-slate-400 group-hover:text-purple-600 font-medium shrink-0">点击切换</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. 单癌种患者轻量提示条 (Single Cancer Mode with option to add second)
  if (effectiveSlots.length === 1) {
    const currentCancer = effectiveSlots[0];
    const cfg = slotConfigs[currentCancer] || slotConfigs.lung;
    const cancerName = cfg.title.replace(/^原发性/, "");
    const currentSummary = cfg.summary;

    return (
      <div className={`p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-6 ${className}`}>
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-slate-200/80 text-slate-700 text-[11px]">
            <CancerIcon type={currentCancer} className="w-3.5 h-3.5" />
            当前专案：{cancerName}
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-500 text-[11px]">
            {currentSummary.stage} · {currentSummary.label}
          </span>
        </div>

        {onAddSecondCancer && (
          <button
            type="button"
            onClick={onAddSecondCancer}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-purple-600:text-purple-300 px-2.5 py-1 rounded-lg border border-dashed border-slate-300 hover:border-purple-300:border-purple-700 transition-colors cursor-pointer self-start sm:self-auto bg-white/80"
          >
            <Plus className="w-3 h-3" />
            <span>建立第二癌种档案 (如合并双原发肿瘤)</span>
          </button>
        )}
      </div>
    );
  }

  return null;
}
