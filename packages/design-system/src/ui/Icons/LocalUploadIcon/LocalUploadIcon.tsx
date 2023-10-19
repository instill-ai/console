import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type LocalUploadIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const LocalUploadIcon: React.FC<LocalUploadIconProps> = (props) => {
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
        d="M11.4142 15.7468L14 13.161L14 22H9V24H21V22H16L16 13.0817L18.6651 15.7468L20.0793 14.3325L15.7468 10H14.3325L10 14.3325L11.4142 15.7468Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 8H23V17H21V19H25V6H5V19H9V17H7V8Z"
      />
    </IconBase>
  );
};

export default LocalUploadIcon;
