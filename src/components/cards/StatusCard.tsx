import cn from "clsx";
import React from "react";
import { State, Status } from "@/types";
import { Badge } from "../badge/Badge";
import { Icons } from "@instill-ai/design-system";

export type StatusProps = Status;

const getIcon = (change: number, state: State) => {
  const iconClassName =
    state === "completed"
      ? "stroke-semantic-success-default"
      : "stroke-semantic-error-default";

  if (change >= 0) {
    return <Icons.ArrowUp className={cn("h-4 w-4", iconClassName)} />;
  }
  return <Icons.ArrowUp className={cn("h-4 w-4", iconClassName)} />;
};

export const StatusCard = (props: StatusProps) => {
  const { state, amount, change } = props;
  return (
    <div className="inline-flex flex-col items-start justify-start gap-2 rounded-sm border border-slate-200 bg-white p-6 shadow">
      <div className="self-stretch text-[14px] font-medium leading-tight text-gray-800 text-opacity-80">
        {state === "completed" ? "Completed" : "Error"} Triggers
      </div>
      <div className="inline-flex items-end justify-start gap-4 self-stretch">
        <div className="shrink grow basis-0 text-[28px] font-bold leading-loose text-gray-800">
          {amount}
        </div>
        <Badge
          state={state}
          iconElement={getIcon(change, state)}
          label={`${change} %`}
          className="gap-x-2 border-0"
        />
      </div>
    </div>
  );
};
