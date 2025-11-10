// Probably the file isn't needed anymore but keeping it for reference

// we are telling where from to pick the files with which file extension
const context = require.context("@/data", false, /\.json$/);

// we are creating an object where each key is the file name and the value is the import of that file
const localDataFiles: Record<string, any> = Object.fromEntries(
  context.keys().map((path: string) => [path.replace("./", ""), context(path)]),
);

export const dataApi = {
  async getData<T = any>(key: string, locale?: string): Promise<T[]> {
    const useLocal = process.env.NEXT_PUBLIC_USE_LOCAL_DATA === "true";
    const baseApi = process.env.NEXT_PUBLIC_API_URL;

    if (useLocal) {
      const fileName = locale
        ? `${key}.${locale}.json`
        : `${key}.json` || `${key}.en.json`;

      const isFileExists = Object.keys(localDataFiles).includes(fileName);

      if (!isFileExists) {
        throw new Error(`Local data file "${fileName}" not found.`);
      }

      return localDataFiles[fileName] as T[];
    }

    const url = locale
      ? `${baseApi}/${key}?lang=${locale}`
      : `${baseApi}/${key}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    return res.json();
  },
};
