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
  colorectal: [
    { name: "癌胚抗原 CEA", standard: "< 5.0 ng/mL", desc: "结直肠癌最经典术后随访监测靶标，每 3 个月复查评估远期复发", keywords: ["CEA", "癌胚抗原", "结直肠癌", "肠癌"] },
    { name: "糖类抗原 CA19-9", standard: "< 37.0 U/mL", desc: "消化道重要标志物，CEA 阴性结直肠癌的重要补充监测", keywords: ["CA19-9", "CA199", "肠癌"] },
    { name: "糖类抗原 CA125", standard: "< 35.0 U/mL", desc: "排查结直肠癌腹膜广泛种植转移的重要血清学线索", keywords: ["CA125", "腹膜转移"] },
  ],
  colon: [
    { name: "癌胚抗原 CEA", standard: "< 5.0 ng/mL", desc: "结肠癌术后随访核心标志物，指导术后辅助化疗疗效评估", keywords: ["CEA", "癌胚抗原", "结肠癌"] },
    { name: "糖类抗原 CA19-9", standard: "< 37.0 U/mL", desc: "与 CEA 联用，辅助评估结肠病灶及肝转移风险", keywords: ["CA19-9", "CA199", "结肠癌"] },
  ],
  rectal: [
    { name: "癌胚抗原 CEA", standard: "< 5.0 ng/mL", desc: "直肠癌新辅助放化疗 (TNT) 与根治术后动态对齐指标", keywords: ["CEA", "癌胚抗原", "直肠癌"] },
    { name: "糖类抗原 CA19-9", standard: "< 37.0 U/mL", desc: "直肠癌复发与局部浸润协同排查标志物", keywords: ["CA19-9", "CA199", "直肠癌"] },
  ],
  gastric: [
    { name: "糖类抗原 CA72-4", standard: "< 6.9 U/mL", desc: "胃癌特异度最高的血清学标志物，监测腹膜转移与浆膜浸润", keywords: ["CA72-4", "CA724", "胃癌"] },
    { name: "癌胚抗原 CEA", standard: "< 5.0 ng/mL", desc: "胃腺癌常规监测指标，与 CA72-4/CA19-9 形成三联排查", keywords: ["CEA", "癌胚抗原", "胃癌"] },
    { name: "糖类抗原 CA19-9", standard: "< 37.0 U/mL", desc: "胃癌淋巴结转移与胰脾韧带受累的重要血液监测指标", keywords: ["CA19-9", "CA199", "胃癌"] },
  ],
  liver: [
    { name: "甲胎蛋白 AFP", standard: "< 20.0 ng/mL", desc: "原发性肝细胞癌 (HCC) 最核心诊断与术后动态追踪金标准", keywords: ["AFP", "甲胎蛋白", "肝癌"] },
    { name: "异常凝血酶原 PIVKA-II / DCP", standard: "< 40.0 mAU/mL", desc: "极早期与 AFP 阴性肝癌突破性标志物，高度预测微血管侵犯 (MVI)", keywords: ["PIVKA", "PIVKA-II", "DCP", "异常凝血酶原", "MVI"] },
    { name: "甲胎蛋白异质体比率 AFP-L3%", standard: "< 10.0 %", desc: "肝细胞癌特异性衍生异质体，鉴别良性肝硬化与早期恶性转化", keywords: ["AFP-L3", "异质体", "肝癌"] },
  ],
  pancreatic: [
    { name: "糖类抗原 CA19-9", standard: "< 37.0 U/mL", desc: "胰腺导管腺癌敏感度最高标志物(80%)，术后持续>100警惕早期隐匿转移", keywords: ["CA19-9", "CA199", "胰腺癌", "Whipple"] },
    { name: "癌胚抗原 CEA", standard: "< 5.0 ng/mL", desc: "胰腺癌联合监测指标，与 CA19-9 互补排查 Lewis 阴性假阴性人群", keywords: ["CEA", "癌胚抗原", "胰腺癌"] },
    { name: "糖类抗原 CA242", standard: "< 20.0 U/mL", desc: "消化道胰胆系恶性肿瘤高特异性标志物，受良性胆道感染干扰小", keywords: ["CA242", "胰腺癌"] },
  ],
  thyroid: [
    { name: "甲状腺球蛋白 Tg", standard: "< 55.0 ng/mL", desc: "分化型甲状腺癌全切及碘131清甲后体内有无残余/复发的金标准", keywords: ["Tg", "甲状腺球蛋白", "清甲", "复发"] },
    { name: "甲状腺球蛋白抗体 TgAb", standard: "< 115.0 IU/mL", desc: "伴随监测指标，TgAb 滴度高会直接干扰 Tg 读数，滴度持续下降代表疾病缓解", keywords: ["TgAb", "抗体", "甲状腺癌"] },
    { name: "降钙素 Calcitonin (Ct)", standard: "< 10.0 pg/mL", desc: "甲状腺髓样癌 (MTC) 最特异分泌性标志物，指导 RET 靶向与颈清", keywords: ["降钙素", "Ct", "髓样癌", "MTC"] },
  ],
  esophageal: [
    { name: "鳞状细胞癌抗原 SCC", standard: "< 1.5 ng/mL", desc: "食管鳞癌特异性血清学靶标，动态反映原发灶退缩与纵隔淋巴进展", keywords: ["SCC", "鳞癌抗原", "食管癌"] },
    { name: "细胞角蛋白19片段 CYFRA21-1", standard: "< 3.3 ng/mL", desc: "食管鳞癌化疗与放疗敏感性评估核心辅助指标", keywords: ["CYFRA", "CYFRA21-1", "食管癌"] },
    { name: "癌胚抗原 CEA", standard: "< 5.0 ng/mL", desc: "食管腺癌及食管胃结合部腺癌 (AEG) 关键监测指标", keywords: ["CEA", "食管胃结合部", "AEG"] },
  ],
  cervical: [
    { name: "鳞状细胞癌抗原 SCC", standard: "< 1.5 ng/mL", desc: "宫颈鳞癌 (占80%+) 临床分期、同步放化疗疗效及复发监测金标准", keywords: ["SCC", "鳞癌抗原", "宫颈癌"] },
    { name: "高危型 HPV 16/18 E6/E7", standard: "阴性 / 0 拷贝", desc: "持续阳性或高载量是宫颈癌前病变向浸润癌进展的关键病因指标", keywords: ["HPV", "HPV16", "HPV18", "高危型"] },
    { name: "糖类抗原 CA125", standard: "< 35.0 U/mL", desc: "宫颈腺癌以及盆腹腔腹膜扩散的敏感监测标志物", keywords: ["CA125", "宫颈腺癌"] },
  ],
  endometrial: [
    { name: "糖类抗原 CA125", standard: "< 35.0 U/mL", desc: "子宫内膜癌术前评估深肌层浸润、盆腹腔淋巴转移及术后随访指标", keywords: ["CA125", "子宫内膜癌", "肌层浸润"] },
    { name: "人附睾蛋白4 HE4", standard: "< 140.0 pmol/L", desc: "高特异性妇科肿瘤标志物，不受子宫内膜异位等良性妇科炎症干扰", keywords: ["HE4", "人附睾蛋白", "内膜癌"] },
    { name: "癌胚抗原 CEA", standard: "< 5.0 ng/mL", desc: "特殊病理类型（如浆液性内膜癌、透明细胞癌）长程随访指标", keywords: ["CEA", "浆液性", "透明细胞"] },
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
      case "colorectal":
      case "colon":
      case "rectal":
        return "搜索【结直肠癌】靶向药 (西妥昔单抗/贝伐珠)、顶刊 (IDEA/KEYNOTE)、分期或标志物...";
      case "gastric":
        return "搜索【胃癌】靶向药 (曲妥珠/佐妥昔单抗)、顶刊 (ToGA/FLOT)、分期或标志物...";
      case "liver":
        return "搜索【肝癌】靶向药 (仑伐替尼/阿替利珠)、顶刊 (IMbrave150)、分期或标志物...";
      case "pancreatic":
        return "搜索【胰腺癌】方案 (mFOLFIRINOX/白紫)、顶刊 (PRODIGE 24)、分期或标志物...";
      case "thyroid":
        return "搜索【甲状腺癌】靶向药 (仑伐替尼/索拉非尼)、C-TIRADS分级、标志物...";
      case "esophageal":
        return "搜索【食管癌】方案 (帕博利珠/纳武利尤)、顶刊 (CheckMate-577)、分期...";
      case "cervical":
        return "搜索【宫颈癌】方案 (贝伐珠/帕博利珠)、顶刊 (KEYNOTE-826)、分期...";
      case "endometrial":
        return "搜索【子宫内膜癌】分子分型 (POLE/dMMR)、顶刊 (RUBY/DUO-E)、分期...";
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
