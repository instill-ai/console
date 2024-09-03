import * as React from "react";
import { InstillJSONSchema, IntegrationMethod } from "instill-sdk";
import { z } from "zod";

import { Button, cn, Form, Input } from "@instill-ai/design-system";

import { LoadingSpin } from "../../../../components";
import { useInstillForm } from "../../../../lib";
import { FieldDescriptionTooltip } from "../../../../lib/use-instill-form/components/common";

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
    id: string;
  }) => Promise<void>;
  className?: string;
  isProcessing: boolean;
  additionalCta?: React.ReactNode;
  schema?: InstillJSONSchema;
  method: IntegrationMethod;
}) => {
  const { fields, form, ValidatorSchema } = useInstillForm(
    schema || null,
    null,
  );
  const [connectionId, setConnectionId] = React.useState("");

  const onFormSubmit = (payload: Record<string, unknown>) => {
    const id = connectionId.trim();

    if (!id) {
      form.setError("id", {
        message: "The component ID is required to create a connection!",
      });

      return;
    }

    if (!/^[a-z_][a-z0-9_-]{0,31}$/.test(id)) {
      form.setError("id", {
        message:
          "The ID must start with a lowercase letter or underscore, followed by lowercase letters, numbers, hyphens, or underscores, and have the maximum length of 31.",
      });

      return;
    }

    form.clearErrors();

    let parsedData;

    try {
      parsedData = ValidatorSchema.parse(payload);
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log(err);
      }

      return;
    }

    onSubmit({
      method,
      id,
      payload: parsedData,
    });
  };

  return (
    <Form.Root {...form}>
      <form
        id={`${connectionFormID}-${id}`}
        onSubmit={form.handleSubmit(onFormSubmit)}
        className={cn("flex flex-col gap-y-3", className)}
      >
        <Form.Field
          control={form.control}
          name="id"
          render={({ field }) => {
            return (
              <Form.Item>
                <div className="flex flex-row gap-x-2">
                  <Form.Label htmlFor={field.name}>ID *</Form.Label>
                  <FieldDescriptionTooltip description="The component definition ID" />
                </div>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      id={field.name}
                      className="nodrag nowheel placeholder:text-semantic-fg-disabled"
                      type="text"
                      onChange={(event) => {
                        setConnectionId(event.target.value);
                      }}
                    />
                  </Input.Root>
                </Form.Control>
                <Form.Description
                  className="nodrag nopan cursor-text select-text"
                  text="The component definition ID"
                />
                <Form.Message />
              </Form.Item>
            );
          }}
        />
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
