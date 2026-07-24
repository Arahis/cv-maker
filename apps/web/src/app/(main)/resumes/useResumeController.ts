import { Resume, Source } from "@/api/resumes";
import { useMeQuery } from "@/queries/auth";
import {
  useAccountResumesListQuery,
  useCopyAccountResumeMutation,
  useDeleteAccountResumeMutation,
  useSaveLocalResumeToAccountMutation,
  useUpdateAccountResumeTitleMutation,
} from "@/queries/resumes/accountResumes";
import {
  useDeleteLocalResumeMutation,
  useLocalResumeListQuery,
  useUpdateLocalResumeTitleMutation,
} from "@/queries/resumes/localResumes";
import { useRouter } from "next/navigation";
import { useAuthBootstrap } from "@/providers/auth-bootstrap";
import { useState } from "react";

export type ResumeController = {
  resumes: ResumeListItem[];
  isLoading: boolean;
  openResume: (args: { resumeId: string; source: Source }) => void;
  copyResume: (args: { resumeId: string; source: Source }) => Promise<void>;
  deleteResume: (args: { resumeId: string; source: Source }) => void;
  renameResume: (args: {
    resumeId: string;
    source: Source;
    title: string;
  }) => void;
  saveLocalResumeToAccount: (resumeId: string) => Promise<Resume>;
};

export type ResumeListItem = Resume & {
  isCopying: boolean;
  isDeleting: boolean;
};

export function useResumeController() {
  const router = useRouter();
  const isAuthReady = useAuthBootstrap();
  const [copyingResumeId, setCopyingResumeId] = useState<string | null>(null);
  const [deletingResumeId, setDeletingResumeId] = useState<string | null>(null);

  const { data: me, isLoading: isMeLoading } = useMeQuery();

  const localResumesQuery = useLocalResumeListQuery();

  const { data: accountResumesData, isLoading } = useAccountResumesListQuery({
    enabled: !!me,
  });

  const saveLocalToAccountMutation = useSaveLocalResumeToAccountMutation();
  const deleteAccountResumeMutation = useDeleteAccountResumeMutation();
  const deleteLocalResumeMutation = useDeleteLocalResumeMutation();
  const updateLocalResumeTitleMutation = useUpdateLocalResumeTitleMutation();
  const updateAccountResumeTitleMutation =
    useUpdateAccountResumeTitleMutation();
  const copyAccountResumeMutation = useCopyAccountResumeMutation();

  const localResumes: ResumeListItem[] =
    localResumesQuery.data?.map((resume) => ({
      ...resume,
      source: "local",
      isCopying: copyingResumeId === resume.id,
      isDeleting: deletingResumeId === resume.id,
    })) ?? [];

  const accountResumes: ResumeListItem[] =
    accountResumesData?.map((resume) => ({
      ...resume,
      source: "account",
      isCopying: copyingResumeId === resume.id,
      isDeleting: deletingResumeId === resume.id,
    })) ?? [];

  const resumes = me ? [...accountResumes, ...localResumes] : localResumes;

  async function openResume({
    resumeId,
    source,
  }: {
    resumeId: string;
    source: "local" | "account";
  }) {
    if (source === "account" || !me) {
      router.push(`/resume-editor?id=${encodeURIComponent(resumeId)}`);
      return;
    }

    // If the resume is local and the user is logged in, save it to the account and then open it
    const accountResume = await saveLocalResumeToAccount(resumeId);
    router.push(`/resume-editor?id=${encodeURIComponent(accountResume.id)}`);
  }

  async function copyResume({
    resumeId,
    source,
  }: {
    resumeId: string;
    source: "local" | "account";
  }) {
    if (source !== "account") {
      return;
    }

    setCopyingResumeId(resumeId);

    try {
      await copyAccountResumeMutation.mutateAsync(resumeId);
    } finally {
      setCopyingResumeId(null);
    }
  }

  async function saveLocalResumeToAccount(resumeId: string) {
    const { mutateAsync } = saveLocalToAccountMutation;
    const accountResume = await mutateAsync(resumeId);

    return accountResume;
  }

  async function deleteResume({
    resumeId,
    source,
  }: {
    resumeId: string;
    source: "local" | "account";
  }) {
    setDeletingResumeId(resumeId);

    try {
      if (source === "local") {
        const { mutateAsync } = deleteLocalResumeMutation;
        await mutateAsync(resumeId);
        return;
      }

      const { mutateAsync } = deleteAccountResumeMutation;
      await mutateAsync(resumeId);
    } finally {
      setDeletingResumeId(null);
    }
  }

  async function renameResume({
    resumeId,
    source,
    title,
  }: {
    resumeId: string;
    source: "local" | "account";
    title: string;
  }) {
    if (source === "local") {
      await updateLocalResumeTitleMutation.mutateAsync({ resumeId, title });
      return;
    }

    await updateAccountResumeTitleMutation.mutateAsync({
      resumeId,
      title,
    });
  }

  return {
    resumes,
    isLoading:
      !isAuthReady ||
      isMeLoading ||
      localResumesQuery.isLoading ||
      (!!me && isLoading),

    openResume,
    copyResume,
    deleteResume,
    renameResume,
    saveLocalResumeToAccount,
  };
}
