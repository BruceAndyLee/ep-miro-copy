import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Link } from "react-router-dom";
import { AuthLayout } from "./ui/layout";
import { RegisterForm } from "./ui/register-form";

export function RegisterPage() {

  return <AuthLayout
    title="Register"
    description="Fill in the fields to register a user"
    form={<RegisterForm />}
    footer={
      <>
        <div className="ml-5">Already have an account?</div>
        <Button asChild variant="link">
          <Link to={ROUTES.LOGIN}>sign in</Link>
        </Button>
      </>
    }
  />
}

export const Component = RegisterPage;