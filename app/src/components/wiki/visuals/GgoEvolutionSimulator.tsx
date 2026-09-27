"use client";

import { useState } from "react";
import { Microscope, Stethoscope, HeartPulse } from "lucide-react";

export function GgoEvolutionSimulator() {
  const [ctr, setCtr] = useState<number>(0.35);

  let ggoType = "纯磨玻璃结节 (pGGN)";
  let stageLabel = "不典型腺瘤样增生 (AAH) / 原位腺癌 (AIS)";
  let invasiveness = "极低侵袭性 (惰性阶段)";
  let prognosis = "5年无复发生存率接近 100%";
  let followUpAdvice = "无需急于手术！建议 6~12 个月低剂量薄层 CT 复查，观察体积倍增趋势";
  let themeColor = "#10b981";

  if (ctr === 0) {
    ggoType = "纯磨玻璃结节 (pGGN)";
    stageLabel = "原位腺癌 (AIS) 或良性炎性渗出";
    invasiveness = "无浸润 (贴壁生长，无转移能力)";
    prognosis = "5年治愈率 ≈ 100%";
    followUpAdvice = "首选定期随访！倍增时间通常 >600 天，完全处于绝对安全窗口期";
    themeColor = "#10b981";
  } else if (ctr <= 0.5) {
    ggoType = "混杂磨玻璃结节 (mGGO / 早期浸润)";
    stageLabel = "微浸润腺癌 (MIA) 早期";
    invasiveness = "微浸润 (实性成分 ≤ 5mm)";
    prognosis = "JCOG0804 5年无复发率 99.7%";
    followUpAdvice = "根据生长速度评估：若持续稳定可继续随访；若手术首选微创亚肺叶（段切/楔切）保全肺功能";
    themeColor = "#0ea5e9";
  } else if (ctr < 0.8) {
    ggoType = "实性为主型结节 (mGGO / 浸润期)";
    stageLabel = "浸润性肺腺癌 (IAC) 早期";
    invasiveness = "明确浸润 (实性成分 > 50%)";
    prognosis = "早期根治性手术后预后优良";
    followUpAdvice = "建议胸外科专科评估手术指征，完善术前分期并评估规范切除";
    themeColor = "#f59e0b";
  } else {
    ggoType = "纯实性结节 / 高实性结节";
    stageLabel = "浸润性肺腺癌 (IAC)";
    invasiveness = "实性浸润 (完全致密)";
    prognosis = "依病理 TNM 分期及高危因素决定";
    followUpAdvice = "积极行增强 CT 或 PET-CT 评估，多学科 MDT 制定手术与综合诊疗方案";
    themeColor = "#ef4444";
  }

  const outerR = 48;
  const innerR = Math.max(0, outerR * Math.sqrt(ctr));
  const solidOpacity = ctr === 0 ? 0 : Math.min(1, 0.4 + ctr * 0.6);
  const haloOpacity = Math.max(0.15, 0.55 - ctr * 0.35);

  return (
    <div className="bg-slate-900 rounded-xl p-2.5 sm:p-3.5 text-white border border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
            <Microscope className="w-3.5 h-3.5" />
            <span>磨玻璃结节演变与实性成分比 (CTR) 模拟器</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
            调节下方滑块观察微观形态演变
          </p>
        </div>

        {/* Current CTR Badge */}
        <div className="flex items-center gap-2 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700/80 shrink-0">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 mr-1">CTR</span>
            <span className="text-sm font-black text-white font-mono">{(ctr * 100).toFixed(0)}%</span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: themeColor }} />
        </div>
      </div>

      {/* Slider Control */}
      <div className="py-2 space-y-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-0.5">
          <span className="text-emerald-400">纯磨玻璃 (0%)</span>
          <span className="text-sky-400">混合磨玻璃 (50%)</span>
          <span className="text-rose-400">纯实性 (100%)</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={ctr}
          onChange={(e) => setCtr(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
        />
      </div>

      {/* Visual Canvas & Interpretation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center pt-1">
        {/* SVG Micro CT Cross-Section Canvas */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800/80">
          <div className="absolute top-1.5 left-2 text-[9px] font-mono text-slate-400">CT模拟剖面</div>
          
          <svg viewBox="0 0 140 140" className="w-28 h-28 sm:w-32 sm:h-32 my-1 select-none">
            {/* Dark Lung Background */}
            <rect width="140" height="140" fill="#090d16" />

            {/* Micro Pulmonary Vessels (Normal lung background) */}
            <path d="M 15 30 Q 50 60 70 70 T 120 115" stroke="#1e293b" strokeWidth="1.2" fill="none" />
            <path d="M 110 20 Q 80 50 70 70 T 30 120" stroke="#1e293b" strokeWidth="0.9" fill="none" />

            {/* Outer GGO Halo (Ground-Glass Opacity) */}
            <circle cx="70" cy="70" r={outerR} fill="#94a3b8" opacity={haloOpacity} />
            <circle cx="70" cy="70" r={outerR} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" fill="none" opacity="0.4" />

            {/* Inner Solid Core (Consolidation) */}
            {innerR > 0 && (
              <circle
                cx="70"
                cy="70"
                r={innerR}
                fill="#ffffff"
                opacity={solidOpacity}
                stroke="#ffffff"
                strokeWidth="0.8"
                style={{ transition: "all 0.15s ease-out" }}
              />
            )}

            {/* Labels inside Canvas */}
            <text x="70" y="133" textAnchor="middle" fontSize="6.5" fill="#94a3b8" fontWeight="bold">
              {ctr === 0 ? "纯磨玻璃（透亮）" : ctr <= 0.5 ? "煎蛋征（核心 ≤ 50%）" : "致密实性浸润灶"}
            </text>
          </svg>

          <div className="text-[9px] text-slate-400 text-center flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>薄雾: 磨玻璃</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white ml-1" />
            <span>白心: 实性</span>
          </div>
        </div>

        {/* Clinical Meaning Breakdown Cards */}
        <div className="sm:col-span-7 space-y-2">
          {/* Main Category Banner */}
          <div className="p-2.5 rounded-xl border" style={{ backgroundColor: `${themeColor}15`, borderColor: `${themeColor}50` }}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-bold" style={{ color: themeColor }}>当前形态定性</span>
              <span className="text-[10px] px-2 py-0.2 rounded font-bold bg-slate-900/60" style={{ color: themeColor }}>
                {ggoType}
              </span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">{stageLabel}</div>
            <div className="text-[10px] text-slate-300 mt-0.5">{invasiveness} · {prognosis}</div>
          </div>

          {/* Expert Clinical Action Guide */}
          <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/80 text-[10.5px] leading-snug">
            <div className="flex items-center gap-1 text-[10px] font-bold text-sky-300 mb-0.5">
              <Stethoscope className="w-3 h-3 text-sky-400" />
              <span>权威临床对策</span>
            </div>
            <p className="text-slate-300">
              {followUpAdvice}
            </p>
          </div>

          {/* Warm Reassurance Box */}
          <div className="bg-emerald-950/40 p-2 rounded-xl border border-emerald-800/60 flex items-start gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[10px] text-emerald-200 leading-snug">
              <strong>定心丸：</strong>
              {ctr <= 0.5 ? (
                <span>早期磨玻璃结节生长惰性，倍增期长，定期复查安全可控，无需焦虑盲目手术。</span>
              ) : (
                <span>实性成分偏高亦可通过现代微创胸腔镜根治，早期治愈率极高。</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
