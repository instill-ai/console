import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type MinusIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const MinusIcon: React.FC<MinusIconProps> = (props) => {
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
      <path d="M5.00085 15.7C5.00085 15.8657 5.13516 16 5.30085 16H24.7C24.8657 16 25 15.8657 25 15.7V14.3C25 14.1343 24.8657 14 24.7 14H5.30085C5.13516 14 5.00085 14.1343 5.00085 14.3V15.7Z" />
    </IconBase>
  );
};

export default MinusIcon;
