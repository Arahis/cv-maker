ALTER TABLE "Resume" ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

WITH ranked AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "userId"
      ORDER BY "updatedAt" DESC, "createdAt" DESC, "id"
    ) * 1000 AS "position"
  FROM "Resume"
)
UPDATE "Resume" AS resume
SET "position" = ranked."position"
FROM ranked
WHERE resume."id" = ranked."id";

CREATE INDEX "Resume_userId_position_idx" ON "Resume"("userId", "position");
