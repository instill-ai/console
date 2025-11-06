"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const AIFFFile = React.forwardRef<
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
        fill="#BB2532"
      />
      <path
        opacity="0.3"
        d="M24.2666 0L36.3999 12.1216H28.2666C26.0575 12.1216 24.2666 10.3308 24.2666 8.12162V0Z"
        fill="white"
      />
      <path
        d="M14.4976 32.2331L14.0476 30.7391H11.9506L11.5006 32.2331H10.1146L12.1846 25.9511H13.8766L15.9196 32.2331H14.4976ZM13.0126 27.1931H12.9676L12.2746 29.5781H13.7146L13.0126 27.1931ZM16.5457 32.2331V31.1441H17.3557V27.0401H16.5457V25.9511H19.5337V27.0401H18.7237V31.1441H19.5337V32.2331H16.5457ZM20.6735 32.2331V25.9511H24.8405V27.1661H22.0415V28.4531H24.4265V29.6591H22.0415V32.2331H20.6735ZM25.9382 32.2331V25.9511H30.1052V27.1661H27.3062V28.4531H29.6912V29.6591H27.3062V32.2331H25.9382Z"
        fill="white"
      />
    </IconBase>
  );
});
AIFFFile.displayName = "IconAIFFFile";
