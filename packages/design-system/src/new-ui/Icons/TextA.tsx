"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const TextA = React.forwardRef<
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
        d="M19.2428 16H6.64281L3.94281 22L12.9428 2L21.9428 22"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
TextA.displayName = "IconTextA";
