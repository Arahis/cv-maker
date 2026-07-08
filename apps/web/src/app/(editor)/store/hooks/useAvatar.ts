import { useAtom } from "jotai";
import { avatarCroppedAtom, avatarOriginalAtom } from "../atoms/avatarAtoms";
import { ResumeMedia } from "@/lib/validation";
import { useCallback } from "react";

const useAvatar = () => {
  const [original, setOriginal] = useAtom(avatarOriginalAtom);
  const [cropped, setCropped] = useAtom(avatarCroppedAtom);

  const setAvatarState = useCallback(
    (avatar?: ResumeMedia["avatar"] | null) => {
      setOriginal(avatar?.original ?? null);
      setCropped(avatar?.cropped ?? null);
    },
    [setOriginal, setCropped],
  );

  return { original, cropped, setAvatarState };
};

export default useAvatar;
