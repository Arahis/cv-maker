import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "./r2.js";

const { R2_BUCKET_NAME, R2_PUBLIC_BASE_URL } = process.env;

if (!R2_BUCKET_NAME) {
  throw new Error("R2_BUCKET_NAME is required");
}

if (!R2_PUBLIC_BASE_URL) {
  throw new Error("R2_PUBLIC_BASE_URL is required");
}

export async function uploadToR2({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType: string;
}) {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  const normalizedBaseUrl = R2_PUBLIC_BASE_URL?.replace(/\/$/, "");

  return {
    key,
    url: `${normalizedBaseUrl}/${key}`,
  };
}
