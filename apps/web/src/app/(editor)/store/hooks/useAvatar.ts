import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { avatarCroppedAtom } from "../atoms/avatarAtoms";
import type { ResumeMedia } from "@/lib/validation";
import type { LocalResumeAvatar } from "@/lib/indexedDB";

const useAvatar = () => {
  const [cropped, setCropped] = useAtom(avatarCroppedAtom);
  /*
  This state (croppedPreviewUrl) is used to store the temporary preview URL
  of the cropped avatar image when it is a Blob.
  This is necessary because Blobs cannot be directly used as image sources in the DOM,
  so we create an object URL for preview purposes.
  Still can return not only the cropped Blob but also the URL string of the cropped avatar image
  when it is a URL.
  */
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!cropped) {
      setCroppedPreviewUrl(null);
      return;
    }

    if (typeof cropped === "string") {
      setCroppedPreviewUrl(cropped);
      return;
    }

    const objectUrl = URL.createObjectURL(cropped);
    setCroppedPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [cropped]);

  const setAvatarState = useCallback(
    (avatar?: ResumeMedia["avatar"] | LocalResumeAvatar | null) => {
      if (!avatar) {
        setCropped(null);
        return;
      }

      // Check if Avatar is LocalResumeAvatar
      if ("croppedBlob" in avatar) {
        setCropped(avatar.croppedBlob);
        return;
      }
      // Rest is the Avatar from the API, which is a URL string
      setCropped(avatar.croppedUrl);
    },
    [setCropped],
  );

  /*
  cropped: The cropped avatar image, which can be either a Blob (for local images) or a string (for images from the API).
  croppedPreviewUrl: A string URL that can be used to preview the cropped avatar image in the DOM. This is either an object URL created from a Blob or the original URL string from the API.
  setAvatarState: A function to update the avatar state, which accepts either a ResumeMedia["avatar"] (from the API) or a LocalResumeAvatar (for local images).
  It handles both cases and updates the cropped state accordingly.
  */
  return useMemo(
    () => ({
      cropped,
      croppedPreviewUrl,
      setAvatarState,
    }),
    [cropped, croppedPreviewUrl, setAvatarState],
  );
};

export default useAvatar;
