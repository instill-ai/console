"use client";

import * as React from "react";
import {
  ComplicateIconBase,
  ComplicateIconBaseProps,
} from "./ComplicateIconBase";

export const InstanceSegmentation = React.forwardRef<
  SVGSVGElement,
  Omit<ComplicateIconBaseProps, "viewBox" | "children"> & {
    fillAreaColor: string;
  }
>((props, ref) => {
  const { className, fillAreaColor, ...passThrough } = props;
  return (
    <ComplicateIconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 30 30"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.7581 3.33044H5.45667V26.6106H14.7581V23.5069H19.3821V20.3975H24.595V11.0961H15.2936V14.2054H14.7581V3.33044ZM7.01345 25.0538V4.88723H13.2013V14.2054H10.0807V23.5069H13.2013V25.0538H7.01345ZM16.8503 14.2054V12.6528H23.0382V18.8407H19.3821V14.2054H16.8503ZM11.6375 21.9501V15.7622H13.2013V21.9501H11.6375ZM14.7581 21.9501V15.7622H15.2936V20.3975H17.8253V21.9501H14.7581ZM16.8503 18.8407V15.7622H17.8253V18.8407H16.8503Z"
        className={fillAreaColor}
      />
    </ComplicateIconBase>
  );
});
InstanceSegmentation.displayName = "InstanceSegmentationIcon";
