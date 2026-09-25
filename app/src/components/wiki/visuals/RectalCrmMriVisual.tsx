"use client";

import React, { useState } from "react";
import { Layers, ShieldCheck, AlertTriangle, Activity, Eye, CheckCircle2, Crosshair } from "lucide-react";

type CrmStatus = "safe" | "threatened" | "emvi";

interface CrmDetails {
  title: string;
  crmDistance: string;
  localRecurrenceRisk: string;
  mriSign: string;
  guidance: string;
  color: string;
  badgeBg: string;
  borderCol: string;
}

export function RectalCrmMriVisual() {
  const [crmStatus, setCrmStatus] = useState<CrmStatus>("threatened");

  const statusMap: Record<CrmStatus, CrmDetails> = {
    safe: {
      title: "CRM 阴性 · 安全切缘 (> 1.0 mm)",
      crmDistance: "肿瘤浸润边缘距系膜筋膜 (MRF) > 1.0 mm (安全间隙宽阔)",
      localRecurrenceRisk: "局部复发风险极低 (< 3% ~ 5%)",
      mriSign: "高分辨 T2WI 图像显示肿瘤被完整的低信号直肠壁或系膜脂肪包裹，直肠系膜筋膜 (MRF) 纤细完整，无结节状突破或毛刺影。",
      guidance: "TME (全直肠系膜切除术) 沿 Heald 神圣平面游离即可实现根治性完整切除，若无淋巴结高危转移甚至可考虑直接微创手术。",
      color: "text-emerald-400",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      borderCol: "border-emerald-500/30 bg-emerald-950/20"
    },
    threatened: {
      title: "CRM 阳性 / 受累 (≤ 1.0 mm) · 极高危预警",
      crmDistance: "肿瘤浸润、肿瘤沉积 (TD) 或转移淋巴结距 MRF ≤ 1.0 mm",
      localRecurrenceRisk: "直接手术局部复发率飙升至 25% ~ 35%！",
      mriSign: "T2 加权像上直肠系膜筋膜低信号线被肿瘤毛刺直接侵犯或中断，系膜脂肪间隙几乎完全消失，属于 MERCURY 国际核磁评价阳性标准。",
      guidance: "【严禁直接草率开刀】：必须强制实施术前全程新辅助治疗 (TNT) 或长程放化疗，待肿瘤从系膜筋膜处明显萎缩退缩后，再行根治手术！",
      color: "text-rose-400",
      badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      borderCol: "border-rose-500/30 bg-rose-950/20"
    },
    emvi: {
      title: "mrEMVI 阳性 · 肠壁外静脉脉管侵犯",
      crmDistance: "直肠周围中粗静脉管腔内出现肿瘤信号，管径扩张不规则",
      localRecurrenceRisk: "远处血行转移（肝/肺）风险增加 3~4 倍",
      mriSign: "直肠系膜内的管状静脉流空影消失，管腔粗细不均并充填与原发肿瘤信号相同的软组织膨隆信号。",
      guidance: "提示肿瘤已穿透静脉管壁进入体循环通道，必须配合高强度双药/三药全身化疗（如 mFOLFIRINOX 或 CAPOX）扫清远隔微转移。",
      color: "text-amber-400",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      borderCol: "border-amber-500/30 bg-amber-950/20"
    }
  };

  const curr = statusMap[crmStatus];

  return (
    <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 text-white select-none border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
          <Crosshair className="w-4 h-4 text-sky-400" />
          <span>骨盆 HR-MRI 轴位切面：CRM 环周切缘与系膜筋膜破译</span>
        </span>
        <span className="text-[10px] text-slate-400">MERCURY 标准 · 1mm 警戒线</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        <button
          type="button"
          onClick={() => setCrmStatus("safe")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            crmStatus === "safe"
              ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CRM 阴性 (&gt;1mm)</span>
        </button>

        <button
          type="button"
          onClick={() => setCrmStatus("threatened")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            crmStatus === "threatened"
              ? "bg-rose-500 text-white shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>CRM 阳性 (≤1mm)</span>
        </button>

        <button
          type="button"
          onClick={() => setCrmStatus("emvi")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            crmStatus === "emvi"
              ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>EMVI 脉管侵犯</span>
        </button>
      </div>

      {/* SVG Axial MRI Cross-Section */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-3">
        <svg viewBox="0 0 340 180" className="w-full h-auto">
          {/* 骨盆轮廓背景 (黑色背景模拟 MRI T2 加权像) */}
          <rect width="340" height="180" fill="#020617" rx="8" />

          {/* 骶骨骨质 (后方) */}
          <path d="M 120 18 Q 170 8 220 18 Q 170 26 120 18 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <text x="170" y="17" textAnchor="middle" fill="#64748b" fontSize="6.5">后方：骶骨 (Sacrum)</text>

          {/* 直肠系膜筋膜 (Mesorectal Fascia, MRF - 低信号包膜) */}
          <ellipse
            cx="170"
            cy="100"
            rx="110"
            ry="65"
            fill="#0f172a"
            stroke={crmStatus === "threatened" ? "#f43f5e" : "#38bdf8"}
            strokeWidth={crmStatus === "threatened" ? "2.5" : "1.8"}
            strokeDasharray={crmStatus === "threatened" ? "none" : "3,2"}
          />
          <text x="170" y="172" textAnchor="middle" fill={crmStatus === "threatened" ? "#fda4af" : "#38bdf8"} fontSize="7" fontWeight="bold">
            直肠系膜筋膜 (MRF 包膜 · TME 手术神圣切除外界面)
          </text>

          {/* 直肠系膜脂肪组织 (高信号灰白背景) */}
          <ellipse cx="170" cy="100" rx="90" ry="52" fill="#1e293b" opacity="0.6" />

          {/* 正常直肠壁管腔 */}
          <ellipse cx="170" cy="98" rx="42" ry="26" fill="#020617" stroke="#64748b" strokeWidth="3" />
          <text x="170" y="96" textAnchor="middle" fill="#94a3b8" fontSize="7">直肠管腔</text>

          {/* 肿瘤侵犯病灶 */}
          {crmStatus === "safe" && (
            <g>
              {/* 局限于系膜内的病灶，离外圈 MRF 距离 > 1mm */}
              <path
                d="M 198 86 Q 220 92 216 112 Q 192 110 188 95 Z"
                fill="#10b981"
                fillOpacity="0.8"
                stroke="#34d399"
                strokeWidth="1.5"
              />
              {/* 安全距离指示线 */}
              <line x1="216" y1="102" x2="270" y2="108" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <rect x="220" y="112" width="60" height="15" fill="#064e3b" rx="3" />
              <text x="250" y="122" textAnchor="middle" fill="#a7f3d0" fontSize="6.5" fontWeight="bold">CRM = 4.2mm (&gt;1mm)</text>
              <circle cx="216" cy="102" r="2.5" fill="#34d399" />
              <circle cx="270" cy="108" r="2.5" fill="#38bdf8" />
            </g>
          )}

          {crmStatus === "threatened" && (
            <g>
              {/* 肿瘤恶性膨隆生长，毛刺突破直达甚至接触外层 MRF 筋膜 */}
              <path
                d="M 195 80 Q 240 85 268 96 Q 255 125 190 115 Z"
                fill="#f43f5e"
                fillOpacity="0.85"
                stroke="#e11d48"
                strokeWidth="2"
              />
              {/* 突入危险距离 */}
              <line x1="268" y1="96" x2="276" y2="98" stroke="#f43f5e" strokeWidth="2.5" />
              <circle cx="274" cy="98" r="4" fill="#f43f5e" />
              <rect x="210" y="52" width="105" height="22" fill="#881337" rx="4" stroke="#f43f5e" strokeWidth="1" />
              <text x="262" y="63" textAnchor="middle" fill="#ffe4e6" fontSize="7" fontWeight="bold">CRM ≤ 0.8 mm (阳性!)</text>
              <text x="262" y="71" textAnchor="middle" fill="#fca5a5" fontSize="6">肿瘤直逼系膜筋膜，需TNT降期</text>
            </g>
          )}

          {crmStatus === "emvi" && (
            <g>
              {/* 肿瘤局部 */}
              <path
                d="M 198 86 Q 220 92 216 112 Q 192 110 188 95 Z"
                fill="#f59e0b"
                fillOpacity="0.75"
                stroke="#fbbf24"
                strokeWidth="1.5"
              />
              {/* 肠壁外扭曲静脉血管，管内充满软组织结节 */}
              <path d="M 216 95 Q 235 85 250 82 Q 262 80 270 78" fill="none" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
              <path d="M 225 90 Q 240 84 252 82" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
              <rect x="210" y="46" width="110" height="24" fill="#78350f" rx="4" stroke="#fbbf24" strokeWidth="1" />
              <text x="265" y="57" textAnchor="middle" fill="#fef3c7" fontSize="7" fontWeight="bold">mrEMVI 阳性 (静脉癌栓)</text>
              <text x="265" y="66" textAnchor="middle" fill="#fde68a" fontSize="6">系膜血管扩张，血行转移风险高</text>
            </g>
          )}

          {/* 前方解剖标识 */}
          <text x="170" y="42" textAnchor="middle" fill="#64748b" fontSize="6.5">前方：膀胱 / 前列腺 (男性) 或 子宫阴道 (女性)</text>
        </svg>
      </div>

      {/* 临床解读卡片 */}
      <div className={`p-3 rounded-xl border ${curr.borderCol} space-y-2`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className={`text-xs font-bold ${curr.color} flex items-center gap-1`}>
            <Eye className="w-3.5 h-3.5" />
            <span>{curr.title}</span>
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${curr.badgeBg}`}>
            {curr.localRecurrenceRisk}
          </span>
        </div>

        {/* 距离测量 */}
        <div className="text-[11px] text-slate-200">
          <span className="text-slate-400 font-bold">MRI 测量标准：</span>
          {curr.crmDistance}
        </div>

        {/* 影像表现 */}
        <div className="text-[10px] text-slate-300 leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800">
          <span className="text-sky-400 font-bold block mb-0.5">放射学特征：</span>
          {curr.mriSign}
        </div>

        {/* 临床处理指引 */}
        <div className="text-[10px] text-slate-200 leading-relaxed">
          <span className="text-amber-400 font-bold block mb-0.5">规范化应对战术：</span>
          {curr.guidance}
        </div>
      </div>
    </div>
  );
}
