"use client";

import type {
  CloneNamespacePipelineRequest,
  Pipeline,
  PipelineSharing,
} from "instill-sdk";
import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { InstillNameInterpreter } from "instill-sdk";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Dialog,
  Form,
  Icons,
  Input,
  RadioGroup,
  Separator,
  Tag,
  Textarea,
} from "@instill-ai/design-system";

import type { InstillStore, Nullable } from "../lib";
import { InstillErrors } from "../constant";
import {
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useAuthenticatedUser,
  useCloneNamespacePipeline,
  useInstillStore,
  useRouteInfo,
  useShallow,
} from "../lib";
import { useUserNamespaces } from "../lib/useUserNamespaces";
import { env, validateInstillResourceID } from "../server";
import { EntitySelector } from "./EntitySelector";
import { LoadingSpin } from "./LoadingSpin";

const ClonePipelineSchema = z
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

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
  updateNavigationNamespaceAnchor: store.updateNavigationNamespaceAnchor,
});

export const ClonePipelineDialog = ({
  trigger,
  pipeline,
  open,
  onOpenChange,
}: {
  trigger: Nullable<React.ReactNode>;
  pipeline: Nullable<Pipeline>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const router = useRouter();
  const [dialogIsOpen, setDialogIsOpen] = React.useState(open ?? false);
  const [cloning, setCloning] = React.useState(false);
  const [permission, setPermission] =
    React.useState<Nullable<Permission>>("private");

  const routeInfo = useRouteInfo();

  const {
    accessToken,
    enabledQuery,
    navigationNamespaceAnchor,
    updateNavigationNamespaceAnchor,
  } = useInstillStore(useShallow(selector));

  const form = useForm<z.infer<typeof ClonePipelineSchema>>({
    resolver: zodResolver(ClonePipelineSchema),
    defaultValues: {
      id: "",
      description: "",
      namespaceId: navigationNamespaceAnchor
        ? navigationNamespaceAnchor
        : routeInfo?.data.namespaceId || "",
    },
  });

  const me = useAuthenticatedUser({
    enabled: enabledQuery && dialogIsOpen,
    accessToken,
  });

  const userNamespaces = useUserNamespaces();

  const clonePipeline = useCloneNamespacePipeline();
  async function handleClone(data: z.infer<typeof ClonePipelineSchema>) {
    if (
      !me.isSuccess ||
      !accessToken ||
      !pipeline ||
      !pipeline.recipe ||
      !userNamespaces.isSuccess ||
      !routeInfo.isSuccess ||
      !routeInfo.data.pipelineName
    ) {
      return;
    }

    setCloning(true);

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

    const targetNamespace = userNamespaces.data.find(
      (account) => account.id === data.namespaceId,
    );

    if (targetNamespace) {
      const payload: CloneNamespacePipelineRequest = {
        namespaceId: InstillNameInterpreter.pipeline(pipeline.name).namespaceId,
        pipelineId: pipeline.id,
        targetNamespaceId: targetNamespace.id,
        targetPipelineId: data.id,
        description: data.description ?? undefined,
        sharing,
      };

      try {
        await clonePipeline.mutateAsync({ payload, accessToken });

        if (amplitudeIsInit) {
          sendAmplitudeData("clone_pipeline");
        }

        updateNavigationNamespaceAnchor(() => targetNamespace.id);
        router.push(`/${targetNamespace.id}/pipelines/${data.id}/playground`);
      } catch (error) {
        console.log("error", error);

        setCloning(false);
        toastInstillError({
          title:
            "Something went wrong when clone the pipeline, please try again later",
          error,
        });
      }
    } else {
      setCloning(false);
      toastInstillError({
        title:
          "Something went wrong when clone the pipeline, please try again later",
        error: null,
      });
    }
  }

  // We are using formID to trigger the form submission here, due to the layout
  // is a bit complicated for us to put the submit button into the form.
  const formID = "create-new-pipeline-form";

  return (
    <Dialog.Root
      open={open !== null || open !== undefined ? open : dialogIsOpen}
      onOpenChange={(open) => {
        form.reset({
          id: "",
          description: "",
          namespaceId: navigationNamespaceAnchor
            ? navigationNamespaceAnchor
            : routeInfo?.data.namespaceId || "",
        });

        setCloning(false);
        if (onOpenChange) {
          onOpenChange(open);
        } else {
          setDialogIsOpen(open);
        }
      }}
    >
      <Dialog.Trigger asChild>{trigger ? trigger : null}</Dialog.Trigger>
      <Dialog.Content className="!w-[600px] !p-0">
        <Dialog.Close className="!right-6 !top-6" />
        <div className="flex flex-col ">
          <div className="flex flex-row gap-x-2 border-b border-semantic-bg-line p-6">
            <h3 className="my-auto text-semantic-fg-primary product-body-text-1-semibold">
              Clone this pipeline
            </h3>
            <Tag className="my-auto" variant="default" size="md">
              {pipeline?.id}
            </Tag>
          </div>
          <div className="flex flex-col px-6 pt-5">
            <Form.Root {...form}>
              <form id={formID} onSubmit={form.handleSubmit(handleClone)}>
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
                                  }}
                                  data={
                                    userNamespaces.isSuccess
                                      ? userNamespaces.data
                                      : []
                                  }
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
                              <Form.Control className="p-[7px]">
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
                              "NEXT_PUBLIC_CONSOLE_BASE_URL",
                            )}/${form.getValues(
                              "namespaceId",
                            )}/pipelines/${form.getValues("id")}/playground`
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
                <RadioGroup.Item value="public" id="public" />
                <label htmlFor="public" className="flex flex-row gap-x-3">
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
                <RadioGroup.Item value="private" id="private" />
                <label htmlFor="private" className="flex flex-row gap-x-3">
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
              disabled={cloning}
              form={formID}
              variant="primary"
              size="lg"
              type="submit"
            >
              {cloning ? (
                <LoadingSpin className="!text-semantic-fg-secondary !w-4 !h-4" />
              ) : (
                "Clone"
              )}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
