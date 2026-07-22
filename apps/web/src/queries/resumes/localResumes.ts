import {
  createLocalResume,
  copyLocalResume,
  deleteLocalResume,
  getLocalResume,
  loadAllResumes,
  updateLocalMediaData,
  updateLocalResumeTemplate,
  updateLocalResumeTitle,
} from "@/lib/indexedDB";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const localResumeKeys = {
  all: ["local-resumes"] as const,
  list: ["local-resumes", "list"] as const,
  detail: (id: string) => ["local-resumes", "detail", id] as const,
};

export function useLocalResumeListQuery() {
  return useQuery({
    queryKey: localResumeKeys.list,
    queryFn: async () => {
      const resumes = await loadAllResumes();

      return resumes ?? [];
    },
  });
}

export function useLocalResumeQuery(resumeId: string) {
  return useQuery({
    queryKey: localResumeKeys.detail(resumeId),
    queryFn: () => getLocalResume(resumeId),
    enabled: Boolean(resumeId),
  });
}

export function useCreateLocalResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLocalResume,

    onSuccess: async (data) => {
      queryClient.setQueryData(localResumeKeys.detail(data.id), data);
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.all,
      });
    },
  });
}

export function useCopyLocalResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: copyLocalResume,

    onSuccess: async (data) => {
      queryClient.setQueryData(localResumeKeys.detail(data.id), data);
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.all,
      });
    },
  });
}

export function useUpdateLocalResumeTitleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLocalResumeTitle,

    onSuccess: async (_, { resumeId }) => {
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.detail(resumeId),
      });
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.all,
      });
    },
  });
}

export function useUpdateLocalResumeTemplateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocalResumeTemplate,
    onSuccess: async (_, { resumeId }) => {
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.detail(resumeId),
      });
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.all,
      });
    },
  });
}

export function useUpdateLocalResumeMediaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocalMediaData,
    onSuccess: async (_, { resumeId }) => {
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.detail(resumeId),
      });
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.all,
      });
    },
  });
}

export function useDeleteLocalResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLocalResume,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: localResumeKeys.all,
      });
    },
  });
}
