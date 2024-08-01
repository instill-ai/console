"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const ThumbsDown = React.forwardRef<
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
        d="M17 2V13M22 9.8V5.2C22 4.07989 22 3.51984 21.782 3.09202C21.5903 2.71569 21.2843 2.40973 20.908 2.21799C20.4801 2 19.9201 2 18.8 2H8.118C6.65652 2 5.92578 2 5.33557 2.26743C4.81539 2.50314 4.37329 2.88242 4.06123 3.36072C3.70716 3.90339 3.59605 4.62564 3.37382 6.07012L2.85074 9.47012C2.55764 11.3753 2.41108 12.3279 2.6938 13.0691C2.94193 13.7197 3.40864 14.2637 4.01391 14.6079C4.70352 15 5.66732 15 7.59493 15H8.39999C8.96004 15 9.24007 15 9.45398 15.109C9.64214 15.2049 9.79512 15.3578 9.891 15.546C9.99999 15.7599 9.99999 16.0399 9.99999 16.6V19.5342C9.99999 20.896 11.104 22 12.4658 22C12.7907 22 13.085 21.8087 13.2169 21.5119L16.5777 13.9502C16.7305 13.6062 16.807 13.4343 16.9278 13.3082C17.0346 13.1967 17.1657 13.1115 17.3109 13.0592C17.4752 13 17.6634 13 18.0398 13H18.8C19.9201 13 20.4801 13 20.908 12.782C21.2843 12.5903 21.5903 12.2843 21.782 11.908C22 11.4802 22 10.9201 22 9.8Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ThumbsDown.displayName = "IconThumbsDown";
