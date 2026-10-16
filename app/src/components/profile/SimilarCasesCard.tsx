"use client";

import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  BookOpen,
  Sun,
  Star,
  Users,
  ExternalLink,
} from "lucide-react";
import type { PatientProfile } from "@/lib/types";
import { getClinicalCohortUnified, ClinicalCohortResult } from "@/lib/stagingRegistry";
import KmSurvivalVisualizer from "./KmSurvivalVisualizer";
import LegalDisclaimerBadge from "../common/LegalDisclaimerBadge";
import PublicWelfareBanner from "../common/PublicWelfareBanner";

interface SimilarCasesCardProps {
  profile: PatientProfile;
}

export default function SimilarCasesCard({ profile }: SimilarCasesCardProps) {
  const [cohort, setCohort] = useState<ClinicalCohortResult>(() => getClinicalCohortUnified(profile));
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);

  useEffect(() => {
    // 1. Immediately synchronously update local state on any profile prop change (0ms instant response)
    const localCohort = getClinicalCohortUnified(profile);
    setCohort(localCohort);

    // 2. Concurrently sync with backend API
    let isMounted = true;
    async function syncSimilarCases() {
      try {
        const res = await fetch("/api/similar-cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        });
        const data = await res.json();
        if (data.success && isMounted && data.data) {
          setCohort(data.data);
        }
      } catch (err) {
        console.error("Notice: API sync for similar cases:", err);
      }
    }
    syncSimilarCases();

    return () => {
      isMounted = false;
    };
  }, [profile]);

  if (!cohort) return null;

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-6 md:p-7 border border-slate-200/90 shadow-sm relative group hover:border-slate-300 transition-colors duration-200">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 relative z-10 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 shrink-0" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
              相似病例群体预后分析
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
              相似病理特征前瞻队列与预后对照
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto shrink-0">
          <LegalDisclaimerBadge variant="badge" />

          {/* Compact Integrated Confidence Pill */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-50/90 border border-slate-200/90 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-2xs max-w-full">
            <span className="text-[11px] sm:text-xs text-slate-500 font-bold whitespace-nowrap hidden sm:inline">循证置信度</span>
            <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap sm:hidden">置信度</span>
            <span className="text-slate-300">|</span>
            <span className="text-amber-500 text-xs font-bold flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-400" />
              <span className="hidden sm:inline tracking-tight">{cohort.confidenceRating}</span>
              <span className="sm:hidden text-amber-600 font-mono font-bold">
                {cohort.confidenceRating?.includes("★") ? `${cohort.confidenceRating.split("★").length - 1}星` : cohort.confidenceRating}
              </span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 shrink-0 truncate max-w-[140px] sm:max-w-none">
              {cohort.confidenceLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Cohort Feature Badges Bar */}
      <div className="flex items-center gap-2 flex-wrap mb-5 relative z-10">
        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 shadow-2xs">
          <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>已匹配 <strong>{cohort.cohortSize.toLocaleString()}</strong> 例相似特征</span>
        </span>
        {cohort.hazardRatio && (
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 shrink-0 whitespace-nowrap inline-flex items-center gap-1 shadow-2xs">
            <span>HR: <strong>{cohort.hazardRatio}</strong></span>
          </span>
        )}
        {cohort.matchedMorphology && (
          <span className="text-xs font-medium text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shrink-0 whitespace-nowrap">
            {cohort.matchedMorphology}
          </span>
        )}
        {cohort.timeHorizonLabel && (
          <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shrink-0 whitespace-nowrap inline-flex items-center gap-1 shadow-2xs">
            <span>⏱️ {cohort.timeHorizonLabel}</span>
          </span>
        )}
        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 shrink-0 whitespace-nowrap">
          国际顶刊前瞻队列
        </span>
        {cohort.stage && (
          <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0 whitespace-nowrap">
            {cohort.stage}
          </span>
        )}
        {cohort.keyFactors && cohort.keyFactors.length > 0 && cohort.keyFactors.map((kf: string, idx: number) => (
          <span key={idx} className="text-xs font-medium text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shrink-0 whitespace-nowrap">
            {kf}
          </span>
        ))}
      </div>

      {/* Helper functions for cancer-specialized clinical explanations */}
      {(() => {
        const isExtendedMode = cohort.displayMode === "extended_10yr";
        const isMedianMode = cohort.displayMode === "median_survival" || (cohort.os5Year?.includes("中位OS") ?? false) || (cohort.os5Year?.includes("中位 OS") ?? false);
        
        const rfsTooltip = (() => {
          if (isMedianMode) {
            return {
              title: "什么是中位无进展生存期 (PFS)？",
              content: "PFS (Progression-Free Survival) 指患者接受系统治疗（靶向/免疫/化疗）后，肿瘤病灶无进展、未出现新转移且患者保持存活的中位时间。这是临床衡量一线药物控制肿瘤活力的核心指标。"
            };
          }
          if (isExtendedMode) {
            return {
              title: cohort.metricLabel1 ? `什么是 ${cohort.metricLabel1}？` : "什么是 10 年远期无复发生存率 (DRFS)？",
              content: "针对内分泌受体阳性 (HR+) 乳腺癌，超过 50% 的复发可能发生在确诊 5 年之后（迟发复发）。采用 10~12 年超长随访周期评估远期防复发，是指导规范内分泌强化治疗的科学金标准。"
            };
          }
          const cancerExplanations: Record<string, string> = {
            lung: "肺癌术后 5 年内身体未出现任何局部肺部复发或脑/骨/肾上腺转移。肺癌复发高峰集中在术后前 2~3 年，跨过 5 年通常在临床上视为达到“临床治愈”。",
            breast: "早期乳腺癌术后 5 年内未出现胸壁复发或远处脏器转移。5 年无病生存是评估早期内分泌或靶向治疗效果、规划后续强化方案的关键分水岭。",
          };
          const normalized = (profile.cancerType || "lung").toLowerCase();
          const detail = cancerExplanations[normalized] || cancerExplanations.lung;
          return {
            title: "什么是 5 年无复发生存率 (RFS/DFS)？",
            content: `指根治性治疗后，5 年内身体未出现任何局部复发或远处播散的患者比例。在专科临床中：${detail}`
          };
        })();

        const osTooltip = (() => {
          if (isMedianMode) {
            return {
              title: "什么是中位总生存期 (Median OS)？",
              content: "Median OS 指受试临床队列中刚好有 50% 的患者依然健在的生存时间跨度。在中晚期肿瘤全身治疗中，相比单一孤立的时间百分比，中位生存期能更敏锐、更科学地反映新型靶向联合免疫治疗带来的生存获益。"
            };
          }
          if (isExtendedMode) {
            return {
              title: cohort.metricLabel2 ? `什么是 ${cohort.metricLabel2}？` : "什么是 10~12 年总生存率 (OS)？",
              content: "超长随访中的总生存率严格追踪患者长期生存状态。对于早期乳腺癌 (如 TAILORx 队列)，10~12 年 OS 超过 93%~95% 标志着极高水准的生命安全与治愈确定性。"
            };
          }
          return {
            title: "什么是 5 年总生存率 (OS)？",
            content: "OS (Overall Survival) 指从确诊或根治开始，5 年后依然健在的患者百分比。这是国际公认衡量肿瘤整体长期治疗效果最高权威的“终极硬终点”。"
          };
        })();

        const metric1Title = cohort.metricLabel1 || (
          isMedianMode ? "中位无进展生存 (PFS)" : 
          isExtendedMode ? "10年远期无复发生存 (DRFS)" : 
          "5年无复发生存率 (RFS)"
        );
        const metric1Sub = cohort.metricSubLabel1 || (
          isMedianMode ? "肿瘤控制周期" : 
          isExtendedMode ? "远期防复发金标准" : 
          (cohort.isPreOp ? "根治治愈潜力" : "无瘤生存指标")
        );
        const metric2Title = cohort.metricLabel2 || (
          isMedianMode ? "中位总生存期 (Median OS)" : 
          isExtendedMode ? "10~12年总生存率 (OS)" : 
          "5年总生存率 (OS)"
        );
        const metric2Sub = cohort.metricSubLabel2 || (
          isMedianMode ? "一线靶免突破" : 
          isExtendedMode ? "超长前瞻随访" : 
          "终极金标准"
        );

        return (
          <div className={`grid grid-cols-1 ${cohort.metric3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"} gap-3.5 mb-5 relative z-20`}>
            
            {/* Metric 1 Card (RFS / PFS) */}
            <div 
              className="bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-white rounded-xl p-4 sm:p-5 border border-blue-100 relative transition-all hover:shadow-sm cursor-pointer"
              onMouseEnter={() => setHoveredTerm("RFS")}
              onMouseLeave={() => setHoveredTerm(null)}
              onClick={() => setHoveredTerm((prev) => (prev === "RFS" ? null : "RFS"))}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold truncate">
                  <span className="truncate">{metric1Title}</span>
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs cursor-help font-bold shadow-2xs shrink-0">
                    ?
                  </span>
                </div>
                <span className="text-xs text-blue-600 font-semibold bg-white/90 px-2 py-0.5 rounded-md border border-blue-200/60 shadow-2xs shrink-0">
                  {metric1Sub}
                </span>
              </div>

              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-700 font-mono tabular-nums tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                {cohort.rfs5Year}
              </div>

              {hoveredTerm === "RFS" && (
                <div className="absolute -top-2 left-2 right-2 sm:left-4 sm:right-4 -translate-y-full z-40 p-4 bg-slate-900/95 text-white rounded-xl shadow-xl text-xs leading-relaxed border border-slate-700 animate-fade-in">
                  <div className="font-bold text-sky-400 mb-1.5 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-sky-400" />
                    <span>{rfsTooltip.title}</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {rfsTooltip.content}
                  </p>
                </div>
              )}
            </div>

            {/* Metric 2 Card (OS / Median OS) */}
            <div 
              className="bg-gradient-to-br from-teal-50/70 via-emerald-50/40 to-white rounded-xl p-4 sm:p-5 border border-teal-100 relative transition-all hover:shadow-sm cursor-pointer"
              onMouseEnter={() => setHoveredTerm("OS")}
              onMouseLeave={() => setHoveredTerm(null)}
              onClick={() => setHoveredTerm((prev) => (prev === "OS" ? null : "OS"))}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold truncate">
                  <span className="truncate">{metric2Title}</span>
                  <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs cursor-help font-bold shadow-2xs shrink-0">
                    ?
                  </span>
                </div>
                <span className="text-xs text-teal-700 font-semibold bg-white/90 px-2 py-0.5 rounded-md border border-teal-200/60 shadow-2xs shrink-0">
                  {metric2Sub}
                </span>
              </div>

              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-teal-700 font-mono tabular-nums tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                {cohort.os5Year}
              </div>

              {hoveredTerm === "OS" && (
                <div className="absolute -top-2 left-2 right-2 sm:left-4 sm:right-4 -translate-y-full z-40 p-4 bg-slate-900/95 text-white rounded-xl shadow-xl text-xs leading-relaxed border border-slate-700 animate-fade-in">
                  <div className="font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    <span>{osTooltip.title}</span>
                  </div>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    {osTooltip.content}
                  </p>
                </div>
              )}
            </div>

            {/* Metric 3 Card (10-Year DSS / Organ Preservation / Key Breakthrough) */}
            {cohort.metric3 && (
              <div 
                className="bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-white rounded-xl p-4 sm:p-5 border border-purple-100 relative transition-all hover:shadow-sm cursor-pointer"
                onMouseEnter={() => setHoveredTerm("METRIC3")}
                onMouseLeave={() => setHoveredTerm(null)}
                onClick={() => setHoveredTerm((prev) => (prev === "METRIC3" ? null : "METRIC3"))}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold truncate">
                    <span className="truncate">{cohort.metric3.label}</span>
                    <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs cursor-help font-bold shadow-2xs shrink-0">
                      ?
                    </span>
                  </div>
                  <span className="text-xs text-purple-700 font-semibold bg-white/90 px-2 py-0.5 rounded-md border border-purple-200/60 shadow-2xs shrink-0">
                    {cohort.metric3.subLabel}
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-700 font-mono tabular-nums tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {cohort.metric3.value}
                </div>

                {hoveredTerm === "METRIC3" && (
                  <div className="absolute -top-2 left-2 right-2 sm:left-4 sm:right-4 -translate-y-full z-40 p-4 bg-slate-900/95 text-white rounded-xl shadow-xl text-xs leading-relaxed border border-slate-700 animate-fade-in">
                    <div className="font-bold text-purple-400 mb-1.5 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-purple-400" />
                      <span>{cohort.metric3.tooltipTitle}</span>
                    </div>
                    <p className="text-slate-200 text-xs leading-relaxed">
                      {cohort.metric3.tooltipContent}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        );
      })()}

      {/* Kaplan-Meier Survival Analysis Visualizer */}
      <div className="mb-5 relative z-10">
        <KmSurvivalVisualizer cohort={cohort} />
      </div>

      {/* Cohort Clinical Interpretation & Real-World Source Panel */}
      <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50/90 via-blue-50/20 to-teal-50/20 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            <Lightbulb className="w-3.5 h-3.5 text-teal-700" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
              <span>循证特征解读与随访指引</span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60">
                个体化匹配
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {cohort.description}
            </p>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium flex-wrap">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-slate-400">真实队列来源:</span>
            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-3xs">
              {cohort.source}
            </span>
            {cohort.hazardRatio && (
              <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                HR: {cohort.hazardRatio}
              </span>
            )}
            {cohort.pmid && (
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${cohort.pmid}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-md border border-sky-200 transition-colors shadow-3xs"
                title={`在 PubMed 查验原始文献 (PMID: ${cohort.pmid})`}
              >
                <span>PMID: {cohort.pmid}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {cohort.doi && (
              <a
                href={`https://doi.org/${cohort.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-200 transition-colors shadow-3xs"
                title={`访问 DOI 原文 (${cohort.doi})`}
              >
                <span>DOI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
            Oxford CEBM Level 1a · 多中心前瞻队列
          </span>
        </div>
      </div>

      {/* Warm Compassionate & Empowerment Banner */}
      <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-teal-50/60 border border-amber-200/80 shadow-2xs relative z-10 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 border border-amber-300/70 shadow-2xs mt-0.5">
          <Sun className="w-4 h-4 text-amber-600" />
        </div>
        <div className="space-y-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
            温暖寄语：数据是群体的历史，而奇迹由您亲自书写
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            医学文献中的生存率是基于成千上万名患者大样本的历史统计概率，现代医学已全面进入靶向、免疫、微创与分子精准诊疗时代。把规范治疗交给专业医生，把信心、优质营养与热爱留给生活。
          </p>
        </div>
      </div>

      {/* Public Welfare Love-Relay & Donation Banner */}
      <div className="mt-5">
        <PublicWelfareBanner sourceContext="profile" />
      </div>

    </div>
  );
}
