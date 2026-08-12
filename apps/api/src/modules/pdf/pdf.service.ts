import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const apiRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const fontsRoot = path.join(apiRoot, "fonts");

const localFontCss = `
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; }
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-Medium.woff2") format("woff2"); font-weight: 500; font-style: normal; }
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-SemiBold.woff2") format("woff2"); font-weight: 600; font-style: normal; }
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-Bold.woff2") format("woff2"); font-weight: 700; font-style: normal; }
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-Black.woff2") format("woff2"); font-weight: 900; font-style: normal; }
@font-face { font-family: Outfit; src: url("http://pdf.local/fonts/outfit/Outfit_var.woff2") format("woff2"); font-weight: 300 700; font-style: normal; }
@font-face { font-family: Cantata; src: url("http://pdf.local/fonts/cantata/Cantata_One_Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; }
`;

type CreatePdfInput = {
  html: string;
  css: string;
  baseUrl?: string;
  stylesheets: string[];
};

function escapeHtmlAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function injectHead(
  html: string,
  css: string,
  baseUrl: string | undefined,
  stylesheets: string[],
) {
  const cssWithoutExternalFonts = css.replace(/@font-face\s*\{[^}]*\}/gi, "");
  const links = stylesheets
    .map((href) => `<link rel="stylesheet" href="${escapeHtmlAttr(href)}" />`)
    .join("");
  const injection = `${baseUrl ? `<base href="${escapeHtmlAttr(baseUrl)}" />` : ""}${links}<style>${cssWithoutExternalFonts}${localFontCss}</style>`;

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${injection}</head>`);
  }

  return `<!doctype html><html><head><meta charset="utf-8" />${injection}</head><body>${html}</body></html>`;
}

export async function createPdf(input: CreatePdfInput): Promise<Buffer> {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
      locale: "en-US",
    });

    await page.setExtraHTTPHeaders({
      "ngrok-skip-browser-warning": "true",
      "Accept-Language": "en-US,en;q=0.9",
    });

    await page.route("http://pdf.local/fonts/**", async (route) => {
      const relativePath = new URL(route.request().url()).pathname.replace(
        /^\/fonts\//,
        "",
      );
      const fontPath = path.resolve(fontsRoot, relativePath);

      if (!fontPath.startsWith(`${fontsRoot}${path.sep}`)) {
        await route.abort();
        return;
      }

      const body = await readFile(fontPath);
      const contentType = fontPath.endsWith(".woff2")
        ? "font/woff2"
        : "application/octet-stream";

      await route.fulfill({
        status: 200,
        body,
        headers: { "Content-Type": contentType },
      });
    });

    page.on("requestfailed", (request) => {
      if (/\.css(?:\?|$)|\.(?:woff2?|ttf|otf)(?:\?|$)/i.test(request.url())) {
        console.warn("PDF asset request failed", {
          url: request.url(),
          error: request.failure()?.errorText,
        });
      }
    });

    page.on("response", (response) => {
      if (/\.css(?:\?|$)|\.(?:woff2?|ttf|otf)(?:\?|$)/i.test(response.url())) {
        console.info("PDF asset response", response.status(), response.url());
      }
    });

    await page.setContent(
      injectHead(input.html, input.css, input.baseUrl, input.stylesheets),
      {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
      },
    );

    // Use print media so @media print rules are applied consistently.
    await page.emulateMedia({ media: "print" });

    await page.evaluate(async () => {
      await document.fonts?.ready;
      await Promise.all(
        Array.from(document.images).map((image) =>
          image.decode().catch(() => undefined),
        ),
      );
    });

    console.info(
      "PDF fonts",
      await page.evaluate(() => ({
        status: document.fonts.status,
        inter: document.fonts.check("500 14px Inter"),
        loaded: Array.from(document.fonts).map((font) => ({
          family: font.family,
          weight: font.weight,
          status: font.status,
        })),
      })),
    );

    await page.waitForTimeout(200);

    return Buffer.from(
      await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
      }),
    );
  } finally {
    await browser.close();
  }
}
