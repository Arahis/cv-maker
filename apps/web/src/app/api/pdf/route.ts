import { getCloudflareContext } from "@opennextjs/cloudflare";

import { pdfCss } from "@/pdf/pdfCss";

async function getPdfLambdaUrl() {
  const { env } = await getCloudflareContext({ async: true });

  return (env as any).PDF_LAMBDA_URL ?? process.env.PDF_LAMBDA_URL;
}

function getSiteBaseUrl(req: Request) {
  const url = new URL(req.url);
  return url.origin;
}

export async function POST(req: Request) {
  try {
    const { html } = await req.json();

    if (!html || typeof html !== "string") {
      return new Response(JSON.stringify({ error: "Missing html" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const siteBaseUrl = getSiteBaseUrl(req);
    const css = pdfCss;

    const lambdaUrl = await getPdfLambdaUrl();

    if (!lambdaUrl) {
      return new Response(JSON.stringify({ error: "Missing PDF_LAMBDA_URL" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const lambdaRes = await fetch(lambdaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html,
        css,
        baseUrl: siteBaseUrl,
      }),
    });

    if (!lambdaRes.ok) {
      return new Response(
        JSON.stringify({
          error: "Lambda error",
          details: lambdaRes.status,
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const pdfBytes = await lambdaRes.arrayBuffer();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal error",
        details: String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
