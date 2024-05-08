"use client";

import * as React from "react";
import { NodeProps } from "reactflow";
import { Form, Icons } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import { ConnectorNodeData } from "../../../type";
import {
  getConnectorInputOutputSchema,
  getConnectorOperatorComponentConfiguration,
} from "../../../lib";
import {
  GeneralRecord,
  InstillStore,
  useInstillForm,
  useInstillStore,
} from "../../../../../lib";
import { ImageWithFallback } from "../../../../../components";
import { DataConnectorFreeForm } from "./DataConnectorFreeForm";
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
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  currentVersion: store.currentVersion,
  collapseAllNodes: store.collapseAllNodes,
  entitySecrets: store.entitySecrets,
});

export const ConnectorNode = ({ data, id }: NodeProps<ConnectorNodeData>) => {
  const {
    updateCurrentAdvancedConfigurationNodeID,
    currentVersion,
    pipelineIsReadOnly,
    collapseAllNodes,
    entitySecrets,
  } = useInstillStore(useShallow(selector));

  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);
  const [enableEdit, setEnableEdit] = React.useState(false);

  React.useEffect(() => {
    setNodeIsCollapsed(collapseAllNodes);
  }, [collapseAllNodes]);

  const checkIsHidden = useCheckIsHidden("onNode");

  const componentConfiguration = React.useMemo(() => {
    return getConnectorOperatorComponentConfiguration(data);
  }, [data]);

  const { fields, form, ValidatorSchema, selectedConditionMap } =
    useInstillForm(
      data.connector_component.definition?.spec.component_specification ?? null,
      componentConfiguration,
      {
        size: "sm",
        enableSmartHint: true,
        checkIsHidden,
        componentID: data.id,
        disabledAll: currentVersion !== "latest" || pipelineIsReadOnly,
        secrets: entitySecrets,
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

      {nodeIsCollapsed ? null : (
        <React.Fragment>
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
            {!enableEdit ? (
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
        </React.Fragment>
      )}
    </NodeWrapper>
  );
};
