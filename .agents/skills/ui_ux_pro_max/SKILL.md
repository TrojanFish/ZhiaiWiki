---
name: UI/UX Pro Max - Healthcare & Evidence Intelligence
description: Production-grade UI/UX design reasoning engine, Next.js 16 SSR hydration protection, evidence traceability rules, and multi-cancer state governance for ZhiaiWiki / OncoPath.
---

# UI/UX Pro Max - Healthcare & Evidence Intelligence (设计决策推理引擎与全栈质量保障技能)

本技能定义了知癌维基（ZhiaiWiki / OncoPath）全系统在**UI/UX 决策推理、抗焦虑心理学引导、证据可溯源性、Next.js 16 SSR 水合安全防护与多癌种状态治理**等方面的核心工程与设计规则。

本技能作为全系统的**「设计推理与工程质量引擎（Reasoning & Quality Engine）」**，任何新增功能或代码修改，必须通过本技能中定义的决策推理与全栈校验规则。

---

## 1. 核心设计决策推理规则 (Design Reasoning Rules)

### Rule 1: 消除患者视觉恐惧感与去危机化叙事 (De-escalate Anxiety)
* ❌ **反模式 (Anti-Pattern)**：
  - 出现大面积刺眼的 `#ff0000` 纯红背景或黑红色剧烈闪烁的警告浮窗；
  - 出现绝望生硬的表述（如“晚期不可治”、“随时危及生命”）。
* ✅ **最佳实践 (Best Practice)**：
  - 将风险指标（如脉管浸润、低分化、淋巴结转移）包裹在带有温和盾牌/微图标的圆角卡片中，使用柔和的 `Rose-600` / `bg-rose-50 border-rose-200`；
  - 在披露风险的同时，必须**立即在同一视口内展示前沿破局点或同行评审循证对策**（如“虽然存在高危因素，但根据 ADAURA / MonarchE 研究，强化靶向将无病生存率显著提升至 85%+”）。

### Rule 2: 严格的医学证据链与出处可溯源性 (Evidence Traceability)
* ❌ **反模式 (Anti-Pattern)**：
  - 生成无来源的孤立数字（如“5年生存率为 30%”）；
  - 引用未经同行评审的网络流言、贴吧个案或未公开的模糊资料。
* ✅ **最佳实践 (Best Practice)**：
  - 关键结论与生存期数字必须具备**「四要素出处凭证」**：`[期刊名 · 年份 · 试验名 · 样本量 n=xxx ⭐⭐⭐⭐⭐]`；
  - 必须提供可点击的 **「📖 查看原文出处 ↗ (DOI直达)」** 链接，让每一位患者和家属能够查证原始科学文献。

### Rule 3: 4D 动态因果链条而非孤立死指标 (Dynamic Causality)
* ❌ **反模式 (Anti-Pattern)**：
  - 把病理指标（如 CTR、Ki-67、CRM、Lauren 分型）当作孤立表格呈现。
* ✅ **最佳实践 (Best Practice)**：
  - 必须展示**「上游病理特征 → 中游分期演化 → 下游治疗决策与生存结局」**的完整因果推演脉络；
  - 使用可视化组件（如 `GgoEvolutionSimulator`、`Her2AdcVisual`、`AdjuvantDecisionTree`）帮助患者秒懂微观机制。

---

## 2. Next.js 16 SSR 水合安全与稳定性保障 (Hydration Protection Architecture)

为了彻底杜绝 React 19 / Next.js 16 App Router 下常见的 `Hydration mismatch` 白屏或抖动警告，全系统必须严格遵守以下水合安全防御铁律：

### 2.1 严禁在服务端初始渲染中裸调客户端特有 API
* ❌ 严禁在组件根级计算中直接读取 `window`、`localStorage`、`sessionStorage` 或 `navigator.userAgent`。
* ✅ 必须通过 `useEffect` 挂载后或客户端状态中惰性读取：
  ```tsx
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("oncopath_profile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);
  ```

### 2.2 动态时间戳与随机值隔离
* ❌ 严禁在 SSR 渲染的 HTML 中直接调用 `Date.now()`、`new Date().toLocaleTimeString()` 或 `Math.random()` 作为文本节点输出。
* ✅ 必须在包含客户端动态时钟或缓存时间的元素上显式添加 `suppressHydrationWarning`：
  ```tsx
  <span suppressHydrationWarning>{hasProfile ? "我的个人临床档案" : "建立个人临床档案"}</span>
  ```

### 2.3 根布局滚动条抖动免疫 (Anti-Jitter)
* 全站 `html` 根节点必须配置 `scrollbar-gutter: stable`，杜绝 Windows 平台在路由切换（有/无垂直滚动条）时产生 15px 导航栏横向横跳闪烁；
* 全局移除可能干扰 Next.js App Router 路由跳转即时滚顶的 `scroll-smooth`。

### 2.4 开箱即用：客户端水合防护标准 Hook 模板 (useHydrated & useMountedProfile)

为了彻底杜绝开发者在组件初次渲染时裸读 `localStorage` 或 `window`，必须统一采用以下标准 Hook 范式：

```tsx
// app/src/lib/useHydrated.ts
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
 * 专科档案安全挂载 Hook 示例
 */
export function useMountedProfile<T>(loader: () => T | null, fallback: T | null = null): {
  data: T | null;
  isHydrated: boolean;
} {
  const isHydrated = useHydrated();
  const [data, setData] = useState<T | null>(fallback);

  useEffect(() => {
    if (isHydrated) {
      try {
        setData(loader());
      } catch (err) {
        console.warn("[Hydration Safe] 档案解析失败，安全回退:", err);
      }
    }
  }, [isHydrated]);

  return { data, isHydrated };
}
```

---

## 3. 多癌种专区切换与状态原子隔离 (Multi-Cancer Domain Governance)

系统全面支持肺癌、乳腺癌、结直肠癌、结肠癌、直肠癌、胃癌、肝癌、食管癌、甲状腺癌、子宫内膜癌、宫颈癌等 **11 大实体瘤专区**。切换癌种时必须执行**原子级状态隔离与清理**，严禁跨癌种串扰：

### 3.1 切换癌种时的清理动作清单 (Reset Protocol)
当 `cancerType` 发生变化时，相关页面必须执行以下原子级重置：
```tsx
useEffect(() => {
  setActiveCategory("all");       // 重置分类筛选
  setSearchQuery("");             // 清空上一癌种搜索词
  setSelectedRisk("all");         // 重置风险过滤器
  setActiveDrawerTopicId(null);    // 立即关闭侧滑抽屉，防止展示旧癌种内容
  if (typeof window !== "undefined" && window.location.hash.startsWith("#topic-")) {
    window.history.replaceState(null, "", window.location.pathname);
  }
}, [cancerType]);
```

### 3.2 档案数据物理隔离防穿模
* 在展示患者个性化推荐（如“已为您匹配本癌种词条”）前，**必须校验 `userProfile.cancerType === currentCancerType`**；
* 严禁将肺癌档案的磨玻璃/STAS 推荐展示在乳腺癌或甲状腺癌专区。

---

## 4. 性能与按需加载规范 (Performance & Dynamic Imports)

1. **次要重量级组件延迟动态加载**：
   - 包含复杂图表、海报生成器（`html2canvas`）或大型表单步骤器的组件，必须使用 `next/dynamic` 配合骨架屏按需加载：
     ```tsx
     const ReportUploader = dynamic(() => import("./ReportUploader"), {
       ssr: false,
       loading: () => <div className="p-8 text-center text-slate-400">正在装载临床解析引擎...</div>,
     });
     ```
2. **纯矢量代码绘图优先**：
   - 全站 20+ 个微观解剖与药理机制模拟器（如 `AdjuvantDecisionTreeVisual`、`BiRadsScaleVisual` 等）统一采用轻量矢量 SVG 实现，零庞大光栅位图加载延迟。

3. **医疗图表容灾降级架构与骨架屏规范 (Clinical Chart Error Boundary & Fallback)**：
   - 当患者设备出现 GPU 加速异常、Canvas 崩溃或网络断流时，**严禁向患者直接展示白屏或报错堆栈**；
   - 必须提供 `ClinicalChartErrorBoundary` 配合无障碍结构化数据表格（`TabularDataFallback`），优雅降级输出 5 年总生存率、HR 危害比与置信区间数值列表，保障临床知情权不中断。

---

## 5. 全栈回归验证契约 (Full-Stack Verification Contract)

任何影响 UI 布局、状态治理或医学展示的代码，在发布前必须满足以下两道自动化防线：

1. **单元与临床测试网** (`npm run test:unit`)：
   - **438+ 项单元测试全部通过（100% 成功，0 失败）**。
2. **生产全量编译构建** (`npm run build`)：
   - Next.js 16 (Turbopack) 必须输出 **30/30 静态页面生成全部通过（Exit Code 0）**，无任何 Hydration 水合不匹配或布局穿模警告。
