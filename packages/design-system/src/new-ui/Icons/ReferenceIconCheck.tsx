"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ReferenceIconCheck = React.forwardRef<
  SVGSVGElement,
  Omit<IconBaseProps, "viewBox" | "children">
>((props, ref) => {
  const { className, ...passThrough } = props;
  return (
    <IconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 51 26"
      className={className}
    >
      <path
        d="M9.14305 3.4H11.5431C14.194 3.4 16.3431 5.54903 16.3431 8.2M9.14305 3.4H6.74305C4.09209 3.4 1.94305 5.54903 1.94305 8.2C1.94305 10.851 4.09209 13 6.74305 13H9.14305M9.14305 3.4V1M9.14305 3.4V13M9.14305 13H11.5431C14.194 13 16.3431 15.149 16.3431 17.8C16.3431 20.451 14.194 22.6 11.5431 22.6H9.14305M9.14305 13V22.6M9.14305 22.6H6.74305C4.09209 22.6 1.94305 20.451 1.94305 17.8M9.14305 22.6V25M45.828 22.6C47.3424 22.6 48.5712 21.3724 48.5712 19.8568V14.3716L49.9428 13L48.5712 11.6284V6.1432C48.5712 4.6276 47.3436 3.4 45.828 3.4M30.0579 3.4C28.5423 3.4 27.3147 4.6276 27.3147 6.1432V11.6284L25.9431 13L27.3147 14.3716V19.8568C27.3147 21.3724 28.5423 22.6 30.0579 22.6M32.5431 13L35.4642 15.9212C35.7018 16.1588 35.8206 16.2776 35.9576 16.3221C36.0782 16.3613 36.208 16.3613 36.3285 16.3221C36.4655 16.2776 36.5843 16.1588 36.8219 15.9212L43.3431 9.4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ReferenceIconCheck.displayName = "IconReferenceIconCheck";
