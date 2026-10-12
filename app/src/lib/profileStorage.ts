import type { CancerType, PatientProfile } from "@/lib/types";

export const STORAGE_KEY_ACTIVE_SLOT = "zhiaiwiki_active_cancer_slot";
export const STORAGE_KEY_SLOT_PREFIX = "zhiaiwiki_profile_";
export const STORAGE_KEY_LEGACY = "zhiaiwiki_profile";
export const STORAGE_KEY_FALLBACK_LEGACY = "patient_profile";
export const EVENT_SLOT_CHANGED = "zhiaiwiki-slot-changed";

const KNOWN_CANCER_TYPES: CancerType[] = ["lung", "breast", "colon", "rectal", "gastric", "liver", "esophageal", "colorectal", "thyroid", "endometrial", "cervical", "pancreatic"];

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/**
 * 自动迁移旧版单档案至对应癌种卡槽（向下兼容逻辑）
 */
function checkAndMigrateLegacyProfile(): void {
  if (!isBrowser()) return;
  try {
    // 若已有任何现代化卡槽存在，表明已经完成过迁移或初始化，绝不可由旧镜像反向复活已删除的数据
    const hasAnySlot = KNOWN_CANCER_TYPES.some(t => Boolean(localStorage.getItem(`${STORAGE_KEY_SLOT_PREFIX}${t}`)));
    if (hasAnySlot) return;

    const legacyRaw = localStorage.getItem(STORAGE_KEY_LEGACY) || localStorage.getItem(STORAGE_KEY_FALLBACK_LEGACY);
    if (!legacyRaw) return;

    const parsed = JSON.parse(legacyRaw);
    if (!parsed || (!parsed.stage && !parsed.noduleType && !parsed.tumorSize && !parsed.organ && !parsed.tStage)) {
      return;
    }

    const cancerType: CancerType = (parsed.cancerType === "breast" || parsed.organ === "breast")
      ? "breast"
      : (parsed.cancerType === "colon" || parsed.organ === "colon")
      ? "colon"
      : (parsed.cancerType === "rectal" || parsed.organ === "rectal")
      ? "rectal"
      : (parsed.cancerType === "gastric" || parsed.organ === "gastric" || parsed.organ === "stomach")
      ? "gastric"
      : (parsed.cancerType === "liver" || parsed.organ === "liver" || parsed.organ === "hcc")
      ? "liver"
      : (parsed.cancerType === "esophageal" || parsed.organ === "esophageal" || parsed.organ === "esophagus" || parsed.organ === "escc")
      ? "esophageal"
      : (parsed.cancerType === "thyroid" || parsed.organ === "thyroid")
      ? "thyroid"
      : (parsed.cancerType === "endometrial" || parsed.organ === "endometrial" || parsed.organ === "uterus")
      ? "endometrial"
      : (parsed.cancerType === "cervical" || parsed.organ === "cervical" || parsed.organ === "cervix")
      ? "cervical"
      : (parsed.cancerType === "colorectal" || parsed.organ === "colorectal")
      ? "colorectal"
      : (parsed.cancerType === "pancreatic" || parsed.organ === "pancreatic" || parsed.organ === "pancreas")
      ? "pancreatic"
      : "lung";

    const targetKey = `${STORAGE_KEY_SLOT_PREFIX}${cancerType}`;
    // 若对应卡槽尚无数据，将旧版档案填入
    if (!localStorage.getItem(targetKey)) {
      localStorage.setItem(targetKey, JSON.stringify({ ...parsed, cancerType }));
    }
  } catch (e) {
    console.warn("Profile migration notice:", e);
  }
}

/**
 * 获取当前激活的档案卡槽
 */
export function getActiveCancerSlot(): CancerType {
  if (!isBrowser()) return "lung";
  checkAndMigrateLegacyProfile();

  const savedSlot = localStorage.getItem(STORAGE_KEY_ACTIVE_SLOT) as CancerType | null;
  if (savedSlot && KNOWN_CANCER_TYPES.includes(savedSlot)) {
    return savedSlot;
  }

  // 尝试从全局癌种同步
  const activeGlobal = (localStorage.getItem("zhiaiwiki_active_cancer_type") || localStorage.getItem("zhiaiwiki_default_cancer_type")) as CancerType | null;
  if (activeGlobal && KNOWN_CANCER_TYPES.includes(activeGlobal)) {
    return activeGlobal;
  }

  // 若存在乳腺卡槽但无肺癌卡槽，默认激活乳腺
  if (localStorage.getItem(`${STORAGE_KEY_SLOT_PREFIX}breast`) && !localStorage.getItem(`${STORAGE_KEY_SLOT_PREFIX}lung`)) {
    return "breast";
  }

  return "lung";
}

/**
 * 切换激活的档案卡槽，并同步镜像至旧键以确保全局兼容
 */
export function setActiveCancerSlot(slot: CancerType): void {
  if (!isBrowser()) return;
  if (!KNOWN_CANCER_TYPES.includes(slot)) return;

  localStorage.setItem(STORAGE_KEY_ACTIVE_SLOT, slot);

  // 镜像当前卡槽档案至旧版 zhiaiwiki_profile，保持全站未改造组件平稳运行
  const currentProfile = getProfileBySlot(slot);
  if (currentProfile) {
    localStorage.setItem(STORAGE_KEY_LEGACY, JSON.stringify(currentProfile));
  } else {
    // 若当前卡槽暂未建档，清空旧版镜像
    localStorage.removeItem(STORAGE_KEY_LEGACY);
  }

  window.dispatchEvent(new CustomEvent(EVENT_SLOT_CHANGED, { detail: { slot, profile: currentProfile } }));
  window.dispatchEvent(new Event("storage"));
}

/**
 * 读取特定癌种卡槽的病历档案
 */
export function getProfileBySlot(slot: CancerType): PatientProfile | null {
  if (!isBrowser()) return null;
  checkAndMigrateLegacyProfile();

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_SLOT_PREFIX}${slot}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return { ...parsed, cancerType: slot };
      }
    }
  } catch (e) {
    console.error(`Failed to parse profile for slot ${slot}:`, e);
  }
  return null;
}

/**
 * 保存患者档案至特定卡槽
 */
export function saveProfileToSlot(profile: PatientProfile, targetSlot?: CancerType): void {
  if (!isBrowser()) return;

  const slot: CancerType = targetSlot || (
    profile.cancerType === "pancreatic" || (profile as any).organ === "pancreas" || (profile as any).organ === "pancreatic"
      ? "pancreatic"
      : profile.cancerType === "thyroid" || (profile as any).organ === "thyroid"
      ? "thyroid"
      : profile.cancerType === "esophageal" || (profile as any).organ === "esophageal" || (profile as any).organ === "esophagus" || (profile as any).organ === "escc"
      ? "esophageal"
      : profile.cancerType === "endometrial" || (profile as any).organ === "endometrial" || (profile as any).organ === "uterine" || (profile as any).cancerType === "uterine"
      ? "endometrial"
      : profile.cancerType === "cervical" || (profile as any).organ === "cervical" || (profile as any).organ === "cervix"
      ? "cervical"
      : profile.cancerType === "liver" || (profile as any).organ === "liver" || (profile as any).organ === "hcc"
      ? "liver"
      : profile.cancerType === "gastric" || (profile as any).organ === "gastric" || (profile as any).organ === "stomach"
      ? "gastric"
      : profile.cancerType === "breast" || (profile as any).organ === "breast"
      ? "breast"
      : profile.cancerType === "colon" || (profile as any).organ === "colon"
      ? "colon"
      : profile.cancerType === "rectal" || (profile as any).organ === "rectal"
      ? "rectal"
      : profile.cancerType === "colorectal" || (profile as any).organ === "colorectal"
      ? "colorectal"
      : "lung"
  );

  const enrichedProfile = {
    ...profile,
    cancerType: slot,
  } as PatientProfile;

  const slotKey = `${STORAGE_KEY_SLOT_PREFIX}${slot}`;
  localStorage.setItem(slotKey, JSON.stringify(enrichedProfile));

  // 若保存的卡槽正是当前活跃卡槽，同步刷新镜像
  const activeSlot = getActiveCancerSlot();
  if (activeSlot === slot) {
    localStorage.setItem(STORAGE_KEY_LEGACY, JSON.stringify(enrichedProfile));
  }

  window.dispatchEvent(new CustomEvent(EVENT_SLOT_CHANGED, { detail: { slot, profile: enrichedProfile } }));
  window.dispatchEvent(new Event("storage"));
}

/**
 * 获取当前设备已建立档案的所有癌种卡槽
 */
export function getAvailableProfileSlots(): CancerType[] {
  if (!isBrowser()) return [];
  checkAndMigrateLegacyProfile();

  const available: CancerType[] = [];
  for (const type of KNOWN_CANCER_TYPES) {
    const raw = localStorage.getItem(`${STORAGE_KEY_SLOT_PREFIX}${type}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.stage || parsed.tStage || parsed.noduleType || parsed.tumorSize || parsed.organ || parsed.biRads || parsed.histology)) {
          available.push(type);
        }
      } catch {}
    }
  }
  return available;
}

/**
 * 注销指定卡槽病历档案
 */
export function deleteProfileSlot(slot: CancerType): void {
  if (!isBrowser()) return;

  localStorage.removeItem(`${STORAGE_KEY_SLOT_PREFIX}${slot}`);

  // 若旧版镜像也恰好指向被注销的癌种，清理旧版镜像以防读取过时数据
  try {
    const legacyRaw = localStorage.getItem(STORAGE_KEY_LEGACY);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (parsed?.cancerType === slot || parsed?.organ === slot) {
        localStorage.removeItem(STORAGE_KEY_LEGACY);
      }
    }
  } catch {}

  const remaining = getAvailableProfileSlots();
  const currentActive = getActiveCancerSlot();

  if (currentActive === slot) {
    if (remaining.length > 0) {
      // 自动切换至剩余的另一病案卡槽
      setActiveCancerSlot(remaining[0]);
    } else {
      // 无任何档案剩余，重置
      localStorage.removeItem(STORAGE_KEY_ACTIVE_SLOT);
      localStorage.removeItem(STORAGE_KEY_LEGACY);
      window.dispatchEvent(new CustomEvent(EVENT_SLOT_CHANGED, { detail: { slot, profile: null } }));
      window.dispatchEvent(new Event("storage"));
    }
  } else {
    window.dispatchEvent(new CustomEvent(EVENT_SLOT_CHANGED, { detail: { slot, profile: null } }));
    window.dispatchEvent(new Event("storage"));
  }
}

/**
 * 判断当前患者是否为多原发恶性肿瘤（MPMN，同时拥有 >= 2 份病历）
 */
export function hasDualPrimaryProfile(): boolean {
  return getAvailableProfileSlots().length >= 2;
}

/**
 * 获取双原发/多原发病历概览，用于跨癌种协同
 */
export function getDualPrimarySummary(): {
  slots: CancerType[];
  isDualPrimary: boolean;
  lungProfile: PatientProfile | null;
  breastProfile: PatientProfile | null;
  colonProfile: PatientProfile | null;
  rectalProfile: PatientProfile | null;
  colorectalProfile: PatientProfile | null;
  gastricProfile: PatientProfile | null;
  liverProfile: PatientProfile | null;
  esophagealProfile: PatientProfile | null;
  thyroidProfile: PatientProfile | null;
  endometrialProfile: PatientProfile | null;
  cervicalProfile: PatientProfile | null;
  pancreaticProfile: PatientProfile | null;
} {
  const slots = getAvailableProfileSlots();
  return {
    slots,
    isDualPrimary: slots.length >= 2,
    lungProfile: getProfileBySlot("lung"),
    breastProfile: getProfileBySlot("breast"),
    colonProfile: getProfileBySlot("colon"),
    rectalProfile: getProfileBySlot("rectal"),
    colorectalProfile: getProfileBySlot("colorectal"),
    gastricProfile: getProfileBySlot("gastric"),
    liverProfile: getProfileBySlot("liver"),
    esophagealProfile: getProfileBySlot("esophageal"),
    thyroidProfile: getProfileBySlot("thyroid"),
    endometrialProfile: getProfileBySlot("endometrial"),
    cervicalProfile: getProfileBySlot("cervical"),
    pancreaticProfile: getProfileBySlot("pancreatic"),
  };
}
