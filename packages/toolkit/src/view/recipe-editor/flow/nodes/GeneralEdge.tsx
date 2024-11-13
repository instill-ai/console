"use client";

import { EdgeProps, getSmoothStepPath } from "reactflow";

import { cn } from "@instill-ai/design-system";

export const GeneralEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <path
      id={id}
      style={style}
      className={cn("fill-none stroke-semantic-fg-primary stroke-[4px]")}
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};
