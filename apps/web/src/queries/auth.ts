import {
  forgotPassword,
  deleteAccount,
  getMe,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmailCode,
  verifyResetPasswordCode,
} from "@/api/auth";
import { getAccessToken, setAccessToken } from "@/api/token";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { accountResumeKeys } from "./resumes/accountResumes";
import { useAuthBootstrap, useAuthLogout } from "@/providers/auth-bootstrap";

export function useMeQuery() {
  const isAuthReady = useAuthBootstrap();

  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: isAuthReady && Boolean(getAccessToken()),
    retry: false,
  });
}

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: (data, input) => {
      if (data.status === "verification_required") {
        router.push(
          `/sign-up/verify-code?email=${encodeURIComponent(input.email)}`,
        );
      }
    },
  });
}

export function useVerifyCode() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: verifyEmailCode,

    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/resumes");
    },
  });
}

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: forgotPassword,

    onSuccess: (data, input) => {
      if (data.status === "ok") {
        router.push(
          `/forgot-password/verify-code?email=${encodeURIComponent(input.email)}`,
        );
      }
    },
  });
}

export function useVerifyResetPasswordCode() {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyResetPasswordCode,

    onSuccess: (data) => {
      if (data.status === "code_verified") {
        router.push(`/forgot-password/reset`);
      }
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,

    onSuccess: (data) => {
      if (data.status === "password_reset_success") {
        setAccessToken(data.accessToken);
        queryClient.invalidateQueries({ queryKey: ["me"] });
        router.push("/resumes");
      }
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  // TODO: same logic as in useVerifyCode, maybe we can refactor it to a single function
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/resumes");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoggingOut } = useAuthLogout();

  return useMutation({
    mutationFn: logout,
    onMutate: () => {
      setIsLoggingOut(true);
    },
    onSettled: () => {
      setAccessToken(null);
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: accountResumeKeys.all });

      if (pathname !== "/resumes") {
        router.replace("/");
      }
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setIsLoggingOut } = useAuthLogout();

  return useMutation({
    mutationFn: deleteAccount,
    onMutate: () => {
      setIsLoggingOut(true);
    },
    onError: () => {
      setIsLoggingOut(false);
    },
    onSuccess: () => {
      setAccessToken(null);
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: accountResumeKeys.all });
      router.push("/");
    },
  });
}
