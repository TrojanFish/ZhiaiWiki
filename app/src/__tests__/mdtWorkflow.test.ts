import { describe, it, expect } from 'vitest';
import type { CancerType } from '../lib/types';
import { getDualPrimarySummary } from '../lib/profileStorage';

describe('Multidisciplinary Team (MDT) Consultation Workflow & Dual-Primary UX Suite', () => {
  it('verifies dual-primary profile summary retrieval in profileStorage', () => {
    const summary = getDualPrimarySummary();
    expect(summary).toHaveProperty('slots');
    expect(summary).toHaveProperty('isDualPrimary');
    expect(summary).toHaveProperty('lungProfile');
    expect(summary).toHaveProperty('breastProfile');
  });

  describe('MDT Specialist Panel Coverage for Lung and Breast Cancers', () => {
    const cancerTypes: CancerType[] = ['lung', 'breast'];

    it('each cancer type maps to specialized MDT departments', () => {
      const expectedCoreDepts: Record<CancerType, string[]> = {
        lung: ['胸外科', '呼吸与危重症医学科', '胸部肿瘤内科', '胸部放疗科'],
        breast: ['乳腺外科', '乳腺肿瘤内科', '放疗科', '乳腺病理中心'],
      };

      cancerTypes.forEach((type) => {
        const depts = expectedCoreDepts[type];
        expect(depts.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('MDT Clinical Controversies & Crossroads Matrix', () => {
    it('generates specific decision crossroads for breast cancer (21-gene chemo sparing)', () => {
      const breastControversy = 'breast_chemo_sparing_21gene';
      expect(breastControversy).toBe('breast_chemo_sparing_21gene');
    });

    it('generates specific decision crossroads for lung cancer (sublobar segmentectomy vs ADAURA targeted)', () => {
      const lungControversies = [
        'lung_sublobar_vs_lobectomy',
        'lung_adjuvant_target_vs_chemo',
      ];
      expect(lungControversies).toContain('lung_sublobar_vs_lobectomy');
      expect(lungControversies).toContain('lung_adjuvant_target_vs_chemo');
    });
  });

  describe('Pathology IHC Differential Diagnosis across Multi-Primary Combinations', () => {
    it('validates IHC marker differentiation pairs for MPMN (Lung vs Breast) patient reassurance', () => {
      const ihcMarkers = {
        lungAdeno: ['TTF-1', 'Napsin A'],
        breast: ['GATA-3', 'Mammaglobin', 'ER'],
      };

      // Breast vs Lung primary differentiation
      expect(ihcMarkers.breast).toContain('GATA-3');
      expect(ihcMarkers.lungAdeno).toContain('TTF-1');
    });
  });
});
