import { NodeProps } from "reactflow";
import { CustomNode } from "./CustomNode";
import { Icons } from "@instill-ai/design-system";
import { usePipelineBuilderStore } from "@/stores";
import { ConnectorNodeData } from "@/types";

export const SourceNode = ({ data, id }: NodeProps<ConnectorNodeData>) => {
  const selectedNode = usePipelineBuilderStore((state) => state.selectedNode);

  return (
    <CustomNode.Root
      className={
        selectedNode?.id === id
          ? "outline outline-2 outline-semantic-accent-default"
          : ""
      }
    >
      <CustomNode.NameRow
        name={data.connector.name.split("/")[1]}
        icon={
          <Icons.Database01 className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
        }
      />
      <CustomNode.ConnectorDefinitionRow
        definition={data.connector.connector_definition}
      />
      <CustomNode.StateRow state={data.connector.watchState} />
    </CustomNode.Root>
  );
};
