import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type CrossIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const CrossIcon: React.FC<CrossIconProps> = (props) => {
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
        d="M15 13.5L22.5 6L24 7.5L16.5 15L24 22.5L22.5 24L15 16.5L7.5 24L6 22.5L13.5 15L6.00002 7.5L7.50002 6L15 13.5Z"
      />
    </IconBase>
  );
};

export default CrossIcon;
