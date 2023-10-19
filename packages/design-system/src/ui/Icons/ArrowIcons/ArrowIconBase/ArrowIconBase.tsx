import React from "react";
import IconBase, { IconBaseProps } from "../../IconBase";

export type ArrowIconBaseProps = Omit<IconBaseProps, "viewBox" | "fill">;

const EyeIcon: React.FC<ArrowIconBaseProps> = (props) => {
  return (
    <IconBase
      viewBox="0 0 30 30"
      width={props.width}
      height={props.height}
      color={props.color}
      position={props.position}
      rotate={props.rotate}
      style={props.style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.2955 5.20451L16.5 4.40901L14.909 6L15.7045 6.7955L22.784 13.875H6H4.875V16.125H6H22.784L15.7045 23.2045L14.909 24L16.5 25.591L17.2955 24.7955L26.2955 15.7955V14.2045L17.2955 5.20451Z"
      />
    </IconBase>
  );
};

export default EyeIcon;
