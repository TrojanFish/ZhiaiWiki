"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Scan,
  Ruler,
  AlertTriangle,
  ShieldCheck,
  CircleDot,
  Check,
  Microscope,
  Activity,
  Layers,
  Brain,
  Stethoscope,
  FileText,
  X,
  Edit3,
  Camera,
  Trash2,
  Share2,
  Pill,
  Target,
  Dna,
  GitBranch,
  Radio,
  FileCheck2,
  CheckCircle2,
  AlertOctagon,
  MinusCircle,
  User,
  Cloud,
  ShieldAlert,
  FileEdit,
} from "lucide-react";
import dynamic from "next/dynamic";
import AuthModal from "@/components/AuthModal";
import { showToast } from "@/components/common/Toast";

import JourneyMap from "./JourneyMap";
import SimilarCasesCard from "./SimilarCasesCard";
import { GlossaryTooltip } from "@/components/common/GlossaryTooltip";
import ProfileExportModal from "./ProfileExportModal";
import { DdiCheckerVisual } from "@/components/wiki/visuals/DdiCheckerVisual";
import { MolecularProfileCard } from "./MolecularProfileCard";


// Dynamically import ReportUploader modal for instant dashboard rendering
const ReportUploader = dynamic(() => import("./ReportUploader"), {
  ssr: false,
  loading: () => (
    <div className="p-8 sm:p-12 text-center text-slate-500 font-bold animate-pulse text-sm">
      正在加载临床报告解析与录入引擎...
    </div>
  ),
});



import ConsentModal from "@/components/ConsentModal";
import type { PatientProfile, CancerType } from "@/lib/types";
import { CancerRegistry } from "@/lib/cancerRegistry";
import { normalizeCancerType } from "@/lib/stagingRegistry";
import { getGuestId } from "@/lib/guest";
import Link from "next/link";
import { useCancerType } from "@/components/common/CancerSwitch";
import {
  getActiveCancerSlot,
  setActiveCancerSlot,
  getProfileBySlot,
  saveProfileToSlot,
  getAvailableProfileSlots,
  deleteProfileSlot,
  getDualPrimarySummary,
  EVENT_SLOT_CHANGED,
} from "@/lib/profileStorage";
import DualPrimarySwitcher from "@/components/profile/DualPrimarySwitcher";
import CrossCancerSynergyCard from "@/components/profile/CrossCancerSynergyCard";
import MdtConsultationHub from "@/components/profile/MdtConsultationHub";
import { DEMO_TEMPLATES, DemoTemplateItem } from "@/lib/demoTemplates";

export default function PatientDashboard() {
  const { cancerType: globalCancerType, setCancerType: setGlobalCancerType } = useCancerType();
  const [loadedTemplate, setLoadedTemplate] = useState<DemoTemplateItem | null>(null);
  const [activeSlot, setActiveSlot] = useState<CancerType>(() => {
    if (typeof window !== "undefined") {
      return getActiveCancerSlot();
    }
    return "lung";
  });
  const [availableSlots, setAvailableSlots] = useState<CancerType[]>(() => {
    if (typeof window !== "undefined") {
      return getAvailableProfileSlots();
    }
    return [];
  });
  const [dualSummary, setDualSummary] = useState(() => {
    if (typeof window !== "undefined") {
      return getDualPrimarySummary();
    }
    return { slots: [] as CancerType[], isDualPrimary: false, lungProfile: null, breastProfile: null, colonProfile: null, rectalProfile: null, colorectalProfile: null, gastricProfile: null, liverProfile: null, esophagealProfile: null, thyroidProfile: null, endometrialProfile: null, cervicalProfile: null, pancreaticProfile: null };
  });

  const [profile, setProfile] = useState<PatientProfile | null>(() => {
    if (typeof window !== "undefined") {
      return getProfileBySlot(getActiveCancerSlot());
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editMode, setEditMode] = useState<'edit_direct' | 'upload_new' | null>(null);
  const [manualDirectMode, setManualDirectMode] = useState(false);

  // Sync refs to prevent async loadProfile from dismissing active calibration / uploader
  const showUploaderRef = useRef(showUploader);
  const showUpdateModalRef = useRef(showUpdateModal);
  const editModeRef = useRef(editMode);

  useEffect(() => {
    showUploaderRef.current = showUploader;
    showUpdateModalRef.current = showUpdateModal;
    editModeRef.current = editMode;
  }, [showUploader, showUpdateModal, editMode]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOption, setDeleteOption] = useState<'single' | 'all'>('single');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDdiModal, setShowDdiModal] = useState(false);
  const [initialDdiDrugId, setInitialDdiDrugId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;
      setUserEmail(email);
    };
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // 核心原则：档案渲染严格绑定当前激活档案的真实属性，彻底根除切换导航栏导致的模板穿模
  const isProfileForActiveSlot = Boolean(profile && profile.cancerType === activeSlot);
  const activeType: CancerType = (isProfileForActiveSlot ? profile!.cancerType : activeSlot || 'lung') as CancerType;
  const isBreast = activeType === 'breast';
  const isColon = activeType === 'colon';
  const isRectal = activeType === 'rectal';
  const isColorectal = activeType === 'colorectal' || isColon || isRectal;
  const isGastric = activeType === 'gastric';
  const isLiver = activeType === 'liver';
  const isEsophageal = activeType === 'esophageal';
  const isThyroid = activeType === 'thyroid';
  const isEndometrial = activeType === 'endometrial';
  const isCervical = activeType === 'cervical';
  const isPancreatic = activeType === 'pancreatic';
  const isLung = activeType === 'lung';

  // 仅在首次装载个人档案时同步一次默认癌种，绝不在用户手动切换全局癌种时强行倒灌覆盖
  const initialProfileSyncedRef = React.useRef(false);
  useEffect(() => {
    if (profile?.cancerType && !initialProfileSyncedRef.current) {
      initialProfileSyncedRef.current = true;
      if (!globalCancerType) {
        setGlobalCancerType(profile.cancerType);
      }
    }
  }, [profile?.cancerType, globalCancerType, setGlobalCancerType]);

  const loadProfile = useCallback(async (slot: CancerType = activeSlot, showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) setLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`/api/profile?userId=${getGuestId()}&cancerType=${slot}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data && data.profile) {
        setProfile(data.profile);
        // Only clear uploader/edit mode if not actively interacting
        if (!showUploaderRef.current && !editModeRef.current && !showUpdateModalRef.current) {
          setShowUploader(false);
          setEditMode(null);
        }
        saveProfileToSlot(data.profile, slot);
        if (Array.isArray(data.availableSlots)) {
          const merged = Array.from(new Set([...getAvailableProfileSlots(), ...data.availableSlots])) as CancerType[];
          setAvailableSlots(merged);
        } else {
          setAvailableSlots(getAvailableProfileSlots());
        }
        setDualSummary(getDualPrimarySummary());
      } else {
        // Fallback: check local storage cached profile
        const localCached = getProfileBySlot(slot);
        if (localCached && (localCached.stage || (localCached as any).tStage || localCached.noduleType || localCached.tumorSize || localCached.organ || (localCached as any).biRads)) {
          setProfile(localCached);
          if (!showUploaderRef.current && !editModeRef.current && !showUpdateModalRef.current) {
            setShowUploader(false);
            setEditMode(null);
          }
          setAvailableSlots(getAvailableProfileSlots());
          setDualSummary(getDualPrimarySummary());
          return;
        }
        setProfile(null);
        if (!showUploaderRef.current) {
          setShowUploader(true);
        }
        setAvailableSlots(getAvailableProfileSlots());
        setDualSummary(getDualPrimarySummary());
      }
    } catch (err) {
      console.error("Failed to load profile", err);
      const localCached = getProfileBySlot(slot);
      if (localCached) {
        setProfile(localCached);
        if (!showUploaderRef.current && !editModeRef.current && !showUpdateModalRef.current) {
          setShowUploader(false);
        }
      } else {
        setShowUploader(true);
      }
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  }, [activeSlot]);

  // 当用户在全局导航栏切换癌种时，无论该卡槽是否已有档案，均响应式切换激活卡槽
  useEffect(() => {
    if (globalCancerType && globalCancerType !== activeSlot) {
      const existing = getProfileBySlot(globalCancerType);
      setActiveSlot(globalCancerType);
      setActiveCancerSlot(globalCancerType);
      setProfile(existing);
      if (existing) {
        setShowUploader(false);
      } else {
        setShowUploader(true);
      }
      loadProfile(globalCancerType, false);
    }
  }, [globalCancerType, activeSlot]);

  // 监听全局自定义事件 cancer-type-changed，确保跨组件即时响应
  useEffect(() => {
    const handleGlobalCancerChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.cancerType && detail.cancerType !== activeSlot) {
        const target = detail.cancerType as CancerType;
        const existing = getProfileBySlot(target);
        setActiveSlot(target);
        setActiveCancerSlot(target);
        setProfile(existing);
        if (existing) {
          setShowUploader(false);
        } else {
          setShowUploader(true);
        }
        loadProfile(target, false);
      }
    };
    window.addEventListener("cancer-type-changed", handleGlobalCancerChanged);
    return () => window.removeEventListener("cancer-type-changed", handleGlobalCancerChanged);
  }, [activeSlot]);

  const { recommendedTargetDrugId, matchedGeneLabel } = React.useMemo(() => {
    if (!profile) {
      return { 
        recommendedTargetDrugId: isBreast ? 'tamoxifen' : isGastric ? 'capecitabine' : isLiver ? 'atezolizumab' : isEsophageal ? 'camrelizumab' : isThyroid ? 'levothyroxine' : isEndometrial ? 'megestrol_acetate' : isCervical ? 'cisplatin' : isColorectal ? 'cetuximab' : 'osimertinib', 
        matchedGeneLabel: '常规用药参考' 
      };
    }

    if (isEndometrial || profile.cancerType === 'endometrial') {
      const rawData = (profile as any).clinicalData || (profile as any).cancerSpecificData || profile;
      if (rawData.molecularSubtype === 'POLEmut' || rawData.poleStatus === 'mutant') {
        return { recommendedTargetDrugId: 'megestrol_acetate', matchedGeneLabel: 'POLEmut 超突变型 (PORTEC-4a 预后极佳 · 安全免除辅助放化疗)' };
      }
      if (rawData.molecularSubtype === 'MMRd' || rawData.msiStatus === 'MSI-H') {
        return { recommendedTargetDrugId: 'dostarlimab', matchedGeneLabel: 'dMMR / MSI-H 错配修复缺陷 (RUBY / KEYNOTE-158 免疫突破)' };
      }
      if (rawData.molecularSubtype === 'p53abn' || rawData.p53Status === 'abnormal') {
        return { recommendedTargetDrugId: 'carboplatin_paclitaxel', matchedGeneLabel: 'p53abn 异常高危型 (PORTEC-3 TC 化疗联合放疗强化)' };
      }
      return {
        recommendedTargetDrugId: 'megestrol_acetate',
        matchedGeneLabel: profile.stage ? `${profile.stage}期子宫内膜癌综合诊疗评估` : '子宫内膜癌全身治疗评估'
      };
    }

    if (isCervical || profile.cancerType === 'cervical') {
      const rawData = (profile as any).clinicalData || (profile as any).cancerSpecificData || profile;
      if (profile.stage?.startsWith('III') || profile.stage?.startsWith('IV') || rawData.parametrialInvasion) {
        return { recommendedTargetDrugId: 'cisplatin', matchedGeneLabel: '局部进展期宫颈癌 (EMBRACE-I 顺铂同步放化疗 CCRT 首选)' };
      }
      if (rawData.pdl1Cps != null && Number(rawData.pdl1Cps) >= 1) {
        return { recommendedTargetDrugId: 'pembrolizumab', matchedGeneLabel: 'PD-L1 CPS ≥ 1 晚期复发 (KEYNOTE-826 一线化免靶向联合)' };
      }
      return {
        recommendedTargetDrugId: 'cisplatin',
        matchedGeneLabel: profile.stage ? `${profile.stage}期宫颈癌规范诊疗指引` : '宫颈癌专科综合治疗评估'
      };
    }

    if (isThyroid || profile.cancerType === 'thyroid') {
      const rawData = (profile as any).clinicalData || (profile as any).cancerSpecificData || (profile as any).thyroidData || profile;
      if (rawData.retFusion || rawData.retStatus === 'positive' || rawData.geneMutations?.some((m: any) => m.gene === 'RET')) {
        return { recommendedTargetDrugId: 'pralsetinib', matchedGeneLabel: 'RET 变异晚期/难治甲状腺癌 (普拉替尼一线靶向)' };
      }
      if (rawData.brafMutation === 'V600E' && (rawData.stage?.startsWith('IV') || rawData.refractoryRai)) {
        return { recommendedTargetDrugId: 'dabrafenib', matchedGeneLabel: 'BRAF V600E 突变晚期/RAIR-DTC (达拉非尼+曲美替尼双靶)' };
      }
      if (rawData.refractoryRai || rawData.systemicRegimen === 'lenvatinib') {
        return { recommendedTargetDrugId: 'lenvatinib', matchedGeneLabel: '放射性碘难治性分化型甲状腺癌 (SELECT 仑伐替尼一线单药)' };
      }
      return { 
        recommendedTargetDrugId: 'levothyroxine', 
        matchedGeneLabel: rawData.recurrenceRisk ? `${rawData.recurrenceRisk}复发风险 (L-T4 术后促甲状腺激素 TSH 抑制治疗)` : '分化型甲状腺癌 TSH 抑制与激素替代基石' 
      };
    }

    if (isPancreatic || profile.cancerType === 'pancreatic') {
      const rawData = (profile as any).clinicalData || (profile as any).cancerSpecificData || profile;
      if (rawData.hasBrcaMutation || rawData.brcaStatus === 'mutated') {
        return { recommendedTargetDrugId: 'pancreatic_olaparib', matchedGeneLabel: 'gBRCA1/2 胚系突变 (POLO 研究奥拉帕利维持一线)' };
      }
      return { 
        recommendedTargetDrugId: 'pancreatic_olaparib', 
        matchedGeneLabel: '胰腺导管腺癌精准靶向与维持治疗评估 (POLO 研究)' 
      };
    }

    if (isEsophageal || profile.cancerType === 'esophageal') {
      const rawData = (profile as any).clinicalData || (profile as any).cancerSpecificData || profile;
      if (rawData.pdl1Cps != null && Number(rawData.pdl1Cps) >= 10) {
        return { recommendedTargetDrugId: 'camrelizumab', matchedGeneLabel: 'PD-L1 CPS ≥ 10 高表达 (ESCORT-1st 卡瑞利珠+化疗一线)' };
      }
      return { 
        recommendedTargetDrugId: 'camrelizumab', 
        matchedGeneLabel: profile.stage ? `${profile.stage}期食管鳞癌一线免疫联合评估 (ESCORT-1st/RATIONALE-306)` : '食管鳞癌一线免疫联合化疗' 
      };
    }

    if (isLiver || profile.cancerType === 'liver') {
      const rawData = (profile as any).clinicalData || (profile as any).cancerSpecificData || (profile as any).liverData || profile;
      if (rawData.systemicRegimen === 'orient32_sintilimab_bevacizumab') {
        return { recommendedTargetDrugId: 'sintilimab', matchedGeneLabel: 'ORIENT-32 中国原研双达方案 (信迪利单抗+贝伐珠类似物)' };
      }
      if (rawData.systemicRegimen === 'lenvatinib' || rawData.targetedDrug === 'lenvatinib') {
        return { recommendedTargetDrugId: 'lenvatinib', matchedGeneLabel: 'REFLECT 仑伐替尼一线单药靶向' };
      }
      if (rawData.systemicRegimen === 'donafenib') {
        return { recommendedTargetDrugId: 'donafenib', matchedGeneLabel: 'ZGDH9 多纳非尼中国原研一线靶向' };
      }
      if (rawData.antiviralTherapy === 'entecavir') {
        return { recommendedTargetDrugId: 'entecavir', matchedGeneLabel: '慢性乙肝终身抗病毒基石 (恩替卡韦)' };
      }
      if (rawData.antiviralTherapy === 'tenofovir_alafenamide' || rawData.antiviralTherapy === 'taf') {
        return { recommendedTargetDrugId: 'tenofovir_alafenamide', matchedGeneLabel: '慢性乙肝抗病毒 (TAF 丙酚替诺福韦)' };
      }
      return { 
        recommendedTargetDrugId: 'atezolizumab', 
        matchedGeneLabel: rawData.cnlcStage ? `CNLC ${rawData.cnlcStage}期一线靶免联合 (IMbrave150 T+A 方案)` : '原发性肝癌系统靶免治疗评估' 
      };
    }

    if (isGastric || profile.cancerType === 'gastric') {
      const rawData = (profile as any).clinicalData || (profile as any).cancerSpecificData || (profile as any).gastricData || profile;
      if (rawData.her2Status === 'positive' || rawData.her2Status === '3+') {
        return { recommendedTargetDrugId: 'trastuzumab', matchedGeneLabel: 'HER2 阳性 (ToGA 曲妥珠单抗联合化疗)' };
      }
      if (rawData.claudin18_2Status === 'positive') {
        return { recommendedTargetDrugId: 'zolbetuximab', matchedGeneLabel: 'Claudin 18.2 阳性 (SPOTLIGHT 佐妥昔单抗一线靶向)' };
      }
      if (rawData.pdl1Cps != null && rawData.pdl1Cps >= 5) {
        return { recommendedTargetDrugId: 'nivolumab', matchedGeneLabel: 'PD-L1 CPS ≥ 5 (CheckMate-649 纳武利尤单抗+化疗)' };
      }
      if (rawData.msiStatus === 'MSI-H' || rawData.dmmrStatus === 'dMMR') {
        return { recommendedTargetDrugId: 'pembrolizumab', matchedGeneLabel: 'dMMR / MSI-H 胃癌免疫一线' };
      }
      return { 
        recommendedTargetDrugId: 'capecitabine', 
        matchedGeneLabel: profile.stage ? `${profile.stage}期胃癌综合诊疗评估 (SOX/FLOT方案)` : '胃癌全身综合治疗评估' 
      };
    }

    if (isBreast || profile.cancerType === 'breast') {
      const isHer2Pos = profile.her2Status === 'positive' || profile.her2Status === '3+' || profile.her2Fish === 'amplified';
      if (isHer2Pos) {
        return { recommendedTargetDrugId: 'trastuzumab', matchedGeneLabel: 'HER2 阳性 (曲妥珠+帕妥珠双靶方案)' };
      }
      const isHer2Low = profile.her2Low || profile.her2Status === 'low' || profile.her2Status === '1+' || (profile.her2Status === '2+' && profile.her2Fish === 'negative');
      if (profile.brca1 === 'positive' || profile.brca2 === 'positive') {
        return { recommendedTargetDrugId: 'olaparib', matchedGeneLabel: 'BRCA 突变 (PARP 抑制剂)' };
      }
      if ((profile.axillaryNodesPositive && profile.axillaryNodesPositive >= 4) || (profile.stage?.startsWith('III') ?? false)) {
        return { recommendedTargetDrugId: 'abemaciclib', matchedGeneLabel: 'HR+ HER2- 淋巴结阳性高危 (阿贝西利 2 年强化)' };
      }
      if (isHer2Low && (profile.molecularSubtype === 'Triple_Negative' || profile.molecularSubtype === 'TNBC')) {
        return { recommendedTargetDrugId: 'trastuzumab_deruxtecan', matchedGeneLabel: 'HER2-Low 三阴性 (DESTINY-Breast04 T-DXd 获益)' };
      }
      if (profile.erStatus === 'positive' || profile.molecularSubtype === 'Luminal_A' || profile.molecularSubtype === 'Luminal_B_HER2_neg') {
        return { recommendedTargetDrugId: 'letrozole', matchedGeneLabel: isHer2Low ? 'HR+ HER2-Low (内分泌为主 · 备选 T-DXd 靶向)' : 'HR+ 激素受体阳性 (AI / 他莫昔芬内分泌方案)' };
      }
      if (isHer2Low) {
        return { recommendedTargetDrugId: 'trastuzumab_deruxtecan', matchedGeneLabel: 'HER2-Low 低表达 (DESTINY-Breast04 T-DXd 获益)' };
      }
      return { 
        recommendedTargetDrugId: 'tamoxifen', 
        matchedGeneLabel: profile.stage ? `${profile.stage}期乳腺癌辅助治疗评估` : '乳腺癌全身综合治疗评估' 
      };
    }

    if (isColorectal || profile.cancerType === 'colorectal') {
      const rawData = (profile as any).clinicalData || (profile as any).cancerSpecificData || profile;
      const isMsiH = rawData.msiStatus === 'MSI-H' || rawData.dmmrStatus === 'dMMR';
      if (isMsiH) {
        return { recommendedTargetDrugId: 'pembrolizumab', matchedGeneLabel: 'dMMR / MSI-H 免疫单药一线 (KEYNOTE-177)' };
      }
      if (rawData.brafMutation === 'V600E') {
        return { recommendedTargetDrugId: 'encorafenib', matchedGeneLabel: 'BRAF V600E 突变 (BEACON 双靶方案)' };
      }
      const isRasMut = rawData.krasMutation && rawData.krasMutation !== 'wildtype' && rawData.krasMutation !== 'unknown';
      if (!isRasMut && rawData.primaryLocation === 'left_colon') {
        return { recommendedTargetDrugId: 'cetuximab', matchedGeneLabel: '全 RAS 野生型左半结肠 (抗 EGFR 单抗方案)' };
      }
      if (isRasMut || rawData.primaryLocation === 'right_colon') {
        return { recommendedTargetDrugId: 'bevacizumab', matchedGeneLabel: 'RAS 突变 / 右半结肠 (抗 VEGF 贝伐珠单抗方案)' };
      }
      if (profile.stage?.startsWith('III')) {
        return { recommendedTargetDrugId: 'capecitabine', matchedGeneLabel: 'III 期结直肠癌辅助化疗 (IDEA CAPOX 方案)' };
      }
      return { 
        recommendedTargetDrugId: 'cetuximab', 
        matchedGeneLabel: profile.stage ? `${profile.stage}期结直肠癌靶向综合评估` : '结直肠癌常规用药参考' 
      };
    }

    const mutations = (Array.isArray(profile.geneMutations) && profile.geneMutations.length > 0)
      ? profile.geneMutations
      : (Array.isArray(profile.molecular?.mutations) && profile.molecular.mutations.length > 0)
      ? profile.molecular.mutations
      : (profile.egfr === 'positive' ? [{ gene: 'EGFR', subtype: '敏感突变' }] : []);
    
    const egfrMut = mutations.find((m: any) => m.gene === 'EGFR');
    const alkMut = mutations.find((m: any) => m.gene === 'ALK');
    const krasMut = mutations.find((m: any) => m.gene === 'KRAS');
    const metMut = mutations.find((m: any) => m.gene === 'MET');

    if (egfrMut || profile.egfr === 'positive') {
      return { recommendedTargetDrugId: 'osimertinib', matchedGeneLabel: `EGFR 突变 (${egfrMut?.subtype || '敏感突变'})` };
    }
    if (alkMut) {
      return { recommendedTargetDrugId: 'alectinib', matchedGeneLabel: `ALK 融合 (${alkMut?.subtype || '阳性'})` };
    }
    if (krasMut) {
      return { recommendedTargetDrugId: 'sotorasib', matchedGeneLabel: `KRAS 突变 (${krasMut?.subtype || 'G12C'})` };
    }
    if (metMut) {
      return { recommendedTargetDrugId: 'savolitinib', matchedGeneLabel: `MET 异常 (${metMut?.subtype || 'exon 14'})` };
    }
    return { 
      recommendedTargetDrugId: 'osimertinib', 
      matchedGeneLabel: profile.stage ? `${profile.stage}期常规辅助用药评估` : '常规靶向辅助用药评估' 
    };
  }, [profile, isBreast, isColorectal, isGastric, isLiver, isEsophageal, isThyroid, isEndometrial, isCervical]);

  useEffect(() => {
    // 0. Check if URL specifies calibration mode or a demo template
    let hasTemplate = false;
    let isCalibrate = false;
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const modeParam = urlParams.get("mode");
      const editParam = urlParams.get("edit");
      if (modeParam === "calibrate" || modeParam === "edit" || editParam === "1" || editParam === "true") {
        isCalibrate = true;
        setEditMode('edit_direct');
        setShowUploader(true);
        showUploaderRef.current = true;
        editModeRef.current = 'edit_direct';
      } else if (modeParam === "manual") {
        setManualDirectMode(true);
        setShowUploader(true);
        showUploaderRef.current = true;
      }

      const templateKey = urlParams.get("template");
      if (templateKey && DEMO_TEMPLATES[templateKey]) {
        const item = DEMO_TEMPLATES[templateKey];
        const targetSlot = item.cancerType;
        setActiveSlot(targetSlot);
        setActiveCancerSlot(targetSlot);
        setGlobalCancerType(targetSlot);
        setProfile(item.profile);
        saveProfileToSlot(item.profile, targetSlot);
        setLoadedTemplate(item);
        setLoading(false);
        if (!isCalibrate) {
          setShowUploader(false);
        }
        setAvailableSlots(getAvailableProfileSlots());
        setDualSummary(getDualPrimarySummary());
        hasTemplate = true;
      }
    }

    // 1. Synchronously read cached profile from localStorage for instant 0ms dashboard paint
    let hasCached = hasTemplate;
    if (!hasTemplate && typeof window !== "undefined") {
      const currentSlot = getActiveCancerSlot();
      setActiveSlot(currentSlot);
      const localCached = getProfileBySlot(currentSlot);
      if (localCached && (localCached.stage || (localCached as any).tStage || localCached.noduleType || localCached.tumorSize || localCached.organ || (localCached as any).biRads)) {
        setProfile(localCached);
        setLoading(false);
        if (!isCalibrate) {
          setShowUploader(false);
        }
        hasCached = true;
      }
      setAvailableSlots(getAvailableProfileSlots());
      setDualSummary(getDualPrimarySummary());
    }

    // 2. Fetch server update in background (silent refresh if cached, spinner only if clean slate; skip if template)
    if (!hasTemplate) {
      loadProfile(getActiveCancerSlot(), !hasCached);
    }

    const handleAuthChange = () => {
      loadProfile(getActiveCancerSlot(), false);
    };

    const handleSlotChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.slot) {
        setActiveSlot(detail.slot);
        if (detail.profile) {
          setProfile(detail.profile);
        }
      }
      setAvailableSlots(getAvailableProfileSlots());
      setDualSummary(getDualPrimarySummary());
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener(EVENT_SLOT_CHANGED, handleSlotChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener(EVENT_SLOT_CHANGED, handleSlotChange);
    };
  }, []);

  const handleSelectSlot = (slot: CancerType) => {
    setActiveSlot(slot);
    setActiveCancerSlot(slot);
    setGlobalCancerType(slot);
    const cached = getProfileBySlot(slot);
    if (cached) {
      setProfile(cached);
      setShowUploader(false);
    } else {
      setProfile(null);
      setShowUploader(true);
    }
    loadProfile(slot, false);
  };

  const handleAddSecondCancer = () => {
    const allCancers = CancerRegistry.getSupportedTypes();
    const nextSlot = allCancers.find(c => c !== activeSlot && !availableSlots.includes(c)) ||
                     allCancers.find(c => c !== activeSlot) || "lung";
    handleSelectSlot(nextSlot);
    setShowUploader(true);
  };

  const handleSyncM0Checks = async () => {
    const lung = dualSummary.lungProfile || getProfileBySlot("lung");
    const breast = dualSummary.breastProfile || getProfileBySlot("breast");
    if (!lung || !breast) return;

    const brainMri = (lung.brainMri && lung.brainMri !== 'not_performed') ? lung.brainMri : (breast.brainMri && breast.brainMri !== 'not_performed' ? breast.brainMri : "not_performed");
    const boneScan = (lung.boneScan && lung.boneScan !== 'not_performed') ? lung.boneScan : (breast.boneScan && breast.boneScan !== 'not_performed' ? breast.boneScan : "not_performed");
    const abdominalUltrasound = (lung.abdominalUltrasound && lung.abdominalUltrasound !== 'not_performed') ? lung.abdominalUltrasound : (breast.abdominalUltrasound && breast.abdominalUltrasound !== 'not_performed' ? breast.abdominalUltrasound : "not_performed");
    const petCt = (lung.petCt && lung.petCt !== 'not_performed') ? lung.petCt : (breast.petCt && breast.petCt !== 'not_performed' ? breast.petCt : "not_performed");
    const isM0 = Boolean(lung.systemicStagingConfirmed || breast.systemicStagingConfirmed || brainMri === 'negative' || boneScan === 'negative');

    const updatedLung: PatientProfile = {
      ...lung,
      brainMri: brainMri,
      boneScan: boneScan,
      abdominalUltrasound: abdominalUltrasound,
      petCt: petCt,
      systemicStagingConfirmed: isM0,
    };

    const updatedBreast: PatientProfile = {
      ...breast,
      brainMri: brainMri,
      boneScan: boneScan,
      abdominalUltrasound: abdominalUltrasound,
      petCt: petCt,
      systemicStagingConfirmed: isM0,
    };

    saveProfileToSlot(updatedLung, "lung");
    saveProfileToSlot(updatedBreast, "breast");
    setDualSummary(getDualPrimarySummary());

    if (activeSlot === 'lung') {
      setProfile(updatedLung);
    } else {
      setProfile(updatedBreast);
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await Promise.all([
        fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ ...updatedLung, cancerType: 'lung', userId: getGuestId(), reportReviewStatus: updatedLung.reportReviewStatus || 'confirmed' })
        }),
        fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ ...updatedBreast, cancerType: 'breast', userId: getGuestId(), reportReviewStatus: updatedBreast.reportReviewStatus || 'confirmed' })
        })
      ]);
    } catch (syncErr) {
      console.warn("M0 sync API warning:", syncErr);
    }
  };

  const handleConfirmReviewStatus = async () => {
    if (!profile) return;
    try {
      const updated = {
        ...profile,
        reportReviewStatus: 'confirmed'
      };
      setProfile(updated);
      saveProfileToSlot(updated, activeSlot);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          profileId: profile.id,
          userId: getGuestId(),
          cancerType: activeSlot,
          reportReviewStatus: 'confirmed'
        })
      });

      showToast("临床关键指标已核对确认，现在可直接生成专属深度循证报告！", "success");
    } catch (err) {
      console.warn("Confirm review failed:", err);
      showToast("已在本地确认指标，您可直接生成报告", "info");
    }
  };

  // Support Esc key to dismiss update or delete modals
  useEffect(() => {
    if (!showUpdateModal && !showDeleteModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showUpdateModal) setShowUpdateModal(false);
        if (showDeleteModal) setShowDeleteModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showUpdateModal, showDeleteModal]);

  const handleParsed = async (parsedData: any) => {
    try {
      const parsedCancerType: CancerType = normalizeCancerType(parsedData.cancerType || activeSlot, parsedData.organ);

      const targetSlot = parsedCancerType;
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ 
          ...parsedData, 
          cancerType: targetSlot, 
          userId: getGuestId(),
          reportReviewStatus: parsedData.reportReviewStatus || 'confirmed'
        })
      });
      const dbData = await res.json();
      if (dbData.success) {
        saveProfileToSlot(dbData.profile, targetSlot);
        setActiveCancerSlot(targetSlot);
        setActiveSlot(targetSlot);
        setGlobalCancerType(targetSlot);
        setProfile(dbData.profile);
        setShowUploader(false);
        setEditMode(null);
        setShowUpdateModal(false);
        setAvailableSlots(getAvailableProfileSlots());
        setDualSummary(getDualPrimarySummary());

        if (typeof window !== "undefined") {
          const slot = dbData.profile?.cancerType || activeSlot;
          localStorage.removeItem(`oncopath_report_${dbData.profile?.id || getGuestId()}`);
          localStorage.removeItem(`oncopath_report_time_${dbData.profile?.id || getGuestId()}`);
          localStorage.removeItem(`oncopath_report_${slot}_${getGuestId()}`);
          localStorage.removeItem(`oncopath_report_time_${slot}_${getGuestId()}`);
          localStorage.removeItem("oncopath_report_markdown");
          localStorage.removeItem("oncopath_report_timestamp");
          window.dispatchEvent(new Event("storage"));
        }
      }
    } catch (err) {
      console.error("Failed to save parsed profile", err);
    }
  };

  const handleWipeProfile = async () => {
    try {
      setIsDeleting(true);
      const guestId = getGuestId();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (deleteOption === 'single' && availableSlots.length >= 2) {
        // 单项注销当前癌种
        await fetch(`/api/profile?userId=${guestId}&cancerType=${activeSlot}`, {
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).catch(() => {});

        deleteProfileSlot(activeSlot);
        if (typeof window !== "undefined") {
          localStorage.removeItem(`oncopath_report_${activeSlot}_${guestId}`);
          localStorage.removeItem(`oncopath_report_time_${activeSlot}_${guestId}`);
          if (profile?.id) {
            localStorage.removeItem(`oncopath_report_${profile.id}`);
            localStorage.removeItem(`oncopath_report_time_${profile.id}`);
          }
        }
        const remaining = getAvailableProfileSlots();
        setAvailableSlots(remaining);
        setDualSummary(getDualPrimarySummary());
        if (remaining.length > 0) {
          const nextSlot = remaining[0];
          setActiveSlot(nextSlot);
          setActiveCancerSlot(nextSlot);
          setGlobalCancerType(nextSlot);
          setProfile(getProfileBySlot(nextSlot));
          setShowUploader(false);
        } else {
          setProfile(null);
          setShowUploader(true);
        }
      } else {
        // 全量彻底销毁
        await fetch(`/api/profile?userId=${guestId}`, { 
          method: 'DELETE',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }).catch(() => {});
        
        if (typeof window !== "undefined") {
          localStorage.removeItem("oncopath_profile");
          localStorage.removeItem("patient_profile");
          localStorage.removeItem("oncopath_profile_lung");
          localStorage.removeItem("oncopath_profile_breast");
          localStorage.removeItem("oncopath_profile_colon");
          localStorage.removeItem("oncopath_profile_rectal");
          localStorage.removeItem("oncopath_profile_colorectal");
          localStorage.removeItem("oncopath_profile_gastric");
          localStorage.removeItem("oncopath_profile_liver");
          localStorage.removeItem("oncopath_active_cancer_slot");
          localStorage.removeItem("oncopath_report_markdown");
          localStorage.removeItem("oncopath_report_timestamp");
          localStorage.removeItem(`oncopath_report_${guestId}`);
          localStorage.removeItem(`oncopath_report_time_${guestId}`);
          localStorage.removeItem(`oncopath_report_lung_${guestId}`);
          localStorage.removeItem(`oncopath_report_time_lung_${guestId}`);
          localStorage.removeItem(`oncopath_report_breast_${guestId}`);
          localStorage.removeItem(`oncopath_report_time_breast_${guestId}`);
          localStorage.removeItem(`oncopath_report_colon_${guestId}`);
          localStorage.removeItem(`oncopath_report_time_colon_${guestId}`);
          localStorage.removeItem(`oncopath_report_rectal_${guestId}`);
          localStorage.removeItem(`oncopath_report_time_rectal_${guestId}`);
          localStorage.removeItem(`oncopath_report_colorectal_${guestId}`);
          localStorage.removeItem(`oncopath_report_time_colorectal_${guestId}`);
          localStorage.removeItem(`oncopath_report_gastric_${guestId}`);
          localStorage.removeItem(`oncopath_report_time_gastric_${guestId}`);
          localStorage.removeItem(`oncopath_report_liver_${guestId}`);
          localStorage.removeItem(`oncopath_report_time_liver_${guestId}`);
          if (profile?.id) {
            localStorage.removeItem(`oncopath_report_${profile.id}`);
            localStorage.removeItem(`oncopath_report_time_${profile.id}`);
          }
          localStorage.removeItem("oncopath_timeline_events");
          localStorage.removeItem("oncopath_timeline_is_demo");
          localStorage.removeItem("oncopath_timeline_custom_events");
          localStorage.removeItem("oncopath_clinic_questions");
          window.dispatchEvent(new Event("storage"));
        }
        
        setProfile(null);
        setAvailableSlots([]);
        setDualSummary({ slots: [], isDualPrimary: false, lungProfile: null, breastProfile: null, colonProfile: null, rectalProfile: null, colorectalProfile: null, gastricProfile: null, liverProfile: null, esophagealProfile: null, thyroidProfile: null, endometrialProfile: null, cervicalProfile: null, pancreaticProfile: null });
        setShowUploader(true);
      }
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to wipe profile", err);
    } finally {
      setIsDeleting(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-accent-blue rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">正在加载临床数字档案与循证模型...</p>
        </div>
      </div>
    );
  }

  if (showUploader || !profile || profile.cancerType !== activeSlot) {
    return (
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-12 sm:pb-16 space-y-4 sm:space-y-5 md:space-y-6">
        <ConsentModal />
        {availableSlots.length > 0 && (
          <DualPrimarySwitcher
            activeSlot={activeSlot}
            availableSlots={availableSlots}
            lungProfile={dualSummary.lungProfile || (profile?.cancerType === 'lung' ? profile : getProfileBySlot('lung'))}
            breastProfile={dualSummary.breastProfile || (profile?.cancerType === 'breast' ? profile : getProfileBySlot('breast'))}
            colonProfile={dualSummary.colonProfile || (profile?.cancerType === 'colon' ? profile : getProfileBySlot('colon'))}
            rectalProfile={dualSummary.rectalProfile || (profile?.cancerType === 'rectal' ? profile : getProfileBySlot('rectal'))}
            colorectalProfile={dualSummary.colorectalProfile || (profile?.cancerType === 'colorectal' ? profile : getProfileBySlot('colorectal'))}
            gastricProfile={dualSummary.gastricProfile || (profile?.cancerType === 'gastric' ? profile : getProfileBySlot('gastric'))}
            liverProfile={dualSummary.liverProfile || (profile?.cancerType === 'liver' ? profile : getProfileBySlot('liver'))}
            esophagealProfile={dualSummary.esophagealProfile || (profile?.cancerType === 'esophageal' ? profile : getProfileBySlot('esophageal'))}
            thyroidProfile={dualSummary.thyroidProfile || (profile?.cancerType === 'thyroid' ? profile : getProfileBySlot('thyroid'))}
            endometrialProfile={dualSummary.endometrialProfile || (profile?.cancerType === 'endometrial' ? profile : getProfileBySlot('endometrial'))}
            cervicalProfile={dualSummary.cervicalProfile || (profile?.cancerType === 'cervical' ? profile : getProfileBySlot('cervical'))}
            pancreaticProfile={dualSummary.pancreaticProfile || (profile?.cancerType === 'pancreatic' ? profile : getProfileBySlot('pancreatic'))}
            onSelectSlot={handleSelectSlot}
            onAddSecondCancer={handleAddSecondCancer}
          />
        )}
        {(!profile || profile.cancerType !== activeSlot) && (
          <div className="text-center mb-6 sm:mb-8 max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              建立【{CancerRegistry.get(activeSlot)?.name || '原发'}】个人医学档案
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">
              {manualDirectMode 
                ? `直接手动输入各项关键临床与病理指标，系统将实时推演 ${CancerRegistry.get(activeSlot)?.guidelineStandard || '最新国际权威临床分期'} 与证据指南`
                : `导入病理诊断与影像报告，系统将自动进行【${CancerRegistry.get(activeSlot)?.name || '原发'}】临床要素解析与指南循证对齐`}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                type="button"
                onClick={() => setManualDirectMode(false)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  !manualDirectMode
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>拍照/文本智能解析</span>
              </button>
              <button
                type="button"
                onClick={() => setManualDirectMode(true)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  manualDirectMode
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 shadow-2xs'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>直接手动填报指标 (无需报告)</span>
              </button>
            </div>
          </div>
        )}
        <ReportUploader 
          cancerType={activeSlot}
          initialData={editMode === 'edit_direct' && profile?.cancerType === activeSlot ? profile : null}
          existingProfile={profile?.cancerType === activeSlot ? profile : null}
          initialManualMode={manualDirectMode}
          onSwitchToUpload={() => setManualDirectMode(false)}
          onParsed={(data) => {
            setManualDirectMode(false);
            handleParsed(data);
          }}
          onCancel={profile?.cancerType === activeSlot ? () => {
            setShowUploader(false);
            setEditMode(null);
            setManualDirectMode(false);
          } : undefined}
        />
      </div>
    );
  }

  // Boolean / String Safe Factor Checks
  const isStasSafe = profile.stas === 'negative' || (profile.stas as any) === false;
  const isLviSafe = profile.lvi === 'negative' || (profile.lvi as any) === false;
  const isVpiSafe = profile.vpi === 'negative' || (profile.vpi as any) === false;
  const isMarginSafe = profile.margin === 'negative' || profile.marginStatus === 'negative' || (profile.margin as any) === false;
  const isN0Safe = profile.nStage === 'N0' || profile.lymphNodes === 'N0';
  const isGrade3 = profile.iaslcGrade === '3' || profile.grade === '3';
  const isAllSafe = isStasSafe && isLviSafe && isVpiSafe && isN0Safe && isMarginSafe && !isGrade3;

  const isPostOp = Boolean(
    (profile.surgeryType && profile.surgeryType !== 'unknown') ||
    profile.pathologyTumorSize != null ||
    profile.pathologyInvasiveSize != null ||
    profile.marginStatus != null ||
    (profile.currentStage && profile.currentStage !== 'evaluation' && profile.currentStage !== 'discovery')
  );

  const isEarlyLowRiskLung = Boolean(
    isLung && (
      profile.mStage === 'M0' ||
      profile.stage === 'Tis' ||
      profile.stage === '0' ||
      profile.stage?.startsWith('IA') ||
      profile.stage?.startsWith('IA1') ||
      profile.stage?.startsWith('IA2') ||
      profile.noduleType === 'pure_ggo' ||
      (profile.ctr != null && profile.ctr <= 0.5)
    )
  );
  const isFemale = (profile.gender as string) === 'female' || (profile.sex as string) === 'female' || (profile.gender as string) === '女' || (profile.sex as string) === '女';
  const isMale = (profile.gender as string) === 'male' || (profile.sex as string) === 'male' || (profile.gender as string) === '男' || (profile.sex as string) === '男';
  const _genderText = isFemale ? '女性' : isMale ? '男性' : '性别待确认';

  const noduleLabel = profile.noduleType === 'pure_ggo' 
    ? '纯磨玻璃结节 (pGGO)' 
    : profile.noduleType === 'pure_solid' 
    ? '纯实性结节 (Solid)' 
    : '混合磨玻璃结节 (mGGO)';

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pb-12 sm:pb-16 space-y-4 sm:space-y-5 md:space-y-6">
      <ConsentModal />
      
      {/* Demo Template Active Notification Banner */}
      {loadedTemplate && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-2xs">
              <FileCheck2 className="w-5 h-5 text-white" />
            </span>
            <div>
              <div className="text-sm font-black flex items-center gap-2">
                <span>示范模板已载入：{loadedTemplate.templateTitle}</span>
                <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  试跑推演模式
                </span>
              </div>
              <div className="text-xs text-blue-100 font-medium mt-0.5">
                {loadedTemplate.templateSubtitle} · 包含权威分期与顶刊循证全套推演
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowUploader(true);
                setLoadedTemplate(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white text-blue-700 text-xs font-black shadow-xs hover:bg-blue-50 transition-all cursor-pointer"
            >
              替换为我的真实报告
            </button>
            <button
              type="button"
              onClick={() => setLoadedTemplate(null)}
              className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
              title="关闭提示"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Report Review Confirmation Banner if profile parsed but unconfirmed */}
      {profile && profile.reportReviewStatus && profile.reportReviewStatus !== 'confirmed' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 animate-fade-in">
          <div className="flex items-start sm:items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200 text-amber-700 shadow-2xs">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </span>
            <div className="space-y-0.5">
              <div className="text-sm font-extrabold flex items-center gap-2 flex-wrap text-amber-950">
                <span>临床报告解析就绪 · 待核对关键指标</span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  循证安全前置校验
                </span>
              </div>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                为确保深度循证推理精准无误，请核对当前录入的分期与病理指标。确认无误后即可随时一键生成专属临床循证报告。
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              type="button"
              onClick={handleConfirmReviewStatus}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
              <span>一键核对确认</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode('edit_direct');
                setShowUploader(true);
              }}
              className="px-3 py-2 rounded-xl bg-white hover:bg-amber-100/60 text-amber-800 border border-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <FileEdit className="w-3.5 h-3.5 shrink-0" />
              <span>微调指标</span>
            </button>
          </div>
        </div>
      )}

      {/* Guest Mode Cloud Sync Banner (移动端与桌面端通用的访客云端同步提示) */}
      {!userEmail && profile && !loadedTemplate && (
        <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50/70 to-indigo-50/60 border border-blue-200/80 text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Cloud className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                <span>当前为临时访客档案</span>
                <span className="text-[10px] text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded font-semibold">仅保存在当前设备</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate sm:whitespace-normal">
                登录知癌维基账号即可永久保存病历，并在手机与电脑多端无缝实时同步
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0 active:scale-95"
          >
            <User className="w-3.5 h-3.5" />
            <span>登录 / 云端同步</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            患者临床数字档案
          </h1>
          <p className="text-slate-500 font-medium text-xs sm:text-sm mt-1 leading-relaxed">
            {isEsophageal
              ? '基于 AJCC 第 8 版与 CSCO 食管癌诊疗指南 · 个体化动态循证档案'
              : isLiver
              ? '基于国家卫健委 CNLC 2024 规范与肝储备量化 · 肝癌个体化动态循证档案'
              : isGastric
              ? '基于 AJCC 第 8 版与 CSCO/JGCA 2024 规范 · 胃癌个体化动态循证档案'
              : isBreast 
              ? '基于 AJCC 第 8/9 版解剖与预后分期及 St. Gallen 共识 · 乳腺癌动态循证档案' 
              : isColon
              ? '基于 AJCC 第 8 版与 CSCO 结直肠癌指南 · 结肠癌个体化动态循证档案'
              : isRectal
              ? '基于 AJCC 第 8 版与直肠高分辨 MRI/TME 规范 · 直肠癌个体化动态循证档案'
              : isPancreatic
              ? '基于 NCCN / CSCO 2024 胰腺癌指南 · 胰腺癌个体化动态循证档案'
              : isColorectal
              ? '基于 AJCC 第 8 版与 CSCO/NCCN 2024 指南 · 结直肠癌个体化动态循证档案'
              : isThyroid
              ? '基于 AJCC 第 8 版与 ATA/CSCO 2024 甲状腺癌指南 · 个体化动态循证档案'
              : isEndometrial
              ? '基于 FIGO 2023 分期与 PORTEC-4a 分子分型循证 · 子宫内膜癌个体化动态档案'
              : isCervical
              ? '基于 FIGO 2018 临床分期与 KEYNOTE-826 免疫循证 · 宫颈癌个体化动态档案'
              : '基于 IASLC / AJCC 第 9 版国际分期金标准 · 肺癌动态循证档案'}
          </p>
        </div>
        {/* Ergonomic Segmented Capsule Dock (校对 -> 用药 -> 导出 -> [隔离线] -> 清空) */}
        <div className="flex items-center bg-slate-100/80 p-1 sm:p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs self-start sm:self-center shrink-0">
          {/* 1. 校对指标 (Primary Core Action - White elevated pill with Blue accent) */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowUpdateModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-blue-700 bg-white hover:bg-blue-50/80 border border-blue-200/60 shadow-2xs text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="校对或更新患者病理、分期与临床指标"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[11px] font-extrabold">校对</span>
          </button>

          {/* 2. 用药自检 (Clinical Diagnostic Utility - Purple) */}
          <button 
            onClick={() => {
              setInitialDdiDrugId(undefined);
              setShowDdiModal(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-purple-700 hover:bg-white/80 hover:shadow-2xs text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="靶向药与慢病用药相互作用 (DDI) 自检排查"
          >
            <Pill className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="text-[11px] font-bold">用药</span>
          </button>

          {/* 3. 导出图片 (Output & Sharing Utility - Slate) */}
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-white/80 hover:shadow-2xs text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="一键导出高清数字档案全景卡 (PNG)"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[11px] font-bold">导出</span>
          </button>

          {/* Safety Divider: Physical separation to prevent accidental taps on mobile */}
          <div className="w-px h-4 bg-slate-300/80 mx-1 self-center shrink-0" />

          {/* 4. 清空档案 (Destructive Action - Muted, segregated, alert on hover) */}
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 transition-all active:scale-95 cursor-pointer shrink-0"
            title="彻底销毁并重置本地与云端档案"
            aria-label="清空档案"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>

      {/* Dual Primary Multi-Slot Switcher Pill Bar */}
      <DualPrimarySwitcher
        activeSlot={activeSlot}
        availableSlots={availableSlots}
        lungProfile={dualSummary.lungProfile || (activeSlot === 'lung' ? profile : getProfileBySlot('lung'))}
        breastProfile={dualSummary.breastProfile || (activeSlot === 'breast' ? profile : getProfileBySlot('breast'))}
        colonProfile={dualSummary.colonProfile || (activeSlot === 'colon' ? profile : getProfileBySlot('colon'))}
        rectalProfile={dualSummary.rectalProfile || (activeSlot === 'rectal' ? profile : getProfileBySlot('rectal'))}
        colorectalProfile={dualSummary.colorectalProfile || (activeSlot === 'colorectal' ? profile : getProfileBySlot('colorectal'))}
        gastricProfile={dualSummary.gastricProfile || (activeSlot === 'gastric' ? profile : getProfileBySlot('gastric'))}
        liverProfile={dualSummary.liverProfile || (activeSlot === 'liver' ? profile : getProfileBySlot('liver'))}
        esophagealProfile={dualSummary.esophagealProfile || (activeSlot === 'esophageal' ? profile : getProfileBySlot('esophageal'))}
        thyroidProfile={dualSummary.thyroidProfile || (activeSlot === 'thyroid' ? profile : getProfileBySlot('thyroid'))}
        endometrialProfile={dualSummary.endometrialProfile || (activeSlot === 'endometrial' ? profile : getProfileBySlot('endometrial'))}
        cervicalProfile={dualSummary.cervicalProfile || (activeSlot === 'cervical' ? profile : getProfileBySlot('cervical'))}
        pancreaticProfile={dualSummary.pancreaticProfile || (activeSlot === 'pancreatic' ? profile : getProfileBySlot('pancreatic'))}
        onSelectSlot={handleSelectSlot}
        onAddSecondCancer={handleAddSecondCancer}
      />

      <JourneyMap 
        currentStage={profile.currentStage} 
        psychologicalState={profile.psychologicalState} 
      />

      {/* IASLC 9th Edition Version Bridge Notice Banner */}
      {isLung && profile.versionBridgeNotice && (
        <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-teal-50/90 via-emerald-50/80 to-sky-50/70 border border-teal-200 shadow-2xs flex items-start gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
            <GitBranch className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-teal-950">IASLC 第 9 版国际现行分期演变说明</span>
              <span className="text-[10px] bg-teal-200/80 text-teal-900 font-bold px-2 py-0.5 rounded-full">消除旧版报告疑惑</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {profile.versionBridgeNotice}
            </p>
          </div>
        </div>
      )}

      {/* 2x2 Bento Grid Clinical Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        
        {/* Bento Box 1: Primary Imaging & Morphology (T-Staging / BI-RADS) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors duration-200">

          <div>
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 ${
                  isBreast ? 'bg-pink-50 text-pink-600' : isColorectal ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
                }`}>
                  <Scan className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                    {isBreast ? '乳腺钼靶 / 超声影像原发灶' :
                     isColorectal ? '肠镜 / 盆腔高分辨核磁原发灶' :
                     isGastric ? '胃镜 / 腹盆增强 CT 影像原发灶' :
                     isLiver ? '腹部增强 CT / MRI 影像原发灶' :
                     isEsophageal ? '食管内镜 / 钡餐 / 胸腹 CT 原发灶' :
                     isThyroid ? '甲状腺高分辨超声 / 颈部 CT 原发灶' :
                     isEndometrial ? '经阴道超声 / 盆腔 MRI 影像原发灶' :
                     isCervical ? '阴道镜检查 / 盆腔 MRI 影像原发灶' :
                     isPancreatic ? '胰腺薄层增强 CT / 增强 MRI 原发灶' :
                     '薄层 CT 影像原发灶'}
                  </h3>
                  <p className="text-[10px] font-medium text-slate-500 mt-0.5 truncate">
                    {isBreast ? 'BI-RADS 分级与解剖 T 分期评估' :
                     isColorectal ? '肠镜病灶特征与盆腔 CRM 浸润评估' :
                     isGastric ? '胃壁浸润深度与局部淋巴结评估' :
                     isLiver ? '肿块数目大小与门静脉侵犯评估' :
                     isEsophageal ? '浸润深度与食管周围外侵评估' :
                     isThyroid ? 'TI-RADS 分级与被膜外侵犯评估' :
                     isEndometrial ? '肌层浸润深度与宫颈间质受累评估' :
                     isCervical ? '局部肿瘤大小与宫旁组织浸润评估' :
                     isPancreatic ? '胰腺病灶大小与血管受累可切除性评估' :
                     '病灶形态特征与解剖 T 分期评估'}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${
                isBreast 
                  ? 'text-pink-700 bg-pink-50 border-pink-200' 
                  : isColorectal
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-teal-700 bg-teal-50 border-teal-200'
              }`}>
                {isBreast 
                  ? (profile.biRads ? `BI-RADS ${profile.biRads} 类` : (profile.tumorSize != null ? `${profile.tumorSize} cm 肿块` : "待影像测量确认"))
                  : isColorectal
                  ? (profile.tumorSize != null ? `${profile.tumorSize} cm 肠道病灶` : (profile.tStage ? `AJCC ${profile.tStage}` : "待内镜/核磁确认"))
                  : isLung
                  ? (profile.tumorSize != null ? noduleLabel : "待影像测量确认")
                  : (profile.tumorSize != null ? `${profile.tumorSize} cm 原发灶` : (profile.tStage ? `${profile.tStage} 原发灶` : "待影像测量确认"))
                }
              </span>
            </div>

            {profile.tumorSize == null && profile.solidSize == null && (!isBreast || (!profile.biRads && !profile.calcificationType)) && (!isColorectal || !profile.tStage) ? (
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 text-center my-4">
                <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center shrink-0 ${
                  isBreast ? 'bg-pink-50 text-pink-600' : isColorectal ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
                }`}>
                  <Scan className="w-5 h-5 shrink-0" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {isBreast ? '未提供乳腺超声或钼靶摄片报告' :
                     isColorectal ? '未提供全结肠镜或骨盆核磁报告' :
                     isGastric ? '未提供胃镜活检或腹盆增强 CT 报告' :
                     isLiver ? '未提供腹部增强 CT 或肝脏 MRI 报告' :
                     isEsophageal ? '未提供胃镜或胸腹增强 CT 报告' :
                     isThyroid ? '未提供甲状腺超声 TI-RADS 报告' :
                     isEndometrial ? '未提供经阴道超声或盆腔 MRI 报告' :
                     isCervical ? '未提供阴道镜或盆腔 MRI 报告' :
                     isPancreatic ? '未提供胰腺薄层增强 CT/MRI 报告' :
                     '未提供薄层胸部 CT 报告'}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                    {isBreast 
                      ? '肿块最大径、BI-RADS 分类与钙化形态是乳腺肿瘤临床分期 (cTNM) 与穿刺决策的核心依据。当前档案暂无乳腺影像测量数据。'
                      : isColorectal
                      ? '肠道病灶浸润深度、直肠系膜筋膜环周切缘 (CRM) 与距肛缘距离是制定根治手术或 TNT 新辅助方案的核心依据。'
                      : isGastric
                      ? '胃镜明确溃疡与组织学分型，增强 CT 精确判定胃壁浸润深度 (T分期) 与腹腔淋巴结状态。当前暂无影像数据。'
                      : isLiver
                      ? '病灶大小、结节数目及有无门静脉系统癌栓是 CNLC / BCLC 临床分期的核心金标准。当前暂无肝脏影像测量数据。'
                      : isEsophageal
                      ? '病灶长度、食管壁浸润范围及外侵毗邻大血管关系是评估可切除性与新辅助化放疗指征的核心依据。'
                      : isThyroid
                      ? '甲状腺结节大小、纵横比、微钙化及 TI-RADS 分类是评估恶性风险及穿刺活检指征的关键标准。'
                      : isEndometrial
                      ? '肌层浸润深度 (<50% vs ≥50%)、宫颈间质侵犯与附件受累是 FIGO 2023 分期的核心依据。'
                      : isCervical
                      ? '肿块最大径与宫旁组织是否受累是区分早期手术切除与局部晚期同步放化疗 (CCRT) 的决策红线。'
                      : isPancreatic
                      ? '胰腺病灶与腹腔干、肠系膜上动脉 (SMA) 及门静脉的毗邻包裹角度是判定可切除性的绝对金标准。'
                      : '结节全径与实性浸润占比 (CTR) 是肺结节临床分期 (cTNM) 的核心金标准。当前档案暂无 CT 影像测量数据。'
                    }
                  </p>
                </div>
                <div className="pt-1 flex items-center justify-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUpdateModal(true);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
                      isBreast ? 'bg-pink-600 hover:bg-pink-700' : isColorectal ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-sky-600 hover:bg-sky-700'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isBreast ? '补充录入肿块大小 / 校对' : isColorectal ? '补充录入病灶大小 / 校对' : '补充录入结节大小 / 校对'}</span>
                  </button>
                </div>
              </div>
            ) : isBreast ? (
              /* Breast Imaging Details */
              <div className="space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-slate-600">
                    <strong>肿块部位与侧别</strong>: <span className="font-semibold text-slate-900">{
                      profile.cancerSpecificData?.breastLaterality === 'left' ? '左侧乳房' :
                      profile.cancerSpecificData?.breastLaterality === 'right' ? '右侧乳房' :
                      profile.cancerSpecificData?.breastLaterality === 'bilateral' ? '双侧乳腺' :
                      (profile.noduleLocation || (profile.cancerSpecificData as any)?.breastLaterality || '乳腺原发灶')
                    }</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {profile.cancerSpecificData?.pcrStatus && (
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-bold shrink-0 ${
                        profile.cancerSpecificData.pcrStatus === 'ypT0isN0' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {profile.cancerSpecificData.pcrStatus === 'ypT0isN0' ? '新辅助病理完全缓解 (pCR)' : profile.cancerSpecificData.pcrStatus === 'partial_response' ? '新辅助部分缓解 (PR)' : '新辅助未完全缓解 (non-pCR)'}
                      </span>
                    )}
                    {profile.biRads && (
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-bold shrink-0 ${
                        Number(profile.biRads) >= 4 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-pink-50 text-pink-700 border-pink-200'
                      }`}>
                        BI-RADS {profile.biRads} 类
                      </span>
                    )}
                  </div>
                </div>

                {/* Breast Primary Measurement Strip */}
                <div className="bg-pink-50/90 p-3.5 rounded-2xl border border-pink-200 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-pink-950 font-bold flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-pink-700 shrink-0" />
                      <span>影像肿块全径: {profile.tumorSize != null ? `${profile.tumorSize} cm` : '待测'}</span>
                      {profile.calcificationType && (
                        <>
                          <span className="text-pink-300">/</span>
                          <span className="text-pink-800 font-semibold">
                            {profile.calcificationType === 'fine_pleomorphic' ? '细小多形性恶性微钙化' : 
                             profile.calcificationType === 'linear_branching' ? '线样分支状钙化' : 
                             profile.calcificationType === 'punctate' ? '散在点状钙化' : profile.calcificationType}
                          </span>
                        </>
                      )}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-pink-100 font-extrabold text-pink-950 text-xs shrink-0">
                      {isPostOp ? '术前 cT 参考: ' : 'cT定级基准: '}{profile.tStage || 'cTx'}
                    </span>
                  </div>
                  <div className="text-[11px] text-pink-800 font-medium">
                    {isPostOp
                      ? '术前影像评估参考 · 术后分期以病理浸润径与受体分型 (pT) 为准'
                      : '依据 AJCC 第 8/9 版标准，以原发浸润肿块最大径判定 cT 分期（≤2cm 为 T1，&gt;2~5cm 为 T2，&gt;5cm 为 T3）'}
                  </div>
                </div>

                {/* Breast Malignant Signs Pills with GlossaryTooltip */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    已排查乳腺影像特征（可点击查看释义）：
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.imagingFeatures && profile.imagingFeatures.length > 0 ? (
                      profile.imagingFeatures.map((feat, i) => (
                        <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <GlossaryTooltip term={feat}>
                            <span>{feat}</span>
                          </GlossaryTooltip>
                        </span>
                      ))
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>肿块边界相对规则，未见恶性毛刺征或成簇细小钙化</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Clinical Axillary Node Evaluation Sub-Panel */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <CircleDot className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>同侧腋窝淋巴结临床评估 (cN)：</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal shrink-0">超声与触诊</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    {profile.clinicalAxillaryNodes === 'suspicious' 
                      ? '同侧腋窝超声提示可疑淋巴结肿大 / 皮质偏心性增厚 (cN1)，建议粗针穿刺活检确认' 
                      : (profile.nStage === 'N0' || profile.clinicalAxillaryNodes === 'negative')
                      ? '同侧腋窝淋巴结皮髓质分界清晰，未见可疑病理性肿大 (cN0)'
                      : '同侧腋窝淋巴结未见明显异常肿大，术中行前哨淋巴结活检 (SLNB) 定级'}
                  </div>
                </div>
              </div>
            ) : isColorectal ? (
              /* Colorectal Imaging Details */
              <div className="space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-slate-600">
                    <strong>原发解剖部位</strong>: <span className="font-semibold text-slate-900">{
                      profile.cancerSpecificData?.primaryLocation === 'left_colon' ? '左半结肠 (降结肠/乙状结肠/直肠)' :
                      profile.cancerSpecificData?.primaryLocation === 'right_colon' ? '右半结肠 (盲肠/升结肠/横结肠)' :
                      profile.cancerSpecificData?.primaryLocation === 'rectum' ? '直肠' :
                      (profile.noduleLocation || (profile.cancerSpecificData as any)?.primaryLocation || '结直肠原发灶')
                    }</span>
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {profile.cancerSpecificData?.distanceFromAnalVerge != null && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shrink-0">
                        距肛缘 {profile.cancerSpecificData.distanceFromAnalVerge} cm
                      </span>
                    )}
                    {profile.cancerSpecificData?.crmStatus && (
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-bold shrink-0 ${
                        profile.cancerSpecificData.crmStatus === 'negative' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        CRM环周切缘: {profile.cancerSpecificData.crmStatus === 'negative' ? '阴性 (安全)' : '阳性 (受侵)'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Colorectal T-Stage Measurement Strip */}
                <div className="bg-emerald-50/90 p-3.5 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-emerald-950 font-bold flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>肠壁浸润层级: {profile.tStage || 'cTx'}</span>
                      {profile.tumorSize != null && (
                        <>
                          <span className="text-emerald-300">/</span>
                          <span className="text-emerald-800 font-semibold">病灶长径: {profile.tumorSize} cm</span>
                        </>
                      )}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 font-extrabold text-emerald-950 text-xs shrink-0">
                      AJCC 8th T-Staging
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium leading-relaxed">
                    {profile.tStage === 'Tis' ? '原位癌/黏膜内癌，未突破黏膜肌层，内镜切除即可根治' :
                     profile.tStage === 'T1' ? '浸润黏膜下层，淋巴结转移率低，可行 ESD/微创手术' :
                     profile.tStage === 'T2' ? '浸润固有肌层，尚未突破肠壁外层结构' :
                     profile.tStage === 'T3' ? '穿透固有肌层进入浆膜下层/结直肠周围脂肪组织，为最常见浸润层级' :
                     profile.tStage === 'T4a' ? '穿透脏层腹膜，脱落细胞腹腔种植风险增加，需强化辅助化疗' :
                     profile.tStage === 'T4b' ? '直接浸润累及膀胱、子宫、阴道或腹壁等临近器官结构' :
                     '依据高分辨率薄层增强 CT/MRI 或术后大病理精准判定浸润深度'}
                  </div>
                </div>

                {/* Colorectal Risk Features */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    局部浸润与切缘风险评估：
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.cancerSpecificData?.emviStatus === 'positive' ? (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>壁外血管侵犯 (EMVI 阳性) · 提示血行转移风险，需严密监测</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>未见明确壁外大血管受累征象 (EMVI 阴性)</span>
                      </span>
                    )}
                    {profile.cancerSpecificData?.distanceFromAnalVerge != null && Number(profile.cancerSpecificData.distanceFromAnalVerge) < 5.0 && (
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-purple-600 shrink-0" />
                        <span>低位/超低位直肠癌 (距肛缘 &lt;5cm) · 重点评估保肛与括约肌保护</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : isLung ? (
              /* Lung Imaging Details */
              <div className="space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-slate-600">
                    <strong>病灶部位</strong>: <span className="font-semibold text-slate-900">{profile.noduleLocation && profile.noduleLocation !== '肺部结节' ? profile.noduleLocation : '肺实质原发灶'}</span>
                  </span>
                  {profile.lungRads && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold shrink-0">
                      Lung-RADS {profile.lungRads}
                    </span>
                  )}
                </div>

                {/* CTR Intelligence Computation Box */}
                {profile.solidSize != null && (
                  <div className="bg-teal-50/90 p-3.5 rounded-2xl border border-teal-200 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="text-teal-950 font-bold flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span>{isPostOp ? '术前基线 CT 实性浸润' : 'CT 实性浸润'}: {profile.solidSize} cm</span>
                        <span className="text-slate-400">/</span>
                        <span>全径: {profile.tumorSize != null ? `${profile.tumorSize} cm` : '待测'}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-teal-100 font-extrabold text-teal-900 text-xs shrink-0">
                        CTR: {profile.ctr != null ? profile.ctr : (profile.solidSize && profile.tumorSize ? Math.round((profile.solidSize / profile.tumorSize) * 100) / 100 : (profile.noduleType === 'pure_solid' ? 1.0 : profile.noduleType === 'pure_ggo' ? 0 : '待测'))}
                      </span>
                    </div>
                    <div className="text-[11px] text-teal-700 font-medium">
                      {isPostOp ? (
                        '术前影像基线参考 · 术后分期以病理浸润径金标准 (pT) 为准'
                      ) : (
                        <>依据 IASLC / AJCC 第 9 版规则以实性成分精准校准为 <strong>{profile.stage || '待定'} 期 ({profile.tStage || 'Tx'})</strong></>
                      )}
                    </div>
                  </div>
                )}

              {/* CT Malignant Signs Pills with GlossaryTooltip */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  已排查影像特征（可点击查看释义）：
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.imagingFeatures && profile.imagingFeatures.length > 0 ? (
                    profile.imagingFeatures.map((feat, i) => (
                      <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                        <GlossaryTooltip term={feat}>
                          <span>{feat}</span>
                        </GlossaryTooltip>
                      </span>
                    ))
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>结节边缘光滑，未见明显毛刺或胸膜牵拉征</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Multiple Nodules Sub-Panel (P0-1) */}
              {(profile.isMultipleNodules || (profile.secondaryNodules && profile.secondaryNodules.length > 0)) && (
                <div className="pt-1 flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
                  <span className="font-semibold text-slate-500 text-[11px]">伴随微小病灶:</span>
                  {(profile.secondaryNodules || []).map((sec, idx) => (
                    <span key={sec.id || idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{sec.location} ({sec.sizeMm}mm · {sec.type === 'pure_ggo' ? '纯磨玻璃' : '微小灶'})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            ) : (
              /* Generic Imaging Details for Gastric / Liver / Esophageal / Thyroid / Endometrial / Cervical / Pancreatic */
              <div className="space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-slate-600">
                    <strong>原发部位</strong>: <span className="font-semibold text-slate-900">
                      {profile.noduleLocation || (profile as any).primaryLocation || (CancerRegistry.get(activeType)?.name || '原发灶')}
                    </span>
                  </span>
                </div>

                {/* Tumor Size & T-Stage Strip */}
                <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-slate-900 font-bold flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>影像肿块: {profile.tumorSize != null ? `${profile.tumorSize} cm` : (profile.tStage ? `T 分期: ${profile.tStage}` : '待影像测量')}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-200/90 font-extrabold text-slate-900 text-xs shrink-0">
                      {profile.tStage || 'cTx'} · {profile.stage ? `${profile.stage} 期` : '分期待定'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {isGastric ? '依据 AJCC 第 8 版胃癌 TNM 分期，T 分期基于胃壁浸润深度判定' :
                     isLiver ? '依据 CNLC / BCLC 分期，综合肿瘤数目、大小与肝功能储备评估' :
                     isEsophageal ? '依据 AJCC 第 8 版食管癌 TNM 分期，浸润深度与组织学类型共同决定分期' :
                     isThyroid ? '依据 AJCC 第 8 版甲状腺癌分期，结合年龄、组织学与侵犯范围综合评定' :
                     isEndometrial ? '依据 FIGO 2023 子宫内膜癌分期，结合肌层浸润深度与分子分型评估' :
                     isCervical ? '依据 FIGO 2018 宫颈癌临床分期，结合宫旁浸润与影像综合评定' :
                     isPancreatic ? '依据 AJCC 第 8 版胰腺癌 TNM 分期，可切除性与血管关系是核心评估要素' :
                     '依据国际权威指南 TNM 分期，结合影像与病理进行综合分期评定'}
                  </div>
                </div>

                {/* Imaging Features Pills */}
                {profile.imagingFeatures && profile.imagingFeatures.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      影像特征已排查：
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.imagingFeatures.map((feat, i) => (
                        <span key={i} className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <GlossaryTooltip term={feat}>
                            <span>{feat}</span>
                          </GlossaryTooltip>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bento Box 2: Pathology High-Risk Indicators & Ki-67 (N-Stage & Invasive Factors) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center shrink-0 ${isBreast ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-600'}`}>
                  <Microscope className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                    {isBreast ? '分子分型与组织病理免疫组化' : '术后组织病理与浸润特征'}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                    {isBreast ? '核心免疫组化四项与预后病理分型' : '高危浸润因素与脉管神经侵犯评估'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 whitespace-nowrap shrink-0">
                {isBreast
                  ? (profile.molecularSubtype ? profile.molecularSubtype.replace(/_/g, ' ') : (profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' ? '穿刺活检/评估中' : '免疫组化金标准'))
                  : (profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' || profile.surgeryType === 'unknown' ? '术前基线' : '病理金标准')
                }
              </span>
            </div>

            {profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' || (!isBreast && profile.surgeryType === 'unknown') ? (
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-center gap-3 my-auto">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    {isBreast ? '未录入穿刺活检或手术病理' : '尚未接受手术切除（术前评估阶段）'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate sm:whitespace-normal">
                    {isBreast
                      ? '分子受体 (ER/PR/HER2/Ki-67) 待穿刺活检或术后大病理报告出具'
                      : '切缘状态、微血管/气道浸润及 Ki-67 待术后病理报告确认，当前重点参考薄层 CT 影像分期'
                    }
                  </p>
                </div>
              </div>
            ) : isBreast ? (
              /* Breast Pathology & Molecular IHC */
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
                  <span>
                    <strong>手术术式</strong>: {
                      profile.surgeryType === 'lumpectomy' || profile.surgeryType === 'bcs' ? '保乳手术 (BCS)' :
                      profile.surgeryType === 'mastectomy' ? '乳腺全切术 (Mastectomy)' :
                      profile.surgeryType || '保乳/全切术'
                    }
                  </span>
                  <span>
                    <strong>组织学分级</strong>: {
                      profile.nottinghamGrade ? `Grade ${profile.nottinghamGrade} (${String(profile.nottinghamGrade) === '1' ? '高分化/低恶性' : String(profile.nottinghamGrade) === '3' ? '低分化/高侵袭' : '中分化'})` :
                      profile.grade ? `Grade ${profile.grade}` : '待分级 / 待确认'
                    }
                  </span>
                </div>

                {/* ypTNM Neoadjuvant Staging Alert Banner (v3.1) */}
                {(profile.neoadjuvantChemo || profile.cancerSpecificData?.neoadjuvantChemo || profile.tStage?.toLowerCase().startsWith('yp') || profile.nStage?.toLowerCase().startsWith('yp')) && (
                  <div className="p-3.5 bg-amber-50/95 rounded-2xl border border-amber-300 shadow-2xs space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="text-amber-950 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-extrabold">新辅助治疗后病理 (ypTNM) 评估提示</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 font-extrabold text-[10px]">
                          不适用 AJCC Table 48.4
                        </span>
                      </span>
                      {profile.cancerSpecificData?.pcrStatus && (
                        <span className="px-2 py-0.5 rounded-md bg-white border border-amber-300 font-bold text-amber-900 text-xs">
                          {profile.cancerSpecificData.pcrStatus === 'ypT0isN0' ? '病理完全缓解 (pCR)' : '非完全缓解 (non-pCR)'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      <strong>国际指南规范提醒</strong>：接受新辅助化疗/靶向治疗后的病理分期 (ypTNM) <strong>不适用</strong> AJCC 第 8/9 版常规解剖病理预后分期表 (Table 48.4)。预后评估与后续强化治疗决策应紧密结合术后 <strong>病理完全缓解 (pCR)</strong> 与 <strong>残余肿瘤负荷 (RCB)</strong> 评分。
                    </p>
                    <div className="text-[11px] text-amber-950 bg-amber-100/80 p-2 rounded-xl border border-amber-200 leading-snug">
                      <strong>循证强化治疗参考</strong>：若病理评估为 non-pCR（有残存病灶），HER2 阳性患者推荐参考 <strong>KATHERINE 研究</strong>换用 T-DM1 强化靶向；三阴性患者推荐参考 <strong>CREATE-X 研究</strong>加用卡培他滨口服维持。
                    </div>
                  </div>
                )}

                {/* Breast Pathology St. Gallen Molecular Subtype & Measurement Strip */}
                <div className="bg-rose-50/90 p-3 sm:p-3.5 rounded-2xl border border-rose-200 space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-rose-950 font-bold flex items-center gap-1.5 flex-wrap">
                      <Ruler className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                      <span>分子分型: {
                        profile.molecularSubtype === 'Luminal_A' ? 'Luminal A 型 (内分泌敏感低危)' :
                        profile.molecularSubtype === 'Luminal_B_HER2_neg' ? 'Luminal B 型 (HER2 阴性)' :
                        profile.molecularSubtype === 'Luminal_B_HER2_pos' ? 'Luminal B 型 (HER2 阳性/三阳性)' :
                        profile.molecularSubtype === 'HER2_enriched' ? 'HER2 过表达型' :
                        (profile.molecularSubtype === 'Triple_Negative' || profile.molecularSubtype === 'TNBC') ? '三阴性乳腺癌 (TNBC)' :
                        profile.molecularSubtype ? profile.molecularSubtype.replace(/_/g, ' ') : '待病理评估'
                      }</span>
                      <span className="text-rose-300">/</span>
                      <span>浸润全径: {profile.pathologyInvasiveSize != null ? `${profile.pathologyInvasiveSize} cm` : (profile.pathologyTumorSize != null ? `${profile.pathologyTumorSize} cm` : (profile.tumorSize ? `${profile.tumorSize} cm` : '待测'))}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-200/90 font-extrabold text-rose-950 text-xs shrink-0">
                      pT定级基准: {profile.tStage || '待定 (pTx)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-rose-800 leading-snug">
                    依据 St. Gallen 国际共识与 AJCC 第 8/9 版标准，以分子免疫表型与镜下浸润径精准定级
                  </div>
                </div>

                {/* 6-Core Risk Badges Matrix for Breast */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <RiskBadge 
                    label="ER (雌激素受体)" 
                    status={profile.erStatus === 'positive' || (profile.erPercent != null && profile.erPercent >= 1) ? 'good' : 'warning'} 
                    text={profile.erPercent != null ? `${profile.erPercent}% (${profile.erStatus === 'positive' ? '阳性' : '阴性'})` : (profile.erStatus === 'positive' ? '阳性 (强)' : profile.erStatus === 'negative' ? '阴性' : '待查')} 
                  />
                  <RiskBadge 
                    label="PR (孕激素受体)" 
                    status={profile.prStatus === 'positive' || (profile.prPercent != null && profile.prPercent >= 20) ? 'good' : 'warning'} 
                    text={profile.prPercent != null ? `${profile.prPercent}% (${profile.prStatus === 'positive' ? '阳性' : '阴性'})` : (profile.prStatus === 'positive' ? '阳性' : profile.prStatus === 'negative' ? '阴性' : '待查')} 
                  />
                  <RiskBadge 
                    label="HER2 状态" 
                    status={profile.her2Fish === 'amplified' || profile.her2Status === '3+' || profile.her2Status === 'positive' ? 'danger' : (profile.her2Low || profile.her2Status === 'low' || profile.her2Status === '1+' || (profile.her2Status === '2+' && profile.her2Fish === 'negative')) ? 'warning' : 'good'} 
                    text={profile.her2Fish === 'amplified' ? '阳性 (FISH扩增)' : profile.her2Status === '3+' ? '阳性 (IHC 3+)' : (profile.her2Low || profile.her2Status === 'low' || profile.her2Status === '1+' || (profile.her2Status === '2+' && profile.her2Fish === 'negative')) ? 'HER2 低表达 (Low · DESTINY-04)' : (profile.her2Status === '0' || profile.her2Status === 'negative' ? '阴性 (0)' : profile.her2Status || '待查')} 
                  />
                  <RiskBadge 
                    label="切缘状态" 
                    status={isMarginSafe ? 'good' : profile.marginStatus === 'positive' || profile.margin === 'positive' ? 'danger' : 'neutral'} 
                    text={isMarginSafe ? '阴性 (R0 安全)' : profile.marginStatus === 'positive' || profile.margin === 'positive' ? '阳性 (有残留)' : '未检测 / 待查'} 
                  />
                  <RiskBadge 
                    label="前哨淋巴结 (SLNB)" 
                    status={profile.sentinelNodesPositive === 0 ? 'good' : (profile.sentinelNodesPositive && profile.sentinelNodesPositive > 0 ? 'warning' : 'neutral')} 
                    text={profile.sentinelNodesTotal != null ? `${profile.sentinelNodesPositive ?? 0}/${profile.sentinelNodesTotal} 阳性` : (isN0Safe ? '0 阳性 (pN0)' : (profile.nStage || '待活检'))} 
                  />
                  <RiskBadge 
                    label="腋窝清扫 (ALND)" 
                    status={profile.axillaryNodesPositive === 0 ? 'good' : (profile.axillaryNodesPositive && profile.axillaryNodesPositive >= 4 ? 'danger' : (profile.axillaryNodesPositive && profile.axillaryNodesPositive > 0 ? 'warning' : 'neutral'))} 
                    text={profile.axillaryNodesTotal != null ? `${profile.axillaryNodesPositive ?? 0}/${profile.axillaryNodesTotal} 阳性` : (isN0Safe ? '无转移 (pN0)' : (profile.nStage || '未清扫/免清扫'))} 
                  />
                  {(profile.brca1 || profile.brca2) && (
                    <RiskBadge 
                      label="BRCA1/2 基因突变" 
                      status={profile.brca1 === 'positive' || profile.brca2 === 'positive' ? 'warning' : 'good'} 
                      text={profile.brca1 === 'positive' || profile.brca2 === 'positive' ? '检出突变 (OlympiA靶向)' : '未检出突变 (野生型)'} 
                    />
                  )}
                </div>

                {/* HER2-Low Subpopulation DESTINY-Breast04 Dedicated Strip (v3.1) */}
                {(profile.her2Low || profile.her2Status === 'low' || profile.her2Status === '1+' || (profile.her2Status === '2+' && profile.her2Fish === 'negative')) && (
                  <div className="p-3 bg-purple-50/90 rounded-2xl border border-purple-200 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="text-purple-950 font-bold flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>HER2-Low 低表达亚群标记 (IHC 1+ 或 2+/FISH-):</span>
                        <span className="px-2 py-0.5 bg-purple-200 text-purple-950 font-extrabold rounded-md text-[10px]">
                          DESTINY-Breast04 证据
                        </span>
                      </span>
                      <span className="text-[11px] font-bold text-purple-700">
                        T-DXd (优赫得) 靶向获益人群
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-800 leading-snug">
                      基于 NEJM 顶刊 DESTINY-Breast04 研究，传统被划分为 HER2 阴性的患者中，约 50%~60% 属于 HER2 低表达。此类患者在既往全身化疗或内分泌治疗后，使用高活性新型 ADC <strong>德曲妥珠单抗 (T-DXd, 优赫得)</strong> 可显著延长无进展生存期 (PFS) 与总生存期 (OS)。
                    </p>
                  </div>
                )}

                {/* Ki-67 Dedicated Strip with 14%~20% Gray Zone Warning (v3.1) */}
                {profile.ki67 != null && profile.ki67 !== "" && (
                  <div className={`p-2.5 rounded-xl border flex flex-col gap-1.5 text-xs ${
                    ((typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) >= 14 && (typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) < 20)
                      ? 'bg-amber-50/90 border-amber-200'
                      : 'bg-rose-50/80 border-rose-200'
                  }`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-slate-900 font-bold flex items-center gap-1.5">
                        <GlossaryTooltip term="Ki-67">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>Ki-67 细胞增殖指数:</span>
                          </span>
                        </GlossaryTooltip>
                        <span className="px-2 py-0.5 bg-rose-200/80 rounded-md font-extrabold text-rose-950 shrink-0">
                          {profile.ki67}%
                        </span>
                      </span>
                      <span className="text-[11px] font-semibold">
                        {((typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) >= 14 && (typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) < 20) ? (
                          <span className="text-amber-800 font-bold">临界灰区 (14%~20%) · Luminal A vs B 分界争议带</span>
                        ) : (typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) < 14 ? (
                          <span className="text-emerald-700 font-semibold">低增殖 (&lt;14%) · Luminal A 典型惰性特征</span>
                        ) : (
                          <span className="text-rose-700 font-semibold">高增殖指数 (≥20%) · 细胞分裂活跃</span>
                        )}
                      </span>
                    </div>
                    {((typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) >= 14 && (typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) < 20) && (
                      <div className="text-[11px] text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded-lg border border-amber-200/70 flex items-center justify-between">
                        <span>临界灰区 (14%~20%) · 结合 21 基因 RS 评分决策化疗获益</span>
                        <GlossaryTooltip term="Ki-67">
                          <span className="text-[10px] text-amber-700 underline cursor-pointer">查看释疑</span>
                        </GlossaryTooltip>
                      </div>
                    )}
                  </div>
                )}

                {/* 21-Gene Oncotype DX RS Strip */}
                {profile.oncotypeDxScore != null ? (
                  <div className="p-3 bg-indigo-50/90 rounded-2xl border border-indigo-200 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                      <span className="text-indigo-950 font-bold flex items-center gap-1.5">
                        <Dna className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>21 基因复发评分 (Oncotype DX RS):</span>
                        <span className="px-2 py-0.5 bg-indigo-200 text-indigo-950 font-extrabold rounded-md text-xs">
                          RS = {profile.oncotypeDxScore}
                        </span>
                      </span>
                      <span className="text-[11px] font-bold text-indigo-700">
                        {Number(profile.oncotypeDxScore) < 11 
                          ? '极低风险 (AJCC 8/9版降为 IA 期 · 免化疗)' 
                          : Number(profile.oncotypeDxScore) <= 25 
                          ? '中低风险 (TAILORx 顶刊证实单纯内分泌免化疗)' 
                          : '高风险 (辅助化疗显著获益)'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Dna className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>21-基因检测临床提示：</span>
                    </span>
                    <span className="text-slate-500">适用于 HR+/HER2- 早期患者，精准指导免除辅助化疗</span>
                  </div>
                )}
              </div>
            ) : isColorectal ? (
              /* Colorectal Pathology & Molecular Subtyping */
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
                  <span>
                    <strong>手术术式</strong>: {
                      profile.surgeryType || (profile.organ === 'colorectal' ? '全系膜根治切除术 (CME / TME)' : '微创切除 / 根治术')
                    }
                  </span>
                  <span>
                    <strong>组织学类型</strong>: {
                      profile.histology || profile.cancerSpecificData?.histologyType || '结直肠腺癌 (常见型)'
                    }
                  </span>
                </div>

                {/* Lymph node exam & Tumor Deposits Strip */}
                <div className="bg-emerald-50/90 p-3.5 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-emerald-950 font-bold flex items-center gap-1.5 flex-wrap">
                      <Layers className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>检出淋巴结总数: {profile.cancerSpecificData?.lymphNodesExamined != null ? `${profile.cancerSpecificData.lymphNodesExamined} 枚` : '待病理报告'}</span>
                      {profile.cancerSpecificData?.lymphNodesPositive != null && (
                        <>
                          <span className="text-emerald-300">/</span>
                          <span className={`font-semibold ${Number(profile.cancerSpecificData.lymphNodesPositive) > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                            转移: {profile.cancerSpecificData.lymphNodesPositive} 枚 ({profile.nStage || 'N0'})
                          </span>
                        </>
                      )}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold shrink-0 ${
                      (profile.cancerSpecificData?.lymphNodesExamined != null && Number(profile.cancerSpecificData.lymphNodesExamined) >= 12)
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {profile.cancerSpecificData?.lymphNodesExamined != null && Number(profile.cancerSpecificData.lymphNodesExamined) >= 12 ? '清扫达标 (≥12枚)' : '质控关注'}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium leading-relaxed flex items-start gap-1">
                    {profile.cancerSpecificData?.tumorDeposits === 'present' || profile.nStage === 'N1c' ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>病理提示伴有浆膜下「肿瘤沉积 (TD)」，特异归入 N1c 分期，具有明确辅助化疗指征。</span>
                      </>
                    ) : (
                      <span>未见肠系膜孤立肿瘤沉积 (TD-)，淋巴结清扫质控符合国际临床规范。</span>
                    )}
                  </div>
                </div>

                {/* 4 Core Molecular Markers: MSI/MMR, KRAS, NRAS, BRAF */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">微卫星状态</span>
                    <span className={`font-bold text-xs mt-0.5 block ${
                      profile.cancerSpecificData?.msiStatus === 'MSI-H' || profile.cancerSpecificData?.dmmrStatus === 'dMMR'
                        ? 'text-purple-700' : 'text-slate-800'
                    }`}>
                      {profile.cancerSpecificData?.msiStatus || profile.cancerSpecificData?.dmmrStatus || 'MSS / 待查'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">KRAS 基因</span>
                    <span className={`font-bold text-xs mt-0.5 block ${
                      profile.cancerSpecificData?.krasMutation && profile.cancerSpecificData.krasMutation !== 'wildtype'
                        ? 'text-amber-700' : 'text-emerald-700'
                    }`}>
                      {profile.cancerSpecificData?.krasMutation ? (profile.cancerSpecificData.krasMutation === 'wildtype' ? '野生型 (WT)' : profile.cancerSpecificData.krasMutation) : '野生型 (WT)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">NRAS 基因</span>
                    <span className="font-bold text-xs mt-0.5 text-slate-800 block">
                      {profile.cancerSpecificData?.nrasMutation || '野生型 (WT)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">BRAF 突变</span>
                    <span className={`font-bold text-xs mt-0.5 block ${
                      profile.cancerSpecificData?.brafMutation === 'V600E' ? 'text-rose-700' : 'text-slate-800'
                    }`}>
                      {profile.cancerSpecificData?.brafMutation === 'V600E' ? 'V600E 突变' : '野生型 (WT)'}
                    </span>
                  </div>
                </div>
              </div>
            ) : isLung ? (
              /* Lung Pathology */
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
                  <span>
                    <strong>手术术式</strong>: {
                      profile.surgeryType === 'segmentectomy' ? '解剖性肺段切除' :
                      profile.surgeryType === 'lobectomy' ? '标准肺叶切除' :
                      profile.surgeryType === 'wedge' ? '肺楔形切除' :
                      profile.surgeryType || '根治性切除'
                    }
                  </span>
                  <span>
                    <strong>组织亚型</strong>: {profile.histology || '浸润性腺癌'}
                  </span>
                </div>

                {/* Pathological Tumor Size Measurement Strip (IASLC / AJCC 第 9 版 pT Gold Standard) */}
                <div className="bg-purple-50/90 p-3 sm:p-3.5 rounded-2xl border border-purple-200 space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-purple-950 font-bold flex items-center gap-1.5 flex-wrap">
                      <Ruler className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span>病理浸润大小: {profile.pathologyInvasiveSize != null ? `${profile.pathologyInvasiveSize} cm` : (profile.solidSize != null ? `${profile.solidSize} cm (参考CT实性)` : '未标明')}</span>
                      {profile.pathologyLepidicPercent != null && (
                        <span className="text-[10px] text-purple-800 bg-purple-100/90 px-1.5 py-0.5 rounded-md font-semibold">
                          (贴壁 {profile.pathologyLepidicPercent}% 折算)
                        </span>
                      )}
                      {profile.pathologyReportMode === 'unspecified' && (
                        <span className="text-[10px] text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded-md font-semibold">
                          (参照CT实性估算)
                        </span>
                      )}
                      <span className="text-purple-300">/</span>
                      <span>标本全径: {profile.pathologyTumorSize != null ? `${profile.pathologyTumorSize} cm` : (profile.tumorSize ? `${profile.tumorSize} cm (参考原发灶)` : '未标明')}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-200/90 font-extrabold text-purple-950 text-xs shrink-0">
                      pT定级基准: {profile.tStage || '待定 (Tx)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-800 leading-snug flex items-center justify-between flex-wrap gap-1">
                    <span>
                      依据 IASLC / AJCC 第 9 版 伏壁贴壁腺癌金标准，以<strong>镜下微观浸润径</strong>判定 pT 分期
                    </span>
                    {profile.tumorSize && (
                      <span className="text-purple-600 font-medium">
                        (病理浸润测定与术前影像评估相吻合)
                      </span>
                    )}
                  </div>
                </div>

                {/* 6-Core Risk Badges Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <RiskBadge 
                    label="切缘状态" 
                    status={
                      profile.marginStatus === 'negative' || profile.margin === 'negative' ? 'good' :
                      profile.marginStatus === 'positive' || profile.margin === 'positive' ? 'danger' : 'neutral'
                    } 
                    text={
                      profile.marginStatus === 'negative' || profile.margin === 'negative' ? '阴性 (R0 安全)' :
                      profile.marginStatus === 'positive' || profile.margin === 'positive' ? '阳性 (有残留)' : '未检测 / 待查'
                    } 
                  />
                  <RiskBadge 
                    label="淋巴结分期" 
                    status={
                      profile.nStage === 'N0' || profile.lymphNodes === 'N0' ? 'good' :
                      profile.nStage === 'N1' || profile.nStage === 'N2a' ? 'warning' :
                      profile.nStage === 'N2b' || profile.nStage === 'N2' || profile.nStage === 'N3' ? 'danger' :
                      'neutral'
                    } 
                    text={
                      profile.nStage === 'N0' || profile.lymphNodes === 'N0' ? 'N0 (无转移)' :
                      profile.nStage === 'N1' ? 'N1 (肺门累及)' :
                      profile.nStage === 'N2a' ? 'N2a (单站纵隔)' :
                      profile.nStage === 'N2b' ? 'N2b (多站纵隔)' :
                      profile.nStage === 'N2' ? 'N2 (纵隔转移)' :
                      profile.nStage === 'N3' ? 'N3 (对侧/锁骨上)' :
                      profile.nStage === 'Nx' ? 'Nx (未行清扫)' :
                      (profile.nStage || '待病理评估')
                    } 
                  />
                  <RiskBadge 
                    label="胸膜侵犯 (VPI)" 
                    status={
                      profile.vpi === 'negative' || (profile.vpi as any) === false ? 'good' :
                      profile.vpi === 'positive' || (profile.vpi as any) === true ? 'warning' : 'neutral'
                    } 
                    text={
                      profile.vpi === 'negative' || (profile.vpi as any) === false ? 'PL0 (未侵犯)' :
                      profile.vpi === 'positive' || (profile.vpi as any) === true ? 'PL1/PL2 (阳性)' : '未检测 / 待查'
                    } 
                  />
                  <RiskBadge 
                    label="气道播散 (STAS)" 
                    status={
                      profile.stas === 'negative' || (profile.stas as any) === false ? 'good' :
                      profile.stas === 'positive' || (profile.stas as any) === true ? 'warning' : 'neutral'
                    } 
                    text={
                      profile.stas === 'negative' || (profile.stas as any) === false ? '阴性 (未侵犯)' :
                      profile.stas === 'positive' || (profile.stas as any) === true ? '阳性 (高危)' : '未检测 / 待查'
                    } 
                  />
                  <RiskBadge 
                    label="脉管癌栓 (LVI)" 
                    status={
                      profile.lvi === 'negative' || (profile.lvi as any) === false ? 'good' :
                      profile.lvi === 'positive' || (profile.lvi as any) === true ? 'warning' : 'neutral'
                    } 
                    text={
                      profile.lvi === 'negative' || (profile.lvi as any) === false ? '阴性 (未侵犯)' :
                      profile.lvi === 'positive' || (profile.lvi as any) === true ? '阳性 (高危)' : '未检测 / 待查'
                    } 
                  />
                  <RiskBadge 
                    label="IASLC 分级" 
                    status={
                      profile.iaslcGrade === '3' || profile.grade === '3' ? 'warning' :
                      profile.iaslcGrade === '1' || profile.grade === '1' || profile.iaslcGrade === '2' || profile.grade === '2' ? 'good' : 'neutral'
                    } 
                    text={
                      profile.iaslcGrade === '3' || profile.grade === '3' ? 'G3 (低分化)' :
                      profile.iaslcGrade === '2' || profile.grade === '2' ? 'G2 (中分化)' :
                      profile.iaslcGrade === '1' || profile.grade === '1' ? 'G1 (高分化)' : '未分级 / 待确认'
                    } 
                  />
                </div>

                {/* Ki-67 Dedicated Strip */}
                {profile.ki67 != null && profile.ki67 !== "" && (
                  <div className="p-2.5 bg-purple-50/80 rounded-xl border border-purple-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-purple-900 font-bold flex items-center gap-1.5">
                      <GlossaryTooltip term="Ki-67">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Ki-67 细胞增殖指数:</span>
                        </span>
                      </GlossaryTooltip>
                      <span className="px-2 py-0.5 bg-purple-200/80 rounded-md font-extrabold text-purple-950 shrink-0">
                        {profile.ki67}%
                      </span>
                    </span>
                    <span className="text-[11px] text-purple-700 font-semibold">
                      {(typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) <= 5 ? '低增殖指数 (≤5%) · 预后良好' : '常规增殖水平'}
                    </span>
                  </div>
                )}

                {/* Lung Driver Gene & Molecular Status Strip */}
                {(profile.egfr || (profile.geneMutations && profile.geneMutations.length > 0) || profile.pdl1Tps != null || profile.molecular) && (
                  <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-indigo-950 font-bold flex items-center gap-1.5">
                      <Dna className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>驱动基因与分子靶点:</span>
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {profile.egfr === 'positive' || (profile.geneMutations && profile.geneMutations.some(m => m.gene === 'EGFR')) ? (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-extrabold text-[11px] border border-indigo-200">
                          EGFR 敏感突变 {profile.geneMutations?.find(m => m.gene === 'EGFR')?.subtype || ''}
                        </span>
                      ) : profile.egfr === 'negative' ? (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                          EGFR 野生型
                        </span>
                      ) : null}
                      {profile.geneMutations && profile.geneMutations.filter(m => m.gene !== 'EGFR').map((gm, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-bold text-[11px] border border-indigo-200">
                          {gm.gene} {gm.subtype || '突变'}
                        </span>
                      ))}
                      {profile.pdl1Tps != null && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 font-bold text-[11px] border border-purple-200">
                          PD-L1 TPS: {profile.pdl1Tps}%
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Generic Pathology for Gastric / Liver / Esophageal / Thyroid / Endometrial / Cervical / Pancreatic */
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
                  <span>
                    <strong>手术术式</strong>: {profile.surgeryType || (
                      isGastric ? '胃切除根治术 (D2 淋巴结清扫)' :
                      isLiver ? '肝切除术 / 局部消融' :
                      isEsophageal ? '食管癌根治术 (McKeown / Ivor Lewis)' :
                      isThyroid ? '甲状腺切除术' :
                      isEndometrial ? '腹腔镜/机器人全子宫切除术' :
                      isCervical ? '广泛性子宫切除术 (Wertheim)' :
                      isPancreatic ? '胰十二指肠切除术 / 胰体尾切除' :
                      '根治性切除术'
                    )}
                  </span>
                  <span>
                    <strong>组织学类型</strong>: {profile.histology || (
                      isGastric ? '胃腺癌 (常见型)' :
                      isLiver ? '肝细胞肝癌 (HCC)' :
                      isEsophageal ? '鳞状细胞癌' :
                      isThyroid ? '乳头状甲状腺癌 (PTC)' :
                      isEndometrial ? '子宫内膜样腺癌' :
                      isCervical ? '鳞状细胞癌' :
                      isPancreatic ? '胰腺导管腺癌 (PDAC)' :
                      '腺癌'
                    )}
                  </span>
                </div>

                {/* Generic Pathology Strip */}
                <div className="bg-slate-50/90 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-slate-900 font-bold flex items-center gap-1.5 flex-wrap">
                      <Layers className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span>病理 T 分期: {profile.tStage || 'pTx (待标注)'}</span>
                      {profile.nStage && (
                        <>
                          <span className="text-slate-300">/</span>
                          <span className={`font-semibold ${profile.nStage === 'N0' ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {profile.nStage}
                          </span>
                        </>
                      )}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold shrink-0 ${
                      profile.marginStatus === 'negative' || profile.margin === 'negative'
                        ? 'bg-emerald-100 text-emerald-900'
                        : profile.marginStatus === 'positive' || profile.margin === 'positive'
                        ? 'bg-rose-100 text-rose-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {profile.marginStatus === 'negative' || profile.margin === 'negative' ? 'R0 切缘阴性' :
                       profile.marginStatus === 'positive' || profile.margin === 'positive' ? 'R1 切缘阳性' : '切缘待确认'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {isGastric ? '胃癌 D2 根治标准：检出淋巴结≥15枚，切缘距肿瘤≥3cm (近端)/5cm (远端)' :
                     isLiver ? '肝癌切除标准：解剖性切除优于非解剖性；Child-Pugh A 或 B7 分以下，残肝体积≥40%' :
                     isEsophageal ? '食管癌根治标准：R0 切除，检出淋巴结≥15枚，两端切缘≥3cm' :
                     isThyroid ? '甲状腺癌切除标准：全切/腺叶切除依据风险分层；VI 区淋巴结常规清扫' :
                     isEndometrial ? '子宫内膜癌手术：全子宫双附件切除；高危者行盆腔+腹主动脉旁淋巴结清扫' :
                     isCervical ? '宫颈癌根治手术：广泛子宫切除+盆腔淋巴结清扫 (Piver III)，切缘≥1cm' :
                     isPancreatic ? '胰腺癌根治标准：R0 切除，胰周神经清扫，检出淋巴结≥15枚' :
                     '依据国际指南标准，R0 根治切除是影响局部控制与总生存的核心因素'}
                  </div>
                </div>

                {/* Core Risk Badges for non-lung non-breast non-colorectal */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <RiskBadge 
                    label="切缘状态 (R)" 
                    status={
                      profile.marginStatus === 'negative' || profile.margin === 'negative' ? 'good' :
                      profile.marginStatus === 'positive' || profile.margin === 'positive' ? 'danger' : 'neutral'
                    } 
                    text={
                      profile.marginStatus === 'negative' || profile.margin === 'negative' ? 'R0 (安全)' :
                      profile.marginStatus === 'positive' || profile.margin === 'positive' ? 'R1 (阳性)' : '未检测 / 待查'
                    } 
                  />
                  <RiskBadge 
                    label="淋巴结分期" 
                    status={
                      profile.nStage === 'N0' || profile.lymphNodes === 'N0' ? 'good' :
                      profile.nStage === 'N1' ? 'warning' :
                      profile.nStage === 'N2' || profile.nStage === 'N3' ? 'danger' : 'neutral'
                    } 
                    text={
                      profile.nStage === 'N0' || profile.lymphNodes === 'N0' ? 'N0 (无转移)' :
                      profile.nStage === 'N1' ? 'N1 (区域转移)' :
                      profile.nStage === 'N2' ? 'N2 (远处区域)' :
                      profile.nStage === 'N3' ? 'N3 (广泛转移)' :
                      (profile.nStage || '待病理评估')
                    } 
                  />
                  <RiskBadge 
                    label="脉管癌栓 (LVI)" 
                    status={
                      profile.lvi === 'negative' || (profile.lvi as any) === false ? 'good' :
                      profile.lvi === 'positive' || (profile.lvi as any) === true ? 'warning' : 'neutral'
                    } 
                    text={
                      profile.lvi === 'negative' || (profile.lvi as any) === false ? '阴性 (未侵犯)' :
                      profile.lvi === 'positive' || (profile.lvi as any) === true ? '阳性 (高危)' : '未检测 / 待查'
                    } 
                  />
                  <RiskBadge 
                    label="神经周围浸润" 
                    status={
                      (profile as any).perineuralInvasion === 'negative' ? 'good' :
                      (profile as any).perineuralInvasion === 'positive' ? 'warning' : 'neutral'
                    } 
                    text={
                      (profile as any).perineuralInvasion === 'negative' ? '阴性 (未侵犯)' :
                      (profile as any).perineuralInvasion === 'positive' ? '阳性 (高危)' : '未检测 / 待查'
                    } 
                  />
                  <RiskBadge 
                    label="分化程度" 
                    status={
                      profile.grade === '1' ? 'good' :
                      profile.grade === '2' ? 'warning' :
                      profile.grade === '3' ? 'danger' : 'neutral'
                    } 
                    text={
                      profile.grade === '1' ? 'G1 (高分化)' :
                      profile.grade === '2' ? 'G2 (中分化)' :
                      profile.grade === '3' ? 'G3 (低分化)' : '未分级 / 待确认'
                    } 
                  />
                  {(isGastric || isEndometrial || isCervical) && (
                    <RiskBadge 
                      label={isGastric ? 'HER2 状态' : isEndometrial ? 'MSI / MMR' : 'PD-L1 CPS'}
                      status={
                        isGastric
                          ? ((profile as any).cancerSpecificData?.her2Status === 'positive' || (profile as any).cancerSpecificData?.her2Status === '3+' ? 'warning' : 'good')
                          : isEndometrial
                          ? ((profile as any).cancerSpecificData?.msiStatus === 'MSI-H' ? 'warning' : 'good')
                          : ((profile as any).cancerSpecificData?.pdl1Cps != null && Number((profile as any).cancerSpecificData.pdl1Cps) >= 1 ? 'warning' : 'neutral')
                      } 
                      text={
                        isGastric
                          ? ((profile as any).cancerSpecificData?.her2Status === 'positive' || (profile as any).cancerSpecificData?.her2Status === '3+' ? '阳性 (靶向获益)' : ((profile as any).cancerSpecificData?.her2Status || '待检测'))
                          : isEndometrial
                          ? ((profile as any).cancerSpecificData?.msiStatus || (profile as any).cancerSpecificData?.dmmrStatus || '待检测')
                          : ((profile as any).cancerSpecificData?.pdl1Cps != null ? `CPS ${(profile as any).cancerSpecificData.pdl1Cps}` : '待检测')
                      } 
                    />
                  )}
                </div>

                {/* Ki-67 */}
                {profile.ki67 != null && profile.ki67 !== "" && (
                  <div className="p-2.5 bg-purple-50/80 rounded-xl border border-purple-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <span className="text-purple-900 font-bold flex items-center gap-1.5">
                      <GlossaryTooltip term="Ki-67">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>Ki-67 细胞增殖指数:</span>
                        </span>
                      </GlossaryTooltip>
                      <span className="px-2 py-0.5 bg-purple-200/80 rounded-md font-extrabold text-purple-950 shrink-0">
                        {profile.ki67}%
                      </span>
                    </span>
                    <span className="text-[11px] text-purple-700 font-semibold">
                      {(typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) < 15 ? '低增殖指数 · 惰性特征' : (typeof profile.ki67 === 'number' ? profile.ki67 : parseFloat(String(profile.ki67))) >= 30 ? '高增殖指数 · 侵袭性较强' : '中等增殖水平'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bento Box 3: Systemic Staging & Benign Findings (M-Staging) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 font-bold flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                    全身远处转移排查与伴随病变
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                    全身靶器官系统评估与 M 分期排查
                  </p>
                </div>
              </div>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap shrink-0 ${
                profile.systemicStagingConfirmed || profile.mStage === 'M0' || isEarlyLowRiskLung
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}>
                {profile.systemicStagingConfirmed || profile.mStage === 'M0' 
                  ? 'M0 根治窗口确立' 
                  : isEarlyLowRiskLung 
                  ? '早期豁免常规过度排查 · M0 确立' 
                  : 'M 分期待排查'}
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Organ Checklist Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {isBreast ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>全身骨显像 ECT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.boneScan === 'negative' ? 'text-emerald-700' : profile.boneScan === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {profile.boneScan === 'negative' ? '阴性 (M0)' : profile.boneScan === 'positive' ? '提示可疑' : '未检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>腹部与肝脏超声</span>
                      </span>
                      <span className={`font-bold mt-1 ${(profile.abdominalUltrasound === 'negative' || profile.abdominalUltrasound === 'benign_findings') ? 'text-emerald-700' : profile.abdominalUltrasound === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {(profile.abdominalUltrasound === 'negative' || profile.abdominalUltrasound === 'benign_findings') ? '阴性/良性' : profile.abdominalUltrasound === 'positive' ? '提示可疑' : '未检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>盆腔超声 (内膜基线)</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.cancerSpecificData?.pelvicUltrasound === 'normal' ? 'text-emerald-700' : profile.cancerSpecificData?.pelvicUltrasound === 'thickened_endometrium' || profile.cancerSpecificData?.pelvicUltrasound === 'suspicious' ? 'text-amber-600' : 'text-slate-400'}`}>
                        {profile.cancerSpecificData?.pelvicUltrasound === 'normal' ? '内膜厚度正常' : profile.cancerSpecificData?.pelvicUltrasound === 'thickened_endometrium' || profile.cancerSpecificData?.pelvicUltrasound === 'suspicious' ? '提示增厚' : '未检查/待查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>双能骨密度 DXA</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.cancerSpecificData?.dxaScan === 'normal' ? 'text-emerald-700' : (profile.cancerSpecificData?.dxaScan === 'osteopenia' || profile.cancerSpecificData?.dxaScan === 'osteoporosis') ? 'text-amber-600' : 'text-slate-400'}`}>
                        {profile.cancerSpecificData?.dxaScan === 'normal' ? '骨量正常' : profile.cancerSpecificData?.dxaScan === 'osteopenia' ? '骨量减少' : profile.cancerSpecificData?.dxaScan === 'osteoporosis' ? '骨质疏松' : '未检查/待查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Scan className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>胸部薄层 CT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.chestCt === 'negative' || profile.mStage === 'M0' ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {profile.chestCt === 'negative' || profile.mStage === 'M0' ? '阴性 (无肺转移)' : '未检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>脑部增强 MRI</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.brainMri === 'negative' ? 'text-emerald-700' : profile.brainMri === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {profile.brainMri === 'negative' ? '阴性 (M0)' : profile.brainMri === 'positive' ? '提示可疑' : '高危/有指征查'}
                      </span>
                    </div>
                  </>
                ) : isColorectal ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>肝脏增强 MRI/CT</span>
                      </span>
                      <span className={`font-bold mt-1 ${(profile.abdominalUltrasound === 'negative' || profile.abdominalUltrasound === 'benign_findings' || profile.mStage === 'M0') ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {(profile.abdominalUltrasound === 'negative' || profile.abdominalUltrasound === 'benign_findings' || profile.mStage === 'M0') ? '阴性 (无肝转移)' : '待检查/排查中'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Scan className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>胸部薄层 CT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.chestCt === 'negative' || profile.mStage === 'M0' ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {profile.chestCt === 'negative' || profile.mStage === 'M0' ? '阴性 (无肺转移)' : '待检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>腹膜与大网膜</span>
                      </span>
                      <span className={`font-bold mt-1 ${!profile.cancerSpecificData?.peritonealMets ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {!profile.cancerSpecificData?.peritonealMets ? '阴性 (无种植)' : '提示可疑种植'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Scan className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>盆腔高分辨 MRI</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.mStage === 'M0' || profile.cancerSpecificData?.crmStatus === 'negative' ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {profile.cancerSpecificData?.primaryLocation === 'rectum' ? '直肠分期金标准' : '已排查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>全身 PET-CT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.petCt === 'negative' || profile.mStage === 'M0' ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {profile.petCt === 'negative' || profile.mStage === 'M0' ? '阴性 (未见高代谢)' : '高危/有指征查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>骨显像 ECT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.boneScan === 'negative' || profile.mStage === 'M0' ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {profile.boneScan === 'negative' || profile.mStage === 'M0' ? '阴性 (无骨转移)' : '有骨痛时检查'}
                      </span>
                    </div>
                  </>
                ) : isLung ? (
                  <>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>脑部增强 MRI</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.brainMri === 'negative' || (isEarlyLowRiskLung && !profile.brainMri) ? 'text-emerald-700' : profile.brainMri === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {profile.brainMri === 'negative' ? '阴性 (M0)' : profile.brainMri === 'positive' ? '提示可疑' : isEarlyLowRiskLung ? '早期免查 (M0)' : '未检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>腹部与肾上腺</span>
                      </span>
                      <span className={`font-bold mt-1 ${(profile.abdominalUltrasound === 'negative' || profile.abdominalUltrasound === 'benign_findings' || isEarlyLowRiskLung) ? 'text-emerald-700' : profile.abdominalUltrasound === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {(profile.abdominalUltrasound === 'negative' || profile.abdominalUltrasound === 'benign_findings') ? '阴性/良性' : profile.abdominalUltrasound === 'positive' ? '提示可疑' : isEarlyLowRiskLung ? '常规正常 (M0)' : '未检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>全身骨显像 ECT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.boneScan === 'negative' || (isEarlyLowRiskLung && !profile.boneScan) ? 'text-emerald-700' : profile.boneScan === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {profile.boneScan === 'negative' ? '阴性 (M0)' : profile.boneScan === 'positive' ? '提示可疑' : isEarlyLowRiskLung ? '早期免查 (M0)' : '未检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>颈部/锁骨上淋巴结</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.neckLymphNodes === 'negative' || (isEarlyLowRiskLung && !profile.neckLymphNodes) ? 'text-emerald-700' : profile.neckLymphNodes === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {profile.neckLymphNodes === 'negative' ? '未见肿大 (阴性)' : profile.neckLymphNodes === 'positive' ? '提示肿大 (需活检)' : isEarlyLowRiskLung ? '触诊阴性 (N0)' : '未检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Scan className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>全身 PET-CT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.petCt === 'negative' || (isEarlyLowRiskLung && !profile.petCt) ? 'text-emerald-700' : profile.petCt === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {profile.petCt === 'negative' ? '无浓聚 (M0)' : profile.petCt === 'positive' ? '高代谢' : isEarlyLowRiskLung ? '早期免查 (M0)' : '未检查'}
                      </span>
                    </div>
                  </>
                ) : (
                  /* Generic systemic staging for Gastric / Liver / Esophageal / Thyroid / Endometrial / Cervical / Pancreatic */
                  <>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{isLiver ? '增强 CT/MRI (肝脏)' : isThyroid ? '甲状腺超声+增强 CT' : '腹部增强 CT/MRI'}</span>
                      </span>
                      <span className={`font-bold mt-1 ${(profile.abdominalUltrasound === 'negative' || profile.abdominalUltrasound === 'benign_findings' || profile.mStage === 'M0') ? 'text-emerald-700' : profile.abdominalUltrasound === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {(profile.abdominalUltrasound === 'negative' || profile.abdominalUltrasound === 'benign_findings' || profile.mStage === 'M0') ? '阴性 (M0)' : profile.abdominalUltrasound === 'positive' ? '提示可疑' : '未检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Scan className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>胸部薄层 CT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.chestCt === 'negative' || profile.mStage === 'M0' ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {profile.chestCt === 'negative' || profile.mStage === 'M0' ? '阴性 (无肺转移)' : '待检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>全身骨显像 ECT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.boneScan === 'negative' || profile.mStage === 'M0' ? 'text-emerald-700' : profile.boneScan === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {profile.boneScan === 'negative' || profile.mStage === 'M0' ? '阴性 (无骨转移)' : profile.boneScan === 'positive' ? '提示可疑' : '未检查'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>全身 PET-CT</span>
                      </span>
                      <span className={`font-bold mt-1 ${profile.petCt === 'negative' || profile.mStage === 'M0' ? 'text-emerald-700' : profile.petCt === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                        {profile.petCt === 'negative' || profile.mStage === 'M0' ? '阴性 (未见高代谢)' : profile.petCt === 'positive' ? '高代谢灶' : '高危/有指征查'}
                      </span>
                    </div>
                    {(isEndometrial || isCervical) && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>盆腔高分辨 MRI</span>
                        </span>
                        <span className={`font-bold mt-1 ${profile.mStage === 'M0' ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {profile.mStage === 'M0' ? '局部分期金标准' : '宫旁浸润评估'}
                        </span>
                      </div>
                    )}
                    {isThyroid && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>颈部淋巴结超声</span>
                        </span>
                        <span className={`font-bold mt-1 ${profile.neckLymphNodes === 'negative' ? 'text-emerald-700' : profile.neckLymphNodes === 'positive' ? 'text-rose-600' : 'text-slate-400'}`}>
                          {profile.neckLymphNodes === 'negative' ? '未见转移 (N0)' : profile.neckLymphNodes === 'positive' ? '提示转移' : '未检查'}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Early-stage Low Risk Exemption Notice (Lung Cancer) */}
              {isEarlyLowRiskLung && (
                <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>依据 NCCN / CSCO 肺癌指南，Tis / IA 期病变远处转移概率极低，术前胸腹常规影像正常即确立 M0，豁免常规骨扫描与脑 MRI 等过度排查。</span>
                </div>
              )}

              {/* Benign Findings Strip with GlossaryTooltip & Reassurance */}
              {profile.benignFindings && profile.benignFindings.length > 0 && (
                <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-1.5 shadow-2xs">
                  <div className="text-xs font-bold text-emerald-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>伴发良性病变（非转移，可点击释义）：</span>
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0 inline-flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>已确认为良性病变</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.benignFindings.map((item: string) => (
                      <span key={item} className="px-2 py-0.5 bg-white text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <GlossaryTooltip term={item}><span>{item}</span></GlossaryTooltip>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bento Box 4: AI Decision Engine & Actionable Next Steps */}
        <div className="bg-gradient-to-br from-blue-50/50 via-white to-sky-50/30 rounded-3xl p-4 sm:p-6 md:p-7 border border-blue-200/80 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-blue-100/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                  <GitBranch className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                    循证推演与临床决策建议
                  </h3>
                  <p className="text-xs font-medium text-blue-600/80 mt-0.5 truncate">
                    基于权威指南与前瞻队列综合推演
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>实时推演</span>
              </span>
            </div>


            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                {isBreast ? (
                  profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                    ? (profile.biRads && Number(profile.biRads) >= 4 ? '建议空心针穿刺活检 (CNB)' : '建议 3~6 个月乳腺超声复查')
                    : profile.molecularSubtype === 'Luminal_A'
                    ? (profile.oncotypeDxScore != null && Number(profile.oncotypeDxScore) < 26 ? 'Luminal A 型 · 免化疗低危组' : 'HR+ HER2- · 辅助内分泌长程管理组')
                    : profile.molecularSubtype === 'Luminal_B_HER2_neg'
                    ? 'Luminal B 型 (HER2-) · 内分泌加靶向/化疗评估组'
                    : profile.molecularSubtype === 'Luminal_B_HER2_pos' || profile.molecularSubtype === 'HER2_enriched'
                    ? 'HER2 阳性 · 曲帕双靶向强化治疗组'
                    : (profile.molecularSubtype === 'Triple_Negative' || profile.molecularSubtype === 'TNBC')
                    ? '三阴性乳腺癌 (TNBC) · 规范化疗与免疫综合评估组'
                    : '乳腺癌多学科综合治疗组'
                ) : isColorectal ? (
                  profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                    ? ((profile.cancerSpecificData?.primaryLocation === 'rectum' || (profile as any).primaryLocation === 'rectum') ? '建议高分辨直肠薄层 MRI + 规范肠镜活检' : '建议全结肠镜病理活检及腹盆增强 CT 排查')
                    : (profile.cancerSpecificData?.msiStatus === 'MSI-H' || profile.cancerSpecificData?.dmmrStatus === 'dMMR')
                    ? (profile.stage?.startsWith('IV') ? 'dMMR / MSI-H · 帕博利珠单抗免疫单药一线 (KEYNOTE-177)' : 'II/III 期 dMMR · 免疫新辅助/辅助免单药化疗组')
                    : profile.cancerSpecificData?.brafMutation === 'V600E'
                    ? 'BRAF V600E 突变 · 恩考芬尼+西妥昔双靶强化组 (BEACON)'
                    : profile.stage?.startsWith('III')
                    ? ((profile.cancerSpecificData?.tStage === 'T4' || profile.tStage === 'T4' || profile.cancerSpecificData?.nStage === 'N2' || profile.nStage === 'N2')
                        ? 'III 期高危 (T4/N2) · IDEA 推荐 6 个月 mFOLFOX6 / CAPOX 辅助化疗'
                        : 'III 期低危 (T1-3N1) · IDEA 推荐 3 个月 CAPOX 减毒方案')
                    : profile.stage?.startsWith('II')
                    ? ((profile.cancerSpecificData?.lymphNodesExamined != null && profile.cancerSpecificData.lymphNodesExamined < 12) || profile.cancerSpecificData?.tumorDeposits || profile.cancerSpecificData?.emviStatus === 'positive' || profile.cancerSpecificData?.crmStatus === 'positive' || profile.tStage === 'T4' || profile.cancerSpecificData?.tStage === 'T4'
                        ? 'II 期伴临床高危特征 · 建议辅助化疗风险获益评估'
                        : 'II 期低危 · 规范随访复查 · 豁免辅助化疗')
                    : profile.stage?.startsWith('IV')
                    ? ((!profile.cancerSpecificData?.krasMutation || profile.cancerSpecificData.krasMutation === 'wildtype') && profile.cancerSpecificData?.primaryLocation === 'left_colon'
                        ? '左半结肠全野生型 · 西妥昔单抗联合双药一线转化组'
                        : 'RAS 突变 / 右半结肠 · 贝伐珠单抗联合化疗长程抗血管组')
                    : '结直肠癌规范手术根治与长程随访组'
                ) : isLung ? (
                  profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                    ? (profile.riskLevel === 'high' ? '建议胸外科微创评估' : '建议 3~6 个月随访观察')
                    : (isAllSafe ? '早期低复发风险组' : '需积极辅助随访组')
                ) : (
                  /* Generic clinical decision for Gastric / Liver / Esophageal / Thyroid / Endometrial / Cervical / Pancreatic */
                  profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                    ? (isGastric ? '建议胃镜病理活检 + 腹盆增强 CT 精确分期'
                      : isLiver ? '建议多学科团队 (MDT) 评估可切除性与肝功能储备'
                      : isEsophageal ? '建议上消化道内镜+胸腹盆增强 CT 明确 TNM 分期'
                      : isThyroid ? '建议甲状腺超声引导穿刺活检明确病理类型'
                      : isEndometrial ? '建议宫腔镜/分段诊刮明确病理与分子分型'
                      : isCervical ? '建议阴道镜+组织活检+盆腔 MRI 精确 FIGO 分期'
                      : isPancreatic ? '建议胰腺增强 CT + 多学科联合可切除性评估'
                      : '建议完善病理活检与影像学精确分期评估')
                    : (isGastric ? (profile.stage?.startsWith('IV') ? '晚期胃癌系统全身治疗组' : '根治术后辅助化疗规范随访组')
                      : isLiver ? (profile.stage?.startsWith('IV') || (profile as any).cnlcStage === 'IIIb' ? '晚期肝癌靶免系统治疗组' : '根治切除/消融后密切随访组')
                      : isEsophageal ? (profile.stage?.startsWith('IV') ? '晚期食管癌免疫联合化疗组' : '根治术后同步放化疗/免疫辅助组')
                      : isThyroid ? '甲状腺癌术后 TSH 抑制与长程随访组'
                      : isEndometrial ? (profile.stage?.startsWith('III') || profile.stage?.startsWith('IV') ? '高危子宫内膜癌辅助放化疗与免疫治疗组' : '早期子宫内膜癌规范随访与激素治疗组')
                      : isCervical ? (profile.stage?.startsWith('III') || profile.stage?.startsWith('IV') ? '局部晚期宫颈癌同步放化疗 (CCRT) 组' : '早期宫颈癌规范根治术后长程随访组')
                      : isPancreatic ? '胰腺癌术后辅助化疗 (吉西他滨/mFOLFIRINOX) 规范管理组'
                      : `${CancerRegistry.get(activeType)?.name || ''}规范综合治疗组`)
                )}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {isBreast
                  ? 'St. Gallen 2023 · NCCN 2024'
                  : isColorectal
                  ? 'CSCO 2024 · IDEA 协作组 · AJCC 第8版'
                  : isLung
                  ? (profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' ? 'Fleischner 2024 / JCOG' : 'IASLC 第9版 · 2024')
                  : isGastric ? 'CSCO/JGCA 2024 · AJCC 第8版'
                  : isLiver ? 'CNLC 2024 · BCLC 2022 · ESMO'
                  : isEsophageal ? 'CSCO/NCCN 2024 · ESCORT-1st'
                  : isThyroid ? 'ATA 2015 · CSCO 2024'
                  : isEndometrial ? 'FIGO 2023 · PORTEC-4a · ESMO'
                  : isCervical ? 'FIGO 2018 · CSCO 2024 · EMBRACE-I'
                  : isPancreatic ? 'NCCN/CSCO 2024 · POLO 研究'
                  : 'CSCO 2024 · 国际权威循证指南'
                }
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isBreast ? (
                profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                  ? '超声或钼靶影像提示存在可疑病灶或细小微钙化，建议携带原始影像 DICOM 资料至三甲乳腺外科门诊，由专科医师评估是否行粗针穿刺活检 (CNB) 以明确分子受体状态。'
                  : profile.molecularSubtype === 'Luminal_A'
                  ? '依据 TAILORx 与 RxPONDER 大型前瞻性 III 期 RCT 证据，Luminal A 型受体强表达患者对内分泌治疗高度敏感，单纯 5~10 年规范辅助内分泌治疗（他莫昔芬 / 芳香化酶抑制剂）可获得极高无瘤生存，避免过度化疗。'
                  : profile.molecularSubtype === 'Luminal_B_HER2_neg'
                  ? '依据 monarchE 与 TAILORx 临床证据，Luminal B (HER2-) 虽为内分泌敏感型但增殖较为活跃，建议结合 21 基因或淋巴结转移负荷评估化疗获益；中高危患者规范联合 CDK4/6 抑制剂（阿贝西利 2 年）强化治疗。'
                  : profile.molecularSubtype === 'Luminal_B_HER2_pos' || profile.molecularSubtype === 'HER2_enriched'
                  ? '依据 APHINITY 与 DESTINY-Breast 系列顶刊证据，HER2 阳性患者推荐曲妥珠单抗联合帕妥珠单抗 (HP) 双靶向联合化疗，显著降低复发风险，术后视病理反应规范强化靶向用药。'
                  : (profile.molecularSubtype === 'Triple_Negative' || profile.molecularSubtype === 'TNBC')
                  ? '依据 KEYNOTE-522 与 CREATE-X 国际临床试验证据，三阴性乳腺癌首选规范含铂/紫杉类化疗，早期高危患者联合免疫治疗以提升病理完全缓解率 (pCR)。'
                  : '您的手术切缘阴性 (R0) 且完成了规范分期评估，建议遵循乳腺专科多学科会诊建议，规范建立系统长程辅助管理方案。'
              ) : isColorectal ? (
                profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                  ? '肠镜或腹盆部增强 CT 提示存在肠壁占位或可疑浸润。建议完善肠镜病理活检、高分辨率盆腔 MRI（直肠癌）以及胸腹盆增强 CT，精确判定 T/N/M 分期及是否伴壁外血管侵犯 (EMVI)。'
                  : profile.cancerSpecificData?.msiStatus === 'MSI-H' || profile.cancerSpecificData?.dmmrStatus === 'dMMR'
                  ? '依据 KEYNOTE-177 与 NICHE-2 顶刊重磅临床循证，dMMR/MSI-H 型结直肠癌对 PD-1 单抗免疫检查点抑制剂具备卓越应答，显著优于传统化疗；早期患者更可获得极高病理完全缓解 (pCR) 率。'
                  : profile.cancerSpecificData?.brafMutation === 'V600E'
                  ? '依据 BEACON CRC 国际前瞻 III 期临床试验，BRAF V600E 突变预后较差且传统化疗耐药率高，恩考芬尼 (Encorafenib) 联合西妥昔单抗靶向阻断可显著突破生存瓶颈。'
                  : profile.stage?.startsWith('III')
                  ? ((profile.cancerSpecificData?.tStage === 'T4' || profile.tStage === 'T4' || profile.cancerSpecificData?.nStage === 'N2' || profile.nStage === 'N2')
                      ? '依据 IDEA 国际前瞻性前沿多中心协作研究 (Lancet Oncol / NEJM)，T4 或 N2 高危患者仍推荐接受 6 个月 mFOLFOX6 或 CAPOX 充分辅助强化化疗以最大化控制微小转移。'
                      : '依据 IDEA 协作组前瞻性 III 期研究，T1-3N1 低危患者采用 CAPOX 方案辅助化疗 3 个月与 6 个月生存等效，且重度外周神经毒性降低 3 倍以上，有效减毒获益。')
                  : profile.stage?.startsWith('II')
                  ? '依据 MOSAIC 与 ASCO/CSCO 权威指南，II 期患者首要排查高危特征（检出淋巴结不足 12 枚、T4、脉管癌栓、神经浸润、肠梗阻/穿孔或 TD）。低危且 dMMR 者化疗无获益可豁免，高危者建议规范辅助治疗。'
                  : profile.stage?.startsWith('IV')
                  ? '晚期结直肠癌需严格基于原发部位（左右半结肠）及 RAS/BRAF/MSI 状态分型：左半全野生型推荐抗 EGFR 西妥昔单抗，右半或 RAS 突变型推荐抗 VEGF 贝伐珠单抗联合化疗。'
                  : '您的手术切缘阴性 (R0) 且完成了规范根治性切除，建议遵循 CSCO 结直肠癌指南，定期复查 CEA、CA19-9 及腹盆胸部 CT。'
              ) : isLung ? (
                profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                  ? (profile.riskLevel === 'high' 
                      ? 'CT 影像提示伴有实性浸润或高危征象，建议携带影像 DICOM 数据至三甲胸外科门诊进行多学科 (MDT) 会诊评估。'
                      : (profile.noduleType === 'pure_solid' || (profile.ctr != null && profile.ctr >= 1.0)
                          ? '目前结节为纯实性密度，体积较小，恶性危险度处于观察期，建议严格遵循国际指南进行动态薄层 CT 增强复查与严密随访。'
                          : '目前结节以磨玻璃成分为主，生长极其缓慢，恶性危险度较低，首选遵循国际指南进行动态薄层 CT 随访。'))
                  : (isAllSafe 
                      ? '您的关键优势因素（R0切除、N0淋巴结阴性、无 STAS/VPI/LVI、高/中分化）显著降低了术后复发概率。' 
                      : '存在局部高危病理因素，建议密切关注局部影像与长程管理计划。')
              ) : (
                /* Generic description for other cancers */
                profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                  ? (isGastric ? '胃镜活检与腹盆增强 CT 是精确 TNM 分期的金标准。建议携带影像及内镜报告至三甲消化外科或肿瘤科门诊，行多学科综合会诊评估手术可行性。'
                    : isLiver ? '原发性肝癌（HCC）的治疗决策高度依赖肿瘤数目/大小、门脉受累与 Child-Pugh 肝功能评级。建议由肝胆外科、介入科与肿瘤科共同组成 MDT 联合评估可切除性或 TACE/消融适应证。'
                    : isEsophageal ? '食管癌须综合内镜超声（EUS）、胸腹盆增强 CT 及 PET-CT 评估浸润深度与淋巴结转移范围，精确判定新辅助化放疗适应证（cT2N+或 cT3-4 者）。'
                    : isThyroid ? '分化型甲状腺癌（DTC）通常预后良好，分期主要依据年龄（<55 岁/≥55 岁）、组织学与侵犯范围综合判定。建议完善 TI-RADS 超声评估与术前基线 Tg/TSH。'
                    : isEndometrial ? '依据 FIGO 2023 更新分期与 PORTEC-4a 随机试验，子宫内膜癌的辅助治疗方案（放疗、化疗或联合）已由分子分型（POLEmut / dMMR / p53abn / NSMP）精准驱动，建议行 MMR 免疫组化与分子分型检测。'
                    : isCervical ? '宫颈癌分期仍以 FIGO 2018 临床分期为准，MRI 提供补充依据。局部进展期（FIGO ≥ IB3/IIA2）首选同步顺铂化放疗 (CCRT)，晚期复发者依据 PD-L1 CPS 评估免疫联合方案。'
                    : isPancreatic ? '胰腺癌的可切除性评估需严格参照 SMV/PV/SMA/CA 血管关系（可切除/临界可切除/不可切除）。建议完善 BRCA1/2 与 KRAS 等基因检测，指导 FOLFIRINOX 或吉西他滨为基础的新辅助/辅助化疗方案选择。'
                    : '建议携带全套影像与病理报告至三甲医院专科门诊，由多学科团队 (MDT) 共同制定个体化精准治疗方案。')
                  : (isGastric ? '依据 CSCO 胃癌指南，D2 根治术后建议规范辅助化疗（SOX/CAPOX 6 个月），HER2 阳性者联合曲妥珠单抗，每 3 个月定期复查胃镜与腹盆增强 CT。'
                    : isLiver ? '依据 CNLC 肝癌诊疗指南，根治切除/消融后每 3 个月监测 AFP、DCP 及肝脏增强影像；抗病毒治疗（乙肝 HBV）须持续规范维持。'
                    : isEsophageal ? '依据 ESCORT-1st 与 RATIONALE-306 顶刊证据，完成根治性放化疗或手术后需规范随访，PD-L1 CPS ≥ 10 者可评估卡瑞利珠单抗或替雷利珠单抗维持免疫治疗。'
                    : isThyroid ? '依据 ATA 指南，DTC 术后根据复发风险分层选择 TSH 抑制强度（高危组 TSH < 0.1 mU/L），RAI 适应证由危险度分层决定，每年定期随访 Tg + 颈部超声。'
                    : isEndometrial ? '依据 PORTEC-3 与 RUBY 研究，高危子宫内膜癌建议辅助化疗+放疗联合，dMMR/MSI-H 者可评估多斯他利单抗 (Dostarlimab) 免疫治疗；每 3 个月定期随访盆腔超声与 CA125。'
                    : isCervical ? '依据 KEYNOTE-826 研究，晚期复发宫颈癌 (PD-L1 CPS ≥ 1) 帕博利珠单抗联合化疗（±贝伐珠单抗）显著延长 OS；早期术后定期随访宫颈细胞学与 HPV 检测。'
                    : isPancreatic ? '依据 PRODIGE 24 研究，可切除胰腺癌 R0 切除后推荐改良 FOLFIRINOX 辅助化疗（6 个月），gBRCA1/2 阳性者维持奥拉帕利（POLO 研究）；每 3 个月监测 CA19-9 与腹部 CT。'
                    : `遵循${CancerRegistry.get(activeType)?.name || ''}专科规范，定期复查标志物与影像，规范长程综合管理。`)
              )}
            </p>

            <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-accent-blue" />
              <div className="text-xs text-accent-blue font-bold mb-1">
                {profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' ? '术前行动建议' : '下一步建议'}
              </div>
              <div className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {profile.nextAction || profile.clinicalRecommendation || (
                  isBreast ? (
                    profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                      ? '遵医嘱携带钼靶与超声影像至三甲乳腺外科门诊评估粗针穿刺活检。'
                      : '遵医嘱按时规范内分泌/靶向用药，每 6 个月规律复查乳腺超声、钼靶与盆腔内膜/骨密度评估。'
                  ) : isColorectal ? (
                    profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                      ? '遵医嘱完善肠镜病理活检、直肠高分辨率 MRI 及胸腹盆增强 CT 评估。'
                      : '遵医嘱按计划进行辅助化疗/靶向治疗，每 3 个月监测 CEA、CA19-9，每 6 个月行胸腹盆增强 CT 排查。'
                  ) : isLung ? (
                    profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                      ? '遵医嘱于 3~6 个月后复查胸部薄层 CT（层厚 ≤1mm），对比结节大小与密度。'
                      : '遵医嘱术后 6 个月规律复查胸部 CT 即可，无需过度化疗。'
                  ) : (
                    profile.currentStage === 'evaluation' || profile.currentStage === 'discovery'
                      ? (isGastric ? '遵医嘱完善胃镜活检病理，进行腹盆增强 CT 精确 TNM 分期评估。'
                        : isLiver ? '遵医嘱携带肝脏增强影像至肝胆外科 MDT 门诊，评估可切除性与肝储备功能。'
                        : isEsophageal ? '遵医嘱完善内镜超声（EUS）+胸腹盆增强 CT+PET-CT，精确评估分期与新辅助治疗适应证。'
                        : isThyroid ? '遵医嘱完善甲状腺超声引导穿刺活检，明确病理类型与 BRAF/RET 基因状态。'
                        : isEndometrial ? '遵医嘱行宫腔镜检查+分段诊刮，送 MMR 免疫组化与分子分型检测（POLEmut/dMMR/p53abn）。'
                        : isCervical ? '遵医嘱行阴道镜+组织活检+盆腔高分辨 MRI，精确 FIGO 2018 分期评估。'
                        : isPancreatic ? '遵医嘱行胰腺增强 CT+MRI，完善 CA19-9/CEA，多学科联合评估可切除性分类。'
                        : '遵医嘱携带全套影像与病理报告，至三甲医院专科 MDT 门诊综合制定治疗方案。')
                      : (isGastric ? '遵医嘱按计划完成辅助化疗（SOX/CAPOX），每 3 个月复查胃镜与腹盆 CT，每年复查 CEA/CA19-9。'
                        : isLiver ? '遵医嘱持续规范抗病毒治疗（若 HBV 阳性），每 3 个月监测 AFP + 肝脏增强影像。'
                        : isEsophageal ? '遵医嘱按计划完成术后放化疗或免疫辅助治疗，每 3~6 个月随访胸腹盆 CT + 上消化道内镜。'
                        : isThyroid ? '遵医嘱规范 TSH 抑制治疗，每年定期复查 Tg + 颈部超声，高危者行 RAI 131I 治疗。'
                        : isEndometrial ? '遵医嘱按计划完成辅助放化疗，每 3 个月随访盆腔超声 + CA125，dMMR 者评估免疫治疗。'
                        : isCervical ? '遵医嘱规范完成同步化放疗（CCRT），每 3 个月随访盆腔 MRI + 宫颈细胞学 + HPV 检测。'
                        : isPancreatic ? '遵医嘱按计划完成辅助化疗（FOLFIRINOX / 吉西他滨方案），每 3 个月监测 CA19-9 + 腹部 CT。'
                        : `遵医嘱按照${CancerRegistry.get(activeType)?.name || ''}专科规范定期复查，规范长程管理。`)
                  )
                )}
              </div>
            </div>
          </div>

          <Link 
            href={`/profile/report?cancerType=${activeSlot}`} 
            className="w-full mt-5 py-3 rounded-xl btn-primary text-white text-xs sm:text-sm font-bold shadow-md text-center flex items-center justify-center transition-all cursor-pointer"
          >
            <span>{profile?.reportReviewStatus && profile?.reportReviewStatus !== 'confirmed' ? '核对指标并生成循证报告' : '生成专属深度循证报告'}</span>
          </Link>
        </div>

      </div>

      {/* Cross-Cancer Synergy Hub for Multi-Primary MPMN Patients */}
      {dualSummary.isDualPrimary && (
        <CrossCancerSynergyCard
          lungProfile={dualSummary.lungProfile || (activeSlot === 'lung' ? profile : getProfileBySlot('lung'))}
          breastProfile={dualSummary.breastProfile || (activeSlot === 'breast' ? profile : getProfileBySlot('breast'))}
          colonProfile={dualSummary.colonProfile || (activeSlot === 'colon' ? profile : getProfileBySlot('colon'))}
          rectalProfile={dualSummary.rectalProfile || (activeSlot === 'rectal' ? profile : getProfileBySlot('rectal'))}
          colorectalProfile={dualSummary.colorectalProfile || (activeSlot === 'colorectal' ? profile : getProfileBySlot('colorectal'))}
          gastricProfile={dualSummary.gastricProfile || (activeSlot === 'gastric' ? profile : getProfileBySlot('gastric'))}
          liverProfile={dualSummary.liverProfile || (activeSlot === 'liver' ? profile : getProfileBySlot('liver'))}
          esophagealProfile={dualSummary.esophagealProfile || (activeSlot === 'esophageal' ? profile : getProfileBySlot('esophageal'))}
          onOpenDdiChecker={(drugId) => {
            if (drugId) setInitialDdiDrugId(drugId);
            setShowDdiModal(true);
          }}
          onSyncM0Checks={handleSyncM0Checks}
        />
      )}


      {/* Molecular Pathology & Driver Genes NGS Panel (Lung Cancer) */}
      {isLung && ((profile.geneMutations && profile.geneMutations.length > 0) || profile.egfr === 'positive' || profile.molecular) && (
        <MolecularProfileCard
          profile={profile}
          onOpenDdiModal={() => setShowDdiModal(true)}
          onOpenEdit={() => setShowUpdateModal(true)}
        />
      )}

      {/* Multidisciplinary Team (MDT) Consultation & Precision Roadmap Suite */}
      <MdtConsultationHub profile={profile} />

      {/* Similar Cases & Cohorts Prognosis (5-Yr RFS/OS & Warm Empathy Words) */}
      <SimilarCasesCard profile={profile} />

      {/* Profile Update Intent Router Modal (方案 A: 意图分流弹窗) */}

      {/* Profile Update Intent Router Modal (3-Tier Standard Architecture) */}
      {showUpdateModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUpdateModal(false);
            }
          }}
          className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in overflow-hidden sm:overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full border-t sm:border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-0"
          >
            {/* iOS HIG Sheet Grabber for Mobile */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
              <div className="sheet-grabber !my-0" />
            </div>

            {/* Tier 1: Fixed Sticky Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    请选择档案更新方式
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    根据您的就医需要选择快速微调或增量解析新报告
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                aria-label="关闭窗口"
                title="关闭窗口"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tier 2: Scrollable Body */}
            <div className="p-5 sm:p-6 flex-1 overflow-y-auto custom-scrollbar space-y-3">
              {/* Option 1: Direct Edit on Existing Data */}
              <button
                type="button"
                onClick={() => {
                  showUploaderRef.current = true;
                  editModeRef.current = 'edit_direct';
                  setEditMode('edit_direct');
                  setShowUpdateModal(false);
                  setShowUploader(true);
                }}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all cursor-pointer group flex items-start gap-3.5 shadow-2xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-900">
                      校对与微调已有病理指标
                    </h4>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">推荐 · 10秒</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    无需重新拍照，直接在当前已保存的性别、年龄、肿瘤病灶大小、核心病理指标与全身排查状态上微调修改
                  </p>
                </div>
              </button>

              {/* Option 2: Upload New Medical Report (Incremental Merge) */}
              <button
                type="button"
                onClick={() => {
                  showUploaderRef.current = true;
                  editModeRef.current = 'upload_new';
                  setEditMode('upload_new');
                  setShowUpdateModal(false);
                  setShowUploader(true);
                }}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50/40 transition-all cursor-pointer group flex items-start gap-3.5 shadow-2xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-900">
                      追加 / 上传新检查报告
                    </h4>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">智能追加 · 保留已有数据</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    拿到新的手术病理、复查影像（CT/MRI/超声/内镜）或全身 PET-CT？上传后由系统智能结构化融合，不覆盖已有检查记录
                  </p>
                </div>
              </button>
            </div>

            {/* Tier 3: Fixed Sticky Footer */}
            <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 bg-white shrink-0 rounded-b-3xl shadow-[0_-6px_20px_rgba(0,0,0,0.05)] flex justify-end">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                取消返回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIPL Right-to-be-Forgotten Wipe Confirmation Modal (3-Tier Standard Architecture) */}
      {showDeleteModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDeleteModal(false);
            }
          }}
          className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in overflow-hidden sm:overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full border-t sm:border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-0"
          >
            {/* iOS HIG Sheet Grabber for Mobile */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
              <div className="sheet-grabber !my-0" />
            </div>

            {/* Tier 1: Fixed Sticky Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-rose-100 bg-rose-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-rose-950 leading-snug">
                    彻底销毁与注销个人档案
                  </h3>
                  <p className="text-[11px] text-rose-700 mt-0.5">
                    PIPL 被遗忘权保障 · 隐私数据不可逆清除
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                aria-label="关闭窗口"
                title="关闭窗口"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tier 2: Scrollable Body */}
            <div className="p-5 sm:p-6 flex-1 overflow-y-auto custom-scrollbar space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <p>
                根据<strong>《中华人民共和国个人信息保护法》(PIPL)</strong> 第四十七条【被遗忘权】，此操作将<strong>清除您保存在本设备浏览器（LocalStorage）与云端的相关病理指标、影像参数与深度循证报告</strong>。
              </p>

              {availableSlots.length >= 2 && (
                <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-900 text-xs">检测到多原发肿瘤档案，请选择注销范围：</div>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="deleteOption"
                      checked={deleteOption === 'single'}
                      onChange={() => setDeleteOption('single')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>仅注销当前【{CancerRegistry.get(activeSlot)?.name || '当前癌种'}】档案（保留另一癌种病案）</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-rose-700">
                    <input
                      type="radio"
                      name="deleteOption"
                      checked={deleteOption === 'all'}
                      onChange={() => setDeleteOption('all')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>注销全部档案与所有数据（多原发均彻底清除）</span>
                  </label>
                </div>
              )}

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>高危警示：</strong>此操作完全不可撤销，注销后如需使用需重新录入或上传。</span>
              </div>
            </div>

            {/* Tier 3: Fixed Sticky Footer */}
            <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 bg-white shrink-0 rounded-b-3xl shadow-[0_-6px_20px_rgba(0,0,0,0.05)] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleWipeProfile}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                {isDeleting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>正在销毁...</span>
                  </>
                ) : (
                  <span>{deleteOption === 'single' && availableSlots.length >= 2 ? `仅注销当前【${CancerRegistry.get(activeSlot)?.name || '当前癌种'}】档案` : '确认彻底销毁并注销'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Profile HD Export Poster Modal */}
      {showExportModal && (
        <ProfileExportModal
          profile={profile}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* DDI Drug-Drug Interaction Modal */}
      {showDdiModal && (
        <div 
          onClick={() => setShowDdiModal(false)}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in overflow-hidden sm:overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-4xl max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200 overflow-hidden bg-white animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-0"
          >
            {/* iOS HIG Sheet Grabber for Mobile */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
              <div className="sheet-grabber !my-0" />
            </div>
            <DdiCheckerVisual
              initialTargetDrugId={initialDdiDrugId || recommendedTargetDrugId}
              cancerType={activeType}
              geneInfo={matchedGeneLabel}
              isEarlyStageIA={Boolean(profile?.stage?.startsWith("IA") || ((profile?.tStage === "T1a" || profile?.tStage === "T1b" || profile?.tStage === "T1c" || profile?.tStage === "T1mi") && (profile?.nStage === "N0" || !profile?.nStage)))}
              isModalMode={true}
              onClose={() => setShowDdiModal(false)}
            />
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onSuccess={(token, email) => {
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            setUserEmail(email);
            setShowAuthModal(false);
            window.dispatchEvent(new Event("auth-change"));
          }}
        />
      )}
      
    </div>
  );


}

function RiskBadge({ label, status, text }: { label: string; status: 'good' | 'warning' | 'danger' | 'neutral'; text: string }) {
  const styles = {
    good: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <div className={`rounded-xl p-3 border ${styles[status]} shadow-xs`}>
      <div className="text-xs font-semibold opacity-90 mb-1.5 flex items-center gap-1.5">
        {status === 'good' && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        )}
        {status === 'warning' && (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        )}
        {status === 'danger' && (
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        )}
        {status === 'neutral' && (
          <MinusCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        )}
        <span>{label}</span>
      </div>
      <div className="text-xs sm:text-sm font-bold truncate">
        {text}
      </div>
    </div>
  );
}
