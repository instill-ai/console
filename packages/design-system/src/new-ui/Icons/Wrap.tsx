"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Wrap = React.forwardRef<
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
        d="M3 15L16.5 15C18.9853 15 21 12.9853 21 10.5C21 8.01472 18.9853 6 16.5 6L12 6M3 15L7 19M3 15L7 11"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Wrap.displayName = "IconWrap";
