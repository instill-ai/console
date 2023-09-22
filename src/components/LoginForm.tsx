import { Button, Form, Input } from "@instill-ai/design-system";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
  });

  function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    alert(JSON.stringify(data));
  }

  return (
    <Form.Root {...form}>
      <form
        className="flex flex-col space-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-5">
          <Form.Field
            control={form.control}
            name="username"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label htmlFor={field.name}>Username</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        id={field.name}
                        placeholder="Username"
                        type="text"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label htmlFor={field.name}>Password</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        id={field.name}
                        placeholder="Password"
                        type="password"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>
        <Button variant="primary" className="!w-full !flex-1" size="lg">
          Continue
        </Button>
      </form>
    </Form.Root>
  );
};
