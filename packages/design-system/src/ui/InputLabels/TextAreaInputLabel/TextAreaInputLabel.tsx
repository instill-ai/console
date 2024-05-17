import * as React from "react";
import InputLabelBase, { InputLabelBaseProps } from "../InputLabelBase";

export type TextAreaInputLabelKeys =
  | "labelFontSize"
  | "labelFontWeight"
  | "labelTextColor"
  | "labelLineHeight"
  | "labelFontFamily"
  | "errorLabelFontFamily"
  | "errorLabelFontSize"
  | "errorLabelFontWeight"
  | "errorLabelLineHeight"
  | "errorLabelTextColor"
  | "messageFontFamily"
  | "messageFontSize"
  | "messageFontWeight"
  | "messageLineHeight"
  | "messageTextColor";

export type TextAreaInputLabelProps = Omit<
  InputLabelBaseProps,
  TextAreaInputLabelKeys
>;

export type TextAreaInputLabelConfig = Pick<
  InputLabelBaseProps,
  TextAreaInputLabelKeys
>;

export const basicInputLabelConfig: TextAreaInputLabelConfig = {
  labelFontSize: "text-base",
  labelFontWeight: "font-normal",
  labelTextColor: "text-semantic-node-disconnected-default-stroke",
  labelLineHeight: "",
  labelFontFamily: "font-sans",
  errorLabelFontFamily: "font-sans",
  errorLabelFontSize: "text-base",
  errorLabelFontWeight: "font-normal",
  errorLabelLineHeight: "",
  errorLabelTextColor: "text-instillRed",
  messageFontSize: "text-xs",
  messageTextColor: "text-instillGrey70",
  messageFontFamily: "font-sans",
  messageFontWeight: "font-normal",
  messageLineHeight: "",
};

const TextAreaInputLabel = (props: TextAreaInputLabelProps) => {
  const { error, message, required, htmlFor, type, label } = props;

  return (
    <InputLabelBase
      label={label}
      error={error}
      message={message}
      required={required}
      htmlFor={htmlFor}
      type={type}
      {...basicInputLabelConfig}
    />
  );
};

export default TextAreaInputLabel;
