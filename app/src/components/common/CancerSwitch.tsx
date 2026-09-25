"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { CancerType } from "@/lib/types";
import { CancerRegistry, type CancerTypeOption } from "@/lib/cancerRegistry";
import { CancerIcon } from "@/components/common/CancerIcons";
import BottomSheet from "@/components/common/BottomSheet";
import { ChevronDown, Check, Layers } from "lucide-react";
import {
  getProfileBySlot,
  getAvailableProfileSlots,
  setActiveCancerSlot,
  EVENT_SLOT_CHANGED,
} from "@/lib/profileStorage";

const CANCER_STORAGE_KEY = "oncopath_active_cancer_type";

export type { CancerTypeOption };

export const CANCER_TYPE_OPTIONS: CancerTypeOption[] = CancerRegistry.getOptions();

/**
 * 架构预研与未来计划接入的新癌种路线图
 */
const UPCOMING_CANCERS = [
  {
    id: "nasopharyngeal",
    name: "鼻咽癌专区",
    enName: "Nasopharyngeal Carcinoma (NPC)",
    guidelineStandard: "CSCO 2024 · EBV-DNA 拷贝数监测 · 根治性调强放疗 (IMRT) · JUPITER-02",
    badge: "规划中",
  },
  {
    id: "pancreatic",
    name: "胰腺癌专区",
    enName: "Pancreatic Cancer (PDAC)",
    guidelineStandard: "CSCO 2024 · mFOLFIRINOX / AG 方案 · CA19-9 · 转化切除评估",
    badge: "规划中",
  },
];

let hasHydrated = false;
let memoryCachedCancerType: CancerType = "lung";

export function useCancerType(): {
  cancerType: CancerType;
  setCancerType: (type: CancerType) => void;
} {
  const [cancerType, setCancerState] = useState<CancerType>(() => {
    // Only read client storage if hydration has already occurred.
    // During SSR and initial client hydration, always initialize to "lung"
    // to strictly prevent Next.js / React SSR hydration mismatch!
    if (hasHydrated && typeof window !== "undefined") {
      try {
        const saved = (localStorage.getItem(CANCER_STORAGE_KEY) || localStorage.getItem("oncopath_default_cancer_type")) as CancerType | null;
        if (saved && CANCER_TYPE_OPTIONS.some((opt) => opt.type === saved)) {
          return saved;
        }
      } catch {}
      return memoryCachedCancerType;
    }
    return "lung";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    hasHydrated = true;

    // 1. Initial read from localStorage
    const saved = (localStorage.getItem(CANCER_STORAGE_KEY) || localStorage.getItem("oncopath_default_cancer_type")) as CancerType | null;
    if (saved && CANCER_TYPE_OPTIONS.some((opt) => opt.type === saved)) {
      memoryCachedCancerType = saved;
      setCancerState(saved);
    } else {
      // Check if profile exists with breast
      try {
        const profileRaw = localStorage.getItem("oncopath_profile") || localStorage.getItem("patient_profile");
        if (profileRaw) {
          const parsed = JSON.parse(profileRaw);
          if (parsed?.cancerType === "breast" || parsed?.organ === "breast") {
            memoryCachedCancerType = "breast";
            setCancerState("breast");
            localStorage.setItem(CANCER_STORAGE_KEY, "breast");
            localStorage.setItem("oncopath_default_cancer_type", "breast");
          }
        }
      } catch {}
    }

    // 2. Listen to custom event for cross-component reactive updates
    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.cancerType && CANCER_TYPE_OPTIONS.some((opt) => opt.type === detail.cancerType)) {
        memoryCachedCancerType = detail.cancerType;
        setCancerState(detail.cancerType);
      }
    };

    window.addEventListener("cancer-type-changed", handleSync);
    return () => window.removeEventListener("cancer-type-changed", handleSync);
  }, []);

  const setCancerType = useCallback((type: CancerType) => {
    memoryCachedCancerType = type;
    setCancerState(type);
    if (typeof window !== "undefined") {
      localStorage.setItem(CANCER_STORAGE_KEY, type);
      localStorage.setItem("oncopath_default_cancer_type", type);
      setActiveCancerSlot(type);
      window.dispatchEvent(new CustomEvent("cancer-type-changed", { detail: { cancerType: type } }));
      window.dispatchEvent(new Event("storage"));
    }
  }, []);

  return { cancerType, setCancerType };
}

interface CancerSwitchProps {
  className?: string;
  variant?: "dropdown" | "pills";
}

/**
 * 具有高度弹性与自适应能力的多癌种选择器 (CancerSwitch)
 * - 桌面端：紧凑下拉气泡 Popover，无论注册 2 种还是 20 种癌种均不撑爆导航栏；
 * - 移动端：触控友好的 BottomSheet 底部浮层，遵循手势操作人体工学；
 * - 纯矢量 SVG 图标渲染，消除不同系统间卡通 Emoji 的割裂感。
 */
export default function CancerSwitch({
  className = "",
  variant = "dropdown",
}: CancerSwitchProps) {
  const { cancerType, setCancerType } = useCancerType();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const availablePlugins = useMemo(() => {
    return CancerRegistry.getAll();
  }, []);

  const activePlugin = useMemo(() => {
    return CancerRegistry.get(cancerType);
  }, [cancerType]);

  const [availableSlots, setAvailableSlots] = useState<CancerType[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setAvailableSlots(getAvailableProfileSlots());
    const refresh = () => setAvailableSlots(getAvailableProfileSlots());
    window.addEventListener("storage", refresh);
    window.addEventListener(EVENT_SLOT_CHANGED, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(EVENT_SLOT_CHANGED, refresh);
    };
  }, []);

  // Click outside listener for desktop popover
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      // 1. 如果在当前容器内（桌面下拉菜单），由按钮自身 onClick 处理，不在此关闭
      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }
      // 2. 如果点击在移动端 BottomSheet 弹窗内（通过 Portal 挂载到 body），不在此处关闭（由 BottomSheet 自身的遮罩点击 onClose 处理）
      if (
        (target as Element)?.closest?.('[role="dialog"]') ||
        (target as Element)?.closest?.('.animate-slide-up-drawer')
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // ESC key dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // 1. Classic Pills Variant (if explicitly requested)
  if (variant === "pills") {
    return (
      <div
        className={`inline-flex items-center p-0.5 rounded-full bg-slate-100/90 border border-slate-200/90 shadow-2xs${className ? ` ${className}` : ""}`}
        role="group"
        aria-label="癌种切换"
      >
        {CANCER_TYPE_OPTIONS.map((opt) => {
          const isActive = cancerType === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => setCancerType(opt.type)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                isActive
                  ? `${opt.activeColor} shadow-xs font-extrabold`
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
              }`}
              title={opt.title}
            >
              <CancerIcon
                type={opt.type}
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                  isActive
                    ? opt.type === "breast"
                      ? "text-pink-600"
                      : "text-sky-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Default Scalable Dropdown Variant (Desktop Popover + Mobile BottomSheet)
  const renderPluginItems = (isMobile: boolean = false) => (
    <div className="space-y-1.5">
      {availablePlugins.map((plugin) => {
        const isSelected = cancerType === plugin.id;
        const hasProfile = availableSlots.includes(plugin.id);
        const profileData = hasProfile ? getProfileBySlot(plugin.id) : null;
        const stageLabel = profileData?.stage || (profileData as any)?.prognosticStage || (profileData as any)?.tStage;
        const themeStyles = plugin.id === "breast"
          ? {
              card: "bg-pink-50/90 border border-pink-200 text-pink-950 shadow-2xs ring-1 ring-pink-300/40",
              icon: "bg-pink-100 text-pink-600 border-pink-300",
              badge: "bg-pink-200 text-pink-800",
              check: "bg-pink-600 text-white",
            }
          : plugin.id === "rectal"
          ? {
              card: "bg-teal-50/90 border border-teal-200 text-teal-950 shadow-2xs ring-1 ring-teal-300/40",
              icon: "bg-teal-100 text-teal-700 border-teal-300",
              badge: "bg-teal-200 text-teal-800",
              check: "bg-teal-700 text-white",
            }
          : plugin.id === "colon" || plugin.id === "colorectal"
          ? {
              card: "bg-emerald-50/90 border border-emerald-200 text-emerald-950 shadow-2xs ring-1 ring-emerald-300/40",
              icon: "bg-emerald-100 text-emerald-600 border-emerald-300",
              badge: "bg-emerald-200 text-emerald-800",
              check: "bg-emerald-600 text-white",
            }
          : {
              card: "bg-sky-50/90 border border-sky-200 text-sky-950 shadow-2xs ring-1 ring-sky-300/40",
              icon: "bg-sky-100 text-sky-600 border-sky-300",
              badge: "bg-sky-200 text-sky-800",
              check: "bg-sky-600 text-white",
            };

        return (
          <button
            key={plugin.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCancerType(plugin.id);
              setIsOpen(false);
            }}
            className={`w-full text-left p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between group ${
              isSelected
                ? themeStyles.card
                : "bg-white hover:bg-slate-50 border border-slate-200/70 text-slate-700 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform group-hover:scale-105 ${
                  isSelected
                    ? themeStyles.icon
                    : "bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-white"
                }`}
              >
                <CancerIcon type={plugin.id} className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 truncate">{plugin.name}专区</span>
                  <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">({plugin.enName})</span>
                  {isSelected && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold ${themeStyles.badge}`}>
                      当前生效
                    </span>
                  )}
                  {hasProfile && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-md font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      已建档 {stageLabel ? `· ${stageLabel}` : ""}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px] sm:max-w-[240px]">
                  {plugin.guidelineStandard}
                </p>
              </div>
            </div>

            {isSelected ? (
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${themeStyles.check}`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium px-2 py-0.5 rounded-md bg-slate-100">
                切换
              </span>
            )}
          </button>
        );
      })}

      {/* Upcoming / Future Oncology Roadmap */}
      <div className="pt-2 mt-2 border-t border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1 flex items-center gap-1">
          <Layers className="w-3 h-3 text-indigo-400" />
          <span>插件架构已就绪 · 拓展线路</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {UPCOMING_CANCERS.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between opacity-80"
            >
              <div className="min-w-0 pr-2">
                <div className="text-[11px] font-bold text-slate-700 truncate">{item.name}</div>
                <div className="text-[9px] text-slate-400 truncate">{item.guidelineStandard}</div>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600 font-medium shrink-0 font-mono">
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative inline-flex items-center" ref={containerRef} suppressHydrationWarning>
      {/* Trigger Button: Constant Compact Footprint, Never Stretches Navbar */}
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-8 px-2 sm:px-2.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-2xs select-none active:scale-95 ${
          activePlugin?.id === "breast"
            ? "bg-pink-50/95 text-pink-700 border-pink-200/90 hover:bg-pink-100 hover:border-pink-300 shadow-pink-500/5"
            : activePlugin?.id === "rectal"
            ? "bg-teal-50/95 text-teal-800 border-teal-200/90 hover:bg-teal-100 hover:border-teal-300 shadow-teal-500/5"
            : activePlugin?.id === "colon" || activePlugin?.id === "colorectal"
            ? "bg-emerald-50/95 text-emerald-700 border-emerald-200/90 hover:bg-emerald-100 hover:border-emerald-300 shadow-emerald-500/5"
            : "bg-sky-50/95 text-sky-700 border-sky-200/90 hover:bg-sky-100 hover:border-sky-300 shadow-sky-500/5"
        }${className ? ` ${className}` : ""}`}
        title={`当前循证专区: ${activePlugin?.name} (点击切换癌种)`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="切换临床癌种专区"
      >
        <CancerIcon
          type={activePlugin?.id || "lung"}
          className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${
            activePlugin?.id === "breast"
              ? "text-pink-600"
              : activePlugin?.id === "rectal"
              ? "text-teal-700"
              : activePlugin?.id === "colon" || activePlugin?.id === "colorectal"
              ? "text-emerald-600"
              : "text-sky-600"
          }`}
        />
        <span suppressHydrationWarning className="truncate max-w-[130px] sm:max-w-none">{activePlugin?.name || "肺癌"}<span className="hidden sm:inline">专区</span></span>
        <ChevronDown
          className={`w-3 h-3 opacity-60 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* A. Desktop Popover Dropdown Menu */}
      {isOpen && (
        <div className="hidden sm:block absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/90 p-3 z-50 animate-fade-in-up pointer-events-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>切换国际循证临床专区</span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              已载入 {availablePlugins.length} 癌种
            </span>
          </div>

          {renderPluginItems(false)}
        </div>
      )}

      {/* B. Mobile BottomSheet Drawer */}
      <div className="sm:hidden">
        <BottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>切换临床循证专区</span>
            </div>
          }
          description="系统依据所选癌种，自动装配对应的权威国际指南分期、靶向药物相互作用检测及前瞻队列证据。"
        >
          <div className="p-1 pb-4">
            {renderPluginItems(true)}
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}
