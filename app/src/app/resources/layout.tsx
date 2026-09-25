import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "患者资源中心",
  description:
    "知癌维基患者资源中心：汇聚全国顶级肿瘤专科医院导航、权威医学指南下载、患者支持组织、心理援助热线及康复资源。为肿瘤患者及家属提供从确诊到康复全程的多维度支持资源。",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "患者资源中心 | 知癌维基 ZhiaiWiki",
    description:
      "顶级肿瘤医院导航、权威指南下载、患者互助组织、心理援助热线——肿瘤患者全程支持资源一站汇聚。",
    url: "https://zhiaiwiki.org/resources",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "知癌维基 患者资源中心" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "患者资源中心 | 知癌维基 ZhiaiWiki",
    description: "顶级肿瘤医院导航、权威指南、患者支持组织资源汇聚。",
    images: ["/logo.png"],
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
