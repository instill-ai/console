import cn from "clsx";
import * as React from "react";
import { InstillStore, Nullable, useInstillStore } from "../../../lib";
import { Textarea } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

const selector = (store: InstillStore) => ({
  updateNodes: store.updateNodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export const NodeWrapper = ({
  nodeType,
  id,
  children,
  noteIsOpen,
  note,
}: {
  nodeType: "start" | "end" | "connector" | "operator";
  id: string;
  children: React.ReactNode;
  noteIsOpen: boolean;
  note: Nullable<string>;
}) => {
  const { updateNodes, updatePipelineRecipeIsDirty } = useInstillStore(
    useShallow(selector)
  );
  const timer = React.useRef<Nullable<number>>(null);
  const [noteValue, setNoteValue] = React.useState(note);

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute right-0 top-0 w-[var(--pipeline-builder-node-available-width)] rounded border border-semantic-warning-default bg-semantic-warning-bg p-2",
          noteIsOpen ? "" : "hidden",
          "-translate-y-[calc(100%+25px)]"
        )}
      >
        <Textarea
          className="!resize-none !border-none !bg-transparent !text-semantic-fg-disabled !outline-none !product-body-text-4-medium"
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
              console.log("update note");
            }, 1000);

            setNoteValue(e.target.value);
          }}
        />
      </div>

      {children}
    </div>
  );
};
