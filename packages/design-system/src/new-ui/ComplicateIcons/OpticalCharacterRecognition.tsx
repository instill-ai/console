import * as React from "react";
import {
  ComplicateIconBase,
  ComplicateIconBaseProps,
} from "./ComplicateIconBase";

export const OpticalCharacterRecognition = React.forwardRef<
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
        d="M19.8087 5.70972H10.1949V7.2665H14.071L8.70021 22.6784H4.5795V24.2352H14.1933V22.6784H10.3488L11.3379 19.8402H18.9102L19.8992 22.6784H15.8103V24.2352H25.4241V22.6784H21.5479L16.177 7.2665H19.8087V5.70972ZM18.3677 18.2835H11.8804L15.124 8.97558L18.3677 18.2835Z"
        className={fillAreaColor}
      />
    </ComplicateIconBase>
  );
});
OpticalCharacterRecognition.displayName = "OpticalCharacterRecognitionIcon";
