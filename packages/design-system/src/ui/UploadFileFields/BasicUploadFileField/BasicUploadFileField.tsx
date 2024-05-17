import * as React from "react";
import {
  basicInputDescriptionConfig,
  BasicInputDescriptionOmitKeys,
} from "../../InputDescriptions";
import UploadFileFieldBase, {
  UploadFileFieldBaseProps,
} from "../UploadFileFieldBase";

export type BasicUploadFileFieldRequiredKeys =
  | "id"
  | "onChange"
  | "label"
  | "uploadButtonText";

export type BasicUploadFileFieldOmitKeys =
  | "uploadButtonFontSize"
  | "uploadButtonFontWeight"
  | "uploadButtonBgColor"
  | "uploadButtonTextColor"
  | "uploadButtonHoverBgColor"
  | "uploadButtonHoverTextColor"
  | "inputBorderRadiusBottomLeft"
  | "inputBorderRadiusBottomRight"
  | "inputBorderRadiusTopLeft"
  | "inputBorderRadiusTopRight"
  | "inputBgColor"
  | "inputFontSize"
  | "inputFontWeight"
  | "inputLineHeight"
  | "inputTextColor"
  | "inputWidth"
  | "inputHeight"
  | "focusHighlight"
  | "inputBorderColor"
  | "inputBorderStyle"
  | "inputBorderWidth"
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
  | "errorInputBorderColor"
  | "errorInputBorderWidth"
  | "errorInputBorderStyle"
  | "errorInputTextColor"
  | "errorInputBgColor"
  | "disabledInputBgColor"
  | "disabledInputBorderColor"
  | "disabledInputBorderStyle"
  | "disabledInputBorderWidth"
  | "disabledInputTextColor"
  | "readOnlyInputBgColor"
  | "readOnlyInputBorderColor"
  | "readOnlyInputBorderStyle"
  | "readOnlyInputBorderWidth"
  | "readOnlyInputTextColor"
  | "messageFontFamily"
  | "messageFontSize"
  | "messageFontWeight"
  | "messageLineHeight"
  | "messageTextColor"
  | "placeholderFontFamily"
  | "placeholderFontSize"
  | "placeholderFontWeight"
  | "placeholderLineHeight"
  | "placeholderTextColor";

export type FullBasicUploadFileFieldProps = Omit<
  UploadFileFieldBaseProps,
  BasicUploadFileFieldOmitKeys | BasicInputDescriptionOmitKeys
>;

export type BasicUploadFileFieldRequiredProps = Pick<
  FullBasicUploadFileFieldProps,
  BasicUploadFileFieldRequiredKeys
>;

export type BasicUploadFileFieldOptionalProps = Partial<
  Omit<FullBasicUploadFileFieldProps, BasicUploadFileFieldRequiredKeys>
>;

export type BasicUploadFileFieldConfig = Pick<
  UploadFileFieldBaseProps,
  BasicUploadFileFieldOmitKeys
>;

export type BasicUploadFileFieldProps = BasicUploadFileFieldOptionalProps &
  BasicUploadFileFieldRequiredProps;

export const basicUploadFileFieldConfig: BasicUploadFileFieldConfig = {
  uploadButtonFontSize: "text-sm",
  uploadButtonFontWeight: "font-normal",
  uploadButtonBgColor: "bg-instillBlue10",
  uploadButtonTextColor: "text-instillBlue50",
  uploadButtonHoverBgColor: "group-hover:bg-instillBlue50",
  uploadButtonHoverTextColor: "group-hover:text-instillGrey05",
  inputBorderRadiusBottomLeft: "rounded-bl-[1px]",
  inputBorderRadiusBottomRight: "rounded-br-[1px]",
  inputBorderRadiusTopLeft: "rounded-tl-[1px]",
  inputBorderRadiusTopRight: "rounded-tr-[1px]",
  inputBgColor: "bg-white",
  inputFontSize: "text-base",
  inputFontWeight: "font-normal",
  inputLineHeight: "",
  inputTextColor: "text-instillGrey95",
  inputWidth: "w-full",
  inputHeight: "h-[44px]",
  focusHighlight: true,
  inputBorderColor: "border-instillGrey20",
  inputBorderStyle: "border-solid",
  inputBorderWidth: "border",
  labelFontSize: "text-base",
  labelFontWeight: "font-normal",
  labelTextColor: "text-instillGrey90",
  labelLineHeight: "",
  labelFontFamily: "font-sans",
  errorLabelFontFamily: "font-sans",
  errorLabelFontSize: "text-base",
  errorLabelFontWeight: "font-normal",
  errorLabelLineHeight: "",
  errorLabelTextColor: "text-instillRed",
  errorInputBorderColor: "border-instillRed",
  errorInputBorderWidth: "border",
  errorInputBorderStyle: "border-solid",
  errorInputTextColor: "text-instillRed",
  errorInputBgColor: "bg-white",
  disabledInputBgColor: "bg-white",
  disabledInputBorderColor: "border-instillGrey20",
  disabledInputBorderStyle: "border-dashed",
  disabledInputBorderWidth: "border",
  disabledInputTextColor: "text-semantic-node-disconnected-default-stroke",
  readOnlyInputBgColor: "bg-white",
  readOnlyInputBorderColor: "border-instillGrey20",
  readOnlyInputBorderStyle: "border-solid",
  readOnlyInputBorderWidth: "border",
  readOnlyInputTextColor: "text-semantic-node-disconnected-default-stroke",
  messageFontSize: "text-xs",
  messageTextColor: "text-semantic-node-connector-on",
  messageFontFamily: "font-sans",
  messageFontWeight: "font-normal",
  messageLineHeight: "",
  placeholderFontFamily: "placeholder:font-sans",
  placeholderFontSize: "placeholder:text-base",
  placeholderFontWeight: "placeholder:font-normal",
  placeholderLineHeight: "",
  placeholderTextColor:
    "placeholder:text-semantic-node-disconnected-default-stroke",
};

const BasicUploadFileField = (props: BasicUploadFileFieldProps) => {
  const {
    id,
    inputLabelType,
    label,
    onChange,
    uploadButtonText,
    additionalMessageOnLabel,
    error,
    description,
    disabled,
    readOnly,
    required,
    placeholder,
    ...passThrough
  } = props;

  return (
    <UploadFileFieldBase
      {...passThrough}
      id={id}
      inputLabelType={inputLabelType || "normal"}
      label={label}
      onChange={onChange}
      uploadButtonText={uploadButtonText}
      additionalMessageOnLabel={additionalMessageOnLabel ?? null}
      error={error ?? null}
      description={description ?? ""}
      disabled={disabled ?? false}
      readOnly={readOnly ?? false}
      required={required ?? false}
      placeholder={placeholder ?? ""}
      {...basicUploadFileFieldConfig}
      {...basicInputDescriptionConfig}
    />
  );
};

export default BasicUploadFileField;
