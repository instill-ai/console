"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const HEIFFile = React.forwardRef<
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
        fill="#316FED"
      />
      <path
        opacity="0.3"
        d="M24.2666 0L36.3999 12.1216H28.2666C26.0575 12.1216 24.2666 10.3308 24.2666 8.12162V0Z"
        fill="white"
      />
      <path
        d="M14.1128 29.6591H11.7188V32.2331H10.3508V25.9511H11.7188V28.4531H14.1128V25.9511H15.4808V32.2331H14.1128V29.6591ZM16.8635 32.2331V25.9511H21.1385V27.1661H18.2315V28.4531H20.7245V29.6591H18.2315V31.0181H21.1385V32.2331H16.8635ZM22.0872 32.2331V31.1441H22.8972V27.0401H22.0872V25.9511H25.0752V27.0401H24.2652V31.1441H25.0752V32.2331H22.0872ZM26.215 32.2331V25.9511H30.382V27.1661H27.583V28.4531H29.968V29.6591H27.583V32.2331H26.215Z"
        fill="white"
      />
    </IconBase>
  );
});
HEIFFile.displayName = "IconHEIFFile";
