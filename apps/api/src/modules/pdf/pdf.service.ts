import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EPSILON,
  FOOTER_HEIGHT,
  HEADER_HEIGHT,
  PAGE_HEIGHT,
  getPageBreakHeight,
  getPageContentHeight,
  getPageStride,
  DEFAULT_PAGINATION_GEOMETRY,
} from "@cv-maker/resume-renderer";

const apiRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const fontsRoot = path.join(apiRoot, "fonts");
const rendererCssPath = path.resolve(
  apiRoot,
  "../../packages/resume-renderer/dist/renderer.css",
);

const localFontCss = `
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; }
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-Medium.woff2") format("woff2"); font-weight: 500; font-style: normal; }
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-SemiBold.woff2") format("woff2"); font-weight: 600; font-style: normal; }
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-Bold.woff2") format("woff2"); font-weight: 700; font-style: normal; }
@font-face { font-family: Inter; src: url("http://pdf.local/fonts/inter/Inter-Black.woff2") format("woff2"); font-weight: 900; font-style: normal; }
@font-face { font-family: Outfit; src: url("http://pdf.local/fonts/outfit/Outfit_var.woff2") format("woff2"); font-weight: 300 700; font-style: normal; }
@font-face { font-family: Cantata; src: url("http://pdf.local/fonts/cantata/Cantata_One_Regular.woff2") format("woff2"); font-weight: 400; font-style: normal; }
html, body, .editor { font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
`;

type CreatePdfInput = {
  html: string;
};

function injectHead(html: string, css: string) {
  const injection = `<style>${css}${localFontCss}</style>`;

  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${injection}</head>`);
  }

  return `<!doctype html><html><head><meta charset="utf-8" />${injection}</head><body>${html}</body></html>`;
}

async function applyServerPagination(page: import("playwright").Page) {
  // tsx/esbuild may emit a __name helper inside the browser evaluate bundle.
  // It is not available in Playwright's page context by default.
  await page.evaluate(() => {
    const scope = globalThis as typeof globalThis & {
      __name?: (value: unknown, name: string) => unknown;
    };

    scope.__name ??= (value) => value;
  });

  const pageGap = 0;
  const geometry = {
    ...DEFAULT_PAGINATION_GEOMETRY,
    pageHeight: PAGE_HEIGHT,
    footerHeight: FOOTER_HEIGHT,
    headerHeight: HEADER_HEIGHT,
    pageGap,
    pageContentHeight: getPageContentHeight({
      ...DEFAULT_PAGINATION_GEOMETRY,
      pageGap,
    }),
    pageBreakHeight: getPageBreakHeight({
      ...DEFAULT_PAGINATION_GEOMETRY,
      pageGap,
    }),
    pageStride: getPageStride({
      ...DEFAULT_PAGINATION_GEOMETRY,
      pageGap,
    }),
    epsilon: EPSILON,
  };

  await page.evaluate((geometry) => {
    const editor = document.querySelector<HTMLElement>(".editor");
    const documentFlow = document.querySelector<HTMLElement>(".document-flow");

    if (!editor || !documentFlow) return;

    const getFlows = () =>
      Array.from(
        documentFlow.querySelectorAll<HTMLElement>("[data-pagination-flow]"),
      ).map((element) => {
        const editorRect = editor.getBoundingClientRect();
        const rect = element.getBoundingClientRect();

        return {
          element,
          top: rect.top - editorRect.top,
          bottom: rect.bottom - editorRect.top,
        };
      });

    const deepestFlows = (flows: ReturnType<typeof getFlows>) =>
      flows.filter(
        (flow) =>
          !flows.some(
            (other) => other !== flow && flow.element.contains(other.element),
          ),
      );

    const createBreak = (marginTop: number) => {
      const widget = document.createElement("div");
      widget.className = "pagination-widget";
      widget.setAttribute("data-server-pagination", "true");
      widget.innerHTML = `<div class="page-break"><div class="page-anchor" style="margin-top:${marginTop}px"></div><div class="flow-breaker" style="height:${geometry.pageBreakHeight}px"></div></div>`;
      return widget;
    };

    let pageNumber = 1;
    let previousFlowBreaks = new WeakMap<HTMLElement, number>();

    for (let guard = 0; guard < 100; guard += 1) {
      const editorRect = editor.getBoundingClientRect();
      const documentRect = documentFlow.getBoundingClientRect();
      const layoutBottom = documentRect.bottom - editorRect.top;
      const boundaryY =
        (pageNumber - 1) * geometry.pageStride +
        geometry.pageHeight -
        geometry.footerHeight;

      if (layoutBottom <= boundaryY + geometry.epsilon) break;

      const activeFlows = deepestFlows(
        getFlows().filter(
          (flow) =>
            boundaryY >= flow.top - geometry.epsilon &&
            boundaryY <= flow.bottom + geometry.epsilon,
        ),
      );

      if (activeFlows.length === 0) break;

      for (const flow of activeFlows) {
        const flowBreakCount = previousFlowBreaks.get(flow.element) ?? 0;
        const marginTop =
          flowBreakCount === 0
            ? Math.max(0, boundaryY - flow.top)
            : geometry.pageContentHeight;

        const firstContentChild = Array.from(flow.element.children).find(
          (child) => !child.hasAttribute("data-server-pagination"),
        );

        // Keep breaks in page order. Inserting every new break before the
        // first child reverses the float order and only becomes visible from
        // the second page onward.
        flow.element.insertBefore(
          createBreak(marginTop),
          firstContentChild ?? null,
        );
        previousFlowBreaks.set(flow.element, flowBreakCount + 1);
      }

      pageNumber += 1;
    }

    editor.style.setProperty(
      "--editor-height",
      `${geometry.pageHeight * pageNumber + geometry.pageGap * (pageNumber - 1)}px`,
    );
  }, geometry);
}

export async function createPdf(input: CreatePdfInput): Promise<Buffer> {
  const css = await readFile(rendererCssPath, "utf8");
  const browser = await chromium.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-font-subpixel-positioning",
      "--font-render-hinting=none",
      "--disable-lcd-text",
      "--disable-dev-shm-usage",
      "--force-color-profile=srgb",
    ],
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 2,
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

    await page.setContent(injectHead(input.html, css), {
      waitUntil: "networkidle",
      timeout: 60_000,
    });

    // Use print media so @media print rules are applied consistently.
    await page.emulateMedia({ media: "print" });

    await page.evaluate(async () => {
      const fontRequests = [
        "400 14px Inter",
        "500 14px Inter",
        "600 14px Inter",
        "700 14px Inter",
        "900 14px Inter",
        "400 14px Outfit",
        "400 14px Cantata",
      ];

      await Promise.all(fontRequests.map((font) => document.fonts.load(font)));
      await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map((image) =>
          image.decode().catch(() => undefined),
        ),
      );
    });

    await applyServerPagination(page);

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
