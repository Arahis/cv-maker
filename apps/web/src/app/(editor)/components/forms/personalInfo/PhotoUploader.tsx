import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useState } from "react";
import PhotoUploadModal from "./PhotoUploadModal";
import useAvatar from "../../../store/hooks/useAvatar";
import { useResumeEditor } from "../../../context/ResumeEditorContext";
import { uploadAvatar } from "@/api/uploads";

const PhotoUploader = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { saveMedia, source } = useResumeEditor();

  const { cropped, croppedPreviewUrl, setAvatarState } = useAvatar();

  const handleOnChange = async (croppedPhoto: Blob | null) => {
    if (!croppedPhoto) {
      setAvatarState(null);
      await saveMedia({});
      return;
    }

    if (source === "account") {
      const avatar = (
        await uploadAvatar({
          croppedFile: croppedPhoto,
        })
      ).avatar;

      setAvatarState(avatar);
      await saveMedia({ avatar });
      return;
    }

    const avatar = {
      croppedBlob: croppedPhoto,
    };

    setAvatarState(avatar);
    await saveMedia({ avatar });
  };

  return (
    <>
      <Button
        className="h-24 w-24 bg-gray-200 bg-cover bg-center"
        style={{
          backgroundImage: croppedPreviewUrl
            ? `url(${croppedPreviewUrl})`
            : undefined,
        }}
        onClick={() => setModalOpen(true)}
      >
        {!croppedPreviewUrl && <Camera className="size-6" />}
      </Button>

      <PhotoUploadModal
        currentPhoto={cropped}
        open={modalOpen}
        onModalChange={setModalOpen}
        onChange={handleOnChange}
      />
    </>
  );
};

export default PhotoUploader;
