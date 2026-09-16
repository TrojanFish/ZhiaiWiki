"use client";

import React, { useState, useRef, useEffect } from "react";

import { X, Download, Check, Sparkles, HeartPulse, ShieldCheck, BookOpen, HelpCircle } from "lucide-react";
import { toPng } from "html-to-image";
import type { WikiTopic } from "@/lib/wikiData";
import { RISK_LEVEL_CONFIG, WIKI_CATEGORIES } from "@/lib/wikiData";
import { ONCOPATH_LOGO_DATA_URI } from "@/lib/brandLogo";
import WikiTopicIcon from "./WikiTopicIcon";
import { WikiVisualRenderer } from "./WikiVisualRenderer";
import ExportBrandFooter from "@/components/common/ExportBrandFooter";

interface WikiSharePosterModalProps {
  topic: WikiTopic;
  visualDomHtml?: string;
  onClose: () => void;
}

export default function WikiSharePosterModal({ topic, visualDomHtml, onClose }: WikiSharePosterModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const offscreenPosterRef = useRef<HTMLDivElement>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const riskCfg = RISK_LEVEL_CONFIG[topic.riskLevel];
  const catCfg = WIKI_CATEGORIES[topic.category];

  const handleGenerateImage = async () => {
    if (!offscreenPosterRef.current || isExporting) return;
    try {
      setIsExporting(true);
      setGenerationError(null);

      const element = offscreenPosterRef.current;
      
      if (typeof document !== "undefined" && (document as any).fonts) {
        try {
          await (document as any).fonts.ready;
        } catch {}
      }
      await new Promise((r) => setTimeout(r, 150));

      const fullWidth = 520;
      const fullHeight = element.scrollHeight;

      let imgData = "";
      try {
        imgData = await toPng(element, {
          quality: 0.98,
          pixelRatio: 2,
          skipAutoScale: true,
          fontEmbedCSS: "",
          width: fullWidth,
          height: fullHeight,
          canvasWidth: fullWidth * 2,
          canvasHeight: fullHeight * 2,
          backgroundColor: "#ffffff",
          cacheBust: true,
          style: {
            position: "static",
            display: "block",
            overflow: "visible",
            maxHeight: "none",
            height: "auto",
            transform: "none",
          },
        });
      } catch (primaryErr) {
        console.warn("Primary html-to-image failed, trying html2canvas fallback:", primaryErr);
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: fullWidth,
          height: fullHeight,
          windowWidth: fullWidth,
          windowHeight: fullHeight,
          x: 0,
          y: 0,
          scrollY: 0,
        });
        imgData = canvas.toDataURL("image/png");
      }

      if (imgData) {
        setExportedImageUrl(imgData);
      } else {
        throw new Error("生成图片数据为空");
      }
    } catch (err: any) {
      console.error("Failed to generate full wiki share poster:", err);
      setGenerationError("生成微信分享长图遇到浏览器限制，请长按下方卡片文本或使用系统截图。");
    } finally {
      setIsExporting(false);
    }
  };

  // Automatically trigger image generation when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      handleGenerateImage();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Support Esc key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDownload = () => {
    if (!exportedImageUrl) return;
    try {
      const link = document.createElement("a");
      link.href = exportedImageUrl;
      link.download = `OncoPath_${topic.id}_${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
    >
      {/* 1. Offscreen Unconstrained Rendering Container (Never Clipped) */}
      <div
        style={{
          position: "fixed",
          left: "-9999px",
          top: "0",
          width: "520px",
          overflow: "visible",
          zIndex: -100,
          pointerEvents: "none",
        }}
      >
        <div
          ref={offscreenPosterRef}
          className="w-[520px] bg-white text-slate-900 rounded-3xl p-7 shadow-2xl border border-blue-200 space-y-5 font-sans relative"
          style={{
            background: "linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 40%, #F0FDFA 100%)",
            boxSizing: "border-box",
            margin: 0,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs flex-shrink-0 bg-slate-100 border border-slate-200">
                <img src={ONCOPATH_LOGO_DATA_URI} alt="OncoPath Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-black tracking-wider text-slate-900">OncoPath · 肺癌循证决策系统</div>
                <div className="text-[10px] text-slate-500">权威医学百科 · 100% 顶刊出处可溯</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {topic.subcategory || catCfg.label}
            </span>
          </div>

          {/* Title & Badge */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center flex-shrink-0 shadow-xs">
              <WikiTopicIcon icon={topic.icon} topicId={topic.id} size={24} />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <span>{riskCfg.label}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-snug">
                {topic.title}
              </h2>
              {topic.subtitle && (
                <p className="text-[11px] text-slate-500 font-mono">
                  {topic.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Section 1: Metaphor */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5 leading-relaxed">
            <div className="text-xs font-bold text-amber-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>生活比喻直观破译：</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">{topic.metaphor}</p>
          </div>

          {/* Section 2: Visual Micro Diagram (权威医学视觉图解与征象模拟) */}
          {topic.visualComponent && (
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 overflow-hidden space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-blue-700">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>视觉微观图解与影像征象推演</span>
                </span>
                <span className="text-[10px] text-slate-400">权威循证图谱</span>
              </div>
              {visualDomHtml ? (
                <div
                  className="w-full text-slate-900"
                  dangerouslySetInnerHTML={{ __html: visualDomHtml }}
                />
              ) : (
                <div className="w-full">
                  <WikiVisualRenderer visualComponent={topic.visualComponent} />
                </div>
              )}
            </div>
          )}

          {/* Section 3: Clinical Truth */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>临床真相深度解读：</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700 leading-relaxed">
              {topic.clinicalTruth.split("\n").map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("• ") || trimmed.startsWith("· ")) {
                  return (
                    <div key={idx} className="flex items-start gap-1.5 pl-0.5">
                      <span className="text-blue-600 font-bold leading-none mt-0.5">•</span>
                      <span className="flex-1 text-slate-800">{trimmed.substring(2)}</span>
                    </div>
                  );
                }
                return <p key={idx} className="text-slate-700">{line}</p>;
              })}
            </div>
          </div>

          {/* Section 4: Tactics */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
            <div className="font-bold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>现代医学精准拦截武器：</span>
            </div>
            <ul className="space-y-1.5 pl-0.5 text-[11px] text-slate-700">
              {topic.tactics.map((tactic, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="text-emerald-950 font-medium">{tactic}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 5: Key Evidence Metric */}
          {topic.keyMetric && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between text-blue-800 font-bold gap-2">
                <span>核心循证结论与依据：</span>
                <span className="text-[10px] text-blue-700 font-normal bg-white px-2 py-0.5 rounded-full border border-blue-200 truncate max-w-[200px]">{topic.keyMetric.label}</span>
              </div>
              <p className="text-xs font-black text-blue-950 leading-relaxed">{topic.keyMetric.value}</p>
              <div className="text-[10px] text-slate-600 leading-relaxed pt-1 border-t border-blue-200/60">
                <span className="text-blue-700 font-bold">循证出处：</span>
                <span className="text-slate-700">{topic.keyMetric.source}</span>
              </div>
            </div>
          )}

          {/* Section 6: Top FAQ */}
          {topic.faq && topic.faq.length > 0 && (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>患者高频疑问速答：</span>
              </div>
              {topic.faq.slice(0, 2).map((item, idx) => (
                <div key={idx} className="space-y-1 text-[11px] border-t border-slate-100 pt-1.5 first:border-0 first:pt-0">
                  <div className="font-bold text-blue-800">问：{item.question}</div>
                  <div className="text-slate-600 leading-relaxed">答：{item.answer}</div>
                </div>
              ))}
            </div>
          )}

          {/* Section 7: Reassurance Box */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1.5 text-xs text-teal-950 leading-relaxed">
            <div className="font-bold text-teal-800 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-teal-600 shrink-0" />
              <span>暖心定心丸：</span>
            </div>
            <p className="text-[11px] leading-relaxed text-teal-900">{topic.reassurance}</p>
          </div>

          {/* Footer with lung.dpdns.org and QR code */}
          <ExportBrandFooter 
            variant="light"
            title="OncoPath 肺癌循证百科"
            subtitle="权威同行评审顶刊研究 · 破除信息壁垒"
            scanHint="扫码查阅完整知识"
          />
        </div>
      </div>

      {/* 2. Interactive Modal Dialog for User Inspection & Download */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col text-slate-900 animate-fade-in-up"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                微信高清科普长图（2x Retina 无损）
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                可保存长图，便于微信群科普分享或离线阅读
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
            aria-label="关闭窗口 (Esc)"
            title="关闭窗口 (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto bg-slate-950 flex flex-col items-center">
          {isExporting && (
            <div className="py-16 flex flex-col items-center justify-center text-slate-300 space-y-3">
              <span className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold">正在全量渲染高清长图，请稍候...</p>
            </div>
          )}

          {generationError && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-600/50 text-xs text-rose-200 text-center">
              {generationError}
            </div>
          )}

          {exportedImageUrl && !isExporting && (
            <div className="w-full flex flex-col items-center space-y-3">
              <div className="w-full max-w-[460px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
                <img
                  src={exportedImageUrl}
                  alt={topic.title}
                  className="w-full h-auto object-contain block"
                />
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                💡 手机端可长按上方长图直接存入相册；电脑端请点击下方下载按键。
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions (Standardized 3A Medical Standard) */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            关闭窗口
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting || !exportedImageUrl}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
              downloadSuccess 
                ? "bg-emerald-600 text-white shadow-emerald-500/20" 
                : "btn-primary text-white shadow-blue-500/20 disabled:opacity-60"
            }`}
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>已成功保存到本地</span>
              </>
            ) : isExporting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                <span>正在渲染高清长图...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>保存科普长图 (PNG)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
