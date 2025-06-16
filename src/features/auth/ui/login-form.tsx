import { Button } from "@/shared/ui/kit/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { useForm } from "react-hook-form";

// validation
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// business-logic
import { publicrqClient } from "@/shared/api/rest-clients";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/use-session";

const loginSchema = z.object({
    username: z.string({ required_error: "required" }).min(5, "5 characters min"),
    password: z.string({ required_error: "required" }).min(8, "8 characters min")
})

export function LoginForm() {
    
    const session = useSession();
    const navigate = useNavigate();
    const loginMutation = publicrqClient.useMutation("post", "/auth/login", {
        onSuccess: (data) => {
            console.log("login: access token", data.accessToken);
            session.login(data.accessToken)
            navigate(ROUTES.HOME)
        }
    });

    const form = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = form.handleSubmit((data) => {
        console.log("mutation!", { body: data });
        loginMutation.mutate({ body: data })
    });

    return (
        <Form {...form}>
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Vulpix1234" {...field}></Input>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field}></Input>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <Button type="submit">Login</Button>
            </form>
        </Form>
    )
}