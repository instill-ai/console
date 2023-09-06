import { NodeProps, Position } from "reactflow";
import { NodeData } from "../type";
import { Icons } from "@instill-ai/design-system";
import { usePipelineBuilderStore } from "../usePipelineBuilderStore";
import { CustomHandle } from "./CustomHandle";

export const EmptyNode = ({ id }: NodeProps<NodeData>) => {
  const updateSelectResourceDialogIsOpen = usePipelineBuilderStore(
    (state) => state.updateSelectResourceDialogIsOpen
  );

  return (
    <>
      <button
        onClick={() => updateSelectResourceDialogIsOpen(() => true)}
        className="flex rounded-sm border border-dashed border-semantic-accent-default bg-semantic-accent-bg px-16 py-2"
      >
        <div className="my-auto flex flex-row gap-x-2 px-2 py-1.5">
          <p className="text-semantic-accent-default product-button-button-3">
            Add AI Connector
          </p>
          <Icons.Plus className="h-3 w-3 stroke-semantic-accent-default" />
        </div>
      </button>
      <CustomHandle type="target" position={Position.Left} id={id} />
      <CustomHandle type="source" position={Position.Right} id={id} />
    </>
  );
};
