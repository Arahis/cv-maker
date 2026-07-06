import { openDB } from "idb";
import { useEffect, useRef } from "react";
import { debounce } from "./debounce";
import { ResumeForm } from "./validation";
import { ResumeTemplateKey } from "@/components/templates/components";

const DB_NAME = "Resume";
const STORE_NAME = "resumes";

export interface ResumeRecord {
  id: string;
  updatedAt: number;

  data: ResumeForm;
  template: ResumeTemplateKey;

  media: {
    avatar?: {
      original?: string;
      cropped?: string;
    };
  };
}

// Initialize IndexedDB
async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }
    },
  });
}

export async function loadAllResumes(): Promise<ResumeRecord[] | null> {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function getLocalResume(
  resumeId: string,
): Promise<ResumeRecord | null> {
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

  const record: ResumeRecord = {
    id: resumeId,
    updatedAt: Date.now(),
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
  data: ResumeRecord["media"]["avatar"];
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
