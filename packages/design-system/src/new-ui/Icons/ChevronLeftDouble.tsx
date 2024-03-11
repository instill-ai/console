"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ChevronLeftDouble = React.forwardRef<
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
        d="M18 17L13 12L18 7M11 17L6 12L11 7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ChevronLeftDouble.displayName = "IconChevronLeftDouble";
