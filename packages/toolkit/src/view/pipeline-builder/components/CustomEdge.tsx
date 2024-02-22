import cn from "clsx";
import { EdgeProps, getSmoothStepPath } from "reactflow";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import React from "react";

const selector = (store: InstillStore) => ({
  selectedConnectorNodeId: store.selectedConnectorNodeId,
});

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
  source,
  target,
}: EdgeProps) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { selectedConnectorNodeId } = useInstillStore(useShallow(selector));

  const isSelected = React.useMemo(() => {
    if (
      source === selectedConnectorNodeId ||
      target === selectedConnectorNodeId
    ) {
      return true;
    }

    return false;
  }, [id, selectedConnectorNodeId]);

  return (
    <path
      id={id}
      style={style}
      className={cn(
        "fill-none stroke-[4px]",
        isSelected
          ? "stroke-semantic-accent-default"
          : "stroke-semantic-bg-line"
      )}
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};
