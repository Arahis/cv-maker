import { openDB } from "idb";
import { useEffect, useRef } from "react";
import { debounce } from "./debounce";
import { ResumeForm } from "./validation";

const DB_NAME = "Resume";
const STORE_NAME = "resumes";

interface ResumeRecord {
  id: string;
  updatedAt: number; // ??????

  data: ResumeForm;

  media: {
    avatar?: {
      original?: {
        base64: string;
        width: number;
        height: number;
      };
      cropped?: {
        base64: string;
        width: number;
        height: number;
      };
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

export async function loadResume(
  resumeId: string,
): Promise<ResumeRecord | null> {
  const db = await getDB();
  return await db.get(STORE_NAME, resumeId);
}

export async function createResume(
  resumeId: string,
  data: ResumeRecord["data"],
) {
  const db = await getDB();

  const record: ResumeRecord = {
    id: resumeId,
    updatedAt: Date.now(),
    data,
    media: {},
  };
  await db.put(STORE_NAME, record);
}

export async function saveFormData(
  resumeId: string,
  data: Partial<ResumeRecord["data"]>,
) {
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

  console.log({ updated });

  await db.put(STORE_NAME, updated);
}

export async function saveMediaData(
  resumeId: string,
  data: Partial<ResumeRecord["media"]>,
) {
  const db = await getDB();
  const current = await db.get(STORE_NAME, resumeId);

  if (!current) return;

  const updated: ResumeRecord = {
    ...current,
    updatedAt: Date.now(),
    media: {
      ...current.media,
      ...data,
    },
  };

  await db.put(STORE_NAME, updated);
}

export async function deleteResume(resumeId: string) {
  const db = await getDB();
  await db.delete(STORE_NAME, resumeId);
}

export function useIndexedDBDebouncedSave(
  resumeID: string,
  data: ResumeRecord["data"],
  debounceMs: number = 3000,
) {
  // TODO: Figure out why I added skipNextSave here
  const skipNextSave = useRef(true);

  // TODO: add correct types
  const debouncedSave = useRef(
    debounce((latestData) => saveFormData(resumeID, latestData), debounceMs),
  ).current;

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    debouncedSave(data);
  }, [data, resumeID, debouncedSave]);
}
