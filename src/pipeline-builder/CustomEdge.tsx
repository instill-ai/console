import * as React from "react";
import cn from "clsx";
import { EdgeProps, getBezierPath } from "reactflow";

export const CustomEdge = ({
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
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      <path
        id={id}
        style={style}
        className={cn("fill-none stroke-semantic-fg-primary stroke-[1px]")}
        strokeDasharray={6}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path
        id={id}
        style={{ ...style, strokeDasharray: 0 }}
        className={cn(
          "fill-none stroke-gray-400 stroke-[8px]",
          hovered ? "opacity-20" : "opacity-0"
        )}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <path
        id={id}
        style={{ ...style, strokeDasharray: 0 }}
        className="fill-none stroke-transparent stroke-[12px]"
        strokeDasharray={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};
