import { Handle, NodeProps, Position } from "reactflow";
import { NodeData } from "./type";
import { Button, Icons } from "@instill-ai/design-system";
import * as React from "react";
import InputType from "@/components/InputType";

export const StartNode = ({ data, id }: NodeProps<NodeData>) => {
  const [enableEdit, setEnableEdit] = React.useState(false);

  return (
    <>
      <div className="flex flex-col rounded-sm bg-semantic-bg-line px-2 py-2.5">
        <div className="mb-4 flex flex-row gap-x-1">
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            Start
          </p>
          <Icons.Edit05 className="my-auto h-3 w-3 stroke-semantic-fg-secondary" />
        </div>

        {enableEdit ? (
          <div className="w-[232px]">
            <div className="mb-3 flex flex-row justify-between">
              <div>
                <Icons.ArrowLeft
                  className="my-auto h-5 w-5 stroke-slate-500"
                  onClick={() => setEnableEdit(!enableEdit)}
                />
              </div>
              <div>
                <Button
                  variant="primary"
                  onClick={() => setEnableEdit(!enableEdit)}
                  size="sm"
                >
                  Save
                </Button>
              </div>
            </div>
            <div className="flex flex-col">
              <InputType type="text" />
              <InputType type="number" />
              <InputType type="image" />
              <InputType type="audio" />
            </div>
          </div>
        ) : (
          <Button
            className="flex w-[232px]"
            variant="primary"
            onClick={() => setEnableEdit(!enableEdit)}
          >
            Add Field
            <Icons.Plus className="my-auto h-5 w-5 stroke-semantic-bg-primary " />
          </Button>
        )}
      </div>
      <Handle type="target" position={Position.Left} id={id} />
      <Handle type="source" position={Position.Right} id={id} />
    </>
  );
};
