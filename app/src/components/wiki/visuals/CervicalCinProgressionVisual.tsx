"use client";

import React, { useState } from "react";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  ShieldCheck, 
  Zap,
  Layers,
  ArrowRight,
  Clock,
  Scissors
} from "lucide-react";

export function CervicalCinProgressionVisual() {
  const [activeTab, setActiveTab] = useState<"timeline" | "margin">("timeline");

  // 时间轴演变阶段 (0 ~ 4)
  const [stepIndex, setStepIndex] = useState<number>(2); // 默认为 CIN1 阶段

  // 锥切切缘模拟状态
  const [marginState, setMarginState] = useState<"all_negative" | "ecto_positive" | "endo_positive">("all_negative");

  const progressionStages = [
    {
      step: 0,
      name: "正常宫颈黏膜",
      time: "第 0 年",
      badge: "健康基线",
      color: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
      description: "复层鳞状上皮结构完整，基底层细胞排列紧密有序，无 HPV 病毒感染。",
      action: "每 3~5 年规律行 HPV + TCT 联合筛查即可。",
      reversibility: "基线正常状态",
    },
    {
      step: 1,
      name: "HPV 一过性感染",
      time: "第 1 ~ 2 年",
      badge: "85% 自然自愈",
      color: "border-teal-500 bg-teal-500/10 text-teal-400",
      description: "高危型 HPV 病毒入侵宫颈上皮细胞，但在人体正常免疫系统的抵抗下，未引起细胞结构异型改变。",
      action: "无需任何手术或昂贵抗病毒药，保持规律作息，1 年后复查 TCT+HPV。",
      reversibility: "【极高自愈率】：80%~90% 的感染会在 8~24 个月内被自体免疫自然清除！",
    },
    {
      step: 2,
      name: "低级别病变 (CIN1 / LSIL)",
      time: "第 3 ~ 5 年",
      badge: "60% 自然逆转",
      color: "border-amber-500 bg-amber-500/10 text-amber-400",
      description: "异型细胞仅局限于上皮下 1/3 层，属于机体对 HPV 感染的自限性免疫反应。",
      action: "首选保守观察！每 12 个月复查一次，严禁盲目直接做大范围宫颈切除手术。",
      reversibility: "【高度可逆】：约 60% 自然消退逆转，仅约 10% 会进展为高级别病变。",
    },
    {
      step: 3,
      name: "高级别病变 (CIN2/3 / HSIL)",
      time: "第 5 ~ 8 年",
      badge: "锥切阻断黄金窗口",
      color: "border-purple-500 bg-purple-500/10 text-purple-400",
      description: "异型细胞占据上皮层 2/3 以上乃至全层 (原位癌)，但基底膜完整未被突破，尚未浸润血管与间质。",
      action: "【绝对阻断时机】：行宫颈冷刀锥切 (CKC) 或利普刀 (LEEP)，彻底摘除病灶阻断癌变。",
      reversibility: "【100% 阻断治愈】：一个小手术切除病灶即可彻底治愈，完全阻断其演变为癌症！",
    },
    {
      step: 4,
      name: "微小浸润癌 (Stage IA1/IA2)",
      time: "第 8 ~ 10 年以上",
      badge: "早期可根治",
      color: "border-rose-500 bg-rose-500/10 text-rose-400",
      description: "癌细胞突破基底膜侵入宫颈间质，但浸润深度 $\\le 5.0$ mm，无脉管转移。",
      action: "锥切切缘阴性者即可实现临床治愈；无生育需求者可行筋膜外全子宫切除术。",
      reversibility: "【早期高治愈】：5 年无病生存率仍高达 98% 以上！",
    },
  ];

  const currentStage = progressionStages[stepIndex];

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/90 text-slate-100 p-5 shadow-xl">
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white tracking-wide">宫颈病变 10 年可逆演变与锥切阻断模拟器</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono">ASCCP / CSCO</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">破除 HPV 恐慌，可视化理解从一过性感染到 CIN1/2/3 的长周期可逆窗口</p>
          </div>
        </div>

        {/* 模式切换 */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "timeline" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            10年演变时间轴
          </button>
          <button
            onClick={() => setActiveTab("margin")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "margin" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            锥切切缘质控模拟
          </button>
        </div>
      </div>

      {activeTab === "timeline" ? (
        <div className="space-y-6">
          {/* 交互时间滑块 */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-teal-300">拖动滑块查看各演变阶段：</span>
              <span className="font-mono text-slate-400">当前：{currentStage.time} ({currentStage.name})</span>
            </div>
            
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={stepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-full accent-teal-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
            />

            {/* 五大阶段节点小徽章 */}
            <div className="grid grid-cols-5 gap-1 pt-1">
              {progressionStages.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setStepIndex(idx)}
                  className={`p-1.5 rounded text-center transition-all ${
                    stepIndex === idx
                      ? "bg-teal-600 text-white font-semibold shadow-sm"
                      : "bg-slate-800/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <div className="text-[10px] font-mono">{s.time}</div>
                  <div className="text-[11px] truncate">{s.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 当前阶段临床全景卡片 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-mono">病理阶段与转归评估</span>
                <div className="flex items-center gap-3 mt-1">
                  <h4 className="text-lg font-bold text-white">{currentStage.name}</h4>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border font-mono ${currentStage.color}`}>
                    {currentStage.badge}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                演化跨度：<strong className="text-teal-400">{currentStage.time}</strong>
              </div>
            </div>

            {/* 病理解剖与可逆转逻辑 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 font-medium">显微镜下病理改变：</span>
                <p className="text-xs text-slate-200 leading-relaxed">{currentStage.description}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-xs text-teal-400 font-medium">可逆转与消退几率：</span>
                <p className="text-xs text-emerald-300 leading-relaxed">{currentStage.reversibility}</p>
              </div>
            </div>

            {/* 临床处理指引 */}
            <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-teal-300">规范战术对策：</strong>
                <span>{currentStage.action}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 锥切切缘质控模拟 */
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-800 space-y-3">
            <span className="text-xs text-slate-300 font-semibold">请选择锥切病理报告切缘状态：</span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "all_negative", label: "全切缘阴性 (安全净距)", desc: "内切缘/外切缘全阴性", color: "text-emerald-400" },
                { id: "ecto_positive", label: "外切缘阳性 (阴道侧)", desc: "阴道穹隆端微小累及", color: "text-amber-400" },
                { id: "endo_positive", label: "内切缘阳性 (颈管侧)", desc: "高位颈管上方累及", color: "text-rose-400" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMarginState(m.id as any)}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    marginState === m.id
                      ? "bg-teal-600/20 border-teal-500 ring-1 ring-teal-500/40 text-white"
                      : "bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div className={`text-xs font-semibold ${m.color}`}>{m.label}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 模拟结果输出 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            {marginState === "all_negative" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>【极优治愈】：病灶已被整块完整切除，治愈率超过 95%！</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  切缘阴性意味着手术刀是在完全健康的正常组织带上切割下的，病理切片边缘没有任何病变残留。术后无需再次手术，遵医嘱在术后 6 个月复查 HPV+TCT 即可，宫颈组织会自然重塑愈合。
                </p>
              </div>
            )}

            {marginState === "ecto_positive" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>【严密随访为主】：外切缘阳性通常无需急于再次开刀</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  外切缘是指靠近阴道穹隆这一侧的边缘。由于手术切除时电刀的热凝灼烧效应，相当一部分残留的微小细胞已被高温炭化消灭。国际指南建议 3~6 个月后复查阴道镜与细胞学，多数人会转为阴性。
                </p>
              </div>
            )}

            {marginState === "endo_positive" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>【需专科评估】：内切缘 (宫颈管口侧) 阳性，警惕高位残留</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  内切缘阳性提示宫颈管上方深处可能仍存留未切除干净的病变（尤其对于宫颈腺癌原位 AIS 患者）。临床指南建议由妇科肿瘤专家评估行【再次补充锥切 (Re-conization)】以明确排除浸润癌；已完成生育且无保育需求者，亦可考虑行筋膜外全子宫切除术。
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
