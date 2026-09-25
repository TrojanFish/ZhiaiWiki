import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "爱心接力",
  description:
    "知癌维基爱心接力：肿瘤患者互助与关怀社区。患者故事分享、病友经验交流、家属情感支持，以及医疗众筹、慈善援助申请渠道。因为至爱，所以同行。",
  alternates: {
    canonical: "/love-relay",
  },
  openGraph: {
    title: "爱心接力 | 知癌维基 ZhiaiWiki",
    description:
      "肿瘤患者互助关怀社区：患者故事、病友经验、家属支持。因为至爱，所以同行。",
    url: "https://zhiaiwiki.org/love-relay",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "知癌维基 爱心接力" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "爱心接力 | 知癌维基 ZhiaiWiki",
    description: "肿瘤患者互助关怀社区：患者故事、病友经验、家属支持。",
    images: ["/logo.png"],
  },
};

export default function LoveRelayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
