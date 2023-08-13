import { Handle, NodeProps, Position } from "reactflow";
import { NodeData } from "./type";
import { Button, Icons } from "@instill-ai/design-system";

export const EndNode = ({ data, id }: NodeProps<NodeData>) => {
  return (
    <>
      <div className="flex flex-col rounded-sm bg-semantic-bg-line px-2 py-2.5">
        <div className="mb-4 flex flex-row gap-x-1">
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            End
          </p>
          <Icons.Edit05 className="my-auto h-3 w-3 stroke-semantic-fg-secondary" />
        </div>
        <Button className="flex w-[232px]" variant="primary">
          Add Field
          <Icons.Plus className="my-auto h-5 w-5 stroke-semantic-bg-primary " />
        </Button>
      </div>
      <Handle type="target" position={Position.Left} id={id} />
      <Handle type="source" position={Position.Right} id={id} />
    </>
  );
};
