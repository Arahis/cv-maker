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
@font-face { font-family: "DM Sans"; src: url("http://pdf.local/fonts/DM_sans/dm-sans-v17-latin-regular.woff2") format("woff2"); font-weight: 400; font-style: normal; }
@font-face { font-family: "DM Sans"; src: url("http://pdf.local/fonts/DM_sans/dm-sans-v17-latin-600.woff2") format("woff2"); font-weight: 600; font-style: normal; }
@font-face { font-family: "DM Sans"; src: url("http://pdf.local/fonts/DM_sans/dm-sans-v17-latin-700.woff2") format("woff2"); font-weight: 700; font-style: normal; }
@font-face { font-family: "DM Sans"; src: url("http://pdf.local/fonts/DM_sans/dm-sans-v17-latin-800.woff2") format("woff2"); font-weight: 800; font-style: normal; }
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

  // The PDF page is rendered with `@media print`, where pagination.css
  // explicitly sets --page-gap to 0. Keep the server geometry in sync with
  // the actual CSS layout instead of using the screen-preview gap.
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
            (other) =>
              other !== flow &&
              flow.element.contains(other.element) &&
              !flow.element.hasAttribute("data-pagination-keep-together"),
          ) &&
          !flows.some(
            (other) =>
              other !== flow &&
              other.element.hasAttribute("data-pagination-keep-together") &&
              other.element.contains(flow.element),
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
    const previousFlowBreaks = new WeakMap<HTMLElement, number>();

    for (let guard = 0; guard < 100; guard += 1) {
      const editorRect = editor.getBoundingClientRect();
      const layoutBottom =
        documentFlow.getBoundingClientRect().bottom - editorRect.top;
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

async function applyServerContentWidths(page: import("playwright").Page) {
  await page.evaluate(() => {
    const scope = globalThis as typeof globalThis & {
      __name?: (value: unknown, name: string) => unknown;
    };

    scope.__name ??= (value) => value;
  });

  await page.evaluate(() => {
    const regions = Array.from(
      document.querySelectorAll<HTMLElement>(".columns-region"),
    ).filter((region) => {
      const inlineTemplate = region.style.gridTemplateColumns;
      const computedTemplate = getComputedStyle(region).gridTemplateColumns;

      return (
        inlineTemplate.includes("fit-content") ||
        computedTemplate.includes("fit-content")
      );
    });

    for (const region of regions) {
      const leftContent = region.querySelector<HTMLElement>(
        ":scope > .column:first-child .column-content",
      );

      if (!leftContent) continue;

      const leftRect = leftContent.getBoundingClientRect();
      let maxRight = leftRect.left;
      const walker = document.createTreeWalker(
        leftContent,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) =>
            node.textContent?.trim()
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT,
        },
      );
      let node = walker.nextNode();

      while (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (rect.width !== 0 && rect.height !== 0) {
            maxRight = Math.max(maxRight, rect.right);
          }
        }
        node = walker.nextNode();
      }

      const width = Math.ceil(maxRight - leftRect.left);
      if (width <= 0) continue;

      region.style.gridTemplateColumns = `${width}px minmax(0, 1fr)`;
    }
  });
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

    await applyServerContentWidths(page);
    await applyServerPagination(page);

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
