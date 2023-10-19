import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type FolderPlusIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const FolderPlusIcon: React.FC<FolderPlusIconProps> = (props) => {
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
        d="M5.25 5.65C5.25 5.42909 5.42909 5.25 5.65 5.25H13.85C14.0709 5.25 14.25 5.42909 14.25 5.65V8.25H24.35C24.5709 8.25 24.75 8.42909 24.75 8.65V24.35C24.75 24.5709 24.5709 24.75 24.35 24.75H5.65C5.42909 24.75 5.25 24.5709 5.25 24.35V5.65ZM6.75 6.75V23.25H23.25V9.75H12.75V6.75H6.75Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.25 20.7C14.25 20.8657 14.3843 21 14.55 21H15.45C15.6157 21 15.75 20.8657 15.75 20.7V17.25H19.2C19.3657 17.25 19.5 17.1157 19.5 16.95V16.05C19.5 15.8843 19.3657 15.75 19.2 15.75H15.75V12.3C15.75 12.1343 15.6157 12 15.45 12H14.55C14.3843 12 14.25 12.1343 14.25 12.3V15.75H10.8C10.6343 15.75 10.5 15.8843 10.5 16.05V16.95C10.5 17.1157 10.6343 17.25 10.8 17.25H14.25V20.7Z"
      />
    </IconBase>
  );
};

export default FolderPlusIcon;
