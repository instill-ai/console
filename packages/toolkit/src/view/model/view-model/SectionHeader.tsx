import React from "react";
import cn from "clsx";

export const ModelSectionHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "min-w-full rounded bg-semantic-bg-base-bg px-3 py-2.5 text-lg font-medium text-black",
        className
      )}
    >
      {children}
    </h2>
  );
};
