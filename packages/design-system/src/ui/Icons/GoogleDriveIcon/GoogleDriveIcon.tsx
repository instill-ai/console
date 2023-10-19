import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type GoogleDriveIconProps = Omit<
  IconBaseProps,
  "viewBox" | "fill" | "color"
>;

const GoogleDriveIcon: React.FC<GoogleDriveIconProps> = (props) => {
  const { width, height, position, style } = props;
  return (
    <IconBase
      viewBox="0 0 30 30"
      width={width}
      height={height}
      position={position}
      style={style}
      fill="none"
    >
      <g>
        <path
          d="M7.0835 20.7843L7.89055 22.1654C8.05824 22.4562 8.29931 22.6846 8.5823 22.8508L11.4646 17.9077H5.7C5.7 18.2296 5.78385 18.5516 5.95154 18.8423L7.0835 20.7843Z"
          fill="#0066DA"
        />
        <path
          d="M14.85 12.0923L11.9677 7.14923C11.6847 7.31538 11.4436 7.54385 11.2759 7.83462L5.95154 16.9731C5.78693 17.2576 5.70022 17.5798 5.7 17.9077H11.4646L14.85 12.0923Z"
          fill="#00AC47"
        />
        <path
          d="M21.1177 22.8508C21.4007 22.6846 21.6417 22.4562 21.8094 22.1654L22.1448 21.5943L23.7484 18.8423C23.9161 18.5516 24 18.2296 24 17.9077H18.235L19.4617 20.2962L21.1177 22.8508Z"
          fill="#EA4335"
        />
        <path
          d="M14.85 12.0923L17.7323 7.14926C17.4493 6.9831 17.1244 6.90002 16.789 6.90002H12.911C12.5756 6.90002 12.2507 6.99349 11.9677 7.14926L14.85 12.0923Z"
          fill="#00832D"
        />
        <path
          d="M18.2354 17.9077H11.4646L8.5823 22.8508C8.86529 23.0169 9.1902 23.1 9.5256 23.1H20.1744C20.5098 23.1 20.8347 23.0066 21.1177 22.8508L18.2354 17.9077Z"
          fill="#2684FC"
        />
        <path
          d="M21.0863 12.4038L18.4241 7.83462C18.2564 7.54385 18.0153 7.31538 17.7323 7.14923L14.85 12.0923L18.2354 17.9077H23.9895C23.9895 17.5858 23.9057 17.2638 23.738 16.9731L21.0863 12.4038Z"
          fill="#FFBA00"
        />
      </g>
    </IconBase>
  );
};

export default GoogleDriveIcon;
