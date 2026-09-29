"use client";

import React from "react";
import {
  Activity,
  Layers,
  AlertTriangle,
  ShieldCheck,
  Microscope,
  Info,
  Check,
  Stethoscope,
  Ruler,
  Dna,
} from "lucide-react";
import type { CancerType } from "@/lib/types";

interface CancerSpecificPathologyFormProps {
  cancerType: CancerType;
  data: any;
  onChange: (updates: Record<string, any>) => void;
}

export default function CancerSpecificPathologyForm({
  cancerType,
  data,
  onChange,
}: CancerSpecificPathologyFormProps) {
  const isBreast = cancerType === "breast";
  const isColon = cancerType === "colon";
  const isRectal = cancerType === "rectal";
  const isColorectal = cancerType === "colorectal" || isColon || isRectal;
  const isGastric = cancerType === "gastric";
  const isLiver = cancerType === "liver";
  const isEsophageal = cancerType === "esophageal";
  const isThyroid = cancerType === "thyroid";
  const isEndometrial = cancerType === "endometrial";
  const isCervical = cancerType === "cervical";
  const isPancreatic = cancerType === "pancreatic";

  if (cancerType === "lung") {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 1. 乳腺癌专科病理卡片 */}
      {isBreast && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
                <Microscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  乳腺癌专科病理要素与受体状态 (AJCC 第 8/9 版)
                </h3>
                <p className="text-[11px] text-slate-500">
                  ER / PR / HER2 表达、淋巴结质控、Nottingham 分级与 21 基因评分
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 shrink-0">
              指导内分泌 / 靶向 / 化疗决策
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* ER */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">雌激素受体 (ER)</span>
                <span className="text-[10px] text-slate-400">阳性 $\ge 1\%$</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ erStatus: "positive" })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.erStatus === "positive"
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  阳性(+)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ erStatus: "negative", erPercent: 0 })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.erStatus === "negative"
                      ? "bg-slate-700 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  阴性(-)
                </button>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-500 shrink-0">阳性比例:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="如 90 (%)"
                  value={data.erPercent !== undefined && data.erPercent !== null ? data.erPercent : ""}
                  onChange={(e) => onChange({ erPercent: e.target.value ? Number(e.target.value) : null, erStatus: Number(e.target.value) > 0 ? "positive" : "negative" })}
                  className="w-full h-7 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 font-mono"
                />
              </div>
            </div>

            {/* PR */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">孕激素受体 (PR)</span>
                <span className="text-[10px] text-slate-400">阳性 $\ge 1\%$</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ prStatus: "positive" })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.prStatus === "positive"
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  阳性(+)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ prStatus: "negative", prPercent: 0 })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.prStatus === "negative"
                      ? "bg-slate-700 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  阴性(-)
                </button>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-500 shrink-0">阳性比例:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="如 75 (%)"
                  value={data.prPercent !== undefined && data.prPercent !== null ? data.prPercent : ""}
                  onChange={(e) => onChange({ prPercent: e.target.value ? Number(e.target.value) : null, prStatus: Number(e.target.value) > 0 ? "positive" : "negative" })}
                  className="w-full h-7 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 font-mono"
                />
              </div>
            </div>

            {/* HER2 IHC & FISH */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">HER2 状态 (IHC / FISH)</span>
                <span className="text-[10px] text-rose-600 font-semibold">曲帕/ADC靶向</span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-8">
                {["0", "1+", "2+", "3+"].map((ihc) => (
                  <button
                    key={ihc}
                    type="button"
                    onClick={() => {
                      const isHer2Pos = ihc === "3+";
                      const isLow = ihc === "1+" || (ihc === "2+" && data.her2Fish === "negative");
                      onChange({
                        her2Status: ihc,
                        her2Low: isLow,
                        her2Category: isHer2Pos ? "positive" : isLow ? "low" : ihc === "0" ? "zero" : "unknown",
                      });
                    }}
                    className={`text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      String(data.her2Status) === ihc
                        ? ihc === "3+"
                          ? "bg-rose-600 text-white shadow-2xs"
                          : ihc === "1+" || ihc === "2+"
                          ? "bg-amber-600 text-white shadow-2xs"
                          : "bg-slate-700 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {ihc}
                  </button>
                ))}
              </div>
              {data.her2Status === "2+" && (
                <div className="flex items-center gap-1 pt-1">
                  <span className="text-[10px] text-slate-500 shrink-0">FISH:</span>
                  <select
                    value={data.her2Fish || "not_performed"}
                    onChange={(e) => {
                      const fishVal = e.target.value;
                      const isPos = fishVal === "positive";
                      const isLow = fishVal === "negative";
                      onChange({
                        her2Fish: fishVal,
                        her2Low: isLow,
                        her2Category: isPos ? "positive" : isLow ? "low" : "unknown",
                      });
                    }}
                    className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 cursor-pointer"
                  >
                    <option value="not_performed">FISH 待查/未做</option>
                    <option value="negative">FISH 阴性 (HER2-Low 获益)</option>
                    <option value="positive">FISH 阳性 (扩增/双靶获益)</option>
                  </select>
                </div>
              )}
            </div>

            {/* 淋巴结清扫详细计数 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">前哨/腋窝淋巴结计数</span>
                <span className="text-[10px] text-slate-400">阳性数 / 清扫总数</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">前哨(阳性/总数)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={data.sentinelNodesPositive !== undefined && data.sentinelNodesPositive !== null ? data.sentinelNodesPositive : ""}
                      onChange={(e) => onChange({ sentinelNodesPositive: e.target.value ? Number(e.target.value) : 0 })}
                      className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-center"
                    />
                    <span className="text-xs text-slate-400">/</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="3"
                      value={data.sentinelNodesTotal !== undefined && data.sentinelNodesTotal !== null ? data.sentinelNodesTotal : ""}
                      onChange={(e) => onChange({ sentinelNodesTotal: e.target.value ? Number(e.target.value) : null })}
                      className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-center"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">腋窝清扫(阳性/总数)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={data.axillaryNodesPositive !== undefined && data.axillaryNodesPositive !== null ? data.axillaryNodesPositive : ""}
                      onChange={(e) => onChange({ axillaryNodesPositive: e.target.value ? Number(e.target.value) : 0 })}
                      className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-center"
                    />
                    <span className="text-xs text-slate-400">/</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="15"
                      value={data.axillaryNodesTotal !== undefined && data.axillaryNodesTotal !== null ? data.axillaryNodesTotal : ""}
                      onChange={(e) => onChange({ axillaryNodesTotal: e.target.value ? Number(e.target.value) : null })}
                      className="w-full h-7 px-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 21 基因复发评分 (Oncotype DX) */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">21 基因复发评分 (RS)</span>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-1 rounded font-bold">免化疗参考</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="未做可留空，如 18"
                  value={data.oncotypeDxScore !== undefined && data.oncotypeDxScore !== null ? data.oncotypeDxScore : (data.gene21Score || "")}
                  onChange={(e) => onChange({ oncotypeDxScore: e.target.value ? Number(e.target.value) : null, gene21Score: e.target.value ? Number(e.target.value) : null })}
                  className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                />
              </div>
              <p className="text-[10px] text-slate-400">TAILORx 循证：绝经后 RS &lt; 26 分可安全免除辅助化疗</p>
            </div>

            {/* 绝经状态 & 新辅助完全缓解 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">绝经与新辅助缓解</span>
                <span className="text-[10px] text-slate-400">内分泌与强化</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={data.menopauseStatus || "post"}
                  onChange={(e) => onChange({ menopauseStatus: e.target.value })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer"
                >
                  <option value="pre">绝经前 (TAM/OFS)</option>
                  <option value="peri">围绝经期</option>
                  <option value="post">绝经后 (AI来曲唑)</option>
                </select>
                <select
                  value={data.pcrStatus || "not_neoadjuvant"}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({
                      pcrStatus: val === "not_neoadjuvant" ? null : val,
                      neoadjuvantChemo: val !== "not_neoadjuvant",
                    });
                  }}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer"
                >
                  <option value="not_neoadjuvant">未做新辅助治疗</option>
                  <option value="pCR">新辅助后完全缓解 (pCR)</option>
                  <option value="non-pCR">新辅助后残存病灶 (non-pCR)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 结直肠癌专科病理卡片 */}
      {isColorectal && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  结直肠癌专科病理要素与外科质控 (AJCC 8th / CSCO)
                </h3>
                <p className="text-[11px] text-slate-500">
                  原发解剖部位、淋巴结清扫质控 (≥12枚)、肿瘤沉积 (TD) 与环周切缘 (CRM)
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
              指导辅助化疗周期 (IDEA) 与保肛决策
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 解剖部位 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">原发解剖部位</span>
                <span className="text-[10px] text-slate-400">左右半靶向分流</span>
              </div>
              <div className="flex gap-1 h-8">
                {[
                  { key: "right_colon", label: "右半结肠" },
                  { key: "left_colon", label: "左半结肠" },
                  { key: "rectum", label: "直肠" },
                ].map((pos) => (
                  <button
                    key={pos.key}
                    type="button"
                    onClick={() => onChange({ primaryLocation: pos.key })}
                    className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      data.primaryLocation === pos.key || (pos.key === "rectum" && isRectal) || (pos.key === "left_colon" && data.primaryLocation?.includes("left")) || (pos.key === "right_colon" && data.primaryLocation?.includes("right"))
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 淋巴结清扫质控 (≥12枚) */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">淋巴结质控 (≥12枚红线)</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  data.lymphNodesExamined && Number(data.lymphNodesExamined) >= 12
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}>
                  {data.lymphNodesExamined && Number(data.lymphNodesExamined) >= 12 ? "质控达标" : "检出不足待注意"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">检出总数(枚)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="如 16"
                    value={data.lymphNodesExamined !== undefined && data.lymphNodesExamined !== null ? data.lymphNodesExamined : ""}
                    onChange={(e) => onChange({ lymphNodesExamined: e.target.value ? Number(e.target.value) : null })}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">阳性转移数(枚)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="如 0"
                    value={data.lymphNodesPositive !== undefined && data.lymphNodesPositive !== null ? data.lymphNodesPositive : ""}
                    onChange={(e) => {
                      const pos = e.target.value ? Number(e.target.value) : 0;
                      const nStage = pos === 0 ? "N0" : pos === 1 ? "N1a" : pos <= 3 ? "N1b" : pos <= 6 ? "N2a" : "N2b";
                      onChange({ lymphNodesPositive: pos, nStage });
                    }}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* 肿瘤沉积 (Tumor Deposits / TD) */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">肿瘤沉积 (TD / N1c)</span>
                <span className="text-[10px] text-rose-600 font-bold">无淋巴结仍归N1c</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ tumorDeposits: "absent" })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.tumorDeposits !== "present" && data.tumorDeposits !== "positive"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  未见沉积
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const isN0 = !data.lymphNodesPositive || Number(data.lymphNodesPositive) === 0;
                    onChange({
                      tumorDeposits: "present",
                      ...(isN0 ? { nStage: "N1c" } : {}),
                    });
                  }}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.tumorDeposits === "present" || data.tumorDeposits === "positive"
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  见肿瘤沉积(TD+)
                </button>
              </div>
              <p className="text-[10px] text-slate-400">系膜内孤立癌结节，提示侵袭性微转移</p>
            </div>

            {/* 直肠癌专属：距肛缘距离与 CRM */}
            {(isRectal || data.primaryLocation === "rectum") && (
              <>
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">距肛门缘距离 (cm)</span>
                    <span className="text-[10px] text-teal-700 font-semibold">&lt;5cm 为低位</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="如 4.5 (厘米)"
                    value={data.distanceFromAnalVerge !== undefined && data.distanceFromAnalVerge !== null ? data.distanceFromAnalVerge : ""}
                    onChange={(e) => onChange({ distanceFromAnalVerge: e.target.value ? Number(e.target.value) : null })}
                    className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                  />
                  <p className="text-[10px] text-slate-400">&lt;5cm 优先评估全程新辅助 TNT 争取保肛</p>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">环周切缘 (CRM)</span>
                    <span className="text-[10px] text-rose-600 font-bold">&le;1mm 阳性高危</span>
                  </div>
                  <div className="flex gap-1 h-8">
                    <button
                      type="button"
                      onClick={() => onChange({ crmStatus: "negative" })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                        data.crmStatus === "negative"
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      阴性(&gt;1mm)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ crmStatus: "positive" })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                        data.crmStatus === "positive"
                          ? "bg-rose-600 text-white shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      阳性(&le;1mm)
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">壁外血管侵犯 (EMVI)</span>
                    <span className="text-[10px] text-slate-400">远处转移独立预测</span>
                  </div>
                  <div className="flex gap-1 h-8">
                    <button
                      type="button"
                      onClick={() => onChange({ emviStatus: "negative" })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                        data.emviStatus !== "positive"
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      阴性(-)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ emviStatus: "positive" })}
                      className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                        data.emviStatus === "positive"
                          ? "bg-rose-600 text-white shadow-2xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      阳性(EMVI+)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. 胃癌专科病理卡片 */}
      {isGastric && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <Microscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  胃癌专科病理分型与 D2 质控 (AJCC 8th / JGCA 6th)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Lauren 分型、Borrmann 分型、D2 淋巴结清扫质控 (≥16枚) 与 Claudin 18.2
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
              指导 ESD / FLOT4 / 靶免联合
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Lauren 分型 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Lauren 组织学分型</span>
                <span className="text-[10px] text-slate-400">生物学行为指征</span>
              </div>
              <div className="grid grid-cols-3 gap-1 h-8">
                {[
                  { key: "intestinal", label: "肠型" },
                  { key: "diffuse", label: "弥漫型(印戒)" },
                  { key: "mixed", label: "混合型" },
                ].map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => onChange({ laurenClassification: type.key })}
                    className={`text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      data.laurenClassification === type.key
                        ? "bg-amber-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Borrmann 分型 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Borrmann 大体分型</span>
                <span className="text-[10px] text-slate-400">内镜大体外观</span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-8">
                {[
                  { key: "I", label: "I 结节" },
                  { key: "II", label: "II 溃疡" },
                  { key: "III", label: "III 浸润" },
                  { key: "IV", label: "IV 革囊" },
                ].map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => onChange({ borrmannType: b.key })}
                    className={`text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      data.borrmannType === b.key
                        ? "bg-amber-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* D2 淋巴结清扫质控 (≥16枚) */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">D2 清扫质控 (≥16枚红线)</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  data.lymphNodesExamined && Number(data.lymphNodesExamined) >= 16
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}>
                  {data.lymphNodesExamined && Number(data.lymphNodesExamined) >= 16 ? "达标" : "不足"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">检出总数(枚)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="如 25"
                    value={data.lymphNodesExamined !== undefined && data.lymphNodesExamined !== null ? data.lymphNodesExamined : ""}
                    onChange={(e) => onChange({ lymphNodesExamined: e.target.value ? Number(e.target.value) : null })}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">转移数(枚)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="如 2"
                    value={data.lymphNodesPositive !== undefined && data.lymphNodesPositive !== null ? data.lymphNodesPositive : ""}
                    onChange={(e) => {
                      const pos = e.target.value ? Number(e.target.value) : 0;
                      const nStage = pos === 0 ? "N0" : pos <= 2 ? "N1" : pos <= 6 ? "N2" : pos <= 15 ? "N3a" : "N3b";
                      onChange({ lymphNodesPositive: pos, nStage });
                    }}
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Claudin 18.2 表达 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Claudin 18.2 靶点</span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded font-bold">SPOTLIGHT佐妥昔</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ claudin182Status: "positive", claudin18_2Percentage: 80 })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.claudin182Status === "positive"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  阳性(&ge;75%)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ claudin182Status: "negative", claudin18_2Percentage: 20 })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.claudin182Status === "negative"
                      ? "bg-slate-700 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  阴性(&lt;75%)
                </button>
              </div>
            </div>

            {/* 腹水脱落细胞 CY */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">腹膜脱落细胞 (CY)</span>
                <span className="text-[10px] text-rose-600 font-bold">CY1 归为 M1</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ peritonealCytology: "negative", mStage: "M0" })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.peritonealCytology !== "positive"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  阴性(CY0)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ peritonealCytology: "positive", mStage: "M1" })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.peritonealCytology === "positive"
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  阳性(CY1·M1)
                </button>
              </div>
            </div>

            {/* 活动性溃疡 (ESD 判定) */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">活动性溃疡或瘢痕</span>
                <span className="text-[10px] text-slate-400">ESD 适应证关键</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ ulcerPresent: false })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    !data.ulcerPresent
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  无溃疡(UL-)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ulcerPresent: true })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.ulcerPresent
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  伴溃疡(UL+)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 原发性肝癌专科病理卡片 */}
      {isLiver && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-teal-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-teal-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  原发性肝癌储备与病理特征 (CNLC 2024 / Child-Pugh)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Child-Pugh 肝储备、微血管侵犯 MVI、门脉癌栓 PVTT 与肿瘤枚数最大径
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 shrink-0">
              指导手术切除 / TACE / HAIC / 靶免联合
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Child-Pugh */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Child-Pugh 肝功能分级</span>
                <span className="text-[10px] text-teal-700 font-bold">手术安全红线</span>
              </div>
              <div className="grid grid-cols-3 gap-1 h-8">
                {[
                  { key: "A", label: "A级(5~6分)" },
                  { key: "B", label: "B级(7~9分)" },
                  { key: "C", label: "C级(≥10分)" },
                ].map((grade) => (
                  <button
                    key={grade.key}
                    type="button"
                    onClick={() => onChange({ childPughGrade: grade.key, childPughScore: grade.key === "A" ? 5 : grade.key === "B" ? 7 : 10 })}
                    className={`text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      data.childPughGrade === grade.key
                        ? grade.key === "A"
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : grade.key === "B"
                          ? "bg-amber-600 text-white shadow-2xs"
                          : "bg-rose-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {grade.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MVI 微血管侵犯 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">微血管侵犯 (MVI)</span>
                <span className="text-[10px] text-slate-400">复发转移预后指标</span>
              </div>
              <div className="grid grid-cols-3 gap-1 h-8">
                {[
                  { key: "M0", label: "M0(无)" },
                  { key: "M1", label: "M1(低危)" },
                  { key: "M2", label: "M2(高危)" },
                ].map((mvi) => (
                  <button
                    key={mvi.key}
                    type="button"
                    onClick={() => onChange({ mviGrade: mvi.key })}
                    className={`text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      (data.mviGrade || "M0") === mvi.key
                        ? mvi.key === "M0"
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : mvi.key === "M1"
                          ? "bg-amber-600 text-white shadow-2xs"
                          : "bg-rose-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {mvi.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 门静脉癌栓 PVTT */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">门静脉癌栓 (PVTT)</span>
                <span className="text-[10px] text-rose-600 font-bold">CNLC IIIa 分期</span>
              </div>
              <div className="grid grid-cols-3 gap-1 h-8">
                {[
                  { key: "none", label: "无癌栓" },
                  { key: "portal_vein_VP1_VP2", label: "VP1-2分支" },
                  { key: "portal_vein_main_VP3_VP4", label: "VP3-4主干" },
                ].map((pv) => (
                  <button
                    key={pv.key}
                    type="button"
                    onClick={() => onChange({ vascularInvasion: pv.key, portalVeinTumorThrombus: pv.key })}
                    className={`text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      (data.vascularInvasion || "none") === pv.key
                        ? pv.key === "none"
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "bg-rose-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {pv.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 肿瘤枚数与最大径 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">病灶枚数与最大径</span>
                <span className="text-[10px] text-slate-400">米兰标准判定</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={data.tumorCount || "single"}
                  onChange={(e) => onChange({ tumorCount: e.target.value })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 cursor-pointer"
                >
                  <option value="single">单发病灶</option>
                  <option value="2-3">2~3 枚病灶</option>
                  <option value="multiple_ge4">≥ 4 枚多发</option>
                </select>
                <input
                  type="number"
                  step="0.1"
                  placeholder="长径(cm)"
                  value={data.maxTumorDiameter !== undefined && data.maxTumorDiameter !== null ? data.maxTumorDiameter : (data.tumorSize || "")}
                  onChange={(e) => onChange({ maxTumorDiameter: e.target.value ? Number(e.target.value) : null, tumorSize: e.target.value ? Number(e.target.value) : null })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            {/* 标志物: AFP & PIVKA-II */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">血清标志物 (AFP / PIVKA-II)</span>
                <span className="text-[10px] text-slate-400">生物学活性监测</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="AFP (ng/mL)"
                  value={data.afpLevel !== undefined && data.afpLevel !== null ? data.afpLevel : ""}
                  onChange={(e) => onChange({ afpLevel: e.target.value ? Number(e.target.value) : null })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
                <input
                  type="number"
                  placeholder="PIVKA-II"
                  value={data.pivkaIiLevel !== undefined && data.pivkaIiLevel !== null ? data.pivkaIiLevel : ""}
                  onChange={(e) => onChange({ pivkaIiLevel: e.target.value ? Number(e.target.value) : null })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            {/* 乙肝病毒学与抗病毒 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">乙肝病毒学与规范抗病毒</span>
                <span className="text-[10px] text-emerald-700 font-bold">病因阻断核心</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ antiviralTherapy: true, hbvStatus: "positive" })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.antiviralTherapy
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  规范抗病毒(ETV/TAF)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ antiviralTherapy: false })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    !data.antiviralTherapy
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  未抗病毒/阴性
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. 食管癌专科病理卡片 */}
      {isEsophageal && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-indigo-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                <Microscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  食管癌专科病理要素与解剖标尺 (AJCC 第 8 版 鳞癌规范)
                </h3>
                <p className="text-[11px] text-slate-500">
                  解剖亚部位、气管/大血管受侵致死风险、淋巴结清扫质控 (≥15枚) 与 SCC 标志物
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 shrink-0">
              指导新辅助放化疗 (CROSS/5010) 与手术安全
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 解剖亚部位与门齿距离 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">解剖部位与门齿距离</span>
                <span className="text-[10px] text-slate-400">厘米(cm)标尺</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={data.subsite || "middle_thoracic"}
                  onChange={(e) => onChange({ subsite: e.target.value })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 cursor-pointer"
                >
                  <option value="cervical">颈段(&lt;20cm)</option>
                  <option value="upper_thoracic">胸上段(20-25)</option>
                  <option value="middle_thoracic">胸中段(25-30)</option>
                  <option value="lower_thoracic">胸下段(30-40)</option>
                  <option value="egj_siewert_1">食管胃结合部</option>
                </select>
                <input
                  type="number"
                  placeholder="门齿距离(cm)"
                  value={data.incisorDistanceCm !== undefined && data.incisorDistanceCm !== null ? data.incisorDistanceCm : ""}
                  onChange={(e) => onChange({ incisorDistanceCm: e.target.value ? Number(e.target.value) : null })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
            </div>

            {/* 气管与降主动脉受侵风险 (致命红线) */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">气管与大血管受累 (红线)</span>
                <span className="text-[10px] text-rose-600 font-bold">瘘管/破裂高危</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ airwayInvasionRisk: false, aorticInvasionRisk: false })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    !data.airwayInvasionRisk && !data.aorticInvasionRisk
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  无气管/大血管侵犯
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ airwayInvasionRisk: true })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.airwayInvasionRisk || data.aorticInvasionRisk
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  见侵犯(TEF/T4b)
                </button>
              </div>
            </div>

            {/* 淋巴结清扫质控 (≥15枚) */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">淋巴结清扫质控 (≥15枚)</span>
                <span className="text-[10px] text-slate-400">二野 vs 三野</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="检出总数 (≥15)"
                  value={data.lymphNodesExamined !== undefined && data.lymphNodesExamined !== null ? data.lymphNodesExamined : ""}
                  onChange={(e) => onChange({ lymphNodesExamined: e.target.value ? Number(e.target.value) : null })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="转移数 (如 0)"
                  value={data.lymphNodesPositive !== undefined && data.lymphNodesPositive !== null ? data.lymphNodesPositive : ""}
                  onChange={(e) => {
                    const pos = e.target.value ? Number(e.target.value) : 0;
                    const nStage = pos === 0 ? "N0" : pos <= 2 ? "N1" : pos <= 6 ? "N2" : "N3";
                    onChange({ lymphNodesPositive: pos, nStage });
                  }}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 甲状腺癌专科病理卡片 */}
      {isThyroid && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-sky-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0">
                <Microscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  甲状腺癌专科病理要素与被膜侵犯 (AJCC 8th / ATA 2015)
                </h3>
                <p className="text-[11px] text-slate-500">
                  55 岁年龄分水岭、被膜外侵犯 (ETE)、中央区/颈侧区淋巴结与 ATA 复发分层
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 shrink-0">
              指导放射性碘清甲与 TSH 抑制
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 年龄 (55岁分水岭) */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">确诊年龄 (55 岁分水岭)</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  data.age && Number(data.age) < 55 ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                }`}>
                  {data.age && Number(data.age) < 55 ? "<55岁(无M1一律I期)" : "≥55岁(标准分期)"}
                </span>
              </div>
              <input
                type="number"
                placeholder="确诊年龄 (岁)"
                value={data.age !== undefined && data.age !== null ? data.age : (data.patientAge || "")}
                onChange={(e) => onChange({ age: e.target.value ? Number(e.target.value) : null, patientAge: e.target.value ? Number(e.target.value) : null })}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
              />
            </div>

            {/* 被膜外侵犯 ETE */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">被膜外侵犯 (ETE)</span>
                <span className="text-[10px] text-slate-400">T3b / T4a 分期</span>
              </div>
              <select
                value={data.extrathyroidalExtension || "none"}
                onChange={(e) => {
                  const ext = e.target.value;
                  const tStage = ext === "gross_organs_t4a" ? "T4a" : ext === "prevertebral_carotid_t4b" ? "T4b" : ext === "strap_muscles_t3b" ? "T3b" : data.tStage;
                  onChange({ extrathyroidalExtension: ext, ...(tStage ? { tStage } : {}) });
                }}
                className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 cursor-pointer"
              >
                <option value="none">无被膜外侵犯 (局限于腺体内)</option>
                <option value="microscopic">镜下微小被膜侵犯 (不影响T分期)</option>
                <option value="strap_muscles_t3b">侵犯带状肌 (T3b)</option>
                <option value="gross_organs_t4a">侵犯喉/气管/食管/喉返神经 (T4a)</option>
                <option value="prevertebral_carotid_t4b">侵犯椎前筋膜/颈动脉鞘 (T4b)</option>
              </select>
            </div>

            {/* 中央区 vs 颈侧区淋巴结 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">中央区(N1a) vs 侧颈(N1b)</span>
                <span className="text-[10px] text-slate-400">阳性转移枚数</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="中央区阳性(N1a)"
                  value={data.centralNodesPositive !== undefined && data.centralNodesPositive !== null ? data.centralNodesPositive : ""}
                  onChange={(e) => {
                    const cPos = e.target.value ? Number(e.target.value) : 0;
                    const lPos = Number(data.lateralNodesPositive || 0);
                    const nStage = lPos > 0 ? "N1b" : cPos > 0 ? "N1a" : "N0";
                    onChange({ centralNodesPositive: cPos, nStage });
                  }}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="侧颈阳性(N1b)"
                  value={data.lateralNodesPositive !== undefined && data.lateralNodesPositive !== null ? data.lateralNodesPositive : ""}
                  onChange={(e) => {
                    const lPos = e.target.value ? Number(e.target.value) : 0;
                    const cPos = Number(data.centralNodesPositive || 0);
                    const nStage = lPos > 0 ? "N1b" : cPos > 0 ? "N1a" : "N0";
                    onChange({ lateralNodesPositive: lPos, nStage });
                  }}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. 子宫内膜癌专科病理卡片 */}
      {isEndometrial && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-purple-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0">
                <Dna className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  子宫内膜癌专科病理与 FIGO 2023 分子分型
                </h3>
                <p className="text-[11px] text-slate-500">
                  POLE / MMRd / NSMP / p53abn 四分法、肌层浸润深度与脉管间隙浸润 (LVSI)
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 shrink-0">
              POLE免化疗 / p53强化放化疗
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* FIGO 2023 四大分子亚型 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">FIGO 2023 分子分型</span>
                <span className="text-[10px] text-purple-600 font-bold">升降期判定核心</span>
              </div>
              <select
                value={data.molecularSubtype || "NSMP"}
                onChange={(e) => onChange({ molecularSubtype: e.target.value })}
                className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 cursor-pointer"
              >
                <option value="POLEmut">POLEmut (超高突变·降期免放化疗)</option>
                <option value="MMRd">MMRd (错配修复缺陷·免疫敏感)</option>
                <option value="NSMP">NSMP (无特异分子谱·内分泌敏感)</option>
                <option value="p53abn">p53abn (p53异常·触发升期强化)</option>
              </select>
            </div>

            {/* 肌层浸润深度 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">肌层浸润深度</span>
                <span className="text-[10px] text-slate-400">1/2 为分界线</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ myometrialInvasion: "less_than_50", tStage: "T1a" })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.myometrialInvasion !== "greater_equal_50"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  浅肌层(&lt;50%·T1a)
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ myometrialInvasion: "greater_equal_50", tStage: "T1b" })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.myometrialInvasion === "greater_equal_50"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  深肌层(&ge;50%·T1b)
                </button>
              </div>
            </div>

            {/* 脉管间隙浸润 LVSI */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">脉管间隙浸润 (LVSI)</span>
                <span className="text-[10px] text-slate-400">PORTEC-4a 危险指标</span>
              </div>
              <div className="grid grid-cols-3 gap-1 h-8">
                {[
                  { key: "negative", label: "阴性" },
                  { key: "focal", label: "局灶" },
                  { key: "substantial", label: "显著广泛" },
                ].map((lv) => (
                  <button
                    key={lv.key}
                    type="button"
                    onClick={() => onChange({ lvsiStatus: lv.key })}
                    className={`text-xs rounded-lg font-bold transition-all cursor-pointer ${
                      (data.lvsiStatus || "negative") === lv.key
                        ? lv.key === "negative"
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "bg-amber-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {lv.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. 宫颈癌专科病理卡片 */}
      {isCervical && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-teal-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-teal-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                <Microscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  宫颈癌专科病理要素与浸润深度 (FIGO 2018 / AJCC 9th)
                </h3>
                <p className="text-[11px] text-slate-500">
                  间质浸润深度 (mm)、病灶最大径、宫旁浸润 (IIB 禁盲目开刀手术) 与高危 HPV
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 shrink-0">
              严格把控同步放化疗 (CCRT) 适应证
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 间质浸润深度 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">间质浸润深度 (mm)</span>
                <span className="text-[10px] text-teal-700 font-semibold">&le;3mm 为 IA1</span>
              </div>
              <input
                type="number"
                step="0.1"
                placeholder="如 2.5 (毫米)"
                value={data.stromalInvasionMm !== undefined && data.stromalInvasionMm !== null ? data.stromalInvasionMm : ""}
                onChange={(e) => {
                  const depth = e.target.value ? Number(e.target.value) : null;
                  const tStage = depth && depth <= 3 ? "T1a1" : depth && depth <= 5 ? "T1a2" : data.tStage;
                  onChange({ stromalInvasionMm: depth, ...(tStage ? { tStage } : {}) });
                }}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
              />
              <p className="text-[10px] text-slate-400">&le;3mm 具备单纯冷刀锥切保育指征</p>
            </div>

            {/* 宫旁浸润 (IIB 红线) */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">宫旁浸润 (FIGO IIB)</span>
                <span className="text-[10px] text-rose-600 font-bold">根治性放化疗红线</span>
              </div>
              <div className="flex gap-1 h-8">
                <button
                  type="button"
                  onClick={() => onChange({ parametrialInvasion: false })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    !data.parametrialInvasion
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  无宫旁浸润
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ parametrialInvasion: true, tStage: "T2b" })}
                  className={`flex-1 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                    data.parametrialInvasion
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  见宫旁浸润(IIB·禁手术)
                </button>
              </div>
              <p className="text-[10px] text-slate-400">侵及宫旁为同步放化疗 (CCRT) 绝对指征</p>
            </div>

            {/* 阴道侵犯深度 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">阴道累及范围</span>
                <span className="text-[10px] text-slate-400">IIA vs IIIA</span>
              </div>
              <select
                value={data.vaginalInvolvement || "none"}
                onChange={(e) => onChange({ vaginalInvolvement: e.target.value })}
                className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 cursor-pointer"
              >
                <option value="none">无阴道累及</option>
                <option value="upper_two_thirds">阴道上 2/3 (FIGO IIA期)</option>
                <option value="lower_one_third">阴道下 1/3 (FIGO IIIA期)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 9. 胰腺癌专科病理卡片 */}
      {isPancreatic && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-amber-200/90 shadow-soft space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  胰腺癌血管可切除性与病理要素 (NCCN / CSCO 2024)
                </h3>
                <p className="text-[11px] text-slate-500">
                  解剖可切除性分类、SMA / 腹腔干接触、SMV 门静脉受累角度与 CA19-9
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
              指导 Whipple / RAMPS / 新辅助转化
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 解剖可切除性 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">血管可切除性分类</span>
                <span className="text-[10px] text-amber-700 font-bold">NCCN 治疗决策分水岭</span>
              </div>
              <select
                value={data.resectabilityStatus || "resectable"}
                onChange={(e) => onChange({ resectabilityStatus: e.target.value })}
                className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 cursor-pointer"
              >
                <option value="resectable">可直接切除 (Resectable)</option>
                <option value="borderline_resectable">交界可切除 (需新辅助化疗)</option>
                <option value="locally_advanced">局部晚期不可切除 (包绕动脉&gt;180°)</option>
                <option value="metastatic">远处转移性 (系统化疗为主)</option>
              </select>
            </div>

            {/* 肠系膜上动脉与静脉接触 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">大血管接触角度</span>
                <span className="text-[10px] text-slate-400">SMA / SMV 门静脉</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={data.smaInvolvement ? "positive" : "negative"}
                  onChange={(e) => onChange({ smaInvolvement: e.target.value === "positive" })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 cursor-pointer"
                >
                  <option value="negative">SMA 未受侵</option>
                  <option value="positive">SMA 受侵包绕</option>
                </select>
                <select
                  value={data.smvPvDegree || "<=180"}
                  onChange={(e) => onChange({ smvPvDegree: e.target.value })}
                  className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs text-slate-800 cursor-pointer"
                >
                  <option value="<=180">SMV接触 &le; 180°</option>
                  <option value=">180">SMV浸润 &gt; 180°</option>
                  <option value="occluded">SMV 管腔闭塞</option>
                </select>
              </div>
            </div>

            {/* 糖类抗原 CA19-9 */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">糖类抗原 CA19-9 (U/mL)</span>
                <span className="text-[10px] text-slate-400">正常参考 0~37</span>
              </div>
              <input
                type="number"
                placeholder="如 125 (U/mL)"
                value={data.ca199 !== undefined && data.ca199 !== null ? data.ca199 : ""}
                onChange={(e) => onChange({ ca199: e.target.value ? Number(e.target.value) : null })}
                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
              />
              <p className="text-[10px] text-slate-400">术前 &gt;1000 强烈提示微转移，推荐新辅助</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
