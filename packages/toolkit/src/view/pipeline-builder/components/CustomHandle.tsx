"use client";

import cn from "clsx";
import * as React from "react";
import { Handle, HandleProps } from "reactflow";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";

export type CustomHandleProps = HandleProps & {
  className?: string;
};

const selector = (store: InstillStore) => ({
  edges: store.edges,
  selectedConnectorNodeId: store.selectedConnectorNodeId,
});

export const CustomHandle = (props: CustomHandleProps) => {
  const { className, id, ...passThrough } = props;

  const { edges, selectedConnectorNodeId } = useInstillStore(
    useShallow(selector)
  );

  const isSelected = React.useMemo(() => {
    if (selectedConnectorNodeId && selectedConnectorNodeId === id) {
      return true;
    }

    return edges.some((edge) => {
      if (edge.source === id && edge.target === selectedConnectorNodeId) {
        return true;
      }

      if (edge.target === id && edge.source === selectedConnectorNodeId) {
        return true;
      }

      return false;
    });
  }, [edges, id, selectedConnectorNodeId]);

  return (
    <div
      className={cn(
        "absolute top-1/2",
        passThrough.type === "target"
          ? "left-0 -translate-x-full"
          : "right-0 translate-x-full"
      )}
    >
      <Handle
        {...passThrough}
        className={cn(
          "!static !flex !h-4 !w-4 !border-[3px] !bg-semantic-bg-primary",
          isSelected ? "!border-semantic-accent-default" : "!border-[#94A0B8]",
          className
        )}
        isConnectable={false}
      />
    </div>
  );
};
