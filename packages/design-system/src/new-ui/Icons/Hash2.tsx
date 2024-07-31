"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Hash2 = React.forwardRef<
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
      <path d="M3.95816 1.02417L2.70816 8.52417M7.29149 1.02417L6.04149 8.52417M8.5415 3.1075H1.45817M8.12484 6.44084H1.0415" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
});
Hash2.displayName = "IconHash2";
