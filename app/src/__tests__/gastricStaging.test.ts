import { describe, it, expect } from 'vitest';
import {
  computeGastricStage,
  getGastricClinicalCohort,
} from '../lib/gastricStaging';
import { computeCancerStage, getClinicalCohortUnified } from '../lib/stagingRegistry';
import { CancerRegistry } from '../lib/cancerRegistry';

describe('Gastric Cancer Dedicated Staging Engine (AJCC 8th & CSCO 2024 / JGCA 6th)', () => {
  describe('Early Gastric Cancer ESD Indications & Organ Preservation', () => {
    it('should qualify cT1a differentiated, ulcer-negative, <= 2cm as ESD absolute indication', () => {
      const result = computeGastricStage({
        tStage: 'T1a',
        nStage: 'N0',
        mStage: 'M0',
        tumorSize: 1.5,
        differentiation: 'well',
        hasUlcer: false,
      });

      expect(result.cancerType).toBe('gastric');
      expect(result.stage).toBe('IA');
      expect(result.isEsdIndication).toBe(true);
      expect(result.explanation).toContain('ESD 绝对适应证');
      expect(result.explanation).toContain('免开刀保留全胃');
      expect(result.explanation).toContain('治愈性切除');
    });

    it('should qualify cT1a differentiated, ulcer-positive, <= 3cm as ESD expanded indication', () => {
      const result = computeGastricStage({
        tStage: 'T1a',
        nStage: 'N0',
        mStage: 'M0',
        tumorSize: 2.5,
        differentiation: 'moderate',
        hasUlcer: true,
      });

      expect(result.isEsdIndication).toBe(true);
      expect(result.explanation).toContain('ESD 扩大适应证');
      expect(result.explanation).toContain('溃疡');
    });

    it('should qualify cT1a undifferentiated, ulcer-negative, <= 2cm as ESD expanded indication', () => {
      const result = computeGastricStage({
        tStage: 'T1a',
        nStage: 'N0',
        mStage: 'M0',
        tumorSize: 1.8,
        differentiation: 'poor',
        hasUlcer: false,
      });

      expect(result.isEsdIndication).toBe(true);
      expect(result.explanation).toContain('未分化型扩大适应证');
    });

    it('should disqualify submucosal invasive cT1b from ESD, recommending D2 gastrectomy', () => {
      const result = computeGastricStage({
        tStage: 'T1b',
        nStage: 'N0',
        mStage: 'M0',
        tumorSize: 2.5,
      });

      expect(result.isEsdIndication).toBe(false);
      expect(result.explanation).toContain('超声内镜 (EUS) 提示已侵及黏膜下层 (cT1b)');
      expect(result.explanation).toContain('D2 根治术');
    });
  });

  describe('D2 Lymph Node Dissection Quality Control (16-Node Rule)', () => {
    it('should confirm standard D2 quality control when examined lymph nodes >= 16', () => {
      const result = computeGastricStage({
        tStage: 'T3',
        nStage: 'N1',
        mStage: 'M0',
        lymphNodesExamined: 24,
      });

      expect(result.isD2Adequate).toBe(true);
      expect(result.explanation).toContain('D2 淋巴结清扫质控达标');
      expect(result.explanation).toContain('24 枚 (>= 16 枚)');
    });

    it('should alert for stage underestimation when examined lymph nodes < 16', () => {
      const result = computeGastricStage({
        tStage: 'T3',
        nStage: 'N0',
        mStage: 'M0',
        lymphNodesExamined: 11,
      });

      expect(result.isD2Adequate).toBe(false);
      expect(result.explanation).toContain('淋巴结检出总数不足 16 枚质控红线');
      expect(result.explanation).toContain('分期低估');
      expect(result.explanation).toContain('强化辅助化疗');
    });
  });

  describe('Lauren Classification & Borrmann Gross Morphology', () => {
    it('should detail diffuse / signet-ring cell carcinoma biology and peritoneal caution', () => {
      const result = computeGastricStage({
        tStage: 'T4a',
        nStage: 'N2',
        mStage: 'M0',
        laurenType: 'diffuse',
        isSignetRingCell: true,
      });

      expect(result.explanation).toContain('弥漫型 (含印戒细胞癌 / 低黏附性癌)');
      expect(result.explanation).toContain('散在浸润');
      expect(result.explanation).toContain('腹膜种植转移');
      expect(result.explanation).toContain('腹腔灌洗脱落细胞学 (CY0/CY1)');
    });

    it('should detail intestinal type tubular adenocarcinoma characteristics', () => {
      const result = computeGastricStage({
        tStage: 'T2',
        nStage: 'N0',
        mStage: 'M0',
        laurenType: 'intestinal',
      });

      expect(result.explanation).toContain('肠型胃癌');
      expect(result.explanation).toContain('管状腺癌');
    });

    it('should flag Borrmann IV linitis plastica (革囊胃) with poor gastric elasticity', () => {
      const result = computeGastricStage({
        tStage: 'T4a',
        nStage: 'N1',
        mStage: 'M0',
        borrmannType: 'IV',
      });

      expect(result.explanation).toContain('Borrmann IV 型 (弥漫浸润型 / 革囊胃)');
      expect(result.explanation).toContain('全胃壁僵硬');
    });
  });

  describe('Gastric Molecular Biomarkers (HER2, Claudin 18.2, PD-L1 CPS, dMMR)', () => {
    it('should recommend ToGA trastuzumab regimen for HER2-positive gastric cancer', () => {
      const result = computeGastricStage({
        tStage: 'T4a',
        nStage: 'N2',
        mStage: 'M1',
        her2Status: 'positive',
      });

      expect(result.stage).toBe('IV');
      expect(result.explanation).toContain('HER2 阳性胃癌');
      expect(result.explanation).toContain('ToGA 试验');
      expect(result.explanation).toContain('曲妥珠单抗联合化疗');
    });

    it('should recommend SPOTLIGHT/GLOW zolbetuximab for Claudin 18.2-positive gastric cancer', () => {
      const result = computeGastricStage({
        tStage: 'T4b',
        nStage: 'N3a',
        mStage: 'M1',
        claudin18_2Status: 'positive',
        claudin18_2Percentage: 85,
      });

      expect(result.explanation).toContain('Claudin 18.2 阳性靶标');
      expect(result.explanation).toContain('85%');
      expect(result.explanation).toContain('佐妥昔单抗 (Zolbetuximab)');
      expect(result.explanation).toContain('SPOTLIGHT / GLOW');
    });

    it('should recommend CheckMate-649 nivolumab for PD-L1 CPS >= 5 gastric cancer', () => {
      const result = computeGastricStage({
        tStage: 'T4a',
        nStage: 'N1',
        mStage: 'M1',
        pdl1Cps: 10,
      });

      expect(result.explanation).toContain('PD-L1 表达阳性 (CPS = 10)');
      expect(result.explanation).toContain('CheckMate-649 试验');
      expect(result.explanation).toContain('纳武利尤单抗');
    });

    it('should recommend immunotherapy for dMMR / MSI-H gastric cancer', () => {
      const result = computeGastricStage({
        tStage: 'T3',
        nStage: 'N1',
        mStage: 'M0',
        msiStatus: 'MSI-H',
      });

      expect(result.explanation).toContain('dMMR / 高度微卫星不稳定 (MSI-H)');
      expect(result.explanation).toContain('免疫检查点抑制剂 (PD-1)');
    });
  });

  describe('AJCC 8th Edition Gastric TNM Staging Accuracy', () => {
    it('should compute Stage IA for T1a N0 M0', () => {
      const res = computeGastricStage({ tStage: 'T1a', nStage: 'N0', mStage: 'M0' });
      expect(res.stage).toBe('IA');
    });

    it('should compute Stage IB for T2 N0 M0', () => {
      const res = computeGastricStage({ tStage: 'T2', nStage: 'N0', mStage: 'M0' });
      expect(res.stage).toBe('IB');
    });

    it('should compute Stage IIA for T3 N0 M0', () => {
      const res = computeGastricStage({ tStage: 'T3', nStage: 'N0', mStage: 'M0' });
      expect(res.stage).toBe('IIA');
    });

    it('should compute Stage IIB for T3 N1 M0', () => {
      const res = computeGastricStage({ tStage: 'T3', nStage: 'N1', mStage: 'M0' });
      expect(res.stage).toBe('IIB');
    });

    it('should compute Stage IIIA for T4a N2 M0', () => {
      const res = computeGastricStage({ tStage: 'T4a', nStage: 'N2', mStage: 'M0' });
      expect(res.stage).toBe('IIIA');
    });

    it('should compute Stage IIIB for T4a N3a M0', () => {
      const res = computeGastricStage({ tStage: 'T4a', nStage: 'N3a', mStage: 'M0' });
      expect(res.stage).toBe('IIIB');
    });

    it('should compute Stage IV for M1 distant metastasis', () => {
      const res = computeGastricStage({ tStage: 'T2', nStage: 'N0', mStage: 'M1' });
      expect(res.stage).toBe('IV');
    });
  });

  describe('Gastric Clinical Trial Cohorts (FLOT4, ToGA, SPOTLIGHT, CheckMate-649, ESD)', () => {
    it('should dispatch to ESD cohort for early stage IA mucosal cancer', () => {
      const cohort = getGastricClinicalCohort({
        tStage: 'T1a',
        nStage: 'N0',
        mStage: 'M0',
        differentiation: 'well',
        hasUlcer: false,
        tumorSize: 1.5,
      });

      expect(cohort.name).toContain('ESD');
      expect(cohort.source).toContain('日本国家癌症中心');
      expect(cohort.os5Year).toContain('97.8%');
    });

    it('should dispatch to FLOT4 perioperative cohort for locally advanced resectable gastric cancer', () => {
      const cohort = getGastricClinicalCohort({
        tStage: 'T3',
        nStage: 'N1',
        mStage: 'M0',
      });

      expect(cohort.name).toContain('RESOLVE_SOX_Cohort');
      expect(cohort.source).toContain('RESOLVE');
      expect(cohort.os5Year).toContain('65.5%');
    });

    it('should dispatch to ToGA cohort for HER2-positive advanced gastric cancer', () => {
      const cohort = getGastricClinicalCohort({
        tStage: 'T4a',
        nStage: 'N2',
        mStage: 'M1',
        her2Status: 'positive',
      });

      expect(cohort.name).toContain('ToGA_HER2_Targeted_Cohort');
      expect(cohort.source).toContain('ToGA');
      expect(cohort.os5Year).toContain('中位OS');
    });

    it('should dispatch to SPOTLIGHT cohort for Claudin 18.2-positive advanced gastric cancer', () => {
      const cohort = getGastricClinicalCohort({
        tStage: 'T4a',
        nStage: 'N2',
        mStage: 'M1',
        claudin18_2Status: 'positive',
        claudin182Status: 'positive',
        her2Status: 'negative',
      });

      expect(cohort.name).toContain('SPOTLIGHT_Claudin182_Cohort');
      expect(cohort.source).toContain('SPOTLIGHT');
      expect(cohort.os5Year).toContain('中位OS 18.2月');
    });

    it('should dispatch to CheckMate-649 cohort for PD-L1 CPS >= 5 advanced gastric cancer', () => {
      const cohort = getGastricClinicalCohort({
        tStage: 'T4a',
        nStage: 'N2',
        mStage: 'M1',
        pdl1Cps: 8,
        her2Status: 'negative',
        claudin18_2Status: 'negative',
      });

      expect(cohort.name).toContain('CheckMate649_Immunotherapy_Cohort');
      expect(cohort.source).toContain('CheckMate-649');
      expect(cohort.os5Year).toContain('中位OS 14.4月');
    });
  });

  describe('Unified Staging Registry & CancerPlugin Dispatch', () => {
    it('should correctly compute gastric stage via computeCancerStage', () => {
      const result = computeCancerStage('gastric', {
        tStage: 'T3',
        nStage: 'N2',
        mStage: 'M0',
        lymphNodesExamined: 20,
      });

      expect(result.cancerType).toBe('gastric');
      expect(result.stage).toBe('IIIA');
      expect(result.explanation).toContain('D2 淋巴结清扫质控达标');
    });

    it('should dispatch gastric cohort via getClinicalCohortUnified', () => {
      const cohort = getClinicalCohortUnified({
        cancerType: 'gastric',
        tStage: 'T1a',
        nStage: 'N0',
        mStage: 'M0',
        differentiation: 'well',
      });

      expect(cohort.name).toContain('ESD');
    });

    it('should retrieve gastric plugin from CancerRegistry with amber-600 theme', () => {
      const plugin = CancerRegistry.get('gastric');
      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('胃癌');
      expect(plugin.enName).toBe('Gastric Cancer');
      expect(plugin.theme.primaryColor).toContain('amber-600');
      expect(plugin.guidelineStandard).toContain('AJCC');
      expect(plugin.staging.computeStage).toBeDefined();
    });
  });
});
