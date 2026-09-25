import { describe, it, expect } from 'vitest';
import { checkBreastDdi, BREAST_TARGETED_DRUGS, BREAST_DDI_RULES } from '../lib/breastDdiData';

describe('Breast Cancer DDI Pharmacovigilance Engine', () => {
  it('should intercept severe contraindication between Tamoxifen and Paroxetine (CYP2D6 inhibition)', () => {
    const res = checkBreastDdi('tamoxifen', ['paroxetine']);
    expect(res.overallStatus).toBe('danger');
    expect(res.severeCount).toBe(1);
    expect(res.interactions[0].rule.riskLevel).toBe('severe_contraindication');
    expect(res.interactions[0].rule.clinicalGuidance).toContain('严禁合用帕罗西汀');
  });

  it('should intercept severe contraindication between Tamoxifen and Fluoxetine', () => {
    const res = checkBreastDdi('tamoxifen', ['fluoxetine']);
    expect(res.overallStatus).toBe('danger');
    expect(res.severeCount).toBe(1);
  });

  it('should intercept severe caution between Abemaciclib and Clarithromycin (CYP3A4 inhibition)', () => {
    const res = checkBreastDdi('abemaciclib', ['clarithromycin']);
    expect(res.overallStatus).toBe('danger');
    expect(res.severeCount).toBe(1);
    expect(res.interactions[0].rule.title).toContain('CDK4/6');
  });

  it('should recommend Letrozole with Calcium & Vitamin D3 as safe & beneficial', () => {
    const res = checkBreastDdi('letrozole', ['calcium_vitd']);
    expect(res.overallStatus).toBe('safe');
    expect(res.safeCount).toBe(1);
    expect(res.interactions[0].rule.riskLevel).toBe('compatible_safe');
  });

  it('should return safe when no interacting drugs are selected', () => {
    const res = checkBreastDdi('trastuzumab', ['aspirin']);
    expect(res.overallStatus).toBe('safe');
    expect(res.severeCount).toBe(0);
  });

  it('should detect multiple simultaneous severe contraindications (e.g. Tamoxifen + Paroxetine + Warfarin)', () => {
    const res = checkBreastDdi('tamoxifen', ['paroxetine', 'warfarin']);
    expect(res.overallStatus).toBe('danger');
    expect(res.severeCount).toBe(2);
    expect(res.interactions.length).toBe(2);
  });

  it('should intercept severe contraindication between CDK4/6 inhibitors and strong CYP3A4 inducers (Rifampin)', () => {
    const resAbem = checkBreastDdi('abemaciclib', ['rifampin']);
    expect(resAbem.overallStatus).toBe('danger');
    expect(resAbem.severeCount).toBe(1);

    const resPalbo = checkBreastDdi('palbociclib', ['rifampin']);
    expect(resPalbo.overallStatus).toBe('danger');
    expect(resPalbo.severeCount).toBe(1);
  });

  it('should intercept severe contraindication between Olaparib and Clarithromycin', () => {
    const res = checkBreastDdi('olaparib', ['clarithromycin']);
    expect(res.overallStatus).toBe('danger');
    expect(res.severeCount).toBe(1);
    expect(res.interactions[0].rule.mechanism).toContain('奥拉帕利');
  });

  it('should include 14 standard-of-care breast cancer drugs in the formulary', () => {
    expect(BREAST_TARGETED_DRUGS.length).toBeGreaterThanOrEqual(14);
    const ids = BREAST_TARGETED_DRUGS.map(d => d.id);
    expect(ids).toContain('tamoxifen');
    expect(ids).toContain('letrozole');
    expect(ids).toContain('anastrozole');
    expect(ids).toContain('exemestane');
    expect(ids).toContain('fulvestrant');
    expect(ids).toContain('abemaciclib');
    expect(ids).toContain('palbociclib');
    expect(ids).toContain('ribociclib');
    expect(ids).toContain('trastuzumab');
    expect(ids).toContain('pertuzumab');
    expect(ids).toContain('trastuzumab_emtansine');
    expect(ids).toContain('trastuzumab_deruxtecan');
    expect(ids).toContain('olaparib');
    expect(ids).toContain('pembrolizumab');
  });

  it('should safely handle unknown drug ID without crashing', () => {
    const res = checkBreastDdi('non_existent_drug', ['aspirin']);
    expect(res.targetedDrug).toBeNull();
    expect(res.overallStatus).toBe('safe');
    expect(res.severeCount).toBe(0);
  });

  it('should generate a structured daily schedule plan with time slots', () => {
    const res = checkBreastDdi('letrozole', ['calcium_vitd']);
    expect(res.dailySchedulePlan).toBeDefined();
    expect(res.dailySchedulePlan.length).toBeGreaterThanOrEqual(2);
    expect(res.dailySchedulePlan[0].timeSlot).toBeDefined();
    expect(res.dailySchedulePlan[0].drugs.length).toBeGreaterThan(0);
  });
});
