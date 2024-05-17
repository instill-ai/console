import * as React from "react";
import ButtonBase, { ButtonBaseProps } from "../ButtonBase";

export type TextButtonRequiredKeys = "type" | "color";

export type TextButtonOmitKeys =
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
  | "shadow"
  | "hoveredShadow";

export type TextButtonConfig = Pick<ButtonBaseProps, TextButtonOmitKeys>;

export type FullTextButtonProps = Omit<ButtonBaseProps, TextButtonOmitKeys> & {
  color: "primary";
};

export type TextButtonRequiredProps = Pick<
  FullTextButtonProps,
  TextButtonRequiredKeys
>;

export type TextButtonOptionalProps = Partial<
  Omit<FullTextButtonProps, TextButtonRequiredKeys>
>;

export type TextButtonProps = TextButtonRequiredProps & TextButtonOptionalProps;

const TextButton = (props: TextButtonProps) => {
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
    children,
  } = props;

  let buttonStyle = {} as TextButtonConfig;

  switch (props.color) {
    case "primary": {
      buttonStyle = {
        borderSize: null,
        borderColor: null,
        hoveredBorderColor: null,
        disabledBorderColor: null,
        borderRadius: null,
        bgColor: null,
        hoveredBgColor: null,
        textColor: "text-instillBlue50",
        hoveredTextColor: "hover:text-instillBlue80",
        disabledBgColor: null,
        disabledTextColor: "text-semantic-node-disconnected-default-stroke",
        disabledBgOpacity: null,
        hoveredBgOpacity: null,
        bgOpacity: null,
        shadow: null,
        hoveredShadow: null,
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
        `Button variant ${props.color} not support, TextButton only support variant=primary`
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
      startIcon={startIcon ?? null}
      endIcon={endIcon ?? null}
      itemGapX={itemGapX ?? null}
      padding={padding ?? "px-5 py-2.5"}
      textSize={textSize ?? "text-base"}
      {...buttonStyle}
    >
      {children}
    </ButtonBase>
  );
};

export default TextButton;
