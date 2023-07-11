import React from "react";
import cn from "clsx";
import { Icons } from "@instill-ai/design-system";
import { getColor } from "@/lib/dashboard";

type BadgeProps = {
  statusname: string;
  change: number;
};

export const Badge = (props: BadgeProps) => {
  const { statusname, change } = props;
  const badgeColor = getColor(statusname);

  return (
    <div className="BadgeWrap inline-flex flex-col items-start justify-start pb-2">
      <div
        className={cn(
          `Tags inline-flex h-5 w-auto items-center justify-start gap-1 rounded-[100px] px-2 py-0.5 ${badgeColor.bgColor}`
        )}
      >
        {change > 0 ? (
          <Icons.ArrowUp className={cn(`h-4 w-4 stroke-${badgeColor.icon}`)} />
        ) : (
          <Icons.ArrowDown
            className={cn(`h-4 w-4 stroke-${badgeColor.icon}`)}
          />
        )}

        <div
          className={cn(
            `Label text-[12px] font-medium leading-none ${badgeColor.textColor}`
          )}
        >
          {change}%
        </div>
      </div>
    </div>
  );
};
