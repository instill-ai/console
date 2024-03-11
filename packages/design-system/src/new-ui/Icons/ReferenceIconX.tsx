"use client";

import * as React from "react";
import { IconBase, IconBaseProps } from "./IconBase";

export const ReferenceIconX = React.forwardRef<
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
        d="M9.14305 3.40002H11.5431C14.194 3.40002 16.3431 5.54905 16.3431 8.20002M9.14305 3.40002H6.74305C4.09209 3.40002 1.94305 5.54905 1.94305 8.20002C1.94305 10.851 4.09209 13 6.74305 13H9.14305M9.14305 3.40002V1.00002M9.14305 3.40002V13M9.14305 13H11.5431C14.194 13 16.3431 15.149 16.3431 17.8C16.3431 20.451 14.194 22.6 11.5431 22.6H9.14305M9.14305 13V22.6M9.14305 22.6H6.74305C4.09209 22.6 1.94305 20.451 1.94305 17.8M9.14305 22.6V25M45.828 22.6C47.3424 22.6 48.5712 21.3724 48.5712 19.8568V14.3716L49.9428 13L48.5712 11.6284V6.14322C48.5712 4.62762 47.3436 3.40002 45.828 3.40002M30.0579 3.40002C28.5423 3.40002 27.3147 4.62762 27.3147 6.14322V11.6284L25.9431 13L27.3147 14.3716V19.8568C27.3147 21.3724 28.5423 22.6 30.0579 22.6M41.5431 9.40002L34.3431 16.6M34.3431 9.40002L41.5431 16.6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
});
ReferenceIconX.displayName = "IconReferenceIconX";
