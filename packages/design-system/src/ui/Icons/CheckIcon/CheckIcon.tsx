import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type CheckIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const CheckIcon: React.FC<CheckIconProps> = (props) => {
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
        d="M12.2975 21L26.533 6.7645L28.033 8.2645L13.7975 22.5L12.2975 24L10.7975 22.5L3 14.7025L4.5 13.2025L12.2975 21Z"
      />
    </IconBase>
  );
};

export default CheckIcon;
