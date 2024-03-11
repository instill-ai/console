"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ArrowUpRight = React.forwardRef<
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
        d="M7 17L17 7M17 7H7M17 7V17"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ArrowUpRight.displayName = "IconArrowUpRight";
