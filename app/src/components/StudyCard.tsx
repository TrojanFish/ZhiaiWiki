"use client";

import React, { useState } from "react";
import { 
  Dna, 
  TrendingDown, 
  Pill, 
  ExternalLink, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Sparkles 
} from "lucide-react";
import { STUDY_TYPE_LABELS } from "@/lib/evidence-data";
import { EvidenceRating, DualEvidenceBadge } from "@/components/common/EvidenceRating";
import { humanizeClinicalTag, extractStudyAcronym } from "@/lib/tagHumanizer";

import type { CancerType } from "@/lib/types";

export interface StudyItem {
  id: string;
  title: string;
  journal: string;
  year: number;
  patientN: number;
  studyType: "rct" | "meta_analysis" | "prospective_multicenter" | "retrospective_multicenter" | "retrospective" | string;
  evidenceLevel: 1 | 2 | 3 | 4 | 5 | number;
  doi?: string;
  pubmedId?: string;
  url?: string;
  pdfUrl?: string;
  pdfFileName?: string;
  hasLocalPdf?: boolean;
  isOriginalPaper?: boolean;
  fileSizeBytes?: number;
  keyConclusions: string[];
  relevantFactors: string[];
  applicableStages?: string[];
  biomarkerDetails?: string;
  interventionArm?: string;
  riskReduction?: string;
  isIngested?: boolean;
  cancerType?: CancerType | string;
}

interface StudyCardProps {
  study: StudyItem;
  compact?: boolean;
  onOpenPdf?: (study: StudyItem) => void;
  actionExtra?: React.ReactNode;
}

const studyTypeColors: Record<string, string> = {
  rct: "text-emerald-700 border-emerald-200 bg-emerald-50",
  meta_analysis: "text-purple-700 border-purple-200 bg-purple-50",
  prospective_multicenter: "text-blue-700 border-blue-200 bg-blue-50",
  retrospective_multicenter: "text-teal-700 border-teal-200 bg-teal-50",
  retrospective: "text-slate-600 border-slate-200 bg-slate-50",
};

const TAG_THEME_STYLES: Record<string, string> = {
  slate: "bg-slate-100 text-slate-700 border-slate-200/80",
  sky: "bg-sky-50 text-sky-800 border-sky-200/80",
  teal: "bg-teal-50 text-teal-800 border-teal-200/80",
  emerald: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  amber: "bg-amber-50 text-amber-900 border-amber-200/80",
  purple: "bg-purple-50 text-purple-900 border-purple-200/80",
  rose: "bg-rose-50 text-rose-900 border-rose-200/80",
};

export default function StudyCard({ study, compact = false, onOpenPdf, actionExtra }: StudyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeColor = studyTypeColors[study.studyType] || studyTypeColors.retrospective;
  const sourceUrl = study.url || (study.doi ? `https://doi.org/${study.doi}` : (study.pubmedId ? `https://pubmed.ncbi.nlm.nih.gov/${study.pubmedId}/` : null));
  const pdfUrl = study.pdfUrl || `/papers/${study.pdfFileName || `${study.id}.pdf`}`;
  const hasPdf = study.hasLocalPdf !== false;
  const studyAcronym = extractStudyAcronym(study);

  const handleOpenPdf = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenPdf) {
      onOpenPdf(study);
    } else {
      window.open(pdfUrl, "_blank");
    }
  };

  // 1. Compact View (Used in mini summaries and drawers)
  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-3.5 shadow-2xs card-hover border border-slate-200 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {studyAcronym && (
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 truncate">
                {studyAcronym}
              </span>
            )}
            <span className="text-slate-900 font-bold text-xs truncate">{study.journal}</span>
            <span className="text-slate-400 text-xs font-mono tabular-nums">{study.year}</span>
          </div>
          <span className="text-slate-500 font-mono tabular-nums text-xs font-semibold shrink-0">
            {study.patientN > 0 ? `${study.patientN.toLocaleString()}例` : ""}
          </span>
        </div>
        <p className="text-slate-700 text-xs leading-snug line-clamp-2 font-medium">{study.title}</p>
        <div className="flex items-center justify-between pt-1">
          <EvidenceRating level={study.evidenceLevel} maxLevel={5} size="sm" />
          {hasPdf && (
            <button
              type="button"
              onClick={handleOpenPdf}
              className="px-2 py-0.5 rounded-md text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="查阅原版 PDF 佐证"
            >
              <FileText className="w-3 h-3" />
              <span>PDF</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Full Standard Card (Clinical Evidence Design Triad Standard)
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 md:p-6 shadow-xs card-hover border border-slate-200/90 flex flex-col justify-between transition-all group">
      <div>
        {/* Header Row: Study Acronym, Journal, Year, Cohort Size */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            {studyAcronym && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 font-mono text-xs font-extrabold shadow-2xs">
                <Sparkles className="w-3 h-3 text-sky-600 shrink-0" />
                <span>{studyAcronym}</span>
              </span>
            )}
            <span className="text-slate-900 font-extrabold text-xs sm:text-sm">{study.journal}</span>
            <span className="text-slate-400 text-xs font-medium font-mono tabular-nums">· {study.year}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-md border font-semibold ${typeColor}`}>
              {STUDY_TYPE_LABELS[study.studyType as keyof typeof STUDY_TYPE_LABELS] || study.studyType}
            </span>
          </div>

          {/* Right: Cohort Size (Nordhealth Tabular Number Standard) */}
          <div className="flex-shrink-0 text-right">
            <div className="text-sm sm:text-base font-black font-mono tabular-nums text-slate-900 leading-none">
              {study.patientN > 0 ? study.patientN.toLocaleString() : "N/A"}
              <span className="text-slate-400 text-[10px] font-normal ml-1 font-sans">例队列</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-slate-900 text-sm font-bold leading-snug mb-3 group-hover:text-blue-700 transition-colors">
          {study.title}
        </h3>

        {/* Evidence Rating & Guidelines Double-Track Row (IBM Carbon Healthcare) */}
        <div className="flex items-center gap-2 mb-3.5 flex-wrap text-xs">
          <EvidenceRating level={study.evidenceLevel} maxLevel={5} size="sm" />
          <span className="text-slate-300 text-xs">·</span>
          <DualEvidenceBadge
            nccnCategory={study.evidenceLevel >= 4 ? "1" : study.evidenceLevel === 3 ? "2A" : "2B"}
            cscoLevel={study.evidenceLevel >= 4 ? "I" : study.evidenceLevel === 3 ? "II" : "III"}
            cscoGrade={study.evidenceLevel >= 4 ? "A" : "B"}
          />
          {hasPdf && study.isOriginalPaper && (
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1 sm:ml-auto shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>顶刊全文已归档</span>
            </span>
          )}
        </div>

        {/* Frontier Biomarker & Clinical Benefit Highlighting Bar (If present) */}
        {(study.biomarkerDetails || study.riskReduction || study.interventionArm) && (
          <div className="mb-3.5 p-2.5 sm:p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 text-xs space-y-1.5 shadow-2xs">
            {study.riskReduction && (
              <div className="text-emerald-800 font-bold flex items-center gap-1.5 font-mono tabular-nums">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>临床获益: <strong className="text-emerald-950 font-black">{study.riskReduction}</strong></span>
              </div>
            )}
            {study.biomarkerDetails && (
              <div className="text-slate-700 font-medium flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>适应特征: <strong className="font-mono text-slate-900 font-bold">{study.biomarkerDetails}</strong></span>
              </div>
            )}
            {study.interventionArm && (
              <div className="text-slate-500 text-[11px] truncate flex items-center gap-1.5" title={study.interventionArm}>
                <Pill className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>干预方案: {study.interventionArm}</span>
              </div>
            )}
          </div>
        )}

        {/* Structured Key Conclusions with Genuine Progressive Disclosure (Triad Standard) */}
        {(() => {
          const conclusions = study.keyConclusions || [];
          const hasMultiple = conclusions.length > 1;
          const firstConclusion = conclusions[0] || "";

          if (conclusions.length === 0) return null;

          return (
            <div className="mb-4 text-xs">
              <div className="text-slate-400 text-[11px] font-semibold mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>核心临床定论与终点数据</span>
                </span>
                {hasMultiple && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors px-2 py-0.5 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-200"
                  >
                    <span>{isExpanded ? "收起简述" : `展开全部终点 (${conclusions.length}项)`}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>
              
              {/* State 1: Collapsed View (Single Primary Endpoint + Disclosure Action Pill) */}
              {!isExpanded ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200 shrink-0 mt-0.5 font-mono">
                      主要终点
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {firstConclusion}
                    </p>
                  </div>

                  {hasMultiple && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(true)}
                      className="w-full py-1.5 px-3 rounded-xl text-xs font-semibold text-sky-700 bg-sky-50/80 hover:bg-sky-100 border border-sky-200/90 transition-all flex items-center justify-between cursor-pointer group/pill shadow-2xs"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-sky-600 shrink-0" />
                        <span>另有 <strong className="font-bold text-sky-900">{conclusions.length - 1}</strong> 项关键分层终点与生存获益</span>
                      </span>
                      <span className="text-[11px] font-mono text-sky-600 group-hover/pill:translate-x-0.5 transition-transform flex items-center font-bold">
                        点击展开全部 <ChevronDown className="w-3 h-3 ml-0.5" />
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                /* State 2: Expanded View (Full Clinical Evidence Dossier Container) */
                <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 space-y-2.5 transition-all shadow-inner animate-fade-in">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70 text-[11px]">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      <span>循证定论全景 (共 {conclusions.length} 项临床终点与亚组)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-0.5 cursor-pointer hover:underline"
                    >
                      <span>收起简述</span>
                      <ChevronUp className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {conclusions.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 font-mono ${
                          i === 0
                            ? "bg-teal-100 text-teal-900 border border-teal-300"
                            : "bg-sky-50 text-sky-800 border border-sky-200"
                        }`}>
                          {i === 0 ? "主要终点" : `终点分层 ${i + 1}`}
                        </span>
                        <p className="text-slate-800 font-normal leading-relaxed flex-1">
                          {c}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="w-full py-1.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <ChevronUp className="w-3 h-3" />
                    <span>收起为核心终点简述</span>
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Footer Row: Humanized Clinical Tags & Action Buttons */}
      <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left: Humanized Clinical Tags (No raw enum leaks!) */}
        <div className="flex gap-1.5 flex-wrap items-center">
          {study.relevantFactors.slice(0, 3).map((f) => {
            const human = humanizeClinicalTag(f);
            const style = TAG_THEME_STYLES[human.theme || "slate"] || TAG_THEME_STYLES.slate;
            return (
              <span
                key={f}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${style}`}
                title={f}
              >
                {human.label}
              </span>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
          {actionExtra}

          {hasPdf && study.isOriginalPaper ? (
            <button
              type="button"
              onClick={handleOpenPdf}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="查阅已归档的国际顶刊发表原版研究论文全文 (PDF)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>原版论文 (PDF)</span>
            </button>
          ) : hasPdf && !study.isOriginalPaper ? (
            <button
              type="button"
              onClick={handleOpenPdf}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="查阅临床终点与量化指标循证核查卷宗 (PDF)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>循证卷宗</span>
            </button>
          ) : null}

          {sourceUrl && (
            <a
              id={`study-source-${study.id}`}
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-medium transition-all cursor-pointer border border-slate-200/70"
              title="前往 PubMed 或出版商官网核查 DOI 出处"
            >
              <span>DOI</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
