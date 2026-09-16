"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  Network, 
  FileText, 
  Compass, 
  Info, 
  ArrowRight,
  X,
  CreditCard,
  Search,
  Coffee,
  Heart
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import LangSwitch from "@/components/LangSwitch";

export function LogoMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shadow-xs">
        <img src="/logo.png" alt="OncoPath Logo" className="w-full h-full object-cover" />
      </div>
      <span className="font-bold text-slate-900 tracking-tight text-base">
        Onco<span className="text-accent-blue font-extrabold">Path</span>
      </span>
    </div>
  );
}

const NAV_LINKS = [
  { label: "首页", href: "/", icon: Home, tag: "全景概览" },
  { label: "循证百科", href: "/wiki", icon: BookOpen, tag: "40+词条破译" },
  { label: "特药医保", href: "/reimbursement", icon: CreditCard, tag: "自负测算·赠药" },
  { label: "知识图谱", href: "/knowledge", icon: Network, tag: "4D因果推演" },
  { label: "国际研究库", href: "/studies", icon: FileText, tag: "顶刊效应量" },
  { label: "学术导航", href: "/resources", icon: Compass, tag: "指南共识原文" },
];

export default function SubpageNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCoffeeModalOpen(true);
    window.addEventListener("open-coffee-modal", handleOpen);
    return () => window.removeEventListener("open-coffee-modal", handleOpen);
  }, []);

  useEffect(() => {
    if (!coffeeModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCoffeeModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [coffeeModalOpen]);

  // Suppress SubpageNavbar on dedicated report pages which render their own custom export/print header
  if (pathname?.startsWith("/profile/report")) {
    return null;
  }

  return (
    <>
      {/* Immersive Pass-Through Navbar: Full-width Edge-to-Edge with Safe Area on Mobile, Floating Island on Desktop */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none print:hidden md:top-3.5 md:px-6">
        <nav className="w-full md:max-w-7xl md:mx-auto flex items-center justify-between px-3.5 sm:px-6 pt-[calc(0.6rem+env(safe-area-inset-top,0px))] pb-2.5 md:py-2.5 md:rounded-full bg-white/85 md:bg-white/95 backdrop-blur-xl md:backdrop-blur-md border-b md:border border-slate-200/80 md:border-slate-200/90 shadow-xs md:shadow-lg shadow-slate-900/5 transition-colors duration-200 pointer-events-auto hover:border-slate-300">
          <Link href="/" prefetch={true} className="flex-shrink-0 hover:opacity-85 transition-opacity">
            <LogoMark />
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-5 lg:gap-7">

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`text-xs sm:text-sm font-bold transition-colors ${
                  pathname === link.href
                    ? "text-accent-blue"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Area: Coffee + Search + LangSwitch + Avatar + Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Coffee Sponsorship Trigger Button ("请喝咖啡") */}
            <button
              type="button"
              onClick={() => setCoffeeModalOpen(true)}
              className="h-9 px-2.5 sm:px-3 rounded-full bg-amber-50 hover:bg-amber-100/90 border border-amber-200/90 text-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer group"
              title="请作者喝杯咖啡 · 自愿赞助支持"
              aria-label="请作者喝杯咖啡"
            >
              <Coffee className="w-4 h-4 text-amber-600 animate-coffee-wiggle group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">请喝咖啡</span>
            </button>
            {/* Spotlight Command Palette Trigger (Circular Icon Button, Symmetrical with Avatar & LangSwitch) */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-command-palette"));
                }
              }}
              className="w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-2xs group relative active:scale-95"
              title="全局搜索靶向药、顶刊研究或随访工具 (⌘K / Ctrl+K)"
              aria-label="快速搜索靶向药、顶刊研究或随访工具 (⌘K)"
            >
              <Search className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
              <span className="sr-only">搜索 (⌘K)</span>
            </button>

            {/* LangSwitch: 简繁转换按钮 (电脑端与移动端导航栏右侧常驻) */}
            <LangSwitch />

            {/* UserAvatar: Single Home for Login, Profile, Timeline, Report, and Logout */}
            <UserAvatar />

            {/* Mobile Hamburger Button: Dedicated exclusively to Site Navigation */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors focus:outline-none cursor-pointer flex items-center justify-center shadow-2xs active:scale-95"
              aria-label="打开全站导航菜单"
            >
              {mobileMenuOpen ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Slide-Over Drawer Menu (Pure Site Navigation, Zero Clutter) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop with Frosted Blur */}
          <div 
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel: Compact Width max-w-[310px] with Safe Area Top */}
          <div className="fixed top-0 right-0 bottom-0 w-[82%] max-w-[310px] bg-white/98 backdrop-blur-2xl shadow-2xl p-5 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] flex flex-col justify-between animate-fade-in-up border-l border-slate-200/90 overflow-y-auto">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <Link href="/" prefetch={true} onClick={() => setMobileMenuOpen(false)}>
                  <LogoMark />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="关闭菜单"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links with Compact Mini-Tags */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                  系统功能导航
                </div>
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const IconComp = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-100 font-bold shadow-2xs"
                          : "text-slate-700 hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                        <span>{link.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono ${isActive ? "text-blue-500 font-semibold" : "text-slate-400"}`}>
                        {link.tag}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Secondary Trust & Ethical Mission Link */}
              <div className="pt-2">
                <Link
                  href="/about"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-semibold ${
                    pathname === "/about"
                      ? "bg-sky-50 text-sky-700 border-sky-200 font-bold"
                      : "bg-slate-50/80 hover:bg-slate-100 text-slate-600 border-slate-200/80"
                  }`}
                >

                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>关于我们与初衷</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <span>医学伦理</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </div>

              {/* Mobile Drawer Coffee Sponsorship Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCoffeeModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 text-xs font-bold transition-all active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-600 animate-coffee-wiggle" />
                    <span>请作者喝杯咖啡 / 自愿赞助</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-mono bg-amber-100/80 px-2 py-0.5 rounded-full">支持公益</span>
                </button>
              </div>

              {/* Mobile Drawer Language Switch */}
              <div className="pt-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80">
                  <span className="text-xs font-semibold text-slate-700">语言显示 / 語言切換</span>
                  <LangSwitch showFullLabel={true} />
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 mt-4 border-t border-slate-100 text-center space-y-1.5">
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-600 transition-colors">
                  免责声明
                </Link>
                <span>·</span>
                <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-600 transition-colors">
                  隐私保护
                </Link>
              </div>
              <div className="text-[10px] text-slate-400">
                © 2026 OncoPath · 严格同行评审循证医学库
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coffee / Sponsorship Modal */}
      {coffeeModalOpen && (
        <div 
          onClick={() => setCoffeeModalOpen(false)}
          className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-5 sm:p-7 max-w-sm w-full border border-slate-200/90 shadow-2xl flex flex-col items-center text-center space-y-4 animate-fade-in-up cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                  <Coffee className="w-4 h-4 animate-coffee-wiggle" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-extrabold text-slate-900">请作者喝杯咖啡</h3>
                  <p className="text-[11px] text-slate-400">自愿赞赏 · 助力公益循证长久运转</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setCoffeeModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="关闭弹窗"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Card */}
            <div className="w-full bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col items-center space-y-2">
              <div className="w-60 h-60 max-w-full bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden">
                <img 
                  src="/sponsor_qr.png?v=2026" 
                  alt="给 Keiyee 赞赏" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span>微信扫一扫 · 金额随心</span>
              </div>
            </div>

            {/* Purpose & Promise */}
            <div className="text-xs text-slate-500 leading-relaxed text-left bg-amber-50/50 p-3 rounded-xl border border-amber-100/80 space-y-1">
              <div className="font-bold text-amber-950 flex items-center gap-1 text-[11px]">
                <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>无商业广告 · 纯粹为病友服务</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                本平台核心功能永久免费。所有赞助将全额用于支付 VPS 服务器租用、国际域名维护以及大模型 Token 算力开销。感谢每一份温暖支持！
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setCoffeeModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              我知道了，谢谢你
            </button>
          </div>
        </div>
      )}
    </>
  );
}
