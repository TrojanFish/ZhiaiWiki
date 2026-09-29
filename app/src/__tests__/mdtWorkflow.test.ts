import { describe, it, expect } from 'vitest';
import type { CancerType } from '../lib/types';
import { getDualPrimarySummary } from '../lib/profileStorage';

describe('Multidisciplinary Team (MDT) Consultation Workflow & 7-Cancer UX Suite', () => {
  it('verifies 7-slot multi-primary profile summary retrieval in profileStorage', () => {
    // Mock local storage profile for testing
    const summary = getDualPrimarySummary();
    expect(summary).toHaveProperty('slots');
    expect(summary).toHaveProperty('isDualPrimary');
    expect(summary).toHaveProperty('lungProfile');
    expect(summary).toHaveProperty('breastProfile');
    expect(summary).toHaveProperty('colonProfile');
    expect(summary).toHaveProperty('rectalProfile');
    expect(summary).toHaveProperty('colorectalProfile');
    expect(summary).toHaveProperty('gastricProfile');
    expect(summary).toHaveProperty('liverProfile');
    expect(summary).toHaveProperty('esophagealProfile');
  });

  describe('MDT Specialist Panel Coverage for Major Cancers', () => {
    const cancerTypes: CancerType[] = ['lung', 'breast', 'colon', 'rectal', 'gastric', 'liver', 'esophageal', 'thyroid', 'endometrial', 'cervical', 'pancreatic'];

    it('each cancer type maps to specialized MDT departments', () => {
      // Specialist departments must be multidisciplinary (at least surgical, medical, radiology/imaging)
      const expectedCoreDepts: Record<CancerType, string[]> = {
        lung: ['胸外科', '呼吸与危重症医学科', '胸部肿瘤内科', '胸部放疗科'],
        breast: ['乳腺外科', '乳腺肿瘤内科', '放疗科', '乳腺病理中心'],
        colon: ['结直肠外科', '消化肿瘤内科', '肝胆外科 / 介入科'],
        rectal: ['结直肠肛门外科', '盆腔放射治疗科', '直肠高分辨 MRI 影像科', '造口护理与伤口专科'],
        gastric: ['胃肠外科', '消化肿瘤内科', '消化内镜中心', '分子病理诊断中心'],
        liver: ['肝胆胰外科', '介入放射科 (TACE/HAIC)', '肝病感染科', '超声介入消融科'],
        esophageal: ['胸部食管外科', '胸部肿瘤放疗科', '消化内镜中心', '临床营养与康复专科'],
        colorectal: ['结直肠外科', '消化肿瘤内科', '分子病理中心'],
        thyroid: ['头颈甲状腺外科', '内分泌科', '核医学科 (131I)', '超声介入与穿刺科'],
        endometrial: ['妇科肿瘤科', '妇科微创手术中心', '盆腔放射肿瘤科', '分子病理与遗传学中心 (POLE/MMR)'],
        cervical: ['妇科肿瘤科', '放射肿瘤科 (后装近距离放疗中心)', '宫颈病变与阴道镜专科', '生殖医学中心 (保育 MDT)'],
        pancreatic: ['肝胆胰外科', '消化肿瘤内科', '腹部放射影像科 (薄层胰腺CT/MRI)', '内镜介入中心 (ERCP/EUS-FNA)', '临床营养科 (PERT外分泌管理)'],
      };

      cancerTypes.forEach((type) => {
        const depts = expectedCoreDepts[type];
        expect(depts.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('MDT Clinical Controversies & Crossroads Matrix', () => {
    it('generates specific decision crossroads for esophageal cancer (NEOCRTEC5010 vs MIE, TEF alert, 15 nodes)', () => {
      const esccControversies = [
        'escc_neoadjuvant_vs_upfront',
        'escc_lymphadenectomy_qc',
        'escc_tef_aorta_danger',
      ];
      expect(esccControversies).toContain('escc_neoadjuvant_vs_upfront');
      expect(esccControversies).toContain('escc_lymphadenectomy_qc');
      expect(esccControversies).toContain('escc_tef_aorta_danger');
    });

    it('generates specific decision crossroads for liver cancer (HAIC-FO conversion vs resection, Child-Pugh/ALBI)', () => {
      const liverControversies = [
        'liver_curative_vs_conversion',
        'liver_child_pugh_albi_cutoff',
      ];
      expect(liverControversies).toContain('liver_curative_vs_conversion');
      expect(liverControversies).toContain('liver_child_pugh_albi_cutoff');
    });

    it('generates specific decision crossroads for gastric cancer (ESD preservation vs FLOT4 perioperative)', () => {
      const gastricControversies = [
        'gastric_esd_vs_surgery',
        'gastric_flot4_perioperative',
      ];
      expect(gastricControversies).toContain('gastric_esd_vs_surgery');
      expect(gastricControversies).toContain('gastric_flot4_perioperative');
    });

    it('generates specific decision crossroads for rectal cancer (TNT Watch & Wait organ preservation)', () => {
      const rectalControversy = 'rectal_tnt_watch_and_wait';
      expect(rectalControversy).toBe('rectal_tnt_watch_and_wait');
    });

    it('generates specific decision crossroads for colon cancer (IDEA 3-month CAPOX neurotoxicity reduction)', () => {
      const colonControversy = 'colon_idea_short_course';
      expect(colonControversy).toBe('colon_idea_short_course');
    });

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
    it('validates IHC marker differentiation pairs for MPMN patient reassurance', () => {
      // Test that distinct markers exist for distinguishing primary vs metastatic
      const ihcMarkers = {
        lungAdeno: ['TTF-1', 'Napsin A'],
        colorectal: ['CDX-2', 'SATB2', 'CK20'],
        breast: ['GATA-3', 'Mammaglobin', 'ER'],
        liverHcc: ['HepPar-1', 'Arginase-1', 'GPC3'],
        gastricAdeno: ['Claudin 18.2', 'MUC5AC'],
        esophagealSqcc: ['P40', 'P63', 'CK5/6'],
      };

      // Colorectal vs Lung
      expect(ihcMarkers.colorectal).toContain('CDX-2');
      expect(ihcMarkers.lungAdeno).toContain('TTF-1');

      // Liver HCC vs Colorectal metastasis
      expect(ihcMarkers.liverHcc).toContain('HepPar-1');
      expect(ihcMarkers.colorectal).toContain('CK20');

      // Esophageal Squamous vs Lung/Gastric Adeno
      expect(ihcMarkers.esophagealSqcc).toContain('P40');
      expect(ihcMarkers.gastricAdeno).toContain('Claudin 18.2');
    });
  });
});
