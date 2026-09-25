import { describe, it, expect } from 'vitest';
import {
  computeBreastTStage,
  computeBreastNStage,
  deriveMolecularSubtype,
  deriveHer2StatusCategory,
  computeBreastAnatomicalStage,
  computeBreastClinicalStage,
  getBreastClinicalCohort
} from '../lib/breastStaging';
import { evaluateBiRads } from '../lib/biRadsCalculator';
import { computeCancerStage } from '../lib/stagingRegistry';

describe('AJCC 8th/9th Breast Cancer Staging Engine & BI-RADS', () => {
  describe('Anatomical T & N Staging', () => {
    it('should correctly stage T based on tumor size in cm', () => {
      expect(computeBreastTStage({ tumorSize: 0.08 })).toBe('T1mi');
      expect(computeBreastTStage({ tumorSize: 0.4 })).toBe('T1a');
      expect(computeBreastTStage({ tumorSize: 0.8 })).toBe('T1b');
      expect(computeBreastTStage({ tumorSize: 1.5 })).toBe('T1c');
      expect(computeBreastTStage({ tumorSize: 2.8 })).toBe('T2');
      expect(computeBreastTStage({ tumorSize: 5.5 })).toBe('T3');
      expect(computeBreastTStage({ histologyType: 'DCIS' })).toBe('Tis');
    });

    it('should correctly stage N based on positive nodes count', () => {
      expect(computeBreastNStage({ axillaryNodesPositive: 0 })).toBe('N0');
      expect(computeBreastNStage({ axillaryNodesPositive: 2 })).toBe('N1a');
      expect(computeBreastNStage({ axillaryNodesPositive: 5 })).toBe('N2a');
      expect(computeBreastNStage({ axillaryNodesPositive: 12 })).toBe('N3a');
    });

    it('should correctly calculate classical anatomical stages', () => {
      expect(computeBreastAnatomicalStage('T1c', 'N0', 'M0')).toBe('IA');
      expect(computeBreastAnatomicalStage('T2', 'N0', 'M0')).toBe('IIA');
      expect(computeBreastAnatomicalStage('T1c', 'N1a', 'M0')).toBe('IIA');
      expect(computeBreastAnatomicalStage('T2', 'N1a', 'M0')).toBe('IIB');
      expect(computeBreastAnatomicalStage('T3', 'N1a', 'M0')).toBe('IIIA');
      expect(computeBreastAnatomicalStage('T4b', 'N0', 'M0')).toBe('IIIB');
      expect(computeBreastAnatomicalStage('T1c', 'N3a', 'M0')).toBe('IIIC');
      expect(computeBreastAnatomicalStage('T1c', 'N0', 'M1')).toBe('IV');
    });
  });

  describe('St. Gallen Molecular Subtype Classification', () => {
    it('should classify Luminal A (ER+, PR+, HER2-, low Ki-67, G1)', () => {
      const res = deriveMolecularSubtype({
        erStatus: 'positive',
        erPercent: 90,
        prStatus: 'positive',
        prPercent: 70,
        her2Status: '1+',
        ki67: 10,
        grade: '1'
      });
      expect(res.subtype).toBe('Luminal_A');
    });

    it('should classify Luminal B HER2- (ER+, HER2-, high Ki-67 >= 20%)', () => {
      const res = deriveMolecularSubtype({
        erStatus: 'positive',
        erPercent: 85,
        prStatus: 'positive',
        prPercent: 40,
        her2Status: '0',
        ki67: 35,
        grade: '2'
      });
      expect(res.subtype).toBe('Luminal_B_HER2_neg');
    });

    it('should classify Luminal B HER2+ (Triple Positive)', () => {
      const res = deriveMolecularSubtype({
        erStatus: 'positive',
        erPercent: 80,
        prStatus: 'positive',
        prPercent: 60,
        her2Status: '3+',
        ki67: 25
      });
      expect(res.subtype).toBe('Luminal_B_HER2_pos');
    });

    it('should classify HER2-enriched (ER-, PR-, HER2 3+)', () => {
      const res = deriveMolecularSubtype({
        erStatus: 'negative',
        prStatus: 'negative',
        her2Status: '3+'
      });
      expect(res.subtype).toBe('HER2_enriched');
    });

    it('should classify Triple-Negative Breast Cancer (TNBC)', () => {
      const res = deriveMolecularSubtype({
        erStatus: 'negative',
        prStatus: 'negative',
        her2Status: '0'
      });
      expect(res.subtype).toBe('TNBC');
    });
  });

  describe('AJCC Pathological Prognostic Staging (升降期与 21 基因规则)', () => {
    it('should downstage T2N1M0 Luminal A from anatomical IIB to prognostic IA per AJCC 8th Table 48.4', () => {
      const res = computeBreastClinicalStage({
        tumorSize: 2.5, // T2
        axillaryNodesPositive: 1, // N1a
        erStatus: 'positive',
        erPercent: 90,
        prStatus: 'positive',
        prPercent: 80,
        her2Status: '1+',
        ki67: 12,
        grade: '1'
      });
      expect(res.anatomicalStage).toBe('IIB');
      expect(res.prognosticStage).toBe('IA');
      expect(res.stage).toBe('IA');
      expect(res.molecularSubtype).toBe('Luminal_A');
    });

    it('should upstage T1cN0M0 TNBC Grade 3 from anatomical IA to prognostic IIA', () => {
      const res = computeBreastClinicalStage({
        tumorSize: 1.8, // T1c (>5mm)
        axillaryNodesPositive: 0, // N0
        erStatus: 'negative',
        prStatus: 'negative',
        her2Status: '0',
        grade: '3'
      });
      expect(res.anatomicalStage).toBe('IA');
      expect(res.prognosticStage).toBe('IIA');
      expect(res.stage).toBe('IIA');
      expect(res.molecularSubtype).toBe('TNBC');
    });

    it('should NOT upstage T1aN0M0 (<=5mm) TNBC Grade 3 per AJCC 8th', () => {
      const res = computeBreastClinicalStage({
        tumorSize: 0.4, // T1a (<=5mm)
        axillaryNodesPositive: 0,
        erStatus: 'negative',
        prStatus: 'negative',
        her2Status: '0',
        grade: '3'
      });
      expect(res.anatomicalStage).toBe('IA');
      expect(res.prognosticStage).toBe('IA');
      expect(res.stage).toBe('IA');
    });

    it('should downstage to Stage IA when Oncotype DX RS < 11 regardless of anatomical stage T2N0', () => {
      const res = computeBreastClinicalStage({
        tumorSize: 3.0, // T2
        axillaryNodesPositive: 0, // N0
        erStatus: 'positive',
        erPercent: 95,
        her2Status: '1+',
        grade: '2',
        oncotypeDxScore: 8 // RS < 11
      });
      expect(res.anatomicalStage).toBe('IIA');
      expect(res.prognosticStage).toBe('IA');
      expect(res.isDownstagedByGenomics).toBe(true);
      expect(res.stage).toBe('IA');
    });

    it('should not trigger RS < 11 genomic downstage when RS is 11 or higher', () => {
      const res = computeBreastClinicalStage({
        tumorSize: 3.0, // T2
        axillaryNodesPositive: 0,
        erStatus: 'positive',
        erPercent: 95,
        her2Status: '1+',
        grade: '2',
        oncotypeDxScore: 11
      });
      expect(res.isDownstagedByGenomics).toBe(false);
    });

    it('should handle Tis DCIS as Stage 0', () => {
      const res = computeBreastClinicalStage({
        tStage: 'Tis',
        nStage: 'N0',
        mStage: 'M0',
        histologyType: 'DCIS'
      });
      expect(res.anatomicalStage).toBe('0');
      expect(res.stage).toBe('0');
      expect(res.treatmentDirection).toContain('手术完整切除');
    });

    it('should handle micrometastasis N1mi correctly as Stage IB', () => {
      const res = computeBreastClinicalStage({
        tumorSize: 1.5, // T1c
        sentinelNodesPositive: 1,
        micrometastasisOnly: true
      });
      expect(res.nStage).toBe('N1mi');
      expect(res.anatomicalStage).toBe('IB');
    });

    it('should classify M1 as Stage IV regardless of T and N', () => {
      const res = computeBreastClinicalStage({
        tumorSize: 1.0,
        axillaryNodesPositive: 0,
        mStage: 'M1'
      });
      expect(res.stage).toBe('IV');
      expect(res.prognosticStage).toBe('IV');
    });

    it('should tailor treatmentDirection for premenopausal vs postmenopausal patients', () => {
      const pre = computeBreastClinicalStage({
        tumorSize: 1.5,
        axillaryNodesPositive: 0,
        erStatus: 'positive',
        her2Status: '1+',
        menopauseStatus: 'pre'
      });
      expect(pre.treatmentDirection).toContain('绝经前首选他莫昔芬');

      const post = computeBreastClinicalStage({
        tumorSize: 1.5,
        axillaryNodesPositive: 0,
        erStatus: 'positive',
        her2Status: '1+',
        menopauseStatus: 'post'
      });
      expect(post.treatmentDirection).toContain('绝经后以第三代芳香化酶抑制剂');
    });
  });

  describe('BI-RADS Classification Evaluation', () => {
    it('should properly assess BI-RADS 3 as low risk and suggest 3-6 month follow-up', () => {
      const assessment = evaluateBiRads('BI-RADS 3类');
      expect(assessment?.category).toBe('3');
      expect(assessment?.riskLevel).toBe('low');
      expect(assessment?.malignancyRiskPercent).toBe('< 2%');
      expect(assessment?.actionGuidance).toContain('短期随访');
    });

    it('should properly assess BI-RADS 4B as moderate-high risk requiring needle biopsy', () => {
      const assessment = evaluateBiRads('4B');
      expect(assessment?.category).toBe('4B');
      expect(assessment?.riskLevel).toBe('high');
      expect(assessment?.malignancyRiskPercent).toBe('10% ~ 50%');
      expect(assessment?.actionGuidance).toContain('空芯针活检');
    });

    it('should properly assess BI-RADS 2 as benign', () => {
      const assessment = evaluateBiRads('2');
      expect(assessment?.category).toBe('2');
      expect(assessment?.riskLevel).toBe('safe');
    });

    it('should return null when BI-RADS input is empty or null', () => {
      expect(evaluateBiRads(null)).toBeNull();
      expect(evaluateBiRads('')).toBeNull();
      expect(evaluateBiRads('   ')).toBeNull();
    });

    it('should properly assess BI-RADS 6 as confirmed malignancy', () => {
      const assessment = evaluateBiRads('6');
      expect(assessment?.category).toBe('6');
      expect(assessment?.riskLevel).toBe('confirmed');
      expect(assessment?.malignancyRiskPercent).toBe('100%');
    });

    it('should properly assess BI-RADS 0 as needing further examination', () => {
      const assessment = evaluateBiRads('0');
      expect(assessment?.category).toBe('0');
      expect(assessment?.riskLevel).toBe('moderate');
      expect(assessment?.actionGuidance).toContain('建议结合钼靶与乳腺高频超声');
    });
  });

  describe('Breast Clinical Cohort Matching Engine', () => {
    it('should match TAILORx cohort for Luminal A low risk', () => {
      const cohort = getBreastClinicalCohort({
        stage: 'IA',
        molecularSubtype: 'Luminal_A',
        erStatus: 'positive',
        erPercent: 90,
        her2Status: '1+',
        oncotypeDxScore: 12
      });
      expect(cohort.name).toContain('TAILORx');
      expect(cohort.riskTier).toBe('minimal_risk');
      expect(cohort.confidenceRating).toBe('⭐⭐⭐⭐⭐');
    });

    it('should match KEYNOTE-522 cohort for TNBC', () => {
      const cohort = getBreastClinicalCohort({
        stage: 'IIA',
        molecularSubtype: 'TNBC',
        erStatus: 'negative',
        prStatus: 'negative',
        her2Status: '0'
      });
      expect(cohort.name).toContain('KEYNOTE522');
      expect(cohort.source).toContain('KEYNOTE-522');
      expect(cohort.matchedMorphology).toContain('三阴性');
    });

    it('should match APHINITY cohort for HER2-positive', () => {
      const cohort = getBreastClinicalCohort({
        stage: 'IIA',
        molecularSubtype: 'HER2_enriched',
        her2Status: '3+'
      });
      expect(cohort.name).toContain('APHINITY');
      expect(cohort.description).toContain('曲妥珠单抗联合帕妥珠单抗');
    });

    it('should match monarchE cohort for Luminal B with high node involvement', () => {
      const cohort = getBreastClinicalCohort({
        stage: 'IIIA',
        molecularSubtype: 'Luminal_B_HER2_neg',
        axillaryNodesPositive: 4,
        nStage: 'N2'
      });
      expect(cohort.name).toContain('MonarchE');
      expect(cohort.description).toContain('阿贝西利');
    });
  });

  describe('Staging Registry Dispatcher', () => {
    it('should dispatch to breast staging engine when cancerType is breast', () => {
      const res = computeCancerStage('breast', {
        tumorSize: 1.5,
        erStatus: 'positive',
        erPercent: 90,
        prStatus: 'positive',
        prPercent: 70,
        her2Status: '1+',
        ki67: 10,
        grade: '1'
      });
      expect(res.cancerType).toBe('breast');
      expect(res.stage).toBe('IA');
      expect(res.molecularSubtype).toBe('Luminal_A');
    });

    it('should dispatch to lung staging engine when cancerType is lung', () => {
      const res = computeCancerStage('lung', {
        noduleType: 'mixed_ggo',
        tumorSize: 1.5,
        solidSize: 0.8
      });
      expect(res.cancerType).toBe('lung');
      expect(res.stage).toBe('IA1');
    });

    it('should dispatch neoadjuvantChemo and ypTnmNotice through staging registry', () => {
      const res = computeCancerStage('breast', {
        tumorSize: 2.5,
        tStage: 'ypT1c',
        nStage: 'ypN0',
        neoadjuvantChemo: true,
        erStatus: 'negative',
        prStatus: 'negative',
        her2Status: '1+'
      });
      expect(res.isNeoadjuvant).toBe(true);
      expect(res.ypTnmNotice).toBeDefined();
      expect(res.ypTnmNotice?.warning).toContain('Table 48.4');
      expect(res.her2Category).toBe('low');
    });
  });

  describe('v3.1 Clinical Detail Refinements (HER2-Low, Ki-67 Gray Zone, ypTNM)', () => {
    describe('HER2 Status Categorization (Positive / Low / Zero)', () => {
      it('should categorize IHC 3+ as positive', () => {
        const res = deriveHer2StatusCategory({ her2Status: '3+' });
        expect(res.category).toBe('positive');
        expect(res.isHer2Pos).toBe(true);
        expect(res.isHer2Low).toBe(false);
        expect(res.tDxdEligible).toBe(true);
      });

      it('should categorize IHC 2+ with positive FISH as positive', () => {
        const res = deriveHer2StatusCategory({ her2Status: '2+', her2Fish: 'positive' });
        expect(res.category).toBe('positive');
        expect(res.isHer2Pos).toBe(true);
      });

      it('should categorize IHC 1+ as HER2-Low with DESTINY-Breast04 evidence', () => {
        const res = deriveHer2StatusCategory({ her2Status: '1+' });
        expect(res.category).toBe('low');
        expect(res.isHer2Low).toBe(true);
        expect(res.isHer2Pos).toBe(false);
        expect(res.evidenceNote).toContain('DESTINY-Breast04');
        expect(res.evidenceNote).toContain('德曲妥珠单抗');
      });

      it('should categorize IHC 2+ with negative FISH as HER2-Low', () => {
        const res = deriveHer2StatusCategory({ her2Status: '2+', her2Fish: 'negative' });
        expect(res.category).toBe('low');
        expect(res.isHer2Low).toBe(true);
        expect(res.isHer2Pos).toBe(false);
        expect(res.evidenceNote).toContain('DESTINY-Breast04');
      });

      it('should categorize explicit her2Low=true as HER2-Low', () => {
        const res = deriveHer2StatusCategory({ her2Low: true });
        expect(res.category).toBe('low');
        expect(res.isHer2Low).toBe(true);
      });

      it('should categorize IHC 0 as zero', () => {
        const res = deriveHer2StatusCategory({ her2Status: '0' });
        expect(res.category).toBe('zero');
        expect(res.isHer2Zero).toBe(true);
        expect(res.isHer2Low).toBe(false);
        expect(res.isHer2Pos).toBe(false);
      });
    });

    describe('Ki-67 14%~20% Gray Zone Warning', () => {
      it('should flag Ki-67 in 14%~20% as gray zone and recommend multigene profiling', () => {
        const subtypeRes = deriveMolecularSubtype({
          erStatus: 'positive',
          prStatus: 'positive',
          her2Status: '0',
          ki67: 16,
          grade: '2'
        });
        expect(subtypeRes.isKi67GrayZone).toBe(true);
        expect(subtypeRes.ki67Notice).toBeDefined();
        expect(subtypeRes.ki67Notice).toContain('14%~20%');
        expect(subtypeRes.ki67Notice).toContain('21 基因');
        expect(subtypeRes.ki67Notice).toContain('70 基因');
      });

      it('should not flag Ki-67 < 14% as gray zone', () => {
        const subtypeRes = deriveMolecularSubtype({
          erStatus: 'positive',
          prStatus: 'positive',
          her2Status: '0',
          ki67: 10,
          grade: '1'
        });
        expect(subtypeRes.isKi67GrayZone).toBe(false);
        expect(subtypeRes.ki67Notice).toBeUndefined();
      });

      it('should not flag Ki-67 >= 20% as gray zone (classified as Luminal B)', () => {
        const subtypeRes = deriveMolecularSubtype({
          erStatus: 'positive',
          prStatus: 'positive',
          her2Status: '0',
          ki67: 25,
          grade: '2'
        });
        expect(subtypeRes.isKi67GrayZone).toBe(false);
        expect(subtypeRes.subtype).toBe('Luminal_B_HER2_neg');
      });
    });

    describe('Neoadjuvant Therapy ypTNM Staging Alert', () => {
      it('should generate ypTNM warning when neoadjuvantChemo is true', () => {
        const res = computeBreastClinicalStage({
          tumorSize: 2.2,
          tStage: 'ypT2',
          nStage: 'ypN1a',
          erStatus: 'positive',
          prStatus: 'positive',
          her2Status: '0',
          neoadjuvantChemo: true
        });

        expect(res.isNeoadjuvant).toBe(true);
        expect(res.ypTnmNotice).toBeDefined();
        expect(res.ypTnmNotice?.warning).toContain('Table 48.4');
        expect(res.ypTnmNotice?.recommendation).toContain('KATHERINE');
        expect(res.ypTnmNotice?.recommendation).toContain('CREATE-X');
        expect(res.explanation).toContain('ypTNM 评估警示');
      });

      it('should generate ypTNM warning when tStage starts with yp', () => {
        const res = computeBreastClinicalStage({
          tStage: 'ypT1c',
          nStage: 'ypN0',
          erStatus: 'positive',
          her2Status: '1+'
        });

        expect(res.isNeoadjuvant).toBe(true);
        expect(res.ypTnmNotice).toBeDefined();
        expect(res.ypTnmNotice?.warning).toContain('Table 48.4');
      });

      it('should not generate ypTNM warning for upfront surgical patients', () => {
        const res = computeBreastClinicalStage({
          tumorSize: 1.5,
          tStage: 'pT1c',
          nStage: 'pN0',
          erStatus: 'positive',
          her2Status: '0'
        });

        expect(res.isNeoadjuvant).toBe(false);
        expect(res.ypTnmNotice).toBeNull();
      });
    });

    describe('Cohort Key Factors Enrichment', () => {
      it('should include HER2-Low and Neoadjuvant factors in clinical cohort', () => {
        const cohort = getBreastClinicalCohort({
          stage: 'IIA',
          molecularSubtype: 'Luminal_A',
          her2Low: true,
          neoadjuvantChemo: true,
          ki67: 18,
          pcrStatus: 'ypT0isN0'
        });

        expect(cohort.keyFactors).toContain('HER2 低表达 (Low · DESTINY-Breast04 T-DXd 靶向获益人群)');
        expect(cohort.keyFactors.some(f => f.includes('新辅助治疗后病理'))).toBe(true);
        expect(cohort.keyFactors.some(f => f.includes('Ki-67 临界灰区'))).toBe(true);
      });
    });
  });
});
