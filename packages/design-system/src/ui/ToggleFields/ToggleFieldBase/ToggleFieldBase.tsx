import * as React from "react";
import cn from "clsx";
import { BasicInputProps, Nullable } from "../../../types/general";
import InputLabelBase from "../../InputLabels/InputLabelBase";
import { InputDescriptionBase } from "../../InputDescriptions/InputDescriptionBase";

export type ToggleFieldBaseProps = Omit<
  BasicInputProps,
  | "placeholder"
  | "inputFontSize"
  | "inputLineHeight"
  | "inputFontWeight"
  | "inputTextColor"
  | "inputWidth"
  | "inputHeight"
  | "autoComplete"
  | "inputLabelType"
  | "bgColor"
  | "disabledInputTextColor"
  | "readOnlyInputTextColor"
  | "placeholderFontFamily"
  | "placeholderFontSize"
  | "placeholderFontWeight"
  | "placeholderLineHeight"
  | "placeholderTextColor"
  | "errorInputBgColor"
  | "errorInputBorderColor"
  | "errorInputBorderStyle"
  | "errorInputBorderWidth"
  | "errorInputTextColor"
> &
  Omit<JSX.IntrinsicElements["input"], "onChange" | "value"> & {
    value: boolean;

    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

    /** TailwindCSS format - Toggle center's dot color
     * - Please use background-color, e.g. bg-black
     */

    dotColor: string;

    /** TailwindCSS format - Toggle center's dot color when checked
     * - e.g. bg-black
     */
    checkedDotColor: string;

    /** TailwindCSS format - Toggle border color when checked
     * - e.g. border-black
     */
    checkedInputBorderColor: string;

    /** TailwindCSS format - Toggle input border color when checked and disabled
     * - e.g. border-black
     */
    disabledCheckedInputBorderColor: string;

    /** TailwindCSS format - Toggle center's dot color when disabled
     * - e.g. bg-black
     */
    disabledDotColor: string;

    /** TailwindCSS format - Toggle center's dot color when checked and disabled
     * - e.g. bg-black
     */
    disabledCheckedDotColor: string;

    /** TailwindCSS format - Toggle center's dot color when read-only
     * - e.g. bg-black
     */
    readOnlyDotColor: string;

    /** TailwindCSS format - Toggle center's dot color when checked and read-only
     * - e.g. bg-black
     */

    readOnlyCheckedDotColor: string;

    /** TailwindCSS format - Toggle input border color when checked and read-only
     * - e.g. border-black
     */

    readOnlyCheckedInputBorderColor: string;

    /** TailwindCSS format - Toggle input border color when focus
     * - e.g. border-black
     */

    inputFocusBorderColor: string;

    /** TailwindCSS utility string - setup this custom style at instill plugin and use it
     * - e.g. instill-input-shadow
     * - When shadow string is not null, input field will show the shadow, if you want to display
     *   shadow only when user focus on the input, please use inputFocusShadow
     */
    inputShadow: Nullable<string>;

    /** TailwindCSS utility string - setup this custom style at instill plugin and use it
     * - e.g. instill-input-focus-shadow
     * - Show the shadow when user focus on input
     */
    inputFocusShadow: string;
  };

const ToggleFieldBase = (props: ToggleFieldBaseProps) => {
  const {
    id,
    value,
    label,
    additionalMessageOnLabel,
    messageFontFamily,
    messageFontSize,
    messageFontWeight,
    messageLineHeight,
    messageTextColor,
    description,
    disabled,
    readOnly,
    focusHighlight,
    required,
    onChange,
    inputBorderRadius,
    inputBorderColor,
    inputBorderStyle,
    inputBorderWidth,
    inputBgColor,
    inputShadow,
    inputFocusBorderColor,
    inputFocusShadow,
    dotColor,
    checkedDotColor,
    checkedInputBorderColor,
    disabledCursor,
    disabledInputBgColor,
    disabledInputBorderColor,
    disabledInputBorderStyle,
    disabledInputBorderWidth,
    disabledCheckedInputBorderColor,
    disabledDotColor,
    disabledCheckedDotColor,
    readOnlyCursor,
    readOnlyInputBgColor,
    readOnlyInputBorderColor,
    readOnlyInputBorderStyle,
    readOnlyInputBorderWidth,
    readOnlyDotColor,
    readOnlyCheckedInputBorderColor,
    readOnlyCheckedDotColor,
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
    error,
    errorLabelFontFamily,
    errorLabelFontSize,
    errorLabelFontWeight,
    errorLabelLineHeight,
    errorLabelTextColor,
    onFocus,
    onBlur,
    onClick,
    ...passThrough
  } = props;

  const [focus, setFocus] = React.useState(false);

  return (
    <div className="flex flex-col">
      <div className={cn("flex flex-col", { "mb-2.5": description })}>
        <div className={label ? "mb-2.5" : ""}>
          <InputLabelBase
            message={additionalMessageOnLabel}
            messageFontFamily={messageFontFamily}
            messageFontSize={messageFontSize}
            messageFontWeight={messageFontWeight}
            messageLineHeight={messageLineHeight}
            messageTextColor={messageTextColor}
            required={required}
            htmlFor={`${id}-label`}
            type="normal"
            label={label}
            labelFontFamily={labelFontFamily}
            labelFontSize={labelFontSize}
            labelFontWeight={labelFontWeight}
            labelLineHeight={labelLineHeight}
            labelTextColor={labelTextColor}
            error={error}
            errorLabelFontFamily={errorLabelFontFamily}
            errorLabelFontSize={errorLabelFontSize}
            errorLabelFontWeight={errorLabelFontWeight}
            errorLabelLineHeight={errorLabelLineHeight}
            errorLabelTextColor={errorLabelTextColor}
          />
        </div>
        <label
          htmlFor={id}
          className={cn("relative flex h-10 w-[90px]", inputBgColor)}
        >
          <input
            {...passThrough}
            id={id}
            aria-label={`${id}-label`}
            className={cn(
              "peer h-10 w-[90px] appearance-none",
              inputBorderRadius,
              inputShadow,
              disabled
                ? "cursor-not-allowed"
                : readOnly
                ? "cursor-not-allowed"
                : "cursor-pointer",
              disabled
                ? cn(
                    disabledCursor,
                    disabledInputBgColor,
                    disabledInputBorderStyle,
                    disabledInputBorderWidth,
                    value
                      ? disabledCheckedInputBorderColor
                      : disabledInputBorderColor
                  )
                : readOnly
                ? cn(
                    readOnlyCursor,
                    readOnlyInputBgColor,
                    readOnlyInputBorderStyle,
                    readOnlyInputBorderWidth,
                    value
                      ? readOnlyCheckedInputBorderColor
                      : readOnlyInputBorderColor
                  )
                : focusHighlight
                ? focus
                  ? cn(
                      inputBorderWidth,
                      inputBorderStyle,
                      inputFocusBorderColor,
                      inputFocusShadow
                    )
                  : cn(
                      inputBorderStyle,
                      value ? checkedInputBorderColor : inputBorderColor,
                      inputBorderWidth
                    )
                : cn(inputBorderColor, inputBorderStyle, inputBorderWidth)
            )}
            checked={value}
            type="checkbox"
            role="switch"
            disabled={disabled}
            readOnly={readOnly}
            onChange={(event) => {
              if (readOnly) return;
              if (onChange) onChange(event);
            }}
            onClick={(event) => {
              if (onClick) onClick(event);
              if (readOnly) {
                event.stopPropagation();
                event.preventDefault();
                return false;
              }
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
          <div
            className={cn(
              "absolute left-[5px] top-[5px] h-[30px] w-[30px] origin-top-left transition peer-checked:translate-x-[50px]",
              disabled
                ? cn(
                    value ? disabledCheckedDotColor : disabledDotColor,
                    "cursor-not-allowed"
                  )
                : readOnly
                ? cn(
                    value ? readOnlyCheckedDotColor : readOnlyDotColor,
                    "cursor-auto"
                  )
                : cn(checkedDotColor, "cursor-pointer"),
              value ? checkedDotColor : dotColor,
              inputBorderRadius
            )}
          />
        </label>
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

export default ToggleFieldBase;
