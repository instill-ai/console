import cn from "clsx";
import { EdgeProps, getSmoothStepPath } from "reactflow";

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
      className={cn("fill-none stroke-semantic-accent-default stroke-[4px]")}
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};
