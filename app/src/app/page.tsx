"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  Check, 
  BookOpen, 
  XCircle, 
  CheckCircle2, 
  Scan, 
  Microscope, 
  Dna, 
  HeartPulse, 
  Compass, 
  FileText,
  Award,
  ShieldCheck,
  Camera,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Footer from "@/components/Footer";
import ConsentModal from "@/components/ConsentModal";
import StatsBanner from "@/components/StatsBanner";
import StudyCard from "@/components/StudyCard";
import HeroKmCurve from "@/components/common/HeroKmCurve";
import { FEATURED_STUDIES, FEATURED_STUDIES_MIXED } from "@/lib/evidence-data";
import { useCancerType } from "@/components/common/CancerSwitch";
import type { PatientProfile, CancerType } from "@/lib/types";
import { CancerIcon, LungIcon, BreastRibbonIcon, ColorectalIcon } from "@/components/common/CancerIcons";
import { CancerRegistry } from "@/lib/cancerRegistry";
import { getWikiCategories, type WikiCategory } from "@/lib/wikiData";
export type { PatientProfile };

type StudyTabType = "all" | CancerType;

const STUDY_HEADER_DETAILS: Record<StudyTabType, { badge: string; title: string; subtitle: string }> = {
  all: {
    badge: "权威研究库 · 全癌种精选",
    title: "国际权威临床研究库",
    subtitle: "精选 NEJM、Lancet、JCO、JAMA 等核心期刊 RCT 与前瞻性队列，100% 支持 DOI 溯源",
  },
  lung: {
    badge: "权威研究库 · 肺癌专区",
    title: "肺癌国际权威临床研究库",
    subtitle: "聚焦 ADAURA、JCOG0802、CheckMate-816 等里程碑 RCT，覆盖靶向辅助与微创切除循证依据",
  },
  breast: {
    badge: "权威研究库 · 乳腺癌专区",
    title: "乳腺癌国际权威临床研究库",
    subtitle: "聚焦 TAILORx、monarchE、KEYNOTE-522 等前瞻性试验，覆盖 21 基因分流与靶向强化依据",
  },
  colorectal: {
    badge: "权威研究库 · 结直肠癌专区",
    title: "结直肠癌国际权威临床研究库",
    subtitle: "聚焦 IDEA 协作组、KEYNOTE-177 等前瞻性研究，覆盖 3 月 CAPOX 减毒与靶免精准决策",
  },
  colon: {
    badge: "权威研究库 · 结肠癌专区",
    title: "结肠癌国际权威临床研究库",
    subtitle: "聚焦 IDEA 协作组、MOSAIC 等辅助化疗试验，覆盖 3月/6月化疗减毒与左右半靶向分流",
  },
  rectal: {
    badge: "权威研究库 · 直肠癌专区",
    title: "直肠癌国际权威临床研究库",
    subtitle: "聚焦 OPRA、PRODIGE 23 等关键研究，覆盖全程新辅助 (TNT) 与观察等待器官保留策略",
  },
  gastric: {
    badge: "权威研究库 · 胃癌专区",
    title: "胃癌国际权威临床研究库",
    subtitle: "聚焦 ToGA、SPOTLIGHT、CheckMate-649 等里程碑试验，覆盖 HER2、Claudin 18.2 与免疫循证",
  },
  liver: {
    badge: "权威研究库 · 原发性肝癌专区",
    title: "肝癌国际权威临床研究库",
    subtitle: "聚焦 ORIENT-32、IMbrave150、REFLECT 等关键队列，覆盖转化治疗与系统抗肿瘤循证",
  },
  esophageal: {
    badge: "权威研究库 · 食管癌专区",
    title: "食管癌国际权威临床研究库",
    subtitle: "聚焦 NEOCRTEC5010、CROSS、CheckMate-577 等前瞻队列，覆盖新辅助放化疗与辅助免疫依据",
  },
  thyroid: {
    badge: "权威研究库 · 甲状腺癌专区",
    title: "甲状腺癌国际权威临床研究库",
    subtitle: "聚焦 Kuma PTMC 主动监测与关键靶向试验，覆盖超声随访与精准干预决策依据",
  },
  endometrial: {
    badge: "权威研究库 · 子宫内膜癌专区",
    title: "子宫内膜癌国际权威临床研究库",
    subtitle: "聚焦 RUBY、PORTEC-4a 等分子分型与免疫试验，指导个体化放化疗与靶免方案",
  },
  cervical: {
    badge: "权威研究库 · 宫颈癌专区",
    title: "宫颈癌国际权威临床研究库",
    subtitle: "聚焦 KEYNOTE-826、EMBRACE-I 等里程碑试验，覆盖根治性同步放化疗与一线四联靶免",
  },
  pancreatic: {
    badge: "权威研究库 · 胰腺癌专区",
    title: "胰腺癌国际权威临床研究库",
    subtitle: "聚焦 PRODIGE 24、MPACT、POLO、PREOPANC 等里程碑试验，覆盖手术转化、化疗与靶向维持循证",
  },
};

const KNOWLEDGE_HEADER_DETAILS: Record<CancerType, { badge: string; title: string; subtitle: string }> = {
  lung: {
    badge: "4D 知识图谱 · 肺癌专区",
    title: "4D 临床循证知识图谱 · 肺癌",
    subtitle: "基于 IASLC 9th 与全球顶刊队列，推演病理浸润、分期与辅助治疗因果关联",
  },
  breast: {
    badge: "4D 知识图谱 · 乳腺癌专区",
    title: "4D 临床循证知识图谱 · 乳腺癌",
    subtitle: "基于 AJCC 8/9th 指南矩阵，推演分子分型（ER/PR/HER2/21基因）与个体化方案",
  },
  colorectal: {
    badge: "4D 知识图谱 · 结直肠癌专区",
    title: "4D 临床循证知识图谱 · 结直肠癌",
    subtitle: "基于 CSCO/NCCN 权威指南，推演左右半分型、微卫星状态与化疗减毒决策",
  },
  colon: {
    badge: "4D 知识图谱 · 结肠癌专区",
    title: "4D 临床循证知识图谱 · 结肠癌",
    subtitle: "基于 CSCO 结肠癌指南，推演左右半靶向分流与 IDEA 3月 CAPOX 减毒因果链路",
  },
  rectal: {
    badge: "4D 知识图谱 · 直肠癌专区",
    title: "4D 临床循证知识图谱 · 直肠癌",
    subtitle: "基于 CSCO 直肠癌指南，推演 CRM 切缘、全程新辅助 (TNT) 与器官保留路径",
  },
  gastric: {
    badge: "4D 知识图谱 · 胃癌专区",
    title: "4D 临床循证知识图谱 · 胃癌",
    subtitle: "基于 JGCA/CSCO 规约，推演 Lauren 分型、D2 根治质控与围手术期方案",
  },
  liver: {
    badge: "4D 知识图谱 · 原发性肝癌专区",
    title: "4D 临床循证知识图谱 · 肝癌",
    subtitle: "基于卫健委 CNLC 规范，推演肝功能储备、门脉癌栓与转化治疗决策",
  },
  esophageal: {
    badge: "4D 知识图谱 · 食管癌专区",
    title: "4D 临床循证知识图谱 · 食管癌",
    subtitle: "基于中国 III 期与全球顶刊，推演鳞癌浸润、新辅助放化疗与微创切除策略",
  },
  thyroid: {
    badge: "4D 知识图谱 · 甲状腺癌专区",
    title: "4D 临床循证知识图谱 · 甲状腺癌",
    subtitle: "基于国际 ATA 与国内指南，推演 C-TIRADS 超声分级与 PTMC 主动监测路径",
  },
  endometrial: {
    badge: "4D 知识图谱 · 子宫内膜癌专区",
    title: "4D 临床循证知识图谱 · 子宫内膜癌",
    subtitle: "基于 FIGO 2023 与 ESGO 规范，推演分子分型与辅助放化疗分流",
  },
  cervical: {
    badge: "4D 知识图谱 · 宫颈癌专区",
    title: "4D 临床循证知识图谱 · 宫颈癌",
    subtitle: "基于 FIGO 与 NCCN 指南，推演高危 HPV、同步放化疗与靶免联合策略",
  },
  pancreatic: {
    badge: "4D 知识图谱 · 胰腺癌专区",
    title: "4D 临床循证知识图谱 · 胰腺癌",
    subtitle: "基于 NCCN 2024 与 CSCO 指南，推演血管浸润可切除性三分类、新辅助转化与精准靶向链路",
  },
};

const ONCOWIKI_HEADER_DETAILS: Record<CancerType, { badge: string; title: string; subtitle: string }> = {
  lung: {
    badge: "循证视觉百科 · 肺癌专区",
    title: "肺癌影像与病理临床视觉解析",
    subtitle: "以直观图解与顶刊数据，深度解读磨玻璃结节 CTR、STAS 气道播散与靶向决策",
  },
  breast: {
    badge: "循证视觉百科 · 乳腺癌专区",
    title: "乳腺癌超声与病理临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读 BI-RADS 评级、分子分型与 21 基因免化疗",
  },
  colorectal: {
    badge: "循证视觉百科 · 结直肠癌专区",
    title: "结直肠癌镜检与病理临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读肠镜病理、IDEA 3月减毒与 dMMR 免疫靶向",
  },
  colon: {
    badge: "循证视觉百科 · 结肠癌专区",
    title: "结肠癌病理与辅助治疗临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读腺瘤恶变、CME 切除与 IDEA 3月减毒决策",
  },
  rectal: {
    badge: "循证视觉百科 · 直肠癌专区",
    title: "直肠癌保肛与全程新辅助临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读 CRM 切缘、全程新辅助与器官保留前沿",
  },
  gastric: {
    badge: "循证视觉百科 · 胃癌专区",
    title: "胃镜活检与病理临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读 ESD 保胃窗口、Lauren 分型与靶向循证",
  },
  liver: {
    badge: "循证视觉百科 · 原发性肝癌专区",
    title: "肝癌分期与系统抗肿瘤临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读 CNLC 分期、肝功能储备与 T+A 方案",
  },
  esophageal: {
    badge: "循证视觉百科 · 食管癌专区",
    title: "食管癌病理与新辅助临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读鳞癌浸润、NEOCRTEC5010 新辅助与微创切除",
  },
  thyroid: {
    badge: "循证视觉百科 · 甲状腺癌专区",
    title: "甲状腺超声与穿刺临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读 C-TIRADS 超声分级与 PTMC 主动监测",
  },
  endometrial: {
    badge: "循证视觉百科 · 子宫内膜癌专区",
    title: "子宫内膜癌分子分型临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读 TCGA 四分子分型、降阶梯与靶免进展",
  },
  cervical: {
    badge: "循证视觉百科 · 宫颈癌专区",
    title: "宫颈癌筛查与放化疗临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读 HPV 阶梯管理、锥切保宫与同步放化疗",
  },
  pancreatic: {
    badge: "循证视觉百科 · 胰腺癌专区",
    title: "胰腺癌解剖可切除性与转化临床视觉解析",
    subtitle: "以直观图解与顶刊数据，清晰解读 SMV/PV 血管包裹、交界可切除新辅助与外分泌替代 (PERT)",
  },
};

const CANCER_MATRIX_CARDS: Array<{
  id: CancerType;
  name: string;
  enName: string;
  guideline: string;
  description: string;
  tags: string[];
  badgeColor: string;
  hoverColor: string;
}> = [
  {
    id: "lung",
    name: "肺癌专区",
    enName: "IASLC 9th Edition",
    guideline: "IASLC 第 9 版 · CSCO 肺癌 2024",
    description: "涵盖纯磨玻璃/混磨 CTR 实性折算、IASLC 第 9 版全新分期、STAS 气道播散风险评估、EGFR/ALK 三代靶向矩阵与 VDT 结节倍增曲线。",
    tags: ["IASLC 9th", "CTR 浸润折算", "STAS 微观播散", "EGFR-TKI 相互作用"],
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    hoverColor: "hover:border-sky-400",
  },
  {
    id: "breast",
    name: "乳腺癌专区",
    enName: "AJCC 8/9th · St. Gallen",
    guideline: "AJCC 8/9th · St. Gallen · CSCO 2024",
    description: "涵盖 ACR BI-RADS 5类影像评级、AJCC 8th/9th 双轨病理预后分期、TAILORx 21 基因免化疗决策、monarchE 高危强化及曲帕双靶/ADC 靶向矩阵。",
    tags: ["AJCC 8/9th 预后分期", "BI-RADS 评级", "21基因免化疗", "CDK4/6i & ADC"],
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
    hoverColor: "hover:border-pink-400",
  },
  {
    id: "colorectal",
    name: "结直肠癌专区",
    enName: "AJCC 8th · CSCO 2024",
    guideline: "AJCC 8th · IDEA 协作组 · CSCO 2024",
    description: "涵盖结肠镜与直肠薄层 MRI、AJCC 第 8 版确定性分期、IDEA 3 个月 CAPOX 减毒方案、MSI-H/dMMR 免疫免化疗及全 RAS/BRAF 靶向分流。",
    tags: ["AJCC 第8版分期", "IDEA 3月减毒", "dMMR 免疫单药", "左右半靶向分流"],
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hoverColor: "hover:border-emerald-400",
  },
  {
    id: "gastric",
    name: "胃癌专区",
    enName: "CSCO 2024 · JGCA 6th",
    guideline: "CSCO 胃癌 2024 · 日本规约 JGCA · AJCC 8th",
    description: "涵盖早期 cT1a 胃镜黏膜下剥离 (ESD) 适应证、D2 根治淋巴结质控 (≥16枚)、Lauren/Borrmann 分型破恐、Claudin 18.2 与 HER2 双靶向及 FLOT 围手术期化疗。",
    tags: ["ESD 保胃指征", "D2 根治质控", "Lauren 印戒分流", "Claudin 18.2 / HER2"],
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    hoverColor: "hover:border-amber-400",
  },
  {
    id: "liver",
    name: "原发性肝癌专区",
    enName: "CNLC 2024 · AASLD",
    guideline: "国家卫健委 CNLC 2024 · Child-Pugh / ALBI",
    description: "涵盖中国国家 CNLC 2024 分期、Child-Pugh 与 ALBI 肝储备评估、门脉癌栓 (PVTT) 转化降期、HAIC-FO 局部灌注及 T+A 双达方案一线系统抗肿瘤。",
    tags: ["CNLC 2024 分期", "ALBI 肝储备", "门脉癌栓转化", "T+A / HAIC-FO 方案"],
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    hoverColor: "hover:border-rose-400",
  },
  {
    id: "esophageal",
    name: "食管癌专区",
    enName: "CSCO 2024 · AJCC 8th",
    guideline: "CSCO 食管癌 2024 · NEOCRTEC5010",
    description: "涵盖鳞癌 (ESCC) 浸润深度评估、喉返神经链淋巴结转移排查、NEOCRTEC5010 新辅助同步放化疗及 CheckMate-577 术后辅助免疫治疗精准指征。",
    tags: ["鳞癌浸润深度", "NEOCRTEC5010", "三切口微创", "CheckMate-577 免疫"],
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    hoverColor: "hover:border-orange-400",
  },
  {
    id: "thyroid",
    name: "甲状腺癌专区",
    enName: "ATA 2024 · C-TIRADS",
    guideline: "中国 C-TIRADS · 国际 ATA · ESTIMABL2",
    description: "涵盖超声 C-TIRADS 恶性风险分级、PTMC 低危微小乳头状癌「主动监测 (AS)」、BRAF 突变客观破恐、腺叶切除保功能及低危免除碘131清甲。",
    tags: ["C-TIRADS 超声", "PTMC 主动监测", "BRAF 突变真相", "免碘131清甲"],
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    hoverColor: "hover:border-indigo-400",
  },
  {
    id: "endometrial",
    name: "妇科肿瘤专区",
    enName: "FIGO 2023 · TCGA",
    guideline: "FIGO 2023 · NCCN 2024 · KEYNOTE-826",
    description: "涵盖子宫内膜癌 TCGA 四分子分型 (POLE/MSI/p53) 降阶梯放疗、宫颈高危 HPV 阶梯管理、锥切保宫、根治性同步放化疗 (CCRT) 及四联前沿靶免。",
    tags: ["FIGO 2023 分期", "TCGA 四分子分型", "高危 HPV 管理", "同步放化疗 CCRT"],
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    hoverColor: "hover:border-purple-400",
  },
  {
    id: "pancreatic",
    name: "胰腺癌专区",
    enName: "NCCN 2024 · AJCC 8th",
    guideline: "NCCN 2024 · CSCO 胰腺癌 2024 · AJCC 第8版",
    description: "涵盖薄层增强 CT/MRI 血管浸润可切除性三分类、交界可切除新辅助转化、Whipple 腹膜后切缘 R0 质控、胚系 BRCA 突变与奥拉帕利维持及外分泌替代 (PERT)。",
    tags: ["血管浸润三分类", "mFOLFIRINOX 转化", "Whipple R0切缘", "gBRCA & PERT"],
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    hoverColor: "hover:border-orange-400",
  },
];

// Dynamically import the heavy 4D Knowledge Graph canvas to drastically slim the initial homepage JS chunk
const KnowledgeMapPreview = dynamic(() => import("@/components/KnowledgeMapPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-slate-100/80 border border-slate-200 animate-pulse flex flex-col items-center justify-center text-slate-400 gap-3">
      <div className="w-9 h-9 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold text-slate-600">正在按需加载 4D 循证知识图谱推演引擎...</span>
    </div>
  ),
});

type DemoCaseType =
  | "ia1"
  | "stas"
  | "luminal_a"
  | "her2_pos"
  | "crc_idea"
  | "crc_dmmr"
  | "gastric_esd"
  | "gastric_flot"
  | "thyroid_ptmc"
  | "liver_ta";

export default function HomePage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [activeDemoCase, setActiveDemoCase] = useState<DemoCaseType>("ia1");
  const { cancerType, setCancerType } = useCancerType();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mobileSimExpanded, setMobileSimExpanded] = useState(false);
  const [mobileDiffTab, setMobileDiffTab] = useState<"zhiai" | "general">("zhiai");
  const [mobileStudiesExpanded, setMobileStudiesExpanded] = useState(false);

  useEffect(() => {
    if (cancerType === "breast") {
      setActiveDemoCase("luminal_a");
    } else if (cancerType === "colorectal" || cancerType === "colon" || cancerType === "rectal") {
      setActiveDemoCase("crc_idea");
    } else if (cancerType === "gastric") {
      setActiveDemoCase("gastric_esd");
    } else if (cancerType === "thyroid") {
      setActiveDemoCase("thyroid_ptmc");
    } else if (cancerType === "liver") {
      setActiveDemoCase("liver_ta");
    } else if (cancerType === "lung") {
      setActiveDemoCase("ia1");
    }
  }, [cancerType]);

  const displayedStudies = useMemo(() => {
    try {
      const plugin = CancerRegistry.get(cancerType);
      if (plugin?.content?.featuredStudies && plugin.content.featuredStudies.length > 0) {
        return plugin.content.featuredStudies.slice(0, 3).map((s) => ({
          ...s,
          cancerType: s.cancerType || cancerType,
        }));
      }
    } catch {}

    const matches = FEATURED_STUDIES_MIXED.filter(
      (study) =>
        study.cancerType === cancerType ||
        ((cancerType === "colorectal" || cancerType === "colon" || cancerType === "rectal") &&
          (study.cancerType === "colorectal" || study.cancerType === "colon" || study.cancerType === "rectal"))
    );

    return (matches.length > 0 ? matches : FEATURED_STUDIES_MIXED).slice(0, 3);
  }, [cancerType]);

  const wikiCategoriesData = useMemo(() => {
    const catMeta = getWikiCategories(cancerType);
    let allTopics: any[] = [];
    try {
      const plugin = CancerRegistry.get(cancerType);
      if (plugin?.content?.wikiTopics && plugin.content.wikiTopics.length > 0) {
        allTopics = plugin.content.wikiTopics;
      }
    } catch {}

    const catKeys: WikiCategory[] = ["nodule", "pathology", "genetics", "recovery"];

    return catKeys.map((key) => {
      const meta = catMeta[key] || {
        label: "临床分类",
        desc: "",
        color: "text-blue-700",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      };
      const topicsInCat = allTopics.filter((t) => t.category === key);
      const featuredTopicNames = topicsInCat.slice(0, 3).map((t) => {
        return t.title.split(" ")[0].slice(0, 10);
      });

      return {
        key,
        label: meta.label,
        desc: meta.desc,
        color: meta.color,
        badgeBg: meta.badgeBg,
        count: topicsInCat.length,
        featuredTopics: featuredTopicNames,
      };
    });
  }, [cancerType]);

  useEffect(() => {
    const checkUserAndProfile = () => {
      if (typeof window === "undefined") return;
      const email = localStorage.getItem("email") || sessionStorage.getItem("email");
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const profile = localStorage.getItem("oncopath_profile");
      setUserEmail(email || null);
      setHasProfile(!!profile || !!email || !!token);
    };

    checkUserAndProfile();
    window.addEventListener("auth-change", checkUserAndProfile);
    return () => {
      window.removeEventListener("auth-change", checkUserAndProfile);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-slate-50 text-slate-900">
      <ConsentModal />
      
      {/* Unified Global Floating Island Navigation Bar */}

      <main className="flex-1">
        {/* Act 1: Hero Section (2-Column Split Layout matching Telemedicine Demo) */}
        <section
          ref={heroRef}
          className="relative min-h-0 flex items-center bg-gradient-to-b from-blue-50/40 via-slate-50 to-white overflow-hidden pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-4 sm:pb-8 lg:pb-10"
        >
          {/* Subtle medical grid background (Zero GPU blur overhead, crisp clinical feel) */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-12 gap-5 lg:gap-8 items-center">

            
            {/* Left Column: Headline, Trust Badge & CTAs */}
            <div className="lg:col-span-7 text-left space-y-4 sm:space-y-5 md:space-y-6">
              
              {/* Brand Manifesto */}
              <div className="space-y-1 sm:space-y-1.5 animate-fade-in-up">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-gradient-to-r from-sky-50 via-blue-50 to-teal-50 border border-sky-200/90 text-slate-800 shadow-2xs max-w-full">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  <span className="font-extrabold text-slate-900 tracking-tight truncate sm:whitespace-normal">
                    <span className="sm:hidden">“知癌方能治癌，每一次循证皆因至爱”</span>
                    <span className="hidden sm:inline">“知癌，方能治癌；每一次循证，皆因至爱。”</span>
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-sky-700 border border-sky-200 shadow-xs max-w-full animate-fade-in-up">
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-600" />
                </span>
                <span suppressHydrationWarning className="truncate sm:whitespace-normal min-w-0">
                  <span className="sm:hidden">11 大实体瘤前瞻队列 · 160,000+ 例顶刊数据</span>
                  <span className="hidden sm:inline">覆盖 11 大实体瘤前瞻循证队列 · 160,000+ 例数据 · 顶刊出处可溯</span>
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight animate-fade-in-up stagger-1">
                知癌维基 · 肿瘤循证平台
                <br />
                <span className="text-blue-600">
                  让影像与病理报告 清晰透彻 · 严密可溯
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl animate-fade-in-up stagger-2">
                不再面对晦涩冰冷的医学术语盲目焦虑。系统结构化解析 CT 影像、乳腺超声/钼靶、TNM 分期与分子靶点，严密对齐 NEJM、Lancet、JCO 等顶级期刊真实患者队列与现行国际临床指南。
              </p>

              {/* Dual Funnel CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 pt-1 sm:pt-2 animate-fade-in-up stagger-3 w-full max-w-md sm:max-w-none">
                <Link
                  href="/profile"
                  className="btn-primary w-full sm:w-auto min-w-[200px] h-12 px-6 sm:px-7 rounded-2xl text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center active:scale-98"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span suppressHydrationWarning>{hasProfile || userEmail ? "进入我的临床数字档案" : "建立临床数字档案"}</span>
                </Link>
                <Link
                  href="/wiki"
                  className="w-full sm:w-auto min-w-[200px] h-12 px-6 sm:px-7 rounded-2xl text-sm sm:text-base font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs hover:border-blue-300 hover:text-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer text-center active:scale-98"
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                  <span>免录入 · 查40+循证词条</span>
                </Link>
              </div>

              {/* Report Upload / Smart Recognition Assist Hint */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200/70 text-[11px] sm:text-xs font-semibold text-blue-900 animate-fade-in-up stagger-3 shadow-2xs max-w-full">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                </span>
                <span className="inline-flex items-center gap-1.5 min-w-0">
                  <Camera className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate sm:whitespace-normal">
                    <span className="sm:hidden">支持拍摄/上传报告 · AI 结构化提取分期与靶点</span>
                    <span className="hidden sm:inline">支持拍摄/上传报告单 · AI 自动结构化提取分期与靶点</span>
                  </span>
                </span>
              </div>

              {/* Core Trust Pillars: 患者 3 大安心基石 (权威分期金标准 / 顶刊出处全溯源 / 医疗级隐私脱敏) */}
              <div className="pt-4 sm:pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-2 sm:gap-4 max-w-xl animate-fade-in-up stagger-4 w-full">
                {/* Pillar 1: IASLC 9th & AJCC 8/9th Gold Standard */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2.5 p-2 sm:p-0 rounded-xl sm:rounded-none bg-white/70 sm:bg-transparent border sm:border-0 border-slate-200/80 shadow-2xs sm:shadow-none min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
                  </div>
                  <div className="min-w-0 w-full">
                    <div className="text-[11px] sm:text-sm font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                      IASLC / AJCC
                    </div>
                    <div className="text-[9px] text-sky-700 font-bold sm:hidden mt-0.5 truncate">国际金标准</div>
                    <div className="text-[11px] text-slate-500 leading-snug mt-0.5 hidden sm:block">
                      11大实体肿瘤国际分期矩阵
                    </div>
                  </div>
                </div>

                {/* Pillar 2: 100% DOI Provenance */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2.5 p-2 sm:p-0 rounded-xl sm:rounded-none bg-white/70 sm:bg-transparent border sm:border-0 border-slate-200/80 shadow-2xs sm:shadow-none min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
                  </div>
                  <div className="min-w-0 w-full">
                    <div className="text-[11px] sm:text-sm font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                      100% 顶刊溯源
                    </div>
                    <div className="text-[9px] text-teal-700 font-bold sm:hidden mt-0.5 truncate">DOI 全可查</div>
                    <div className="text-[11px] text-slate-500 leading-snug mt-0.5 hidden sm:block">
                      NEJM / Lancet / JCO 真实队列
                    </div>
                  </div>
                </div>

                {/* Pillar 3: Medical-Grade Privacy */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1 sm:gap-2.5 p-2 sm:p-0 rounded-xl sm:rounded-none bg-white/70 sm:bg-transparent border sm:border-0 border-slate-200/80 shadow-2xs sm:shadow-none min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0 w-full">
                    <div className="text-[11px] sm:text-sm font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                      医疗隐私脱敏
                    </div>
                    <div className="text-[9px] text-emerald-700 font-bold sm:hidden mt-0.5 truncate">不可逆擦除</div>
                    <div className="text-[11px] text-slate-500 leading-snug mt-0.5 hidden sm:block">
                      身份标识擦除 · 严防过度医疗
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Clinical Evidence Engine Live Preview Card */}
            <div className="lg:col-span-5 relative animate-fade-in-up stagger-2">
              {/* Mobile-only Collapsible Toggle Bar */}
              <div className="lg:hidden mb-2">
                <button
                  type="button"
                  onClick={() => setMobileSimExpanded(!mobileSimExpanded)}
                  className="w-full p-3 rounded-2xl bg-white border border-blue-200/90 shadow-2xs flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Microscope className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                        <span>{CancerRegistry.get(cancerType).name} · 临床推演示范</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold border border-emerald-200 shrink-0">
                          前瞻队列
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {mobileSimExpanded ? "点击收起推演沙盘与KM生存曲线" : "点击展开试看：分期判定、生存率与KM曲线"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 shrink-0">
                    <span>{mobileSimExpanded ? "收起" : "展开示范"}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSimExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>
              </div>

              {/* The Full Simulation Card: always visible on lg, collapsible on mobile */}
              <div className={`${mobileSimExpanded ? "block" : "hidden lg:block"} relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 space-y-3`}>
                
                {/* Header: Title & Status Indicator bound to Active Cancer Type */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
                      <CancerIcon type={cancerType} className="w-4 h-4 text-slate-700 shrink-0" />
                      <span>{CancerRegistry.get(cancerType).name}专区 · 实时循证推演</span>
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <span>权威前瞻队列 · 严密溯源</span>
                  </span>
                </div>

                {/* Specialty-Dedicated Case Switcher Tabs - Strictly corresponding to active cancer zone */}
                {cancerType === "lung" ? (
                  <div className="grid grid-cols-2 p-1 bg-sky-50/60 rounded-xl border border-sky-100 text-[11px] font-bold gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveDemoCase("ia1")}
                      className={`min-h-[44px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center ${
                        activeDemoCase === "ia1"
                          ? "bg-white text-sky-700 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      示例一：磨玻璃微浸润 (IA1期)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDemoCase("stas")}
                      className={`min-h-[44px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center ${
                        activeDemoCase === "stas"
                          ? "bg-white text-sky-700 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      示例二：气道播散高危 (STAS+)
                    </button>
                  </div>
                ) : cancerType === "breast" ? (
                  <div className="grid grid-cols-2 p-1 bg-pink-50/60 rounded-xl border border-pink-100 text-[11px] font-bold gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveDemoCase("luminal_a")}
                      className={`min-h-[44px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center ${
                        activeDemoCase === "luminal_a"
                          ? "bg-white text-pink-700 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      示例一：Luminal A 免化疗 (IA期)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDemoCase("her2_pos")}
                      className={`min-h-[44px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center ${
                        activeDemoCase === "her2_pos"
                          ? "bg-white text-pink-700 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      示例二：HER2+ 双靶强化 (IIA期)
                    </button>
                  </div>
                ) : (cancerType === "colorectal" || cancerType === "colon" || cancerType === "rectal") ? (
                  <div className="grid grid-cols-2 p-1 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] font-bold gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveDemoCase("crc_idea")}
                      className={`min-h-[44px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center ${
                        activeDemoCase === "crc_idea"
                          ? "bg-white text-emerald-700 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      示例一：III期低危 IDEA 3月减毒
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDemoCase("crc_dmmr")}
                      className={`min-h-[44px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center ${
                        activeDemoCase === "crc_dmmr"
                          ? "bg-white text-emerald-700 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      示例二：II期 dMMR 免化疗
                    </button>
                  </div>
                ) : cancerType === "gastric" ? (
                  <div className="grid grid-cols-2 p-1 bg-amber-50/60 rounded-xl border border-amber-100 text-[11px] font-bold gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveDemoCase("gastric_esd")}
                      className={`min-h-[44px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center ${
                        activeDemoCase === "gastric_esd"
                          ? "bg-white text-amber-800 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      示例一：早期胃癌 ESD保胃
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDemoCase("gastric_flot")}
                      className={`min-h-[44px] py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer flex items-center justify-center ${
                        activeDemoCase === "gastric_flot"
                          ? "bg-white text-amber-800 shadow-2xs font-extrabold"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      示例二：进展期 FLOT三联化疗
                    </button>
                  </div>
                ) : cancerType === "thyroid" ? (
                  <div className="p-2 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] font-bold text-center text-indigo-800 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                    <span>标杆循证：PTMC 低危微小乳头状癌「主动监测」免手术切除</span>
                  </div>
                ) : cancerType === "liver" ? (
                  <div className="p-2 bg-rose-50/60 rounded-xl border border-rose-100 text-[11px] font-bold text-center text-rose-800 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    <span>标杆循证：伴门静脉癌栓转化降期 T+A 双达方案一线获益</span>
                  </div>
                ) : cancerType === "esophageal" ? (
                  <div className="p-2 bg-orange-50/60 rounded-xl border border-orange-100 text-[11px] font-bold text-center text-orange-800 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0" />
                    <span>标杆循证：局部进展期食管鳞癌 NEOCRTEC5010 新辅助同步放化疗获益</span>
                  </div>
                ) : (
                  <div className="p-2 bg-purple-50/60 rounded-xl border border-purple-100 text-[11px] font-bold text-center text-purple-800 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                    <span>标杆循证：{CancerRegistry.get(cancerType).name}国际前瞻队列个体化循证推演</span>
                  </div>
                )}

                {activeDemoCase === "ia1" ? (
                  /* Case 1: Early GGO Micro-invasive Adenocarcinoma (Minimal Risk) */
                  <div className="space-y-3 animate-fade-in">
                    {/* Compact 2-column: Input Parameters + Staging Judgement */}
                    <div className="grid sm:grid-cols-2 gap-2 items-start">
                      {/* Input Parameters Box */}
                      <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/70 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>【模拟输入】病理与影像</span>
                          <span className="text-emerald-700 bg-emerald-100/70 px-1 py-0.5 rounded font-mono text-[9px]">纯磨/微浸润</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">右肺上叶磨玻璃 18mm</span>
                          <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">实性成分 4mm (CTR 22%)</span>
                          <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">STAS 阴性 · R0切缘</span>
                        </div>
                      </div>

                      {/* Staging Decision */}
                      <div className="bg-gradient-to-br from-blue-50/80 to-teal-50/50 rounded-xl p-2.5 border border-blue-200/80 space-y-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] font-bold text-blue-900">IASLC / AJCC 第 9 版</span>
                          <span className="text-[11px] font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-2xs whitespace-nowrap">pT1mi N0 M0 · IA1 期</span>
                        </div>
                        <p className="text-[10px] text-blue-800/90 leading-snug pt-0.5">
                          <Lightbulb className="w-3 h-3 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>规则解读</strong>：以实性浸润径（4mm）折算定级，非按 18mm 结节全径误报为更高分期。
                        </p>
                      </div>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：JCOG0804 / JCOG1211 (N=3,120)</span>
                        <span className="text-[10px] text-teal-700 bg-teal-100/70 px-1.5 py-0.2 rounded font-bold">1级前瞻证据</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">5年无复发生存率</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">99.7%</div>
                          <div className="text-[10px] text-slate-500">规范切除后达临床根治</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">5年总生存率 (OS)</div>
                          <div className="text-lg sm:text-xl font-black text-teal-600 tabular-nums">99.8%</div>
                          <div className="text-[10px] text-slate-500">肺功能长期充分保留</div>
                        </div>
                      </div>
                    </div>

                    {/* Guardrail: Anti-Overtreatment Warning */}
                    <div className="bg-emerald-50/90 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【防过度医疗红线】</strong>：IA1期属于极低危惰性病变，<strong>指南绝对不推荐术后辅助化疗，常规不推荐辅助靶向</strong>。遵医嘱定期薄层 CT 随访即可。
                      </div>
                    </div>

                    {/* Source Footnote */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：JTO 2021 &amp; Lancet Respir Med 2023</span>
                      <a href="https://doi.org/10.1016/j.jtho.2021.03.010" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1016/j.jtho.2021.03.010 ↗
                      </a>
                    </div>
                  </div>
                ) : activeDemoCase === "stas" ? (
                  /* Case 2: Invasive Adenocarcinoma with STAS+ (Precision Intervention) */
                  <div className="space-y-3 animate-fade-in">
                    {/* Compact 2-column: Input Parameters + Staging Judgement */}
                    <div className="grid sm:grid-cols-2 gap-2 items-start">
                      {/* Input Parameters Box */}
                      <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/70 space-y-1.5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>【模拟输入】病理与浸润</span>
                          <span className="text-amber-700 bg-amber-100/70 px-1 py-0.5 rounded font-mono text-[9px]">微观高危特征</span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">左下叶腺癌 2.2cm</span>
                          <span className="px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-800">气道播散 STAS+ (阳性)</span>
                          <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700">脉管瘤栓 LVI- · R0切缘</span>
                        </div>
                      </div>

                      {/* Staging Decision — P1-3: calm blue-amber gradient, avoid all-amber anxiety */}
                      <div className="bg-gradient-to-br from-blue-50/80 to-amber-50/40 rounded-xl p-2.5 border border-blue-200/80 space-y-1">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] font-bold text-blue-900">IASLC / AJCC 第 9 版</span>
                          <span className="text-[11px] font-extrabold text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs whitespace-nowrap">pT1c N0 M0 · IA3 (伴高危)</span>
                        </div>
                        <p className="text-[10px] text-blue-900/90 leading-snug pt-0.5">
                          <Lightbulb className="w-3 h-3 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>机制破译</strong>：STAS 提示肿瘤沿肺泡微腔播散，解剖性切除可显著拉平复发风险。
                        </p>
                      </div>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：Eguchi JCO 2019 / Wang Meta (N=25,467)</span>
                        <span className="text-[10px] text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded font-bold">多中心大数据</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">标准解剖切除5年RFS</div>
                          <div className="text-lg sm:text-xl font-black text-blue-700 tabular-nums">88.5% ~ 92.0%</div>
                          <div className="text-[10px] text-slate-500">切缘充足有效阻断播散</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">相对风险比 (HR)</div>
                          <div className="text-lg sm:text-xl font-black text-amber-700 tabular-nums">1.87</div>
                          <div className="text-[10px] text-slate-500">95% CI: 1.52 ~ 2.29</div>
                        </div>
                      </div>
                    </div>

                    {/* Guidance Card */}
                    <div className="bg-blue-50/90 rounded-2xl p-3 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【门诊决策指引】</strong>：建议切缘净距需 ≥ 20mm；建议与主管医生探讨完善 EGFR/ALK 基因检测，前两年每 6 个月随访胸部薄层 CT。
                      </div>
                    </div>

                    {/* P2-4: DOI Source Footnote — clickable link */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：Journal of Clinical Oncology (JCO 2019)</span>
                      <a href="https://doi.org/10.1200/JCO.18.02002" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1200/JCO.18.02002 ↗
                      </a>
                    </div>
                  </div>
                ) : activeDemoCase === "luminal_a" ? (
                  /* Case 3: Breast Cancer Luminal A (Low Risk Chemotherapy Exemption) */
                  <div className="space-y-3.5 animate-fade-in">
                    {/* Input Parameters Box */}
                    <div className="bg-slate-50/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>【模拟输入】免疫组化与基因评分</span>
                        <span className="text-pink-700 bg-pink-100/70 px-1.5 py-0.2 rounded font-mono text-[10px]">HR+ HER2- 低危</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          右乳外上象限 1.8cm
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          ER 90%+ · PR 80%+ · HER2-
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-pink-50 border border-pink-200 text-xs font-bold text-pink-800">
                          21基因 RS=14 (低危)
                        </span>
                      </div>
                    </div>

                    {/* Staging Decision */}
                    <div className="bg-gradient-to-r from-pink-50/80 to-purple-50/50 rounded-2xl p-3.5 border border-pink-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-900">AJCC 第 8/9 版病理预后分期</span>
                        <span className="text-xs font-extrabold text-pink-700 bg-white px-2 py-0.5 rounded-lg border border-pink-200 shadow-2xs">
                          pT1c N0 M0 · IA 期 / Luminal A
                        </span>
                      </div>
                      <p className="text-[11px] text-pink-900/90 leading-relaxed pt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>规则解读</strong>：结合强阳性激素受体与低核分裂象，生物学预后极优，解剖与预后分期稳固为 IA 期。
                      </p>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：TAILORx / RxPONDER 12年随访 (N=15,356)</span>
                        <span className="text-[10px] text-pink-700 bg-pink-100/70 px-1.5 py-0.2 rounded font-bold">1级前瞻RCT</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">5年无复发生存率</div>
                          <div className="text-lg sm:text-xl font-black text-pink-600 tabular-nums">98.2% ~ 99.4%</div>
                          <div className="text-[10px] text-slate-500">单纯内分泌即可达卓越控制</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">5年总生存率 (OS)</div>
                          <div className="text-lg sm:text-xl font-black text-purple-600 tabular-nums">98.8% ~ 99.8%</div>
                          <div className="text-[10px] text-slate-500">生存曲线与常人几无差异</div>
                        </div>
                      </div>
                    </div>

                    {/* Guardrail: Anti-Overtreatment Warning */}
                    <div className="bg-emerald-50/90 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【防过度医疗红线】</strong>：21 基因评分 RS=14 (RS&lt;26)，绝经后患者经 1 级前瞻 RCT 证实<strong>加用辅助化疗无任何额外生存获益</strong>，单纯规范辅助内分泌治疗即可免受化疗之苦。
                      </div>
                    </div>

                    {/* P2-4: DOI Source Footnote — clickable link */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：New England Journal of Medicine (NEJM 2018)</span>
                      <a href="https://doi.org/10.1056/NEJMoa1804710" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1056/NEJMoa1804710 ↗
                      </a>
                    </div>
                  </div>
                ) : activeDemoCase === "her2_pos" ? (
                  /* Case 4: Breast Cancer HER2+ (Double Targeting Reinforcement) */
                  <div className="space-y-3.5 animate-fade-in">
                    {/* Input Parameters Box */}
                    <div className="bg-slate-50/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>【模拟输入】病理与受体状态</span>
                        <span className="text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded font-mono text-[10px]">HER2 过表达阳性</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          左乳内下象限 2.5cm
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-bold text-purple-800">
                          HER2 IHC 3+ (阳性)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          前哨/腋窝 2/16 阳性 (N1)
                        </span>
                      </div>
                    </div>

                    {/* Staging Decision */}
                    <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/50 rounded-2xl p-3.5 border border-purple-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-900">AJCC 第 8/9 版病理预后分期</span>
                        <span className="text-xs font-extrabold text-purple-700 bg-white px-2 py-0.5 rounded-lg border border-purple-200 shadow-2xs">
                          pT2 N1a M0 · IIA 期 / HER2+
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-900/90 leading-relaxed pt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>机制破译</strong>：曲妥珠单抗+帕妥珠单抗 (HP) 双靶向协同阻断 HER2 异源二聚体，极大逆转侵袭风险。
                      </p>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：APHINITY 6年随访 (N=4,805)</span>
                        <span className="text-[10px] text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded font-bold">1级前瞻RCT</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">6年无浸润复发 (iDFS)</div>
                          <div className="text-lg sm:text-xl font-black text-purple-700 tabular-nums">87.9% ~ 92.5%</div>
                          <div className="text-[10px] text-slate-500">淋巴结阳性双靶显著获益</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">相对风险降低 (HR)</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">0.72</div>
                          <div className="text-[10px] text-slate-500">复发转移风险降低 28%</div>
                        </div>
                      </div>
                    </div>

                    {/* Guidance Card */}
                    <div className="bg-purple-50/90 rounded-2xl p-3 border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【门诊决策指引】</strong>：推荐完成曲帕双靶 (HP) 联合紫杉类化疗 1 年规范疗程，治疗期间每 3 个月复查心脏彩超 (LVEF)，现代新一代 ADC 技术提供坚实后续支持。
                      </div>
                    </div>

                    {/* P2-4: DOI Source Footnote — clickable link */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：New England Journal of Medicine (NEJM 2017)</span>
                      <a href="https://doi.org/10.1056/NEJMoa1703643" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1056/NEJMoa1703643 ↗
                      </a>
                    </div>
                  </div>
                ) : activeDemoCase === "crc_idea" ? (
                  /* Case 5: Colorectal Cancer Stage III Low-Risk (IDEA 3-month CAPOX) */
                  <div className="space-y-3.5 animate-fade-in">
                    {/* Input Parameters Box */}
                    <div className="bg-slate-50/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>【模拟输入】病理与清扫指标</span>
                        <span className="text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-mono text-[10px]">III 期低危组</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          乙状结肠原发灶 4.2cm (T3)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                          清扫 19 枚 (2枚阳性, N1a)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          全 RAS 野生型 · MSS · CRM(-)
                        </span>
                      </div>
                    </div>

                    {/* Staging Decision */}
                    <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/50 rounded-2xl p-3.5 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900">AJCC 第 8 版 TNM 分期</span>
                        <span className="text-xs font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                          pT3 N1a M0 · IIIB 期 (IDEA低危)
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-900/90 leading-relaxed pt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>前瞻循证</strong>：依据 IDEA 国际多中心 RCT (NEJM)，T1-3N1 低危组采用 CAPOX 辅助化疗 3 个月与 6 个月等效，避免过度蓄积神经毒性。
                      </p>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：IDEA 协作组 6 项前瞻 RCT (N=12,834)</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded font-bold">1级前瞻RCT</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">3年无病生存率 (DFS)</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-700 tabular-nums">83.1%</div>
                          <div className="text-[10px] text-slate-500">3月 CAPOX 疗效非劣于 6月</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">3级重度神经毒性</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">3% vs 16%</div>
                          <div className="text-[10px] text-slate-500">神经损伤断崖式下降 81%</div>
                        </div>
                      </div>
                    </div>

                    {/* Guidance Card */}
                    <div className="bg-emerald-50/90 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【减毒增效金标准】</strong>：推荐 CAPOX 方案辅助化疗 3 个月（共 4 个疗程），疗效与 6 个月等效且大幅免受长期肢端麻木困扰，规律监测 CEA/CA19-9。
                      </div>
                    </div>

                    {/* P2-4: DOI Source Footnote — clickable link */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：New England Journal of Medicine (NEJM 2018)</span>
                      <a href="https://doi.org/10.1056/NEJMoa1713709" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1056/NEJMoa1713709 ↗
                      </a>
                    </div>
                  </div>
                ) : activeDemoCase === "crc_dmmr" ? (
                  /* Case 6: Colorectal Cancer Stage II with dMMR/MSI-H */
                  <div className="space-y-3.5 animate-fade-in">
                    {/* Input Parameters Box */}
                    <div className="bg-slate-50/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>【模拟输入】病理与分子分型</span>
                        <span className="text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded font-mono text-[10px]">dMMR / MSI-H</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          升结肠溃疡型 5.0cm (T4a)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-bold text-purple-800">
                          dMMR / MSI-H (错配修复缺陷)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          清扫 22 枚淋巴结全阴 (N0)
                        </span>
                      </div>
                    </div>

                    {/* Staging Decision */}
                    <div className="bg-gradient-to-r from-purple-50/80 to-emerald-50/50 rounded-2xl p-3.5 border border-purple-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-900">AJCC 第 8 版 TNM 分期</span>
                        <span className="text-xs font-extrabold text-purple-700 bg-white px-2 py-0.5 rounded-lg border border-purple-200 shadow-2xs">
                          pT4a N0 M0 · IIB 期 / dMMR
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-900/90 leading-relaxed pt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>机制破译</strong>：dMMR/MSI-H 型肿瘤微环境富集大量新抗原与浸润淋巴细胞，对单药 5-FU 耐药且自身预后极优。
                      </p>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：KEYNOTE-177 / ASCO / CSCO 2024</span>
                        <span className="text-[10px] text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded font-bold">指南强推荐</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">5年无复发生存率</div>
                          <div className="text-lg sm:text-xl font-black text-purple-700 tabular-nums">92.4%</div>
                          <div className="text-[10px] text-slate-500">微卫星高度不稳定天然高免疫</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">化疗决策建议</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-600">豁免单药化疗</div>
                          <div className="text-[10px] text-slate-500">单药氟尿嘧啶无生存获益</div>
                        </div>
                      </div>
                    </div>

                    {/* Guidance Card */}
                    <div className="bg-purple-50/90 rounded-2xl p-3 border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【防过度医疗红线】</strong>：CSCO/NCCN 指南明确指出：II 期 dMMR 患者单纯氟尿嘧啶单药化疗不仅无益反而增加毒性，推荐直接规律随访观察或专科 MDT 评估。
                      </div>
                    </div>

                    {/* P2-4: DOI Source Footnote — clickable link */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：New England Journal of Medicine (NEJM 2020)</span>
                      <a href="https://doi.org/10.1056/NEJMoa2022226" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1056/NEJMoa2022226 ↗
                      </a>
                    </div>
                  </div>
                ) : activeDemoCase === "gastric_esd" ? (
                  /* Case 7: Gastric Cancer Early Stage ESD Curative Organ Preservation */
                  <div className="space-y-3.5 animate-fade-in">
                    {/* Input Parameters Box */}
                    <div className="bg-slate-50/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>【模拟输入】胃镜与病理指标</span>
                        <span className="text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded font-mono text-[10px]">ESD 根治绝对适应证</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          胃窦小弯浅平坦型 1.5cm
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                          中高分化管状腺癌 (cT1a)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          溃疡(-) · 脉管侵犯(-)
                        </span>
                      </div>
                    </div>

                    {/* Staging Decision — P1-3: calm blue-amber gradient */}
                    <div className="bg-gradient-to-br from-blue-50/80 to-amber-50/40 rounded-2xl p-3.5 border border-blue-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900">JGCA / CSCO 2024 判定</span>
                        <span className="text-xs font-extrabold text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                          cT1a N0 M0 · 早期胃癌 / ESD指征
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-900/90 leading-relaxed pt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>规则解读</strong>：未侵及黏膜下层且分化良好的病灶，微创内镜黏膜下剥离术即可达到与全胃/大部切除完全等效的肿瘤学根治。
                      </p>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：JCOG0607 / Gotoda 多中心队列 (N=5,265)</span>
                        <span className="text-[10px] text-teal-700 bg-teal-100/70 px-1.5 py-0.2 rounded font-bold">1级前瞻多中心</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">5年总生存率 (OS)</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">99.2%</div>
                          <div className="text-[10px] text-slate-500">内镜切除达临床治愈</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">原生胃功能保留率</div>
                          <div className="text-lg sm:text-xl font-black text-amber-600 tabular-nums">100%</div>
                          <div className="text-[10px] text-slate-500">杜绝倾倒综合征与重度消瘦</div>
                        </div>
                      </div>
                    </div>

                    {/* Guardrail: Anti-Overtreatment Warning */}
                    <div className="bg-emerald-50/90 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【防过度切胃红线】</strong>：病理严格符合内镜黏膜下剥离（ESD）绝对指征者，<strong>指南严禁盲目实施开腹远端胃大部切除或全胃切除</strong>，最大限度守护患者消化尊严与营养吸收。
                      </div>
                    </div>

                    {/* P2-4: DOI Source Footnote — clickable link */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：Gastric Cancer (JGCA 2021) &amp; Lancet Oncology</span>
                      <a href="https://doi.org/10.1007/s10120-020-01068-1" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1007/s10120-020-01068-1 ↗
                      </a>
                    </div>
                  </div>
                ) : activeDemoCase === "gastric_flot" ? (
                  /* Case 8: Locally Advanced Gastric Cancer with Perioperative FLOT Triplet */
                  <div className="space-y-3.5 animate-fade-in">
                    {/* Input Parameters Box */}
                    <div className="bg-slate-50/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>【模拟输入】浸润深度与靶点</span>
                        <span className="text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded font-mono text-[10px]">局部进展期</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          胃体浸润型溃疡 3.8cm (cT3)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                          局部淋巴结可疑转移 (cN+)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          Lauren 弥漫型 · HER2- · pMMR
                        </span>
                      </div>
                    </div>

                    {/* Staging Decision — P1-3: calm blue-amber gradient */}
                    <div className="bg-gradient-to-br from-blue-50/80 to-amber-50/40 rounded-2xl p-3.5 border border-blue-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900">AJCC 第 8 版 / CSCO 2024</span>
                        <span className="text-xs font-extrabold text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                          cT3 N+ M0 · 局部进展期 (建议围手期化疗)
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-900/90 leading-relaxed pt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>机制破译</strong>：FLOT 三联方案围手术期应用（术前4周期+术后4周期）相较于传统术后单辅助，能带来更深层降期并消灭微转移。
                      </p>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：FLOT4-AIO 德国前瞻多中心 RCT (N=716)</span>
                        <span className="text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded font-bold">1级最高证据</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">中位总生存期 (mOS)</div>
                          <div className="text-lg sm:text-xl font-black text-amber-700 tabular-nums">50 个月</div>
                          <div className="text-[10px] text-slate-500">较传统方案显著延长 43%</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">病理完全缓解 (pCR)</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">16.0%</div>
                          <div className="text-[10px] text-slate-500">切除标本内活瘤完全清零</div>
                        </div>
                      </div>
                    </div>

                    {/* Guidance Card */}
                    <div className="bg-amber-50/90 rounded-2xl p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【门诊就医决策指引】</strong>：对可切除局部进展期胃癌，指南推荐优先选择术前 FLOT 方案新辅助以争取 R0 根治，术前检测 Claudin 18.2 表达状态以储备后续靶向武器。
                      </div>
                    </div>

                    {/* P2-4: DOI Source Footnote — clickable link */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：The Lancet (2019)</span>
                      <a href="https://doi.org/10.1016/S0140-6736(18)32557-1" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1016/S0140-6736(18)32557-1 ↗
                      </a>
                    </div>
                  </div>
                ) : activeDemoCase === "thyroid_ptmc" ? (
                  /* Case 9: Thyroid PTMC Active Surveillance (Low Risk Exemption) */
                  <div className="space-y-3.5 animate-fade-in">
                    {/* Input Parameters Box */}
                    <div className="bg-slate-50/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>【模拟输入】超声与解剖特征</span>
                        <span className="text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded font-mono text-[10px]">微小癌低危</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          右叶中部实性低回声 0.6cm (PTMC)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-800">
                          纵横比 &gt; 1 · 微钙化 (C-TIRADS 4B)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          包膜完整 · 颈部淋巴结阴性
                        </span>
                      </div>
                    </div>

                    {/* Staging Decision */}
                    <div className="bg-gradient-to-r from-indigo-50/80 to-teal-50/50 rounded-2xl p-3.5 border border-indigo-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900">中国 C-TIRADS / AJCC 第 8 版</span>
                        <span className="text-xs font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-200 shadow-2xs">
                          cT1a N0 M0 · I 期 / PTMC低危
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-900/90 leading-relaxed pt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>规则解读</strong>：AJCC 第 8 版将分水岭定为 55 岁。对无被膜外侵犯且非毗邻气管食管的微小癌，生物学行为极度惰性。
                      </p>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：日本 Kuma 医院 10年主动监测队列 (N=2,153)</span>
                        <span className="text-[10px] text-indigo-700 bg-indigo-100/70 px-1.5 py-0.2 rounded font-bold">前瞻标杆队列</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">10年免手术观察成功率</div>
                          <div className="text-lg sm:text-xl font-black text-indigo-600 tabular-nums">92.0%</div>
                          <div className="text-[10px] text-slate-500">仅 8% 患者进展需择期微创</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">疾病特异生存率 (DSS)</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">100%</div>
                          <div className="text-[10px] text-slate-500">与立即全切无任何生存差异</div>
                        </div>
                      </div>
                    </div>

                    {/* Guardrail: Anti-Overtreatment Warning */}
                    <div className="bg-emerald-50/90 rounded-2xl p-3 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【防过度切除红线】</strong>：国际 ATA 与中国指南强推荐「主动监测 (Active Surveillance)」作为低危微小癌首选方案，<strong>严禁恐慌性盲目行双侧甲状腺全切+颈部清扫术</strong>，避免终身服药与喉返神经损伤。
                      </div>
                    </div>

                    {/* P2-4: DOI Source Footnote — clickable link */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：Thyroid (2014) &amp; JAMA Otolaryngol (2018)</span>
                      <a href="https://doi.org/10.1089/thy.2014.0049" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1089/thy.2014.0049 ↗
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Case 10: Primary Liver Cancer with Portal Vein Tumor Thrombus (T+A Triplet) */
                  <div className="space-y-3.5 animate-fade-in">
                    {/* Input Parameters Box */}
                    <div className="bg-slate-50/90 rounded-2xl p-3 sm:p-3.5 border border-slate-200/70 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>【模拟输入】肝功能储备与瘤栓</span>
                        <span className="text-rose-700 bg-rose-100/70 px-1.5 py-0.2 rounded font-mono text-[10px]">门脉癌栓转化</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          右肝巨块型 7.2cm (单发)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800">
                          门静脉右支癌栓 (Vp2)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                          Child-Pugh A级 (5分) · ALBI 1级
                        </span>
                      </div>
                    </div>

                    {/* Staging Decision — P1-3: cool blue base, rose accent only for badge */}
                    <div className="bg-gradient-to-br from-blue-50/80 to-rose-50/30 rounded-2xl p-3.5 border border-blue-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900">国家卫健委 CNLC 2024 / BCLC</span>
                        <span className="text-xs font-extrabold text-rose-700 bg-white px-2 py-0.5 rounded-lg border border-rose-200 shadow-2xs">
                          CNLC IIIa 期 / BCLC C 期 (转化治疗指征)
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-900/90 leading-relaxed pt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline mr-1 -mt-0.5 shrink-0" /><strong>机制破译</strong>：PD-L1 与 VEGF 双重协同重塑免疫微环境，打破单纯索拉非尼瓶颈，带来前所未有的病灶缩小与转化切除契机。
                      </p>
                    </div>

                    {/* Cohort & Survival Figures */}
                    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 space-y-2.5">
                      <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                        <span>匹配队列：IMbrave150 全球前瞻多中心 RCT (N=501)</span>
                        <span className="text-[10px] text-rose-700 bg-rose-100/70 px-1.5 py-0.2 rounded font-bold">1级前瞻RCT</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">1年总生存率 (OS)</div>
                          <div className="text-lg sm:text-xl font-black text-rose-700 tabular-nums">67.2%</div>
                          <div className="text-[10px] text-slate-500">传统索拉非尼仅 54.6%</div>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">死亡相对风险比 (HR)</div>
                          <div className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">0.58</div>
                          <div className="text-[10px] text-slate-500">死亡风险断崖式降低 42%</div>
                        </div>
                      </div>
                    </div>

                    {/* Guidance Card */}
                    <div className="bg-rose-50/90 rounded-2xl p-3 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong>【系统转化抗肿瘤指引】</strong>：Child-Pugh A 级肝功能良好者一线首选 T+A（阿替利珠单抗+贝伐珠单抗），配合肝动脉灌注化疗 (HAIC-FO) 促使癌栓坏死脱落，争取二期根治性切除。
                      </div>
                    </div>

                    {/* P2-4: DOI Source Footnote — clickable link */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>出处：New England Journal of Medicine (NEJM 2020)</span>
                      <a href="https://doi.org/10.1056/NEJMoa1915745" target="_blank" rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:text-sky-700 hover:underline min-h-[44px] flex items-center">
                        DOI: 10.1056/NEJMoa1915745 ↗
                      </a>
                    </div>
                  </div>
                )}

                {/* Interactive Kaplan-Meier Evidence Survival Curve */}
                <HeroKmCurve caseId={activeDemoCase} />

                {/* Instant Trial Run / Conversion Call to Action */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">想测试您自己的检查报告？</span>
                  <Link
                    href={`/profile?template=${activeDemoCase}&cancerType=${cancerType}`}
                    className="inline-flex items-center text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline transition-all cursor-pointer"
                  >
                    以该病理为模板试跑临床报告
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Animated Database Stats Banner */}
      <StatsBanner />


      {/* Act 2: 3-Step Clean Workflow & Core Difference vs General AI */}
      <section id="workflow" className="py-8 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="循证工作流"
            title="3 步获取专属临床循证"
            subtitle="上传或录入病理报告，快速对齐权威指南与国际顶刊前瞻队列"
          />

          {/* Desktop 3 Step Cards */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 mt-8 sm:mt-12">
            <div className="p-6 md:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all card-hover relative group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-black mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">上传或录入病理报告</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                拍摄上传病理报告照片或填写 TNM、气道播散（STAS）、乳腺受体状态（ER/PR/HER2）、BI-RADS 等关键指标。
              </p>
            </div>

            <div className="p-6 md:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-all card-hover relative group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center text-2xl font-black mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">匹配国际前瞻性队列</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                在 NEJM、Lancet、JCO、JTO 等数万例多中心前瞻队列中检索与您完全吻合的亚群，获取客观生存率与复发风险比（HR）。
              </p>
            </div>

            <div className="p-6 md:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all card-hover relative group">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl font-black mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">生成门诊就医决策清单</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                输出四维红绿灯风险矩阵与结构化问诊清单，支持一键复制到剪贴板，方便与您的主管医生高效沟通。
              </p>
            </div>
          </div>

          {/* Mobile Compact 3-Step Stepper */}
          <div className="md:hidden mt-6 space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                1
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900">上传或录入病理报告</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  拍照上传报告或填写 TNM、STAS、ER/PR/HER2、BI-RADS 等核心指标。
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                2
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900">匹配国际前瞻性队列</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  在 NEJM、Lancet 等顶刊数万例真实队列中精确检索亚群，获取客观生存率与复发 HR。
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                3
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900">生成门诊就医决策清单</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  输出四维红绿灯风险矩阵与结构化问诊清单，支持一键复制与主治医生高效沟通。
                </p>
              </div>
            </div>
          </div>

          {/* Core Differentiation vs General LLMs Box */}
          <div id="difference" className="mt-8 sm:mt-12 bg-gradient-to-br from-blue-50/80 via-white to-teal-50/50 rounded-3xl p-4 sm:p-6 md:p-8 border border-blue-200/80 shadow-sm">
            <div className="max-w-3xl mx-auto text-center mb-5 sm:mb-8">
              <span className="text-[10px] sm:text-xs font-bold text-blue-700 bg-blue-100/80 px-3 sm:px-3.5 py-1 rounded-full border border-blue-200/60 shadow-2xs">
                循证决策支持 (CDSS) 与黑盒大模型的本质差异
              </span>
              <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-2.5 sm:mt-3">
                循证决策支持与黑盒概率生成的本质差异
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5 sm:mt-2">
                严肃肿瘤决策不能依赖黑盒概率猜测与不可溯文献。系统所有对照结论均严密锚定同行评审顶刊队列与现行临床指南。
              </p>
            </div>

            {/* Desktop Side-by-Side View */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {/* General AI box */}
              <div className="bg-white/80 p-6 rounded-2xl border border-rose-200/80 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>非循证通用大模型 (黑盒概率生成 / 聊天机器人)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">•</span>
                    <span>易产生<strong>AI 幻觉</strong>，凭空编造不存在的统计数据或虚构医学文献。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">•</span>
                    <span>给出的百分比是模糊的概率猜测（如“有20%复发可能”），缺乏样本量与真实队列支持。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">•</span>
                    <span>容易越权给出误导性的绝对寿命预测，加重患者焦虑。</span>
                  </li>
                </ul>
              </div>

              {/* ZhiaiWiki Box */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>知癌维基 结构化循证临床对照系统</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>100% 文献可溯</strong>：每一句话均带有 DOI 与 PubMed 直达链接。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>严密效应量统计</strong>：依据 HR (95% CI) 与多中心 5yr RFS 真实患者队列。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>知情同意与门诊协同</strong>：输出红绿灯矩阵与医生问诊清单，辅助医患专业沟通。</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile Tabbed View */}
            <div className="md:hidden space-y-3">
              <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl text-xs font-bold gap-1">
                <button
                  type="button"
                  onClick={() => setMobileDiffTab("zhiai")}
                  className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    mobileDiffTab === "zhiai"
                      ? "bg-white text-emerald-800 shadow-2xs font-extrabold"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  知癌维基 (循证系统)
                </button>
                <button
                  type="button"
                  onClick={() => setMobileDiffTab("general")}
                  className={`py-2 px-2 rounded-lg text-center transition-all cursor-pointer ${
                    mobileDiffTab === "general"
                      ? "bg-white text-rose-700 shadow-2xs font-extrabold"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  通用大模型 (黑盒)
                </button>
              </div>

              {mobileDiffTab === "zhiai" ? (
                <div className="bg-white p-4 rounded-2xl border border-emerald-300 shadow-2xs space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>知癌维基 结构化循证临床对照系统</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>100% 文献可溯</strong>：每项结论带有 DOI 与 PubMed 直达链接。</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>严密效应量统计</strong>：依据 HR (95% CI) 与多中心 5yr RFS 真实队列。</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>门诊就医协同</strong>：生成四维红绿灯与问诊清单，支持医患高效沟通。</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="bg-white/90 p-4 rounded-2xl border border-rose-200/80 space-y-2.5 animate-fade-in">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>非循证通用大模型 (黑盒概率生成)</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>易产生 <strong>AI 幻觉</strong>，凭空编造不存在的统计数据或虚构文献。</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>给出的百分比是模糊概率猜测，缺乏样本量与真实队列支持。</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500">•</span>
                      <span>容易越权给出误导性的绝对寿命预测，加重患者恐慌焦虑。</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Act 3: Peer-Reviewed International Studies Library (Directly bound to active specialty zone) */}
      <section id="studies" className="py-8 sm:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge={STUDY_HEADER_DETAILS[cancerType]?.badge || `权威研究库 · ${CancerRegistry.get(cancerType).name}专区`}
            title={STUDY_HEADER_DETAILS[cancerType]?.title || `${CancerRegistry.get(cancerType).name}国际权威临床研究库`}
            subtitle={STUDY_HEADER_DETAILS[cancerType]?.subtitle || "精选 NEJM、Lancet、JCO 等核心期刊 RCT 与前瞻队列，100% 支持 DOI 溯源"}
          />

          {/* Active Specialty Zone Indicator */}
          <div className="flex items-center justify-center mt-4 sm:mt-6">
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white px-3.5 sm:px-4 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>当前研究库：<strong className="text-slate-900 font-bold">{CancerRegistry.get(cancerType).name}专区</strong></span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400">已与顶栏专区联动</span>
            </div>
          </div>

          {/* Desktop Studies View (All 3 Cards) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {displayedStudies.slice(0, 3).map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}
          </div>

          {/* Mobile Studies View (1 Featured Study + Progressive Disclosure Toggle) */}
          <div className="md:hidden space-y-3.5 mt-6">
            {displayedStudies.slice(0, 1).map((study) => (
              <StudyCard key={study.id} study={study} />
            ))}

            {displayedStudies.length > 1 && (
              <>
                {mobileStudiesExpanded && (
                  <div className="space-y-3.5 animate-fade-in">
                    {displayedStudies.slice(1, 3).map((study) => (
                      <StudyCard key={study.id} study={study} />
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setMobileStudiesExpanded(!mobileStudiesExpanded)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>{mobileStudiesExpanded ? "收起精选研究" : `展开更多 ${displayedStudies.length - 1} 篇顶刊精选研究`}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileStudiesExpanded ? "rotate-180" : ""}`} />
                </button>
              </>
            )}
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href={`/studies?cancerType=${cancerType}`}
              id="view-all-studies-btn"
              className="btn-primary px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center justify-center shadow-md cursor-pointer"
            >
              <span>
                查看 {CancerRegistry.get(cancerType).name} 国际研究库全部文献
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Act 4: 4D Knowledge Graph Sandbox */}
      <section id="knowledge" className="py-8 sm:py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge={KNOWLEDGE_HEADER_DETAILS[cancerType]?.badge || `4D 知识图谱 · ${CancerRegistry.get(cancerType).name}专区`}
            title={KNOWLEDGE_HEADER_DETAILS[cancerType]?.title || `4D 临床循证知识图谱 · ${CancerRegistry.get(cancerType).name}`}
            subtitle={KNOWLEDGE_HEADER_DETAILS[cancerType]?.subtitle || "基于权威指南与顶刊队列，推演病理特征、分子靶点与辅助治疗因果关联"}
          />

          {/* Active Specialty Zone Indicator */}
          <div className="flex items-center justify-center mt-4 sm:mt-6">
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3.5 sm:px-4 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>当前图谱：<strong className="text-slate-900 font-bold">{CancerRegistry.get(cancerType).name}专区</strong></span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400">已与顶栏专区联动</span>
            </div>
          </div>

          {/* Desktop Full Interactive Canvas Sandbox */}
          <div className="hidden md:block mt-8 bg-white rounded-3xl p-2 border border-slate-200 shadow-xl overflow-hidden">
            <KnowledgeMapPreview cancerType={cancerType} />
          </div>

          {/* Mobile Touch-Friendly Preview Card (Prevents Touch Trapping & Gesture Hijacking) */}
          <div className="md:hidden mt-5 bg-gradient-to-br from-blue-50/70 via-white to-teal-50/50 rounded-2xl p-4 text-slate-900 shadow-2xs space-y-3.5 border border-blue-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold tracking-wide text-blue-900">
                  4D 知识图谱 · 移动端导览
                </span>
              </div>
              <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                IASLC / AJCC / CSCO
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              集成 {CancerRegistry.get(cancerType).name} 病理因果链、分期演进及靶免方案推演沙盘。推荐进入全屏沉浸沙盘，体验双指自由缩放与时间轴推演。
            </p>

            {/* 3 Key Capabilities Badges */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-semibold">
              <div className="bg-sky-50 rounded-lg py-1.5 px-1 text-sky-700 border border-sky-200/80">
                4D 时间轴推演
              </div>
              <div className="bg-teal-50 rounded-lg py-1.5 px-1 text-teal-700 border border-teal-200/80">
                分期拓扑因果
              </div>
              <div className="bg-indigo-50 rounded-lg py-1.5 px-1 text-indigo-700 border border-indigo-200/80">
                靶免方案分流
              </div>
            </div>

            <Link
              href="/knowledge"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>进入 {CancerRegistry.get(cancerType).name} 4D 全屏沙盘 ↗</span>
            </Link>
          </div>

          {/* Desktop Sandbox CTA Link */}
          <div className="hidden md:block mt-6 sm:mt-8 text-center">
            <Link
              href="/knowledge"
              className="btn-primary px-8 py-3.5 rounded-2xl text-sm font-bold inline-flex items-center justify-center shadow-md cursor-pointer"
            >
              <span>进入 {CancerRegistry.get(cancerType).name} 4D 知识图谱全屏沉浸沙盘 (支持时间轴推演)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Act 4.5: OncoWiki Patient Evidence-Based Visual Encyclopedia Section */}
      <section id="wiki-showcase" className="py-8 sm:py-16 bg-gradient-to-b from-white via-sky-50/25 to-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
          <SectionHeader
            badge={ONCOWIKI_HEADER_DETAILS[cancerType]?.badge || `循证视觉百科 · ${CancerRegistry.get(cancerType).name}专区`}
            title={ONCOWIKI_HEADER_DETAILS[cancerType]?.title || `${CancerRegistry.get(cancerType).name}临床视觉百科`}
            subtitle={ONCOWIKI_HEADER_DETAILS[cancerType]?.subtitle || "以高精解剖图解与顶刊循证数据，直观破译病理指标与就医决策关键"}
          />

          {/* Active Specialty Zone Indicator */}
          <div className="flex items-center justify-center -mt-2 sm:-mt-4">
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white/90 px-3.5 sm:px-4 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>当前百科：<strong className="text-slate-900 font-bold">{CancerRegistry.get(cancerType).name}专区</strong></span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400">核心破恐话题与临床循证已实时装配</span>
            </div>
          </div>

          {/* Desktop 4 Core Clinical Scenario Categories Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wikiCategoriesData.map((cat) => {
              const getIcon = () => {
                if (cat.key === "nodule") return <Scan className="w-6 h-6 text-emerald-600" />;
                if (cat.key === "pathology") return <Microscope className="w-6 h-6 text-blue-600" />;
                if (cat.key === "genetics") return <Dna className="w-6 h-6 text-purple-600" />;
                if (cat.key === "recovery") return <HeartPulse className="w-6 h-6 text-amber-600" />;
                return <BookOpen className="w-6 h-6 text-sky-600" />;
              };

              const getBorderHover = () => {
                if (cat.key === "nodule") return "hover:border-emerald-300 hover:shadow-emerald-500/10";
                if (cat.key === "pathology") return "hover:border-blue-300 hover:shadow-blue-500/10";
                if (cat.key === "genetics") return "hover:border-purple-300 hover:shadow-purple-500/10";
                if (cat.key === "recovery") return "hover:border-amber-300 hover:shadow-amber-500/10";
                return "hover:border-sky-300 hover:shadow-sky-500/10";
              };

              return (
                <Link
                  key={cat.key}
                  href={`/wiki?category=${cat.key}`}
                  onClick={() => setCancerType(cancerType)}
                  className={`bg-white rounded-3xl p-5 md:p-6 border border-slate-200/90 shadow-sm hover:shadow-xl ${getBorderHover()} hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer`}
                >
                  <div className="space-y-4">
                    {/* Top: Category Icon + Topic Count Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform shadow-2xs">
                        {getIcon()}
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border truncate ${cat.badgeBg}`}>
                        {cat.count > 0 ? `${cat.count} 个核心词条` : "临床专区"}
                      </span>
                    </div>

                    {/* Title & Clinical Explanation */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors tracking-tight">
                        {cat.label}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                        {cat.desc}
                      </p>
                    </div>

                    {/* Featured Topic Tags Preview */}
                    {cat.featuredTopics.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {cat.featuredTopics.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-800">
                    <span>进入分类查阅</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile 2x2 Compact Grid (Clean, Touch-Friendly, Zero Scroll Fatigue) */}
          <div className="md:hidden grid grid-cols-2 gap-2.5">
            {wikiCategoriesData.map((cat) => {
              const getIcon = () => {
                if (cat.key === "nodule") return <Scan className="w-5 h-5 text-emerald-600" />;
                if (cat.key === "pathology") return <Microscope className="w-5 h-5 text-blue-600" />;
                if (cat.key === "genetics") return <Dna className="w-5 h-5 text-purple-600" />;
                if (cat.key === "recovery") return <HeartPulse className="w-5 h-5 text-amber-600" />;
                return <BookOpen className="w-5 h-5 text-sky-600" />;
              };

              return (
                <Link
                  key={cat.key}
                  href={`/wiki?category=${cat.key}`}
                  onClick={() => setCancerType(cancerType)}
                  className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group active:scale-[0.98]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-100 shadow-2xs">
                        {getIcon()}
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border truncate ${cat.badgeBg}`}>
                        {cat.count > 0 ? `${cat.count}条` : "专区"}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors tracking-tight line-clamp-1">
                        {cat.label}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-[11px] font-bold text-blue-700">
                    <span>查阅</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Bottom Action Area */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/wiki"
              className="w-full sm:w-auto btn-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>进入 {CancerRegistry.get(cancerType).name} 百科全部 {CancerRegistry.get(cancerType)?.content?.wikiTopics?.length || 0} 个词条</span>
            </Link>
            <Link
              href="/resources"
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all inline-flex items-center justify-center gap-2 shadow-2xs cursor-pointer text-center"
            >
              <Compass className="w-4 h-4 text-slate-600 shrink-0" />
              <span>学术指南导航</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Act 5 (formerly 1.5): Multi-Cancer Evidence Matrix — Cross-Specialty Exploration Hub */}
      <section className="py-8 sm:py-16 bg-slate-50/80 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
          <SectionHeader
            badge="探索更多癌种专区"
            title="多癌种临床循证体系"
            subtitle="严格对齐国际指南与前瞻性队列，覆盖各实体肿瘤核心病理特征与诊疗路径"
          />

          {/* Desktop 9 Cancer Cards Matrix */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CANCER_MATRIX_CARDS.map((card) => {
              const isCurrentActive =
                cancerType === card.id ||
                (card.id === "colorectal" && (cancerType === "colon" || cancerType === "rectal")) ||
                (card.id === "endometrial" && cancerType === "cervical");
              return (
                <div
                  key={card.id}
                  className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between group ${
                    isCurrentActive
                      ? "border-blue-500 shadow-xl ring-2 ring-blue-500/30 bg-blue-50/15"
                      : `border-slate-200/90 shadow-sm hover:shadow-md ${card.hoverColor}`
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform ${
                            isCurrentActive
                              ? "bg-blue-600 text-white border-blue-600 shadow-blue-500/25"
                              : "bg-slate-50 border-slate-200/80 text-slate-700"
                          }`}
                        >
                          <CancerIcon type={card.id} className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{card.name}</span>
                          </h3>
                          <span className="text-[11px] text-slate-500 font-mono line-clamp-1">{card.enName}</span>
                        </div>
                      </div>
                      {isCurrentActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          当前专区
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          已投产
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {card.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {card.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-5 border-t border-slate-100 mt-5">
                    <Link
                      href="/profile"
                      onClick={() => setCancerType(card.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                        isCurrentActive
                          ? "text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                          : "text-slate-700 bg-slate-100 hover:bg-slate-200/80"
                      }`}
                    >
                      <span>进入{card.name.replace("专区", "")}临床档案</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Compact 3x3 Cancer Launcher & Quick Control Strip */}
          <div className="md:hidden space-y-3.5">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CANCER_MATRIX_CARDS.map((card) => {
                const isCurrentActive =
                  cancerType === card.id ||
                  (card.id === "colorectal" && (cancerType === "colon" || cancerType === "rectal")) ||
                  (card.id === "endometrial" && cancerType === "cervical");

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setCancerType(card.id)}
                    className={`p-2 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border active:scale-[0.97] ${
                      isCurrentActive
                        ? "bg-blue-50 border-blue-500 shadow-2xs ring-2 ring-blue-500/20 text-blue-700"
                        : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                      isCurrentActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      <CancerIcon type={card.id} className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold tracking-tight line-clamp-1">
                      {card.name.replace("专区", "")}
                    </span>
                    {isCurrentActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Zone Fast Jump Action Card */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                  <span>当前专区：{CancerRegistry.get(cancerType).name}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  已自动联动全站研究库、知识图谱与百科
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href="/profile"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs"
                >
                  建档/推演 ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Act 5 (FAQ): Frequently Asked Questions & Final Conversion CTA */}
      <section className="py-8 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="患者与家属答疑"
            title="常见问题解答 (FAQ)"
            subtitle="了解如何正确使用知癌维基 (ZhiaiWiki) 辅助您的诊疗沟通"
          />

          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            <FaqItem
              q="我该如何获取我的病理报告参数？"
              a="在您完成手术或穿刺活检后，医院病理科会出具正式报告。肺癌患者主要关注：TNM 分期、STAS 气道播散、胸膜侵犯（VPI）及 EGFR/ALK 突变；乳腺癌患者主要关注：TNM 预后分期、ER/PR/HER2 状态、Ki-67 指数、Nottingham 分级及 21 基因评分。您只需使用手机拍摄报告全貌或在个人档案中直接填入对应指标即可。"
            />
            <FaqItem
              q="系统给出的数据会替代主治医生的诊断吗？"
              a="绝对不会。知癌维基 (ZhiaiWiki) 是一个纯粹的循证医学科普与信息平权工具。我们帮助您把艰涩的医学术语翻译为清晰的国际顶级研究数据，并生成一份《门诊就医问诊清单》，帮助您在复查或问诊时与主治医生更加高效地沟通。"
            />
            <FaqItem
              q="如何将知癌维基作为手机 App 使用？"
              a="本站已全面支持 PWA (Progressive Web App) 技术。在 iPhone 的 Safari 浏览器中点击底部的【分享】按钮并选择【添加到主屏幕】；在安卓 Chrome 中点击右上角菜单选择【添加到主屏幕】，即可像原生 App 一样全屏沉浸使用。"
            />
            <FaqItem
              q="知癌维基目前支持哪些癌种的循证分析与就医导航？"
              a="本系统已全面支持 11 大高发实体肿瘤的循证决策与前瞻队列导航：① 肺癌（IASLC 第9版全新分期、纯磨/混磨 CTR 实性折算、STAS 气道播散、三代靶向药相互作用）；② 乳腺癌（AJCC 8/9th 双轨病理预后分期、BI-RADS 超声钼靶评级、TAILORx 21 基因免化疗、HER2 双靶与强化）；③ 结肠癌（AJCC 第8版分期、IDEA 协作组 3个月 CAPOX 减毒、dMMR/MSI-H 免疫单药、全 RAS/BRAF 靶向分流）；④ 直肠癌（高/中/低位保肛评估、MRI 壁外血管浸润 EMVI 与直肠系膜筋膜 MRF、TNT 全程新辅助治疗、Watch & Wait 临床完全缓解策略）；⑤ 胃癌（日本规约 JGCA、cT1a 早期内镜 ESD 保胃黄金指征、D2 根治淋巴结质控、Claudin 18.2 与 HER2 双靶、FLOT 围手术期三联）；⑥ 原发性肝癌（国家卫健委 CNLC 2024 分期、Child-Pugh 与 ALBI 肝储备评估、门静脉癌栓系统转化、T+A 双达一线方案）；⑦ 食管癌（NEOCRTEC5010 新辅助同步放化疗、鳞癌浸润深度评估、CheckMate-577 术后辅助免疫）；⑧ 甲状腺癌（中国 C-TIRADS 超声分级、55岁分水岭、PTMC 低危微小癌「主动监测」免手术、免除过度碘131清甲）；⑨ 子宫内膜癌（FIGO 2023 四分子分型、POLE 超突变预后卓越与放化疗降阶梯、dMMR/MSI-H 免疫获益）；⑩ 宫颈癌（高危 HPV 持续感染阶梯管理、FIGO 2018/2023 分期、KEYNOTE-826 靶免联合）；⑪ 胰腺癌（NCCN/CSCO 可切除性四分类、新辅助 FOLFIRINOX 转化、CA19-9 动力学监测、BRCA 突变奥拉帕利维持）。全癌种医学算法物理隔离，确保 0 术语穿模。"
            />
          </div>

          {/* Final Action Card */}
          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-5 sm:p-8 md:p-10 text-white text-center shadow-xl space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-4xl font-black tracking-tight">
              准备好科学破译您的临床报告了吗？
            </h3>
            <p className="text-blue-100 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
              只需一分钟，让国际顶级同行评审医学研究为您点亮清晰、从容的科学决策之路。
            </p>
            <div>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
                <span>建立专属临床档案</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Unified Global Footer */}
      <Footer maxWidth="max-w-7xl" />
    </div>
  );
}



function _LogoMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shadow-xs bg-white">
        <img src="/logo.svg" alt="知癌维基 Logo" className="w-full h-full object-contain" />
      </div>
      <span className="font-extrabold text-slate-900 tracking-tight text-base">
        Zhiai<span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent font-black">Wiki</span>
      </span>
    </div>
  );
}

function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto px-1 space-y-2 sm:space-y-3">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-50 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-blue-700 border border-blue-200 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />
        <span>{badge}</span>
      </div>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">{title}</h2>
      <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">{subtitle}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 sm:px-6 py-3.5 sm:py-4 text-left flex items-center justify-between gap-3 font-bold text-slate-900 text-sm sm:text-base hover:text-accent-blue transition-colors cursor-pointer"
      >
        <span>{q}</span>
        <span className="text-slate-400 text-base sm:text-lg transition-transform duration-200 shrink-0 font-mono">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
          {a}
        </div>
      )}
    </div>
  );
}

