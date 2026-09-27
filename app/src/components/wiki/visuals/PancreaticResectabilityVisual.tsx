"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

interface StageDetail {
  id: "resectable" | "borderline" | "unresectable";
  title: string;
  badge: string;
  badgeColor: string;
  veinStatus: string;
  arteryStatus: string;
  clinicalAction: string;
}

const STAGE_CONFIGS: Record<string, StageDetail> = {
  resectable: {
    id: "resectable",
    title: "可直接切除 (Resectable)",
    badge: "根治机会高",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    veinStatus: "未侵犯 SMV/PV 或仅粘连 ≤180°",
    arteryStatus: "腹腔干 (CA) / SMA / CHA 轮廓光整，完全游离",
    clinicalAction: "首选多学科 MDT 会诊后行 R0 根治性切除 (Whipple 或 RAMPS)，术后序贯 mFOLFIRINOX 辅助化疗。",
  },
  borderline: {
    id: "borderline",
    title: "交界可切除 (Borderline Resectable)",
    badge: "强推新辅助转化",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    veinStatus: "受侵 >180° 或短段闭塞，但远近端血管具备重建条件",
    arteryStatus: "肿瘤邻近或包绕腹腔干 / SMA ≤180°",
    clinicalAction: "强烈推荐 4~6 周期强效新辅助转化治疗 (mFOLFIRINOX/AG)，退缩降期后再评估根治手术。",
  },
  unresectable: {
    id: "unresectable",
    title: "局部进展不可切 (Locally Advanced)",
    badge: "系统综合治疗",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    veinStatus: "双侧血管广泛包绕侵犯，缺乏手术重建通道",
    arteryStatus: "包绕腹腔干或 SMA >180°，失去解剖学安全平面",
    clinicalAction: "以系统性化疗与靶向免疫为主，维持生活质量与带瘤生存，定期复查评估二线转化潜力。",
  },
};

export function PancreaticResectabilityVisual() {
  const [activeTab, setActiveTab] = useState<"resectable" | "borderline" | "unresectable">("borderline");
  const current = STAGE_CONFIGS[activeTab];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* 头部标题与控制切换器 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🫐 胰腺解剖与血管侵犯三分类动态模拟器</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            基于 NCCN / CSCO 肠系膜上血管 (SMV/SMA) 受累程度判定可切除性
          </p>
        </div>
        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 shrink-0 self-start sm:self-auto">
          {(["resectable", "borderline", "unresectable"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === key
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {key === "resectable" ? "可切除" : key === "borderline" ? "交界可切" : "不可切"}
            </button>
          ))}
        </div>
      </div>

      {/* SVG 纯矢量解剖示意图 (零外部库, 响应式 viewBox) */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2.2/1] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-2">
        <svg viewBox="0 0 460 200" className="w-full h-full select-none" role="img" aria-label="胰腺解剖与血管切除性示意图">
          {/* 1. 动脉管道 (SMA) */}
          <path d="M 280 20 Q 280 100 290 180" fill="none" stroke="#dc2626" strokeWidth="14" strokeLinecap="round" opacity="0.85" />
          <text x="295" y="40" fill="#dc2626" fontSize="10" fontWeight="bold">SMA 肠系膜上动脉</text>

          {/* 2. 静脉管道 (SMV / 门静脉) */}
          <path d="M 230 20 Q 240 100 240 180" fill="none" stroke="#0284c7" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
          <text x="170" y="40" fill="#0284c7" fontSize="10" fontWeight="bold">SMV 门静脉主干</text>

          {/* 3. 胰腺主体轮廓 */}
          <path
            d="M 60 110 C 90 80, 160 85, 230 95 C 290 105, 360 80, 410 95 C 430 100, 420 130, 380 135 C 300 145, 180 140, 120 150 C 70 160, 45 130, 60 110 Z"
            fill="#fed7aa"
            stroke="#fb923c"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <text x="110" y="115" fill="#9a3412" fontSize="11" fontWeight="bold">胰腺体尾部</text>
          <text x="330" y="120" fill="#9a3412" fontSize="11" fontWeight="bold">胰头部 (钩突)</text>

          {/* 4. 动态肿瘤病灶与血管粘连范围指示 */}
          {activeTab === "resectable" && (
            <g className="transition-all duration-300">
              <circle cx="170" cy="115" r="16" fill="#f43f5e" opacity="0.85" stroke="#ffffff" strokeWidth="2" />
              <circle cx="170" cy="115" r="22" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <text x="170" y="119" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">病灶</text>
              <text x="170" y="148" fill="#059669" fontSize="10" fontWeight="bold" textAnchor="middle">✓ 与大血管界限分明</text>
            </g>
          )}

          {activeTab === "borderline" && (
            <g className="transition-all duration-300">
              <circle cx="232" cy="105" r="20" fill="#f43f5e" opacity="0.9" stroke="#ffffff" strokeWidth="2" />
              <path d="M 232 85 A 20 20 0 0 1 248 115" fill="none" stroke="#f59e0b" strokeWidth="4" />
              <text x="232" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">病灶</text>
              <text x="232" y="142" fill="#d97706" fontSize="10" fontWeight="bold" textAnchor="middle">⚠ 浸润静脉≤180° (可重建)</text>
            </g>
          )}

          {activeTab === "unresectable" && (
            <g className="transition-all duration-300">
              <circle cx="260" cy="100" r="28" fill="#f43f5e" opacity="0.95" stroke="#ffffff" strokeWidth="2" />
              <circle cx="260" cy="100" r="34" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="4 2" />
              <text x="260" y="104" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">病灶</text>
              <text x="260" y="146" fill="#e11d48" fontSize="10" fontWeight="bold" textAnchor="middle">✕ 广泛包绕 SMA/腹腔干&gt;180°</text>
            </g>
          )}
        </svg>
      </div>

      {/* 底部临床破恐解读卡 */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">{current.title}</span>
            <span className={`text-2xs px-2 py-0.5 rounded-full border font-semibold ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
            <span className="font-semibold text-slate-700 block mb-0.5">静脉受累 (SMV/PV)：</span>
            {current.veinStatus}
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
            <span className="font-semibold text-slate-700 block mb-0.5">动脉受累 (SMA/CA)：</span>
            {current.arteryStatus}
          </div>
        </div>
        <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-start gap-2">
          <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">临床推荐策略：</span>
            {current.clinicalAction}
          </div>
        </div>
      </div>
    </div>
  );
}
