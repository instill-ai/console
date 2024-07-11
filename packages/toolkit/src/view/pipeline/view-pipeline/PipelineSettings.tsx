"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Form,
  Icons,
  Input,
  RadioGroup,
  Textarea,
  useToast,
} from "@instill-ai/design-system";

import { LoadingSpin, UploadImageFieldWithCrop } from "../../../components";
import {
  Nullable,
  PermissionRole,
  Pipeline,
  sendAmplitudeData,
  toastInstillError,
  UpdateUserPipelinePayload,
  useAmplitudeCtx,
  useInstillStore,
  useRouteInfo,
  useUpdateUserPipeline,
} from "../../../lib";

const PipelineSettingsSchema = z.object({
  description: z.string().optional(),
  sourceUrl: z.literal("").or(z.string().url()),
  documentationUrl: z.literal("").or(z.string().url()),
  license: z.literal("").or(z.string().url()),
  profileImage: z.string().optional(),
  isPublic: z.string(),
  tags: z.string().optional(),
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
      sourceUrl: pipeline.sourceUrl,
      documentationUrl: pipeline.documentationUrl,
      license: pipeline.license,
      profileImage: pipeline.profileImage,
      isPublic: (!!pipeline.sharing.users["*/*"]?.enabled).toString(),
      tags: pipeline.tags.join(", "),
    };
  }, [pipeline]);
  const form = useForm<z.infer<typeof PipelineSettingsSchema>>({
    resolver: zodResolver(PipelineSettingsSchema),
    values: defaultValues,
  });

  const accessToken = useInstillStore((store) => store.accessToken);
  const { toast } = useToast();
  const routeInfo = useRouteInfo();

  const updateUserPipeline = useUpdateUserPipeline();
  async function onSubmit(data: z.infer<typeof PipelineSettingsSchema>) {
    if (!routeInfo.isSuccess || !routeInfo?.data.pipelineName || !accessToken) {
      return;
    }

    const sharing = {
      shareCode: pipeline?.sharing.shareCode || null,
      users: {
        "*/*": {
          enabled: !!pipeline?.sharing.users["*/*"]?.enabled,
          role:
            pipeline?.sharing.users["*/*"]?.role ||
            ("ROLE_EXECUTOR" as PermissionRole),
        },
      },
    };

    const payload: UpdateUserPipelinePayload = {
      name: routeInfo.data.pipelineName,
      description: data.description ?? undefined,
      sourceUrl: data.sourceUrl,
      documentationUrl: data.documentationUrl,
      license: data.license,
      profileImage: data.profileImage,
      sharing: {
        ...sharing,
        users: {
          "*/*": {
            ...sharing.users["*/*"],
            enabled: data.isPublic === "true",
          },
        },
      },
      tags:
        data.tags
          ?.trim()
          .split(",")
          .map((item) => item.trim()) || [],
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
            <Form.Field
              control={form.control}
              name="sourceUrl"
              render={({ field }) => {
                return (
                  <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                    <Form.Label className="product-body-text-3-semibold">
                      GitHub
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="!product-body-text-2-regular"
                          type="text"
                          placeholder="GitHub repo url"
                          required={false}
                          value={field.value || ""}
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
              name="documentationUrl"
              render={({ field }) => {
                return (
                  <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                    <Form.Label className="product-body-text-3-semibold">
                      Link
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="!product-body-text-2-regular"
                          type="text"
                          placeholder="Documentation or other relevant url"
                          required={false}
                          value={field.value || ""}
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
              name="license"
              render={({ field }) => {
                return (
                  <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                    <Form.Label className="product-body-text-3-semibold">
                      License
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="!product-body-text-2-regular"
                          type="text"
                          placeholder="Model license url"
                          required={false}
                          value={field.value || ""}
                        />
                      </Input.Root>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
            <UploadImageFieldWithCrop
              fieldName="profileImage"
              form={form}
              title="Cover image"
            />
            <RadioGroup.Root
              onValueChange={(value: "true" | "false") => {
                form.setValue("isPublic", value);
              }}
              className="!flex flex-col gap-y-4"
              defaultValue={(form.getValues("isPublic") || false).toString()}
            >
              <div className="flex items-center space-x-3">
                <label htmlFor="radio-public" className="flex flex-row gap-x-3">
                  <RadioGroup.Item
                    className="my-auto"
                    value="true"
                    id="radio-public"
                  />
                  <Icons.BookOpen02 className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
                  <div className="flex flex-col gap-y-1">
                    <p className="text-semantic-fg-primary product-body-text-3-semibold">
                      Public
                    </p>
                    <p className="text-semantic-fg-secondary product-body-text-4-regular">
                      Anyone on the internet can see and run this pipeline.
                    </p>
                  </div>
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <label
                  htmlFor="radio-private"
                  className="flex flex-row gap-x-3"
                >
                  <RadioGroup.Item
                    className="my-auto"
                    value="false"
                    id="radio-private"
                  />
                  <Icons.Lock03 className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
                  <div className="flex flex-col gap-y-1">
                    <p className="text-semantic-fg-primary product-body-text-3-semibold">
                      Private
                    </p>
                    <p className="text-semantic-fg-secondary product-body-text-4-regular">
                      Only you and your team members can see and run this
                      pipeline.
                    </p>
                  </div>
                </label>
              </div>
            </RadioGroup.Root>
            <Form.Field
              control={form.control}
              name="tags"
              render={({ field }) => {
                return (
                  <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                    <Form.Label className="product-body-text-3-semibold">
                      Tags
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="!product-body-text-2-regular"
                          type="text"
                          placeholder="Add a tag"
                          required={false}
                          value={field.value || ""}
                        />
                      </Input.Root>
                    </Form.Control>
                    <Form.Message />
                    <p className="text-xs text-semantic-fg-secondary">
                      {`Separate tags with a comma.`}
                    </p>
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
