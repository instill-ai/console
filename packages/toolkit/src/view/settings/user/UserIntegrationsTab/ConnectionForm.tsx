import { InstillJSONSchema, IntegrationMethod } from "instill-sdk";

import { Button, cn, Form } from "@instill-ai/design-system";

import { LoadingSpin } from "../../../../components";
import { useInstillForm } from "../../../../lib";

export const connectionFormID = "connection-form";

export const ConnectionForm = ({
  id,
  onSubmit,
  className,
  isProcessing,
  additionalCta,
  schema,
  method,
}: {
  id: string;
  onSubmit: (props: {
    method: IntegrationMethod;
    payload: Record<string, unknown>;
  }) => Promise<void>;
  className?: string;
  isProcessing: boolean;
  additionalCta?: React.ReactNode;
  schema?: InstillJSONSchema;
  method: IntegrationMethod;
}) => {
  const { fields, form } = useInstillForm(schema || null, null);

  const onFormSubmit = (payload: Record<string, unknown>) => {
    onSubmit({
      method,
      payload,
    });
  };

  return (
    <Form.Root {...form}>
      <form
        id={`${connectionFormID}-${id}`}
        onSubmit={form.handleSubmit(onFormSubmit)}
        className={cn("flex flex-col gap-y-3", className)}
      >
        {fields}
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
