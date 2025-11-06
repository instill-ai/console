"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const AVIFFile = React.forwardRef<
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
        d="M14.4449 32.2331L13.9949 30.7391H11.8979L11.4479 32.2331H10.0619L12.1319 25.9511H13.8239L15.8669 32.2331H14.4449ZM12.9599 27.1931H12.9149L12.2219 29.5781H13.6619L12.9599 27.1931ZM17.7106 32.2331L15.6856 25.9511H17.0716L18.0076 28.9661L18.5026 30.9371H18.5296L19.0066 28.9661L19.9426 25.9511H21.2836L19.2406 32.2331H17.7106ZM21.8631 32.2331V31.1441H22.6731V27.0401H21.8631V25.9511H24.8511V27.0401H24.0411V31.1441H24.8511V32.2331H21.8631ZM25.9909 32.2331V25.9511H30.1579V27.1661H27.3589V28.4531H29.7439V29.6591H27.3589V32.2331H25.9909Z"
        fill="white"
      />
    </IconBase>
  );
});
AVIFFile.displayName = "IconAVIFFile";
