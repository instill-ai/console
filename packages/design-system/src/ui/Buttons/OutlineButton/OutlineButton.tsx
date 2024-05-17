import * as React from "react";
import ButtonBase, { ButtonBaseProps } from "../ButtonBase";

export type OutlineButtonRequiredKeys = "type" | "color" | "hoveredShadow";

export type OutlineButtonOmitKeys =
  | "borderSize"
  | "borderColor"
  | "hoveredBorderColor"
  | "disabledBorderColor"
  | "bgColor"
  | "bgOpacity"
  | "disabledBgColor"
  | "disabledBgOpacity"
  | "hoveredBgColor"
  | "hoveredBgOpacity"
  | "textColor"
  | "hoveredTextColor"
  | "disabledTextColor"
  | "borderRadius"
  | "shadow";

export type OutlineButtonConfig = Pick<ButtonBaseProps, OutlineButtonOmitKeys>;

export type FullOutlineButtonProps = Omit<
  ButtonBaseProps,
  OutlineButtonOmitKeys
> & {
  color: "primary" | "primaryLight" | "secondary" | "danger";
};

export type OutlineButtonRequiredProps = Pick<
  FullOutlineButtonProps,
  OutlineButtonRequiredKeys
>;

export type OutlineButtonOptionalProps = Partial<
  Omit<FullOutlineButtonProps, OutlineButtonRequiredKeys>
>;

export type OutlineButtonProps = OutlineButtonRequiredProps &
  OutlineButtonOptionalProps;

const OutlineButton = (props: OutlineButtonProps) => {
  const {
    type,
    disabled,
    onClickHandler,
    position,
    dataFlag,
    width,
    padding,
    startIcon,
    endIcon,
    itemGapX,
    textSize,
    hoveredShadow,
    children,
  } = props;

  let buttonStyle = {} as OutlineButtonConfig;

  switch (props.color) {
    case "primary": {
      buttonStyle = {
        borderSize: "border-[1px]",
        borderColor: "border-instillBlue50",
        hoveredBorderColor: "hover:border-instillBlue50",
        disabledBorderColor: "border-instillGrey30",
        borderRadius: "rounded-[1px]",
        bgColor: null,
        hoveredBgColor: "hover:bg-instillBlue50",
        disabledBgColor: null,
        textColor: "text-instillBlue50",
        hoveredTextColor: "hover:text-instillBlue10",
        disabledTextColor: "text-instillGrey30",
        disabledBgOpacity: null,
        hoveredBgOpacity: null,
        bgOpacity: null,
        shadow: null,
      };
      break;
    }
    case "primaryLight": {
      buttonStyle = {
        borderSize: "border-[1px]",
        borderColor: "border-instillNeonBlue",
        hoveredBorderColor: "hover:border-instillNeonBlue",
        disabledBorderColor: "border-instillGrey30",
        borderRadius: "rounded-[1px]",
        bgColor: null,
        hoveredBgColor: "hover:bg-instillNeonBlue",
        disabledBgColor: null,
        textColor: "text-instillNeonBlue",
        hoveredTextColor: "hover:text-instillNeonBlue",
        disabledTextColor: "text-instillGrey30",
        disabledBgOpacity: null,
        bgOpacity: null,
        hoveredBgOpacity: "hover:bg-opacity-20",
        shadow: null,
      };
      break;
    }
    case "secondary": {
      buttonStyle = {
        borderSize: "border-[1px]",
        borderColor: "border-semantic-node-disconnected-default-stroke",
        hoveredBorderColor:
          "hover:border-semantic-node-disconnected-default-stroke",
        disabledBorderColor: "border-instillGrey30",
        borderRadius: "rounded-[1px]",
        bgColor: null,
        hoveredBgColor: "hover:bg-semantic-node-disconnected-default-stroke",
        disabledBgColor: null,
        textColor: "text-semantic-node-disconnected-default-stroke",
        hoveredTextColor: "hover:text-instillGrey05",
        disabledTextColor: "text-instillGrey30",
        disabledBgOpacity: null,
        hoveredBgOpacity: null,
        bgOpacity: null,
        shadow: null,
      };
      break;
    }
    case "danger": {
      buttonStyle = {
        borderSize: "border-[1px]",
        borderColor: "border-instillRed",
        hoveredBorderColor: "hover:border-instillRed",
        disabledBorderColor: "border-instillGrey30",
        borderRadius: "rounded-[1px]",
        bgColor: null,
        hoveredBgColor: "hover:bg-instillRed",
        disabledBgColor: null,
        textColor: "text-instillRed",
        hoveredTextColor: "hover:text-instillRed10",
        disabledTextColor: "text-instillGrey30",
        disabledBgOpacity: null,
        hoveredBgOpacity: null,
        bgOpacity: null,
        shadow: null,
      };
      break;
    }
    default: {
      throw new Error(
        `Button variant ${props.color} not support, OutlineButton only support variant=primary`
      );
    }
  }

  return (
    <ButtonBase
      type={type}
      disabled={disabled ?? false}
      onClickHandler={onClickHandler ?? null}
      position={position ?? null}
      dataFlag={dataFlag ?? null}
      width={width ?? null}
      padding={padding ?? "px-5 py-2.5"}
      startIcon={startIcon ?? null}
      endIcon={endIcon ?? null}
      itemGapX={itemGapX ?? null}
      textSize={textSize ?? "text-base"}
      hoveredShadow={hoveredShadow}
      {...buttonStyle}
    >
      {children}
    </ButtonBase>
  );
};

export default OutlineButton;
