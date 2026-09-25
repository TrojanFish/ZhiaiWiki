"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search, X, CornerDownLeft, Command, Clock, Trash2, Target, Flame, Wind, Layers, Dna, Microscope, Heart, ClipboardList } from "lucide-react";
import { WIKI_TOPICS, WIKI_CATEGORIES, type WikiCategory, type WikiTopic, type RiskLevel } from "@/lib/wikiData";
import { BREAST_WIKI_TOPICS } from "@/lib/breastWikiData";
import type { PatientProfile, CancerType } from "@/lib/types";

// ── 固定策划热词胶囊 ──────────────────────────────────────────────
const HOT_KEYWORDS: Array<{ text: string; topicId: string; riskLevel: RiskLevel }> = [
  { text: "气道播散 STAS",   topicId: "stas",            riskLevel: "high"     },
  { text: "微乳头/实体型",   topicId: "iaslc-grade3",    riskLevel: "high"     },
  { text: "7组隆突下淋巴结", topicId: "mediastinal-ln",  riskLevel: "high"     },
  { text: "胸膜侵犯 VPI",    topicId: "vpi",             riskLevel: "high"     },
  { text: "EGFR 靶向治疗",   topicId: "egfr-targeted",   riskLevel: "safe"     },
  { text: "磨玻璃结节 GGO",  topicId: "ggo-evolution",   riskLevel: "low"      },
  { text: "CEA 肿瘤标志物",  topicId: "tumor-markers",   riskLevel: "moderate" },
  { text: "血管侵犯 LVI",    topicId: "lvi",             riskLevel: "high"     },
];

const BREAST_HOT_KEYWORDS: Array<{ text: string; topicId: string; riskLevel: RiskLevel }> = [
  { text: "BI-RADS 影像分级", topicId: "bi_rads_scale",             riskLevel: "moderate" },
  { text: "成簇微钙化识别",   topicId: "microcalcifications",       riskLevel: "high"     },
  { text: "HER2 靶向与 ADC",  topicId: "her2_positive_and_adc",     riskLevel: "high"     },
  { text: "Luminal 受体分型", topicId: "luminal_a_and_b",           riskLevel: "safe"     },
  { text: "21-基因免化疗",    topicId: "oncotype_dx_21_gene",       riskLevel: "safe"     },
  { text: "前哨淋巴结 SLNB",  topicId: "slnb_sentinel_nodes",       riskLevel: "moderate" },
  { text: "致密型乳腺早筛",   topicId: "breast_density",            riskLevel: "low"      },
  { text: "防患肢淋巴水肿",   topicId: "lymphedema_prevention",     riskLevel: "high"     },
];

// ── 风险等级视觉配置 ─────────────────────────────────────────────
const RISK_CONFIG: Record<RiskLevel, { badge: string; dot: string; label: string; groupLabel: string }> = {
  high:     { badge: "bg-rose-100 text-rose-700 border border-rose-200",          dot: "bg-rose-500",    label: "高危",     groupLabel: "高危指标" },
  moderate: { badge: "bg-amber-100 text-amber-700 border border-amber-200",        dot: "bg-amber-500",   label: "中危",     groupLabel: "中危因素" },
  low:      { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",  dot: "bg-emerald-500", label: "低危",     groupLabel: "低危/惰性" },
  safe:     { badge: "bg-teal-100 text-teal-700 border border-teal-200",           dot: "bg-teal-500",    label: "安全基石", groupLabel: "安全基石" },
};

// ── 建议 #6: 埋点日志与本地高频词条分析 ───────────────────────────
function logSearchEvent(type: "search_query" | "topic_jump" | "hot_click", data: Record<string, any>) {
  try {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") {
      console.log(`[WikiSearchAnalytics] [${type}]`, data);
    }
    const stats = JSON.parse(localStorage.getItem("oncopath_wiki_search_stats") || "{}");
    const key = data.topicId || data.query;
    if (key) {
      stats[key] = (stats[key] || 0) + 1;
      localStorage.setItem("oncopath_wiki_search_stats", JSON.stringify(stats));
    }
  } catch {}
}

// ── 关键词高亮 ──────────────────────────────────────────────────
function HighlightText({ text, query, maxLen = 60 }: { text: string; query: string; maxLen?: number }) {
  const display = text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
  if (!query.trim()) return <span>{display}</span>;
  const idx = display.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{display}</span>;
  return (
    <span>
      {display.slice(0, idx)}
      <mark className="bg-amber-100 text-amber-900 border border-amber-200/80 rounded-sm px-1 py-0.5 not-italic font-semibold">
        {display.slice(idx, idx + query.length)}
      </mark>
      {display.slice(idx + query.length)}
    </span>
  );
}

interface SearchHistoryItem {
  topicId: string;
  title: string;
  riskLevel: RiskLevel;
  timestamp: number;
}

interface WikiSpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: PatientProfile | null;
  onSelectTopic: (topicId: string, category: WikiCategory) => void;
  topics?: WikiTopic[];
  cancerType?: CancerType;
}

export function WikiSpotlightSearchModal({ isOpen, onClose, userProfile, onSelectTopic, topics, cancerType = "lung" }: WikiSpotlightSearchModalProps) {
  const currentTopics: WikiTopic[] = topics || (cancerType === "breast" ? BREAST_WIKI_TOPICS : WIKI_TOPICS);
  const isBreast = cancerType === "breast";
  const hotKeywords = isBreast ? BREAST_HOT_KEYWORDS : HOT_KEYWORDS;

  const [query, setQuery] = useState("");
  const [cursorIndex, setCursorIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ── 建议 #5: 从 LocalStorage 读取最近 5 条查阅历史（严格限定当前癌种，严禁跨癌种串扰） ──────────────
  const loadSearchHistory = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("oncopath_wiki_search_history");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((item) => currentTopics.some((t) => t.id === item.topicId));
          setSearchHistory(filtered.slice(0, 5));
        }
      }
    } catch {}
  }, [currentTopics]);

  const saveToHistory = useCallback((topic: WikiTopic) => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("oncopath_wiki_search_history");
      let list: SearchHistoryItem[] = raw ? JSON.parse(raw) : [];
      // 去重并置顶
      list = list.filter((item) => item.topicId !== topic.id);
      list.unshift({
        topicId: topic.id,
        title: topic.title,
        riskLevel: topic.riskLevel,
        timestamp: Date.now(),
      });
      list = list.slice(0, 10);
      localStorage.setItem("oncopath_wiki_search_history", JSON.stringify(list));
      // 重新按当前癌种装载
      loadSearchHistory();
    } catch {}
  }, [loadSearchHistory]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem("oncopath_wiki_search_history");
      setSearchHistory([]);
    } catch {}
  }, []);

  // ── 档案专属推荐（严格限定当前癌种，严防跨癌种推荐） ───────────────────
  const profileMatches = useMemo<WikiTopic[]>(() => {
    if (!userProfile) return [];
    const profileCancerType = userProfile.cancerType || "lung";
    if (profileCancerType !== cancerType) return [];

    const ids: string[] = [];
    if (cancerType === "breast") {
      if (userProfile.erStatus === "positive" || userProfile.prStatus === "positive") ids.push("luminal_a_and_b");
      if (userProfile.her2Status === "positive" || userProfile.her2Low || userProfile.her2Status === "3+") ids.push("her2_positive_and_adc");
      if (userProfile.oncotypeDxScore != null) ids.push("oncotype_dx_21_gene");
      if (userProfile.biRads != null) ids.push("bi_rads_scale");
      if (userProfile.calcificationType) ids.push("microcalcifications");
      if (userProfile.nottinghamGrade || userProfile.grade) ids.push("nottingham_grade");
      if (userProfile.sentinelNodesPositive != null || userProfile.axillaryNodesPositive != null) ids.push("slnb_sentinel_nodes");
      if (userProfile.molecularSubtype === "TNBC" || userProfile.molecularSubtype === "Triple_Negative") ids.push("triple_negative_tnbc");
      return ids.map((id) => currentTopics.find((t) => t.id === id)).filter(Boolean) as WikiTopic[];
    }

    if (cancerType === "lung") {
      if (userProfile.stas === "positive") ids.push("stas");
      if (userProfile.vpi === "positive") ids.push("vpi");
      if (userProfile.lvi === "positive") ids.push("lvi");
      if (userProfile.egfr === "positive") ids.push("egfr-targeted");
      if (userProfile.iaslcGrade === "3") ids.push("iaslc-grade3");
      if (userProfile.morphology === "mixed_ggo" || (userProfile.ctr && userProfile.ctr > 0)) ids.push("ggo-evolution");
      return ids.map((id) => currentTopics.find((t) => t.id === id)).filter(Boolean) as WikiTopic[];
    }

    return [];
  }, [userProfile, cancerType, currentTopics]);

  // ── 实时搜索结果 ──────────────────────────────────────────────
  const searchResults = useMemo<WikiTopic[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return currentTopics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.subtitle && t.subtitle.toLowerCase().includes(q)) ||
        t.metaphor.toLowerCase().includes(q) ||
        t.clinicalTruth.toLowerCase().includes(q) ||
        t.searchKeywords.some((kw) => kw.toLowerCase().includes(q))
    ).sort((a, b) => b.priorityOrder - a.priorityOrder);
  }, [query, currentTopics]);

  // ── 建议 #3: 搜索结果按风险等级分组 ─────────────────────────────
  const groupedResults = useMemo(() => {
    const order: RiskLevel[] = ["high", "moderate", "low", "safe"];
    return order.map((level) => ({ level, items: searchResults.filter((t) => t.riskLevel === level) })).filter((g) => g.items.length > 0);
  }, [searchResults]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setCursorIndex(-1);
      loadSearchHistory();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, loadSearchHistory]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSelect = useCallback((topic: WikiTopic) => {
    saveToHistory(topic);
    logSearchEvent("topic_jump", { topicId: topic.id, title: topic.title, query });
    onClose();
    onSelectTopic(topic.id, topic.category);
  }, [onClose, onSelectTopic, saveToHistory, query]);

  const handleHotKeyword = useCallback((topicId: string) => {
    const topic = currentTopics.find((t) => t.id === topicId);
    if (topic) {
      logSearchEvent("hot_click", { topicId });
      handleSelect(topic);
    }
  }, [handleSelect, currentTopics]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setCursorIndex((i) => Math.min(i + 1, searchResults.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursorIndex((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && cursorIndex >= 0) { e.preventDefault(); handleSelect(searchResults[cursorIndex]); }
  }, [searchResults, cursorIndex, handleSelect]);

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;
  const hasResults = searchResults.length > 0;

  const panelContent = (isMobile: boolean) => (
    <div className={`bg-white flex flex-col overflow-hidden shadow-2xl border border-slate-200 ${isMobile ? "rounded-t-3xl max-h-[82vh] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]" : "rounded-3xl max-h-[70vh]"}`}>
      {/* 1. Header */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-slate-100 shrink-0">
        <Search className="w-5 h-5 text-blue-500 shrink-0" />
        <input
          ref={isMobile ? undefined : inputRef}
          type="text"
          value={query}
          onChange={(e) => { 
            const val = e.target.value;
            setQuery(val); 
            setCursorIndex(-1);
            if (val.trim()) {
              logSearchEvent("search_query", { query: val.trim() });
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="搜索词条、指标或症状…如 STAS、磨玻璃、EGFR、7组…"
          className="flex-1 text-base sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors shrink-0" aria-label="关闭搜索">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Body */}
      <div ref={isMobile ? undefined : listRef} className="flex-1 overflow-y-auto overscroll-contain">
        {!hasQuery && (
          <div className="p-4 sm:p-5 space-y-5">
            {/* 建议 #5: 最近查阅历史 */}
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>最近查阅记录</span>
                  </p>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[10px] text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>清空</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {searchHistory.map((item) => (
                    <button
                      key={item.topicId}
                      type="button"
                      onClick={() => handleHotKeyword(item.topicId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${RISK_CONFIG[item.riskLevel]?.dot || 'bg-slate-400'}`} />
                      <span>{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 档案专属推荐 */}
            {profileMatches.length > 0 && (
              <div>
                <p className="text-[11px] font-extrabold text-teal-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 shrink-0" />
                  <span>基于您的病历档案——专属关联词条</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {profileMatches.map((t) => (
                    <button key={t.id} type="button" onClick={() => handleSelect(t)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold hover:bg-teal-100 transition-colors cursor-pointer">
                      <span>{t.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${RISK_CONFIG[t.riskLevel].badge}`}>{RISK_CONFIG[t.riskLevel].label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 高频热词 */}
            <div>
              <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>临床高频速查</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {hotKeywords.map((hw) => (
                  <button key={hw.topicId} type="button" onClick={() => handleHotKeyword(hw.topicId)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${RISK_CONFIG[hw.riskLevel].dot}`} />
                    <span>{hw.text}</span>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center pb-1">输入关键词即时联想全部 {currentTopics.length} 个词条 · 支持中文 / 英文 / 拼音首字母</p>
          </div>
        )}

        {/* 建议 #3: 搜索结果分组渲染 */}
        {hasQuery && hasResults && (
          <div className="py-2">
            {(() => {
              let globalIdx = 0;
              return groupedResults.map(({ level, items }) => (
                <div key={level}>
                  <div className="px-4 sm:px-5 py-2 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${RISK_CONFIG[level].dot}`} />
                      <span>{RISK_CONFIG[level].groupLabel}</span>
                    </span>
                  </div>
                  {items.map((topic) => {
                    const idx = globalIdx++;
                    const isActive = cursorIndex === idx;
                    return <ResultItem key={topic.id} topic={topic} query={query} isActive={isActive} onHover={() => setCursorIndex(idx)} onSelect={() => handleSelect(topic)} />;
                  })}
                </div>
              ));
            })()}
          </div>
        )}

        {hasQuery && !hasResults && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-700 mb-1">未找到与「{query}」相关的词条</p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">请尝试近义词，如「气道播散」代替「STAS」，或使用英文缩写如「VPI」「EGFR」</p>
          </div>
        )}
      </div>

      {/* 3. Footer（桌面键盘提示） */}
      <div className="hidden sm:flex items-center justify-between px-5 py-2.5 border-t border-slate-100 shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold text-[10px]">↑↓</kbd><span>选择</span></span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold text-[10px]">↵</kbd><span>跳转</span></span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold text-[10px]">Esc</kbd><span>关闭</span></span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Command className="w-3 h-3" /><span className="font-mono">K</span><span className="ml-1">/ Ctrl+K 随时呼出</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-[9998] bg-slate-950/70 backdrop-blur-md animate-fade-in" onClick={onClose} aria-hidden="true" />
      {/* 建议 #2: 桌面浮窗 */}
      <div className="fixed inset-0 z-[9999] hidden sm:flex items-start justify-center pt-[12vh] px-4 pointer-events-none">
        <div className="w-full max-w-2xl pointer-events-auto animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
          {panelContent(false)}
        </div>
      </div>
      {/* 建议 #2: 移动端底部抽屉 Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-[9999] sm:hidden animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center pt-2.5 pb-1"><div className="sheet-grabber !my-0" /></div>
        {panelContent(true)}
      </div>
    </>
  );
}

function ResultItem({ topic, query, isActive, onHover, onSelect }: { topic: WikiTopic; query: string; isActive: boolean; onHover: () => void; onSelect: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const risk = RISK_CONFIG[topic.riskLevel];
  const catLabel = WIKI_CATEGORIES[topic.category]?.label ?? "";

  useEffect(() => { if (isActive) ref.current?.scrollIntoView({ block: "nearest" }); }, [isActive]);

  return (
    <button ref={ref} type="button" role="option" onClick={onSelect} onMouseEnter={onHover}
      className={`w-full flex items-start gap-3 px-4 sm:px-5 py-3 transition-colors cursor-pointer text-left border-l-2 ${isActive ? "bg-blue-50 border-blue-400" : "border-transparent hover:bg-slate-50"}`}
      aria-selected={isActive}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5 ${isActive ? "bg-blue-100" : "bg-slate-100"}`}>
        {topic.icon === "wind" ? <Wind className="w-4 h-4 text-sky-600" /> :
         topic.icon === "layers" ? <Layers className="w-4 h-4 text-indigo-600" /> :
         topic.icon === "dna" ? <Dna className="w-4 h-4 text-purple-600" /> :
         topic.icon === "microscope" ? <Microscope className="w-4 h-4 text-teal-600" /> :
         topic.icon === "heart" ? <Heart className="w-4 h-4 text-rose-600" /> :
         <ClipboardList className="w-4 h-4 text-slate-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-extrabold text-slate-900"><HighlightText text={topic.title} query={query} maxLen={40} /></span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${risk.badge}`}>{risk.label}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-1"><HighlightText text={topic.metaphor} query={query} maxLen={55} /></p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span className="text-[10px] text-slate-400 font-medium">{catLabel}</span>
          {topic.searchKeywords.slice(0, 3).map((kw) => (<span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">{kw}</span>))}
        </div>
      </div>
      <CornerDownLeft className={`w-4 h-4 shrink-0 mt-1 transition-opacity ${isActive ? "text-blue-400 opacity-100" : "opacity-0"}`} />
    </button>
  );
}
