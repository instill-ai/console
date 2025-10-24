"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const ListTask = React.forwardRef<
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
        d="M21,18L13,18M8.996,4.989L4.987,9L2.99,7M8,14L3.012,14L3.026,18.959L8,19L8,14ZM21,5.998C21,5.998 13.048,5.997 13,6M12.979,12L21,12.042"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});

ListTask.displayName = "IconListTask";
