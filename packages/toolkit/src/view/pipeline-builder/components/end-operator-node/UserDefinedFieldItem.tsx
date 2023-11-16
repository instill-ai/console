import * as React from "react";
import cn from "clsx";
import { useShallow } from "zustand/react/shallow";
import { InstillStore, Nullable, useInstillStore } from "../../../../lib";
import { extractPipelineComponentReferenceFromString } from "../../lib";
import { Icons, Tag } from "@instill-ai/design-system";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  const reference = extractPipelineComponentReferenceFromString({
    key: outputKey,
    value: outputValue,
    currentPath: [],
    nodeId: "end",
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      key={outputKey}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "nodrag flex flex-col bg-semantic-bg-base-bg",
        isDragging ? "z-10" : ""
      )}
    >
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
  );
};
