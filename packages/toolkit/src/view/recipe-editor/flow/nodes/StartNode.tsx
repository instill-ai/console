"use client";

import * as React from "react";
import { NodeProps, Position, useEdges } from "reactflow";

import { cn, Icons } from "@instill-ai/design-system";

import {
  InstillStore,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../../../lib";
import { CustomHandle } from "./CustomHandle";

const selector = (store: InstillStore) => ({
  enabledQuery: store.enabledQuery,
  accessToken: store.accessToken,
  updateSelectedComponentId: store.updateSelectedComponentId,
});

export const StartNode = ({ id }: NodeProps) => {
  const routeInfo = useRouteInfo();
  const reactflowEdges = useEdges();

  const hasSourceEdges = React.useMemo(() => {
    return reactflowEdges.some(
      (edge) => edge.source === id && edge.target !== "output",
    );
  }, [id, reactflowEdges]);

  const { enabledQuery, accessToken, updateSelectedComponentId } =
    useInstillStore(useShallow(selector));

  const pipeline = useNamespacePipeline({
    namespaceId: routeInfo.data.namespaceId,
    pipelineId: routeInfo.data.resourceId,
    accessToken: accessToken,
    enabled: enabledQuery && routeInfo.isSuccess,
    shareCode: null,
    view: "VIEW_FULL",
  });

  const hasEventErrorEdge = React.useMemo(() => {
    return reactflowEdges.some((edge) => edge.type === "eventErrorEdge");
  }, [reactflowEdges]);

  const eventCount = React.useMemo(() => {
    if (
      !pipeline.isSuccess ||
      !pipeline.data.recipe ||
      !pipeline.data.recipe.on
    ) {
      return 0;
    }

    return Object.keys(pipeline.data.recipe.on).length;
  }, [pipeline.data, pipeline.isSuccess]);

  return (
    <div
      onClick={() => {
        updateSelectedComponentId(() => null);
      }}
      className="relative"
    >
      {eventCount > 0 ? (
        <StartNodeOpenEventButton
          hasEventErrorEdge={hasEventErrorEdge}
          eventCount={eventCount}
        />
      ) : null}
      <div className="flex w-[160px] rounded bg-semantic-bg-alt-primary border-[1.5px] border-[#AF89FA] h-[160px] items-center justify-center">
        <Icons.Flag06 className="w-[80px] h-[80px] stroke-semantic-fg-disabled" />
      </div>
      <CustomHandle
        wrapperClassName="translate-x-none opacity-0"
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

const buttonSelector = (store: InstillStore) => ({
  displayEventNodes: store.displayEventNodes,
  updateDisplayEventNodes: store.updateDisplayEventNodes,
});

const StartNodeOpenEventButton = ({
  eventCount,
  hasEventErrorEdge,
}: {
  eventCount: number;
  hasEventErrorEdge: boolean;
}) => {
  const { displayEventNodes, updateDisplayEventNodes } = useInstillStore(
    useShallow(buttonSelector),
  );

  if (hasEventErrorEdge) {
    return (
      <button
        onClick={() => {
          updateDisplayEventNodes((prev) => !prev);
        }}
        className="absolute border-[1.5px] bg-semantic-error-bg rounded-full border-semantic-error-default top-0 left-0 -translate-x-1/2 -translate-y-1/2 p-3"
      >
        <Icons.AlertCircle className="w-4 h-4 stroke-semantic-error-default" />
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        updateDisplayEventNodes((prev) => !prev);
      }}
      className={cn(
        "absolute items-center rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2 p-1.5 px-3 flex flex-row gap-x-1",
        displayEventNodes
          ? "bg-semantic-secondary-default"
          : "bg-semantic-bg-base-bg border border-semantic-secondary-default",
      )}
    >
      <Icons.Lightning02
        className={cn(
          "w-4 h-4",
          displayEventNodes
            ? "stroke-semantic-bg-base-bg"
            : "stroke-semantic-secondary-default",
        )}
      />
      <p
        className={cn(
          "font-sans",
          displayEventNodes
            ? "text-semantic-bg-base-bg"
            : "text-semantic-secondary-default",
        )}
        style={{
          fontSize: "16px",
          fontWeight: "450",
        }}
      >
        {eventCount}
      </p>
    </button>
  );
};
