import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type StatusOffIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const StatusOffIcon: React.FC<StatusOffIconProps> = (props) => {
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
        d="M28 15C28 22.1797 22.1797 28 15 28C7.8203 28 2 22.1797 2 15C2 7.8203 7.8203 2 15 2C22.1797 2 28 7.8203 28 15ZM30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15ZM23 13H7V17H23V13Z"
      />
    </IconBase>
  );
};

export default StatusOffIcon;
