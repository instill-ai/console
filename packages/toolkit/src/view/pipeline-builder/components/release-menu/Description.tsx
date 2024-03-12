"use client";

import { Form, Textarea } from "@instill-ai/design-system";
import { UseReleasePipelineFormReturn } from "./ReleaseMenu";

export const Description = ({
  form,
}: {
  form: UseReleasePipelineFormReturn;
}) => {
  return (
    <Form.Field
      control={form.control}
      name="description"
      render={({ field }) => {
        return (
          <Form.Item className="w-full">
            <div className="flex flex-row justify-between">
              <Form.Label className="product-body-text-3-semibold">
                Description
              </Form.Label>
              <p className="text-semantic-fg-disabled product-body-text-4-regular">
                Optional
              </p>
            </div>
            <Form.Control>
              <Textarea
                {...field}
                value={field.value ?? ""}
                autoComplete="off"
                placeholder="Add a short description of changes in this release"
                className="!resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-3-regular focus-visible:!ring-1"
              />
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
