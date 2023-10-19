import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type ClientIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const ClientIcon: React.FC<ClientIconProps> = (props) => {
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
        d="M5.25 6C5.25 5.58579 5.58579 5.25 6 5.25H12C12.4142 5.25 12.75 5.58579 12.75 6V12C12.75 12.4142 12.4142 12.75 12 12.75H9.75V20.25H17.25V18C17.25 17.5858 17.5858 17.25 18 17.25H24C24.4142 17.25 24.75 17.5858 24.75 18V24C24.75 24.4142 24.4142 24.75 24 24.75H18C17.5858 24.75 17.25 24.4142 17.25 24V21.75H9C8.58579 21.75 8.25 21.4142 8.25 21V12.75H6C5.58579 12.75 5.25 12.4142 5.25 12V6ZM6.75 6.75V11.25H11.25V6.75H6.75ZM23.25 18.75H18.75V23.25H23.25V18.75Z"
      />
    </IconBase>
  );
};

export default ClientIcon;
