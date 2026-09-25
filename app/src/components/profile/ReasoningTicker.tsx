"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  CheckCircle2, 
  FileSearch, 
  Database, 
  ShieldAlert, 
  FileSpreadsheet,
  Clock
} from "lucide-react";

interface StepInfo {
  step: number;
  title: string;
  subtitle: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
}

const REASONING_STEPS: StepInfo[] = [
  {
    step: 1,
    title: "结构化提取病理与薄层 CT 影像特征",
    subtitle: "解析肿瘤全径、实性成分浸润比 (CTR)、STAS 气道播散与胸膜侵犯 (VPI)",
    details: "对齐 IASLC / AJCC 第 9 版 磨玻璃实性成分折算规则，排查切缘 R0 状态与淋巴结转移",
    icon: FileSearch,
  },
  {
    step: 2,
    title: "跨库检索国际前瞻性队列与分期标准",
    subtitle: "检索 JCOG0802 / JCOG0804、CALGB 140503 及 IASLC 数据库",
    details: "对比 10 年随访总生存率 (OS) 与无复发生存率 (RFS) 基线队列",
    icon: Database,
  },
  {
    step: 3,
    title: "匹配靶向辅助治疗试验与复发风险矩阵",
    subtitle: "对齐 ADAURA (奥希替尼)、ALINA 及 CSCO / NCCN 指南分级推荐",
    details: "严格触发过度治疗防范红线，评估辅助化疗/靶向药与基因检测必要性",
    icon: ShieldAlert,
  },
  {
    step: 4,
    title: "编排门诊就诊便签卡与结构化问诊清单",
    subtitle: "提炼核心沟通决策树，定制《向主治医生当面咨询的关键问题》",
    details: "生成 2x Retina 门诊便签与 A4 打印版就医沟通清单",
    icon: FileSpreadsheet,
  },
];

interface ReasoningTickerProps {
  isGenerating: boolean;
  onCompleted?: () => void;
}

export default function ReasoningTicker({ isGenerating }: ReasoningTickerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStepIndex(REASONING_STEPS.length - 1);
      return;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => +(prev + 0.1).toFixed(1));
    }, 100);

    // Progression timer: advances step every 1.1 - 1.5 seconds
    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < REASONING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, [isGenerating]);

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-5 sm:p-6 rounded-3xl bg-white text-slate-900 shadow-sm border border-slate-200/90 space-y-5 animate-fade-in">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Activity className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold tracking-wide text-slate-900 flex items-center gap-2">
              <span>知癌维基 临床路径与顶刊文献对照演算</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              严格遵照国际临床指南与前瞻队列构建专属分析矩阵
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono shrink-0">
          <Clock className="w-3 h-3 text-blue-600" />
          <span>{elapsedSeconds.toFixed(1)}s</span>
        </div>
      </div>

      {/* Progress Steps List */}
      <div className="space-y-3">
        {REASONING_STEPS.map((stepInfo, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const _isPending = idx > currentStepIndex;
          const IconComponent = stepInfo.icon;

          return (
            <div
              key={stepInfo.step}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                isCurrent
                  ? "bg-blue-50/70 border-blue-200 text-slate-900 shadow-2xs"
                  : isDone
                  ? "bg-slate-50/80 border-slate-200 text-slate-700"
                  : "bg-white border-slate-100 text-slate-400 opacity-60"
              }`}
            >
              {/* Step indicator */}
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {stepInfo.step}
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-bold">
                    {stepInfo.step}
                  </div>
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h5 className={`text-xs font-bold flex items-center gap-1.5 ${
                    isCurrent ? "text-blue-900" : isDone ? "text-emerald-900" : "text-slate-500"
                  }`}>
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{stepInfo.title}</span>
                  </h5>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full border border-blue-200 shrink-0">
                      对照演算中...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      已对齐
                    </span>
                  )}
                </div>

                <p className={`text-xs leading-tight ${isCurrent ? "text-slate-600" : isDone ? "text-slate-500" : "text-slate-400"}`}>
                  {stepInfo.subtitle}
                </p>

                {isCurrent && (
                  <div className="text-[11px] font-mono pt-1 text-blue-700 animate-fade-in">
                    ↳ {stepInfo.details}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
        <span>系统正在严密对齐现行国际临床分期与真实队列证据，稍候即呈现结构化报告...</span>
      </div>
    </div>
  );
}
