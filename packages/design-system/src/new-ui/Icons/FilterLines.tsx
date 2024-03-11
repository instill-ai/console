"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const FilterLines = React.forwardRef<
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
        d="M6 12H18M3 6H21M9 18H15"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
FilterLines.displayName = "IconFilterLines";
