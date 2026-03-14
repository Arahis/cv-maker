function getSiteBaseUrl(req: Request) {
  const url = new URL(req.url);
  return url.origin;
}

async function getPdfCss(siteBaseUrl: string) {
  const res = await fetch(`${siteBaseUrl}/pdf.css`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load pdf.css: ${res.status}`);
  }

  return await res.text();
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
    const css = await getPdfCss(siteBaseUrl);

    console.log({ css });

    const lambdaUrl = process.env.PDF_LAMBDA_URL;

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
      const errorText = await lambdaRes.text().catch(() => "");
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
