"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const TIFFFile = React.forwardRef<
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
        d="M13.7168 27.1661V32.2331H12.3488V27.1661H10.6478V25.9511H15.4178V27.1661H13.7168ZM16.0755 32.2331V31.1441H16.8855V27.0401H16.0755V25.9511H19.0635V27.0401H18.2535V31.1441H19.0635V32.2331H16.0755ZM20.2033 32.2331V25.9511H24.3703V27.1661H21.5713V28.4531H23.9563V29.6591H21.5713V32.2331H20.2033ZM25.4679 32.2331V25.9511H29.6349V27.1661H26.8359V28.4531H29.2209V29.6591H26.8359V32.2331H25.4679Z"
        fill="white"
      />
    </IconBase>
  );
});
TIFFFile.displayName = "IconTIFFFile";
