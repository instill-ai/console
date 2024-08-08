"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Browser = React.forwardRef<
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
      <path d="M18.3334 6.5H1.66675M1.66675 5.5L1.66675 12.5C1.66675 13.9001 1.66675 14.6002 1.93923 15.135C2.17892 15.6054 2.56137 15.9878 3.03177 16.2275C3.56655 16.5 4.26662 16.5 5.66675 16.5H14.3334C15.7335 16.5 16.4336 16.5 16.9684 16.2275C17.4388 15.9878 17.8212 15.6054 18.0609 15.135C18.3334 14.6002 18.3334 13.9001 18.3334 12.5V5.5C18.3334 4.09987 18.3334 3.3998 18.0609 2.86502C17.8212 2.39462 17.4388 2.01217 16.9684 1.77248C16.4336 1.5 15.7335 1.5 14.3334 1.5L5.66675 1.5C4.26662 1.5 3.56655 1.5 3.03177 1.77248C2.56137 2.01217 2.17892 2.39462 1.93923 2.86502C1.66675 3.3998 1.66675 4.09987 1.66675 5.5Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
});
Browser.displayName = "IconBrowser";
