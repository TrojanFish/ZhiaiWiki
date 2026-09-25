---
name: Clinical Responsive Layout & Spacing System
description: Universal responsive layout architecture, vertical breathing rhythm, hardware safe-area clearance, z-index layering hierarchy, and component spacing standards across PC and mobile in ZhiaiWiki.
---

# Clinical Responsive Layout & Spacing System (知癌维基 全端响应式临床布局与间距规范技能)

本技能定义了知癌维基（ZhiaiWiki / OncoPath）全站所有页面、子专区、卡片网格、弹窗（Modal）、侧滑抽屉（Drawer）与悬浮工具栏在 **PC 桌面端与移动端** 的**核心布局架构、垂直呼吸节奏、硬件安全区避让、绝对 Z-Index 分层与组件间距阶梯**。

任何新增页面路由、功能模块、表单抽屉或重构既有 UI 时，**必须严格遵守本技能定义的全部标准与代码模板**，彻底杜绝历史遗留的视觉断层、冗长空白与手机端手势冲突。

---

## 1. 核心设计哲学 (Core Layout Philosophy)

* **移动端（Mobile / Pad）—「紧凑高密度、手指工学、零冗余滑动」**：
  手机屏幕宽度仅为 375px ~ 430px，视口垂直高度宝贵。布局必须优先保证**首屏有效临床信息密度**，卡片内边距收拢，消除大面积无意义空白；同时必须精准契合硬件物理安全区，杜绝手势条误触。
* **桌面 PC 端（Desktop $\ge$ 1024px）—「从容呼吸感、视线聚焦、严谨信赖」**：
  桌面宽屏视野广阔。布局必须建立合理的**呼吸缓冲留白**，内容严格收拢在 `max-w-7xl`（1280px）中心视野范围内，使悬浮岛导航条与大标题之间保持克制、高级的秩序感，杜绝“把手机界面生硬拉伸到宽屏”的粗糙感。

---

## 2. 基础数学阶梯与视口基准 (Mathematical Scale & Grid)

全系统严格遵循 **Tailwind 4px / 8pt 临床工程阶梯**，严禁使用任何随机或手写魔术像素（如 `pt-[37px]`、`mt-[19px]`）：

| 阶梯 Token | 像素值 (px) | 典型应用场景 |
| :--- | :--- | :--- |
| `0.5` ~ `1` | 2px ~ 4px | 微指示点、胶囊微描边、外发光间距 |
| `1.5` ~ `2` | 6px ~ 8px | 标签图标微距、Tag 胶囊内边距、微提示行距 |
| `2.5` ~ `3` | 10px ~ 12px | 紧凑按钮内边距、次要字段间距、导航条上下微内边距 |
| `3.5` ~ `4` | 14px ~ 16px | 移动端水平外边距 (`px-3.5`)、标准表单内边距、紧凑卡片内边距 |
| `5` ~ `6` | 20px ~ 24px | 模块标准层叠间隔 (`space-y-5 sm:space-y-6`)、PC 端页头过渡 (`sm:pb-6`)、标准卡片内边距 |
| `8` | 32px | 移动端主容器底边距 (`pb-8`)、PC 端水平外边距 (`lg:px-8`) |
| `10` ~ `12` | 40px ~ 48px | PC 端主容器底边距 (`sm:pb-12`)、大文章核心卡内边距 (`md:p-10`) |
| `16` | 64px | 桌面端大区块纵向外边距 (`sm:py-16`) |
| `20` ~ `24` | 80px ~ 96px | **桌面端页面顶部避让标准高度 (`md:pt-20 lg:pt-24`)** |

---

## 3. 标准页面模板与垂直节奏规范 (Standard Page Architecture)

每个标准功能页面（如 `/wiki`, `/studies`, `/reimbursement`, `/resources`, `/about` 等）必须采用统一的容器骨架与外内边距结构。

### 3.1 官方标准页面容器代码模板

```tsx
export default function StandardPageTemplate() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
      
      {/* 1. 页面头部区域 (Header) */}
      <header className="pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-4 sm:pb-6 px-3.5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
        {/* 顶部胶囊徽章 */}
        <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-sky-700 border border-sky-200/80 shadow-xs">
          ...
        </div>
        {/* 统一 H1 主标题 */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          ...
        </h1>
        {/* 统一副标题描述 */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          ...
        </p>
      </header>

      {/* 2. 主体内容区域 (Main) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 pb-8 sm:pb-12 space-y-5 sm:space-y-6">
        {/* 吸顶分段过滤器 (如有) */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar sticky top-20 z-20 backdrop-blur-md bg-white/95">
          ...
        </div>
        
        {/* 内容卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
          ...
        </div>
      </main>

      {/* 3. 全局桌面端底栏 (移动端自动隐藏由底部导航接管) */}
      <Footer maxWidth="max-w-7xl" />
    </div>
  );
}
```

### 3.2 垂直核心指标定义表

| 结构位置 | 移动端参数 | 桌面端参数 | 工程约束与说明 |
| :--- | :--- | :--- | :--- |
| **顶部避让 (Header PT)** | `pt-[calc(4.25rem+env(safe-area-inset-top,0px))]` | `md:pt-20 lg:pt-24` (80~96px) | 严禁使用旧版 `md:pt-32` (128px) 或 `md:pt-28` (112px)，避免产生 50px+ 的荒芜断层。 |
| **页头与内容间距 (Header PB)** | `pb-4` (16px) | `sm:pb-6` (24px) | 严禁使用 `pb-8 sm:pb-10`，确保标题与第一张卡片具有紧密凝聚力。 |
| **主内容底边距 (Main PB)** | `pb-8` (32px) | `sm:pb-12` (48px) | 严禁使用 `pb-16` 或 `pb-24`，杜绝用户滑到底部时产生漫长空虚滑动。 |
| **区块纵向间距 (Space-Y)** | `space-y-5` (20px) | `sm:space-y-6` (24px) | 统一模块层叠节奏，手机端紧凑利落，桌面端连贯舒展。 |
| **整屏大幕纵向内边距 (PY)** | `py-8` (32px) | `sm:py-16` (64px) | 首页等长滚动大幕专用（Act 1~5），严禁出现 `py-24`（96px）。 |

---

## 4. 组件级内边距与网格间距标准 (Component Spacing)

### 4.1 Bento 卡片与数据容器

* **移动端内边距**：`p-4`（16px）或 `p-5`（20px），绝不能超过 20px，将空间全力留给医学指标。
* **桌面端内边距**：`sm:p-6 md:p-8`，长文/核心大宣言卡可使用 `md:p-10`。
* **网格间隙 (Grid Gap)**：
  - 磁贴/词条小卡片：`gap-3 sm:gap-4`
  - 核心临床推演 Bento 框：`gap-5 sm:gap-6`

### 4.2 临床数据表格与紧凑行列表 (Data Rows)

* **行级垂直内边距**：`py-2.5 sm:py-3.5`（触控友好，防止手指误触临近行）；
* **单元格水平间距**：`px-3 sm:px-4`；
* **移动端卡片化机制**：当表格列数 $\ge 4$ 时，在移动端必须自动降级为 Flex/Grid 垂直卡片堆叠，禁止出现无提示的水平暴力溢出截断。

### 4.3 悬浮元素 (FAB) 与吐司通知 (Toast) 锚定

* **移动端快速操作浮钮 (FAB)**：
  必须设置为 `fixed bottom-20 right-4 z-40 md:hidden`（`bottom-20` 即 80px，避让底部 56px 的 `MobileBottomNav` 与安全区）。
* **操作反馈提示 (Toast / Copied Banner)**：
  - 顶部型：`fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-[9999]`；
  - 底部型：`fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999]`。

### 4.4 2K/4K 超宽屏防拉伸与可读视宽治理 (Ultra-Wide & Large Display Governance)

针对 1920px、2560px (2K) 及 3840px (4K) 显示设备，必须防止正文被拉成单行极长文字（行长超标引发严重的眼球横向跳跃疲劳）：
* **最大内容视宽锁死**：全站通用主内容容器必须严格设置 `max-w-7xl mx-auto`（1280px），长文解析容器严格设置 `max-w-4xl mx-auto`（896px，确保单行中文字符在 60~75 字符黄金阅读区间）；
* **超宽网格自适应 (2xl / 3xl 断点)**：
  - 在大屏下，Bento 网格采用 3 栏或 4 栏响应式：`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6`；
  - 侧边栏/主区双栏布局锁定比例：左侧主区 `flex-1 min-w-0`，右侧粘性辅助栏固定 `w-80 lg:w-96 shrink-0`。

---

## 5. 移动端物理硬件安全区与手势避让 (Hardware Insets)

针对 iPhone 灵动岛、刘海屏及底部手势横条（Home Indicator Bar）的硬性技术规范：

### 5.1 顶部安全区 (Safe Area Inset Top)
* 所有 fixed 贴顶导航栏与全屏遮罩的顶边，必须包含：
  ```css
  pt-[calc(0.625rem+env(safe-area-inset-top,0px))]
  ```
* 严禁写死 `pt-12` 或 `pt-16`，必须使用 `env(safe-area-inset-top, 0px)` 动态兼容不同机型。

### 5.2 底部手势避让 (Safe Area Inset Bottom)
* 所有移动端底部抽屉（Bottom Sheet）、滑出面板（Drawer）和底部操作栏，必须配置底部安全区内边距：
  ```css
  pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]
  ```
  或使用 Tailwind 预设的 `pb-safe`。
* **触控避让铁律**：底部翻页按钮、表单提交按钮距屏幕物理底边不得小于 **28px**，防止用户在点击操作时触发系统退出手势。

### 5.3 移动端 Bottom Sheet 握手条标准
* 移动端底部弹出的抽屉组件顶部必须居中放置 iOS HIG 标准握手条：
  ```tsx
  <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
    <div className="sheet-grabber !my-0" />
  </div>
  ```

---

## 6. 全局绝对 Z-Index 分层阶梯 (Strict Z-Index Hierarchy)

全站严格划分为 5 大物理图层，**严禁跨级设置或同级竞争**：

```
▲ 顶层 (Topmost)
│  z-[9999]  全局弹窗、全屏遮罩、⌘K 搜索浮层、抽屉 (Modal, Dialog, Drawer, Spotlight)
│  z-50      桌面端常驻悬浮胶囊导航 (SubpageNavbar)
│  z-40      移动端底部常驻导航栏 (MobileBottomNav) & 悬浮按钮 (FAB)
│  z-20      模块内吸顶工具栏 (Sticky Filter Bar, Segmented Steppers)
▼  z-0 ~ 10  页面常规流内容、SVG 影像微观模拟器、Bento 卡片、背景网格
底端 (Base)
```

### Z-Index 核心隔离准则：
1. **模态框与抽屉绝不允许使用 `z-50`**：
   凡是需要遮罩阻断用户交互的弹窗（如 `ConsentModal`、`SettingsModal`、`CommandPalette`、`AuthModal`、`WikiDetailDrawer`），**必须使用 `z-[9999]`**，彻底消除在任何浏览器中与 `z-50` 导航栏的边缘穿模或穿透漏光问题。
2. **分段筛选栏必须使用 `sticky top-20 z-20`**：
   确保在向下滚动时平滑滑入 `z-50` 导航栏下方，而不会遮挡全局导航。

---

## 7. 临床报告纸张排版与 PDF 打印导出标准 (Print & A4 Clinical Report Standard)

针对就诊病历打印、临床报告 PDF 导出（`pdfExporter.ts`）与浏览器 `Ctrl+P` 打印视口，必须遵守以下物理纸张排版规范：

```css
@media print {
  /* 1. 物理页面尺寸与安全边距 */
  @page {
    size: A4 portrait;
    margin: 15mm 15mm 20mm 15mm; /* 上下左右物理外边距 */
  }

  /* 2. 隐藏全站交互型装饰元素 */
  nav,
  footer,
  .no-print,
  button,
  [role="dialog"],
  .fixed,
  .sticky {
    display: none !important;
  }

  /* 3. 核心病案报告卡片防截断换页 (Critical Break Controls) */
  .clinical-report-card,
  .print-break-inside-avoid {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  /* 4. 分章节强制分页 (Page Break After Major Sections) */
  .print-break-after {
    break-after: page !important;
    page-break-after: always !important;
  }

  /* 5. 打印对比度硬化与背景强制打印 */
  body {
    background: #ffffff !important;
    color: #111827 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

### 打印与报告布局硬性要求：
- **卡片断裂防御**：分期结论卡片与 DDI 严重禁忌红线卡片必须添加 `break-inside-avoid`，严禁一张结论卡片上半截在第 1 页、下半截被切断打印在第 2 页；
- **页脚防伪出处**：打印页面底部必须包含统一的品牌出处、报告生成时间与 `ZhiaiWiki Clinical AI System · 遵循 CSCO/NCCN 指南` 签名栏；
- **纯色高对比度**：打印状态下自动清除半透明浅底色，文字自动升阶为纯黑深灰（`#111827`），确保普通黑白激光打印机输出依然字迹清晰。

---

## 8. 反模式黑名单 (Anti-Patterns Prohibited)

开发与代码审查中，若出现以下写法**直接判定不合格并拦截修复**：

| ❌ 严禁的反模式代码 | 根因与危害 | ✅ 必须使用的规范标准 |
| :--- | :--- | :--- |
| `md:pt-32` / `md:pt-28` | 在悬浮导航栏下方留出 60px+ 的巨大视觉荒原 | `md:pt-20 lg:pt-24` |
| `pb-24` / `pb-16` (在 main 上) | 页面触底前产生冗长空洞，手机端极易产生手势疲劳 | `pb-8 sm:pb-12` |
| `mb-16` / `mt-16` (在通用模块间) | 造成页面模块间严重的视觉撕裂感 | `mb-8 sm:mb-12` 或 `space-y-5 sm:space-y-6` |
| `p-6` / `p-8` (移动端卡片直接使用) | 挤占手机横向 30% 面积，导致核心文本折行断裂 | `p-4 sm:p-5 md:p-8` |
| 弹窗容器使用 `z-50` | 与桌面导航栏同层竞争，引发遮罩穿模 | 统一提升为 `z-[9999]` |
| 移动端抽屉未配 `env(safe-area-bottom)` | 底部按钮被 iPhone 底部手势横条遮挡并误触 | `pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]` |
| 容器外层与内层双重设置 `pb-8 sm:pb-12` | 产生 2 倍叠加空白 | 仅在最内层或最外层单一容器保留，杜绝嵌套叠加 |

---

## 9. 代码审查与落地验证清单 (Pre-Commit / PR Checklist)

任何修改或新建 UI 代码提交前，必须逐项核对：

- [ ] **顶部避让校验**：页面主容器或 Header 是否已采用 `pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24`？
- [ ] **触底距离校验**：页面主容器底部是否已统一为 `pb-8 sm:pb-12`，且不存在冗余双重嵌套？
- [ ] **手机卡片内边距校验**：移动端卡片是否保持在 `p-4` 或 `p-5`，桌面端是否平滑放大至 `sm:p-6 md:p-8`？
- [ ] **安全区避让校验**：弹窗与抽屉是否配备 `pb-safe` 或动态 `env(safe-area-inset-bottom)`？
- [ ] **Z-Index 层级校验**：新出现的弹窗或遮罩层是否严格为 `z-[9999]`，吸顶工具栏是否为 `z-20`？
- [ ] **超宽屏锁死校验**：大屏主容器是否配置 `max-w-7xl mx-auto`，长文是否配置 `max-w-4xl mx-auto`？
- [ ] **全量回归测试**：运行 `npm run test:unit`（438 项测试）全部通过，且 `npm run build` 静态页面零水合与零布局告警？
