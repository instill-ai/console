import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, Form, Input } from "@instill-ai/design-system";

export const ChangePasswordFormSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type ChangePasswordFormProps = {
  onSubmit: (data: z.infer<typeof ChangePasswordFormSchema>) => void;
};

export const ChangePasswordForm = ({ onSubmit }: ChangePasswordFormProps) => {
  const form = useForm<z.infer<typeof ChangePasswordFormSchema>>({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  return (
    <Form.Root {...form}>
      <form
        className="flex flex-col space-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-5">
          <Form.Field
            control={form.control}
            name="newPassword"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label htmlFor={field.name}>New password</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        id={field.name}
                        placeholder="New password"
                        type="password"
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value === "password") {
                            form.setError("newPassword", {
                              message:
                                "Password must be different from default password",
                            });
                          }
                        }}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>
        <Button
          variant="primary"
          className="!w-full !flex-1"
          size="lg"
          disabled={form.watch("newPassword") === "password" ? true : false}
        >
          Continue
        </Button>
      </form>
    </Form.Root>
  );
};
