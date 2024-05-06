"use client";

import cn from "clsx";
import * as React from "react";
import { Nullable } from "../../../type";

export const FieldRoot = ({
  fieldKey,
  title,
  children,
  className,
}: {
  fieldKey: string;
  title: Nullable<string>;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      key={fieldKey}
      className={cn(
        "flex w-full flex-col gap-y-2 rounded-[6px] bg-semantic-bg-alt-primary p-2",
        className
      )}
      data-testid={`output-${fieldKey}`}
    >
      <p className="text-semantic-fg-primary product-body-text-4-semibold">
        {title}
      </p>
      {children}
    </div>
  );
};
