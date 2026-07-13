import { S3Client } from "@aws-sdk/client-s3";

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
} = process.env;

if (!R2_ACCOUNT_ID) {
  throw new Error("R2_ACCOUNT_ID is required");
}

if (!R2_ACCESS_KEY_ID) {
  throw new Error("R2_ACCESS_KEY_ID is required");
}

if (!R2_SECRET_ACCESS_KEY) {
  throw new Error("R2_SECRET_ACCESS_KEY is required");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});
