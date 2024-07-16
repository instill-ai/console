import React from "react";

import { cn } from "@instill-ai/design-system";

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
        "min-w-full rounded py-2.5 text-lg font-medium leading-snug text-black",
        className,
      )}
    >
      {children}
    </h2>
  );
};
