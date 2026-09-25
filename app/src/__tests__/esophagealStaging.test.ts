import { describe, it, expect } from 'vitest';
import {
  normalizeEsophagealSubsite,
  normalizeDifferentiation,
  computeEsophagealStage,
  computeEsophagealClinicalCohort,
} from '../lib/esophagealStaging';
import { computeCancerStage, getClinicalCohortUnified } from '../lib/stagingRegistry';
import { CancerRegistry } from '../lib/cancerRegistry';
import { checkEsophagealDdi } from '../lib/esophagealDdiData';

describe('Esophageal Squamous Cell Carcinoma (ESCC) Staging Engine & Clinical Guidelines', () => {
  describe('Subsite and Differentiation Normalization', () => {
    it('should correctly normalize subsite by incisor distance in cm', () => {
      expect(normalizeEsophagealSubsite(null, 18)).toBe('cervical');
      expect(normalizeEsophagealSubsite(null, 23)).toBe('upper_thoracic');
      expect(normalizeEsophagealSubsite(null, 28)).toBe('middle_thoracic');
      expect(normalizeEsophagealSubsite(null, 36)).toBe('lower_thoracic');
    });

    it('should correctly normalize subsite by string aliases', () => {
      expect(normalizeEsophagealSubsite('颈段食管')).toBe('cervical');
      expect(normalizeEsophagealSubsite('胸上段')).toBe('upper_thoracic');
      expect(normalizeEsophagealSubsite('胸中段食管')).toBe('middle_thoracic');
      expect(normalizeEsophagealSubsite('胸下段及贲门')).toBe('lower_thoracic');
      expect(normalizeEsophagealSubsite('EGJ_siewert_1')).toBe('lower_thoracic');
      expect(normalizeEsophagealSubsite('unknown')).toBe('middle_thoracic');
    });

    it('should correctly normalize differentiation grades', () => {
      expect(normalizeDifferentiation('G1_well')).toBe('G1');
      expect(normalizeDifferentiation('高分化鳞癌')).toBe('G1');
      expect(normalizeDifferentiation('G2_moderate')).toBe('G2');
      expect(normalizeDifferentiation('中分化')).toBe('G2');
      expect(normalizeDifferentiation('G3_poor')).toBe('G3');
      expect(normalizeDifferentiation('低分化未分化')).toBe('G3');
      expect(normalizeDifferentiation(null)).toBe('G2');
    });
  });

  describe('AJCC 8th Edition ESCC Staging Combinations', () => {
    it('Stage 0: Tis N0 M0', () => {
      const res = computeEsophagealStage({
        tumorDepth: 'tis',
        nStage: 'N0',
        mStage: 'M0',
      });
      expect(res.stage).toBe('0');
      expect(res.riskTier).toBe('standard_low_risk');
      expect(res.guidelines![0]).toContain('内镜黏膜下剥离术');
    });

    it('Stage IA: T1a N0 M0 (Endoscopic ESD Indication)', () => {
      const res = computeEsophagealStage({
        tumorDepth: 't1a_mucosa',
        lymphNodesPositive: 0,
        mStage: 'M0',
      });
      expect(res.stage).toBe('IA');
      expect(res.tStage).toBe('T1a');
      expect(res.nStage).toBe('N0');
      expect(res.riskTier).toBe('standard_low_risk');
    });

    it('Stage IA vs IB: T1b N0 M0 stratified by differentiation G1 vs G2', () => {
      const resG1 = computeEsophagealStage({
        tumorDepth: 't1b_submucosa',
        differentiation: 'G1_well',
        lymphNodesPositive: 0,
        mStage: 'M0',
      });
      expect(resG1.stage).toBe('IA');

      const resG2 = computeEsophagealStage({
        tumorDepth: 't1b_submucosa',
        differentiation: 'G2_moderate',
        lymphNodesPositive: 0,
        mStage: 'M0',
      });
      expect(resG2.stage).toBe('IB');
    });

    it('Stage IB vs IIA: T2 N0 M0 stratified by differentiation G1 vs G2', () => {
      const resG1 = computeEsophagealStage({
        tumorDepth: 't2_muscularis',
        differentiation: 'G1_well',
        lymphNodesPositive: 0,
        mStage: 'M0',
      });
      expect(resG1.stage).toBe('IB');

      const resG2 = computeEsophagealStage({
        tumorDepth: 't2_muscularis',
        differentiation: 'G2_moderate',
        lymphNodesPositive: 0,
        mStage: 'M0',
      });
      expect(resG2.stage).toBe('IIA');
    });

    it('Stage IIA vs IIB: T3 N0 M0 stratified by subsite (upper vs middle) and grade', () => {
      // Middle thoracic + G1 -> IIA
      const resMiddleG1 = computeEsophagealStage({
        subsite: 'middle_thoracic',
        tumorDepth: 't3_adventitia',
        differentiation: 'G1_well',
        lymphNodesPositive: 0,
        mStage: 'M0',
      });
      expect(resMiddleG1.stage).toBe('IIA');

      // Upper thoracic + G1 -> IIB (upper thoracic shifts up to IIB in AJCC8 ESCC)
      const resUpperG1 = computeEsophagealStage({
        subsite: 'upper_thoracic',
        tumorDepth: 't3_adventitia',
        differentiation: 'G1_well',
        lymphNodesPositive: 0,
        mStage: 'M0',
      });
      expect(resUpperG1.stage).toBe('IIB');

      // Middle thoracic + G2 -> IIB
      const resMiddleG2 = computeEsophagealStage({
        subsite: 'middle_thoracic',
        tumorDepth: 't3_adventitia',
        differentiation: 'G2_moderate',
        lymphNodesPositive: 0,
        mStage: 'M0',
      });
      expect(resMiddleG2.stage).toBe('IIB');
    });

    it('Stage IIB: T1-2 N1 M0', () => {
      const res = computeEsophagealStage({
        tumorDepth: 't2_muscularis',
        lymphNodesPositive: 2, // N1
        mStage: 'M0',
      });
      expect(res.stage).toBe('IIB');
      expect(res.nStage).toBe('N1');
    });

    it('Stage IIIA: T3 N1 M0 (NEOCRTEC5010 indication)', () => {
      const res = computeEsophagealStage({
        tumorDepth: 't3_adventitia',
        lymphNodesPositive: 1, // N1
        mStage: 'M0',
      });
      expect(res.stage).toBe('IIIA');
      expect(res.riskTier).toBe('intermediate_risk');
      expect(res.guidelines![0]).toContain('NEOCRTEC5010');
    });

    it('Stage IIIA: T1-2 N2 M0 and T4a N0 M0', () => {
      const resT2N2 = computeEsophagealStage({
        tumorDepth: 't2_muscularis',
        lymphNodesPositive: 4, // N2
        mStage: 'M0',
      });
      expect(resT2N2.stage).toBe('IIIA');

      const resT4aN0 = computeEsophagealStage({
        tumorDepth: 't4a_resectable',
        lymphNodesPositive: 0, // N0
        mStage: 'M0',
      });
      expect(resT4aN0.stage).toBe('IIIA');
    });

    it('Stage IIIB: T3 N2 M0, T4a N1-2 M0, T4b N0-1 M0', () => {
      const resT3N2 = computeEsophagealStage({
        tumorDepth: 't3_adventitia',
        lymphNodesPositive: 5, // N2
        mStage: 'M0',
      });
      expect(resT3N2.stage).toBe('IIIB');

      const resT4bN1 = computeEsophagealStage({
        tumorDepth: 't4b_unresectable',
        lymphNodesPositive: 1, // N1
        mStage: 'M0',
      });
      expect(resT4bN1.stage).toBe('IIIB');
      expect(resT4bN1.isFistulaRisk).toBe(true);
    });

    it('Stage IVA: T4b N2 M0 and Any T N3 M0', () => {
      const resT4bN2 = computeEsophagealStage({
        tumorDepth: 't4b_unresectable',
        lymphNodesPositive: 3, // N2
        mStage: 'M0',
      });
      expect(resT4bN2.stage).toBe('IVA');
      expect(resT4bN2.riskTier).toBe('high_risk');

      const resN3 = computeEsophagealStage({
        tumorDepth: 't2_muscularis',
        lymphNodesPositive: 8, // N3
        mStage: 'M0',
      });
      expect(resN3.stage).toBe('IVA');
      expect(resN3.nStage).toBe('N3');
    });

    it('Stage IVB: Distant metastasis M1', () => {
      const res = computeEsophagealStage({
        tumorDepth: 't2_muscularis',
        lymphNodesPositive: 0,
        mStage: 'M1',
        hasDistantMets: true,
        metastasisSites: ['liver', 'bone'],
      });
      expect(res.stage).toBe('IVB');
      expect(res.mStage).toBe('M1');
      expect(res.riskTier).toBe('high_risk');
      expect(res.guidelines![0]).toContain('卡瑞利珠单抗 ESCORT-1st');
    });
  });

  describe('Surgical & Clinical Quality Controls and High-Risk Alerts', () => {
    it('should issue an understaging warning if examined lymph nodes < 15', () => {
      const res = computeEsophagealStage({
        tumorDepth: 't2_muscularis',
        lymphNodesExamined: 9, // < 15
        lymphNodesPositive: 0,
      });
      expect(res.isLymphNodeAdequate).toBe(false);
      expect(res.warnings!.some((w: string) => w.includes('病理质控预警') && w.includes('仅 9 枚'))).toBe(true);
    });

    it('should consider lymph node clearance adequate if examined nodes >= 15', () => {
      const res = computeEsophagealStage({
        tumorDepth: 't2_muscularis',
        lymphNodesExamined: 22,
        lymphNodesPositive: 1,
      });
      expect(res.isLymphNodeAdequate).toBe(true);
      expect(res.warnings!.some((w: string) => w.includes('病理质控预警'))).toBe(false);
    });

    it('should trigger Tracheoesophageal Fistula (TEF) emergency alert for T4b or airwayInvasionRisk', () => {
      const res = computeEsophagealStage({
        tumorDepth: 't3_adventitia',
        airwayInvasionRisk: true,
      });
      expect(res.isFistulaRisk).toBe(true);
      expect(res.warnings!.some((w: string) => w.includes('气管食管瘘 (TEF) 极度危险'))).toBe(true);
    });

    it('should trigger Aorta invasion rupture alert for aorticInvasionRisk', () => {
      const res = computeEsophagealStage({
        tumorDepth: 't4a_resectable',
        aorticInvasionRisk: true,
      });
      expect(res.warnings!.some((w: string) => w.includes('主动脉受侵破裂预警'))).toBe(true);
    });

    it('should trigger SCC and CYFRA21-1 tumor marker elevation notifications', () => {
      const res = computeEsophagealStage({
        tumorDepth: 't2_muscularis',
        sccAntigen: 4.8, // > 1.5
        cyfra211: 7.2, // > 3.3
      });
      expect(res.sccElevated).toBe(true);
      expect(res.warnings!.some((w: string) => w.includes('鳞癌标志物升高') && w.includes('4.8 ng/mL'))).toBe(true);
      expect(res.warnings!.some((w: string) => w.includes('CYFRA21-1 升高') && w.includes('7.2 ng/mL'))).toBe(true);
    });

    it('should classify lower thoracic supraclavicular node metastasis as M1', () => {
      const res = computeEsophagealStage({
        subsite: 'lower_thoracic',
        tumorDepth: 't2_muscularis',
        supraclavicularNodePositive: true,
      });
      expect(res.mStage).toBe('M1');
      expect(res.stage).toBe('IVB');
      expect(res.warnings!.some((w: string) => w.includes('胸下段食管癌出现锁骨上淋巴结转移'))).toBe(true);
    });
  });

  describe('Clinical Trial Cohort Matching', () => {
    it('matches ESD early cohort for Stage IA/0', () => {
      const cohort = computeEsophagealClinicalCohort({ stage: 'IA' });
      expect(cohort.cohortId).toBe('ESD_Early_ESCC_Cohort');
      expect(cohort.fiveYearOsRate).toBe(0.952);
    });

    it('matches NEOCRTEC5010 nCRT cohort for Stage IIB/III', () => {
      const cohort = computeEsophagealClinicalCohort({ stage: 'IIIA' });
      expect(cohort.cohortId).toBe('NEOCRTEC5010_nCRT_Cohort');
      expect(cohort.overallSurvivalMonths).toBe(100.1);
      expect(cohort.fiveYearOsRate).toBe(0.591);
      expect(cohort.description).toContain('长春瑞滨 + 顺铂联合 40.0 Gy');
    });

    it('matches ESCORT-1st Camrelizumab cohort for Stage IV', () => {
      const cohort = computeEsophagealClinicalCohort({ stage: 'IVB', clinicalData: { pdl1Cps: 15 } });
      expect(cohort.cohortId).toBe('ESCORT_1st_Camrelizumab_Cohort');
      expect(cohort.overallSurvivalMonths).toBe(15.3);
      expect(cohort.description).toContain('卡瑞利珠单抗联合紫杉醇 + 顺铂');
    });
  });

  describe('Unified Cancer Registry & Dispatch Center Integration', () => {
    it('should dispatch via CancerRegistry computeCancerStage with "esophageal"', () => {
      const res = computeCancerStage('esophageal', {
        tumorDepth: 't3_adventitia',
        differentiation: 'G2',
        lymphNodesPositive: 1,
      });
      expect(res.stage).toBe('IIIA');
      expect(res.subsite).toBe('middle_thoracic');
    });

    it('should normalize Chinese aliases ("食管癌", "食管", "escc", "esophagus")', () => {
      const res1 = computeCancerStage('食管癌', { tumorDepth: 't1a_mucosa', lymphNodesPositive: 0 });
      expect(res1.stage).toBe('IA');

      const res2 = computeCancerStage('escc', { tumorDepth: 't1a_mucosa', lymphNodesPositive: 0 });
      expect(res2.stage).toBe('IA');

      const res3 = computeCancerStage('食道癌', { tumorDepth: 't1a_mucosa', lymphNodesPositive: 0 });
      expect(res3.stage).toBe('IA');
    });

    it('should dispatch getClinicalCohortUnified correctly for esophageal', () => {
      const cohort = getClinicalCohortUnified({ cancerType: 'esophageal', stage: 'IIIB' });
      expect(cohort.cohortId).toBe('NEOCRTEC5010_nCRT_Cohort');
    });

    it('verifies esophageal plugin metadata and pharmacology in CancerRegistry', () => {
      const plugin = CancerRegistry.get('esophageal');
      expect(plugin).toBeDefined();
      expect(plugin!.name).toBe('食管癌');
      expect(plugin!.guidelineStandard).toContain('AJCC 8th ESCC');
      expect(plugin!.pharmacology.defaultTargetDrugId).toBe('camrelizumab');
      expect(plugin!.content?.wikiTopics?.length).toBe(25);
    });

    it('should analyze DDI interactions for esophageal drugs (e.g. anlotinib + anticoagulants)', () => {
      const ddiRes = checkEsophagealDdi('anlotinib', ['warfarin']);
      expect(ddiRes.severeCount).toBeGreaterThan(0);
      expect(ddiRes.overallStatus).toBe('danger');
      expect(ddiRes.summaryText).toContain('穿孔大出血');
    });
  });
});
