"use client";

import Link from "next/link";
import { LogoMark } from "@/components/SubpageNavbar";

interface FooterProps {
  maxWidth?: string;
  className?: string;
}

export default function Footer({ maxWidth = "max-w-7xl", className = "" }: FooterProps) {
  return (
    <footer className={`hidden md:block w-full bg-white border-t border-slate-200/80 pt-6 md:pt-8 pb-8 px-4 sm:px-6 mt-auto print:hidden${className ? ` ${className}` : ""}`}>
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
            <Link href="/love-relay" className="hover:text-teal-700 font-medium transition-colors text-slate-600">
              抗癌爱心接力
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

        {/* Copyright & Evidence Disclaimer with Dual-Language Slogan */}
        <div className="text-[11px] sm:text-xs text-slate-500 text-center md:text-right space-y-1 shrink-0">
          <div className="font-semibold text-slate-700">
            “知癌，方能治癌；每一次循证，皆因至爱。”
          </div>
          <div className="text-[10px] text-slate-400 font-mono tracking-tight">
            Knowing Cancer, Treating Cancer, Caring with Love.
          </div>
          <div className="text-[11px] text-slate-400">
            © 2026 知癌维基 ZhiaiWiki · <a href="https://zhiaiwiki.org" className="hover:text-blue-600 transition-colors font-mono">zhiaiwiki.org</a> · 肿瘤全病程循证与关怀百科
          </div>
          <div className="hidden md:block text-[10px] text-slate-400">
            数据均可追溯至 NEJM、Lancet、JCO、JTO、JAMA、NCCN、CSCO、IASLC 等权威期刊与指南
          </div>
        </div>
      </div>
    </footer>
  );
}
