"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Italic = React.forwardRef<
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
        d="M19 4H10M14 20H5M15 4L9 20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});

Italic.displayName = "IconItalic";
