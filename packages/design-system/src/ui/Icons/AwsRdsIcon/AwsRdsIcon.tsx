import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type AwsRdsIconProps = Omit<IconBaseProps, "viewBox" | "fill" | "color">;

const AwsRdsIcon: React.FC<AwsRdsIconProps> = (props) => {
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
      <path
        d="M23.3982 20.5642L21.4317 22.9343L21.2549 22.7183V7.55915L21.4317 7.33008L23.3982 9.69923V20.5642Z"
        fill="#1A476F"
      />
      <path
        d="M21.4315 22.9343L17.6739 24.8662L17.5176 24.6076L17.5151 5.60242L17.6713 5.39999L21.4315 7.32577V22.9343Z"
        fill="#1F5B98"
      />
      <path
        d="M6.60176 9.69923L8.56879 7.33008L8.78879 7.40174L8.74509 22.7408L8.56879 22.9343L6.60176 20.5645V9.69923Z"
        fill="#2D72B8"
      />
      <path
        d="M12.3263 24.8662L8.56879 22.9343V7.32577L12.329 5.39999L12.5068 5.64742L12.5042 24.5851L12.3263 24.8662Z"
        fill="#5294CF"
      />
      <path
        d="M17.6713 5.39999H12.329V24.8665H17.6713V5.39999Z"
        fill="#2D72B8"
      />
    </IconBase>
  );
};

export default AwsRdsIcon;
