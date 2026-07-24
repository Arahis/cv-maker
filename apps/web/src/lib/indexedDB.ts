import { openDB } from "idb";
import { useEffect, useRef } from "react";
import { debounce } from "./debounce";
import { ResumeForm } from "./validation";
import { ResumeTemplateKey } from "@/components/templates/components";

const DB_NAME = "Resume";
const STORE_NAME = "resumes";

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
  return openDB(DB_NAME, 2, {
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
    },
  });
}

export async function loadAllResumes(): Promise<ResumeRecord[] | null> {
  const db = await getDB();
  const resumes = await db.getAll(STORE_NAME);
  const needsMigration = resumes.some((resume) => resume.position == null);

  if (!needsMigration) {
    return resumes;
  }

  const migrated = resumes.map((resume, index) => ({
    ...resume,
    position: resume.position ?? (index + 1) * 1000,
  }));

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

export async function copyLocalResume(resumeId: string) {
  const db = await getDB();
  const current = await db.get(STORE_NAME, resumeId);

  if (!current) {
    throw new Error("Local resume not found");
  }

  const resumes = await db.getAll(STORE_NAME);
  const orderedResumes = resumes.sort((a, b) => a.position - b.position);
  const nextResume = orderedResumes.find(
    (resume) => resume.position > current.position,
  );
  let position = nextResume
    ? Math.floor((current.position + nextResume.position) / 2)
    : current.position + 1000;
  const transaction = db.transaction(STORE_NAME, "readwrite");

  if (nextResume && position <= current.position) {
    await Promise.all(
      orderedResumes.map((resume, index) => {
        const normalizedPosition = (index + 1) * 1000;

        if (resume.id === current.id) {
          position = normalizedPosition + 500;
        }

        return transaction.store.put({
          ...resume,
          position: normalizedPosition,
        });
      }),
    );
  }

  const copy: ResumeRecord = {
    ...current,
    id: crypto.randomUUID(),
    updatedAt: Date.now(),
    position,
    data: {
      ...current.data,
      title: current.data.title
        ? `${current.data.title} (Copy)`
        : "Untitled (Copy)",
    },
  };

  await transaction.store.put(copy);
  await transaction.done;

  return copy;
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
