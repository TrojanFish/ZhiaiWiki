import { describe, it, expect } from 'vitest';
import {
  checkColorectalDdi,
  COLORECTAL_TARGETED_DRUGS,
  COLORECTAL_DDI_RULES,
} from '../lib/colorectalDdiData';
import { getTargetedDrugsForCancer, checkDrugInteractionsUnified } from '../lib/ddiRegistry';

describe('Colorectal Cancer DDI Pharmacovigilance Engine', () => {
  describe('Colorectal Formulary & CancerRegistry Integration', () => {
    it('should provide at least 15 colorectal standard-of-care & frontline drugs', () => {
      expect(COLORECTAL_TARGETED_DRUGS.length).toBeGreaterThanOrEqual(15);
      const drugIds = COLORECTAL_TARGETED_DRUGS.map((d) => d.id);
      expect(drugIds).toContain('capecitabine');
      expect(drugIds).toContain('oxaliplatin');
      expect(drugIds).toContain('irinotecan');
      expect(drugIds).toContain('fruquintinib');
      expect(drugIds).toContain('regorafenib');
      expect(drugIds).toContain('cetuximab');
      expect(drugIds).toContain('panitumumab');
      expect(drugIds).toContain('bevacizumab');
      expect(drugIds).toContain('pembrolizumab');
      expect(drugIds).toContain('envafolimab');
      expect(drugIds).toContain('tislelizumab');
      expect(drugIds).toContain('encorafenib');
      expect(drugIds).toContain('trastuzumab_deruxtecan');
      expect(drugIds).toContain('trifluridine_tipiracil');
      expect(drugIds).toContain('sotorasib');
    });

    it('should resolve colorectal drugs via getTargetedDrugsForCancer', () => {
      const drugs = getTargetedDrugsForCancer('colorectal');
      expect(drugs.length).toBeGreaterThanOrEqual(15);
      expect(drugs.some((d) => d.id === 'capecitabine')).toBe(true);
      expect(drugs.some((d) => d.id === 'fruquintinib')).toBe(true);
    });
  });

  describe('Severe Contraindications & Black-Box Warnings', () => {
    it('should flag fatal black-box interaction between Capecitabine and Warfarin (INR surge)', () => {
      const res = checkColorectalDdi('capecitabine', ['warfarin']);
      expect(res.overallStatus).toBe('danger');
      expect(res.severeCount).toBe(1);
      expect(res.interactions[0].rule.riskLevel).toBe('severe_contraindication');
      expect(res.interactions[0].rule.clinicalGuidance).toContain('FDA/NMPA 黑框警告');
      expect(res.interactions[0].rule.clinicalGuidance).toContain('低分子肝素');
    });

    it('should flag severe contraindication between Fruquintinib and Rifampin (CYP3A4 strong induction)', () => {
      const res = checkColorectalDdi('fruquintinib', ['rifampin']);
      expect(res.overallStatus).toBe('danger');
      expect(res.severeCount).toBe(1);
      expect(res.interactions[0].rule.mechanism).toContain('CYP3A4');
      expect(res.interactions[0].rule.clinicalGuidance).toContain('严禁合用');
    });

    it('should flag severe contraindication between Regorafenib and Carbamazepine', () => {
      const res = checkColorectalDdi('regorafenib', ['carbamazepine']);
      expect(res.overallStatus).toBe('danger');
      expect(res.severeCount).toBe(1);
      expect(res.interactions[0].rule.title).toContain('卡马西平');
    });

    it('should flag severe contraindication between Irinotecan and Ketoconazole (SN-38 toxicity)', () => {
      const res = checkColorectalDdi('irinotecan', ['ketoconazole']);
      expect(res.overallStatus).toBe('danger');
      expect(res.severeCount).toBe(1);
      expect(res.interactions[0].rule.title).toContain('SN-38');
      expect(res.interactions[0].rule.mechanism).toContain('中性粒细胞缺乏');
    });

    it('should warn against dietary interaction: TKI + Grapefruit', () => {
      const res = checkColorectalDdi('fruquintinib', ['grapefruit']);
      expect(res.overallStatus).toBe('danger');
      expect(res.severeCount).toBe(1);
      expect(res.interactions[0].rule.riskLabel).toContain('饮食红线');
    });
  });

  describe('Timing Cautions & Absorption Interferences', () => {
    it('should detect pH-dependent timing caution for Capecitabine + Omeprazole', () => {
      const res = checkColorectalDdi('capecitabine', ['omeprazole']);
      expect(res.overallStatus).toBe('warning');
      expect(res.cautionCount).toBe(1);
      expect(res.interactions[0].rule.riskLevel).toBe('timing_caution');
      expect(res.interactions[0].rule.timingRecommendation).toContain('间隔');
    });

    it('should detect efficacy impairment between Capecitabine and Allopurinol', () => {
      const res = checkColorectalDdi('capecitabine', ['allopurinol']);
      expect(res.overallStatus).toBe('warning');
      expect(res.cautionCount).toBe(1);
      expect(res.interactions[0].rule.clinicalGuidance).toContain('非布司他');
    });

    it('should detect bleeding surveillance caution for Bevacizumab + Aspirin', () => {
      const res = checkColorectalDdi('bevacizumab', ['aspirin']);
      expect(res.overallStatus).toBe('warning');
      expect(res.cautionCount).toBe(1);
      expect(res.interactions[0].rule.mechanism).toContain('VEGF');
    });
  });

  describe('Safe Combinations & Multi-Drug Scenarios', () => {
    it('should report safe when Pembrolizumab or Cetuximab is co-administered with Amlodipine', () => {
      const resPembro = checkColorectalDdi('pembrolizumab', ['amlodipine']);
      expect(resPembro.overallStatus).toBe('safe');
      expect(resPembro.severeCount).toBe(0);

      const resCetu = checkColorectalDdi('cetuximab', ['amlodipine']);
      expect(resCetu.overallStatus).toBe('safe');
      expect(resCetu.severeCount).toBe(0);
    });

    it('should accurately tally multiple mixed interactions (1 severe + 1 timing caution)', () => {
      const res = checkColorectalDdi('capecitabine', ['warfarin', 'omeprazole']);
      expect(res.overallStatus).toBe('danger');
      expect(res.severeCount).toBe(1);
      expect(res.cautionCount).toBe(1);
      expect(res.interactions.length).toBe(2);
    });

    it('should generate a 3-slot daily medication schedule', () => {
      const res = checkColorectalDdi('capecitabine', ['omeprazole']);
      expect(res.dailySchedulePlan).toBeDefined();
      expect(res.dailySchedulePlan.length).toBe(3);
      expect(res.dailySchedulePlan[0].timeSlot).toContain('07:00');
      expect(res.dailySchedulePlan[1].timeSlot).toContain('08:30');
      expect(res.dailySchedulePlan[2].timeSlot).toContain('20:30');
    });
  });

  describe('Polymorphic Routing via checkDrugInteractionsUnified', () => {
    it('should dispatch colorectal cancer checks properly via unified router', () => {
      const res = checkDrugInteractionsUnified('colorectal', 'capecitabine', ['warfarin']);
      expect(res.overallStatus).toBe('danger');
      expect(res.severeCount).toBe(1);
    });

    it('should infer cancer type when cancerType is null but targeted drug is colorectal', () => {
      const res = checkDrugInteractionsUnified(null, 'fruquintinib', ['rifampin']);
      expect(res.overallStatus).toBe('danger');
      expect(res.severeCount).toBe(1);
    });
  });
});
