import * as React from "react";
import cn from "clsx";
import { useShallow } from "zustand/react/shallow";
import { InstillStore, Nullable, useInstillStore } from "../../../../lib";
import { ComplicateIcons, Icons } from "@instill-ai/design-system";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useReactFlow } from "reactflow";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

export const UserDefinedFieldItem = ({
  outputKey,
  outputValue,
  setPrevFieldKey,
  onDeleteField,
  onEditField,
}: {
  outputKey: string;
  outputValue: string;
  setPrevFieldKey: React.Dispatch<React.SetStateAction<Nullable<string>>>;
  onDeleteField: (key: string) => void;
  onEditField: (key: string) => void;
}) => {
  const { isOwner, currentVersion } = useInstillStore(useShallow(selector));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: outputKey });

  const reactFlowInstance = useReactFlow();

  // Because dndkit is using the cached boundingbox information when first
  // render. They don't know the ancestor (reactflow) zoom level when
  // calculate the transform, we need to take it into account.
  const style = {
    transform: transform
      ? CSS.Transform.toString({
          x: transform.x / reactFlowInstance.getZoom(),
          y: transform.y / reactFlowInstance.getZoom(),
          scaleX: transform.scaleX,
          scaleY: transform.scaleY,
        })
      : undefined,
    transition,
  };

  return (
    <div
      key={outputKey}
      className={cn(
        "nodrag group flex cursor-default flex-row gap-x-2 bg-semantic-bg-base-bg",
        isDragging ? "z-10" : ""
      )}
      style={style}
      {...attributes}
    >
      <div className="my-auto flex">
        <button
          {...listeners}
          className="h-4 w-4 opacity-0 group-hover:opacity-100"
          ref={setNodeRef}
        >
          <ComplicateIcons.Drag
            className="h-4 w-4"
            fillAreaColor="fill-semantic-node-connector-off"
          />
        </button>
      </div>
      <div className="flex w-full flex-col">
        <div className="mb-2 flex flex-row items-center justify-between">
          <div className="my-auto font-sans text-base font-semibold text-semantic-fg-primary">
            {outputKey}
          </div>
          {currentVersion === "latest" && isOwner ? (
            <div className="my-auto flex flex-row gap-x-2">
              <button
                onClick={() => onEditField(outputKey)}
                className="flex flex-row gap-x-1 rounded-full bg-semantic-accent-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-accent-default"
              >
                edit field
                <Icons.Edit03 className="my-auto h-3 w-3 stroke-semantic-accent-on-bg" />
              </button>
              <button onClick={() => onDeleteField(outputKey)}>
                <Icons.Trash01 className="h-3 w-3 stroke-semantic-error-on-bg" />
              </button>
            </div>
          ) : null}
        </div>
        <p className="nodrag rounded-sm border border-semantic-bg-line bg-semantic-bg-primary px-1.5 py-[9px] product-body-text-4-regular">
          {outputValue}
        </p>
      </div>
      {/* Placeholder */}
      <div className="flex h-4 w-4 flex-shrink-0"></div>
    </div>
  );
};
