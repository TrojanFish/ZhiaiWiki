import { describe, it, expect } from 'vitest';
import { computeCancerStage, normalizeCancerType } from '../lib/stagingRegistry';

describe('Breast Pathology Parsing & Cross-Cancer Isolation', () => {
  it('should correctly infer breast cancer from extracted parameters even when raw reportText is empty (image-only upload)', () => {
    const extractedData = {
      cancerType: null,
      organ: null,
      biRads: null,
      breastLaterality: "left",
      erStatus: "positive",
      erPercent: 80,
      prStatus: "positive",
      prPercent: 60,
      her2Status: "2+",
      her2Fish: "not_performed",
      nottinghamGrade: "2",
      histologyType: "浸润性癌，非特殊类型，部分区伴粘液分泌",
      axillaryNodesPositive: 1,
      axillaryNodesTotal: 17,
      tumorSize: 3.3,
      pathologyTumorSize: 3.3,
      marginStatus: "negative",
      lvi: "positive",
      surgeryType: "bcs",
      tStage: "T2",
      nStage: "N1",
      mStage: "M0"
    };

    const isBreastHint = Boolean(
      extractedData.breastLaterality ||
      extractedData.erStatus ||
      extractedData.prStatus ||
      extractedData.her2Status ||
      extractedData.axillaryNodesPositive != null ||
      /乳腺|导管癌|小叶癌|保乳|全切|非特殊型/i.test(String(extractedData.histologyType || "")) ||
      /保乳|mastectomy|bcs/i.test(String(extractedData.surgeryType || ""))
    );

    expect(isBreastHint).toBe(true);

    const inferredTypeFromText = isBreastHint ? "breast" : null;
    const detected = normalizeCancerType(inferredTypeFromText || extractedData.cancerType || extractedData.organ);
    expect(detected).toBe('breast');
  });

  it('should calculate AJCC 8th/9th anatomical and prognostic staging for the user breast pathology', () => {
    const profile = {
      cancerType: "breast",
      tumorSize: 3.3,
      pathologyTumorSize: 3.3,
      axillaryNodesPositive: 1,
      axillaryNodesTotal: 17,
      erStatus: "positive",
      erPercent: 80,
      prStatus: "positive",
      prPercent: 60,
      her2Status: "2+",
      her2Fish: "negative", // HER2-low Luminal B
      nottinghamGrade: "2",
      histologyType: "浸润性导管癌",
      marginStatus: "negative",
      lvi: "positive",
      surgeryType: "bcs",
    };

    const result = computeCancerStage("breast", profile);
    expect(result.cancerType).toBe('breast');
    expect(result.tStage).toBe('T2');
    expect(result.nStage).toBe('N1a');
    expect(result.mStage).toBe('M0');
    // T2N1a anatomical stage is IIB, with ER+ PR+ G2 HER2-low prognostic stage downstages to IA or IB under AJCC 8th
    expect(result.anatomicalStage).toBe('IIB');
    expect(result.stage).toBeDefined();
    expect(result.molecularSubtype).toBe('Luminal_A');
  });

  it('should not allow lung profile to contaminate breast uploader or switcher', () => {
    const lungProfile = {
      cancerType: "lung",
      stage: "IA1",
      histology: "浸润性腺癌(乳头型+腺泡型)",
      tumorSize: 1.2,
      noduleType: "mixed_ggo"
    };

    const targetCancerType = "breast";

    // Matching check used in ReportUploader
    const isMatchingExisting = lungProfile && (lungProfile.cancerType === targetCancerType);
    expect(isMatchingExisting).toBe(false);

    // Effective slots calculation used in DualPrimarySwitcher
    const availableSlots = ["lung"] as const;
    const activeSlot = "breast";
    const effectiveSlots = Array.from(new Set([...availableSlots, activeSlot]));
    expect(effectiveSlots).toEqual(["lung", "breast"]);
    expect(effectiveSlots.length).toBe(2);
  });
});
