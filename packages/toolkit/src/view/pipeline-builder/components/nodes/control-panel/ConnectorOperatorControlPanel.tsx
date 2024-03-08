import * as React from "react";
import { Icons } from "@instill-ai/design-system";
import { Node, Position } from "reactflow";

import { InstillStore, Nullable, useInstillStore } from "../../../../../lib";
import { useShallow } from "zustand/react/shallow";
import { ControlPanel } from "./ControlPanel";
import { NodeDropdownMenu } from "../common";
import {
  composeEdgesFromComponents,
  generateUniqueIndex,
  transformConnectorDefinitionIDToComponentIDPrefix,
} from "../../../lib";
import {
  ConnectorNodeData,
  IteratorNodeData,
  NodeData,
  OperatorNodeData,
} from "../../../type";
import {
  isConnectorComponent,
  isIteratorComponent,
  isOperatorComponent,
} from "../../../lib/checkComponentType";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  currentAdvancedConfigurationNodeID: store.currentAdvancedConfigurationNodeID,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
});

export const ConnectorOperatorControlPanel = ({
  nodeID,

  nodeIsCollapsed,
  setNodeIsCollapsed,
  handleToggleNote,
  noteIsOpen,
  nodeData,
}: {
  nodeID: string;
  nodeIsCollapsed: boolean;
  setNodeIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleNote: () => void;
  noteIsOpen: boolean;
  nodeData: ConnectorNodeData | OperatorNodeData | IteratorNodeData;
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

  const componentTypeName = React.useMemo(() => {
    if (isOperatorComponent(nodeData)) {
      return "Operator Component";
    }

    if (isConnectorComponent(nodeData)) {
      return "Connector Component";
    }

    if (isIteratorComponent(nodeData)) {
      return "Iterator Component";
    }

    return null;
  }, [nodeData]);

  const handelDeleteNode = React.useCallback(() => {
    const newNodes = nodes.filter((node) => node.id !== nodeID);
    const newEdges = composeEdgesFromComponents(
      newNodes.map((node) => node.data)
    );
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
    let nodeType = "connectorNode";

    if (isOperatorComponent(nodeData)) {
      if (!nodeData.operator_component.definition) {
        return;
      }

      nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
        nodeData.operator_component.definition.id
      );

      nodeType = "operatorNode";
    }

    if (isConnectorComponent(nodeData)) {
      if (!nodeData.connector_component.definition) {
        return;
      }

      nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
        nodeData.connector_component.definition.id
      );
    }

    if (isIteratorComponent(nodeData)) {
      return;
    }

    if (!nodePrefix) {
      return;
    }

    // Generate a new component index
    const nodeIndex = generateUniqueIndex(
      nodes.map((e) => e.id),
      nodePrefix
    );

    const nodeID = `${nodePrefix}_${nodeIndex}`;

    const newNodes: Node<NodeData>[] = [
      ...nodes,
      {
        id: nodeID,
        type: nodeType,
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
        position: { x: 0, y: 0 },
        zIndex: 30,
        data: nodeData,
      },
    ];
    const newEdges = composeEdgesFromComponents(
      newNodes.map((node) => node.data)
    );
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
  }, [nodeData, nodes, updateEdges, updateNodes, updatePipelineRecipeIsDirty]);

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
