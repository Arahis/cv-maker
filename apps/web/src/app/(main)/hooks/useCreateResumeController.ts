import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultFormValues } from "@/lib/formDefaults";
import { useMeQuery } from "@/queries/auth";
import {
  useCreateResume,
  useUploadExistingResumeToAccount,
} from "@/queries/resumes/accountResumes";
import {
  useCreateLocalResumeMutation,
  useLocalResumeListQuery,
  useUploadExistingResumeLocal,
} from "@/queries/resumes/localResumes";
import { ResumeTemplateKey } from "@/components/templates/components";
import { useAuthBootstrap } from "@/providers/auth-bootstrap";
import { checkPdfParseLimit } from "@/api/uploads";
import { getVisitorFingerprint } from "@/lib/thumbmark";
import {
  useCheckAnonymousResumeQuotaMutation,
  useClaimAnonymousResumeMutation,
} from "@/queries/resumes/anonymousResumes";

export type CreateResumeController = {
  createResumeFromUploaded: (file: File) => Promise<void>;
  createResume: (template?: ResumeTemplateKey) => Promise<void>;
  checkGuestResumeQuota: () => Promise<boolean>;
  checkPdfParseLimit: () => Promise<boolean>;
  hasGuestLocalResumes: () => boolean;
  isLoading: boolean;
  isProcessing: boolean;
};

export function useCreateResumeController(): CreateResumeController {
  const router = useRouter();
  // Shows a fullscreen loader while a resume is being created or imported.
  const [isProcessing, setIsProcessing] = useState(false);
  const isAuthReady = useAuthBootstrap();
  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const createAccountResumeMutation = useCreateResume();
  const createLocalResumeMutation = useCreateLocalResumeMutation();
  const uploadExistingResumeToAccount = useUploadExistingResumeToAccount();
  const uploadExistingResumeLocal = useUploadExistingResumeLocal();
  const claimAnonymousResumeMutation = useClaimAnonymousResumeMutation();
  const checkAnonymousResumeQuotaMutation =
    useCheckAnonymousResumeQuotaMutation();
  const localResumesQuery = useLocalResumeListQuery();

  async function getGuestResumeFingerprint() {
    let fingerprint: string | null = null;

    try {
      fingerprint = await getVisitorFingerprint();
    } catch (error) {
      console.warn("Could not generate a visitor fingerprint", error);
    }

    return fingerprint;
  }

  async function checkGuestResumeQuota() {
    // `useMeQuery` starts only after the refresh-token bootstrap has finished.
    // Do not treat an authenticated user as a guest in the gap before then.
    if (!isAuthReady || isMeLoading) {
      return false;
    }

    if (me) {
      return false;
    }

    const { hasEverUploaded } =
      await checkAnonymousResumeQuotaMutation.mutateAsync({
        fingerprint: await getGuestResumeFingerprint(),
      });

    return hasEverUploaded;
  }

  async function checkAccountPdfParseLimit() {
    if (!isAuthReady || isMeLoading) {
      return false;
    }

    if (!me) {
      return true;
    }

    await checkPdfParseLimit();
    return true;
  }

  function hasGuestLocalResumes() {
    return Boolean(
      isAuthReady &&
        !isMeLoading &&
        !me &&
        !localResumesQuery.isLoading &&
        (localResumesQuery.data?.length ?? 0) > 0,
    );
  }

  // Create Record for an unauthenticated visitor that has created his one allowed resume.
  async function claimGuestResumeQuota(localResumeId: string) {
    await claimAnonymousResumeMutation.mutateAsync({
      localResumeId,
      fingerprint: await getGuestResumeFingerprint(),
    });
  }

  async function createResume(template: ResumeTemplateKey = "template1") {
    if (!isAuthReady || isMeLoading) {
      return;
    }

    setIsProcessing(true);

    // Keep the loader visible after navigation starts. If an error occurs before
    // navigation, isNavigating remains false and finally hides the loader.
    let isNavigating = false;

    try {
      const data = defaultFormValues();

      if (me) {
        const accountResume = await createAccountResumeMutation.mutateAsync({
          template,
          data,
          media: {},
        });

        router.push(
          `/resume-editor?id=${encodeURIComponent(accountResume.id)}`,
        );
        isNavigating = true;
        return;
      }

      const resumeId = crypto.randomUUID();

      await createLocalResumeMutation.mutateAsync({
        resumeId,
        data,
        template,
      });

      router.push(`/resume-editor?id=${encodeURIComponent(resumeId)}`);
      isNavigating = true;
    } finally {
      if (!isNavigating) {
        setIsProcessing(false);
      }
    }
  }

  async function createResumeFromUploaded(file: File) {
    if (!isAuthReady || isMeLoading) {
      return;
    }

    setIsProcessing(true);
    let isNavigating = false;

    try {
      if (me) {
        const accountResume =
          await uploadExistingResumeToAccount.mutateAsync(file);

        router.push(
          `/resume-editor?id=${encodeURIComponent(accountResume.id)}`,
        );
        isNavigating = true;
        return;
      }

      const resumeId = crypto.randomUUID();

      await uploadExistingResumeLocal.mutateAsync({
        resumeId,
        file,
        reserveQuota: () => claimGuestResumeQuota(resumeId),
      });

      router.push(`/resume-editor?id=${encodeURIComponent(resumeId)}`);
      isNavigating = true;
    } finally {
      if (!isNavigating) {
        setIsProcessing(false);
      }
    }
  }

  return {
    createResumeFromUploaded,
    createResume,
    checkGuestResumeQuota,
    checkPdfParseLimit: checkAccountPdfParseLimit,
    hasGuestLocalResumes,
    isProcessing,
    isLoading:
      isProcessing ||
      localResumesQuery.isLoading ||
      createAccountResumeMutation.isPending ||
      createLocalResumeMutation.isPending ||
      claimAnonymousResumeMutation.isPending ||
      checkAnonymousResumeQuotaMutation.isPending ||
      uploadExistingResumeToAccount.isPending ||
      uploadExistingResumeLocal.isPending,
  };
}
