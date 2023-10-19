import * as React from "react";
import cn from "clsx";
import EyeOffIcon from "../../Icons/EyeOffIcon";
import EyeOnIcon from "../../Icons/EyeOnIcon";
import { BasicInputProps, Nullable } from "../../../types/general";
import InputLabelBase from "../../InputLabels/InputLabelBase";
import { InputDescriptionBase } from "../../InputDescriptions/InputDescriptionBase";

export type TextFieldBaseProps = BasicInputProps &
  Omit<JSX.IntrinsicElements["input"], "onChange" | "value"> & {
    /** Text field's type
     * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
     */
    type: string;

    /** Whether enable protected text toggle or not */
    enableProtectedToggle: boolean;

    value: Nullable<string>;

    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  };

const TextFieldBase = (props: TextFieldBaseProps) => {
  const {
    onChange,
    id,
    additionalMessageOnLabel,
    messageFontFamily,
    messageFontSize,
    messageFontWeight,
    messageLineHeight,
    messageTextColor,
    required,
    value,
    error,
    errorInputBgColor,
    errorInputBorderColor,
    errorInputBorderStyle,
    errorInputBorderWidth,
    errorInputTextColor,
    errorLabelFontFamily,
    errorLabelFontSize,
    errorLabelFontWeight,
    errorLabelLineHeight,
    errorLabelTextColor,
    label,
    description,
    inputBgColor,
    inputFontSize,
    inputFontWeight,
    inputLineHeight,
    inputTextColor,
    bgColor,
    disabled,
    disabledInputBgColor,
    disabledInputBorderStyle,
    disabledInputBorderColor,
    disabledInputBorderWidth,
    disabledInputTextColor,
    disabledCursor,
    readOnly,
    readOnlyInputBgColor,
    readOnlyInputBorderColor,
    readOnlyInputBorderStyle,
    readOnlyInputBorderWidth,
    readOnlyInputTextColor,
    readOnlyCursor,
    inputWidth,
    inputHeight,
    autoComplete,
    focusHighlight,
    type,
    placeholder,
    placeholderFontFamily,
    placeholderFontSize,
    placeholderFontWeight,
    placeholderLineHeight,
    placeholderTextColor,
    enableProtectedToggle,
    inputLabelType,
    inputBorderRadius,
    inputBorderColor,
    inputBorderStyle,
    inputBorderWidth,
    labelFontFamily,
    labelFontSize,
    labelFontWeight,
    labelLineHeight,
    labelTextColor,
    descriptionWidth,
    descriptionFontFamily,
    descriptionFontSize,
    descriptionFontWeight,
    descriptionLineHeight,
    descriptionTextColor,
    descriptionLinkTextColor,
    descriptionLinkTextDecoration,
    onFocus,
    onBlur,
    ...passThrough
  } = props;

  const [focus, setFocus] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);
  const inputLabelRef = React.useRef<HTMLLabelElement>(null);

  const getInputStyle = error
    ? cn(
        errorInputBgColor,
        errorInputBorderColor,
        errorInputBorderStyle,
        errorInputBorderWidth,
        errorInputTextColor,
        "instill-input-no-highlight"
      )
    : disabled
    ? cn(
        disabledCursor,
        disabledInputBgColor,
        disabledInputBorderColor,
        disabledInputBorderStyle,
        disabledInputBorderWidth,
        disabledInputTextColor,
        "instill-input-no-highlight"
      )
    : readOnly
    ? cn(
        readOnlyCursor,
        readOnlyInputBgColor,
        readOnlyInputBorderColor,
        readOnlyInputBorderStyle,
        readOnlyInputBorderWidth,
        readOnlyInputTextColor,
        "instill-input-no-highlight"
      )
    : focusHighlight
    ? focus
      ? cn(
          inputBorderWidth,
          inputBorderStyle,
          "outline-none ring-0 ring-white border-instillBlue50 instill-input-focus-shadow cursor-text"
        )
      : cn(inputBorderColor, inputBorderStyle, inputBorderWidth, "cursor-text")
    : cn(inputBorderColor, inputBorderStyle, inputBorderWidth, "cursor-text");

  return (
    <div className="flex flex-col">
      <div
        className={cn("flex flex-col relative", inputWidth, inputBorderRadius, {
          "mb-2.5": description,
        })}
      >
        <div className={label ? "mb-2.5" : ""}>
          <InputLabelBase
            ref={inputLabelRef}
            error={error}
            message={additionalMessageOnLabel}
            required={required}
            htmlFor={id}
            type={inputLabelType}
            label={label}
            labelFontFamily={labelFontFamily}
            labelFontSize={labelFontSize}
            labelFontWeight={labelFontWeight}
            labelLineHeight={labelLineHeight}
            labelTextColor={labelTextColor}
            errorLabelFontFamily={errorLabelFontFamily}
            errorLabelFontSize={errorLabelFontSize}
            errorLabelFontWeight={errorLabelFontWeight}
            errorLabelLineHeight={errorLabelLineHeight}
            errorLabelTextColor={errorLabelTextColor}
            messageFontFamily={messageFontFamily}
            messageFontSize={messageFontSize}
            messageFontWeight={messageFontWeight}
            messageLineHeight={messageLineHeight}
            messageTextColor={messageTextColor}
          />
        </div>
        <div className="flex relative">
          <input
            {...passThrough}
            value={value ? value : ""}
            className={cn(
              "pl-5",
              getInputStyle,
              inputBgColor,
              inputHeight ? inputHeight : "py-2.5",
              inputWidth,
              inputFontSize,
              inputLineHeight,
              inputFontWeight,
              bgColor,
              inputBorderRadius,
              placeholderFontFamily,
              placeholderFontSize,
              placeholderFontWeight,
              placeholderLineHeight,
              placeholderTextColor,
              disabled
                ? cn(disabledCursor, "text-instillGrey50")
                : readOnly
                ? cn(readOnlyCursor, "text-instillGrey50")
                : inputTextColor
            )}
            id={id}
            type={showSecret ? "text" : type}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            readOnly={readOnly}
            autoComplete={autoComplete}
            onChange={(event) => {
              if (onChange) onChange(event);
            }}
            onFocus={(e) => {
              if (onFocus) onFocus(e);
              setFocus(true);
            }}
            onBlur={(e) => {
              if (onBlur) onBlur(e);
              setFocus(false);
            }}
          />
          {enableProtectedToggle ? (
            <div className="absolute flex transform-gpu right-5 top-1/2 -translate-y-1/2">
              <button
                className="my-auto"
                type="button"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? (
                  <EyeOffIcon
                    width="w-6"
                    height="h-6"
                    color="text-instillGrey50"
                    position="my-auto"
                  />
                ) : (
                  <EyeOnIcon
                    width="w-6"
                    height="h-6"
                    color="text-instillGrey50"
                    position="my-auto"
                  />
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <InputDescriptionBase
        description={description}
        descriptionWidth={descriptionWidth}
        descriptionFontFamily={descriptionFontFamily}
        descriptionFontSize={descriptionFontSize}
        descriptionFontWeight={descriptionFontWeight}
        descriptionLineHeight={descriptionLineHeight}
        descriptionTextColor={descriptionTextColor}
        descriptionLinkTextColor={descriptionLinkTextColor}
        descriptionLinkTextDecoration={descriptionLinkTextDecoration}
      />
    </div>
  );
};

export default TextFieldBase;
