import { useShallow } from "zustand/react/shallow";
import { InstillStore, Nullable, useInstillStore } from "../../..";
import { Icons, Tooltip } from "@instill-ai/design-system";

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
    <div className="flex flex-row items-center justify-between">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="my-auto line-clamp-1 w-1/2 font-sans text-sm font-semibold text-semantic-fg-primary">
              {title}
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={5}
              side="top"
              className="max-w-[300px] rounded-sm !border-none bg-semantic-bg-primary !px-3 !py-2"
            >
              <p className="break-words text-semantic-fg-secondary !product-body-text-4-semibold">
                {title}
              </p>
              <Tooltip.Arrow
                className="fill-semantic-bg-primary"
                offset={10}
                width={9}
                height={6}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      {currentVersion === "latest" && isOwner ? (
        <div className="my-auto flex flex-row gap-x-2">
          <button
            type="button"
            onClick={() => onEditField(path)}
            className="my-auto flex flex-row gap-x-1 rounded-full bg-semantic-accent-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-accent-default hover:bg-semantic-accent-bg-alt"
          >
            edit field
            <Icons.Edit03 className="my-auto h-3 w-3 stroke-semantic-accent-on-bg" />
          </button>
          <button
            className="my-auto rounded p-1 hover:bg-semantic-error-bg-alt"
            type="button"
            onClick={() => onDeleteField(path)}
          >
            <Icons.Trash01 className="h-3 w-3 stroke-semantic-error-on-bg" />
          </button>
        </div>
      ) : null}
    </div>
  );
};
