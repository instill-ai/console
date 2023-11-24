import { useShallow } from "zustand/react/shallow";
import {
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
  form,
  title,
  path,
  onEditField,
  onDeleteField,
}: {
  form: GeneralUseFormReturn;
  title: Nullable<string>;
  path: string;
  onEditField: (key: string) => void;
  onDeleteField: (key: string) => void;
}) => {
  const { isOwner, currentVersion } = useInstillStore(useShallow(selector));
  return (
    <div className="flex flex-row items-center justify-between">
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
                        >{`{${path}}`}</Tag>{" "}
                        to reference this field&rsquo;s value.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <div className="pt-0.5">
                      <Icons.InfoCircle className="mb-auto h-4 w-4 stroke-semantic-fg-secondary" />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <p className="m-auto text-semantic-fg-secondary product-body-text-3-semibold">
                        You can also use{" "}
                        <Tag
                          variant="lightBlue"
                          size="sm"
                          className="!rounded !px-2 !py-0.5"
                        >{`{{${path}}}`}</Tag>{" "}
                        to build the template which use this value. For example
                      </p>
                      <p className="rounded border border-semantic-bg-line bg-semantic-bg-base-bg px-2 py-1 text-semantic-fg-secondary product-body-text-3-regular">
                        {`This is a template use this value, {{start.${title}}}`}
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
      {currentVersion === "latest" && isOwner ? (
        <div className="my-auto flex flex-row gap-x-2">
          <button
            type="button"
            onClick={() => {
              form.clearErrors();
              onEditField(path);
            }}
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
