import { Tag, Tooltip } from "@instill-ai/design-system";
import { Nullable } from "../../../../lib";

export const ResourceIDTag = ({
  resourceID,
}: {
  resourceID: Nullable<string>;
}) => {
  // const resourceID = resourceName ? resourceName.split("/")[3] : null;

  return resourceID ? (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Tag
            variant="lightNeutral"
            size="sm"
            className="!max-w-[120px] !truncate !cursor-default"
          >
            {resourceID}
          </Tag>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            side="right"
            className="!px-3 !py-2 rounded-sm max-w-[300px] bg-semantic-bg-primary"
          >
            <div className="flex flex-col gap-y-1 text-left">
              <p className="product-body-text-4-semibold bg-semantic-bg-primary">
                resource ID
              </p>
              <p className="product-body-text-4-regular break-words text-semantic-fg-secondary">
                {resourceID}
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
