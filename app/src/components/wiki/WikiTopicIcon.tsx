"use client";

import React from "react";
import {
  CircleDot,
  Spline,
  Triangle,
  GitCommitHorizontal,
  Layers,
  Wind,
  Grid,
  Scissors,
  UtensilsCrossed,
  Microscope,
  Dna,
  HeartPulse,
  Calendar,
  Compass,
  TrendingUp,
  ShieldCheck,
  Network,
  Crosshair,
  Zap,
  Activity,
  Tag,
  Scan,
  TestTube2,
  FileBadge2,
  Brain,
  Target,
  Award,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  LungIcon,
  BreastRibbonIcon,
  ColonIcon,
  RectalIcon,
  GastricIcon,
  LiverIcon,
  EsophagealIcon,
  ThyroidIcon,
  EndometrialIcon,
  CervicalIcon,
} from "@/components/common/CancerIcons";

interface WikiTopicIconProps {
  icon?: string;
  topicId?: string;
  className?: string;
  size?: number;
}

export function getWikiIconComponent(icon?: string, topicId?: string) {
  if (topicId) {
    switch (topicId) {
      // 肺癌词条
      case "spiculation":
      case "spiculation-sign":
        return { component: Crosshair, color: "text-amber-500" };
      case "vacuole":
      case "vacuole-sign":
        return { component: CircleDot, color: "text-teal-500" };
      case "lobulation":
      case "lobulation-sign":
        return { component: Spline, color: "text-sky-500" };
      case "pleural-indentation":
        return { component: Triangle, color: "text-rose-500" };
      case "lvi":
      case "lvi-vessel":
        return { component: GitCommitHorizontal, color: "text-rose-500" };
      case "vpi":
      case "pleural-layers":
        return { component: Layers, color: "text-amber-500" };
      case "stas":
      case "stas-airway":
        return { component: Wind, color: "text-indigo-500" };
      case "lepidic-growth":
        return { component: Grid, color: "text-emerald-500" };
      case "surgical-approaches":
        return { component: Scissors, color: "text-blue-500" };
      case "nutrition-recovery":
        return { component: UtensilsCrossed, color: "text-emerald-500" };
      case "adjuvant-decision-tree":
        return { component: Network, color: "text-purple-500" };
      case "mplc-ggo":
        return { component: Crosshair, color: "text-emerald-500" };
      case "pdl1-immune":
        return { component: Zap, color: "text-amber-500" };
      case "fleischner-guidelines":
        return { component: Compass, color: "text-blue-500" };
      case "lung-rads":
        return { component: Tag, color: "text-sky-500" };
      case "vdt-growth":
        return { component: TrendingUp, color: "text-amber-500" };
      case "followup-timeline":
        return { component: Calendar, color: "text-slate-600" };
      case "egfr-mutations":
      case "alk-fusion":
        return { component: Dna, color: "text-purple-500" };
      case "ihc-ki67":
        return { component: FileBadge2, color: "text-purple-500" };
      case "tumor-markers":
        return { component: TestTube2, color: "text-rose-500" };

      // 乳腺癌专区词条
      case "bi_rads_scale":
        return { component: Scan, color: "text-sky-500" };
      case "microcalcifications":
        return { component: Layers, color: "text-amber-500" };
      case "breast_density":
        return { component: ShieldCheck, color: "text-teal-500" };
      case "dcis_in_situ":
        return { component: ShieldCheck, color: "text-emerald-500" };
      case "invasive_ductal_carcinoma":
        return { component: Microscope, color: "text-rose-500" };
      case "nottingham_grade":
        return { component: Activity, color: "text-purple-500" };
      case "margins_no_ink":
        return { component: ShieldCheck, color: "text-emerald-500" };
      case "slnb_sentinel_nodes":
        return { component: Layers, color: "text-indigo-500" };
      case "neoadjuvant_pcr":
        return { component: Award, color: "text-sky-500" };
      case "ki67_proliferation_index":
        return { component: Activity, color: "text-rose-500" };
      case "luminal_a_and_b":
        return { component: Dna, color: "text-emerald-500" };
      case "her2_positive_and_adc":
        return { component: Target, color: "text-purple-500" };
      case "triple_negative_tnbc":
        return { component: AlertTriangle, color: "text-rose-500" };
      case "oncotype_dx_21_gene":
        return { component: Dna, color: "text-blue-500" };
      case "brca_gene_testing":
        return { component: Dna, color: "text-purple-500" };
      case "lymphedema_prevention":
        return { component: ShieldCheck, color: "text-sky-500" };
      case "shoulder_rehabilitation":
        return { component: Activity, color: "text-emerald-500" };
      case "endocrine_bone_and_hot_flashes":
        return { component: ShieldCheck, color: "text-amber-500" };
      case "ovarian_suppression_ofs":
        return { component: ShieldCheck, color: "text-teal-500" };
      case "breast_reconstruction":
        return { component: HeartPulse, color: "text-pink-500" };
      case "her2_cardiac_safety":
        return { component: Activity, color: "text-rose-500" };
      case "breast_tumor_markers":
        return { component: AlertTriangle, color: "text-amber-500" };

      // 胃癌专区词条
      case "gastric_screening_esd":
        return { component: GastricIcon, color: "text-amber-600" };
      case "gastric_lauren_signet_ring":
        return { component: GastricIcon, color: "text-rose-600" };
      case "gastric_d2_surgery_lymphnodes":
        return { component: Scissors, color: "text-blue-500" };
      case "gastric_claudin_her2_biomarkers":
        return { component: Dna, color: "text-purple-600" };
      case "gastric_flot_sox_perioperative":
        return { component: Network, color: "text-indigo-600" };
      case "gastric_dumping_syndrome_reconstruction":
        return { component: GastricIcon, color: "text-amber-600" };
      case "gastric_peritoneal_hipec_management":
        return { component: AlertTriangle, color: "text-rose-600" };

      // 原发性肝癌专区词条
      case "liver_cnlc_staging_system":
        return { component: LiverIcon, color: "text-emerald-700" };
      case "liver_child_pugh_albi_reserve":
        return { component: ShieldCheck, color: "text-teal-600" };
      case "liver_tace_haic_intervention":
        return { component: Crosshair, color: "text-blue-600" };
      case "liver_targeted_immuno_therapy":
        return { component: Zap, color: "text-purple-600" };
      case "liver_hbv_antiviral_prevention":
        return { component: ShieldCheck, color: "text-emerald-600" };
      case "liver_afp_pivka_ii_biomarkers":
        return { component: TestTube2, color: "text-rose-500" };
      case "liver_ablation_transplant_early":
        return { component: LiverIcon, color: "text-teal-600" };

      // 结直肠癌专区词条
      case "colon_screening_polyps":
      case "colonoscopy_polyps":
        return { component: ColonIcon, color: "text-emerald-600" };
      case "colon_sidedness_biology":
      case "left_vs_right_colon":
        return { component: ColonIcon, color: "text-blue-600" };
      case "colon_cme_surgery_lymphnodes":
      case "lymph_node_12_and_td":
        return { component: Scissors, color: "text-blue-500" };
      case "colon_dmmr_msih":
      case "msi_dmmr_immunotherapy":
        return { component: Dna, color: "text-purple-600" };
      case "colon_idea_3months_capox":
      case "idea_chemo_duration":
        return { component: Network, color: "text-indigo-600" };
      case "colon_liver_metastasis_mdt":
        return { component: LiverIcon, color: "text-rose-600" };
      case "rectal_anatomy_ruler":
        return { component: RectalIcon, color: "text-rose-600" };
      case "rectal_pelvic_hr_mri":
        return { component: Scan, color: "text-indigo-600" };
      case "rectal_tnt_rapido_prodige23":
        return { component: Network, color: "text-purple-600" };
      case "rectal_watch_and_wait":
        return { component: Compass, color: "text-teal-600" };
      case "rectal_tme_sacred_plane":
      case "rectal_stoma_nerves":
        return { component: RectalIcon, color: "text-blue-600" };

      // 食管癌专区词条
      case "esophageal_screening_early":
        return { component: EsophagealIcon, color: "text-orange-600" };

      // 甲状腺癌专区词条
      case "thyroid_tirads_ultrasound":
        return { component: ThyroidIcon, color: "text-cyan-600" };
      case "thyroid_ptmc_active_surveillance":
        return { component: ThyroidIcon, color: "text-teal-600" };

      // 妇科肿瘤专区词条
      case "endometrial_screening_ultrasound":
        return { component: EndometrialIcon, color: "text-rose-600" };
      case "cervical_hpv_tct_screening":
        return { component: CervicalIcon, color: "text-purple-600" };
    }
  }

  // 规范化 icon 字符串（小写、移除标点）
  const normalized = (icon || "").toLowerCase().replace(/[-_\s]/g, "");

  // Map by semantic identifier string or fallback emoji
  switch (normalized) {
    case "sparkles":
    case "spiculation":
    case "🦔": 
      return { component: Crosshair, color: "text-amber-500" };
    case "circle-dot":
    case "vacuole":
    case "🧀":
    case "🌰": 
      return { component: CircleDot, color: "text-teal-500" };
    case "spline":
    case "lobulation":
    case "🌊": 
      return { component: Spline, color: "text-sky-500" };
    case "triangle":
    case "pleural-indentation":
    case "⛺": 
      return { component: Triangle, color: "text-rose-500" };
    case "vessel":
    case "git-commit":
    case "lvi":
    case "🚗": 
      return { component: GitCommitHorizontal, color: "text-rose-500" };
    case "layers":
    case "vpi":
    case "pleura":
    case "🚪": 
      return { component: Layers, color: "text-amber-500" };
    case "wind":
    case "stas":
    case "🌬️":
    case "🌬": 
      return { component: Wind, color: "text-indigo-500" };
    case "grid":
    case "lepidic":
    case "🧱": 
      return { component: Grid, color: "text-emerald-500" };
    case "scissors":
    case "surgery":
    case "🔪": 
      return { component: Scissors, color: "text-blue-500" };
    case "utensils":
    case "nutrition":
    case "🥗": 
      return { component: UtensilsCrossed, color: "text-emerald-500" };
    case "diamond":
    case "calcification":
    case "💎": 
      return { component: Layers, color: "text-purple-500" };
    case "lung":
    case "lungs":
    case "🫁": 
      return { component: LungIcon, color: "text-teal-600" };
    case "breast":
    case "ribbon":
    case "pinkribbon":
    case "🎀":
      return { component: BreastRibbonIcon, color: "text-pink-600" };
    case "colon":
    case "colorectal":
    case "bowel":
    case "gut":
      return { component: ColonIcon, color: "text-emerald-600" };
    case "rectal":
    case "rectum":
    case "intestine":
      return { component: RectalIcon, color: "text-rose-600" };
    case "gastric":
    case "stomach":
      return { component: GastricIcon, color: "text-amber-600" };
    case "liver":
    case "hepatic":
    case "hepatitis":
      return { component: LiverIcon, color: "text-emerald-700" };
    case "esophageal":
    case "esophagus":
      return { component: EsophagealIcon, color: "text-orange-600" };
    case "thyroid":
      return { component: ThyroidIcon, color: "text-cyan-600" };
    case "endometrial":
    case "uterus":
      return { component: EndometrialIcon, color: "text-rose-600" };
    case "cervical":
    case "cervix":
      return { component: CervicalIcon, color: "text-purple-600" };
    case "nodule":
      return { component: CircleDot, color: "text-teal-600" };
    case "microscope":
    case "pathology":
    case "🔬": 
      return { component: Microscope, color: "text-sky-600" };
    case "dna":
    case "genetics":
    case "🧬": 
      return { component: Dna, color: "text-purple-600" };
    case "recovery":
    case "heart-pulse":
    case "🌿": 
      return { component: HeartPulse, color: "text-emerald-600" };
    case "compass":
    case "guidelines":
    case "🧭": 
      return { component: Compass, color: "text-blue-600" };
    case "tag":
    case "lung-rads":
    case "🏷️":
    case "🏷": 
      return { component: Tag, color: "text-sky-600" };
    case "trending-up":
    case "vdt":
    case "📈": 
      return { component: TrendingUp, color: "text-amber-600" };
    case "calendar":
    case "followup":
    case "📅": 
      return { component: Calendar, color: "text-slate-600" };
    case "crosshair":
    case "mplc":
    case "🎯": 
      return { component: Crosshair, color: "text-rose-600" };
    case "zap":
    case "immune":
    case "⚡": 
      return { component: Zap, color: "text-amber-500" };
    case "alert":
    case "alerttriangle":
    case "warning":
    case "⚠️":
      return { component: AlertTriangle, color: "text-rose-500" };
    case "shield":
    case "shieldcheck":
    case "🛡️":
    case "🛡": 
      return { component: ShieldCheck, color: "text-emerald-600" };
    case "network":
    case "decision-tree":
    case "🗺️":
    case "🗺": 
      return { component: Network, color: "text-purple-600" };
    case "brain":
    case "braincircuit":
    case "ai":
    case "🤖": 
      return { component: Brain, color: "text-sky-600" };
    case "globe":
    case "staging":
    case "🌐": 
      return { component: ShieldCheck, color: "text-slate-500" };
    case "activity":
    case "serology":
    case "🟡": 
      return { component: Activity, color: "text-amber-500" };
    case "sprout":
    case "seed":
    case "🌱": 
      return { component: HeartPulse, color: "text-emerald-600" };
    case "scan":
    case "ct":
      return { component: Scan, color: "text-indigo-600" };
    default: 
      return { component: Info, color: "text-slate-500" };
  }
}

export default function WikiTopicIcon({
  icon,
  topicId,
  className = "",
  size = 24,
}: WikiTopicIconProps) {
  const { component: IconComp, color } = getWikiIconComponent(icon, topicId);
  return <IconComp size={size} className={`${color} shrink-0 ${className}`} />;
}
