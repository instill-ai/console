"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const CodeSnippet01 = React.forwardRef<
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
        d="M16 18L22 12L16 6M8 6L2 12L8 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
CodeSnippet01.displayName = "IconCodeSnippet01";
