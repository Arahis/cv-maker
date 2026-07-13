import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import PhotoCropper from "./PhotoCropper";
import { getCroppedImg } from "./lib/cropImage";
import { Area } from "react-easy-crop";
import type { Avatar } from "../../../store/types";

export type PhotoCropperProps = {
  croppedPixels: Area;
  cropped: { x: number; y: number };
  zoom: number;
  rotation: number;
};

const DropZone = ({
  onFileSelected,
}: {
  onFileSelected: (f: File) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelected(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => fileInput.current?.click()}
      className={`flex h-64 w-full cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed p-4 ${
        isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <Camera />
      <p className="text-muted-foreground text-sm">
        Drag & drop your photo here, or click to browse
      </p>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

const CameraZone = ({ onCapture }: { onCapture: (f: Blob) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const takePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d")!;

    // flip photo mirror like
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        onCapture(blob);
      },
      "image/webp",
      0.9,
    );
  };

  async function startCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // front camera
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  }

  useEffect(() => {
    startCamera();

    const videoRefCurrent = videoRef.current;

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (videoRefCurrent) {
        videoRefCurrent.srcObject = null;
      }
      streamRef.current = null;
    };
  }, []);

  // When switching tabs, stop the camera if the document is hidden
  //   useEffect(() => {
  //     const handler = () => {
  //       if (document.hidden) {
  //         streamRef.current?.getTracks().forEach((t) => t.stop());
  //       } else {
  //         startCamera();
  //       }
  //     };

  //     document.addEventListener("visibilitychange", handler);

  //     return () => document.removeEventListener("visibilitychange", handler);
  //   }, []);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-xl shadow-lg"
        style={{ transform: "scaleX(-1)" }}
      />
      <div className="mt-4 text-right">
        <Button onClick={takePhoto}>Take picture</Button>
      </div>
    </div>
  );
};

const DialogInner = ({
  onChange,
  currentPhoto,
  onModalClose,
}: {
  currentPhoto: Avatar | null;
  onModalClose: (v: boolean) => void;
  onChange: (croppedPhoto: Blob | null) => void;
}) => {
  const [src, setSrc] = useState<string | null>(null);
  const [shouldResetCrop, setShouldResetCrop] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  const resetObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const handleFile = (file: File | Blob | string) => {
    setShouldResetCrop(true);
    if (typeof file === "string") {
      resetObjectUrl();
      setSrc(file);
      return;
    }

    resetObjectUrl();
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setSrc(objectUrl);
  };

  useEffect(() => {
    setShouldResetCrop(true);
    if (!currentPhoto) {
      resetObjectUrl();
      setSrc(null);
      return;
    }

    handleFile(currentPhoto);
  }, [currentPhoto]);

  useEffect(() => {
    return () => {
      resetObjectUrl();
    };
  }, []);

  if (src) {
    const handleResetChosenFile = () => {
      resetObjectUrl();
      setSrc(null);
    };

    const handleDeleteFile = () => {
      handleResetChosenFile();
      onChange(null);
      onModalClose(false);
    };

    const handleSaveFiles = async (cropData: PhotoCropperProps) => {
      const { croppedPixels, rotation } = cropData;
      const croppedImage = await getCroppedImg(src, croppedPixels, rotation);
      if (croppedImage) {
        onChange(croppedImage);
      }
      onModalClose(false);
    };

    return (
      <PhotoCropper
        src={src}
        onReset={handleResetChosenFile}
        onSave={handleSaveFiles}
        onDelete={handleDeleteFile}
        shouldReset={shouldResetCrop}
      />
    );
  }

  return (
    <Tabs defaultValue="upload_photo">
      <TabsList className="w-full">
        <TabsTrigger value="upload_photo">Upload photo</TabsTrigger>
        <TabsTrigger value="take_photo">Take photo</TabsTrigger>
      </TabsList>
      <TabsContent value="upload_photo">
        <DropZone onFileSelected={handleFile} />
      </TabsContent>
      <TabsContent value="take_photo">
        <CameraZone onCapture={handleFile} />
      </TabsContent>
    </Tabs>
  );
};

const PhotoUploadModal = ({
  open,
  onModalChange,
  onChange,
  currentPhoto,
}: {
  open: boolean;
  onModalChange: (v: boolean) => void;
  currentPhoto: Avatar | null;
  onChange: (croppedPhoto: Blob | null) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={() => onModalChange(!open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your latest photo</DialogTitle>
        </DialogHeader>
        <DialogInner
          onChange={onChange}
          currentPhoto={currentPhoto}
          onModalClose={onModalChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PhotoUploadModal;
