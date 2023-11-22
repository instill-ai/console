import * as React from "react";
import { Node, NodeProps, Position } from "reactflow";
import { Icons, useToast } from "@instill-ai/design-system";

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
  transformConnectorDefinitionIDToComponentIDPrefix,
  generateNewComponentIndex,
} from "../../lib";
import {
  InstillStore,
  Nullable,
  useInstillStore,
  validateComponentID,
} from "../../../../lib";
import { ImageWithFallback } from "../../../../components";
import { ConnectorIDTag } from "./ConnectorIDTag";
import { InputProperties } from "./InputProperties";
import { DataConnectorFreeForm } from "./DataConnectorFreeForm";
import { useShallow } from "zustand/react/shallow";
import { NodeWrapper } from "../NodeWrapper";
import { NodeHead } from "../NodeHead";
import { NodeIDEditor, useNodeIDEditorForm } from "../NodeIDEditor";
import { ResourceNotCreatedWarning } from "./ResourceNotCreatedWarning";
import { TaskNotSelectedWarning } from "./TaskNotSelectedWarning";
import { ConnectorOperatorControlPanel } from "../control-panel";
import { ComponentOutputs } from "../ComponentOutputs";

const selector = (store: InstillStore) => ({
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  nodes: store.nodes,
  edges: store.edges,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  testModeTriggerResponse: store.testModeTriggerResponse,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateCreateResourceDialogState: store.updateCreateResourceDialogState,
});

export const ConnectorNode = ({ data, id }: NodeProps<ConnectorNodeData>) => {
  const {
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    nodes,
    edges,
    updateNodes,
    updateEdges,
    testModeTriggerResponse,
    updatePipelineRecipeIsDirty,
    updateCreateResourceDialogState,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();

  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);
  const [enableEdit, setEnableEdit] = React.useState(false);

  const nodeIDEditorForm = useNodeIDEditorForm(id);

  const { reset } = nodeIDEditorForm;

  React.useEffect(() => {
    reset({
      nodeID: id,
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

  function handleRename(newID: string) {
    if (newID === id) {
      return;
    }

    if (!validateComponentID(newID)) {
      toast({
        title:
          "The component ID should be lowercase without any space or special character besides the underscore, and should be less than 63 characters.",
        variant: "alert-error",
        size: "small",
      });
      nodeIDEditorForm.reset({
        nodeID: id,
      });
      return;
    }

    const existingNodeID = nodes.map((node) => node.id);

    if (existingNodeID.includes(newID)) {
      toast({
        title: "Component ID already exists",
        variant: "alert-error",
        size: "small",
      });
      nodeIDEditorForm.reset({
        nodeID: id,
      });
      return;
    }

    const newNodes = nodes.map((node) => {
      if (node.id === id && node.data.nodeType === "connector") {
        return {
          ...node,
          id: newID,
          data: {
            ...node.data,
            component: {
              ...node.data.component,
              id: newID,
            },
          },
        };
      }
      return node;
    });

    if (selectedConnectorNodeId === id) {
      updateSelectedConnectorNodeId(() => newID);
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
    if (!data.component.connector_definition) {
      return;
    }

    const nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
      data.component.connector_definition.id
    );

    // Generate a new component index
    const nodeIndex = generateNewComponentIndex(
      nodes.map((e) => e.id),
      nodePrefix
    );

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
    <NodeWrapper
      nodeType={data.nodeType}
      id={id}
      note={data.note}
      noteIsOpen={noteIsOpen}
    >
      {/* The header of node */}

      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
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
          <NodeIDEditor
            form={nodeIDEditorForm}
            nodeID={id}
            handleRename={handleRename}
          />
        </div>
        <ConnectorOperatorControlPanel
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
          nodeIsCollapsed={nodeIsCollapsed}
          setNodeIsCollapsed={setNodeIsCollapsed}
          handleToggleNote={() => setNoteIsOpen((prev) => !prev)}
          noteIsOpen={noteIsOpen}
        />
      </NodeHead>

      {nodeIsCollapsed ? null : (
        <>
          {resourceNotCreated ? (
            <ResourceNotCreatedWarning
              onCreate={() => {
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
            />
          ) : null}
          {aiTaskNotSelected && !resourceNotCreated ? (
            <TaskNotSelectedWarning componentType="COMPONENT_TYPE_CONNECTOR_AI" />
          ) : null}
          {dataTaskNotSelected && !resourceNotCreated ? (
            <TaskNotSelectedWarning componentType="COMPONENT_TYPE_CONNECTOR_DATA" />
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
          data.component.definition_name !== "connector-definitions/data-gcs" &&
          data.component.definition_name !==
            "connector-definitions/data-google-search" ? (
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
            <ComponentOutputs
              componentID={data.component.id}
              outputSchema={outputSchema}
              traces={testModeTriggerResponse?.metadata?.traces ?? null}
            />
          ) : null}

          <div className="flex flex-row-reverse">
            <ConnectorIDTag
              connectorID={
                data.component.resource_name
                  ? data.component.resource_name.split("/")[3]
                  : null
              }
            />
          </div>
        </>
      )}
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
    </NodeWrapper>
  );
};
