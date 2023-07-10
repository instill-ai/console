import React from "react";
import { Status } from "@/types";
import { Badge } from "../badge/Badge";

export type StatusProps = Status;

export const StatusCard = (props: StatusProps) => {
  const { statusname, amount, change } = props;
  return (
    <div className="MetricItem inline-flex flex-col items-start justify-start gap-2 rounded-sm border border-slate-200 bg-white p-6 shadow">
      <div className="Heading self-stretch text-[14px] font-medium leading-tight text-gray-800 text-opacity-80">
        {statusname === "completed" ? "Completed" : "Error"} Triggers
      </div>
      <div className="NumberAndBadge inline-flex items-end justify-start gap-4 self-stretch">
        <div className="Number shrink grow basis-0 text-[28px] font-bold leading-loose text-gray-800">
          {amount}
        </div>
        <Badge statusname={statusname} change={change} />
      </div>
    </div>
  );
};
