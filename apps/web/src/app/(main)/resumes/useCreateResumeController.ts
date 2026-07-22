import { useRouter } from "next/navigation";
import { defaultFormValues } from "@/lib/formDefaults";
import { useMeQuery } from "@/queries/auth";
import { useCreateResume } from "@/queries/resumes/accountResumes";
import { useCreateLocalResumeMutation } from "@/queries/resumes/localResumes";
import { ResumeTemplateKey } from "@/components/templates/components";
import { useAuthBootstrap } from "@/providers/auth-bootstrap";

export type CreateResumeController = {
  createResume: (template?: ResumeTemplateKey) => Promise<void>;
  isLoading: boolean;
};

export function useCreateResumeController(): CreateResumeController {
  const router = useRouter();
  const isAuthReady = useAuthBootstrap();
  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const createAccountResumeMutation = useCreateResume();
  const createLocalResumeMutation = useCreateLocalResumeMutation();

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

    await createLocalResumeMutation.mutateAsync({
      resumeId,
      data,
      template,
    });

    router.push(`/resume-editor?id=${encodeURIComponent(resumeId)}`);
  }

  return {
    createResume,
    isLoading:
      !isAuthReady ||
      isMeLoading ||
      createAccountResumeMutation.isPending ||
      createLocalResumeMutation.isPending,
  };
}
