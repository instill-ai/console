import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type OpticalCharacterRecognitionIconProps = Omit<
  IconBaseProps,
  "viewBox" | "fill"
>;

const OpticalCharacterRecognitionIcon: React.FC<
  OpticalCharacterRecognitionIconProps
> = (props) => {
  const { width, height, position, style, color } = props;
  return (
    <IconBase
      viewBox="0 0 30 30"
      width={width}
      height={height}
      color={color}
      position={position}
      style={style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.8087 5.70972H10.1949V7.2665H14.071L8.70021 22.6784H4.5795V24.2352H14.1933V22.6784H10.3488L11.3379 19.8402H18.9102L19.8992 22.6784H15.8103V24.2352H25.4241V22.6784H21.5479L16.177 7.2665H19.8087V5.70972ZM18.3677 18.2835H11.8804L15.124 8.97558L18.3677 18.2835Z"
      />
    </IconBase>
  );
};

export default OpticalCharacterRecognitionIcon;
