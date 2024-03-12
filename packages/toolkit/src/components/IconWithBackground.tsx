"use client";

import * as React from "react";
import cn from "clsx";

type IconWithBackgroundProps = {
  iconElement: React.ReactElement;
  className: string;
};

function IconWithBackground({
  iconElement,
  className,
}: IconWithBackgroundProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg p-2",
        className
      )}
    >
      {iconElement}
    </div>
  );
}

export { IconWithBackground };
