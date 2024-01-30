import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import {
  FieldMode,
  GeneralUseFormReturn,
  InstillStore,
  Nullable,
  useInstillStore,
} from "../../..";
import {
  Button,
  Icons,
  Popover,
  Tag,
  Tooltip,
} from "@instill-ai/design-system";
import {
  ReferenceHintDataTypeTag,
  ReferenceHintTag,
} from "../../../../components";

const selector = (store: InstillStore) => ({
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

export const FieldHead = ({
  mode,
  form,
  title,
  path,
  instillFormat,
  onEditField,
  onDeleteField,
  disabledFieldControl,
  disabledReferenceHint,
}: {
  mode: FieldMode;
  form: GeneralUseFormReturn;
  title: Nullable<string>;
  path: string;
  instillFormat: string;
  onEditField?: (key: string) => void;
  onDeleteField?: (key: string) => void;
  disabledFieldControl?: boolean;
  disabledReferenceHint?: boolean;
}) => {
  const { isOwner, currentVersion } = useInstillStore(useShallow(selector));
  const [open, setOpen] = React.useState(false);
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
              <>
                <Popover.Root
                  open={open}
                  onOpenChange={(open) => setOpen(open)}
                >
                  <Popover.Trigger>
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          {/* 
                            eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                          */}
                          <span className="flex" tabIndex={0}>
                            <Button
                              className="!my-auto !px-1 !py-1 hover:!bg-semantic-bg-secondary"
                              size="sm"
                              variant="tertiaryGrey"
                              type="button"
                              onClick={() => {
                                setOpen((prev) => !prev);
                              }}
                            >
                              <Icons.DotsHorizontal className="h-4 w-4 stroke-semantic-fg-secondary" />
                            </Button>
                          </span>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
                            More control options
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
                  </Popover.Trigger>

                  <Popover.Content
                    side="bottom"
                    sideOffset={4}
                    align="end"
                    className="flex w-[200px] flex-col !rounded-sm !border !border-semantic-bg-line !p-0"
                  >
                    <div className="flex flex-col">
                      <div className="flex h-6 gap-x-3 rounded-t-sm border-b border-semantic-bg-line bg-semantic-bg-base-bg px-2">
                        <p className="my-auto text-[10px] font-semibold text-semantic-fg-disabled">
                          {title}
                        </p>
                      </div>
                      <div className="flex flex-col py-1">
                        <button
                          type="button"
                          onClick={() => {
                            form.clearErrors();
                            if (onEditField) onEditField(path);
                          }}
                          className="flex flex-row items-center gap-x-2 px-2 py-1 hover:bg-semantic-accent-bg-alt"
                        >
                          <Icons.Edit03 className="my-auto h-3 w-3 stroke-semantic-accent-on-bg" />
                          <p className="text-semantic-accent-default product-body-text-4-medium">
                            edit field
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onDeleteField) onDeleteField(path);
                          }}
                          className="flex flex-row items-center gap-x-2 px-2 py-1 hover:bg-semantic-error-bg-alt"
                        >
                          <Icons.Trash01 className="h-3 w-3 stroke-semantic-error-on-bg" />
                          <p className="text-semantic-error-default product-body-text-4-medium">
                            delete field
                          </p>
                        </button>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover.Root>
              </>
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
              opacity: disabledReferenceHint ? 0 : 1,
            }}
          >
            <div className="overflow-hidden">
              <div className="flex flex-row items-center gap-x-2">
                <ReferenceHintTag.Root>
                  <ReferenceHintTag.Icon type="check" />
                  <ReferenceHintTag.Label
                    label={`start.${path}`}
                    className="!max-w-[160px] text-semantic-accent-default"
                  />
                </ReferenceHintTag.Root>
                <ReferenceHintDataTypeTag label={instillFormat} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-auto text-semantic-fg-primary product-body-text-4-semibold">
          {title}
        </div>
      )}
    </div>
  );
};
