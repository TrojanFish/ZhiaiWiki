import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "医保与报销指南",
  description:
    "知癌维基医保报销指南：全面覆盖城镇职工医保、城乡居民医保、商业保险及国家医保谈判药品报销政策。提供8大癌种肿瘤药物医保目录查询、自费药品报销申请流程、慈善援助项目信息，助力患者减轻经济负担。",
  alternates: {
    canonical: "/reimbursement",
  },
  openGraph: {
    title: "医保与报销指南 | 知癌维基 ZhiaiWiki",
    description:
      "肿瘤患者医保政策全解析：医保目录药品、慈善援助、商业保险理赔一站式导航。减轻经济负担，让治疗无忧。",
    url: "https://zhiaiwiki.org/reimbursement",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "知癌维基 医保报销指南" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "医保与报销指南 | 知癌维基 ZhiaiWiki",
    description: "肿瘤患者医保政策全解析：医保目录、慈善援助、商业保险理赔。",
    images: ["/logo.png"],
  },
};

export default function ReimbursementLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
