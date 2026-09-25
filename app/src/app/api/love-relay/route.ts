import { NextResponse } from "next/server";
import { getPublicRelayRecords, addRelayRecord } from "@/lib/loveRelayStorage";

export const dynamic = "force-dynamic";

/**
 * GET /api/love-relay
 * 获取公开病友祈福与爱心接力列表 (脱敏 txLast4)
 */
export async function GET() {
  try {
    const items = getPublicRelayRecords();
    return NextResponse.json({
      success: true,
      items,
      total: items.length,
    });
  } catch (error: any) {
    console.error("Failed to fetch love relay items:", error);
    return NextResponse.json(
      { success: false, error: "获取爱心接力列表失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/love-relay
 * 病友自助提交抗癌祈福 / 赞赏上墙留言
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { donorName, cancerTag, cancerColor, amount, message, city, txLast4 } = body;

    // 基本文本校验
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "抗癌寄语内容太短，请至少输入 5 个字。" },
        { status: 400 }
      );
    }

    if (message.trim().length > 400) {
      return NextResponse.json(
        { success: false, error: "寄语长度请控制在 400 字以内。" },
        { status: 400 }
      );
    }

    const cleanDonorName = typeof donorName === "string" && donorName.trim()
      ? donorName.trim().slice(0, 30)
      : "匿名温暖同行者";

    const cleanCancerTag = typeof cancerTag === "string" && cancerTag.trim()
      ? cancerTag.trim().slice(0, 20)
      : "全癌种同行";

    const cleanCity = typeof city === "string" && city.trim()
      ? city.trim().slice(0, 15)
      : undefined;

    const cleanAmount = typeof amount === "string" && amount.trim()
      ? amount.trim().slice(0, 20)
      : "随心支持";

    const cleanTxLast4 = typeof txLast4 === "string" && txLast4.trim()
      ? txLast4.trim().slice(0, 8)
      : undefined;

    const newRecord = addRelayRecord({
      donorName: cleanDonorName,
      cancerTag: cleanCancerTag,
      cancerColor: typeof cancerColor === "string" ? cancerColor : undefined,
      amount: cleanAmount,
      message: message.trim(),
      city: cleanCity,
      txLast4: cleanTxLast4,
    });

    // 返回时前台脱敏单号
    const { txLast4: _, ...safeReturn } = newRecord;

    return NextResponse.json({
      success: true,
      message: "感谢您的温暖支持与真挚寄语，已成功上墙！",
      item: safeReturn,
    });
  } catch (error: any) {
    console.error("Failed to submit love relay item:", error);
    return NextResponse.json(
      { success: false, error: "提交失败，请稍后重试" },
      { status: 500 }
    );
  }
}
