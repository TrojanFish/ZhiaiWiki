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
  colonProfile?: PatientProfile | null;
  rectalProfile?: PatientProfile | null;
  colorectalProfile?: PatientProfile | null;
  gastricProfile?: PatientProfile | null;
  liverProfile?: PatientProfile | null;
  esophagealProfile?: PatientProfile | null;
  thyroidProfile?: PatientProfile | null;
  endometrialProfile?: PatientProfile | null;
  cervicalProfile?: PatientProfile | null;
  pancreaticProfile?: PatientProfile | null;
  onSelectSlot: (slot: CancerType) => void;
  onAddSecondCancer?: () => void;
  className?: string;
}

export default function DualPrimarySwitcher({
  activeSlot,
  availableSlots,
  lungProfile,
  breastProfile,
  colonProfile,
  rectalProfile,
  colorectalProfile,
  gastricProfile,
  liverProfile,
  esophagealProfile,
  thyroidProfile,
  endometrialProfile,
  cervicalProfile,
  pancreaticProfile,
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

  const colonSummary = React.useMemo(() => {
    const prof = colonProfile || colorectalProfile;
    if (!prof) return { stage: "未建档", label: "结肠病案待建立", isComplete: false };
    const stg = prof.stage || prof.tStage || "待评估";
    const rawData = (prof as any).clinicalData || (prof as any).cancerSpecificData || {};
    const loc = rawData.primaryLocation === "left_colon" ? "左半结肠" : rawData.primaryLocation === "right_colon" ? "右半结肠" : "结肠病变";
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: `${loc}`,
      isComplete: Boolean(prof.stage || prof.tStage),
    };
  }, [colonProfile, colorectalProfile]);

  const rectalSummary = React.useMemo(() => {
    const prof = rectalProfile || colorectalProfile;
    if (!prof) return { stage: "未建档", label: "直肠病案待建立", isComplete: false };
    const stg = prof.stage || prof.tStage || "待评估";
    const rawData = (prof as any).clinicalData || (prof as any).cancerSpecificData || {};
    const dist = rawData.distanceFromAnalVerge != null ? `距肛${rawData.distanceFromAnalVerge}cm` : "直肠病变";
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: `${dist}`,
      isComplete: Boolean(prof.stage || prof.tStage),
    };
  }, [rectalProfile, colorectalProfile]);

  const colorectalSummary = React.useMemo(() => {
    if (!colorectalProfile) return { stage: "未建档", label: "结直肠病案待建立", isComplete: false };
    const stg = colorectalProfile.stage || colorectalProfile.tStage || "待评估";
    const rawData = (colorectalProfile as any).clinicalData || (colorectalProfile as any).cancerSpecificData || {};
    const loc = rawData.primaryLocation === "left_colon" ? "左半结肠" : rawData.primaryLocation === "right_colon" ? "右半结肠" : rawData.primaryLocation === "rectum" ? "直肠" : (colorectalProfile.organ === "colorectal" ? "结直肠病变" : "结肠/直肠病变");
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: `${loc}`,
      isComplete: Boolean(colorectalProfile.stage || colorectalProfile.tStage),
    };
  }, [colorectalProfile]);

  const gastricSummary = React.useMemo(() => {
    if (!gastricProfile) return { stage: "未建档", label: "胃部病案待建立", isComplete: false };
    const stg = gastricProfile.stage || gastricProfile.tStage || "待评估";
    const rawData = (gastricProfile as any).clinicalData || (gastricProfile as any).cancerSpecificData || (gastricProfile as any).gastricData || {};
    const esdLabel = rawData.isEsdIndication ? "ESD保胃候选" : (rawData.laurenType === "diffuse" ? "弥漫型(含印戒)" : rawData.laurenType === "intestinal" ? "肠型胃癌" : "胃癌病变");
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: `${esdLabel}`,
      isComplete: Boolean(gastricProfile.stage || gastricProfile.tStage),
    };
  }, [gastricProfile]);

  const liverSummary = React.useMemo(() => {
    if (!liverProfile) return { stage: "未建档", label: "肝脏病案待建立", isComplete: false };
    const rawData = (liverProfile as any).clinicalData || (liverProfile as any).cancerSpecificData || (liverProfile as any).liverData || {};
    const stg = rawData.cnlcStage ? `CNLC ${rawData.cnlcStage}期` : (liverProfile.stage || "待评估");
    const cp = rawData.childPughClass ? `Child-Pugh ${rawData.childPughClass}` : "";
    const label = cp ? `${cp}级` : (rawData.isMilanEligible ? "符合米兰标准" : "肝癌病变");
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: label,
      isComplete: Boolean(rawData.cnlcStage || liverProfile.stage),
    };
  }, [liverProfile]);

  const esophagealSummary = React.useMemo(() => {
    if (!esophagealProfile) return { stage: "未建档", label: "食管病案待建立", isComplete: false };
    const rawData = (esophagealProfile as any).clinicalData || (esophagealProfile as any).cancerSpecificData || {};
    const stg = esophagealProfile.stage || rawData.stage || "待评估";
    const subsite = rawData.subsite === "cervical" ? "颈段" : rawData.subsite === "upper_thoracic" ? "胸上段" : rawData.subsite === "lower_thoracic" ? "胸下段" : "胸中段";
    const label = rawData.airwayInvasionRisk ? "气管食管瘘高危" : `${subsite}鳞癌`;
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label,
      isComplete: Boolean(esophagealProfile.stage || rawData.stage),
    };
  }, [esophagealProfile]);

  const thyroidSummary = React.useMemo(() => {
    if (!thyroidProfile) return { stage: "未建档", label: "甲状腺病案待建立", isComplete: false };
    const rawData = (thyroidProfile as any).clinicalData || (thyroidProfile as any).cancerSpecificData || {};
    const stg = thyroidProfile.stage || rawData.stage || "待评估";
    const tirads = rawData.ultrasoundTirads ? `TI-RADS ${rawData.ultrasoundTirads}` : "超声待评估";
    const hist = rawData.histologyType === "ATC" ? "未分化癌" : rawData.histologyType === "MTC" ? "髓样癌" : "乳头状/滤泡癌";
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: rawData.ultrasoundTirads ? tirads : hist,
      isComplete: Boolean(thyroidProfile.stage || rawData.stage || rawData.ultrasoundTirads),
    };
  }, [thyroidProfile]);

  const endometrialSummary = React.useMemo(() => {
    if (!endometrialProfile) return { stage: "未建档", label: "子宫内膜病案待建立", isComplete: false };
    const rawData = (endometrialProfile as any).clinicalData || (endometrialProfile as any).cancerSpecificData || {};
    const stg = endometrialProfile.stage || rawData.stage || "待评估";
    const sub = rawData.molecularSubtype ? `${rawData.molecularSubtype}分型` : (rawData.histologyType || "内膜样腺癌");
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: sub,
      isComplete: Boolean(endometrialProfile.stage || rawData.stage),
    };
  }, [endometrialProfile]);

  const cervicalSummary = React.useMemo(() => {
    if (!cervicalProfile) return { stage: "未建档", label: "宫颈病案待建立", isComplete: false };
    const rawData = (cervicalProfile as any).clinicalData || (cervicalProfile as any).cancerSpecificData || {};
    const stg = cervicalProfile.stage || rawData.stage || "待评估";
    const hpv = rawData.hpvStatus ? (rawData.hpvStatus === "hpv16" ? "HPV16阳性" : "高危HPV阳性") : (rawData.histologyType || "宫颈鳞癌");
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: hpv,
      isComplete: Boolean(cervicalProfile.stage || rawData.stage),
    };
  }, [cervicalProfile]);

  const pancreaticSummary = React.useMemo(() => {
    if (!pancreaticProfile) return { stage: "未建档", label: "胰腺病案待建立", isComplete: false };
    const rawData = (pancreaticProfile as any).clinicalData || (pancreaticProfile as any).cancerSpecificData || {};
    const stg = pancreaticProfile.stage || rawData.stage || "待评估";
    const resect = rawData.resectabilityStatus ? (
      rawData.resectabilityStatus === "resectable" ? "可直接切除" :
      rawData.resectabilityStatus === "borderline_resectable" ? "交界可切除" :
      rawData.resectabilityStatus === "locally_advanced" ? "局部进展期" : "转移性"
    ) : (rawData.primarySite ? `${rawData.primarySite === "head" ? "胰头" : "胰体尾"}占位` : "胰腺导管腺癌");
    return {
      stage: stg.includes("期") ? stg : `${stg}期`,
      label: resect,
      isComplete: Boolean(pancreaticProfile.stage || rawData.stage || rawData.resectabilityStatus),
    };
  }, [pancreaticProfile]);

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
    colon: {
      title: "原发性结肠恶性肿瘤",
      summary: colonSummary,
      activeCardClass: "bg-white border-emerald-400 ring-2 ring-emerald-400/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-emerald-300",
      activeIconClass: "bg-emerald-100 text-emerald-600 border-emerald-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-emerald-100 text-emerald-700",
      textColor: "text-emerald-700",
      checkColor: "text-emerald-600",
    },
    rectal: {
      title: "原发性直肠恶性肿瘤",
      summary: rectalSummary,
      activeCardClass: "bg-white border-teal-500 ring-2 ring-teal-500/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-teal-300",
      activeIconClass: "bg-teal-100 text-teal-700 border-teal-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-teal-100 text-teal-800",
      textColor: "text-teal-800",
      checkColor: "text-teal-700",
    },
    colorectal: {
      title: "原发性结直肠恶性肿瘤",
      summary: colorectalSummary,
      activeCardClass: "bg-white border-emerald-400 ring-2 ring-emerald-400/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-emerald-300",
      activeIconClass: "bg-emerald-100 text-emerald-600 border-emerald-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-emerald-100 text-emerald-700",
      textColor: "text-emerald-700",
      checkColor: "text-emerald-600",
    },
    gastric: {
      title: "原发性胃恶性肿瘤",
      summary: gastricSummary,
      activeCardClass: "bg-white border-amber-500 ring-2 ring-amber-500/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-amber-300",
      activeIconClass: "bg-amber-100 text-amber-700 border-amber-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-amber-100 text-amber-800",
      textColor: "text-amber-800",
      checkColor: "text-amber-600",
    },
    liver: {
      title: "原发性肝恶性肿瘤",
      summary: liverSummary,
      activeCardClass: "bg-white border-emerald-600 ring-2 ring-emerald-600/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-emerald-300",
      activeIconClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-emerald-100 text-emerald-800",
      textColor: "text-emerald-800",
      checkColor: "text-emerald-600",
    },
    esophageal: {
      title: "原发性食管恶性肿瘤",
      summary: esophagealSummary,
      activeCardClass: "bg-white border-purple-500 ring-2 ring-purple-500/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-purple-300",
      activeIconClass: "bg-purple-100 text-purple-700 border-purple-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-purple-100 text-purple-800",
      textColor: "text-purple-800",
      checkColor: "text-purple-600",
    },
    thyroid: {
      title: "原发性甲状腺恶性肿瘤",
      summary: thyroidSummary,
      activeCardClass: "bg-white border-teal-500 ring-2 ring-teal-500/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-teal-300",
      activeIconClass: "bg-teal-100 text-teal-700 border-teal-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-teal-100 text-teal-800",
      textColor: "text-teal-800",
      checkColor: "text-teal-600",
    },
    endometrial: {
      title: "原发性子宫内膜恶性肿瘤",
      summary: endometrialSummary,
      activeCardClass: "bg-white border-rose-500 ring-2 ring-rose-500/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-rose-300",
      activeIconClass: "bg-rose-100 text-rose-700 border-rose-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-rose-100 text-rose-800",
      textColor: "text-rose-800",
      checkColor: "text-rose-600",
    },
    cervical: {
      title: "原发性宫颈恶性肿瘤",
      summary: cervicalSummary,
      activeCardClass: "bg-white border-fuchsia-500 ring-2 ring-fuchsia-500/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-fuchsia-300",
      activeIconClass: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-fuchsia-100 text-fuchsia-800",
      textColor: "text-fuchsia-800",
      checkColor: "text-fuchsia-600",
    },
    pancreatic: {
      title: "原发性胰腺恶性肿瘤",
      summary: pancreaticSummary,
      activeCardClass: "bg-white border-orange-500 ring-2 ring-orange-500/30 shadow-sm",
      inactiveCardClass: "bg-white/60 border-slate-200/70 hover:bg-white hover:border-orange-300",
      activeIconClass: "bg-orange-100 text-orange-700 border-orange-200",
      inactiveIconClass: "bg-slate-100 text-slate-500 border-slate-200",
      badgeClass: "bg-orange-100 text-orange-800",
      textColor: "text-orange-800",
      checkColor: "text-orange-600",
    },
  };

  // 1. 多原发患者专案切换器 (Multi-Primary Mode)
  if (isMultiPrimary) {
    const gridCols = effectiveSlots.length === 2 
      ? "grid-cols-1 sm:grid-cols-2" 
      : effectiveSlots.length === 3 
      ? "grid-cols-1 sm:grid-cols-3" 
      : effectiveSlots.length === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : effectiveSlots.length === 5
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      : effectiveSlots.length === 6
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
      : effectiveSlots.length === 7
      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8";

    return (
      <div className={`p-3.5 sm:p-4 rounded-2xl bg-linear-to-r from-sky-50/80 via-purple-50/40 to-pink-50/80 border border-purple-200/70 shadow-xs mb-6 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-600 text-white shadow-2xs">
              <ArrowRightLeft className="w-3 h-3" />
              多原发肿瘤管理模式 (MPMN)
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
            {onAddSecondCancer && effectiveSlots.length < 4 && (
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
            <span>建立第二癌种档案 (如合并其他原发肿瘤)</span>
          </button>
        )}
      </div>
    );
  }

  return null;
}
