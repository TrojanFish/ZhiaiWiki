import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "循证知识库",
  description:
    "知癌维基循证知识库：覆盖12大实体肿瘤专区，提供健康科普、报告字段整理与可追溯的循证资料检索。平台不提供诊断、分期、治疗方案或在线诊疗，每一条资料均标注来源文献。",
  alternates: {
    canonical: "/wiki",
  },
  openGraph: {
    title: "循证知识库 | 知癌维基 ZhiaiWiki",
    description:
      "12大实体肿瘤专区循证知识库，提供健康科普、报告字段整理与来源可追溯的资料检索。",
    url: "https://zhiaiwiki.org/wiki",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "知癌维基 循证知识库" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "循证知识库 | 知癌维基 ZhiaiWiki",
    description: "12大实体肿瘤专区全病程循证知识库。整合NCCN、CSCO、ESMO权威指南。",
    images: ["/logo.png"],
  },
};

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
