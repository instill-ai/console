import * as React from "react";
import * as z from "zod";
import { Nullable } from "../../../../../lib";
import { UseFormReturn } from "react-hook-form";
import { PublishPipelineFormSchema } from "./PublishPipelineDialog";
import { Form } from "@instill-ai/design-system";

export const ReadmeEditor = ({
  form,
  readme,
}: {
  form: UseFormReturn<
    z.infer<typeof PublishPipelineFormSchema>,
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    any,
    undefined
  >;
  readme: Nullable<string>;
}) => {
  return (
    <Form.Field
      control={form.control}
      name="readme"
      render={() => {
        return (
          <Form.Item className="h-full w-full flex-1 px-8">
            <Form.Control>
              <div className="h-full rounded-[12px] border border-semantic-bg-line"></div>
            </Form.Control>
            <Form.Message />
          </Form.Item>
        );
      }}
    />
  );
};
