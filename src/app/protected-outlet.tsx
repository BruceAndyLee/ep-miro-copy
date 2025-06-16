import { enableHttpMocks } from "@/shared/api/mocks";
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


// this is some magic func to be used inside the routes object
// as a 'loader'
// it is run BEFORE the route gets actually resolved
// thus we can avoid mount the target component altogether
export async function ProtectedLoader() {

  await enableHttpMocks();

  const token = await useSession.getState().refreshToken();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} />
  }

  return <Outlet />
}