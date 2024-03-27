"use client";

import cn from "clsx";
import * as React from "react";

export const NodeHead = ({
  nodeIsCollapsed,
  children,
}: {
  nodeIsCollapsed: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("flex w-full flex-row", { "mb-6": !nodeIsCollapsed })}>
      {children}
    </div>
  );
};
