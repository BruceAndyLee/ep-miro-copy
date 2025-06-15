import { rqClient } from "@/shared/api/client";
import { Button } from "@/shared/ui/kit/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  username: z.string({ required_error: "required" }).min(6, "6 characters min"),
  password: z.string({ required_error: "required" }).min(8, "8 characters min"),
})

export function RegisterForm() {
  const loginMutation = rqClient.useMutation("post", "/auth/register", {
    onSuccess: () => {
    }
  });

  const form = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate({ body: data });
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Vulpix123" {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field}></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )

  return (
    <form action="submit" className="container" onSubmit={onSubmit}>
      <Input name="username">
      </Input>
      <Input name="password" type="password">
      </Input>
      <Button type="submit">Submit</Button>
    </form>
  );
}