"use client";

import { Handle, HandleProps } from "reactflow";

import { cn } from "@instill-ai/design-system";

export type CustomHandleProps = HandleProps & {
  className?: string;
  wrapperClassName?: string;
};

export const CustomHandle = (props: CustomHandleProps) => {
  const { className, wrapperClassName, ...passThrough } = props;

  return (
    <div
      className={cn(
        "absolute top-1/2",
        passThrough.type === "target"
          ? "left-0 -translate-x-1/2"
          : "right-0 translate-x-1/2",
        wrapperClassName,
      )}
    >
      <Handle
        {...passThrough}
        className={cn(
          "!static !flex !h-4 !w-4 !bg-semantic-bg-primary !border-[4px] !border-semantic-fg-primary",
          // isSelected ? "!border-semantic-accent-default" : "!border-[#94A0B8]",
          className,
        )}
        isConnectable={false}
      />
    </div>
  );
};
