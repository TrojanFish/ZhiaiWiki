import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策",
  description:
    "知癌维基 ZhiaiWiki 隐私政策：详细说明平台如何收集、使用、存储和保护用户个人信息。本平台严格遵守《个人信息保护法》(PIPL)，不收集患者病历等敏感医疗信息，保障用户隐私安全。",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
