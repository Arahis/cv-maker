import {
  createResume,
  deleteResume,
  getResume,
  getResumeList,
  saveLocalResumeToAccount,
  updateResume,
} from "@/api/resumes";
import { deleteLocalResume, getLocalResume } from "@/lib/indexedDB";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { localResumeKeys } from "./localResumes";

export const accountResumeKeys = {
  all: ["account-resumes"] as const,
  list: ["account-resumes", "list"] as const,
  detail: (id: string) => ["account-resumes", "detail", id] as const,
};

export function useAccountResumesListQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: accountResumeKeys.list,
    queryFn: getResumeList,
    enabled: options?.enabled ?? true,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountResumeKeys.list });
    },
  });
}

export function useGetResume(options: { resumeId: string; enabled?: boolean }) {
  return useQuery({
    queryKey: accountResumeKeys.detail(options.resumeId),
    queryFn: () => getResume(options.resumeId),
    enabled: !!options.resumeId && (options.enabled ?? true),
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResume,
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: accountResumeKeys.list });
      queryClient.invalidateQueries({
        queryKey: accountResumeKeys.detail(input.resumeId),
      });
    },
  });
}

export function useUpdateAccountResumeTitleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resumeId,
      title,
    }: {
      resumeId: string;
      title: string;
    }) => {
      const resume = await getResume(resumeId);

      if (!resume) {
        throw new Error("Resume not found");
      }

      return updateResume({
        resumeId,
        input: {
          ...resume,
          data: { ...resume.data, title },
        },
      });
    },

    onSuccess: (_, { resumeId }) => {
      queryClient.invalidateQueries({ queryKey: accountResumeKeys.list });
      queryClient.invalidateQueries({
        queryKey: accountResumeKeys.detail(resumeId),
      });
    },
  });
}

export function useSaveLocalResumeToAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resumeId: string) => {
      const localResume = await getLocalResume(resumeId);

      if (!localResume) {
        throw new Error("Local resume not found");
      }

      const accountResume = await saveLocalResumeToAccount({
        localResumeId: localResume.id,
        data: localResume.data,
        media: localResume.media,
        template: localResume.template,
      });

      await deleteLocalResume(localResume.id);

      return accountResume;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: accountResumeKeys.list,
      });
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.list,
      });
    },
  });
}

export function useDeleteAccountResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: (_, resumeId) => {
      queryClient.invalidateQueries({ queryKey: accountResumeKeys.list });
      queryClient.invalidateQueries({
        queryKey: accountResumeKeys.detail(resumeId),
      });
    },
  });
}
