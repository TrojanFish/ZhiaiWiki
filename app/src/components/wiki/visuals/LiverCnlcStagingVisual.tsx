"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, Activity, CheckCircle2, Info, Layers, Crosshair, HeartPulse, Stethoscope, Check, X } from "lucide-react";

export function LiverCnlcStagingVisual() {
  const [activeTab, setActiveTab] = useState<"cnlc" | "reserve">("cnlc");

  // CNLC 模拟参数
  const [tumorSize, setTumorSize] = useState<number>(3.5); // cm
  const [tumorCount, setTumorCount] = useState<"single" | "2-3" | "multiple_ge4">("single");
  const [vascularInvasion, setVascularInvasion] = useState<"none" | "vp1_vp2" | "vp3_vp4" | "ivc">("none");
  const [hasMetastasis, setHasMetastasis] = useState<boolean>(false);
  const [childPughGrade, setChildPughGrade] = useState<"A" | "B" | "C">("A");
  const [albiScore, setAlbiScore] = useState<number>(-2.75); // -3.20 ~ -0.80

  // 储备功能五项评分器
  const [bilirubin, setBilirubin] = useState<number>(22); // umol/L
  const [albumin, setAlbumin] = useState<number>(38); // g/L
  const [inr, setInr] = useState<number>(1.1);
  const [ascites, setAscites] = useState<"none" | "mild" | "moderate_severe">("none");
  const [encephalopathy, setEncephalopathy] = useState<"none" | "grade_1_2" | "grade_3_4">("none");

  // 计算 Child-Pugh 分数
  let cpCalcScore = 0;
  if (bilirubin < 34) cpCalcScore += 1;
  else if (bilirubin <= 51) cpCalcScore += 2;
  else cpCalcScore += 3;

  if (albumin > 35) cpCalcScore += 1;
  else if (albumin >= 28) cpCalcScore += 2;
  else cpCalcScore += 3;

  if (inr < 1.7) cpCalcScore += 1;
  else if (inr <= 2.3) cpCalcScore += 2;
  else cpCalcScore += 3;

  if (ascites === "none") cpCalcScore += 1;
  else if (ascites === "mild") cpCalcScore += 2;
  else cpCalcScore += 3;

  if (encephalopathy === "none") cpCalcScore += 1;
  else if (encephalopathy === "grade_1_2") cpCalcScore += 2;
  else cpCalcScore += 3;

  const cpCalcGrade = cpCalcScore <= 6 ? "A" : cpCalcScore <= 9 ? "B" : "C";

  // 计算 ALBI 连续分级
  const rawAlbiCalc = Math.round((Math.log10(Math.max(1, bilirubin)) * 0.66 + albumin * -0.0852) * 100) / 100;
  const albiGradeCalc = rawAlbiCalc <= -2.60 ? "1" : rawAlbiCalc <= -1.39 ? "2" : "3";

  // 推导 CNLC 2024 分期
  let cnlcStage = "Ia";
  const hasVasc = vascularInvasion !== "none";

  if (childPughGrade === "C") {
    cnlcStage = "IV";
  } else if (hasMetastasis) {
    cnlcStage = "IIIb";
  } else if (hasVasc) {
    cnlcStage = "IIIa";
  } else if (tumorCount === "multiple_ge4") {
    cnlcStage = "IIb";
  } else if (tumorCount === "2-3") {
    cnlcStage = tumorSize > 3.0 ? "IIa" : "Ib";
  } else {
    // 单发
    cnlcStage = tumorSize > 5.0 ? "Ib" : "Ia";
  }

  // 米兰标准判定 (Milan Criteria)
  const isMilanEligible = !hasVasc && !hasMetastasis && (
    (tumorCount === "single" && tumorSize <= 5.0) ||
    (tumorCount === "2-3" && tumorSize <= 3.0)
  );

  // 推荐临床战术
  const getStageRecommendation = (stage: string) => {
    switch (stage) {
      case "Ia":
        return {
          title: "根治性切除 / 局部消融 (RFA/MWA)",
          highlight: "5年生存率 65%~70%，根治治愈窗口期",
          therapy: "首选腹腔镜或解剖性肝切除；对于高龄、心肺功能欠佳或病灶深在者，超声引导下微波/射频消融具有同等根治力。若伴肝硬化失代偿可优先评估米兰标准肝移植。",
          color: "emerald"
        };
      case "Ib":
        return {
          title: "手术切除优先 / 术前FLR体积评估",
          highlight: "规范手术切除后 5年生存率 50%~60%",
          therapy: "首选外科根治性肝切除；术前严格经三维CT测算剩余肝体积 (FLR) 与 ICG-R15 确保防肝衰；术后评估微血管侵犯 (MVI) 决定是否辅助 TACE。",
          color: "teal"
        };
      case "IIa":
        return {
          title: "手术切除为主 / 联合局部消融与TACE",
          highlight: "多学科 MDT 协作切除或介入降期",
          therapy: "MDT 评估是否能一次切除 2~3 个病灶；若分布于双叶，可采取手术切除大病灶联合对侧消融，或行选择性 TACE 控制进展。",
          color: "blue"
        };
      case "IIb":
        return {
          title: "TACE 栓塞 / 中国特色 HAIC-FO 持续灌注",
          highlight: "阻断肿瘤动脉血供，争取降期手术机会",
          therapy: "首选经导管动脉化疗栓塞 (TACE) 或联合 HAIC 灌注化疗；可协同靶免系统治疗（阿替利珠+贝伐 / 仑伐替尼），延缓肝内扩散。",
          color: "indigo"
        };
      case "IIIa":
        return {
          title: "中国原创突破：HAIC-FO 灌注化疗 + 靶免联合转化",
          highlight: "大血管癌栓客观缓解率 >50%，转化切除率达 20%~30%",
          therapy: "首选经股动脉留置微导管行 HAIC-FO (奥沙利铂+5-FU) 持续灌注联合 T+A 或双达靶免方案；联合术前立体定向放疗 (SBRT)，一旦门脉癌栓退缩至二级分支以内且肝储备良好，积极实施转化根治手术！",
          color: "purple"
        };
      case "IIIb":
        return {
          title: "一线靶免双药联合系统治疗 (T+A / 双达方案)",
          highlight: "IMbrave150 / ORIENT-32 中位总生存达 19.2 个月",
          therapy: "首选阿替利珠单抗+贝伐珠单抗 (T+A) 或中国信迪利单抗+贝伐类似物 (双达)；备选口服小分子靶向药（仑伐替尼/多纳非尼）。【安全铁律】：用药前必须行胃镜筛查并预防性结扎重度食管胃底静脉曲张防大出血！",
          color: "amber"
        };
      case "IV":
      default:
        return {
          title: "最佳支持治疗 (BSC) 与护肝利尿",
          highlight: "肝功能失代偿期，严禁盲目化疗及大手术",
          therapy: "肝脏储备耗竭 (Child-Pugh C 级)，重点纠正低蛋白、利尿消除顽固腹水、乳果糖/门冬氨酸鸟氨酸预防肝性脑病，镇痛关怀提高生活质量。",
          color: "rose"
        };
    }
  };

  const rec = getStageRecommendation(cnlcStage);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden my-6">
      {/* 顶部标题与选项卡 */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                CNLC 2024 · 国家指南标准
              </span>
              <span className="bg-emerald-400/30 text-emerald-100 text-xs px-2 py-0.5 rounded-full">
                双核储备量化
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mt-1.5 flex items-center gap-2">
              原发性肝癌 (HCC) 临床分期与储备决策模拟器
            </h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm mt-1">
              模拟肿瘤大小、血管侵犯与肝功能（Child-Pugh/ALBI），实时推演 CNLC Ia~IV 期决策树
            </p>
          </div>

          <div className="flex bg-black/20 p-1 rounded-xl backdrop-blur-sm self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("cnlc")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "cnlc" ? "bg-white text-emerald-900 shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              CNLC 分期模拟
            </button>
            <button
              onClick={() => setActiveTab("reserve")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "reserve" ? "bg-white text-emerald-900 shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              肝储备计算器 (C-P / ALBI)
            </button>
          </div>
        </div>
      </div>

      {activeTab === "cnlc" ? (
        <div className="p-5 sm:p-6 space-y-6">
          {/* 上半部：交互控制面板与肝脏解剖矢量图 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 左侧控制栏 (7列) */}
            <div className="lg:col-span-7 space-y-4">
              {/* 1. 肿瘤大小 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
                    肿瘤最大长径: <span className="text-emerald-600 font-extrabold text-sm">{tumorSize} cm</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {tumorSize <= 3.0 ? "≤3cm 小肝癌" : tumorSize <= 5.0 ? "≤5cm 早期临界" : "巨块型浸润倾向"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="14.0"
                  step="0.5"
                  value={tumorSize}
                  onChange={(e) => setTumorSize(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1.0 cm (微小)</span>
                  <span className="text-emerald-600 font-semibold">3.0 cm (消融线)</span>
                  <span className="text-teal-600 font-semibold">5.0 cm (米兰线)</span>
                  <span>14.0 cm (巨块)</span>
                </div>
              </div>

              {/* 2. 肿瘤数目 */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  肿瘤病灶数目分布:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "single", label: "单发孤立病灶", sub: "占位局限" },
                    { id: "2-3", label: "2 ~ 3 个病灶", sub: "寡病灶多发" },
                    { id: "multiple_ge4", label: "≥ 4 个多发病灶", sub: "广泛弥漫分布" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setTumorCount(item.id as any)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        tumorCount === item.id
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. 血管侵犯 (门脉癌栓) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center justify-between">
                  <span>血管侵犯与大血管癌栓 (极其关键指标):</span>
                  {hasVasc && (
                    <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold">
                      CNLC IIIa 期转化指征
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "none", label: "无肉眼血管侵犯", sub: "正常血流" },
                    { id: "vp1_vp2", label: "门静脉分支癌栓", sub: "VP1 / VP2 级" },
                    { id: "vp3_vp4", label: "门静脉主干癌栓", sub: "VP3 / VP4 级" },
                    { id: "ivc", label: "下腔静脉/肝静脉", sub: "大静脉受累" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setVascularInvasion(item.id as any)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        vascularInvasion === item.id
                          ? "bg-rose-50 border-rose-500 text-rose-900 shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. 远处转移与肝功能 Child-Pugh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    肝外远处转移 (M 分期):
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHasMetastasis(false)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        !hasMetastasis
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      无转移 (M0)
                    </button>
                    <button
                      onClick={() => setHasMetastasis(true)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        hasMetastasis
                          ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      伴肺/骨/淋巴转移 (M1)
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Child-Pugh 肝功能分级:
                  </label>
                  <div className="flex gap-1.5">
                    {[
                      { id: "A", label: "A 级", sub: "良好代偿" },
                      { id: "B", label: "B 级", sub: "中度受损" },
                      { id: "C", label: "C 级", sub: "失代偿" }
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setChildPughGrade(g.id as any)}
                        className={`flex-1 py-1 text-center rounded-lg border transition-all ${
                          childPughGrade === g.id
                            ? g.id === "A"
                              ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                              : g.id === "B"
                              ? "bg-amber-500 text-white border-amber-500 font-bold"
                              : "bg-rose-600 text-white border-rose-600 font-bold"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="text-xs">{g.label}</div>
                        <div className="text-[9px] opacity-80">{g.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：解剖与癌栓矢量透视图 (5列) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    肝脏解剖脉管与病灶透视
                  </span>
                  <span className="text-[10px] text-slate-400">门静脉与肝实质</span>
                </div>

                {/* SVG 肝脏解剖模型 */}
                <div className="relative w-full aspect-[4/3] bg-slate-950/60 rounded-lg p-2 flex items-center justify-center overflow-hidden border border-slate-800/80">
                  <svg viewBox="0 0 320 240" className="w-full h-full">
                    {/* 正常肝脏外形轮廓 */}
                    <path
                      d="M 40 100 C 50 40, 180 30, 270 60 C 290 90, 290 150, 240 190 C 180 210, 110 200, 70 170 C 40 150, 35 120, 40 100 Z"
                      fill="#78350f"
                      fillOpacity="0.3"
                      stroke="#d97706"
                      strokeWidth="2.5"
                      strokeDasharray="none"
                    />

                    {/* 门静脉系统主干与左右分支 (蓝紫色) */}
                    <path
                      d="M 160 210 L 160 140 L 110 100 M 160 140 L 220 90"
                      stroke="#38bdf8"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                    <path
                      d="M 110 100 L 70 80 M 110 100 L 90 60 M 220 90 L 250 80 M 220 90 L 230 60"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* 门静脉癌栓高亮 (若开启) */}
                    {hasVasc && (
                      <g>
                        <circle
                          cx={vascularInvasion === "vp3_vp4" ? "160" : "200"}
                          cy={vascularInvasion === "vp3_vp4" ? "145" : "98"}
                          r="11"
                          fill="#ef4444"
                          className="animate-pulse"
                        />
                        <text
                          x={vascularInvasion === "vp3_vp4" ? "160" : "200"}
                          y={vascularInvasion === "vp3_vp4" ? "149" : "102"}
                          fill="white"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          癌栓
                        </text>
                      </g>
                    )}

                    {/* 肿瘤病灶实时渲染 */}
                    {/* 主病灶 */}
                    <circle
                      cx="210"
                      cy="130"
                      r={Math.min(38, Math.max(8, tumorSize * 3.5))}
                      fill="#ef4444"
                      fillOpacity="0.85"
                      stroke="#fca5a5"
                      strokeWidth="2"
                    />
                    <text x="210" y="134" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {tumorSize}cm
                    </text>

                    {/* 伴随次病灶 (若选 2-3 个或多发) */}
                    {tumorCount !== "single" && (
                      <>
                        <circle cx="120" cy="85" r={Math.min(22, Math.max(7, tumorSize * 2.2))} fill="#ef4444" fillOpacity="0.75" stroke="#fca5a5" strokeWidth="1.5" />
                        <circle cx="245" cy="85" r={Math.min(18, Math.max(6, tumorSize * 1.8))} fill="#ef4444" fillOpacity="0.75" stroke="#fca5a5" strokeWidth="1.5" />
                      </>
                    )}
                    {tumorCount === "multiple_ge4" && (
                      <>
                        <circle cx="85" cy="130" r="10" fill="#dc2626" fillOpacity="0.8" />
                        <circle cx="160" cy="80" r="9" fill="#dc2626" fillOpacity="0.8" />
                        <circle cx="170" cy="180" r="8" fill="#dc2626" fillOpacity="0.8" />
                      </>
                    )}

                    {/* 标注标签 */}
                    <text x="50" y="55" fill="#94a3b8" fontSize="9">左半肝</text>
                    <text x="245" y="55" fill="#94a3b8" fontSize="9">右半肝</text>
                    <text x="160" y="225" fill="#38bdf8" fontSize="9" textAnchor="middle">门静脉主干入肝 (75%血供)</text>
                  </svg>
                </div>
              </div>

              {/* 底部实时状态胶囊 */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[11px]">
                <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">米兰标准 (肝移植)</span>
                  <span className={`font-bold inline-flex items-center justify-center gap-1 ${isMilanEligible ? "text-emerald-400" : "text-slate-500"}`}>
                    {isMilanEligible ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>符合米兰标准</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>超出米兰标准</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block text-[10px]">血管癌栓状态</span>
                  <span className={`font-bold inline-flex items-center justify-center gap-1 ${hasVasc ? "text-rose-400" : "text-emerald-400"}`}>
                    {hasVasc ? (
                      <>
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>大血管浸润</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>脉管通畅良好</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 下半部：动态决策大卡片 */}
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl">
                  {cnlcStage}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-400">
                      国家指南 CNLC 2024 判定
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      Child-Pugh {childPughGrade} 级
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {rec.title}
                  </div>
                </div>
              </div>

              <div className="text-xs text-right sm:self-center">
                <span className="text-emerald-400 font-bold block">{rec.highlight}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {rec.therapy}
            </p>
          </div>
        </div>
      ) : (
        /* Tab 2: 肝功能储备计算器 (Child-Pugh 与 ALBI 双核) */
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 左侧：五项交互输入 (7列) */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Child-Pugh 五项关键生理生化指标输入
              </div>

              {/* 1. 总胆红素 */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>总胆红素 (Total Bilirubin):</span>
                  <span className="text-emerald-600 font-extrabold">{bilirubin} μmol/L</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="1"
                  value={bilirubin}
                  onChange={(e) => setBilirubin(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>&lt;34 (1分: 正常)</span>
                  <span>34~51 (2分: 轻度黄疸)</span>
                  <span>&gt;51 (3分: 严重黄疸)</span>
                </div>
              </div>

              {/* 2. 血清白蛋白 */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>血清白蛋白 (Albumin):</span>
                  <span className="text-emerald-600 font-extrabold">{albumin} g/L</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="50"
                  step="1"
                  value={albumin}
                  onChange={(e) => setAlbumin(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>&lt;28 (3分: 重度低蛋白)</span>
                  <span>28~35 (2分: 中度)</span>
                  <span>&gt;35 (1分: 良好储备)</span>
                </div>
              </div>

              {/* 3. INR 凝血时间 */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>凝血酶原时间国际比值 (INR):</span>
                  <span className="text-emerald-600 font-extrabold">{inr}</span>
                </div>
                <input
                  type="range"
                  min="0.9"
                  max="3.0"
                  step="0.1"
                  value={inr}
                  onChange={(e) => setInr(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>&lt;1.7 (1分)</span>
                  <span>1.7~2.3 (2分)</span>
                  <span>&gt;2.3 (3分: 凝血重度障碍)</span>
                </div>
              </div>

              {/* 4. 腹水与脑病单选 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1">腹水程度:</label>
                  <div className="flex gap-1 text-xs">
                    {(["none", "mild", "moderate_severe"] as const).map((a) => (
                      <button
                        key={a}
                        onClick={() => setAscites(a)}
                        className={`flex-1 py-1 rounded text-[11px] font-semibold border ${
                          ascites === a ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {a === "none" ? "无 (1分)" : a === "mild" ? "轻量 (2分)" : "中重 (3分)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block mb-1">肝性脑病:</label>
                  <div className="flex gap-1 text-xs">
                    {(["none", "grade_1_2", "grade_3_4"] as const).map((h) => (
                      <button
                        key={h}
                        onClick={() => setEncephalopathy(h)}
                        className={`flex-1 py-1 rounded text-[11px] font-semibold border ${
                          encephalopathy === h ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"
                        }`}
                      >
                        {h === "none" ? "无 (1分)" : h === "grade_1_2" ? "1-2期 (2分)" : "3-4期 (3分)"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：双核结果卡片与手术安全红线 (5列) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Child-Pugh 结果卡 */}
              <div className={`p-4 rounded-xl border text-white ${
                cpCalcGrade === "A" ? "bg-emerald-800 border-emerald-700" : cpCalcGrade === "B" ? "bg-amber-800 border-amber-700" : "bg-rose-900 border-rose-800"
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold uppercase opacity-80">Child-Pugh 积分与分级</span>
                  <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                    总分 {cpCalcScore} 分
                  </span>
                </div>
                <div className="text-2xl font-black mt-1">
                  Child-Pugh {cpCalcGrade} 级
                </div>
                <p className="text-xs opacity-90 mt-1 leading-relaxed">
                  {cpCalcGrade === "A"
                    ? "良好代偿期：肝脏储备充沛，能够充分耐受半肝切除、广泛局部切除、TACE 及全量靶免联合治疗。"
                    : cpCalcGrade === "B"
                    ? "中度受损期：肝切除需极其严格审慎，通常仅限局部非解剖性小范围剜除或消融；优先保肝调优。"
                    : "终末失代偿期：大手术与常规 TACE 禁忌！盲目手术致死性肝衰竭风险极高，仅评估急诊肝移植或最佳对症支持。"}
                </p>
              </div>

              {/* ALBI 结果卡 */}
              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-emerald-400">客观数学量化 ALBI 分级</span>
                  <span className="text-xs text-slate-400">
                    评分值: {rawAlbiCalc}
                  </span>
                </div>
                <div className="text-xl font-bold text-white mt-0.5">
                  ALBI {albiGradeCalc} 级 ({albiGradeCalc === "1" ? "优良" : albiGradeCalc === "2" ? "中等" : "极差"})
                </div>
                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                  ALBI 完全摆脱腹水与脑病的主观打分偏差，纯粹依靠胆红素与白蛋白对数方程计算。临床证实 ALBI 1 级患者靶免治疗 OS 显著长于 2/3 级患者。
                </p>
              </div>

              {/* ICG-R15 手术切除安全范围准则 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ICG-R15 术前质控金标准
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li>• <strong className="text-slate-700">R15 &lt; 10%</strong>：允许行左半/右半肝大范围解剖性切除。</li>
                  <li>• <strong className="text-slate-700">R15 10%~20%</strong>：允许行单段或双段切除。</li>
                  <li>• <strong className="text-slate-700">R15 &gt; 20%</strong>：仅限边缘性局部剜除或微创射频消融。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
