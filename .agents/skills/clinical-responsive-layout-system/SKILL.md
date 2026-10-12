---
name: Clinical Responsive Layout & Spacing System
description: Universal responsive layout architecture, vertical breathing rhythm, hardware safe-area clearance, z-index layering hierarchy, and component spacing standards across PC and mobile in ZhiaiWiki.
---

# Clinical Responsive Layout & Spacing System (知癌维基 全端响应式临床布局与间距规范技能)

本技能定义了知癌维基（ZhiaiWiki）全站所有页面、子专区、卡片网格、弹窗（Modal）、侧滑抽屉（Drawer）与悬浮工具栏在 **PC 桌面端与移动端** 的**核心布局架构、垂直呼吸节奏、硬件安全区避让、绝对 Z-Index 分层与组件间距阶梯**。

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
        {/* 顶部胶囊徽章 (移动端自适应收拢，防右边缘截断) */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-2xs sm:text-xs font-bold text-sky-700 border border-sky-200/80 shadow-xs max-w-full">
          <CancerIcon type={cancerType} className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="truncate">核心主题名称</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 hidden xs:inline-block" />
          <span className="hidden xs:inline-block">次要修饰说明</span>
        </div>
        {/* 统一 H1 主标题 (移动端严禁使用 text-3xl，必须降阶至 text-2xl 防孤字折行) */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
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
  必须设置为 `fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0.75rem))] right-4 z-40 md:hidden`（动态避让底部 `MobileBottomNav` 的物理高度与 iOS Home 指示条安全区，保持约 16~24px 的优雅悬浮间隙，严禁使用旧版写死的 `bottom-20`）。
* **操作反馈提示 (Toast / Copied Banner)**：
  - 顶部型：`fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-[9999]`；
  - 底部型：`fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0.75rem))] left-1/2 -translate-x-1/2 z-[9999]`。

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

### 5.4 移动端底部常驻导航栏避让铁律 (Mobile Bottom Nav Clearance)
由于 `MobileBottomNav` 采用 `fixed bottom-0` 浮动常驻（物理高度约为 60px~88px 含安全区）：
1. **全局文档流避让占位块 (Safe Document-Flow Spacer)**：
   在 `MobileBottomNav.tsx` 中直接渲染高度为 `calc(4.5rem + env(safe-area-inset-bottom, 0px))` 的普通文档流占位块（桌面端自动 `md:hidden`），确保全站所有页面拉到底部时，内容与操作按钮完整展现在底部导航条上方，绝不发生遮挡。
2. **长文与表单页面保底**：
   页面主内容容器 `<main>` 统一采用 `pb-8 sm:pb-12`，配合占位块形成优雅的 32px 呼吸缓冲。
3. **悬浮气泡与安装提示避让**：
   任何置底浮层（如 PWA 安装横条、百科搜索气泡）在移动端必须使用 `bottom-[calc(4.5rem+env(safe-area-inset-bottom,0.75rem))]`，严禁使用写死的 `bottom-4` 或 `bottom-20`。

---

## 6. PC 桌面端与移动端核心微细节差异化治理规范 (Mobile vs. PC Micro-Detail Disparity Matrix)

手机端与 PC 桌面端并非仅是“宽度断点”的缩放，而是两种截然不同的物理设备输入范式、人机交互工学与视口行为机制。全站必须严格执行以下微细节规范：

### 6.1 动态视口高度与动态地址栏防御 (`dvh` vs `vh`)
* **移动端物理陷阱**：在 iOS Safari 与 Android Chrome 中，页面滚动时浏览器顶底地址栏会自动收起或展开。传统硬编码 `100vh` 或 `max-h-[92vh]` 会基于未收起的地址栏高度计算，导致底部约 56px~80px 被切断遮挡，按钮脱离可视范围。
* **微细节硬规范**：
  - 所有全屏遮罩、模态抽屉必须优先采用现代化视口单位 **`dvh` (Dynamic Viewport Height)**，并以 `vh` 作为渐进增强回退：
    ```css
    /* 推荐类名或样式 */
    .max-h-sheet {
      max-height: 92vh;
      max-height: 92dvh;
    }
    ```
  - 严禁在移动端弹窗使用 `h-screen`，必须使用 `min-h-dvh` 或 `h-[100dvh]` 确保精准贴合可视区域。

### 6.2 交互范式解耦：鼠标悬停与移动触控 (Hover vs. Touch Decoupling)
* **移动端 `:hover` 粘连灾难 (Sticky Hover)**：在触控屏上点击按钮时，移动浏览器会把触摸动作合成拟态为鼠标 `:hover`，手指抬起后该元素**持续保持悬停样式**（如按钮永久变暗），破坏界面整洁。
* **微细节硬规范**：
  1. **触控高亮闪烁清除**：全站必须配置 `-webkit-tap-highlight-color: transparent;`，消除 iOS/Android 默认丑陋的半透明触控蓝灰框；
  2. **悬停动效媒体查询隔离**：仅对真实指针鼠标开启微上浮与阴影激增动效：
     ```css
     @media (hover: hover) and (pointer: fine) {
       .card-hover:hover {
         transform: translateY(-2px);
         box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.07);
       }
     }
     ```
  3. **移动端按压触感 (Active Feedback)**：在触控设备上，通过 `active:scale-[0.97]` 或 `active:scale-95` 提供具有 iOS 物理按压阻尼感的回弹反馈，而非依赖变色。

### 6.3 抽屉手势与滚动链穿透防御 (Scroll Chaining & Overscroll Containment)
* **橡皮筋穿透陷阱**：在 iOS 移动端打开 Bottom Sheet 抽屉并在其内部滚动列表时，若滑至顶部或底部继续拖拽，会导致底层父页面产生剧烈的“橡皮筋回弹联动”，严重破坏用户掌控感。
* **微细节硬规范**：
  - 所有模态框内部滚动区域 (`overflow-y-auto`) 必须添加：
    ```css
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    ```
  - 锁定滚动链，保证局部抽屉内的滑动永远局限在抽屉内部，底板页面绝对锁死。

### 6.4 触控人体工学与微命中热区扩张 (Touch Hitbox Ergonomics)
* **老年肿瘤患者手部震颤与误触**：患者与老年家属在手机端操作时，微小按钮（如关闭图标 `w-7 h-7` 或 `w-8 h-8`）难以准确击中。
* **微细节硬规范**：
  - 苹果 HIG 与 WCAG 2.1 AAA 规定可触控热区最小面积为 **44px × 44px**；
  - 视觉尺寸保持克制精致（如 32px 的 `w-8 h-8 rounded-full`），但必须通过透明伪元素或内边距扩张物理点击命中区：
    ```css
    .touch-target-expand {
      position: relative;
    }
    .touch-target-expand::after {
      content: '';
      position: absolute;
      inset: -8px; /* 四周各外扩 8px，触控区域由 32px 升至 48px */
    }
    ```
  - 相邻可交互按钮之间，必须保持至少 8px（`gap-2`）的无交互缓冲区，严禁紧贴引发连带误触。

### 6.5 复杂临床数据表格的响应式降级与重塑 (Adaptive Table Stacking)
* **移动端表格挤压灾难**：在 PC 桌面端，包含 5~7 列的病理对比、DDI 相互作用或生存率表格可通栏平铺；在手机端如果强制横向排开，会导致单元格每行只容纳 1~2 个汉字，文字破碎难读。
* **微细节硬规范**：
  1. **垂直卡片化重构 (Card Stacking)**：当表格列数 $\ge 4$ 时，移动端必须自动降级为 Flex/Grid 垂直键值对信息卡；
  2. **局部横滑 + 渐变边缘遮罩 (Edge Fade Mask)**：若因循证对比需要必须保持横向滑动的矩阵，滚动容器右侧必须配置渐变透明遮罩，向用户直观暗示“右侧有更多内容可滑”：
    ```css
    .scroll-mask-edge {
      mask-image: linear-gradient(to right, black calc(100% - 32px), transparent 100%);
      -webkit-mask-image: linear-gradient(to right, black calc(100% - 32px), transparent 100%);
    }
    ```

### 6.6 软键盘呼出与表单视口挤压防御 (Virtual Keyboard Governance)
* **iOS 16px 视口自动放大 Bug**：当 `<input>` 或 `<select>` 的 `font-size` 小于 16px 时，iOS Safari 会在用户点击输入框的一瞬间，强制把全页面镜头放大拉近，导致所有 Header 和浮动元素严重错位。
* **微细节硬规范**：
  - 移动端所有可聚焦输入表单，字体大小计算值必须 $\ge 16px$（即 `text-base`，在 PC 端断点才允许降为 `sm:text-sm`）；
  - 全局 `<head>` 视口标签配置 `interactive-widget=resizes-content`，促使浏览器在软键盘弹起时合理折叠主视口，而非野蛮推挤页面；
  - 表单提交主按钮严禁写死 `fixed bottom-0`，必须跟随表单内容流自然居底，或置于支持滚动避让的标准模态 Tier 3 底栏中。

### 6.7 桌面端悬停浮窗 (Tooltip) 在移动端的抽屉降级
* **PC 端**：鼠标悬停在文献 DOI、星级证据或专业术语缩写（如 VDT、CTR、CRM、EGFR 20ins）上时，触发 `group-hover:opacity-100` 即时弹出小浮窗。
* **移动端**：手机端无 Hover 事件。
* **微细节硬规范**：
  - 严禁将关键临床依据、用药红线或剂量说明单独放在纯 CSS `group-hover` 浮窗内；
  - 移动端必须支持 Tap-to-inspect（点击词条唤起轻量 Bottom Sheet 或带遮罩的居中说明卡片），使用户一键阅读完整释义。

### 6.8 触觉反馈 (Haptics) 硬件分流与防干扰策略
* **PC 端**：鼠标与键盘为无震动硬件，禁止调用可能会报错或带来性能开销的伪马达指令。
* **移动端**：
  - 调用项目统一的 `triggerHaptic(type: "light" | "medium" | "selection")`；
  - **轻触级 (`light`)**：导航 Tab 切换、癌种专区切换、折叠面板展开；
  - **确认级 (`medium`)**：保存病历档案、微信赞赏寄语提交成功、基因突变勾选；
  - **警告级 (`heavy` / 连击)**：触发 DDI 严重红线用药拦截、清空历史档案确认。

---

## 7. 全局绝对 Z-Index 分层阶梯 (Strict Z-Index Hierarchy)

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

## 8. 临床报告纸张排版与 PDF 打印导出标准 (Print & A4 Clinical Report Standard)

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

## 9. 移动端中文排版与海报导出黄金法则 (CJK Mobile Typography & Rasterization)

在 2026 年针对知癌维基全站 15 个页面的真机视觉审计中沉淀的四大高精细节铁律：

### 9.1 中文标题排版与防孤字折行法则 (CJK Typography Responsive Ratio)
* **数学背景**：393px 手机屏扣除两端 `px-3.5`（28px）与卡片内衬后，可用文字宽度仅为 340px ~ 365px。
* ❌ **反模式**：移动端无脑使用 `text-3xl`（30px）。中文字符若达 13~16 字（如“破除用药负担 · 肺癌特药医保与慈善赠药”），宽度 $18 \times 30\text{px} = 540\text{px} > 365\text{px}$，必将导致末尾单字（如“药”）或短语断开孤零零悬挂在第 2 行。
* ✅ **规范要求**：
  1. 移动端大标题基准一律使用 `text-2xl`（24px）（如 `text-2xl sm:text-4xl lg:text-5xl`）；
  2. 复合型标题必须采用语义切分与智能断点：
     ```tsx
     <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
       <span className="inline-block">前半句核心主标</span>
       <span className="hidden sm:inline"> · </span>
       <br className="sm:hidden" />
       <span className="text-blue-600 inline-block">后半句专科修饰</span>
     </h1>
     ```

### 9.2 胶囊徽章与顶栏面包屑防挤压标准 (Pill Badge & Breadcrumb Overflow Protection)
* **胶囊徽章规范**：
  - 顶栏胶囊必须配置 `max-w-full`，字号为 `text-2xs sm:text-xs`；
  - 辅助修饰短语（如“100% 专区 1:1 循证图谱”、“2024~2025 现行标准”）必须添加 `hidden xs:inline-block`，确保在 375px/393px 紧凑视口下不触碰屏幕右侧物理边缘。
* **面包屑防挤压**：
  - `flex justify-between` 布局下，左侧返回链接必须 `shrink-0`，右侧说明文字必须配置 `truncate max-w-[160px] sm:max-w-none text-right`，杜绝横向挤出视口。

### 9.3 离屏海报与 Canvas 导出防灰色伪影标准 (Export Canvas Rasterization Rules)
* **消除模糊投影伪影**：
  - 所有参与 `html-to-image` / Canvas 导出的卡片与徽章，**严禁使用任何 CSS 模糊投影**（`shadow-xs` / `shadow-md` / `shadow-2xl` 等），离屏高倍率渲染时会导致右侧产生灰黑断层；必须 100% 替换为纯色 1px 细线边框（`border border-slate-200/90`）；
* **底色防侧漏**：
  - 外层容器与 Logo 底盒严禁使用浅灰阶（`bg-slate-100`），必须固化为纯白 `bg-white`，彻底解决 0.5px 亚像素舍入露出的灰色杂边。

### 9.4 复杂交互向导的「防静默覆盖引用锁（Mutable Ref Lock Pattern）」
* 当用户处于“编辑/校对/向导”状态时，后台静默网络请求返回或缓存加载**绝不能误杀当前界面**：
  ```tsx
  // 必须使用同步可变引用锁
  const showUploaderRef = useRef(showUploader);
  showUploaderRef.current = showUploader;
  // 在异步请求回调中检查引用锁
  if (!showUploaderRef.current && !editModeRef.current) {
    setShowUploader(false);
  }
  ```

### 9.5 全局模态框与 React Portal 逃逸规则 (Portal Stacking Context Escape)
* **CSS 层叠上下文陷阱 (Stacking Context Trap)**：
  当弹窗组件直接渲染在局部组件树中，若任何祖先元素设置了 `position: relative; z-index: 10;` 或 `transform`、`filter`、`overflow-hidden`，该弹窗即使设置了 `fixed inset-0 z-[9999]` 也**无法逃逸局部层叠上下文**！兄弟组件若同样具有 `relative z-10` 且在 DOM 树靠后，其内容会**直接覆盖并阻断弹窗内容**（如免责声明卡片强行盖在赞赏码上方）。
* ✅ **微细节硬规范**：
  - 全站所有全局弹窗（Modal / Dialog / Drawer）**必须统一使用 `createPortal(..., document.body)` 挂载到根节点**；
  - 必须配合 `mounted` 挂载守卫以防御 Next.js SSR 水合不一致：
    ```tsx
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!isOpen || !mounted) return null;
    return createPortal(<div className="fixed inset-0 z-[9999] ...">...</div>, document.body);
    ```

### 9.6 移动端超宽与水平溢出 (Horizontal Viewport Blowout) 终极防御规范
* **问题背景**：移动端视口宽度仅 360px ~ 430px。任意行内元素未限制最大宽度、断点写错或复杂表单硬撑，就会导致页面水平溢出，产生整页横向滑动与右侧空白晃动。
* ✅ **终极防御军规**：
  1. **Inline-Flex 长文本撑爆防御**：
     - `inline-flex` 默认不折行。若内含较长中文文案（如“支持拍摄/上传报告单 · AI 自动结构化提取分期与靶点”，31 汉字宽达 424px），在 390px 视口下将直接突破屏幕边界。
     - **必须配置**：`inline-flex max-w-full min-w-0` 并在文本节点上添加 `truncate` 或移动端换行，严禁让未截断的长文本自由撑开 `inline-flex`。
  2. **Tailwind v4 断点禁忌 (No `xs:`)**：
     - Tailwind CSS v4 默认**不存在 `xs:` 断点**（仅支持 `sm:`, `md:`, `lg:`, `xl:`, `2xl:`）。
     - 严禁书写 `hidden xs:inline-block`，否则在移动端将被直接解析为全局 `hidden` 或异常行为。
     - 正确解法：使用移动端优先的 `truncate max-w-[200px] sm:max-w-none`，或标准的 `hidden sm:inline-block`。
  3. **复杂表单输入与预设快选按钮的响应式解耦**：
     - ❌ **反模式**：在单个水平 Flex 行内强行塞入数字输入框（`w-20`）+ 单位 + 多个快选预设按钮（如 Ki-67 细胞增殖指数的 `≤5% 惰性`、`15% 常规`、`>30% 活跃`）。在 375px/393px 手机屏上，输入框会被挤扁至不可见，按钮文字被挤压拆字折行。
     - ✅ **标准规范**：移动端采用上下两段式架构——上方输入框带单位独立占满宽度；下方采用 `grid grid-cols-3 gap-1.5` 排布快选预设，并配备 `whitespace-nowrap`。桌面端再平滑过渡为单行横排（`sm:flex sm:items-center`）。
  4. **SVG 图表防溢出与 `overflow-visible` 禁令**：
     - 在横向滚动容器（`overflow-x-auto`）内放置 SVG 图表（如肿瘤标志物趋势图、结节倍增时间图）时，**绝对严禁在 `<svg>` 上添加 `overflow-visible`**！部分移动端 WebKit/Blink 内核会将溢出的路径计算进文档全局宽度，导致整页产生横向滚轮。
     - 必须将 `<svg>` 严格约束在父级容器中，配置 `min-w-[340px] sm:min-w-[480px] rounded-xl`，杜绝生硬写死 `min-w-[500px]`。
  5. **长徽章与置信度胶囊的小屏降级**：
     - 超过 200px 的长文案胶囊徽章（如“循证置信度 | ★ 5星 最高循证 (RCT/Meta分析)”），在移动端必须采用响应式条件渲染：移动端展示紧凑版（`置信度 | ★ 5星`），桌面端展示完整版（`sm:inline`）。

---

### 9.7 统一 SVG 与全站图标规范系统 (Unified SVG & Icon Standard System - Wiki Benchmark)
全站图标系统全面对齐**知癌百科（Wiki）词条典范**（如 `/wiki`、`WikiCompactCard`、`WikiTopicIcon` 与 `WikiDetailDrawer`），实现极致的统一感、克制感与专业感。

* **1. 严禁散装手写 `<svg>` 路径**：
  - 全站所有功能性、交互性与指示性图标（包括：箭头、返回、折叠、关闭、勾选、星级、搜索、齿轮、用户头像、知识图谱节点、外部链接、加载旋转圈等），**100% 统一引用 `lucide-react`**；
  - 严禁在页面或组件中临时 copy/paste 原始 `<svg viewBox="0 0 24 24">` 代码，杜绝描边粗细不一、视口偏移和样式割裂。
* **2. 合法自绘 SVG 的绝对边界（仅限临床图表与解剖模型）**：
  - 仅以下两种场景允许使用原生自绘 `<svg>`：
    1. **专属癌种器官解剖模型**：位于 `src/components/common/CancerIcons.tsx` 的 11 个癌种官方矢量器官图（肺、肝、胃、结直肠、乳腺、甲状腺、食管、胰腺、前列腺、宫颈、子宫内膜）；
    2. **专业临床可视化图解与动态图表**：`src/components/wiki/visuals/*` 下的 20+ 个病理与影像交互模型（如毛刺征、胸膜凹陷、微钙化等），以及 `HeroKmCurve`、`KmSurvivalVisualizer`、`MiniForestPlot`、`TumorMarkersCard`、`NoduleTimelineChart`、`VdtGauge`、`RadarChart`。
* **3. 图标基准尺寸阶梯 (Icon Sizing Scale)**：
  - **微型内嵌图标**（胶囊、Tag、单行元数据）：`w-3 h-3` 或 `w-3.5 h-3.5`，必须附带 `shrink-0`；
  - **标准按钮 / Tab 标签 / 面包屑图标**：`w-4 h-4 shrink-0`；
  - **模块标题前导 / 重要卡片功能图标**：外层包裹标准方舱 `w-8 h-8 rounded-xl shrink-0 aspect-square flex items-center justify-center`，内嵌 `w-4 h-4` 或 `w-4.5 h-4.5`；
  - **强调型状态大图标**（空状态、成功结算）：`w-8 h-8` ~ `w-12 h-12`。
* **4. 图标抗挤压强制三件套**：
  - 位于 Flex 横向排版（尤其是右侧有文字标题或换行文本）中的任何图标，**必须强制添加 `shrink-0` 与 `aspect-square`**，坚决杜绝因文字折行而把图标压成椭圆或挤没。
* **5. 加载旋转器统一标准**：
  - 严禁手写 SVG spinner，全站统一使用 `<Loader2 className="animate-spin w-4 h-4 shrink-0" />`（或依容器大小为 `w-5 h-5`）。

---

## 10. 反模式黑名单 (Anti-Patterns Prohibited)

开发与代码审查中，若出现以下写法**直接判定不合格并拦截修复**：

| ❌ 严禁的反模式代码 | 根因与危害 | ✅ 必须使用的规范标准 |
| :--- | :--- | :--- |
| `md:pt-32` / `md:pt-28` | 在悬浮导航栏下方留出 60px+ 的巨大视觉荒原 | `md:pt-20 lg:pt-24` |
| 移动端中文标题使用 `text-3xl`（超过 12 字未分行） | 造成末尾单个汉字孤立换行（如“药”字单落一行） | `text-2xl sm:text-4xl` 配合智能语义 `<br className="sm:hidden" />` |
| 使用不存在的 `xs:` 断点（如 `hidden xs:inline-block`） | Tailwind v4 无 `xs:`，小屏上直接被解析为 `hidden` 导致内容凭空消失 | 统一使用 `truncate max-w-[200px] sm:max-w-none` 或 `hidden sm:inline` |
| `inline-flex` 内包裹超过 20 个字符且未加宽度限制 | 31 汉字宽达 424px，远超 390px 手机视口，引发全屏横向抖动白边 | 配置 `inline-flex max-w-full min-w-0` 与 `truncate` |
| 手机端单行强塞“数字输入框 + 3个预设快选按钮” | 输入框被严重挤压不可用，按钮汉字被折断破坏布局 | 移动端输入框满宽一行，下方 `grid grid-cols-3 gap-1.5` 排布预设 |
| 在横滑 SVG 图表上添加 `overflow-visible` | 导致部分移动端浏览器将超出路径算作文档宽度，导致整页横向可拖动 | 移除 `overflow-visible`，采用响应式 `min-w-[340px] sm:min-w-[480px]` |
| 临时内嵌散装 `<svg viewBox="0 0 24 24">` 通用图标 | 视觉风格割裂，路径粗细不一，难以全局维护与换肤 | 100% 使用 `lucide-react` 标准图标，仅医学解剖/图表保留矢量自绘 |
| 手写 SVG 动画圆圈实现 loading | 缺乏统一视觉标准，动效参数不一 | 统一使用 `<Loader2 className="animate-spin w-4 h-4 shrink-0" />` |
| 在 Canvas 导出卡片容器上使用 `shadow-xs` / `shadow-2xl` | Canvas 栅格化产生严重亚像素灰黑色阴影伪影 | 移除所有 shadow，改用 `border border-slate-200` 纯线框 |
| 导出卡片 Logo 容器使用 `bg-slate-100` 底色 | 0.5px 亚像素舍入导致右侧缝隙露出灰色杂边 | 统一固化为纯白 `bg-white` |
| `pb-24` / `pb-16` (在 main 上) | 页面触底前产生冗长空洞，手机端极易产生手势疲劳 | `pb-12 sm:pb-16` |
| `mb-6` / `mb-8` 碎片化散落在各个卡片外层 | 造成手机端卡片框间距时大时小（部分 0px，部分 24px） | 容器统合 `space-y-4 sm:space-y-5 md:space-y-6`，卡片自身零外部纵向外距 |
| 弹窗组件未使用 `createPortal` 挂载至 `document.body` | 被父级 `relative z-10` 锁死局部层叠上下文，导致后续兄弟卡片与底部导航遮挡弹窗 | 必须使用 `createPortal(..., document.body)` 配合 `mounted` 挂载锁 |
| Flex 横排中的图标未配 `shrink-0 self-start aspect-square` | 右侧文本多行折行时，图标容器被 `align-items: stretch` 强行拉伸成长条椭圆 | 添加 `shrink-0 self-start aspect-square` 锁死正方形徽章 |
| 双 CTA 按钮未配统一固定高度 | 一有边框一无边框，移动端并排或折行时高度相差 2px~4px | 统一配置 `h-12` (48px) 与 `rounded-2xl` |
| 移动端 4 列以上大表格直接硬撑 | 手机横向仅 390px，单元格被挤压成每行仅 1 个汉字且底栏遮挡 | 移动端自动降级为卡片堆叠 (`sm:hidden`)，桌面端保留横滑表格 (`hidden sm:block`) |
| 弹窗容器使用 `z-50` | 与桌面导航栏同层竞争，引发遮罩穿模 | 统一提升为 `z-[9999]` |
| 移动端抽屉未配 `env(safe-area-bottom)` | 底部按钮被 iPhone 底部手势横条遮挡并误触 | `pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]` 或 `pb-safe` |
| 异步数据加载直接无条件调用 `setShowUploader(false)` | 产生竞态条件，将用户刚刚打开的校对向导当场关闭 | 使用 `showUploaderRef` / `editModeRef` 引用锁做挂载守卫 |

---

## 11. 代码审查与落地验证清单 (Pre-Commit / PR Checklist)

任何修改或新建 UI 代码提交前，必须逐项核对：

- [ ] **顶部避让校验**：页面主容器或 Header 是否已采用 `pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24`？
- [ ] **触底距离校验**：页面主容器底部是否已统一为 `pb-12 sm:pb-16`，彻底杜绝内容被移动端底栏截断？
- [ ] **卡片间距规范校验**：卡片间距是否统一由外层容器的 `space-y-4 sm:space-y-5 md:space-y-6` 阶梯驱动，杜绝零散 `mb-6`？
- [ ] **防超宽与横溢校验**：所有 `inline-flex` 是否配置了 `max-w-full min-w-0` 与截断，图表无 `overflow-visible`，手机端无横向滑动？
- [ ] **断点有效性校验**：是否杜绝了无效的 `xs:` 断点？
- [ ] **SVG 与图标标准校验**：通用图标是否 100% 采用 `lucide-react`，规范尺寸 + `shrink-0`，杜绝散装手绘 SVG？
- [ ] **模态框 Portal 校验**：所有遮罩模态框是否已通过 `createPortal(..., document.body)` 挂载，彻底摆脱层叠上下文陷阱？
- [ ] **图标自适应正方形校验**：列表与卡片头部的指示图标是否配备 `shrink-0 self-start aspect-square`？
- [ ] **CTA 按钮触控标准校验**：核心操作按钮是否统一采用 `h-12`（48px 触控面积）与 `rounded-2xl`？
- [ ] **复杂表格响应式降级校验**：列数 $\ge 4$ 的表格是否具备移动端卡片化降级视图？
- [ ] **移动端标题排版校验**：中文长标题是否采用 `text-2xl` 并消除孤字末行折行？
- [ ] **导出卡片渲染校验**：海报导出组件是否已 100% 移除 `shadow-*` 投影并采用纯色边框？
- [ ] **交互状态锁校验**：向导与编辑模式是否具备 `useRef` 状态锁，防止异步加载闪退？
- [ ] **自动化测试与真机视觉校验**：运行 `npm run test:unit` 全部通过，并通过双端真实截图验收无任何横向溢出与布局撕裂？


