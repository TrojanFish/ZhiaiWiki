import PatientDashboard from "@/components/profile/PatientDashboard";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "患者临床数字档案 - 知癌维基 ZhiaiWiki",
  description: "“知癌，方能治癌；每一次循证，皆因至爱。” 个人临床决策与就医关怀导航平台",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-4 sm:pb-8">
        <PatientDashboard />
      </div>
      <Footer maxWidth="max-w-7xl" />
    </div>
  );
}

