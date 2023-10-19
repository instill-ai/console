import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type GitCommitIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const GitCommitIcon: React.FC<GitCommitIconProps> = (props) => {
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
        d="M18.4375 14.5C18.4375 15.4116 18.0753 16.2858 17.4307 16.9303C16.786 17.5749 15.9117 17.937 15 17.937C14.0883 17.937 13.214 17.5749 12.5693 16.9303C11.9247 16.2858 11.5625 15.4116 11.5625 14.5C11.5625 13.5885 11.9247 12.7143 12.5693 12.0697C13.214 11.4251 14.0883 11.063 15 11.063C15.9117 11.063 16.786 11.4251 17.4307 12.0697C18.0753 12.7143 18.4375 13.5885 18.4375 14.5ZM20.4038 15.5311C20.1637 16.7882 19.4927 17.9223 18.5064 18.7381C17.52 19.5537 16.28 20 15 20C13.72 20 12.48 19.5537 11.4937 18.7381C10.5073 17.9223 9.83633 16.7882 9.59625 15.5311H5.03125C4.75775 15.5311 4.49544 15.4225 4.30205 15.2291C4.10865 15.0357 4 14.7735 4 14.5C4 14.2265 4.10865 13.9643 4.30205 13.7709C4.49544 13.5775 4.75775 13.4689 5.03125 13.4689H9.59625C9.83633 12.2118 10.5073 11.0777 11.4937 10.262C12.48 9.4463 13.72 9 15 9C16.28 9 17.52 9.4463 18.5064 10.262C19.4927 11.0777 20.1637 12.2118 20.4038 13.4689H24.9688C25.2422 13.4689 25.5046 13.5775 25.6979 13.7709C25.8914 13.9643 26 14.2265 26 14.5C26 14.7735 25.8914 15.0357 25.6979 15.2291C25.5046 15.4225 25.2422 15.5311 24.9688 15.5311H20.4038Z"
      />
    </IconBase>
  );
};

export default GitCommitIcon;
