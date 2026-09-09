import { TextReader, createTextReader } from "../text-reader.js";
import type { ResumeForm } from "@cv-maker/shared";

type DescriptionBullet = NonNullable<
  NonNullable<ResumeForm["workExperiences"]>[number]["descriptionBullets"]
>[number];

export function WorkExperienceDescription({
  bullets,
}: {
  bullets?: DescriptionBullet[];
}) {
  const filledBullets = (bullets ?? []).filter(
    (bullet) => createTextReader(bullet.text).text.trim() !== "",
  );

  if (filledBullets.length === 0) return null;

  return (
    <ul className="list-none">
      {filledBullets.map((bullet) => (
        <li key={bullet.id} className="resume-text-bullet pl-5">
          <TextReader value={bullet.text} prefix={"•\u00a0\u00a0\u00a0"} />
        </li>
      ))}
    </ul>
  );
}
