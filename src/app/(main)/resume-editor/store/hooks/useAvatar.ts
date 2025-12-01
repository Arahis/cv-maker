import { useAtom } from "jotai";
import { avatarCroppedAtom, avatarOriginalAtom } from "../atoms/avatarAtoms";
import { loadResume, saveMediaData } from "@/lib/indexedDB";
import { Avatar } from "../types";
import { useCallback, useEffect } from "react";

const useAvatar = (resumeId: string) => {
  const [original, setOriginal] = useAtom(avatarOriginalAtom);
  const [cropped, setCropped] = useAtom(avatarCroppedAtom);

  const loadAvatar = useCallback(async () => {
    const resume = await loadResume(resumeId);

    if (!resume) return;

    const media = resume.media?.avatar;
    if (media?.original) {
      setOriginal(media.original);
    }

    if (media?.cropped) {
      setCropped(media.cropped);
    }
  }, [resumeId, setCropped, setOriginal]);

  const setAvatarMedia = async ({
    original,
    cropped,
  }: {
    original: Avatar;
    cropped: Avatar;
  }) => {
    setOriginal(original);
    setCropped(cropped);

    console.log({
      original,
      cropped,
    });

    await saveMediaData(resumeId, {
      original,
      cropped,
    });
  };

  useEffect(() => {
    loadAvatar();
  }, [loadAvatar]);

  return { original, cropped, setAvatarMedia };
};

export default useAvatar;
