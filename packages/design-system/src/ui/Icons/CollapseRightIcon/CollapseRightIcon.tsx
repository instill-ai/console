import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type CollapseRightIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const CollapseRightIcon: React.FC<CollapseRightIconProps> = (props) => {
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
        d="M16.5 4.40901L17.2955 5.20451L26.2955 14.2045V15.7955L17.2955 24.7955L16.5 25.591L14.909 24L15.7045 23.2045L22.784 16.125H7.1L7.1 23H5V7H7.1L7.1 13.875H22.784L15.7045 6.7955L14.909 6L16.5 4.40901Z"
      />
    </IconBase>
  );
};

export default CollapseRightIcon;
