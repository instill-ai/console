"use client";

import cn from "clsx";
import { Handle, HandleProps } from "reactflow";

export type OnFieldHandleProps = HandleProps & {
  className?: string;
};

export const OnFieldHandle = (props: OnFieldHandleProps) => {
  const { className, id, ...passThrough } = props;

  return (
    <Handle
      id={id}
      {...passThrough}
      className={cn(
        "absolute !h-3 !w-0.5 !rounded-none !border-0 !bg-semantic-accent-hover",
        className
      )}
    />
  );
};
