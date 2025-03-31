"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Logout03 = React.forwardRef<
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
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 17.0001L21 12.0001M21 12.0001L16 7.00006M21 12.0001H9M12 17.0001C12 17.2956 12 17.4434 11.989 17.5715C11.8748 18.902 10.8949 19.9969 9.58503 20.2573C9.45903 20.2824 9.31202 20.2987 9.01835 20.3314L7.99694 20.4448C6.46248 20.6153 5.69521 20.7006 5.08566 20.5055C4.27293 20.2455 3.60942 19.6516 3.26118 18.8725C3 18.2883 3 17.5163 3 15.9724V8.02776C3 6.48383 3 5.71186 3.26118 5.12758C3.60942 4.34854 4.27293 3.75467 5.08566 3.49459C5.69521 3.29953 6.46246 3.38478 7.99694 3.55528L9.01835 3.66877C9.31212 3.70141 9.45901 3.71773 9.58503 3.74279C10.8949 4.00322 11.8748 5.0981 11.989 6.42867C12 6.5567 12 6.70449 12 7.00006"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconBase>
  );
});
Logout03.displayName = "IconLogout03";
