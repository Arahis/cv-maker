import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useState } from "react";
import PhotoUploadModal from "./PhotoUploadModal";

const PhotoUploader = ({ value, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button className="h-24 w-24" onClick={() => setModalOpen(true)}>
        <Camera className="size-6" />
      </Button>

      <PhotoUploadModal open={modalOpen} onModalChange={setModalOpen} />
    </>
  );
};

export default PhotoUploader;
