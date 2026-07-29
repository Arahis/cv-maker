CREATE TABLE "AnonymousResumeQuota" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "fingerprintHmac" TEXT,
    "localResumeId" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousResumeQuota_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AnonymousResumeQuota_tokenHash_key"
ON "AnonymousResumeQuota"("tokenHash");

CREATE UNIQUE INDEX "AnonymousResumeQuota_localResumeId_key"
ON "AnonymousResumeQuota"("localResumeId");

CREATE UNIQUE INDEX "AnonymousResumeQuota_fingerprintHmac_key"
ON "AnonymousResumeQuota"("fingerprintHmac");
