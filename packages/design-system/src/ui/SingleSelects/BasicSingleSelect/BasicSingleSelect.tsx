import * as React from "react";
import {
  basicInputDescriptionConfig,
  BasicInputDescriptionOmitKeys,
} from "../../InputDescriptions";
import SingleSelectBase, { SingleSelectBaseProps } from "../SingleSelectBase";

export type BasicSingleSelectRequiredKeys =
  | "id"
  | "label"
  | "value"
  | "options"
  | "onChange";

export type BasicSingleSelectOmitKeys =
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
  | "messageTextColor"
  | "inputBorderColor"
  | "inputBorderRadius"
  | "inputBorderStyle"
  | "inputBorderWidth"
  | "inputBgColor"
  | "selectPopoverBgColor"
  | "selectPopoverBorderColor"
  | "selectPopoverBorderRadius"
  | "selectPopoverBorderStyle"
  | "selectPopoverBorderWidth"
  | "selectPopoverPadding"
  | "selectItemTextIconGap";

export type FullBasicSingleSelectProps = Omit<
  SingleSelectBaseProps,
  BasicSingleSelectOmitKeys | BasicInputDescriptionOmitKeys
>;

export type BasicSingleSelectRequiredProps = Pick<
  FullBasicSingleSelectProps,
  BasicSingleSelectRequiredKeys
>;

export type BasicSingleSelectOptionalProps = Partial<
  Omit<FullBasicSingleSelectProps, BasicSingleSelectRequiredKeys>
>;

export type BasicSingleSelectConfig = Pick<
  SingleSelectBaseProps,
  BasicSingleSelectOmitKeys
>;

export const basicSingleSelectConfig: BasicSingleSelectConfig = {
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
  inputBorderColor: "border-instillGrey20",
  inputBorderRadius: "",
  inputBorderStyle: "border-solid",
  inputBorderWidth: "border",
  inputBgColor: "bg-white",
  selectPopoverBgColor: "bg-white",
  selectPopoverBorderColor: "border-instillGrey20",
  selectPopoverBorderRadius: "",
  selectPopoverBorderStyle: "border-solid",
  selectPopoverBorderWidth: "border",
  selectPopoverPadding: "py-5",
  selectItemTextIconGap: "gap-x-2",
};

export type BasicSingleSelectProps = BasicSingleSelectRequiredProps &
  BasicSingleSelectOptionalProps;

export const BasicSingleSelect = (props: BasicSingleSelectProps) => {
  const {
    id,
    onChange,
    value,
    options,
    label,
    additionalMessageOnLabel,
    description,
    error,
    disabled,
    readOnly,
    required,
    inputLabelType,
    placeholder,
    debug,
  } = props;

  return (
    <SingleSelectBase
      id={id}
      inputLabelType={inputLabelType || "normal"}
      onChange={onChange}
      value={value}
      options={options}
      label={label}
      additionalMessageOnLabel={additionalMessageOnLabel ?? null}
      description={description ?? ""}
      error={error ?? null}
      disabled={disabled ?? false}
      readOnly={readOnly ?? false}
      required={required ?? false}
      placeholder={placeholder || null}
      debug={debug}
      {...basicInputDescriptionConfig}
      {...basicSingleSelectConfig}
    />
  );
};
