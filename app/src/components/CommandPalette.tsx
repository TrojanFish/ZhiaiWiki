"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, 
  Pill, 
  FileText, 
  Activity, 
  Compass, 
  ArrowRight, 
  X, 
  Command, 
  BookOpen
} from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";
import { useCancerType } from "@/components/common/CancerSwitch";
import { CancerRegistry } from "@/lib/cancerRegistry";
import type { CancerType } from "@/lib/types";

export interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: "target_drug" | "study" | "clinical_tool" | "tumor_marker" | "wiki_topic";
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords: string[];
}

/**
 * 12 大实体瘤专区特征肿瘤标志物知识库 (Tumor Markers Dictionary)
 */
const CANCER_MARKERS: Record<CancerType, Array<{ name: string; standard: string; desc: string; keywords: string[] }>> = {
  lung: [
    { name: "癌胚抗原 CEA", standard: "< 5.0 ng/mL", desc: "肺腺癌最核心动态基线监测标志物，术后翻倍需高度戒备复发", keywords: ["CEA", "癌胚抗原", "肺腺癌"] },
    { name: "细胞角蛋白19片段 CYFRA21-1", standard: "< 3.3 ng/mL", desc: "肺鳞癌与腺癌重要监测指标，结合胸部薄层CT协同判读", keywords: ["CYFRA", "CYFRA21-1", "角蛋白", "鳞癌"] },
    { name: "神经元特异性烯醇化酶 NSE", standard: "< 16.3 ng/mL", desc: "小细胞肺癌 (SCLC) 与神经内分泌分化关键标志物", keywords: ["NSE", "小细胞", "神经内分泌"] },
  ],
  breast: [
    { name: "糖类抗原 CA15-3", standard: "< 25.0 U/mL", desc: "乳腺癌最特异血清学指标，监测转移与术后长程复发敏感性高", keywords: ["CA15-3", "CA153", "糖类抗原", "乳腺癌"] },
    { name: "癌胚抗原 CEA", standard: "< 5.0 ng/mL", desc: "与 CA15-3 联合检测，显著提高术后亚临床转移排查效能", keywords: ["CEA", "癌胚抗原"] },
    { name: "HER2 细胞外结构域 (ECD)", standard: "< 15.0 ng/mL", desc: "动态反映 HER2 阳性病灶负荷与抗 HER2 靶向治疗响应", keywords: ["HER2", "ECD", "靶向响应"] },
  ],
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 1. Reactive Cancer Type Integration
  const { cancerType } = useCancerType();
  const plugin = useMemo(() => CancerRegistry.get(cancerType), [cancerType]);

  // Listen for ⌘K or Ctrl+K and custom event (yields to WikiSpotlightSearchModal on /wiki)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pathname.startsWith("/wiki")) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) triggerHaptic("medium");
          return !prev;
        });
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      if (pathname.startsWith("/wiki")) return;
      triggerHaptic("medium");
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen, pathname]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    } else {
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  // 2. Dynamic Placeholder tailored to current cancer zone
  const placeholder = useMemo(() => {
    switch (cancerType) {
      case "breast":
        return "搜索【乳腺癌】靶向药 (阿贝西利/T-DXd)、顶刊 (TAILORx)、分期或标志物...";
      default:
        return "搜索【肺癌】靶向药 (奥希替尼/塞普替尼)、顶刊 (ADAURA/JCOG)、分期工具或标志物...";
    }
  }, [cancerType]);

  // 3. Catalog items generated dynamically based on active cancer plugin
  const catalogItems = useMemo<PaletteItem[]>(() => {
    const list: PaletteItem[] = [];

    // 1. Clinical Tools
    list.push(
      {
        id: "tool_profile",
        title: `【${plugin.name}】临床数字档案 (${plugin.guidelineStandard || "权威临床分期"})`,
        subtitle: `输入病理/影像测量参数，秒级计算 ${plugin.name} 最新分期与动力学指标`,
        category: "clinical_tool",
        categoryLabel: "核心工具",
        icon: Activity,
        keywords: ["档案", "分期", "TNM", plugin.name, "病理", "报告", "参数", "倍增时间"],
        action: () => router.push("/profile"),
      },
      {
        id: "tool_timeline",
        title: `【${plugin.name}】临床随访动态与指标趋势 (Clinical Trends)`,
        subtitle: `${plugin.name} 血清学-影像-靶向维持用药多轴联动趋势与随访记录`,
        category: "clinical_tool",
        categoryLabel: "核心工具",
        icon: Activity,
        keywords: ["随访", "动态", "趋势", "指标", "时序", "生化", plugin.name],
        action: () => router.push("/profile"),
      },
      {
        id: "tool_report",
        title: `【${plugin.name}】门诊就医沟通报告 (一键导出打印)`,
        subtitle: `结构化汇总 ${plugin.name} 病理分期、证据链与用药禁忌，支持 ⌘P 打印`,
        category: "clinical_tool",
        categoryLabel: "核心工具",
        icon: FileText,
        keywords: ["报告", "导出", "打印", "就医", "沟通单", "PDF", plugin.name],
        action: () => router.push("/profile/report"),
      },
      {
        id: "tool_reimbursement",
        title: `【${plugin.name}】特药医保自负测算与慈善赠药方案`,
        subtitle: `2026年国谈落地测算，含 ${plugin.name} 专属特药与 PAP 慈善赠药`,
        category: "clinical_tool",
        categoryLabel: "核心工具",
        icon: Compass,
        keywords: ["医保", "特药", "自负", "报销", "国谈", "赠药", "价格", plugin.name],
        action: () => router.push("/reimbursement"),
      },
      {
        id: "tool_wiki",
        title: `【${plugin.name}】循证医学百科与临床通识库`,
        subtitle: `沉浸式查阅 ${plugin.name} 全部病理术语、切缘标准与前瞻诊疗共识`,
        category: "clinical_tool",
        categoryLabel: "核心工具",
        icon: BookOpen,
        keywords: ["百科", "知识库", "词条", "指南", "共识", plugin.name],
        action: () => router.push("/wiki"),
      }
    );

    // 2. Targeted Drugs & DDI (from plugin)
    if (plugin.pharmacology?.targetedDrugs && plugin.pharmacology.targetedDrugs.length > 0) {
      plugin.pharmacology.targetedDrugs.forEach((drug: any) => {
        const drugName = drug.genericName || drug.name || drug.id;
        const targetDesc = drug.target ? `靶向 ${drug.target}` : (drug.generation || "靶向药物");
        const metabolism = drug.metabolismPathway || drug.metabolism || "主要经肝脏酶代谢";
        const highRisk = drug.highRiskInteractions?.length ? ` · 戒备: ${drug.highRiskInteractions.join("、")}` : "";
        list.push({
          id: `drug_${drug.id}`,
          title: `${drugName} (${drug.brandName || targetDesc})`,
          subtitle: `${targetDesc} · ${metabolism}${drug.phDependent ? " · 具胃酸依赖性 (忌联用PPI强效抑酸剂)" : ""}${highRisk}`,
          category: "target_drug",
          categoryLabel: "靶向药物",
          icon: Pill,
          keywords: [drugName, drug.brandName || "", drug.target || "", drug.id, ...(drug.highRiskInteractions || []), plugin.name],
          action: () => router.push(`/wiki?tab=all#ddi-checker`),
        });
      });
    }

    // 3. Featured Evidence Studies (from plugin)
    if (plugin.content?.featuredStudies && plugin.content.featuredStudies.length > 0) {
      plugin.content.featuredStudies.slice(0, 8).forEach((study: any, idx: number) => {
        list.push({
          id: `study_${study.id || idx}`,
          title: `${study.title || study.shortName} (${study.journal || "顶级医学期刊"})`,
          subtitle: `${study.evidenceLevel ? `[${study.evidenceLevel}] ` : ""}${study.conclusion || study.subtitle || "前瞻同行评审里程碑临床试验"}`,
          category: "study",
          categoryLabel: "前瞻顶刊",
          icon: FileText,
          keywords: [study.title || "", study.shortName || "", study.journal || "", ...(study.tags || study.factors || []), plugin.name],
          action: () => router.push("/studies"),
        });
      });
    }

    // 4. Tumor Markers (from CANCER_MARKERS)
    const markers = CANCER_MARKERS[cancerType] || CANCER_MARKERS.lung;
    markers.forEach((m, idx) => {
      list.push({
        id: `marker_${cancerType}_${idx}`,
        title: `${m.name} (正常参考值 ${m.standard})`,
        subtitle: m.desc,
        category: "tumor_marker",
        categoryLabel: "肿瘤标志物",
        icon: Activity,
        keywords: [m.name, ...m.keywords, plugin.name],
        action: () => router.push("/profile"),
      });
    });

    // 5. Featured Wiki Topics (top 5 flagship topics for preset showcase)
    if (plugin.content?.wikiTopics && plugin.content.wikiTopics.length > 0) {
      plugin.content.wikiTopics.slice(0, 5).forEach((topic: any) => {
        list.push({
          id: `wiki_${topic.id}`,
          title: topic.title,
          subtitle: topic.clinicalTruth || topic.summary || topic.definition || "专区核心权威循证词条",
          category: "wiki_topic",
          categoryLabel: "专区词条",
          icon: BookOpen,
          keywords: [topic.title, ...(topic.searchKeywords || []), ...(topic.synonyms || []), topic.category || "", plugin.name],
          action: () => router.push(`/wiki?topic=${topic.id}`),
        });
      });
    }

    return list;
  }, [cancerType, plugin, router]);

  // 4. Dynamic Filter: searches BOTH preset items AND ALL wiki topics of the active cancer zone!
  const filtered = useMemo<PaletteItem[]>(() => {
    if (!query.trim()) {
      return catalogItems;
    }
    const q = query.toLowerCase().trim();

    // A. Match from base catalog items (tools, drugs, studies, markers, top topics)
    const catalogMatches = catalogItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });

    // B. Also search across ALL wiki topics of the current cancer zone (depth retrieval)
    const existingIds = new Set(catalogMatches.map((i) => i.id));
    const allTopics = (plugin.content?.wikiTopics || []) as any[];
    const topicMatches: PaletteItem[] = [];

    for (const topic of allTopics) {
      const topicItemId = `wiki_${topic.id}`;
      if (existingIds.has(topicItemId)) continue;

      const titleMatch = topic.title?.toLowerCase().includes(q);
      const summaryMatch = (topic.clinicalTruth || topic.summary || topic.definition || "").toLowerCase().includes(q);
      const kwMatch = (topic.searchKeywords || []).some((kw: string) => kw.toLowerCase().includes(q));
      const synMatch = (topic.synonyms || []).some((s: string) => s.toLowerCase().includes(q));

      if (titleMatch || summaryMatch || kwMatch || synMatch) {
        topicMatches.push({
          id: topicItemId,
          title: topic.title,
          subtitle: topic.clinicalTruth || topic.summary || topic.definition || "专区权威循证词条",
          category: "wiki_topic",
          categoryLabel: "专区词条",
          icon: BookOpen,
          keywords: [topic.title, ...(topic.searchKeywords || []), ...(topic.synonyms || []), plugin.name],
          action: () => router.push(`/wiki?topic=${topic.id}`),
        });
      }
    }

    return [...catalogMatches, ...topicMatches];
  }, [catalogItems, plugin, query, router]);

  // Keyboard navigation within list
  const handleItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      triggerHaptic("medium");
      filtered[activeIndex].action();
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-md animate-fade-in overflow-hidden sm:overflow-y-auto print:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="全局医学快捷搜索"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleItemKeyDown}
        className="relative w-full max-w-2xl bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] max-h-[92dvh] text-slate-900 animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-0"
      >
        {/* iOS HIG Sheet Grabber for Mobile */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="sheet-grabber !my-0" />
        </div>

        {/* Spotlight Search Header */}
        <div className="flex items-center px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-100 gap-2.5 sm:gap-3 shrink-0 bg-white">
          <Search className="w-5 h-5 text-blue-500 flex-shrink-0" />
          
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
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none min-w-0"
            aria-label="输入搜索关键词"
          />
          {query && (
            <button 
              type="button" 
              onClick={() => { setQuery(""); inputRef.current?.focus({ preventScroll: true }); }}
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
            onClick={() => setIsOpen(false)} 
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors shrink-0" 
            aria-label="关闭搜索 (Esc)"
            title="关闭搜索 (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 max-h-[60vh] sm:max-h-[65vh] overflow-y-auto overscroll-contain p-2 space-y-1 custom-scrollbar"
        >
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Command className="w-10 h-10 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-600">未找到与 &quot;{query}&quot; 相关的【{plugin.name}】医学词条或工具</p>
              <p className="text-xs text-slate-400 mt-1">支持【{plugin.name}】中文药名、英文通用名、突变基因、病理术语或研究简称</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === activeIndex;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    triggerHaptic("medium");
                    item.action();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 select-none ${
                    isSelected 
                      ? "bg-blue-50/90 text-blue-900 border border-blue-200/80 shadow-xs" 
                      : "text-slate-700 hover:bg-slate-50 border border-transparent"
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{item.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                          isSelected 
                            ? "bg-blue-200/70 text-blue-800" 
                            : item.category === "target_drug"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                            : item.category === "study"
                            ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                            : item.category === "tumor_marker"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : item.category === "wiki_topic"
                            ? "bg-sky-50 text-sky-700 border border-sky-200/60"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {item.categoryLabel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform ${
                    isSelected ? "text-blue-600 translate-x-1" : "text-slate-300"
                  }`} />
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="hidden sm:flex px-5 py-2.5 bg-slate-50/90 border-t border-slate-100 items-center justify-between text-[11px] text-slate-500 select-none shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 shadow-2xs font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 shadow-2xs font-mono">↓</kbd>
              <span>导航</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 shadow-2xs font-mono">↵</kbd>
              <span>打开</span>
            </span>
          </div>
          <span className="text-slate-400">知癌维基 · 【{plugin.name}】全局医学指挥台</span>
        </div>
      </div>
    </div>
  );
}
