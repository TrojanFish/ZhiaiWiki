"use client";

import dynamic from "next/dynamic";
import React from "react";

// ── 36 个视觉模拟器全部改为 next/dynamic 按需分包 ─────────────────────────────
// Turbopack 要求 options 必须是内联字面量，不能引用外部变量
// 仅在抽屉打开并请求对应词条时，才会下载该词条专属的 1 个 JS chunk

const GgoEvolutionSimulator     = dynamic(() => import("./visuals/GgoEvolutionSimulator").then(m => ({ default: m.GgoEvolutionSimulator })),     { ssr: false, loading: () => null });
const FleischnerDecisionTree    = dynamic(() => import("./visuals/FleischnerDecisionTree").then(m => ({ default: m.FleischnerDecisionTree })),    { ssr: false, loading: () => null });
const StasAirwayVisual          = dynamic(() => import("./visuals/StasAirwayVisual").then(m => ({ default: m.StasAirwayVisual })),                { ssr: false, loading: () => null });
const VpiPleuraVisual           = dynamic(() => import("./visuals/VpiPleuraVisual").then(m => ({ default: m.VpiPleuraVisual })),                  { ssr: false, loading: () => null });
const LviVesselVisual           = dynamic(() => import("./visuals/LviVesselVisual").then(m => ({ default: m.LviVesselVisual })),                  { ssr: false, loading: () => null });
const IaslcSubtypeVisual        = dynamic(() => import("./visuals/IaslcSubtypeVisual").then(m => ({ default: m.IaslcSubtypeVisual })),            { ssr: false, loading: () => null });
const LobulationVisual          = dynamic(() => import("./visuals/LobulationVisual").then(m => ({ default: m.LobulationVisual })),                { ssr: false, loading: () => null });
const SpiculationVisual         = dynamic(() => import("./visuals/SpiculationVisual").then(m => ({ default: m.SpiculationVisual })),              { ssr: false, loading: () => null });
const PleuralIndentationVisual  = dynamic(() => import("./visuals/PleuralIndentationVisual").then(m => ({ default: m.PleuralIndentationVisual })), { ssr: false, loading: () => null });
const VacuoleSignVisual         = dynamic(() => import("./visuals/VacuoleSignVisual").then(m => ({ default: m.VacuoleSignVisual })),              { ssr: false, loading: () => null });
const VascularConvergenceVisual = dynamic(() => import("./visuals/VascularConvergenceVisual").then(m => ({ default: m.VascularConvergenceVisual })), { ssr: false, loading: () => null });
const IplnLymphVisual           = dynamic(() => import("./visuals/IplnLymphVisual").then(m => ({ default: m.IplnLymphVisual })),                  { ssr: false, loading: () => null });
const IhcKi67Visual             = dynamic(() => import("./visuals/IhcKi67Visual").then(m => ({ default: m.IhcKi67Visual })),                      { ssr: false, loading: () => null });
const CalcificationVisual       = dynamic(() => import("./visuals/CalcificationVisual").then(m => ({ default: m.CalcificationVisual })),          { ssr: false, loading: () => null });
const AdjuvantDecisionTreeVisual= dynamic(() => import("./visuals/AdjuvantDecisionTreeVisual").then(m => ({ default: m.AdjuvantDecisionTreeVisual })), { ssr: false, loading: () => null });
const MediastinalLNMapVisual    = dynamic(() => import("./visuals/MediastinalLNMapVisual").then(m => ({ default: m.MediastinalLNMapVisual })),    { ssr: false, loading: () => null });
const EgfrMutationMapVisual     = dynamic(() => import("./visuals/EgfrMutationMapVisual").then(m => ({ default: m.EgfrMutationMapVisual })),      { ssr: false, loading: () => null });
const PleuralLayersVisual       = dynamic(() => import("./visuals/PleuralLayersVisual").then(m => ({ default: m.PleuralLayersVisual })),          { ssr: false, loading: () => null });
const LungRadsScaleVisual       = dynamic(() => import("./visuals/LungRadsScaleVisual").then(m => ({ default: m.LungRadsScaleVisual })),          { ssr: false, loading: () => null });
const PdL1ImmuneMechanismVisual = dynamic(() => import("./visuals/PdL1ImmuneMechanismVisual").then(m => ({ default: m.PdL1ImmuneMechanismVisual })), { ssr: false, loading: () => null });
const SurgicalApproachesVisual  = dynamic(() => import("./visuals/SurgicalApproachesVisual").then(m => ({ default: m.SurgicalApproachesVisual })), { ssr: false, loading: () => null });
const FollowupTimelineVisual    = dynamic(() => import("./visuals/FollowupTimelineVisual").then(m => ({ default: m.FollowupTimelineVisual })),    { ssr: false, loading: () => null });
const MPLCGGOVisual             = dynamic(() => import("./visuals/MPLCGGOVisual").then(m => ({ default: m.MPLCGGOVisual })),                      { ssr: false, loading: () => null });
const MrdCtdnaVisual            = dynamic(() => import("./visuals/MrdCtdnaVisual").then(m => ({ default: m.MrdCtdnaVisual })),                    { ssr: false, loading: () => null });
const Her2AdcVisual             = dynamic(() => import("./visuals/Her2AdcVisual").then(m => ({ default: m.Her2AdcVisual })),                      { ssr: false, loading: () => null });
const EgfrResistanceVisual      = dynamic(() => import("./visuals/EgfrResistanceVisual").then(m => ({ default: m.EgfrResistanceVisual })),        { ssr: false, loading: () => null });
const AblationSbrtVisual        = dynamic(() => import("./visuals/AblationSbrtVisual").then(m => ({ default: m.AblationSbrtVisual })),            { ssr: false, loading: () => null });
const TargetedSideEffectsVisual = dynamic(() => import("./visuals/TargetedSideEffectsVisual").then(m => ({ default: m.TargetedSideEffectsVisual })), { ssr: false, loading: () => null });
const IldWarningVisual          = dynamic(() => import("./visuals/IldWarningVisual").then(m => ({ default: m.IldWarningVisual })),                { ssr: false, loading: () => null });
const IraeImmuneVisual          = dynamic(() => import("./visuals/IraeImmuneVisual").then(m => ({ default: m.IraeImmuneVisual })),                { ssr: false, loading: () => null });
const BoneMarrowGcsfVisual      = dynamic(() => import("./visuals/BoneMarrowGcsfVisual").then(m => ({ default: m.BoneMarrowGcsfVisual })),        { ssr: false, loading: () => null });
const BiopsySafetyVisual        = dynamic(() => import("./visuals/BiopsySafetyVisual").then(m => ({ default: m.BiopsySafetyVisual })),            { ssr: false, loading: () => null });
const EbusTbnaVisual            = dynamic(() => import("./visuals/EbusTbnaVisual").then(m => ({ default: m.EbusTbnaVisual })),                    { ssr: false, loading: () => null });
const TcmBoundaryVisual         = dynamic(() => import("./visuals/TcmBoundaryVisual").then(m => ({ default: m.TcmBoundaryVisual })),              { ssr: false, loading: () => null });
const DdiCheckerVisual          = dynamic(() => import("./visuals/DdiCheckerVisual").then(m => ({ default: m.DdiCheckerVisual })),                { ssr: false, loading: () => null });
const CtWindowingVisual         = dynamic(() => import("./visuals/CtWindowingVisual").then(m => ({ default: m.CtWindowingVisual })),              { ssr: false, loading: () => null });

// ── 乳腺癌专区专属交互式视觉模拟器 (5个) ─────────────────────────────
const BiRadsScaleVisual           = dynamic(() => import("./visuals/BiRadsScaleVisual").then(m => ({ default: m.BiRadsScaleVisual })),                       { ssr: false, loading: () => null });
const MicrocalcificationVisual    = dynamic(() => import("./visuals/MicrocalcificationVisual").then(m => ({ default: m.MicrocalcificationVisual })),         { ssr: false, loading: () => null });
const ReceptorSubtypeVisual       = dynamic(() => import("./visuals/ReceptorSubtypeVisual").then(m => ({ default: m.ReceptorSubtypeVisual })),               { ssr: false, loading: () => null });
const LymphedemaArmVisual         = dynamic(() => import("./visuals/LymphedemaArmVisual").then(m => ({ default: m.LymphedemaArmVisual })),                   { ssr: false, loading: () => null });
const DcisBasementMembraneVisual  = dynamic(() => import("./visuals/DcisBasementMembraneVisual").then(m => ({ default: m.DcisBasementMembraneVisual })),   { ssr: false, loading: () => null });

// ── 结直肠癌 (特别是直肠癌) 专区专属交互式视觉模拟器 (4个) ─────────────
const RectalAnatomyRulerVisual    = dynamic(() => import("./visuals/RectalAnatomyRulerVisual").then(m => ({ default: m.RectalAnatomyRulerVisual })),         { ssr: false, loading: () => null });
const RectalCrmMriVisual          = dynamic(() => import("./visuals/RectalCrmMriVisual").then(m => ({ default: m.RectalCrmMriVisual })),                     { ssr: false, loading: () => null });
const RectalTntWatchWaitVisual    = dynamic(() => import("./visuals/RectalTntWatchWaitVisual").then(m => ({ default: m.RectalTntWatchWaitVisual })),         { ssr: false, loading: () => null });
const StomaCareLarsVisual         = dynamic(() => import("./visuals/StomaCareLarsVisual").then(m => ({ default: m.StomaCareLarsVisual })),                   { ssr: false, loading: () => null });

// ── 胃癌专区专属交互式视觉模拟器 (2个) ─────────────────────────────────
const GastricAnatomyD2Visual        = dynamic(() => import("./visuals/GastricAnatomyD2Visual").then(m => ({ default: m.GastricAnatomyD2Visual })),               { ssr: false, loading: () => null });
const GastricDumpingNutritionVisual = dynamic(() => import("./visuals/GastricDumpingNutritionVisual").then(m => ({ default: m.GastricDumpingNutritionVisual })), { ssr: false, loading: () => null });

// ── 原发性肝癌专区专属交互式视觉模拟器 (2个) ──────────────────────────────
const LiverCnlcStagingVisual        = dynamic(() => import("./visuals/LiverCnlcStagingVisual").then(m => ({ default: m.LiverCnlcStagingVisual })),               { ssr: false, loading: () => null });
const HccInterventionSystemicVisual = dynamic(() => import("./visuals/HccInterventionSystemicVisual").then(m => ({ default: m.HccInterventionSystemicVisual })), { ssr: false, loading: () => null });

// ── 食管癌专区专属交互式视觉模拟器 (2个) ──────────────────────────────
const EsophagealAnatomyStagingVisual = dynamic(() => import("./visuals/EsophagealAnatomyStagingVisual").then(m => ({ default: m.EsophagealAnatomyStagingVisual })), { ssr: false, loading: () => null });
const EsophagealMultiModalVisual     = dynamic(() => import("./visuals/EsophagealMultiModalVisual").then(m => ({ default: m.EsophagealMultiModalVisual })),         { ssr: false, loading: () => null });

// ── 甲状腺癌专区专属交互式视觉模拟器 (2个) ─────────────────────────────
const ThyroidTiradsUltrasoundVisual  = dynamic(() => import("./visuals/ThyroidTiradsUltrasoundVisual").then(m => ({ default: m.ThyroidTiradsUltrasoundVisual })),   { ssr: false, loading: () => null });
const ThyroidLt4TimingIsolationVisual = dynamic(() => import("./visuals/ThyroidLt4TimingIsolationVisual").then(m => ({ default: m.ThyroidLt4TimingIsolationVisual })), { ssr: false, loading: () => null });

// ── 子宫内膜癌与宫颈癌专区专属交互式视觉模拟器 (2个) ─────────────────────────
const EndometrialMoleculeDecisionVisual = dynamic(() => import("./visuals/EndometrialMoleculeDecisionVisual").then(m => ({ default: m.EndometrialMoleculeDecisionVisual })), { ssr: false, loading: () => null });
const CervicalCinProgressionVisual       = dynamic(() => import("./visuals/CervicalCinProgressionVisual").then(m => ({ default: m.CervicalCinProgressionVisual })),             { ssr: false, loading: () => null });

// ── 胰腺癌专区专属交互式视觉模拟器 (1个) ─────────────────────────────────
const PancreaticResectabilityVisual      = dynamic(() => import("./visuals/PancreaticResectabilityVisual").then(m => ({ default: m.PancreaticResectabilityVisual })),         { ssr: false, loading: () => null });

interface WikiVisualRendererProps {
  visualComponent?: string;
}

export function WikiVisualRenderer({ visualComponent }: WikiVisualRendererProps) {
  if (!visualComponent) return null;

  switch (visualComponent) {
    case "GgoEvolutionSimulator":     return <GgoEvolutionSimulator />;
    case "FleischnerDecisionTree":    return <FleischnerDecisionTree />;
    case "StasAirwayVisual":          return <StasAirwayVisual />;
    case "VpiPleuraVisual":           return <VpiPleuraVisual />;
    case "LviVesselVisual":           return <LviVesselVisual />;
    case "IaslcSubtypeVisual":        return <IaslcSubtypeVisual />;
    case "LobulationVisual":          return <LobulationVisual />;
    case "SpiculationVisual":         return <SpiculationVisual />;
    case "PleuralIndentationVisual":  return <PleuralIndentationVisual />;
    case "VacuoleSignVisual":         return <VacuoleSignVisual />;
    case "VascularConvergenceVisual": return <VascularConvergenceVisual />;
    case "IplnLymphVisual":           return <IplnLymphVisual />;
    case "IhcKi67Visual":             return <IhcKi67Visual />;
    case "CalcificationVisual":       return <CalcificationVisual />;
    case "AdjuvantDecisionTreeVisual":return <AdjuvantDecisionTreeVisual />;
    case "MediastinalLNMapVisual":    return <MediastinalLNMapVisual />;
    case "EgfrMutationMapVisual":     return <EgfrMutationMapVisual />;
    case "PleuralLayersVisual":       return <PleuralLayersVisual />;
    case "LungRadsScaleVisual":       return <LungRadsScaleVisual />;
    case "PdL1ImmuneMechanismVisual": return <PdL1ImmuneMechanismVisual />;
    case "SurgicalApproachesVisual":  return <SurgicalApproachesVisual />;
    case "FollowupTimelineVisual":    return <FollowupTimelineVisual />;
    case "MPLCGGOVisual":             return <MPLCGGOVisual />;
    case "MrdCtdnaVisual":            return <MrdCtdnaVisual />;
    case "Her2AdcVisual":             return <Her2AdcVisual />;
    case "EgfrResistanceVisual":      return <EgfrResistanceVisual />;
    case "AblationSbrtVisual":        return <AblationSbrtVisual />;
    case "TargetedSideEffectsVisual": return <TargetedSideEffectsVisual />;
    case "IldWarningVisual":          return <IldWarningVisual />;
    case "IraeImmuneVisual":          return <IraeImmuneVisual />;
    case "BoneMarrowGcsfVisual":      return <BoneMarrowGcsfVisual />;
    case "BiopsySafetyVisual":        return <BiopsySafetyVisual />;
    case "EbusTbnaVisual":            return <EbusTbnaVisual />;
    case "TcmBoundaryVisual":         return <TcmBoundaryVisual />;
    case "DdiCheckerVisual":          return <DdiCheckerVisual />;
    case "CtWindowingVisual":         return <CtWindowingVisual />;
    // 乳腺癌专区
    case "BiRadsScaleVisual":         return <BiRadsScaleVisual />;
    case "MicrocalcificationVisual":  return <MicrocalcificationVisual />;
    case "ReceptorSubtypeVisual":     return <ReceptorSubtypeVisual />;
    case "LymphedemaArmVisual":       return <LymphedemaArmVisual />;
    case "DcisBasementMembraneVisual":return <DcisBasementMembraneVisual />;
    // 结直肠癌专区
    case "RectalAnatomyRulerVisual":  return <RectalAnatomyRulerVisual />;
    case "RectalCrmMriVisual":        return <RectalCrmMriVisual />;
    case "RectalTntWatchWaitVisual":  return <RectalTntWatchWaitVisual />;
    case "StomaCareLarsVisual":       return <StomaCareLarsVisual />;
    // 胃癌专区
    case "GastricAnatomyD2Visual":        return <GastricAnatomyD2Visual />;
    case "GastricDumpingNutritionVisual": return <GastricDumpingNutritionVisual />;
    // 原发性肝癌专区
    case "LiverCnlcStagingVisual":        return <LiverCnlcStagingVisual />;
    case "HccInterventionSystemicVisual": return <HccInterventionSystemicVisual />;
    // 食管癌专区
    case "EsophagealAnatomyStagingVisual": return <EsophagealAnatomyStagingVisual />;
    case "EsophagealMultiModalVisual":     return <EsophagealMultiModalVisual />;
    // 甲状腺癌专区
    case "ThyroidTiradsUltrasoundVisual":  return <ThyroidTiradsUltrasoundVisual />;
    case "ThyroidLt4TimingIsolationVisual": return <ThyroidLt4TimingIsolationVisual />;
    // 子宫内膜癌与宫颈癌专区
    case "EndometrialMoleculeDecisionVisual": return <EndometrialMoleculeDecisionVisual />;
    case "CervicalCinProgressionVisual":       return <CervicalCinProgressionVisual />;
    // 胰腺癌专区
    case "PancreaticResectabilityVisual":      return <PancreaticResectabilityVisual />;
    default:                          return null;
  }
}
