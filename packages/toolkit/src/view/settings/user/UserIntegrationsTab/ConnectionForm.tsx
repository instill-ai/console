import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, cn, Form, Input } from "@instill-ai/design-system";

import { LoadingSpin } from "../../../../components";

export const ConnectionSchema = z.object({
  id: z.string(),
  method: z.string(),
  account: z.string(),
  key: z.string(),
});

export const connectionFormID = "connection-form";

export const ConnectionForm = ({
  id,
  onSubmit,
  className,
  isProcessing,
  additionalCta,
}: {
  id: string;
  onSubmit: (data: z.infer<typeof ConnectionSchema>) => Promise<void>;
  className?: string;
  isProcessing: boolean;
  additionalCta?: React.ReactNode;
}) => {
  const form = useForm<z.infer<typeof ConnectionSchema>>({
    resolver: zodResolver(ConnectionSchema),
    mode: "onChange",
  });

  return (
    <Form.Root {...form}>
      <form
        id={`${connectionFormID}-${id}`}
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-y-3", className)}
      >
        <Form.Field
          control={form.control}
          name="id"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="product-body-text-3-semibold">
                  Connection ID
                </Form.Label>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      className="!product-body-text-2-regular"
                      type="text"
                      placeholder="Connection ID"
                      value={field.value || ""}
                    />
                  </Input.Root>
                </Form.Control>
              </Form.Item>
            );
          }}
        />
        <Form.Field
          control={form.control}
          name="method"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="product-body-text-3-semibold">
                  Method
                </Form.Label>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      className="!product-body-text-2-regular"
                      type="text"
                      placeholder="Method"
                      value={field.value || ""}
                    />
                  </Input.Root>
                </Form.Control>
              </Form.Item>
            );
          }}
        />
        <Form.Field
          control={form.control}
          name="account"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="product-body-text-3-semibold">
                  Account
                </Form.Label>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      className="!product-body-text-2-regular"
                      type="text"
                      placeholder="Account"
                      value={field.value || ""}
                    />
                  </Input.Root>
                </Form.Control>
              </Form.Item>
            );
          }}
        />
        <Form.Field
          control={form.control}
          name="key"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label className="product-body-text-3-semibold">
                  Private Key
                </Form.Label>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      {...field}
                      className="!product-body-text-2-regular"
                      type="text"
                      placeholder="Private Key"
                      value={field.value || ""}
                    />
                  </Input.Root>
                </Form.Control>
              </Form.Item>
            );
          }}
        />
        <div className="mt-3 flex flex-row justify-end gap-x-5">
          {additionalCta}
          <Button
            disabled={isProcessing}
            form={`${connectionFormID}-${id}`}
            variant="primary"
            size="lg"
            type="submit"
          >
            {isProcessing ? (
              <LoadingSpin className="!text-semantic-fg-secondary" />
            ) : (
              "Connect"
            )}
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
