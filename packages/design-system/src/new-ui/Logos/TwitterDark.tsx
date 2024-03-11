"use client";

import * as React from "react";
import { LogoBase, LogoBaseProps } from "./LogoBase";

export const TwitterDark = React.forwardRef<
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
      <g clipPath="url(#clip0_924_28)">
        <path
          d="M35.5373 25.3929L57.3821 0H52.2056L33.2377 22.0483L18.0881 0H0.614868L23.524 33.3409L0.614868 59.9692H5.79169L25.8222 36.6855L41.8213 59.9692H59.2946L35.536 25.3929H35.5373ZM28.4469 33.6346L26.1257 30.3146L7.65697 3.89704H15.6083L30.5128 25.2169L32.8339 28.5369L52.208 56.2494H44.2567L28.4469 33.6359V33.6346Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_924_28">
          <rect
            width="58.6797"
            height="60"
            fill="white"
            transform="translate(0.614868)"
          />
        </clipPath>
      </defs>
    </LogoBase>
  );
});
TwitterDark.displayName = "TwitterDark";
