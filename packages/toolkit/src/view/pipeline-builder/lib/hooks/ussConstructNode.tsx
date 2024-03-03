import * as React from "react";
import { Position, ReactFlowInstance } from "reactflow";
import { Nullable } from "vitest";
import {
  ConnectorDefinition,
  ConnectorWithDefinition,
  GeneralRecord,
  InstillStore,
  OperatorDefinition,
  PipelineConnectorComponent,
  useInstillStore,
  useShallow,
} from "../../../../lib";
import { transformConnectorDefinitionIDToComponentIDPrefix } from "../transformConnectorDefinitionIDToComponentIDPrefix";
import { generateNewComponentIndex } from "../generateNewComponentIndex";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  edges: store.edges,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export function useConstructNode({
  reactFlowInstance,
}: {
  reactFlowInstance: Nullable<ReactFlowInstance>;
}) {
  const {
    nodes,
    updateNodes,
    edges,
    updateEdges,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  return React.useCallback(
    (
      resource:
        | ConnectorWithDefinition
        | ConnectorDefinition
        | OperatorDefinition
    ) => {
      if (!reactFlowInstance) return;

      const viewport = reactFlowInstance.getViewport();
      let componentType: Nullable<PipelineConnectorComponent["type"]> = null;

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

      const newNodeXY = {
        x: topLeftNodeXY.x + (bottomRightNodeXY.x - topLeftNodeXY.x) / 2,
        y: topLeftNodeXY.y + (bottomRightNodeXY.y - topLeftNodeXY.y) / 2,
      };

      const emptyNode = nodes.find((e) => e.data.nodeType === "empty");

      let newNodes = emptyNode
        ? nodes.filter((e) => e.data.nodeType !== "empty")
        : nodes;

      const newEdges = emptyNode
        ? edges.filter((e) => {
            if (e.source === emptyNode.id || e.target === emptyNode.id) {
              return false;
            }
            return true;
          })
        : edges;

      // Construct the default component ID prefix. For example, if the definition
      // is `connector-definitions/instill_ai`, the prefix will be `instill_ai`
      let nodePrefix: Nullable<string> = null;

      if ("connector_definition" in resource) {
        nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
          resource.connector_definition.id
        );
      } else {
        nodePrefix = transformConnectorDefinitionIDToComponentIDPrefix(
          resource.id
        );
      }

      // Generate a new component index
      const nodeIndex = generateNewComponentIndex(
        nodes.map((e) => e.id),
        nodePrefix
      );

      const nodeID = `${nodePrefix}_${nodeIndex}`;

      let configuration: Nullable<GeneralRecord> = null;

      // Process the connectors
      if ("type" in resource) {
        switch (resource.type) {
          case "CONNECTOR_TYPE_AI": {
            configuration = {};
            componentType = "COMPONENT_TYPE_CONNECTOR_AI";
            break;
          }
          case "CONNECTOR_TYPE_APPLICATION": {
            configuration = {};
            componentType = "COMPONENT_TYPE_CONNECTOR_APPLICATION";
            break;
          }
          case "CONNECTOR_TYPE_DATA": {
            configuration = {};
            componentType = "COMPONENT_TYPE_CONNECTOR_DATA";
            break;
          }
        }

        if (!componentType) {
          throw new Error("Component type is not defined");
        }

        if ("configuration" in resource) {
          // Create a new array to let reactflow rerender the component
          newNodes = [
            ...newNodes,
            {
              id: nodeID,
              type: "connectorNode",
              sourcePosition: Position.Left,
              targetPosition: Position.Right,
              data: {
                nodeType: "connector",
                component: {
                  id: nodeID,
                  resource_name: resource.name,
                  resource: {
                    ...resource,
                    connector_definition: null,
                  },
                  definition_name: resource.connector_definition.name,
                  configuration: configuration ? configuration : {},
                  type: componentType,
                  connector_definition: resource.connector_definition,
                },
                note: null,
              },
              position: reactFlowInstance.project({
                x: viewport.x,
                y: viewport.y,
              }),
              zIndex: 20,
            },
          ];
        } else {
          // Create a new array to let reactflow rerender the component
          newNodes = [
            ...newNodes,
            {
              id: nodeID,
              type: "connectorNode",
              sourcePosition: Position.Left,
              targetPosition: Position.Right,
              data: {
                nodeType: "connector",
                component: {
                  id: nodeID,
                  resource_name: null,
                  resource: null,
                  definition_name: resource.name,
                  type: componentType,
                  connector_definition: resource,
                  configuration: configuration ? configuration : {},
                },
                note: null,
              },
              position: newNodeXY,
              zIndex: 20,
            },
          ];
        }
      } else {
        // Process the operators
        newNodes = [
          ...newNodes,
          {
            id: nodeID,
            type: "operatorNode",
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            data: {
              nodeType: "operator",
              component: {
                id: nodeID,
                resource_name: null,
                resource: null,
                definition_name: resource.name,
                type: "COMPONENT_TYPE_OPERATOR",
                operator_definition: resource,
                configuration: configuration ? configuration : {},
              },
              note: null,
            },
            position: newNodeXY,
            zIndex: 20,
          },
        ];
      }

      updatePipelineRecipeIsDirty(() => true);
      updateNodes(() => newNodes);
      updateEdges(() => newEdges);
    },
    [
      nodes,
      updateNodes,
      edges,
      updateEdges,
      reactFlowInstance,
      updatePipelineRecipeIsDirty,
    ]
  );
}
