"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const InsertColumnLeft = React.forwardRef<
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
        d="M22 12H11M11 12L15 16M11 12L15 8M2 6V18C2 18.9319 2 19.3978 2.15224 19.7654C2.35523 20.2554 2.74458 20.6448 3.23463 20.8478C3.60218 21 4.06812 21 5 21C5.93188 21 6.39782 21 6.76537 20.8478C7.25542 20.6448 7.64477 20.2554 7.84776 19.7654C8 19.3978 8 18.9319 8 18V6C8 5.06812 8 4.60218 7.84776 4.23463C7.64477 3.74458 7.25542 3.35523 6.76537 3.15224C6.39782 3 5.93188 3 5 3C4.06812 3 3.60218 3 3.23463 3.15224C2.74458 3.35523 2.35523 3.74458 2.15224 4.23463C2 4.60218 2 5.06812 2 6Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
InsertColumnLeft.displayName = "IconInsertColumnLeft";
