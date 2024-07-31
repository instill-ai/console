"use client";

import * as React from "react";

import { IconBase, IconBaseProps } from "./IconBase";

export const Star06 = React.forwardRef<
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
        d="M3.75033 18.8334V14.6667M3.75033 6.33341V2.16675M1.66699 4.25008H5.83366M1.66699 16.7501H5.83366M10.8337 3.00008L9.38851 6.75747C9.1535 7.36849 9.036 7.674 8.85327 7.93099C8.69132 8.15875 8.49232 8.35774 8.26456 8.51969C8.00758 8.70242 7.70207 8.81992 7.09104 9.05493L3.33366 10.5001L7.09104 11.9452C7.70207 12.1802 8.00758 12.2977 8.26456 12.4805C8.49232 12.6424 8.69132 12.8414 8.85327 13.0692C9.036 13.3262 9.1535 13.6317 9.38851 14.2427L10.8337 18.0001L12.2788 14.2427C12.5138 13.6317 12.6313 13.3262 12.8141 13.0692C12.976 12.8414 13.175 12.6424 13.4028 12.4805C13.6597 12.2977 13.9652 12.1802 14.5763 11.9452L18.3337 10.5001L14.5763 9.05493C13.9652 8.81992 13.6597 8.70242 13.4028 8.51969C13.175 8.35774 12.976 8.15875 12.8141 7.93099C12.6313 7.674 12.5138 7.36849 12.2788 6.75747L10.8337 3.00008Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
Star06.displayName = "IconStar06";
