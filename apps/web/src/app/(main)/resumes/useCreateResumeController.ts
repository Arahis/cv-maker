import { useRouter } from "next/navigation";
import { defaultFormValues } from "@/lib/formDefaults";
import { useMeQuery } from "@/queries/auth";
import {
  useCreateResume,
  useUploadExistingResumeToAccount,
} from "@/queries/resumes/accountResumes";
import {
  useCreateLocalResumeMutation,
  useUploadExistingResumeLocal,
} from "@/queries/resumes/localResumes";
import { ResumeTemplateKey } from "@/components/templates/components";
import { useAuthBootstrap } from "@/providers/auth-bootstrap";
import { getVisitorFingerprint } from "@/lib/thumbmark";
import { useClaimAnonymousResumeMutation } from "@/queries/resumes/anonymousResumes";

export type CreateResumeController = {
  createResumeFromUploaded: (file: File) => Promise<void>;
  createResume: (template?: ResumeTemplateKey) => Promise<void>;
  isUploadedLoading: boolean;
  isLoading: boolean;
};

export function useCreateResumeController(): CreateResumeController {
  const router = useRouter();
  const isAuthReady = useAuthBootstrap();
  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const createAccountResumeMutation = useCreateResume();
  const createLocalResumeMutation = useCreateLocalResumeMutation();
  const uploadExistingResumeToAccount = useUploadExistingResumeToAccount();
  const uploadExistingResumeLocal = useUploadExistingResumeLocal();
  const claimAnonymousResumeMutation = useClaimAnonymousResumeMutation();

  async function claimGuestResumeQuota(localResumeId: string) {
    let fingerprint: string | null = null;

    try {
      fingerprint = await getVisitorFingerprint();
    } catch (error) {
      console.warn("Could not generate a visitor fingerprint", error);
    }

    await claimAnonymousResumeMutation.mutateAsync({
      localResumeId,
      fingerprint,
    });
  }

  async function createResume(template: ResumeTemplateKey = "template1") {
    const data = defaultFormValues();

    if (me) {
      const accountResume = await createAccountResumeMutation.mutateAsync({
        template,
        data,
        media: {},
      });

      router.push(`/resume-editor?id=${encodeURIComponent(accountResume.id)}`);
      return;
    }

    const resumeId = crypto.randomUUID();

    await claimGuestResumeQuota(resumeId);

    await createLocalResumeMutation.mutateAsync({
      resumeId,
      data,
      template,
    });

    router.push(`/resume-editor?id=${encodeURIComponent(resumeId)}`);
  }

  async function createResumeFromUploaded(file: File) {
    if (me) {
      const accountResume =
        await uploadExistingResumeToAccount.mutateAsync(file);

      router.push(`/resume-editor?id=${encodeURIComponent(accountResume.id)}`);
      return;
    }

    const resumeId = crypto.randomUUID();

    await uploadExistingResumeLocal.mutateAsync({
      resumeId,
      file,
      reserveQuota: () => claimGuestResumeQuota(resumeId),
    });

    router.push(`/resume-editor?id=${encodeURIComponent(resumeId)}`);
  }

  return {
    createResumeFromUploaded,
    createResume,
    isUploadedLoading:
      !isAuthReady ||
      isMeLoading ||
      uploadExistingResumeToAccount.isPending ||
      uploadExistingResumeLocal.isPending ||
      claimAnonymousResumeMutation.isPending,
    isLoading:
      !isAuthReady ||
      isMeLoading ||
      createAccountResumeMutation.isPending ||
      createLocalResumeMutation.isPending ||
      claimAnonymousResumeMutation.isPending,
  };
}
