ALTER TABLE "PatientProfile"
  ADD COLUMN "reportDate" TIMESTAMP(3),
  ADD COLUMN "reportSourceType" TEXT,
  ADD COLUMN "reportReviewStatus" TEXT DEFAULT 'needs_review',
  ADD COLUMN "reportEvidenceSpans" JSONB;

UPDATE "PatientProfile"
SET "reportReviewStatus" = 'needs_review'
WHERE "reportReviewStatus" IS NULL;
