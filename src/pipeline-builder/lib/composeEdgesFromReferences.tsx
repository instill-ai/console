import { v4 as uuidv4 } from "uuid";
import { Edge, Node } from "reactflow";
import {
  DoubleCurlyBraceReference,
  PipelineComponentReference,
  SingleCurlyBraceReference,
  getConnectorOpenAPISchema,
  InstillAIOpenAPIProperty,
  getPropertiesFromOpenAPISchema,
} from ".";
import { NodeData } from "../type";

export function composeEdgesFromReferences(
  references: PipelineComponentReference[],
  nodes: Node<NodeData>[]
) {
  const edges: Edge[] = [];

  const otherNodesAvailableReferences: string[] = [];
  const startNodeAvailableRefernces: string[] = [];

  nodes.forEach((node) => {
    if (!node.data.component) return;

    if (node.data.nodeType === "start") {
      for (const [key] of Object.entries(
        node.data.component.configuration.metadata
      )) {
        startNodeAvailableRefernces.push(`${node.id}.${key}`);
      }
      return;
    }

    if (node.data.nodeType === "end") return;

    const { inputSchema, outputSchema } = getConnectorOpenAPISchema({
      component: node.data.component,
    });

    let inputProperties: InstillAIOpenAPIProperty[] = [];
    let outputProperties: InstillAIOpenAPIProperty[] = [];

    if (inputSchema) {
      inputProperties = getPropertiesFromOpenAPISchema(inputSchema);
    }

    if (outputSchema) {
      outputProperties = getPropertiesFromOpenAPISchema(outputSchema);
    }

    for (const inputProperty of inputProperties) {
      otherNodesAvailableReferences.push(
        `${node.id}.${
          inputProperty.path?.includes(".")
            ? inputProperty.path?.split(".").pop()
            : inputProperty.path
        }`
      );
    }

    for (const outputProperty of outputProperties) {
      otherNodesAvailableReferences.push(
        `${node.id}.${
          outputProperty.path?.includes(".")
            ? outputProperty.path?.split(".").pop()
            : outputProperty.path
        }`
      );
    }
  });

  for (const reference of references) {
    if (reference.type === "singleCurlyBrace") {
      edges.push(
        ...composeEdgeForSingleCurlyBrace({
          reference,
          startNodeAvailableRefernces,
          otherNodesAvailableReferences,
        })
      );
    } else {
      edges.push(
        ...composeEdgeForDoubleCurlyBrace({
          reference,
          startNodeAvailableRefernces,
          otherNodesAvailableReferences,
        })
      );
    }
  }

  function composeEdgeForSingleCurlyBrace({
    reference,
    otherNodesAvailableReferences,
    startNodeAvailableRefernces,
  }: {
    reference: SingleCurlyBraceReference;
    otherNodesAvailableReferences: string[];
    startNodeAvailableRefernces: string[];
  }) {
    const edgesForSingleCurlyBrace: Edge[] = [];

    if (reference.referenceValue.withoutCurlyBraces.split(".")[0] === "start") {
      const referenceIsAvailable = startNodeAvailableRefernces.some(
        (availableReference) => {
          availableReference ===
            reference.referenceValue.withoutCurlyBraces.replaceAll(
              /\[[^\]]+\]/g,
              ""
            );
        }
      );

      const hasNoEdgeForThisReference =
        edgesForSingleCurlyBrace.find(
          (edge) => edge.source === "start" && edge.target === reference.nodeId
        ) === undefined;

      if (
        referenceIsAvailable &&
        hasNoEdgeForThisReference &&
        reference.nodeId
      ) {
        edgesForSingleCurlyBrace.push({
          id: uuidv4(),
          source: "start",
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    } else {
      const referenceIsAvailable = otherNodesAvailableReferences.some(
        (availableReference) =>
          availableReference ===
          reference.referenceValue.withoutCurlyBraces.replaceAll(
            /\[[^\]]+\]/g,
            ""
          )
      );

      const hasNoEdgeForThisReference =
        edgesForSingleCurlyBrace.find(
          (edge) =>
            edge.source ===
              reference.referenceValue.withoutCurlyBraces.split(".")[0] &&
            edge.target === reference.nodeId
        ) === undefined;

      if (
        referenceIsAvailable &&
        hasNoEdgeForThisReference &&
        reference.nodeId
      ) {
        edgesForSingleCurlyBrace.push({
          id: uuidv4(),
          source: reference.referenceValue.withoutCurlyBraces.split(".")[0],
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    }

    return edgesForSingleCurlyBrace;
  }

  function composeEdgeForDoubleCurlyBrace({
    reference,
    otherNodesAvailableReferences,
    startNodeAvailableRefernces,
  }: {
    reference: DoubleCurlyBraceReference;
    otherNodesAvailableReferences: string[];
    startNodeAvailableRefernces: string[];
  }) {
    const edgesForDoubleCurlyBrace: Edge[] = [];
    const referenceValuesWithStartOperator: string[] = [];
    const referenceValuesWithOtherNode: string[] = [];

    for (const referenceValue of reference.referenceValues) {
      if (referenceValue.withoutCurlyBraces.split(".")[0] === "start") {
        const referenceIsAvailable = startNodeAvailableRefernces.some(
          (availableReference) =>
            availableReference ===
            referenceValue.withoutCurlyBraces.replaceAll(/\[[^\]]+\]/g, "")
        );

        if (referenceIsAvailable) {
          referenceValuesWithStartOperator.push(
            referenceValue.withoutCurlyBraces
          );
        }
      } else {
        const referenceIsAvailable = otherNodesAvailableReferences.some(
          (availableReference) =>
            availableReference ===
            referenceValue.withoutCurlyBraces.replaceAll(/\[[^\]]+\]/g, "")
        );

        if (referenceIsAvailable) {
          referenceValuesWithOtherNode.push(referenceValue.withoutCurlyBraces);
        }
      }
    }

    if (referenceValuesWithStartOperator.length > 0) {
      const hasNoEdgeForThisReferenceToStart =
        edgesForDoubleCurlyBrace.find(
          (edge) => edge.source === "start" && edge.target === reference.nodeId
        ) === undefined;

      if (hasNoEdgeForThisReferenceToStart && reference.nodeId) {
        edgesForDoubleCurlyBrace.push({
          id: uuidv4(),
          source: "start",
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    }

    for (const referenceValue of referenceValuesWithOtherNode) {
      const hasNoEdgeForThisReferenceToOtherNode =
        edgesForDoubleCurlyBrace.find(
          (edge) =>
            edge.source === referenceValue.split(".")[0] &&
            edge.target === reference.nodeId
        ) === undefined;

      if (hasNoEdgeForThisReferenceToOtherNode && reference.nodeId) {
        edgesForDoubleCurlyBrace.push({
          id: uuidv4(),
          source: referenceValue.split(".")[0],
          target: reference.nodeId,
          type: "customEdge",
        });
      }
    }

    return edgesForDoubleCurlyBrace;
  }

  return edges;
}

const mock = {
  id: "developed-fuchsia-rattlesnake",
  recipe: {
    version: "v1alpha",
    components: [
      {
        id: "start",
        resource_name: "",
        configuration: {
          metadata: {
            prompt: {
              type: "text",
              title: "prompt",
            },
          },
        },
        definition_name: "operator-definitions/start-operator",
      },
      {
        id: "end",
        resource_name: "",
        configuration: {
          metadata: {
            result: {
              title: "result",
              value: "{ test.images }",
            },
          },
        },
        definition_name: "operator-definitions/end-operator",
      },
      {
        id: "test",
        resource_name: "",
        configuration: {
          input: {
            connector_definition_name: "connector-definitions/ai-stability-ai",
            task: "TASK_TEXT_TO_IMAGE",
            seed: "1",
            cfg_scale: "1",
            steps: "1",
            prompts: "{{ start.prompt }}",
            engine: "stable-diffusion-xl-1024-v1-0",
          },
        },
        definition_name: "connector-definitions/ai-stability-ai",
      },
    ],
  },
};
