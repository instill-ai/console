"use client";

import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const TwitterLight = React.forwardRef<
  SVGSVGElement,
  Omit<LogoBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <LogoBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 60 60"
      className={className}
    >
      <g clipPath="url(#clip0_924_29)">
        <path
          d="M35.6278 25.3929L57.4727 0H52.2961L33.3283 22.0483L18.1787 0H0.705444L23.6146 33.3409L0.705444 59.9692H5.88227L25.9128 36.6855L41.9119 59.9692H59.3851L35.6266 25.3929H35.6278ZM28.5375 33.6346L26.2163 30.3146L7.74755 3.89704H15.6988L30.6033 25.2169L32.9245 28.5369L52.2986 56.2494H44.3473L28.5375 33.6359V33.6346Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_924_29">
          <rect
            width="58.6797"
            height="60"
            fill="white"
            transform="translate(0.705444)"
          />
        </clipPath>
      </defs>
    </LogoBase>
  );
});
TwitterLight.displayName = "TwitterLight";
