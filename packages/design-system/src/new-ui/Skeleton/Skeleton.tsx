"use client";

import { cn } from "../../utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-semantic-bg-secondary", className)}
      {...props}
    />
  );
}

export { Skeleton };
