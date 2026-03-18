const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

console.log("fonts dir exists:", fs.existsSync("/var/task/fonts"));
try {
  console.log("fonts dir list:", fs.readdirSync("/var/task/fonts"));
} catch (e) {
  console.log("fonts list error:", String(e));
}

exports.handler = async (event) => {
  let browser;
  try {
    const body = JSON.parse(event.body || "{}");
    const { html, css = "", baseUrl } = body;

    console.log("css head:", css.slice(0, 300));

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

    page.on("request", (req) => {
      if (isFontRequest(req.url())) {
        console.log("FONT FILE REQUEST:", req.url());
      }
    });
    page.on("requestfailed", (req) => {
      if (isFontRequest(req.url())) {
        console.log(
          "FONT REQUEST FAILED:",
          req.url(),
          req.failure()?.errorText,
        );
      }
    });
    page.on("response", async (res) => {
      const url = res.url();
      if (isFontRequest(url)) {
        console.log("FONT RESPONSE:", url, res.status());
      }
    });

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    // Potential blocking place
    await page.route("**/*", (route) => {
      const reqUrl = route.request().url();
      const localFontPath = getLocalFontPath(reqUrl);

      if (localFontPath) {
        try {
          const body = fs.readFileSync(localFontPath);
          return route.fulfill({
            status: 200,
            body,
            headers: {
              "Content-Type": "font/woff2",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (e) {
          console.log("FONT READ FAILED:", localFontPath, String(e));
          return route.abort();
        }
      }

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

    const fontStatus = await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        status: document.fonts.status,
        inter: document.fonts.check("16px Inter"),
        outfit: document.fonts.check("16px Outfit"),
        cantata: document.fonts.check("16px Cantata"),
      };
    });
    console.log("fonts:", fontStatus);

    const fontDetails = await page.evaluate(() => {
      const list = [];
      for (const f of document.fonts) {
        list.push({
          family: f.family,
          status: f.status,
          weight: f.weight,
          style: f.style,
        });
      }
      return list;
    });
    console.log("font faces:", fontDetails);

    const computedFonts = await page.evaluate(() => {
      const selectors = [".font-cantata", ".font-brand", ".font-sans"];

      return selectors.map((selector) => {
        const el = document.querySelector(selector);

        if (!el) {
          return { selector, found: false };
        }

        const style = getComputedStyle(el);

        return {
          selector,
          found: true,
          text: (el.textContent || "").trim().slice(0, 120),
          className: el.className,
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
        };
      });
    });
    console.log("computed fonts:", computedFonts);

    const bodyFont = await page.evaluate(() => {
      const style = getComputedStyle(document.body);

      return {
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle,
      };
    });
    console.log("body font:", bodyFont);

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

function getLocalFontPath(reqUrl) {
  try {
    const { pathname } = new URL(reqUrl);
    if (!pathname || !pathname.startsWith("/fonts/")) return null;
    return path.join("/var/task", pathname);
  } catch {
    return null;
  }
}

function isFontRequest(reqUrl) {
  return !!getLocalFontPath(reqUrl);
}
