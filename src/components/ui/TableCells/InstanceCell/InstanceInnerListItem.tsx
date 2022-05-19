import { FC, memo } from "react";
import { Instance } from "./InstanceCell";
import cn from "clsx";
import StateIndicator from "../../StateIndicator";

export type InstanceInnerListItemProps = {
  item: Instance;
};

const InstanceInnerListItem: FC<InstanceInnerListItemProps> = ({ item }) => {
  const { state } = item;
  let textColor: string;
  let bgColor: string;

  switch (state) {
    case "STATE_ERROR":
      textColor = "text-instillRed";
      bgColor = "bg-instillRed10";
      break;
    case "STATE_ACTIVE":
    case "STATE_ONLINE":
    case "STATE_CONNECTED":
      textColor = "text-instillGreen50";
      bgColor = "bg-instillGreen10";
      break;
    case "STATE_OFFLINE":
    case "STATE_INACTIVE":
    case "STATE_DISCONNECTED":
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
      break;
    default:
      textColor = "text-instillGrey70";
      bgColor = "bg-instillGrey05";
  }

  return (
    <div
      className={cn("flex flex-row gap-x-[5px] px-[5px] py-0.5", bgColor)}
      key={`instance-item-list-${item.name}`}
    >
      <StateIndicator
        state={state}
        width="w-3"
        height="h-3"
        position="my-auto"
      />
      <p className={cn("instill-text-small my-auto", textColor)}>{item.name}</p>
    </div>
  );
};

export default memo(InstanceInnerListItem);
