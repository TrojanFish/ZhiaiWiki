import { describe, it, expect } from 'vitest';
import {
  computeColonStage,
  getColonClinicalCohort,
} from '../lib/colorectalStaging';
import { computeCancerStage, getClinicalCohortUnified } from '../lib/stagingRegistry';

describe('Colon Cancer Dedicated Staging Engine (AJCC 8th & CSCO 2024)', () => {
  describe('CME Quality Control & Lymph Node Yield', () => {
    it('should flag high-risk warning when examined lymph nodes < 12 in Stage II', () => {
      const result = computeColonStage({
        tStage: 'T3',
        nStage: 'N0',
        mStage: 'M0',
        lymphNodesExamined: 8,
        primaryLocation: 'right_colon',
      });

      expect(result.cancerType).toBe('colon');
      expect(result.stage).toBe('IIA');
      expect(result.explanation).toContain('淋巴结检出质控警示');
      expect(result.explanation).toContain('8 枚');
      expect(result.explanation).toContain('≥ 12 枚');
      expect(result.treatmentDirection).toContain('高危因素');
    });

    it('should confirm CME quality clearance when examined lymph nodes >= 12', () => {
      const result = computeColonStage({
        tStage: 'T3',
        nStage: 'N0',
        mStage: 'M0',
        lymphNodesExamined: 16,
        primaryLocation: 'left_colon',
      });

      expect(result.stage).toBe('IIA');
      expect(result.explanation).toContain('系膜清扫质控合格');
      expect(result.explanation).toContain('16 枚');
    });
  });

  describe('Sidedness Biological Divergence', () => {
    it('should provide right-sided colon specific biology and anti-VEGF guidance', () => {
      const result = computeColonStage({
        tStage: 'T3',
        nStage: 'N1a',
        mStage: 'M0',
        primaryLocation: 'right_colon',
        lymphNodesExamined: 15,
      });

      expect(result.explanation).toContain('右半结肠专科特性');
      expect(result.explanation).toContain('胚胎起源于中肠');
      expect(result.explanation).toContain('贝伐珠单抗');
    });

    it('should provide left-sided colon specific biology and anti-EGFR guidance', () => {
      const result = computeColonStage({
        tStage: 'T3',
        nStage: 'N1a',
        mStage: 'M0',
        primaryLocation: 'left_colon',
        lymphNodesExamined: 14,
      });

      expect(result.explanation).toContain('左半结肠专科特性');
      expect(result.explanation).toContain('后肠');
      expect(result.explanation).toContain('西妥昔单抗');
    });
  });

  describe('dMMR / MSI-H Chemo-Exemption Strategy', () => {
    it('should strongly recommend exempting adjuvant chemo for Stage II dMMR colon cancer', () => {
      const result = computeColonStage({
        tStage: 'T3',
        nStage: 'N0',
        mStage: 'M0',
        dmmrStatus: 'dMMR',
        lymphNodesExamined: 15,
      });

      expect(result.stage).toBe('IIA');
      expect(result.treatmentDirection).toContain('免化疗');
      expect(result.treatmentDirection).toContain('dMMR / MSI-H');
    });
  });

  describe('IDEA 3-Month CAPOX De-escalation Strategy', () => {
    it('should recommend 3-month CAPOX for low-risk Stage III colon cancer (T1-3 N1)', () => {
      const result = computeColonStage({
        tStage: 'T3',
        nStage: 'N1a',
        mStage: 'M0',
        lymphNodesExamined: 14,
      });

      expect(result.stage).toBe('IIIB');
      expect(result.treatmentDirection).toContain('3 个月 CAPOX');
      expect(result.treatmentDirection).toContain('周围神经毒性');
    });

    it('should recommend full 6-month therapy for high-risk Stage III colon cancer (T4 or N2)', () => {
      const result = computeColonStage({
        tStage: 'T4a',
        nStage: 'N2a',
        mStage: 'M0',
        lymphNodesExamined: 18,
      });

      expect(result.stage).toBe('IIIC');
      expect(result.treatmentDirection).toContain('6 个月 CAPOX 或 mFOLFOX6');
    });
  });

  describe('Clinical Cohort Matching', () => {
    it('should match IDEA low-risk cohort for low-risk Stage III profile', () => {
      const cohort = getColonClinicalCohort({
        stage: 'IIIB',
        tStage: 'T3',
        nStage: 'N1a',
      });

      expect(cohort.name).toBe('IDEA_LowRisk_Cohort');
      expect(cohort.rfs5Year).toBe('83.1%');
      expect(cohort.keyFactors).toContain('3个月CAPOX减毒方案');
    });

    it('should match KEYNOTE-177 cohort for metastatic MSI-H profile', () => {
      const cohort = getColonClinicalCohort({
        stage: 'IV',
        mStage: 'M1a',
        clinicalData: { msiStatus: 'MSI-H' },
      });

      expect(cohort.name).toBe('KEYNOTE177_MSIH_Cohort');
      expect(cohort.keyFactors).toContain('dMMR/MSI-H');
      expect(cohort.keyFactors).toContain('PD-1单抗一线');
    });
  });

  describe('Registry Unified Dispatch', () => {
    it('should dispatch to colon engine seamlessly via CancerRegistry', () => {
      const result = computeCancerStage('colon', {
        tStage: 'T2',
        nStage: 'N0',
        mStage: 'M0',
        lymphNodesExamined: 15,
      });

      expect(result.cancerType).toBe('colon');
      expect(result.stage).toBe('I');
      expect(result.versionNotice).toContain('结肠专病标准');
    });

    it('should fetch colon cohort through unified dispatcher', () => {
      const cohort = getClinicalCohortUnified({
        cancerType: 'colon',
        stage: 'I',
      });

      expect(cohort.name).toBe('AJCC8_Stage1_Colon_Cohort');
    });
  });
});
