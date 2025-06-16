import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/use-session";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedOutlet() {
  const { session } = useSession()
  
  if (!session) {
    return <Navigate to={ROUTES.LOGIN} />
  }

  return <Outlet />
}