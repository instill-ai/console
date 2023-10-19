import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type DoubleArrowIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const DoubleArrowIcon: React.FC<DoubleArrowIconProps> = (props) => {
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
        d="M9.85943 7.5L9.30238 8.06333L3 14.4367V15.5633L9.30238 21.9367L9.85943 22.5L10.9735 21.3733L10.4165 20.81L5.45897 15.7967H12H12.7878H17.2122H18H24.541L19.5835 20.81L19.0265 21.3733L20.1406 22.5L20.6976 21.9367L27 15.5633V14.4367L20.6976 8.06333L20.1406 7.5L19.0265 8.62666L19.5835 9.18999L24.541 14.2033L18 14.2033H17.2122L12.7878 14.2033H12L5.45897 14.2033L10.4165 9.18999L10.9735 8.62666L9.85943 7.5Z"
      />
    </IconBase>
  );
};

export default DoubleArrowIcon;
