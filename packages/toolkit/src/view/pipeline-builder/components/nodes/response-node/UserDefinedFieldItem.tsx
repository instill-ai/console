"use client";

import { useShallow } from "zustand/react/shallow";
import { InstillStore, useInstillStore } from "../../../../../lib";
import { Icons, Tooltip } from "@instill-ai/design-system";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
});

export const UserDefinedFieldItem = ({
  fieldKey,
  fieldTitle,
  fieldValue,
  onDeleteField,
  onEditField,
}: {
  fieldKey: string;
  fieldTitle: string;
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
          {fieldTitle}
        </div>
        {currentVersion === "latest" && !pipelineIsReadOnly && isOwner ? (
          <div className="my-auto flex flex-row gap-x-2">
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => onEditField(fieldKey)}
                    aria-label={`Edit end operator ${fieldKey} field`}
                  >
                    <Icons.Edit03 className="my-auto h-3 w-3 stroke-semantic-accent-on-bg" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    sideOffset={5}
                    side="top"
                    className="max-w-[300px] rounded-sm bg-semantic-bg-primary !px-3 !py-2"
                  >
                    <div className="flex flex-col gap-y-1 text-left">
                      <p className="bg-semantic-bg-primary product-body-text-4-semibold">
                        Edit this field
                      </p>
                    </div>
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
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => onDeleteField(fieldKey)}
                    aria-label={`Delete end operator ${fieldKey} field`}
                  >
                    <Icons.Trash01 className="h-3 w-3 stroke-semantic-error-on-bg" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    sideOffset={5}
                    side="top"
                    className="max-w-[300px] rounded-sm bg-semantic-bg-primary !px-3 !py-2"
                  >
                    <div className="flex flex-col gap-y-1 text-left">
                      <p className="bg-semantic-bg-primary product-body-text-4-semibold">
                        Delete this field
                      </p>
                    </div>
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
          </div>
        ) : null}
      </div>
      <p className="nodrag nowheel rounded-sm border border-semantic-bg-line bg-semantic-bg-secondary px-1.5 py-[9px] product-body-text-4-regular">
        {fieldValue}
      </p>
    </div>
  );
};
