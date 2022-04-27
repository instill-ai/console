import { FC, ReactNode } from "react";
import cn from "clsx";
import {
  getTailwindClassNumber,
  PipelineIcon,
} from "@instill-ai/design-system";
import InstanceInnerList from "./InstanceInnerList";

export type Instance = {
  name: string;
  status: "on" | "off" | "error";
};

export type InstanceCellProps = {
  width: string;
  type: "pipeline" | "model";
  instances: Instance[];
};

const InstanceCell: FC<InstanceCellProps> = ({ width, instances, type }) => {
  let icon: ReactNode;
  const iconHeight = "h-5";
  const iconWidth = "w-5";
  const iconPosition = "my-auto";

  switch (type) {
    case "model":
      icon = (
        <PipelineIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    case "pipeline":
      icon = (
        <PipelineIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
      break;
    default:
      console.error("Wrong instance type");
      icon = (
        <div className="h-5 w-5 rounded-full border border-instillGrey95"></div>
      );
      break;
  }

  const widthInNumber = getTailwindClassNumber(width);

  return (
    <div className={cn("flex flex-col gap-y-3", width)}>
      <div className="flex flex-row gap-x-3">
        {icon}
        <p className="instill-text-body text-instillGrey90">
          {instances ? instances.length : 0}
        </p>
      </div>
      <InstanceInnerList
        items={instances}
        listItemsContainerWidth={widthInNumber}
      />
    </div>
  );
};

export default InstanceCell;
