"use client";

import * as React from "react";
import {
  ComplicateIconBase,
  ComplicateIconBaseProps,
} from "./ComplicateIconBase";

export const ImageToImage = React.forwardRef<
  SVGSVGElement,
  Omit<ComplicateIconBaseProps, "viewBox" | "children"> & {
    pathColor: string;
  }
>((props, ref) => {
  const { className, pathColor, ...passThrough } = props;
  return (
    <ComplicateIconBase
      {...passThrough}
      ref={ref}
      viewBox="0 0 25 24"
      className={className}
    >
      <path
        d="M16.1451 8.20456L13.6451 5.70456M13.6451 5.70456L16.1451 3.20456M13.6451 5.70456H16.8451C18.5253 5.70456 19.3653 5.70456 20.0071 6.03154C20.5716 6.31916 21.0305 6.7781 21.3181 7.34259C21.6451 7.98432 21.6451 8.8244 21.6451 10.5046V11.2046M3.12434 13.0826V13.7826C3.12434 15.4628 3.12434 16.3029 3.45132 16.9446C3.73894 17.5091 4.19788 17.968 4.76237 18.2556C5.40411 18.5826 6.24418 18.5826 7.92434 18.5826H11.1243M11.1243 18.5826L8.62434 16.0826M11.1243 18.5826L8.62434 21.0826M4.63333 9.7001H8.36667C9.1134 9.7001 9.48677 9.7001 9.77199 9.55478C10.0229 9.42695 10.2268 9.22297 10.3547 8.97209C10.5 8.68688 10.5 8.31351 10.5 7.56677V3.83344C10.5 3.0867 10.5 2.71333 10.3547 2.42812C10.2268 2.17723 10.0229 1.97326 9.77199 1.84543C9.48677 1.7001 9.1134 1.7001 8.36667 1.7001H4.63333C3.8866 1.7001 3.51323 1.7001 3.22801 1.84543C2.97713 1.97326 2.77316 2.17723 2.64532 2.42812C2.5 2.71333 2.5 3.0867 2.5 3.83344V7.56677C2.5 8.31351 2.5 8.68688 2.64532 8.97209C2.77316 9.22297 2.97713 9.42695 3.22801 9.55478C3.51323 9.7001 3.8866 9.7001 4.63333 9.7001ZM3.83333 7.03344L5.16667 4.58899L6.05556 5.25566L7.16667 3.7001L9.16667 7.03344H3.83333ZM16.6333 21.7001H20.3667C21.1134 21.7001 21.4868 21.7001 21.772 21.5548C22.0229 21.4269 22.2268 21.223 22.3547 20.9721C22.5 20.6869 22.5 20.3135 22.5 19.5668V15.8334C22.5 15.0867 22.5 14.7133 22.3547 14.4281C22.2268 14.1772 22.0229 13.9733 21.772 13.8454C21.4868 13.7001 21.1134 13.7001 20.3667 13.7001H16.6333C15.8866 13.7001 15.5132 13.7001 15.228 13.8454C14.9771 13.9733 14.7732 14.1772 14.6453 14.4281C14.5 14.7133 14.5 15.0867 14.5 15.8334V19.5668C14.5 20.3135 14.5 20.6869 14.6453 20.9721C14.7732 21.223 14.9771 21.4269 15.228 21.5548C15.5132 21.7001 15.8866 21.7001 16.6333 21.7001ZM15.8333 19.0334L17.1667 16.589L18.0556 17.2557L19.1667 15.7001L21.1667 19.0334H15.8333Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={pathColor}
      />
    </ComplicateIconBase>
  );
});
ImageToImage.displayName = "ImageToImageIcon";
