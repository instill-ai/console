"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const FastForward = React.forwardRef<
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
        d="M13 16.437C13 17.5671 13 18.1321 13.2283 18.4091C13.4266 18.6497 13.7258 18.7841 14.0374 18.7725C14.3961 18.759 14.8184 18.3837 15.663 17.6329L20.6547 13.1959C21.12 12.7823 21.3526 12.5755 21.4383 12.3313C21.5136 12.1168 21.5136 11.8832 21.4383 11.6687C21.3526 11.4245 21.12 11.2177 20.6547 10.8041L15.663 6.36709C14.8184 5.61634 14.3961 5.24096 14.0374 5.22754C13.7258 5.21588 13.4266 5.35024 13.2283 5.59089C13 5.8679 13 6.43291 13 7.56295V16.437Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 16.437C2 17.5671 2 18.1321 2.22827 18.4091C2.42657 18.6497 2.72579 18.7841 3.0374 18.7725C3.39609 18.759 3.81839 18.3837 4.66298 17.6329L9.65466 13.1959C10.12 12.7823 10.3526 12.5755 10.4383 12.3313C10.5136 12.1168 10.5136 11.8832 10.4383 11.6687C10.3526 11.4245 10.12 11.2177 9.65466 10.8041L4.66298 6.36709C3.81839 5.61634 3.39609 5.24096 3.0374 5.22754C2.72579 5.21588 2.42657 5.35024 2.22827 5.59089C2 5.8679 2 6.43291 2 7.56295V16.437Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
FastForward.displayName = "FastForward";
