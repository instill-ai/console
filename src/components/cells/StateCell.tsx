import { Nullable, ResourceState, StateIcon } from "@instill-ai/toolkit";
import cn from "clsx";
import Link from "next/link";

export type StateCellProps = {
  state: ResourceState;
  width: Nullable<string>;
  name: string | number;
  padding: string;
};

export const StateCell = ({ state, width, name, padding }: StateCellProps) => {
  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        <div className="min-h-8 min-w-8 flex">
          <StateIcon
            state={state}
            width="w-[18px]"
            height="h-[18px]"
            position="m-auto"
          />
        </div>
        <div className="w-4/5">
          <h3 className="truncate text-instill-h3 hover:underline">{name}</h3>
        </div>
      </div>
    </td>
  );
};
