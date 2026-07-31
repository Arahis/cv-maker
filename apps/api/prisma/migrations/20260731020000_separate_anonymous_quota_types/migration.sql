DROP INDEX "AnonymousResumeQuota_tokenHash_key";
DROP INDEX "AnonymousResumeQuota_fingerprintHmac_key";

CREATE UNIQUE INDEX "AnonymousResumeQuota_tokenHash_creationType_key"
ON "AnonymousResumeQuota"("tokenHash", "creationType");

CREATE UNIQUE INDEX "AnonymousResumeQuota_fingerprintHmac_creationType_key"
ON "AnonymousResumeQuota"("fingerprintHmac", "creationType");
