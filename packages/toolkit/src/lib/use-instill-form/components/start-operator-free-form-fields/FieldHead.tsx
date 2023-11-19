import { useShallow } from "zustand/react/shallow";
import { InstillStore, Nullable, useInstillStore } from "../../..";
import { Icons } from "@instill-ai/design-system";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

export const FieldHead = ({
  title,
  path,
  onEditField,
  onDeleteField,
}: {
  title: Nullable<string>;
  path: string;
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
}) => {
  const { isOwner, currentVersion } = useInstillStore(useShallow(selector));
  return (
    <div className="mb-2 flex flex-row items-center justify-between">
      <div className="my-auto font-sans text-base font-semibold text-semantic-fg-primary">
        {title}
      </div>
      {currentVersion === "latest" && isOwner ? (
        <div className="my-auto flex flex-row gap-x-2">
          <button
            type="button"
            onClick={() => onEditField(path)}
            className="flex flex-row gap-x-1 rounded-full bg-semantic-accent-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-accent-default"
          >
            edit field
            <Icons.Edit03 className="my-auto h-3 w-3 stroke-semantic-accent-on-bg" />
          </button>
          <button type="button" onClick={() => onDeleteField(path)}>
            <Icons.Trash01 className="h-3 w-3 stroke-semantic-error-on-bg" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
