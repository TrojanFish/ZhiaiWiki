"use client";

import React, { useState } from "react";
import { ShieldAlert, Ruler, HeartPulse, CheckCircle2, AlertTriangle, Info, Ban } from "lucide-react";

export function LymphedemaArmVisual() {
  // Measurement point: wrist | forearm | upperArm
  const [point, setPoint] = useState<"wrist" | "forearm" | "upperArm">("upperArm");
  // Delta in cm between affected and unaffected arm
  const [diffCm, setDiffCm] = useState<number>(1.2);

  const getStatus = (diff: number) => {
    if (diff < 1.0) {
      return {
        level: "正常生理差异 (< 1.0cm)",
        statusColor: "text-emerald-400",
        badgeBg: "bg-emerald-500 text-slate-950",
        borderCol: "border-emerald-500/30",
        desc: "双侧肢体在正常生理不对称范围内，无淋巴回流受阻，继续保持良好居家防护。",
        action: "无需佩戴压力袖套，常规每月用皮尺测量一次并记录日记。",
      };
    } else if (diff <= 2.0) {
      return {
        level: "轻度水肿警惕期 (1.0 ~ 2.0cm)",
        statusColor: "text-amber-400",
        badgeBg: "bg-amber-500 text-slate-950",
        borderCol: "border-amber-500/30",
        desc: "患侧组织间隙有轻度淋巴液淤滞，多伴有手臂沉重感或手背紧绷感，处于完全可逆期！",
        action: "睡眠时垫高患肢 15~30°，避免过度劳累；咨询康复师评估佩戴一级预防性弹力袖套。",
      };
    } else {
      return {
        level: "确立淋巴水肿预警 (> 2.0cm)",
        statusColor: "text-rose-400",
        badgeBg: "bg-rose-500 text-white",
        borderCol: "border-rose-500/30",
        desc: "已达到国际淋巴学会 (ISL) 淋巴水肿临床诊断标准，若不干预可能逐步出现皮下纤维化。",
        action: "立即就诊乳腺外科或淋巴水肿门诊，启动徒手淋巴引流综合消肿治疗 (CDT) 并定制二级医用压力套。",
      };
    }
  };

  const status = getStatus(diffCm);

  return (
    <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 text-white select-none border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
          <Ruler className="w-4 h-4 text-sky-400" />
          <span>患肢淋巴水肿防范：三点定位测量尺与双侧差值测算</span>
        </span>
        <span className="text-[10px] text-slate-400">ISL 国际淋巴学会标准</span>
      </div>

      {/* SVG Diagram: Arm Landmarks & Lymphatic Flow */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-3">
        <svg viewBox="0 0 320 115" className="w-full h-auto">
          <rect width="320" height="115" fill="#0b1120" rx="8" />

          {/* Shoulder and Arm Contour */}
          {/* Shoulder/Axilla area */}
          <path d="M 20 20 C 45 20, 60 40, 75 48 L 160 52 L 230 55 L 290 58 L 295 68 L 290 76 L 230 74 L 160 72 L 75 78 C 55 85, 35 100, 20 105" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />

          {/* Dynamic Edema Swelling Visual Overlay */}
          {diffCm >= 1.0 && (
            <g>
              <path
                d={`M 75 ${48 - (diffCm - 0.8) * 2.2} L 160 ${52 - (diffCm - 0.8) * 3.5} L 230 ${55 - (diffCm - 0.8) * 2.5} L 290 58 L 295 68 L 290 76 L 230 ${74 + (diffCm - 0.8) * 2.5} L 160 ${72 + (diffCm - 0.8) * 3.5} L 75 ${78 + (diffCm - 0.8) * 2.2} Z`}
                fill={diffCm > 2.0 ? "#f43f5e" : "#fbbf24"}
                opacity={diffCm > 2.0 ? 0.28 : 0.18}
                stroke={diffCm > 2.0 ? "#f43f5e" : "#fbbf24"}
                strokeWidth="1.2"
                strokeDasharray="3,2"
              />
              <text x="180" y="22" textAnchor="middle" fill={diffCm > 2.0 ? "#fb7185" : "#fcd34d"} fontSize="6.5" fontWeight="bold">
                {diffCm > 2.0 ? `淋巴淤积水肿轮廓 (+${diffCm.toFixed(1)}cm)` : `轻度组织充血淤滞 (+${diffCm.toFixed(1)}cm)`}
              </text>
            </g>
          )}

          {/* Axillary Lymph Nodes Area */}
          <circle cx="50" cy="45" r="14" fill="#0369a1" opacity="0.3" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
          <text x="50" y="42" textAnchor="middle" fill="#38bdf8" fontSize="6.5" fontWeight="bold">腋窝手术区</text>
          <text x="50" y="52" textAnchor="middle" fill="#94a3b8" fontSize="5">前哨活检/清扫</text>

          {/* Green Lymphatic Vessels along arm */}
          <path d="M 270 65 Q 200 60 140 60 T 60 48" fill="none" stroke="#10b981" strokeWidth="1.8" strokeDasharray="3,1" />
          <path d="M 270 70 Q 210 68 150 67 T 62 52" fill="none" stroke="#10b981" strokeWidth="1.8" strokeDasharray="3,1" />
          <text x="180" y="45" textAnchor="middle" fill="#34d399" fontSize="6">淋巴回流通路 (防淤积)</text>

          {/* Caliper 1: Wrist Crease (腕横纹) */}
          <g transform="translate(265, 38)">
            <line x1="0" y1="12" x2="0" y2="44" stroke={point === "wrist" ? "#f43f5e" : "#64748b"} strokeWidth={point === "wrist" ? 2.5 : 1.5} />
            <circle cx="0" cy="12" r="2.5" fill={point === "wrist" ? "#f43f5e" : "#64748b"} />
            <circle cx="0" cy="44" r="2.5" fill={point === "wrist" ? "#f43f5e" : "#64748b"} />
            <text x="0" y="6" textAnchor="middle" fill={point === "wrist" ? "#fb7185" : "#94a3b8"} fontSize="6" fontWeight="bold">
              ① 腕横纹
            </text>
          </g>

          {/* Caliper 2: 10cm above wrist (腕上 10cm) */}
          <g transform="translate(200, 35)">
            <line x1="0" y1="14" x2="0" y2="44" stroke={point === "forearm" ? "#f43f5e" : "#64748b"} strokeWidth={point === "forearm" ? 2.5 : 1.5} />
            <circle cx="0" cy="14" r="2.5" fill={point === "forearm" ? "#f43f5e" : "#64748b"} />
            <circle cx="0" cy="44" r="2.5" fill={point === "forearm" ? "#f43f5e" : "#64748b"} />
            <text x="0" y="6" textAnchor="middle" fill={point === "forearm" ? "#fb7185" : "#94a3b8"} fontSize="6" fontWeight="bold">
              ② 腕上10cm
            </text>
          </g>

          {/* Caliper 3: 10cm above elbow (肘上 10cm) */}
          <g transform="translate(120, 32)">
            <line x1="0" y1="14" x2="0" y2="45" stroke={point === "upperArm" ? "#f43f5e" : "#64748b"} strokeWidth={point === "upperArm" ? 2.5 : 1.5} />
            <circle cx="0" cy="14" r="2.5" fill={point === "upperArm" ? "#f43f5e" : "#64748b"} />
            <circle cx="0" cy="45" r="2.5" fill={point === "upperArm" ? "#f43f5e" : "#64748b"} />
            <text x="0" y="6" textAnchor="middle" fill={point === "upperArm" ? "#fb7185" : "#94a3b8"} fontSize="6" fontWeight="bold">
              ③ 肘上10cm
            </text>
          </g>

          {/* Prompt banner inside SVG */}
          <rect x="15" y="94" width="290" height="16" fill="#0f172a" rx="4" stroke="#1e293b" />
          <text x="160" y="105" textAnchor="middle" fill="#94a3b8" fontSize="6.5">
            用皮尺紧贴皮肤但不过度勒紧，固定在同一时间（如早晨起床后）记录双侧臂围
          </text>
        </svg>
      </div>

      {/* Point Selector and Slider Controls */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3 mb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-300">当前测量定位点：</span>
          <div className="flex gap-1.5">
            {(
              [
                { id: "wrist", label: "① 腕横纹" },
                { id: "forearm", label: "② 腕上 10cm" },
                { id: "upperArm", label: "③ 肘上 10cm" },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPoint(p.id)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  point === p.id
                    ? "bg-sky-500 text-slate-950 shadow"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bilateral Delta Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">患侧比健侧粗（差值）：</span>
            <span className="font-extrabold text-pink-300">+{diffCm.toFixed(1)} cm</span>
          </div>
          <input
            type="range"
            min="0"
            max="4.0"
            step="0.1"
            value={diffCm}
            onChange={(e) => setDiffCm(parseFloat(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[9px] text-slate-500">
            <span>0 cm (完全对称)</span>
            <span>1.0 cm (警示界限)</span>
            <span>2.0 cm (确立诊断)</span>
            <span>4.0 cm (重度)</span>
          </div>
        </div>

        {/* Dynamic Status Display */}
        <div className={`p-2.5 rounded-lg border ${status.borderCol} bg-slate-900/90 space-y-1`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${status.statusColor} flex items-center gap-1`}>
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{status.level}</span>
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${status.badgeBg}`}>
              {diffCm > 2.0 ? "建议就医" : diffCm >= 1.0 ? "密切注意" : "安心平稳"}
            </span>
          </div>
          <p className="text-[11px] text-slate-300">{status.desc}</p>
          <p className="text-[10px] text-slate-400 pt-0.5">
            <strong className="text-slate-300">建议行动：</strong>
            {status.action}
          </p>
        </div>
      </div>

      {/* 5 Prohibitions Visual Grid */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
          <Ban className="w-3.5 h-3.5 text-rose-400" />
          <span>患侧手臂终生【绝对五严禁】红线</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[10px]">
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center space-y-0.5">
            <div className="text-rose-400 font-bold">严禁输液/抽血</div>
            <div className="text-slate-400 text-[9px]">防静脉炎与组织水肿</div>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center space-y-0.5">
            <div className="text-rose-400 font-bold">严禁测量血压</div>
            <div className="text-slate-400 text-[9px]">袖带高压压迫淋巴管</div>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center space-y-0.5">
            <div className="text-rose-400 font-bold">严禁提重物 &gt;3kg</div>
            <div className="text-slate-400 text-[9px]">防患肢肌肉过载水肿</div>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center space-y-0.5">
            <div className="text-rose-400 font-bold">严禁高温暴晒/桑拿</div>
            <div className="text-slate-400 text-[9px]">血管扩张加剧淋巴负担</div>
          </div>
          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center space-y-0.5 col-span-2 sm:col-span-1">
            <div className="text-rose-400 font-bold">严禁抓破防丹毒</div>
            <div className="text-slate-400 text-[9px]">防细菌感染引发急性红肿热痛</div>
          </div>
        </div>
      </div>
    </div>
  );
}
