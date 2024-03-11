import * as React from "react";
import * as z from "zod";
import {
  Button,
  Dialog,
  Form,
  Icons,
  ParagraphWithHTML,
  Textarea,
  Tooltip,
  useToast,
} from "@instill-ai/design-system";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Nullable,
  UpdateUserPipelinePayload,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useEntity,
  useInstillStore,
  useUpdateUserPipeline,
} from "../../../lib";

const PipelineEditMetadataSchema = z.object({
  description: z.string().optional().nullable(),
});

export const EditMetadataDialog = ({
  description,
}: {
  description: Nullable<string>;
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof PipelineEditMetadataSchema>>({
    resolver: zodResolver(PipelineEditMetadataSchema),
  });

  const { reset } = form;

  React.useEffect(() => {
    reset({ description });
  }, [description, reset]);

  const accessToken = useInstillStore((store) => store.accessToken);
  const { toast } = useToast();

  const entityObject = useEntity();

  const updateUserPipeline = useUpdateUserPipeline();
  async function onSubmit(data: z.infer<typeof PipelineEditMetadataSchema>) {
    if (!entityObject.isSuccess || !accessToken) return;

    const payload: UpdateUserPipelinePayload = {
      name: entityObject.pipelineName,
      description: data.description ?? undefined,
    };

    try {
      await updateUserPipeline.mutateAsync({ payload, accessToken });

      if (amplitudeIsInit) {
        sendAmplitudeData("update_pipeline_description");
      }

      setOpen(false);
      toast({
        size: "small",
        title: "Update pipeline metadata successfully",
        variant: "alert-success",
      });
    } catch (error) {
      toastInstillError({
        title:
          "Something went wrong, Please refresh the page and try again later",
        error,
        toast,
      });
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger asChild>
        <Button variant="tertiaryGrey" size="sm" className="gap-x-2">
          <Icons.Edit05 className="h-3 w-3 stroke-semantic-fg-primary" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="!w-[400px] !p-0"
      >
        <div className="flex flex-col">
          <div className="flex w-full border-b border-semantic-bg-line px-6 py-6 pb-5">
            <p className="mr-auto text-semantic-fg-primary product-body-text-1-semibold">
              Edit pipeline metadata
            </p>
            <Dialog.Close className="!static !h-6 !w-6" />
          </div>
          <div className="px-6 pb-6 pt-5">
            <Form.Root {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-8 flex flex-col">
                  <Form.Field
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <div className="flex flex-row gap-x-2">
                            <Form.Label className="!product-body-text-3-semibold">
                              Short description
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
                                        text="This is the short description of your pipeline. It will be displayed in the pipeline list."
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
                          <Form.Control>
                            <Textarea
                              {...field}
                              className="product-body-text-3-medium"
                              value={field.value ?? ""}
                            />
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      );
                    }}
                  />
                </div>
                <div className="flex flex-row-reverse">
                  <Button type="submit" variant="primary" size="lg">
                    Save
                  </Button>
                </div>
              </form>
            </Form.Root>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
