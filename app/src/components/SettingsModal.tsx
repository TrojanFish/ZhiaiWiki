"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Settings, 
  Languages, 
  Layers, 
  Award, 
  ShieldCheck, 
  Trash2, 
  Coffee, 
  Check, 
  ExternalLink
} from "lucide-react";
import { useCancerType, CANCER_TYPE_OPTIONS } from "@/components/common/CancerSwitch";
import { CancerRegistry } from "@/lib/cancerRegistry";
import { CancerIcon } from "@/components/common/CancerIcons";
import { useLanguage, type LangScript } from "@/components/LangSwitch";
import type { CancerType } from "@/lib/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCoffee?: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onOpenCoffee,
}: SettingsModalProps) {
  const { cancerType, setCancerType } = useCancerType();
  const { lang, setLang } = useLanguage();
  const [defaultCancer, setDefaultCancer] = useState<CancerType>("lung");
  const [cacheCleared, setCacheCleared] = useState(false);

  // Read default cancer preference from storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("oncopath_default_cancer_type") as CancerType | null;
    if (saved) {
      setDefaultCancer(saved);
    }
  }, [isOpen]);

  // Esc key dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectCancer = (type: CancerType) => {
    setCancerType(type);
    setDefaultCancer(type);
    if (typeof window !== "undefined") {
      localStorage.setItem("oncopath_default_cancer_type", type);
    }
  };

  const handleClearCache = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("oncopath_parsed_report_draft");
      localStorage.removeItem("oncopath_temp_session");
      sessionStorage.clear();
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 2500);
    } catch {}
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-pointer animate-fade-in overflow-hidden sm:overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "440px", width: "100%" }}
        className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:max-w-md w-full border-t sm:border border-slate-200/90 shadow-2xl flex flex-col space-y-4 animate-slide-up-drawer sm:animate-fade-in-up cursor-default pb-safe sm:pb-5 max-h-[92vh] overflow-y-auto mx-auto"
      >
        {/* iOS Grabber for Mobile */}
        <div className="sm:hidden -mt-2 mb-1 flex justify-center shrink-0 w-full">
          <div className="sheet-grabber !my-0" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-sm sm:text-base font-extrabold text-slate-900">
                系统偏好与设置
              </h2>
              <p className="text-[11px] text-slate-400">个性化配置默认癌种、显示语言及循证体系</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="关闭设置"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: 临床专区与默认癌种偏好 (优雅纵向流，完美自适应 420px) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>当前与默认循证专区</span>
            </div>
            <span className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded font-medium">
              自动保存为首选
            </span>
          </div>

          <div className="space-y-2">
            {CANCER_TYPE_OPTIONS.map((opt) => {
              const isSelected = cancerType === opt.type;
              const plugin = CancerRegistry.get(opt.type);
              const themeStyles = opt.type === "breast"
                ? "bg-pink-50/90 border-pink-300 ring-2 ring-pink-200/80 text-pink-950 shadow-xs"
                : opt.type === "colon" || opt.type === "colorectal"
                ? "bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-200/80 text-emerald-950 shadow-xs"
                : opt.type === "rectal"
                ? "bg-teal-50/90 border-teal-300 ring-2 ring-teal-200/80 text-teal-950 shadow-xs"
                : opt.type === "pancreatic"
                ? "bg-orange-50/90 border-orange-300 ring-2 ring-orange-200/80 text-orange-950 shadow-xs"
                : opt.type === "gastric"
                ? "bg-amber-50/90 border-amber-300 ring-2 ring-amber-200/80 text-amber-950 shadow-xs"
                : opt.type === "liver"
                ? "bg-rose-50/90 border-rose-300 ring-2 ring-rose-200/80 text-rose-950 shadow-xs"
                : opt.type === "esophageal"
                ? "bg-orange-50/90 border-orange-300 ring-2 ring-orange-200/80 text-orange-950 shadow-xs"
                : opt.type === "thyroid"
                ? "bg-indigo-50/90 border-indigo-300 ring-2 ring-indigo-200/80 text-indigo-950 shadow-xs"
                : opt.type === "endometrial"
                ? "bg-purple-50/90 border-purple-300 ring-2 ring-purple-200/80 text-purple-950 shadow-xs"
                : opt.type === "cervical"
                ? "bg-fuchsia-50/90 border-fuchsia-300 ring-2 ring-fuchsia-200/80 text-fuchsia-950 shadow-xs"
                : "bg-sky-50/90 border-sky-300 ring-2 ring-sky-200/80 text-sky-950 shadow-xs";

              const checkBg = opt.type === "breast"
                ? "bg-pink-600"
                : opt.type === "colon" || opt.type === "colorectal"
                ? "bg-emerald-600"
                : opt.type === "rectal"
                ? "bg-teal-700"
                : opt.type === "pancreatic"
                ? "bg-orange-600"
                : opt.type === "gastric"
                ? "bg-amber-600"
                : opt.type === "liver"
                ? "bg-rose-600"
                : opt.type === "esophageal"
                ? "bg-orange-600"
                : opt.type === "thyroid"
                ? "bg-indigo-600"
                : opt.type === "endometrial"
                ? "bg-purple-600"
                : opt.type === "cervical"
                ? "bg-fuchsia-600"
                : "bg-sky-600";

              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleSelectCancer(opt.type)}
                  className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? themeStyles
                      : "bg-slate-50/70 hover:bg-slate-100/90 border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-2xs shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected
                          ? "bg-white border-slate-200"
                          : "bg-white text-slate-400 border-slate-200"
                      }`}
                    >
                      <CancerIcon type={opt.type} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{opt.label}专区</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]">
                          {plugin?.enName || opt.enName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[260px] mt-0.5">
                        {plugin?.guidelineStandard || "权威国际指南与前瞻性队列"}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-2xs shrink-0 ${checkBg}`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: 语言与文系转换 */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>界面语言与学术用词</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">OpenCC 引擎实时转换</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLang("cn")}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                lang === "cn"
                  ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200 text-indigo-950 font-bold shadow-2xs"
                  : "bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              <div>
                <div className="text-xs font-bold">简体中文 (zh-CN)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">国家医保与大陆标准</div>
              </div>
              {lang === "cn" && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setLang("tw")}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                lang === "tw"
                  ? "bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200 text-indigo-950 font-bold shadow-2xs"
                  : "bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              <div>
                <div className="text-xs font-bold">繁體中文 (zh-TW)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">港台繁體與國際習慣</div>
              </div>
              {lang === "tw" && (
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Section 3: 权威循证标准与隐私安全声明 */}
        <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-1.5">
          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>国际循证与临床安全基准</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
              <span>IASLC 9th / AJCC 权威双轨分期</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
              <span>100% 顶刊出处 (NEJM/Lancet)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>PIPL 医疗隐私脱敏 · 擦除身份标识</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              <span>临床 AI 严防过度医疗 · 护航低危红线</span>
            </div>
          </div>
        </div>

        {/* Section 4: 本地数据与缓存管理 */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleClearCache}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="清理本地诊断报告草稿与会话缓存"
          >
            {cacheCleared ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">已成功清理本地报告草稿与临时缓存</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>清除本地临时报告草稿与缓存</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-98"
        >
          完成并保存偏好设置
        </button>
      </div>
    </div>
  );
}
