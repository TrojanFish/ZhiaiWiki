import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "循证知识库",
  description:
    "知癌维基循证知识库：覆盖肺癌、乳腺癌、结肠癌、直肠癌、胃癌、肝癌、食管癌、甲状腺癌、子宫内膜癌、宫颈癌、胰腺癌等11大实体瘤，整合NCCN、CSCO、ESMO权威指南，提供从诊断、分期、治疗到随访的全病程循证导航。每一条结论均标注证据等级与来源文献。",
  alternates: {
    canonical: "/wiki",
  },
  openGraph: {
    title: "循证知识库 | 知癌维基 ZhiaiWiki",
    description:
      "11大实体瘤全病程循证知识库。整合NCCN、CSCO、ESMO国际权威指南，每一条结论都有来源，每一个解释都可追溯。",
    url: "https://zhiaiwiki.org/wiki",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "知癌维基 循证知识库" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "循证知识库 | 知癌维基 ZhiaiWiki",
    description: "11大实体瘤全病程循证知识库。整合NCCN、CSCO、ESMO权威指南。",
    images: ["/logo.png"],
  },
};

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
