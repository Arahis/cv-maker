import { getMe, login, logout, signup, verifyEmailCode } from "@/api/auth";
import { setAccessToken } from "@/api/token";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useMeQuery() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
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

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setAccessToken(null);
      queryClient.clear();
    },
  });
}
