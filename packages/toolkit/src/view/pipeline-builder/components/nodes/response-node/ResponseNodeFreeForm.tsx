"use client";

import * as React from "react";
import * as z from "zod";
import { Button, Form, Icons, Input } from "@instill-ai/design-system";

import { InstillErrors } from "../../../../../constant";
import { constructFieldKey } from "../trigger-node/constructFieldKey";
import { SmartHintFields } from "../../../../../lib/use-instill-form/components";
import { validateInstillID } from "../../../../../server";

export const ResponseNodeFreeFormSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(32, { message: "Title must be less than 32 characters" }),
    key: z
      .string()
      .min(1, { message: "Key is required" })
      .max(32, { message: "Key must be less than 32 characters" }),
    value: z.string(),
  })
  .superRefine((state, ctx) => {
    if (state.key && !validateInstillID(state.key)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: InstillErrors.IDInvalidError,
        path: ["key"],
      });
    }
  });

export const ResponseNodeFreeForm = ({
  form,
  onCreateFreeFormField,
  onCancel,
  isEditing,
}: {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  form: any;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onCreateFreeFormField: (formData: any) => void;
  onCancel: () => void;
  isEditing: boolean;
}) => {
  const [isUserInputKey, setIsUserInputKey] = React.useState<boolean>(false);

  return (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(onCreateFreeFormField)}>
        <div className="mb-3 flex flex-row justify-between">
          <Button
            variant="tertiaryGrey"
            size="sm"
            className="nodrag nowheel !px-2 !py-2"
            type="button"
            onClick={() => {
              onCancel();
            }}
          >
            <Icons.ArrowLeft className="m-auto h-4 w-4 stroke-semantic-fg-secondary" />
          </Button>
          <div>
            <Button
              className="nodrag nowheel"
              variant="primary"
              type="submit"
              size="sm"
            >
              Save
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Form.Field
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label className="!font-sans !text-base !font-semibold">
                    Title
                  </Form.Label>
                  <Form.Control className="h-8">
                    <Input.Root className="!px-[9px] !py-1.5">
                      <Input.Core
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        className="!h-5 !text-sm"
                        placeholder="My prompt"
                        onChange={(event) => {
                          if (!isUserInputKey && !isEditing) {
                            form.setValue(
                              "key",
                              constructFieldKey(event.target.value)
                            );
                          }
                          field.onChange(event);
                        }}
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
            name="key"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label className="!font-sans !text-base !font-semibold">
                    Key
                  </Form.Label>
                  <Form.Control className="h-8">
                    <Input.Root className="!px-[9px] !py-1.5">
                      <Input.Core
                        type="text"
                        value={field.value ?? ""}
                        onChange={(event) => {
                          setIsUserInputKey(true);
                          field.onChange(event);
                        }}
                        autoComplete="off"
                        className="!h-5 !text-sm"
                        placeholder="The key of this field"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description
                    text={
                      isUserInputKey
                        ? ""
                        : "This key's value is now automatically generated based on the title of this field. You can override it by typing in the field."
                    }
                  />
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          <Form.Field
            control={form.control}
            name="value"
            render={() => {
              return (
                <Form.Item>
                  <Form.Label className="!font-sans !text-base !font-semibold">
                    Value
                  </Form.Label>
                  <Form.Control>
                    <SmartHintFields.TextArea
                      path="value"
                      form={form}
                      title={null}
                      description={null}
                      disabled={false}
                      instillAcceptFormats={["*/*"]}
                      instillUpstreamTypes={["value", "reference", "template"]}
                      componentID="end"
                    />
                  </Form.Control>
                </Form.Item>
              );
            }}
          />
        </div>
      </form>
    </Form.Root>
  );
};
