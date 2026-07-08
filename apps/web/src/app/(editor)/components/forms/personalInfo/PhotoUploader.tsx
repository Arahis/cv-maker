import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useState } from "react";
import PhotoUploadModal from "./PhotoUploadModal";
import useAvatar from "../../../store/hooks/useAvatar";
import { useResumeEditor } from "../../../context/ResumeEditorContext";
import { AvatarCropDataForm } from "@/lib/validation";

const PhotoUploader = ({
  value,
  onChange,
}: {
  value: AvatarCropDataForm;
  onChange: (v: AvatarCropDataForm) => void;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { saveMedia } = useResumeEditor();

  const { cropped, original, setAvatarState } = useAvatar();

  const handleOnChange = async (
    originalPhoto: string,
    croppedPhoto: string,
    cropData: AvatarCropDataForm,
  ) => {
    setAvatarState({
      original: originalPhoto || undefined,
      cropped: croppedPhoto || undefined,
    });

    await saveMedia({
      avatar:
        originalPhoto || croppedPhoto
          ? {
              original: originalPhoto || undefined,
              cropped: croppedPhoto || undefined,
            }
          : undefined,
    });

    onChange(cropData);
  };

  return (
    <>
      <Button
        className="h-24 w-24 bg-gray-200 bg-cover bg-center"
        style={{
          backgroundImage: cropped ? `url(${cropped})` : undefined,
        }}
        onClick={() => setModalOpen(true)}
      >
        {!cropped && <Camera className="size-6" />}
      </Button>

      <PhotoUploadModal
        originalPhoto={original}
        open={modalOpen}
        onModalChange={setModalOpen}
        value={value}
        onChange={handleOnChange}
      />
    </>
  );
};

export default PhotoUploader;
