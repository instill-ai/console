import * as React from "react";
import {
  basicInputDescriptionConfig,
  BasicInputDescriptionOmitKeys,
} from "../../InputDescriptions";
import ToggleFieldBase, { ToggleFieldBaseProps } from "../ToggleFieldBase";

export type BasicToggleFieldRequiredKeys =
  | "id"
  | "value"
  | "onChange"
  | "label";

export type BasicToggleFieldOmitKeys =
  | "focusHighlight"
  | "dotColor"
  | "checkedDotColor"
  | "inputBorderRadius"
  | "inputBorderColor"
  | "inputBorderStyle"
  | "inputBorderWidth"
  | "inputBgColor"
  | "inputShadow"
  | "inputFocusBorderColor"
  | "inputFocusShadow"
  | "checkedInputBorderColor"
  | "disabledDotColor"
  | "disabledCheckedDotColor"
  | "disabledCursor"
  | "disabledInputBgColor"
  | "disabledInputBorderColor"
  | "disabledInputBorderStyle"
  | "disabledInputBorderWidth"
  | "disabledCheckedInputBorderColor"
  | "readOnlyCursor"
  | "readOnlyInputBgColor"
  | "readOnlyInputBorderColor"
  | "readOnlyInputBorderStyle"
  | "readOnlyInputBorderWidth"
  | "readOnlyCheckedInputBorderColor"
  | "readOnlyCheckedDotColor"
  | "readOnlyDotColor"
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

export type FullBasicToggleFieldProps = Omit<
  ToggleFieldBaseProps,
  BasicToggleFieldOmitKeys | BasicInputDescriptionOmitKeys
>;

export type BasicToggleFieldRequiredProps = Pick<
  FullBasicToggleFieldProps,
  BasicToggleFieldRequiredKeys
>;

export type BasicToggleFieldOptionalProps = Partial<
  Omit<FullBasicToggleFieldProps, BasicToggleFieldRequiredKeys>
>;

export type BasicToggleFieldConfig = Pick<
  ToggleFieldBaseProps,
  BasicToggleFieldOmitKeys
>;

export type BasicToggleFieldProps = BasicToggleFieldRequiredProps &
  BasicToggleFieldOptionalProps;

export const basicToggleFieldConfig: BasicToggleFieldConfig = {
  focusHighlight: true,
  dotColor: "bg-instillGrey30",
  checkedDotColor: "bg-instillBlue50",
  inputBgColor: "bg-white",
  inputBorderRadius: "",
  inputBorderColor: "border-instillGrey20",
  inputBorderStyle: "border-solid",
  inputBorderWidth: "border",
  inputShadow: null,
  inputFocusBorderColor: "border-instillBlue50",
  inputFocusShadow: "instill-input-focus-shadow",
  checkedInputBorderColor: "border-instillBlue50",
  disabledDotColor: "bg-instillGrey20",
  disabledCheckedDotColor: "bg-[#8DF5FF]",
  disabledCursor: "cursor-not-allowed",
  disabledInputBgColor: "bg-white",
  disabledInputBorderColor: "border-instillGrey20",
  disabledInputBorderStyle: "border-dashed",
  disabledInputBorderWidth: "border",
  disabledCheckedInputBorderColor: "border-instillGrey20",
  readOnlyCursor: "cursor-auto",
  readOnlyInputBgColor: "bg-white",
  readOnlyInputBorderColor: "border-instillGrey20",
  readOnlyInputBorderStyle: "border-solid",
  readOnlyInputBorderWidth: "border",
  readOnlyCheckedInputBorderColor: "border-[#8DF5FF]",
  readOnlyCheckedDotColor: "bg-[#8DF5FF]",
  readOnlyDotColor: "bg-instillGrey20",
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
  messageFontSize: "text-xs",
  messageTextColor: "text-instillGrey70",
  messageFontFamily: "font-sans",
  messageFontWeight: "font-normal",
  messageLineHeight: "",
};

const BasicToggleField = (props: BasicToggleFieldProps) => {
  const {
    id,
    value,
    label,
    onChange,
    description,
    additionalMessageOnLabel,
    error,
    readOnly,
    required,
    disabled,
    ...passThrough
  } = props;

  return (
    <ToggleFieldBase
      {...passThrough}
      id={id}
      value={value}
      label={label}
      onChange={onChange}
      description={description ?? ""}
      additionalMessageOnLabel={additionalMessageOnLabel ?? null}
      error={error ?? null}
      readOnly={readOnly ?? false}
      required={required ?? false}
      disabled={disabled ?? false}
      {...basicToggleFieldConfig}
      {...basicInputDescriptionConfig}
    />
  );
};

export default BasicToggleField;
