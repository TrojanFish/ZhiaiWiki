"use client";

import React, { useState } from "react";
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  Apple, 
  ShieldAlert, 
  Info,
  Calendar,
  Activity
} from "lucide-react";

export function ThyroidLt4TimingIsolationVisual() {
  const [takeMode, setTakeMode] = useState<"morning" | "bedtime">("morning");
  const [takeTimeHour, _setTakeTimeHour] = useState<number>(6); // 06:00 or 06:30
  const [breakfastDelayMin, setBreakfastDelayMin] = useState<number>(60); // 30, 45, 60 min
  const [calciumIntakeHour, setCalciumIntakeHour] = useState<number>(12); // e.g. 12:00
  const [hasSoyOrCoffeeWithPill, setHasSoyOrCoffeeWithPill] = useState<boolean>(false);
  const [_missedScenario, _setMissedScenario] = useState<"miss_1day" | "miss_many" | "none">("none");

  // 计算 L-T4 与 钙剂/铁剂 的时间差
  const calciumIntervalHours = Math.abs(calciumIntakeHour - takeTimeHour);
  const isCalciumSafe = calciumIntervalHours >= 4;

  // 计算胃酸与空腹吸收评估
  let absorptionScore = 95; // 满分 100%
  const warnings: string[] = [];
  const positives: string[] = [];

  if (hasSoyOrCoffeeWithPill) {
    absorptionScore -= 40;
    warnings.push("同服豆浆/浓咖啡/牛奶：大豆异黄酮与高钙、咖啡因阻碍肠道微绒毛螯合转运，吸收率可断崖式暴跌 30%~55%！");
  }

  if (breakfastDelayMin < 30) {
    absorptionScore -= 25;
    warnings.push("服药后不到 30 分钟即进食：胃酸排空与食物混合，导致左甲状腺素无法在空腹酸性环境下完全游离溶解。");
  } else if (breakfastDelayMin >= 60) {
    absorptionScore += 5;
    positives.push("服药后严格禁食水 60 分钟：达到《ATA/中国甲状腺诊疗指南》最高推荐等级，药代动力学吸收率最大化。");
  } else {
    positives.push("服药后禁食水 30~60 分钟：符合常规标准吸收窗口。");
  }

  if (!isCalciumSafe) {
    absorptionScore -= 30;
    warnings.push(`钙剂/铁剂与 L-T4 仅间隔 ${calciumIntervalHours} 小时（不足 4 小时安全红线！）：二价阳离子 (Ca2+/Fe2+) 极易在小肠管腔与 T4 分子络合形成不溶性沉淀排泄，使促甲状腺激素 (TSH) 剧烈反弹！`);
  } else {
    positives.push(`钙剂间隔达到 ${calciumIntervalHours} 小时（≥4小时）：完美避开肠道阳离子螯合沉淀窗口。`);
  }

  absorptionScore = Math.max(20, Math.min(100, absorptionScore));

  return (
    <div className="rounded-xl border border-indigo-200 bg-white overflow-hidden shadow-sm my-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50 px-5 py-4 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              左甲状腺素 (L-T4) 24小时服药吸收与 4 小时隔离时钟仿真
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                ATA / CSCO 药代动力学质控
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              严格推演空腹服药、早餐时差、钙铁隔离及漏服补救规则
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setTakeMode("morning")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              takeMode === "morning"
                ? "bg-white text-indigo-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            清晨空腹模式 (推荐首选)
          </button>
          <button
            type="button"
            onClick={() => setTakeMode("bedtime")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              takeMode === "bedtime"
                ? "bg-white text-indigo-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            睡前服药模式 (晚饭后3-4h)
          </button>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Absorption Efficiency Meter */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">预计药效生物利用度 (Bioavailability):</span>
              <span className={`text-lg font-black ${
                absorptionScore >= 80 ? "text-emerald-600" :
                absorptionScore >= 50 ? "text-amber-600" :
                "text-rose-600"
              }`}>
                {absorptionScore}%
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full sm:w-80 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  absorptionScore >= 80 ? "bg-emerald-500" :
                  absorptionScore >= 50 ? "bg-amber-500" :
                  "bg-rose-500"
                }`}
                style={{ width: `${absorptionScore}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {absorptionScore >= 80 ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> 吸收达标 · TSH抑制稳定
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-700 font-semibold px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 animate-pulse">
                <AlertTriangle className="w-4 h-4" /> 存在严重药物干扰吸收风险
              </span>
            )}
          </div>
        </div>

        {/* Key Warning / Positive Feeds */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((warn, i) => (
              <div key={i} className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {/* 24-Hour Timeline Visualizer */}
        <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50/70 to-white">
          <h4 className="text-xs font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            24 小时服药与饮食节点流向图:
          </h4>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 space-y-6">
            {/* Step 1: L-T4 Pill */}
            <div className="relative">
              <div className="absolute -left-[31px] sm:-left-[39px] top-0 p-1.5 rounded-full bg-indigo-600 text-white shadow-xs">
                <Pill className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-xs text-indigo-900">
                  {takeMode === "morning" ? `清晨 ${takeTimeHour.toString().padStart(2, "0")}:00 空腹服药` : "睡前 22:30 空腹服药"}
                </span>
                <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  整片用清水送服 (温凉白开水)
                </span>
              </div>
              <p className="text-2xs text-slate-500 mt-1">
                必须使用白开水送服（忌用茶水、果汁、豆浆或牛奶送服）。
              </p>
            </div>

            {/* Step 2: Breakfast */}
            <div className="relative">
              <div className={`absolute -left-[31px] sm:-left-[39px] top-0 p-1.5 rounded-full text-white shadow-xs ${
                breakfastDelayMin >= 30 ? "bg-teal-600" : "bg-rose-500"
              }`}>
                <Apple className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-xs text-slate-800">
                  {takeMode === "morning" ? `服药后 +${breakfastDelayMin} 分钟：享用常规早餐` : "睡前空腹已满足晚饭后 3-4 小时"}
                </span>
                <span className={`text-2xs font-semibold px-2 py-0.5 rounded ${
                  breakfastDelayMin >= 60 ? "bg-teal-100 text-teal-800" :
                  breakfastDelayMin >= 30 ? "bg-slate-100 text-slate-700" :
                  "bg-rose-100 text-rose-800"
                }`}>
                  {breakfastDelayMin >= 60 ? "黄金60分钟间隔 (吸收最佳)" : breakfastDelayMin >= 30 ? "符合30分钟最低达标线" : "间隔不足30分钟！"}
                </span>
              </div>
              <p className="text-2xs text-slate-500 mt-1">
                碳水化合物、蛋类正常摄入。避免早餐即饮用高浓度豆浆、现磨咖啡。
              </p>
            </div>

            {/* Step 3: Calcium / Iron Isolation */}
            <div className="relative">
              <div className={`absolute -left-[31px] sm:-left-[39px] top-0 p-1.5 rounded-full text-white shadow-xs ${
                isCalciumSafe ? "bg-indigo-600" : "bg-rose-500 animate-bounce"
              }`}>
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-xs text-slate-800">
                  设定时间：{calciumIntakeHour.toString().padStart(2, "0")}:00 补充钙剂 / 铁剂 / 复合维生素
                </span>
                <span className={`text-2xs font-semibold px-2 py-0.5 rounded ${
                  isCalciumSafe 
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {isCalciumSafe ? `安全间隔 ${calciumIntervalHours} 小时 (≥4小时)` : `高危仅间隔 ${calciumIntervalHours} 小时 (<4小时)`}
                </span>
              </div>
              <p className="text-2xs text-slate-500 mt-1">
                碳酸钙、葡萄糖酸钙、骨化三醇、硫酸亚铁、质子泵抑制剂 (奥美拉唑等) 必须间隔 ≥ 4 小时以上。
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Breakfast Interval Control */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="font-semibold text-slate-700 block">
              调整早餐间隔时间 (服药到进食):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { min: 15, label: "15 分钟 (过早)" },
                { min: 30, label: "30 分钟 (达标)" },
                { min: 60, label: "60 分钟 (黄金)" }
              ].map(item => (
                <button
                  key={item.min}
                  type="button"
                  onClick={() => setBreakfastDelayMin(item.min)}
                  className={`py-1.5 px-2 rounded text-xs transition-colors ${
                    breakfastDelayMin === item.min 
                      ? "bg-indigo-600 text-white font-medium shadow-xs" 
                      : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calcium Hour Control */}
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">
                调整钙剂 / 铁剂服药时间点:
              </span>
              <span className="font-black text-indigo-600">
                {calciumIntakeHour}:00 ({isCalciumSafe ? "安全" : "不足4小时"})
              </span>
            </div>
            <input
              type="range"
              min="7"
              max="22"
              step="1"
              value={calciumIntakeHour}
              onChange={(e) => setCalciumIntakeHour(Number(e.target.value))}
              className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-2xs text-slate-400">
              <span>07:00 (早餐时)</span>
              <span>12:00 (午餐后推荐)</span>
              <span>20:00 (晚餐后推荐)</span>
            </div>
          </div>
        </div>

        {/* Soy Milk & Coffee Toggle */}
        <label className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={hasSoyOrCoffeeWithPill}
            onChange={(e) => setHasSoyOrCoffeeWithPill(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
          <div>
            <span className="text-xs font-semibold text-slate-800 block">
              模拟情况：服药 1 小时内喝豆浆、浓咖啡或牛奶
            </span>
            <span className="text-2xs text-slate-500">
              测试大豆异黄酮螯合作用对左甲状腺素吸收率的冲击影响
            </span>
          </div>
        </label>

        {/* Missed Pill Protocol Section */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold text-amber-900">
              急救指南：发生漏服药时的科学补服决策树
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-2xs">
            <div className="p-3 rounded-lg bg-white border border-amber-200">
              <span className="font-bold text-slate-800 block mb-1">
                方案 1：当天中午或下午想起漏服
              </span>
              <p className="text-slate-600">
                只要距离末次进餐已达 3~4 小时（保证胃内基本排空），应立即补服当天剂量，不必等到次日。
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white border border-amber-200">
              <span className="font-bold text-slate-800 block mb-1">
                方案 2：次日清晨才想起前一天漏服
              </span>
              <p className="text-slate-600">
                次日清晨可一次性服用 <span className="text-amber-600 font-bold">2 剂（昨日漏服 + 今日正常剂量）</span>。因为左甲状腺素 T4 在人体血清半衰期长达 7 天，短期 1 天合并服用安全有效，不会引起突发中毒。
              </p>
            </div>
          </div>
        </div>

        {/* Reference */}
        <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-2xs text-slate-500">
          <Info className="w-3.5 h-3.5 shrink-0 text-indigo-600 mt-0.5" />
          <span>
            参考文献：American Thyroid Association (ATA) Guidelines for Adult Patients with Thyroid Nodules and Differentiated Thyroid Cancer · 《甲状腺癌术后左甲状腺素钠抑制治疗中国专家共识》.
          </span>
        </div>
      </div>
    </div>
  );
}
