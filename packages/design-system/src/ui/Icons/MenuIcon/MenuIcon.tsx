import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type MenuIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const MenuIcon: React.FC<MenuIconProps> = (props) => {
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
        d="M25 9L5 9V7H25V9ZM25 16L5 16V14L25 14V16ZM10.2632 23L25 23V21L10.2632 21V23Z"
      />
    </IconBase>
  );
};

export default MenuIcon;
