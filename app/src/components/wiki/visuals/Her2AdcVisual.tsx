"use client";

import React from "react";
import { Crosshair, Target } from "lucide-react";

export function Her2AdcVisual() {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white border border-slate-800 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
            <Crosshair className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-100">非小细胞肺癌 HER2 突变与 ADC 生物导弹机制</h5>
            <span className="text-[10px] text-slate-400 font-mono">抗体偶联药物 (Antibody-Drug Conjugate) · DESTINY-Lung02</span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-400/30">
          肺腺癌罕见靶点
        </span>
      </div>

      {/* ADC Structure Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
          <div className="text-[11px] font-bold text-sky-400">1. 精准雷达制导</div>
          <div className="text-xs font-bold text-slate-200">单克隆抗体</div>
          <p className="text-[10px] text-slate-400">特异性识别肺癌细胞表面过表达的 HER2 受体</p>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
          <div className="text-[11px] font-bold text-amber-400">2. 智能可切割连接子</div>
          <div className="text-xs font-bold text-slate-200">Cleavable Linker</div>
          <p className="text-[10px] text-slate-400">在正常血液中高度稳定，进入癌细胞溶酶体才裂解</p>
        </div>

        <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
          <div className="text-[11px] font-bold text-emerald-400">3. 高效集束弹头</div>
          <div className="text-xs font-bold text-slate-200">拓扑异构酶 I 抑制剂</div>
          <p className="text-[10px] text-slate-400">超强细胞毒性药物，并在局部产生旁观者杀伤效应</p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs text-sky-200 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span><strong>DESTINY-Lung02 客观缓解率 (ORR) 达 49%~53%</strong>：突破肺癌少见突变无药困境</span>
        </span>
        <span className="text-[10px] font-mono text-sky-400 shrink-0 ml-2">T-DXd (德曲妥珠单抗)</span>
      </div>
    </div>
  );
}
