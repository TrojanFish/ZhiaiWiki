"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Coffee, 
  Heart, 
  HeartHandshake, 
  ShieldCheck, 
  Check, 
  Copy, 
  ZoomIn, 
  Server, 
  Globe, 
  Lock, 
  Smartphone,
  ChevronRight,
  Receipt,
  MessageSquareHeart,
  QrCode,
  ArrowRight
} from "lucide-react";
import { 
  DONATION_TIERS, 
  OPERATING_COST_LEDGER, 
  LOVE_RELAY_ITEMS,
  type LoveRelayItem 
} from "@/lib/loveRelayData";
import LoveRelaySubmitModal from "@/components/about/LoveRelaySubmitModal";

interface PublicWelfareDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "qr" | "ledger" | "relay";
  sourceContext?: string; // 例如 "profile" 或 "wiki"
}

export default function PublicWelfareDonationModal({
  isOpen,
  onClose,
  defaultTab = "qr",
  sourceContext = "general",
}: PublicWelfareDonationModalProps) {
  const [activeTab, setActiveTab] = useState<"qr" | "ledger" | "relay">(defaultTab);
  const [selectedTier, setSelectedTier] = useState<string>("19.9");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isQrZoomed, setIsQrZoomed] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [relayList, setRelayList] = useState<LoveRelayItem[]>(LOVE_RELAY_ITEMS);

  const contactEmail = "2909138455@qq.com";

  // 拉取动态爱心接力列表
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/love-relay")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setRelayList(data.items);
        }
      })
      .catch((err) => {
        console.warn("Notice: fetch love relay in modal:", err);
      });
  }, [isOpen]);

  // ESC 键关闭与背景锁定
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(contactEmail)
        .then(() => {
          setCopiedEmail(true);
          setTimeout(() => setCopiedEmail(false), 2500);
        })
        .catch(() => fallbackCopy(contactEmail));
    } else {
      fallbackCopy(contactEmail);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-sky-500 to-rose-400 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-7 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-extrabold border border-teal-200">
              <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
              <span>纯学术开源 · 永久无商业广告</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              因为淋过雨，想为迷茫的你撑一把伞
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              这里没有诱导消费与收费门槛。您的每一份心意，都将 100% 用于维持开源服务器与学术算力运转。
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0"
            title="关闭窗口"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-7 pt-3 flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("qr")}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "qr"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>自愿赞赏扫码</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ledger")}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "ledger"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>透明运营账单</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("relay")}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "relay"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>抗癌爱心接力</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: QR & Donation Tiers */}
          {activeTab === "qr" && (
            <div className="space-y-6">
              
              {/* Preset Tier Cards */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                  <span>选择心意档位（金额随心）</span>
                  <span className="text-[11px] text-teal-600 font-normal">支持微信扫码赞赏</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DONATION_TIERS.map((tier) => {
                    const isSelected = selectedTier === tier.amount;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedTier(tier.amount)}
                        className={`relative rounded-2xl p-3 border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500/50"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        {tier.popular && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-md bg-teal-600 text-white text-[9px] font-black tracking-tight shadow-xs">
                            最多病友选
                          </span>
                        )}
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {tier.title}
                        </div>
                        <div className="text-base sm:text-lg font-black text-teal-700 font-mono mt-0.5">
                          {tier.amount === "custom" ? "随心" : `¥${tier.amount}`}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight mt-1 truncate">
                          {tier.supportDesc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-slate-50/90 rounded-3xl p-5 sm:p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
                
                {/* QR Image Slot */}
                <div 
                  onClick={() => setIsQrZoomed(!isQrZoomed)}
                  className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-white p-3 border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-teal-500 hover:shadow-md transition-all shrink-0"
                  title="点击放大查看赞赏码"
                >
                  <img
                    src="/sponsor_qr.png?v=2026"
                    alt="自愿赞赏码"
                    className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                      const fallback = document.getElementById("modal-qr-placeholder");
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div id="modal-qr-placeholder" className="hidden flex-col items-center justify-center text-slate-400 text-center p-2">
                    <Coffee className="w-10 h-10 text-teal-600 mb-1.5" />
                    <span className="text-xs font-bold text-slate-700">自愿赞赏支持码</span>
                    <span className="text-[10px] text-slate-400 mt-1">微信扫码支持</span>
                  </div>

                  <div className="absolute inset-0 bg-teal-950/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-teal-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-xs flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>点击放大</span>
                    </span>
                  </div>
                </div>

                {/* QR Guide & Reassurance */}
                <div className="space-y-3 max-w-xs">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-teal-700">
                      <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                      <span>长按保存或微信扫一扫</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      支持开发者兼病友 Keiyee
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      若您在使用中得到了一丝力量，欢迎赞赏支持。所有资金流向均在旁侧账单中公开。
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
                    <span className="text-xs text-slate-500">反馈或交流：</span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs hover:border-teal-300 transition-all"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmail ? "已复制邮箱" : "复制创作者邮箱"}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Ergonomic Direct Link: WeChat Sponsored -> Leave Blessing */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-extrabold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <HeartHandshake className="w-4.5 h-4.5 text-teal-100" />
                  <span>已微信赞赏？点此留下抗癌寄语上墙</span>
                  <ArrowRight className="w-4 h-4 text-teal-200" />
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  赞赏金额随心 · 填写寄语后站长将为您点亮专属绿色认证徽章
                </p>
              </div>

              {/* Bottom Reassurance Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2 leading-relaxed">
                <Heart className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>不勉强原则</strong>：如果当前正面临经济压力或高昂的医疗支出，<strong>请千万不要打赏</strong>！多给自己和家人补充一份优质营养蛋白。您的健康痊愈，就是对开源项目最大的鼓励！
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Transparent Operational Ledger */}
          {activeTab === "ledger" && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">平台刚性技术开支公示</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  为了坚守绝不接入任何违规商业广告与处方中介的底线，以下为 知癌维基 (ZhiaiWiki) 每月真实产生的基础设施硬件支出：
                </p>
              </div>

              <div className="space-y-3">
                {OPERATING_COST_LEDGER.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-colors flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {idx === 0 ? <Server className="w-4 h-4" /> : idx === 1 ? <Globe className="w-4 h-4" /> : idx === 2 ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900 truncate">{item.name}</span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 shrink-0">
                          {item.monthlyCost}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.detail}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        类目：{item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("qr")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl border border-teal-200 transition-all"
                >
                  <span>支持服务器持续运转 · 前往赞赏</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Love-Relay Wall */}
          {activeTab === "relay" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>病友爱心接力暖流</span>
                  <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    同路相伴
                  </span>
                </h4>
                <p className="text-xs text-slate-500">
                  来自全国各地病友与家属的真实温情留言，每一声问候都在照亮同路人的黑夜：
                </p>
              </div>

              <div className="space-y-3">
                {relayList.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 space-y-2 hover:shadow-2xs transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-extrabold text-slate-900 truncate">
                          {item.donorName}
                        </span>
                        {item.isTest && (
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                            示范数据
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${item.cancerColor}`}>
                          {item.cancerTag}
                        </span>
                      </div>
                      <span className="text-xs font-black text-teal-700 font-mono shrink-0">
                        支持 {item.amount}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      “{item.message}”
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>{item.city ? `${item.city} · ` : ""}{item.date}</span>
                      <span className="text-emerald-600 flex items-center gap-1 font-medium">
                        <Check className="w-3 h-3" />
                        <span>已验证爱心支持</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>已赞赏？点此留下抗癌寄语上墙</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("qr")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-4 py-2.5 rounded-xl border border-teal-200 transition-all cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>去微信扫码赞赏支持</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px] text-slate-400">
            所有核心功能 100% 永久免费使用
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-bold transition-all"
          >
            我先看看，暂不赞赏
          </button>
        </div>

      </div>

      {/* Enlarged QR Modal (If clicked) */}
      {isQrZoomed && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in cursor-pointer"
          onClick={() => setIsQrZoomed(false)}
        >
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">微信扫一扫 · 自愿赞赏</span>
              <button 
                type="button" 
                onClick={() => setIsQrZoomed(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img 
              src="/sponsor_qr.png?v=2026" 
              alt="赞赏二维码放大" 
              className="w-64 h-64 mx-auto object-contain rounded-2xl border border-slate-100 shadow-sm"
            />
            <p className="text-xs text-slate-500">
              长按可保存图片，微信识别赞赏
            </p>

            <button
              type="button"
              onClick={() => {
                setIsQrZoomed(false);
                setShowSubmitModal(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>已微信赞赏？点此留下抗癌寄语上墙</span>
            </button>
          </div>
        </div>
      )}

      {/* Embedded Love Relay Blessing Submission Modal */}
      {showSubmitModal && (
        <LoveRelaySubmitModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onSuccess={(newItem) => {
            setShowSubmitModal(false);
            setActiveTab("relay");
            setRelayList((prev) => [newItem, ...prev.filter((item) => item.id !== newItem.id)]);
          }}
        />
      )}
    </div>
  );
}
