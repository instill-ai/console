import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type FilterIconProps = Omit<IconBaseProps, "viewBox" | "fill">;

const FilterIcon: React.FC<FilterIconProps> = (props) => {
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
        d="M7.43747 9L5 9V7L7.43747 7C7.8375 5.97566 8.83401 5.25 10 5.25C11.166 5.25 12.1625 5.97566 12.5625 7L25 7V9L12.5625 9C12.1625 10.0243 11.166 10.75 10 10.75C8.83401 10.75 7.83751 10.0243 7.43747 9ZM8.75 8C8.75 7.30964 9.30964 6.75 10 6.75C10.6904 6.75 11.25 7.30964 11.25 8C11.25 8.69036 10.6904 9.25 10 9.25C9.30964 9.25 8.75 8.69036 8.75 8Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.4375 16L5 16V14L17.4375 14C17.8375 12.9757 18.834 12.25 20 12.25C21.166 12.25 22.1625 12.9757 22.5625 14L25 14V16L22.5625 16C22.1625 17.0243 21.166 17.75 20 17.75C18.834 17.75 17.8375 17.0243 17.4375 16ZM18.75 15C18.75 14.3096 19.3096 13.75 20 13.75C20.6904 13.75 21.25 14.3096 21.25 15C21.25 15.6904 20.6904 16.25 20 16.25C19.3096 16.25 18.75 15.6904 18.75 15Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.4375 23L5 23V21H10.4375C10.8375 19.9757 11.834 19.25 13 19.25C14.166 19.25 15.1625 19.9757 15.5625 21H25V23L15.5625 23C15.1625 24.0243 14.166 24.75 13 24.75C11.834 24.75 10.8375 24.0243 10.4375 23ZM11.75 22C11.75 21.3096 12.3096 20.75 13 20.75C13.6904 20.75 14.25 21.3096 14.25 22C14.25 22.6904 13.6904 23.25 13 23.25C12.3096 23.25 11.75 22.6904 11.75 22Z"
      />
    </IconBase>
  );
};

export default FilterIcon;
