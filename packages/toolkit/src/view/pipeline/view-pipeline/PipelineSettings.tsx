"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Form,
  Textarea,
  useToast,
} from "@instill-ai/design-system";

import {
  Nullable,
  Pipeline,
  sendAmplitudeData,
  toastInstillError,
  UpdateUserPipelinePayload,
  useAmplitudeCtx,
  useInstillStore,
  useRouteInfo,
  useUpdateUserPipeline,
} from "../../../lib";
import { LoadingSpin } from "../../../components";

const PipelineSettingsSchema = z.object({
  description: z.string().optional().nullable(),
});

export const PipelineSettings = ({
  pipeline,
  onUpdate,
}: {
  pipeline: Nullable<Pipeline>;
  onUpdate: () => void;
}) => {
  const [updating, setUpdating] = React.useState(false);
  const { amplitudeIsInit } = useAmplitudeCtx();
  const defaultValues = React.useMemo(() => {
    if (!pipeline) {
      return undefined;
    }

    return {
      description: pipeline.description,
    };
  }, [pipeline]);
  const form = useForm<z.infer<typeof PipelineSettingsSchema>>({
    resolver: zodResolver(PipelineSettingsSchema),
    values: defaultValues,
  });

  const { reset } = form;

  React.useEffect(() => {
    reset({ description: pipeline?.description });
  }, [pipeline, reset]);

  const accessToken = useInstillStore((store) => store.accessToken);
  const { toast } = useToast();
  const routeInfo = useRouteInfo();

  const updateUserPipeline = useUpdateUserPipeline();
  async function onSubmit(data: z.infer<typeof PipelineSettingsSchema>) {
    if (!routeInfo.isSuccess || !routeInfo?.data.pipelineName || !accessToken)
      return;

    const payload: UpdateUserPipelinePayload = {
      name: routeInfo.data.pipelineName,
      description: data.description ?? undefined,
    };

    try {
      setUpdating(true);

      await updateUserPipeline.mutateAsync({ payload, accessToken });

      onUpdate();

      setUpdating(false);

      if (amplitudeIsInit) {
        sendAmplitudeData("update_pipeline_description");
      }

      toast({
        size: "small",
        title: "Update pipeline metadata successfully",
        variant: "alert-success",
      });
    } catch (error) {
      setUpdating(false);

      toastInstillError({
        title:
          "Something went wrong, Please refresh the page and try again later",
        error,
        toast,
      });
    }
  }

  const formId = "edit-pipeline-form";

  return (
    <div className="mt-1 flex flex-col xl:w-1/2">
      <Form.Root {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
          <div className="flex flex-col gap-y-10">
            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label className="product-body-text-3-semibold">
                      Description
                    </Form.Label>
                    <Form.Control>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        autoComplete="off"
                        placeholder="A short description of your pipeline"
                        className="!resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-2-regular focus-visible:!ring-1"
                      />
                    </Form.Control>
                  </Form.Item>
                );
              }}
            />
          </div>
          <div className="pb-14 pt-12">
            <Button
              disabled={!pipeline?.permission.canEdit || updating}
              form={formId}
              variant="primary"
              size="lg"
              type="submit"
            >
              {updating ? (
                <LoadingSpin className="!text-semantic-fg-secondary" />
              ) : (
                "Update Pipeline"
              )}
            </Button>
          </div>
        </form>
      </Form.Root>
    </div>
  );
};
