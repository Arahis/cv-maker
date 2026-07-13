"use client";

import { ResumeMedia, ResumeForm } from "@cv-maker/shared";
import { getAccessToken } from "@/api/token";
import { Source } from "@/api/resumes";
import { ResumeTemplateKey } from "@/components/templates/components";
import { debounce } from "@/lib/debounce";
import { updateLocalFormData } from "@/lib/indexedDB";
import type { LocalResumeMedia } from "@/lib/indexedDB";
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
  const isAccessTokenActive = () => Boolean(getAccessToken());

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
      if (!isAccessTokenActive()) {
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

    if (!isAccessTokenActive()) {
      return;
    }

    await updateAccountResumeTemplate({
      resumeId,
      template,
    });
  };

  const saveMedia = async (media: ResumeMedia | LocalResumeMedia) => {
    if (!source) {
      return;
    }

    if (source === "local") {
      await updateLocalResumeMedia({
        resumeId,
        data: toLocalResumeAvatar(media),
      });
      return;
    }

    if (!isAccessTokenActive()) {
      return;
    }

    await updateAccountResumeMedia({
      resumeId,
      media: toAccountResumeMedia(media),
    });
  };

  return {
    saveFormData,
    saveTemplate,
    saveMedia,
  };
}

function toLocalResumeAvatar(
  media: ResumeMedia | LocalResumeMedia,
): LocalResumeMedia["avatar"] {
  if (!media.avatar) {
    return undefined;
  }

  if ("croppedBlob" in media.avatar) {
    return media.avatar;
  }

  throw new Error("Expected local avatar blob");
}

function toAccountResumeMedia(
  media: ResumeMedia | LocalResumeMedia,
): ResumeMedia {
  if (!media.avatar) {
    return {};
  }

  if ("croppedBlob" in media.avatar) {
    throw new Error("Expected uploaded avatar");
  }

  return {
    avatar: media.avatar,
  };
}
