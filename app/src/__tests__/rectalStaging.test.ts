import { describe, it, expect } from 'vitest';
import {
  computeRectalStage,
  getRectalClinicalCohort,
} from '../lib/colorectalStaging';
import { computeCancerStage, getClinicalCohortUnified } from '../lib/stagingRegistry';

describe('Rectal Cancer Dedicated Staging Engine (AJCC 8th & CSCO 2024)', () => {
  describe('Anal Verge Distance & Sphincter Preservation Rationale', () => {
    it('should provide low-rectal (<5cm) sphincter-saving and ISR vs Miles guidance', () => {
      const result = computeRectalStage({
        tStage: 'T3',
        nStage: 'N0',
        mStage: 'M0',
        distanceFromAnalVerge: 3.5,
      });

      expect(result.cancerType).toBe('rectal');
      expect(result.explanation).toContain('低位/超低位直肠癌标尺');
      expect(result.explanation).toContain('3.5cm');
      expect(result.explanation).toContain('括约肌间切除 (ISR)');
      expect(result.explanation).toContain('Miles');
      expect(result.explanation).toContain('Watch & Wait');
    });

    it('should provide mid-rectal (5-10cm) TME and protective stoma guidance', () => {
      const result = computeRectalStage({
        tStage: 'T3',
        nStage: 'N1a',
        mStage: 'M0',
        distanceFromAnalVerge: 7.0,
      });

      expect(result.explanation).toContain('中位直肠癌标尺');
      expect(result.explanation).toContain('保护性回肠预防造口');
      expect(result.explanation).toContain('吻合口漏');
    });

    it('should provide high-rectal (>10cm) LAR guidance', () => {
      const result = computeRectalStage({
        tStage: 'T2',
        nStage: 'N0',
        mStage: 'M0',
        distanceFromAnalVerge: 12.0,
      });

      expect(result.explanation).toContain('高位直肠癌标尺');
      expect(result.explanation).toContain('低位前切除术 (LAR)');
    });
  });

  describe('Pelvic HR-MRI CRM & mrEMVI Risk Stratification', () => {
    it('should trigger urgent CRM alert when CRM distance <= 1mm', () => {
      const result = computeRectalStage({
        tStage: 'T3',
        nStage: 'N1b',
        mStage: 'M0',
        crmDistance: 0.8,
        crmStatus: 'positive',
      });

      expect(result.explanation).toContain('环周切缘 (CRM) 受累高危预警');
      expect(result.explanation).toContain('0.8mm');
      expect(result.explanation).toContain('直肠系膜固有筋膜 (MRF)');
      expect(result.explanation).toContain('全程新辅助放疗 (TNT)');
    });

    it('should confirm CRM safety when CRM distance > 1mm', () => {
      const result = computeRectalStage({
        tStage: 'T3',
        nStage: 'N0',
        mStage: 'M0',
        crmDistance: 4.5,
        crmStatus: 'negative',
      });

      expect(result.explanation).toContain('环周切缘 (CRM) 安全');
      expect(result.explanation).toContain('>1mm');
    });

    it('should warn about hematogenous metastasis risk when mrEMVI is positive', () => {
      const result = computeRectalStage({
        tStage: 'T3',
        nStage: 'N1a',
        mStage: 'M0',
        emviStatus: 'positive',
      });

      expect(result.explanation).toContain('肠壁外脉管侵犯 (mrEMVI 阳性)');
      expect(result.explanation).toContain('血行远处转移');
    });
  });

  describe('TNT (RAPIDO / PRODIGE 23) & Watch & Wait Tactics', () => {
    it('should recommend TNT and Watch & Wait organ preservation for LARC (Stage II/III)', () => {
      const result = computeRectalStage({
        tStage: 'T3',
        nStage: 'N1a',
        mStage: 'M0',
        distanceFromAnalVerge: 4.0,
        crmDistance: 0.5,
      });

      expect(result.stage).toBe('IIIB');
      expect(result.treatmentDirection).toContain('全程新辅助 TNT');
      expect(result.treatmentDirection).toContain('RAPIDO / PRODIGE 23');
      expect(result.treatmentDirection).toContain('Watch & Wait (观察等待)');
      expect(result.treatmentDirection).toContain('保护性回肠预防造口');
    });
  });

  describe('Clinical Cohort Matching for Rectal Cancer', () => {
    it('should match RAPIDO TNT cohort for locally advanced rectal cancer (LARC)', () => {
      const cohort = getRectalClinicalCohort({
        stage: 'IIIB',
        tStage: 'T3',
        nStage: 'N1a',
      });

      expect(cohort.name).toBe('RAPIDO_TNT_Cohort');
      expect(cohort.keyFactors).toContain('全程新辅助TNT');
      expect(cohort.keyFactors).toContain('短程放疗5x5Gy');
      expect(cohort.keyFactors).toContain('pCR翻倍(28.4%)');
    });

    it('should match OPRA Watch & Wait cohort when cCR / pCR is achieved', () => {
      const cohort = getRectalClinicalCohort({
        stage: 'I',
        clinicalData: { pcrStatus: 'cCR' },
      });

      expect(cohort.name).toBe('OPRA_WatchAndWait_Cohort');
      expect(cohort.rfs5Year).toContain('3年器官保留率');
      expect(cohort.keyFactors).toContain('Watch & Wait');
      expect(cohort.keyFactors).toContain('器官保留免造口');
    });

    it('should match early stage TAMIS/TME cohort for Stage I profile', () => {
      const cohort = getRectalClinicalCohort({
        stage: 'I',
        tStage: 'T1',
        nStage: 'N0',
      });

      expect(cohort.name).toBe('AJCC8_Stage1_Rectal_Cohort');
      expect(cohort.os5Year).toBe('97.0%');
    });
  });

  describe('Registry Unified Dispatch for Rectal Cancer', () => {
    it('should dispatch to rectal engine seamlessly via CancerRegistry', () => {
      const result = computeCancerStage('rectal', {
        tStage: 'T3',
        nStage: 'N2a',
        mStage: 'M0',
        distanceFromAnalVerge: 4.5,
      });

      expect(result.cancerType).toBe('rectal');
      expect(result.stage).toBe('IIIB');
      expect(result.versionNotice).toContain('直肠专病');
    });

    it('should fetch rectal cohort through unified dispatcher', () => {
      const cohort = getClinicalCohortUnified({
        cancerType: 'rectal',
        stage: 'IIIB',
      });

      expect(cohort.name).toBe('RAPIDO_TNT_Cohort');
    });
  });
});
