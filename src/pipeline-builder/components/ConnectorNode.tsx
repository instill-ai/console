import * as React from "react";
import * as z from "zod";
import { NodeProps, Position } from "reactflow";
import { ConnectorNodeData } from "../type";
import { ImageWithFallback, Nullable, dot } from "@instill-ai/toolkit";
import {
  Button,
  Form,
  Icons,
  Input,
  Tag,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../usePipelineBuilderStore";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomHandle } from "./CustomHandle";
import {
  PipelineComponentReference,
  extractReferencesFromConfiguration,
  InstillAIOpenAPIProperty,
  getPropertiesFromOpenAPISchema,
  getConnectorOpenAPISchema,
  extractPipelineComponentReferenceFromString,
  composeEdgesFromReferences,
} from "../lib";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  expandAllNodes: state.expandAllNodes,
  updateSelectedConnectorNodeId: state.updateSelectedConnectorNodeId,
  nodes: state.nodes,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  testModeEnabled: state.testModeEnabled,
});

export const DataConnectorInputSchema = z.object({
  key: z.string().min(1, { message: "Key is required" }),
  value: z.string().min(1, { message: "Value is required" }),
});

const UpdateNodeIdSchema = z.object({
  nodeId: z.string().min(1, { message: "Title is required" }),
});

export const ConnectorNode = ({ data, id }: NodeProps<ConnectorNodeData>) => {
  const {
    expandAllNodes,
    updateSelectedConnectorNodeId,
    nodes,
    updateNodes,
    updateEdges,
    testModeEnabled,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const { toast } = useToast();

  const [enableEdit, setEnableEdit] = React.useState(false);
  const [enableEditName, setEnableEditName] = React.useState(false);
  const connectorNameEditInputRef = React.useRef<HTMLInputElement>(null);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);

  const updateNodeIdForm = useForm<z.infer<typeof UpdateNodeIdSchema>>({
    resolver: zodResolver(UpdateNodeIdSchema),
    mode: "onBlur",
    defaultValues: {
      nodeId: id,
    },
  });

  const dataConnectorInputForm = useForm<
    z.infer<typeof DataConnectorInputSchema>
  >({
    resolver: zodResolver(DataConnectorInputSchema),
  });

  const { reset } = updateNodeIdForm;

  React.useEffect(() => {
    reset({
      nodeId: id,
    });
  }, [id, reset]);

  const [exapndInputs, setExpandInputs] = React.useState(false);
  const [exapndOutputs, setExpandOutputs] = React.useState(false);

  let aiTaskNotSelected = false;

  const { inputSchema, outputSchema } = getConnectorOpenAPISchema({
    component: data.component,
  });

  if (
    data.component.type === "COMPONENT_TYPE_CONNECTOR_AI" &&
    !data.component.configuration.input.task
  ) {
    aiTaskNotSelected = true;
  }

  React.useEffect(() => {
    setExpandInputs(expandAllNodes);
    setExpandOutputs(expandAllNodes);
  }, [expandAllNodes]);

  const inputProperties = React.useMemo(() => {
    if (!inputSchema) return [];
    return getPropertiesFromOpenAPISchema(inputSchema);
  }, [inputSchema]);

  const collapsedInputProperties = React.useMemo(() => {
    if (exapndInputs) return inputProperties;
    return inputProperties.slice(0, 3);
  }, [exapndInputs, inputProperties]);

  const outputProperties = React.useMemo(() => {
    if (!outputSchema) return [];
    return getPropertiesFromOpenAPISchema(outputSchema);
  }, [outputSchema]);

  const collapsedOutputProperties = React.useMemo(() => {
    if (exapndOutputs) return outputProperties;
    return outputProperties.slice(0, 3);
  }, [outputProperties, exapndOutputs]);

  function handleRenameNode(newNodeId: string) {
    if (newNodeId === id) {
      setEnableEditName(false);
      return;
    }

    updateEdges((prev) => {
      return prev.map((edge) => {
        // Find the edge that has this node as target
        if (edge.target === id) {
          return {
            ...edge,
            target: newNodeId,
          };
        }

        // Find the edge that has this node as source
        if (edge.source === id) {
          return {
            ...edge,
            source: newNodeId,
          };
        }

        return edge;
      });
    });

    updateNodes((prev) => {
      return prev.map((node) => {
        if (node.id === id && node.data.nodeType === "connector") {
          return {
            ...node,
            id: newNodeId,
            data: {
              ...node.data,
              component: {
                ...node.data.component,
                id: newNodeId,
              },
            },
          };
        }
        return node;
      });
    });

    updateSelectedConnectorNodeId(() => newNodeId);

    toast({
      title: "Successfully update node's name",
      variant: "alert-success",
      size: "small",
    });

    setEnableEditName(false);
  }

  function onEditDataConnectorInput(key: string) {
    dataConnectorInputForm.reset({
      value: data.component.configuration.input[key].value,
      key: key,
    });
    setEnableEdit(true);
  }

  function onSubmitDataConnectorInput(
    formData: z.infer<typeof DataConnectorInputSchema>
  ) {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "connector" && node.id === id) {
        if (prevFieldKey) {
          delete node.data.component.configuration.input[prevFieldKey];
        }

        node.data = {
          ...node.data,
          component: {
            ...node.data.component,
            configuration: {
              ...node.data.component.configuration,
              input: {
                ...node.data.component.configuration.input,
                [formData.key]: formData.value,
              },
            },
          },
        };
      }
      return node;
    });

    updateNodes(() => newNodes);

    const allReferences: PipelineComponentReference[] = [];

    newNodes.forEach((node) => {
      if (node.data.component?.configuration) {
        allReferences.push(
          ...extractReferencesFromConfiguration(
            node.data.component?.configuration,
            node.id
          )
        );
      }
    });

    const newEdges = composeEdgesFromReferences(allReferences, newNodes);
    updateEdges(() => newEdges);

    setEnableEdit(false);
    setPrevFieldKey(null);
    dataConnectorInputForm.reset({
      value: "",
      key: "",
    });
  }

  function onDeleteDataConnectorInput(key: string) {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "connector" && node.id === id) {
        delete node.data.component.configuration.body[key];

        node.data = {
          ...node.data,
        };
      }
      return node;
    });

    updateNodes(() => newNodes);

    const allReferences: PipelineComponentReference[] = [];

    newNodes.forEach((node) => {
      if (node.data.component?.configuration) {
        allReferences.push(
          ...extractReferencesFromConfiguration(
            node.data.component?.configuration,
            node.id
          )
        );
      }
    });

    const newEdges = composeEdgesFromReferences(allReferences, newNodes);
    updateEdges(() => newEdges);
  }

  return (
    <>
      <div
        onClick={() => {
          updateSelectedConnectorNodeId((prev) => {
            if (testModeEnabled) return null;
            if (enableEdit) return null;

            if (prev === id) {
              return null;
            } else {
              return id;
            }
          });
        }}
        className="flex flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-base-bg px-3 py-2.5 shadow-md hover:shadow-lg"
      >
        <div className="mb-2 flex flex-row gap-x-1">
          <ImageWithFallback
            src={`/icons/${data.component?.connector_definition?.vendor}/${data.component?.connector_definition?.icon}`}
            width={16}
            height={16}
            alt={`${data.component?.connector_definition?.title}-icon`}
            fallbackImg={
              <Icons.Box className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
            }
          />
          <Form.Root {...updateNodeIdForm}>
            <form className="my-auto flex">
              <Form.Field
                control={updateNodeIdForm.control}
                name="nodeId"
                render={({ field }) => {
                  return enableEditName ? (
                    <input
                      {...field}
                      className="flex flex-shrink bg-transparent p-1 text-semantic-fg-secondary product-body-text-4-medium focus:outline-none focus:ring-0"
                      ref={connectorNameEditInputRef}
                      value={field.value}
                      type="text"
                      autoComplete="off"
                      disabled={!enableEditName}
                      onBlur={() => {
                        updateNodeIdForm.handleSubmit((data) => {
                          if (data.nodeId) {
                            handleRenameNode(data.nodeId);
                          }
                        })();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      onKeyDown={(e) => {
                        // Disable enter key to prevent default form submit behavior
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          updateNodeIdForm.handleSubmit((data) => {
                            if (data.nodeId) {
                              handleRenameNode(data.nodeId);
                            }
                          })();
                        }
                      }}
                    />
                  ) : (
                    <p className="p-1 text-semantic-fg-secondary product-body-text-4-medium">
                      {field.value}
                    </p>
                  );
                }}
              />
            </form>
          </Form.Root>
          {enableEditName ? null : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                connectorNameEditInputRef.current?.focus();
                setEnableEditName(true);
              }}
              type="button"
            >
              <Icons.Edit03 className="h-4 w-4 stroke-semantic-fg-secondary" />
            </button>
          )}
        </div>
        {enableEdit ? (
          <Form.Root {...dataConnectorInputForm}>
            <form
              onSubmit={dataConnectorInputForm.handleSubmit(
                onSubmitDataConnectorInput
              )}
            >
              <div className="mb-3 flex flex-row justify-between">
                <Icons.ArrowLeft
                  className="my-auto h-5 w-5 stroke-slate-500"
                  onClick={() => {
                    setEnableEdit(!enableEdit);
                    dataConnectorInputForm.reset();
                  }}
                />
                <div>
                  <Button variant="primary" type="submit" size="sm">
                    Save
                  </Button>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Form.Field
                  control={dataConnectorInputForm.control}
                  name="key"
                  render={({ field }) => {
                    return (
                      <Form.Item className="w-[318px]">
                        <Form.Label className="!font-sans !text-base !font-semibold">
                          Key
                        </Form.Label>
                        <Form.Control className="h-8">
                          <Input.Root className="!px-[9px] !py-1.5">
                            <Input.Core
                              {...field}
                              type="text"
                              value={field.value ?? ""}
                              autoComplete="off"
                              className="!h-5 !text-sm"
                              placeholder="prompt"
                            />
                          </Input.Root>
                        </Form.Control>
                        <Form.Message />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={dataConnectorInputForm.control}
                  name="value"
                  render={({ field }) => {
                    return (
                      <Form.Item className="w-[318px]">
                        <Form.Label className="!font-sans !text-base !font-semibold">
                          Value
                        </Form.Label>
                        <Form.Control>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            autoComplete="off"
                            className="!h-[72px] resize-none !text-sm"
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
        ) : (
          <>
            {aiTaskNotSelected ? (
              <div className="w-[232px] rounded-sm border border-semantic-warning-default bg-semantic-warning-bg p-4">
                <p className="text-semantic-fg-primary product-body-text-3-regular">
                  Please select AI task for this connector
                </p>
              </div>
            ) : null}
            {aiTaskNotSelected ? null : (
              <div className="mb-1 product-body-text-4-medium">Inputs</div>
            )}
            {inputProperties.length > 0 ? (
              <div className="mb-1 flex flex-col gap-y-1">
                {collapsedInputProperties.map((property) => {
                  return (
                    <InputPropertyItem
                      key={property.title ? property.title : property.path}
                      property={property}
                      nodeId={id}
                      connectorConfiguration={
                        data.component.configuration.input
                      }
                    />
                  );
                })}
                {inputProperties.length > 3 ? (
                  <div className="flex flex-row-reverse">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandInputs((prev) => !prev);
                      }}
                      className="text-semantic-accent-hover !underline product-body-text-4-medium"
                    >
                      {exapndInputs ? "Less" : "More"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
            {data.component.type === "COMPONENT_TYPE_CONNECTOR_DATA" ? (
              testModeEnabled ? (
                <div className="mb-3 flex flex-col space-y-3">
                  {Object.entries(data.component.configuration.input).map(
                    ([key, value]) => {
                      return (
                        <div key={key} className="flex flex-col space-y-1">
                          <p className="text-semantic-fg-primary product-body-text-3-semibold">
                            {key}
                          </p>
                          <div className="min-h-[32px] rounded-sm bg-semantic-bg-primary px-2 py-1 text-semantic-fg-primary"></div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="mb-3 flex flex-col">
                  <div className="mb-3 flex flex-col space-y-4">
                    {Object.entries(
                      data.component.configuration.input as Record<string, any>
                    ).map(([key, value]) => {
                      const reference =
                        extractPipelineComponentReferenceFromString({
                          key,
                          value: value.value,
                          currentPath: [],
                          nodeId: id,
                        });

                      return (
                        <div key={key} className="flex flex-col">
                          <div className="flex flex-row items-center justify-between">
                            <div className="my-auto font-sans text-base font-semibold text-semantic-fg-primary">
                              {key}
                            </div>
                            <div className="my-auto flex flex-row gap-x-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditDataConnectorInput(key);
                                  setPrevFieldKey(key);
                                }}
                              >
                                <Icons.Edit03 className="h-6 w-6 stroke-semantic-accent-on-bg" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteDataConnectorInput(key);
                                }}
                              >
                                <Icons.Trash01 className="h-6 w-6 stroke-semantic-error-on-bg" />
                              </button>
                            </div>
                          </div>
                          <div>
                            {reference?.type === "singleCurlyBrace" ? (
                              <Tag
                                className="gap-x-1.5"
                                variant="lightBlue"
                                size="md"
                              >
                                {reference.referenceValue.withoutCurlyBraces}
                              </Tag>
                            ) : (
                              reference?.referenceValues.map(
                                (referenceValue) => (
                                  <Tag
                                    key={referenceValue.withCurlyBraces}
                                    className="gap-x-1.5"
                                    variant="lightBlue"
                                    size="md"
                                  >
                                    {referenceValue.withoutCurlyBraces}
                                  </Tag>
                                )
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    className="flex w-[232px]"
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEnableEdit(!enableEdit);
                    }}
                  >
                    Add Field
                    <Icons.Plus className="my-auto h-5 w-5 stroke-semantic-bg-primary " />
                  </Button>
                </div>
              )
            ) : null}
            {aiTaskNotSelected ? null : (
              <div className="mb-1 product-body-text-4-medium">Outputs</div>
            )}

            {outputProperties.length > 0 ? (
              <div className="mb-1 flex flex-col">
                <div className="mb-1 flex flex-col gap-y-1">
                  {collapsedOutputProperties.map((property) => {
                    return (
                      <div
                        key={property.title ? property.title : property.path}
                        className="w-[232px] rounded-[6px] bg-semantic-bg-primary p-2"
                      >
                        <div className="flex flex-row gap-x-2">
                          <p className="my-auto text-semantic-fg-secondary product-body-text-4-semibold">
                            {property.path?.split(".").pop()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {outputProperties.length > 3 ? (
                  <div className="flex flex-row-reverse">
                    <button
                      onClick={() => setExpandInputs((prev) => !prev)}
                      className="text-semantic-accent-hover !underline product-body-text-4-medium"
                    >
                      {exapndInputs ? "Less" : "More"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>
      <CustomHandle type="target" position={Position.Left} id={id} />
      <CustomHandle type="source" position={Position.Right} id={id} />
    </>
  );
};

const InputPropertyItem = (props: {
  property: InstillAIOpenAPIProperty;
  nodeId: string;
  connectorConfiguration: Record<string, any>;
}) => {
  const { property, nodeId, connectorConfiguration } = props;

  const propertyValue = property.path
    ? dot.getter(connectorConfiguration, property.path)
    : null;

  const reference = extractPipelineComponentReferenceFromString({
    value: propertyValue,
    nodeId,
    currentPath: property.path ? property.path?.split(".") : [],
    key: null,
  });

  return (
    <div
      key={property.title ? property.title : property.path}
      className="w-[232px] rounded-[6px] bg-semantic-bg-primary p-2"
    >
      <div className="flex flex-row flex-wrap justify-between gap-x-2 gap-y-2">
        <p className="my-auto text-semantic-fg-secondary product-body-text-4-semibold">
          {property.path?.split(".").pop()}
        </p>
        <InputPropertyValue
          reference={reference}
          propertyValue={propertyValue}
        />
      </div>
    </div>
  );
};

const InputPropertyValue = (props: {
  reference: Nullable<PipelineComponentReference>;
  propertyValue: any;
}) => {
  const { reference, propertyValue } = props;

  const testModeEnabled = usePipelineBuilderStore(
    (state) => state.testModeEnabled
  );

  if (!reference) {
    return <p className="product-body-text-4-regular">{propertyValue}</p>;
  }

  if (testModeEnabled) {
    if (reference.type === "singleCurlyBrace") {
      if (
        reference.referenceValue.withoutCurlyBraces.split(".")[0] === "start"
      ) {
        const inputDataKey =
          reference.referenceValue.withoutCurlyBraces.split(".")[1];
        const inputDataValue = "";

        return (
          <div className="min-h-[32px] min-w-[100px] rounded-sm border border-semantic-bg-line px-2 py-1.5 product-body-text-3-regular">
            {inputDataValue ? inputDataValue : ""}
          </div>
        );
      } else {
        return (
          <Tag size="md" variant="lightBlue">
            {reference.referenceValue}
          </Tag>
        );
      }
    } else {
      const startReferenceValues = reference.referenceValues.filter(
        (e) => e.withoutCurlyBraces.split(".")[0] === "start"
      );

      if (startReferenceValues.length === 0) {
        return (
          <div className="min-h-[32px] min-w-[100px] rounded-sm border border-semantic-bg-line px-2 py-1.5 product-body-text-3-regular">
            {reference.originalValue}
          </div>
        );
      } else {
        let substituteValue = reference.originalValue;
        for (const referenceValue of startReferenceValues) {
          const inputDataKey = referenceValue.withoutCurlyBraces.split(".")[1];
          const inputDataValue = "";
          substituteValue = substituteValue.replace(
            referenceValue.withCurlyBraces,
            inputDataValue ? inputDataValue : ""
          );
        }

        return (
          <div className="min-h-[32px] min-w-[100px] rounded-sm border border-semantic-bg-line px-2 py-1.5 product-body-text-3-regular">
            {substituteValue}
          </div>
        );
      }
    }
  } else {
    if (reference.type === "singleCurlyBrace") {
      return (
        <Tag size="md" variant="lightBlue">
          {reference.referenceValue.withoutCurlyBraces}
        </Tag>
      );
    } else {
      return (
        <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
          <Tag size="md" variant="lightBlue">
            {reference.referenceValues[0].withoutCurlyBraces}
          </Tag>
          {reference.referenceValues.length > 1 ? (
            <Tag size="md" variant="lightBlue" className="cursor-pointer">
              {`+ ${reference.referenceValues.length - 1}`}
            </Tag>
          ) : null}
        </div>
      );
    }
  }
};
