"use client";

import * as React from "react";
import { NodeProps } from "reactflow";
import { Form, Icons } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import { getGeneralComponentInOutputSchema } from "../../../lib";
import {
  GeneralRecord,
  InstillStore,
  useInstillForm,
  useInstillStore,
} from "../../../../../lib";
import { ImageWithFallback } from "../../../../../components";
import { DataConnectorFreeForm } from "./DataConnectorFreeForm";
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
import { GeneralNodeData } from "../../../type";
import { isPipelineGeneralComponent } from "../../../lib/checkComponentType";
import { NodeControlPanel } from "../control-panel";

const selector = (store: InstillStore) => ({
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  currentVersion: store.currentVersion,
  collapseAllNodes: store.collapseAllNodes,
  entitySecrets: store.entitySecrets,
});

export const GeneralNode = ({ data, id }: NodeProps<GeneralNodeData>) => {
  const {
    updateCurrentAdvancedConfigurationNodeID,
    currentVersion,
    pipelineIsReadOnly,
    collapseAllNodes,
    entitySecrets,
  } = useInstillStore(useShallow(selector));

  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);
  const [forceCloseCollapsibleFormGroups, setForceCloseCollapsibleFormGroups] =
    React.useState<string[]>([]);
  const [forceOpenCollapsibleFormGroups, setForceOpenCollapsibleFormGroups] =
    React.useState<string[]>([]);
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [supportInstillCredit, updateSupportInstillCredit] =
    React.useState(false);
  const [isUsingInstillCredit, updateIsUsingInstillCredit] =
    React.useState(false);

  React.useEffect(() => {
    setNodeIsCollapsed(collapseAllNodes);
  }, [collapseAllNodes]);

  const checkIsHidden = useCheckIsHidden("onNode");

  const componentConfiguration = React.useMemo(() => {
    return {
      input: data.input,
      task: data.task,
      condition: data.condition,
      setup: data.setup ? data.setup : undefined,
    };
  }, [data]);

  const { fields, form, ValidatorSchema, selectedConditionMap } =
    useInstillForm(
      data.definition?.spec.component_specification ?? null,
      componentConfiguration,
      {
        size: "sm",
        enableSmartHint: true,
        checkIsHidden,
        componentID: id,
        disabledAll: currentVersion !== "latest" || pipelineIsReadOnly,
        secrets: entitySecrets,
        collapsibleDefaultOpen: true,
        enabledCollapsibleFormGroup: true,
        forceCloseCollapsibleFormGroups,
        updateForceCloseCollapsibleFormGroups:
          setForceCloseCollapsibleFormGroups,
        forceOpenCollapsibleFormGroups,
        updateForceOpenCollapsibleFormGroups: setForceOpenCollapsibleFormGroups,
        supportInstillCredit,
        updateSupportInstillCredit,
        updateIsUsingInstillCredit,
      }
    );

  const { outputSchema } = React.useMemo(() => {
    // The configuration stored in the node will only change when the user
    // click on the "Save" button. Therefore, we need to use the
    // selectedConditionMap to get the latest selected task. Due to the
    // output schema depends on the selected task

    return getGeneralComponentInOutputSchema(
      data,
      selectedConditionMap ? selectedConditionMap["task"] : undefined
    );
  }, [data, selectedConditionMap]);

  const { getValues, trigger } = form;

  useUpdaterOnNode({
    currentNodeData: data,
    form,
    ValidatorSchema,
    nodeID: id,
  });

  return (
    <NodeWrapper
      nodeID={id}
      nodeData={data}
      noteIsOpen={noteIsOpen}
      renderNodeBottomBar={() => (
        <NodeBottomBarMenu isUsingInstillCredit={isUsingInstillCredit} />
      )}
      renderBottomBarInformation={() => (
        <NodeBottomBarContent
          componentID={id}
          outputSchema={outputSchema}
          componentSchema={(data.definition?.spec as GeneralRecord) ?? null}
        />
      )}
    >
      {/* The header of node */}

      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-1">
          <ImageWithFallback
            src={`/icons/${data.definition?.id}.svg`}
            width={16}
            height={16}
            alt={`${data.definition?.title}-icon`}
            fallbackImg={
              <Icons.Box className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
            }
          />
          <NodeIDEditor currentNodeID={id} />
        </div>
        <NodeControlPanel
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

          {isPipelineGeneralComponent(data) &&
          data.definition &&
          "type" in data.definition &&
          data.definition?.type === "CONNECTOR_TYPE_DATA" &&
          data.type !== "pinecone" &&
          data.type !== "gcs" &&
          data.type !== "google-search" &&
          data.type !== "redis" &&
          data.type !== "website" &&
          data.type !== "restapi" ? (
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
                componentID={id}
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
