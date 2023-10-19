import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type PipelineIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const PipelineIcon: React.FC<PipelineIconProps> = (props) => {
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
        d="M24.1572 10.4643L20.1111 14.5103L16.0651 10.4643L20.1112 6.41823L24.1572 10.4643ZM20.1112 4.5754L26 10.4643L20.1111 16.3531L14.8488 11.0908L12.2965 11.0908C12.0108 13.0882 10.4309 14.6681 8.43351 14.9538L8.43351 21.5154L16.252 21.5154L16.252 17.6061H24.0704V25.4246H16.252V22.8184H7.13043V21.5154V14.9538C4.92022 14.6377 3.22121 12.7369 3.22121 10.4392C3.22121 7.9204 5.26313 5.87848 7.78197 5.87848C10.0796 5.87848 11.9804 7.57749 12.2965 9.7877L14.8989 9.7877L20.1112 4.5754ZM11.0397 10.441C11.0387 12.2394 9.58054 13.6969 7.78197 13.6969C5.9828 13.6969 4.52428 12.2384 4.52428 10.4392C4.52428 8.64007 5.9828 7.18155 7.78197 7.18155C9.58055 7.18155 11.0387 8.63911 11.0397 10.4375V10.4392L11.0397 10.441ZM17.555 18.9092H22.7673V24.1215H17.555L17.555 18.9092Z"
      />
    </IconBase>
  );
};

export default PipelineIcon;
