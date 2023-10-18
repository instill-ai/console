import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type StatusErrorIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const StatusErrorIcon: React.FC<StatusErrorIconProps> = (props) => {
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
        d="M15 28C22.1797 28 28 22.1797 28 15C28 7.8203 22.1797 2 15 2C7.8203 2 2 7.8203 2 15C2 22.1797 7.8203 28 15 28ZM15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 14.9999L21 18.9999L19 20.9999L15 16.9999L11 20.9999L9 18.9999L13 14.9999L9.0001 11L11.0001 9L15 12.9999L18.9999 9L20.9999 11L17 14.9999Z"
      />
    </IconBase>
  );
};

export default StatusErrorIcon;
