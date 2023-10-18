import React from "react";
import ArrowIconBase, { ArrowIconBaseProps } from "../ArrowIconBase";

export type ArrowLeftIconProps = Omit<ArrowIconBaseProps, "viewBox" | "rotate">;

const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = (props) => {
  const { width, height, position, style, color } = props;
  return (
    <ArrowIconBase
      width={width}
      height={height}
      color={color}
      position={position}
      style={style}
      rotate="rotate-180"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.2955 5.20451L16.5 4.40901L14.909 6L15.7045 6.7955L22.784 13.875H6H4.875V16.125H6H22.784L15.7045 23.2045L14.909 24L16.5 25.591L17.2955 24.7955L26.2955 15.7955V14.2045L17.2955 5.20451Z"
      />
    </ArrowIconBase>
  );
};

export default ArrowLeftIcon;
