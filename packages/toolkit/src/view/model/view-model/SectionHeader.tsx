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
        "min-w-full rounded bg-semantic-bg-base-bg px-3 py-2.5 text-lg font-medium leading-snug text-black",
        className
      )}
      // TODO: temporary solution while Tailwind stuff is not working
      style={{ lineHeight: 1.375 }}
    >
      {children}
    </h2>
  );
};
