import * as z from "zod";
import {
  Form,
  Icons,
  ParagraphWithHTML,
  Tooltip,
} from "@instill-ai/design-system";
import { UseFormReturn } from "react-hook-form";
import { ReleasePipelineFormSchema } from "./DialogPublishPipeline";

export const Metadata = ({
  form,
}: {
  form: UseFormReturn<
    z.infer<typeof ReleasePipelineFormSchema>,
    any,
    undefined
  >;
}) => {
  return (
    <div className="w-full px-8 py-3">
      <div className="flex w-full flex-col rounded-[12px] border border-semantic-bg-line shadow">
        <div className="border-b border-semantic-bg-line px-6 pt-2">
          <div className="flex flex-row gap-x-2 py-[9px] pr-3">
            <p className="text-semantic-fg-secondary product-button-button-2">
              Pipeline Metadata
            </p>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Icons.HelpCircle className="my-auto h-[14px] w-[14px] cursor-pointer stroke-semantic-fg-secondary" />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="w-[360px]"
                    sideOffset={5}
                    side="top"
                  >
                    <div className="!rounded-sm !bg-semantic-bg-primary !px-3 !py-2">
                      <ParagraphWithHTML
                        text=""
                        className="break-all text-semantic-fg-primary product-body-text-4-semibold"
                      />
                    </div>
                    <Tooltip.Arrow
                      className="fill-white"
                      offset={5}
                      width={9}
                      height={6}
                    />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
        <div className="grid w-full grid-cols-3 gap-5">
          <Form.Field
            control={form.control}
            name="tags"
            render={({ field }) => {
              return (
                <Form.Item>
                  <div className="flex flex-row gap-x-2">
                    <Form.Label className="!product-body-text-3-semibold">
                      Tags
                    </Form.Label>
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Icons.HelpCircle className="my-auto h-[14px] w-[14px] cursor-pointer stroke-semantic-fg-secondary" />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="w-[360px]"
                            sideOffset={5}
                            side="top"
                          >
                            <div className="!rounded-sm !bg-semantic-bg-primary !px-3 !py-2">
                              <ParagraphWithHTML
                                text=""
                                className="break-all text-semantic-fg-primary product-body-text-4-semibold"
                              />
                            </div>
                            <Tooltip.Arrow
                              className="fill-white"
                              offset={5}
                              width={9}
                              height={6}
                            />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <Form.Control></Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};
