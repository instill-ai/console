import { FC, memo } from "react";
import cn from "clsx";
import { ModelInstanceIcon } from "@instill-ai/design-system";

import { Model } from "@/services/model/ModelServices";
import { groupBy } from "@/utils/arrayUtils";
import CellBase, { CellBaseProps } from "../CellBase";

export type ModelsCellProps = CellBaseProps & {
  models: Model[];
  width: string;
};

const ModelsCell: FC<ModelsCellProps> = ({
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  width,
  models,
}) => {
  const groupByModel = groupBy(models, (i) => i.id);

  return (
    <CellBase
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
      paddingTop={paddingTop}
      paddingRight={paddingRight}
    >
      <div className={cn("flex flex-col gap-y-4", width)}>
        {Object.entries(groupByModel).map(([key, value], i) => (
          <div key={key} className="flex flex-col gap-y-2">
            <div className="flex flex-row gap-x-1">
              <ModelInstanceIcon
                width="w-5"
                height="h-5"
                color="fill-black"
                position="my-auto"
              />
              <p className="instill-text-small my-auto text-instillGrey70">
                {key}
              </p>
            </div>
            <div className="flex flex-col gap-y-1">
              {value.map((e) => (
                <div
                  key={e.id}
                  className="instill-text-body text-instillGrey90"
                >{`${e.id}/${e.instance}`}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CellBase>
  );
};

export default memo(ModelsCell);
