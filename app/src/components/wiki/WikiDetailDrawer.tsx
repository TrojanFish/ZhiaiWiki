"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Check,
  BookOpen,
  ShieldCheck,
  HelpCircle,
  HeartPulse,
  Lightbulb,
  PlusCircle,
  Image as ImageIcon,
  BookmarkCheck,
  ArrowRight,
  Maximize2,
  Minimize2,
  Compass,
  FileText,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { WikiTopic } from "@/lib/wikiData";
import { RISK_LEVEL_CONFIG, getWikiCategories } from "@/lib/wikiData";
import { cn } from "@/lib/cn";
import type { CancerType } from "@/lib/types";
import WikiTopicIcon from "./WikiTopicIcon";
import { WikiVisualRenderer } from "./WikiVisualRenderer";
import PublicWelfareBanner from "../common/PublicWelfareBanner";

// 海报模态框：仅在用户点击"生成海报"时才加载
const WikiSharePosterModal = dynamic(() => import("./WikiSharePosterModal"), {
  ssr: false,
  loading: () => null,
});

// ── 类型与 Props ─────────────────────────────────────────────────────────────
interface WikiDetailDrawerProps {
  topic: WikiTopic | null;
  allTopics: WikiTopic[];       // 用于翻页
  isMatchedProfile?: boolean;
  onClose: () => void;
  onNavigate: (topicId: string) => void; // 翻页回调
  cancerType?: CancerType;
}

// ── 主组件 ─────────────────────────────────────────────────────────────────
export function WikiDetailDrawer({
  topic,
  allTopics,
  isMatchedProfile: _isMatchedProfile,
  onClose,
  onNavigate,
  cancerType = "lung",
}: WikiDetailDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [expandedFaq, setExpandedFaq]         = useState<number | null>(null);
  const [showPosterModal, setShowPosterModal]   = useState(false);
  const [toastMessage, setToastMessage]        = useState<string | null>(null);
  const [savedQuestions, setSavedQuestions]    = useState<Record<string, boolean>>({});
  const [isVisible, setIsVisible]              = useState(false);  // 控制入场动效
  const [showVisual, setShowVisual]            = useState(true);   // 控制微观模拟器折叠展开
  const [isMaximized, setIsMaximized]          = useState(false);  // PC端全景/最大化状态
  const drawerRef                              = useRef<HTMLDivElement>(null);
  const visualContainerRef                     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 当 topic 变化时重置展开状态、触发入场动效
  useEffect(() => {
    if (topic) {
      setExpandedFaq(null);
      setSavedQuestions({});
      setShowVisual(true);
      // 次一帧触发动效（确保 CSS transition 生效）
      requestAnimationFrame(() => setIsVisible(true));
      // 聚焦抽屉（键盘可访问性）
      setTimeout(() => drawerRef.current?.focus(), 300);
    } else {
      setIsVisible(false);
      setIsMaximized(false);
    }
  }, [topic?.id]);

  // 翻页：找到当前词条在 allTopics 中的位置
  const currentIdx = topic ? allTopics.findIndex((t) => t.id === topic.id) : -1;
  const prevTopic  = currentIdx > 0               ? allTopics[currentIdx - 1] : null;
  const nextTopic  = currentIdx < allTopics.length - 1 ? allTopics[currentIdx + 1] : null;

  // 键盘快捷键体系：Escape 关闭/还原，左右方向键无缝翻页
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (e.key === "Escape") {
        if (isMaximized) {
          setIsMaximized(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        if (prevTopic) onNavigate(prevTopic.id);
      } else if (e.key === "ArrowRight") {
        if (nextTopic) onNavigate(nextTopic.id);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, onNavigate, prevTopic, nextTopic, isMaximized]);

  // 锁定背景滚动
  useEffect(() => {
    if (topic) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [topic]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToClinicQuestions = (questionText: string, customTitle?: string) => {
    if (!topic || typeof window === "undefined") return;
    try {
      const existing = localStorage.getItem("oncopath_clinic_questions");
      let list = existing ? JSON.parse(existing) : [];
      if (!Array.isArray(list)) list = [];
      const newItem = {
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: customTitle || topic.title.split("：")[0] || topic.title,
        question: questionText,
        topicId: topic.id,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      if (!list.some((item: any) => item.question === questionText)) {
        list.push(newItem);
        localStorage.setItem("oncopath_clinic_questions", JSON.stringify(list));
      }
      setSavedQuestions((prev) => ({ ...prev, [questionText]: true }));
      triggerToast("已成功加入门诊问诊清单！可在就诊便签卡与打印清单中查看。");
    } catch (e) {
      console.error("Failed to save clinic question", e);
    }
  };

  // 若 topic 为 null 且已不可见，或尚未挂载，渲染 null
  if ((!topic && !isVisible) || !mounted) return null;

  const riskCfg = topic ? RISK_LEVEL_CONFIG[topic.riskLevel] : null;
  const catCfg  = topic ? getWikiCategories(cancerType)[topic.category] : null;

  return createPortal(
    <>
      {/* ── 背景遮罩 ──────────────────────────────────────────────────────── */}
      <div
        role="presentation"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[9998] bg-slate-950/60 backdrop-blur-sm lg:backdrop-blur-md transition-opacity duration-300",
          isVisible && topic ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* ── 视口定位容器 (移动端右滑出/PC端居中宽幅工作台) ────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-[9999] pointer-events-none",
          "flex items-stretch justify-end",
          "lg:items-center lg:justify-center lg:p-6 xl:p-8"
        )}
      >
        <div
          ref={drawerRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={topic ? `${topic.title} 详细解读` : "词条详情"}
          className={cn(
            "pointer-events-auto bg-white shadow-2xl flex flex-col overflow-hidden focus:outline-none transition-all duration-300 ease-out",
            // 移动端/平板：右侧滑入抽屉 (保留极佳手机单手手感)
            "w-full sm:w-[560px] md:w-[620px] h-full",
            // PC桌面端 (lg+)：升级为居中大画幅双栏工作台
            isMaximized
              ? "lg:w-full lg:h-full lg:max-w-none lg:max-h-none lg:rounded-none lg:border-0"
              : "lg:w-[1120px] xl:w-[1260px] 2xl:w-[1380px] lg:max-w-[94vw] lg:h-[88vh] lg:max-h-[920px] lg:rounded-3xl lg:border lg:border-slate-200/90 lg:shadow-2xl lg:shadow-slate-950/25",
            // 入场动效：移动端左右平移，桌面端居中微缩放与淡入淡出
            isVisible && topic
              ? "translate-x-0 opacity-100 lg:scale-100"
              : "translate-x-full lg:translate-x-0 opacity-0 lg:scale-95 pointer-events-none"
          )}
        >
          {/* Toast 通知 */}
          {toastMessage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-fade-in max-w-[90%] pointer-events-none">
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ── 顶部标题栏 ────────────────────────────────────────────────── */}
          <div className="flex-shrink-0 flex items-start sm:items-center justify-between gap-2.5 sm:gap-3 px-4 sm:px-6 lg:px-7 py-3 sm:py-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm z-10">
            {topic && riskCfg && catCfg ? (
              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5 sm:mt-0">
                  <WikiTopicIcon icon={topic.icon} topicId={topic.id} size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border ${catCfg.badgeBg}`}>
                      {topic.subcategory || catCfg.label}
                    </span>
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${riskCfg.bg} ${riskCfg.color} ${riskCfg.border}`}>
                      {riskCfg.label.split("·")[0].trim()}
                    </span>
                    <span className="hidden xl:inline text-[10px] text-slate-400 font-medium">
                      · 知癌维基权威循证词典
                    </span>
                  </div>
                  <h2 className="text-[15px] sm:text-lg lg:text-xl font-black text-slate-900 tracking-tight leading-snug break-words">
                    {topic.title}
                  </h2>
                </div>
              </div>
            ) : (
              <div className="h-10 w-48 rounded-xl bg-slate-100 animate-pulse" />
            )}

            {/* 工具栏：最大化 + 海报 + 关闭 */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 pt-0.5 sm:pt-0">
              {topic && (
                <>
                  {/* 桌面端画幅切换按钮 */}
                  <button
                    type="button"
                    onClick={() => setIsMaximized((prev) => !prev)}
                    title={isMaximized ? "还原标准画幅 (Esc 或再次点击)" : "最大化全景工作台"}
                    className="hidden lg:flex w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 bg-slate-50 items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPosterModal(true)}
                    title="生成微信分享海报"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-blue-200 bg-blue-50/80 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-all cursor-pointer active:scale-95 shadow-xs"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭窗口 (Esc)"
                title="关闭 (Esc)"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer active:scale-95 shadow-xs"
              >
                <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            </div>
          </div>

          {/* ── 内容区 (移动端单列竖滑 / PC端Bento双栏工作台) ─────────────── */}
          <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden overscroll-contain">
            {topic ? (
              <div className="p-5 sm:p-6 lg:p-0 lg:h-full lg:grid lg:grid-cols-12 lg:divide-x lg:divide-slate-100">
                
                {/* 👈 左栏：视觉认知与直观沉浸区 (42%~45% 宽) */}
                <div className="space-y-4.5 lg:col-span-5 lg:h-full lg:overflow-y-auto lg:p-6 custom-scrollbar bg-slate-50/40">
                  {/* Section 1: 生活比喻 (首要通俗认知与情绪定心) */}
                  <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>生活比喻直观破译：</span>
                    </div>
                    <p className="text-sm text-amber-950 font-medium leading-relaxed">
                      {topic.metaphor}
                    </p>
                  </div>

                  {/* Section 2: 专属交互微观模拟器 (PC端大画幅充分舒展) */}
                  {topic.visualComponent && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-2xs">
                      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block animate-pulse" />
                          视觉微观图解与交互模拟
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowVisual((prev) => !prev)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-0.5 cursor-pointer select-none active:scale-95 transition-all"
                        >
                          <span>{showVisual ? "收起图解" : "展开图解"}</span>
                          {showVisual ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {showVisual && (
                        <div 
                          ref={visualContainerRef}
                          className="p-1 sm:p-2 max-h-[320px] sm:max-h-[360px] lg:max-h-[460px] overflow-y-auto overscroll-contain custom-scrollbar"
                        >
                          <WikiVisualRenderer visualComponent={topic.visualComponent} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Section 3: 暖心定心丸 (情绪抚慰与科学心理护航) */}
                  <div className="bg-gradient-to-br from-teal-50/90 via-emerald-50/80 to-teal-50/90 p-4 rounded-2xl border border-teal-200/80 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                        <HeartPulse className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>暖心定心丸</span>
                      </div>
                      <span className="text-[10px] text-teal-700/80 font-medium">临床护航</span>
                    </div>
                    <div className="text-sm text-teal-950 leading-relaxed whitespace-pre-line font-medium">
                      {topic.reassurance}
                    </div>
                  </div>

                  {/* Section 4: 快捷链路与档案对照 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      临床知识连接与决策辅助
                    </div>
                    <div className="flex flex-col gap-2">
                      {topic.graphNodeId ? (
                        <Link
                          href={`/knowledge?node=${encodeURIComponent(topic.graphNodeId)}`}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 px-3 py-2 rounded-xl border border-blue-100 flex items-center justify-between transition-colors group"
                        >
                          <span className="flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-blue-500" />
                            <span>代入知识图谱推演因果链</span>
                          </span>
                          <ArrowRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleAddToClinicQuestions(
                              `请问医生，结合我的报告，关于【${topic.title.split("：")[0]}】有哪些具体注意事项？`,
                              topic.title.split("：")[0]
                            )
                          }
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 px-3 py-2 rounded-xl border border-blue-100 flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <span className="flex items-center gap-1.5">
                            <PlusCircle className="w-3.5 h-3.5 text-blue-500" />
                            <span>将此条目加入门诊提问清单</span>
                          </span>
                          <ArrowRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                      <Link
                        href="/profile"
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/80 flex items-center justify-between transition-colors group"
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>对比我的档案参数</span>
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 👉 右栏：临床真相与权威循证决策区 (55%~58% 宽) */}
                <div className="mt-8 pt-7 border-t border-slate-200/90 space-y-5 lg:mt-0 lg:pt-6 lg:border-t-0 lg:col-span-7 lg:h-full lg:overflow-y-auto lg:p-6 custom-scrollbar bg-white">
                  {/* Section 1: 临床真相 */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <span>临床真相深度解读：</span>
                    </div>
                    <div className="text-sm text-slate-600 leading-relaxed space-y-2">
                      {topic.clinicalTruth.split("\n").map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        if (trimmed.startsWith("• ") || trimmed.startsWith("· ")) {
                          return (
                            <div key={idx} className="flex items-start gap-2 pl-1">
                              <span className="text-blue-500 font-bold mt-0.5 shrink-0 text-sm leading-none">•</span>
                              <span className="flex-1 text-slate-700 leading-relaxed">{trimmed.substring(2)}</span>
                            </div>
                          );
                        }
                        return <p key={idx} className="leading-relaxed text-slate-700">{line}</p>;
                      })}
                    </div>
                  </div>

                  {/* Section 2: 医学战术 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 shadow-2xs">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>现代医学的精准拦截武器：</span>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700">
                      {topic.tactics.map((tactic, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-emerald-600 font-bold mt-1 shrink-0" />
                          <span>{tactic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Section 3: 关键循证数据 */}
                  {topic.keyMetric && (
                    <div className="border-l-4 border-l-sky-600 border border-slate-200/90 bg-sky-50/30 p-4 rounded-r-2xl rounded-l-xs space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-900 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <BookmarkCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>核心循证结论与文献依据：</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100/90 px-2 py-0.5 rounded-md border border-sky-200">
                            Level 1a · Peer-Reviewed
                          </span>
                          <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 truncate max-w-[200px]">
                            {topic.keyMetric.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-900 font-mono tabular-nums leading-relaxed">
                        {topic.keyMetric.value}
                      </p>
                      <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 min-w-0 truncate">
                          <span className="text-slate-400 shrink-0">循证出处：</span>
                          <span className="text-slate-700 font-medium font-mono truncate">{topic.keyMetric.source}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden sm:inline">Oxford CEBM Standard</span>
                      </div>
                    </div>
                  )}

                  {/* Section 4: FAQ 手风琴 */}
                  {topic.faq && topic.faq.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-700 flex items-center justify-between gap-1.5">
                        <span className="flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>患者关注的高频疑问：</span>
                        </span>
                        <span className="text-[10px] text-slate-400">可一键加入门诊提问清单</span>
                      </div>
                      {topic.faq.map((item, idx) => {
                        const isSaved = savedQuestions[item.question];
                        return (
                          <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                            <button
                              onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                              className="w-full text-left p-3.5 bg-slate-50/70 hover:bg-slate-100/80 flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs font-bold text-slate-800"
                            >
                              <span className="flex-1">Q: {item.question}</span>
                              <span className="text-slate-400 shrink-0">
                                {expandedFaq === idx ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </span>
                            </button>
                            {expandedFaq === idx && (
                              <div className="p-3.5 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100 space-y-3">
                                <div className="whitespace-pre-line">
                                  <span className="font-bold text-blue-700">答：</span>{item.answer}
                                </div>
                                <div className="pt-2 border-t border-slate-100 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddToClinicQuestions(item.question, topic.title.split("：")[0]);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                                      isSaved
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                        : "bg-white hover:bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300"
                                    }`}
                                  >
                                    {isSaved ? (
                                      <><Check className="w-3.5 h-3.5 text-emerald-600" /><span>已在就医提问清单</span></>
                                    ) : (
                                      <><PlusCircle className="w-3.5 h-3.5 text-blue-600" /><span>+ 加入门诊问诊清单</span></>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Section 5: 公益同行与爱心接力卡片 */}
                  <div className="pt-2">
                    <PublicWelfareBanner sourceContext="wiki" />
                  </div>

                  {/* 移动端底部占位，避免翻页栏遮挡内容 */}
                  <div className="h-16 lg:hidden" />
                </div>

              </div>
            ) : (
              // 空状态骨架
              <div className="px-5 py-6 space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-slate-100" />
                ))}
              </div>
            )}
          </div>

          {/* ── 底部翻页导航栏 ─────────────────────────────────────────────── */}
          <div className="flex-shrink-0 border-t border-slate-100 bg-white/95 backdrop-blur-sm px-5 sm:px-6 lg:px-7 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:py-3 flex items-center justify-between gap-3 z-10">
            {/* 上一词条 */}
            <button
              type="button"
              onClick={() => prevTopic && onNavigate(prevTopic.id)}
              disabled={!prevTopic}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                prevTopic
                  ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 active:scale-95 shadow-2xs"
                  : "border-slate-100 bg-slate-50/50 text-slate-300 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline max-w-[140px] truncate">
                {prevTopic ? prevTopic.title.split("：")[0].split("(")[0].trim() : "已是第一条"}
              </span>
              <span className="sm:hidden">上一条</span>
              <span className="hidden lg:inline text-[10px] text-slate-400 font-normal">←</span>
            </button>

            {/* 当前位置指示 & 键盘快捷键提示 */}
            <div className="flex items-center gap-2.5">
              <div className="text-xs text-slate-500 font-mono tabular-nums font-semibold flex-shrink-0 bg-slate-100 px-2.5 py-1 rounded-lg">
                {currentIdx + 1} / {allTopics.length}
              </div>
              <span className="hidden lg:inline text-[11px] text-slate-400 font-medium">
                按 ← → 翻页 · Esc 关闭
              </span>
            </div>

            {/* 下一词条 */}
            <button
              type="button"
              onClick={() => nextTopic && onNavigate(nextTopic.id)}
              disabled={!nextTopic}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                nextTopic
                  ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 active:scale-95 shadow-2xs"
                  : "border-slate-100 bg-slate-50/50 text-slate-300 cursor-not-allowed"
              }`}
            >
              <span className="hidden lg:inline text-[10px] text-slate-400 font-normal">→</span>
              <span className="hidden sm:inline max-w-[140px] truncate">
                {nextTopic ? nextTopic.title.split("：")[0].split("(")[0].trim() : "已是最后条"}
              </span>
              <span className="sm:hidden">下一条</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 海报模态框（点击后才加载） */}
      {showPosterModal && topic && (
        <WikiSharePosterModal
          topic={topic}
          visualDomHtml={visualContainerRef.current?.innerHTML || undefined}
          onClose={() => setShowPosterModal(false)}
        />
      )}

      {/* 浮动提示条 */}
      {toastMessage && (
        <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0.75rem))] left-1/2 -translate-x-1/2 z-[10000] bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>,
    document.body
  );
}
