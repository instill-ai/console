import cn from "clsx";
import * as React from "react";
import { InstillStore, Nullable, useInstillStore } from "../../../lib";
import { Textarea } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

const selector = (store: InstillStore) => ({
  updateNodes: store.updateNodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
});

export const NodeWrapper = ({
  nodeType,
  id,
  children,
  noteIsOpen,
  note,
  renderBottomBarInformation,
  renderNodeBottomBar,
}: {
  nodeType: "start" | "end" | "connector" | "operator";
  id: string;
  children: React.ReactNode;
  noteIsOpen: boolean;
  note: Nullable<string>;
  renderBottomBarInformation?: () => React.ReactNode;
  renderNodeBottomBar?: () => React.ReactNode;
}) => {
  const {
    updateNodes,
    updatePipelineRecipeIsDirty,
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
  } = useInstillStore(useShallow(selector));
  const timer = React.useRef<Nullable<number>>(null);
  const [noteValue, setNoteValue] = React.useState(note);

  return (
    <div
      className="relative"
      onClick={() => {
        updateSelectedConnectorNodeId(() => id);
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
                  if (node.id === id && node.data.nodeType === nodeType) {
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
      <div
        className={cn(
          "flex w-[var(--pipeline-builder-node-available-width)] flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-base-bg shadow-md hover:shadow-lg",
          {
            "outline outline-2 outline-offset-1 outline-semantic-accent-default":
              id === selectedConnectorNodeId,
          }
        )}
      >
        <div className="flex flex-col px-3 py-2.5">{children}</div>
        {renderNodeBottomBar ? renderNodeBottomBar() : null}
      </div>
      {renderBottomBarInformation ? (
        <div
          id={`${id}-node-bottom-information-container`}
          className="nodrag nowheel absolute bottom-0 left-0 w-[var(--pipeline-builder-node-available-width)] translate-y-[calc(100%+16px)]"
        >
          {renderBottomBarInformation()}
        </div>
      ) : null}
    </div>
  );
};
