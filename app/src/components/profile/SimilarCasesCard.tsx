"use client";

import React, { useState, useEffect } from "react";
import {
  Lightbulb,
  BookOpen,
  Sun,
  Apple,
  HeartPulse,
  ShieldCheck,
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5 truncate">
              SIMILAR CLINICAL COHORTS · REAL-WORLD EVIDENCE
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto shrink-0">
          <LegalDisclaimerBadge variant="badge" />

          {/* Compact Integrated Confidence Pill */}
          <div className="flex items-center gap-2 bg-slate-50/90 border border-slate-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <div className="text-xs text-slate-500 font-bold whitespace-nowrap">循证置信度</div>
            <div className="text-slate-300">|</div>
            <span className="text-amber-600 text-xs font-bold flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-400" />
              <span>{cohort.confidenceRating}</span>
            </span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 shrink-0 whitespace-nowrap">
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
        const isMedianMode = cohort.displayMode === "median_survival" || cohort.os5Year?.includes("中位OS") || cohort.os5Year?.includes("中位 OS");
        
        const rfsTooltip = (() => {
          if (isMedianMode) {
            return {
              title: "什么是中位无进展生存期 (PFS)？",
              content: "PFS (Progression-Free Survival) 指患者接受系统治疗（靶向/免疫/化疗）后，肿瘤病灶无进展、未出现新转移且患者保持存活的中位时间。这是临床衡量一线药物控制肿瘤活力的核心指标。"
            };
          }
          const cancerExplanations: Record<string, string> = {
            lung: "肺癌术后 5 年内身体未出现任何局部肺部复发或脑/骨/肾上腺转移。肺癌复发高峰集中在术后前 2~3 年，跨过 5 年通常在临床上视为达到“临床治愈”。",
            breast: "早期乳腺癌术后 5 年内未出现胸壁复发或远处脏器转移。5 年无病生存是评估早期内分泌或靶向治疗效果、规划后续强化方案的关键分水岭。",
            colon: "结肠癌根治术后 5 年内肠管及肝脏、腹膜未见肿瘤复发。结肠癌 80% 的复发集中在术后 3 年内，满 5 年未复发意味着长期复发风险降至极低。",
            rectal: "直肠癌手术或新辅助综合治疗后，盆腔局部未复发且无远处转移。是检验全直肠系膜切除 (TME) 根治质量与多学科治疗成效的核心标尺。",
            gastric: "胃癌 D2 根治术后 5 年内残胃及吻合口、腹膜无肿瘤复发。5 年无病生存代表微小癌细胞已被彻底清除，迎来终身治愈曙光。",
            liver: "肝癌根治性切除或局部消融后 5 年内肝脏无新生癌灶、无血管转移。因肝脏常伴肝炎/硬化背景，5 年无复发是极高水准的抗复发质控指标。",
            esophageal: "食管癌根治切除或新辅助放化疗后 5 年内无原位及纵隔淋巴结复发。是突破食管癌易纵隔侵犯和局部复发瓶颈的硬核指标。",
            thyroid: "甲状腺乳头状癌/滤泡状癌术后或主动监测 5 年内无颈部淋巴结肿大或结构性复发。低危微小癌的 5 年复发率极低（通常 <3%）。",
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
          return {
            title: "什么是 5 年总生存率 (OS)？",
            content: "OS (Overall Survival) 指从确诊或根治开始，5 年后依然健在的患者百分比。这是国际公认衡量肿瘤整体长期治疗效果最高权威的“终极硬终点”。"
          };
        })();

        const metric1Title = cohort.metricLabel1 || (isMedianMode ? "中位无进展生存 (PFS)" : "5年无复发生存率 (RFS)");
        const metric1Sub = cohort.metricSubLabel1 || (isMedianMode ? "肿瘤控制周期" : (cohort.isPreOp ? "根治治愈潜力" : "无瘤生存指标"));
        const metric2Title = cohort.metricLabel2 || (isMedianMode ? "中位总生存期 (Median OS)" : "5年总生存率 (OS)");
        const metric2Sub = cohort.metricSubLabel2 || (isMedianMode ? "一线靶免突破" : "终极金标准");

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
      <div className="mt-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-teal-50/60 border border-amber-200/80 shadow-xs relative z-10">
        {/* Title Row with Compact Inline Sun Badge */}
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center text-sm sm:text-base shadow-2xs flex-shrink-0 border border-amber-300/70">
            <Sun className="w-4 h-4 text-amber-600" />
          </div>
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
            给每一位勇敢抗癌伙伴的温暖寄语：数据是群体的历史，而奇迹由您亲自书写
          </h4>
        </div>

        {/* 100% Full-Width Description Paragraph */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3.5">
          医学文献中的生存率是基于成千上万名患者大样本的历史统计概率，但<strong>落到您身上只有 0% 和 100%</strong>。现代医学已全面进入靶向、免疫、微创与分子分型的精准诊疗时代，把专业治疗交给医生，把信心与热爱留给生活：
        </p>

        {/* 3 Full-Width Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200/70 shadow-2xs">
            <div className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
              <Apple className="w-3.5 h-3.5 text-amber-700" />
              <span>营养与强健体魄</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              保证优质蛋白摄入，温和散步或太极八段锦，激活机体杀伤性 T 细胞活力。
            </div>
          </div>

          <div className="bg-white/90 p-3.5 rounded-xl border border-teal-200/70 shadow-2xs">
            <div className="text-xs font-bold text-teal-900 mb-1 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-teal-700" />
              <span>乐观心境与神经免疫</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              研究证实良好情绪能显著降低皮质醇压力激素，为机体细胞修复创造最佳微环境。
            </div>
          </div>

          <div className="bg-white/90 p-3.5 rounded-xl border border-blue-200/70 shadow-2xs">
            <div className="text-xs font-bold text-blue-900 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>规律随访，坦然从容</span>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              按时完成专科影像超声与血液复查，把担忧托付给科学规律，每一天都充满生机与希望。
            </div>
          </div>
        </div>
      </div>

      {/* Public Welfare Love-Relay & Donation Banner */}
      <div className="mt-5">
        <PublicWelfareBanner sourceContext="profile" />
      </div>

      {/* Legal Disclaimer Guardrail Card */}
      <div className="mt-5">
        <LegalDisclaimerBadge variant="card" />
      </div>

    </div>
  );
}
