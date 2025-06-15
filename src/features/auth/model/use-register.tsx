import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { rqClient } from "@/shared/api/client";

export function useRegister() {
  const navigate = useNavigate();
  const registerMutation = rqClient.useMutation("post", "/auth/register", {
    onSuccess: () => {
      navigate(ROUTES.LOGIN);
    }
  });

  const register = (data: { username: string, password: string }) => {
    registerMutation.mutate({ body: data })
  }

  const errorMessage = registerMutation.isError
    ? registerMutation.error.message
    : null

  return {
    register,
    isPending: registerMutation.isPending,
    errorMessage
  }
}