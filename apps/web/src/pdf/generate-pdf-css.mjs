import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "../..");
const inputPath = path.join(__dirname, "styles.css");
const outputPath = path.join(__dirname, "pdfCss.ts");
const tmpOutputPath = path.join(__dirname, "pdfCss.tmp.css");
const execFileAsync = promisify(execFile);

async function main() {
  await execFileAsync(
    "npx",
    ["tailwindcss", "-i", inputPath, "-o", tmpOutputPath, "--minify"],
    { cwd: appRoot },
  );

  const css = await readFile(tmpOutputPath, "utf8");

  await writeFile(
    outputPath,
    `export const pdfCss = ${JSON.stringify(css)} as const;\n`,
    "utf8",
  );
  await rm(tmpOutputPath, { force: true });
}

main().catch((error) => {
  console.error("Failed to generate pdfCss.ts", error);
  process.exit(1);
});
