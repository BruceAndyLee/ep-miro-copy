import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { publicrqClient } from "@/shared/api/rest-clients";
import { useSession } from "@/shared/model/use-session";

export function useRegister() {

  const session = useSession();
  const navigate = useNavigate();
  const registerMutation = publicrqClient.useMutation("post", "/auth/register", {
    onSuccess: (data) => {
      // this will update global state and make login-info accessible to the entire app
      session.login(data.accessToken)
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