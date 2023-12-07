import { Tag, Tooltip } from "@instill-ai/design-system";
import { Nullable } from "../../../../../lib";

export const ConnectorIDTag = ({
  connectorID,
}: {
  connectorID: Nullable<string>;
}) => {
  return connectorID ? (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Tag
            variant="lightNeutral"
            size="sm"
            className="!max-w-[120px] !cursor-default !truncate"
          >
            {connectorID}
          </Tag>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            side="right"
            className="max-w-[300px] rounded-sm bg-semantic-bg-primary !px-3 !py-2"
          >
            <div className="flex flex-col gap-y-1 text-left">
              <p className="bg-semantic-bg-primary product-body-text-4-semibold">
                Connector ID
              </p>
              <p className="break-words text-semantic-fg-secondary product-body-text-4-regular">
                {connectorID}
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
  ) : null;
};
