import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";

const PhotoCropper = ({
  src,
  onReset,
  onSave,
}: {
  src: string;
  onReset: () => void;
  onSave: (v: Area) => void;
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);

  const onCropComplete = (_area: Area, areaPixels: Area) => {
    setCroppedPixels(areaPixels);
  };

  const handleSave = () => {
    if (croppedPixels) {
      onSave(croppedPixels);
    }
  };

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
