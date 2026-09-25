import { describe, it, expect, beforeEach } from 'vitest';

// Provide standard in-memory localStorage & window mock for Node test environment
const storageMap = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, value: string) => storageMap.set(key, String(value)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
  get length() { return storageMap.size; },
  key: (index: number) => Array.from(storageMap.keys())[index] ?? null,
};

(globalThis as any).localStorage = localStorageMock;
if (!(globalThis as any).window) {
  (globalThis as any).window = {
    localStorage: localStorageMock,
    dispatchEvent: () => true,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

import {
  getActiveCancerSlot,
  setActiveCancerSlot,
  getProfileBySlot,
  saveProfileToSlot,
  getAvailableProfileSlots,
  deleteProfileSlot,
  hasDualPrimaryProfile,
  getDualPrimarySummary,
  STORAGE_KEY_ACTIVE_SLOT,
  STORAGE_KEY_SLOT_PREFIX,
  STORAGE_KEY_LEGACY,
} from '../lib/profileStorage';
import type { PatientProfile } from '../lib/types';

describe('Dual Primary MPMN Multi-Slot profileStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockLungProfile: PatientProfile = {
    cancerType: 'lung',
    stage: 'IA2',
    tStage: 'T1b',
    nStage: 'N0',
    mStage: 'M0',
    organ: 'lung',
    tumorSize: 1.6,
    noduleType: 'mixed_ggo',
    histology: '浸润性肺腺癌',
    egfr: 'positive',
    geneMutations: [{ id: 'mut-1', gene: 'EGFR', subtype: '19del', status: 'positive' }],
  };

  const mockBreastProfile: PatientProfile = {
    cancerType: 'breast',
    stage: 'IIA',
    tStage: 'T2',
    nStage: 'N0',
    mStage: 'M0',
    organ: 'breast',
    tumorSize: 2.5,
    erStatus: 'positive',
    prStatus: 'positive',
    her2Status: '1+',
    her2Low: true,
    molecularSubtype: 'Luminal_A',
    biRads: '4C',
  };

  it('should default active slot to lung when empty', () => {
    expect(getActiveCancerSlot()).toBe('lung');
    expect(getAvailableProfileSlots()).toEqual([]);
    expect(hasDualPrimaryProfile()).toBe(false);
  });

  it('should save lung profile and mirror to legacy key for backwards compatibility', () => {
    saveProfileToSlot(mockLungProfile);

    const retrieved = getProfileBySlot('lung');
    expect(retrieved).toBeDefined();
    expect(retrieved?.cancerType).toBe('lung');
    expect(retrieved?.stage).toBe('IA2');
    expect(retrieved?.tumorSize).toBe(1.6);

    // Check legacy mirror
    const legacyRaw = localStorage.getItem(STORAGE_KEY_LEGACY);
    expect(legacyRaw).toBeTruthy();
    expect(JSON.parse(legacyRaw!).stage).toBe('IA2');

    expect(getAvailableProfileSlots()).toEqual(['lung']);
    expect(hasDualPrimaryProfile()).toBe(false);
  });

  it('should support physical isolation between lung and breast profiles without cross-contamination', () => {
    // 1. Save lung profile
    saveProfileToSlot(mockLungProfile);

    // 2. Save breast profile
    saveProfileToSlot(mockBreastProfile);

    // 3. Verify both profiles exist independently
    const lung = getProfileBySlot('lung');
    const breast = getProfileBySlot('breast');

    expect(lung).toBeDefined();
    expect(lung?.stage).toBe('IA2');
    expect(lung?.organ).toBe('lung');
    expect(lung?.egfr).toBe('positive');
    expect((lung as any).erStatus).toBeUndefined();

    expect(breast).toBeDefined();
    expect(breast?.stage).toBe('IIA');
    expect(breast?.organ).toBe('breast');
    expect(breast?.erStatus).toBe('positive');
    expect(breast?.biRads).toBe('4C');
    expect(breast?.egfr).toBeUndefined();

    // 4. Verify MPMN detection
    expect(getAvailableProfileSlots()).toContain('lung');
    expect(getAvailableProfileSlots()).toContain('breast');
    expect(hasDualPrimaryProfile()).toBe(true);

    // 5. Verify Dual Primary Summary
    const summary = getDualPrimarySummary();
    expect(summary.isDualPrimary).toBe(true);
    expect(summary.lungProfile?.stage).toBe('IA2');
    expect(summary.breastProfile?.stage).toBe('IIA');
  });

  it('should switch active slot and update mirror key correctly', () => {
    saveProfileToSlot(mockLungProfile);
    saveProfileToSlot(mockBreastProfile);

    setActiveCancerSlot('breast');
    expect(getActiveCancerSlot()).toBe('breast');

    const legacyRaw = localStorage.getItem(STORAGE_KEY_LEGACY);
    expect(JSON.parse(legacyRaw!).organ).toBe('breast');

    setActiveCancerSlot('lung');
    expect(getActiveCancerSlot()).toBe('lung');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY_LEGACY)!).organ).toBe('lung');
  });

  it('should allow single-slot deletion leaving the other cancer profile intact', () => {
    saveProfileToSlot(mockLungProfile);
    saveProfileToSlot(mockBreastProfile);
    setActiveCancerSlot('breast');

    // Delete breast slot only
    deleteProfileSlot('breast');

    expect(getProfileBySlot('breast')).toBeNull();
    expect(getProfileBySlot('lung')).toBeDefined();
    expect(getProfileBySlot('lung')?.stage).toBe('IA2');

    // Active slot should automatically switch back to remaining lung profile
    expect(getActiveCancerSlot()).toBe('lung');
    expect(getAvailableProfileSlots()).toEqual(['lung']);
    expect(hasDualPrimaryProfile()).toBe(false);
  });

  it('should smoothly migrate legacy single-profile storage to appropriate slot', () => {
    // Simulate an existing user with legacy oncopath_profile
    localStorage.setItem(STORAGE_KEY_LEGACY, JSON.stringify(mockBreastProfile));

    // Calling getProfileBySlot or getAvailableProfileSlots triggers automatic migration
    const available = getAvailableProfileSlots();
    expect(available).toContain('breast');

    const retrievedBreast = getProfileBySlot('breast');
    expect(retrievedBreast).toBeDefined();
    expect(retrievedBreast?.stage).toBe('IIA');
    expect(localStorage.getItem(`${STORAGE_KEY_SLOT_PREFIX}breast`)).toBeTruthy();
  });
});
