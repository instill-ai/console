import cn from "clsx";
import * as React from "react";
import { Nullable } from "../../../type";

export const FieldRoot = ({
  key,
  title,
  children,
  className,
}: {
  key: string;
  title: Nullable<string>;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      key={key}
      className={cn(
        "flex w-full flex-col gap-y-2 rounded-[6px] bg-semantic-bg-primary p-2",
        className
      )}
    >
      <p className="text-semantic-fg-primary product-body-text-4-semibold">
        {title}
      </p>
      {children}
    </div>
  );
};
