ALTER TABLE "AnonymousResumeQuota"
ADD COLUMN "hasEverUploaded" BOOLEAN NOT NULL DEFAULT false;

UPDATE "AnonymousResumeQuota"
SET "hasEverUploaded" = ("creationType" = 'upload');

DROP INDEX "AnonymousResumeQuota_tokenHash_creationType_key";
DROP INDEX "AnonymousResumeQuota_fingerprintHmac_creationType_key";

CREATE UNIQUE INDEX "AnonymousResumeQuota_tokenHash_hasEverUploaded_key"
ON "AnonymousResumeQuota"("tokenHash", "hasEverUploaded");

CREATE UNIQUE INDEX "AnonymousResumeQuota_fingerprintHmac_hasEverUploaded_key"
ON "AnonymousResumeQuota"("fingerprintHmac", "hasEverUploaded");

ALTER TABLE "AnonymousResumeQuota"
DROP COLUMN "creationType";
