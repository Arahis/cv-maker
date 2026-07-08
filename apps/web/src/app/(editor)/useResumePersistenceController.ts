"use client";

import { ResumeMedia, ResumeForm } from "@cv-maker/shared";
import { getAccessToken } from "@/api/token";
import { Source } from "@/api/resumes";
import { ResumeTemplateKey } from "@/components/templates/components";
import { debounce } from "@/lib/debounce";
import { updateLocalFormData } from "@/lib/indexedDB";
import {
  useUpdateResume,
  useUpdateResumeMedia,
  useUpdateResumeTemplate,
} from "@/queries/resumes/accountResumes";
import {
  useUpdateLocalResumeMediaMutation,
  useUpdateLocalResumeTemplateMutation,
} from "@/queries/resumes/localResumes";
import { useEffect, useRef } from "react";

export function useResumePersistenceController({
  resumeId,
  source,
  data,
  debounceMs = 2000,
}: {
  resumeId: string;
  source: Source | null;
  data?: ResumeForm;
  debounceMs?: number;
}) {
  const skipNextSave = useRef(true);
  const { mutateAsync: updateAccountResume } = useUpdateResume();
  const { mutateAsync: updateAccountResumeMedia } = useUpdateResumeMedia();
  const { mutateAsync: updateAccountResumeTemplate } =
    useUpdateResumeTemplate();
  const { mutateAsync: updateLocalResumeTemplate } =
    useUpdateLocalResumeTemplateMutation();
  const { mutateAsync: updateLocalResumeMedia } =
    useUpdateLocalResumeMediaMutation();
  const canSaveToAccount = () => Boolean(getAccessToken());

  const debouncedLocalFormSave = useRef(
    debounce((latestData: ResumeForm) => {
      void updateLocalFormData({
        resumeId,
        data: latestData,
      });
    }, debounceMs),
  ).current;

  const debouncedAccountFormSave = useRef(
    debounce((latestData: ResumeForm) => {
      if (!canSaveToAccount()) {
        return;
      }

      void updateAccountResume({
        resumeId,
        input: {
          data: latestData,
        },
      });
    }, debounceMs),
  ).current;

  const saveFormData = (data: ResumeForm) => {
    if (!source) {
      return;
    }

    if (source === "local") {
      debouncedLocalFormSave(data);
      return;
    }

    debouncedAccountFormSave(data);
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    saveFormData(data);
  }, [data, source]);

  const saveTemplate = async (template: ResumeTemplateKey) => {
    if (!source) {
      return;
    }

    if (source === "local") {
      await updateLocalResumeTemplate({
        resumeId,
        template,
      });
      return;
    }

    if (!canSaveToAccount()) {
      return;
    }

    await updateAccountResumeTemplate({
      resumeId,
      template,
    });
  };

  const saveMedia = async (media: ResumeMedia) => {
    if (!source) {
      return;
    }

    if (source === "local") {
      await updateLocalResumeMedia({
        resumeId,
        data: media.avatar,
      });
      return;
    }

    if (!canSaveToAccount()) {
      return;
    }

    await updateAccountResumeMedia({
      resumeId,
      media,
    });
  };

  return {
    saveFormData,
    saveTemplate,
    saveMedia,
  };
}
