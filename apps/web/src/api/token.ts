declare global {
  interface Window {
    __CVOOP_ACCESS_TOKEN__?: string | null;
  }
}

let accessToken: string | null = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;

  if (process.env.NODE_ENV === "development") {
    window.__CVOOP_ACCESS_TOKEN__ = token;
  }
}
