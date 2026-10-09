import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminAuth";
import {
  getAdminRelayRecords,
  toggleVerifyRecord,
  updateRecordStatus,
  deleteRelayRecord,
} from "@/lib/loveRelayStorage";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/love-relay
 * 管理员获取全量祈福与打赏记录 (含完整单号后4位)
 */
export async function GET(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ success: false, error: "未授权的访问：请先登录管理员账户" }, { status: 401 });
    }

    const items = getAdminRelayRecords();
    return NextResponse.json({
      success: true,
      items,
      total: items.length,
    });
  } catch (error: any) {
    console.error("Admin fetch love relay failed:", error);
    const safeError = process.env.NODE_ENV === 'production' ? "获取记录失败，请稍后重试" : (error.message || "获取记录失败");
    return NextResponse.json({ success: false, error: safeError }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/love-relay
 * 切换认证状态或隐藏/显示
 */
export async function PATCH(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ success: false, error: "未授权的访问：请先登录管理员账户" }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, status } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "缺少有效记录 ID" }, { status: 400 });
    }

    if (action === "toggleVerify") {
      const updated = toggleVerifyRecord(id);
      if (!updated) {
        return NextResponse.json({ success: false, error: "未找到该记录" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: updated.verified ? "已点亮爱心支持者徽章" : "已取消爱心支持者徽章",
        item: updated,
      });
    }

    if (action === "updateStatus") {
      if (status !== "approved" && status !== "hidden") {
        return NextResponse.json({ success: false, error: "无效的状态值" }, { status: 400 });
      }
      const updated = updateRecordStatus(id, status);
      if (!updated) {
        return NextResponse.json({ success: false, error: "未找到该记录" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: status === "hidden" ? "已隐藏该留言" : "已公开展示该留言",
        item: updated,
      });
    }

    return NextResponse.json({ success: false, error: "未知操作类型" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin update love relay failed:", error);
    const safeError = process.env.NODE_ENV === 'production' ? "更新记录失败，请稍后重试" : (error.message || "更新记录失败");
    return NextResponse.json({ success: false, error: safeError }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/love-relay
 * 删除违规或垃圾留言
 */
export async function DELETE(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ success: false, error: "未授权的访问：请先登录管理员账户" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "缺少记录 ID" }, { status: 400 });
    }

    const success = deleteRelayRecord(id);
    if (!success) {
      return NextResponse.json({ success: false, error: "未找到该记录或已删除" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "该记录已成功删除",
    });
  } catch (error: any) {
    console.error("Admin delete love relay failed:", error);
    const safeError = process.env.NODE_ENV === 'production' ? "删除记录失败，请稍后重试" : (error.message || "删除记录失败");
    return NextResponse.json({ success: false, error: safeError }, { status: 500 });
  }
}
