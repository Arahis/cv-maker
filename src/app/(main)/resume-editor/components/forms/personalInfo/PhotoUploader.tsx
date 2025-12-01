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
  const { resumeId } = useResumeEditor();

  const { cropped, original, setAvatarMedia } = useAvatar(resumeId);

  const handleOnChange = async (
    originalPhoto: string,
    croppedPhoto: string,
    cropData: AvatarCropDataForm,
  ) => {
    await setAvatarMedia({
      original: originalPhoto,
      cropped: croppedPhoto,
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
