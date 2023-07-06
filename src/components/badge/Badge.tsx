import React from "react";
import cn from "clsx";
import { Icons } from "@instill-ai/design-system";

type BadgeProps = {
  statusname: string;
  changes?: number;
};

const getColor = (statusname: string) => {
  switch (statusname) {
    case "completed":
      return {
        bgColor: "bg-emerald-50",
        color: "text-teal-700",
      };

    case "errored":
      return {
        bgColor: "bg-red-50",
        color: "text-rose-700",
      };
    default:
      return {
        bgColor: "bg-slate-200",
        color: "text-slate-700",
      };
  }
};

export const Badge = (props: BadgeProps) => {
  const { statusname, changes } = props;
  const badgeColor = getColor(statusname);
  return (
    <div className="BadgeWrap inline-flex flex-col items-start justify-start pb-2">
      <div
        className={cn(
          `Tags inline-flex h-5 w-14 items-center justify-start gap-1 rounded-[100px] px-2 py-0.5 ${badgeColor.bgColor}`
        )}
      >
        <div className="ArrowNarrowDown relative h-2.5 w-2.5"></div>
        <div
          className={cn(
            `Label text-[12px] font-medium leading-none ${badgeColor.color}`
          )}
        >
          {changes}%
        </div>
      </div>
    </div>
  );
};
