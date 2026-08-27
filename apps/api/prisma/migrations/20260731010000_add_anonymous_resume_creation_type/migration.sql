ALTER TABLE "AnonymousResumeQuota"
ADD COLUMN "creationType" TEXT NOT NULL DEFAULT 'upload';

ALTER TABLE "AnonymousResumeQuota"
DROP COLUMN "resettable";
