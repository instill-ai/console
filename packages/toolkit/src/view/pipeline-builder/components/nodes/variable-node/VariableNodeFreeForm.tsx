"use client";

import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Form,
  Icons,
  Input,
  Textarea,
} from "@instill-ai/design-system";

import { InstillErrors } from "../../../../../constant";
import { Nullable } from "../../../../../lib";
import { validateInstillVariableAndOutputKey } from "../../../../../server";
import { constructFieldKey } from "./constructFieldKey";
import { VariableNodeTypeSelect } from "./VariableNodeTypeSelect";

export const TriggerNodeFreeFormSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(32, { message: "Title must be less than 32 characters" }),
    key: z
      .string()
      .min(1, { message: "Key is required" })
      .max(32, { message: "Key must be less than 32 characters" }),

    description: z.string().optional(),
  })
  .superRefine((state, ctx) => {
    if (state.key && !validateInstillVariableAndOutputKey(state.key)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: InstillErrors.VariableAndOutputKeyInvalidError,
        path: ["key"],
      });
    }
  });

export const TriggerNodeFreeForm = ({
  form,
  selectedType,
  setSelectedType,
  onCreateFreeFormField,
  onCancel,
  isEditing,
}: {
  form: UseFormReturn<
    z.infer<typeof TriggerNodeFreeFormSchema>,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    any,
    z.infer<typeof TriggerNodeFreeFormSchema>
  >;
  selectedType: Nullable<string>;
  setSelectedType: React.Dispatch<React.SetStateAction<Nullable<string>>>;
  onCreateFreeFormField: (
    formData: z.infer<typeof TriggerNodeFreeFormSchema>,
  ) => void;
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
            className="!px-2 !py-2"
            type="button"
            onClick={() => {
              onCancel();
            }}
          >
            <Icons.ArrowLeft className="m-auto h-4 w-4 stroke-semantic-fg-secondary" />
          </Button>
          <div>
            <Button variant="primary" type="submit" size="sm">
              Save
            </Button>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-y-2">
          <label
            htmlFor="input_type"
            className="font-sans text-base font-semibold text-semantic-fg-primary"
          >
            Input Type
          </label>
          <VariableNodeTypeSelect
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            id="input_type"
          />
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
                              constructFieldKey(event.target.value),
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
                  <div className="flex flex-col rounded bg-semantic-accent-bg px-1 py-2">
                    <p className="text-semantic-accent-default product-body-text-3-semibold">
                      What is a reference?
                    </p>
                    <p className="mb-3 text-semantic-accent-default product-body-text-3-regular">
                      {"A reference is a syntax help you connect to other value in given field. " +
                        "You can use the key ${variable." +
                        `${form.watch("key") ? form.watch("key") : "my_prompt"}` +
                        "} to reference this value"}
                    </p>
                    <div className="flex">
                      <div className="mb-2 flex flex-row items-center gap-x-1 rounded-full border border-semantic-accent-default bg-semantic-accent-bg px-2 py-0.5">
                        <Icons.ReferenceIconCheck className="h-[9px] w-[18px] stroke-semantic-accent-default" />
                        <p className="font-sans text-[10px] font-medium text-semantic-accent-default">{`variable.${form.watch("key") ? form.watch("key") : "my_prompt"}`}</p>
                      </div>
                    </div>
                  </div>
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
                  <Form.Label className="!font-sans !text-base !font-semibold">
                    Description
                  </Form.Label>
                  <Form.Control>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      className="h-[100px] !resize-none !text-sm"
                    />
                  </Form.Control>
                  <Form.Description text="The description of this field" />
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>
      </form>
    </Form.Root>
  );
};
