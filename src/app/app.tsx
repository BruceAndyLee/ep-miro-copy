import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/features/header";
import { ROUTES } from "@/shared/model/routes";

export function App() {
  const location = useLocation();

  const isAuthPage = [ROUTES.LOGIN, ROUTES.REGISTER].includes(location.pathname as typeof ROUTES.LOGIN | typeof ROUTES.REGISTER);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header />}
      <Outlet />
    </div>
  );
}
