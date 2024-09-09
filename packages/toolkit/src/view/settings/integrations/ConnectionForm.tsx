"use client";

import * as React from "react";
import {
  GeneralRecord,
  InstillJSONSchema,
  IntegrationMethod,
} from "instill-sdk";
import { z } from "zod";

import { Button, cn, Form, Input, useToast } from "@instill-ai/design-system";

import { LoadingSpin } from "../../../components";
import { useInstillForm } from "../../../lib";
import { FieldDescriptionTooltip } from "../../../lib/use-instill-form/components/common";
import { recursiveHelpers } from "../../pipeline-builder";

export const connectionFormID = "connection-form";

export const ConnectionForm = ({
  id,
  onSubmit,
  className,
  isProcessing,
  additionalCta,
  schema,
  method,
  values,
  isEdit,
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
  values?: GeneralRecord;
  isEdit?: boolean;
}) => {
  const { toast } = useToast();
  const { fields, form, ValidatorSchema } = useInstillForm(
    schema || null,
    values || null,
  );
  const [connectionId, setConnectionId] = React.useState("");

  React.useEffect(() => {
    if (values?.id) {
      setConnectionId(values.id);
    }
  }, [values]);

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
        toast({
          title: "There was an error creating a connection",
          variant: "alert-error",
          size: "large",
          description: err.issues.reduce(
            (acc, curr, index) =>
              `${acc}${index > 0 ? `\n` : ""}${curr.message}`,
            "",
          ),
        });
      }

      return;
    }

    parsedData = recursiveHelpers.removeUndefinedAndNullFromArray(
      recursiveHelpers.replaceNullAndEmptyStringWithUndefined(parsedData),
    );

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
        className={cn("flex flex-col gap-y-3 px-[1px]", className)}
      >
        <div className="flex flex-col gap-y-3 overflow-y-auto">
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
                        defaultValue={form.getValues("id")}
                        disabled={isEdit}
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
        </div>
        <div className="flex flex-row justify-end gap-x-5">
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
            ) : !isEdit ? (
              "Connect"
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
