import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type MediumIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const MediumIcon: React.FC<MediumIconProps> = (props) => {
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
      <path d="M16.6655 15.4999C16.6655 19.642 13.3825 23 9.33264 23C5.28274 23 2 19.643 2 15.4999C2 11.3567 5.28299 8 9.33264 8C13.3823 8 16.6655 11.3578 16.6655 15.4999ZM24.7098 15.4999C24.7098 19.3992 23.0682 22.5599 21.0433 22.5599C19.0185 22.5599 17.3769 19.3982 17.3769 15.4999C17.3769 11.6016 19.0185 8.43986 21.0433 8.43986C23.0682 8.43986 24.7098 11.6016 24.7098 15.4999ZM28 15.4999C28 18.9935 27.4226 21.8254 26.7105 21.8254C25.9983 21.8254 25.4209 18.9924 25.4209 15.4999C25.4209 12.0073 25.9983 9.17439 26.7107 9.17439C27.4231 9.17439 28 12.0065 28 15.4999Z" />
    </IconBase>
  );
};

export default MediumIcon;
