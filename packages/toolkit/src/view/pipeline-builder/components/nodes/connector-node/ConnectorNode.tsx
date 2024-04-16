"use client";

import * as React from "react";
import { NodeProps } from "reactflow";
import { Form, Icons } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import { ConnectorNodeData } from "../../../type";
import {
  getConnectorInputOutputSchema,
  composeEdgesFromNodes,
  isConnectorNode,
} from "../../../lib";
import {
  GeneralRecord,
  InstillStore,
  useConnectorDefinitions,
  useInstillForm,
  useInstillStore,
} from "../../../../../lib";
import { ImageWithFallback } from "../../../../../components";
import { ConnectorIDTag } from "./ConnectorIDTag";
import { DataConnectorFreeForm } from "./DataConnectorFreeForm";
import { ResourceNotCreatedWarning } from "./ResourceNotCreatedWarning";
import { ConnectorOperatorControlPanel } from "../control-panel";
import { OpenAdvancedConfigurationButton } from "../../OpenAdvancedConfigurationButton";
import { useCheckIsHidden, useUpdaterOnNode } from "../../../lib";
import {
  NodeBottomBarContent,
  NodeBottomBarMenu,
  NodeHead,
  NodeIDEditor,
  NodeWrapper,
} from "../common";
import { ComponentOutputReferenceHints } from "../../ComponentOutputReferenceHints";
import { isConnectorComponent } from "../../../lib/checkComponentType";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
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
    nodes,
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

  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);
  const [enableEdit, setEnableEdit] = React.useState(false);

  const connectorDefinitions = useConnectorDefinitions({
    connectorType: "all",
    enabled: enabledQuery,
    accessToken,
  });

  React.useEffect(() => {
    setNodeIsCollapsed(collapseAllNodes);
  }, [collapseAllNodes]);

  let resourceNotCreated = false;

  if (!data.connector_component.connector_name) {
    resourceNotCreated = true;
  }

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
          <NodeIDEditor currentNodeID={id} />
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
                  if (isConnectorNode(node) && node.id === id) {
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
                    if (isConnectorNode(node) && node.id === id) {
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
                component={data}
                task={
                  selectedConditionMap
                    ? selectedConditionMap["task"]
                    : undefined
                }
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
    </NodeWrapper>
  );
};
