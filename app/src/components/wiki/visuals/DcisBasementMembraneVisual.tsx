"use client";

import React, { useState } from "react";
import { Layers, AlertCircle, CheckCircle2 } from "lucide-react";

type StageType = "normal" | "dcis" | "idc";

export function DcisBasementMembraneVisual() {
  const [activeStage, setActiveStage] = useState<StageType>("dcis");

  return (
    <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 text-white select-none border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-pink-400" />
          <span>导管基底膜解剖屏障：原位癌 (DCIS 0期) vs 浸润癌 (IDC)</span>
        </span>
        <span className="text-[10px] text-slate-400">病理金标准</span>
      </div>

      {/* 3 Stage Selector */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        <button
          onClick={() => setActiveStage("normal")}
          className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
            activeStage === "normal"
              ? "bg-slate-700 text-white shadow ring-1 ring-slate-500"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          <span className="hidden sm:inline">正常乳腺导管</span>
          <span className="sm:hidden">正常导管</span>
        </button>

        <button
          onClick={() => setActiveStage("dcis")}
          className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
            activeStage === "dcis"
              ? "bg-emerald-500 text-slate-950 font-extrabold shadow-md scale-105"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          <span className="hidden sm:inline">导管原位癌 (DCIS 0期)</span>
          <span className="sm:hidden">DCIS 0期</span>
        </button>

        <button
          onClick={() => setActiveStage("idc")}
          className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
            activeStage === "idc"
              ? "bg-rose-500 text-white font-extrabold shadow-md scale-105"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
          }`}
        >
          <span className="hidden sm:inline">浸润性导管癌 (IDC)</span>
          <span className="sm:hidden">IDC 浸润癌</span>
        </button>
      </div>

      {/* SVG Microscopic Cross-Section */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-3">
        <svg viewBox="0 0 320 135" className="w-full h-auto">
          <rect width="320" height="135" fill="#0b1120" rx="8" />

          {/* Stroma surrounding the duct */}
          <rect x="10" y="10" width="300" height="115" fill="#0f172a" rx="6" />
          <text x="35" y="26" fill="#475569" fontSize="6">乳腺间质组织 (含毛细血管与淋巴管)</text>

          {/* Blood and lymphatic vessels in stroma */}
          <ellipse cx="40" cy="50" rx="10" ry="6" fill="#7f1d1d" opacity="0.6" stroke="#ef4444" strokeWidth="1" />
          <text x="40" y="52" textAnchor="middle" fill="#fca5a5" fontSize="4.5">微血管</text>

          <ellipse cx="40" cy="85" rx="8" ry="5" fill="#064e3b" opacity="0.6" stroke="#10b981" strokeWidth="1" />
          <text x="40" y="87" textAnchor="middle" fill="#6ee7b7" fontSize="4.5">淋巴管</text>

          {/* ================= NORMAL DUCT ================= */}
          {activeStage === "normal" && (
            <g transform="translate(170, 68)">
              {/* Intact Basement Membrane (Outer Cyan Line) */}
              <circle cx="0" cy="0" r="46" fill="none" stroke="#38bdf8" strokeWidth="3" />
              {/* Myoepithelial Layer */}
              <circle cx="0" cy="0" r="42" fill="none" stroke="#64748b" strokeWidth="2.5" strokeDasharray="4,2" />
              {/* Single layer normal luminal epithelial cells */}
              <circle cx="0" cy="0" r="38" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              {/* Hollow clear lumen */}
              <circle cx="0" cy="0" r="22" fill="#0b1120" />
              <text x="0" y="2" textAnchor="middle" fill="#94a3b8" fontSize="6.5">通畅管腔</text>

              {/* Normal lining cell dots */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const cx = Math.cos(rad) * 30;
                const cy = Math.sin(rad) * 30;
                return <circle key={i} cx={cx} cy={cy} r="3" fill="#60a5fa" opacity="0.8" />;
              })}

              <text x="0" y="-52" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="bold">
                基底膜光滑完整 (保护层坚固)
              </text>
            </g>
          )}

          {/* ================= DCIS (STAGE 0) ================= */}
          {activeStage === "dcis" && (
            <g transform="translate(170, 68)">
              {/* Intact Basement Membrane (SOLID GREEN GLOW) */}
              <circle cx="0" cy="0" r="48" fill="none" stroke="#10b981" strokeWidth="3.5" />
              <circle cx="0" cy="0" r="51" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />

              {/* Duct Packed with Malignant Cells */}
              <circle cx="0" cy="0" r="45" fill="#881337" opacity="0.3" />

              {/* Swarming neoplastic cells confined strictly inside */}
              {[-26, -16, -6, 4, 14, 24].map((x) =>
                [-24, -14, -4, 6, 16, 22].map((y) => {
                  if (x * x + y * y < 38 * 38) {
                    return <circle key={`${x}-${y}`} cx={x} cy={y} r="2.8" fill="#fb7185" />;
                  }
                  return null;
                })
              )}

              {/* Center Necrosis & Microcalcification */}
              <circle cx="0" cy="0" r="9" fill="#0b1120" stroke="#f43f5e" strokeWidth="1" />
              <circle cx="-2" cy="-1" r="1.2" fill="#ffffff" />
              <circle cx="2" cy="2" r="1" fill="#ffffff" />
              <text x="0" y="2" textAnchor="middle" fill="#ffffff" fontSize="4">微钙化</text>

              {/* Safe Callout */}
              <text x="0" y="-53" textAnchor="middle" fill="#34d399" fontSize="7" fontWeight="bold">
                100% 困在管内 · 基底膜完整 · 0% 侵入血管
              </text>
            </g>
          )}

          {/* ================= IDC (INVASIVE) ================= */}
          {activeStage === "idc" && (
            <g transform="translate(170, 68)">
              {/* Breached Basement Membrane */}
              <path d="M -48 0 A 48 48 0 1 1 20 44" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5,3" />
              {/* Broken gap with tear mark */}
              <line x1="20" y1="44" x2="40" y2="25" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2,2" />

              {/* Confined part */}
              <circle cx="0" cy="0" r="44" fill="#881337" opacity="0.25" />

              {/* Spilling cells penetrating into stroma and towards vessel */}
              <path d="M 15 25 Q 50 35 65 15 Q 75 -10 90 -20" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3,2" />

              {/* Escaped tumor cells outside duct */}
              <circle cx="45" cy="30" r="3.5" fill="#e11d48" />
              <circle cx="55" cy="20" r="3.2" fill="#e11d48" />
              <circle cx="68" cy="12" r="3.5" fill="#e11d48" />
              <circle cx="78" cy="-5" r="3" fill="#e11d48" />
              <circle cx="-100" cy="-20" r="3.2" fill="#e11d48" />

              {/* Intraductal cells */}
              {[-20, -10, 0, 10].map((x) =>
                [-20, -10, 0, 10].map((y) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="2.8" fill="#f43f5e" />
                ))
              )}

              <text x="50" y="48" fill="#f87171" fontSize="6" fontWeight="bold">
                突破基底膜侵入间质
              </text>

              <text x="0" y="-53" textAnchor="middle" fill="#f43f5e" fontSize="7" fontWeight="bold">
                突破基底膜 (发生浸润 · 需评估全身分期)
              </text>
            </g>
          )}

          {/* Bottom Banner */}
          <rect x="15" y="112" width="290" height="17" fill="#0f172a" rx="4" />
          <text x="160" y="123" textAnchor="middle" fill="#94a3b8" fontSize="6.5">
            {activeStage === "normal"
              ? "正常乳腺导管由内层腺上皮、外层肌上皮和最外层的坚韧基底膜构成。"
              : activeStage === "dcis"
              ? "基底膜如同防弹玻璃墙，只要没有破损，癌细胞根本接触不到血管，绝无远处转移能力！"
              : "一旦癌细胞突破基底膜进入间质，即升级为浸润癌，需按浸润导管癌 (IDC) 规范综合施治。"}
          </text>
        </svg>
      </div>

      {/* Comparison Detail Box */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-pink-400" />
            <span>临床核心指标对照表</span>
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
            DCIS 10年生存率 &gt; 99%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-900/90 p-2 rounded-lg border border-emerald-500/20 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>导管原位癌 (DCIS 0期)</span>
            </div>
            <div className="text-slate-300 text-[10px] space-y-0.5 leading-relaxed">
              <div>• <strong>基底膜：</strong>100% 完整，无微浸润</div>
              <div>• <strong>转移风险：</strong>0% 血液/淋巴远处转移</div>
              <div>• <strong>手术方案：</strong>保乳扩切 + 放疗，或全乳切除</div>
              <div>• <strong>化疗需求：</strong>严禁化疗 (化疗属于无效过度治疗)</div>
              <div>• <strong>治愈率：</strong>彻底切除后接近 100% 治愈</div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-2 rounded-lg border border-rose-500/20 space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-rose-400" />
              <span>浸润性导管癌 (IDC I~IV期)</span>
            </div>
            <div className="text-slate-300 text-[10px] space-y-0.5 leading-relaxed">
              <div>• <strong>基底膜：</strong>已被癌细胞穿透破坏</div>
              <div>• <strong>转移风险：</strong>存在淋巴结及远端血行扩散潜在通路</div>
              <div>• <strong>手术方案：</strong>肿瘤切除 + 前哨淋巴结活检 (SLNB)</div>
              <div>• <strong>全身治疗：</strong>依分子分型行内分泌/靶向/化疗/免疫</div>
              <div>• <strong>治愈率：</strong>I~II期 5年生存率仍 &gt;90%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
