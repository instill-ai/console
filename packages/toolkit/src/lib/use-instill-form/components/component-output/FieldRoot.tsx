import cn from "clsx";
import * as React from "react";
import { Nullable } from "../../../type";

export const ConnectorNodeFieldRoot = ({
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
        "nodrag flex w-full max-w-[calc(var(--pipeline-builder-node-available-width)-var(--pipeline-builder-node-padding-x))] flex-row flex-wrap gap-y-2 rounded-[6px] bg-semantic-bg-primary p-2",
        className
      )}
    >
      <p className="text-semantic-fg-secondary product-body-text-4-semibold">
        {title}
      </p>
      {children}
    </div>
  );
};

export const EndNodeFieldRoot = ({
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
        "nodrag flex w-full flex-col gap-y-2 rounded-[6px] bg-semantic-bg-primary p-2",
        className
      )}
    >
      <p className="text-semantic-fg-primary product-body-text-3-semibold">
        {title}
      </p>
      {children}
    </div>
  );
};
