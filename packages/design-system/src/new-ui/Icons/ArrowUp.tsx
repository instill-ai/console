"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ArrowUp = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="M12 19V5M12 5L5 12M12 5L19 12"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ArrowUp.displayName = "IconArrowUp";
