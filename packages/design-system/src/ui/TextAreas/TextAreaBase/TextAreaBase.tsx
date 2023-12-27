import * as React from "react";
import cn from "clsx";
import { BasicInputProps, Nullable } from "../../../types/general";
import InputLabelBase from "../../InputLabels/InputLabelBase";
import { InputDescriptionBase } from "../../InputDescriptions/InputDescriptionBase";

export type TextAreaBaseProps = BasicInputProps &
  Omit<JSX.IntrinsicElements["textarea"], "onChange" | "value"> & {
    /** Textarea value */
    value: Nullable<string>;

    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;

    /** Control how textarea can be resized
     * This component currently not support resize
     */
    // resize: "both" | "none" | "x" | "y";

    /**
     * Enable textarea words counter
     */
    enableCounter: boolean;

    /**
     * Textarea counter's words limit
     */
    counterWordLimit: number;

    /** TailwindCSS format - Font size of textarea's counter
     * - e.g. text-base
     * - https://tailwindcss.com/docs/font-size
     */
    counterFontSize: string;

    /** TailwindCSS format - Font family of textarea's counter
     * - e.g. font-sans
     * - https://tailwindcss.com/docs/font-family
     */
    counterFontFamily: string;

    /** TailwindCSS format - Font weight of textarea's counter
     * - e.g. font-normal
     * - https://tailwindcss.com/docs/font-weight
     */
    counterFontWeight: string;

    /** TailwindCSS format - Text color of textarea's counter
     * - e.g. text-instillGrey50
     * - https://tailwindcss.com/docs/text-color
     */
    counterTextColor: string;

    /** TailwindCSS format - Line height of textarea's counter
     * - e.g. leading-normal
     * - https://tailwindcss.com/docs/line-height
     */
    counterLineHeight: string;
  };

const TextAreaBase = (props: TextAreaBaseProps) => {
  const {
    id,
    value,
    onChange,
    required,
    additionalMessageOnLabel,
    messageFontFamily,
    messageFontSize,
    messageFontWeight,
    messageLineHeight,
    messageTextColor,
    description,
    error,
    label,
    inputBgColor,
    inputFontSize,
    inputTextColor,
    inputFontWeight,
    inputLineHeight,
    bgColor,
    inputWidth,
    inputHeight,
    autoComplete,
    focusHighlight,
    disabled,
    disabledCursor,
    disabledInputBgColor,
    disabledInputBorderColor,
    disabledInputBorderStyle,
    disabledInputBorderWidth,
    disabledInputTextColor,
    readOnly,
    readOnlyCursor,
    readOnlyInputBgColor,
    readOnlyInputBorderColor,
    readOnlyInputBorderStyle,
    readOnlyInputBorderWidth,
    readOnlyInputTextColor,
    placeholder,
    placeholderFontFamily,
    placeholderFontSize,
    placeholderFontWeight,
    placeholderLineHeight,
    placeholderTextColor,
    // resize,
    inputLabelType,
    inputBorderRadius,
    inputBorderColor,
    inputBorderStyle,
    inputBorderWidth,
    enableCounter,
    counterWordLimit,
    counterFontFamily,
    counterFontSize,
    counterFontWeight,
    counterLineHeight,
    counterTextColor,
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
    onFocus,
    onBlur,
    ...passThrough
  } = props;

  const [focus, setFocus] = React.useState(false);

  // let resizeStyle: string;

  // switch (resize) {
  //   case "both":
  //     resizeStyle = "resize";
  //     break;
  //   case "none":
  //     resizeStyle = "resize-none";
  //     break;
  //   case "x":
  //     resizeStyle = "resize-x";
  //     break;
  //   case "y":
  //     resizeStyle = "resize-y";
  //     break;
  // }

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
        className={cn(
          "relative flex flex-col",
          inputWidth,
          inputBorderRadius,
          bgColor,
          { "mb-2.5": description }
        )}
      >
        <div className={label ? "mb-2.5" : ""}>
          <InputLabelBase
            ref={inputLabelRef}
            label={label}
            message={additionalMessageOnLabel}
            error={error}
            required={required}
            htmlFor={id}
            type={inputLabelType}
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
        <div className="relative flex">
          <textarea
            {...passThrough}
            id={id}
            value={value ? value : ""}
            className={cn(
              "flex min-h-[100px] resize-none px-5",
              inputBgColor,
              inputWidth,
              inputHeight,
              inputFontSize,
              inputFontWeight,
              inputLineHeight,
              placeholderFontFamily,
              placeholderFontSize,
              placeholderFontWeight,
              placeholderLineHeight,
              placeholderTextColor,
              disabled
                ? cn(disabledCursor, "text-instillGrey50")
                : readOnly
                ? cn(readOnlyCursor, "text-instillGrey50")
                : inputTextColor,
              cn(getInputStyle, "pt-5")
            )}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            readOnly={readOnly}
            autoComplete={autoComplete}
            onChange={(event) => {
              if (onChange) onChange(event);
            }}
            onFocus={(event) => {
              if (onFocus) onFocus(event);
              setFocus(true);
            }}
            onBlur={(event) => {
              if (onBlur) onBlur(event);
              setFocus(false);
            }}
          />
          {enableCounter ? (
            <div
              className={cn(
                counterFontSize,
                counterFontWeight,
                counterFontFamily,
                counterLineHeight,
                counterTextColor,
                "absolute bottom-2 right-4"
              )}
            >{`${value ? value.length : 0}/${counterWordLimit}`}</div>
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

export default TextAreaBase;
