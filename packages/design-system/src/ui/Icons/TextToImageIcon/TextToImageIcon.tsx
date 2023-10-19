import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type TextToImageIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const TextToImageIcon: React.FC<TextToImageIconProps> = (props) => {
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
        d="M11.75 4H19.25C19.4489 4 19.6397 4.07902 19.7803 4.21967L24.2803 8.71967C24.421 8.86032 24.5 9.05109 24.5 9.25V21.25C24.5 21.6642 24.1642 22 23.75 22H18.5V25.75C18.5 26.1642 18.1642 26.5 17.75 26.5H5.75C5.33579 26.5 5 26.1642 5 25.75V9.25C5 8.83579 5.33579 8.5 5.75 8.5H11V4.75C11 4.33579 11.3358 4 11.75 4ZM12.5 9.25V20.5H17.75H23V9.56066L18.9393 5.5H12.5V9.25ZM11 10H6.5V25H17V22H11.75C11.3358 22 11 21.6642 11 21.25V10ZM21.6695 17.0082C21.7495 17.1678 21.7409 17.3574 21.6469 17.5091C21.5529 17.6608 21.3874 17.7534 21.209 17.7534L14.5151 17.7532C14.3441 17.7532 14.1849 17.6683 14.0885 17.5268C13.993 17.3854 13.9733 17.2058 14.0368 17.0471L16.0964 11.8982C16.1718 11.7102 16.3507 11.5836 16.5529 11.5751C16.7674 11.5702 16.9448 11.6781 17.035 11.8591L18.3188 14.4269L19.3782 13.7208C19.5013 13.6394 19.6537 13.6146 19.796 13.6518C19.9388 13.6894 20.0582 13.7869 20.1241 13.9189L21.6695 17.0082ZM20.3757 16.7235L19.4645 14.9011L18.4051 15.6072C18.2826 15.6886 18.1311 15.7147 17.9873 15.6762C17.8445 15.6386 17.7246 15.5407 17.6588 15.4091L16.627 13.3452L15.2752 16.7234L20.3757 16.7235ZM21.7237 10.8021C21.7237 11.7956 20.9152 12.6042 19.9216 12.6042C18.928 12.6042 18.1195 11.7957 18.1195 10.8021C18.1195 9.80847 18.928 9 19.9216 9C20.9152 9 21.7237 9.80847 21.7237 10.8021ZM20.694 10.8021C20.694 10.3761 20.3476 10.0297 19.9216 10.0297C19.4957 10.0297 19.1493 10.3762 19.1493 10.8021C19.1493 11.228 19.4957 11.5744 19.9216 11.5744C20.3476 11.5744 20.694 11.228 20.694 10.8021ZM7 13.5H10.5V12.5H7V13.5ZM7 15.5H10.5V14.5H7V15.5ZM10.5 17.5H7V16.5H10.5V17.5ZM7 19.5H10.5V18.5H7V19.5ZM10.5 21.5H7V20.5H10.5V21.5ZM7 23.5H16V22.5H7V23.5Z"
      />
    </IconBase>
  );
};

export default TextToImageIcon;
