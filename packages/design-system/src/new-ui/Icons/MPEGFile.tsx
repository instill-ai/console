"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const MPEGFile = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 41 41"
      className={className}
    >
      <path
        d="M4.04443 4C4.04443 1.79086 5.83529 0 8.04443 0H24.2667L36.4 12.1216V36.4054C36.4 38.6145 34.6091 40.4054 32.4 40.4054H8.04443C5.8353 40.4054 4.04443 38.6145 4.04443 36.4054V4Z"
        fill="#1D2433"
      />
      <path
        opacity="0.3"
        d="M24.2666 0L36.3999 12.1216H28.2666C26.0575 12.1216 24.2666 10.3308 24.2666 8.12162V0Z"
        fill="white"
      />
      <path
        d="M17.0772 32.2331L16.6272 30.7391H14.5302L14.0802 32.2331H12.6942L14.7642 25.9511H16.4562L18.4992 32.2331H17.0772ZM15.5922 27.1931H15.5472L14.8542 29.5781H16.2942L15.5922 27.1931ZM20.3429 32.2331L18.3179 25.9511H19.7039L20.6399 28.9661L21.1349 30.9371H21.1619L21.6389 28.9661L22.5749 25.9511H23.9159L21.8729 32.2331H20.3429ZM24.4955 32.2331V31.1441H25.3055V27.0401H24.4955V25.9511H27.4835V27.0401H26.6735V31.1441H27.4835V32.2331H24.4955Z"
        fill="white"
      />
    </IconBase>
  );
});
MPEGFile.displayName = "IconMPEGFile";
