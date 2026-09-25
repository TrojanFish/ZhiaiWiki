"use client";

import React, { useState } from "react";
import { Tag, AlertTriangle, ShieldCheck, Activity, Info, CheckCircle2 } from "lucide-react";

type BiRadsCategory = "0" | "1" | "2" | "3" | "4A" | "4B" | "4C" | "5" | "6";

interface BiRadsInfo {
  name: string;
  shortName: string;
  riskPct: string;
  riskWidth: number;
  color: string;
  badgeBg: string;
  borderCol: string;
  findings: string;
  action: string;
  advice: string;
}

export function BiRadsScaleVisual() {
  const [selectedCat, setSelectedCat] = useState<BiRadsCategory>("3");

  const categories: Record<BiRadsCategory, BiRadsInfo> = {
    "0": {
      name: "BI-RADS 0 类 · 评估不完全",
      shortName: "0 类 · 需补片",
      riskPct: "未知 (无法单项定性)",
      riskWidth: 15,
      color: "text-slate-300",
      badgeBg: "bg-slate-700 text-slate-200",
      borderCol: "border-slate-700 bg-slate-800/40",
      findings: "单项检查（如单纯钼靶因致密遮挡，或超声图像不够清晰）信息不充分，或需要与历史胶片对照。",
      action: "补充检查：加做高频彩超、乳腺增强 MRI 或调阅既往老片进行对比重读。",
      advice: "0 类绝不代表恶性！只是提示医生目前手头资料不足以给出确切定性，补齐检查即可。"
    },
    "1": {
      name: "BI-RADS 1 类 · 阴性 (完全正常)",
      shortName: "1 类 · 阴性",
      riskPct: "恶性概率 ≈ 0%",
      riskWidth: 1,
      color: "text-emerald-400",
      badgeBg: "bg-emerald-500 text-slate-950",
      borderCol: "border-emerald-500/30 bg-emerald-500/10",
      findings: "乳腺实质对称正常，无结节肿块、无结构扭曲、无微钙化或异常血流。",
      action: "常规年度体检：40 岁以上女性建议每 1~2 年进行一次常规乳腺筛查。",
      advice: "完全健康的乳腺形态，安心生活，无需任何干预。"
    },
    "2": {
      name: "BI-RADS 2 类 · 明确良性病变",
      shortName: "2 类 · 良性",
      riskPct: "恶性概率 = 0%",
      riskWidth: 2,
      color: "text-teal-300",
      badgeBg: "bg-teal-500 text-slate-950",
      borderCol: "border-teal-500/30 bg-teal-500/10",
      findings: "典型单纯囊肿、乳腺假体、稳定的退化粗大钙化、典型乳腺内淋巴结或多次随访完全无变化的纤维腺瘤。",
      action: "常规年度随访 (12 个月后复查彩超或钼靶)，无须吃药或穿刺。",
      advice: "病灶 100% 良性，与乳腺癌无关，不要受中药散结虚假广告误导过度治疗。"
    },
    "3": {
      name: "BI-RADS 3 类 · 可能良性 (短期随访)",
      shortName: "3 类 · 观察",
      riskPct: "恶性概率 ≤ 2%",
      riskWidth: 6,
      color: "text-sky-300",
      badgeBg: "bg-sky-500 text-slate-950",
      borderCol: "border-sky-500/30 bg-sky-500/10",
      findings: "初次发现的边界清晰、卵圆形、平行于皮肤生长的实性低回声小结节（典型良性纤维腺瘤征象）。",
      action: "3~6 个月后复查超声：连续随访 2~3 年稳定无增大，将自动降级为 2 类！",
      advice: "恶性率 < 2%（>98% 最终证实是良性）。国际指南严禁盲目穿刺，过度活检属于医疗浪费。"
    },
    "4A": {
      name: "BI-RADS 4A 类 · 低度可疑恶性",
      shortName: "4A 类 · 轻疑",
      riskPct: "恶性概率 2% ~ 10%",
      riskWidth: 22,
      color: "text-amber-300",
      badgeBg: "bg-amber-500 text-slate-950",
      borderCol: "border-amber-500/30 bg-amber-500/10",
      findings: "结节形态大体规则，但伴有轻微不规则边缘，或伴有局部复杂囊实性成分。",
      action: "结合临床决策：可选择超声引导下微创旋切活检 / 细针穿刺，或经验丰富专科医生评估后 3 个月密切复查。",
      advice: "即使是 4A 类，仍有 90% 以上最终为良性！万勿恐慌以为天塌，理性排查即可。"
    },
    "4B": {
      name: "BI-RADS 4B 类 · 中度可疑恶性",
      shortName: "4B 类 · 中疑",
      riskPct: "恶性概率 10% ~ 50%",
      riskWidth: 45,
      color: "text-orange-400",
      badgeBg: "bg-orange-500 text-slate-950",
      borderCol: "border-orange-500/30 bg-orange-500/10",
      findings: "边界模糊、纵横比 >1（立位生长）、内部回声极不均匀，或伴有点状微小钙化。",
      action: "必须进行空芯针穿刺活检 (CNB) 或真空旋切，获取组织送病理免疫组化定性。",
      advice: "属于病理必须排查的分水岭，尽早穿刺是阻断病情的关键，良恶性各占一部分。"
    },
    "4C": {
      name: "BI-RADS 4C 类 · 高度可疑恶性",
      shortName: "4C 类 · 高疑",
      riskPct: "恶性概率 50% ~ 95%",
      riskWidth: 78,
      color: "text-rose-400",
      badgeBg: "bg-rose-500 text-white",
      borderCol: "border-rose-500/30 bg-rose-500/10",
      findings: "边缘呈明显毛刺状侵犯、后方回声衰减明显、微钙化成簇且多形性分支状分布。",
      action: "尽快完成组织空芯针穿刺活检 (CNB)，同时完善全身分期检查，乳腺外科专科收治。",
      advice: "即使确诊恶性，我国早期乳腺癌 5 年治愈率仍高达 90% 以上，保持积极配合。"
    },
    "5": {
      name: "BI-RADS 5 类 · 高度符合恶性",
      shortName: "5 类 · 极疑",
      riskPct: "恶性概率 ≥ 95%",
      riskWidth: 96,
      color: "text-rose-400",
      badgeBg: "bg-rose-600 text-white",
      borderCol: "border-rose-500/30 bg-rose-500/10",
      findings: "具备乳腺癌所有典型影像学征象：致密毛刺肿块、成簇分支钙化、穿入型丰富血流、周围韧带牵拉。",
      action: "立即组织穿刺获取受体 (ER/PR/HER2/Ki-67) 定量，MDT 多学科会诊评估手术或新辅助方案。",
      advice: "属于典型恶性征象。现代医学有靶向药、内分泌与免疫等丰富手段，坚定信念。"
    },
    "6": {
      name: "BI-RADS 6 类 · 活检已证实恶性",
      shortName: "6 类 · 确诊",
      riskPct: "恶性概率 100% (病理已确诊)",
      riskWidth: 100,
      color: "text-purple-400",
      badgeBg: "bg-purple-600 text-white",
      borderCol: "border-purple-500/30 bg-purple-500/10",
      findings: "在此次影像检查前，该病灶已经经过手术或空芯针活检病理确认为乳腺癌。",
      action: "根据分子亚型制定治疗路径：直接手术切除，或行术前新辅助靶向/化疗（监测退缩情况）。",
      advice: "此代码专供医生评估治疗后疗效监测（如新辅助后复查病灶缩小退缩幅度）使用。"
    }
  };

  const current = categories[selectedCat];

  return (
    <div className="bg-slate-900 rounded-xl p-2.5 sm:p-3 text-white select-none border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-bold text-pink-400 flex items-center gap-1">
          <Tag className="w-3.5 h-3.5 text-pink-400" />
          <span>ACR BI-RADS 全色谱恶性风险测算</span>
        </span>
        <span className="text-[9px] text-slate-400 font-mono">ACR 指南标准</span>
      </div>

      {/* Grid of 9 Category Buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-9 gap-1 mb-2">
        {(["0", "1", "2", "3", "4A", "4B", "4C", "5", "6"] as BiRadsCategory[]).map((cat) => {
          const isSelected = selectedCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`py-1 px-0.5 rounded-md text-[11px] font-bold transition-all text-center cursor-pointer ${
                isSelected
                  ? `${categories[cat].badgeBg} shadow-sm scale-105 ring-1 ring-white/20`
                  : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Risk Spectrum Indicator Bar */}
      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 mb-2 space-y-1">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-400">恶性风险测算轴</span>
          <span className="font-bold text-pink-300">{current.riskPct}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              selectedCat === "0"
                ? "bg-slate-500"
                : selectedCat === "1" || selectedCat === "2"
                ? "bg-emerald-500"
                : selectedCat === "3"
                ? "bg-sky-400"
                : selectedCat === "4A"
                ? "bg-amber-400"
                : selectedCat === "4B"
                ? "bg-orange-500"
                : selectedCat === "4C" || selectedCat === "5"
                ? "bg-rose-500"
                : "bg-purple-500"
            }`}
            style={{ width: `${Math.max(current.riskWidth, 3)}%` }}
          />
        </div>
        <div className="flex justify-between text-[8.5px] text-slate-500 px-0.5">
          <span>0% (安全良性)</span>
          <span>2% 观察分界线</span>
          <span>50%</span>
          <span>100% (确诊)</span>
        </div>
      </div>

      {/* Detail Content Box */}
      <div className={`p-2.5 rounded-lg border ${current.borderCol} space-y-1.5 transition-all`}>
        <div className="flex items-center justify-between flex-wrap gap-1.5">
          <h4 className="text-xs font-bold text-white flex items-center gap-1">
            {selectedCat === "1" || selectedCat === "2" ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : selectedCat === "3" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{current.name}</span>
          </h4>
          <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded ${current.badgeBg}`}>
            {current.riskPct}
          </span>
        </div>

        <div className="text-[10.5px] text-slate-300 leading-snug">
          <strong className="text-slate-200">典型表现：</strong>
          {current.findings}
        </div>

        <div className="bg-slate-900/90 p-2 rounded-md border border-slate-700/60 text-[10.5px] leading-snug">
          <div className="text-pink-300 font-semibold mb-0.5 flex items-center gap-1 text-[10px]">
            <Activity className="w-3 h-3" />
            <span>临床标准行动对策：</span>
          </div>
          <span className="text-slate-200">{current.action}</span>
        </div>

        <div className="text-[9.5px] text-slate-400 flex items-start gap-1 pt-0.5">
          <Info className="w-3 h-3 text-pink-400 shrink-0 mt-0.5" />
          <span>{current.advice}</span>
        </div>
      </div>
    </div>
  );
}
