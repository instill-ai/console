import { useShallow } from "zustand/react/shallow";
import { InstillStore, useInstillStore } from "../../../../lib";
import { Icons } from "@instill-ai/design-system";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
});

export const UserDefinedFieldItem = ({
  fieldKey,
  fieldValue,
  onDeleteField,
  onEditField,
}: {
  fieldKey: string;
  fieldValue: string;
  onDeleteField: (key: string) => void;
  onEditField: (key: string) => void;
}) => {
  const { isOwner, currentVersion, pipelineIsReadOnly } = useInstillStore(
    useShallow(selector)
  );

  return (
    <div className="flex w-full flex-col">
      <div className="mb-2 flex flex-row items-center justify-between">
        <div className="my-auto font-sans text-base font-semibold text-semantic-fg-primary">
          {fieldKey}
        </div>
        {currentVersion === "latest" && !pipelineIsReadOnly && isOwner ? (
          <div className="my-auto flex flex-row gap-x-2">
            <button
              onClick={() => onEditField(fieldKey)}
              className="flex flex-row gap-x-1 rounded-full bg-semantic-accent-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-accent-default"
            >
              edit field
              <Icons.Edit03 className="my-auto h-3 w-3 stroke-semantic-accent-on-bg" />
            </button>
            <button onClick={() => onDeleteField(fieldKey)}>
              <Icons.Trash01 className="h-3 w-3 stroke-semantic-error-on-bg" />
            </button>
          </div>
        ) : null}
      </div>
      <p className="nodrag rounded-sm border border-semantic-bg-line bg-semantic-bg-primary px-1.5 py-[9px] product-body-text-4-regular">
        {fieldValue}
      </p>
    </div>
  );
};
