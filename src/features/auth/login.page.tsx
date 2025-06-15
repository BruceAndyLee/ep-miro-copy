import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Link } from "react-router-dom";
import { AuthLayout } from "./layout";
import { LoginForm } from "./login-form";

export function LoginPage() {
  return (
    <AuthLayout
      title="Login"
      description="Enter your credentials"
      form={<LoginForm />}
      footer={
        <>
          <div className="ml-5">Not registered?</div>
          <Button asChild variant="link">
              <Link className="underline" to={ROUTES.REGISTER}>sign up</Link>
          </Button>
        </>
      }
    />
  );
}

export const Component = LoginPage;