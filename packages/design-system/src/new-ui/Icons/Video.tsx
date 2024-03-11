"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const Video = React.forwardRef<
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
        d="M16 4.8L12 8L8 4.8M7.84 19.2H16.16C17.5041 19.2 18.1762 19.2 18.6896 18.9384C19.1412 18.7083 19.5083 18.3412 19.7384 17.8896C20 17.3762 20 16.7041 20 15.36V11.84C20 10.4959 20 9.82381 19.7384 9.31043C19.5083 8.85884 19.1412 8.49168 18.6896 8.26159C18.1762 8 17.5041 8 16.16 8H7.84C6.49587 8 5.82381 8 5.31042 8.26159C4.85883 8.49168 4.49168 8.85884 4.26158 9.31043C4 9.82381 4 10.4959 4 11.84V15.36C4 16.7041 4 17.3762 4.26158 17.8896C4.49168 18.3412 4.85883 18.7083 5.31042 18.9384C5.82381 19.2 6.49587 19.2 7.84 19.2Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Video.displayName = "IconVideo";
