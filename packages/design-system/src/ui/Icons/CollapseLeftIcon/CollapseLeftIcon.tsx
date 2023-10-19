import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type CollapseLeftIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const CollapseLeftIcon: React.FC<CollapseLeftIconProps> = (props) => {
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
        d="M13.5 25.591L12.7045 24.7955L3.70451 15.7955L3.70451 14.2045L12.7045 5.2045L13.5 4.40901L15.091 5.99999L14.2955 6.79549L7.21599 13.875L22.9 13.875L22.9 7L25 7L25 23L22.9 23L22.9 16.125L7.21599 16.125L14.2955 23.2045L15.091 24L13.5 25.591Z"
      />
    </IconBase>
  );
};

export default CollapseLeftIcon;
