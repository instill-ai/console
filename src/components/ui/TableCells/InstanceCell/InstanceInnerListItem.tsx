import { FC } from "react";
import { Instance } from "./InstanceCell";
import cn from "clsx";
import StatusIndicator from "../../StatusIndicator";

export type InstanceInnerListItemProps = {
  item: Instance;
};

const InstanceInnerListItem: FC<InstanceInnerListItemProps> = ({ item }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-x-[5px] px-[5px] py-0.5",
        item.status === "error"
          ? "bg-instillRed10 text-instillRed"
          : item.status === "on"
          ? "bg-instillGreen10 text-instillGreen50"
          : "bg-instillGrey05 text-instillGrey70"
      )}
      key={`instance-item-list-${item.name}`}
    >
      <StatusIndicator
        status={item.status}
        width="w-3"
        height="h-3"
        position="my-auto"
      />
      <p
        className={cn(
          "instill-text-small my-auto",
          item.status === "error"
            ? "text-instillRed"
            : item.status === "on"
            ? "text-instillGreen50"
            : "text-instillGrey70"
        )}
      >
        {item.name}
      </p>
    </div>
  );
};

export default InstanceInnerListItem;
