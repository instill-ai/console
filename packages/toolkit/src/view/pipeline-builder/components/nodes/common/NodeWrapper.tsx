"use client";

import cn from "clsx";
import * as React from "react";
import { InstillStore, Nullable, useInstillStore } from "../../../../../lib";
import { Textarea } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";
import { NodeBottomBarProvider } from "./node-bottom-bar";
import { Edge, Position } from "reactflow";
import { NodeData } from "../../../type";
import { CustomHandle } from "../../CustomHandle";

const selector = (store: InstillStore) => ({
  updateNodes: store.updateNodes,
  edges: store.edges,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
});

export const NodeWrapper = ({
  nodeData,
  children,
  noteIsOpen,
  renderBottomBarInformation,
  renderNodeBottomBar,
  disabledSourceHandler,
  disabledTargetHandler,
}: {
  nodeData: NodeData;
  children: React.ReactNode;
  noteIsOpen: boolean;
  renderBottomBarInformation?: () => React.ReactNode;
  renderNodeBottomBar?: () => React.ReactNode;
  disabledSourceHandler?: boolean;
  disabledTargetHandler?: boolean;
}) => {
  const {
    updateNodes,
    edges,
    updateEdges,
    updatePipelineRecipeIsDirty,
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
  } = useInstillStore(useShallow(selector));
  const timer = React.useRef<Nullable<number>>(null);
  const [noteValue, setNoteValue] = React.useState(nodeData.note);

  const hasTargetEdges = React.useMemo(() => {
    return edges.some((edge) => edge.target === nodeData.id);
  }, [edges, nodeData.id]);

  const hasSourceEdges = React.useMemo(() => {
    return edges.some((edge) => edge.source === nodeData.id);
  }, [edges, nodeData.id]);

  return (
    <div
      className="relative"
      onClick={() => {
        updateSelectedConnectorNodeId(() => nodeData.id);

        // We reorder the edges so that the selected edge is on top of the unselected edges
        updateEdges((edges) => {
          const selectedEdges: Edge[] = [];
          const unSelectedEdges: Edge[] = [];

          edges.forEach((edge) => {
            if (edge.source === nodeData.id || edge.target === nodeData.id) {
              selectedEdges.push(edge);
            } else {
              unSelectedEdges.push(edge);
            }
          });

          return [...unSelectedEdges, ...selectedEdges];
        });
      }}
    >
      <div
        className={cn(
          "absolute left-0 top-0 w-[var(--pipeline-builder-node-available-width)] rounded border border-semantic-warning-default bg-semantic-warning-bg p-2",
          noteIsOpen ? "" : "hidden",
          "-translate-y-[calc(100%+16px)]"
        )}
      >
        <Textarea
          className="nowheel !resize-none !border-none !bg-transparent !text-semantic-fg-disabled !outline-none !product-body-text-4-medium"
          value={noteValue ?? ""}
          onChange={(e) => {
            if (timer.current) {
              clearTimeout(timer.current);
            }

            timer.current = window.setTimeout(() => {
              updateNodes((nodes) =>
                nodes.map((node) => {
                  if (node.id === nodeData.id) {
                    node.data = {
                      ...node.data,
                      note: e.target.value,
                    };

                    return node;
                  }

                  return node;
                })
              );
              updatePipelineRecipeIsDirty(() => true);
            }, 1000);

            setNoteValue(e.target.value);
          }}
        />
      </div>
      <NodeBottomBarProvider>
        <div
          className={cn(
            "flex w-[var(--pipeline-builder-node-available-width)] flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-base-bg shadow-md hover:shadow-lg",
            {
              "outline outline-2 outline-offset-1 outline-semantic-accent-default":
                nodeData.id === selectedConnectorNodeId,
            }
          )}
        >
          <div className="flex flex-col px-3 py-2.5">{children}</div>
          {renderNodeBottomBar ? renderNodeBottomBar() : null}
        </div>
        {renderBottomBarInformation ? (
          <div
            id={`${nodeData.id}-node-bottom-information-container`}
            className="nodrag nowheel absolute bottom-0 left-0 w-[var(--pipeline-builder-node-available-width)] translate-y-[calc(100%+16px)] rounded-sm bg-semantic-bg-base-bg shadow-md"
          >
            {renderBottomBarInformation()}
          </div>
        ) : null}
        {disabledTargetHandler ? null : (
          <CustomHandle
            className={hasTargetEdges ? "" : "!opacity-0"}
            type="target"
            position={Position.Left}
            id={nodeData.id}
          />
        )}
        {disabledSourceHandler ? null : (
          <CustomHandle
            className={hasSourceEdges ? "" : "!opacity-0"}
            type="source"
            position={Position.Right}
            id={nodeData.id}
          />
        )}
      </NodeBottomBarProvider>
    </div>
  );
};
