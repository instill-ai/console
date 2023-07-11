import { getColor } from "@/lib/dashboard";
import { Nullable, ResourceState, StateIcon } from "@instill-ai/toolkit";
import cn from "clsx";

export type StateCellProps = {
  state: ResourceState;
  width: Nullable<string>;
  name: string | number;
  padding: string;
};

export const StateCell = ({ state, width, name, padding }: StateCellProps) => {
  const badgeColor = getColor(state);
  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        <div className="flex">
          <div
            className={cn(
              `Tags inline-flex h-5 items-center justify-start gap-1 rounded-[100px] ${badgeColor.bgColor} px-2 py-0.5`
            )}
          >
            <div
              className={cn(
                `Label text-[12px] font-medium leading-none ${badgeColor.textColor}`
              )}
            >
              {badgeColor.stateLabelName}
            </div>
          </div>
        </div>
      </div>
    </td>
  );
};
