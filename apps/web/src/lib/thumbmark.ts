import { Thumbmark } from "@thumbmarkjs/thumbmarkjs";

let fingerprintPromise: Promise<string> | null = null;

export function getVisitorFingerprint(): Promise<string> {
  fingerprintPromise ??= new Thumbmark()
    .get()
    .then((result) => result.thumbmark)
    .catch((error) => {
      fingerprintPromise = null;
      throw error;
    });

  return fingerprintPromise;
}
