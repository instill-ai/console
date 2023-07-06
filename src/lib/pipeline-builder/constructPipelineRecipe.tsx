import { ConnectorNodeData } from "@/types";
import { Edge, Node } from "reactflow";

export function constructPipelineRecipe(
  nodes: Node<ConnectorNodeData>[],
  edges: Edge[]
) {
  return {
    version: "v1alpha",
    components: nodes.map((node) => {
      const connections = edges.filter((edge) => edge.target === node.id);

      return {
        id: node.id,
        resource_name: node.data.connector.name,
        dependencies: {
          texts: `[${connections
            .map((edge) => `*${edge.source}.texts`)
            .join(",")}]`,
          images: `[${connections
            .map((edge) => `*${edge.source}.images`)
            .join(",")}]`,
          structured_data: `{${connections
            .map((edge) => `**${edge.source}.structured_data`)
            .join(",")}}`,
          metadata: `{${connections
            .map((edge) => `**${edge.source}.metadata`)
            .join(",")}}`,
        },
      };
    }),
  };
}
