"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const AlighLeft = React.forwardRef<
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
        d="M16 10H3M20 6H3M20 14H3M16 18H3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
AlighLeft.displayName = "IconAlighLeft";
