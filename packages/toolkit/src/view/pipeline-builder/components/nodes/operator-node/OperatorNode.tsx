import * as React from "react";
import { Node, NodeProps, Position } from "reactflow";
import { Form, Icons, useToast } from "@instill-ai/design-system";

import {
  NodeData,
  OperatorNodeData,
  PipelineComponentReference,
} from "../../../type";
import { CustomHandle } from "../../CustomHandle";
import {
  extractReferencesFromConfiguration,
  composeEdgesFromReferences,
  generateNewComponentIndex,
  transformConnectorDefinitionIDToComponentIDPrefix,
} from "../../../lib";
import {
  InstillStore,
  useInstillForm,
  useInstillStore,
  validateInstillID,
} from "../../../../../lib";
import { ImageWithFallback, ObjectViewer } from "../../../../../components";
import { useShallow } from "zustand/react/shallow";
import { ConnectorOperatorControlPanel } from "../control-panel";
import { OpenAdvancedConfigurationButton } from "../../OpenAdvancedConfigurationButton";
import { ComponentOutputs } from "../../ComponentOutputs";
import { getOperatorInputOutputSchema } from "../../../lib/getOperatorInputOutputSchema";
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
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateCreateResourceDialogState: store.updateCreateResourceDialogState,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
  testModeTriggerResponse: store.testModeTriggerResponse,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
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
    testModeTriggerResponse,
    pipelineIsReadOnly,
  } = useInstillStore(useShallow(selector));

  const { toast } = useToast();

  const [nodeIsCollapsed, setNodeIsCollapsed] = React.useState(false);
  const [noteIsOpen, setNoteIsOpen] = React.useState(false);

  const nodeIDEditorForm = useNodeIDEditorForm(id);

  const { reset } = nodeIDEditorForm;

  React.useEffect(() => {
    reset({
      nodeID: id,
    });
  }, [id, reset]);

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
      if (node.id === id && node.data.nodeType === "operator") {
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
    if (!data.component.operator_definition) {
      return;
    }

    const nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
      data.component.operator_definition.id
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
        type: "operatorNode",
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

  const { outputSchema } = React.useMemo(() => {
    return getOperatorInputOutputSchema(data.component);
  }, [data]);

  const checkIsHidden = useCheckIsHidden("onNode");

  const { fields, form, ValidatorSchema } = useInstillForm(
    data.component.operator_definition?.spec.component_specification ?? null,
    data.component.configuration,
    {
      size: "sm",
      enableSmartHint: true,
      checkIsHidden,
      componentID: data.component.id,
      disabledAll: pipelineIsReadOnly,
    }
  );

  const { getValues, trigger } = form;

  useUpdaterOnNode({
    id,
    nodeType: "operator",
    form,
    ValidatorSchema,
    configuration: data.component.configuration,
  });

  const [isOpenBottomBarOutput, setIsOpenBottomBarOutput] =
    React.useState(false);

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
            src={`/icons/instill-ai/${data.component?.operator_definition?.icon}`}
            width={16}
            height={16}
            alt={`${data.component?.operator_definition?.title}-icon`}
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

          <ComponentOutputs
            componentID={data.component.id}
            outputSchema={outputSchema}
            nodeType="connector"
            response={testModeTriggerResponse}
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
