import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getLocation(request: Request) {
  const country =
    request.headers.get("CF-IPCountry") ??
    request.headers.get("x-vercel-ip-country") ??
    undefined;

  return { country: country?.toUpperCase() };
}

export function GET(request: Request) {
  return NextResponse.json(getLocation(request));
}
