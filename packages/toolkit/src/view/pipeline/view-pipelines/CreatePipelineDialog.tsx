"use client";

import * as React from "react";
import cn from "clsx";
import * as z from "zod";
import {
  Button,
  Dialog,
  Form,
  Icons,
  Input,
  RadioGroup,
  Select,
  Separator,
  Tag,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateUserPipelinePayload,
  InstillStore,
  Nullable,
  PipelineSharing,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useAuthenticatedUser,
  useCreateUserPipeline,
  useAppEntity,
  useInstillStore,
  useShallow,
  useUserMemberships,
} from "../../../lib";
import { InstillErrors, DataTestID } from "../../../constant";
import { LoadingSpin } from "../../../components";
import { env, validateInstillID } from "../../../server";
import { useRouter } from "next/navigation";

const CreatePipelineSchema = z
  .object({
    id: z.string(),
    namespaceId: z.string(),
    description: z.string().optional().nullable(),
  })
  .superRefine((state, ctx) => {
    if (!validateInstillID(state.id)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: InstillErrors.IDInvalidError,
        path: ["id"],
      });
    }
  });

type Permission = "public" | "private";

export type CreatePipelineDialogProps = {
  limitedPrivatePipeline: boolean;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const CreatePipelineDialog = ({ className }: { className?: string }) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [open, setOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [permission, setPermission] =
    React.useState<Nullable<Permission>>("private");
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof CreatePipelineSchema>>({
    resolver: zodResolver(CreatePipelineSchema),
    mode: "onChange",
  });

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const entity = useAppEntity();

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const userMemberships = useUserMemberships({
    enabled: entity.isSuccess,
    userID: me.isSuccess ? me.data.id : null,
    accessToken,
  });

  const organizationsAndUserList = React.useMemo(() => {
    if (!userMemberships.isSuccess || !entity.isSuccess) {
      return [];
    }

    const orgsAndUserList: {
      id: string;
      name: string;
      type: "user" | "organization";
    }[] = [];

    userMemberships.data.forEach((org) => {
      orgsAndUserList.push({
        id: org.organization.id,
        name: org.organization.name,
        type: "organization",
      });
    });

    if (entity.data.entity && entity.data.entityName) {
      orgsAndUserList.push({
        id: entity.data.entity,
        name: entity.data.entityName,
        type: "user",
      });
    }

    return orgsAndUserList;
  }, [
    userMemberships.isSuccess,
    userMemberships.data,
    entity.isSuccess,
    entity.data,
  ]);

  const createPipeline = useCreateUserPipeline();
  async function onSubmit(data: z.infer<typeof CreatePipelineSchema>) {
    if (!entity.isSuccess) {
      return;
    }

    setCreating(true);

    const sharing: PipelineSharing =
      permission === "public"
        ? {
            users: {
              "*/*": {
                enabled: true,
                role: "ROLE_EXECUTOR",
              },
            },
            share_code: null,
          }
        : {
            users: {
              "*/*": {
                enabled: false,
                role: "ROLE_EXECUTOR",
              },
            },
            share_code: null,
          };

    const payload: CreateUserPipelinePayload = {
      id: data.id,
      description: data.description ?? undefined,
      recipe: {
        version: "v1beta",
        components: [
          {
            id: "start",
            start_component: {
              fields: {},
            },
          },
          {
            id: "end",
            end_component: {
              fields: {},
            },
          },
        ],
      },
      metadata: {},
      sharing,
    };

    const namespace = organizationsAndUserList.find(
      (account) => account.id === data.namespaceId
    )?.name;

    if (namespace) {
      try {
        await createPipeline.mutateAsync({
          accessToken,
          entityName: namespace,
          payload,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("create_pipeline");
        }

        router.push(`/${data.namespaceId}/pipelines/${data.id}/builder`);
      } catch (error) {
        setCreating(false);
        toastInstillError({
          title: "Failed to create pipeline",
          error,
          toast,
        });
      }
    } else {
      setCreating(false);
      toastInstillError({
        title: "Failed to create pipeline",
        error: null,
        toast,
      });
    }
  }

  const formID = "create-new-pipeline-form";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        form.reset({
          id: "",
          description: "",
          namespaceId: entity?.data.entity || "",
        });
        setOpen(open);
      }}
    >
      <Dialog.Trigger asChild>
        <Button
          className={cn("gap-x-2", className)}
          variant="primary"
          size="lg"
        >
          <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
          Create Pipeline
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        data-testid={DataTestID.createPipelineDialog}
        className="!w-[600px] !p-0"
      >
        {entity.isSuccess ? (
          <div className="flex flex-col">
            <div className="flex border-b border-semantic-bg-line p-6">
              <h3 className=" text-semantic-fg-primary product-body-text-1-semibold">
                Create new pipeline
              </h3>
              <Dialog.Close className="!right-6 !top-6" />
            </div>
            <div className="flex flex-col px-6 pt-5">
              <Form.Root {...form}>
                <form id={formID} onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-y-5">
                    <div className="space-y-2">
                      <div className="flex flex-row gap-x-4">
                        <Form.Field
                          control={form.control}
                          name="namespaceId"
                          render={({ field }) => {
                            return (
                              <Form.Item className="w-full">
                                <Form.Label className="product-body-text-3-semibold">
                                  Owner
                                </Form.Label>
                                <Form.Control>
                                  <Select.Root
                                    value={field?.value || ""}
                                    onValueChange={(e) => {
                                      field.onChange(e);
                                      if (form.getValues("id")) {
                                        form.trigger("id");
                                      }
                                    }}
                                  >
                                    <Select.Trigger className="w-full pl-[14px]">
                                      <Select.Value placeholder="Select Account Name">
                                        <div className="flex flex-row gap-x-2">
                                          <span className="my-auto">
                                            {field?.value?.length >= 10
                                              ? field?.value?.slice(0, 10) +
                                                "..."
                                              : field.value}
                                          </span>
                                          <span className="my-auto">
                                            {organizationsAndUserList.find(
                                              (namespace) =>
                                                namespace.id === field.value
                                            )?.type === "organization" ? (
                                              <Tag
                                                variant="lightBlue"
                                                size="sm"
                                                className="!py-0"
                                              >
                                                organization
                                              </Tag>
                                            ) : (
                                              <Tag
                                                size="sm"
                                                className="!py-0"
                                                variant="lightNeutral"
                                              >
                                                user
                                              </Tag>
                                            )}
                                          </span>
                                        </div>
                                      </Select.Value>
                                    </Select.Trigger>
                                    <Select.Content>
                                      <Select.Group>
                                        {organizationsAndUserList.length &&
                                          organizationsAndUserList.map(
                                            (namespace) => (
                                              <Select.Item
                                                value={namespace.id}
                                                key={namespace.id}
                                              >
                                                <div className="flex flex-row gap-x-2">
                                                  <span className="my-auto">
                                                    {namespace.id}
                                                  </span>
                                                  <span className="my-auto">
                                                    {namespace.type ===
                                                    "organization" ? (
                                                      <Tag
                                                        variant="lightBlue"
                                                        size="sm"
                                                        className="!py-0"
                                                      >
                                                        organization
                                                      </Tag>
                                                    ) : (
                                                      <Tag
                                                        size="sm"
                                                        className="!py-0"
                                                        variant="lightNeutral"
                                                      >
                                                        user
                                                      </Tag>
                                                    )}
                                                  </span>
                                                </div>
                                              </Select.Item>
                                            )
                                          )}
                                      </Select.Group>
                                    </Select.Content>
                                  </Select.Root>
                                </Form.Control>
                                <Form.Message />
                              </Form.Item>
                            );
                          }}
                        />

                        <span className="pt-[30px] text-2xl text-semantic-fg-disabled">
                          /
                        </span>

                        <Form.Field
                          control={form.control}
                          name="id"
                          render={({ field }) => {
                            return (
                              <Form.Item className="w-full">
                                <Form.Label className="product-body-text-3-semibold">
                                  Pipeline Name
                                </Form.Label>
                                <Form.Control>
                                  <Input.Root>
                                    <Input.Core
                                      {...field}
                                      className="pl-2 !product-body-text-2-regular"
                                      type="text"
                                      placeholder="Pipeline name"
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
                      </div>
                      <p className="text-semantic-fg-secondary product-body-text-3-regular">
                        <span>Your pipeline URL in Instill AI will be:</span>
                        <span className="ml-2 break-all product-body-text-3-semibold">
                          {form.watch("id") !== "" && form.watch("id")
                            ? `${env(
                                "NEXT_PUBLIC_CONSOLE_BASE_URL"
                              )}/${form.getValues(
                                "namespaceId"
                              )}/pipelines/${form.getValues("id")}`
                            : null}
                        </span>
                      </p>
                    </div>

                    <Form.Field
                      control={form.control}
                      name="description"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <div className="flex flex-row justify-between">
                              <Form.Label className="product-body-text-3-semibold">
                                Description
                              </Form.Label>
                              <p className=" text-semantic-fg-secondary product-body-text-4-regular">
                                optional
                              </p>
                            </div>
                            <Form.Control>
                              <Textarea
                                {...field}
                                value={field.value ?? ""}
                                autoComplete="off"
                                placeholder="Short description of this pipeline"
                                className="!resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-2-regular focus-visible:!ring-1"
                              />
                            </Form.Control>
                            <Form.Message />
                          </Form.Item>
                        );
                      }}
                    />
                  </div>
                </form>
              </Form.Root>
              <Separator orientation="horizontal" className="!my-5" />
              <RadioGroup.Root
                onValueChange={(value) => {
                  setPermission(value as Permission);
                }}
                className="!flex flex-col gap-x-2"
                defaultValue="private"
              >
                <div className="flex items-center space-x-3">
                  <label
                    htmlFor="public-radio"
                    className="flex flex-row gap-x-3"
                  >
                    <RadioGroup.Item
                      className="my-auto"
                      value="public"
                      id="public-radio"
                    />
                    <Icons.BookOpen02 className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
                    <div className="flex flex-col">
                      <p className="text-semantic-fg-primary product-body-text-3-semibold">
                        Public
                      </p>
                      <p className="text-semantic-fg-secondary product-body-text-4-regular">
                        Anyone on the internet can see this pipeline.
                      </p>
                    </div>
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <label htmlFor="private" className="flex flex-row gap-x-3">
                    <RadioGroup.Item
                      className="my-auto"
                      value="private"
                      id="private"
                    />

                    <Icons.Lock03 className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
                    <div className="flex flex-col">
                      <p className="text-semantic-fg-primary product-body-text-3-semibold">
                        Private
                      </p>
                      <p className="text-semantic-fg-secondary product-body-text-4-regular">
                        Only you can see this pipeline.
                      </p>
                    </div>
                  </label>
                </div>
              </RadioGroup.Root>
            </div>

            <div className="flex flex-row-reverse px-6 pb-6 pt-8">
              <Button
                disabled={creating || organizationsAndUserList.length === 0}
                form={formID}
                variant="primary"
                size="lg"
                type="submit"
              >
                {creating ? (
                  <LoadingSpin className="!text-semantic-fg-secondary" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <LoadingSpin className="!m-auto" />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
