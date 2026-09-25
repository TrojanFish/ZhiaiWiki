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
  sourceContext?: string; // 例如 "navbar", "profile", "wiki", "love-relay"
}

/**
 * 知癌维基 ZhiaiWiki · 请喝咖啡 / 公益赞赏模态框 (Apple iOS HIG 3-Tier Architecture)
 * 1. Tier 1: Fixed Sticky Header (iOS HIG 握手条 + 磨砂圆钮 + 视网膜双行标)
 * 2. Segmented Control: iOS 原生分段控制器 (自愿赞赏 / 运营账单 / 爱心接力)
 * 3. Tier 2: Scrollable Body (弹性平滑滚动 + 苹果原生卡片排版)
 * 4. Tier 3: Fixed Sticky Footer (固定吸底操作栏 + 免费公益保底承诺)
 */
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

  // 同步外部 defaultTab 变化
  useEffect(() => {
    if (isOpen && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

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
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
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
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in overflow-hidden sm:overflow-y-auto cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-modal-title"
    >
      {/* 弹窗主体容器 (Apple iOS HIG 3-Tier Architecture) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl md:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-200/90 shadow-2xl flex flex-col max-h-[92vh] text-slate-900 animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-0 overflow-hidden cursor-default"
      >
        {/* iOS HIG Sheet Grabber for Mobile */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="sheet-grabber !my-0" />
        </div>

        {/* Tier 1: Fixed Sticky Header (固定吸顶) */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-50 to-orange-50 border border-amber-200/70 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Coffee className="w-4.5 h-4.5 animate-coffee-wiggle" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 id="donation-modal-title" className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-snug truncate">
                  请作者喝杯咖啡 · 自愿赞赏
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  纯学术开源
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                永久无商业广告 · 100% 用于开源算力与文献解析
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors active:scale-95 cursor-pointer shrink-0"
            aria-label="关闭窗口"
            title="关闭窗口"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Apple Native Segmented Control (iOS 原生圆角分段切换胶囊) */}
        <div className="px-5 sm:px-6 pt-3 pb-1 bg-white shrink-0">
          <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/60 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                activeTab === "qr"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-amber-600" />
              <span>自愿赞赏扫码</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("ledger")}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                activeTab === "ledger"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              <span>透明运营账单</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("relay")}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                activeTab === "relay"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <MessageSquareHeart className="w-3.5 h-3.5 text-rose-500" />
              <span>抗癌爱心接力</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            </button>
          </div>
        </div>

        {/* Tier 2: Scrollable Body (弹性可滚动内容区域) */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto custom-scrollbar space-y-4 sm:space-y-5">
          
          {/* TAB 1: QR & Donation Tiers */}
          {activeTab === "qr" && (
            <div className="space-y-4 sm:space-y-5">
              
              {/* Preset Tier Cards (Apple-Native Segmented Grid) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800">选择心意档位（自愿随心）</span>
                  <span className="text-[11px] text-amber-700 font-medium">支持微信扫码赞赏</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DONATION_TIERS.map((tier) => {
                    const isSelected = selectedTier === tier.amount;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedTier(tier.amount)}
                        className={`relative rounded-2xl p-3 border text-left transition-all cursor-pointer select-none ${
                          isSelected
                            ? "bg-amber-50/80 border-amber-400 shadow-xs ring-2 ring-amber-300/40 text-slate-900"
                            : "bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-800"
                        }`}
                      >
                        {tier.popular && (
                          <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-md bg-amber-600 text-white text-[9px] font-black tracking-tight shadow-2xs">
                            最多病友选
                          </span>
                        )}
                        <div className="text-xs font-bold truncate">
                          {tier.title}
                        </div>
                        <div className="text-base sm:text-lg font-black text-amber-700 font-mono mt-0.5">
                          {tier.amount === "custom" ? "随心" : `¥${tier.amount}`}
                        </div>
                        <div className="text-[10px] text-slate-500 leading-tight mt-1 truncate">
                          {tier.supportDesc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QR Code Presentation (Apple Frosted Card) */}
              <div className="bg-slate-50/70 rounded-3xl p-4 sm:p-5 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-center gap-5 text-center sm:text-left">
                
                {/* QR Image Slot */}
                <div 
                  onClick={() => setIsQrZoomed(true)}
                  className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-white p-2.5 border border-slate-200 shadow-xs flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-amber-400 hover:shadow-md transition-all shrink-0"
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
                    <Coffee className="w-10 h-10 text-amber-600 mb-1.5" />
                    <span className="text-xs font-bold text-slate-700">自愿赞赏支持码</span>
                    <span className="text-[10px] text-slate-400 mt-1">微信扫码支持</span>
                  </div>

                  <div className="absolute inset-0 bg-slate-950/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-xs flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>点击放大</span>
                    </span>
                  </div>
                </div>

                {/* QR Guide & Reassurance */}
                <div className="space-y-3 max-w-xs text-left">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                      <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                      <span>长按保存或微信扫一扫</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      支持开发者兼病友 Keiyee
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      若您在使用中得到了一丝力量与清晰方向，欢迎赞赏支持。所有资金流向均在旁侧账单中公开。
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
                    <span className="text-xs text-slate-500">反馈或交流：</span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs hover:border-amber-300 transition-all cursor-pointer active:scale-95"
                    >
                      {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedEmail ? "已复制邮箱" : "复制创作者邮箱"}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Action Button: WeChat Sponsored -> Leave Blessing */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-extrabold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <HeartHandshake className="w-4.5 h-4.5 text-amber-100" />
                  <span>已微信赞赏？点此留下抗癌寄语上墙</span>
                  <ArrowRight className="w-4 h-4 text-amber-200" />
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  赞赏金额随心 · 填写寄语后站长将为您点亮专属绿色认证徽章
                </p>
              </div>

              {/* Warm Reassurance Callout */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
                <Heart className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 fill-amber-500/20" />
                <div>
                  <strong>不勉强原则</strong>：如果当前正面临就医与经济压力，<strong>请千万不要打赏</strong>！请将每一分钱优先用于患者自身的营养与规范治疗。您的健康痊愈，就是对开源项目最大的鼓励！
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Transparent Operational Ledger */}
          {activeTab === "ledger" && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">平台刚性技术开支公示</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  为了坚守绝不接入任何违规商业广告与处方中介的底线，以下为 知癌维基 (ZhiaiWiki) 每月真实产生的基础设施硬件支出：
                </p>
              </div>

              <div className="space-y-2.5">
                {OPERATING_COST_LEDGER.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-colors flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {idx === 0 ? <Server className="w-4 h-4" /> : idx === 1 ? <Globe className="w-4 h-4" /> : idx === 2 ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-900 truncate">{item.name}</span>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 shrink-0">
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/80 px-4 py-2 rounded-xl border border-amber-200/80 transition-all cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5" />
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

              <div className="space-y-2.5">
                {relayList.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-2 shadow-2xs hover:shadow-xs transition-shadow"
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
                      <span className="text-xs font-black text-amber-700 font-mono shrink-0">
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

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>已赞赏？点此留下抗癌寄语上墙</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("qr")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100/80 px-4 py-2.5 rounded-xl border border-amber-200/80 transition-all cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>去微信扫码赞赏支持</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Tier 3: Fixed Sticky Footer (Apple HIG 规范吸底栏) */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 bg-white shrink-0 rounded-b-3xl shadow-[0_-6px_20px_rgba(0,0,0,0.05)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] sm:text-xs">知癌维基全站功能永久免费开放</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0"
          >
            我知道了 / 关闭
          </button>
        </div>

      </div>

      {/* Enlarged QR Modal (Apple Frosted Overlay) */}
      {isQrZoomed && (
        <div 
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in cursor-pointer"
          onClick={() => setIsQrZoomed(false)}
        >
          <div className="bg-white p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl cursor-default" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">微信扫一扫 · 自愿赞赏</span>
              <button 
                type="button" 
                onClick={() => setIsQrZoomed(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
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
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
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
