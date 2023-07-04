import cn from "clsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConnectorWithDefinition,
  CreateConnectorPayload,
  Nullable,
  UpdateConnectorPayload,
  getInstillApiErrorMessage,
  testConnectorConnectionAction,
  useCreateConnector,
  useUpdateConnector,
  ConfigureBlockchainFormSchema,
} from "@instill-ai/toolkit";
import {
  Button,
  Form,
  Icons,
  Input,
  Select,
  Switch,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import { useEffect, useState } from "react";
import { IncompleteConnectorWithWatchState } from "@/types";
import { isAxiosError } from "axios";
import { PipelineBuilderStore, usePipelineBuilderStore } from "@/stores";
import { shallow } from "zustand/shallow";

export type BlockchainFormProps = {
  blockchain: ConnectorWithDefinition | IncompleteConnectorWithWatchState;
  accessToken: Nullable<string>;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  updateResourceFormIsDirty: state.updateResourceFormIsDirty,
  updateSelectedNode: state.updateSelectedNode,
  selectedNode: state.selectedNode,
  updateNodes: state.updateNodes,
});

export const BlockchainForm = (props: BlockchainFormProps) => {
  const { blockchain, accessToken } = props;

  const {
    updateResourceFormIsDirty,
    updateSelectedNode,
    selectedNode,
    updateNodes,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  console.log(selectedNode);

  const form = useForm<z.infer<typeof ConfigureBlockchainFormSchema>>({
    resolver: zodResolver(ConfigureBlockchainFormSchema),
    defaultValues: {
      ...blockchain,
    },
  });

  useEffect(() => {
    updateResourceFormIsDirty(() => form.formState.isDirty);
  }, [form.formState.isDirty, updateResourceFormIsDirty]);

  useEffect(() => {
    form.reset({
      ...blockchain,
    });
  }, [blockchain, form]);

  const updateConnector = useUpdateConnector();
  const createConnector = useCreateConnector();
  const { toast } = useToast();

  function onSubmit(data: z.infer<typeof ConfigureBlockchainFormSchema>) {
    form.trigger([
      "configuration",
      "connector_definition_name",
      "description",
      "id",
    ]);

    // Optimistically update the selectedNode'id, because if the user change the pre-defined id
    // and the previous nodes and selectedNodes stay unchanged, we will have a problem to update
    // it once new data is coming in.

    const oldId = blockchain.id;
    const newId = data.id;

    updateSelectedNode((prev) => {
      if (prev === null) return prev;

      return {
        ...prev,
        data: {
          ...prev.data,
          connector: {
            ...prev.data.connector,
            id: newId,
            name: `connectors/${newId}`,
          },
        },
      };
    });

    updateNodes((prev) => {
      return prev.map((node) => {
        if (node.data.connector.id === oldId) {
          return {
            ...node,
            data: {
              ...node.data,
              connector: {
                ...node.data.connector,
                id: newId,
                name: `connectors/${newId}`,
              },
            },
          };
        }

        return node;
      });
    });

    if ("uid" in blockchain) {
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
                    uid: result.connector.uid,
                  },
                },
              };
            });

            // Reset the form with the new configuration
            form.reset({
              ...blockchain,
              configuration: result.connector.configuration,
              description: result.connector.description,
            });
          },
          onError: (error) => {
            // Rollback the selectedNode'id
            updateSelectedNode((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                data: {
                  ...prev.data,
                  id: oldId,
                  name: `connectors/${oldId}`,
                },
              };
            });

            // Rollback the nodes'id
            updateNodes((prev) => {
              return prev.map((node) => {
                if (node.data.connector.id === newId) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      connector: {
                        ...node.data.connector,
                        id: oldId,
                        name: `connectors/${oldId}`,
                      },
                    },
                  };
                }

                return node;
              });
            });

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
                    uid: result.connector.uid,
                  },
                },
              };
            });

            form.reset({
              ...blockchain,
              configuration: result.connector.configuration,
              description: result.connector.description,
            });
          },
          onError: (error) => {
            updateSelectedNode((prev) => {
              if (prev === null) return prev;

              return {
                ...prev,
                data: {
                  ...prev.data,
                  id: oldId,
                  name: `connectors/${oldId}`,
                },
              };
            });

            // Rollback the nodes'id
            updateNodes((prev) => {
              return prev.map((node) => {
                if (node.data.connector.id === data.id) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      connector: {
                        ...node.data.connector,
                        id: oldId,
                        name: `connectors/${oldId}`,
                      },
                    },
                  };
                }

                return node;
              });
            });

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

  const handleTestBlockchain = async function () {
    if (!blockchain) return;

    setIsTesting(true);

    try {
      const res = await testConnectorConnectionAction({
        connectorName: blockchain.name,
        accessToken,
      });

      setIsTesting(false);

      toast({
        title: `${props.blockchain.id} is ${
          res.state === "STATE_ERROR" ? "not connected" : "connected"
        }`,
        description: `The ${props.blockchain.id} state is ${res.state}`,
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
                        value={field.value ?? ""}
                        disabled={"uid" in blockchain ? true : false}
                        autoComplete="off"
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
                        <Select.Value placeholder="Select an blockchain connector type" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      <Select.Item
                        key="connector-definitions/numbers-blockchain-nit"
                        value="connector-definitions/numbers-blockchain-nit"
                        className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                      >
                        <p className="my-auto">NumbersProtocol NIT</p>
                      </Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>
                    Select a blockchain connector type.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.capture_token"
            render={({ field }) => {
              return (
                <Form.Item
                  className={
                    form.getValues("connector_definition_name") ===
                    "connector-definitions/numbers-blockchain-nit"
                      ? ""
                      : "hidden"
                  }
                >
                  <Form.Label htmlFor={field.name}>Capture token *</Form.Label>
                  <Form.Control>
                    <Input.Root className="!rounded-none">
                      <Input.Core
                        {...field}
                        id={field.name}
                        type="password"
                        value={field.value ?? ""}
                        autoComplete="off"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Capture token from NumbersProtocol.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.license"
            render={({ field }) => {
              return (
                <Form.Item
                  className={
                    form.getValues("connector_definition_name") ===
                    "connector-definitions/numbers-blockchain-nit"
                      ? ""
                      : "hidden"
                  }
                >
                  <Form.Label htmlFor={field.name}>License *</Form.Label>
                  <Form.Control>
                    <Input.Root className="!rounded-none">
                      <Input.Core
                        {...field}
                        id={field.name}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    License of the Web3 asset.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.creator_name"
            render={({ field }) => {
              return (
                <Form.Item
                  className={
                    form.getValues("connector_definition_name") ===
                    "connector-definitions/numbers-blockchain-nit"
                      ? ""
                      : "hidden"
                  }
                >
                  <Form.Label htmlFor={field.name}>Creator Name *</Form.Label>
                  <Form.Control>
                    <Input.Root className="!rounded-none">
                      <Input.Core
                        {...field}
                        id={field.name}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Name of the creator who owns the Web3 asset.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.asset_type"
            render={({ field }) => {
              return (
                <Form.Item
                  className={
                    form.getValues("connector_definition_name") ===
                    "connector-definitions/numbers-blockchain-nit"
                      ? ""
                      : "hidden"
                  }
                >
                  <Form.Label htmlFor={field.name}>Asset type *</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <Form.Control>
                      <Select.Trigger className="w-full !rounded-none">
                        <Select.Value placeholder="Select an asset type" />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {["images"].map((item) => (
                        <Select.Item
                          className="my-auto capitalize text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={item}
                          value={item}
                        >
                          <p className="my-auto">{item}</p>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>
                    The type of asset to be added to Blockchain.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.metadata_texts"
            render={({ field }) => {
              return (
                <Form.Item
                  className={cn(
                    "flex !flex-row items-center justify-between border border-semantic-bg-line py-3 pl-3 pr-6",
                    form.getValues("connector_definition_name") ===
                      "connector-definitions/numbers-blockchain-nit"
                      ? ""
                      : "hidden"
                  )}
                >
                  <div className="space-y-1">
                    <Form.Label>
                      Add input texts to Blockchain&apos;s metadata
                    </Form.Label>
                    <Form.Description>
                      Add the texts input as the metadata to Blockchain.
                    </Form.Description>
                  </div>
                  <Form.Control>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.Control>
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.metadata_structured_data"
            render={({ field }) => {
              return (
                <Form.Item
                  className={cn(
                    "flex !flex-row items-center justify-between border border-semantic-bg-line py-3 pl-3 pr-6",
                    form.getValues("connector_definition_name") ===
                      "connector-definitions/numbers-blockchain-nit"
                      ? ""
                      : "hidden"
                  )}
                >
                  <div className="space-y-1">
                    <Form.Label>
                      Add input structured_data to Blockchain&apos;s metadata
                    </Form.Label>
                    <Form.Description>
                      Add the structured_data input as the metadata to
                      Blockchain.
                    </Form.Description>
                  </div>
                  <Form.Control>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.Control>
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.metadata_metadata"
            render={({ field }) => {
              return (
                <Form.Item
                  className={cn(
                    "flex !flex-row items-center justify-between border border-semantic-bg-line py-3 pl-3 pr-6",
                    form.getValues("connector_definition_name") ===
                      "connector-definitions/numbers-blockchain-nit"
                      ? ""
                      : "hidden"
                  )}
                >
                  <div className="space-y-1">
                    <Form.Label>
                      Add input metadata to Blockchain&apos;s metadata
                    </Form.Label>
                    <Form.Description>
                      Add the metadata input as the metadata to Blockchain.
                    </Form.Description>
                  </div>
                  <Form.Control>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.Control>
                </Form.Item>
              );
            }}
          />
        </div>

        <div className="flex w-full flex-row-reverse gap-x-2">
          <Button
            onClick={handleTestBlockchain}
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
              "uid" in blockchain
                ? form.formState.isDirty
                  ? false
                  : true
                : false
            }
            size={form.formState.isDirty ? "lg" : "md"}
            className="gap-x-2"
          >
            {"uid" in blockchain ? "Update" : "Create"}
            <Icons.Save01 className="h-4 w-4 stroke-semantic-accent-on-bg group-disabled:stroke-semantic-fg-disabled" />
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
