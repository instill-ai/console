"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const ClockPlus = React.forwardRef<
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
      <g clipPath="url(#clip0_882_1714)">
        <path
          d="M14.6138 8.84337C14.6486 8.56717 14.6666 8.2857 14.6666 8.00004C14.6666 4.31814 11.6818 1.33337 7.99992 1.33337C4.31802 1.33337 1.33325 4.31814 1.33325 8.00004C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667C8.29019 14.6667 8.57612 14.6482 8.85661 14.6122M7.99992 4.00004V8.00004L10.4922 9.24617M12.6666 14.6667V10.6667M10.6666 12.6667H14.6666"
          strokeOpacity="0.65"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_882_1714">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </IconBase>
  );
});
ClockPlus.displayName = "IconClockPlus";
