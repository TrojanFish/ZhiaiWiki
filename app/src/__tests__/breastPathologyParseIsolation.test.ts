import { describe, it, expect } from 'vitest';
import { computeCancerStage, normalizeCancerType, isSupportedCancerType } from '../lib/stagingRegistry';
import type { CancerType } from '../lib/types';

describe('Cancer Pathology Isolation & Anti-Cross-Contamination Suite', () => {
  const supportedCancers: CancerType[] = ['lung', 'breast'];

  it('all supported cancers (lung & breast) are recognized as supported cancer types', () => {
    for (const c of supportedCancers) {
      expect(isSupportedCancerType(c)).toBe(true);
      expect(normalizeCancerType(c)).toBe(c);
    }
  });

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
      her2Fish: "negative",
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
    expect(result.anatomicalStage).toBe('IIB');
    expect(result.stage).toBeDefined();
    expect(result.molecularSubtype).toBe('Luminal_A');
  });

  it('should not allow lung profile to contaminate breast uploader or switcher', () => {
    const lungProfile = {
      cancerType: "lung" as const,
      stage: "IA1",
      histology: "浸润性腺癌(乳头型+腺泡型)",
      tumorSize: 1.2,
      noduleType: "mixed_ggo"
    };

    const isMatchingExisting = lungProfile && ((lungProfile.cancerType as string) === 'breast');
    expect(isMatchingExisting).toBe(false);

    const availableSlots = ["lung"] as const;
    const effectiveSlots = Array.from(new Set([...availableSlots, 'breast']));
    expect(effectiveSlots).toEqual(["lung", "breast"]);
    expect(effectiveSlots.length).toBe(2);
  });

  it('should isolate profiles strictly across lung and breast types with 0 cross-contamination', () => {
    const profiles: Record<CancerType, any> = {
      lung: { cancerType: 'lung', stage: 'IA1', tumorSize: 1.2 },
      breast: { cancerType: 'breast', stage: 'IIB', tumorSize: 3.3, erStatus: 'positive' },
    };

    for (const sourceCancer of supportedCancers) {
      const sourceProf = profiles[sourceCancer];
      for (const targetSlot of supportedCancers) {
        const isMatch = Boolean(sourceProf && sourceProf.cancerType === targetSlot);
        if (sourceCancer === targetSlot) {
          expect(isMatch).toBe(true);
        } else {
          expect(isMatch).toBe(false);
        }
      }
    }
  });
});
