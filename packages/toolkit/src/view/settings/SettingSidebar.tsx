"use client";

import * as React from "react";
import cn from "clsx";
import Link from "next/link";

export const SettingSidebarRoot = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex flex-col gap-y-1">{children}</div>;
};

export const SettingSidebarItem = ({
  highlighted,
  href,
  name,
  className,
  icon,
}: {
  highlighted: boolean;
  name: string;
  href: string;
  className?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-40 flex-row items-center rounded px-3 py-[9px] hover:bg-semantic-accent-bg",
        highlighted ? "bg-semantic-accent-bg" : "",
        className
      )}
    >
      <div className="flex flex-row items-center space-x-3">
        {icon}
        <h4
          className={cn(
            "text-semantic-fg-primary product-body-text-2-semibold",
            highlighted
              ? "text-semantic-accent-default"
              : "text-semantic-fg-secondary"
          )}
        >
          {name}
        </h4>
      </div>
    </Link>
  );
};
