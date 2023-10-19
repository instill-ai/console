import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type SyncIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const SyncIcon: React.FC<SyncIconProps> = (props) => {
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
        d="M15.4113 2.42693L17.2149 3.17743L15.6964 11.6H24.018L11.8342 27.6057L10.0862 26.6948L13.1294 17.2H5.08044L15.4113 2.42693ZM8.91955 15.2H15.8706L13.7663 21.7655L19.982 13.6H13.3036L14.4378 7.30891L8.91955 15.2Z"
      />
    </IconBase>
  );
};

export default SyncIcon;
