import { apiFetch } from "./api-fetch";
import { setAccessToken } from "./token";

type LoginSignupInput = {
  email: string;
  password: string;
};

type VerifyCodeInput = {
  email: string;
  code: string;
};

type SignupRes = {
  status: string;
  message: string;
};

type ForgotPasswordRes = {
  status: string;
  message: string;
};

type AuthUser = {
  id: string;
  email: string;
};

type AuthRes = {
  status: string;
  accessToken: string;
};

// TODO: Check if this status type is correct, it should be "ok" or "error" instead of "success"
type SuccessRes = {
  success: true;
};

type MeRes = {
  user: AuthUser;
};

export async function signup(input: LoginSignupInput) {
  const res = await apiFetch<SignupRes>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return res;
}

export async function verifyEmailCode(input: VerifyCodeInput) {
  const res = await apiFetch<AuthRes>("/auth/verify-email-code", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return res;
}

export async function forgotPassword(input: { email: string }) {
  const res = await apiFetch<ForgotPasswordRes>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return res;
}

export async function verifyResetPasswordCode(input: VerifyCodeInput) {
  const res = await apiFetch<{ status: string }>(
    "/auth/forgot-password/verify",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  return res;
}

export async function resetPassword(input: { password: string }) {
  const res = await apiFetch<AuthRes>("/auth/forgot-password/reset-password", {
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
