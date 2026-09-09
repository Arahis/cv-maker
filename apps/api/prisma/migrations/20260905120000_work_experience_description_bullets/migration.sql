-- Migrate the old single Lexical description into the first description bullet.
UPDATE "Resume" AS resume
SET "data" = jsonb_set(
  resume."data",
  '{workExperiences}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN experience.value ? 'descriptionBullets' THEN experience.value
        ELSE (experience.value - 'description') || jsonb_build_object(
          'descriptionBullets', jsonb_build_array(
            jsonb_build_object(
              'id', gen_random_uuid()::text,
              'text', COALESCE(experience.value->'description', to_jsonb(''::text))
            )
          )
        )
      END
      ORDER BY experience.position
    )
    FROM jsonb_array_elements(resume."data"->'workExperiences')
      WITH ORDINALITY AS experience(value, position)
  ),
  true
)
WHERE jsonb_typeof(resume."data"->'workExperiences') = 'array'
  AND EXISTS (
    SELECT 1
    FROM jsonb_array_elements(resume."data"->'workExperiences') AS experience(value)
    WHERE experience.value ? 'description'
  );
