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
  Separator,
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
  useCreateUserPipeline,
  useRouteInfo,
  useInstillStore,
  useShallow,
} from "../../../lib";
import { InstillErrors, DataTestID } from "../../../constant";
import { LoadingSpin } from "../../../components";
import { env, validateInstillResourceID } from "../../../server";
import { useRouter } from "next/navigation";
import { EntitySelector } from "../../../components";
import { useUserNamespaces } from "../../../lib/useUserNamespaces";

const CreatePipelineSchema = z
  .object({
    id: z.string(),
    namespaceId: z.string(),
    description: z.string().optional().nullable(),
  })
  .superRefine((state, ctx) => {
    if (!validateInstillResourceID(state.id)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: InstillErrors.ResourceIDInvalidError,
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
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
  updateNavigationNamespaceAnchor: store.updateNavigationNamespaceAnchor,
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

  const {
    accessToken,
    navigationNamespaceAnchor,
    updateNavigationNamespaceAnchor,
  } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const namespaces = useUserNamespaces();

  const createPipeline = useCreateUserPipeline();
  async function onSubmit(data: z.infer<typeof CreatePipelineSchema>) {
    if (!routeInfo.isSuccess) {
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
            shareCode: null,
          }
        : {
            users: {
              "*/*": {
                enabled: false,
                role: "ROLE_EXECUTOR",
              },
            },
            shareCode: null,
          };

    const payload: CreateUserPipelinePayload = {
      id: data.id,
      description: data.description ?? undefined,
      recipe: {
        version: "v1beta",
        variable: undefined,
        output: undefined,
        component: undefined,
      },
      metadata: {
        component: {
          trigger: {
            x: 0,
            y: 0,
          },
          response: {
            x: 0,
            y: 0,
          },
        },
      },
      sharing,
    };

    const targetNamespace = namespaces.find(
      (account) => account.id === data.namespaceId
    );

    if (targetNamespace) {
      try {
        await createPipeline.mutateAsync({
          accessToken,
          entityName: targetNamespace.name,
          payload,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("create_pipeline");
        }

        updateNavigationNamespaceAnchor(() => targetNamespace.id);

        router.push(`/${data.namespaceId}/pipelines/${data.id}/editor`);
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
        title: "Please choose a valid namespace to create your pipeline",
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
          namespaceId: navigationNamespaceAnchor
            ? navigationNamespaceAnchor
            : routeInfo?.data.namespaceId || "",
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
        {routeInfo.isSuccess ? (
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
                                  <EntitySelector
                                    value={field?.value || ""}
                                    onChange={(value: string) => {
                                      field.onChange(value);

                                      if (form.getValues("id")) {
                                        form.trigger("id");
                                      }
                                    }}
                                    data={namespaces}
                                  />
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
                disabled={creating || namespaces.length === 0}
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
