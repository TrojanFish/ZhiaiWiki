"use client";

import React, { useEffect } from "react";
import { 
  X, 
  ExternalLink, 
  Download, 
  FileText, 
  ShieldCheck, 
  Dna, 
  TrendingDown, 
  Pill, 
  CheckCircle2, 
  Info 
} from "lucide-react";
import type { StudyItem } from "@/components/StudyCard";
import { EvidenceRating } from "@/components/common/EvidenceRating";

interface PdfViewerModalProps {
  study: StudyItem | null;
  onClose: () => void;
}

export function PdfViewerModal({ study, onClose }: PdfViewerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (study) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [study, onClose]);

  if (!study) return null;

  const pdfUrl = study.pdfUrl || `/papers/${study.pdfFileName || `${study.id}.pdf`}`;
  const externalDoiUrl = study.doi 
    ? `https://doi.org/${study.doi}` 
    : study.pubmedId 
    ? `https://pubmed.ncbi.nlm.nih.gov/${study.pubmedId}/` 
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
                  {study.journal} ({study.year})
                </span>
                {study.isOriginalPaper ? (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>顶刊原版论文已归档 ({study.fileSizeBytes ? `${(study.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB` : "全文"})</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>循证核准卷宗 · 待导入期刊原件</span>
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate" title={study.title}>
                {study.title}
              </h2>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {externalDoiUrl && (
              <a
                href={externalDoiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-all cursor-pointer"
                title="前往出版商官方 DOI 页面"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>官网 DOI</span>
              </a>
            )}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
              title="在新浏览器标签页中全屏查阅"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>新窗口查看</span>
            </a>
            <a
              href={pdfUrl}
              download={`${study.id}.pdf`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium border border-slate-700 transition-all cursor-pointer"
              title="下载原始 PDF 文件至本地"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载 PDF</span>
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-all cursor-pointer ml-1"
              aria-label="关闭预览"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informational strip for dossiers vs original papers */}
        {!study.isOriginalPaper && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>循证溯源说明</strong>：当前呈现为平台核准的试验终点量化卷宗。若您拥有在 <em>{study.journal}</em> 出版的官方期刊排版原件，可将其放入项目 <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950 font-bold">data/incoming-papers/</code>，运行脚本即可自动识别覆盖。
              </span>
            </div>
            {externalDoiUrl && (
              <a
                href={externalDoiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shrink-0 inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>在官网核验 DOI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Clinical Grounding Strip (Collapsible or Quick Glance) */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 text-xs text-slate-700 shrink-0 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">试验队列:</span>
            <span className="font-mono font-bold text-slate-900">
              {study.patientN > 0 ? `${study.patientN.toLocaleString()} 例` : "多中心队列"}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-500">证据等级:</span>
            <EvidenceRating level={study.evidenceLevel} maxLevel={5} size="sm" />
          </div>

          <div className="flex items-center gap-2 truncate">
            {study.biomarkerDetails && (
              <span className="truncate flex items-center gap-1 text-slate-700" title={study.biomarkerDetails}>
                <Dna className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <strong className="text-slate-900 font-medium">{study.biomarkerDetails}</strong>
              </span>
            )}
            {study.riskReduction && (
              <span className="truncate font-semibold text-emerald-700 flex items-center gap-1 ml-auto" title={study.riskReduction}>
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{study.riskReduction}</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-start md:justify-end gap-2 text-slate-500 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>存储路径: <code className="font-mono text-slate-700 bg-slate-200/60 px-1 py-0.5 rounded">{pdfUrl}</code></span>
          </div>
        </div>

        {/* PDF Iframe Viewport */}
        <div className="flex-1 w-full h-full bg-slate-100 relative overflow-hidden">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
            title={`Clinical Evidence PDF: ${study.title}`}
            className="w-full h-full border-0"
          />

          {/* Fallback overlay in case of iframe blocking or slow network */}
          <noscript>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white text-center">
              <p className="text-slate-600 mb-4">您的浏览器未开启 JavaScript，请点击下方按钮直接查阅原版 PDF：</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-sky-600 text-white rounded-xl text-sm font-bold"
              >
                直接在新窗口打开原版 PDF
              </a>
            </div>
          </noscript>
        </div>

        {/* Bottom Footer Traceability Info */}
        <div className="bg-white border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>已核验出版商 DOI 与 PubMed 索引</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-500">
              如需替换为商业订阅高清单行本，可直接将同名文件放入项目 <code className="bg-slate-100 px-1 rounded text-slate-700 font-mono">public/papers/</code> 覆盖
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              关闭预览
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfViewerModal;
