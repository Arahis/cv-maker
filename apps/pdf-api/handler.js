const { chromium } = require("playwright");

exports.handler = async (event) => {
  let browser;
  try {
    const body = JSON.parse(event.body || "{}");
    const { html, css = "", baseUrl } = body;

    if (!html || typeof html !== "string") {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing 'html' in request body" }),
      };
    }

    browser = await chromium.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 720 },
      locale: "en-US",
    });

    const page = await context.newPage();

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    // Potential blocking place
    await page.route("**/*", (route) => {
      const reqUrl = route.request().url();

      const allow =
        reqUrl.startsWith("data:") ||
        reqUrl.startsWith("about:") ||
        (baseUrl && reqUrl.startsWith(baseUrl));

      if (!allow) return route.abort();

      if (
        reqUrl.includes("google-analytics") ||
        reqUrl.includes("googletagmanager") ||
        reqUrl.includes("cloudflareinsights") ||
        reqUrl.includes("doubleclick") ||
        reqUrl.includes("facebook") ||
        reqUrl.includes("hotjar")
      ) {
        return route.abort();
      }

      return route.continue();
    });

    const baseTag =
      baseUrl && typeof baseUrl === "string"
        ? `<base href="${escapeHtmlAttr(baseUrl)}" />`
        : "";

    const finalHtml = injectHead(
      html,
      `
      ${baseTag}
      <style>${css}</style>
    `,
    );

    // setContent вместо goto(url)
    await page.setContent(finalHtml, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Дать чуть времени на layout
    await page.waitForTimeout(200);

    // Дождаться шрифтов
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(() => r()));
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" }, // если нужно
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
      body: pdf.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal error", details: String(e) }),
    };
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
};

// --- helpers ---

function injectHead(html, headInjection) {
  // если есть </head> — вставим перед ним
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${headInjection}\n</head>`);
  }
  // если head нет — добавим минимальный каркас
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
${headInjection}
</head>
<body>
${html}
</body>
</html>`;
}

function escapeHtmlAttr(s) {
  return String(s).replace(/"/g, "&quot;").replace(/</g, "&lt;");
}
