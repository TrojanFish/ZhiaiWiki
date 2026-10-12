"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, 
  Search, 
  Target, 
  Layers, 
  ShieldCheck,
  Microscope,
  Activity,
  Loader2,
  TrendingUp,
  GitBranch
} from "lucide-react";
import StudyCard, { StudyItem } from "@/components/StudyCard";
import Footer from "@/components/Footer";
import { useCancerType } from "@/components/common/CancerSwitch";
import { CancerRegistry } from "@/lib/cancerRegistry";
import { KmCurveChart } from "@/components/common/KmCurveChart";
import { ForestPlotChart } from "@/components/common/ForestPlotChart";
import { TrialEligibilityMatrix } from "@/components/common/TrialEligibilityMatrix";
import { PdfViewerModal } from "@/components/common/PdfViewerModal";
import { 
  LANDMARK_KM_DATA, 
  LANDMARK_FOREST_DATA, 
  LANDMARK_TRIAL_CRITERIA 
} from "@/lib/landmarkStudiesData";

export type StudyTopic = "all" | "surgery" | "targeted" | "immunotherapy" | "pathology" | "imaging";

export default function StudiesPage() {
  const { cancerType } = useCancerType();
  const activeCancerName = useMemo(() => {
    return CancerRegistry.get(cancerType)?.name || "实体瘤";
  }, [cancerType]);
  const [studies, setStudies] = useState<StudyItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<StudyTopic>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"library" | "km" | "forest" | "eligibility">("library");
  const [activePdfStudy, setActivePdfStudy] = useState<StudyItem | null>(null);
  const activeRequestIdRef = React.useRef(0);

  // 300ms debounce on search input to eliminate request storm and typing stutter
  useEffect(() => {
    if (searchQuery !== debouncedQuery) {
      setIsSearching(true);
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, debouncedQuery]);

  const loadStudies = async (query: string, level: string, isFirst = false) => {
    const requestId = ++activeRequestIdRef.current;
    if (isFirst) setInitialLoading(true);
    setIsSearching(true);

    try {
      const res = await fetch(`/api/studies?q=${encodeURIComponent(query)}&level=${level}&cancerType=${cancerType}`);
      const data = await res.json();
      // Drop response if a newer request was dispatched in the meantime (Race-condition protection)
      if (requestId !== activeRequestIdRef.current) return;

      if (data.success) {
        setStudies(data.studies);
        setTotalCount(data.totalCount);
      }
    } catch (e) {
      console.error("Failed to load studies", e);
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setInitialLoading(false);
        setIsSearching(false);
      }
    }
  };

  useEffect(() => {
    loadStudies(debouncedQuery, selectedLevel, initialLoading);
  }, [debouncedQuery, selectedLevel, cancerType]);

  // Client-side topic segment filter
  const filteredStudies = useMemo(() => {
    if (selectedTopic === "all") return studies;

    return studies.filter((study) => {
      const factors = Array.isArray(study.relevantFactors) ? study.relevantFactors : [];
      const titleUpper = (study.title || "").toUpperCase();
      const concUpper = (study.keyConclusions || []).join(" ").toUpperCase();
      const fullText = `${titleUpper} ${concUpper}`;

      if (cancerType === "breast") {
        switch (selectedTopic) {
          case "surgery":
            return (
              factors.includes("SLNB") ||
              factors.includes("ACOSOG") ||
              factors.includes("SURGERY") ||
              fullText.includes("SLNB") ||
              fullText.includes("Z0011") ||
              fullText.includes("AXILLARY") ||
              fullText.includes("MASTECTOMY") ||
              fullText.includes("CONSERVATION")
            );
          case "targeted":
            return (
              factors.includes("HER2") ||
              factors.includes("ADC") ||
              fullText.includes("DESTINY") ||
              fullText.includes("TRASTUZUMAB") ||
              fullText.includes("PERTUZUMAB") ||
              fullText.includes("APHINITY") ||
              fullText.includes("T-DXD")
            );
          case "immunotherapy":
            return (
              factors.includes("IMMUNOTHERAPY") ||
              factors.includes("TNBC") ||
              fullText.includes("KEYNOTE") ||
              fullText.includes("PEMBROLIZUMAB") ||
              fullText.includes("IMPASSION")
            );
          case "pathology":
            return (
              factors.includes("GENE21") ||
              factors.includes("ONCOTYPE") ||
              factors.includes("TAILORX") ||
              factors.includes("RXPONDER") ||
              factors.includes("MONARCHE") ||
              factors.includes("CDK4/6") ||
              fullText.includes("TAILORX") ||
              fullText.includes("RXPONDER") ||
              fullText.includes("ONCOTYPE") ||
              fullText.includes("MONARCHE") ||
              fullText.includes("ABEMACICLIB")
            );
          case "imaging":
            return (
              factors.includes("BI-RADS") ||
              factors.includes("MRI") ||
              factors.includes("CALCIFICATION") ||
              fullText.includes("MAMMOGRAPHY") ||
              fullText.includes("ULTRASOUND") ||
              fullText.includes("CALCIFICATION") ||
              fullText.includes("BI-RADS")
            );
          default:
            return true;
        }
      }

      if (cancerType === "colorectal") {
        switch (selectedTopic) {
          case "surgery":
            return (
              factors.includes("RAPIDO") ||
              factors.includes("PROSPECT") ||
              factors.includes("TNT") ||
              factors.includes("SURGERY") ||
              factors.includes("TME") ||
              fullText.includes("RAPIDO") ||
              fullText.includes("PROSPECT") ||
              fullText.includes("NEOADJUVANT") ||
              fullText.includes("SURGERY") ||
              fullText.includes("RECTAL") ||
              fullText.includes("TME")
            );
          case "targeted":
            return (
              factors.includes("CETUXIMAB") ||
              factors.includes("BEVACIZUMAB") ||
              factors.includes("BEACON") ||
              factors.includes("FRUQUINTINIB") ||
              factors.includes("TAS-102") ||
              factors.includes("HER2") ||
              fullText.includes("CALGB") ||
              fullText.includes("FIRE-3") ||
              fullText.includes("BEACON") ||
              fullText.includes("FRESCO") ||
              fullText.includes("RECOURSE") ||
              fullText.includes("DESTINY") ||
              fullText.includes("CETUXIMAB") ||
              fullText.includes("BEVACIZUMAB") ||
              fullText.includes("ENCORAFENIB") ||
              fullText.includes("FRUQUINTINIB")
            );
          case "immunotherapy":
            return (
              factors.includes("KEYNOTE-177") ||
              factors.includes("NICHE-2") ||
              factors.includes("PEMBROLIZUMAB") ||
              factors.includes("DMMR") ||
              factors.includes("MSI-H") ||
              fullText.includes("KEYNOTE-177") ||
              fullText.includes("NICHE") ||
              fullText.includes("PEMBROLIZUMAB") ||
              fullText.includes("NIVOLUMAB") ||
              fullText.includes("DMMR") ||
              fullText.includes("MSI-H")
            );
          case "pathology":
            return (
              factors.includes("IDEA") ||
              factors.includes("MOSAIC") ||
              factors.includes("CHEMOTHERAPY_DURATION") ||
              fullText.includes("IDEA") ||
              fullText.includes("MOSAIC") ||
              fullText.includes("CAPOX") ||
              fullText.includes("FOLFOX") ||
              fullText.includes("OXALIPLATIN") ||
              fullText.includes("NEUROTOXICITY")
            );
          case "imaging":
            return (
              factors.includes("MRI") ||
              factors.includes("CRM") ||
              factors.includes("EMVI") ||
              fullText.includes("MRI") ||
              fullText.includes("CRM") ||
              fullText.includes("EMVI") ||
              fullText.includes("HIGH-RESOLUTION")
            );
          default:
            return true;
        }
      }

      if (cancerType === "liver") {
        switch (selectedTopic) {
          case "surgery":
            return (
              factors.includes("SURGERY") ||
              factors.includes("RESECTION") ||
              factors.includes("TRANSPLANT") ||
              factors.includes("MILAN") ||
              fullText.includes("切除") ||
              fullText.includes("移植") ||
              fullText.includes("MILAN") ||
              fullText.includes("SURGERY")
            );
          case "targeted":
            return (
              factors.includes("IMBRAVE") ||
              factors.includes("ORIENT-32") ||
              factors.includes("REFLECT") ||
              factors.includes("LENVATINIB") ||
              factors.includes("SORAFENIB") ||
              factors.includes("ATEZOLIZUMAB") ||
              factors.includes("BEVACIZUMAB") ||
              fullText.includes("IMBRAVE") ||
              fullText.includes("ORIENT") ||
              fullText.includes("REFLECT") ||
              fullText.includes("仑伐替尼") ||
              fullText.includes("索拉非尼") ||
              fullText.includes("阿替利珠单抗") ||
              fullText.includes("信迪利单抗")
            );
          case "pathology":
            return (
              factors.includes("TACE") ||
              factors.includes("HAIC") ||
              factors.includes("INTERVENTION") ||
              fullText.includes("TACE") ||
              fullText.includes("HAIC") ||
              fullText.includes("介入") ||
              fullText.includes("灌注")
            );
          case "immunotherapy":
            return (
              factors.includes("HIMALAYA") ||
              factors.includes("CHECKMATE-040") ||
              factors.includes("DURVALUMAB") ||
              factors.includes("TREMELIMUMAB") ||
              fullText.includes("HIMALAYA") ||
              fullText.includes("STRIDE") ||
              fullText.includes("双免疫") ||
              fullText.includes("免疫")
            );
          case "imaging":
            return (
              factors.includes("MRI") ||
              factors.includes("CT") ||
              factors.includes("MVI") ||
              factors.includes("AFP") ||
              fullText.includes("MRI") ||
              fullText.includes("造影") ||
              fullText.includes("微血管侵犯") ||
              fullText.includes("AFP")
            );
          default:
            return true;
        }
      }

      if (cancerType === "gastric") {
        switch (selectedTopic) {
          case "targeted":
            return (
              factors.includes("HER2") ||
              factors.includes("TOGA") ||
              factors.includes("SPOTLIGHT") ||
              factors.includes("GLOW") ||
              factors.includes("CLAUDIN") ||
              factors.includes("CLDN") ||
              factors.includes("ZOLBETUXIMAB") ||
              factors.includes("TRASTUZUMAB") ||
              fullText.includes("TOGA") ||
              fullText.includes("SPOTLIGHT") ||
              fullText.includes("GLOW") ||
              fullText.includes("HER2") ||
              fullText.includes("CLAUDIN") ||
              fullText.includes("曲妥珠单抗") ||
              fullText.includes("佐妥昔单抗")
            );
          case "immunotherapy":
            return (
              factors.includes("CHECKMATE") ||
              factors.includes("KEYNOTE") ||
              factors.includes("RATIONALE") ||
              factors.includes("NIVOLUMAB") ||
              factors.includes("PEMBROLIZUMAB") ||
              factors.includes("TISLELIZUMAB") ||
              factors.includes("CPS") ||
              factors.includes("PD-L1") ||
              fullText.includes("CHECKMATE") ||
              fullText.includes("KEYNOTE") ||
              fullText.includes("649") ||
              fullText.includes("811") ||
              fullText.includes("305") ||
              fullText.includes("纳武利尤单抗") ||
              fullText.includes("帕博利珠单抗") ||
              fullText.includes("替雷利珠单抗") ||
              fullText.includes("CPS")
            );
          case "surgery":
            return (
              factors.includes("FLOT4") ||
              factors.includes("SURGERY") ||
              factors.includes("D2") ||
              factors.includes("ESD") ||
              fullText.includes("FLOT") ||
              fullText.includes("D2") ||
              fullText.includes("ESD") ||
              fullText.includes("切除") ||
              fullText.includes("新辅助")
            );
          case "pathology":
            return (
              factors.includes("LAUREN") ||
              factors.includes("BORRMANN") ||
              factors.includes("PERITONEAL") ||
              factors.includes("DIFFUSE") ||
              fullText.includes("LAUREN") ||
              fullText.includes("弥漫型") ||
              fullText.includes("肠型") ||
              fullText.includes("腹膜") ||
              fullText.includes("印戒细胞")
            );
          case "imaging":
            return (
              factors.includes("CT") ||
              factors.includes("EUS") ||
              factors.includes("ENDOSCOPY") ||
              fullText.includes("CT") ||
              fullText.includes("超声胃镜") ||
              fullText.includes("胃镜")
            );
          default:
            return true;
        }
      }

      if (cancerType === "pancreatic") {
        switch (selectedTopic) {
          case "surgery":
            return (
              factors.includes("WHIPPLE") ||
              factors.includes("RESECTION") ||
              factors.includes("SURGERY") ||
              factors.includes("R0") ||
              fullText.includes("WHIPPLE") ||
              fullText.includes("切除") ||
              fullText.includes("手术") ||
              fullText.includes("R0")
            );
          case "targeted":
            return (
              factors.includes("FOLFIRINOX") ||
              factors.includes("PRODIGE") ||
              factors.includes("GEMCITABINE") ||
              factors.includes("ADJUVANT") ||
              fullText.includes("PRODIGE") ||
              fullText.includes("FOLFIRINOX") ||
              fullText.includes("吉西他滨") ||
              fullText.includes("辅助化疗")
            );
          case "pathology":
            return (
              factors.includes("KRAS") ||
              factors.includes("BRCA") ||
              factors.includes("POLO") ||
              factors.includes("OLAPARIB") ||
              factors.includes("CA19-9") ||
              fullText.includes("KRAS") ||
              fullText.includes("BRCA") ||
              fullText.includes("POLO") ||
              fullText.includes("奥拉帕利") ||
              fullText.includes("CA19-9")
            );
          case "immunotherapy":
            return (
              factors.includes("MPACT") ||
              factors.includes("NAB-PACLITAXEL") ||
              factors.includes("NAPOLI") ||
              fullText.includes("MPACT") ||
              fullText.includes("白蛋白紫杉醇") ||
              fullText.includes("NAPOLI") ||
              fullText.includes("AG方案")
            );
          case "imaging":
            return (
              factors.includes("CT") ||
              factors.includes("EUS") ||
              factors.includes("BORDERLINE") ||
              fullText.includes("CT") ||
              fullText.includes("交界性") ||
              fullText.includes("血管侵犯")
            );
          default:
            return true;
        }
      }

      if (cancerType === "esophageal") {
        switch (selectedTopic) {
          case "surgery":
            return (
              factors.includes("SURGERY") ||
              factors.includes("RESECTION") ||
              factors.includes("CHECKMATE-577") ||
              factors.includes("577") ||
              fullText.includes("CHECKMATE") ||
              fullText.includes("577") ||
              fullText.includes("切除") ||
              fullText.includes("手术") ||
              fullText.includes("辅助")
            );
          case "targeted":
            return (
              factors.includes("NEOCRTEC5010") ||
              factors.includes("CROSS") ||
              factors.includes("NEOADJUVANT") ||
              fullText.includes("NEOCRTEC") ||
              fullText.includes("CROSS") ||
              fullText.includes("新辅助") ||
              fullText.includes("放化疗")
            );
          case "immunotherapy":
            return (
              factors.includes("ESCORT-1ST") ||
              factors.includes("RATIONALE-306") ||
              factors.includes("JUPITER-06") ||
              factors.includes("CAMRELIZUMAB") ||
              factors.includes("TISLELIZUMAB") ||
              fullText.includes("ESCORT") ||
              fullText.includes("RATIONALE") ||
              fullText.includes("卡瑞利珠单抗") ||
              fullText.includes("替雷利珠单抗") ||
              fullText.includes("一线免疫")
            );
          case "pathology":
            return (
              factors.includes("ESCC") ||
              factors.includes("SQUAMOUS") ||
              factors.includes("ADENOCARCINOMA") ||
              factors.includes("LYMPH_NODE") ||
              fullText.includes("鳞癌") ||
              fullText.includes("腺癌") ||
              fullText.includes("分化") ||
              fullText.includes("淋巴结")
            );
          case "imaging":
            return (
              factors.includes("CT") ||
              factors.includes("EUS") ||
              factors.includes("ESOPHAGOGRAM") ||
              fullText.includes("CT") ||
              fullText.includes("超声内镜") ||
              fullText.includes("钡餐") ||
              fullText.includes("穿孔")
            );
          default:
            return true;
        }
      }

      if (cancerType === "thyroid") {
        switch (selectedTopic) {
          case "targeted":
            return (
              factors.includes("SELECT") ||
              factors.includes("COSMIC") ||
              factors.includes("LENVATINIB") ||
              factors.includes("CABOZANTINIB") ||
              factors.includes("SORAFENIB") ||
              factors.includes("TKI") ||
              factors.includes("RAIR-DTC") ||
              factors.includes("RR-DTC") ||
              factors.includes("仑伐替尼") ||
              factors.includes("SELECT研究") ||
              fullText.includes("SELECT") ||
              fullText.includes("COSMIC") ||
              fullText.includes("仑伐替尼") ||
              fullText.includes("卡博替尼") ||
              fullText.includes("索拉非尼") ||
              fullText.includes("碘难治")
            );
          case "surgery":
            return (
              factors.includes("SURGERY") ||
              factors.includes("THYROIDECTOMY") ||
              factors.includes("LYMPH_NODE") ||
              factors.includes("KUMA") ||
              factors.includes("主动监测") ||
              factors.includes("免除手术") ||
              fullText.includes("切除") ||
              fullText.includes("全切") ||
              fullText.includes("腺叶切除") ||
              fullText.includes("中央区") ||
              fullText.includes("侧颈") ||
              fullText.includes("清扫") ||
              fullText.includes("主动监测")
            );
          case "pathology":
            return (
              factors.includes("BRAF") ||
              factors.includes("RET") ||
              factors.includes("ARROW") ||
              factors.includes("PRALSETINIB") ||
              factors.includes("SELPERCATINIB") ||
              factors.includes("RET突变") ||
              factors.includes("RET融合") ||
              factors.includes("普拉替尼") ||
              fullText.includes("BRAF") ||
              fullText.includes("RET") ||
              fullText.includes("ARROW") ||
              fullText.includes("普拉替尼") ||
              fullText.includes("塞普替尼") ||
              fullText.includes("髓样癌")
            );
          case "immunotherapy":
            return (
              factors.includes("ESTIMABL2") ||
              factors.includes("RAI") ||
              factors.includes("IODINE") ||
              factors.includes("TSH") ||
              factors.includes("碘-131清甲") ||
              factors.includes("免除放疗") ||
              factors.includes("辐射防护") ||
              fullText.includes("ESTIMABL") ||
              fullText.includes("碘-131") ||
              fullText.includes("131-I") ||
              fullText.includes("131I") ||
              fullText.includes("TSH") ||
              fullText.includes("清甲") ||
              fullText.includes("核素")
            );
          case "imaging":
            return (
              factors.includes("ULTRASOUND") ||
              factors.includes("TIRADS") ||
              factors.includes("TI-RADS") ||
              factors.includes("FNA") ||
              fullText.includes("超声") ||
              fullText.includes("TIRADS") ||
              fullText.includes("TI-RADS") ||
              fullText.includes("穿刺") ||
              fullText.includes("细针穿刺") ||
              fullText.includes("微小乳头状癌") ||
              fullText.includes("PTMC")
            );
          default:
            return true;
        }
      }

      switch (selectedTopic) {
        case "surgery":
          return (
            factors.includes("SURGERY_TYPE") ||
            factors.includes("TUMOR_SIZE") ||
            fullText.includes("SEGMENTECTOMY") ||
            fullText.includes("LOBECTOMY") ||
            fullText.includes("SUBLOBAR") ||
            fullText.includes("JCOG0802") ||
            fullText.includes("CALGB") ||
            fullText.includes("JCOG1211") ||
            fullText.includes("JCOG0804")
          );
        case "targeted":
          return (
            factors.includes("EGFR") ||
            factors.includes("ALK") ||
            fullText.includes("ADAURA") ||
            fullText.includes("ALINA") ||
            fullText.includes("OSIMERTINIB") ||
            fullText.includes("ALECTINIB") ||
            fullText.includes("TARGETED") ||
            fullText.includes("TKI")
          );
        case "immunotherapy":
          return (
            factors.includes("PD-L1") ||
            factors.includes("IMMUNOTHERAPY") ||
            fullText.includes("IMPOWER010") ||
            fullText.includes("KEYNOTE") ||
            fullText.includes("ATEZOLIZUMAB") ||
            fullText.includes("PEMBROLIZUMAB")
          );
        case "pathology":
          return (
            factors.includes("STAS") ||
            factors.includes("VPI") ||
            factors.includes("LVI") ||
            factors.includes("GRADE3") ||
            fullText.includes("STAS") ||
            fullText.includes("PLEURAL") ||
            fullText.includes("VASCULAR") ||
            fullText.includes("HISTOLOGIC")
          );
        case "imaging":
          return (
            factors.includes("CTR") ||
            factors.includes("PURE_GGO") ||
            factors.includes("SOLID_COMPONENT") ||
            fullText.includes("GGO") ||
            fullText.includes("CONSOLIDATION") ||
            fullText.includes("GROUND-GLASS") ||
            fullText.includes("FLEISCHNER")
          );
        default:
          return true;
      }
    });
  }, [studies, selectedTopic, cancerType]);

  const topicTabs = cancerType === "breast" ? [
    { id: "all", label: "全部核心文献", icon: BookOpen },
    { id: "surgery", label: "手术与前哨淋巴结", icon: Layers },
    { id: "targeted", label: "HER2 双靶与 ADC", icon: Target },
    { id: "pathology", label: "21 基因多基因检测", icon: Microscope },
    { id: "immunotherapy", label: "三阴性乳腺癌免疫", icon: ShieldCheck },
    { id: "imaging", label: "钼靶与影像学特征", icon: Activity },
  ] : cancerType === "colorectal" ? [
    { id: "all", label: "全部核心文献", icon: BookOpen },
    { id: "surgery", label: "直肠新辅助与全程 TNT", icon: Layers },
    { id: "targeted", label: "左右半与 RAS/BRAF 靶向", icon: Target },
    { id: "pathology", label: "辅助化疗周期与分期", icon: Microscope },
    { id: "immunotherapy", label: "dMMR/MSI-H 免疫单药", icon: ShieldCheck },
    { id: "imaging", label: "直肠高分辨 MRI 与 CRM", icon: Activity },
  ] : cancerType === "liver" ? [
    { id: "all", label: "全部核心文献", icon: BookOpen },
    { id: "targeted", label: "一线靶免联合方案", icon: Target },
    { id: "pathology", label: "TACE/HAIC 介入灌注", icon: Microscope },
    { id: "immunotherapy", label: "双免疫与维持治疗", icon: ShieldCheck },
    { id: "surgery", label: "手术切除与肝移植", icon: Layers },
    { id: "imaging", label: "普美显 MRI 与 MVI", icon: Activity },
  ] : cancerType === "gastric" ? [
    { id: "all", label: "全部核心文献", icon: BookOpen },
    { id: "targeted", label: "HER2 与 CLDN18.2 靶向", icon: Target },
    { id: "immunotherapy", label: "PD-L1 免疫与 CPS 分层", icon: ShieldCheck },
    { id: "surgery", label: "D2 根治切除与围术期", icon: Layers },
    { id: "pathology", label: "Lauren 分型与腹膜转移", icon: Microscope },
    { id: "imaging", label: "增强 CT 与胃镜超声", icon: Activity },
  ] : cancerType === "pancreatic" ? [
    { id: "all", label: "全部核心文献", icon: BookOpen },
    { id: "surgery", label: "Whipple 切除与 R0 切缘", icon: Layers },
    { id: "targeted", label: "mFOLFIRINOX 辅助化疗", icon: Target },
    { id: "pathology", label: "KRAS/BRCA 靶点与标志物", icon: Microscope },
    { id: "immunotherapy", label: "晚期一线 AG 方案", icon: ShieldCheck },
    { id: "imaging", label: "薄层 CT 与交界可切除", icon: Activity },
  ] : cancerType === "esophageal" ? [
    { id: "all", label: "全部核心文献", icon: BookOpen },
    { id: "surgery", label: "根治手术与术后辅助", icon: Layers },
    { id: "targeted", label: "新辅助放化疗 (CROSS)", icon: Target },
    { id: "immunotherapy", label: "晚期一线免疫联合", icon: ShieldCheck },
    { id: "pathology", label: "鳞癌/腺癌病理分型", icon: Microscope },
    { id: "imaging", label: "超声内镜与管壁浸润", icon: Activity },
  ] : cancerType === "thyroid" ? [
    { id: "all", label: "全部核心文献", icon: BookOpen },
    { id: "targeted", label: "放射性碘难治与 TKI", icon: Target },
    { id: "surgery", label: "甲状腺切除与清扫", icon: Layers },
    { id: "pathology", label: "BRAF/RET 驱动突变", icon: Microscope },
    { id: "immunotherapy", label: "TSH 抑制与 131I 治疗", icon: ShieldCheck },
    { id: "imaging", label: "高频彩超与颈部评估", icon: Activity },
  ] : [
    { id: "all", label: "全部核心文献", icon: BookOpen },
    { id: "surgery", label: "手术与亚肺叶切除", icon: Layers },
    { id: "targeted", label: "靶向辅助治疗", icon: Target },
    { id: "immunotherapy", label: "免疫维持与巩固", icon: ShieldCheck },
    { id: "pathology", label: "高危病理与浸润特征", icon: Microscope },
    { id: "imaging", label: "影像实性成分与 CTR", icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">

      {/* Hero Header */}
      <header className="pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-4 sm:pb-6 px-3.5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
        {/* Unified Top Pill Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-sky-700 border border-sky-200 shadow-xs max-w-full flex-wrap justify-center">
          <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="truncate">国际顶刊同行评审文献库</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
          <span className="text-emerald-700 font-extrabold inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>100% 原版 PDF 佐证已归档 · 零 AI 幻觉</span>
          </span>
        </div>

        {/* Unified H1 */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          汇聚全球顶刊 · <span className="text-blue-600">严谨循证文献矩阵</span>
        </h1>

        {/* Unified Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          {cancerType === "breast" ? (
            <>严格收录 <strong>Lancet、NEJM、JCO</strong> 等顶级期刊发表的里程碑多中心 RCT（TAILORx、RxPONDER、MonarchE、DESTINY-Breast 等）。为乳腺癌精准分型、免除过度化疗与强化靶向提供<strong>可验证、可溯源的坚实数据支撑</strong>。</>
          ) : cancerType === "colorectal" ? (
            <>严格收录 <strong>Lancet、NEJM、JCO</strong> 等顶级期刊发表的结直肠癌里程碑试验（IDEA、MOSAIC、KEYNOTE-177、CALGB 80405、RAPIDO 等）。为辅助化疗减毒、免疫免化疗与保肛策略提供<strong>可验证、可溯源的坚实数据支撑</strong>。</>
          ) : cancerType === "liver" ? (
            <>严格收录 <strong>NEJM、Lancet、JCO</strong> 等顶级期刊发表的原发性肝细胞癌里程碑试验（IMbrave150、ORIENT-32、REFLECT、HIMALAYA、LEAP-002 等）。为晚期一线靶免联合、介入转化与长程病毒抑制提供<strong>可验证、可溯源的坚实数据支撑</strong>。</>
          ) : cancerType === "gastric" ? (
            <>严格收录 <strong>Lancet、NEJM、JCO</strong> 等顶级期刊发表的原发性胃癌里程碑试验（CheckMate-649、ToGA、SPOTLIGHT、KEYNOTE-811、FLOT4 等）。为 HER2/CLDN18.2 靶向、PD-L1 CPS 免疫分层与 D2 根治决策提供<strong>可验证、可溯源的坚实数据支撑</strong>。</>
          ) : cancerType === "pancreatic" ? (
            <>严格收录 <strong>NEJM、Lancet、JCO</strong> 等顶级期刊发表的原发性胰腺导管腺癌里程碑试验（PRODIGE 24、MPACT、POLO、NAPOLI-3 等）。为 R0 根治术后辅助化疗、BRCA 维持治疗与交界转化分期决策提供<strong>可验证、可溯源的坚实数据支撑</strong>。</>
          ) : cancerType === "esophageal" ? (
            <>严格收录 <strong>NEJM、Lancet、JCO、JAMA</strong> 等顶级期刊发表的原发性食管癌里程碑试验（CheckMate-577、NEOCRTEC5010、CROSS、ESCORT-1st、RATIONALE-306 等）。为新辅助放化疗、术后免疫维持与晚期一线联合决策提供<strong>可验证、可溯源的坚实数据支撑</strong>。</>
          ) : cancerType === "thyroid" ? (
            <>严格收录 <strong>NEJM、Lancet、JCO</strong> 等顶级期刊发表的原发性分化型甲状腺癌里程碑试验（SELECT、COSMIC-311、ESTIMABL2、ARROW 等）。为放射性碘难治 (RR-DTC)、靶向 TKI 介入时机与 RET/BRAF 精准用药提供<strong>可验证、可溯源的坚实数据支撑</strong>。</>
          ) : (
            <>严格收录 <strong>Lancet、NEJM、JCO、JTO</strong> 等顶级期刊发表的多中心 RCT 与 Meta 分析。为每一项临床分期、术后辅助治疗与随访决策提供<strong>可验证、可溯源的坚实数据支撑</strong>。</>
          )}
        </p>

        {/* View Mode Switcher: 核心文献库 / KM生存曲线 / HR森林图 / 试验入组筛查 */}
        <div className="pt-2 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto p-1.5 bg-slate-200/80 rounded-2xl max-w-2xl mx-auto border border-slate-300/70 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode("library")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              viewMode === "library"
                ? "bg-white text-slate-900 shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>文献库 ({totalCount || filteredStudies.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("km")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              viewMode === "km"
                ? "bg-white text-blue-700 shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>KM 生存曲线</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("forest")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              viewMode === "forest"
                ? "bg-white text-indigo-700 shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
            <span>HR 森林图</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("eligibility")}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              viewMode === "eligibility"
                ? "bg-white text-emerald-700 shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>试验入组筛查</span>
          </button>
        </div>
      </header>

      {/* Studies Main Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 pb-12 sm:pb-16 space-y-4 sm:space-y-5 md:space-y-6">
        
        {/* Mode 1: Kaplan-Meier Survival Curve */}
        {viewMode === "km" && (() => {
          const landmarkKey = (cancerType === "colon" || cancerType === "rectal") ? "colorectal" : cancerType;
          return (
            <div className="w-full space-y-6 animate-fade-in">
              <KmCurveChart
                {...(LANDMARK_KM_DATA[landmarkKey] || LANDMARK_KM_DATA.lung)}
              />
            </div>
          );
        })()}

        {/* Mode 2: Hazard Ratio Forest Plot */}
        {viewMode === "forest" && (() => {
          const landmarkKey = (cancerType === "colon" || cancerType === "rectal") ? "colorectal" : cancerType;
          return (
            <div className="w-full space-y-6 animate-fade-in">
              <ForestPlotChart
                {...(LANDMARK_FOREST_DATA[landmarkKey] || LANDMARK_FOREST_DATA.lung)}
              />
            </div>
          );
        })()}

        {/* Mode 3: Trial Eligibility Matrix */}
        {viewMode === "eligibility" && (() => {
          const landmarkKey = (cancerType === "colon" || cancerType === "rectal") ? "colorectal" : cancerType;
          const criteriaData = LANDMARK_TRIAL_CRITERIA[landmarkKey] || LANDMARK_TRIAL_CRITERIA.lung;
          return (
            <div className="w-full space-y-6 animate-fade-in">
              <TrialEligibilityMatrix
                trialTitle={criteriaData.title}
                phase={criteriaData.phase}
                criteria={criteriaData.criteria}
              />
            </div>
          );
        })()}

        {/* Mode 4: Default Full Studies Library */}
        {viewMode === "library" && (
          <>
            {/* 1. Sticky Segmented Topic Navigation Bar (Capsule Stepper) */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar sticky top-20 z-20 backdrop-blur-md bg-white/95">
          {topicTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedTopic === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTopic(tab.id as StudyTopic)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Search & Evidence Grade Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">当前呈现：</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-extrabold text-xs font-mono">
              {filteredStudies.length} 篇文献
            </span>
            {totalCount > 0 && (
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>文献库总收录 {totalCount} 篇 · 100% 原版 PDF 佐证已归档</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search query with debounced indicator */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`搜索【${activeCancerName}】文献、期刊、临床试验或靶点...`}
                className="w-full pl-3.5 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              {isSearching && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Level filter */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer focus:bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="all">全部证据等级</option>
                <option value="5">⭐⭐⭐⭐⭐ 5星 · 最高证据 (RCT / Meta分析)</option>
                <option value="4">⭐⭐⭐⭐ 4星 · 高级别 (前瞻性多中心)</option>
                <option value="3">⭐⭐⭐ 3星 · 中级别 (单中心临床研究)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Studies Grid with Non-flickering Smooth Transition */}
        {initialLoading ? (
          <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <Loader2 className="animate-spin h-5 w-5 text-accent-blue shrink-0" />
            <span>正在加载已收录文献...</span>
          </div>
        ) : filteredStudies.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <Search className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="font-semibold text-slate-700 mb-1">未找到符合条件的已收录研究</div>
            <p className="text-xs text-slate-400">请尝试更换检索关键词或重置主题筛选条件。</p>
          </div>
        ) : (
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isSearching ? "opacity-75" : "opacity-100"}`}>
            {filteredStudies.map((study) => (
              <StudyCard 
                key={study.id} 
                study={study} 
                onOpenPdf={(s) => setActivePdfStudy(s)} 
              />
            ))}
          </div>
        )}
        </>
      )}

      {/* In-App Clinical PDF Evidence Viewer Modal */}
      <PdfViewerModal study={activePdfStudy} onClose={() => setActivePdfStudy(null)} />
      </main>

      <Footer maxWidth="max-w-7xl" />
    </div>
  );
}

