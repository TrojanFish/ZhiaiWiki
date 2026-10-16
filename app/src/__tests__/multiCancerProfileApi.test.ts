import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST as postProfile, GET as getProfile, DELETE as deleteProfile, PUT as putProfile } from '../app/api/profile/route';

// In-memory profiles store for multi-slot testing
let inMemoryProfiles: any[] = [];

// Mock prisma for multi-slot isolated testing
vi.mock('@/lib/prisma', () => {
  return {
    default: {
      patientProfile: {
        findFirst: vi.fn(async ({ where }: any) => {
          if (!where) return inMemoryProfiles[inMemoryProfiles.length - 1] || null;
          
          let filtered = [...inMemoryProfiles];
          if (where.userId) {
            filtered = filtered.filter(p => p.userId === where.userId);
          }
          if (where.cancerType) {
            filtered = filtered.filter(p => p.cancerType === where.cancerType);
          }
          if (where.AND && Array.isArray(where.AND)) {
            for (const cond of where.AND) {
              if (cond.cancerType) {
                filtered = filtered.filter(p => p.cancerType === cond.cancerType);
              }
              if (cond.OR && Array.isArray(cond.OR)) {
                filtered = filtered.filter(p => cond.OR.some((sub: any) => sub.cancerType === p.cancerType || (sub.cancerType === null && !p.cancerType)));
              }
            }
          }
          if (where.OR && Array.isArray(where.OR)) {
            filtered = filtered.filter(p => where.OR.some((sub: any) => sub.userId === p.userId || sub.cancerType === p.cancerType || (sub.cancerType === null && !p.cancerType)));
          }
          return filtered[filtered.length - 1] || null;
        }),
        findMany: vi.fn(async ({ where }: any) => {
          let filtered = [...inMemoryProfiles];
          if (where?.userId) {
            filtered = filtered.filter(p => p.userId === where.userId);
          }
          return filtered;
        }),
        findUnique: vi.fn(async ({ where }: any) => {
          return inMemoryProfiles.find(p => p.id === where.id) || null;
        }),
        create: vi.fn(async ({ data }: any) => {
          const newProfile = {
            id: `mock-profile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data
          };
          inMemoryProfiles.push(newProfile);
          return newProfile;
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const idx = inMemoryProfiles.findIndex(p => p.id === where.id);
          if (idx >= 0) {
            inMemoryProfiles[idx] = {
              ...inMemoryProfiles[idx],
              ...data,
              updatedAt: new Date(),
            };
            return inMemoryProfiles[idx];
          }
          return null;
        }),
        deleteMany: vi.fn(async ({ where }: any) => {
          const initialLen = inMemoryProfiles.length;
          if (where?.cancerType) {
            inMemoryProfiles = inMemoryProfiles.filter(p => p.cancerType !== where.cancerType);
          } else if (where?.userId) {
            inMemoryProfiles = inMemoryProfiles.filter(p => p.userId !== where.userId);
          } else {
            inMemoryProfiles = [];
          }
          return { count: initialLen - inMemoryProfiles.length };
        })
      },
      timelineEvent: {
        findFirst: vi.fn(async () => null),
        findMany: vi.fn(async () => []),
        create: vi.fn(async ({ data }: any) => ({ id: 'mock-event-id', ...data })),
        update: vi.fn(async ({ data }: any) => ({ id: 'mock-event-id', ...data })),
        deleteMany: vi.fn(async () => ({ count: 0 })),
      }
    }
  };
});

describe('Multi-Cancer MPMN PatientProfile API Persistence', () => {
  const guestId = 'guest-test-multicancer-12345';

  beforeEach(() => {
    inMemoryProfiles = [];
  });

  it('should successfully persist breast cancer profile and cancerSpecificData into database', async () => {
    const breastPayload = {
      userId: guestId,
      cancerType: 'breast',
      organ: 'breast',
      age: 48,
      sex: 'female',
      tumorSize: 2.2,
      nStage: 'N0',
      mStage: 'M0',
      erStatus: 'positive',
      erPercent: 90,
      prStatus: 'positive',
      prPercent: 75,
      her2Status: '1+',
      her2Low: true,
      molecularSubtype: 'Luminal_A',
      nottinghamGrade: '2',
      biRads: '4C',
      menopauseStatus: 'pre',
      oncotypeDxScore: 16,
    };

    const req = new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(breastPayload),
    });

    const res = await postProfile(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.profile).toBeDefined();
    expect(json.profile.cancerType).toBe('breast');
    expect(json.profile.organ).toBe('breast');
    expect(json.profile.erStatus).toBe('positive');
    expect(json.profile.her2Low).toBe(true);
    expect(json.profile.biRads).toBe('4C');
    expect(json.profile.cancerSpecificData).toBeDefined();
    expect(json.profile.cancerSpecificData.oncotypeDxScore).toBe(16);
    expect(json.availableSlots).toContain('breast');
  });

  it('should allow同一患者 (same guestId) 同时持久化肺癌与乳腺癌两份独立病历 (Dual Primary MPMN)', async () => {
    // 1. Post Lung Profile
    const lungPayload = {
      userId: guestId,
      cancerType: 'lung',
      organ: 'lung',
      tumorSize: 1.5,
      noduleType: 'mixed_ggo',
      histology: '原发性肺腺癌',
      nStage: 'N0',
      mStage: 'M0',
      egfr: 'positive',
    };

    const lungReq = new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lungPayload),
    });
    const lungRes = await postProfile(lungReq);
    expect(lungRes.status).toBe(200);

    // 2. Post Breast Profile for the SAME user
    const breastPayload = {
      userId: guestId,
      cancerType: 'breast',
      organ: 'breast',
      tumorSize: 2.5,
      erStatus: 'positive',
      her2Status: '1+',
      her2Low: true,
      molecularSubtype: 'Luminal_A',
      nStage: 'N0',
      mStage: 'M0',
    };

    const breastReq = new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(breastPayload),
    });
    const breastRes = await postProfile(breastReq);
    const breastJson = await breastRes.json();
    expect(breastRes.status).toBe(200);
    expect(breastJson.availableSlots).toContain('lung');
    expect(breastJson.availableSlots).toContain('breast');

    // 3. GET with cancerType=lung returns the isolated lung record
    const getLungReq = new Request(`http://localhost:3000/api/profile?userId=${guestId}&cancerType=lung`);
    const getLungRes = await getProfile(getLungReq);
    const getLungJson = await getLungRes.json();
    expect(getLungRes.status).toBe(200);
    expect(getLungJson.profile.cancerType).toBe('lung');
    expect(getLungJson.profile.tumorSize).toBe(1.5);
    expect(getLungJson.availableSlots).toContain('lung');
    expect(getLungJson.availableSlots).toContain('breast');

    // 4. GET with cancerType=breast returns the isolated breast record
    const getBreastReq = new Request(`http://localhost:3000/api/profile?userId=${guestId}&cancerType=breast`);
    const getBreastRes = await getProfile(getBreastReq);
    const getBreastJson = await getBreastRes.json();
    expect(getBreastRes.status).toBe(200);
    expect(getBreastJson.profile.cancerType).toBe('breast');
    expect(getBreastJson.profile.tumorSize).toBe(2.5);
    expect(getBreastJson.profile.erStatus).toBe('positive');

    // 5. Single-slot deletion: DELETE with cancerType=breast deletes breast while preserving lung
    const deleteBreastReq = new Request(`http://localhost:3000/api/profile?userId=${guestId}&cancerType=breast`, {
      method: 'DELETE',
    });
    const delRes = await deleteProfile(deleteBreastReq);
    const delJson = await delRes.json();
    expect(delRes.status).toBe(200);
    expect(delJson.success).toBe(true);

    // Verify breast is gone
    const checkBreastReq = new Request(`http://localhost:3000/api/profile?userId=${guestId}&cancerType=breast`);
    const checkBreastRes = await getProfile(checkBreastReq);
    const checkBreastJson = await checkBreastRes.json();
    expect(checkBreastJson.profile).toBeNull();

    // Verify lung is still intact
    const checkLungReq = new Request(`http://localhost:3000/api/profile?userId=${guestId}&cancerType=lung`);
    const checkLungRes = await getProfile(checkLungReq);
    const checkLungJson = await checkLungRes.json();
    expect(checkLungJson.profile).toBeDefined();
    expect(checkLungJson.profile.cancerType).toBe('lung');
  });

  it('should accurately update reportMarkdown for the designated cancer slot via PUT', async () => {
    // 1. Post Lung Profile
    await postProfile(new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: guestId,
        cancerType: 'lung',
        tumorSize: 1.2,
      }),
    }));

    // 2. Post Breast Profile
    await postProfile(new Request('http://localhost:3000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: guestId,
        cancerType: 'breast',
        tumorSize: 2.1,
      }),
    }));

    // 3. PUT reportMarkdown for breast cancer slot
    const putRes = await putProfile(new Request('http://localhost:3000/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: guestId,
        cancerType: 'breast',
        reportMarkdown: '# 乳腺癌专属深度循证解读报告\n\nLuminal A型...',
      }),
    }));
    const putJson = await putRes.json();
    expect(putRes.status).toBe(200);
    expect(putJson.success).toBe(true);
    expect(putJson.profile.cancerType).toBe('breast');
    expect(putJson.profile.reportMarkdown).toContain('乳腺癌专属深度循证解读报告');

    // 4. Verify lung record reportMarkdown remains unaffected (null / falsy)
    const getLungRes = await getProfile(new Request(`http://localhost:3000/api/profile?userId=${guestId}&cancerType=lung`));
    const getLungJson = await getLungRes.json();
    expect(getLungJson.profile.cancerType).toBe('lung');
    expect(getLungJson.profile.reportMarkdown).toBeFalsy();

    // 5. Verify breast record reportMarkdown is persisted
    const getBreastRes = await getProfile(new Request(`http://localhost:3000/api/profile?userId=${guestId}&cancerType=breast`));
    const getBreastJson = await getBreastRes.json();
    expect(getBreastJson.profile.cancerType).toBe('breast');
    expect(getBreastJson.profile.reportMarkdown).toContain('乳腺癌专属深度循证解读报告');
  });
});
