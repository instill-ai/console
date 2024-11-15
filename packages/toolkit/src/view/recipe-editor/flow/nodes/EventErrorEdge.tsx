"use client";

import * as React from "react";
import { EdgeLabelRenderer, EdgeProps, getSmoothStepPath } from "reactflow";

import { Icons, Tooltip } from "@instill-ai/design-system";

export const EventErrorEdge = ({
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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <React.Fragment>
      <path
        id={id}
        style={style}
        className="fill-none stroke-[#EF4352] stroke-[4px]"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute origin-center"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div
                  style={{
                    borderColor: "#F8727D",
                  }}
                  className="h-10 w-10 border bg-semantic-error-bg rounded-full flex items-center justify-center"
                >
                  <Icons.X className="h-5 w-5 stroke-semantic-error-hover" />
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="rounded-sm"
                  sideOffset={5}
                  side={"right"}
                >
                  <div className="w-[216px] flex-col gap-y-1 items-start justify-start rounded-sm bg-semantic-bg-secondary-base-bg p-3">
                    <p className="product-body-text-4-semibold text-semantic-fg-on-default">
                      Need to link to a variable
                    </p>
                    <p className="product-body-text-4-medium text-semantic-fg-on-default">
                      Link it to a variable to be used in the pipeline
                    </p>
                  </div>
                  <Tooltip.Arrow
                    className="fill-semantic-bg-secondary-base-bg"
                    offset={10}
                    width={9}
                    height={6}
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </EdgeLabelRenderer>
    </React.Fragment>
  );
};
