"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const LayersTwo01 = React.forwardRef<
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
        d="M2 14.5L11.6422 19.3211C11.7734 19.3867 11.839 19.4195 11.9078 19.4324C11.9687 19.4438 12.0313 19.4438 12.0922 19.4324C12.161 19.4195 12.2266 19.3867 12.3578 19.3211L22 14.5M2 9.5L11.6422 4.67889C11.7734 4.6133 11.839 4.5805 11.9078 4.5676C11.9687 4.55616 12.0313 4.55616 12.0922 4.5676C12.161 4.5805 12.2266 4.6133 12.3578 4.67889L22 9.5L12.3578 14.3211C12.2266 14.3867 12.161 14.4195 12.0922 14.4324C12.0313 14.4438 11.9687 14.4438 11.9078 14.4324C11.839 14.4195 11.7734 14.3867 11.6422 14.3211L2 9.5Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
LayersTwo01.displayName = "IconLayersTwo01";
