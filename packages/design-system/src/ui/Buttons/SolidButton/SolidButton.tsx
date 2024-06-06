import * as React from "react";
import ButtonBase, { ButtonBaseProps } from "../ButtonBase";

export type SolidButtonRequiredKeys = "type" | "color";

export type SolidButtonOmitKeys =
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
  | "borderRadius";

export type SolidButtonConfig = Pick<ButtonBaseProps, SolidButtonOmitKeys>;

export type FullSolidButtonProps = Omit<
  ButtonBaseProps,
  SolidButtonOmitKeys
> & {
  color: "primary" | "primaryLight" | "white";
};

export type SolidButtonRequiredProps = Pick<
  FullSolidButtonProps,
  SolidButtonRequiredKeys
>;

export type SolidButtonOptionalProps = Partial<
  Omit<FullSolidButtonProps, SolidButtonRequiredKeys>
>;

export type SolidButtonProps = SolidButtonRequiredProps &
  SolidButtonOptionalProps;

const SolidButton = (props: SolidButtonProps) => {
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
    shadow,
    children,
  } = props;

  let buttonStyle = {} as SolidButtonConfig;

  switch (props.color) {
    case "primary": {
      buttonStyle = {
        borderSize: null,
        borderColor: null,
        hoveredBorderColor: null,
        disabledBorderColor: null,
        borderRadius: "rounded-[1px]",
        bgColor: "bg-instillBlue50",
        hoveredBgColor: "hover:bg-instillBlue80",
        textColor: "text-instillGrey05",
        hoveredTextColor: "hover:text-instillBlue10",
        disabledBgColor: "bg-instillGrey15",
        disabledTextColor: "text-semantic-node-disconnected-default-stroke",
        disabledBgOpacity: null,
        hoveredBgOpacity: null,
        bgOpacity: null,
      };
      break;
    }
    case "primaryLight": {
      buttonStyle = {
        borderSize: null,
        borderColor: null,
        hoveredBorderColor: null,
        disabledBorderColor: null,
        borderRadius: "rounded-[1px]",
        bgColor: "bg-instillNeonBlue",
        hoveredBgColor: "hover:bg-instillNeonBlue",
        textColor: "text-instillNeonBlue",
        hoveredTextColor: "hover:text-instillNeonBlue",
        disabledBgColor: "bg-instillGrey15",
        disabledTextColor: "text-semantic-node-disconnected-default-stroke",
        disabledBgOpacity: null,
        bgOpacity: "bg-opacity-10",
        hoveredBgOpacity: "hover:bg-opacity-20",
      };
      break;
    }
    case "white": {
      buttonStyle = {
        borderSize: null,
        borderColor: null,
        hoveredBorderColor: null,
        disabledBorderColor: null,
        borderRadius: "rounded-[1px]",
        bgColor: "bg-white",
        hoveredBgColor: "hover:bg-white",
        textColor: "text-instillGrey90",
        hoveredTextColor: "hover:text-instillGrey90",
        disabledBgColor: "bg-instillGrey15",
        disabledTextColor: "text-semantic-node-disconnected-default-stroke",
        disabledBgOpacity: null,
        bgOpacity: "bg-opacity-90",
        hoveredBgOpacity: "hover:bg-opacity-100",
      };
      break;
    }

    // case "danger": {
    //   buttonStyle = {
    //     borderSize: null,
    //     borderColor: null,
    //     hoveredBorderColor: null,
    //     disabledBorderColor: null,
    //     borderRadius: "rounded-[1px]",
    //     bgColor: "bg-instillRed",
    //     hoveredBgColor: "hover:bg-instillBlue80",
    //     textColor: "text-instillRed10",
    //     hoveredTextColor: "hover:text-instillRed10",
    //     disabledBgColor: "bg-instillGrey05",
    //     disabledTextColor: "text-instillGrey30",
    //   };
    //   break;
    // }
    default: {
      throw new Error(
        `Button variant ${props.color} not support, SolidButton only support variant=primary | primaryLight`
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
      shadow={shadow ?? null}
      hoveredShadow={hoveredShadow ?? null}
      {...buttonStyle}
    >
      {children}
    </ButtonBase>
  );
};

export default SolidButton;
