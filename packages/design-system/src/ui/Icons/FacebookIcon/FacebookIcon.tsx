import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type FacebookIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const FacebookIcon: React.FC<FacebookIconProps> = (props) => {
  const { width, height, position, style, color } = props;
  return (
    <IconBase
      viewBox="0 0 30 30"
      width={width}
      height={height}
      color={color}
      position={position}
      style={style}
      fill="none"
    >
      <path d="M26 15.0672C26 8.95496 21.0751 4 15 4C8.92486 4 4 8.95496 4 15.0672C4 20.5912 8.02254 25.1697 13.2812 26V18.2663H10.4883V15.0672H13.2812V12.629C13.2812 9.85525 14.9235 8.32313 17.4361 8.32313C18.6396 8.32313 19.8984 8.53929 19.8984 8.53929V11.2629H18.5114C17.1449 11.2629 16.7188 12.116 16.7188 12.9912V15.0672H19.7695L19.2818 18.2663H16.7188V26C21.9775 25.1697 26 20.5912 26 15.0672Z" />
    </IconBase>
  );
};

export default FacebookIcon;
