import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type AsyncIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const AsyncIcon: React.FC<AsyncIconProps> = (props) => {
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
        d="M24 15C24 19.9706 19.9706 24 15 24C10.0294 24 6 19.9706 6 15C6 10.0294 10.0294 6 15 6C19.9706 6 24 10.0294 24 15ZM26 15C26 21.0751 21.0751 26 15 26C8.92487 26 4 21.0751 4 15C4 8.92487 8.92487 4 15 4C21.0751 4 26 8.92487 26 15ZM16 15.3724V8H14V16.157L17.2667 19.6799L18.7333 18.3201L16 15.3724Z"
      />
    </IconBase>
  );
};

export default AsyncIcon;
