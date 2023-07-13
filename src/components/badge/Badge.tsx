import React from "react";
import cn from "clsx";
import { Icons, Tag } from "@instill-ai/design-system";
import { getColor } from "@/lib/dashboard";

type BadgeProps = {
  statusname: string;
  change: number;
};

export const Badge = (props: BadgeProps) => {
  const { statusname, change } = props;
  const badgeColor = getColor(statusname);

  return (
    <Tag variant={badgeColor.variant} size="sm">
      {change > 0 ? (
        <Icons.ArrowUp
          className={cn(`h-3 w-3 stroke-${badgeColor.iconColor}`)}
        />
      ) : (
        <Icons.ArrowDown
          className={cn(`h-3 w-3 stroke-${badgeColor.iconColor}`)}
        />
      )}
      {change}%
    </Tag>
  );
};
