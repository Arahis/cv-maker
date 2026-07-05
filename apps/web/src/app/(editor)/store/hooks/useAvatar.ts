import { useAtom } from "jotai";
import { avatarCroppedAtom, avatarOriginalAtom } from "../atoms/avatarAtoms";
import { Avatar } from "../types";
import { useEffect } from "react";
import {
  useLocalResumeQuery,
  useUpdateLocalResumeMediaMutation,
} from "@/queries/resumes/localResumes";

const useAvatar = (resumeId: string) => {
  const [original, setOriginal] = useAtom(avatarOriginalAtom);
  const [cropped, setCropped] = useAtom(avatarCroppedAtom);
  const { data: resume } = useLocalResumeQuery(resumeId);
  const { mutateAsync: updateLocalResumeMedia } =
    useUpdateLocalResumeMediaMutation();

  const setAvatarMedia = async ({
    original,
    cropped,
  }: {
    original: Avatar;
    cropped: Avatar;
  }) => {
    setOriginal(original);
    setCropped(cropped);

    await updateLocalResumeMedia({
      resumeId,
      data: {
        original,
        cropped,
      },
    });
  };

  useEffect(() => {
    if (!resume) return;

    const media = resume.media?.avatar;
    if (media?.original) {
      setOriginal(media.original);
    }

    if (media?.cropped) {
      setCropped(media.cropped);
    }
  }, [resume, setOriginal, setCropped]);

  return { original, cropped, setAvatarMedia };
};

export default useAvatar;
