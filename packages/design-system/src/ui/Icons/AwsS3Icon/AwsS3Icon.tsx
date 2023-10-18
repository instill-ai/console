import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type AwsS3IconProps = Omit<IconBaseProps, "viewBox" | "fill" | "color">;

const AwsS3Icon: React.FC<AwsS3IconProps> = (props) => {
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
          d="M9.47926 9.70557L8.40149 10.2446V19.7043L9.47926 20.2401L9.48574 20.2323V9.71299L9.47926 9.70557Z"
          fill="#8C3123"
        />
        <path
          d="M15.2474 18.8671L9.47935 20.2401V9.70557L15.2474 11.0486V18.8671Z"
          fill="#E05243"
        />
        <path
          d="M12.6438 16.7175L15.0904 17.029L15.1057 16.9935L15.1195 12.9817L15.0904 12.9504L12.6438 13.2573V16.7175Z"
          fill="#8C3123"
        />
        <path
          d="M15.0904 18.8825L20.7014 20.2431L20.7102 20.229L20.71 9.71497L20.7012 9.70557L15.0904 11.0641V18.8825Z"
          fill="#8C3123"
        />
        <path
          d="M17.5377 16.7175L15.0904 17.029V12.9504L17.5377 13.2573V16.7175Z"
          fill="#E05243"
        />
        <path
          d="M17.5377 11.584L15.0904 12.03L12.6438 11.584L15.0873 10.9435L17.5377 11.584Z"
          fill="#5E1F18"
        />
        <path
          d="M17.5377 18.3864L15.0904 17.9374L12.6438 18.3864L15.0874 19.0685L17.5377 18.3864Z"
          fill="#F2B0A9"
        />
        <path
          d="M12.6438 11.584L15.0904 10.9785L15.1102 10.9724V6.91638L15.0904 6.90002L12.6438 8.12355V11.584Z"
          fill="#8C3123"
        />
        <path
          d="M17.5377 11.584L15.0904 10.9785V6.90002L17.5377 8.12355V11.584Z"
          fill="#E05243"
        />
        <path
          d="M15.0904 23.0702L12.6435 21.8471V18.3867L15.0904 18.992L15.1264 19.0329L15.1166 22.9996L15.0904 23.0702Z"
          fill="#8C3123"
        />
        <path
          d="M15.0904 23.0702L17.5375 21.847V18.3867L15.0904 18.9919V23.0702ZM20.7014 9.70557L21.7796 10.2446V19.7043L20.7014 20.2431V9.70557Z"
          fill="#E05243"
        />
      </g>
    </IconBase>
  );
};

export default AwsS3Icon;
