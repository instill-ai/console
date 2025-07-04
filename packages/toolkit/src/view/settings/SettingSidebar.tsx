"use client";

import * as React from "react";
import Link from "next/link";
import cn from "clsx";

export const SettingSidebarRoot = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col h-[calc(100vh-var(--topbar-controller-height)-var(--topbar-nav-height)-var(--setting-container-padding-top)-var(--setting-container-padding-bottom))]">
      <div className="flex flex-col gap-y-1 mb-auto">{children}</div>
    </div>
  );
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
        className,
      )}
    >
      <div className="flex flex-row items-center space-x-3">
        {icon}
        <h4
          className={cn(
            "text-semantic-fg-primary product-body-text-2-semibold",
            highlighted
              ? "text-semantic-accent-default"
              : "text-semantic-fg-secondary",
          )}
        >
          {name}
        </h4>
      </div>
    </Link>
  );
};
