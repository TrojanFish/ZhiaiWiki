"use client";

import React from "react";
import {
  Microscope,
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
  if (cancerType !== "breast") {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 乳腺癌专科病理卡片 */}
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
            <p className="text-[10px] text-slate-400">non-pCR 指导 KATHERINE/CREATE-X 强化方案</p>
          </div>

          {/* 组织学类型 */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">组织学类型</span>
              <span className="text-[10px] text-slate-400">WHO 肿瘤分类</span>
            </div>
            <div className="grid grid-cols-4 gap-1 h-8">
              {[
                { val: "IDC", label: "浸润导管" },
                { val: "ILC", label: "小叶癌" },
                { val: "DCIS", label: "原位癌" },
                { val: "other", label: "特殊型" },
              ].map(({ val, label }) => {
                const isSelected = (data.histologyType || "IDC") === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onChange({ histologyType: val, histology: val })}
                    className={`text-[10px] sm:text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center px-0.5 ${
                      isSelected
                        ? "bg-rose-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 truncate">约 80% 为浸润导管癌(IDC)；小叶癌(ILC)具多灶倾向</p>
          </div>

          {/* 发病解剖侧别 */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">发病侧别</span>
              <span className="text-[10px] text-slate-400">原发病灶位置</span>
            </div>
            <div className="grid grid-cols-3 gap-1 h-8">
              {[
                { val: "left", label: "左乳" },
                { val: "right", label: "右乳" },
                { val: "bilateral", label: "双侧" },
              ].map(({ val, label }) => {
                const isSelected = (data.breastLaterality || "left") === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onChange({ breastLaterality: val })}
                    className={`text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? "bg-rose-600 text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400 truncate">双侧乳腺癌需排除遗传性 BRCA1/2 突变高风险</p>
          </div>

          {/* BI-RADS 影像评级 */}
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">BI-RADS 评级</span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-1 rounded font-bold">ACR 第5版</span>
            </div>
            <div className="flex items-center gap-1.5">
              <select
                value={data.biRads ? String(data.biRads).toUpperCase().replace(/BI-?RADS\s*/i, "").replace(/类/g, "") : "4B"}
                onChange={(e) => onChange({ biRads: e.target.value })}
                className="w-full h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 cursor-pointer font-medium"
              >
                <option value="1">1 类 (正常阴性 · 恶性率 0%)</option>
                <option value="2">2 类 (明确良性囊肿/假体 · 恶性率 0%)</option>
                <option value="3">3 类 (良性可能大 · 恶性率 &le;2% · 3~6月随访)</option>
                <option value="4A">4A 类 (低度可疑恶性 2%~10% · 建议活检)</option>
                <option value="4B">4B 类 (中度可疑恶性 10%~50% · 规范活检)</option>
                <option value="4C">4C 类 (高度可疑恶性 50%~95% · 立即活检)</option>
                <option value="5">5 类 (高度提示恶性 &ge;95% · 必须活检)</option>
                <option value="6">6 类 (病理已证实恶性 · 准备治疗方案)</option>
              </select>
            </div>
            <p className="text-[10px] text-slate-400 truncate">超声 / 钼靶 / 增强 MRI 影像报告权威评级标准</p>
          </div>
        </div>
      </div>
    </div>
  );
}
