import * as React from "react";
import { Nullable, State } from "../../../types/general";
import {
  basicInputDescriptionConfig,
  BasicInputDescriptionOmitKeys,
} from "../../InputDescriptions";
import ToggleFieldBase, { ToggleFieldBaseProps } from "../ToggleFieldBase";

export type StatefulToggleFieldRequiredKeys =
  | "id"
  | "value"
  | "onChange"
  | "label";

export type StatefulToggleFieldOmitKeys =
  | "focusHighlight"
  | "dotColor"
  | "checkedDotColor"
  | "inputBorderRadius"
  | "inputBorderStyle"
  | "inputBorderWidth"
  | "inputBgColor"
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
  | "checkedInputBorderColor"
  | "messageFontFamily"
  | "messageFontSize"
  | "messageFontWeight"
  | "messageLineHeight"
  | "messageTextColor";

export type FullStatefulToggleFieldProps = Omit<
  ToggleFieldBaseProps,
  StatefulToggleFieldOmitKeys | BasicInputDescriptionOmitKeys
>;

export type StatefulToggleFieldConfig = Pick<
  ToggleFieldBaseProps,
  StatefulToggleFieldOmitKeys
>;

export type StatefulToggleFieldRequiredProps = Pick<
  FullStatefulToggleFieldProps,
  StatefulToggleFieldRequiredKeys
>;

export type StatefulToggleFieldOptionalProps = Partial<
  Omit<FullStatefulToggleFieldProps, StatefulToggleFieldRequiredKeys>
>;

export type StatefulToggleFieldProps = StatefulToggleFieldRequiredProps &
  StatefulToggleFieldOptionalProps & {
    state: Nullable<State>;
    loadingLabelText: string;
  };

export const statefulToggleFieldConfig: StatefulToggleFieldConfig = {
  focusHighlight: true,
  dotColor: "bg-instillGrey30",
  checkedDotColor: "bg-instillBlue50",
  inputBgColor: "bg-white",
  inputBorderRadius: "",
  inputBorderStyle: "border-solid",
  inputBorderWidth: "border",
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
  checkedInputBorderColor: "border-instillBlue50",
  messageFontSize: "text-xs",
  messageTextColor: "text-instillGrey70",
  messageFontFamily: "font-sans",
  messageFontWeight: "font-normal",
  messageLineHeight: "",
};

const StatefulToggleField = (props: StatefulToggleFieldProps) => {
  const {
    loadingLabelText,
    id,
    value,
    onChange,
    label,
    state,
    additionalMessageOnLabel,
    description,
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
      onChange={onChange}
      label={label}
      additionalMessageOnLabel={
        state === "STATE_LOADING"
          ? loadingLabelText
          : additionalMessageOnLabel ?? null
      }
      description={description ?? ""}
      error={error ?? null}
      readOnly={readOnly ?? false}
      required={required ?? false}
      disabled={disabled ?? false}
      inputBorderColor={
        state === "STATE_LOADING"
          ? "border-lemonYellow50"
          : "border-instillGrey20"
      }
      inputFocusBorderColor={
        state === "STATE_LOADING" ? "" : "border-instillBlue50"
      }
      inputFocusShadow={
        state === "STATE_LOADING" ? "" : "instill-input-focus-shadow"
      }
      inputShadow={
        state === "STATE_LOADING" ? "instill-toggle-loading-shadow" : null
      }
      {...statefulToggleFieldConfig}
      {...basicInputDescriptionConfig}
    />
  );
};

export default StatefulToggleField;
