import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { CancerRegistry } from "@/lib/cancerRegistry";
import { computeCancerStage, isSupportedCancerType } from "@/lib/stagingRegistry";

const cancerTypes = ["lung", "breast"] as const;

describe("lung and breast upload/evidence workflow contract", () => {
  it("registers every supported cancer with staging, cohort, DDI and evidence content", () => {
    for (const cancerType of cancerTypes) {
      const plugin = CancerRegistry.get(cancerType);
      expect(plugin.id).toBe(cancerType);
      expect(plugin.staging.computeStage).toBeTypeOf("function");
      expect(plugin.staging.getCohort).toBeTypeOf("function");
      expect(plugin.pharmacology.checkInteractions).toBeTypeOf("function");
      expect(plugin.content?.featuredStudies?.length).toBeGreaterThan(0);
    }
  });

  it("accepts only explicit supported cancer ids", () => {
    for (const cancerType of cancerTypes) expect(isSupportedCancerType(cancerType)).toBe(true);
    expect(isSupportedCancerType("unknown")).toBe(false);
    expect(isSupportedCancerType("lung-cancer")).toBe(false);
  });

  it("dispatches staging without silently changing the requested cancer type", () => {
    for (const cancerType of cancerTypes) {
      const result = computeCancerStage(cancerType, { cancerType, tStage: "Tx", nStage: "Nx", mStage: "Mx" });
      expect(result.cancerType).toBe(cancerType);
    }
  });

  it("does not turn missing metastasis data into N0/M0 or default study queries to lung", () => {
    const uploader = fs.readFileSync(path.join(process.cwd(), "src/components/profile/ReportUploader.tsx"), "utf8");
    const studiesRoute = fs.readFileSync(path.join(process.cwd(), "src/app/api/studies/route.ts"), "utf8");
    expect(uploader).not.toContain('nStage: base.nStage || "N0"');
    expect(uploader).not.toContain('mStage: base.mStage || "M0"');
    expect(uploader).not.toContain('nStage: parsedData.nStage || "N0"');
    expect(uploader).not.toContain('mStage: parsedData.mStage || "M0"');
    expect(studiesRoute).toContain("const cancerType = requestedCancerType || 'all'");
    expect(studiesRoute).toContain("UNSUPPORTED_CANCER_TYPE");
  });

  it("keeps the legacy single-image upload path behind the same size and MIME guard", () => {
    const parseRoute = fs.readFileSync(path.join(process.cwd(), "src/app/api/parse-report/route.ts"), "utf8");
    expect(parseRoute).toContain('typeof imageBase64 !== "string"');
    expect(parseRoute).toContain('imageBase64.length > 12_000_000');
    expect(parseRoute).toContain('code: "INVALID_REPORT_IMAGE"');
  });
});
