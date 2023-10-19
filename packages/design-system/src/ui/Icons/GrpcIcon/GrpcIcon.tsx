import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type GrpcIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const GrpcIcon: React.FC<GrpcIconProps> = (props) => {
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
        d="M5.36354 14.5L12.0804 7.78313L13.4946 9.19734L8.70611 13.9859H21.501L16.7125 9.19734L18.1267 7.78313L24.8436 14.5V15.9142L18.1267 22.6311L16.7125 21.2169L21.501 16.4284H8.70611L13.4946 21.2169L12.0804 22.6311L5.36354 15.9142V14.5Z"
      />
    </IconBase>
  );
};

export default GrpcIcon;
