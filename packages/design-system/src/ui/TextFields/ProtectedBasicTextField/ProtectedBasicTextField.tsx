import * as React from "react";
import {
  basicInputDescriptionConfig,
  BasicInputDescriptionOmitKeys,
} from "../../InputDescriptions";
import TextFieldBase, { TextFieldBaseProps } from "../TextFieldBase";

export type ProtectedBasicTextFieldRequiredKeys =
  | "id"
  | "value"
  | "onChange"
  | "label";

export type ProtectedBasicTextFieldOmitKeys =
  | "enableProtectedToggle"
  | "type"
  | "inputHeight"
  | "inputWidth"
  | "focusHighlight"
  | "inputFontSize"
  | "inputLineHeight"
  | "inputFontWeight"
  | "bgColor"
  | "inputTextColor"
  | "inputBgColor"
  | "inputBorderRadius"
  | "inputBorderColor"
  | "inputBorderStyle"
  | "inputBorderWidth"
  | "disabledCursor"
  | "disabledInputBgColor"
  | "disabledInputBorderColor"
  | "disabledInputBorderStyle"
  | "disabledInputBorderWidth"
  | "disabledInputTextColor"
  | "readOnlyCursor"
  | "readOnlyInputBgColor"
  | "readOnlyInputBorderColor"
  | "readOnlyInputBorderStyle"
  | "readOnlyInputBorderWidth"
  | "readOnlyInputTextColor"
  | "placeholderFontFamily"
  | "placeholderFontSize"
  | "placeholderFontWeight"
  | "placeholderLineHeight"
  | "placeholderTextColor"
  | "labelFontSize"
  | "labelFontWeight"
  | "labelTextColor"
  | "labelLineHeight"
  | "labelFontFamily"
  | "errorInputBgColor"
  | "errorLabelFontFamily"
  | "errorLabelFontSize"
  | "errorLabelFontWeight"
  | "errorLabelLineHeight"
  | "errorLabelTextColor"
  | "errorInputBorderColor"
  | "errorInputBorderWidth"
  | "errorInputBorderStyle"
  | "errorInputTextColor"
  | "autoComplete"
  | "messageFontFamily"
  | "messageFontSize"
  | "messageFontWeight"
  | "messageLineHeight"
  | "messageTextColor";

export type ProtectedBasicTextFieldConfig = Pick<
  TextFieldBaseProps,
  ProtectedBasicTextFieldOmitKeys
>;

export const protectedBasicTextFieldConfig: ProtectedBasicTextFieldConfig = {
  focusHighlight: true,
  enableProtectedToggle: true,
  type: "password",
  inputBgColor: "bg-white",
  inputFontSize: "text-base",
  inputLineHeight: "",
  inputFontWeight: "font-normal",
  bgColor: "bg-white",
  inputTextColor: "text-instillGrey95",
  inputHeight: null,
  inputWidth: "w-full",
  inputBorderRadius: "rounded-[1px]",
  inputBorderColor: "border-instillGrey20",
  inputBorderStyle: "border-solid",
  inputBorderWidth: "border",
  disabledCursor: "cursor-not-allowed",
  disabledInputBgColor: "bg-white",
  disabledInputBorderColor: "border-instillGrey20",
  disabledInputBorderStyle: "border-dashed",
  disabledInputBorderWidth: "border",
  disabledInputTextColor: "text-semantic-node-disconnected-default-stroke",
  readOnlyCursor: "cursor-auto",
  readOnlyInputBgColor: "bg-white",
  readOnlyInputBorderColor: "border-instillGrey20",
  readOnlyInputBorderStyle: "border-solid",
  readOnlyInputBorderWidth: "border",
  readOnlyInputTextColor: "text-instillGrey95",
  placeholderFontFamily: "placeholder:font-sans",
  placeholderFontSize: "placeholder:text-base",
  placeholderFontWeight: "placeholder:font-normal",
  placeholderLineHeight: "",
  placeholderTextColor:
    "placeholder:text-semantic-node-disconnected-default-stroke",
  labelFontSize: "text-base",
  labelFontWeight: "font-normal",
  labelTextColor: "text-instillGrey90",
  labelLineHeight: "",
  labelFontFamily: "font-sans",
  errorInputBgColor: "bg-white",
  errorLabelFontFamily: "font-sans",
  errorLabelFontSize: "text-base",
  errorLabelFontWeight: "font-normal",
  errorLabelLineHeight: "",
  errorLabelTextColor: "text-instillRed",
  errorInputBorderColor: "border-instillRed",
  errorInputBorderWidth: "border",
  errorInputBorderStyle: "border-solid",
  errorInputTextColor: "text-instillRed",
  autoComplete: "off",
  messageFontSize: "text-xs",
  messageTextColor: "text-instillGrey70",
  messageFontFamily: "font-sans",
  messageFontWeight: "font-normal",
  messageLineHeight: "",
};

export type FullProtectedBasicTextFieldProps = Omit<
  TextFieldBaseProps,
  BasicInputDescriptionOmitKeys | ProtectedBasicTextFieldOmitKeys
>;

export type ProtectedBasicTextFieldRequiredProps = Pick<
  FullProtectedBasicTextFieldProps,
  ProtectedBasicTextFieldRequiredKeys
>;

export type ProtectedBasicTextFieldOptionalProps = Partial<
  Omit<FullProtectedBasicTextFieldProps, ProtectedBasicTextFieldRequiredKeys>
>;

export type ProtectedBasicTextFieldProps =
  ProtectedBasicTextFieldRequiredProps & ProtectedBasicTextFieldOptionalProps;

export const ProtectedBasicTextField = (
  props: ProtectedBasicTextFieldProps
) => {
  const {
    id,
    inputLabelType,
    label,
    onChange,
    value,
    description,
    additionalMessageOnLabel,
    disabled,
    required,
    readOnly,
    error,
    placeholder,
    ...passThrough
  } = props;

  return (
    <TextFieldBase
      {...passThrough}
      id={id}
      inputLabelType={inputLabelType || "normal"}
      value={value}
      label={label}
      onChange={onChange}
      additionalMessageOnLabel={additionalMessageOnLabel ?? null}
      description={description ?? ""}
      disabled={disabled ?? false}
      required={required ?? false}
      error={error ?? null}
      placeholder={placeholder ?? ""}
      readOnly={readOnly ?? false}
      {...protectedBasicTextFieldConfig}
      {...basicInputDescriptionConfig}
    />
  );
};
