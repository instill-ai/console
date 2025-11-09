"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Unwrap = React.forwardRef<
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
        d="M21 21V3M3 12H17M17 12L10 5M17 12L10 19"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Unwrap.displayName = "IconUnwrap";
