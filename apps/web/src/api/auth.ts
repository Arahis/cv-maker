// src/api/auth.ts
import { apiFetch } from "./api-fetch";
import { setAccessToken } from "./token";

type LoginSignupInput = {
  email: string;
  password: string;
};

type AuthUser = {
  id: string;
  email: string;
};

type AuthRes = {
  accessToken: string;
  user: AuthUser;
};

type SuccessRes = {
  success: true;
};

type MeRes = {
  user: AuthUser;
};

export async function signup(input: LoginSignupInput) {
  const res = await apiFetch<AuthRes>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return res;
}

export async function login(input: LoginSignupInput) {
  const res = await apiFetch<AuthRes>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return res;
}

export async function refresh() {
  const res = await apiFetch<AuthRes>("/auth/refresh", {
    method: "POST",
  });

  setAccessToken(res.accessToken);

  return res;
}

export async function logout() {
  const res = await apiFetch<SuccessRes>("/auth/logout", {
    method: "POST",
  });

  return res;
}

export function getMe() {
  return apiFetch<MeRes>("/auth/me");
}
