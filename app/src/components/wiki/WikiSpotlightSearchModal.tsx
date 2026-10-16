"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
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
import { WIKI_TOPICS } from "@/lib/wikiData";
import { BREAST_WIKI_TOPICS } from "@/lib/breastWikiData";
import type { PatientProfile, CancerType } from "@/lib/types";
import { useCancerType } from "@/components/common/CancerSwitch";
import { CancerRegistry } from "@/lib/cancerRegistry";

// ── 风险层级配置（按恶性概率排序，红/黄/绿视觉警示） ──────────────────
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

// ── 12 大实体肿瘤专区临床高频速查热词库 ─────────────────────────────────
const CANCER_HOT_KEYWORDS: Record<CancerType, Array<{ text: string; topicId: string; riskLevel: RiskLevel }>> = {
  lung: [
    { text: "气道播散 (STAS)", topicId: "stas", riskLevel: "high" },
    { text: "混合磨玻璃结节 (mGGO)", topicId: "mixed_ggo", riskLevel: "moderate" },
    { text: "纯磨玻璃结节 (pGGO)", topicId: "pure_ggo", riskLevel: "low" },
    { text: "胸膜侵犯 (VPI)", topicId: "vpi", riskLevel: "high" },
    { text: "胸膜牵拉 / 凹陷征", topicId: "pleural_indentation", riskLevel: "moderate" },
    { text: "第7组隆突下淋巴结", topicId: "ln_subcarinal_7", riskLevel: "high" },
  ],
  breast: [
    { text: "微浸润性导管癌 (MIC)", topicId: "microinvasive_dcis", riskLevel: "moderate" },
    { text: "HER2 低表达 (HER2-Low)", topicId: "her2_low", riskLevel: "moderate" },
    { text: "阴性切缘标准 (No Ink)", topicId: "no_ink_on_tumor", riskLevel: "low" },
    { text: "21基因复发评分 (RS)", topicId: "oncotype_dx_rs", riskLevel: "low" },
    { text: "前哨淋巴结微转移", topicId: "sentinel_ln_macro_micro", riskLevel: "high" },
  ],
};

// ── 关键词命中高亮组件 ──────────────────────────────────────────────
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
  cancerType: propCancerType 
}: WikiSpotlightSearchModalProps) {
  const { cancerType: contextCancerType } = useCancerType();
  const cancerType = propCancerType || contextCancerType || "lung";
  const plugin = useMemo(() => CancerRegistry.get(cancerType), [cancerType]);

  // Dynamic Topic List: from props or active cancer plugin registry
  const currentTopics: WikiTopic[] = useMemo(() => {
    if (topics && topics.length > 0) return topics;
    try {
      if (plugin?.content?.wikiTopics && plugin.content.wikiTopics.length > 0) {
        return plugin.content.wikiTopics as WikiTopic[];
      }
    } catch {}
    return cancerType === "breast" ? BREAST_WIKI_TOPICS : WIKI_TOPICS;
  }, [topics, plugin, cancerType]);

  // Dynamic Hot Keywords tailored to current cancer zone
  const hotKeywords = useMemo(() => {
    if (CANCER_HOT_KEYWORDS[cancerType]) {
      return CANCER_HOT_KEYWORDS[cancerType];
    }
    // Fallback: take top 6 topics from currentTopics
    return currentTopics.slice(0, 6).map((t) => ({
      text: t.title,
      topicId: t.id,
      riskLevel: t.riskLevel,
    }));
  }, [cancerType, currentTopics]);

  // Dynamic Placeholder tailored to current cancer zone
  const placeholder = useMemo(() => {
    switch (cancerType) {
      case "breast":
        return "搜索【乳腺癌】词条、指标或分型…如 BI-RADS、HER2、21基因、微钙化…";
      default:
        return "搜索【肺癌】词条、指标或症状…如 STAS、磨玻璃、EGFR、7组淋巴结…";
    }
  }, [cancerType]);

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [cursorIndex, setCursorIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ── 从 LocalStorage 读取最近 5 条查阅历史（严格限定当前癌种，严禁跨癌种串扰） ──────────────
  const loadSearchHistory = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(`zhiaiwiki_wiki_search_history_${cancerType}`) || localStorage.getItem("zhiaiwiki_wiki_search_history");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((item) => currentTopics.some((t) => t.id === item.topicId));
          setSearchHistory(filtered.slice(0, 5));
        }
      }
    } catch {}
  }, [cancerType, currentTopics]);

  const saveToHistory = useCallback((topic: WikiTopic) => {
    try {
      if (typeof window === "undefined") return;
      const key = `zhiaiwiki_wiki_search_history_${cancerType}`;
      const raw = localStorage.getItem(key);
      let list: SearchHistoryItem[] = raw ? JSON.parse(raw) : [];
      list = list.filter((item) => item.topicId !== topic.id);
      list.unshift({
        topicId: topic.id,
        title: topic.title,
        riskLevel: topic.riskLevel,
        timestamp: Date.now(),
      });
      localStorage.setItem(key, JSON.stringify(list.slice(0, 10)));
      setSearchHistory(list.slice(0, 5));
    } catch {}
  }, [cancerType]);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(`zhiaiwiki_wiki_search_history_${cancerType}`);
      setSearchHistory([]);
    } catch {}
  }, [cancerType]);

  // ── 建议 #3: 基于用户病历档案的个性化置顶推荐 ────────────────────────────
  const profileMatches = useMemo<WikiTopic[]>(() => {
    if (!userProfile) return [];
    return currentTopics.filter((t) => {
      // 肺癌特征匹配
      if (userProfile.stas === "positive" && t.id.includes("stas")) return true;
      if (userProfile.vpi === "positive" && t.id.includes("vpi")) return true;
      if (userProfile.lvi === "positive" && (t.id.includes("lvi") || t.id.includes("vascular"))) return true;
      if (userProfile.morphology === "mixed_ggo" && t.id.includes("mixed_ggo")) return true;
      if (userProfile.morphology === "pure_ggo" && t.id.includes("pure_ggo")) return true;
      if ((userProfile as any).pleuralIndentation && t.id.includes("pleural")) return true;
      if (userProfile.stage && t.id.includes("stage")) return true;
      // 实体瘤通用匹配
      if ((userProfile as any).her2Status && t.id.includes("her2")) return true;
      if ((userProfile as any).msiStatus && t.id.includes("msi")) return true;
      if ((userProfile as any).brafStatus && t.id.includes("braf")) return true;
      return false;
    }).slice(0, 3);
  }, [userProfile, currentTopics]);

  // ── 建议 #2: 智能模糊搜索（多字段加权 + 拼音首字母 + 别名） ───────────────
  const searchResults = useMemo<WikiTopic[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const scored: { topic: WikiTopic; score: number }[] = [];

    for (const topic of currentTopics) {
      let score = 0;
      const titleLower = topic.title.toLowerCase();
      const defLower   = (topic.clinicalTruth || (topic as any).summary || (topic as any).definition || topic.subtitle || "").toLowerCase();

      // 1. 标题完全匹配或前缀匹配（权重最高）
      if (titleLower === q) score += 100;
      else if (titleLower.startsWith(q)) score += 50;
      else if (titleLower.includes(q)) score += 30;

      // 2. 搜索关键词 / 缩写 / 别名匹配（权重次高）
      const allKws = [...(topic.searchKeywords || []), ...(((topic as any).synonyms as string[]) || [])];
      for (const kw of allKws) {
        const kwLower = kw.toLowerCase();
        if (kwLower === q) score += 80;
        else if (kwLower.startsWith(q)) score += 40;
        else if (kwLower.includes(q)) score += 20;
      }

      // 3. 临床释义文本命中（补充匹配）
      if (defLower.includes(q)) score += 10;

      // 4. 拼音首字母匹配（由 searchKeywords 携带）
      const pinyinHits = (topic.searchKeywords || []).filter((kw) => kw.toLowerCase().startsWith(q));
      if (pinyinHits.length > 0) score += 25;

      if (score > 0) {
        // 建议 #1 恶性风险级别加权：高危病理词条适度前置
        const riskWeight = RISK_CONFIG[topic.riskLevel]?.priority || 1;
        scored.push({ topic, score: score + riskWeight * 2 });
      }
    }

    return scored.sort((a, b) => b.score - a.score).map((s) => s.topic);
  }, [query, currentTopics]);

  // ── 建议 #1: 搜索结果按风险等级分组 ─────────────────────────────────────────
  const groupedResults = useMemo(() => {
    if (!query.trim()) return [];
    const groups: { level: RiskLevel; items: WikiTopic[] }[] = [];
    const order: RiskLevel[] = ["high", "moderate", "low", "safe"];

    for (const level of order) {
      const items = searchResults.filter((t) => t.riskLevel === level);
      if (items.length > 0) {
        groups.push({ level, items });
      }
    }
    return groups;
  }, [searchResults, query]);

  // ── 建议 #8: 搜索行为审计日志 ────────────────────────────────────────────────
  const logSearchEvent = (action: string, detail: Record<string, any>) => {
    try {
      if (typeof window === "undefined") return;
      const payload = {
        action,
        cancerType,
        ...detail,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };
      const key = "zhiaiwiki_wiki_search_audit";
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
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 80);
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

  const handleHotKeyword = useCallback((topicId: string, kwText?: string) => {
    // 1. Direct ID match
    let topic = currentTopics.find((t) => t.id === topicId);
    // 2. Partial ID match
    if (!topic) {
      topic = currentTopics.find((t) => t.id.includes(topicId) || topicId.includes(t.id));
    }
    // 3. Keyword / title fallback match
    if (!topic && kwText) {
      topic = currentTopics.find((t) => t.title.includes(kwText) || (t.searchKeywords || []).some((k: string) => k.includes(kwText)));
    }
    if (topic) {
      logSearchEvent("hot_click", { topicId: topic.id });
      handleSelect(topic);
    } else {
      if (kwText) {
        setQuery(kwText);
      }
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

  if (!isOpen || !mounted) return null;

  const hasQuery = query.trim().length > 0;
  const hasResults = searchResults.length > 0;

  return createPortal(
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-md animate-fade-in overflow-hidden sm:overflow-y-auto print:hidden"
    >
      {/* 3-Tier Modal Container (HIG Sheet on Mobile, Centered Card on Desktop) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] max-h-[92dvh] text-slate-900 animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-0"
      >
        {/* iOS HIG Sheet Grabber for Mobile */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="sheet-grabber !my-0" />
        </div>

        {/* 1. Header (Search Bar & Close Controls) */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 shrink-0 bg-white">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          
          {/* Active Cancer Zone Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] sm:text-xs font-bold shrink-0 select-none">
            <span>{plugin.icon}</span>
            <span>{plugin.name}专区</span>
          </span>

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
            placeholder={placeholder}
            className="flex-1 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none min-w-0"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button 
              type="button" 
              onClick={() => { setQuery(""); setCursorIndex(-1); inputRef.current?.focus({ preventScroll: true }); }}
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
                      <span>【{plugin.name}】最近查阅记录</span>
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
                        onClick={() => handleHotKeyword(item.topicId, item.title)}
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
                    <span>基于您的【{plugin.name}】病历档案——专属关联词条</span>
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
                  <span>【{plugin.name}】临床高频速查</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {hotKeywords.map((hw) => (
                    <button key={hw.topicId} type="button" onClick={() => handleHotKeyword(hw.topicId, hw.text)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${RISK_CONFIG[hw.riskLevel]?.dot || 'bg-slate-400'}`} />
                      <span>{hw.text}</span>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center pb-1">输入关键词即时联想【{plugin.name}】全部 {currentTopics.length} 个词条 · 支持中文 / 英文 / 拼音首字母</p>
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

          {/* 无结果兜底 */}
          {hasQuery && !hasResults && (
            <div className="p-8 sm:p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Command className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">未找到与 &quot;{query}&quot; 相关的【{plugin.name}】百科词条</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  建议尝试搜索标准医学简称（如 {hotKeywords.slice(0, 3).map(k => k.text.split(' ')[0]).join('、')}）、拼音首字母或关键临床指标
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Footer (Hotkeys Tip) */}
        <div className="hidden sm:flex items-center justify-between px-5 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 select-none shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-2xs">↓</kbd>
              <span>导航切换</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-2xs">↵</kbd>
              <span>直达深度抽屉</span>
            </span>
          </div>
          <span>知癌维基 · 【{plugin.name}】临床词条检索系统</span>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── 单条搜索结果项组件 ────────────────────────────────────────────────────────
interface ResultItemProps {
  topic: WikiTopic;
  query: string;
  isActive: boolean;
  onHover: () => void;
  onSelect: () => void;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  imaging:    { label: "影像学",   icon: Layers },
  pathology:  { label: "病理学",   icon: Microscope },
  molecular:  { label: "分子变异", icon: Dna },
  staging:    { label: "分期与治疗", icon: ClipboardList },
  rehab:      { label: "康复随访", icon: Heart },
  default:    { label: "临床词条", icon: Wind },
};

function ResultItem({ topic, query, isActive, onHover, onSelect }: ResultItemProps) {
  const meta = CATEGORY_META[topic.category] || CATEGORY_META.default;
  const CategoryIcon = meta.icon;
  const risk = RISK_CONFIG[topic.riskLevel] || RISK_CONFIG.low;

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onHover}
      role="button"
      tabIndex={0}
      className={`px-4 sm:px-5 py-3 flex items-start gap-3 cursor-pointer transition-colors duration-150 ${
        isActive ? "bg-blue-50/90 text-blue-900 border-l-3 border-blue-600" : "hover:bg-slate-50 text-slate-800"
      }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
        isActive ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-500"
      }`}>
        <CategoryIcon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
            <HighlightText text={topic.title} query={query} />
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${risk.badge}`}>
            {risk.label.split(" · ")[0]}
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            {(topic as any).categoryLabel || meta.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-relaxed">
          <HighlightText text={topic.clinicalTruth || (topic as any).summary || (topic as any).definition || topic.subtitle || ""} query={query} maxLen={80} />
        </p>
      </div>

      <div className={`shrink-0 flex items-center gap-1 text-[11px] self-center transition-opacity ${
        isActive ? "opacity-100 text-blue-600 font-bold" : "opacity-0"
      }`}>
        <span className="hidden sm:inline">阅读</span>
        <CornerDownLeft className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
