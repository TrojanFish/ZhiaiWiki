"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FileText, LogOut, User } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { getCurrentUser, logout } from "@/lib/api";

interface UserAvatarProps {
  mode?: "navbar" | "drawer" | "compact";
  onAction?: () => void;
}

export default function UserAvatar({ mode = "navbar", onAction }: UserAvatarProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkAuth = async () => {
    // 1. Immediate local check for instant UI rendering
    const localEmail = typeof window !== "undefined" ? localStorage.getItem("email") : null;
    if (localEmail) {
      setUserEmail(localEmail);
    }

    // 2. Server verification & Session hydration via HttpOnly Cookie
    const user = await getCurrentUser();
    if (user && user.email) {
      setUserEmail(user.email);
      if (typeof window !== "undefined") {
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role || "patient");
      }
    } else if (!user && !localEmail) {
      setUserEmail(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  // Click outside to close dropdown (pointerdown for zero mobile tap latency)
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent | MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("zhiaiwiki_admin_token");
    setUserEmail(null);
    setShowDropdown(false);
    window.dispatchEvent(new Event("auth-change"));
    if (window.location.pathname.startsWith("/admin")) {
      window.location.href = "/";
    }
  };


  return (
    <>
      {mode === "drawer" ? (
        userEmail ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0 ring-2 ring-white">
                {userEmail.charAt(0).toUpperCase()}
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">{userEmail}</div>
                <div className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>患者云端账号 · 已连接</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Link
                href="/profile"
                prefetch={true}
                onClick={() => onAction?.()}
                className="px-2.5 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>数字档案</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  onAction?.();
                }}
                className="px-2.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-xs font-bold text-rose-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        ) : null
      ) : userEmail ? (
        /* Logged-in State: Pure Round Avatar with Breathing Green Dot on Top-Right */
        <div className="relative flex items-center" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 hover:opacity-90 flex items-center justify-center text-white font-bold text-xs shadow-xs transition-all cursor-pointer ring-2 ring-white hover:ring-blue-200"
            title={`已登录：${userEmail}`}
            aria-label="打开患者档案与账号菜单"
          >
            {userEmail.charAt(0).toUpperCase()}
            
            {/* Pulsing Breathing Green Light Indicator on Top-Right Corner */}
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white shadow-2xs"></span>
            </span>
          </button>
          
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden py-1.5 z-50 animate-fade-in-up">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    已登录患者账号
                  </p>
                </div>
                <p className="text-xs text-slate-900 font-bold truncate mt-0.5">{userEmail}</p>
              </div>

              <Link 
                href="/profile"
                prefetch={true}
                onClick={() => setShowDropdown(false)}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 font-semibold transition-colors flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>我的临床数字档案</span>
              </Link>

              <Link 
                href="/profile/report"
                prefetch={true}
                onClick={() => setShowDropdown(false)}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:text-teal-600 hover:bg-teal-50/60 font-semibold transition-colors flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>我的专属循证报告</span>
              </Link>

              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>退出登录</span>
              </button>
            </div>
          )}
        </div>
      ) : mode === "compact" ? (
        <button
          type="button"
          onClick={() => setShowAuthModal(true)}
          className="w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors cursor-pointer active:scale-95 shrink-0 shadow-2xs"
          title="登录账号"
          aria-label="登录账号"
        >
          <User className="w-3.5 h-3.5 shrink-0" />
        </button>
      ) : (
        /* Guest / Unauthenticated State: Clean Ghost Trigger to eliminate pill clutter */
        <button
          onClick={() => setShowAuthModal(true)}
          className="h-8 px-2.5 sm:px-3 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-95 group"
          title="登录账号 / 查看档案"
          aria-label="登录账号或查看档案"
        >
          <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
          <span>登录</span>
        </button>
      )}


      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)}
          onSuccess={(token, email) => {
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            setUserEmail(email);
            setShowAuthModal(false);
            window.dispatchEvent(new Event("auth-change"));
          }}
        />
      )}
    </>
  );
}
