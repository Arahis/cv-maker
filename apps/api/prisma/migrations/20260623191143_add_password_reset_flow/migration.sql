-- CreateTable
CREATE TABLE "PasswordResetSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetSession_userId_key" ON "PasswordResetSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetSession_sessionHash_key" ON "PasswordResetSession"("sessionHash");

-- CreateIndex
CREATE INDEX "PasswordResetSession_expiresAt_idx" ON "PasswordResetSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "PasswordResetSession" ADD CONSTRAINT "PasswordResetSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
