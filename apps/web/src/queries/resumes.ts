import {
  createResume,
  deleteResume,
  getResume,
  getResumeList,
  updateResume,
} from "@/api/resumes";
import { ResumeForm, ResumeMedia } from "@cv-maker/shared";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type CreateResumeInput = {
  template: string;
  data: ResumeForm;
  media: ResumeMedia;
};

export function useGetResumeList() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: getResumeList,
  });
}

export function useCreateResume(input: CreateResumeInput) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createResume(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

export function useGetResume(id: string) {
  return useQuery({
    queryKey: ["resumes", id],
    queryFn: () => getResume(id),
  });
}

export function useUpdateResume(id: string, input: CreateResumeInput) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateResume(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
    },
  });
}

export function useDeleteResume(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["resumes", id] });
    },
  });
}
