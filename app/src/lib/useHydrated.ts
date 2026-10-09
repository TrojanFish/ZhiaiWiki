"use client";

import { useState, useEffect } from "react";

/**
 * 确保组件仅在客户端完成水合挂载后才渲染动态私有状态
 * 未完成水合前展示统一的骨架占位，彻底杜绝 React 19 SSR Hydration Mismatch
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}

/**
 * 专科档案安全挂载 Hook
 */
export function useMountedProfile<T>(loader: () => T | null, fallback: T | null = null): {
  data: T | null;
  isHydrated: boolean;
} {
  const isHydrated = useHydrated();
  const [data, setData] = useState<T | null>(fallback);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      setData(loader());
    } catch (e) {
      console.warn("Failed to load mounted profile:", e);
    }
  }, [isHydrated]);

  return { data, isHydrated };
}
