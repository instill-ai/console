"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const MKVFile = React.forwardRef<
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
        d="M13.2951 32.2331V25.9511H17.4621V27.1661H14.6631V28.4531H17.0481V29.6591H14.6631V32.2331H13.2951ZM18.5597 32.2331V25.9511H19.9277V31.0181H22.3217V32.2331H18.5597ZM24.1398 32.2331L22.1148 25.9511H23.5008L24.4368 28.9661L24.9318 30.9371H24.9588L25.4358 28.9661L26.3718 25.9511H27.7128L25.6698 32.2331H24.1398Z"
        fill="white"
      />
    </IconBase>
  );
});
MKVFile.displayName = "IconMKVFile";
