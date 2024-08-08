"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Minimize01 = React.forwardRef<
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
        d="M4 14H10M10 14V20M10 14L3 21M20 10H14M14 10V4M14 10L21 3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Minimize01.displayName = "IconMinimize01";
