"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { 
  Search, 
  X, 
  CornerDownLeft, 
  Wind, 
  Layers, 
  Dna, 
  Microscope, 
  Heart, 
  ClipboardList, 
  Flame, 
  Clock, 
  Target, 
  Command, 
  Trash2 
} from "lucide-react";
import type { WikiTopic, RiskLevel, WikiCategory } from "@/lib/wikiData";
import { WIKI_TOPICS, WIKI_CATEGORIES } from "@/lib/wikiData";
import { BREAST_WIKI_TOPICS } from "@/lib/breastWikiData";
import type { PatientProfile, CancerType } from "@/lib/types";

// ── 建议 #1: 风险层级配置（按恶性概率排序，红/黄/绿视觉警示） ──────────────────
const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; groupLabel: string; dot: string; badge: string; priority: number }
> = {
  high: {
    label: "高恶性度 · 侵袭性强",
    groupLabel: "高危截击 · 建议警惕或尽早干预",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border border-rose-200",
    priority: 4,
  },
  moderate: {
    label: "中等恶性度 · 进展型",
    groupLabel: "中危关注 · 规范随访或评估窗口",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
    priority: 3,
  },
  low: {
    label: "低风险 / 惰性病变",
    groupLabel: "低危随访 · 循证定心丸为主",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    priority: 2,
  },
  safe: {
    label: "安全基石 · 良好特征",
    groupLabel: "安全基石 · 预后良好特征",
    dot: "bg-teal-500",
    badge: "bg-teal-50 text-teal-700 border border-teal-200",
    priority: 1,
  },
};

// ── 建议 #4: 临床高频速查热词 ────────────────────────────────────────────────
const HOT_KEYWORDS: { text: string; topicId: string; riskLevel: RiskLevel }[] = [
  { text: "纯磨玻璃结节 (pGGO)", topicId: "pure_ggo", riskLevel: "low" },
  { text: "混合磨玻璃结节 (mGGO)", topicId: "mixed_ggo", riskLevel: "moderate" },
  { text: "气道播散 (STAS)", topicId: "stas", riskLevel: "high" },
  { text: "胸膜牵拉 / 凹陷征", topicId: "pleural_indentation", riskLevel: "moderate" },
  { text: "分叶与短毛刺", topicId: "lobulation_spiculation", riskLevel: "moderate" },
  { text: "第7组隆突下淋巴结", topicId: "ln_subcarinal_7", riskLevel: "high" },
];

const BREAST_HOT_KEYWORDS: { text: string; topicId: string; riskLevel: RiskLevel }[] = [
  { text: "微浸润性导管癌 (MIC)", topicId: "microinvasive_dcis", riskLevel: "moderate" },
  { text: "HER2 低表达 (HER2-Low)", topicId: "her2_low", riskLevel: "moderate" },
  { text: "阴性切缘标准 (No Ink)", topicId: "no_ink_on_tumor", riskLevel: "low" },
  { text: "21基因复发评分 (RS)", topicId: "oncotype_dx_rs", riskLevel: "low" },
  { text: "前哨淋巴结微转移", topicId: "sentinel_ln_macro_micro", riskLevel: "high" },
  { text: "脉管癌栓 (LVI)", topicId: "breast_lvi", riskLevel: "high" },
];

// ── 建议 #7: 关键词命中高亮组件 ──────────────────────────────────────────────
function HighlightText({ text, query, maxLen }: { text: string; query: string; maxLen?: number }) {
  if (!query.trim()) {
    const disp = maxLen && text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
    return <span>{disp}</span>;
  }
  const display = maxLen && text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
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

export function WikiSpotlightSearchModal({ 
  isOpen, 
  onClose, 
  userProfile, 
  onSelectTopic, 
  topics, 
  cancerType = "lung" 
}: WikiSpotlightSearchModalProps) {
  const currentTopics: WikiTopic[] = topics || (cancerType === "breast" ? BREAST_WIKI_TOPICS : WIKI_TOPICS);
  const isBreast = cancerType === "breast";
  const hotKeywords = isBreast ? BREAST_HOT_KEYWORDS : HOT_KEYWORDS;

  const [query, setQuery] = useState("");
  const [cursorIndex, setCursorIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ── 从 LocalStorage 读取最近 5 条查阅历史（严格限定当前癌种，严禁跨癌种串扰） ──────────────
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
      list = list.filter((item) => item.topicId !== topic.id);
      list.unshift({
        topicId: topic.id,
        title: topic.title,
        riskLevel: topic.riskLevel,
        timestamp: Date.now(),
      });
      localStorage.setItem("oncopath_wiki_search_history", JSON.stringify(list.slice(0, 10)));
      setSearchHistory(list.slice(0, 5));
    } catch {}
  }, []);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem("oncopath_wiki_search_history");
      setSearchHistory([]);
    } catch {}
  }, []);

  // ── 建议 #6: 档案专属关联推荐 ──────────────────────────────────────────────
  const profileMatches = useMemo<WikiTopic[]>(() => {
    if (!userProfile) return [];
    const matches: WikiTopic[] = [];

    if (isBreast) {
      if (userProfile.her2Status && currentTopics.some((t) => t.id === "her2_low")) {
        const her2 = currentTopics.find((t) => t.id === "her2_low");
        if (her2) matches.push(her2);
      }
      if (userProfile.lvi === "positive" || (userProfile as any).lvi === true) {
        const lvi = currentTopics.find((t) => t.id === "breast_lvi");
        if (lvi) matches.push(lvi);
      }
      if (userProfile.margin === "positive" || userProfile.marginStatus === "positive") {
        const margin = currentTopics.find((t) => t.id === "no_ink_on_tumor");
        if (margin) matches.push(margin);
      }
      if (userProfile.lymphNodes === "N1" || userProfile.nStage === "N1") {
        const sln = currentTopics.find((t) => t.id === "sentinel_ln_macro_micro");
        if (sln) matches.push(sln);
      }
      if (!userProfile.surgeryType && currentTopics.some((t) => t.id === "core_needle_biopsy")) {
        const cnb = currentTopics.find((t) => t.id === "core_needle_biopsy");
        if (cnb) matches.push(cnb);
      }
    } else {
      if (userProfile.noduleType === "pure_ggo") {
        const t = currentTopics.find((x) => x.id === "pure_ggo");
        if (t) matches.push(t);
      } else if (userProfile.noduleType === "mixed_ggo") {
        const t = currentTopics.find((x) => x.id === "mixed_ggo");
        if (t) matches.push(t);
      }
      if (userProfile.stas === "positive" || (userProfile as any).stas === true) {
        const t = currentTopics.find((x) => x.id === "stas");
        if (t) matches.push(t);
      }
      if ((userProfile as any).pleuralInvasion === "positive" || userProfile.vpi === "positive" || (userProfile as any).vpi === true) {
        const t = currentTopics.find((x) => x.id === "pleural_indentation");
        if (t) matches.push(t);
      }
      if (userProfile.lymphNodes === "N2" || userProfile.nStage === "N2") {
        const t = currentTopics.find((x) => x.id === "ln_subcarinal_7");
        if (t) matches.push(t);
      }
    }

    return matches.slice(0, 3);
  }, [userProfile, currentTopics, isBreast]);

  // ── 建议 #7: 模糊拼音 & 拼音首字母检索增强 ──────────────────────────────────
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return currentTopics.filter((t) => {
      if (t.title.toLowerCase().includes(q)) return true;
      if (t.subtitle && t.subtitle.toLowerCase().includes(q)) return true;
      if (t.metaphor.toLowerCase().includes(q)) return true;
      if (t.clinicalTruth.toLowerCase().includes(q)) return true;
      if (t.searchKeywords.some((kw) => kw.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [query, currentTopics]);

  // ── 建议 #3: 结果按风险分组并排序 ──────────────────────────────────────────
  const groupedResults = useMemo(() => {
    const groups: { level: RiskLevel; items: WikiTopic[] }[] = [
      { level: "high", items: [] },
      { level: "moderate", items: [] },
      { level: "low", items: [] },
      { level: "safe", items: [] },
    ];
    searchResults.forEach((topic) => {
      const g = groups.find((grp) => grp.level === topic.riskLevel);
      if (g) g.items.push(topic);
    });
    return groups.filter((g) => g.items.length > 0);
  }, [searchResults]);

  // ── 埋点事件记录 ────────────────────────────────────────────────────────────
  const logSearchEvent = (action: string, detail?: Record<string, unknown>) => {
    try {
      const payload = {
        action,
        timestamp: Date.now(),
        ...detail,
      };
      const key = "oncopath_wiki_search_audit";
      const exist = JSON.parse(localStorage.getItem(key) || "[]");
      exist.push(payload);
      if (exist.length > 50) exist.shift();
      localStorage.setItem(key, JSON.stringify(exist));
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      loadSearchHistory();
      setCursorIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
      setCursorIndex(-1);
    }
  }, [isOpen, loadSearchHistory]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { 
        e.preventDefault(); 
        onClose(); 
      }
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
    if (e.key === "ArrowDown") { 
      e.preventDefault(); 
      setCursorIndex((i) => Math.min(i + 1, searchResults.length - 1)); 
    } else if (e.key === "ArrowUp") { 
      e.preventDefault(); 
      setCursorIndex((i) => Math.max(i - 1, -1)); 
    } else if (e.key === "Enter" && cursorIndex >= 0) { 
      e.preventDefault(); 
      handleSelect(searchResults[cursorIndex]); 
    }
  }, [searchResults, cursorIndex, handleSelect]);

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;
  const hasResults = searchResults.length > 0;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-md animate-fade-in overflow-hidden sm:overflow-y-auto print:hidden"
    >
      {/* 3-Tier Modal Container (HIG Sheet on Mobile, Centered Card on Desktop) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] max-h-[92dvh] text-slate-900 animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-0 transition-all duration-200"
      >
        {/* iOS HIG Sheet Grabber for Mobile */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="sheet-grabber !my-0" />
        </div>

        {/* 1. Header (Search Bar & Close Controls) */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 shrink-0 bg-white">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            ref={inputRef}
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
          {query && (
            <button 
              type="button" 
              onClick={() => { setQuery(""); setCursorIndex(-1); inputRef.current?.focus(); }}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
              title="清空"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200 select-none">
            ESC
          </kbd>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors shrink-0" 
            aria-label="关闭搜索 (Esc)"
            title="关闭搜索 (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Body (Scrollable Results & Suggestions) */}
        <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar">
          {!hasQuery && (
            <div className="p-4 sm:p-5 space-y-5">
              {/* 最近查阅历史 */}
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

          {/* 搜索结果分组渲染 */}
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
        <div className="hidden sm:flex items-center justify-between px-5 py-2.5 border-t border-slate-100 shrink-0 bg-slate-50/80">
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold text-[10px] font-mono">↑↓</kbd><span>选择</span></span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold text-[10px] font-mono">↵</kbd><span>跳转</span></span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold text-[10px] font-mono">Esc</kbd><span>关闭</span></span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Command className="w-3 h-3" /><span className="font-mono">K</span><span className="ml-1">/ Ctrl+K 随时呼出</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultItem({ topic, query, isActive, onHover, onSelect }: { topic: WikiTopic; query: string; isActive: boolean; onHover: () => void; onSelect: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const risk = RISK_CONFIG[topic.riskLevel];
  const catLabel = WIKI_CATEGORIES[topic.category]?.label ?? "";

  useEffect(() => { 
    if (isActive) ref.current?.scrollIntoView({ block: "nearest" }); 
  }, [isActive]);

  return (
    <button 
      ref={ref} 
      type="button" 
      role="option" 
      onClick={onSelect} 
      onMouseEnter={onHover}
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
          {topic.searchKeywords.slice(0, 3).map((kw) => (
            <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">{kw}</span>
          ))}
        </div>
      </div>
      <CornerDownLeft className={`w-4 h-4 shrink-0 mt-1 transition-opacity ${isActive ? "text-blue-400 opacity-100" : "opacity-0"}`} />
    </button>
  );
}
