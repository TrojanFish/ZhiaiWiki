"use client";

import Link from "next/link";
import { LogoMark } from "@/components/SubpageNavbar";

interface FooterProps {
  maxWidth?: string;
  className?: string;
}

export default function Footer({ maxWidth = "max-w-7xl", className = "" }: FooterProps) {
  return (
    <footer className={`w-full bg-white border-t border-slate-200/80 pt-3.5 sm:pt-6 md:pt-8 pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-8 px-4 sm:px-6 mt-auto print:hidden ${className}`}>
      <div className={`${maxWidth} mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 md:gap-6`}>
        {/* Brand & Quick Links */}
        <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-left">
          <Link href="/" className="hover:opacity-85 transition-opacity shrink-0">
            <LogoMark />
          </Link>
          <div className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-slate-500 flex-wrap justify-center sm:justify-start">
            <span className="hidden sm:inline text-slate-300">·</span>
            <Link href="/about" className="hover:text-blue-600 font-medium transition-colors text-blue-700">
              关于我们
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/terms" className="hover:text-blue-600 font-medium transition-colors">
              免责声明
            </Link>
            <span className="text-slate-300">·</span>
            <Link href="/privacy" className="hover:text-blue-600 font-medium transition-colors">
              隐私政策
            </Link>
          </div>
        </div>

        {/* Copyright & Evidence Disclaimer */}
        <div className="text-[11px] sm:text-xs text-slate-400 text-center md:text-right space-y-0.5 shrink-0">
          <div>© 2026 OncoPath · 肺癌循证决策系统</div>
          <div className="hidden md:block text-[10px] text-slate-400">数据均可追溯至 JTO、Lancet、JCO、NCCN、CSCO 等权威期刊与指南</div>
        </div>
      </div>
    </footer>
  );
}
