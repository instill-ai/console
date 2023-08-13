import { Handle, NodeProps, Position } from "reactflow";
import { NodeData } from "./type";
import { Icons } from "@instill-ai/design-system";

export const EmptyNode = ({ data, id }: NodeProps<NodeData>) => {
  return (
    <>
      <div className="flex rounded-sm border border-dashed border-semantic-accent-default bg-semantic-accent-bg px-16 py-2">
        <div className="my-auto flex flex-row gap-x-2 px-2 py-1.5">
          <p className="text-semantic-accent-default product-button-button-3">
            Add Connector
          </p>
          <Icons.Plus className="h-3 w-3 stroke-semantic-accent-default" />
        </div>
      </div>
      <Handle type="target" position={Position.Left} id={id} />
      <Handle type="source" position={Position.Right} id={id} />
    </>
  );
};
