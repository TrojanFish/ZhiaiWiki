"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Heart, 
  MessageSquareHeart, 
  Coffee, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Sparkles,
  Check,
  HeartHandshake
} from "lucide-react";
import type { LoveRelayItem } from "@/lib/loveRelayData";

interface LoveRelaySubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newItem: LoveRelayItem) => void;
}

const CANCER_OPTIONS = [
  { label: "肺癌专区", tag: "肺癌", color: "bg-sky-50 text-sky-700 border-sky-200" },
  { label: "乳腺癌专区", tag: "乳腺癌", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { label: "结直肠癌专区", tag: "结直肠癌", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "胃癌专区", tag: "胃癌", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { label: "肝癌专区", tag: "肝癌", color: "bg-rose-50 text-rose-700 border-rose-200" },
  { label: "甲状腺癌专区", tag: "甲状腺癌", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "食管癌专区", tag: "食管癌", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { label: "全癌种/家属同行", tag: "爱心同行", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

const AMOUNT_PRESETS = [
  { label: "随心支持", value: "随心支持" },
  { label: "¥9.9 (一杯暖茶)", value: "¥9.9" },
  { label: "¥20 (清晨咖啡)", value: "¥20.0" },
  { label: "¥50 (算力接力)", value: "¥50.0" },
  { label: "纯祈福留言(未打赏)", value: "暖心祈福" },
];

export default function LoveRelaySubmitModal({
  isOpen,
  onClose,
  onSuccess,
}: LoveRelaySubmitModalProps) {
  const [donorName, setDonorName] = useState("");
  const [selectedCancer, setSelectedCancer] = useState(CANCER_OPTIONS[0]);
  const [selectedAmount, setSelectedAmount] = useState(AMOUNT_PRESETS[0].value);
  const [customAmount, setCustomAmount] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [txLast4, setTxLast4] = useState("");
  const [showQrInline, setShowQrInline] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!message.trim() || message.trim().length < 5) {
      setError("请写下至少 5 个字的抗癌心得、祈福或鼓励寄语。");
      return;
    }

    const finalAmount = customAmount.trim() 
      ? (customAmount.startsWith("¥") ? customAmount : `¥${customAmount}`) 
      : selectedAmount;

    setLoading(true);
    try {
      const res = await fetch("/api/love-relay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: donorName.trim() || "匿名温暖同行者",
          cancerTag: selectedCancer.tag,
          cancerColor: selectedCancer.color,
          amount: finalAmount,
          message: message.trim(),
          city: city.trim() || undefined,
          txLast4: txLast4.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "提交失败，请重试");
      }

      setSubmitted(true);
      setTimeout(() => {
        onSuccess(json.item);
        onClose();
        setSubmitted(false);
        // Reset form
        setMessage("");
        setTxLast4("");
        setDonorName("");
        setCustomAmount("");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-pointer animate-fade-in overflow-hidden sm:overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 max-w-lg w-full border-t sm:border border-slate-200 shadow-2xl flex flex-col space-y-4 animate-slide-up-drawer sm:animate-fade-in-up cursor-default pb-safe sm:pb-7 max-h-[92vh] overflow-y-auto mx-auto"
      >
        {/* Mobile Sheet Grabber */}
        <div className="sm:hidden -mt-2 mb-1 flex justify-center shrink-0 w-full">
          <div className="w-12 h-1.5 rounded-full bg-slate-200" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>留下抗癌寄语 · 祈福上墙</span>
              </h3>
              <p className="text-[11px] text-slate-400">分享康复大复查好消息 · 为同行病友接力打气</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
            aria-label="关闭弹窗"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 flex flex-col items-center justify-center space-y-3 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">祈福留言已成功上墙！</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                感谢您的温暖支持与真挚寄语。站长核对微信零钱明细后，将为您点亮专属的已验证支持者徽章。
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. 署名 & 城市 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  您的称谓 / 署名 <span className="text-slate-400 font-normal">(选填)</span>
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="如：跨过5年大关的乳腺癌姐妹"
                  maxLength={30}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  所在城市 / 省份 <span className="text-slate-400 font-normal">(选填)</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="如：上海、杭州、广州"
                  maxLength={15}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 2. 关联癌种专区 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                关联癌种专区 <span className="text-slate-400 font-normal">(增加同路人共鸣)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CANCER_OPTIONS.map((opt) => {
                  const isSelected = selectedCancer.tag === opt.tag;
                  return (
                    <button
                      key={opt.tag}
                      type="button"
                      onClick={() => setSelectedCancer(opt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? `${opt.color} ring-2 ring-blue-400/40 shadow-xs font-bold scale-[1.02]`
                          : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. 赞助金额预设 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                赞赏金额 / 支持方式
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {AMOUNT_PRESETS.map((preset) => {
                  const isSelected = selectedAmount === preset.value && !customAmount;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(preset.value);
                        setCustomAmount("");
                      }}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-teal-50/90 border-teal-300 text-teal-900 shadow-2xs font-bold ring-1 ring-teal-300"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate">{preset.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. 抗癌寄语 / 祈福正文 */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>抗癌寄语与祈福留言</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {message.length} / 400
                </span>
              </div>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={400}
                placeholder="给正在经历化疗/靶向治疗的病友打气，或分享术后满3年、5年大复查平安的好消息，把光照进更多人的生命里…"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 leading-relaxed"
                required
              />
            </div>

            {/* 尚未扫码？就地查看微信赞赏码 */}
            <div className="rounded-xl border border-teal-200/80 bg-teal-50/50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                  <Coffee className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>尚未扫码赞赏？支持开发者兼病友</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQrInline(!showQrInline)}
                  className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>{showQrInline ? "收起赞赏码 ▲" : "展开微信赞赏码 ▼"}</span>
                </button>
              </div>
              {showQrInline && (
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2.5 border-t border-teal-100 text-left">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-white p-2 border border-teal-200 shadow-xs shrink-0 flex items-center justify-center">
                    <img
                      src="/sponsor_qr.png?v=2026"
                      alt="微信赞赏码"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed space-y-1">
                    <p className="font-bold text-slate-800">
                      微信扫一扫 · 金额随心无压力
                    </p>
                    <p className="text-slate-500">
                      若面临经济压力请千万不要打赏。若已完成扫码，可在下方填写<strong>单号末4位</strong>核验点亮绿标。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 5. 微信单号后4位 (核验选填) */}
            <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>微信赞赏单号后 4 位</span>
                  <span className="text-slate-400 font-normal">(选填 · 仅站长核验)</span>
                </label>
                <span className="text-[10px] text-emerald-600 font-medium">防伪认证</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                若您刚通过微信赞赏码完成赞助，可填写微信支付账单中的<strong>商户单号或交易单号后 4 位</strong>。站长核对微信零钱明细后，将为您点亮绿色认证徽章。
              </p>
              <input
                type="text"
                value={txLast4}
                onChange={(e) => setTxLast4(e.target.value.replace(/[^0-9a-zA-Z]/g, "").slice(0, 8))}
                placeholder="如：8892 (选填，前台严格脱敏绝不公开)"
                maxLength={8}
                className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-800 outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 mt-1"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-60 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{loading ? "正在提交中..." : "确认提交祈福留言"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
