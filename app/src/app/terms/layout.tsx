import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "服务条款",
  description:
    "知癌维基 ZhiaiWiki 服务条款：详细说明平台使用规则、内容版权声明、医疗信息免责条款及用户行为准则。本平台内容仅供参考，不构成诊疗建议，具体治疗方案请遵循医生指导。",
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
