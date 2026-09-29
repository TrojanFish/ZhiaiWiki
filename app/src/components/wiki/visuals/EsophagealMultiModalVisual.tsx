"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Utensils,
  Stethoscope,
  Pill,
  BedDouble
} from "lucide-react";

export function EsophagealMultiModalVisual() {
  const [activePathway, setActivePathway] = useState<"early_esd" | "neoadjuvant_ncrt" | "systemic_immunotherapy" | "postop_nutrition_care">("neoadjuvant_ncrt");
  const [ncrtRegimen, setNcrtRegimen] = useState<"NEOCRTEC5010" | "CROSS">("NEOCRTEC5010");
  const [pcrStatus, setPcrStatus] = useState<"pCR" | "non_pCR">("non_pCR");
  const [elevationAngle, setElevationAngle] = useState<number>(35); // 术后半卧位床头角度 0~45 度

  return (
    <div className="rounded-xl border border-indigo-200 bg-white overflow-hidden shadow-sm">
      {/* 顶部标题与多学科路径切换 */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 px-5 py-4 border-b border-indigo-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                食管鳞癌 MDT 全病程诊治与术后康复互动路径
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
                  前瞻循证队列
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                覆盖内镜微创 (ESD)、中国新辅助放化疗 (NEOCRTEC5010)、晚期一线免疫 (ESCORT-1st) 与术后抗反流造瘘营养
              </p>
            </div>
          </div>

          {/* 4阶段切换按钮 */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {[
              { id: "early_esd", label: "早期 ESD 微创" },
              { id: "neoadjuvant_ncrt", label: "局部进展 nCRT 质控" },
              { id: "systemic_immunotherapy", label: "晚期一线免疫联合" },
              { id: "postop_nutrition_care", label: "术后造瘘与抗反流" },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePathway(item.id as any)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activePathway === item.id
                    ? "bg-white text-indigo-700 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* 路径 1：早期内镜 ESD */}
        {activePathway === "early_esd" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  绝对适应证 (cT1a 黏膜内)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  局限于黏膜上皮层 (M1) 或固有层 (M2)，无淋巴结转移 (N0)。微创剥离后 5 年生存率超 95%，完全避免切除全胸胃！
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  相对适应证 (黏膜肌层 M3)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  病变浸润至黏膜肌层 (M3)，淋巴结转移率低 (约 5%~8%)。病理需切缘阴性且无脉管浸润，术后密切复查。
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  超出指征 (SM1 黏膜下层)
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  浸润黏膜下层深度 &gt;200μm，淋巴结转移风险剧增至 30%~40%，不可单行 ESD，必须追加微创根治性切除+清扫。
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <div>
                <strong>核心获益点：</strong>
                体表无任何手术切口，保留患者自身消化道生理蠕动，术后第 2 天即可下床饮水，最大化维护生活品质。
              </div>
              <span className="font-mono font-bold text-emerald-600 text-sm">5-Yr CSS 95.2%</span>
            </div>
          </div>
        )}

        {/* 路径 2：局部进展期新辅助放化疗 (NEOCRTEC5010) */}
        {activePathway === "neoadjuvant_ncrt" && (
          <div className="space-y-5">
            {/* 方案选择与病理缓解切换 */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">术前放化疗方案：</span>
                <button
                  type="button"
                  onClick={() => setNcrtRegimen("NEOCRTEC5010")}
                  className={`px-2.5 py-1 rounded font-medium ${
                    ncrtRegimen === "NEOCRTEC5010"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border text-slate-600"
                  }`}
                >
                  NEOCRTEC5010 (长春瑞滨+顺铂+40Gy · 中国自主原研)
                </button>
                <button
                  type="button"
                  onClick={() => setNcrtRegimen("CROSS")}
                  className={`px-2.5 py-1 rounded font-medium ${
                    ncrtRegimen === "CROSS"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border text-slate-600"
                  }`}
                >
                  CROSS (紫杉醇+卡铂+41.4Gy · 国际经典)
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">术后病理评估：</span>
                <button
                  type="button"
                  onClick={() => setPcrStatus("pCR")}
                  className={`px-2 py-0.5 rounded font-medium ${
                    pcrStatus === "pCR" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  pCR (病理完全缓解 43.2%)
                </button>
                <button
                  type="button"
                  onClick={() => setPcrStatus("non_pCR")}
                  className={`px-2 py-0.5 rounded font-medium ${
                    pcrStatus === "non_pCR" ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  non-pCR (有肿瘤残留)
                </button>
              </div>
            </div>

            {/* 临床决策时间轴展示 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 阶段 1：术前新辅助 */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-700">阶段一：术前放化疗</span>
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>剂量：</strong>总剂量 40.0 Gy / 20 次分割</div>
                  <div><strong>化疗：</strong>{ncrtRegimen === "NEOCRTEC5010" ? "长春瑞滨 25mg/m² + 顺铂 75mg/m²" : "紫杉醇 50mg/m² + 卡铂 AUC 2 每周一次"}</div>
                  <div><strong>疗效：</strong>降期使肿瘤显著退缩，R0 切除率高达 98.4%</div>
                </div>
              </div>

              {/* 阶段 2：微创根治术 */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-700">阶段二：MIE 根治切除</span>
                  <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <div><strong>时机：</strong>放化疗结束后 4~6 周</div>
                  <div><strong>术式：</strong>胸腹腔镜联合微创食管癌切除术 (MIE)</div>
                  <div><strong>质控：</strong>规范清扫淋巴结 ≥15 枚，管状胃替代食管</div>
                </div>
              </div>

              {/* 阶段 3：术后辅助根据 pCR 智能分流 */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                pcrStatus === "pCR"
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "border-amber-200 bg-amber-50/30"
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${pcrStatus === "pCR" ? "text-emerald-700" : "text-amber-700"}`}>
                    阶段三：术后辅助决策 ({pcrStatus})
                  </span>
                  <Pill className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  {pcrStatus === "pCR" ? (
                    <>
                      <div><strong>结果：</strong>原发灶及淋巴结癌细胞全部灭活消失！</div>
                      <div><strong>策略：</strong>无需术后化疗，定期影像随访，5年生存率极高。</div>
                    </>
                  ) : (
                    <>
                      <div><strong>结果：</strong>标本存在活性残留癌细胞 (non-pCR)。</div>
                      <div><strong>重磅循证：</strong>依据 CheckMate-577 研究，给予纳武利尤单抗 (Nivolumab) 辅助免疫维持 1 年，中位 DFS 翻倍 (22.4 个月 vs 11.0 个月)。</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* NEOCRTEC5010 数据亮点 */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-sm block">NEOCRTEC5010 确证生存数据</span>
                <span className="text-indigo-100">长春瑞滨+顺铂+40Gy 相比单纯开刀：中位 OS 从 66.5 个月延长至 100.1 个月，5 年 OS 达 59.1%！</span>
              </div>
              <div className="text-right font-mono">
                <div className="text-2xl font-black">100.1 月</div>
                <div className="text-[10px] text-indigo-200">中位总生存期</div>
              </div>
            </div>
          </div>
        )}

        {/* 路径 3：晚期一线系统免疫联合 */}
        {activePathway === "systemic_immunotherapy" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ESCORT-1st */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-purple-900">ESCORT-1st 中国原研方案</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-200 text-purple-800 font-semibold">JAMA 2021</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>联合方案：</strong>卡瑞利珠单抗 (200mg) + 紫杉醇 (175mg/m²) + 顺铂 (75mg/m²) Q3W</div>
                  <div><strong>临床获益：</strong>中位 OS 达 15.3 个月（化疗组 12.0 个月），ORR 达 72.1%！</div>
                  <div><strong>医保状态：</strong>已全额纳入国家医保目录乙类报销。</div>
                </div>
              </div>

              {/* RATIONALE-306 */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-indigo-900">RATIONALE-306 全球突破方案</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-200 text-indigo-800 font-semibold">Lancet Oncol</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>联合方案：</strong>替雷利珠单抗 (200mg) + 氟尿嘧啶类/顺铂或紫杉醇 Q3W</div>
                  <div><strong>临床获益：</strong>中位 OS 跃升至 17.2 个月（化疗组 10.6 个月，降低 34% 死亡风险）！</div>
                  <div><strong>权威批准：</strong>已获中国 NMPA 与美国 FDA 双重适应证批准。</div>
                </div>
              </div>
            </div>

            {/* PD-L1 表达分流说明 */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <strong className="text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                PD-L1 表达水平指导分流：
              </strong>
              <p>
                虽然全人群患者均可从一线 PD-1 联合化疗中显著获益，但 PD-L1 CPS ≥10 或 TAP ≥10% 的高表达患者免疫缓解持续时间最长，甚至可取得超 3 年的长尾无疾病进展！
              </p>
            </div>
          </div>
        )}

        {/* 路径 4：术后空肠造瘘与抗反流护理 */}
        {activePathway === "postop_nutrition_care" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* 左侧：30度半卧位床头互动演示 (6 cols) */}
              <div className="lg:col-span-6 p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-purple-600" />
                    术后睡眠体位：抗反流 30°~45° 半卧位
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-600 inline-flex items-center gap-1">
                    <span>床头抬高 {elevationAngle}°</span>
                    {elevationAngle < 30 ? (
                      <span className="inline-flex items-center gap-0.5 text-amber-600">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>(过平 · 易呛咳反流)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>(安全防反流)</span>
                      </span>
                    )}
                  </span>
                </div>

                {/* 床头角度拖拽滑块 */}
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={elevationAngle}
                  onChange={e => setElevationAngle(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />

                {/* SVG 动画体位示意 */}
                <div className="w-full h-32 bg-slate-900 rounded-lg relative overflow-hidden flex items-end justify-center pb-2">
                  <svg viewBox="0 0 300 120" className="w-full h-full">
                    {/* 水平地面 */}
                    <line x1="20" y1="110" x2="280" y2="110" stroke="#475569" strokeWidth="2" />
                    
                    {/* 床板：从 x=60,y=110 倾斜至角度 */}
                    {/* 倾斜上半身 */}
                    <line
                      x1="60"
                      y1="110"
                      x2={60 + 130 * Math.cos((elevationAngle * Math.PI) / 180)}
                      y2={110 - 130 * Math.sin((elevationAngle * Math.PI) / 180)}
                      stroke="#818cf8"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />

                    {/* 下半身平放 */}
                    <line x1="60" y1="110" x2="250" y2="110" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" />

                    {/* 人体躯干与胸胃重力流向 */}
                    <circle
                      cx={60 + 120 * Math.cos((elevationAngle * Math.PI) / 180)}
                      cy={110 - 120 * Math.sin((elevationAngle * Math.PI) / 180) - 10}
                      r="10"
                      fill="#f43f5e"
                    />
                    <text
                      x={60 + 120 * Math.cos((elevationAngle * Math.PI) / 180) + 15}
                      y={110 - 120 * Math.sin((elevationAngle * Math.PI) / 180)}
                      fill="#cbd5e1"
                      fontSize="10"
                    >
                      头部与胸腔
                    </text>

                    {/* 重力箭头与胃液 */}
                    <path d="M 120,70 L 140,95 L 135,95 L 135,105 L 145,105 L 140,95" fill="#38bdf8" />
                    <text x="150" y="85" fill="#38bdf8" fontSize="9">胃液重力下行防反流</text>
                  </svg>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  食管切除后贲门被切除，平卧位胃酸和胆汁会直接倒灌入咽喉导致窒息呛咳。必须使用三角斜坡枕或摇高床头 30° 以上睡眠！
                </p>
              </div>

              {/* 右侧：空肠造瘘与进食原则 (6 cols) */}
              <div className="lg:col-span-6 space-y-3">
                <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-1.5">
                  <span className="font-bold text-purple-900 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5 text-purple-600" />
                    空肠造瘘管 (J-Tube) 规范使用要点：
                  </span>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li><strong>恒温泵注：</strong>肠内营养液加温至 38°C~40°C，避免过冷引起腹泻痉挛；</li>
                    <li><strong>匀速加量：</strong>从 500mL/天起始，逐步过渡至每日 1500~2000 大卡全量；</li>
                    <li><strong>防堵冲管：</strong>每次注食前后用 30mL 温开水冲洗造瘘管腔。</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 text-xs space-y-1.5">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    吻合口瘘高危报警信号：
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    术后 3~7 天若突然出现剧烈胸背撕裂痛、心率持续 &gt;120 次/分、发热高烧或胸管引流出混浊气体食物残渣，必须立即禁食禁水并紧急报告主管医生排查胸内吻合口瘘！
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部质控背书 */}
      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>权威队列：NEOCRTEC5010 · CROSS · ESCORT-1st · CheckMate-577 · CSCO 2024</span>
        </div>
        <span className="text-indigo-600 font-medium">全病程闭环管理</span>
      </div>
    </div>
  );
}
