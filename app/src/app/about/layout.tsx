import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们",
  description:
    "关于知癌维基 ZhiaiWiki：我们是一个专注于肿瘤患者的非营利性循证医学知识平台，由医学专业人士与患者家属共同创建。使命是将复杂的医学研究翻译成患者能理解的语言，每一条结论都有来源，每一个解释都可追溯。",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "关于我们 | 知癌维基 ZhiaiWiki",
    description:
      "知癌维基：非营利性肿瘤循证医学平台，致力于将医学研究翻译成患者语言。知癌，方能治癌；每一次循证，皆因至爱。",
    url: "https://zhiaiwiki.org/about",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "知癌维基 关于我们" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "关于我们 | 知癌维基 ZhiaiWiki",
    description: "非营利性肿瘤循证平台。知癌，方能治癌；每一次循证，皆因至爱。",
    images: ["/logo.png"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
