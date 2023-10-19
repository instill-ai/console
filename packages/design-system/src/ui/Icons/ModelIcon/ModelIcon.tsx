import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type ModelIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const ModelIcon: React.FC<ModelIconProps> = (props) => {
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
        d="M5.25 6C5.25 5.58579 5.58579 5.25 6 5.25H24C24.4142 5.25 24.75 5.58579 24.75 6V24C24.75 24.4142 24.4142 24.75 24 24.75H6C5.58579 24.75 5.25 24.4142 5.25 24V6ZM6.75 6.75V11.25H11.25L11.25 6.75H6.75ZM12.75 6.75V11.25H17.25V6.75H12.75ZM11.25 12.75H6.75V17.25H11.25V12.75ZM12.75 17.25L12.75 12.75H17.25L17.25 17.25H12.75ZM11.25 18.75H6.75V23.25H11.25L11.25 18.75ZM12.75 23.25V18.75H17.25V23.25H12.75ZM18.75 12.75L18.75 17.25H23.25V12.75H18.75ZM18.75 18.75V23.25H23.25V18.75H18.75ZM18.75 6.75V11.25H23.25V6.75H18.75Z"
      />
    </IconBase>
  );
};

export default ModelIcon;
