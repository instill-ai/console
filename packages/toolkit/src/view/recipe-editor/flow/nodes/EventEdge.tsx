"use client";

import cn from "clsx";
import { EdgeProps, getSmoothStepPath } from "reactflow";

export const EventEdge = ({
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
      className={cn("fill-none stroke-[#AF89FA] stroke-[4px]")}
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};
