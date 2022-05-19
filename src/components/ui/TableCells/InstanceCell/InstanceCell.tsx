import { FC, ReactNode } from "react";
import cn from "clsx";
import {
  getTailwindClassNumber,
  PipelineIcon,
} from "@instill-ai/design-system";
import InstanceInnerList from "./InstanceInnerList";
import { State } from "@/types/general";
import CellBase, { CellBaseProps } from "../CellBase";

export type Instance = {
  name: string;
  state: State;
};

export type InstanceCellProps = CellBaseProps & {
  width: string;
  type: "pipeline" | "model";
  instances: Instance[];
};

const InstanceCell: FC<InstanceCellProps> = ({
  width,
  instances,
  type,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
}) => {
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
    <CellBase
      paddingTop={paddingTop}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingBottom={paddingBottom}
    >
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
    </CellBase>
  );
};

export default InstanceCell;
