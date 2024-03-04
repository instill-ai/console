import * as React from "react";
import { NodeProps, Position } from "reactflow";
import { Form, Icons, useToast } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import { ConnectorNodeData } from "../../../type";
import { CustomHandle } from "../../CustomHandle";
import {
  getConnectorInputOutputSchema,
  composeEdgesFromNodes,
  getConnectorOperatorComponentConfiguration,
} from "../../../lib";
import {
  GeneralRecord,
  InstillStore,
  useConnectorDefinitions,
  useInstillForm,
  useInstillStore,
  validateInstillID,
} from "../../../../../lib";
import { ImageWithFallback } from "../../../../../components";
import { ConnectorIDTag } from "./ConnectorIDTag";
import { DataConnectorFreeForm } from "./DataConnectorFreeForm";
import { ResourceNotCreatedWarning } from "./ResourceNotCreatedWarning";
import { ConnectorOperatorControlPanel } from "../control-panel";
import { OpenAdvancedConfigurationButton } from "../../OpenAdvancedConfigurationButton";
import { useCheckIsHidden, useUpdaterOnNode } from "../../../lib";
import { InstillErrors } from "../../../../../constant/errors";
import {
  NodeBottomBarContent,
  NodeBottomBarMenu,
  NodeHead,
  NodeIDEditor,
  NodeWrapper,
  useNodeIDEditorForm,
} from "../common";
import { ComponentOutputReferenceHints } from "../../ComponentOutputReferenceHints";
import { isConnectorComponent } from "../../../lib/checkComponentType";

const selector = (store: InstillStore) => ({
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  nodes: store.nodes,
  edges: store.edges,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateCreateResourceDialogState: store.updateCreateResourceDialogState,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  currentVersion: store.currentVersion,
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  collapseAllNodes: store.collapseAllNodes,
});

export const ConnectorNode = ({ data, id }: NodeProps<ConnectorNodeData>) => {
  const {
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    nodes,
    edges,
    updateNodes,
    updateEdges,
    updatePipelineRecipeIsDirty,
    updateCreateResourceDialogState,
    updateCurrentAdvancedConfigurationNodeID,
    currentVersion,
    pipelineIsReadOnly,
    accessToken,
    enabledQuery,
    collapseAllNodes,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();

  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);
  const [enableEdit, setEnableEdit] = React.useState(false);

  const nodeIDEditorForm = useNodeIDEditorForm(id);

  const connectorDefinitions = useConnectorDefinitions({
    connectorType: "all",
    enabled: enabledQuery,
    accessToken,
  });

  React.useEffect(() => {
    setNodeIsCollapsed(collapseAllNodes);
  }, [collapseAllNodes]);

  const { reset } = nodeIDEditorForm;

  React.useEffect(() => {
    reset({
      nodeID: id,
    });
  }, [id, reset]);

  let resourceNotCreated = false;

  if (!data.connector_component.connector_name) {
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
      if (node.id === id && isConnectorComponent(node.data)) {
        return {
          ...node,
          id: newID,
          data: {
            ...node.data,
            id: newID,
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

  const checkIsHidden = useCheckIsHidden("onNode");

  const { fields, form, ValidatorSchema, selectedConditionMap } =
    useInstillForm(
      data.connector_component.definition?.spec.component_specification ?? null,
      data.connector_component,
      {
        size: "sm",
        enableSmartHint: true,
        checkIsHidden,
        componentID: data.id,
        disabledAll: currentVersion !== "latest" || pipelineIsReadOnly,
      }
    );

  const { outputSchema } = React.useMemo(() => {
    // The configuration stored in the node will only change when the user
    // click on the "Save" button. Therefore, we need to use the
    // selectedConditionMap to get the latest selected task. Due to the
    // output schema depends on the selected task

    return getConnectorInputOutputSchema(
      data,
      selectedConditionMap ? selectedConditionMap["task"] : undefined
    );
  }, [data, selectedConditionMap]);

  const { getValues, trigger } = form;

  useUpdaterOnNode({
    currentNodeData: data,
    form,
    ValidatorSchema,
  });

  const targetConnectorDefinition = React.useMemo(() => {
    if (!connectorDefinitions.isSuccess) return null;

    return (
      connectorDefinitions.data.find(
        (e) => e.name === data.connector_component.definition_name
      ) ?? null
    );
  }, [connectorDefinitions.isSuccess, connectorDefinitions.data, data]);

  return (
    <NodeWrapper
      nodeData={data}
      noteIsOpen={noteIsOpen}
      renderNodeBottomBar={() => <NodeBottomBarMenu />}
      renderBottomBarInformation={() => (
        <NodeBottomBarContent
          componentID={data.id}
          outputSchema={outputSchema}
          componentSchema={
            (data.connector_component.definition?.spec as GeneralRecord) ?? null
          }
        />
      )}
    >
      {/* The header of node */}

      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-1">
          <ImageWithFallback
            src={`/icons/${data.connector_component.definition?.id}.svg`}
            width={16}
            height={16}
            alt={`${data.connector_component.definition?.title}-icon`}
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
          nodeID={id}
          nodeData={data}
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
              connectorType: data.connector_component.definition?.type ?? null,
              connectorDefinition: data.connector_component.definition ?? null,
              onCreated: (connector) => {
                const newNodes = nodes.map((node) => {
                  if (isConnectorComponent(node.data) && node.id === id) {
                    node.data = {
                      ...node.data,
                      connector_component: {
                        ...node.data.connector_component,
                        connector_name: connector.name,
                        connector: {
                          ...connector,
                          connector_definition: null,
                        },
                        definition: connector.connector_definition,
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
                    if (isConnectorComponent(node.data) && node.id === id) {
                      node.data = {
                        ...node.data,
                        connector_component: {
                          ...node.data.connector_component,
                          connector_name: connector.name,

                          // Some dynamic generated connector definition like instill_model's modelName enum
                          // will only be returned from connectors endpoint. Therefore, we need to update the
                          // connector definition here
                          definition: connector.connector_definition,
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
          connectorTitle={
            targetConnectorDefinition ? targetConnectorDefinition.title : null
          }
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

          {isConnectorComponent(data) &&
          data.connector_component.definition?.type === "CONNECTOR_TYPE_DATA" &&
          data.connector_component.definition_name !==
            "connector-definitions/pinecone" &&
          data.connector_component.definition_name !==
            "connector-definitions/gcs" &&
          data.connector_component.definition_name !==
            "connector-definitions/google-search" &&
          data.connector_component.definition_name !==
            "connector-definitions/redis" &&
          data.connector_component.definition_name !==
            "connector-definitions/website" &&
          data.connector_component.definition_name !==
            "connector-definitions/restapi" ? (
            <DataConnectorFreeForm
              nodeID={id}
              component={data}
              enableEdit={enableEdit}
              setEnableEdit={setEnableEdit}
            />
          ) : null}

          {/* 
            Output properties
          */}

          <div className="mb-4 w-full">
            {!resourceNotCreated && !enableEdit ? (
              <ComponentOutputReferenceHints
                componentID={data.id}
                outputSchema={outputSchema}
              />
            ) : null}
          </div>

          <div className="mb-3 flex flex-row-reverse">
            <ConnectorIDTag
              connectorID={
                data.connector_component.connector_name
                  ? data.connector_component.connector_name.split("/")[3]
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
