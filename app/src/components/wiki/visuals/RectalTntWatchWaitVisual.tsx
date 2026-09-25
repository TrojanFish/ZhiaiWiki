"use client";

import React, { useState } from "react";
import { GitBranch, ShieldCheck, AlertCircle, HeartPulse, Eye, Activity, CheckCircle2, ChevronRight, Key } from "lucide-react";

type TntPathway = "tnt_rapido" | "tnt_prodige" | "watch_wait";

interface PathwayInfo {
  title: string;
  badge: string;
  scheme: string;
  timeline: string;
  pcrRate: string;
  organPreservationNote: string;
  color: string;
  badgeBg: string;
  borderCol: string;
}

export function RectalTntWatchWaitVisual() {
  const [selectedPath, setSelectedPath] = useState<TntPathway>("watch_wait");

  const pathways: Record<TntPathway, PathwayInfo> = {
    watch_wait: {
      title: "【前沿最高境界】Watch & Wait 观察等待器官保留策略",
      badge: "免切除直肠 · 保留自主控便",
      scheme: "TNT 全程新辅助 → 经严苛三联检查 (直肠指诊+内镜白斑无残留+MRI DWI无高亮) 确立 cCR → 豁免手术",
      timeline: "密切强化监测：第 1~2 年每 2~3 个月一次 (指诊+高清肠镜+HR-MRI)，第 3~5 年每 6 个月一次",
      pcrRate: "cCR 率达 25% ~ 30% (dMMR 免疫治疗甚至超 90%)",
      organPreservationNote: "即使随访期间发生 10%~15% 的肿瘤局部再生 (Local Regrowth)，及时施行补救性 TME 手术根治成功率依然超 90%，总体长期总生存率不受损害！",
      color: "text-emerald-400",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      borderCol: "border-emerald-500/30 bg-emerald-950/20"
    },
    tnt_rapido: {
      title: "RAPIDO 模式 · 短程放疗 + 强化巩固化疗",
      badge: "Lancet Oncol 2021 · 国际 1 类证据",
      scheme: "短程高剂量放疗 (SCRT 5Gy × 5次) → 间断 1~2 周 → 6 周期 CAPOX 或 9 周期 mFOLFOX6 巩固化疗",
      timeline: "总周期约 18~22 周 → 全面多学科评估 (Restaging MRI + 肠镜)",
      pcrRate: "病理完全缓解 (pCR) 率 28.4% (传统放化疗仅 14%)",
      organPreservationNote: "将术后可能因体弱无法耐受的辅助化疗全部前移到术前执行，极大地抑制了早期血行远处转移，尤其适用于伴有 CRM 阳性或 EMVI 高危病案。",
      color: "text-sky-400",
      badgeBg: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      borderCol: "border-sky-500/30 bg-sky-950/20"
    },
    tnt_prodige: {
      title: "PRODIGE 23 模式 · 三药诱导化疗 + 长程同步放化疗",
      badge: "Lancet Oncol 2021 · 显著延长 DFS",
      scheme: "mFOLFIRINOX 强化三药诱导化疗 (6周期) → 长程同步放化疗 (50.4Gy/28次 + 卡培他滨) → 评估",
      timeline: "总周期约 24 周 → 严格评估退缩程度 → 手术 / W&W",
      pcrRate: "病理完全缓解 (pCR) 率 27.8%",
      organPreservationNote: "适合体能状态极佳 (ECOG 0~1分)、肿瘤负荷巨大、或者合并多发盆腔淋巴结肿大的年轻直肠癌患者，快速强力缩瘤。",
      color: "text-purple-400",
      badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      borderCol: "border-purple-500/30 bg-purple-950/20"
    }
  };

  const curr = pathways[selectedPath];

  return (
    <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 text-white select-none border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-amber-400" />
          <span>直肠癌 TNT 全程新辅助与器官保留 (Watch & Wait) 决策树</span>
        </span>
        <span className="text-[10px] text-slate-400">RAPIDO · PRODIGE 23 · cCR</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        <button
          type="button"
          onClick={() => setSelectedPath("watch_wait")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            selectedPath === "watch_wait"
              ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Watch & Wait (cCR)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPath("tnt_rapido")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            selectedPath === "tnt_rapido"
              ? "bg-sky-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>RAPIDO 模式</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPath("tnt_prodige")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            selectedPath === "tnt_prodige"
              ? "bg-purple-500 text-white shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>PRODIGE 23 模式</span>
        </button>
      </div>

      {/* 决策路径可视化流程图 (SVG) */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-3">
        <svg viewBox="0 0 340 145" className="w-full h-auto">
          {/* Node 1: 确诊 LARC */}
          <rect x="5" y="55" width="65" height="35" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <text x="37" y="70" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" textAnchor="middle">确诊中低位直肠癌</text>
          <text x="37" y="80" fill="#94a3b8" fontSize="5.5" textAnchor="middle">cT3-4 或 N+ / CRM危</text>

          {/* Arrow 1 */}
          <line x1="70" y1="72" x2="88" y2="72" stroke="#64748b" strokeWidth="1.5" />
          <polygon points="88,69 94,72 88,75" fill="#64748b" />

          {/* Node 2: TNT 实施 */}
          <rect
            x="95"
            y="45"
            width="85"
            height="55"
            rx="6"
            fill="#0f172a"
            stroke={selectedPath === "watch_wait" ? "#10b981" : selectedPath === "tnt_rapido" ? "#38bdf8" : "#c084fc"}
            strokeWidth="1.8"
          />
          <text x="137" y="60" fill="#f8fafc" fontSize="7" fontWeight="bold" textAnchor="middle">全程新辅助 (TNT)</text>
          <text x="137" y="72" fill="#94a3b8" fontSize="6" textAnchor="middle">高强度放疗 + 化疗</text>
          <text x="137" y="82" fill="#38bdf8" fontSize="5.5" textAnchor="middle">全部前置扫荡微转移</text>
          <text x="137" y="92" fill="#34d399" fontSize="6" fontWeight="bold" textAnchor="middle">pCR 率可达 28%~30%</text>

          {/* Arrow 2 */}
          <line x1="180" y1="72" x2="198" y2="72" stroke="#64748b" strokeWidth="1.5" />
          <polygon points="198,69 204,72 198,75" fill="#64748b" />

          {/* Node 3: 多学科严格疗效再评估 (Restaging) */}
          <rect x="205" y="48" width="60" height="50" rx="5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />
          <text x="235" y="62" fill="#fde68a" fontSize="6.5" fontWeight="bold" textAnchor="middle">治疗后 8~12 周</text>
          <text x="235" y="73" fill="#cbd5e1" fontSize="6" textAnchor="middle">疗效终极评估</text>
          <text x="235" y="83" fill="#94a3b8" fontSize="5.5" textAnchor="middle">DRE指诊+内镜</text>
          <text x="235" y="91" fill="#94a3b8" fontSize="5.5" textAnchor="middle">+ HR-MRI (DWI)</text>

          {/* Branch Up: cCR ➔ Watch & Wait */}
          <path d="M 265 65 Q 275 35 285 30" fill="none" stroke="#10b981" strokeWidth="1.8" />
          <polygon points="283,27 289,30 285,34" fill="#10b981" />

          <rect
            x="275"
            y="12"
            width="60"
            height="36"
            rx="5"
            fill="#064e3b"
            stroke="#34d399"
            strokeWidth={selectedPath === "watch_wait" ? "2" : "1"}
          />
          <text x="305" y="24" fill="#6ee7b7" fontSize="6.5" fontWeight="bold" textAnchor="middle">临床完全缓解 (cCR)</text>
          <text x="305" y="34" fill="#a7f3d0" fontSize="6" fontWeight="bold" textAnchor="middle">Watch & Wait</text>
          <text x="305" y="42" fill="#ecfdf5" fontSize="5" textAnchor="middle">免切直肠 · 保留肛门</text>

          {/* Branch Down: Non-cCR ➔ TME Surgery */}
          <path d="M 265 85 Q 275 115 285 120" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="283,117 289,120 285,124" fill="#94a3b8" />

          <rect x="275" y="102" width="60" height="36" rx="5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <text x="305" y="115" fill="#e2e8f0" fontSize="6.5" fontWeight="bold" textAnchor="middle">残存病灶 (Non-cCR)</text>
          <text x="305" y="125" fill="#f87171" fontSize="6" textAnchor="middle">精细 TME 手术切除</text>
          <text x="305" y="133" fill="#94a3b8" fontSize="5" textAnchor="middle">肿瘤降期更易保肛</text>
        </svg>
      </div>

      {/* 详情与指导卡片 */}
      <div className={`p-3 rounded-xl border ${curr.borderCol} space-y-2`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className={`text-xs font-bold ${curr.color} flex items-center gap-1`}>
            <Activity className="w-3.5 h-3.5" />
            <span>{curr.title}</span>
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${curr.badgeBg}`}>
            {curr.badge}
          </span>
        </div>

        {/* 方案组合 */}
        <div className="text-[11px] text-slate-200">
          <span className="text-slate-400 font-bold">治疗架构：</span>
          {curr.scheme}
        </div>

        {/* 疗效数据与时间表 */}
        <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/70 p-2 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-400 block">疗程周期规划：</span>
            <span className="text-sky-300 font-bold">{curr.timeline}</span>
          </div>
          <div>
            <span className="text-slate-400 block">完全缓解 (pCR/cCR) 率：</span>
            <span className="text-emerald-400 font-bold">{curr.pcrRate}</span>
          </div>
        </div>

        {/* 器官保留与随访金钥匙 */}
        <div className="text-[10px] text-slate-300 leading-relaxed pt-1">
          <span className="text-amber-400 font-bold inline-flex items-center gap-1 mr-1">
            <Key className="w-3 h-3 text-amber-400 shrink-0" />
            <span>器官保留与安全性：</span>
          </span>
          {curr.organPreservationNote}
        </div>
      </div>
    </div>
  );
}
