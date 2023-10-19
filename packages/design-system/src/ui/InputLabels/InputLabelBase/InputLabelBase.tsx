import * as React from "react";
import cn from "clsx";
import { Nullable } from "../../../types/general";

export type InputLabelBaseProps = {
  /** Input label's type
   * - normal: input label has normal position layout and doesn't have any animation
   * - inset: input label has absolution position layout, put into the input field and have float up animation with specific activate, deActivate style
   */
  type: "normal" | "hide";

  /**
   * Input's error string
   */
  error: Nullable<string>;

  /**
   * Input's additional message
   */
  message: Nullable<string>;

  /**
   * Input label's text
   */
  label: Nullable<string>;

  /** Input label associated input field's id */
  htmlFor: string;

  /** Whether the input is required or not */
  required?: boolean | undefined;

  /** TailwindCSS format - Message's text color
   * - e.g. text-instillGrey50
   */
  messageTextColor: string;

  /** TailwindCSS format - Message's font weight
   * - e.g. font-normal
   */
  messageFontWeight: string;

  /** TailwindCSS format - Message's font size
   * - e.g. text-base
   */
  messageFontSize: string;

  /** TailwindCSS format - Message's font family
   * - e.g. font-sans
   */
  messageFontFamily: string;

  /** TailwindCSS format - Message's line height
   * - e.g. leading-normal
   */
  messageLineHeight: string;

  /** TailwindCSS format - Label's text color
   * - e.g. text-instillGrey50
   */
  labelTextColor: string;

  /** TailwindCSS format - Label's font weight
   * - e.g. font-normal
   */
  labelFontWeight: string;

  /** TailwindCSS format - Label's font size
   * - e.g. text-base
   */
  labelFontSize: string;

  /** TailwindCSS format - Label's font family
   * - e.g. font-sans
   */
  labelFontFamily: string;

  /** TailwindCSS format - Label's line height
   * - e.g. leading-normal
   */
  labelLineHeight: string;

  /** TailwindCSS format - Label's text color when input has error
   * - e.g. text-instillGrey50
   */
  errorLabelTextColor: string;

  /** TailwindCSS format - Label's font weight when input has error
   * - e.g. font-normal
   */
  errorLabelFontWeight: string;

  /** TailwindCSS format - Label's font size when input has error
   * - e.g. text-base
   */
  errorLabelFontSize: string;

  /** TailwindCSS format - Label's font family when input has error
   * - e.g. font-sans
   */
  errorLabelFontFamily: string;

  /** TailwindCSS format - Label's line height when input has error
   * - e.g. leading-normal
   */
  errorLabelLineHeight: string;
};

export type InputLabelBaseRef = HTMLLabelElement;

const InputLabelBase = React.forwardRef<InputLabelBaseRef, InputLabelBaseProps>(
  (props, ref) => {
    const {
      htmlFor,
      required,
      label,
      labelFontSize,
      labelFontWeight,
      labelTextColor,
      labelFontFamily,
      labelLineHeight,
      type,
      error,
      message,
      messageFontFamily,
      messageFontSize,
      messageFontWeight,
      messageLineHeight,
      messageTextColor,
      errorLabelFontFamily,
      errorLabelFontSize,
      errorLabelFontWeight,
      errorLabelLineHeight,
      errorLabelTextColor,
    } = props;

    return (
      <>
        {type !== "hide" ? (
          <label
            ref={ref}
            className="z-10 flex flex-row gap-x-2 w-full"
            htmlFor={htmlFor}
          >
            {label ? (
              <p
                className={cn(
                  "flex-shrink-0",
                  error
                    ? cn(
                        errorLabelFontFamily,
                        errorLabelFontSize,
                        errorLabelFontWeight,
                        errorLabelLineHeight,
                        errorLabelTextColor
                      )
                    : cn(
                        labelFontSize,
                        labelFontWeight,
                        labelTextColor,
                        labelFontFamily,
                        labelLineHeight
                      )
                )}
              >{`${label} ${required ? "*" : ""}`}</p>
            ) : null}
            <p
              className={cn(
                "my-auto",
                messageFontFamily,
                messageLineHeight,
                messageFontSize,
                messageFontWeight,
                error ? errorLabelTextColor : messageTextColor
              )}
              data-testid={
                error ? `${htmlFor}-label-error` : `${htmlFor}-label-message`
              }
            >
              {error ? error : message}
            </p>
          </label>
        ) : (
          ""
        )}
      </>
    );
  }
);

export default React.memo(InputLabelBase);

InputLabelBase.displayName = "InputLabelBase";
