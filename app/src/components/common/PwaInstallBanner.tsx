"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registration & Localhost Dev Protection
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.endsWith(".local");

      if (process.env.NODE_ENV === "development" || isLocalhost) {
        // In local development, unregister any active service worker and clear caches to prevent Turbopack/HMR hydration mismatches
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
        if ("caches" in window) {
          caches.keys().then((names) => {
            for (const name of names) {
              caches.delete(name);
            }
          });
        }
      } else {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => {
              console.log("[PWA] ServiceWorker registered with scope:", reg.scope);
            })
            .catch((err) => {
              console.warn("[PWA] ServiceWorker registration failed:", err);
            });
        });
      }
    }

    // 2. Check if already installed (standalone mode)
    if (typeof window !== "undefined") {
      const isStandalone = 
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Check if user dismissed permanently, in this session, or within 30 days
      try {
        if (sessionStorage.getItem("zhiaiwiki_pwa_session_dismissed")) {
          return;
        }
        const dismissedVal = localStorage.getItem("zhiaiwiki_pwa_dismissed") || localStorage.getItem("oncopath_pwa_dismissed");
        if (dismissedVal === "permanent") {
          return;
        }
        if (dismissedVal) {
          const time = Number(dismissedVal);
          if (!isNaN(time) && Date.now() - time < 30 * 24 * 60 * 60 * 1000) {
            return;
          }
        }
      } catch {
        // Fallback for restricted private storage mode
      }
    }

    // 3. Listen for beforeinstallprompt with gentle 8-second delay
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Do not interrupt the user immediately upon entering the page; wait 8 seconds
      timer = setTimeout(() => {
        try {
          const isSession = sessionStorage.getItem("zhiaiwiki_pwa_session_dismissed");
          const dismissedVal = localStorage.getItem("zhiaiwiki_pwa_dismissed") || localStorage.getItem("oncopath_pwa_dismissed");
          if (isSession || dismissedVal === "permanent") return;
          if (dismissedVal && Date.now() - Number(dismissedVal) < 30 * 24 * 60 * 60 * 1000) return;
        } catch {}
        setShowBanner(true);
      }, 8000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      if (timer) clearTimeout(timer);
      setShowBanner(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
      try {
        localStorage.setItem("zhiaiwiki_pwa_dismissed", "permanent");
      } catch {}
      console.log("[PWA] ZhiaiWiki was installed successfully!");
    });

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("[PWA] User response to install prompt:", outcome);
    if (outcome === "accepted") {
      try {
        localStorage.setItem("zhiaiwiki_pwa_dismissed", "permanent");
      } catch {}
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("zhiaiwiki_pwa_session_dismissed", "1");
        localStorage.setItem("zhiaiwiki_pwa_dismissed", Date.now().toString());
      } catch {}
    }
  };

  const handleNeverShowAgain = () => {
    setShowBanner(false);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("zhiaiwiki_pwa_session_dismissed", "1");
        localStorage.setItem("zhiaiwiki_pwa_dismissed", "permanent");
      } catch {}
    }
  };

  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0.75rem))] sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-sky-500/30 flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0 border border-sky-500/30">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-sky-400">PWA 智能应用</span>
            <span className="text-2xs px-1.5 py-0.5 rounded bg-sky-400/10 text-sky-300 font-medium">离线可用</span>
          </div>
          <p className="text-xs font-semibold text-slate-100 mt-0.5">
            安装 知癌维基 至桌面或手机主屏
          </p>
          <p className="text-2xs text-slate-400 mt-0.5 leading-relaxed">
            支持无网络离线查阅 12 大实体肿瘤专区循证知识库与指标速查，享受秒开原生 App 体验。
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              立即添加
            </button>
            <button
              type="button"
              onClick={handleNeverShowAgain}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer border border-slate-700/60"
            >
              不再提示
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-2 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
            >
              稍后
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          aria-label="关闭提示"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
