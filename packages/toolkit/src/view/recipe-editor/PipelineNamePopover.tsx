"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Nullable,
  PipelineSharing,
  UpdateNamespacePipelineRequest,
} from "instill-sdk";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Form,
  Icons,
  Input,
  Popover,
  RadioGroup,
  Separator,
} from "@instill-ai/design-system";

import { LoadingSpin } from "../../components";
import {
  InstillStore,
  useInstillStore,
  useRenameNamespacePipeline,
  useRouteInfo,
  useShallow,
  useUpdateNamespacePipeline,
} from "../../lib";

const pipelineNameSchema = z.object({
  id: z.string().min(1, "Pipeline name is required"),
  isPublic: z.enum(["true", "false"]),
});

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const PipelineNamePopover = ({
  sharing,
}: {
  sharing: Nullable<PipelineSharing>;
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const form = useForm<z.infer<typeof pipelineNameSchema>>({
    resolver: zodResolver(pipelineNameSchema),
  });

  const pipelineIsPublic = React.useMemo(() => {
    return sharing?.users["*/*"]?.enabled ?? false;
  }, [sharing]);

  const { accessToken } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  React.useEffect(() => {
    if (!routeInfo.isSuccess || !routeInfo.data.resourceId) {
      return;
    }
    form.reset({
      id: routeInfo.data.resourceId,
      isPublic: pipelineIsPublic ? "true" : "false",
    });
  }, [routeInfo.isSuccess, routeInfo.data.resourceId, form, pipelineIsPublic]);

  const renamePipeline = useRenameNamespacePipeline();
  const updatePipeline = useUpdateNamespacePipeline();
  const onSubmit = async (formData: z.infer<typeof pipelineNameSchema>) => {
    if (
      !routeInfo.isSuccess ||
      !routeInfo.data.resourceId ||
      !routeInfo.data.pipelineName ||
      sharing === null
    ) {
      return;
    }

    const currentPipelineId = routeInfo.data.resourceId;

    if (String(pipelineIsPublic) !== formData.isPublic) {
      const payload: UpdateNamespacePipelineRequest = {
        namespacePipelineName: `${routeInfo.data.namespaceName}/pipelines/${formData.id}`,
        sharing: {
          ...sharing,
          users: {
            "*/*": {
              role: sharing.users["*/*"]?.role ?? "ROLE_EXECUTOR",
              enabled: formData.isPublic === "true",
            },
          },
        },
      };

      try {
        await updatePipeline.mutateAsync({
          ...payload,
          accessToken,
        });
      } catch (error) {
        setSaving(false);
        setOpen(false);
        form.reset({ id: currentPipelineId });
      }
    }

    if (currentPipelineId !== formData.id) {
      try {
        await renamePipeline.mutateAsync({
          payload: {
            namespacePipelineName: routeInfo.data.pipelineName,
            newPipelineId: formData.id,
          },
          accessToken,
        });

        router.push(
          `/${routeInfo.data.namespaceId}/pipelines/${formData.id}/low-code`,
        );
        setOpen(false);
      } catch (error) {
        setSaving(false);
        setOpen(false);
        form.reset({ id: currentPipelineId });
      }
    }
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={async (newOpen) => {
        if (open === true && newOpen === false) {
          await onSubmit(form.getValues());
        }
        setOpen(newOpen);
      }}
    >
      <Popover.Trigger asChild>
        {routeInfo.isSuccess ? (
          <Button className="flex !h-8 flex-row gap-x-2" variant="tertiaryGrey">
            <p className="cursor-pointer text-semantic-fg-primary product-body-text-3-semibold">
              {routeInfo.data.resourceId}
            </p>
            <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary" />
          </Button>
        ) : null}
      </Popover.Trigger>
      <Popover.Content align="start" className="flex flex-col !w-[320px]">
        <Form.Root {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <div className="flex flex-col">
              <Form.Field
                control={form.control}
                name="id"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-full mb-6">
                      <Form.Label className="product-body-text-3-semibold">
                        Name
                        {saving ? <LoadingSpin /> : null}
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            {...field}
                            type="text"
                            className="!product-body-text-2-regular"
                            value={field.value ?? ""}
                            autoComplete="off"
                          />
                        </Input.Root>
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  );
                }}
              />
              <Separator orientation="horizontal" />
              <div className="flex flex-col py-4">
                <Form.Field
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => {
                    return (
                      <Form.Item className="w-full">
                        <Form.Control>
                          <RadioGroup.Root
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <Form.Item className="flex flex-row gap-x-3 !space-x-0 !space-y-0 justify-center">
                              <Form.Control>
                                <RadioGroup.Item
                                  className="my-auto"
                                  value="true"
                                />
                              </Form.Control>
                              <Form.Label className="flex flex-row gap-x-3">
                                <div className="w-4 h-4 shrink-0 flex my-auto">
                                  <Icons.BookOpen02 className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
                                </div>
                                <div className="flex flex-col gap-y-1">
                                  <p className="text-semantic-fg-primary product-body-text-3-semibold">
                                    Public
                                  </p>
                                  <p className="text-semantic-fg-secondary product-body-text-4-regular">
                                    Anyone on the internet can see and run this
                                    pipeline.
                                  </p>
                                </div>
                              </Form.Label>
                            </Form.Item>
                            <Form.Item className="flex flex-row gap-x-3 !space-x-0 !space-y-0 justify-center">
                              <Form.Control>
                                <RadioGroup.Item
                                  className="my-auto"
                                  value="false"
                                />
                              </Form.Control>
                              <Form.Label className="flex flex-row gap-x-3">
                                <div className="w-4 h-4 shrink-0 flex my-auto">
                                  <Icons.Lock03 className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
                                </div>
                                <div className="flex flex-col gap-y-1">
                                  <p className="text-semantic-fg-primary product-body-text-3-semibold">
                                    Private
                                  </p>
                                  <p className="text-semantic-fg-secondary product-body-text-4-regular">
                                    Only you and your team members can see and
                                    run this pipeline.
                                  </p>
                                </div>
                              </Form.Label>
                            </Form.Item>
                          </RadioGroup.Root>
                        </Form.Control>
                      </Form.Item>
                    );
                  }}
                />
              </div>
            </div>
          </form>
        </Form.Root>
      </Popover.Content>
    </Popover.Root>
  );
};
