import * as React from "react";
import { Node, NodeProps, Position } from "reactflow";
import { Form, Icons, useToast } from "@instill-ai/design-system";

import {
  NodeData,
  OperatorNodeData,
  PipelineComponentReference,
} from "../../type";
import { CustomHandle } from "../CustomHandle";
import {
  extractReferencesFromConfiguration,
  composeEdgesFromReferences,
  generateNewComponentIndex,
  transformConnectorDefinitionIDToComponentIDPrefix,
} from "../../lib";
import {
  CheckIsHidden,
  InstillStore,
  Nullable,
  useInstillForm,
  useInstillStore,
  validateComponentID,
} from "../../../../lib";
import { ImageWithFallback } from "../../../../components";
import { useShallow } from "zustand/react/shallow";
import { NodeWrapper } from "../NodeWrapper";
import { NodeHead } from "../NodeHead";
import { NodeIDEditor, useNodeIDEditorForm } from "../NodeIDEditor";
import { ConnectorOperatorControlPanel } from "../control-panel";
import { getOperatorInputOutputSchema } from "../../lib/getOperatorInputOutputSchema";

const selector = (store: InstillStore) => ({
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  nodes: store.nodes,
  edges: store.edges,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateCreateResourceDialogState: store.updateCreateResourceDialogState,
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

  // We need to put this function into a useCallback to prevent infinite loop
  const checkIsHidden: CheckIsHidden = React.useCallback(
    ({ parentSchema, targetKey }) => {
      if (!parentSchema) {
        return false;
      }

      if (!parentSchema.instillEditOnNodeFields) {
        return false;
      }

      if (!targetKey) {
        return false;
      }

      if (parentSchema.instillEditOnNodeFields.includes(targetKey)) {
        return false;
      }

      return true;
    },
    []
  );

  const { fields, form } = useInstillForm(
    data.component.operator_definition?.spec.component_specification ?? null,
    data.component.configuration,
    {
      checkIsHidden,
      size: "sm",
    }
  );

  const {
    getValues,
    formState: { isDirty, isValid },
    handleSubmit,
  } = form;

  const values = getValues();

  React.useEffect(() => {
    if (!isDirty || !isValid) return;
    const timer = setTimeout(() => {
      handleSubmit(() => {
        updateNodes((nodes) => {
          return nodes.map((node) => {
            if (node.data.nodeType === "operator" && node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  component: {
                    ...node.data.component,
                    configuration: {
                      ...node.data.component.configuration,
                      ...values,
                    },
                  },
                },
              };
            }

            return node;
          });
        });
        updatePipelineRecipeIsDirty(() => true);
      })();
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [values, isDirty, isValid]);

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
        <Form.Root {...form}>
          <form>{fields}</form>
        </Form.Root>
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
