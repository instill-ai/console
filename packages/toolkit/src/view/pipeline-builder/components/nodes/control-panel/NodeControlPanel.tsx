"use client";

import * as React from "react";
import { Icons } from "@instill-ai/design-system";
import { Node, Position } from "reactflow";

import { InstillStore, Nullable, useInstillStore } from "../../../../../lib";
import { useShallow } from "zustand/react/shallow";
import { ControlPanel } from "./ControlPanel";
import { NodeDropdownMenu } from "../common";
import {
  composeEdgesFromNodes,
  generateUniqueIndex,
  getAllComponentID,
  transformConnectorDefinitionIDToComponentIDPrefix,
} from "../../../lib";
import { GeneralNodeData, IteratorNodeData, NodeData } from "../../../type";

import { extracNonTriggerResponseComponentFromNodes } from "../../../lib";
import {
  isPipelineGeneralComponent,
  isPipelineIteratorComponent,
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
  isEditingIterator: store.isEditingIterator,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
});

export const NodeControlPanel = ({
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
  nodeData: GeneralNodeData | IteratorNodeData;
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
    tempSavedNodesForEditingIteratorFlow,
    isEditingIterator,
  } = useInstillStore(useShallow(selector));

  const [moreOptionsIsOpen, setMoreOptionsIsOpen] = React.useState(false);

  const nodeTypeName = React.useMemo(() => {
    if (isPipelineGeneralComponent(nodeData)) {
      return "Component";
    }

    if (isPipelineIteratorComponent(nodeData)) {
      return "Iterator Component";
    }

    return null;
  }, [nodeData]);

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
    let nodeType: Nullable<string> = null;

    if (isPipelineGeneralComponent(nodeData)) {
      if (!nodeData.definition) {
        return;
      }

      nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
        nodeData.definition.id
      );

      nodeType = "generalNode";
    }
    if (isPipelineIteratorComponent(nodeData)) {
      nodePrefix =
        transformConnectorDefinitionIDToComponentIDPrefix("iterator");
      nodeType = "iteratorNode";
    }

    if (!nodePrefix || !nodeType) {
      return;
    }

    // Generate a new component index
    const components = extracNonTriggerResponseComponentFromNodes(nodes);

    const nodeIndex = generateUniqueIndex(
      isEditingIterator
        ? [...nodes, ...tempSavedNodesForEditingIteratorFlow].map((e) => e.id)
        : getAllComponentID(components),
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
        data: {
          ...nodeData,
          id: nodeID,
        },
      },
    ];
    const newEdges = composeEdgesFromNodes(newNodes);
    updateNodes(() => newNodes);
    updateEdges(() => newEdges);
    updatePipelineRecipeIsDirty(() => true);
  }, [
    nodeData,
    nodes,
    updateEdges,
    updateNodes,
    updatePipelineRecipeIsDirty,
    isEditingIterator,
    tempSavedNodesForEditingIteratorFlow,
  ]);

  return (
    <ControlPanel.Root>
      <ControlPanel.Toggle
        isCollapsed={nodeIsCollapsed}
        onClick={() => {
          setNodeIsCollapsed(!nodeIsCollapsed);
        }}
      />
      <NodeDropdownMenu.Root
        isOpen={moreOptionsIsOpen}
        setIsOpen={setMoreOptionsIsOpen}
        nodeTypeName={nodeTypeName}
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
