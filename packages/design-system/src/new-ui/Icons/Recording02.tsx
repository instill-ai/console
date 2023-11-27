import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const Recording02 = React.forwardRef<
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
        d="M3 10L3 14M7.5 11V13M12 6V18M16.5 3V21M21 10V14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Recording02.displayName = "IconRecording02";
