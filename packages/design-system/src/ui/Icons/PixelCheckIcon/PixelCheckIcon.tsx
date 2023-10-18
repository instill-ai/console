import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type PixelCheckIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const PixelCheckIcon: React.FC<PixelCheckIconProps> = (props) => {
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
      <rect x="18.3333" y="11.6667" width="3.33333" height="3.33333" />
      <rect x="15" y="15" width="3.33333" height="3.33333" />
      <rect x="21.6667" y="8.33333" width="3.33333" height="3.33333" />
      <rect x="25" y="5" width="3.33333" height="3.33333" />
      <rect x="5" y="18.3333" width="3.33333" height="3.33333" />
      <rect x="1.66667" y="15" width="3.33333" height="3.33333" />
      <rect x="8.33333" y="21.6667" width="3.33333" height="3.33333" />
      <rect x="11.6667" y="18.3333" width="3.33333" height="3.33333" />
    </IconBase>
  );
};

export default PixelCheckIcon;
