-- CreateTable
CREATE TABLE "EmailVerificationSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationSession_sessionHash_key" ON "EmailVerificationSession"("sessionHash");

-- CreateIndex
CREATE INDEX "EmailVerificationSession_userId_idx" ON "EmailVerificationSession"("userId");

-- CreateIndex
CREATE INDEX "EmailVerificationSession_expiresAt_idx" ON "EmailVerificationSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "EmailVerificationSession" ADD CONSTRAINT "EmailVerificationSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
