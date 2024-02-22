import * as React from "react";
import { Icons } from "@instill-ai/design-system";
import { Node, Position } from "reactflow";

import {
  InstillStore,
  Nullable,
  PipelineComponentType,
  useInstillStore,
} from "../../../../../lib";
import { useShallow } from "zustand/react/shallow";
import { ControlPanel } from "./ControlPanel";
import { NodeDropdownMenu } from "../common";
import {
  composeEdgesFromNodes,
  generateNewComponentIndex,
  transformConnectorDefinitionIDToComponentIDPrefix,
} from "../../../lib";
import { ConnectorNodeData, NodeData, OperatorNodeData } from "../../../type";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateSelectResourceDialogIsOpen: store.updateSelectResourceDialogIsOpen,
  currentAdvancedConfigurationNodeID: store.currentAdvancedConfigurationNodeID,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
});

export const ConnectorOperatorControlPanel = ({
  nodeID,
  componentType,
  nodeIsCollapsed,
  setNodeIsCollapsed,
  handleToggleNote,
  noteIsOpen,
  nodeData,
}: {
  nodeID: string;
  componentType: PipelineComponentType;
  nodeIsCollapsed: boolean;
  setNodeIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleNote: () => void;
  noteIsOpen: boolean;
  nodeData: ConnectorNodeData | OperatorNodeData;
}) => {
  const {
    isOwner,
    currentVersion,
    pipelineIsReadOnly,
    nodes,
    updateNodes,
    updateEdges,
    updatePipelineRecipeIsDirty,
    currentAdvancedConfigurationNodeID,
    updateCurrentAdvancedConfigurationNodeID,
  } = useInstillStore(useShallow(selector));

  const [moreOptionsIsOpen, setMoreOptionsIsOpen] = React.useState(false);

  let componentTypeName: Nullable<string> = null;

  switch (componentType) {
    case "COMPONENT_TYPE_CONNECTOR_AI":
      componentTypeName = "AI Component";
      break;
    case "COMPONENT_TYPE_CONNECTOR_DATA":
      componentTypeName = "Data Component";
      break;
    case "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN":
      componentTypeName = "Blockchain Component";
      break;
    case "COMPONENT_TYPE_OPERATOR":
      componentTypeName = "Operator Component";
      break;
  }

  const handelDeleteNode = React.useCallback(() => {
    const newNodes = nodes.filter((node) => node.id !== nodeID);
    const newEdges = composeEdgesFromNodes(newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
    updateNodes(() => newNodes);

    if (nodeID === currentAdvancedConfigurationNodeID) {
      updateCurrentAdvancedConfigurationNodeID(() => null);
    }
  }, [
    nodeID,
    currentAdvancedConfigurationNodeID,
    updateCurrentAdvancedConfigurationNodeID,
    nodes,
    updateEdges,
    updateNodes,
    updatePipelineRecipeIsDirty,
  ]);

  const handleCopyNode = React.useCallback(() => {
    let nodePrefix: Nullable<string> = null;

    if (nodeData.nodeType === "connector") {
      if (!nodeData.component.connector_definition) {
        return;
      }

      nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
        nodeData.component.connector_definition.id
      );
    }

    if (nodeData.nodeType === "operator") {
      if (!nodeData.component.operator_definition) {
        return;
      }

      nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
        nodeData.component.operator_definition.id
      );
    }

    if (!nodePrefix) {
      return;
    }

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
        type:
          nodeData.nodeType === "connector" ? "connectorNode" : "operatorNode",
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
        position: { x: 0, y: 0 },
        zIndex: 30,
        data: nodeData,
      },
    ];
    const newEdges = composeEdgesFromNodes(newNodes);
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
  }, [
    nodeID,
    nodeData,
    nodes,
    updateEdges,
    updateNodes,
    updatePipelineRecipeIsDirty,
  ]);

  return (
    <ControlPanel.Root>
      <ControlPanel.Toggle
        isCollapsed={nodeIsCollapsed}
        onTrigger={() => {
          setNodeIsCollapsed(!nodeIsCollapsed);
        }}
        disabled={pipelineIsReadOnly}
      />
      <NodeDropdownMenu.Root
        isOpen={moreOptionsIsOpen}
        setIsOpen={setMoreOptionsIsOpen}
        componentTypeName={componentTypeName}
      >
        <NodeDropdownMenu.Item
          onClick={(e) => {
            if (pipelineIsReadOnly) return;

            e.stopPropagation();
            handleToggleNote();
            setMoreOptionsIsOpen(false);
          }}
          disabled={pipelineIsReadOnly}
        >
          {noteIsOpen ? (
            <Icons.FileMinus01 className="h-4 w-4 stroke-semantic-fg-secondary" />
          ) : (
            <Icons.FilePlus01 className="h-4 w-4 stroke-semantic-fg-secondary" />
          )}
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            Toggle note
          </p>
        </NodeDropdownMenu.Item>
        <NodeDropdownMenu.Item
          onClick={(e) => {
            if (pipelineIsReadOnly) return;

            e.stopPropagation();
            handleCopyNode();
            setMoreOptionsIsOpen(false);
          }}
          disabled={
            !isOwner || currentVersion !== "latest" || pipelineIsReadOnly
          }
        >
          <Icons.Copy07 className="h-4 w-4 stroke-semantic-fg-secondary" />
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            Duplicate
          </p>
        </NodeDropdownMenu.Item>
        <NodeDropdownMenu.Item
          onClick={(e) => {
            if (pipelineIsReadOnly) return;
            e.stopPropagation();
            handelDeleteNode();
            setMoreOptionsIsOpen(false);
          }}
          disabled={
            !isOwner || currentVersion !== "latest" || pipelineIsReadOnly
          }
        >
          <Icons.Trash01 className="h-4 w-4 stroke-semantic-error-default" />
          <p className="text-semantic-er`ror-default product-body-text-4-medium">
            Delete
          </p>
        </NodeDropdownMenu.Item>
      </NodeDropdownMenu.Root>
    </ControlPanel.Root>
  );
};
