"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, Activity, Pill, Zap, CheckCircle2, Info, Eye, Stethoscope, Droplet } from "lucide-react";

export function HccInterventionSystemicVisual() {
  const [activeTab, setActiveTab] = useState<"intervention" | "systemic">("intervention");
  const [interventionMode, setInterventionMode] = useState<"normal" | "tace" | "haic">("tace");
  const [showVaricesWarning, setShowVaricesWarning] = useState<boolean>(true);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden my-6">
      {/* 顶部横幅 */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                微创介入与靶免协同
              </span>
              <span className="bg-teal-400/30 text-teal-100 text-xs px-2 py-0.5 rounded-full">
                双重血供解密
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mt-1.5 flex items-center gap-2">
              TACE / HAIC 介入与靶免联合机制微课
            </h3>
            <p className="text-teal-100/80 text-xs sm:text-sm mt-1">
              透视正常肝与肝癌的血供差异，揭秘高浓度定点灌注栓塞与用药前胃镜安全防线
            </p>
          </div>

          <div className="flex bg-black/20 p-1 rounded-xl backdrop-blur-sm self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("intervention")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "intervention" ? "bg-white text-teal-900 shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              双重血供与介入 (TACE/HAIC)
            </button>
            <button
              onClick={() => setActiveTab("systemic")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "systemic" ? "bg-white text-teal-900 shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              靶免联合与胃镜筛查
            </button>
          </div>
        </div>
      </div>

      {activeTab === "intervention" ? (
        <div className="p-5 sm:p-6 space-y-6">
          {/* 模式选择按钮 */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                id: "normal",
                label: "肝脏天然双重血供",
                desc: "正常肝 75% 门静脉 vs 肝癌 90% 肝动脉",
                tag: "解剖基础"
              },
              {
                id: "tace",
                label: "TACE 栓塞化疗",
                desc: "超选择微导管注入碘化油与明胶微球",
                tag: "饿死肿瘤"
              },
              {
                id: "haic",
                label: "中国原创突破 HAIC-FO",
                desc: "经动脉留置泵持续灌注奥沙利铂+5-FU",
                tag: "攻坚癌栓"
              }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setInterventionMode(m.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  interventionMode === m.id
                    ? "bg-teal-50 border-teal-500 text-teal-950 shadow-xs ring-1 ring-teal-500/20"
                    : "bg-white border-slate-200 text-slate-700 hover:border-teal-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{m.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {m.tag}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {m.desc}
                </div>
              </button>
            ))}
          </div>

          {/* 核心 SVG 动态微血管灌注图 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-2 border-b border-slate-800/80 pb-1.5">
                <span className="font-semibold text-emerald-400">
                  微血管介入血流动态示意图
                </span>
                <span className="text-[10px]">
                  {interventionMode === "normal" ? "基线血供对比" : interventionMode === "tace" ? "碘化油栓塞中" : "持续 46 小时高浓度灌注中"}
                </span>
              </div>

              <svg viewBox="0 0 400 260" className="w-full h-auto">
                {/* 背景：正常肝小叶组织微环境 (淡红棕) */}
                <rect x="20" y="30" width="180" height="200" rx="14" fill="#3f1f08" fillOpacity="0.35" stroke="#78350f" strokeWidth="1.5" />
                <text x="110" y="55" fill="#fde68a" fontSize="11" fontWeight="bold" textAnchor="middle">
                  正常肝细胞与肝小叶
                </text>
                <text x="110" y="72" fill="#94a3b8" fontSize="9" textAnchor="middle">
                  门静脉供血 75% (富营养低压)
                </text>
                <text x="110" y="86" fill="#94a3b8" fontSize="9" textAnchor="middle">
                  肝动脉供血 25%
                </text>

                {/* 门静脉流入管 (粗蓝管) */}
                <path d="M 110 240 L 110 110" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" />
                <path d="M 110 130 L 60 110 M 110 110 L 160 105" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
                <text x="110" y="225" fill="#e0f2fe" fontSize="9" fontWeight="bold" textAnchor="middle">门静脉主供 (75%)</text>

                {/* 背景：肝癌恶性结节区 (暗红色带异常血管网) */}
                <rect x="220" y="30" width="160" height="200" rx="14" fill="#450a0a" fillOpacity="0.45" stroke="#b91c1c" strokeWidth="1.5" />
                <text x="300" y="55" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">
                  原发性肝癌组织 (HCC)
                </text>
                <text x="300" y="72" fill="#f87171" fontSize="9" textAnchor="middle">
                  肝动脉供血 &gt; 90% (异常高压滋养)
                </text>

                {/* 肝动脉流入管 (红管) */}
                <path d="M 300 240 L 300 120" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
                {/* 滋养肿瘤的扭曲毛细血管丛 */}
                <path d="M 300 120 C 260 100, 280 80, 270 95 M 300 110 C 340 100, 320 80, 345 95 M 300 100 L 300 85" stroke="#ef4444" strokeWidth="3" fill="none" />
                <text x="300" y="225" fill="#fee2e2" fontSize="9" fontWeight="bold" textAnchor="middle">肝动脉供血 (&gt;90%)</text>

                {/* 介入操作展现 */}
                {interventionMode === "tace" && (
                  <g>
                    {/* 微导管插入 */}
                    <path d="M 300 240 L 300 115" stroke="#e2e8f0" strokeWidth="2.5" strokeDasharray="3,2" />
                    {/* 碘化油栓塞颗粒 (金色小圆点阻断) */}
                    <circle cx="285" cy="95" r="4.5" fill="#fbbf24" />
                    <circle cx="315" cy="95" r="4.5" fill="#fbbf24" />
                    <circle cx="300" cy="110" r="5.5" fill="#f59e0b" />
                    <circle cx="300" cy="90" r="5" fill="#d97706" />
                    <circle cx="335" cy="90" r="4" fill="#fbbf24" />
                    {/* 缺血坏死标记 */}
                    <rect x="240" y="135" width="120" height="24" rx="4" fill="#1e293b" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1" />
                    <text x="300" y="151" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle">
                      动脉被封堵 · 肿瘤缺血坏死
                    </text>
                  </g>
                )}

                {interventionMode === "haic" && (
                  <g>
                    {/* 留置微导管与高浓度药水持续冲刷 */}
                    <path d="M 300 240 L 300 110" stroke="#38bdf8" strokeWidth="3" />
                    <circle cx="300" cy="110" r="6" fill="#38bdf8" className="animate-ping" />
                    {/* 药效弥散水波 */}
                    <circle cx="300" cy="95" r="28" fill="#06b6d4" fillOpacity="0.25" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="4,3" />
                    <rect x="235" y="140" width="130" height="24" rx="4" fill="#1e293b" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1" />
                    <text x="300" y="156" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">
                      奥沙利铂+5-FU 持续局部高浓度冲洗
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* 右侧解析面板 (5列) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-teal-800 flex items-center gap-1.5 mb-1.5">
                  <Info className="w-4 h-4 text-teal-600" />
                  为什么正常肝脏不会被栓塞破坏？
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  人体正常的肝实质拥有天然的<strong>“双重血供保险箱”</strong>：75% 的血流量由粗大的门静脉供给；而肝癌生长时为了快速摄取血氧，会疯狂分泌 VEGF 诱发异常的肝动脉新生血管，导致 90% 以上由肝动脉供养。微创介入正是精准利用这个解剖弱点，靶向打击动脉，正常肝组织依靠门静脉依然安然无恙！
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  TACE vs HAIC-FO 选型决策
                </h4>
                <ul className="text-xs text-emerald-900 space-y-2 leading-snug">
                  <li>
                    • <strong>结节多发但无大癌栓 (CNLC IIb)</strong>：首选 <strong>TACE</strong>，碘化油乳剂精准栓塞，阻断血管饿死肿瘤。
                  </li>
                  <li>
                    • <strong>巨块型 (≥7cm) 或合并门脉癌栓 (CNLC IIIa)</strong>：强烈首选 <strong>HAIC-FO</strong>，长程持续灌注使药物直接浸泡癌栓，避免大面积栓塞坏死导致肝衰竭。
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: 靶免联合与胃镜排雷安全防线 */
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 左侧：陆空协同靶免机理 (7列) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  一线双药协同基石
                </span>
                <h4 className="text-sm font-bold text-slate-800 mt-2">
                  “T+A”阿替利珠+贝伐 &amp; 中国自主原研“双达”信迪利+贝伐
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  传统化疗对肝癌敏感度极差，而单药靶向（索拉非尼）难以克服耐药。靶免联合是<strong>“破防+击杀”的陆空协同战术</strong>：
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> 贝伐珠单抗 (抗 VEGF)
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-normal">
                      使肿瘤扭曲异常的毛细血管网“正常化”，降低肿瘤内部极高的流体压力，为免疫 T 细胞打开巡逻大门。
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-purple-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> PD-1 / PD-L1 单抗
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-normal">
                      解除肿瘤表面施加给 T 细胞的“休眠手铐”，唤醒大批高亲和力杀伤细胞，在疏通后的血管网络中彻底绞杀肿瘤。
                    </div>
                  </div>
                </div>
              </div>

              {/* 获益临床数据展示 */}
              <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-xl">
                <div className="text-xs font-semibold text-teal-300">ORIENT-32 / IMbrave150 循证突破</div>
                <div className="grid grid-cols-3 gap-3 mt-2 text-center">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <div className="text-lg font-black text-white">19.2 月</div>
                    <div className="text-[10px] text-teal-200">中位总生存期 OS</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <div className="text-lg font-black text-white">43%</div>
                    <div className="text-[10px] text-teal-200">死亡风险显著降低</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <div className="text-lg font-black text-white">30% 左右</div>
                    <div className="text-[10px] text-teal-200">客观肿瘤缓解率 ORR</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：用药前“胃镜排雷”安全警示 (5列) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-300">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  用药前安全红线：必须先行胃镜排查静脉曲张！
                </div>
                <p className="text-xs text-rose-900 mt-2 leading-relaxed">
                  很多病友不理解为什么治肝癌医生非要查胃镜。中国大部分肝癌患者伴随肝硬化，门静脉压力极高，血液被迫倒灌到食管胃底，导致浅表静脉像<strong>“吹到极限随时会炸的气球”</strong>。
                </p>
                <div className="mt-3 p-3 bg-white/80 rounded-lg text-xs space-y-1.5 text-slate-700">
                  <div className="font-bold text-rose-700">
                    抗 VEGF 药物的出血双刃剑：
                  </div>
                  <div className="text-[11px] leading-snug">
                    贝伐珠单抗会抑制血管内皮自身修复。如果未做胃镜筛查就盲目用药，一旦曲张静脉破裂，将发生每分钟几百毫升的致死性大呕血！
                  </div>
                </div>

                <div className="mt-3 text-xs bg-rose-100 p-2.5 rounded-lg text-rose-900 font-semibold flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 shrink-0 text-rose-700" />
                  操作原则：胃镜发现重度静脉曲张者，先行内镜下套扎 (EVL) 或硬化剂止血，安全后再用靶免！
                </div>
              </div>

              {/* 每日血压与蛋白尿自测提示 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  居家自测守则
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div>• <strong>晨晚测血压</strong>：靶向药引发高血压发生率高，基线需控制在 &lt;140/90 mmHg。</div>
                  <div>• <strong>每 2 周验尿</strong>：监测蛋白尿排泄情况，预防抗血管性肾病。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
