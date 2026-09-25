"use client";

import React, { useState } from "react";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  ShieldCheck, 
  Crosshair,
  Sliders,
  Zap,
  Target
} from "lucide-react";

export function ThyroidTiradsUltrasoundVisual() {
  const [activeTab, setActiveTab] = useState<"calculator" | "fna_decision">("calculator");

  // C-TIRADS 关键恶性征象选择
  const [composition, setComposition] = useState<"cystic" | "spongiform" | "mixed" | "solid">("solid");
  const [echogenicity, setEchogenicity] = useState<"anechoic" | "iso_hyper" | "hypo" | "markedly_hypo">("hypo");
  const [aspectRatio, setAspectRatio] = useState<"wider" | "taller">("wider"); // 纵横比：横向 vs 纵向 (≥1)
  const [margin, setMargin] = useState<"smooth" | "irregular" | "microlobulated" | "extrathyroidal">("irregular");
  const [microcalc, setMicrocalc] = useState<"none" | "macro" | "micro">("micro");
  const [cometTail, setCometTail] = useState<boolean>(false);

  // 结节解剖与大小
  const [noduleSizeMm, setNoduleSizeMm] = useState<number>(12);
  const [isNearCapsuleOrTrachea, setIsNearCapsuleOrTrachea] = useState<boolean>(false);
  const [hasAbnormalLymphNodes, setHasAbnormalLymphNodes] = useState<boolean>(false);

  // C-TIRADS 中国版评分标准计算:
  // 恶性征象各计 1 项计数:
  // 1. 实性 (+1)
  // 2. 低回声/极低回声 (+1)
  // 3. 垂直位/纵横比≥1 (+1)
  // 4. 不规则/微小叶边缘/甲状腺外侵 (+1)
  // 5. 微钙化 (+1)
  // 良性征象减项:
  // - 囊性/海绵样 (-1)
  // - 彗星尾伪像 (-1)
  let score = 0;
  if (composition === "solid") score += 1;
  if (composition === "cystic" || composition === "spongiform") score -= 1;
  if (echogenicity === "hypo" || echogenicity === "markedly_hypo") score += 1;
  if (echogenicity === "anechoic") score -= 1;
  if (aspectRatio === "taller") score += 1;
  if (margin !== "smooth") score += 1;
  if (microcalc === "micro") score += 1;
  if (cometTail) score -= 1;

  // C-TIRADS 分类推算
  let tiradsCategory = "4A";
  let malignancyRisk = "2% ~ 10%";
  let riskLevel = "low"; // low, medium, high, benign

  if (score <= -1) {
    tiradsCategory = "2 类";
    malignancyRisk = "≈ 0% (良性)";
    riskLevel = "benign";
  } else if (score === 0) {
    tiradsCategory = "3 类";
    malignancyRisk = "< 2% (极可能良性)";
    riskLevel = "benign";
  } else if (score === 1) {
    tiradsCategory = "4A 类";
    malignancyRisk = "2% ~ 10% (低度恶性)";
    riskLevel = "low";
  } else if (score === 2) {
    tiradsCategory = "4B 类";
    malignancyRisk = "10% ~ 50% (中度恶性)";
    riskLevel = "medium";
  } else if (score === 3 || score === 4) {
    tiradsCategory = "4C 类";
    malignancyRisk = "50% ~ 90% (高度恶性)";
    riskLevel = "high";
  } else {
    tiradsCategory = "5 类";
    malignancyRisk = "> 90% (极高度恶性)";
    riskLevel = "high";
  }

  // FNA 细针穿刺活检决策依据 (根据中国超声医学工程学会与 ATA/CSCO 指南)
  let fnaRecommendation = "";
  let fnaBadgeColor = "";
  if (hasAbnormalLymphNodes) {
    fnaRecommendation = "【紧急建议 FNA】存在可疑区域淋巴结肿大或微钙化！无论原发灶大小，均应立即对淋巴结及原发灶进行 FNA + 洗脱液 Tg (Tg-FNA) 检测。";
    fnaBadgeColor = "bg-rose-50 text-rose-700 border-rose-200";
  } else if (score <= 0) {
    fnaRecommendation = "【暂无须 FNA 穿刺】良性或极低度恶性征象。一般无需穿刺，建议每 12~24 个月复查常规颈部超声即可。";
    fnaBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (score === 1) { // 4A
    if (noduleSizeMm >= 15) {
      fnaRecommendation = "【建议常规 FNA 穿刺】结节最大径 ≥ 15mm 且为 4A 类，推荐行超声引导下细针穿刺细胞学活检以明确良恶性。";
      fnaBadgeColor = "bg-amber-50 text-amber-700 border-amber-200";
    } else {
      fnaRecommendation = "【密切超声随访】结节 < 15mm，恶性概率低 (2~10%)。建议每 6~12 个月复查颈部超声，观察生长速度。";
      fnaBadgeColor = "bg-blue-50 text-blue-700 border-blue-200";
    }
  } else { // 4B, 4C, 5
    if (noduleSizeMm > 10) {
      fnaRecommendation = "【高度推荐 FNA 细针穿刺】结节 > 10mm 且恶性风险明显增高。穿刺不仅可确诊乳头状癌/滤泡性病变，还可同步进行 BRAF V600E / TERT / RET 基因联合检测指导手术方案。";
      fnaBadgeColor = "bg-rose-50 text-rose-700 border-rose-200";
    } else { // <= 10mm PTMC (微小癌区间)
      if (isNearCapsuleOrTrachea) {
        fnaRecommendation = "【推荐积极穿刺或手术干预】结节虽 ≤ 10mm (PTMC)，但紧邻包膜外侵犯、气管或喉返神经走行危险区！不宜盲目消融或单纯等待，建议穿刺或评估微创手术。";
        fnaBadgeColor = "bg-rose-50 text-rose-700 border-rose-200";
      } else {
        fnaRecommendation = "【可选择主动监测 (Active Surveillance)】低危 PTMC (≤10mm 且无被膜侵犯/淋巴结转移)。可与专科医师充分沟通，选择每 6 个月随访的主动监测策略，免除过度治疗。";
        fnaBadgeColor = "bg-purple-50 text-purple-700 border-purple-200";
      }
    }
  }

  return (
    <div className="rounded-xl border border-teal-200 bg-white overflow-hidden shadow-sm my-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-50 px-5 py-4 border-b border-teal-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500 text-white shadow-xs">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              甲状腺超声 C-TIRADS 恶性风险分级与穿刺决策仿真器
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                CSCO / 中国超声医学指南
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              直观模拟结节超声 5 大恶性特征计数与细针抽吸 (FNA) 活检指征
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("calculator")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "calculator"
                ? "bg-white text-teal-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            恶性征象推演
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fna_decision")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              activeTab === "fna_decision"
                ? "bg-white text-teal-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            FNA 穿刺 / 随访决策
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Core Result Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block mb-1">C-TIRADS 分类评估</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black ${
                riskLevel === 'benign' ? 'text-emerald-600' :
                riskLevel === 'low' ? 'text-blue-600' :
                riskLevel === 'medium' ? 'text-amber-600' :
                'text-rose-600'
              }`}>
                C-TIRADS {tiradsCategory}
              </span>
              <span className="text-xs text-slate-500">
                (净评分: {score > 0 ? `+${score}` : score} 分)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              预估恶性率: <span className="font-semibold text-slate-700">{malignancyRisk}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block mb-1">结节几何大小与状态</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">
                {noduleSizeMm} mm
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                {noduleSizeMm <= 10 ? "微小结节 (≤1cm)" : "常规结节 (>1cm)"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
              <span>解剖危险位:</span>
              {isNearCapsuleOrTrachea ? (
                <span className="text-amber-600 font-semibold inline-flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>紧邻被膜/喉返神经</span>
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>腺体实质内部 safe zone</span>
                </span>
              )}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-500 block mb-1">区域淋巴结状况</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-base font-bold ${hasAbnormalLymphNodes ? "text-rose-600" : "text-emerald-600"}`}>
                {hasAbnormalLymphNodes ? "疑似淋巴结转移" : "未见异常淋巴结"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {hasAbnormalLymphNodes ? "IV/VI区见微钙化或囊性变" : "皮髓质分界清晰，门样血流"}
            </p>
          </div>
        </div>

        {/* Clinical Action Recommendation Box */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${fnaBadgeColor}`}>
          <Target className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-sm block mb-1">循证诊疗策略指引:</span>
            {fnaRecommendation}
          </div>
        </div>

        {/* Tab 1: Ultrasound Features Calculator */}
        {activeTab === "calculator" && (
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              调整超声报告中的影像征象参数:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* 结构 */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                <label className="font-semibold text-slate-700 block mb-2">
                  1. 内部结构 (Composition)
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: "solid", label: "实性 (Solid) [+1分]" },
                    { id: "mixed", label: "囊实混合性 (0分)" },
                    { id: "spongiform", label: "海绵样蜂窝状 [-1分]" },
                    { id: "cystic", label: "纯囊性 [-1分]" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setComposition(item.id as any)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                        composition === item.id 
                          ? "bg-teal-600 text-white font-medium" 
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 回声 */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                <label className="font-semibold text-slate-700 block mb-2">
                  2. 回声水平 (Echogenicity)
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: "markedly_hypo", label: "极低回声 (低于带状肌) [+1分]" },
                    { id: "hypo", label: "低回声 (低于甲状腺实质) [+1分]" },
                    { id: "iso_hyper", label: "等回声 / 高回声 (0分)" },
                    { id: "anechoic", label: "无回声 [-1分]" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEchogenicity(item.id as any)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                        echogenicity === item.id 
                          ? "bg-teal-600 text-white font-medium" 
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 纵横比 */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                <label className="font-semibold text-slate-700 block mb-2">
                  3. 纵横比 / 生长方向 (Orientation)
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: "taller", label: "垂直位 (纵横比高>宽 ≥ 1) [+1分]" },
                    { id: "wider", label: "水平位 (宽>高，扁平生长) (0分)" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAspectRatio(item.id as any)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                        aspectRatio === item.id 
                          ? "bg-teal-600 text-white font-medium" 
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 边缘 */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                <label className="font-semibold text-slate-700 block mb-2">
                  4. 边缘轮廓 (Margin)
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: "irregular", label: "不规则边缘 (Irregular) [+1分]" },
                    { id: "microlobulated", label: "微小叶分叶状 [+1分]" },
                    { id: "extrathyroidal", label: "甲状腺被膜外浸润侵犯 [+1分]" },
                    { id: "smooth", label: "光整光滑 (0分)" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMargin(item.id as any)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                        margin === item.id 
                          ? "bg-teal-600 text-white font-medium" 
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 钙化 */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                <label className="font-semibold text-slate-700 block mb-2">
                  5. 局灶强回声 / 钙化 (Calcification)
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: "micro", label: "点状微钙化 (砂粒样 ≤1mm) [+1分]" },
                    { id: "macro", label: "粗大钙化 / 环状周边钙化 (0分)" },
                    { id: "none", label: "无任何钙化灶 (0分)" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMicrocalc(item.id as any)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors ${
                        microcalc === item.id 
                          ? "bg-teal-600 text-white font-medium" 
                          : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 保护性征象 */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    6. 特征性良性彗星尾伪像
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={cometTail}
                      onChange={(e) => setCometTail(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <span className="text-xs text-slate-600">
                      见明显胶质浓缩彗星尾 [-1分]
                    </span>
                  </label>
                </div>
                <p className="text-2xs text-slate-400 mt-2">
                  * 彗星尾是胶质结节的标志性良性物理反射
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: FNA Decision & Size Factors */}
        {activeTab === "fna_decision" && (
          <div className="space-y-5 pt-2">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-teal-600" />
              结节几何尺寸与解剖高危部位调节:
            </h4>

            {/* Slider for size */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-700">
                  结节最大长径 (Longest Diameter):
                </span>
                <span className="text-sm font-black text-teal-700">
                  {noduleSizeMm} mm ({ (noduleSizeMm / 10).toFixed(1) } cm)
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                step="1"
                value={noduleSizeMm}
                onChange={(e) => setNoduleSizeMm(Number(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-2xs text-slate-400 mt-1">
                <span>2 mm (极小结节)</span>
                <span>10 mm (PTMC微小癌红线)</span>
                <span>15 mm (4A穿刺阈值)</span>
                <span>40 mm (压迫手术指征)</span>
              </div>
            </div>

            {/* Anatomical Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="p-3 rounded-lg border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-50:bg-slate-800/60">
                <input
                  type="checkbox"
                  checked={isNearCapsuleOrTrachea}
                  onChange={(e) => setIsNearCapsuleOrTrachea(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-slate-700 block">
                    紧邻被膜 / 气管 / 喉返神经走行区
                  </span>
                  <span className="text-2xs text-slate-500">
                    即使 ≤10mm 微小癌，也易突破被膜浸润神经气管，不适合主动监测
                  </span>
                </div>
              </label>

              <label className="p-3 rounded-lg border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-50:bg-slate-800/60">
                <input
                  type="checkbox"
                  checked={hasAbnormalLymphNodes}
                  onChange={(e) => setHasAbnormalLymphNodes(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <div>
                  <span className="font-semibold text-rose-700 block">
                    颈部侧颈或中央区可疑淋巴结
                  </span>
                  <span className="text-2xs text-slate-500">
                    伴有点状微钙化、囊性变或极度圆钝，强制触发穿刺与手术规划
                  </span>
                </div>
              </label>
            </div>

            {/* Guideline Comparison Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 text-2xs">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">C-TIRADS 分类</th>
                    <th className="px-3 py-2 text-left font-semibold">恶性概率</th>
                    <th className="px-3 py-2 text-left font-semibold">FNA 活检推荐门槛</th>
                    <th className="px-3 py-2 text-left font-semibold">随访推荐</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr className={score <= -1 ? "bg-teal-50 font-semibold" : ""}>
                    <td className="px-3 py-2">2 类 (良性)</td>
                    <td className="px-3 py-2">≈ 0%</td>
                    <td className="px-3 py-2">无需穿刺</td>
                    <td className="px-3 py-2">每 24 个月常规复查</td>
                  </tr>
                  <tr className={score === 0 ? "bg-teal-50 font-semibold" : ""}>
                    <td className="px-3 py-2">3 类 (可能良性)</td>
                    <td className="px-3 py-2">&lt; 2%</td>
                    <td className="px-3 py-2">&gt; 20mm (或伴压迫)</td>
                    <td className="px-3 py-2">每 12~18 个月复查</td>
                  </tr>
                  <tr className={score === 1 ? "bg-teal-50 font-semibold" : ""}>
                    <td className="px-3 py-2">4A 类 (低度恶性)</td>
                    <td className="px-3 py-2">2% ~ 10%</td>
                    <td className="px-3 py-2">&gt; 15mm</td>
                    <td className="px-3 py-2">每 6~12 个月复查</td>
                  </tr>
                  <tr className={score === 2 ? "bg-teal-50 font-semibold" : ""}>
                    <td className="px-3 py-2">4B 类 (中度恶性)</td>
                    <td className="px-3 py-2">10% ~ 50%</td>
                    <td className="px-3 py-2">&gt; 10mm</td>
                    <td className="px-3 py-2">尽快 FNA 确诊</td>
                  </tr>
                  <tr className={score >= 3 ? "bg-teal-50 font-semibold" : ""}>
                    <td className="px-3 py-2">4C ~ 5 类 (高危)</td>
                    <td className="px-3 py-2">&gt; 50% ~ 90%+</td>
                    <td className="px-3 py-2">&gt; 10mm (或高危微小癌)</td>
                    <td className="px-3 py-2">积极评估手术切除</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clinical Guideline Footnote */}
        <div className="pt-3 border-t border-slate-200 flex items-start gap-2 text-2xs text-slate-500">
          <Info className="w-3.5 h-3.5 shrink-0 text-teal-600 mt-0.5" />
          <span>
            参考文献：中国超声医学工程学会 (C-TIRADS) 浅表器官专业委员会指南 · 中华医学会肿瘤学分会甲状腺癌诊疗指南 (2024版) · ATA 2024 Management Guidelines for Thyroid Nodules.
          </span>
        </div>
      </div>
    </div>
  );
}
