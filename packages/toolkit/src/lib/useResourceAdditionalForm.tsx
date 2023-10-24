import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Nullable } from "vitest";
import * as z from "zod";
import { Form, Input, Textarea } from "@instill-ai/design-system";

export const ResourceAdditionalFormSchema = z.object({
  id: z.string(),
  description: z.string().nullable().optional(),
});

export const useResourceAdditionalForm = ({
  data,
}: {
  data: Nullable<z.infer<typeof ResourceAdditionalFormSchema>>;
}) => {
  const form = useForm<z.infer<typeof ResourceAdditionalFormSchema>>({
    resolver: zodResolver(ResourceAdditionalFormSchema),
    defaultValues: {
      ...data,
    },
  });

  const fields = React.useMemo(() => {
    return (
      <React.Fragment>
        <Form.Field
          control={form.control}
          name="id"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>ID *</Form.Label>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      type="text"
                      value={field.value ?? ""}
                      autoComplete="off"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.trigger("id");
                      }}
                      disabled={data?.id ? true : false}
                    />
                  </Input.Root>
                </Form.Control>
                <Form.Description>
                  Pick an ID to help you identify this resource. The ID conforms
                  to RFC-1034, which restricts to letters, numbers, and hyphen,
                  with the first character a letter, the last a letter or a
                  number, and a 63 character maximum.
                </Form.Description>
                <Form.Message />
              </Form.Item>
            );
          }}
        />
        <Form.Field
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label>Description</Form.Label>
                <Form.Control>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      form.trigger("description");
                    }}
                  />
                </Form.Control>
                <Form.Description>
                  Fill with a short description.
                </Form.Description>
                <Form.Message />
              </Form.Item>
            );
          }}
        />
      </React.Fragment>
    );
  }, []);

  return { form, fields };
};
