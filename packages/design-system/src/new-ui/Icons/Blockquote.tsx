"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Blockquote = React.forwardRef<
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
        d="M16,10L7,10M20,6L7,6M20,14L7,14M3,5L3,19M16,18L7,18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});

Blockquote.displayName = "IconBlockquote";
