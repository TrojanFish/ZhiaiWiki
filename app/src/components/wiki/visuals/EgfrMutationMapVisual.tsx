"use client";

import { useState } from "react";
import { Dna, Target } from "lucide-react";

type ExonId = "19del" | "L858R" | "20ins" | "rare";

// ── SVG layout constants ──────────────────────────────────────────────
// viewBox="0 0 280 100"
// Intron connector lines sit on y=50 (mid of exon rects)
// Exon widths (proportional to real coding length):
//   Exon 18 (rare / G719X) : 35 px
//   Exon 19 (19del)        : 55 px  ← most common, slightly taller rect
//   Exon 20 (20ins)        : 50 px
//   Exon 21 (L858R)        : 60 px
// Gap between exons (intron line): 10 px each (3 gaps = 30 px)
// Left margin: 12 px, Right margin: 12 px
// Total used: 12 + 35 + 10 + 55 + 10 + 50 + 10 + 60 + 12 = 244 px  (fits inside 280)

const EXONS = [
  {
    id: "rare" as ExonId,
    label: "Exon 18",
    sub: "G719X (罕见)",
    x: 12,
    w: 35,
    // Standard height / y for non-highlighted
    y: 24,
    h: 28,
    // Selected fill / unselected fill / border
    selFill: "#d97706",   // amber-600
    unselFill: "#fef3c7", // amber-100
    selStroke: "#f59e0b",
    unselStroke: "#fcd34d",
    textFill: "#92400e",
    textSelFill: "#fff",
  },
  {
    id: "19del" as ExonId,
    label: "Exon 19",
    sub: "19del (~45%)",
    x: 12 + 35 + 10, // 57
    w: 55,
    y: 20,  // slightly taller to highlight prevalence
    h: 36,
    selFill: "#2563eb",   // blue-600
    unselFill: "#dbeafe", // blue-100
    selStroke: "#1d4ed8",
    unselStroke: "#93c5fd",
    textFill: "#1e40af",
    textSelFill: "#fff",
  },
  {
    id: "20ins" as ExonId,
    label: "Exon 20",
    sub: "20ins (~6%)",
    x: 57 + 55 + 10, // 122
    w: 50,
    y: 24,
    h: 28,
    selFill: "#7c3aed",   // violet-600
    unselFill: "#ede9fe", // violet-100
    selStroke: "#6d28d9",
    unselStroke: "#c4b5fd",
    textFill: "#4c1d95",
    textSelFill: "#fff",
  },
  {
    id: "L858R" as ExonId,
    label: "Exon 21",
    sub: "L858R (~40%)",
    x: 122 + 50 + 10, // 182
    w: 60,
    y: 20,  // taller to reflect high prevalence
    h: 36,
    selFill: "#0369a1",   // sky-700
    unselFill: "#e0f2fe", // sky-100
    selStroke: "#0284c7",
    unselStroke: "#7dd3fc",
    textFill: "#0c4a6e",
    textSelFill: "#fff",
  },
] as const;

// ── Clinical details & citations ──────────────────────────────────────
const exonDetails: Record<
  ExonId,
  {
    title: string;
    prevalence: string;
    type: string;
    typeBadge: string;
    drugs: string;
    features: string;
    trialName: string;
    journal: string;
    year: string;
    sampleSize: string;
    primaryResult: string;
    doiUrl: string;
  }
> = {
  "19del": {
    title: "19 号外显子缺失突变 (Exon 19del)",
    prevalence: "约占 EGFR 突变总数 45% ~ 50%",
    type: "经典敏感突变 · 黄金靶点",
    typeBadge: "bg-blue-50 text-blue-700 border border-blue-200",
    drugs: "三代 TKI 首选：奥希替尼、阿美替尼、伏美替尼",
    features:
      "对第三代 EGFR-TKI 具有极其卓越的响应率和中枢神经系统（脑部）高保护率，ADAURA 术后辅助治疗降低 83% 复发转移风险。",
    trialName: "ADAURA",
    journal: "NEJM",
    year: "2020",
    sampleSize: "682",
    primaryResult: "4年 DFS HR 0.17，降低 83% 复发风险",
    doiUrl: "https://doi.org/10.1056/NEJMoa2027071",
  },
  "L858R": {
    title: "21 号外显子 L858R 点突变",
    prevalence: "约占 EGFR 突变总数 40% ~ 45%",
    type: "经典敏感突变 · 黄金靶点",
    typeBadge: "bg-sky-50 text-sky-700 border border-sky-200",
    drugs: "三代 TKI 首选：奥希替尼、阿美替尼、伏美替尼",
    features:
      "与 19del 同属最经典的敏感突变类型，三代靶向药物长期控制率极高，术后辅助治疗大幅延缓疾病复发。",
    trialName: "FLAURA2",
    journal: "NEJM",
    year: "2023",
    sampleSize: "586",
    primaryResult: "PFS HR 0.62，中位 PFS 25.5 vs 16.7月",
    doiUrl: "https://doi.org/10.1056/NEJMoa2305451",
  },
  "20ins": {
    title: "20 号外显子插入突变 (Exon 20ins)",
    prevalence: "约占 EGFR 突变总数 4% ~ 9%",
    type: "特殊插入缺失变异",
    typeBadge: "bg-violet-50 text-violet-700 border border-violet-200",
    drugs: "特异性新药：舒沃替尼 (Sunvozertinib)、埃万妥单抗 (Amivantamab)",
    features:
      "由于空间构象改变，传统一、二、三代常规 TKI 响应有限。近年来特异性 Exon 20 靶向药（舒沃替尼等）上市，大幅突破了治疗瓶颈！",
    trialName: "PAPILLON",
    journal: "NEJM",
    year: "2023",
    sampleSize: "308",
    primaryResult: "PFS HR 0.66，ORR 73% vs 47%",
    doiUrl: "https://doi.org/10.1056/NEJMoa2307239",
  },
  "rare": {
    title: "罕见敏感突变 (G719X / L861Q / S768I)",
    prevalence: "约占 EGFR 突变总数 3% ~ 5%",
    type: "罕见非经典突变",
    typeBadge: "bg-amber-50 text-amber-700 border border-amber-200",
    drugs: "二代阿法替尼 (Afatinib) 或三代 TKI 加量/常规",
    features:
      "分布于 18 号外显子（G719X）、20 号外显子（S768I）及 21 号外显子（L861Q），国际指南首选二代阿法替尼或三代靶向药治疗。",
    trialName: "LUX-Lung 2/3/6 (阿法替尼)",
    journal: "Lancet Oncol",
    year: "2015",
    sampleSize: "600+",
    primaryResult: "ORR 71.1%，优于一代 EGFR-TKI",
    doiUrl: "https://doi.org/10.1016/S1470-2045(14)71173-8",
  },
};

// ── Quick-select pill labels ──────────────────────────────────────────
const PILL_LABELS: Record<ExonId, string> = {
  "19del": "19 缺失",
  "L858R": "21 L858R",
  "20ins": "20 插入",
  "rare":  "罕见突变",
};

// ── Active pill colour per variant ───────────────────────────────────
const PILL_ACTIVE: Record<ExonId, string> = {
  "19del": "bg-blue-600 text-white ring-1 ring-blue-400",
  "L858R": "bg-sky-700 text-white ring-1 ring-sky-400",
  "20ins": "bg-violet-600 text-white ring-1 ring-violet-400",
  "rare":  "bg-amber-600 text-white ring-1 ring-amber-400",
};

// ─────────────────────────────────────────────────────────────────────
export function EgfrMutationMapVisual() {
  const [selectedExon, setSelectedExon] = useState<ExonId>("19del");

  const active = exonDetails[selectedExon];

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 select-none border border-slate-200 shadow-sm">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <Dna className="w-3.5 h-3.5 text-blue-500" />
          EGFR 酪氨酸激酶区突变位点全景图谱
        </span>
        <span className="text-[10px] text-slate-400">外显子 18 ~ 21 靶点分布</span>
      </div>

      {/* ── SVG Gene Map ── */}
      <svg
        viewBox="0 0 280 100"
        className="w-full h-auto mb-1"
        role="img"
        aria-label="EGFR 外显子 18–21 变异位点分布图，点击外显子方块查看详情"
      >
        <rect width="280" height="100" fill="#f8fafc" rx="8" />

        {/* Intron backbone (thin line connecting exons) */}
        <line
          x1="12" y1="38" x2="268" y2="38"
          stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"
        />

        {/* Render each exon block */}
        {EXONS.map((exon) => {
          const sel = selectedExon === exon.id;
          const midX = exon.x + exon.w / 2;
          const midY = exon.y + exon.h / 2;

          return (
            <g
              key={exon.id}
              onClick={() => setSelectedExon(exon.id)}
              className="cursor-pointer"
              role="button"
              aria-label={`${exon.label} — ${exon.sub}`}
              aria-pressed={sel}
            >
              {/* Exon rectangle */}
              <rect
                x={exon.x}
                y={exon.y}
                width={exon.w}
                height={exon.h}
                rx="5"
                fill={sel ? exon.selFill : exon.unselFill}
                stroke={sel ? exon.selStroke : exon.unselStroke}
                strokeWidth={sel ? 2 : 1}
              />

              {/* Exon number */}
              <text
                x={midX}
                y={midY - 4}
                textAnchor="middle"
                fill={sel ? exon.textSelFill : exon.textFill}
                fontSize="5.5"
                fontWeight="bold"
                fontFamily="system-ui, sans-serif"
              >
                {exon.label}
              </text>

              {/* Mutation label */}
              <text
                x={midX}
                y={midY + 6}
                textAnchor="middle"
                fill={sel ? exon.textSelFill : exon.textFill}
                fontSize="4"
                fontFamily="system-ui, sans-serif"
              >
                {exon.sub}
              </text>

              {/* Selected indicator dot */}
              {sel && (
                <circle
                  cx={midX}
                  cy={exon.y + exon.h + 5}
                  r="2.5"
                  fill={exon.selFill}
                />
              )}
            </g>
          );
        })}

        {/* ── Legend strip at bottom of SVG ── */}
        {/* Blue dot — sensitizing */}
        <circle cx="16" cy="92" r="3" fill="#2563eb" />
        <text x="21" y="95.5" fontSize="4" fill="#475569" fontFamily="system-ui, sans-serif">
          蓝/靛 = 经典敏感突变（TKI 响应良好）
        </text>
        {/* Violet dot — indel */}
        <circle cx="130" cy="92" r="3" fill="#7c3aed" />
        <text x="135" y="95.5" fontSize="4" fill="#475569" fontFamily="system-ui, sans-serif">
          紫 = 特殊插入缺失
        </text>
        {/* Amber dot — rare */}
        <circle cx="192" cy="92" r="3" fill="#d97706" />
        <text x="197" y="95.5" fontSize="4" fill="#475569" fontFamily="system-ui, sans-serif">
          橙 = 罕见非经典
        </text>
      </svg>

      {/* ── Quick-select pills ── */}
      <div className="grid grid-cols-4 gap-1.5 mb-3 mt-2">
        {(["19del", "L858R", "20ins", "rare"] as ExonId[]).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedExon(key)}
            className={`text-[11px] py-1 px-1 rounded-lg font-semibold transition-all cursor-pointer ${
              selectedExon === key
                ? PILL_ACTIVE[key]
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {PILL_LABELS[key]}
          </button>
        ))}
      </div>

      {/* ── Detail card ── */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
        {/* Title + type badge */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-900">{active.title}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${active.typeBadge}`}>
            {active.type} · {active.prevalence}
          </span>
        </div>

        {/* Clinical summary */}
        <p className="text-[11px] text-slate-600 leading-relaxed">{active.features}</p>

        {/* ── Citation block (四要素循证出处凭证) ── */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex items-start gap-2">
          <span className="text-slate-400 text-xs mt-0.5">📖</span>
          <div>
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="font-medium text-slate-700">{active.trialName}</span>
              {" · "}{active.journal} {active.year}
              {" · "}n={active.sampleSize} 例
              {" · "}<span className="font-medium">{active.primaryResult}</span>
            </p>
            <a
              href={active.doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 mt-0.5"
            >
              查看原文出处 ↗
            </a>
          </div>
        </div>

        {/* Drug strategy */}
        <div className="text-[11px] bg-white p-2 rounded-lg border border-slate-200 text-slate-700 flex items-start gap-1.5">
          <Target className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800">首选用药策略：</strong> {active.drugs}
          </span>
        </div>
      </div>
    </div>
  );
}
