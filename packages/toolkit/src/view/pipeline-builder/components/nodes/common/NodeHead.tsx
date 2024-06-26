"use client";

import * as React from "react";
import cn from "clsx";

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
