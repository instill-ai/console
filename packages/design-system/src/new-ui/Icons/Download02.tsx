"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const Download02 = React.forwardRef<
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
        d="M19 19H1M16 9L10 15M10 15L4 9M10 15V1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Download02.displayName = "Download02";
