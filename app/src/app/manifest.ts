import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "知癌维基 ZhiaiWiki — 肿瘤全病程循证与关怀平台",
    short_name: "知癌维基",
    description: "“知癌，方能治癌；每一次循证，皆因至爱。” Knowing Cancer, Treating Cancer, Caring with Love. 涵盖肺癌、乳腺癌、结直肠癌、胃癌、肝癌、食管癌、甲状腺癌与前列腺癌的权威循证决策与全病程就医数字导航系统。",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0284c7",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
