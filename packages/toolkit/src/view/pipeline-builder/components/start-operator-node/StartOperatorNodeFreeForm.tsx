import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import {
  Button,
  Form,
  Icons,
  Input,
  Textarea,
} from "@instill-ai/design-system";
import { UseFormReturn } from "react-hook-form";

import { StartNodeInputType } from "./StartNodeInputType";
import { Nullable, StartOperatorInputType } from "../../../../lib";

export const StartOperatorFreeFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
});

export const StartOperatorNodeFreeForm = ({
  form,
  selectedType,
  setSelectedType,
  onCreateFreeFormField,
  onCancel,
}: {
  form: UseFormReturn<
    z.infer<typeof StartOperatorFreeFormSchema>,
    any,
    undefined
  >;
  selectedType: Nullable<StartOperatorInputType>;
  setSelectedType: React.Dispatch<
    React.SetStateAction<Nullable<StartOperatorInputType>>
  >;
  onCreateFreeFormField: (
    formData: z.infer<typeof StartOperatorFreeFormSchema>
  ) => void;
  onCancel: () => void;
}) => {
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
        <div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-3">
          <StartNodeInputType
            type="string"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "string") {
                setSelectedType(null);
              } else {
                setSelectedType("string");
              }
            }}
          />
          <StartNodeInputType
            type="long_string"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "long_string") {
                setSelectedType(null);
              } else {
                setSelectedType("long_string");
              }
            }}
          />
          <StartNodeInputType
            type="number"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "number") {
                setSelectedType(null);
              } else {
                setSelectedType("number");
              }
            }}
          />
          <StartNodeInputType
            type="image/*"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "image/*") {
                setSelectedType(null);
              } else {
                setSelectedType("image/*");
              }
            }}
          />
          <StartNodeInputType
            type="array:image/*"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "array:image/*") {
                setSelectedType(null);
              } else {
                setSelectedType("array:image/*");
              }
            }}
          />
          <StartNodeInputType
            type="audio/*"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "audio/*") {
                setSelectedType(null);
              } else {
                setSelectedType("audio/*");
              }
            }}
          />
          <StartNodeInputType
            type="boolean"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "boolean") {
                setSelectedType(null);
              } else {
                setSelectedType("boolean");
              }
            }}
          />
        </div>
        <div
          className={cn(
            selectedType ? "" : "hidden",
            "flex flex-col space-y-3"
          )}
        >
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
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        className="!h-5 !text-sm"
                        placeholder="My prompt"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description text="The key of this field will be automatically generated. The title will be lowercase, all the special characters will be removed and the spaces will be replaced with underscore" />
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
