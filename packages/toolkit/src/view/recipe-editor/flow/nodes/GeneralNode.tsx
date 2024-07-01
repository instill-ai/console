"use client";
import * as React from "react";

import { NodeProps, Position, useEdges } from "reactflow";

import { Icons } from "@instill-ai/design-system";

import { ImageWithFallback } from "../../../../components";
import { CustomHandle, GeneralNodeData } from "../../../pipeline-builder";

export const GeneralNode = ({ data, id }: NodeProps<GeneralNodeData>) => {
  const reactflowEdges = useEdges();
  const hasTargetEdges = React.useMemo(() => {
    return reactflowEdges.some((edge) => edge.target === id);
  }, [reactflowEdges, id]);

  const hasSourceEdges = React.useMemo(() => {
    return reactflowEdges.some((edge) => edge.source === id);
  }, [id, reactflowEdges]);

  return (
    <div
      onClick={() => {}}
      className="flex w-[320px] flex-col rounded-md border border-semantic-bg-line bg-semantic-bg-primary p-4"
    >
      <div className="flex flex-row items-center gap-x-2">
        <div className="flex rounded-sm border border-semantic-bg-line p-2">
          <ImageWithFallback
            src={`/icons/${data.definition?.id}.svg`}
            width={32}
            height={32}
            alt={`${data.definition?.title}-icon`}
            fallbackImg={
              <Icons.Box className="my-auto h-8 w-8 stroke-semantic-fg-primary" />
            }
          />
        </div>
        <p className="productbody-text-2-medium text-semantic-fg-primary">
          {id}
        </p>
      </div>
      <CustomHandle
        className={hasTargetEdges ? "" : "!opacity-0"}
        type="target"
        position={Position.Left}
        id={id}
      />
      <CustomHandle
        className={hasSourceEdges ? "" : "!opacity-0"}
        type="source"
        position={Position.Right}
        id={id}
      />
    </div>
  );
};
