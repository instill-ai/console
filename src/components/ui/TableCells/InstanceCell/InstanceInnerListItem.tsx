import { FC, useMemo } from "react";
import { Instance } from "./InstanceCell";
import cn from "clsx";
import StateIndicator from "../../StateIndicator";

export type InstanceInnerListItemProps = {
  item: Instance;
};

const InstanceInnerListItem: FC<InstanceInnerListItemProps> = ({ item }) => {
  const itemStyle = useMemo(() => {
    const { status } = item;

    if (status === "error") {
      return "bg-instillRed10 text-instillRed";
    }

    if (
      status === "on" ||
      status === "active" ||
      status === "connected" ||
      status === "online"
    ) {
      return "bg-instillGreen10 text-instillGreen50";
    }

    if (
      status === "off" ||
      status === "inactive" ||
      status === "disconnected" ||
      status === "offline" ||
      status === "unspecific"
    ) {
      return "bg-instillGrey05 text-instillGrey70";
    }
  }, [item]);

  return (
    <div
      className={cn("flex flex-row gap-x-[5px] px-[5px] py-0.5", itemStyle)}
      key={`instance-item-list-${item.name}`}
    >
      <StateIndicator
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
