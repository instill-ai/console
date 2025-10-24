"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const ListOrdered = React.forwardRef<
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
        d="M21,12L8.979,12M4.996,9.989L4.987,5L2.99,7M3,16C3,15.448 3.448,15 4,15C4.552,15 5,15.448 5,16L3.026,18.959L5,19M21,6C21,6 9.093,5.994 9,6M21,18L8.957,18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});

ListOrdered.displayName = "IconListOrdered";
