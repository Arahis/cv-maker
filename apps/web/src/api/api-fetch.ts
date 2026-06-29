import { getAccessToken, setAccessToken } from "./token";

type AuthRes = {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function refreshAccessToken(): Promise<string | null> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    setAccessToken(null);
    return null;
  }

  const data = (await res.json()) as AuthRes;
  setAccessToken(data.accessToken);

  return data.accessToken;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  return apiFetchInternal<T>(path, options, true);
}

async function apiFetchInternal<T>(
  path: string,
  options: RequestInit,
  shouldTryRefresh: boolean,
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 401 && shouldTryRefresh && path !== "/auth/refresh") {
    const newToken = await refreshAccessToken();

    if (newToken) {
      return apiFetchInternal<T>(path, options, false);
    }
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
