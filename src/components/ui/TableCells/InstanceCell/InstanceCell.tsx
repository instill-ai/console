import { FC, ReactNode } from "react";
import cn from "clsx";
import {
  getTailwindClassNumber,
  ModelInstanceIcon,
  PipelineIcon,
} from "@instill-ai/design-system";
import { InstanceInnerList } from "./InstanceInnerList";
import { State } from "@/types/general";
import { CellBaseProps, CellBase } from "../CellBase";

export type Instance = {
  name: string;
  state: State;
};

export type InstanceCellProps = CellBaseProps & {
  width: string;
  type: "pipeline" | "model";
  instances: Instance[];
  cellType: "shrink" | "expand";
};

export const InstanceCell: FC<InstanceCellProps> = ({
  width,
  cellType,
  instances,
  type,
  padding,
}) => {
  let icon: ReactNode;
  const iconHeight = "h-5";
  const iconWidth = "w-5";
  const iconPosition = "my-auto";

  switch (type) {
    case "model":
      icon = (
        <ModelInstanceIcon
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
    <>
      {cellType === "shrink" ? (
        <CellBase padding={padding}>
          <div className={cn("flex", width)}>
            <InstanceInnerList
              items={instances}
              enableItemBgColor={false}
              indicator="modelInstance"
              listItemsContainerWidth={widthInNumber}
              textStyle="text-instill-body"
            />
          </div>
        </CellBase>
      ) : (
        <CellBase padding={padding}>
          <div
            className={cn("flex flex-col", width, {
              "gap-y-3": instances.length > 0,
            })}
          >
            <div className="flex flex-row gap-x-[5px]">
              {icon}
              <p className="my-auto text-instillGrey90 text-instill-body">
                {instances ? instances.length : 0}
              </p>
            </div>
            <InstanceInnerList
              items={instances}
              enableItemBgColor={true}
              indicator="state"
              listItemsContainerWidth={widthInNumber}
              textStyle="text-instill-small"
            />
          </div>
        </CellBase>
      )}
    </>
  );
};
