import * as React from "react";
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

import { useRouter } from "next/router";
import {
  CreateUserPipelinePayload,
  InstillStore,
  Nullable,
  PipelineSharing,
  toastInstillError,
  useCreateUserPipeline,
  useEntity,
  useInstillStore,
  useShallow,
  validateInstillID,
} from "../../../lib";
import { InstillErrors } from "../../../constant";
import { LoadingSpin } from "../../../components";

const CreatePipelineSchema = z
  .object({
    id: z.string(),
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
});

export const CreatePipelineDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [permission, setPermission] =
    React.useState<Nullable<Permission>>("public");
  const router = useRouter();
  const { entity } = router.query;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof CreatePipelineSchema>>({
    resolver: zodResolver(CreatePipelineSchema),
  });

  const { accessToken } = useInstillStore(useShallow(selector));

  const entityObject = useEntity();

  const createPipeline = useCreateUserPipeline();
  async function onSubmit(data: z.infer<typeof CreatePipelineSchema>) {
    if (!entityObject.isSuccess) {
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
            resource_name: "",
            configuration: {
              metadata: {},
            },
            definition_name: "operator-definitions/start",
          },
          {
            id: "end",
            resource_name: "",
            configuration: {
              metadata: {},
              input: {},
            },
            definition_name: "operator-definitions/end",
          },
        ],
      },
      metadata: {},
      sharing,
    };

    try {
      await createPipeline.mutateAsync({
        accessToken,
        entityName: entityObject.entityName,
        payload,
      });

      await router.push(`/${entity}/pipelines/${data.id}/builder`);
    } catch (error) {
      setCreating(false);
      toastInstillError({
        title: "Failed to create pipeline",
        error,
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
        });
        setOpen(open);
      }}
    >
      <Dialog.Trigger asChild>
        <Button className="gap-x-2" variant="primary" size="lg">
          <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
          Create Pipeline
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="!w-[600px] !p-0">
        {entityObject.isSuccess ? (
          <div className="flex flex-col ">
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
                    <Form.Field
                      control={form.control}
                      name="id"
                      render={({ field }) => {
                        return (
                          <Form.Item className="w-full">
                            <Form.Label className="product-body-text-3-semibold">
                              Pipeline Name
                            </Form.Label>
                            <div className="group flex flex-row rounded-sm focus-within:outline focus-within:outline-2 focus-within:outline-semantic-accent-default">
                              <div className="rounded-l-sm border-b border-l border-r border-t border-semantic-bg-line bg-semantic-bg-primary px-4 py-2.5">
                                <span className="text-semantic-fg-secondary product-body-text-2-regular">
                                  {entityObject.entityName.split("/")[1]}
                                </span>
                              </div>
                              <div className="w-full">
                                <Form.Control>
                                  <Input.Root className="h-full !rounded-l-none !border-l-none focus-within:!border-semantic-bg-line focus-within:!outline-none">
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
                              </div>
                            </div>
                            <Form.Message />
                          </Form.Item>
                        );
                      }}
                    />
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
                defaultValue="public"
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
                disabled={creating}
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
