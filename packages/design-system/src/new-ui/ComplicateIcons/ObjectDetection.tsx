"use client";

import * as React from "react";
import {
  ComplicateIconBase,
  ComplicateIconBaseProps,
} from "./ComplicateIconBase";

export const ObjectDetection = React.forwardRef<
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
        d="M14.9375 11.4605L15.6916 12.6028L21.8518 13.2814L21.0918 20.1806C23.6507 19.5925 25.559 17.3008 25.559 14.5634C25.559 11.3802 22.9786 8.79978 19.7954 8.79978C17.7547 8.79978 15.9617 9.86041 14.9375 11.4605ZM14.0854 10.1696L10.6728 5L2.59741 19.8583L9.12893 18.6944L8.55079 23.9427L20.532 25.2625L20.9267 21.6796C24.3682 21.1368 26.9999 18.1574 26.9999 14.5634C26.9999 10.5844 23.7744 7.35888 19.7954 7.35888C17.4705 7.35888 15.4027 8.4602 14.0854 10.1696ZM13.258 11.5317L10.7926 7.79698L5.29401 17.9142L9.29339 17.2015L9.87059 11.9616L12.9533 12.3012C13.0404 12.0376 13.1423 11.7808 13.258 11.5317ZM12.6402 13.7163L11.1451 13.5516L10.772 16.9379L12.8723 16.5637C12.6891 15.9286 12.591 15.2574 12.591 14.5634C12.591 14.2768 12.6077 13.9941 12.6402 13.7163ZM13.4238 17.929L10.6076 18.4308L10.1408 22.6683L19.2575 23.6725L19.4681 21.7605C16.8435 21.6432 14.5844 20.1216 13.4238 17.929ZM19.6263 20.3245C17.6532 20.2677 15.9286 19.2191 14.9335 17.6599L18.5987 17.0067L16.7235 14.1661L20.2618 14.5558L19.6263 20.3245ZM14.301 16.309C14.1262 15.7584 14.0319 15.1719 14.0319 14.5634C14.0319 14.3301 14.0457 14.1001 14.0727 13.8741L14.8616 13.961L16.1895 15.9725L14.301 16.309Z"
        className={fillAreaColor}
      />
    </ComplicateIconBase>
  );
});
ObjectDetection.displayName = "ObjectDetectionIcon";
