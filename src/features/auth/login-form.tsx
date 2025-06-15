import { rqClient } from "@/shared/api/client";
import { Button } from "@/shared/ui/kit/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { useForm } from "react-hook-form";

// validation
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    username: z.string({ required_error: "required" }).min(5, "5 characters min"),
    password: z.string({ required_error: "required" }).min(8, "8 characters min")
})

export function LoginForm() {
    const loginMutation = rqClient.useMutation("post", "/auth/login");

    const form = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = form.handleSubmit((data) => {
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