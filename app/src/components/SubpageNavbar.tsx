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
  Heart,
  Check,
  Settings,
  Menu
} from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import LangSwitch from "@/components/LangSwitch";
import CancerSwitch, { useCancerType, CANCER_TYPE_OPTIONS } from "@/components/common/CancerSwitch";
import { CancerIcon } from "@/components/common/CancerIcons";
import SettingsModal from "@/components/SettingsModal";
import PublicWelfareDonationModal from "@/components/common/PublicWelfareDonationModal";

import ZhiaiWikiLogo from "@/components/common/ZhiaiWikiLogo";

export function LogoMark() {
  return (
    <div 
      className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer select-none"
      title="知癌，方能治癌；每一次循证，皆因至爱。· Knowing Cancer, Treating Cancer, Caring with Love."
    >
      <ZhiaiWikiLogo size="sm" showText={false} />
      <span className="font-black text-slate-900 tracking-tight text-[15px] sm:text-base leading-none group-hover:text-blue-700 transition-colors">
        知癌维基
      </span>
    </div>
  );
}

const DESKTOP_NAV_LINKS = [
  { label: "循证百科", href: "/wiki" },
  { label: "知识图谱", href: "/knowledge" },
  { label: "研究文献", href: "/studies" },
  { label: "特药医保", href: "/reimbursement" },
  { label: "学术指南", href: "/resources" },
];

const MOBILE_NAV_LINKS = [
  { label: "首页", href: "/", icon: Home, tag: "全景概览" },
  { label: "循证百科", href: "/wiki", icon: BookOpen, tag: "40+词条破译" },
  { label: "知识图谱", href: "/knowledge", icon: Network, tag: "4D因果推演" },
  { label: "研究文献", href: "/studies", icon: FileText, tag: "顶刊效应量" },
  { label: "特药医保", href: "/reimbursement", icon: CreditCard, tag: "自负测算·赠药" },
  { label: "学术指南", href: "/resources", icon: Compass, tag: "指南共识原文" },
];

export default function SubpageNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const { cancerType, setCancerType } = useCancerType();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const platform = window.navigator?.platform || window.navigator?.userAgent || "";
    setIsMac(/Mac|iPhone|iPod|iPad/i.test(platform));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkProfile = () => {
      if (typeof window === "undefined") return;
      const profile = localStorage.getItem("oncopath_profile") || localStorage.getItem("patient_profile");
      const email = localStorage.getItem("email") || sessionStorage.getItem("email");
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      setHasProfile(!!profile || !!email || !!token);
    };
    checkProfile();
    window.addEventListener("auth-change", checkProfile);
    window.addEventListener("storage", checkProfile);
    return () => {
      window.removeEventListener("auth-change", checkProfile);
      window.removeEventListener("storage", checkProfile);
    };
  }, []);

  useEffect(() => {
    const handleOpen = () => setCoffeeModalOpen(true);
    window.addEventListener("open-coffee-modal", handleOpen);
    return () => window.removeEventListener("open-coffee-modal", handleOpen);
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => setSettingsModalOpen(true);
    window.addEventListener("open-settings-modal", handleOpenSettings);
    return () => window.removeEventListener("open-settings-modal", handleOpenSettings);
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
        <nav
          className={`w-full md:max-w-7xl md:mx-auto flex items-center justify-between px-3.5 sm:px-6 pt-[calc(0.625rem+env(safe-area-inset-top,0px))] pb-2.5 md:py-2.5 md:rounded-full border-b md:border transition-all duration-300 pointer-events-auto ${
            isScrolled
              ? "bg-white/95 md:bg-white/95 backdrop-blur-xl md:backdrop-blur-md border-slate-200/90 shadow-xs md:shadow-lg shadow-slate-900/5 hover:border-slate-300"
              : "bg-white/85 md:bg-white/90 backdrop-blur-lg md:backdrop-blur-sm border-slate-200/70 shadow-2xs md:shadow-md shadow-slate-900/5 hover:border-slate-300"
          }`}
        >
          {/* Brand Logo & Cancer Type Quick Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/" prefetch={true} className="flex-shrink-0 flex items-center hover:opacity-85 transition-opacity">
              <LogoMark />
            </Link>
            <CancerSwitch variant="dropdown" />
          </div>
          
          {/* Desktop Navigation Links (Pill Container) — 精炼5大临床核心链路，释放横向呼吸空间 */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 text-xs">
            {DESKTOP_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`px-2.5 lg:px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-blue-700 font-extrabold shadow-2xs border border-slate-200/60"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Action Area (>= md) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
            {/* 1. Unified Utility Cluster (Search + Settings) */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100/90 p-0.5 rounded-full border border-slate-200/90 shadow-2xs">
              {/* Spotlight Command Palette Trigger (动态按操作系统适配 Ctrl+K / ⌘K) */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-command-palette"));
                  }
                }}
                className="h-7.5 px-2.5 rounded-full hover:bg-white flex items-center gap-1.5 text-slate-500 hover:text-blue-600 hover:shadow-2xs transition-all cursor-pointer active:scale-95"
                title={`全局搜索靶向药、顶刊研究或随访工具 (${isMac ? "⌘K" : "Ctrl+K"})`}
                aria-label={`快速搜索 (${isMac ? "⌘K" : "Ctrl+K"})`}
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono text-slate-400 hidden xl:inline" suppressHydrationWarning>
                  {isMac ? "⌘K" : "Ctrl K"}
                </span>
              </button>

              {/* Settings Trigger: Unified Preferences Modal */}
              <button
                type="button"
                onClick={() => setSettingsModalOpen(true)}
                className="w-7.5 h-7.5 rounded-full hover:bg-white flex items-center justify-center text-slate-500 hover:text-blue-600 hover:shadow-2xs transition-all cursor-pointer active:scale-95"
                title="系统偏好设置 (默认癌种、显示语言及循证体系)"
                aria-label="系统偏好设置"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="sr-only">设置</span>
              </button>
            </div>

            {/* 2. PROMINENT COFFEE SPONSORSHIP BUTTON (公益赞助·轻量温和图标) */}
            <button
              type="button"
              onClick={() => setCoffeeModalOpen(true)}
              className="w-8 h-8 rounded-full bg-slate-100/70 hover:bg-amber-50 hover:border-amber-200/90 border border-slate-200/70 text-slate-500 hover:text-amber-700 flex items-center justify-center transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95 group"
              title="请作者喝杯咖啡 · 自愿赞助支持公益运转"
              aria-label="请作者喝杯咖啡"
            >
              <Coffee className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-600 transition-colors" />
              <span className="sr-only">请喝咖啡</span>
            </button>

            {/* Subtle Vertical Divider */}
            <div className="h-4 w-px bg-slate-200/90 my-auto" aria-hidden="true" />

            {/* 3. Account / User Avatar */}
            <UserAvatar />

            {/* 4. Desktop Primary CTA Button: 建立档案 / 我的档案 */}
            <Link
              href="/profile"
              prefetch={true}
              className="h-8 px-3 lg:px-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center gap-1.5 active:scale-95 shrink-0"
            >
              <FileText className="w-3.5 h-3.5" />
              <span suppressHydrationWarning>{hasProfile ? "我的档案" : "建立临床档案"}</span>
            </Link>
          </div>

          {/* Mobile Right Action Area (< md): Streamlined [Search -> User/Login -> Coffee -> Menu] */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            {/* 1. Mobile Search Trigger (⌘K Command Palette) */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-command-palette"));
                }
              }}
              className="w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-slate-600 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0"
              title="快速搜索 (⌘K)"
              aria-label="快速搜索"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* 2. Mobile User Account / Login Trigger */}
            <UserAvatar mode="compact" />

            {/* 3. Prominent Mobile Coffee Sponsorship Button (公益赞助·紧凑圆钮) */}
            <button
              type="button"
              onClick={() => setCoffeeModalOpen(true)}
              className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100/90 border border-amber-200/90 text-amber-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 group shrink-0"
              title="请作者喝杯咖啡 · 自愿赞助支持公益运转"
              aria-label="请作者喝杯咖啡"
            >
              <Coffee className="w-4 h-4 text-amber-600 animate-coffee-wiggle shrink-0" />
              <span className="sr-only">请喝咖啡</span>
            </button>

            {/* 4. Mobile Hamburger Menu Trigger (Anchor at far right) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 rounded-full text-slate-700 hover:bg-slate-100 border border-slate-200/90 transition-colors focus:outline-none cursor-pointer flex items-center justify-center shadow-2xs active:scale-95 shrink-0"
              aria-label="打开全站导航菜单"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Slide-Over Drawer Menu (Pure Site Navigation, Zero Clutter) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Backdrop with Frosted Blur */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
            onClick={(e) => { if (e.target === e.currentTarget) setMobileMenuOpen(false); }}
          />

          {/* Drawer Panel: Clean & Streamlined, Zero Duplication */}
          <div className="fixed top-0 right-0 bottom-0 w-[84%] max-w-[320px] bg-white/98 backdrop-blur-2xl shadow-2xl p-4.5 pt-[calc(1.2rem+env(safe-area-inset-top,0px))] flex flex-col justify-between animate-fade-in-up border-l border-slate-200/90 overflow-y-auto">
            <div className="space-y-3.5">
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
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Patient Profile Quick Card (档案状态与直达入口) */}
              <Link
                href="/profile"
                prefetch={true}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-200/80 shadow-2xs hover:shadow-xs transition-all text-left group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      <span suppressHydrationWarning>{hasProfile ? "我的个人临床档案" : "建立个人临床档案"}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                      <span suppressHydrationWarning>{hasProfile ? "查看病理报告、随访与推演" : "5秒录入指标 · 专属破译"}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Core Navigation Links */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                  系统功能导航
                </div>
                {MOBILE_NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const IconComp = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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

              {/* Settings & Support Area (非重复，一站式整合) */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                  设置与支持
                </div>

                {/* Unified Preferences Trigger (集中管理：默认癌种、显示语言及缓存清除，绝无多处分散重复！) */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSettingsModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-blue-600" />
                    <span>偏好设置与语言</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    默认癌种 / 语言
                  </span>
                </button>

                {/* About Link */}
                <Link
                  href="/about"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all text-xs font-semibold ${
                    pathname === "/about"
                      ? "bg-sky-50 text-sky-700 border-sky-200 font-bold"
                      : "border-transparent hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="w-4 h-4 text-sky-600" />
                    <span>关于我们</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                    <span>初衷·伦理</span>
                  </div>
                </Link>

                {/* Love Relay Link */}
                <Link
                  href="/love-relay"
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all text-xs font-semibold ${
                    pathname === "/love-relay"
                      ? "bg-teal-50 text-teal-800 border-teal-200 font-bold"
                      : "border-transparent hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-teal-600" />
                    <span>抗癌爱心接力</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-teal-600 font-mono">
                    <span>温暖回响</span>
                  </div>
                </Link>

                {/* Coffee Sponsorship Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCoffeeModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-amber-200/80 bg-amber-50/60 hover:bg-amber-100/80 text-amber-900 text-xs font-semibold transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Coffee className="w-4 h-4 text-amber-600 animate-coffee-wiggle" />
                    <span>请作者喝杯咖啡</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-mono bg-amber-100/80 px-1.5 py-0.5 rounded-full">自愿赞助</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-3 mt-3 border-t border-slate-100 text-center space-y-1">
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-600 transition-colors">
                  免责声明
                </Link>
                <span>·</span>
                <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-600 transition-colors">
                  隐私政策
                </Link>
              </div>
              <div className="text-[10px] text-slate-400">
                © 2026 知癌维基 ZhiaiWiki · 严格同行评审循证医学库
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Apple-Native Public Welfare & Coffee Sponsorship Modal */}
      <PublicWelfareDonationModal
        isOpen={coffeeModalOpen}
        onClose={() => setCoffeeModalOpen(false)}
        defaultTab="qr"
        sourceContext="navbar"
      />

      {/* Settings Modal (Preferences for Cancer Domain, Language & Evidence Guidelines) */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onOpenCoffee={() => setCoffeeModalOpen(true)}
      />
    </>
  );
}
