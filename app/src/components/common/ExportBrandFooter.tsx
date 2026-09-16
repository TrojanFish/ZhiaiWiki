"use client";

import React from "react";
import { ONCOPATH_LOGO_DATA_URI } from "@/lib/brandLogo";
import { 
  LUNG_PORTAL_URL, 
  LUNG_QR_SVG_LIGHT_DATA_URI, 
  LUNG_QR_SVG_DARK_DATA_URI 
} from "@/lib/qrCodeGenerator";

export interface ExportBrandFooterProps {
  variant?: "light" | "dark";
  compact?: boolean;
  title?: string;
  subtitle?: string;
  disclaimer?: string;
  scanHint?: string;
}

/**
 * Standardized Clinical Evidence & Verification Brand Footer
 * Used across all exported image posters and consultation cards.
 * Ensures clear portal domain visibility (lung.dpdns.org), QR code access, and zero PII leakage.
 */
export default function ExportBrandFooter({
  variant = "light",
  compact = false,
  title = "OncoPath 肺结节循证知识平台",
  subtitle = "基于 NCCN · CSCO · IASLC 国际现行肺癌诊疗指南与顶刊证据",
  disclaimer = "免责声明：本卡片由 OncoPath 循证引擎基于临床报告提取生成，仅供就医沟通与学术参考，请以主管医师现场诊疗为准。",
  scanHint = "扫码查阅循证文献",
}: ExportBrandFooterProps) {
  const isLight = variant === "light";
  const qrDataUri = isLight ? LUNG_QR_SVG_LIGHT_DATA_URI : LUNG_QR_SVG_DARK_DATA_URI;

  if (compact) {
    return (
      <div
        style={{
          borderTop: isLight ? "1px solid #E2E8F0" : "1px solid #334155",
          paddingTop: "10px",
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
          <img
            src={ONCOPATH_LOGO_DATA_URI}
            alt="OncoPath Logo"
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: isLight ? "#0F172A" : "#FFFFFF",
                  letterSpacing: "0.2px",
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: isLight ? "#2563EB" : "#38BDF8",
                  fontFamily: "monospace",
                }}
              >
                lung.dpdns.org
              </span>
            </div>
            <div
              style={{
                fontSize: "9px",
                color: isLight ? "#64748B" : "#94A3B8",
                marginTop: "2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {disclaimer}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 700,
                color: isLight ? "#334155" : "#CBD5E1",
                lineHeight: 1.2,
              }}
            >
              {scanHint}
            </div>
            <div
              style={{
                fontSize: "8px",
                color: isLight ? "#94A3B8" : "#64748B",
                lineHeight: 1.2,
              }}
            >
              微信/浏览器
            </div>
          </div>
          <div
            style={{
              width: "36px",
              height: "36px",
              padding: "2px",
              borderRadius: "6px",
              backgroundColor: isLight ? "#FFFFFF" : "#0F172A",
              border: isLight ? "1px solid #CBD5E1" : "1px solid #475569",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <img
              src={qrDataUri}
              alt="Scan QR"
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        borderTop: isLight ? "1.5px solid #E2E8F0" : "1.5px solid #1E293B",
        paddingTop: "14px",
        marginTop: "16px",
        boxSizing: "border-box",
        width: "100%",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
        }}
      >
        {/* Left Column: Brand, URL & Authority */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src={ONCOPATH_LOGO_DATA_URI}
              alt="OncoPath Logo"
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "7px",
                objectFit: "cover",
                boxShadow: isLight ? "0 1px 2px rgba(0,0,0,0.06)" : "0 1px 3px rgba(0,0,0,0.4)",
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 900,
                  color: isLight ? "#0F172A" : "#FFFFFF",
                  letterSpacing: "0.3px",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: isLight ? "#64748B" : "#94A3B8",
                  lineHeight: 1.2,
                  marginTop: "1px",
                }}
              >
                {subtitle}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "3px",
              fontSize: "11px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: isLight ? "#475569" : "#CBD5E1",
              }}
            >
              官方访问地址：
            </span>
            <span
              style={{
                display: "inline-block",
                padding: "1.5px 7px",
                borderRadius: "6px",
                backgroundColor: isLight ? "#EFF6FF" : "#1E3A8A/40",
                color: isLight ? "#1D4ED8" : "#60A5FA",
                fontWeight: 800,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                border: isLight ? "1px solid #BFDBFE" : "1px solid #1D4ED8",
                letterSpacing: "0.2px",
              }}
            >
              lung.dpdns.org
            </span>
          </div>

          <div
            style={{
              fontSize: "9px",
              color: isLight ? "#94A3B8" : "#64748B",
              lineHeight: 1.4,
              marginTop: "2px",
            }}
          >
            {disclaimer}
          </div>
        </div>

        {/* Right Column: High-DPI Vector QR Code Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "6px 8px",
            borderRadius: "12px",
            backgroundColor: isLight ? "#F8FAFC" : "#1E293B/80",
            border: isLight ? "1px solid #E2E8F0" : "1px solid #334155",
            flexShrink: 0,
            gap: "4px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              padding: "3px",
              borderRadius: "8px",
              backgroundColor: isLight ? "#FFFFFF" : "#0F172A",
              border: isLight ? "1px solid #CBD5E1" : "1px solid #475569",
              boxSizing: "border-box",
            }}
          >
            <img
              src={qrDataUri}
              alt={LUNG_PORTAL_URL}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 800,
              color: isLight ? "#0F172A" : "#F1F5F9",
              letterSpacing: "0.2px",
              lineHeight: 1,
            }}
          >
            {scanHint}
          </div>
          <div
            style={{
              fontSize: "8px",
              color: isLight ? "#64748B" : "#94A3B8",
              lineHeight: 1,
            }}
          >
            微信长按识别
          </div>
        </div>
      </div>
    </div>
  );
}
