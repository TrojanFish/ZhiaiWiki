import React from 'react';
import { Zap, BookOpen, X, ExternalLink } from 'lucide-react';
import type { EdgeEvidence } from '@/lib/knowledgeGraphData';
import { MiniForestPlot } from '../MiniForestPlot';
import { extractStudyAcronym } from '@/lib/tagHumanizer';

export function EdgeEvidencePanel({ edgeKey: _edgeKey, evidence, onClose }: { edgeKey: string; evidence: EdgeEvidence; onClose: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-blue-200/80 flex-1 overflow-y-auto max-h-[550px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-blue-700 bg-blue-50 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200 inline-flex items-center gap-1">
              <Zap className="w-3 h-3 text-blue-600 shrink-0" />
              <span>循证因果关联</span>
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{evidence.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ml-2 flex-shrink-0"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-xs leading-relaxed mb-4">{evidence.description}</p>

      {/* Key Metric */}
      {evidence.metric && (
        <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-100 mb-4">
          <div className="text-slate-500 text-xs font-medium mb-0.5">{evidence.metric.label}</div>
          <div className="text-2xl font-black text-blue-900">{evidence.metric.value}</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-slate-600">
            <span>{evidence.metric.ci}</span>
            <span className="font-medium text-blue-700">{evidence.metric.p}</span>
          </div>
        </div>
      )}

      {/* Mini Forest Plot */}
      {evidence.forestData && evidence.forestData.length > 0 && (
        <div className="mb-4">
          <MiniForestPlot data={evidence.forestData} />
        </div>
      )}

      {/* Literature List */}
      {evidence.studies && evidence.studies.length > 0 && (
        <div>
          <p className="text-slate-800 text-xs font-bold mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>核心同行评审出处与证据溯源</span>
          </p>
          <div className="space-y-2.5">
            {evidence.studies.map((study, i) => {
              const acronym = extractStudyAcronym({ title: study.title });
              return (
                <div key={i} className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/90 space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {acronym && (
                      <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
                        {acronym}
                      </span>
                    )}
                    <span className="text-slate-900 font-bold text-xs">{study.journal}</span>
                    <span className="text-slate-400 text-xs font-mono tabular-nums">· {study.year}</span>
                  </div>
                  <p className="text-slate-900 text-xs font-semibold leading-snug">{study.title}</p>
                  <p className="text-slate-600 text-xs leading-relaxed">{study.conclusion}</p>
                  {study.doi && (
                    <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <a
                        href={study.doi.startsWith('http') ? study.doi : `https://doi.org/${study.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline inline-flex items-center gap-1"
                      >
                        <span>出处 DOI: {study.doi}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
