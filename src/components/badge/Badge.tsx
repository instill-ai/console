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
  console.log("change", change, change > 0);

  return (
    <div className="BadgeWrap inline-flex flex-col items-start justify-start pb-2">
      <div
        className={cn(
          `Tags inline-flex h-5 w-auto items-center justify-start gap-1 rounded-[100px] px-2 py-0.5 ${badgeColor.bgColor}`
        )}
      >
        {change > 0 ? (
          <svg
            width="15"
            height="15"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 19V5M12 5L5 12M12 5L19 12"
              stroke="red"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="15"
            height="15"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="green"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
