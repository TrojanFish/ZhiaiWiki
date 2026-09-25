"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  HeartHandshake, 
  ChevronLeft, 
  Search, 
  PenLine, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Coffee,
  Heart,
  MessageSquareHeart,
  Sparkles,
  MapPin,
  Calendar
} from "lucide-react";
import Footer from "@/components/Footer";
import { LOVE_RELAY_ITEMS, type LoveRelayItem } from "@/lib/loveRelayData";
import LoveRelaySubmitModal from "@/components/about/LoveRelaySubmitModal";
import PublicWelfareDonationModal from "@/components/common/PublicWelfareDonationModal";

const CANCER_TABS = [
  { label: "全部专区", key: "all" },
  { label: "肺癌", key: "肺癌" },
  { label: "乳腺癌", key: "乳腺癌" },
  { label: "结直肠癌", key: "结直肠癌" },
  { label: "胃癌", key: "胃癌" },
  { label: "肝癌", key: "肝癌" },
  { label: "食管癌", key: "食管癌" },
  { label: "甲状腺癌", key: "甲状腺癌" },
  { label: "胰腺癌", key: "胰腺癌" },
  { label: "子宫内膜癌", key: "子宫内膜癌" },
  { label: "宫颈癌", key: "宫颈癌" },
  { label: "爱心同行", key: "爱心同行" },
];

export default function LoveRelayPage() {
  const [relayItems, setRelayItems] = useState<LoveRelayItem[]>(LOVE_RELAY_ITEMS);
  const [activeCancer, setActiveCancer] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch live love relay items from server API
  useEffect(() => {
    fetch("/api/love-relay")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setRelayItems(data.items);
        }
      })
      .catch((err) => {
        console.warn("Notice: Fallback to static love relay items:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filtered relay records
  const filteredItems = useMemo(() => {
    return relayItems.filter((item) => {
      const matchCancer = activeCancer === "all" || item.cancerTag === activeCancer;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery = 
        !q ||
        item.donorName.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        item.cancerTag.toLowerCase().includes(q);

      return matchCancer && matchQuery;
    });
  }, [relayItems, activeCancer, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: relayItems.length };
    relayItems.forEach((item) => {
      counts[item.cancerTag] = (counts[item.cancerTag] || 0) + 1;
    });
    return counts;
  }, [relayItems]);

  const verifiedCount = useMemo(() => {
    return relayItems.filter((r) => r.verified).length;
  }, [relayItems]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-teal-500 selection:text-white">
      <main className="flex-1 max-w-7xl mx-auto w-full space-y-5 sm:space-y-6 pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-8 sm:pb-12 px-3.5 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-slate-500 hover:text-teal-700 transition-colors"
            >
              首页
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href="/about"
              className="text-slate-500 hover:text-teal-700 transition-colors"
            >
              关于我们
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-extrabold">抗癌爱心接力</span>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-800 hover:underline font-semibold"
          >
            <span>关于我们 · 创作者初衷</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Hero Banner Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xs border border-slate-200/90 relative overflow-hidden space-y-5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                <span>病友与家属抗癌温情接力</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                生命相托 · 温暖回响
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                记录病友术后 3 年、5 年大复查平稳通关的胜利战报，以及来自全国战友与家属的真挚祈福。<br className="hidden sm:inline" />
                每一个名字背后都是一段不屈的抗癌征程，多一份同路人的鼓励，就多一份直面未知的勇气。
              </p>
            </div>

            {/* Quick Action CTA */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <PenLine className="w-4 h-4" />
                <span>留下抗癌寄语 / 祈福上墙</span>
              </button>

              <button
                type="button"
                onClick={() => setDonationModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Coffee className="w-4 h-4 text-slate-500" />
                <span>自愿赞赏微信支持</span>
              </button>
            </div>
          </div>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 relative z-10">
            <div className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70">
              <div className="text-[11px] text-slate-500 font-medium">累计温暖同行者</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 font-mono">
                {relayItems.length} <span className="text-xs font-normal text-slate-500">位</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
              <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                已核验真实支持
              </div>
              <div className="text-lg sm:text-xl font-black text-emerald-900 mt-0.5 font-mono">
                {verifiedCount} <span className="text-xs font-normal text-emerald-700">份</span>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-teal-50/60 border border-teal-200/70">
              <div className="text-[11px] text-teal-800 font-medium">覆盖实体瘤专区</div>
              <div className="text-lg sm:text-xl font-black text-teal-900 mt-0.5 font-mono">
                11 <span className="text-xs font-normal text-teal-700">大专区</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Cancer Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {CANCER_TABS.map((tab) => {
                const isActive = activeCancer === tab.key;
                const count = tabCounts[tab.key] || 0;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCancer(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-teal-600 text-white shadow-xs font-bold"
                        : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? "bg-teal-700/80 text-teal-100" : "bg-slate-100 text-slate-500"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-64 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索病友称呼、城市或寄语..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-800 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-200 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Relay Wall Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <Heart className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-800">暂未找到符合条件的寄语</h3>
              <p className="text-xs text-slate-500">
                {searchQuery ? "可尝试更换搜索关键词，或切换至全部专区查看" : "欢迎成为该专区第一位留下抗癌寄语的温暖同行者！"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveCancer("all");
                setSearchQuery("");
                setSubmitModalOpen(true);
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              留下第一条寄语
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-3xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3.5"
              >
                <div className="space-y-2.5">
                  {/* Card Header: Donor Name & Cancer Tag & Amount */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {item.donorName}
                        </span>
                        {item.isTest && (
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                            测试示范数据
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${item.cancerColor || "bg-teal-50 text-teal-700 border-teal-200"}`}>
                          {item.cancerTag}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        {item.city && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{item.city}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{item.date}</span>
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-teal-700 font-mono shrink-0 bg-teal-50/70 border border-teal-100 px-2 py-0.5 rounded-lg">
                      {item.amount?.includes("支持") || item.amount?.includes("祈福") ? item.amount : `支持 ${item.amount}`}
                    </span>
                  </div>

                  {/* Message Quote */}
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100 italic">
                    “{item.message}”
                  </p>
                </div>

                {/* Card Footer: Verification status */}
                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                  {item.verified ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50/70 px-2 py-0.5 rounded-md border border-emerald-100">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>已验证爱心支持</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <span>待站长微信账单核验</span>
                    </span>
                  )}

                  <span className="text-[10px] text-slate-400">
                    同行接力
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Reassurance & Disclaimer Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/50 border border-teal-100 text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-bold text-teal-900 flex items-center justify-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-teal-700" />
            <span>纯公益运营 · 严谨循证承诺</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            知癌维基 (ZhiaiWiki) 所有自愿爱心赞助均透明公示并用于技术服务器与科研文献解析算力支出。<br />
            若您或家人当前正面临治疗经济压力，请<strong>千万不要打赏</strong>，请将每一分钱优先用于患者自身的营养与规范治疗！
          </p>
        </div>

        {/* Quick Sub-Links */}
        <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>© 2026 知癌维基 ZhiaiWiki · 抗癌爱心接力</div>
          <div className="flex items-center gap-3">
            <Link href="/about" className="text-blue-600 hover:underline font-medium">关于我们</Link>
            <span>·</span>
            <Link href="/terms" className="text-blue-600 hover:underline font-medium">免责声明</Link>
            <span>·</span>
            <Link href="/privacy" className="text-blue-600 hover:underline font-medium">隐私政策</Link>
          </div>
        </div>

      </main>

      {/* Floating Action Button (Mobile) - Dynamic clearance above MobileBottomNav & Safe Area */}
      <div 
        className="sm:hidden fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px)+1rem)] right-4 z-40"
        style={{
          bottom: "calc(4.5rem + env(safe-area-inset-bottom, 0px) + 1rem)"
        }}
      >
        <button
          type="button"
          onClick={() => setSubmitModalOpen(true)}
          className="w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-xl flex items-center justify-center active:scale-95 cursor-pointer border border-teal-500/30 transition-all"
          title="留下抗癌寄语"
          aria-label="留下抗癌寄语"
        >
          <PenLine className="w-5 h-5" />
        </button>
      </div>

      {/* Submission Modal */}
      <LoveRelaySubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSuccess={(newItem) => {
          setRelayItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
        }}
      />

      {/* Donation Modal directly accessible on love-relay page */}
      {donationModalOpen && (
        <PublicWelfareDonationModal
          isOpen={donationModalOpen}
          onClose={() => setDonationModalOpen(false)}
          defaultTab="qr"
          sourceContext="love-relay"
        />
      )}

      <Footer />
    </div>
  );
}
