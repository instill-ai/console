import { FC, memo } from "react";
import { Instance } from "./InstanceCell";
import cn from "clsx";
import StateIndicator from "../../StateIndicator";
import { ModelInstanceIcon } from "@instill-ai/design-system";

export type InstanceInnerListItemProps = {
  item: Instance;
  enableItemBgColor: boolean;
  indicator: "modelInstance" | "state";
  textStyle: string;
};

const InstanceInnerListItem: FC<InstanceInnerListItemProps> = ({
  item,
  enableItemBgColor,
  indicator,
  textStyle,
}) => {
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
      className={cn(
        "flex flex-row gap-x-[5px] px-[5px] py-0.5",
        enableItemBgColor ? bgColor : ""
      )}
      key={`instance-item-list-${item.name}`}
    >
      {indicator === "state" ? (
        <StateIndicator
          state={state}
          width="w-3"
          height="h-3"
          position="my-auto"
        />
      ) : (
        <ModelInstanceIcon
          width="w-[21px]"
          height="h-[21px]"
          position="my-auto"
          color="fill-instillGrey90"
        />
      )}
      <p className={cn("my-auto line-clamp-2", textColor, textStyle)}>
        {item.name}
      </p>
    </div>
  );
};

export default memo(InstanceInnerListItem);
