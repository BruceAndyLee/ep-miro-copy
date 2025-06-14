import { rqClient } from "@/shared/api/client";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/shared/ui/kit/card";
import { Input } from "@/shared/ui/kit/input";
import { Link } from "react-router-dom";

export function LoginPage() {

  const loginMutation = rqClient.useMutation("post", "/auth/login");

  const onSubmit = (e: Event) => {
    e.preventDefault();
    const loginFormData = new FormData(e.target as HTMLFormElement);

    console.log("login submit: ", [...loginFormData.entries()]);
    
    loginMutation.mutate({
      body: {
        username: loginFormData.get("username") as string,
        password: loginFormData.get("password") as string,
      }
    })
  };

  return (
    <div className="container m-auto">
      <Card>
        <CardTitle>Login</CardTitle>
        <CardContent>
          <form action="submit" className="container" onSubmit={onSubmit}>
            <Input name="username">
            </Input>
            <Input name="password" type="password">
            </Input>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit">Login</Button>
          <div className="ml-5">or</div>
          <Button asChild variant="link">
            <Link to={ROUTES.REGISTER}>sign up</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export const Component = LoginPage;