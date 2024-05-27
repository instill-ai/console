import * as React from "react";
import { Position, ReactFlowInstance } from "reactflow";
import {
  ConnectorDefinition,
  InstillStore,
  IteratorDefinition,
  Nullable,
  OperatorDefinition,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { transformConnectorDefinitionIDToComponentIDPrefix } from "../transformConnectorDefinitionIDToComponentIDPrefix";
import { generateUniqueIndex } from "../generateUniqueIndex";
import { getAllComponentID } from "../getAllComponentID";
import { extracNonTriggerResponseComponentFromNodes } from "../extracNonTriggerResponseComponentFromNodes";
import {
  isConnectorDefinition,
  isIteratorDefinition,
} from "../../../../lib/vdp-sdk/helper";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  isEditingIterator: store.isEditingIterator,
});

export function useAddNodeWithDefinition({
  reactFlowInstance,
}: {
  reactFlowInstance: Nullable<ReactFlowInstance>;
}) {
  const {
    nodes,
    tempSavedNodesForEditingIteratorFlow,
    updateNodes,
    updatePipelineRecipeIsDirty,
    isEditingIterator,
  } = useInstillStore(useShallow(selector));

  return React.useCallback(
    (
      definition: ConnectorDefinition | OperatorDefinition | IteratorDefinition
    ) => {
      if (!reactFlowInstance) return;

      let newNodeXY = {
        x: 0,
        y: 0,
      };

      if (nodes[0]) {
        // We will use these values to calculate the position of the new node
        // Initialize the topLeftNodeXY and bottomRightNodeXY with the first node
        const topLeftNodeXY = {
          x: nodes[0].position.x,
          y: nodes[0].position.y,
        };
        const bottomRightNodeXY = {
          x: nodes[0].position.x,
          y: nodes[0].position.y,
        };

        // Find the topLeftNodeXY and bottomRightNodeXY
        nodes.forEach((node) => {
          if (node.position.x < topLeftNodeXY.x) {
            topLeftNodeXY.x = node.position.x;
          }
          if (node.position.y < topLeftNodeXY.y) {
            topLeftNodeXY.y = node.position.y;
          }
          if (node.position.x > bottomRightNodeXY.x) {
            bottomRightNodeXY.x = node.position.x;
          }
          if (node.position.y > bottomRightNodeXY.y) {
            bottomRightNodeXY.y = node.position.y;
          }
        });

        newNodeXY = {
          x: topLeftNodeXY.x + (bottomRightNodeXY.x - topLeftNodeXY.x) / 2,
          y: topLeftNodeXY.y + (bottomRightNodeXY.y - topLeftNodeXY.y) / 2,
        };
      }

      // Construct the default component ID prefix. For example, if the definition
      // is `connector-definitions/instill_ai`, the prefix will be `instill_ai`
      const nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
        definition.id
      );

      // Generate a new component index
      // Because all the nodes' ID need to be unique, included the components in the
      // iterator, so we need to group the two set of nodes together. Under the
      // editing iterator mode, nodes will be the nodes in the iterator, and
      // tempSavedNodesForEditingIteratorFlow will be the nodes outside the iterator
      const components = extracNonTriggerResponseComponentFromNodes(nodes);
      const nodeIndex = generateUniqueIndex(
        isEditingIterator
          ? [...nodes, ...tempSavedNodesForEditingIteratorFlow].map((e) => e.id)
          : getAllComponentID(components),
        nodePrefix
      );

      const nodeID = `${nodePrefix}_${nodeIndex}`;

      let newNodes = nodes;

      if (isIteratorDefinition(definition)) {
        newNodes = [
          ...newNodes,
          {
            id: nodeID,
            type: "iteratorNode",
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            data: {
              id: nodeID,
              input: "",
              type: "iterator",
              output_elements: {
                // This is the default output element
                result_0: "",
              },
              component: [],
              condition: null,
              data_specification: {
                input: null,
                output: null,
              },
              note: null,
            },
            position: newNodeXY,
            zIndex: 20,
          },
        ];
      } else if (isConnectorDefinition(definition)) {
        newNodes = [
          ...newNodes,
          {
            id: nodeID,
            type: "generalNode",
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            data: {
              id: nodeID,
              type: definition.id,
              definition,
              input: {},
              task: "",
              condition: null,
              connection: {},
              note: null,
            },
            position: newNodeXY,
            zIndex: 20,
          },
        ];
      } else {
        newNodes = [
          ...newNodes,
          {
            id: nodeID,
            type: "generalNode",
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            data: {
              id: nodeID,
              type: definition.id,
              definition: definition,
              input: {},
              task: "",
              condition: null,
              note: null,
              connection: {},
            },
            position: newNodeXY,
            zIndex: 20,
          },
        ];
      }

      updatePipelineRecipeIsDirty(() => true);
      updateNodes(() => newNodes);
    },
    [
      nodes,
      updateNodes,
      reactFlowInstance,
      updatePipelineRecipeIsDirty,
      isEditingIterator,
      tempSavedNodesForEditingIteratorFlow,
    ]
  );
}
