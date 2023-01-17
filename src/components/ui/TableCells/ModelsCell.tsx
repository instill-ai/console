import { FC, memo } from "react";
import cn from "clsx";
import { ModelInstanceIcon } from "@instill-ai/design-system";
import { groupBy } from "@/utils/arrayUtils";
import { CellBaseProps, CellBase } from "./CellBase";
import { ModelInstance, ModelState } from "@/lib/instill";

export type ModelsCellProps = CellBaseProps & {
  modelInstances: ModelInstance[];
  width: string;
};

export const ModelsCell: FC<ModelsCellProps> = ({
  padding,
  width,
  modelInstances,
}) => {
  const groupByModel = groupBy(modelInstances, (i) => {
    const modelInstanceNameList = i.name.split("/");
    return modelInstanceNameList[1];
  });

  const getStateTextColor = (state: ModelState) => {
    switch (state) {
      case "STATE_ERROR": {
        return "text-instillRed";
      }
      case "STATE_OFFLINE": {
        return "text-instillGrey70";
      }
      default: {
        return "text-instillGreen50";
      }
    }
  };

  return (
    <CellBase padding={padding}>
      <div className={cn("flex flex-col gap-y-4", width)}>
        {Object.entries(groupByModel).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-y-2">
            <div className="flex flex-row gap-x-1">
              <ModelInstanceIcon
                width="w-[30px]"
                height="h-[30px]"
                color="fill-black"
                position="my-auto"
              />
              <p className="my-auto text-instillGrey70 text-instill-small">
                {key}
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              {value.map((e) => (
                <div
                  key={e.id}
                  className={cn(
                    "text-instill-body",
                    getStateTextColor(e.state)
                  )}
                >{`${key}/${e.id}`}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CellBase>
  );
};
