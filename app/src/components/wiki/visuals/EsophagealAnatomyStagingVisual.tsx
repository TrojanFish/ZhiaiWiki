"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Info, 
  Layers, 
  Crosshair, 
  Stethoscope,
  Scissors,
  Zap,
  Radio,
  Award,
  Check
} from "lucide-react";

export function EsophagealAnatomyStagingVisual() {
  const [activeTab, setActiveTab] = useState<"anatomy" | "staging">("anatomy");

  // 解剖与浸润深度参数
  const [subsite, setSubsite] = useState<"cervical" | "upper_thoracic" | "middle_thoracic" | "lower_thoracic">("middle_thoracic");
  const [tumorDepth, setTumorDepth] = useState<"t1a" | "t1b" | "t2" | "t3" | "t4a" | "t4b">("t3");
  const [airwayInvasion, setAirwayInvasion] = useState<boolean>(false);
  const [aortaInvasion, setAortaInvasion] = useState<boolean>(false);

  // 淋巴结与分化参数
  const [examinedNodes, setExaminedNodes] = useState<number>(18);
  const [positiveNodes, setPositiveNodes] = useState<number>(1);
  const [clearanceField, setClearanceField] = useState<"two_field" | "three_field">("two_field");
  const [differentiation, setDifferentiation] = useState<"G1" | "G2" | "G3">("G2");
  const [hasM1, setHasM1] = useState<boolean>(false);

  // N 分期推算
  const nStage = positiveNodes === 0 ? "N0" : positiveNodes <= 2 ? "N1" : positiveNodes <= 6 ? "N2" : "N3";
  const isFistulaRisk = tumorDepth === "t4b" || airwayInvasion;
  const isAortaRisk = tumorDepth === "t4b" || aortaInvasion;

  // AJCC 第 8 版食管鳞癌 Stage 计算
  let calcStage = "IIB";
  let stageDetails = "";

  if (hasM1) {
    calcStage = "IVB";
    stageDetails = "远处器官或非区域淋巴结转移 (M1)。首选中国自主原研 PD-1 联合含铂双药化疗。";
  } else if (tumorDepth === "t1a" && nStage === "N0") {
    calcStage = "IA";
    stageDetails = "黏膜内早期鳞癌 (T1a N0 M0)。绝大多数符合内镜黏膜下剥离术 (ESD) 微创治愈适应证，保留自体食管。";
  } else if (tumorDepth === "t1b" && nStage === "N0") {
    calcStage = differentiation === "G1" ? "IA" : "IB";
    stageDetails = differentiation === "G1" 
      ? "黏膜下层浅浸润高分化 (T1b N0 M0 G1)。外科微创切除或密切结合浸润深度评估。"
      : `黏膜下层浸润伴 ${differentiation} 分化 (T1b N0 M0)。推荐胸腹腔镜联合微创切除 (MIE) + 淋巴结清扫。`;
  } else if (tumorDepth === "t2" && nStage === "N0") {
    calcStage = differentiation === "G1" ? "IB" : "IIA";
    stageDetails = differentiation === "G1"
      ? "浸润肌层高分化 (T2 N0 M0 G1)。标准外科微创根治术。"
      : `浸润肌层中低分化 (T2 N0 M0 ${differentiation})。推荐外科切除并充分质控淋巴结枚数。`;
  } else if (tumorDepth === "t3" && nStage === "N0") {
    if (subsite === "upper_thoracic" || differentiation !== "G1") {
      calcStage = "IIB";
      stageDetails = `外膜侵犯 (${subsite === "upper_thoracic" ? "胸上段" : `${differentiation}分化`}，T3 N0 M0)。推荐 NEOCRTEC5010 / CROSS 术前新辅助放化疗。`;
    } else {
      calcStage = "IIA";
      stageDetails = "外膜侵犯 (胸中下段 G1 高分化，T3 N0 M0)。推荐围手术期放化疗或规范根治切除。";
    }
  } else if ((tumorDepth === "t1a" || tumorDepth === "t1b" || tumorDepth === "t2") && nStage === "N1") {
    calcStage = "IIB";
    stageDetails = "早期肌层侵犯合并 1~2 枚淋巴结转移 (T1-2 N1 M0)。推荐新辅助放化疗降低局部复发。";
  } else if (tumorDepth === "t3" && nStage === "N1") {
    calcStage = "IIIA";
    stageDetails = "外膜侵犯伴 1~2 枚淋巴结转移 (T3 N1 M0)。经典局部进展期，首选 NEOCRTEC5010 新辅助同步放化疗。";
  } else if ((tumorDepth === "t1a" || tumorDepth === "t1b" || tumorDepth === "t2") && nStage === "N2") {
    calcStage = "IIIA";
    stageDetails = "T1-2 伴 3~6 枚淋巴结转移 (T1-2 N2 M0)。需加强系统性治疗。";
  } else if (tumorDepth === "t4a" && nStage === "N0") {
    calcStage = "IIIA";
    stageDetails = "侵犯胸膜/心包/膈肌但无淋巴结转移 (T4a N0 M0)。可行根治性扩大切除或术前放化疗。";
  } else if (tumorDepth === "t3" && nStage === "N2") {
    calcStage = "IIIB";
    stageDetails = "外膜侵犯伴 3~6 枚淋巴结转移 (T3 N2 M0)。推荐新辅助同步放化疗降期后微创手术。";
  } else if (tumorDepth === "t4a" && (nStage === "N1" || nStage === "N2")) {
    calcStage = "IIIB";
    stageDetails = "可切除邻近组织侵犯伴淋巴结转移 (T4a N1-2 M0)。强力新辅助综合治疗指征。";
  } else if (tumorDepth === "t4b" && (nStage === "N0" || nStage === "N1")) {
    calcStage = "IIIB";
    stageDetails = "不可切除气管/主动脉浸润伴 0~2 枚淋巴结转移 (T4b N0-1 M0)。不可直接手术，警惕瘘管！";
  } else if (tumorDepth === "t4b" && nStage === "N2") {
    calcStage = "IVA";
    stageDetails = "不可切除侵犯伴多枚淋巴结转移 (T4b N2 M0)。根治性放化疗联合免疫或转化评估。";
  } else if (nStage === "N3") {
    calcStage = "IVA";
    stageDetails = "区域淋巴结转移 ≥7 枚 (N3 M0)。局部晚期高负荷，推荐转化治疗或根治性放化疗。";
  }

  return (
    <div className="rounded-xl border border-purple-200 bg-white overflow-hidden shadow-sm">
      {/* 顶部标题与模式切换 */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 px-5 py-4 border-b border-purple-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-600 text-white rounded-lg shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
              AJCC 第 8 版食管鳞癌解剖定位与浸润深度仿真器
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                ESCC 中国标准
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              直观呈现门齿解剖标尺、T1~T4b 穿透层次、气管食管瘘 (TEF) 预警及 ≥15 枚淋巴结质控红线
            </p>
          </div>
        </div>

        {/* 标签栏切换 */}
        <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("anatomy")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "anatomy"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            解剖分段与气道毗邻
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("staging")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "staging"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            淋巴清扫与分期矩阵
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {activeTab === "anatomy" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 左侧：解剖标尺与 SVG 微观图解 (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-purple-600" />
                    食管解剖纵向标尺 (门齿距 15cm ~ 40cm)
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold">
                    {subsite === "cervical" && "颈段食管 (15~20cm)"}
                    {subsite === "upper_thoracic" && "胸上段食管 (20~25cm)"}
                    {subsite === "middle_thoracic" && "胸中段食管 (25~30cm · 中国最常见)"}
                    {subsite === "lower_thoracic" && "胸下段及贲门 (30~40cm)"}
                  </span>
                </div>

                {/* SVG 解剖与层次微观 */}
                <div className="w-full h-56 relative bg-gradient-to-b from-slate-900 to-indigo-950 rounded-lg p-2 overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 500 220" className="w-full h-full">
                    {/* 食管纵管轮廓 */}
                    <path
                      d="M 170,10 C 170,70 175,150 160,210 L 220,210 C 235,150 230,70 230,10 Z"
                      fill="#3b0764"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      opacity="0.8"
                    />

                    {/* 门齿刻度尺 */}
                    <g className="text-[10px] font-mono fill-slate-400">
                      <line x1="80" y1="20" x2="140" y2="20" stroke="#64748b" strokeDasharray="2,2" />
                      <text x="50" y="24">15cm 门齿</text>

                      <line x1="80" y1="65" x2="140" y2="65" stroke="#64748b" strokeDasharray="2,2" />
                      <text x="50" y="69">20cm 颈胸交界</text>

                      <line x1="80" y1="115" x2="140" y2="115" stroke="#64748b" strokeDasharray="2,2" />
                      <text x="50" y="119">25cm 气管分叉</text>

                      <line x1="80" y1="165" x2="140" y2="165" stroke="#64748b" strokeDasharray="2,2" />
                      <text x="50" y="169">30cm 下肺静脉</text>

                      <line x1="80" y1="205" x2="140" y2="205" stroke="#64748b" strokeDasharray="2,2" />
                      <text x="50" y="209">40cm 胃贲门</text>
                    </g>

                    {/* 气管与左右支气管 (紧邻胸上/胸中段食管前方) */}
                    <g opacity="0.85">
                      {/* 气管主干 */}
                      <path d="M 235,30 L 265,30 L 265,115 L 235,115 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                      {/* 气管软骨环 */}
                      <line x1="237" y1="45" x2="263" y2="45" stroke="#bae6fd" strokeWidth="2" />
                      <line x1="237" y1="65" x2="263" y2="65" stroke="#bae6fd" strokeWidth="2" />
                      <line x1="237" y1="85" x2="263" y2="85" stroke="#bae6fd" strokeWidth="2" />
                      <line x1="237" y1="105" x2="263" y2="105" stroke="#bae6fd" strokeWidth="2" />
                      <text x="275" y="75" fill="#38bdf8" fontSize="11" fontWeight="bold">气管 (Trachea)</text>

                      {/* 气管隆突与左/右主支气管分叉 */}
                      <path d="M 235,115 L 210,150 L 225,160 L 250,125 L 280,160 L 295,150 L 265,115 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="290" y="135" fill="#38bdf8" fontSize="9">隆突 (Carina)</text>
                    </g>

                    {/* 降主动脉 (食管后外侧) */}
                    <g opacity="0.8">
                      <path d="M 280,40 C 315,40 330,80 320,210 L 290,210 C 300,90 290,65 260,65 Z" fill="#b91c1c" stroke="#fb7185" strokeWidth="1" />
                      <text x="335" y="150" fill="#fb7185" fontSize="10">降主动脉 (Aorta)</text>
                    </g>

                    {/* 选定位置的高亮与肿瘤病灶 */}
                    {subsite === "cervical" && (
                      <rect x="165" y="20" width="68" height="45" fill="#a855f7" opacity="0.3" rx="4" />
                    )}
                    {subsite === "upper_thoracic" && (
                      <rect x="167" y="65" width="68" height="50" fill="#a855f7" opacity="0.3" rx="4" />
                    )}
                    {subsite === "middle_thoracic" && (
                      <rect x="169" y="115" width="68" height="50" fill="#a855f7" opacity="0.3" rx="4" />
                    )}
                    {subsite === "lower_thoracic" && (
                      <rect x="165" y="165" width="68" height="45" fill="#a855f7" opacity="0.3" rx="4" />
                    )}

                    {/* 肿瘤本体与浸润深度示意 */}
                    <g transform={`translate(180, ${subsite === "cervical" ? 35 : subsite === "upper_thoracic" ? 80 : subsite === "middle_thoracic" ? 130 : 175})`}>
                      {tumorDepth === "t1a" && (
                        <circle cx="20" cy="15" r="7" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5" />
                      )}
                      {tumorDepth === "t1b" && (
                        <circle cx="23" cy="15" r="10" fill="#eab308" stroke="#ffffff" strokeWidth="1.5" />
                      )}
                      {tumorDepth === "t2" && (
                        <circle cx="26" cy="15" r="13" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                      )}
                      {tumorDepth === "t3" && (
                        <circle cx="30" cy="15" r="16" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                      )}
                      {tumorDepth === "t4a" && (
                        <circle cx="34" cy="15" r="19" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                      )}
                      {tumorDepth === "t4b" && (
                        <g>
                          {/* 破溃闪烁侵犯气管 */}
                          <circle cx="38" cy="15" r="23" fill="#991b1b" stroke="#fda4af" strokeWidth="2" strokeDasharray="3,3" />
                          <line x1="45" y1="15" x2="65" y2="15" stroke="#fb7185" strokeWidth="3" />
                          <circle cx="65" cy="15" r="4" fill="#f43f5e" className="animate-ping" />
                          <text x="-40" y="-15" fill="#fda4af" fontSize="11" fontWeight="bold">气管壁/主动脉穿透浸润!</text>
                        </g>
                      )}
                    </g>
                  </svg>
                </div>
              </div>

              {/* 浸润深度图解卡 */}
              <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100 text-xs flex items-center justify-between">
                <div>
                  <span className="font-semibold text-purple-900">当前浸润等级：</span>
                  <span className="ml-1 font-mono font-bold text-purple-700 uppercase">
                    {tumorDepth === "t1a" && "cT1a (黏膜内癌 · 早期)"}
                    {tumorDepth === "t1b" && "cT1b (黏膜下层 · 浅肌层)"}
                    {tumorDepth === "t2" && "cT2 (固有肌层)"}
                    {tumorDepth === "t3" && "cT3 (纤维外膜)"}
                    {tumorDepth === "t4a" && "cT4a (胸膜/心包/膈肌 · 可切除)"}
                    {tumorDepth === "t4b" && "cT4b (气管/主动脉/椎体 · 绝对禁忌)"}
                  </span>
                </div>
                <div className="text-right">
                  {tumorDepth === "t1a" && <span className="text-emerald-600 font-medium">ESD 内镜保留食管微创</span>}
                  {tumorDepth === "t1b" && <span className="text-amber-600 font-medium">淋巴结转移风险 30%~40%</span>}
                  {(tumorDepth === "t2" || tumorDepth === "t3") && <span className="text-indigo-600 font-medium">NEOCRTEC5010 新辅助放化疗指征</span>}
                  {tumorDepth === "t4a" && <span className="text-orange-600 font-medium">扩大切除 / 转化治疗</span>}
                  {tumorDepth === "t4b" && <span className="text-rose-600 font-bold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> 气管食管瘘 TEF 高危</span>}
                </div>
              </div>
            </div>

            {/* 右侧：交互控制器 (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* 解剖部位选择 */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  1. 原发灶解剖部位（门齿距离）
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "cervical", label: "颈段 (15~20cm)", desc: "保喉难度极高" },
                    { id: "upper_thoracic", label: "胸上段 (20~25cm)", desc: "易向上转移" },
                    { id: "middle_thoracic", label: "胸中段 (25~30cm)", desc: "中国最常见 (55%)" },
                    { id: "lower_thoracic", label: "胸下段 (30~40cm)", desc: "直通贲门及腹腔" },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSubsite(item.id as any)}
                      className={`text-left p-2 rounded-lg border transition-all text-xs ${
                        subsite === item.id
                          ? "border-purple-600 bg-purple-50 text-purple-900 font-semibold ring-1 ring-purple-500"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div className="font-medium">{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 浸润深度选择 */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  2. 肿瘤外侵浸润深度 (T 分期)
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {[
                    { id: "t1a", label: "T1a 黏膜内" },
                    { id: "t1b", label: "T1b 黏膜下" },
                    { id: "t2", label: "T2 固有肌层" },
                    { id: "t3", label: "T3 侵及外膜" },
                    { id: "t4a", label: "T4a 心包/膈肌" },
                    { id: "t4b", label: "T4b 气管/主动脉" },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTumorDepth(t.id as any)}
                      className={`py-1.5 px-2 rounded-md border text-center transition-all ${
                        tumorDepth === t.id
                          ? t.id === "t4b"
                            ? "border-rose-600 bg-rose-50 text-rose-700 font-bold"
                            : "border-purple-600 bg-purple-50 text-purple-700 font-semibold"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 高危并发症警告联动 */}
              {isFistulaRisk && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-700">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 animate-bounce" />
                    气管食管瘘 (TEF) 穿孔致死高危警报！
                  </div>
                  <p className="text-rose-600 text-[11px] leading-relaxed">
                    肿瘤已浸及气管软骨或主支气管。放疗或抗血管靶向药可能诱发肿瘤坏死导致穿孔瘘管。进食水呛咳即为报警信号，禁忌盲目硬开刀，必须急行覆膜自膨式金属食管支架 (SEMS) 或气管支架物理封堵！
                  </p>
                </div>
              )}

              {/* 组织分化联动 */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  3. 组织学分化程度（直接影响 AJCC8 分期）
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "G1", label: "G1 高分化", desc: "恶性度相对低" },
                    { id: "G2", label: "G2 中分化", desc: "中国最普遍" },
                    { id: "G3", label: "G3 低分化", desc: "侵袭转移快" },
                  ].map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setDifferentiation(g.id as any)}
                      className={`p-2 rounded-lg border text-center text-xs transition-all ${
                        differentiation === g.id
                          ? "border-purple-600 bg-purple-50 text-purple-900 font-semibold"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      <div className="font-semibold">{g.label}</div>
                      <div className="text-[10px] text-slate-400">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Staging 模式：淋巴结质控滑块与 AJCC 矩阵 */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* 左侧：淋巴结清扫质控与滑块 (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-purple-600" />
                    病理检出淋巴结总数 (CSCO/AJCC 质控红线 ≥ 15 枚)
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded font-bold inline-flex items-center gap-1 ${
                      examinedNodes < 15
                        ? "bg-rose-100 text-rose-700"
                        : examinedNodes >= 25
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <span>已检出 {examinedNodes} 枚</span>
                    {examinedNodes < 15 ? (
                      <>
                        <span>· 质控不达标</span>
                        <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                      </>
                    ) : examinedNodes >= 25 ? (
                      <>
                        <span>· 高质量清扫</span>
                        <Award className="w-3 h-3 text-blue-600 shrink-0" />
                      </>
                    ) : (
                      <>
                        <span>· 达标</span>
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      </>
                    )}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="35"
                  value={examinedNodes}
                  onChange={e => setExaminedNodes(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1枚 (严重不足)</span>
                  <span className="text-purple-600 font-bold">15枚质控线</span>
                  <span>25枚 (优秀)</span>
                  <span>35枚</span>
                </div>

                {/* 清扫枚数警示卡 */}
                {examinedNodes < 15 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-800 leading-relaxed flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>分期低估风险提示：</strong>检出枚数不足 15 枚可能使潜在阳性淋巴结漏网，导致患者由真实的 IIIB 期被误判为 IIA/IIB 期。术后需强化辅助随访或复核病理蜡块。
                    </span>
                  </div>
                )}
              </div>

              {/* 二野 vs 三野清扫范围高亮 */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-indigo-600" />
                    清扫范围选择：二野 vs 三野清扫
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setClearanceField("two_field")}
                      className={`text-xs px-2.5 py-1 rounded font-medium ${
                        clearanceField === "two_field"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      两野清扫 (胸+腹)
                    </button>
                    <button
                      type="button"
                      onClick={() => setClearanceField("three_field")}
                      className={`text-xs px-2.5 py-1 rounded font-medium ${
                        clearanceField === "three_field"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      三野清扫 (颈+胸+腹)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className={`p-2 rounded-lg border ${clearanceField === "three_field" ? "border-purple-400 bg-purple-50/50 text-purple-800 font-bold" : "border-slate-200 opacity-60 text-slate-400"}`}>
                    颈部站 (双侧锁骨上/喉返神经)
                    <div className="text-[10px] font-normal">{clearanceField === "three_field" ? "规范清扫" : "两野未覆盖"}</div>
                  </div>
                  <div className="p-2 rounded-lg border border-indigo-400 bg-indigo-50/50 text-indigo-800 font-bold">
                    胸部站 (隆突下/食管旁/肺韧带)
                    <div className="text-[10px] font-normal">两野/三野均标准清扫</div>
                  </div>
                  <div className="p-2 rounded-lg border border-blue-400 bg-blue-50/50 text-blue-800 font-bold">
                    腹部站 (胃左动脉/腹腔干/贲门)
                    <div className="text-[10px] font-normal">两野/三野均标准清扫</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：转移与分期实时看板 (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* 阳性淋巴结选择 */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  转移阳性淋巴结枚数 (N 分期)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { count: 0, label: "0枚 (N0)" },
                    { count: 1, label: "1~2枚 (N1)" },
                    { count: 4, label: "3~6枚 (N2)" },
                    { count: 8, label: "≥7枚 (N3)" },
                  ].map(item => (
                    <button
                      key={item.count}
                      type="button"
                      onClick={() => setPositiveNodes(item.count)}
                      className={`py-2 px-1 rounded-lg border text-center text-xs transition-all ${
                        (item.count === 0 && positiveNodes === 0) ||
                        (item.count === 1 && positiveNodes >= 1 && positiveNodes <= 2) ||
                        (item.count === 4 && positiveNodes >= 3 && positiveNodes <= 6) ||
                        (item.count === 8 && positiveNodes >= 7)
                          ? "border-purple-600 bg-purple-50 text-purple-700 font-bold ring-1 ring-purple-500"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 远处转移 M1 切换 */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-xs font-medium text-slate-700">
                  是否存在远处器官转移 (肺/肝/骨/腹膜 M1)
                </span>
                <button
                  type="button"
                  onClick={() => setHasM1(!hasM1)}
                  className={`text-xs px-3 py-1 rounded font-semibold transition-all ${
                    hasM1 ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {hasM1 ? "M1 (有转移)" : "M0 (无转移)"}
                </button>
              </div>

              {/* 实时综合分期结论卡 */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-4 text-white space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-purple-200">AJCC 8th ESCC 综合推演分期</span>
                  <span className="text-2xl font-black tracking-tight">{calcStage} 期</span>
                </div>
                <div className="text-xs font-mono text-purple-100 flex items-center gap-2">
                  <span>{tumorDepth.toUpperCase()}</span>
                  <span>•</span>
                  <span>{nStage}</span>
                  <span>•</span>
                  <span>{hasM1 ? "M1" : "M0"}</span>
                  <span>•</span>
                  <span>{differentiation}</span>
                </div>
                <p className="text-xs text-purple-100/90 leading-relaxed pt-1 border-t border-purple-400/30">
                  {stageDetails}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部指南循证背书 */}
      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>质控标准：AJCC 第 8 版食管鳞癌病理分期 · CSCO 食管癌 2024 · 淋巴结清扫基线 ≥15 枚</span>
        </div>
        <span className="text-purple-600 font-medium">中国原研高发专科循证</span>
      </div>
    </div>
  );
}
