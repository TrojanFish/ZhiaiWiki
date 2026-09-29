"use client";

import React, { useState } from "react";
import { Utensils, HeartPulse, ShieldCheck, Lightbulb, AlertTriangle, Check, Pin } from "lucide-react";

type DumpingPhase = "early" | "late";
type ReconstructionType = "billroth1" | "billroth2" | "roux_en_y";

export function GastricDumpingNutritionVisual() {
  const [selectedPhase, setSelectedPhase] = useState<DumpingPhase>("early");
  const [selectedRecon, setSelectedRecon] = useState<ReconstructionType>("roux_en_y");
  const [waterWithMeal, setWaterWithMeal] = useState<boolean>(false);
  const [sugarLevel, setSugarLevel] = useState<"low" | "high">("low");
  const [mealFrequency, setMealFrequency] = useState<"normal3" | "split6">("split6");

  const reconData: Record<ReconstructionType, {
    name: string;
    anatomy: string;
    pros: string;
    cons: string;
    antiRefluxRating: string;
  }> = {
    roux_en_y: {
      name: "Roux-en-Y 吻合 (现代抗反流金标准)",
      anatomy: "十二指肠残端闭合，将空肠切断，远端提上与残胃（或食管）吻合；而含有胆汁胰液的近端空肠则在胃吻合口下方 45~50cm 处与空肠侧侧吻合。",
      pros: "胆汁与胰液在胃下方半米处才汇合入肠，从物理距离上彻底隔绝了碱性胆汁反流，反流性胃炎与食管灼痛发生率极低！",
      cons: "手术吻合口较多（2处吻合），操作复杂度高，需高水平微创团队精细缝合。",
      antiRefluxRating: "⭐⭐⭐⭐⭐ (极佳抗反流)"
    },
    billroth1: {
      name: "毕罗氏 I 式 (Billroth I - 生理吻合)",
      anatomy: "远端胃大部切除后，残胃直接与十二指肠残端做端端或端侧对接吻合。",
      pros: "保留了正常的十二指肠生理通道，铁和钙的吸收率相对最好，操作相对简便。",
      cons: "由于残胃与十二指肠存在一定张力，仅适用于早期胃窦微小病灶；反流性胃炎发生率居中。",
      antiRefluxRating: "⭐⭐⭐ (中等)"
    },
    billroth2: {
      name: "毕罗氏 II 式 (Billroth II - 侧侧旁路吻合)",
      anatomy: "十二指肠残端完全缝闭，将残胃与十二指肠后方的一段空肠袢直接做端侧或侧侧吻合。",
      pros: "切除范围可以更大，无缝合张力之虞，曾是上世纪胃溃疡和大部切除的经典术式。",
      cons: "十二指肠排出的强碱性胆汁和胰液会直接冲刷浸泡残胃黏膜，极易引发顽固的残胃灼痛、胆汁反流性胃炎，远期残胃癌风险略增。",
      antiRefluxRating: "⭐⭐ (反流风险较高)"
    }
  };

  // 倾倒风险计算逻辑
  const isHighRisk = (waterWithMeal && selectedPhase === "early") || (sugarLevel === "high" && selectedPhase === "late") || (mealFrequency === "normal3");

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 text-slate-100 shadow-xl space-y-6">
      {/* 标题 */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <Utensils className="w-4 h-4" />
          <span>胃切除术后生活重塑与排空模拟</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
          胃切除消化道重建方式与「抗倾倒综合征」营养指南
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          解析毕I/毕II/Roux-en-Y 吻合抗反流差异，模拟早期与晚期倾倒综合征发生生理机制，掌握抗倾倒健康餐盘法则
        </p>
      </div>

      {/* 第一模块：三大重建方式横向对比 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">三大胃切除吻合术式对比</span>
          <span className="text-[11px] text-slate-400">选择术式查看解剖原理</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(["roux_en_y", "billroth1", "billroth2"] as ReconstructionType[]).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedRecon(key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRecon === key
                  ? "bg-slate-800 border-amber-500 shadow-lg shadow-amber-500/10"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${selectedRecon === key ? "text-amber-300" : "text-slate-300"}`}>
                  {key === "roux_en_y" ? "Roux-en-Y" : key === "billroth1" ? "毕罗氏 I 式" : "毕罗氏 II 式"}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {reconData[key].antiRefluxRating.split(" ")[0]}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{reconData[key].name}</p>
            </button>
          ))}
        </div>

        {/* 吻合详情 */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-white text-sm">{reconData[selectedRecon].name}</h5>
            <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              抗反流评级: {reconData[selectedRecon].antiRefluxRating}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed"><strong className="text-amber-300">解剖构造: </strong>{reconData[selectedRecon].anatomy}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-emerald-400 font-semibold">优势核心: </span>{reconData[selectedRecon].pros}
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
              <span className="text-rose-400 font-semibold">关注注意: </span>{reconData[selectedRecon].cons}
            </div>
          </div>
        </div>
      </div>

      {/* 第二模块：倾倒综合征机理互动模拟器 */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <span>倾倒综合征 (Dumping Syndrome) 发生时钟与机制</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              失去幽门闸门调控后，食物快速涌入空肠引起的生理连锁反应
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-800 p-1 border border-slate-700 self-start sm:self-auto">
            <button
              onClick={() => setSelectedPhase("early")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                selectedPhase === "early"
                  ? "bg-rose-500 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              早期倾倒 (餐后15~30分钟)
            </button>
            <button
              onClick={() => setSelectedPhase("late")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                selectedPhase === "late"
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              晚期低血糖倾倒 (餐后2~4小时)
            </button>
          </div>
        </div>

        {/* 动态机制解释 */}
        {selectedPhase === "early" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-rose-400 font-mono uppercase font-bold">Step 1: 高渗食糜入肠</span>
                <p className="text-xs text-slate-300">未经充分研磨的高渗食物瞬间涌入空肠上段，刺激肠壁神经反射</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-rose-400 font-mono uppercase font-bold">Step 2: 血管大量渗水</span>
                <p className="text-xs text-slate-300">高渗压使血管内大量体液快速渗透至肠腔，导致有效循环血容量瞬间锐减</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-rose-400 font-mono uppercase font-bold">Step 3: 虚脱与腹泻表现</span>
                <p className="text-xs text-slate-300">引发面色苍白、大汗淋漓、心跳过速 (&gt;100次/分)、腹部绞痛与水样腹泻</p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/60 text-xs text-rose-200 flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span><strong>预防要诀：</strong>饭前饭后 30 分钟严禁大口喝水喝汤！保持「干稀分食」，餐后半卧位休息 20 分钟延缓重力下坠。</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">Step 1: 糖分过速吸收</span>
                <p className="text-xs text-slate-300">食糜中的单糖/碳水化合物快速被空肠吸收，血糖在短时间内异常飙升</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">Step 2: 胰岛素过量分泌</span>
                <p className="text-xs text-slate-300">胰岛受到猛烈刺激，超负荷泵出大量胰岛素应对高血糖</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">Step 3: 反应性低血糖</span>
                <p className="text-xs text-slate-300">过量胰岛素迅速耗尽血液葡萄糖，餐后 2~4 小时突发心慌手抖、饥饿乏力</p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>预防要诀：</strong>严格限制精制甜食、蛋糕、果汁！多摄入高蛋白（鱼禽肉蛋）与复合膳食纤维，随身常备苏打饼干以备低血糖急救。</span>
            </div>
          </div>
        )}

        {/* 交互餐盘调节器 */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">进餐习惯与风险测试调控台</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1 ${
              isHighRisk ? "bg-rose-900/80 text-rose-300 border border-rose-700" : "bg-emerald-900/80 text-emerald-300 border border-emerald-700"
            }`}>
              {isHighRisk ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>容易诱发倾倒症状</span>
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>饮食安全平衡状态</span>
                </>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* 调控 1: 餐时饮水 */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2">
              <span className="text-slate-300 font-medium">餐时液体摄入:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setWaterWithMeal(false)}
                  className={`flex-1 py-1 rounded text-center text-xs font-bold transition-all ${
                    !waterWithMeal ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  干稀分食 (安全)
                </button>
                <button
                  onClick={() => setWaterWithMeal(true)}
                  className={`flex-1 py-1 rounded text-center text-xs font-bold transition-all ${
                    waterWithMeal ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  边吃边喝汤 (高危)
                </button>
              </div>
            </div>

            {/* 调控 2: 糖分水平 */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2">
              <span className="text-slate-300 font-medium">食物含糖量:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSugarLevel("low")}
                  className={`flex-1 py-1 rounded text-center text-xs font-bold transition-all ${
                    sugarLevel === "low" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  低单糖高蛋白
                </button>
                <button
                  onClick={() => setSugarLevel("high")}
                  className={`flex-1 py-1 rounded text-center text-xs font-bold transition-all ${
                    sugarLevel === "high" ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  高糖饮料甜点
                </button>
              </div>
            </div>

            {/* 调控 3: 餐次频度 */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between gap-2">
              <span className="text-slate-300 font-medium">每日进餐频次:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setMealFrequency("split6")}
                  className={`flex-1 py-1 rounded text-center text-xs font-bold transition-all ${
                    mealFrequency === "split6" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  5~6餐 (少量多次)
                </button>
                <button
                  onClick={() => setMealFrequency("normal3")}
                  className={`flex-1 py-1 rounded text-center text-xs font-bold transition-all ${
                    mealFrequency === "normal3" ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  传统1日3大餐
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 第三模块：全胃切除特有贫血预防指南 */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>全胃切除患者终身必修课：维生素 B12 与铁剂补充防线</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          胃黏膜的壁细胞是人体合成<strong>「内因子 (Intrinsic Factor)」</strong>的唯一场所。失去胃后，内因子彻底缺失，膳食中的维生素 B12 无法在回肠末端被主动吸收。体内原本储备的 B12 在术后 2~3 年耗竭后，极易诱发<strong>巨幼细胞性恶性贫血</strong>与不可逆的四肢麻木神经损害。
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="bg-amber-900/60 text-amber-200 border border-amber-700/60 px-2 py-0.5 rounded inline-flex items-center gap-1">
            <Pin className="w-3 h-3 text-amber-400 shrink-0" />
            <span>黄金用药：遵医嘱每 3 个月肌肉注射维生素 B12 (100~500μg) 终身维持</span>
          </span>
          <span className="bg-amber-900/60 text-amber-200 border border-amber-700/60 px-2 py-0.5 rounded inline-flex items-center gap-1">
            <Pin className="w-3 h-3 text-amber-400 shrink-0" />
            <span>定期随访：术后每半年检测血常规 (Hb)、血清铁蛋白与叶酸水平</span>
          </span>
        </div>
      </div>
    </div>
  );
}
