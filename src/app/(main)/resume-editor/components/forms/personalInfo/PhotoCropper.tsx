import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { PhotoCropperProps } from "./PhotoUploadModal";
import { AvatarCropDataForm } from "@/lib/validation";

const PhotoCropper = ({
  src,
  onReset,
  onSave,
  cropValue,
  shouldReset,
}: {
  src: string;
  onReset: () => void;
  onSave: (v: PhotoCropperProps) => void;
  cropValue: AvatarCropDataForm;
  shouldReset: boolean;
}) => {
  const {
    zoom: initialZoom,
    rotation: initialRotation,
    x: initialX,
    y: initialY,
  } = cropValue;

  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(initialRotation);
  const [crop, setCrop] = useState({
    x: initialX,
    y: initialY,
  });

  // TODO: Check later if the condition inside can be removed
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);

  const onCropComplete = (_area: Area, areaPixels: Area) => {
    setCroppedPixels(areaPixels);
  };

  const handleSave = () => {
    if (croppedPixels) {
      onSave({
        croppedPixels,
        cropped: { x: crop.x, y: crop.y },
        zoom,
        rotation,
      });
    }
  };

  useEffect(() => {
    if (shouldReset) {
      setZoom(1);
      setRotation(0);
      setCrop({ x: 0, y: 0 });
    }
  }, [src, shouldReset]);

  return (
    <div>
      <div className="bg relative mb-8 h-[300px] w-full">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div>
        <p className="mb-2">Zoom</p>
        <Slider
          value={[zoom]}
          onValueChange={(v) => setZoom(v[0])}
          step={0.1}
          min={1}
          max={3}
          className="mb-8"
        />
      </div>
      <div>
        <div className="mb-2 flex justify-between">
          <p>Rotate</p>
          <Button variant="ghost" onClick={() => setRotation(0)}>
            Reset
          </Button>
        </div>
        <Slider
          value={[rotation]}
          onValueChange={(v) => setRotation(v[0])}
          step={1}
          min={-90}
          max={90}
          className="mb-8"
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          Use another photo
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default PhotoCropper;
