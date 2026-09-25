import { describe, it, expect } from 'vitest';
import {
  computeChildPughScore,
  computeAlbiScore,
  isMilanCriteriaMet,
  normalizeTumorCount,
  computeCnlcStage,
  computeLiverClinicalCohort,
} from '../lib/liverStaging';
import { computeCancerStage, getClinicalCohortUnified } from '../lib/stagingRegistry';
import { CancerRegistry } from '../lib/cancerRegistry';

describe('Liver Cancer Dedicated Staging Engine (CNLC 2024 & Child-Pugh / ALBI)', () => {
  describe('Child-Pugh Score & Functional Reserve Calculation', () => {
    it('should calculate Child-Pugh A grade (score 5-6) correctly with normal labs', () => {
      const res = computeChildPughScore({
        totalBilirubin: 18, // <34 -> 1 pt
        serumAlbumin: 42, // >35 -> 1 pt
        prothrombinTimeInr: 1.05, // <1.7 -> 1 pt
        ascitesStatus: 'none', // 1 pt
        hepaticEncephalopathy: 'none', // 1 pt
      });

      expect(res.score).toBe(5);
      expect(res.grade).toBe('A');
    });

    it('should calculate Child-Pugh B grade (score 7-9) with moderate cirrhosis markers', () => {
      const res = computeChildPughScore({
        totalBilirubin: 45, // 34-51 -> 2 pts
        serumAlbumin: 31, // 28-35 -> 2 pts
        prothrombinTimeInr: 1.8, // 1.7-2.3 -> 2 pts
        ascitesStatus: 'mild', // 2 pts
        hepaticEncephalopathy: 'none', // 1 pt
      });

      expect(res.score).toBe(9);
      expect(res.grade).toBe('B');
    });

    it('should calculate Child-Pugh C grade (score 10-15) with severe decompensation', () => {
      const res = computeChildPughScore({
        totalBilirubin: 65, // >51 -> 3 pts
        serumAlbumin: 24, // <28 -> 3 pts
        prothrombinTimeInr: 2.5, // >2.3 -> 3 pts
        ascitesStatus: 'refractory', // 3 pts
        hepaticEncephalopathy: 'grade_3_4', // 3 pts
      });

      expect(res.score).toBe(15);
      expect(res.grade).toBe('C');
    });

    it('should accept direct childPughScore input', () => {
      const resA = computeChildPughScore({ childPughScore: 6 });
      expect(resA.score).toBe(6);
      expect(resA.grade).toBe('A');

      const resB = computeChildPughScore({ childPughScore: 8 });
      expect(resB.score).toBe(8);
      expect(resB.grade).toBe('B');

      const resC = computeChildPughScore({ childPughScore: 11 });
      expect(resC.score).toBe(11);
      expect(resC.grade).toBe('C');
    });

    it('should accept direct childPughGrade string input', () => {
      const res = computeChildPughScore({ childPughGrade: 'b' });
      expect(res.grade).toBe('B');
      expect(res.score).toBe(7);
    });
  });

  describe('ALBI Objective Mathematical Score (Albumin-Bilirubin)', () => {
    it('should calculate ALBI Grade 1 (<= -2.60) for excellent hepatic reserve', () => {
      // Bilirubin 15 umol/L, Albumin 42 g/L
      // log10(15)*0.66 + 42*(-0.0852) = 1.176*0.66 - 3.578 = 0.776 - 3.578 = -2.80
      const res = computeAlbiScore(15, 42);
      expect(res.score).toBeLessThanOrEqual(-2.60);
      expect(res.grade).toBe('1');
    });

    it('should calculate ALBI Grade 2 (-2.60 to -1.39) for intermediate reserve', () => {
      // Bilirubin 35 umol/L, Albumin 32 g/L
      // log10(35)*0.66 + 32*(-0.0852) = 1.544*0.66 - 2.726 = 1.019 - 2.726 = -1.71
      const res = computeAlbiScore(35, 32);
      expect(res.score).toBeGreaterThan(-2.60);
      expect(res.score).toBeLessThanOrEqual(-1.39);
      expect(res.grade).toBe('2');
    });

    it('should calculate ALBI Grade 3 (> -1.39) for severely impaired reserve', () => {
      // Bilirubin 60 umol/L, Albumin 22 g/L
      // log10(60)*0.66 + 22*(-0.0852) = 1.778*0.66 - 1.874 = 1.173 - 1.874 = -0.70
      const res = computeAlbiScore(60, 22);
      expect(res.score).toBeGreaterThan(-1.39);
      expect(res.grade).toBe('3');
    });

    it('should return unknown when inputs are missing or invalid', () => {
      const res = computeAlbiScore(null, null);
      expect(res.grade).toBe('unknown');
      expect(res.score).toBeNull();
    });
  });

  describe('Milan Criteria for Liver Transplantation Eligibility', () => {
    it('should qualify single lesion <= 5.0cm with no invasion or metastasis', () => {
      expect(isMilanCriteriaMet('single', 4.5, false, false)).toBe(true);
      expect(isMilanCriteriaMet('single', 5.0, false, false)).toBe(true);
    });

    it('should disqualify single lesion > 5.0cm', () => {
      expect(isMilanCriteriaMet('single', 5.5, false, false)).toBe(false);
    });

    it('should qualify 2-3 lesions each <= 3.0cm with no invasion or metastasis', () => {
      expect(isMilanCriteriaMet('2-3', 2.8, false, false)).toBe(true);
      expect(isMilanCriteriaMet('2-3', 3.0, false, false)).toBe(true);
    });

    it('should disqualify 2-3 lesions if max diameter exceeds 3.0cm', () => {
      expect(isMilanCriteriaMet('2-3', 3.5, false, false)).toBe(false);
    });

    it('should disqualify multiple lesions >= 4', () => {
      expect(isMilanCriteriaMet('multiple_ge4', 2.0, false, false)).toBe(false);
    });

    it('should disqualify any lesion with vascular invasion or distant metastasis', () => {
      expect(isMilanCriteriaMet('single', 3.0, true, false)).toBe(false);
      expect(isMilanCriteriaMet('single', 3.0, false, true)).toBe(false);
    });
  });

  describe('CNLC 2024 Stage Determination (Ia ~ IV)', () => {
    it('should stage solitary tumor <= 5.0cm as CNLC Ia', () => {
      const res = computeCnlcStage({
        tumorCount: 'single',
        tumorSize: 3.5,
        childPughGrade: 'A',
      });

      expect(res.cancerType).toBe('liver');
      expect(res.stage).toBe('Ia');
      expect(res.cnlcStage).toBe('Ia');
      expect(res.isMilanEligible).toBe(true);
      expect(res.explanation).toContain('CNLC 2024 中国临床分期');
      expect(res.treatmentDirection).toContain('CNLC Ia 期早期根治方案');
      expect(res.treatmentDirection).toContain('首选手术切除');
    });

    it('should stage solitary tumor > 5.0cm as CNLC Ib', () => {
      const res = computeCnlcStage({
        tumorCount: 'single',
        tumorSize: 7.0,
        childPughGrade: 'A',
      });

      expect(res.stage).toBe('Ib');
      expect(res.cnlcStage).toBe('Ib');
      expect(res.isMilanEligible).toBe(false); // > 5cm
      expect(res.treatmentDirection).toContain('CNLC Ib 期根治性切除首选');
    });

    it('should stage 2-3 lesions each <= 3.0cm as CNLC Ib', () => {
      const res = computeCnlcStage({
        tumorCount: '2-3',
        tumorSize: 2.8,
        childPughGrade: 'A',
      });

      expect(res.stage).toBe('Ib');
      expect(res.cnlcStage).toBe('Ib');
      expect(res.isMilanEligible).toBe(true);
    });

    it('should stage 2-3 lesions with max diameter > 3.0cm as CNLC IIa', () => {
      const res = computeCnlcStage({
        tumorCount: '2-3',
        tumorSize: 4.2,
        childPughGrade: 'A',
      });

      expect(res.stage).toBe('IIa');
      expect(res.cnlcStage).toBe('IIa');
      expect(res.treatmentDirection).toContain('CNLC IIa 期手术切除与局部介入协作');
    });

    it('should stage multiple lesions (>=4) without vascular invasion as CNLC IIb', () => {
      const res = computeCnlcStage({
        tumorCount: 'multiple_ge4',
        tumorSize: 3.5,
        childPughGrade: 'A',
      });

      expect(res.stage).toBe('IIb');
      expect(res.cnlcStage).toBe('IIb');
      expect(res.treatmentDirection).toContain('CNLC IIb 期局部介入与系统综合治疗');
      expect(res.treatmentDirection).toContain('TACE');
    });

    it('should stage macrovascular portal vein invasion (VP1~VP4) as CNLC IIIa with HAIC-FO conversion guidance', () => {
      const res = computeCnlcStage({
        tumorCount: 'single',
        tumorSize: 8.5,
        vascularInvasion: 'portal_vein_VP1_VP2',
        childPughGrade: 'A',
      });

      expect(res.stage).toBe('IIIa');
      expect(res.cnlcStage).toBe('IIIa');
      expect(res.hasVascularInvasion).toBe(true);
      expect(res.treatmentDirection).toContain('HAIC-FO 肝动脉持续灌注化疗');
      expect(res.treatmentDirection).toContain('大血管癌栓');
    });

    it('should stage extrahepatic distant metastasis as CNLC IIIb with systemic T+A / 双达 recommendations', () => {
      const res = computeCnlcStage({
        tumorCount: '2-3',
        tumorSize: 4.0,
        extrahepaticMetastasis: true,
        metastasisSites: ['lung', 'bone'],
        childPughGrade: 'A',
      });

      expect(res.stage).toBe('IIIb');
      expect(res.cnlcStage).toBe('IIIb');
      expect(res.treatmentDirection).toContain('CNLC IIIb 期晚期转移一线靶免系统综合治疗');
      expect(res.treatmentDirection).toContain('IMbrave150');
      expect(res.treatmentDirection).toContain('胃镜筛查');
    });

    it('should stage Child-Pugh C or ECOG PS >= 3 as CNLC IV with supportive hospice guidance', () => {
      const res = computeCnlcStage({
        tumorCount: 'single',
        tumorSize: 2.5,
        childPughGrade: 'C',
        childPughScore: 12,
      });

      expect(res.stage).toBe('IV');
      expect(res.cnlcStage).toBe('IV');
      expect(res.treatmentDirection).toContain('CNLC IV 期最佳支持治疗与姑息保肝');
      expect(res.treatmentDirection).toContain('严禁行盲目高强度化疗或大范围切除');
    });
  });

  describe('Biomarkers & HBV Antiviral Quality Control', () => {
    it('should generate HBV antiviral warning when HBV status is positive and untreated', () => {
      const res = computeCnlcStage({
        tumorCount: 'single',
        tumorSize: 3.0,
        hbvStatus: 'positive',
        antiviralTherapy: false,
      });

      expect(res.isAntiviralIndicated).toBe(true);
      expect(res.explanation).toContain('乙肝病毒学管控');
      expect(res.explanation).toContain('必须第一时间启动强效低耐药抗病毒药（恩替卡韦 ETV 或富马酸丙酚替诺福韦 TAF）');
    });

    it('should highlight AFP-negative HCC with high PIVKA-II to prevent misdiagnosis', () => {
      const res = computeCnlcStage({
        tumorCount: 'single',
        tumorSize: 3.0,
        afpLevel: 8.5, // normal (<20)
        pivkaIiLevel: 320, // highly elevated (>40)
      });

      expect(res.isPivkaHigh).toBe(true);
      expect(res.explanation).toContain('AFP 阴性但 PIVKA-II 显著升高');
      expect(res.explanation).toContain('PIVKA-II 补位侦测极大避免了临床漏诊');
    });
  });

  describe('Clinical Cohort Evidence Selection (computeLiverClinicalCohort)', () => {
    it('should match ORIENT-32 Chinese cohort for HBV-positive CNLC IIIb patients', () => {
      const cohort = computeLiverClinicalCohort({
        cancerType: 'liver',
        cnlcStage: 'IIIb',
        hbvStatus: 'positive',
      });

      expect(cohort.name).toBe('ORIENT32_Sintilimab_Cohort');
      expect(cohort.stage).toContain('CNLC IIIb');
      expect(cohort.keyFactors).toContain('中国双达方案');
      expect(cohort.source).toContain('ORIENT-32');
    });

    it('should match HAIC-FO conversion downstaging cohort for CNLC IIIa with portal vein tumor thrombus', () => {
      const cohort = computeLiverClinicalCohort({
        cancerType: 'liver',
        cnlcStage: 'IIIa',
        vascularInvasion: 'portal_vein_VP1_VP2',
      });

      expect(cohort.name).toBe('HAIC_FO_Conversion_Cohort');
      expect(cohort.keyFactors).toContain('HAIC-FO灌注');
      expect(cohort.keyFactors).toContain('转化切除率高');
    });

    it('should match Milan Criteria transplant cohort for early tumor with Child-Pugh B/C decompensation', () => {
      const cohort = computeLiverClinicalCohort({
        cancerType: 'liver',
        tumorCount: 'single',
        tumorSize: 3.0,
        childPughGrade: 'B',
        childPughScore: 8,
      });

      expect(cohort.name).toBe('Milan_Transplant_Cohort');
      expect(cohort.keyFactors).toContain('米兰标准入组');
    });
  });

  describe('Unified Staging Registry Integration', () => {
    it('should route "liver" cancer type via computeCancerStage correctly', () => {
      const result = computeCancerStage('liver', {
        tumorCount: 'single',
        tumorSize: 4.0,
        childPughGrade: 'A',
      });

      expect(result.cancerType).toBe('liver');
      expect(result.stage).toBe('Ia');
      expect(result.cnlcStage).toBe('Ia');
      expect(result.childPughGrade).toBe('A');
      expect(result.isMilanEligible).toBe(true);
    });

    it('should normalize "hcc" and "肝癌" alias to liver', () => {
      const result = computeCancerStage('hcc', {
        tumorCount: '2-3',
        tumorSize: 2.5,
        childPughGrade: 'A',
      });

      expect(result.cancerType).toBe('liver');
      expect(result.cnlcStage).toBe('Ib');
    });

    it('should fetch unified clinical cohort for liver via getClinicalCohortUnified', () => {
      const cohort = getClinicalCohortUnified({
        cancerType: 'liver',
        cnlcStage: 'IIIb',
        hbvStatus: 'positive',
      });

      expect(cohort.name).toBe('ORIENT32_Sintilimab_Cohort');
    });

    it('should verify liverPlugin is registered in CancerRegistry', () => {
      const plugin = CancerRegistry.get('liver');
      expect(plugin).toBeDefined();
      expect(plugin?.id).toBe('liver');
      expect(plugin?.name).toBe('原发性肝癌');
      expect(plugin?.theme.primaryColor).toContain('emerald');
      expect(plugin?.guidelineStandard).toContain('CNLC 2024');
    });
  });
});
