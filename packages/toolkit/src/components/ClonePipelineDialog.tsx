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
  Tag,
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
  Pipeline,
  PipelineSharing,
  toastInstillError,
  useCreateUserPipeline,
  useInstillStore,
  useShallow,
  useUserMe,
  validateInstillID,
} from "../lib";
import { InstillErrors } from "../constant";
import { LoadingSpin } from "./LoadingSpin";
import { getRawPipelineRecipeFromPipelineRecipe } from "../view";

const ClonePipelineSchema = z
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

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
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
  const [dialogIsOpen, setDialogIsOpen] = React.useState(open ?? false);
  const [cloning, setCloning] = React.useState(false);
  const [permission, setPermission] =
    React.useState<Nullable<Permission>>("public");
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ClonePipelineSchema>>({
    resolver: zodResolver(ClonePipelineSchema),
  });

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
  });

  const createPipeline = useCreateUserPipeline();
  async function handleClone(data: z.infer<typeof ClonePipelineSchema>) {
    if (!me.isSuccess || !accessToken || !pipeline) {
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
      recipe: getRawPipelineRecipeFromPipelineRecipe(pipeline.recipe),
      metadata: pipeline.metadata,
      sharing,
    };

    try {
      await createPipeline.mutateAsync({
        payload,
        accessToken,
        entityName: me.data.name,
      });

      await router.push(`/${me.data.id}/pipelines/${payload.id}`);
    } catch (error) {
      setCloning(false);
      toastInstillError({
        title:
          "Something went wrong when clone the pipeline, please try again later",
        error,
        toast,
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
        });
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
              {pipeline?.owner_name === me.data?.name ? "Duplicate" : "Clone"}{" "}
              this pipeline
            </h3>
            <Tag className="my-auto" variant="default" size="md">
              {pipeline?.id}
            </Tag>
          </div>
          <div className="flex flex-col px-6 pt-5">
            <Form.Root {...form}>
              <form id={formID} onSubmit={form.handleSubmit(handleClone)}>
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
                                {me.data?.id}
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
              disabled={cloning}
              form={formID}
              variant="primary"
              size="lg"
              type="submit"
            >
              {cloning ? (
                <LoadingSpin className="!text-semantic-fg-secondary" />
              ) : pipeline?.owner_name === me.data?.name ? (
                "Duplicate"
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
