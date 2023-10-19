import React from "react";
import IconBase, { IconBaseProps } from "../IconBase";

export type SlackIconProps = Omit<IconBaseProps, "viewBox" | "fill" | "color">;

const SlackIcon: React.FC<SlackIconProps> = (props) => {
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
        d="M10.3464 16.8823C10.3464 17.7864 9.59415 18.5251 8.67323 18.5251C7.75231 18.5251 7.00002 17.7864 7.00002 16.8823C7.00002 15.9781 7.75231 15.2395 8.67323 15.2395H10.3464V16.8823Z"
        fill="#E01E5A"
      />
      <path
        d="M11.1896 16.8823C11.1896 15.9781 11.9419 15.2395 12.8628 15.2395C13.7837 15.2395 14.536 15.9781 14.536 16.8823V20.9956C14.536 21.8998 13.7837 22.6384 12.8628 22.6384C11.9419 22.6384 11.1896 21.8998 11.1896 20.9956V16.8823Z"
        fill="#E01E5A"
      />
      <path
        d="M12.8628 10.2856C11.9418 10.2856 11.1895 9.54697 11.1895 8.64279C11.1895 7.73862 11.9418 7 12.8628 7C13.7837 7 14.536 7.73862 14.536 8.64279V10.2856H12.8628Z"
        fill="#36C5F0"
      />
      <path
        d="M12.8628 11.1134C13.7837 11.1134 14.536 11.852 14.536 12.7562C14.536 13.6603 13.7837 14.399 12.8628 14.399H8.67323C7.75231 14.399 7.00002 13.6603 7.00002 12.7562C7.00002 11.852 7.75231 11.1134 8.67323 11.1134H12.8628Z"
        fill="#36C5F0"
      />
      <path
        d="M19.5816 12.7562C19.5816 11.852 20.3339 11.1134 21.2548 11.1134C22.1757 11.1134 22.928 11.852 22.928 12.7562C22.928 13.6603 22.1757 14.399 21.2548 14.399H19.5816V12.7562Z"
        fill="#2EB67D"
      />
      <path
        d="M18.7385 12.7561C18.7385 13.6603 17.9862 14.3989 17.0653 14.3989C16.1443 14.3989 15.392 13.6603 15.392 12.7561V8.6428C15.392 7.73862 16.1443 7 17.0653 7C17.9862 7 18.7385 7.73862 18.7385 8.6428V12.7561Z"
        fill="#2EB67D"
      />
      <path
        d="M17.0653 19.3528C17.9862 19.3528 18.7385 20.0915 18.7385 20.9956C18.7385 21.8998 17.9862 22.6384 17.0653 22.6384C16.1443 22.6384 15.392 21.8998 15.392 20.9956V19.3528H17.0653Z"
        fill="#ECB22E"
      />
      <path
        d="M17.0653 18.5251C16.1443 18.5251 15.392 17.7864 15.392 16.8823C15.392 15.9781 16.1443 15.2395 17.0653 15.2395H21.2548C22.1757 15.2395 22.928 15.9781 22.928 16.8823C22.928 17.7864 22.1757 18.5251 21.2548 18.5251H17.0653Z"
        fill="#ECB22E"
      />
    </IconBase>
  );
};

export default SlackIcon;
