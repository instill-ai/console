import * as React from "react";
import { Node, NodeProps, Position } from "reactflow";
import { Form, Icons, useToast } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import { ConnectorNodeData, NodeData } from "../../../type";
import { CustomHandle } from "../../CustomHandle";
import {
  getConnectorInputOutputSchema,
  transformConnectorDefinitionIDToComponentIDPrefix,
  generateNewComponentIndex,
  composeEdgesFromNodes,
} from "../../../lib";
import {
  InstillStore,
  useInstillForm,
  useInstillStore,
  validateInstillID,
} from "../../../../../lib";
import { ImageWithFallback, ObjectViewer } from "../../../../../components";
import { ConnectorIDTag } from "./ConnectorIDTag";
import { DataConnectorFreeForm } from "./DataConnectorFreeForm";
import { ResourceNotCreatedWarning } from "./ResourceNotCreatedWarning";
import { ConnectorOperatorControlPanel } from "../control-panel";
import { ComponentOutputs } from "../../ComponentOutputs";
import { OpenAdvancedConfigurationButton } from "../../OpenAdvancedConfigurationButton";
import { useCheckIsHidden } from "../../useCheckIsHidden";
import { useUpdaterOnNode } from "../../useUpdaterOnNode";
import { InstillErrors } from "../../../../../constant/errors";
import {
  NodeBottomBar,
  NodeHead,
  NodeIDEditor,
  NodeWrapper,
  useNodeIDEditorForm,
} from "../common";

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
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  currentVersion: store.currentVersion,
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
    updateCurrentAdvancedConfigurationNodeID,
    currentVersion,
    pipelineIsReadOnly,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();

  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [isOpenBottomBarOutput, setIsOpenBottomBarOutput] =
    React.useState(false);

  const nodeIDEditorForm = useNodeIDEditorForm(id);

  const { reset } = nodeIDEditorForm;

  React.useEffect(() => {
    reset({
      nodeID: id,
    });
  }, [id, reset]);

  let resourceNotCreated = false;

  const { outputSchema } = React.useMemo(() => {
    return getConnectorInputOutputSchema(data.component);
  }, [data.component]);

  if (!data.component.resource_name) {
    resourceNotCreated = true;
  }

  function handleRename(newID: string) {
    if (newID === id) {
      return;
    }

    if (!validateInstillID(newID)) {
      toast({
        title: InstillErrors.IDInvalidError,
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
    const newEdges = composeEdgesFromNodes(newNodes);
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);

    if (selectedConnectorNodeId === id) {
      updateSelectedConnectorNodeId(() => newID);
    }

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
    const newEdges = composeEdgesFromNodes(newNodes);
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
  }

  function handleDeleteNode() {
    const newNodes = nodes.filter((node) => node.id !== id);
    const newEdges = composeEdgesFromNodes(newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
  }

  const checkIsHidden = useCheckIsHidden("onNode");

  const { fields, form, ValidatorSchema } = useInstillForm(
    data.component.connector_definition?.spec.component_specification ?? null,
    data.component.configuration,
    {
      size: "sm",
      enableSmartHint: true,
      checkIsHidden,
      componentID: data.component.id,
      disabledAll: currentVersion !== "latest" || pipelineIsReadOnly,
    }
  );

  const { getValues, trigger } = form;

  useUpdaterOnNode({
    id,
    nodeType: "connector",
    form,
    ValidatorSchema,
    configuration: data.component.configuration,
  });

  const bottomBarInformation = React.useMemo(() => {
    if (
      !testModeTriggerResponse ||
      !testModeTriggerResponse.metadata ||
      !testModeTriggerResponse.metadata.traces ||
      !testModeTriggerResponse.metadata.traces[id] ||
      !testModeTriggerResponse.metadata.traces[id].outputs ||
      testModeTriggerResponse.metadata.traces[id].outputs.length === 0
    ) {
      if (isOpenBottomBarOutput) {
        return (
          <div className="w-full">
            <ObjectViewer value="" />
          </div>
        );
      }

      return null;
    }

    const value = testModeTriggerResponse.metadata.traces[id].outputs[0];

    if (isOpenBottomBarOutput) {
      return (
        <div className="w-full">
          <ObjectViewer value={value ? JSON.stringify(value, null, 2) : null} />
        </div>
      );
    }

    return null;
  }, [isOpenBottomBarOutput, testModeTriggerResponse, id]);

  return (
    <NodeWrapper
      nodeType={data.nodeType}
      id={id}
      note={data.note}
      noteIsOpen={noteIsOpen}
      renderNodeBottomBar={() => {
        return (
          <NodeBottomBar.Root>
            <NodeBottomBar.Item
              value="output"
              onClick={() => {
                if (pipelineIsReadOnly) return;
                setIsOpenBottomBarOutput((prev) => !prev);
              }}
            >
              Output
            </NodeBottomBar.Item>
          </NodeBottomBar.Root>
        );
      }}
      renderBottomBarInformation={() => bottomBarInformation}
    >
      {/* The header of node */}

      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-1">
          <ImageWithFallback
            src={`/icons/${data.component?.connector_definition?.icon}`}
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
          handleCopyNode={handleCopyNode}
          handleDeleteNode={handleDeleteNode}
          nodeIsCollapsed={nodeIsCollapsed}
          setNodeIsCollapsed={setNodeIsCollapsed}
          handleToggleNote={() => setNoteIsOpen((prev) => !prev)}
          noteIsOpen={noteIsOpen}
        />
      </NodeHead>

      {nodeIsCollapsed ? null : resourceNotCreated ? (
        <ResourceNotCreatedWarning
          onCreate={() => {
            updateCreateResourceDialogState(() => ({
              open: true,
              connectorType: data.component.connector_definition?.type ?? null,
              connectorDefinition: data.component.connector_definition ?? null,
              onCreated: (connector) => {
                const newNodes = nodes.map((node) => {
                  if (node.data.nodeType === "connector" && node.id === id) {
                    node.data = {
                      ...node.data,
                      component: {
                        ...node.data.component,
                        resource_name: connector.name,
                        resource: {
                          ...connector,
                          connector_definition: null,
                        },
                      },
                    };
                  }
                  return node;
                });
                const newEdges = composeEdgesFromNodes(newNodes);
                updateNodes(() => newNodes);
                updateEdges(() => newEdges);
                updatePipelineRecipeIsDirty(() => true);
                updateCreateResourceDialogState(() => ({
                  open: false,
                  connectorType: null,
                  connectorDefinition: null,
                  onCreated: null,
                  onSelectedExistingResource: null,
                }));
              },
              onSelectedExistingResource: (connector) => {
                updateNodes((prev) => {
                  return prev.map((node) => {
                    if (node.data.nodeType === "connector" && node.id === id) {
                      node.data = {
                        ...node.data,
                        component: {
                          ...node.data.component,
                          resource_name: connector.name,
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
          disabled={pipelineIsReadOnly}
        />
      ) : (
        <>
          <div className="mb-4">
            <Form.Root {...form}>
              <form>{fields}</form>
            </Form.Root>
          </div>
          <div className="mb-2 flex flex-row-reverse">
            <OpenAdvancedConfigurationButton
              onClick={() => {
                if (pipelineIsReadOnly) return;

                const values = getValues();

                const parsedResult = ValidatorSchema.safeParse(values);

                if (parsedResult.success) {
                  updateCurrentAdvancedConfigurationNodeID(() => id);
                } else {
                  for (const error of parsedResult.error.errors) {
                    trigger(error.path.join("."));
                  }
                }
              }}
            />
          </div>

          {/* 
            Data connector free form
          */}

          {data.component.type === "COMPONENT_TYPE_CONNECTOR_DATA" &&
          data.component.definition_name !== "connector-definitions/pinecone" &&
          data.component.definition_name !== "connector-definitions/gcs" &&
          data.component.definition_name !==
            "connector-definitions/google-search" &&
          data.component.definition_name !== "connector-definitions/redis" &&
          data.component.definition_name !== "connector-definitions/website" &&
          data.component.definition_name !== "connector-definitions/restapi" ? (
            <DataConnectorFreeForm
              nodeID={id}
              component={data.component}
              enableEdit={enableEdit}
              setEnableEdit={setEnableEdit}
            />
          ) : null}

          {/* 
            Output properties
          */}

          <div className="mb-4 w-full">
            {!resourceNotCreated && !enableEdit ? (
              <ComponentOutputs
                componentID={data.component.id}
                outputSchema={outputSchema}
                nodeType="connector"
                response={testModeTriggerResponse}
                chooseTitleFrom="key"
              />
            ) : null}
          </div>

          <div className="mb-3 flex flex-row-reverse">
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
