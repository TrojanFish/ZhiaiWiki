"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { User, Search } from "lucide-react";
import Footer from "@/components/Footer";
import { WIKI_TOPICS, WIKI_CATEGORIES, getWikiCategories, type WikiCategory, type RiskLevel, type WikiTopic } from "@/lib/wikiData";
import { useCancerType } from "@/components/common/CancerSwitch";
import { CancerRegistry } from "@/lib/cancerRegistry";
import { CancerIcon } from "@/components/common/CancerIcons";

import { WikiScenarioTabs } from "@/components/wiki/WikiScenarioTabs";
import { WikiSearchBar } from "@/components/wiki/WikiSearchBar";
import { WikiCompactCard } from "@/components/wiki/WikiCompactCard";
import { WikiDetailDrawer } from "@/components/wiki/WikiDetailDrawer";
import { WikiFloatingNav } from "@/components/wiki/WikiFloatingNav";
import EmptyState from "@/components/common/EmptyState";

import type { PatientProfile } from "@/lib/types";

// ── 次要重量级模块全部按需延迟加载 ──────────────────────────────────────────
// WikiSpotlightSearchModal: 具名导出，需 .then 映射
const WikiSpotlightSearchModal = dynamic(
  () => import("@/components/wiki/WikiSpotlightSearchModal").then((m) => ({ default: m.WikiSpotlightSearchModal })),
  { ssr: false, loading: () => null }
);
// PostOpSymptomTriage: 默认导出，直接加载
const PostOpSymptomTriage = dynamic(
  () => import("@/components/profile/PostOpSymptomTriage"),
  { ssr: false, loading: () => null }
);

export default function WikiPage() {
  const { cancerType } = useCancerType();
  const allTopics: WikiTopic[] = useMemo(() => {
    try {
      const plugin = CancerRegistry.get(cancerType);
      if (plugin?.content?.wikiTopics && plugin.content.wikiTopics.length > 0) {
        return plugin.content.wikiTopics as WikiTopic[];
      }
    } catch {
      // fallback
    }
    return WIKI_TOPICS;
  }, [cancerType]);

  const [activeCategory,     setActiveCategory]     = useState<WikiCategory | "all">("all");
  const [searchQuery,        setSearchQuery]         = useState<string>("");
  const [selectedRisk,       setSelectedRisk]        = useState<RiskLevel | "all">("all");
  const [userProfile,        setUserProfile]         = useState<PatientProfile | null>(null);
  const [activeDrawerTopicId, setActiveDrawerTopicId] = useState<string | null>(null);
  const [isSpotlightOpen,    setIsSpotlightOpen]     = useState(false);

  // ── 癌种切换时重置检索与抽屉，优雅展示新癌种的完整全景大盘 ──────────────
  useEffect(() => {
    setActiveCategory("all");
    setSearchQuery("");
    setSelectedRisk("all");
    setActiveDrawerTopicId(null);
    if (typeof window !== "undefined" && window.location.hash.startsWith("#topic-")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [cancerType]);

  // ── 加载用户档案 ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("zhiaiwiki_profile") || localStorage.getItem("patient_profile");
      if (saved) setUserProfile(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load local profile:", e);
    }
  }, []);

  // ── Ctrl+K 全局快捷键 ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    const handleCustomOpen = () => setIsSpotlightOpen(true);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, []);

  // ── Deep Linking：URL hash / search params 直达抽屉 ──────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashAndParams = () => {
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(window.location.search);

      // 1. 分类过滤
      const catParam = urlParams.get("category");
      if (catParam && (catParam in WIKI_CATEGORIES || catParam === "all")) {
        setActiveCategory(catParam as WikiCategory | "all");
      } else if (hash.startsWith("#category-")) {
        const cat = hash.replace("#category-", "") as WikiCategory;
        if (cat in WIKI_CATEGORIES) setActiveCategory(cat);
      }

      // 2. 词条深链接 → 直接打开抽屉
      const topicParam = urlParams.get("topic");
      let targetTopicId = "";
      if (topicParam) {
        targetTopicId = topicParam.toLowerCase();
      } else if (hash.startsWith("#topic-")) {
        targetTopicId = hash.replace("#topic-", "").toLowerCase();
      } else if (hash.length > 1 && !hash.startsWith("#wiki-") && !hash.startsWith("#category-")) {
        const clean = hash.replace("#", "").toLowerCase();
        if (allTopics.some((t) => t.id.toLowerCase() === clean)) {
          targetTopicId = clean;
        }
      }

      if (targetTopicId) {
        const target = allTopics.find((t) => t.id.toLowerCase() === targetTopicId);
        if (target) {
          setActiveCategory(target.category);
          setSelectedRisk("all");
          setSearchQuery("");
          // 短延迟确保分类过滤生效后再打开抽屉
          setTimeout(() => setActiveDrawerTopicId(target.id), 80);
        }
      }
    };

    handleHashAndParams();
    window.addEventListener("hashchange", handleHashAndParams);
    return () => window.removeEventListener("hashchange", handleHashAndParams);
  }, [allTopics]);

  // ── 打开/关闭抽屉，并同步 URL hash ────────────────────────────────────────
  const openDrawer = useCallback((topicId: string) => {
    setActiveDrawerTopicId(topicId);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#topic-${topicId}`);
    }
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveDrawerTopicId(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  // ── Spotlight 搜索选中词条 → 滑出抽屉 ────────────────────────────────────
  const handleSelectTopicFromSpotlight = useCallback((topicId: string, category: WikiCategory) => {
    setActiveCategory(category);
    setSearchQuery("");
    setSelectedRisk("all");
    openDrawer(topicId);
  }, [openDrawer]);

  // ── 分类计数 ──────────────────────────────────────────────────────────────
  const categoryCounts = useMemo(() => {
    const currentCategories = getWikiCategories(cancerType);
    return (Object.keys(currentCategories) as WikiCategory[]).reduce((acc, key) => {
      acc[key] = allTopics.filter((t) => t.category === key).length;
      return acc;
    }, {} as Record<WikiCategory, number>);
  }, [allTopics, cancerType]);

  // ── 过滤排序 ──────────────────────────────────────────────────────────────
  const filteredTopics = useMemo(() => {
    let list = [...allTopics];
    if (activeCategory !== "all") list = list.filter((t) => t.category === activeCategory);
    if (selectedRisk !== "all") list = list.filter((t) => t.riskLevel === selectedRisk);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.subtitle && t.subtitle.toLowerCase().includes(q)) ||
          t.metaphor.toLowerCase().includes(q) ||
          t.clinicalTruth.toLowerCase().includes(q) ||
          t.searchKeywords.some((kw: string) => kw.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => b.priorityOrder - a.priorityOrder);
  }, [allTopics, activeCategory, selectedRisk, searchQuery]);

  // ── 当前打开的词条对象 ────────────────────────────────────────────────────
  const activeDrawerTopic = useMemo(
    () => (activeDrawerTopicId ? allTopics.find((t) => t.id === activeDrawerTopicId) ?? null : null),
    [activeDrawerTopicId, allTopics]
  );

  // ── 个人档案匹配（严格隔离当前专区，严防跨癌种指标串扰） ───────────────
  const isTopicMatchedToProfile = useCallback((topicId: string) => {
    if (!userProfile) return false;
    const profileCancerType = userProfile.cancerType || "lung";
    if (profileCancerType !== cancerType) return false;

    if (cancerType === "breast") {
      if (topicId === "luminal_a_and_b" && (userProfile.erStatus === "positive" || userProfile.prStatus === "positive")) return true;
      if (topicId === "her2_positive_and_adc" && (userProfile.her2Status === "positive" || userProfile.her2Low || userProfile.her2Status === "3+")) return true;
      if (topicId === "her2_cardiac_safety" && (userProfile.her2Status === "positive" || userProfile.her2Status === "3+")) return true;
      if (topicId === "nottingham_grade" && (userProfile.nottinghamGrade || userProfile.grade)) return true;
      if (topicId === "oncotype_dx_21_gene" && userProfile.oncotypeDxScore != null) return true;
      if (topicId === "triple_negative_tnbc" && (userProfile.molecularSubtype === "TNBC" || userProfile.molecularSubtype === "Triple_Negative")) return true;
      if (topicId === "slnb_sentinel_nodes" && (userProfile.sentinelNodesPositive != null || userProfile.axillaryNodesPositive != null)) return true;
      if (topicId === "bi_rads_scale" && userProfile.biRads != null) return true;
      if (topicId === "microcalcifications" && userProfile.calcificationType) return true;
      if (topicId === "dcis_in_situ" && (userProfile.histologyType === "DCIS" || userProfile.stage === "0")) return true;
      if (topicId === "brca_gene_testing" && (userProfile.brca1 === "positive" || userProfile.brca2 === "positive")) return true;
      if (topicId === "neoadjuvant_pcr" && (userProfile.neoadjuvantChemo || userProfile.pcrStatus != null)) return true;
      if (topicId === "ki67_proliferation_index" && (userProfile.ki67 != null || userProfile.isKi67GrayZone)) return true;
      if (topicId === "ovarian_suppression_ofs" && (userProfile.menopauseStatus === "pre" || (userProfile.age && userProfile.age < 50 && (userProfile.erStatus === "positive" || userProfile.prStatus === "positive")))) return true;
      if (topicId === "lymphedema_prevention" && (userProfile.axillaryNodesPositive != null && userProfile.axillaryNodesPositive > 0)) return true;
      if (topicId === "endocrine_bone_and_hot_flashes" && (userProfile.erStatus === "positive" || userProfile.prStatus === "positive")) return true;
      return false;
    }

    if (cancerType === "lung") {
      if (topicId === "stas"          && userProfile.stas === "positive") return true;
      if (topicId === "vpi"           && userProfile.vpi === "positive") return true;
      if (topicId === "lvi"           && userProfile.lvi === "positive") return true;
      if (topicId === "ggo-evolution" && ((userProfile.ctr != null && userProfile.ctr > 0) || userProfile.morphology === "mixed_ggo")) return true;
      if (topicId === "egfr-targeted" && userProfile.egfr === "positive") return true;
      if (topicId === "iaslc-grade3"  && userProfile.iaslcGrade === "3") return true;
      return false;
    }

    return false;
  }, [userProfile, cancerType]);

  // ── 情景/分类 Tab 切换（五位一体） ───────────────────────────────────────
  const handleSelectCategory = useCallback((cat: WikiCategory | "all") => {
    setActiveCategory(cat);
    if (typeof window !== "undefined") {
      if (cat === "all") window.history.replaceState(null, "", window.location.pathname);
      else window.history.replaceState(null, "", `#category-${cat}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-500 selection:text-white relative">

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-12 sm:pb-16 space-y-4 sm:space-y-5 md:space-y-6">

        {/* Hero Section */}
        <section className="text-center space-y-4 pb-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-sky-700 border border-sky-200 shadow-xs max-w-full">
            <CancerIcon type={cancerType} className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="truncate">
              {CancerRegistry.get(cancerType).name}循证百科
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
            <span className="hidden sm:inline shrink-0">重点指征优先</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            从未知恐慌走向 · <span className="text-blue-600">从容笃定</span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            拒绝冰冷晦涩的医学术语与网络恐慌谣言。我们用<strong>生活化大白话比喻</strong>、<strong>高精 SVG 微观解剖图解</strong>与<strong>全球顶级循证试验数据</strong>，为您逐一破译病理指标，构筑坚不可摧的抗癌信心。
          </p>

          {userProfile && (() => {
            const profileCancerType = userProfile.cancerType || "lung";
            const isMatching = profileCancerType === cancerType;
            const getCancerLabel = (type: string) => type === "breast" ? "乳腺癌" : "肺癌";
            if (isMatching) {
              return (
                <div className="max-w-2xl mx-auto bg-teal-50/90 border border-teal-300 p-3.5 rounded-2xl text-xs text-teal-950 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2 text-left">
                    <User className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>
                      已识别到您的个人数字档案（<strong>{getCancerLabel(cancerType)} · {userProfile.stage}期 · {userProfile.gender === "female" ? "女性" : "男性"} · {userProfile.age}岁</strong>），已为您优先推荐匹配词条。
                    </span>
                  </div>
                  <Link href="/profile" className="flex-shrink-0 font-bold text-teal-700 hover:underline">
                    管理档案
                  </Link>
                </div>
              );
            }
            return (
              <div className="max-w-2xl mx-auto bg-slate-100/90 border border-slate-200/90 p-3 rounded-2xl text-xs text-slate-600 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2 text-left">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    您当前已建立【<strong>{getCancerLabel(profileCancerType)}</strong>】临床档案，当前浏览【<strong>{getCancerLabel(cancerType)}</strong>】百科专区。
                  </span>
                </div>
                <Link href="/profile" className="flex-shrink-0 font-bold text-blue-600 hover:underline">
                  查看档案
                </Link>
              </div>
            );
          })()}
        </section>

        {/* ── 五位一体情景 Tab 导航（场景选择 + 分类过滤一体化） ─────────────── */}
        <section className="pt-2">
          <WikiScenarioTabs
            key={`scenario-${cancerType}`}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            cancerType={cancerType}
            topics={allTopics}
          />
        </section>

        {/* ── 词条指标大盘 ───────────────────────────────────────────────────── */}
        <section id="wiki-topics-section" className="space-y-4">

          {/* 搜索 & 风险过滤栏 */}
          <WikiSearchBar
            key={`search-${cancerType}`}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRisk={selectedRisk}
            onRiskChange={setSelectedRisk}
            totalCount={allTopics.length}
            filteredCount={filteredTopics.length}
            cancerType={cancerType}
          />

          {/* 术后康复症状自查助手（仅肺癌：recovery 专区或全部默认状态时展示） */}
          {cancerType === "lung" && (activeCategory === "recovery" || (activeCategory === "all" && !searchQuery && selectedRisk === "all")) && (
            <div className="animate-fade-in">
              <PostOpSymptomTriage />
            </div>
          )}

          {/* 磁贴大盘（3 列 / 2 列 / 1 列 响应式网格） */}
          {filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {filteredTopics.map((topic) => (
                <WikiCompactCard
                  key={topic.id}
                  topic={topic}
                  isMatchedProfile={isTopicMatchedToProfile(topic.id)}
                  isHighlighted={activeDrawerTopicId === topic.id}
                  onClick={() => openDrawer(topic.id)}
                  cancerType={cancerType}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="search"
              title={`未找到与 "${searchQuery}" 相关的破译词条`}
              description="请尝试更换关键词（支持拼音、中文或英文缩写），或点击下方按钮重置筛选条件。"
              action={
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); setActiveCategory("all"); setSelectedRisk("all"); }}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  重置全部筛选
                </button>
              }
            />
          )}
        </section>
      </main>

      <Footer maxWidth="max-w-7xl" />

      {/* 悬浮侧边导航 */}
      <WikiFloatingNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        totalTopics={allTopics.length}
        categoryCounts={categoryCounts}
        onOpenSearch={() => setIsSpotlightOpen(true)}
        cancerType={cancerType}
      />

      {/* 移动端 FAB 搜索气泡 */}
      <button
        type="button"
        onClick={() => setIsSpotlightOpen(true)}
        className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0.75rem))] right-4 z-40 md:hidden w-14 h-14 rounded-full btn-primary text-white shadow-xl shadow-sky-500/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in"
        aria-label="快速搜索百科词条"
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Spotlight 搜索面板（按需加载） */}
      <WikiSpotlightSearchModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        userProfile={userProfile}
        onSelectTopic={handleSelectTopicFromSpotlight}
        topics={allTopics}
        cancerType={cancerType}
      />

      {/* ── 侧滑深度阅读抽屉 ──────────────────────────────────────────────── */}
      <WikiDetailDrawer
        topic={activeDrawerTopic}
        allTopics={filteredTopics}
        isMatchedProfile={activeDrawerTopic ? isTopicMatchedToProfile(activeDrawerTopic.id) : false}
        onClose={closeDrawer}
        onNavigate={openDrawer}
        cancerType={cancerType}
      />
    </div>
  );
}
