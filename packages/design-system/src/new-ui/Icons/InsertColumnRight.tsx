"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const InsertColumnRight = React.forwardRef<
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
        d="M2 12H13M13 12L9 16M13 12L9 8M22 6V18C22 18.9319 22 19.3978 21.8478 19.7654C21.6448 20.2554 21.2554 20.6448 20.7654 20.8478C20.3978 21 19.9319 21 19 21C18.0681 21 17.6022 21 17.2346 20.8478C16.7446 20.6448 16.3552 20.2554 16.1522 19.7654C16 19.3978 16 18.9319 16 18V6C16 5.06812 16 4.60218 16.1522 4.23463C16.3552 3.74458 16.7446 3.35523 17.2346 3.15224C17.6022 3 18.0681 3 19 3C19.9319 3 20.3978 3 20.7654 3.15224C21.2554 3.35523 21.6448 3.74458 21.8478 4.23463C22 4.60218 22 5.06812 22 6Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
InsertColumnRight.displayName = "IconInsertColumnRight";
