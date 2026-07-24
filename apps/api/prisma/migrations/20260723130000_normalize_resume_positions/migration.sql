WITH ranked AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "userId"
      ORDER BY "position" ASC, "updatedAt" DESC, "createdAt" DESC, "id"
    ) * 1000 AS "position"
  FROM "Resume"
)
UPDATE "Resume" AS resume
SET "position" = ranked."position"
FROM ranked
WHERE resume."id" = ranked."id";
