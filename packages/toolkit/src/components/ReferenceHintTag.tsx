import cn from "clsx";
import * as React from "react";
import { Icons } from "@instill-ai/design-system";

export const ReferenceHintTagRoot = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex h-5 flex-row items-center gap-x-1 rounded-full bg-semantic-accent-bg px-2 py-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ReferenceHintTagIcon = ({
  type,
  className,
}: {
  type: "x" | "check";
  className?: string;
}) => {
  return type === "x" ? (
    <Icons.ReferenceIconX
      className={cn("h-[9px] w-[18px] stroke-semantic-fg-secondary", className)}
    />
  ) : (
    <Icons.ReferenceIconCheck
      className={cn(
        "h-[9px] w-[18px] stroke-semantic-accent-default",
        className
      )}
    />
  );
};
export const ReferenceHintTagLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("font-sans text-[11px] font-medium", className)}>
      {children}
    </p>
  );
};

export const ReferenceHintTag = {
  Root: ReferenceHintTagRoot,
  Icon: ReferenceHintTagIcon,
  Label: ReferenceHintTagLabel,
};
