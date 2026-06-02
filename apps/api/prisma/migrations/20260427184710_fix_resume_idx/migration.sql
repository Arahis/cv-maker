-- DropIndex
DROP INDEX "Resume_updatedAt_idx";

-- DropIndex
DROP INDEX "Resume_userId_idx";

-- CreateIndex
CREATE INDEX "Resume_userId_updatedAt_idx" ON "Resume"("userId", "updatedAt");
