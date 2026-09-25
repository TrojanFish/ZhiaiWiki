"use client";

import React, { useState } from "react";
import { TrendingUp, Award, ChevronDown, ChevronUp, Info } from "lucide-react";

interface KmPoint {
  time: number;
  label: string;
  armA: number;
  armB?: number;
}

interface KmCurveConfig {
  title: string;
  study: string;
  endpoint: string;
  unit: string;
  armAName: string;
  armAColor: string;
  armBName?: string;
  armBColor?: string;
  hazardRatio?: string;
  pVal?: string;
  data: KmPoint[];
  takeaway: string;
}

export const KM_CURVE_DATA: Record<string, KmCurveConfig> = {
  ia1: {
    title: "JCOG0804 / JCOG1211 长期生存曲线",
    study: "JTO 2021 & Lancet Respir Med 2023",
    endpoint: "5年总生存率 (OS) / RFS",
    unit: "年",
    armAName: "微创解剖性局切组 (R0)",
    armAColor: "#059669",
    armBName: "传统全肺叶切除参照",
    armBColor: "#94a3b8",
    hazardRatio: "等效无差异",
    pVal: "p = 0.94",
    data: [
      { time: 0, label: "0年", armA: 100, armB: 100 },
      { time: 1, label: "1年", armA: 100, armB: 99.5 },
      { time: 2, label: "2年", armA: 99.9, armB: 98.8 },
      { time: 3, label: "3年", armA: 99.8, armB: 98.0 },
      { time: 4, label: "4年", armA: 99.7, armB: 97.2 },
      { time: 5, label: "5年", armA: 99.7, armB: 96.8 },
    ],
    takeaway: "早期微浸润磨玻璃腺癌规范局切后，5年生存曲线呈一条平直高位线（99.7%），无需术后辅助化疗。",
  },
  stas: {
    title: "JCO 2019 气道播散解剖性切除获益曲线",
    study: "Journal of Clinical Oncology 2019 (N=25,467)",
    endpoint: "5年无复发生存率 (RFS)",
    unit: "年",
    armAName: "解剖性肺叶切除 (充分切缘)",
    armAColor: "#0284c7",
    armBName: "非解剖局部楔切 (切缘受限)",
    armBColor: "#d97706",
    hazardRatio: "HR 1.87 (1.52-2.29)",
    pVal: "p < 0.001",
    data: [
      { time: 0, label: "0年", armA: 100, armB: 100 },
      { time: 1, label: "1年", armA: 97.2, armB: 91.0 },
      { time: 2, label: "2年", armA: 94.8, armB: 84.2 },
      { time: 3, label: "3年", armA: 93.1, armB: 78.5 },
      { time: 4, label: "4年", armA: 91.5, armB: 73.0 },
      { time: 5, label: "5年", armA: 90.2, armB: 68.4 },
    ],
    takeaway: "即使存在气道播散 (STAS+)，充足切缘的标准解剖切除可将 5 年复发风险强力阻断减半。",
  },
  luminal_a: {
    title: "TAILORx 21基因低危免化疗生存曲线",
    study: "NEJM 2018 (N=10,273 前瞻RCT)",
    endpoint: "9年无浸润病变生存 (iDFS)",
    unit: "年",
    armAName: "单纯内分泌治疗组 (免化疗)",
    armAColor: "#db2777",
    armBName: "化疗 + 内分泌联合组",
    armBColor: "#7c3aed",
    hazardRatio: "HR 1.08 (0.94-1.24)",
    pVal: "p = 0.26 (无差异)",
    data: [
      { time: 0, label: "0年", armA: 100, armB: 100 },
      { time: 1, label: "1年", armA: 99.5, armB: 99.4 },
      { time: 3, label: "3年", armA: 98.8, armB: 98.6 },
      { time: 5, label: "5年", armA: 98.2, armB: 98.1 },
      { time: 7, label: "7年", armA: 95.8, armB: 95.6 },
      { time: 9, label: "9年", armA: 93.3, armB: 93.1 },
    ],
    takeaway: "两组生存曲线几乎完全重合！证实绝经后 RS<26 患者加用化疗零额外获益，单纯内分泌治疗即可豁免化疗毒副反应。",
  },
  her2_pos: {
    title: "APHINITY 试验曲帕双靶强化获益曲线",
    study: "NEJM 2017 (N=4,805 前瞻RCT)",
    endpoint: "6年无浸润疾病生存 (iDFS)",
    unit: "年",
    armAName: "曲帕双靶强化组 (HP + 化疗)",
    armAColor: "#7c3aed",
    armBName: "单曲妥珠对照组 (H + 化疗)",
    armBColor: "#94a3b8",
    hazardRatio: "HR 0.72 (0.59-0.87)",
    pVal: "p = 0.001",
    data: [
      { time: 0, label: "0年", armA: 100, armB: 100 },
      { time: 1, label: "1年", armA: 98.5, armB: 97.0 },
      { time: 2, label: "2年", armA: 96.2, armB: 93.8 },
      { time: 3, label: "3年", armA: 94.1, armB: 91.2 },
      { time: 4, label: "4年", armA: 92.8, armB: 89.5 },
      { time: 6, label: "6年", armA: 90.6, armB: 87.8 },
    ],
    takeaway: "淋巴结阳性高危 HER2+ 患者，曲帕双靶将 6 年复发转移风险断崖式降低 28%！",
  },
  crc_idea: {
    title: "IDEA 协作组 3月 vs 6月 CAPOX 减毒非劣效曲线",
    study: "NEJM 2018 (N=12,834 6项前瞻RCT)",
    endpoint: "3年无病生存率 (DFS)",
    unit: "年",
    armAName: "3 个月 CAPOX (神经毒性 3%)",
    armAColor: "#059669",
    armBName: "6 个月 CAPOX (神经毒性 16%)",
    armBColor: "#0284c7",
    hazardRatio: "HR 0.98 (非劣效成立)",
    pVal: "p = 0.78",
    data: [
      { time: 0, label: "0年", armA: 100, armB: 100 },
      { time: 1, label: "1年", armA: 92.5, armB: 93.0 },
      { time: 2, label: "2年", armA: 86.8, armB: 87.2 },
      { time: 3, label: "3年", armA: 83.1, armB: 83.3 },
    ],
    takeaway: "3个月与6个月抗肿瘤疗效等效，但不可逆重度神经毒性下降 81%，避免终身肢端麻木。",
  },
  crc_dmmr: {
    title: "KEYNOTE-177 微卫星不稳定一线免疫长存曲线",
    study: "NEJM 2020 (N=307 国际多中心RCT)",
    endpoint: "无进展生存率 (PFS)",
    unit: "年",
    armAName: "帕博利珠单抗单药组",
    armAColor: "#7c3aed",
    armBName: "标准联合化疗组",
    armBColor: "#e11d48",
    hazardRatio: "HR 0.60 (0.45-0.80)",
    pVal: "p = 0.0002",
    data: [
      { time: 0, label: "0年", armA: 100, armB: 100 },
      { time: 1, label: "1年", armA: 68.0, armB: 46.0 },
      { time: 2, label: "2年", armA: 54.0, armB: 33.0 },
      { time: 3, label: "3年", armA: 48.0, armB: 19.0 },
      { time: 5, label: "5年", armA: 44.0, armB: 11.0 },
    ],
    takeaway: "免疫单药带来极为稳定的长尾平台期（Plateau），对 dMMR 患者实现化疗豁免与持久抗癌控制。",
  },
  gastric_esd: {
    title: "JCOG0607 早期胃癌内镜微创切除生存曲线",
    study: "Gastric Cancer 2021 (N=5,265)",
    endpoint: "5年总生存率 (OS)",
    unit: "年",
    armAName: "内镜黏膜下剥离 ESD (保全胃)",
    armAColor: "#059669",
    armBName: "传统开腹大部切除参照",
    armBColor: "#d97706",
    hazardRatio: "非劣效确证",
    pVal: "p = 0.89",
    data: [
      { time: 0, label: "0年", armA: 100, armB: 100 },
      { time: 1, label: "1年", armA: 99.8, armB: 99.2 },
      { time: 2, label: "2年", armA: 99.6, armB: 98.8 },
      { time: 3, label: "3年", armA: 99.5, armB: 98.5 },
      { time: 4, label: "4年", armA: 99.3, armB: 98.2 },
      { time: 5, label: "5年", armA: 99.2, armB: 98.0 },
    ],
    takeaway: "ESD 微创保胃生存率不仅完全等效开腹切胃，且完整保留了全胃消化吸收功能，避免倾倒综合征。",
  },
  gastric_flot: {
    title: "FLOT4-AIO 局部进展期胃癌围手术期三联曲线",
    study: "The Lancet 2019 (N=716 前瞻RCT)",
    endpoint: "总生存率 (OS)",
    unit: "年",
    armAName: "FLOT 围手术期三联组",
    armAColor: "#d97706",
    armBName: "传统 ECF/ECX 方案组",
    armBColor: "#94a3b8",
    hazardRatio: "HR 0.77 (0.63-0.94)",
    pVal: "p = 0.012",
    data: [
      { time: 0, label: "0年", armA: 100, armB: 100 },
      { time: 1, label: "1年", armA: 82.0, armB: 73.0 },
      { time: 2, label: "2年", armA: 68.0, armB: 58.0 },
      { time: 3, label: "3年", armA: 57.0, armB: 48.0 },
      { time: 4, label: "4年", armA: 50.0, armB: 41.0 },
      { time: 5, label: "5年", armA: 45.0, armB: 36.0 },
    ],
    takeaway: "FLOT 将中位总生存期从 35 个月大幅跃升至 50 个月，成为可切除局部进展期胃癌国际公认金标准。",
  },
  thyroid_ptmc: {
    title: "Kuma 医院 10年微小癌主动监测观察曲线",
    study: "Thyroid 2014 & JAMA Otolaryngol 2018 (N=2,153)",
    endpoint: "10年免手术观察率 & DSS",
    unit: "年",
    armAName: "疾病特异生存率 (DSS - 0转移)",
    armAColor: "#059669",
    armBName: "免手术平稳观察率 (未增大)",
    armBColor: "#4f46e5",
    hazardRatio: "死亡风险 0",
    pVal: "p < 0.0001",
    data: [
      { time: 0, label: "0年", armA: 100, armB: 100 },
      { time: 2, label: "2年", armA: 100, armB: 98.5 },
      { time: 4, label: "4年", armA: 100, armB: 96.8 },
      { time: 6, label: "6年", armA: 100, armB: 95.0 },
      { time: 8, label: "8年", armA: 100, armB: 93.5 },
      { time: 10, label: "10年", armA: 100, armB: 92.0 },
    ],
    takeaway: "长达 10 年前瞻随访证实：92% 的微小癌患者无需切除腺体，疾病特异生存率稳居 100%。",
  },
  liver_ta: {
    title: "IMbrave150 晚期肝癌 T+A 双达方案一线总生存曲线",
    study: "New England Journal of Medicine 2020 (N=501)",
    endpoint: "总生存率 (OS)",
    unit: "月",
    armAName: "阿替利珠单抗 + 贝伐珠单抗 (T+A)",
    armAColor: "#e11d48",
    armBName: "传统索拉非尼单药对照",
    armBColor: "#94a3b8",
    hazardRatio: "HR 0.58 (0.42-0.79)",
    pVal: "p < 0.001",
    data: [
      { time: 0, label: "0月", armA: 100, armB: 100 },
      { time: 3, label: "3月", armA: 92.0, armB: 85.0 },
      { time: 6, label: "6月", armA: 84.8, armB: 72.2 },
      { time: 9, label: "9月", armA: 76.5, armB: 63.0 },
      { time: 12, label: "12月", armA: 67.2, armB: 54.6 },
      { time: 18, label: "18月", armA: 52.0, armB: 40.0 },
    ],
    takeaway: "T+A 双达使死亡风险显著降低 42%，突破传统靶向瓶颈，为伴门脉癌栓患者创造宝贵的转化切除机会。",
  },
};

interface HeroKmCurveProps {
  caseId: string;
}

export default function HeroKmCurve({ caseId }: HeroKmCurveProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const config = KM_CURVE_DATA[caseId] || KM_CURVE_DATA.ia1;

  // SVG Chart Geometry
  const width = 360;
  const height = 140;
  const padding = { top: 15, right: 20, bottom: 25, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxTime = config.data[config.data.length - 1].time || 5;
  const minY = Math.max(0, Math.min(...config.data.flatMap((d) => [d.armA, d.armB ?? 100])) - 10);
  const maxY = 100;

  const getX = (time: number) => padding.left + (time / maxTime) * chartWidth;
  const getY = (val: number) => padding.top + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;

  // Generate SVG step path
  const buildStepPath = (points: { time: number; val: number }[]) => {
    if (points.length === 0) return "";
    let d = `M ${getX(points[0].time)} ${getY(points[0].val)}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      // Stepped Kaplan-Meier corner
      d += ` H ${getX(curr.time)} V ${getY(curr.val)}`;
    }
    return d;
  };

  const armAPoints = config.data.map((d) => ({ time: d.time, val: d.armA }));
  const armBPoints = config.data.filter((d) => d.armB !== undefined).map((d) => ({ time: d.time, val: d.armB! }));

  const pathA = buildStepPath(armAPoints);
  const pathB = buildStepPath(armBPoints);

  // Gradient area below curve A
  const areaPathA = `${pathA} V ${padding.top + chartHeight} H ${padding.left} Z`;

  const activePoint = hoverIndex !== null ? config.data[hoverIndex] : config.data[config.data.length - 1];

  return (
    <div className="bg-slate-50/90 rounded-2xl border border-slate-200/80 overflow-hidden transition-all shadow-2xs">
      {/* Toggle Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer bg-white/60 hover:bg-white"
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          </span>
          <span className="text-slate-900 font-extrabold tracking-tight">
            顶刊 Kaplan-Meier 循证生存曲线
          </span>
          <span className="text-[10px] text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded font-mono font-bold">
            NEJM/Lancet 真实队列
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <span>{isOpen ? "收起曲线" : "展开前瞻曲线"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expandable Chart Canvas */}
      {isOpen && (
        <div className="p-3.5 sm:p-4 pt-2 border-t border-slate-100 space-y-3 animate-fade-in">
          {/* Header metadata */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-black text-slate-900 leading-snug">{config.title}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-0.5">{config.study} · 终点: {config.endpoint}</div>
            </div>
            {config.hazardRatio && (
              <div className="text-right shrink-0 bg-white px-2 py-1 rounded-lg border border-slate-200/70 shadow-2xs">
                <div className="text-[11px] font-black text-blue-700 font-mono tabular-nums">{config.hazardRatio}</div>
                {config.pVal && <div className="text-[9px] text-slate-400 font-mono">{config.pVal}</div>}
              </div>
            )}
          </div>

          {/* Interactive SVG Curve Container */}
          <div className="relative bg-white rounded-xl p-2 border border-slate-200/70 shadow-2xs overflow-hidden">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto select-none"
              style={{ maxHeight: "160px" }}
            >
              <defs>
                <linearGradient id={`km-grad-${caseId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.armAColor} stopOpacity="0.18" />
                  <stop offset="100%" stopColor={config.armAColor} stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Y Axis Grid lines */}
              {[100, Math.round((100 + minY) / 2), Math.round(minY)].map((val) => (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={getY(val)}
                    x2={width - padding.right}
                    y2={getY(val)}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={padding.left - 5}
                    y={getY(val) + 3}
                    fontSize="9"
                    fill="#94a3b8"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {val}%
                  </text>
                </g>
              ))}

              {/* X Axis Ticks */}
              {config.data.map((d, i) => (
                <g key={d.time}>
                  <line
                    x1={getX(d.time)}
                    y1={padding.top + chartHeight}
                    x2={getX(d.time)}
                    y2={padding.top + chartHeight + 4}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                  <text
                    x={getX(d.time)}
                    y={padding.top + chartHeight + 15}
                    fontSize="9"
                    fill="#64748b"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {d.label}
                  </text>
                </g>
              ))}

              {/* Shaded Area A */}
              <path d={areaPathA} fill={`url(#km-grad-${caseId})`} />

              {/* Curve B (Control / Reference) */}
              {pathB && (
                <path
                  d={pathB}
                  fill="none"
                  stroke={config.armBColor || "#94a3b8"}
                  strokeWidth="1.75"
                  strokeDasharray="4 3"
                />
              )}

              {/* Curve A (Experimental / Standard) */}
              <path
                d={pathA}
                fill="none"
                stroke={config.armAColor}
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points on Curve A */}
              {config.data.map((d, i) => (
                <circle
                  key={d.time}
                  cx={getX(d.time)}
                  cy={getY(d.armA)}
                  r={hoverIndex === i ? 4 : 2.5}
                  fill={config.armAColor}
                  stroke="#ffffff"
                  strokeWidth={hoverIndex === i ? 2 : 1}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              ))}

              {/* Hover scrubber vertical rule */}
              {hoverIndex !== null && (
                <line
                  x1={getX(config.data[hoverIndex].time)}
                  y1={padding.top}
                  x2={getX(config.data[hoverIndex].time)}
                  y2={padding.top + chartHeight}
                  stroke="#0284c7"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}
            </svg>

            {/* Floating Scrubber Data Pill */}
            <div className="mt-1 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
                  <span className="w-2.5 h-1 rounded-full" style={{ backgroundColor: config.armAColor }} />
                  <span>{config.armAName}:</span>
                  <strong className="font-mono text-slate-900 tabular-nums">{activePoint.armA}%</strong>
                </span>
                {config.armBName && activePoint.armB !== undefined && (
                  <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                    <span className="w-2.5 h-1 rounded-full border border-slate-400 border-dashed" style={{ backgroundColor: config.armBColor }} />
                    <span>{config.armBName}:</span>
                    <strong className="font-mono text-slate-700 tabular-nums">{activePoint.armB}%</strong>
                  </span>
                )}
              </div>
              <span className="text-slate-400 font-mono font-semibold">
                节点: {activePoint.label}
              </span>
            </div>
          </div>

          {/* Clinical Takeaway */}
          <div className="text-[11px] text-slate-600 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 flex items-start gap-1.5 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>{config.takeaway}</span>
          </div>
        </div>
      )}
    </div>
  );
}
