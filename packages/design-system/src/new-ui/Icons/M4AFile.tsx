"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const M4AFile = React.forwardRef<
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
        d="M16.1474 28.1111H16.1204L15.6614 29.0291L14.4374 31.2521L13.2404 29.0381L12.7634 28.0481H12.7364V32.2331H11.4494V25.9511H12.8984L14.4374 28.8941H14.4554L15.9764 25.9511H17.4344V32.2331H16.1474V28.1111ZM21.1634 32.2331V31.0271H18.4004V29.8751L20.8484 25.9511H22.4504V29.9831H23.2424V31.0271H22.4504V32.2331H21.1634ZM19.4804 29.9831H21.1634V27.3461H21.0734L19.4804 29.9831ZM28.0899 32.2331L27.6399 30.7391H25.5429L25.0929 32.2331H23.7069L25.7769 25.9511H27.4689L29.5119 32.2331H28.0899ZM26.6049 27.1931H26.5599L25.8669 29.5781H27.3069L26.6049 27.1931Z"
        fill="white"
      />
    </IconBase>
  );
});
M4AFile.displayName = "IconM4AFile";
