"use client";

import React from "react";
import { Dna, FlaskConical, Activity, Microscope } from "lucide-react";

// Nordhealth A.3 + Carbon C.4: 6态 Biomarker 结果颜色体系
const BIOMARKER_RESULT = {
  positive:    { icon: '+', bg: 'bg-blue-50 border-blue-200',    text: 'text-blue-800',    badge: 'bg-blue-100 text-blue-800 border-blue-200',    label: '阳性' },
  negative:    { icon: '−', bg: 'bg-slate-50 border-slate-200',  text: 'text-slate-600',   badge: 'bg-slate-100 text-slate-600 border-slate-200',  label: '阴性' },
  positive_sq: { icon: '+', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800',   badge: 'bg-amber-100 text-amber-800 border-amber-200',  label: '阳性' },
  low:         { icon: '↓', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: '低增殖' },
  medium:      { icon: '~', bg: 'bg-sky-50 border-sky-200',     text: 'text-sky-700',     badge: 'bg-sky-100 text-sky-700 border-sky-200',        label: '中增殖' },
  high:        { icon: '↑', bg: 'bg-rose-50 border-rose-200',   text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700 border-rose-200',     label: '高增殖' },
} as const;

type BiomarkerResultKey = keyof typeof BIOMARKER_RESULT;

interface BiomarkerItem {
  name: string;
  nameZh: string;
  result: BiomarkerResultKey;
  detail: string;
  clinicalMeaning: string;
}

const IHC_MARKERS: BiomarkerItem[] = [
  {
    name: 'TTF-1',
    nameZh: 'TTF-1 (甲状腺转录因子)',
    result: 'positive',
    detail: '阳性 (+)',
    clinicalMeaning: '肺腺癌特异性标记，帮助病理医生确认肿瘤来源于肺部腺体细胞，与肿瘤分期和转移无关。',
  },
  {
    name: 'Napsin A',
    nameZh: 'Napsin A',
    result: 'positive',
    detail: '阳性 (+)',
    clinicalMeaning: '协同 TTF-1 确认肺腺癌诊断，高度特异性，"阳性"仅代表病理分类，不代表病情严重程度。',
  },
  {
    name: 'P40',
    nameZh: 'P40 / P63',
    result: 'positive_sq',
    detail: '阳性 (+)',
    clinicalMeaning: '肺鳞癌特异性标记，若 TTF-1 阴性而 P40/P63 阳性，提示鳞状细胞癌，指导医生选择不同的化疗方案。',
  },
];

const KI67_LEVELS = [
  { range: '< 5%', label: '极低增殖', resultKey: 'low' as BiomarkerResultKey, desc: '细胞分裂极缓慢，肿瘤生长惰性，通常预后良好，但可能对化疗不够敏感。' },
  { range: '5% ~ 25%', label: '中等增殖', resultKey: 'medium' as BiomarkerResultKey, desc: '早期经典肺腺癌常见范围，靶向治疗响应良好。' },
  { range: '> 30%', label: '高增殖', resultKey: 'high' as BiomarkerResultKey, desc: '分裂活跃，但也意味着对靶向药物和化疗更为敏感，杀灭效率更高。' },
];

export function IhcKi67Visual() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
            <Microscope className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">免疫组化 (IHC) 与 Ki-67 增殖指数</h3>
            <p className="text-xs text-slate-500">病理报告核心指标解读</p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">病理标记</span>
      </div>

      <div className="p-4 space-y-4">
        {/* 模块 1: IHC 组织学标记 */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Dna className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">组织学特异标记</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {IHC_MARKERS.map((marker) => {
              const style = BIOMARKER_RESULT[marker.result];
              return (
                <div key={marker.name} className={`rounded-xl border p-2.5 flex flex-col gap-1.5 ${style.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{marker.name}</span>
                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${style.badge}`}>
                      <span aria-hidden="true">{style.icon}</span>
                      {style.label}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold ${style.text}`}>{marker.detail}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 模块 2: Ki-67 增殖指数 */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Activity className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Ki-67 细胞增殖活跃度</span>
          </div>
          <div className="space-y-2">
            {KI67_LEVELS.map((level) => {
              const style = BIOMARKER_RESULT[level.resultKey];
              return (
                <div key={level.range} className={`rounded-xl border p-3 flex items-start gap-3 ${style.bg}`}>
                  <div className="flex-shrink-0 text-center min-w-[72px]">
                    <div className={`text-sm font-black font-mono tabular-nums ${style.text}`}>{level.range}</div>
                    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${style.badge} mt-1`}>
                      <span aria-hidden="true">{style.icon}</span>
                      {level.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed flex-1">{level.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* NHS 白话解读卡 */}
        <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-2">
          <span className="text-xl flex-shrink-0" role="img" aria-label="提示">💡</span>
          <div>
            <p className="text-xs font-semibold text-sky-800 mb-1">通俗理解这些指标</p>
            <p className="text-xs text-sky-700 leading-relaxed">
              IHC 里的 TTF-1、Napsin A 是帮病理医生确认「这是肺腺癌还是鳞癌」的<strong>标签系统</strong>，就像身份证一样，<strong>阳性只是一种分类，不等于病情重或危险</strong>。Ki-67 则是看肿瘤细胞分裂的快慢，数值高意味着癌细胞更活跃，但同时也对靶向药和化疗<strong>更加敏感</strong>。
            </p>
          </div>
        </div>

        {/* 循证出处 */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <FlaskConical className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-400">
            IHC 判读标准参考：<span className="font-medium text-slate-500">WHO Classification of Thoracic Tumours (2021)</span>
            {' · '}Ki-67 临界值参考：<span className="font-medium text-slate-500">IASLC/ATS/ERS 肺腺癌分类标准</span>
          </p>
        </div>
      </div>
    </div>
  );
}
