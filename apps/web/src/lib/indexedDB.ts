import { openDB } from "idb";
import { useEffect, useRef } from "react";
import { debounce } from "./debounce";
import { ResumeForm } from "./validation";
import { EMPTY_LEXICAL_STATE } from "./formDefaults";
import { ResumeTemplateKey } from "@/components/templates/components";

const DB_NAME = "Resume";
const STORE_NAME = "resumes";
const PENDING_CREATION_STORE_NAME = "pending-resume-creations";
const DB_VERSION = 5;

export type LocalResumeAvatar = {
  croppedBlob: Blob;
};

export type LocalResumeMedia = {
  avatar?: LocalResumeAvatar;
};

export interface ResumeRecord {
  id: string;
  updatedAt: number;
  position: number;

  data: ResumeForm;
  template: ResumeTemplateKey;

  media: LocalResumeMedia;
}

// Initialize IndexedDB
async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }

      if (oldVersion < 2) {
        // `position` is a regular record field, so no object-store migration
        // is required. Existing records are backfilled in loadAllResumes.
      }

      if (
        oldVersion < 4 &&
        db.objectStoreNames.contains(PENDING_CREATION_STORE_NAME)
      ) {
        db.deleteObjectStore(PENDING_CREATION_STORE_NAME);
      }

    },
  });
}

type WorkExperience = NonNullable<ResumeForm["workExperiences"]>[number];
type LegacyWorkExperience = Omit<WorkExperience, "descriptionBullets"> & {
  description?: string;
  descriptionBullets?: WorkExperience["descriptionBullets"];
};
type CustomSection = NonNullable<ResumeForm["customSections"]>[number];
type LegacyCustomSection = Omit<CustomSection, "id" | "sectionItems"> & {
  id?: string;
  sectionItems?: Array<
    Omit<NonNullable<CustomSection["sectionItems"]>[number], "id"> & {
      id?: string;
    }
  >;
};

function migrateResumeData(data: ResumeForm): {
  data: ResumeForm;
  migrated: boolean;
} {
  const legacyData = data as unknown as Omit<ResumeForm, "workExperiences"> & {
    workExperiences?: LegacyWorkExperience[];
  };

  const hasLegacyDescription = Boolean(
    legacyData.workExperiences?.some(
      (experience) => "description" in experience,
    ),
  );
  const legacyCustomSections = (data.customSections ?? []) as unknown as LegacyCustomSection[];
  const hasMissingCustomIds = legacyCustomSections.some(
    (section) =>
      !section.id || section.sectionItems?.some((item) => !item.id),
  );

  if (!hasLegacyDescription && !hasMissingCustomIds) {
    return { data, migrated: false };
  }

  const workExperiences = hasLegacyDescription
    ? legacyData.workExperiences?.map((experience) => {
        const { description, ...rest } = experience;

        if (experience.descriptionBullets) {
          return rest;
        }

        return {
          ...rest,
          descriptionBullets: [
            {
              id: crypto.randomUUID(),
              text: description ?? EMPTY_LEXICAL_STATE,
            },
          ],
        };
      })
    : legacyData.workExperiences;

  return {
    data: {
      ...legacyData,
      workExperiences,
      customSections: legacyCustomSections.map((section) => ({
        ...section,
        id: section.id ?? crypto.randomUUID(),
        sectionItems: section.sectionItems?.map((item) => ({
          ...item,
          id: item.id ?? crypto.randomUUID(),
        })),
      })),
    } as ResumeForm,
    migrated: true,
  };
}

export async function loadAllResumes(): Promise<ResumeRecord[] | null> {
  const db = await getDB();
  const resumes = await db.getAll(STORE_NAME);
  const migratedResumes = resumes.map((resume) => {
    const resumeMigration = migrateResumeData(resume.data);

    return {
      ...resume,
      data: resumeMigration.data,
      needsMigration:
        resume.position == null || resumeMigration.migrated,
    };
  });

  const needsMigration = migratedResumes.some(
    (resume) => resume.needsMigration,
  );

  if (!needsMigration) {
    return resumes;
  }

  const migrated = migratedResumes.map(
    ({ needsMigration: _, ...resume }, index) => ({
      ...resume,
      position: resume.position ?? (index + 1) * 1000,
    }),
  );

  const transaction = db.transaction(STORE_NAME, "readwrite");
  await Promise.all(migrated.map((resume) => transaction.store.put(resume)));
  await transaction.done;

  return migrated;
}

export async function getLocalResume(
  resumeId: string,
): Promise<ResumeRecord | null> {
  await loadAllResumes();
  const db = await getDB();
  return (await db.get(STORE_NAME, resumeId)) || null;
}

export async function createLocalResume({
  resumeId,
  data,
  template,
}: {
  resumeId: string;
  data: ResumeRecord["data"];
  template: ResumeRecord["template"];
}) {
  const db = await getDB();
  const resumes = await db.getAll(STORE_NAME);
  const position =
    resumes.reduce((max, resume) => Math.max(max, resume.position ?? 0), 0) +
    1000;

  const record: ResumeRecord = {
    id: resumeId,
    updatedAt: Date.now(),
    position,
    data,
    media: {},
    template,
  };

  await db.put(STORE_NAME, record);

  return record;
}

export async function updateLocalFormData({
  resumeId,
  data,
}: {
  resumeId: string;
  data: Partial<ResumeRecord["data"]>;
}) {
  const db = await getDB();
  const current = await db.get(STORE_NAME, resumeId);

  if (!current) return;

  const updated: ResumeRecord = {
    ...current,
    updatedAt: Date.now(),
    data: {
      ...current.data,
      ...data,
    },
  };

  await db.put(STORE_NAME, updated);
}

export async function updateLocalMediaData({
  resumeId,
  data,
}: {
  resumeId: string;
  data?: LocalResumeAvatar;
}): Promise<ResumeRecord | undefined> {
  const db = await getDB();
  const current = await db.get(STORE_NAME, resumeId);

  if (!current) return;

  const updated: ResumeRecord = {
    ...current,
    updatedAt: Date.now(),
    media: {
      avatar: {
        ...data,
      },
    },
  };

  await db.put(STORE_NAME, updated);

  return updated;
}

export async function updateLocalResumeTemplate({
  resumeId,
  template,
}: {
  resumeId: string;
  template: ResumeRecord["template"];
}) {
  const db = await getDB();
  const current = await db.get(STORE_NAME, resumeId);

  if (!current) return;

  const updated: ResumeRecord = {
    ...current,
    updatedAt: Date.now(),
    template,
  };

  await db.put(STORE_NAME, updated);

  return updated;
}

export async function updateLocalResumeTitle({
  resumeId,
  title,
}: {
  resumeId: string;
  title: string;
}) {
  const db = await getDB();
  const current = await db.get(STORE_NAME, resumeId);

  if (!current) return;

  const updated: ResumeRecord = {
    ...current,
    updatedAt: Date.now(),
    data: {
      ...current.data,
      title,
    },
  };

  await db.put(STORE_NAME, updated);

  return updated;
}

export async function deleteLocalResume(resumeId: string) {
  const db = await getDB();
  await db.delete(STORE_NAME, resumeId);
}

export function useIndexedDBDebouncedUpdate(
  resumeId: string,
  data: ResumeRecord["data"],
  debounceMs: number = 3000,
) {
  // TODO: Figure out why I added skipNextSave here
  const skipNextSave = useRef(true);

  // TODO: add correct types
  const debouncedSave = useRef(
    debounce(
      (latestData: ResumeRecord["data"]) =>
        updateLocalFormData({ resumeId, data: latestData }),
      debounceMs,
    ),
  ).current;

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    debouncedSave(data);
  }, [data, resumeId, debouncedSave]);
}
