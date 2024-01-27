import * as React from "react";
import cn from "clsx";
import { useShallow } from "zustand/react/shallow";
import {
  FieldMode,
  GeneralUseFormReturn,
  InstillStore,
  Nullable,
  useInstillStore,
} from "../../..";
import { Icons, Tag, Tooltip } from "@instill-ai/design-system";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

export const FieldHead = ({
  mode,
  form,
  title,
  path,
  onEditField,
  onDeleteField,
  disabledFieldControl,
  disabledReferenceHint,
}: {
  mode: FieldMode;
  form: GeneralUseFormReturn;
  title: Nullable<string>;
  path: string;
  onEditField?: (key: string) => void;
  onDeleteField?: (key: string) => void;
  disabledFieldControl?: boolean;
  disabledReferenceHint?: boolean;
}) => {
  const { isOwner, currentVersion } = useInstillStore(useShallow(selector));
  return (
    <div className="flex">
      {mode === "build" ? (
        <div className="flex w-full flex-col justify-between gap-y-2.5">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex w-1/2 flex-1 flex-row gap-x-2">
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <div className="my-auto line-clamp-1 max-w-[120px] font-sans text-sm font-semibold text-semantic-fg-primary">
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
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Icons.HelpCircle className="my-auto h-[14px] w-[14px] cursor-pointer stroke-semantic-fg-secondary" />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      sideOffset={5}
                      side="top"
                      className="w-[300px] rounded-sm !border-none bg-semantic-bg-primary !px-3 !py-2"
                    >
                      <div className="flex flex-col gap-y-2">
                        <div className="flex flex-row gap-x-2">
                          <div className="pt-0.5">
                            <Icons.InfoCircle className="mb-auto h-4 w-4 stroke-semantic-fg-secondary" />
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <p className="m-auto text-semantic-fg-secondary product-body-text-3-semibold">
                              You can use{" "}
                              <Tag
                                variant="lightBlue"
                                size="sm"
                                className="!rounded !px-2 !py-0.5"
                              >
                                ${`{start.${path}}`}
                              </Tag>{" "}
                              to reference this field&rsquo;s value.
                            </p>
                          </div>
                        </div>
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
            {currentVersion === "latest" && !disabledFieldControl && isOwner ? (
              <div className="my-auto flex flex-row gap-x-2">
                <button
                  type="button"
                  onClick={() => {
                    form.clearErrors();
                    if (onEditField) onEditField(path);
                  }}
                  className="my-auto flex flex-row gap-x-1 rounded-full bg-semantic-accent-bg px-2 py-0.5 font-sans text-xs font-medium text-semantic-accent-default hover:bg-semantic-accent-bg-alt"
                >
                  edit field
                  <Icons.Edit03 className="my-auto h-3 w-3 stroke-semantic-accent-on-bg" />
                </button>
                <button
                  className="my-auto rounded p-1 hover:bg-semantic-error-bg-alt"
                  type="button"
                  onClick={() => {
                    if (onDeleteField) onDeleteField(path);
                  }}
                >
                  <Icons.Trash01 className="h-3 w-3 stroke-semantic-error-on-bg" />
                </button>
              </div>
            ) : null}
          </div>

          {/* 
            height animation css hack
            ref: https://keithjgrant.com/posts/2023/04/transitioning-to-height-auto/
         */}

          <div
            className="grid"
            style={{
              gridTemplateRows: disabledReferenceHint ? "0fr" : "1fr",
              transition:
                "grid-template-rows 0.5s ease-out, opacity 0.5s ease-out",
              opacity: disabledReferenceHint ? 1 : 1,
            }}
          >
            <div className="overflow-hidden">
              <div className="flex">
                <div className="flex flex-shrink flex-row items-center gap-x-1 rounded-full bg-semantic-accent-bg px-2 py-0.5">
                  <div>
                    <Icons.ReferenceIconCheck
                      className={cn(
                        "h-[9px] w-[18px] transition-colors duration-500",
                        disabledReferenceHint
                          ? "stroke-semantic-fg-secondary"
                          : "stroke-semantic-accent-default"
                      )}
                    />
                  </div>
                  <p className="font-sans text-[10px] font-medium text-semantic-accent-default">{`start.${path}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-auto text-semantic-fg-primary product-body-text-3-semibold">
          {title}
        </div>
      )}
    </div>
  );
};
