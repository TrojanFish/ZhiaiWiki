import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "临床研究中心",
  description:
    "知癌维基临床研究中心：精选国内外最新肿瘤临床试验、真实世界研究与突破性进展。覆盖肺癌靶向治疗、乳腺癌免疫治疗、结直肠癌联合方案等8大癌种前沿研究，帮助患者了解最新治疗选项与招募信息。",
  alternates: {
    canonical: "/studies",
  },
  openGraph: {
    title: "临床研究中心 | 知癌维基 ZhiaiWiki",
    description:
      "精选8大癌种最新临床试验与真实世界研究。靶向、免疫、化疗方案循证荟萃，帮助患者洞察前沿治疗进展。",
    url: "https://zhiaiwiki.org/studies",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "知癌维基 临床研究中心" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "临床研究中心 | 知癌维基 ZhiaiWiki",
    description: "精选8大癌种最新临床试验与真实世界研究。",
    images: ["/logo.png"],
  },
};

export default function StudiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
