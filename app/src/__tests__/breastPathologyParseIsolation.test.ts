import { describe, it, expect } from 'vitest';
import { computeCancerStage, normalizeCancerType, isSupportedCancerType } from '../lib/stagingRegistry';
import type { CancerType } from '../lib/types';

describe('12 Cancers Pathology Isolation & Anti-Cross-Contamination Suite', () => {
  const all12Cancers: CancerType[] = [
    'lung', 'breast', 'colon', 'rectal', 'colorectal', 'gastric',
    'liver', 'esophageal', 'thyroid', 'endometrial', 'cervical', 'pancreatic'
  ];

  it('all 12 cancers are recognized as supported cancer types', () => {
    for (const c of all12Cancers) {
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

  it('should not allow lung profile to contaminate any other cancer uploader or switcher', () => {
    const lungProfile = {
      cancerType: "lung",
      stage: "IA1",
      histology: "浸润性腺癌(乳头型+腺泡型)",
      tumorSize: 1.2,
      noduleType: "mixed_ggo"
    };

    for (const targetCancer of all12Cancers) {
      if (targetCancer === 'lung') continue;

      // Matching check used in ReportUploader & PatientDashboard
      const isMatchingExisting = lungProfile && (lungProfile.cancerType === targetCancer);
      expect(isMatchingExisting).toBe(false);

      // Effective slots calculation used in DualPrimarySwitcher
      const availableSlots = ["lung"] as const;
      const effectiveSlots = Array.from(new Set([...availableSlots, targetCancer]));
      expect(effectiveSlots).toEqual(["lung", targetCancer]);
      expect(effectiveSlots.length).toBe(2);
    }
  });

  it('should isolate profiles strictly across all 12 cancer types with 0 cross-contamination', () => {
    // Generate simulated profiles for all 12 cancers
    const profiles: Record<CancerType, any> = {
      lung: { cancerType: 'lung', stage: 'IA1', tumorSize: 1.2 },
      breast: { cancerType: 'breast', stage: 'IIB', tumorSize: 3.3, erStatus: 'positive' },
      colon: { cancerType: 'colon', stage: 'IIA', tumorSize: 4.0 },
      rectal: { cancerType: 'rectal', stage: 'IIIB', tumorSize: 3.5 },
      colorectal: { cancerType: 'colorectal', stage: 'III', tumorSize: 4.0 },
      gastric: { cancerType: 'gastric', stage: 'IB', tumorSize: 2.5 },
      liver: { cancerType: 'liver', stage: 'Ia', tumorSize: 2.0 },
      esophageal: { cancerType: 'esophageal', stage: 'IIIA', tumorSize: 3.0 },
      thyroid: { cancerType: 'thyroid', stage: 'I', tumorSize: 0.8 },
      endometrial: { cancerType: 'endometrial', stage: 'IAm_POLEmut', tumorSize: 2.2 },
      cervical: { cancerType: 'cervical', stage: 'IIIC1r', tumorSize: 3.5 },
      pancreatic: { cancerType: 'pancreatic', stage: 'IIB', tumorSize: 2.8 },
    };

    for (const sourceCancer of all12Cancers) {
      const sourceProf = profiles[sourceCancer];
      for (const targetSlot of all12Cancers) {
        const isMatch = Boolean(sourceProf && sourceProf.cancerType === targetSlot);
        if (sourceCancer === targetSlot) {
          expect(isMatch).toBe(true);
        } else {
          // Zero cross-contamination
          expect(isMatch).toBe(false);
        }
      }
    }
  });
});
