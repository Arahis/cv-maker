import { openDB } from "idb";
import { useEffect, useRef, useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { debounce } from "./debounce";

const DB_NAME = "Resume";
const STORE_NAME = "resumes";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveFormData<T = any>(formKey: string, data: T) {
  const db = await getDB();
  await db.put(STORE_NAME, data, formKey);
}

export async function loadFormData(formKey: string) {
  const db = await getDB();
  return await db.get(STORE_NAME, formKey);
}

//  мне нужно сохранять данные формы в IndexedDB, запуск сохранения должен происходить спустя пару секунд после изменения данных формы
// Вопрос как это отслеживать в React Hook Form

interface UseIndexedDBDebouncedSaveProps {
  control: Control<any>;
  formKey: string;
  onLoad?: (data: any) => void; // Optional callback to run after loading data
  debounceMs?: number;
}

export function useIndexedDBDebouncedSave(
  control: Control<any>,
  formKey: string,
  debounceMs: number = 3000,
) {
  const skipNextSave = useRef(true);
  const formData = useWatch({ control });

  const debouncedSave = useRef(
    debounce((content: any) => saveFormData(formKey, { content }), debounceMs),
  ).current;

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    debouncedSave(formData);
  }, [formData, formKey, debouncedSave]);
}
