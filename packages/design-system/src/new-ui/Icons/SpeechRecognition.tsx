"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const SpeechRecognition = React.forwardRef<
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
        d="M3.875 11.753L3.875 14.8641M7.375 8.64193L7.375 17.9753M10.875 6.30859V20.3086M14.375 8.64193V17.9753M17.875 11.753V14.8641M16.125 5.61448L17.6635 7.15294L21.125 3.69141"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
SpeechRecognition.displayName = "IconSpeechRecognition";
