import * as React from "react";
import { BasicInputProps, Nullable } from "../../../types/general";
import cn from "clsx";
import { DocIcon } from "../../Icons";
import InputLabelBase from "../../InputLabels/InputLabelBase";
import { InputDescriptionBase } from "../../InputDescriptions/InputDescriptionBase";

export type UploadFileFieldBaseProps = Omit<
  BasicInputProps,
  | "autoComplete"
  | "bgColor"
  | "inputBorderRadius"
  | "disabledCursor"
  | "readOnlyCursor"
  // | "placeholderFontFamily"
  // | "placeholderFontSize"
  // | "placeholderFontWeight"
  // | "placeholderLineHeight"
  // | "placeholderTextColor"
> &
  Omit<JSX.IntrinsicElements["input"], "onChange" | "value"> & {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

    /** Text display on upload button */
    uploadButtonText: string;

    /** TailwindCSS format
     * - e.g. text-sm
     */
    uploadButtonFontSize: string;

    /** TailwindCSS format
     * - e.g. font-medium
     */
    uploadButtonFontWeight: string;

    /** TailwindCSS format
     * - e.g. bg-instillGrey50
     */
    uploadButtonBgColor: string;

    /** TailwindCSS format
     * - use group-hover utility
     * - e.g. group-hover:bg-instillGrey50
     */
    uploadButtonHoverBgColor: string;

    /** TailwindCSS format
     * - e.g. text-instillGrey05
     */
    uploadButtonTextColor: string;

    /** TailwindCSS format
     * - use group-hover utility
     * - e.g. group-hover:text-instillGrey50
     */
    uploadButtonHoverTextColor: string;

    /** TailwindCSS format - Input's top right border radius
     * - e.g. rounded-tr-[1px]
     */
    inputBorderRadiusTopRight: string;

    /** TailwindCSS format - Input's bottom right border radius
     * - e.g. rounded-br-[1px]
     */
    inputBorderRadiusBottomRight: string;

    /** TailwindCSS format - Input's top left border radius
     * - e.g. rounded-tl-[1px]
     */
    inputBorderRadiusTopLeft: string;

    /** TailwindCSS format - Input's bottom left border radius
     * - e.g. rounded-bl-[1px]
     */
    inputBorderRadiusBottomLeft: string;
  };

const UploadFileFieldBase = (props: UploadFileFieldBaseProps) => {
  const {
    id,
    label,
    error,
    additionalMessageOnLabel,
    messageFontFamily,
    messageFontSize,
    messageFontWeight,
    messageLineHeight,
    messageTextColor,
    inputLabelType,
    description,
    required,
    inputWidth,
    inputHeight,
    uploadButtonText,
    uploadButtonFontSize,
    uploadButtonFontWeight,
    uploadButtonBgColor,
    uploadButtonTextColor,
    uploadButtonHoverBgColor,
    uploadButtonHoverTextColor,
    inputBorderRadiusTopRight,
    inputBorderRadiusBottomRight,
    inputBorderRadiusTopLeft,
    inputBorderRadiusBottomLeft,
    inputBgColor,
    inputFontSize,
    inputFontWeight,
    inputLineHeight,
    inputTextColor,
    onChange,
    disabled,
    readOnly,
    inputBorderColor,
    inputBorderStyle,
    inputBorderWidth,
    focusHighlight,
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
    disabledInputBgColor,
    disabledInputBorderColor,
    disabledInputBorderStyle,
    disabledInputBorderWidth,
    disabledInputTextColor,
    readOnlyInputBgColor,
    readOnlyInputBorderColor,
    readOnlyInputBorderStyle,
    readOnlyInputBorderWidth,
    readOnlyInputTextColor,
    onClick,
    placeholder,
    placeholderFontFamily,
    placeholderFontSize,
    placeholderFontWeight,
    placeholderLineHeight,
    placeholderTextColor,
    ...passThrough
  } = props;

  const [answered, setAnswered] = React.useState(false);
  const [file, setFile] = React.useState<Nullable<string>>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputOnClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (readOnly) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const handleButtonOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (readOnly || disabled) return;

    if (answered) {
      event.preventDefault();
      setFile("");
      setFileInputKey(Math.random().toString(36));
      setAnswered(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const [fileInputKey, setFileInputKey] = React.useState<string>("");

  React.useEffect(() => {
    setFileInputKey(Math.random().toString(36));
  }, []);

  return (
    <div className="flex flex-col">
      <div
        className={cn("group relative flex flex-col", {
          "mb-2.5": description,
        })}
      >
        <div className={label ? "mb-2.5" : ""}>
          <InputLabelBase
            message={additionalMessageOnLabel}
            required={required}
            htmlFor={id}
            type={inputLabelType}
            label={label}
            error={error}
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
        <label
          htmlFor={id}
          className={cn(
            "relative flex cursor-pointer flex-row p-0",
            inputWidth,
            inputHeight,
            inputBorderRadiusBottomLeft,
            inputBorderRadiusBottomRight,
            inputBorderRadiusTopLeft,
            inputBorderRadiusTopRight,
            error
              ? cn(
                  errorInputBorderColor,
                  errorInputBorderStyle,
                  errorInputBorderWidth,
                  errorInputBgColor
                )
              : disabled
                ? cn(
                    "instill-input-no-highlight",
                    disabledInputBorderColor,
                    disabledInputBorderStyle,
                    disabledInputBorderWidth,
                    disabledInputBgColor
                  )
                : readOnly
                  ? cn(
                      "instill-input-no-highlight",
                      readOnlyInputBorderColor,
                      readOnlyInputBorderStyle,
                      readOnlyInputBorderWidth,
                      readOnlyInputBgColor
                    )
                  : focusHighlight
                    ? cn(
                        inputBorderWidth,
                        inputBorderColor,
                        inputBorderStyle,
                        inputBgColor,
                        "instill-input-highlight"
                      )
                    : cn(
                        inputBorderColor,
                        inputBorderStyle,
                        inputBorderWidth,
                        inputBgColor,
                        "instill-input-no-highlight"
                      )
          )}
        >
          <div className={"my-auto mr-auto flex pl-5"}>
            {file ? (
              <div className="flex flex-row gap-x-2.5">
                <DocIcon
                  width="w-5"
                  height="h-5"
                  position="my-auto"
                  color={
                    error
                      ? errorInputTextColor
                      : disabled
                        ? disabledInputTextColor
                        : readOnly
                          ? readOnlyInputTextColor
                          : inputTextColor
                  }
                />

                <div
                  className={cn(
                    inputFontSize,
                    inputLineHeight,
                    inputFontWeight,
                    error
                      ? errorInputTextColor
                      : disabled
                        ? disabledInputTextColor
                        : readOnly
                          ? readOnlyInputTextColor
                          : inputTextColor,
                    "flex"
                  )}
                >
                  {file.split("\\").slice(-1)[0]}
                </div>
              </div>
            ) : null}
          </div>
          <input
            {...passThrough}
            ref={inputRef}
            key={fileInputKey}
            className={cn(
              "absolute cursor-pointer overflow-hidden opacity-0",
              inputHeight ? inputHeight : "py-2.5",
              inputWidth,
              placeholderFontFamily,
              placeholderFontSize,
              placeholderFontWeight,
              placeholderLineHeight,
              placeholderTextColor
            )}
            aria-label={`${id}-label`}
            id={id}
            type="file"
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            onChange={(event) => {
              if (onChange) onChange(event);

              const inputValue = event.target.value;
              if (!inputValue) {
                setAnswered(false);
                return;
              }

              setAnswered(true);
              setFile(inputValue);
            }}
            onClick={(event) => {
              if (onClick) onClick(event);
              handleInputOnClick(event);
            }}
          />
          <button
            type="button"
            className={cn(
              "ml-auto flex h-full px-5",
              answered ? "absolute bottom-0 right-0 z-20" : "",
              inputBorderRadiusTopRight,
              inputBorderRadiusBottomRight,
              uploadButtonFontWeight,
              uploadButtonFontSize,
              disabled
                ? "bg-instillGrey20 text-white"
                : readOnly
                  ? "bg-instillGrey20 text-white"
                  : cn(
                      uploadButtonBgColor,
                      uploadButtonTextColor,
                      uploadButtonHoverBgColor,
                      uploadButtonHoverTextColor
                    )
            )}
            onClick={(event) => handleButtonOnClick(event)}
          >
            <span className="m-auto">
              {answered ? "Delete" : uploadButtonText}
            </span>
          </button>
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

export default UploadFileFieldBase;
