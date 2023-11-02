import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import { Node, NodeProps, Position } from "reactflow";
import {
  Form,
  Icons,
  LinkButton,
  Tooltip,
  useToast,
} from "@instill-ai/design-system";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ConnectorNodeData,
  NodeData,
  PipelineComponentReference,
} from "../../type";
import { CustomHandle } from "../CustomHandle";
import {
  extractReferencesFromConfiguration,
  getConnectorInputOutputSchema,
  composeEdgesFromReferences,
} from "../../lib";
import { InstillStore, Nullable, useInstillStore } from "../../../../lib";
import {
  AutoresizeInputWrapper,
  ImageWithFallback,
} from "../../../../components";
import { ConnectorNodeControlPanel } from "./ConnectorNodeControlPanel";
import { ResourceIDTag } from "./ResourceIDTag";
import { OutputProperties } from "./OutputProperties";
import { InputProperties } from "./InputProperties";
import { DataConnectorFreeForm } from "./DataConnectorFreeForm";
import { useShallow } from "zustand/react/shallow";

const selector = (store: InstillStore) => ({
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  nodes: store.nodes,
  edges: store.edges,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  testModeEnabled: store.testModeEnabled,
  testModeTriggerResponse: store.testModeTriggerResponse,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateCreateResourceDialogState: store.updateCreateResourceDialogState,
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

const UpdateNodeIdSchema = z.object({
  nodeId: z.string().nullable().optional(),
});

export const ConnectorNode = ({ data, id }: NodeProps<ConnectorNodeData>) => {
  const {
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    nodes,
    edges,
    updateNodes,
    updateEdges,
    testModeEnabled,
    testModeTriggerResponse,
    updatePipelineRecipeIsDirty,
    updateCreateResourceDialogState,
    isOwner,
    currentVersion,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();

  const connectorIDInputRef = React.useRef<HTMLInputElement>(null);

  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);

  const [enableEdit, setEnableEdit] = React.useState(false);

  const updateNodeIdForm = useForm<z.infer<typeof UpdateNodeIdSchema>>({
    resolver: zodResolver(UpdateNodeIdSchema),
    mode: "onBlur",
    defaultValues: {
      nodeId: id,
    },
  });

  const { reset } = updateNodeIdForm;

  React.useEffect(() => {
    reset({
      nodeId: id,
    });
  }, [id, reset]);

  let aiTaskNotSelected = false;
  let dataTaskNotSelected = false;
  let resourceNotCreated = false;

  const { inputSchema, outputSchema } = React.useMemo(() => {
    if (
      data.component.type === "COMPONENT_TYPE_CONNECTOR_AI" &&
      !data.component.configuration.task
    ) {
      return { inputSchema: null, outputSchema: null };
    }

    if (
      data.component.type === "COMPONENT_TYPE_CONNECTOR_DATA" &&
      data.component.definition_name ===
        "connector-definitions/data-pinecone" &&
      !data.component.configuration.task
    ) {
      return { inputSchema: null, outputSchema: null };
    }

    return getConnectorInputOutputSchema(data.component);
  }, [data.component]);

  if (
    data.component.type === "COMPONENT_TYPE_CONNECTOR_AI" &&
    !data.component.configuration.task
  ) {
    aiTaskNotSelected = true;
  }

  if (
    data.component.type === "COMPONENT_TYPE_CONNECTOR_DATA" &&
    data.component.definition_name === "connector-definitions/data-pinecone" &&
    !data.component.configuration.task
  ) {
    dataTaskNotSelected = true;
  }

  if (!data.component.resource_name) {
    resourceNotCreated = true;
  }

  function handleRenameNode(newNodeId: string) {
    if (newNodeId === id) {
      return;
    }

    const existingNodeID = nodes.map((node) => node.id);

    if (existingNodeID.includes(newNodeId)) {
      toast({
        title: "Component ID already exists",
        variant: "alert-error",
        size: "small",
      });
      updateNodeIdForm.reset({
        nodeId: id,
      });
      return;
    }

    const newNodes = nodes.map((node) => {
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

    if (selectedConnectorNodeId === id) {
      updateSelectedConnectorNodeId(() => newNodeId);
    }

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

    toast({
      title: "Successfully update node's name",
      variant: "alert-success",
      size: "small",
    });

    updatePipelineRecipeIsDirty(() => true);
  }

  const hasTargetEdges = React.useMemo(() => {
    return edges.some((edge) => edge.target === id);
  }, [edges, id]);

  const hasSourceEdges = React.useMemo(() => {
    return edges.some((edge) => edge.source === id);
  }, [edges, id]);

  function handleCopyNode() {
    const nodeIndex =
      nodes.filter((node) => node.data.component?.type === data.component.type)
        .length + 1;

    let nodePrefix: Nullable<string> = null;

    switch (data.component.connector_definition?.type) {
      case "CONNECTOR_TYPE_AI": {
        nodePrefix = "ai";
        break;
      }
      case "CONNECTOR_TYPE_BLOCKCHAIN": {
        nodePrefix = "blockchain";
        break;
      }
      case "CONNECTOR_TYPE_DATA": {
        nodePrefix = "data";
        break;
      }
      case "CONNECTOR_TYPE_OPERATOR": {
        nodePrefix = "operator";
        break;
      }
    }
    const nodeID = `${nodePrefix}_${nodeIndex}`;

    const newNodes: Node<NodeData>[] = [
      ...nodes,
      {
        id: nodeID,
        type: "connectorNode",
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
        position: { x: 0, y: 0 },
        data,
      },
    ];

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

    updatePipelineRecipeIsDirty(() => true);

    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
  }

  function handleDeleteNode() {
    const newNodes = nodes.filter((node) => node.id !== id);

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

    updatePipelineRecipeIsDirty(() => true);

    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
  }

  return (
    <>
      <div
        className={cn(
          "flex w-[var(--pipeline-builder-node-available-width)] flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-base-bg px-3 py-2.5 shadow-md hover:shadow-lg",
          {
            "outline outline-2 outline-offset-1 outline-semantic-accent-default":
              id === selectedConnectorNodeId,
          }
        )}
      >
        <div
          className={cn("flex w-full flex-row", { "mb-3": !nodeIsCollapsed })}
        >
          <div className="mr-auto flex flex-row gap-x-1">
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
                    const textStyle =
                      "text-semantic-fg-secondary product-body-text-4-medium";

                    return (
                      <AutoresizeInputWrapper
                        value={field.value ?? ""}
                        className="h-8 min-w-[36px] max-w-[150px]"
                        placeholderClassname={cn(textStyle, "p-1")}
                      >
                        <input
                          {...field}
                          className={cn(
                            "!absolute !bottom-0 !left-0 !right-0 !top-0 bg-transparent p-1 focus:!ring-1 focus:!ring-semantic-accent-default",
                            textStyle
                          )}
                          ref={connectorIDInputRef}
                          value={field.value ?? ""}
                          type="text"
                          autoComplete="off"
                          disabled={testModeEnabled}
                          onBlur={() => {
                            updateNodeIdForm.handleSubmit((data) => {
                              if (!data.nodeId || data.nodeId === "") {
                                updateNodeIdForm.reset({
                                  nodeId: id,
                                });
                                return;
                              }

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
                                if (!data.nodeId || data.nodeId === "") {
                                  updateNodeIdForm.reset({
                                    nodeId: id,
                                  });
                                  return;
                                }

                                if (data.nodeId) {
                                  handleRenameNode(data.nodeId);
                                }
                              })();
                            }
                          }}
                        />
                      </AutoresizeInputWrapper>
                    );
                  }}
                />
              </form>
            </Form.Root>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  {/* 
                    eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                  */}
                  <span className="flex" tabIndex={0}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        connectorIDInputRef.current?.focus();
                      }}
                      type="button"
                    >
                      <Icons.Edit03 className="h-4 w-4 stroke-semantic-fg-primary" />
                    </button>
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold"
                  >
                    Edit the component ID
                    <Tooltip.Arrow
                      className="fill-semantic-bg-primary"
                      offset={10}
                      width={9}
                      height={6}
                    />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
          {currentVersion === "latest" && isOwner ? (
            <ConnectorNodeControlPanel
              componentType={data.component.type}
              handleEditNode={() =>
                updateSelectedConnectorNodeId((prev) => {
                  if (prev === id) {
                    return null;
                  }
                  return id;
                })
              }
              handleCopyNode={handleCopyNode}
              handleDeleteNode={handleDeleteNode}
              testModeEnabled={testModeEnabled}
              nodeIsCollapsed={nodeIsCollapsed}
              setNodeIsCollapsed={setNodeIsCollapsed}
            />
          ) : null}
        </div>

        {nodeIsCollapsed ? null : (
          <>
            {resourceNotCreated ? (
              <div className="mb-3 w-full gap-y-2 rounded-sm border border-semantic-warning-default bg-semantic-warning-bg p-4">
                <p className="text-semantic-fg-primary product-body-text-3-regular">
                  Please create resource for this connector
                </p>
                <LinkButton
                  className="gap-x-2"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    updateCreateResourceDialogState(() => ({
                      open: true,
                      connectorType:
                        data.component.connector_definition?.type ?? null,
                      connectorDefinition:
                        data.component.connector_definition ?? null,
                      onCreated: (connectorResource) => {
                        const newNodes = nodes.map((node) => {
                          if (
                            node.data.nodeType === "connector" &&
                            node.id === id
                          ) {
                            node.data = {
                              ...node.data,
                              component: {
                                ...node.data.component,
                                resource_name: connectorResource.name,
                                resource: {
                                  ...connectorResource,
                                  connector_definition: null,
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

                        const newEdges = composeEdgesFromReferences(
                          allReferences,
                          newNodes
                        );
                        updatePipelineRecipeIsDirty(() => true);
                        updateEdges(() => newEdges);

                        updateCreateResourceDialogState(() => ({
                          open: false,
                          connectorType: null,
                          connectorDefinition: null,
                          onCreated: null,
                          onSelectedExistingResource: null,
                        }));
                      },
                      onSelectedExistingResource: (connectorResource) => {
                        updateNodes((prev) => {
                          return prev.map((node) => {
                            if (
                              node.data.nodeType === "connector" &&
                              node.id === id
                            ) {
                              node.data = {
                                ...node.data,
                                component: {
                                  ...node.data.component,
                                  resource_name: connectorResource.name,
                                },
                              };
                            }
                            return node;
                          });
                        });

                        updatePipelineRecipeIsDirty(() => true);

                        updateCreateResourceDialogState(() => ({
                          open: false,
                          connectorType: null,
                          connectorDefinition: null,
                          onCreated: null,
                          onSelectedExistingResource: null,
                        }));
                      },
                    }));
                  }}
                >
                  Create resource
                </LinkButton>
              </div>
            ) : null}
            {aiTaskNotSelected && !resourceNotCreated ? (
              <div className="mb-3 w-full rounded-sm border border-semantic-warning-default bg-semantic-warning-bg p-4">
                <p className="text-semantic-fg-primary product-body-text-3-regular">
                  Please select AI task for this connector
                </p>
              </div>
            ) : null}
            {dataTaskNotSelected && !resourceNotCreated ? (
              <div className="mb-3 w-full rounded-sm border border-semantic-warning-default bg-semantic-warning-bg p-4">
                <p className="text-semantic-fg-primary product-body-text-3-regular">
                  Please select Data task for this connector
                </p>
              </div>
            ) : null}

            {/* 
          Input properties
        */}

            {!aiTaskNotSelected &&
            !dataTaskNotSelected &&
            !resourceNotCreated &&
            !enableEdit ? (
              <div className="flex flex-col">
                <div className="mb-1 product-body-text-4-medium">input</div>
                <InputProperties
                  component={data.component}
                  inputSchema={inputSchema}
                  traces={testModeTriggerResponse?.metadata?.traces ?? null}
                />
              </div>
            ) : null}

            {/* 
          Data connector free form
        */}

            {data.component.type === "COMPONENT_TYPE_CONNECTOR_DATA" &&
            data.component.definition_name !==
              "connector-definitions/data-pinecone" &&
            data.component.definition_name !==
              "connector-definitions/data-gcs" ? (
              <DataConnectorFreeForm
                nodeID={id}
                component={data.component}
                dataTaskNotSelected={dataTaskNotSelected}
                enableEdit={enableEdit}
                setEnableEdit={setEnableEdit}
              />
            ) : null}

            {/* 
          Output properties
        */}

            {!aiTaskNotSelected &&
            !dataTaskNotSelected &&
            !resourceNotCreated &&
            !enableEdit ? (
              <div className="flex flex-col">
                <div className="mb-1 product-body-text-4-medium">output</div>
                <OutputProperties
                  component={data.component}
                  outputSchema={outputSchema}
                  traces={testModeTriggerResponse?.metadata?.traces ?? null}
                />
              </div>
            ) : null}

            <div className="flex flex-row-reverse">
              <ResourceIDTag
                resourceID={
                  data.component.resource_name
                    ? data.component.resource_name.split("/")[3]
                    : null
                }
              />
            </div>
          </>
        )}
      </div>
      <CustomHandle
        className={hasTargetEdges ? "" : "!opacity-0"}
        type="target"
        position={Position.Left}
        id={id}
      />
      <CustomHandle
        className={hasSourceEdges ? "" : "!opacity-0"}
        type="source"
        position={Position.Right}
        id={id}
      />
    </>
  );
};
