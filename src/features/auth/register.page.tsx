import { rqClient } from "@/shared/api/client";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/shared/ui/kit/card";
import { Input } from "@/shared/ui/kit/input";
import { Link } from "react-router-dom";

export function RegisterPage() {

  const loginMutation = rqClient.useMutation("post", "/auth/register", {
    onSuccess: () => {
    }
  });

  const onSubmit = (e: Event) => {
    e.preventDefault();
    const registerFormData = new FormData(e.target as HTMLFormElement);

    console.log("login submit: ", [...registerFormData.entries()]);
    
    loginMutation.mutate({
      body: {
        username: registerFormData.get("username") as string,
        password: registerFormData.get("password") as string,
      }
    })
  };

  return <div className="container m-auto">
    <Card>
      <CardTitle>Register</CardTitle>
      <CardContent>
        <form action="submit" className="container" onSubmit={onSubmit}>
          <Input name="username">
          </Input>
          <Input name="password" type="password">
          </Input>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit">Submit</Button>
        <div className="ml-5">or</div>
        <Button asChild variant="link">
          <Link to={ROUTES.LOGIN}>sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  </div>
}

export const Component = RegisterPage;