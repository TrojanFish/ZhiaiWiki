import type { Metadata, Viewport } from "next";
import "./globals.css";


export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://zhiaiwiki.org"),
  title: {
    default: "知癌维基 ZhiaiWiki — 肿瘤全病程循证与关怀平台",
    template: "%s | 知癌维基 ZhiaiWiki",
  },
  description:
    "“知癌，方能治癌；每一次循证，皆因至爱。” Knowing Cancer, Treating Cancer, Caring with Love. 涵盖肺癌、乳腺癌、结直肠癌、胃癌、肝癌、食管癌、甲状腺癌与前列腺癌的权威循证决策与全病程就医数字导航系统。每一条结论都有来源，每一个解释都可追溯。",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "知癌维基",
  },
  keywords: [
    "知癌维基",
    "ZhiaiWiki",
    "zhiaiwiki.org",
    "肿瘤循证",
    "癌症导航",
    "知癌",
    "治癌",
    "至爱",
    "肺癌",
    "乳腺癌",
    "结直肠癌",
    "胃癌",
    "肝癌",
    "食管癌",
    "甲状腺癌",
    "前列腺癌",
    "病理报告解读",
    "循证医学",
    "IASLC",
    "CSCO",
    "NCCN",
    "术后随访",
  ],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "知癌维基 ZhiaiWiki — 肿瘤全病程循证与关怀平台",
    description:
      "“知癌，方能治癌；每一次循证，皆因至爱。” Knowing Cancer, Treating Cancer, Caring with Love. 把复杂的医学研究翻译成患者能理解的语言。每一句话都有证据来源。",
    type: "website",
    url: "https://zhiaiwiki.org",
    siteName: "知癌维基 ZhiaiWiki",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "知癌维基 ZhiaiWiki Logo" }],
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "知癌维基 ZhiaiWiki — 肿瘤全病程循证与关怀平台",
    description: "“知癌，方能治癌；每一次循证，皆因至爱。” 权威12大实体肿瘤专区循证医学与数字导航系统。",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalOrganization",
      "@id": "https://zhiaiwiki.org/#organization",
      "name": "知癌维基 ZhiaiWiki",
      "url": "https://zhiaiwiki.org",
      "logo": "https://zhiaiwiki.org/logo.png",
      "description": "非营利性肿瘤全病程循证决策与患者就医数字导航平台，覆盖12大高发实体肿瘤专区临床指南与真实世界研究。",
      "slogan": "知癌，方能治癌；每一次循证，皆因至爱",
      "medicalSpecialty": [
        "https://schema.org/Oncology",
        "https://schema.org/RadiationOncology",
        "https://schema.org/SurgicalOncology"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://zhiaiwiki.org/#website",
      "url": "https://zhiaiwiki.org",
      "name": "知癌维基 ZhiaiWiki",
      "description": "多瘤种全病程循证医学知识库与智能就医导航系统",
      "publisher": {
        "@id": "https://zhiaiwiki.org/#organization"
      },
      "inLanguage": "zh-CN"
    },
    {
      "@type": "MedicalWebPage",
      "@id": "https://zhiaiwiki.org/#webpage",
      "url": "https://zhiaiwiki.org",
      "name": "知癌维基 ZhiaiWiki — 肿瘤全病程循证与关怀平台",
      "isPartOf": {
        "@id": "https://zhiaiwiki.org/#website"
      },
      "about": [
        { "@type": "MedicalCondition", "name": "肺癌 (Lung Cancer)" },
        { "@type": "MedicalCondition", "name": "乳腺癌 (Breast Cancer)" },
        { "@type": "MedicalCondition", "name": "结直肠癌 (Colorectal Cancer)" },
        { "@type": "MedicalCondition", "name": "胃癌 (Gastric Cancer)" },
        { "@type": "MedicalCondition", "name": "肝癌 (Liver Cancer)" },
        { "@type": "MedicalCondition", "name": "食管癌 (Esophageal Cancer)" },
        { "@type": "MedicalCondition", "name": "甲状腺癌 (Thyroid Cancer)" },
        { "@type": "MedicalCondition", "name": "前列腺癌 (Prostate Cancer)" }
      ]
    }
  ]
};

import ToastContainer from "@/components/common/Toast";
import MobileBottomNav from "@/components/MobileBottomNav";
import CommandPalette from "@/components/CommandPalette";
import NavigationProgress from "@/components/common/NavigationProgress";
import SubpageNavbar from "@/components/SubpageNavbar";
import { PwaInstallBanner } from "@/components/common/PwaInstallBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" sizes="any" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="知癌维基" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <NavigationProgress />
        {/* SubpageNavbar 常驻根布局：确保路由切换时导航栏永不 Unmount/Remount，彻底消除白闪抖动 */}
        <SubpageNavbar />
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          {children}
        </div>
        <MobileBottomNav />
        <CommandPalette />
        <ToastContainer />
        <PwaInstallBanner />
      </body>
    </html>
  );
}
