import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  Input,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  ConnectorResourceType,
  ConnectorResourceWithDefinition,
  Nullable,
  getInstillApiErrorMessage,
  useCreateUserConnectorResource,
  useUser,
} from "@instill-ai/toolkit";
import { isAxiosError } from "axios";
import { recursivelyReplaceNullWithUndefined } from "../lib";

export const AIResourceFormSchema = z
  .object({
    id: z.string().min(1, { message: "ID is required" }),
    description: z.string().nullable().optional(),
    connector_definition_name: z.string(),
    configuration: z.object({
      organization: z.string().nullable().optional(),
      api_key: z.string().nullable().optional(),
      api_token: z.string().nullable().optional(),
      server_url: z.string().nullable().optional(),
    }),
  })
  .superRefine((state, ctx) => {
    if (
      state.connector_definition_name === "connector-definitions/ai-openai" ||
      state.connector_definition_name ===
        "connector-definitions/ai-stability-ai"
    ) {
      if (!state.configuration.api_key) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "api_key is required",
          path: ["configuration.api_key"],
        });
      }
    }

    if (
      state.connector_definition_name ===
      "connector-definitions/ai-instill-model"
    ) {
      if (!state.configuration.api_token) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "api_token is required",
          path: ["configuration.api_token"],
        });
      }
    }
  });

export type AIResourceFormProps = {
  disabledAll?: boolean;
  aiResource: Nullable<ConnectorResourceWithDefinition>;
  aiDefinition: ConnectorDefinition;
  setNewConnectorDefinition: React.Dispatch<
    React.SetStateAction<Nullable<ConnectorDefinition>>
  >;
  setNewConnectorType: React.Dispatch<
    React.SetStateAction<Nullable<ConnectorResourceType>>
  >;
  accessToken: Nullable<string>;
  onSelectConnectorResource: (
    connectorResource: ConnectorResourceWithDefinition
  ) => void;
};

export const AIResourceForm = (props: AIResourceFormProps) => {
  const {
    disabledAll,
    aiResource,
    aiDefinition,
    setNewConnectorDefinition,
    setNewConnectorType,
    accessToken,
    onSelectConnectorResource,
  } = props;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof AIResourceFormSchema>>({
    resolver: zodResolver(AIResourceFormSchema),
    defaultValues: aiResource
      ? {
          ...aiResource,
          configuration: {
            ...aiResource.configuration,
            server_url: "https://api-model.instill.tech",
          },
        }
      : {
          connector_definition_name: aiDefinition.name,
        },
  });

  const user = useUser({
    enabled: true,
    accessToken,
  });

  const createAIConnectorResource = useCreateUserConnectorResource();

  function onSubmit(data: z.infer<typeof AIResourceFormSchema>) {
    if (!user.isSuccess) return;

    const payload = {
      id: data.id,
      connector_definition_name: data.connector_definition_name,
      description: data.description ?? undefined,
      configuration: recursivelyReplaceNullWithUndefined(data.configuration),
    };

    createAIConnectorResource.mutate(
      { payload, userName: user.data.name, accessToken },
      {
        onSuccess: ({ connectorResource }) => {
          onSelectConnectorResource({
            ...connectorResource,
            connector_definition: aiDefinition,
          });

          toast({
            title: "Successfully create ai resource",
            variant: "alert-success",
            size: "small",
          });
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when create the ai resource",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when create the ai resource",
              variant: "alert-error",
              size: "large",
              description: "Please try again later",
            });
          }
        },
      }
    );
  }

  return (
    <Form.Root {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex flex-col space-y-5">
          <Form.Field
            control={form.control}
            name="id"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>ID *</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
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
                  <Form.Label>Description</Form.Label>
                  <Form.Control>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      disabled={disabledAll}
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

          {/* 
            connector-definitions/ai-instill-model
          */}

          <Form.Field
            control={form.control}
            name="configuration.api_token"
            render={({ field }) => {
              const display =
                aiDefinition.name === "connector-definitions/ai-instill-model";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>API Token *</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    {`To access models on Instill Cloud, enter your Instill Cloud API Token. You can find your tokens by visiting your Instill Cloud's Settings > API Tokens page. Leave this field empty to access models on your local Instill Model.`}
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.server_url"
            render={({ field }) => {
              const display =
                aiDefinition.name === "connector-definitions/ai-instill-model";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>Server URL</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Base URL for the Instill Model API. To access models on
                    Instill Cloud, use the base URL
                    `https://api-model.instill.tech`. To access models on your
                    local Instill Model, use the base URL
                    `http://localhost:9080`.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          {/* 
            connector-definitions/ai-openai
          */}

          <Form.Field
            control={form.control}
            name="configuration.api_key"
            render={({ field }) => {
              const display =
                aiDefinition.name === "connector-definitions/ai-openai" ||
                aiDefinition.name === "connector-definitions/ai-stability-ai";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>API Key *</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Fill your OpenAI API key. To find your keys, visit your
                    OpenAI&apos;s API Keys page.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.organization"
            render={({ field }) => {
              const display =
                aiDefinition.name === "connector-definitions/ai-openai";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>Organization</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Specify which organization is used for the requests. Usage
                    will count against the specified organization&apos;s
                    subscription quota.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>
        <div className="flex w-full flex-row gap-x-4">
          <Button
            type="button"
            variant="secondaryGrey"
            size="lg"
            className="!w-full !flex-1 gap-x-2"
            onClick={() => {
              setNewConnectorDefinition(null);
              setNewConnectorType(null);
            }}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="!w-full !flex-1 gap-x-2"
          >
            Save
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
