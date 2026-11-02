CREATE TABLE "TailorSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "normalizedResume" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'clarifying',
    "messages" JSONB NOT NULL,
    "confirmedFacts" JSONB NOT NULL,
    "currentTurn" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TailorSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TailorSession_userId_updatedAt_idx" ON "TailorSession"("userId", "updatedAt");
CREATE INDEX "TailorSession_resumeId_updatedAt_idx" ON "TailorSession"("resumeId", "updatedAt");

ALTER TABLE "TailorSession" ADD CONSTRAINT "TailorSession_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TailorSession" ADD CONSTRAINT "TailorSession_resumeId_fkey"
  FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
