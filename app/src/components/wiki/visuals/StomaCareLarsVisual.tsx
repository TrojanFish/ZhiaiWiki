"use client";

import React, { useState } from "react";
import { HeartPulse, ShieldAlert, ShieldCheck, CheckCircle2, ChevronRight, Activity, Smile } from "lucide-react";

type CareView = "stoma_leak_prevention" | "lars_rehab";

export function StomaCareLarsVisual() {
  const [activeView, setActiveView] = useState<CareView>("stoma_leak_prevention");

  return (
    <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 text-white select-none border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <HeartPulse className="w-4 h-4 text-amber-400" />
          <span>造口居家防漏与术后 LARS 排便康复指南</span>
        </span>
        <span className="text-[10px] text-slate-400">生活质量 · 尊严守护</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 mb-3">
        <button
          type="button"
          onClick={() => setActiveView("stoma_leak_prevention")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeView === "stoma_leak_prevention"
              ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>造口底盘防漏防红皮</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView("lars_rehab")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeView === "lars_rehab"
              ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>保肛后 LARS 排便康复</span>
        </button>
      </div>

      {/* Visual Canvas (SVG) */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-3">
        {activeView === "stoma_leak_prevention" ? (
          <svg viewBox="0 0 340 140" className="w-full h-auto">
            {/* Step 1: 测量造口基底 */}
            <g transform="translate(10, 15)">
              <rect width="95" height="110" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <circle cx="47" cy="45" r="22" fill="#be123c" />
              <circle cx="47" cy="45" r="16" fill="#f43f5e" />
              <text x="47" y="48" fill="#fff" fontSize="6.5" fontWeight="bold" textAnchor="middle">造口黏膜</text>
              <line x1="25" y1="45" x2="69" y2="45" stroke="#fef08a" strokeWidth="1.2" strokeDasharray="2,2" />
              <text x="47" y="78" fill="#fbbf24" fontSize="7" fontWeight="bold" textAnchor="middle">第一步：测量基底</text>
              <text x="47" y="90" fill="#94a3b8" fontSize="5.5" textAnchor="middle">使用卡尺准确量取直径</text>
              <text x="47" y="100" fill="#94a3b8" fontSize="5.5" textAnchor="middle">术后前3月会逐渐缩小</text>
            </g>

            {/* Step 2: 剪裁底盘 (基底 + 1~2mm) */}
            <g transform="translate(120, 15)">
              <rect width="95" height="110" rx="6" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="47" cy="45" r="28" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="47" cy="45" r="24" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,2" />
              <circle cx="47" cy="45" r="18" fill="#be123c" opacity="0.6" />
              <text x="47" y="78" fill="#fde68a" fontSize="7" fontWeight="bold" textAnchor="middle">第二步：精准剪裁</text>
              <text x="47" y="90" fill="#38bdf8" fontSize="6" fontWeight="bold" textAnchor="middle">底盘孔径 = 基底 + 1~2mm</text>
              <text x="47" y="100" fill="#fca5a5" fontSize="5.5" textAnchor="middle">剪太大漏粪，剪太小勒出血</text>
            </g>

            {/* Step 3: 防漏膏/防漏贴环抚平 */}
            <g transform="translate(230, 15)">
              <rect width="100" height="110" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
              <circle cx="50" cy="45" r="28" fill="#064e3b" opacity="0.5" stroke="#34d399" strokeWidth="1.2" />
              <circle cx="50" cy="45" r="22" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2" />
              <circle cx="50" cy="45" r="16" fill="#f43f5e" />
              <text x="50" y="48" fill="#fff" fontSize="6" textAnchor="middle">密封贴环</text>
              <text x="50" y="78" fill="#6ee7b7" fontSize="7" fontWeight="bold" textAnchor="middle">第三步：防漏密闭</text>
              <text x="50" y="90" fill="#94a3b8" fontSize="5.5" textAnchor="middle">防漏膏填平皮肤皱褶</text>
              <text x="50" y="100" fill="#a7f3d0" fontSize="5.5" textAnchor="middle">手掌温热按压 5 分钟</text>
            </g>
          </svg>
        ) : (
          <svg viewBox="0 0 340 140" className="w-full h-auto">
            {/* LARS 康复恢复曲线示意图 */}
            {/* 坐标轴 */}
            <line x1="30" y1="15" x2="30" y2="115" stroke="#475569" strokeWidth="1.5" />
            <line x1="30" y1="115" x2="320" y2="115" stroke="#475569" strokeWidth="1.5" />
            
            <text x="15" y="25" fill="#94a3b8" fontSize="6" transform="rotate(-90 15,25)">排便功能与满意度</text>
            <text x="315" y="125" fill="#94a3b8" fontSize="6" textAnchor="end">术后月数</text>

            {/* X 轴刻度 */}
            <text x="50" y="125" fill="#64748b" fontSize="6">第1月</text>
            <text x="120" y="125" fill="#64748b" fontSize="6">第3月</text>
            <text x="200" y="125" fill="#64748b" fontSize="6">第6月</text>
            <text x="280" y="125" fill="#64748b" fontSize="6">第12~24月</text>

            {/* 恢复曲线 (红变绿曲线) */}
            <path
              d="M 35 105 Q 60 95 120 75 Q 200 45 310 32"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            
            {/* 早期困难期 */}
            <circle cx="50" cy="98" r="4" fill="#f43f5e" />
            <rect x="35" y="65" width="70" height="25" rx="3" fill="#881337" opacity="0.85" />
            <text x="70" y="75" fill="#ffe4e6" fontSize="5.5" textAnchor="middle" fontWeight="bold">频次高达 10~15次/天</text>
            <text x="70" y="85" fill="#fecdd3" fontSize="5" textAnchor="middle">排便急迫感 · 肛周潮红</text>

            {/* 逐步适应期 */}
            <circle cx="160" cy="60" r="4" fill="#f59e0b" />
            <rect x="130" y="28" width="75" height="24" rx="3" fill="#78350f" opacity="0.85" />
            <text x="167" y="38" fill="#fef3c7" fontSize="5.5" textAnchor="middle" fontWeight="bold">药物+饮食+Kegel锻炼</text>
            <text x="167" y="47" fill="#fde68a" fontSize="5" textAnchor="middle">直肠顺应性代偿恢复</text>

            {/* 长期平稳期 */}
            <circle cx="280" cy="36" r="4" fill="#10b981" />
            <rect x="235" y="52" width="85" height="24" rx="3" fill="#064e3b" opacity="0.85" />
            <text x="277" y="62" fill="#a7f3d0" fontSize="5.5" textAnchor="middle" fontWeight="bold">排便恢复至 1~3次/天</text>
            <text x="277" y="71" fill="#ecfdf5" fontSize="5" textAnchor="middle">完全自主掌控 · 正常生活</text>
          </svg>
        )}
      </div>

      {/* 临床详情面板 */}
      {activeView === "stoma_leak_prevention" ? (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-950/20 space-y-2 text-[11px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-amber-400 inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>造口「零渗漏」五步口诀</span>
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">防漏即防溃破</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            1. <strong className="text-amber-300">量准基底：</strong>水肿完全消退需 6~8 周，每次换袋必须重新用测量板核准尺寸；<br />
            2. <strong className="text-amber-300">只留 1~2 毫米：</strong>孔隙过大导致强碱性消化液持续灼烧黏膜周围皮肤（粪水性皮炎）；<br />
            3. <strong className="text-amber-300">防漏填平：</strong>用防漏贴环或防漏膏填平腹壁刀口疤痕与凹陷褶皱，形成物理密封坝；<br />
            4. <strong className="text-amber-300">手温保驾：</strong>粘贴底盘后，手掌心覆在底盘上温热按压 3~5 分钟，水胶体遇体温黏性倍增；<br />
            5. <strong className="text-amber-300">及时排空：</strong>造口袋粪便达 1/3~1/2 时立即倾倒，避免重力拉扯造成底盘脱落。
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-2 text-[11px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-emerald-400 inline-flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>低位前切除综合征 (LARS) 康复三板斧</span>
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">控便可逆代偿</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            1. <strong className="text-emerald-300">生理机制明白看：</strong>直肠切除后天然「储粪囊」消失，新吻合的新直肠需要 6~12 个月逐渐扩张代偿；<br />
            2. <strong className="text-emerald-300">饮食调理第一招：</strong>补充可溶性膳食纤维（洋车前子壳 / 果胶），吸附肠道水分使稀便成形；避免高油高糖产气食物；<br />
            3. <strong className="text-emerald-300">适量用药稳控便：</strong>餐前或排便频繁时，遵医嘱口服盐酸洛哌丁胺胶囊 (易蒙停) 延缓肠蠕动；<br />
            4. <strong className="text-emerald-300">Kegel 提肛肌锻炼：</strong>每天早中晚各做 3 组，每组 15 次收缩提肛动作，强化外括约肌自主控便力量！
          </p>
        </div>
      )}
    </div>
  );
}
