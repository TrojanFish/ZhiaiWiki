import { describe, it, expect } from 'vitest';
import {
  computeColorectalTStage,
  computeColorectalNStage,
  computeColorectalMStage,
  computeColorectalStageGroup,
  computeColorectalStage,
  getColorectalClinicalCohort,
} from '../lib/colorectalStaging';
import { computeCancerStage } from '../lib/stagingRegistry';

describe('AJCC 8th Edition Colorectal Cancer (CRC) Staging Engine', () => {
  describe('T Stage Derivation', () => {
    it('should respect explicit T stage strings', () => {
      expect(computeColorectalTStage({ tStage: 'Tis' })).toBe('Tis');
      expect(computeColorectalTStage({ tStage: 'T1' })).toBe('T1');
      expect(computeColorectalTStage({ tStage: 'T2' })).toBe('T2');
      expect(computeColorectalTStage({ tStage: 'T3' })).toBe('T3');
      expect(computeColorectalTStage({ tStage: 'T4a' })).toBe('T4a');
      expect(computeColorectalTStage({ tStage: 'T4b' })).toBe('T4b');
    });

    it('should correctly derive T stage based on anatomical depth of invasion', () => {
      expect(computeColorectalTStage({ tumorDepth: 'mucosa' })).toBe('Tis');
      expect(computeColorectalTStage({ tumorDepth: '原位癌' })).toBe('Tis');
      expect(computeColorectalTStage({ tumorDepth: 'submucosa' })).toBe('T1');
      expect(computeColorectalTStage({ tumorDepth: '浸润至黏膜下层' })).toBe('T1');
      expect(computeColorectalTStage({ tumorDepth: 'muscularis_propria' })).toBe('T2');
      expect(computeColorectalTStage({ tumorDepth: '侵及固有肌层' })).toBe('T2');
      expect(computeColorectalTStage({ tumorDepth: 'subserosa' })).toBe('T3');
      expect(computeColorectalTStage({ tumorDepth: '穿透肌层达浆膜下纤维结缔组织' })).toBe('T3');
      expect(computeColorectalTStage({ tumorDepth: 'peritoneal_perforation' })).toBe('T4a');
      expect(computeColorectalTStage({ tumorDepth: '穿透脏层腹膜表面' })).toBe('T4a');
      expect(computeColorectalTStage({ tumorDepth: 'adjacent_organ' })).toBe('T4b');
      expect(computeColorectalTStage({ tumorDepth: '直接侵犯相邻膀胱及前列腺器官受侵' })).toBe('T4b');
    });

    it('should fallback gracefully to T1 when depth is unstated', () => {
      expect(computeColorectalTStage({})).toBe('T1');
    });
  });

  describe('N Stage Derivation (Including N1c Tumor Deposits)', () => {
    it('should respect explicit N stage strings', () => {
      expect(computeColorectalNStage({ nStage: 'N0' })).toBe('N0');
      expect(computeColorectalNStage({ nStage: 'N1a' })).toBe('N1a');
      expect(computeColorectalNStage({ nStage: 'N1b' })).toBe('N1b');
      expect(computeColorectalNStage({ nStage: 'N1c' })).toBe('N1c');
      expect(computeColorectalNStage({ nStage: 'N2a' })).toBe('N2a');
      expect(computeColorectalNStage({ nStage: 'N2b' })).toBe('N2b');
    });

    it('should accurately classify N stage based on positive lymph node count', () => {
      expect(computeColorectalNStage({ lymphNodesPositive: 0 })).toBe('N0');
      expect(computeColorectalNStage({ lymphNodesPositive: 1 })).toBe('N1a');
      expect(computeColorectalNStage({ lymphNodesPositive: 2 })).toBe('N1b');
      expect(computeColorectalNStage({ lymphNodesPositive: 3 })).toBe('N1b');
      expect(computeColorectalNStage({ lymphNodesPositive: 4 })).toBe('N2a');
      expect(computeColorectalNStage({ lymphNodesPositive: 6 })).toBe('N2a');
      expect(computeColorectalNStage({ lymphNodesPositive: 7 })).toBe('N2b');
      expect(computeColorectalNStage({ lymphNodesPositive: 15 })).toBe('N2b');
    });

    it('should strictly assign N1c when 0 positive lymph nodes but tumor deposits (TD+) are present (AJCC 8th Key Rule)', () => {
      expect(computeColorectalNStage({ lymphNodesPositive: 0, tumorDeposits: 'present' })).toBe('N1c');
      expect(computeColorectalNStage({ lymphNodesPositive: 0, tumorDeposits: 2 })).toBe('N1c');
      expect(computeColorectalNStage({ lymphNodesPositive: 0, tumorDeposits: '可见浆膜下癌结节沉积' })).toBe('N1c');
      expect(computeColorectalNStage({ tumorDeposits: 'present' })).toBe('N1c');
    });

    it('should prioritize true positive lymph nodes over tumor deposits for N1a-N2b', () => {
      // AJCC 8th: TD is only scored as N1c if lymph nodes are completely negative
      expect(computeColorectalNStage({ lymphNodesPositive: 1, tumorDeposits: 'present' })).toBe('N1a');
      expect(computeColorectalNStage({ lymphNodesPositive: 2, tumorDeposits: 'present' })).toBe('N1b');
      expect(computeColorectalNStage({ lymphNodesPositive: 5, tumorDeposits: 3 })).toBe('N2a');
    });
  });

  describe('M Stage Derivation', () => {
    it('should classify M0 when no distant metastases', () => {
      expect(computeColorectalMStage({ hasDistantMets: false, metastasisSites: [] })).toBe('M0');
    });

    it('should classify M1a for single organ metastasis', () => {
      expect(computeColorectalMStage({ metastasisSites: ['liver'] })).toBe('M1a');
      expect(computeColorectalMStage({ metastasisSites: ['lung'] })).toBe('M1a');
      expect(computeColorectalMStage({ hasDistantMets: true, metastasisSites: [] })).toBe('M1a');
    });

    it('should classify M1b for multiple organ metastases without peritoneal involvement', () => {
      expect(computeColorectalMStage({ metastasisSites: ['liver', 'lung'] })).toBe('M1b');
      expect(computeColorectalMStage({ metastasisSites: ['liver', 'bone', 'brain'] })).toBe('M1b');
    });

    it('should strictly classify M1c when peritoneal metastasis is present (AJCC 8th Key Rule)', () => {
      expect(computeColorectalMStage({ peritonealMets: true })).toBe('M1c');
      expect(computeColorectalMStage({ metastasisSites: ['peritoneum'] })).toBe('M1c');
      expect(computeColorectalMStage({ metastasisSites: ['liver', '腹膜种植转移'] })).toBe('M1c');
      expect(computeColorectalMStage({ metastasisSites: ['大网膜转移', 'lung'] })).toBe('M1c');
    });
  });

  describe('AJCC 8th Stage Grouping Matrix', () => {
    it('should correctly identify Stage 0 and Stage I', () => {
      expect(computeColorectalStageGroup('Tis', 'N0', 'M0')).toBe('0');
      expect(computeColorectalStageGroup('T1', 'N0', 'M0')).toBe('I');
      expect(computeColorectalStageGroup('T2', 'N0', 'M0')).toBe('I');
    });

    it('should correctly identify Stage II substages', () => {
      expect(computeColorectalStageGroup('T3', 'N0', 'M0')).toBe('IIA');
      expect(computeColorectalStageGroup('T4a', 'N0', 'M0')).toBe('IIB');
      expect(computeColorectalStageGroup('T4b', 'N0', 'M0')).toBe('IIC');
    });

    it('should correctly identify Stage IIIA substages', () => {
      expect(computeColorectalStageGroup('T1', 'N1a', 'M0')).toBe('IIIA');
      expect(computeColorectalStageGroup('T1', 'N1b', 'M0')).toBe('IIIA');
      expect(computeColorectalStageGroup('T1', 'N1c', 'M0')).toBe('IIIA');
      expect(computeColorectalStageGroup('T2', 'N1a', 'M0')).toBe('IIIA');
      expect(computeColorectalStageGroup('T1', 'N2a', 'M0')).toBe('IIIA');
    });

    it('should correctly identify Stage IIIB substages', () => {
      expect(computeColorectalStageGroup('T3', 'N1a', 'M0')).toBe('IIIB');
      expect(computeColorectalStageGroup('T3', 'N1b', 'M0')).toBe('IIIB');
      expect(computeColorectalStageGroup('T3', 'N1c', 'M0')).toBe('IIIB');
      expect(computeColorectalStageGroup('T4a', 'N1a', 'M0')).toBe('IIIB');
      expect(computeColorectalStageGroup('T2', 'N2a', 'M0')).toBe('IIIB');
      expect(computeColorectalStageGroup('T3', 'N2a', 'M0')).toBe('IIIB');
      expect(computeColorectalStageGroup('T1', 'N2b', 'M0')).toBe('IIIB');
      expect(computeColorectalStageGroup('T2', 'N2b', 'M0')).toBe('IIIB');
    });

    it('should correctly identify Stage IIIC substages', () => {
      expect(computeColorectalStageGroup('T4a', 'N2a', 'M0')).toBe('IIIC');
      expect(computeColorectalStageGroup('T3', 'N2b', 'M0')).toBe('IIIC');
      expect(computeColorectalStageGroup('T4a', 'N2b', 'M0')).toBe('IIIC');
      expect(computeColorectalStageGroup('T4b', 'N1a', 'M0')).toBe('IIIC');
      expect(computeColorectalStageGroup('T4b', 'N2b', 'M0')).toBe('IIIC');
    });

    it('should correctly identify Stage IV substages', () => {
      expect(computeColorectalStageGroup('T3', 'N1a', 'M1a')).toBe('IVA');
      expect(computeColorectalStageGroup('T4b', 'N2b', 'M1b')).toBe('IVB');
      expect(computeColorectalStageGroup('T2', 'N0', 'M1c')).toBe('IVC');
    });
  });

  describe('Integrated computeColorectalStage & Clinical Guidance', () => {
    it('should generate quality control warning when examined lymph nodes < 12', () => {
      const res = computeColorectalStage({
        tStage: 'T3',
        nStage: 'N0',
        mStage: 'M0',
        lymphNodesExamined: 8,
      });
      expect(res.stage).toBe('IIA');
      expect(res.explanation).toContain('清扫检出淋巴结总数为 8 枚');
      expect(res.explanation).toContain('≥ 12 枚');
    });

    it('should identify low rectal tumor (< 5cm) and CRM / EMVI risk', () => {
      const res = computeColorectalStage({
        tStage: 'T3',
        nStage: 'N1a',
        mStage: 'M0',
        primaryLocation: 'rectum',
        distanceFromAnalVerge: 3.5,
        crmStatus: 'positive',
        crmDistance: 0.5,
        emviStatus: 'positive',
      });
      expect(res.explanation).toContain('距肛门齿状线/肛缘 3.5cm');
      expect(res.explanation).toContain('环周切缘 (CRM) 阳性');
      expect(res.explanation).toContain('肠壁外脉管侵犯 (EMVI) 阳性');
    });

    it('should recommend chemotherapy exemption for Stage II MSI-H/dMMR patients', () => {
      const res = computeColorectalStage({
        tStage: 'T3',
        nStage: 'N0',
        mStage: 'M0',
        msiStatus: 'MSI-H',
      });
      expect(res.stage).toBe('IIA');
      expect(res.treatmentDirection).toContain('dMMR / MSI-H II期结肠癌');
      expect(res.treatmentDirection).toContain('豁免辅助化疗');
    });

    it('should recommend 3 months CAPOX de-escalation for Low-Risk Stage III (IDEA Trial)', () => {
      const res = computeColorectalStage({
        tStage: 'T2',
        nStage: 'N1a',
        mStage: 'M0',
      });
      expect(res.stage).toBe('IIIA');
      expect(res.treatmentDirection).toContain('低危 III 期结直肠癌（T1-3 N1）');
      expect(res.treatmentDirection).toContain('3 个月 CAPOX 减毒方案');
    });

    it('should recommend 6 months CAPOX/FOLFOX for High-Risk Stage III (IDEA Trial)', () => {
      const res = computeColorectalStage({
        tStage: 'T4a',
        nStage: 'N2a',
        mStage: 'M0',
      });
      expect(res.stage).toBe('IIIC');
      expect(res.treatmentDirection).toContain('高危 III 期结直肠癌（T4 或 N2）');
      expect(res.treatmentDirection).toContain('6 个月 CAPOX');
    });
  });

  describe('IDEA & KEYNOTE-177 Clinical Cohort Derivation', () => {
    it('should match Stage I CRC cohort with high 5-year OS', () => {
      const cohort = getColorectalClinicalCohort({ stage: 'I' });
      expect(cohort.name).toBe('AJCC8_Stage1_CRC_Cohort');
      expect(cohort.os5Year).toBe('97.5%');
      expect(cohort.riskTier).toBe('minimal_risk');
    });

    it('should match NSABP C-08 dMMR cohort for Stage II MSI-H', () => {
      const cohort = getColorectalClinicalCohort({
        stage: 'IIA',
        msiStatus: 'MSI-H',
      });
      expect(cohort.name).toBe('NSABP_C08_dMMR_Stage2');
      expect(cohort.keyFactors).toContain('dMMR免辅助化疗');
      expect(cohort.os5Year).toBe('95.0%');
    });

    it('should match MOSAIC/QUASAR cohort for Stage II MSS', () => {
      const cohort = getColorectalClinicalCohort({
        stage: 'IIA',
        msiStatus: 'MSS',
      });
      expect(cohort.name).toBe('MOSAIC_Quasar_Stage2');
      expect(cohort.os5Year).toBe('89.0%');
    });

    it('should match IDEA Low-Risk Cohort (T1-3 N1) with 3-month CAPOX benefit', () => {
      const cohort = getColorectalClinicalCohort({
        stage: 'IIIA',
        tStage: 'T2',
        nStage: 'N1',
      });
      expect(cohort.name).toBe('IDEA_LowRisk_Cohort');
      expect(cohort.keyFactors).toContain('3个月CAPOX减毒方案');
      expect(cohort.rfs5Year).toBe('83.1%');
    });

    it('should match IDEA High-Risk Cohort (T4 or N2) with 6-month CAPOX requirement', () => {
      const cohort = getColorectalClinicalCohort({
        stage: 'IIIC',
        tStage: 'T4a',
        nStage: 'N2a',
      });
      expect(cohort.name).toBe('IDEA_HighRisk_Cohort');
      expect(cohort.keyFactors).toContain('6个月足疗程CAPOX/FOLFOX');
      expect(cohort.rfs5Year).toBe('64.0%');
    });

    it('should match KEYNOTE-177 cohort for Stage IV MSI-H/dMMR', () => {
      const cohort = getColorectalClinicalCohort({
        stage: 'IV',
        mStage: 'M1a',
        msiStatus: 'MSI-H',
      });
      expect(cohort.name).toBe('KEYNOTE177_MSIH_Cohort');
      expect(cohort.keyFactors).toContain('PD-1单抗一线');
      expect(cohort.os5Year).toBe('61.4%');
    });

    it('should match CALGB 80405 / FIRE-3 cohort for Stage IV MSS', () => {
      const cohort = getColorectalClinicalCohort({
        stage: 'IV',
        mStage: 'M1a',
        msiStatus: 'MSS',
      });
      expect(cohort.name).toBe('CALGB80405_FIRE3_Cohort');
      expect(cohort.source).toContain('CALGB/SWOG 80405');
    });
  });

  describe('StagingRegistry Polymorphic Routing', () => {
    it('should seamlessly route colorectal cancer through computeCancerStage', () => {
      const res = computeCancerStage('colorectal', {
        tStage: 'T3',
        nStage: 'N1a',
        mStage: 'M0',
      });
      expect(res.cancerType).toBe('colorectal');
      expect(res.stage).toBe('IIIB');
      expect(res.versionNotice).toContain('AJCC 第 8 版');
    });
  });
});
