"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const CodeSnippet02 = React.forwardRef<
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
        d="M17 17L22 12L17 7M7 7L2 12L7 17M14 3L10 21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
CodeSnippet02.displayName = "IconCodeSnippet02";
