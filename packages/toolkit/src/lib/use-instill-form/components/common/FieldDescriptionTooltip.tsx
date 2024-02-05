import { Icons, ParagraphWithHTML, Tooltip } from "@instill-ai/design-system";
import { Nullable } from "../../../type";

export const FieldDescriptionTooltip = ({
  description,
}: {
  description: Nullable<string>;
}) => {
  return description ? (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Icons.HelpCircle className="my-auto h-[14px] w-[14px] cursor-pointer stroke-semantic-fg-secondary" />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="w-[360px]" sideOffset={5} side="top">
            <div className="!rounded-sm !bg-semantic-bg-primary !px-3 !py-2">
              <ParagraphWithHTML
                text={description}
                className="break-words text-semantic-fg-primary product-body-text-4-semibold"
              />
            </div>
            <Tooltip.Arrow
              className="fill-white"
              offset={5}
              width={9}
              height={6}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ) : null;
};
