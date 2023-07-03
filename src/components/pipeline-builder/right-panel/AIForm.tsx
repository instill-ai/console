import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConnectorWithDefinition,
  CreateConnectorPayload,
  ImageWithFallback,
  Nullable,
  UpdateConnectorPayload,
  getInstillApiErrorMessage,
  testConnectorConnectionAction,
  useCreateConnector,
  useUpdateConnector,
} from "@instill-ai/toolkit";
import {
  Button,
  Form,
  Icons,
  Input,
  Logos,
  Select,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import { useEffect, useState } from "react";
import { IncompleteConnectorWithWatchState } from "@/types";
import { isAxiosError } from "axios";
import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import { shallow } from "zustand/shallow";

const ConfigureAIFormSchema = z
  .object({
    id: z.string().min(1, { message: "ID is required" }),
    description: z.string().optional(),
    connector_definition_name: z.string(),
    configuration: z.object({
      api_key: z.string().optional(),
      server_url: z.string().optional(),
      task: z.string().optional(),
      engine: z.string().optional(),
      model_id: z.string().optional(),
    }),
  })
  .superRefine((state, ctx) => {
    if (
      state.connector_definition_name ===
      "connector-definitions/stability-ai-model"
    ) {
      if (!state.configuration.api_key) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "API Key is required",
          path: ["configuration", "api_key"],
        });
      }

      if (!state.configuration.task) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Task is required",
          path: ["configuration", "task"],
        });
      }

      if (!state.configuration.engine) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Engine is required",
          path: ["configuration", "engine"],
        });
      }
    }

    if (
      state.connector_definition_name ===
      "connector-definitions/instill-ai-model"
    ) {
      if (!state.configuration.api_key) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "API Key is required",
          path: ["configuration", "api_key"],
        });
      }

      if (!state.configuration.model_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Model ID is required",
          path: ["configuration", "model_id"],
        });
      }

      if (!state.configuration.server_url) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Server URL is required",
          path: ["configuration", "server_url"],
        });
      }
    }
  });

export type AIFormProps = {
  ai: ConnectorWithDefinition | IncompleteConnectorWithWatchState;
  accessToken: Nullable<string>;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  updateResourceFormIsDirty: state.updateResourceFormIsDirty,
  updateSelectedNode: state.updateSelectedNode,
});

export const AIForm = (props: AIFormProps) => {
  const { ai, accessToken } = props;

  const { updateResourceFormIsDirty, updateSelectedNode } =
    usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const form = useForm<z.infer<typeof ConfigureAIFormSchema>>({
    resolver: zodResolver(ConfigureAIFormSchema),
    defaultValues: {
      ...ai,
    },
  });

  useEffect(() => {
    updateResourceFormIsDirty(() => form.formState.isDirty);
  }, [form.formState.isDirty, updateResourceFormIsDirty]);

  useEffect(() => {
    form.reset({
      ...ai,
    });
  }, [ai, form]);

  const updateConnector = useUpdateConnector();
  const createConnector = useCreateConnector();
  const { toast } = useToast();

  function onSubmit(data: z.infer<typeof ConfigureAIFormSchema>) {
    form.trigger([
      "configuration",
      "connector_definition_name",
      "description",
      "id",
    ]);

    if ("uid" in ai) {
      const payload: UpdateConnectorPayload = {
        connectorName: `connectors/${data.id}`,
        description: data.description,
        configuration: data.configuration,
      };

      updateConnector.mutate(
        { payload, accessToken },
        {
          onSuccess: (result) => {
            toast({
              title: "Successfully update AI",
              variant: "alert-success",
              size: "small",
            });

            // Update the selectedNode
            updateSelectedNode((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                data: {
                  ...prev.data,
                  connector: {
                    ...prev.data.connector,
                    configuration: result.connector.configuration,
                    description: result.connector.description,
                  },
                },
              };
            });

            // Reset the form with the new configuration
            form.reset({
              ...ai,
              configuration: result.connector.configuration,
              description: result.connector.description,
            });
          },
          onError: (error) => {
            if (isAxiosError(error)) {
              toast({
                title: "Something went wrong when update the AI",
                variant: "alert-error",
                size: "large",
                description: getInstillApiErrorMessage(error),
              });
            } else {
              toast({
                title: "Something went wrong when update the AI",
                variant: "alert-error",
                size: "large",
                description: "Please try again later",
              });
            }
          },
        }
      );
    } else {
      const payload: CreateConnectorPayload = {
        connectorName: `connectors/${data.id}`,
        connector_definition_name: data.connector_definition_name,
        description: data.description,
        configuration: data.configuration,
      };

      createConnector.mutate(
        {
          payload,
          accessToken,
        },
        {
          onSuccess: (result) => {
            toast({
              title: "Successfully create AI",
              variant: "alert-success",
              size: "small",
            });

            updateSelectedNode((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                data: {
                  ...prev.data,
                  connector: {
                    ...prev.data.connector,
                    configuration: result.connector.configuration,
                    description: result.connector.description,
                  },
                },
              };
            });

            form.reset({
              ...ai,
              configuration: result.connector.configuration,
            });
          },
          onError: (error) => {
            if (isAxiosError(error)) {
              toast({
                title: "Something went wrong when create the AI",
                variant: "alert-error",
                size: "large",
                description: getInstillApiErrorMessage(error),
              });
            } else {
              toast({
                title: "Something went wrong when create the AI",
                variant: "alert-error",
                size: "large",
                description: "Please try again later",
              });
            }
          },
        }
      );
    }
  }

  const [isTesting, setIsTesting] = useState(false);

  const handleTestAI = async function () {
    if (!ai) return;

    setIsTesting(true);

    try {
      const res = await testConnectorConnectionAction({
        connectorName: ai.name,
        accessToken,
      });

      setIsTesting(false);

      toast({
        title: `${props.ai.id} is ${
          res.state === "STATE_ERROR" ? "not connected" : "connected"
        }`,
        description: `The ${props.ai.id} state is ${res.state}`,
        variant: res.state === "STATE_ERROR" ? "alert-error" : "alert-success",
        size: "large",
      });
    } catch (err) {
      setIsTesting(false);

      toast({
        title: "Error",
        description: `There is something wrong when test AI`,
        variant: "alert-error",
        size: "large",
      });
    }
  };

  return (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex flex-col space-y-5">
          <Form.Field
            control={form.control}
            name="id"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label htmlFor={field.name}>ID *</Form.Label>
                  <Form.Control>
                    <Input.Root className="!rounded-none">
                      <Input.Core
                        {...field}
                        id={field.name}
                        type="text"
                        placeholder="AI's name"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={"uid" in ai ? true : false}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Pick an ID to help you identify this resource. The ID
                    conforms to RFC-1034, which restricts to letters, numbers,
                    and hyphen, with the first character a letter, the last a
                    letter or a number, and a 63 character maximum.
                  </Form.Description>
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
                  <Form.Label htmlFor={field.name}>Description</Form.Label>
                  <Form.Control>
                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder="Description"
                      value={field.value ?? ""}
                      className="!rounded-none"
                    />
                  </Form.Control>
                  <Form.Description>
                    Fill with a short description.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="connector_definition_name"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label htmlFor={field.name}>
                    AI Connector Type
                  </Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={true}
                  >
                    <Form.Control>
                      <Select.Trigger className="w-full !rounded-none">
                        <Select.Value placeholder="Select an AI connector type" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      <Select.Item
                        key="connector-definitions/instill-ai-model"
                        value="connector-definitions/instill-ai-model"
                        className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                      >
                        <div className="flex flex-row space-x-2">
                          <Logos.MDLSquare className="h-5 w-5" />
                          <p className="my-auto">Instill Model</p>
                        </div>
                      </Select.Item>
                      <Select.Item
                        key="connector-definitions/stability-ai-model"
                        value="connector-definitions/stability-ai-model"
                        className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                      >
                        <div className="flex flex-row space-x-2">
                          <ImageWithFallback
                            src={"/icons/stability-ai/logo.png"}
                            width={20}
                            height={20}
                            alt="Stability AI model logo"
                            fallbackImg={
                              <Icons.Model className="h-5 w-5 stroke-semantic-fg-primary" />
                            }
                          />
                          <p className="my-auto">Stability AI Model</p>
                        </div>
                      </Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>
                    Select an AI connector type.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.api_key"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label htmlFor={field.name}>API Key *</Form.Label>
                  <Form.Control>
                    <Input.Root className="!rounded-none">
                      <Input.Core
                        {...field}
                        id={field.name}
                        type="text"
                        placeholder="API Key"
                        value={field.value ?? ""}
                        autoComplete="off"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Access to your API keys can then be managed through
                    Stability AI&apos;s Account page.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.task"
            render={({ field }) => {
              return (
                <Form.Item
                  className={
                    form.getValues("connector_definition_name") ===
                    "connector-definitions/stability-ai-model"
                      ? ""
                      : "hidden"
                  }
                >
                  <Form.Label htmlFor={field.name}>Task *</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <Form.Control>
                      <Select.Trigger className="w-full !rounded-none">
                        <Select.Value placeholder="Select an AI task" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {["Text to Image", "Image to Image"].map((task) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={task}
                          value={task}
                        >
                          <p className="my-auto">{task}</p>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>AI task type.</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.engine"
            render={({ field }) => {
              return (
                <Form.Item
                  className={
                    form.getValues("connector_definition_name") ===
                    "connector-definitions/stability-ai-model"
                      ? ""
                      : "hidden"
                  }
                >
                  <Form.Label htmlFor={field.name}>Engine</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <Form.Control>
                      <Select.Trigger className="w-full !rounded-none">
                        <Select.Value placeholder="Select an AI engine" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {[
                        "stable-diffusion-v1",
                        "stable-diffusion-v1-5",
                        "stable-diffusion-512-v2-0",
                        "stable-diffusion-768-v2-0",
                        "stable-diffusion-512-v2-1",
                        "stable-diffusion-768-v2-1",
                        "stable-diffusion-xl-beta-v2-2-2",
                        "stable-inpainting-v1-0",
                        "stable-inpainting-512-v2-0",
                        "esrgan-v1-x2plus",
                        "stable-diffusion-x4-latent-upscaler",
                      ].map((engine) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={engine}
                          value={engine}
                        >
                          <p className="my-auto">{engine}</p>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>Engine (model) to use.</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.server_url"
            render={({ field }) => {
              return (
                <Form.Item
                  className={
                    form.getValues("connector_definition_name") ===
                    "connector-definitions/instill-ai-model"
                      ? ""
                      : "hidden"
                  }
                >
                  <Form.Label htmlFor={field.name}>Server URL *</Form.Label>
                  <Form.Control>
                    <Input.Root className="!rounded-none">
                      <Input.Core
                        {...field}
                        id={field.name}
                        type="text"
                        placeholder="URL"
                        value={field.value ?? ""}
                        autoComplete="off"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Base URL for the Instill Model API.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.model_id"
            render={({ field }) => {
              return (
                <Form.Item
                  className={
                    form.getValues("connector_definition_name") ===
                    "connector-definitions/instill-ai-model"
                      ? ""
                      : "hidden"
                  }
                >
                  <Form.Label htmlFor={field.name}>Model ID *</Form.Label>
                  <Form.Control>
                    <Input.Root className="!rounded-none">
                      <Input.Core
                        {...field}
                        id={field.name}
                        type="text"
                        placeholder="ID"
                        value={field.value ?? ""}
                        autoComplete="off"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>ID of the model to use.</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>

        <div className="flex w-full flex-row-reverse gap-x-2">
          <Button
            onClick={handleTestAI}
            className="gap-x-2"
            variant="primary"
            size="lg"
            type="button"
          >
            Test
            {isTesting ? (
              <svg
                className="m-auto h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <Icons.Play className="h-4 w-4 stroke-semantic-fg-on-default" />
            )}
          </Button>
          <Button
            type="submit"
            variant="secondaryColour"
            disabled={
              "uid" in ai ? (form.formState.isDirty ? false : true) : false
            }
            size={form.formState.isDirty ? "lg" : "md"}
            className="gap-x-2"
          >
            {"uid" in ai ? "Update" : "Create"}
            <Icons.Save01 className="h-4 w-4 stroke-semantic-accent-on-bg group-disabled:stroke-semantic-fg-disabled" />
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
