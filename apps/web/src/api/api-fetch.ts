import { getAccessToken, setAccessToken } from "./token";

type RefreshResponse =
  | {
      accessToken: string;
      user: {
        id: string;
        email: string;
      };
    }
  | {
      status: "unauthenticated";
      accessToken: null;
    };

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  });

  if (!res.ok) {
    setAccessToken(null);
    return null;
  }

  const data = (await res.json()) as RefreshResponse;

  if (!data.accessToken) {
    setAccessToken(null);
    return null;
  }

  setAccessToken(data.accessToken);

  return data.accessToken;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return apiFetchInternal<T>(path, options, true);
}

export async function apiFetchBlob(
  path: string,
  options: RequestInit = {},
): Promise<Blob> {
  return apiFetchInternal(path, options, true, (response) => response.blob());
}

async function apiFetchInternal<T>(
  path: string,
  options: RequestInit,
  shouldTryRefresh: boolean,
  parseResponse: (response: Response) => Promise<T> = (response) =>
    response.json() as Promise<T>,
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  const isFormDataBody =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (options.body && !headers.has("Content-Type") && !isFormDataBody) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // setup for Ngrok
  headers.set("ngrok-skip-browser-warning", "true");
  headers.set("Accept", "application/json");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 401 && shouldTryRefresh && path !== "/auth/refresh") {
    const newToken = await refreshAccessToken();

    if (newToken) {
      return apiFetchInternal<T>(path, options, false, parseResponse);
    }
  }

  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }

  return parseResponse(res);
}
