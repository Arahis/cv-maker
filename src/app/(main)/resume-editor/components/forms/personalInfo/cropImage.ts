import { Area } from "react-easy-crop";

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.src = url;
  });
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return canvas.toDataURL("image/jpeg", 0.85);
}

async function toBlob(input: string): Promise<Blob> {
  // reverse input URL to Blob using fetch
  const response = await fetch(input);
  return await response.blob();
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export async function compressImage(
  src: string,
  maxWidth: number = 900,
  quality: number = 0.7,
): Promise<string> {
  const blob = await toBlob(src);

  const bitmap = await createImageBitmap(blob, {
    resizeWidth: maxWidth,
    resizeQuality: "high",
  });

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(bitmap, 0, 0);

  const compressedBlob = await canvas.convertToBlob({
    type: "image/jpeg",
    quality,
  });

  return blobToBase64(compressedBlob);
}
