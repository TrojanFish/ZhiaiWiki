import fs from "fs";
import path from "path";
import { LOVE_RELAY_ITEMS, type LoveRelayItem } from "./loveRelayData";

export interface LoveRelayRecord extends LoveRelayItem {
  txLast4?: string; // 微信支付单号后4位 (仅管理员核验可见，前台脱敏)
  status?: "approved" | "pending" | "hidden"; // 审核状态
  createdAt?: string;
}

type PublicLoveRelayItem = LoveRelayItem & { createdAt?: string };

const DATA_DIR = path.join(process.cwd(), "data");
const STORAGE_FILE = path.join(DATA_DIR, "love_relay.json");

function ensureStorage(): LoveRelayRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(STORAGE_FILE)) {
      const seed: LoveRelayRecord[] = LOVE_RELAY_ITEMS.map((item) => ({
        ...item,
        status: "approved",
        createdAt: new Date().toISOString(),
      }));
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(seed, null, 2), "utf-8");
      return seed;
    }

    const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data;
    }

    // If file is not an array (corrupt), re-seed
    const seed: LoveRelayRecord[] = LOVE_RELAY_ITEMS.map((item) => ({
      ...item,
      status: "approved",
      createdAt: new Date().toISOString(),
    }));
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  } catch (err) {
    console.warn("Notice: Using in-memory seed for LoveRelay:", err);
    return LOVE_RELAY_ITEMS.map((item) => ({
      ...item,
      status: "approved",
      createdAt: new Date().toISOString(),
    }));
  }
}

function saveStorage(records: LoveRelayRecord[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(records, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to save love_relay.json:", err);
    return false;
  }
}

/**
 * 获取公开可见的爱心接力列表 (按最新时间倒序，且已脱敏 txLast4)
 */
export function getPublicRelayRecords(): PublicLoveRelayItem[] {
  const records = ensureStorage();
  return records
    .filter((r) => r.status !== "hidden")
    .map((r) => {
      return Object.fromEntries(Object.entries(r).filter(([key]) => key !== "txLast4")) as PublicLoveRelayItem;
    })
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
}

/**
 * 管理员获取全量记录 (含未审核与 txLast4 核验信息)
 */
export function getAdminRelayRecords(): LoveRelayRecord[] {
  const records = ensureStorage();
  return records.sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

/**
 * 病友新增祈福/赞赏记录
 */
export function addRelayRecord(input: {
  donorName: string;
  cancerTag: string;
  cancerColor?: string;
  amount?: string;
  message: string;
  city?: string;
  txLast4?: string;
}): LoveRelayRecord {
  const records = ensureStorage();

  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const newRecord: LoveRelayRecord = {
    id: `relay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    donorName: input.donorName.trim() || "匿名温暖同行者",
    cancerTag: input.cancerTag.trim() || "全癌种同行",
    cancerColor: input.cancerColor || "bg-sky-50 text-sky-700 border-sky-200",
    amount: input.amount ? (input.amount.startsWith("¥") ? input.amount : `¥${input.amount}`) : "随心支持",
    message: input.message.trim(),
    city: input.city?.trim() || undefined,
    date: yearMonth,
    verified: false, // 初始为待核验状态，等待站长在微信账单核对后点亮
    status: "approved", // 默认直接在打赏墙展示，站长可随时隐藏
    txLast4: input.txLast4?.trim() || undefined,
    createdAt: now.toISOString(),
  };

  records.unshift(newRecord);
  saveStorage(records);

  return newRecord;
}

/**
 * 管理员切换核验认证状态 (点亮/取消 [已验证爱心支持 ⭐])
 */
export function toggleVerifyRecord(id: string): LoveRelayRecord | null {
  const records = ensureStorage();
  const target = records.find((r) => r.id === id);
  if (!target) return null;

  target.verified = !target.verified;
  saveStorage(records);
  return target;
}

/**
 * 管理员修改状态 (approved | hidden)
 */
export function updateRecordStatus(id: string, status: "approved" | "hidden"): LoveRelayRecord | null {
  const records = ensureStorage();
  const target = records.find((r) => r.id === id);
  if (!target) return null;

  target.status = status;
  saveStorage(records);
  return target;
}

/**
 * 管理员删除记录
 */
export function deleteRelayRecord(id: string): boolean {
  const records = ensureStorage();
  const filtered = records.filter((r) => r.id !== id);
  if (filtered.length === records.length) return false;

  saveStorage(filtered);
  return true;
}
