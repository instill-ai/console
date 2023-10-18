import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type PixelCrossIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const PixelCrossIcon: React.FC<PixelCrossIconProps> = (props) => {
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
      <rect x="13.3333" y="13.3333" width="3.33333" height="3.33333" />
      <rect x="16.6667" y="10" width="3.33333" height="3.33333" />
      <rect x="20" y="6.66667" width="3.33333" height="3.33333" />
      <rect x="23.3333" y="3.33333" width="3.33333" height="3.33333" />
      <rect x="23.3333" y="23.3333" width="3.33333" height="3.33333" />
      <rect x="3.33334" y="3.33333" width="3.33333" height="3.33333" />
      <rect x="3.33334" y="23.3333" width="3.33333" height="3.33333" />
      <rect x="6.66667" y="6.66667" width="3.33333" height="3.33333" />
      <rect x="10" y="10" width="3.33333" height="3.33333" />
      <rect x="10" y="16.6667" width="3.33333" height="3.33333" />
      <rect x="6.66667" y="20" width="3.33333" height="3.33333" />
      <rect x="16.6667" y="16.6667" width="3.33333" height="3.33333" />
      <rect x="20" y="20" width="3.33333" height="3.33333" />
    </IconBase>
  );
};

export default PixelCrossIcon;
