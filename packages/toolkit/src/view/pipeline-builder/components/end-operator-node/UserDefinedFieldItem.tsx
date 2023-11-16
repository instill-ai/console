import * as React from "react";
import cn from "clsx";
import { useShallow } from "zustand/react/shallow";
import { InstillStore, Nullable, useInstillStore } from "../../../../lib";
import { extractPipelineComponentReferenceFromString } from "../../lib";
import { ComplicateIcons, Icons, Tag } from "@instill-ai/design-system";
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

  const reference = extractPipelineComponentReferenceFromString({
    key: outputKey,
    value: outputValue,
    currentPath: [],
    nodeId: "end",
  });

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
      <button
        {...listeners}
        className="opacity-0 group-hover:opacity-100"
        ref={setNodeRef}
      >
        <ComplicateIcons.Drag
          className="h-4 w-4"
          fillAreaColor="fill-semantic-node-connector-off"
        />
      </button>
      <div className="flex w-full flex-col">
        <div className="mb-2 flex flex-row items-center justify-between">
          <div className="my-auto font-sans text-base font-semibold text-semantic-fg-primary">
            {outputKey}
          </div>
          {currentVersion === "latest" && isOwner ? (
            <div className="my-auto flex flex-row gap-x-4">
              <button
                onClick={() => {
                  onEditField(outputKey);
                  setPrevFieldKey(outputKey);
                }}
              >
                <Icons.Edit03 className="h-6 w-6 stroke-semantic-accent-on-bg" />
              </button>
              <button onClick={() => onDeleteField(outputKey)}>
                <Icons.Trash01 className="h-6 w-6 stroke-semantic-error-on-bg" />
              </button>
            </div>
          ) : null}
        </div>
        <div>
          {reference?.type === "singleCurlyBrace" ? (
            <Tag className="gap-x-1.5" variant="lightBlue" size="md">
              {reference.referenceValue.withoutCurlyBraces}
            </Tag>
          ) : (
            reference?.referenceValues.map((referenceValue) => (
              <Tag
                key={referenceValue.withCurlyBraces}
                className="gap-x-1.5"
                variant="lightBlue"
                size="md"
              >
                {referenceValue.withoutCurlyBraces}
              </Tag>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
