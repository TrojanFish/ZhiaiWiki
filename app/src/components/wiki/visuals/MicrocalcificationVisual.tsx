"use client";

import React, { useState } from "react";
import { Layers, ShieldCheck, AlertTriangle, Eye, Activity, CheckCircle2, ChevronRight } from "lucide-react";

type CalcViewType = "benign" | "malignant" | "mammotome";

export function MicrocalcificationVisual() {
  const [viewType, setViewType] = useState<CalcViewType>("malignant");

  return (
    <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 text-white select-none border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>钼靶钙化显微形态破译：良性粗钙化 vs 恶性微钙化</span>
        </span>
        <span className="text-[10px] text-slate-400">微观病理对照</span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        <button
          onClick={() => setViewType("benign")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            viewType === "benign"
              ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>良性粗钙化</span>
        </button>

        <button
          onClick={() => setViewType("malignant")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            viewType === "malignant"
              ? "bg-rose-500 text-white shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>恶性微钙化</span>
        </button>

        <button
          onClick={() => setViewType("mammotome")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            viewType === "mammotome"
              ? "bg-sky-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>立体定位旋切</span>
        </button>
      </div>

      {/* SVG Microscopic Diagram */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-3">
        {viewType === "benign" && (
          <svg viewBox="0 0 320 130" className="w-full h-auto">
            {/* Background Mammary Stroma */}
            <rect width="320" height="130" fill="#0f172a" rx="8" />
            <text x="160" y="20" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">
              良性粗钙化：边界光滑清晰、孤立分布 (恶性风险 0%)
            </text>

            {/* Normal ducts and lobules */}
            <path d="M 20 65 Q 80 40 140 65 T 260 65" fill="none" stroke="#334155" strokeWidth="20" strokeLinecap="round" opacity="0.4" />
            <circle cx="50" cy="65" r="18" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <text x="50" y="68" textAnchor="middle" fill="#64748b" fontSize="7">纤维腺体</text>

            {/* Benign Popcorn Calcification */}
            <g transform="translate(130, 45)">
              <circle cx="25" cy="20" r="14" fill="#38bdf8" opacity="0.2" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
              {/* Popcorn shape */}
              <circle cx="20" cy="15" r="8" fill="#f8fafc" />
              <circle cx="30" cy="17" r="7" fill="#f1f5f9" />
              <circle cx="22" cy="26" r="9" fill="#e2e8f0" />
              <circle cx="15" cy="24" r="6" fill="#f8fafc" />
              <text x="25" y="48" textAnchor="middle" fill="#38bdf8" fontSize="6.5" fontWeight="bold">退化纤维腺瘤爆米花样粗钙化 (&gt;2mm)</text>
            </g>

            {/* Eggshell / Rim calcification */}
            <g transform="translate(230, 45)">
              <circle cx="25" cy="20" r="12" fill="#0f172a" stroke="#fbbf24" strokeWidth="3" />
              <text x="25" y="23" textAnchor="middle" fill="#fbbf24" fontSize="6">油囊肿</text>
              <text x="25" y="48" textAnchor="middle" fill="#fbbf24" fontSize="6.5" fontWeight="bold">蛋壳样/环形钙化</text>
            </g>

            <rect x="15" y="105" width="290" height="18" fill="#064e3b" rx="4" opacity="0.6" />
            <text x="160" y="117" textAnchor="middle" fill="#6ee7b7" fontSize="7">
              组织特征：基底膜与腺管完全结构正常，为陈旧性钙盐沉积，无需任何治疗或手术
            </text>
          </svg>
        )}

        {viewType === "malignant" && (
          <svg viewBox="0 0 320 130" className="w-full h-auto">
            {/* Background Mammary Stroma */}
            <rect width="320" height="130" fill="#0f172a" rx="8" />
            <text x="160" y="20" textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight="bold">
              可疑微钙化：成簇泥沙样、细线样分支分布 (恶性风险 20%~60%)
            </text>

            {/* Dilated Mammary Duct (DCIS / intraductal bed) */}
            <path d="M 30 65 Q 160 30 290 65" fill="none" stroke="#475569" strokeWidth="32" strokeLinecap="round" opacity="0.5" />
            <path d="M 30 65 Q 160 30 290 65" fill="none" stroke="#be123c" strokeWidth="26" strokeLinecap="round" opacity="0.3" />

            {/* Ductal epithelial neoplastic cells */}
            <circle cx="110" cy="52" r="5" fill="#f43f5e" opacity="0.8" />
            <circle cx="120" cy="54" r="5" fill="#f43f5e" opacity="0.8" />
            <circle cx="130" cy="51" r="5" fill="#f43f5e" opacity="0.8" />
            <circle cx="140" cy="55" r="5" fill="#f43f5e" opacity="0.8" />
            <circle cx="150" cy="50" r="5" fill="#f43f5e" opacity="0.8" />
            <circle cx="160" cy="53" r="5" fill="#f43f5e" opacity="0.8" />
            <circle cx="170" cy="49" r="5" fill="#f43f5e" opacity="0.8" />
            <circle cx="180" cy="52" r="5" fill="#f43f5e" opacity="0.8" />
            <circle cx="190" cy="48" r="5" fill="#f43f5e" opacity="0.8" />
            <circle cx="200" cy="54" r="5" fill="#f43f5e" opacity="0.8" />

            {/* Clustered Pleomorphic Microcalcifications (<0.5mm, multiple shapes) */}
            <g transform="translate(130, 48)">
              {/* Highlight bounding box of cluster */}
              <circle cx="30" cy="7" r="22" fill="none" stroke="#fb7185" strokeWidth="1.2" strokeDasharray="3,2" />
              <text x="30" y="-18" textAnchor="middle" fill="#fda4af" fontSize="6.5">导管内粉刺样坏死灶</text>

              {/* Individual microcalc speckles */}
              <polygon points="25,5 27,8 24,9" fill="#ffffff" />
              <polygon points="32,3 35,4 34,7 31,6" fill="#ffffff" />
              <polygon points="28,10 30,12 27,13" fill="#ffffff" />
              <circle cx="36" cy="10" r="1.2" fill="#ffffff" />
              <circle cx="21" cy="6" r="1.1" fill="#ffffff" />
              <polygon points="33,14 36,15 35,17" fill="#ffffff" />
              <polygon points="24,14 26,16 23,17" fill="#ffffff" />
              <circle cx="39" cy="8" r="1.3" fill="#ffffff" />
              <polygon points="18,10 20,11 19,13" fill="#ffffff" />
              <circle cx="30" cy="18" r="1.1" fill="#ffffff" />
            </g>

            {/* Callouts */}
            <text x="40" y="45" fill="#fda4af" fontSize="7" fontWeight="bold">导管管腔</text>
            <text x="160" y="96" textAnchor="middle" fill="#f43f5e" fontSize="7" fontWeight="bold">
              成簇微钙化 (密度 &gt; 5枚/cm²，形态多形性、铸型样)
            </text>

            <rect x="15" y="105" width="290" height="18" fill="#881337" rx="4" opacity="0.6" />
            <text x="160" y="117" textAnchor="middle" fill="#fecdd3" fontSize="7">
              临床预警：微钙化是早期导管原位癌 (DCIS) 最常见信号，建议立体定位空芯针穿刺
            </text>
          </svg>
        )}

        {viewType === "mammotome" && (
          <svg viewBox="0 0 320 130" className="w-full h-auto">
            {/* Background */}
            <rect width="320" height="130" fill="#0f172a" rx="8" />
            <text x="160" y="20" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">
              麦默通 (Mammotome) 立体定位真空辅助旋切活检术
            </text>

            {/* Breast Tissue Field */}
            <path d="M 20 100 C 60 40, 260 40, 300 100" fill="#1e293b" opacity="0.6" />

            {/* Target Calcification Area */}
            <circle cx="200" cy="68" r="15" fill="#f43f5e" opacity="0.2" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="196" cy="66" r="1.2" fill="#ffffff" />
            <circle cx="202" cy="65" r="1" fill="#ffffff" />
            <circle cx="199" cy="71" r="1.3" fill="#ffffff" />
            <circle cx="204" cy="70" r="1" fill="#ffffff" />
            <text x="200" y="50" textAnchor="middle" fill="#fb7185" fontSize="6.5">靶区钙化灶 (0.5cm)</text>

            {/* Mammotome Needle Probe */}
            <rect x="30" y="65" width="160" height="7" fill="#94a3b8" rx="2" />
            <rect x="30" y="63" width="70" height="11" fill="#64748b" rx="2" />
            <polygon points="190,65 205,68.5 190,72" fill="#38bdf8" />
            {/* Vacuum sampling notch */}
            <rect x="175" y="66.5" width="12" height="4" fill="#0284c7" />

            <text x="75" y="85" fill="#94a3b8" fontSize="6">8G / 10G 真空负压采样管</text>
            <text x="195" y="85" fill="#38bdf8" fontSize="6" fontWeight="bold">刀槽精准旋转切取</text>

            {/* Incision note */}
            <line x1="30" y1="58" x2="30" y2="78" stroke="#10b981" strokeWidth="2" />
            <text x="30" y="52" fill="#10b981" fontSize="6.5" fontWeight="bold">微小针孔 (3mm免缝合)</text>

            <rect x="15" y="105" width="290" height="18" fill="#0c4a6e" rx="4" opacity="0.6" />
            <text x="160" y="117" textAnchor="middle" fill="#7dd3fc" fontSize="7">
              优势：无需全麻开刀，在 3D 钼靶立体引导下毫厘不差切取钙化标本送检病理
            </text>
          </svg>
        )}
      </div>

      {/* Explanation Box */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
        {viewType === "benign" && (
          <>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>良性钙化鉴别法则</span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-300">
                BI-RADS 2 类 · 定期年检
              </span>
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed space-y-1">
              <p>• <strong>形态特征：</strong>粗大、圆形、卵圆形、蛋壳样或爆米花样，直径通常 &gt;0.5mm 甚至数毫米，质地致密。</p>
              <p>• <strong>形成机理：</strong>乳腺退行性纤维腺瘤长期机化、脂肪坏死或乳汁分泌物潴留导致的良性矿化。</p>
              <p>• <strong>处理原则：</strong>100% 属于良性生理过程，不需要吃中药散结，更严禁盲目穿刺开刀。</p>
            </div>
          </>
        )}

        {viewType === "malignant" && (
          <>
            <div className="flex items-center justify-between text-xs font-bold text-rose-400">
              <span>恶性微钙化高危警示</span>
              <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded-full text-rose-300">
                BI-RADS 4B ~ 4C 类 · 积极穿刺
              </span>
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed space-y-1">
              <p>• <strong>形态特征：</strong>细小、形态各异（多形性）、泥沙样、甚至沿导管走向呈线样或分支样分布。</p>
              <p>• <strong>形成机理：</strong>快速异常增殖的导管癌细胞在管腔内发生缺血粉刺样坏死（Comedo necrosis），坏死碎片发生微小矿化形成钙斑。</p>
              <p>• <strong>处理原则：</strong>高频彩超通常看不见这种细小钙化，必须以钼靶为准，首选钼靶立体定位微创旋切明确病理。</p>
            </div>
          </>
        )}

        {viewType === "mammotome" && (
          <>
            <div className="flex items-center justify-between text-xs font-bold text-sky-400">
              <span>麦默通 (Mammotome) 活检全流程指引</span>
              <span className="text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-full text-sky-300">
                微创门诊手术 · 30分钟完成
              </span>
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed space-y-1">
              <p>• <strong>无需开刀：</strong>仅需 3mm 皮肤小针孔，在局部麻醉下即可完成，术后无需缝针，愈合后几乎无疤痕。</p>
              <p>• <strong>标本拍片再确认：</strong>切取出的组织条会在术中立即再次放到钼靶机下拍片，确认标本内含有微钙化颗粒，确保采样 100% 击中靶心。</p>
              <p>• <strong>精准定性：</strong>由病理科行石蜡切片和免疫组化，明确是否为导管原位癌 (DCIS) 或不典型增生，为后续治疗定下金标准。</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
