import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type ToggleIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const ToggleIcon: React.FC<ToggleIconProps> = (props) => {
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
      <path d="M15 22L8.0718 10L21.9282 10L15 22Z" />
    </IconBase>
  );
};

export default ToggleIcon;
