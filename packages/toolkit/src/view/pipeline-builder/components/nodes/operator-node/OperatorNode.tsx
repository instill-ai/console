import * as React from "react";
import { NodeProps, Position } from "reactflow";
import { Form, Icons, useToast } from "@instill-ai/design-system";

import { OperatorNodeData } from "../../../type";
import { CustomHandle } from "../../CustomHandle";
import { composeEdgesFromNodes } from "../../../lib";
import {
  GeneralRecord,
  InstillStore,
  useInstillForm,
  useInstillStore,
  validateInstillID,
} from "../../../../../lib";
import { ImageWithFallback } from "../../../../../components";
import { useShallow } from "zustand/react/shallow";
import { ConnectorOperatorControlPanel } from "../control-panel";
import { OpenAdvancedConfigurationButton } from "../../OpenAdvancedConfigurationButton";
import { getOperatorInputOutputSchema } from "../../../lib/getOperatorInputOutputSchema";
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
import { isOperatorComponent } from "../../../lib/checkComponentType";

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
  collapseAllNodes: store.collapseAllNodes,
});

export const OperatorNode = ({ data, id }: NodeProps<OperatorNodeData>) => {
  const {
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    nodes,
    edges,
    updateNodes,
    updateEdges,
    updatePipelineRecipeIsDirty,
    updateCurrentAdvancedConfigurationNodeID,
    pipelineIsReadOnly,
    collapseAllNodes,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();

  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);
  const nodeIDEditorForm = useNodeIDEditorForm(id);

  React.useEffect(() => {
    setNodeIsCollapsed(collapseAllNodes);
  }, [collapseAllNodes]);

  const { reset } = nodeIDEditorForm;

  React.useEffect(() => {
    reset({
      nodeID: id,
    });
  }, [id, reset]);

  const hasTargetEdges = React.useMemo(() => {
    return edges.some((edge) => edge.target === id);
  }, [edges, id]);

  const hasSourceEdges = React.useMemo(() => {
    return edges.some((edge) => edge.source === id);
  }, [edges, id]);

  const checkIsHidden = useCheckIsHidden("onNode");

  const { fields, form, ValidatorSchema, selectedConditionMap } =
    useInstillForm(
      data.operator_component.definition?.spec.component_specification ?? null,
      data.operator_component,
      {
        size: "sm",
        enableSmartHint: true,
        checkIsHidden,
        componentID: data.id,
        disabledAll: pipelineIsReadOnly,
      }
    );

  const { outputSchema } = React.useMemo(() => {
    // The configuration stored in the node will only change when the user
    // click on the "Save" button. Therefore, we need to use the
    // selectedConditionMap to get the latest selected task. Due to the
    // output schema depends on the selected task

    return getOperatorInputOutputSchema(
      data,
      selectedConditionMap ? selectedConditionMap["task"] : undefined
    );
  }, [data, selectedConditionMap]);

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
      if (node.id === id && isOperatorComponent(node.data)) {
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
            (data.operator_component.definition?.spec as GeneralRecord) ?? null
          }
        />
      )}
    >
      {/* The header of node */}

      <NodeHead nodeIsCollapsed={nodeIsCollapsed}>
        <div className="mr-auto flex flex-row gap-x-1">
          <ImageWithFallback
            src={`/icons/${data?.operator_component.definition?.id}.svg`}
            width={16}
            height={16}
            alt={`${data?.operator_component.definition?.title}-icon`}
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

      {nodeIsCollapsed ? null : (
        <>
          <div className="mb-4">
            <Form.Root {...form}>
              <form>{fields}</form>
            </Form.Root>
          </div>
          <div className="mb-2 flex flex-row-reverse">
            <OpenAdvancedConfigurationButton
              onClick={() => {
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

          <ComponentOutputReferenceHints
            componentID={data.id}
            outputSchema={outputSchema}
          />
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
