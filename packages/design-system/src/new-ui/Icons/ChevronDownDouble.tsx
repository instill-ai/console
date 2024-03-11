"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ChevronDownDouble = React.forwardRef<
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
        d="M7 13L12 18L17 13M7 6L12 11L17 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ChevronDownDouble.displayName = "IconChevronDownDouble";
