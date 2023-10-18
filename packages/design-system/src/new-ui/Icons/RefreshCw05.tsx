import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const RefreshCw05 = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 25 25"
      className={className}
    >
      <path
        d="M20.453 12.8932C20.1752 15.5031 18.6964 17.9488 16.2494 19.3616C12.1839 21.7088 6.98539 20.3158 4.63818 16.2503L4.38818 15.8173M3.54613 11.1071C3.82393 8.49723 5.30272 6.05151 7.74971 4.63874C11.8152 2.29153 17.0137 3.68447 19.3609 7.74995L19.6109 8.18297M3.49316 18.0662L4.22521 15.3341L6.95727 16.0662M17.0424 7.93413L19.7744 8.66618L20.5065 5.93413"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
RefreshCw05.displayName = "IconRefreshCw05";
