"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartHandshake, 
  Coffee, 
  Heart, 
  Receipt, 
  MessageSquareHeart, 
  ChevronRight 
} from "lucide-react";
import { LOVE_RELAY_ITEMS } from "@/lib/loveRelayData";
import PublicWelfareDonationModal from "./PublicWelfareDonationModal";

interface PublicWelfareBannerProps {
  variant?: "card" | "compact";
  sourceContext?: string;
  className?: string;
}

export default function PublicWelfareBanner({
  variant = "card",
  sourceContext = "general",
  className = "",
}: PublicWelfareBannerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"qr" | "ledger" | "relay">("qr");
  const [activeRelayIdx, setActiveRelayIdx] = useState(0);

  // 轮播展示爱心接力暖心留言 (每 5 秒切换一次)
  useEffect(() => {
    if (LOVE_RELAY_ITEMS.length === 0) return;
    const timer = setInterval(() => {
      setActiveRelayIdx((prev) => (prev + 1) % LOVE_RELAY_ITEMS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentRelay = LOVE_RELAY_ITEMS.length > 0 ? LOVE_RELAY_ITEMS[activeRelayIdx % LOVE_RELAY_ITEMS.length] : null;

  const handleOpenModal = (tab: "qr" | "ledger" | "relay") => {
    setModalTab(tab);
    setModalOpen(true);
  };

  if (variant === "compact") {
    return (
      <>
        <div className={`p-3 rounded-xl bg-gradient-to-r from-teal-50/70 via-sky-50/50 to-rose-50/40 border border-teal-100 flex items-center justify-between gap-3 text-xs ${className}`}>
          <div className="flex items-center gap-2 min-w-0">
            <HeartHandshake className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="text-slate-700 font-medium truncate">
              纯开源无广告公益项目 · 愿每一位病友都能平安渡过难关
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleOpenModal("qr")}
            className="px-2.5 py-1 rounded-lg bg-white text-teal-700 font-bold border border-teal-200 shadow-2xs hover:bg-teal-50 transition-colors shrink-0 flex items-center gap-1"
          >
            <Coffee className="w-3 h-3 text-teal-600" />
            <span>请喝咖啡</span>
          </button>
        </div>

        <PublicWelfareDonationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultTab={modalTab}
          sourceContext={sourceContext}
        />
      </>
    );
  }

  return (
    <>
      <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-teal-50/30 to-rose-50/20 border border-slate-200 shadow-2xs space-y-3 relative overflow-hidden ${className}`}>
        
        {/* Header Title & Non-profit Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black text-slate-900">
              公益同行 · 淋过雨所以想为更多人撑把伞
            </span>
            <span className="text-[10px] text-teal-700 font-bold bg-white px-2 py-0.5 rounded-full border border-teal-200/80 shadow-2xs shrink-0">
              纯开源永久免费
            </span>
          </div>

          {/* Ledger / Transparency trigger */}
          <button
            type="button"
            onClick={() => handleOpenModal("ledger")}
            className="text-[11px] font-bold text-slate-500 hover:text-teal-700 transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Receipt className="w-3 h-3 text-slate-400" />
            <span>查看服务器透明账单</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Dynamic Love-Relay Ticker */}
        {currentRelay ? (
          <div 
            onClick={() => handleOpenModal("relay")}
            className="p-3 rounded-xl bg-white/90 border border-slate-200/80 hover:border-teal-300 transition-all cursor-pointer group shadow-2xs space-y-1.5"
            title="点击查看抗癌爱心接力"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <MessageSquareHeart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="text-[11px] font-bold text-slate-800 truncate">
                  {currentRelay.donorName}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${currentRelay.cancerColor}`}>
                  {currentRelay.cancerTag}
                </span>
              </div>
              <span className="text-[11px] font-black text-teal-700 font-mono shrink-0">
                爱心支持 {currentRelay.amount}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed truncate group-hover:text-slate-900 transition-colors">
              “{currentRelay.message}”
            </p>
          </div>
        ) : (
          <div 
            onClick={() => handleOpenModal("relay")}
            className="p-3 rounded-xl bg-white/90 border border-slate-200/80 hover:border-teal-300 transition-all cursor-pointer group shadow-2xs flex items-center justify-between text-xs text-slate-500"
          >
            <span>点此留下第一条抗癌祈福寄语上墙 ✍️</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        )}

        {/* Action Bottom Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            若本平台为您的求医之路抚平了一丝焦虑，欢迎自愿赞助以维系服务器与文献检索运转。
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenModal("qr")}
              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>请喝咖啡 · 自愿赞赏</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModal("relay")}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>抗癌爱心接力</span>
            </button>
          </div>
        </div>

      </div>

      <PublicWelfareDonationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab={modalTab}
        sourceContext={sourceContext}
      />
    </>
  );
}
