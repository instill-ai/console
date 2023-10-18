import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type CopyIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const CopyIcon: React.FC<CopyIconProps> = (props) => {
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
        d="M19.5 3.75H12C11.5858 3.75 11.25 4.08579 11.25 4.5V8.25H6C5.58579 8.25 5.25 8.58579 5.25 9V25.5C5.25 25.9142 5.58579 26.25 6 26.25H18C18.4142 26.25 18.75 25.9142 18.75 25.5V21.75H24C24.4142 21.75 24.75 21.4142 24.75 21V9C24.75 8.80109 24.671 8.61032 24.5303 8.46967L20.0303 3.96967C19.8897 3.82902 19.6989 3.75 19.5 3.75ZM17.25 21.75H12C11.5858 21.75 11.25 21.4142 11.25 21V9.75H6.75V24.75H17.25V21.75ZM18 20.25H23.25V9.31066L19.1893 5.25H12.75V9V20.25H18Z"
      />
    </IconBase>
  );
};

export default CopyIcon;
