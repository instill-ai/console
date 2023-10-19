import * as React from "react";
import cn from "clsx";
import * as Select from "@radix-ui/react-select";

import { BasicInputProps, Nullable } from "../../../types/general";
import InputLabelBase from "../../InputLabels/InputLabelBase";
import { InputDescriptionBase } from "../../InputDescriptions/InputDescriptionBase";
import { SelectItem } from "./SelectItem";

export type SingleSelectOption = {
  label: string;
  value: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

export type SingleSelectBaseProps = Omit<
  BasicInputProps,
  | "placeholder"
  | "inputFontSize"
  | "inputLineHeight"
  | "inputFontWeight"
  | "inputTextColor"
  | "inputWidth"
  | "inputHeight"
  | "autoComplete"
  | "disabledBgColor"
  | "readOnlyBgColor"
  | "bgColor"
  | "borderRadius"
  | "focusHighlight"
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
  | "errorInputBgColor"
  | "errorInputBorderColor"
  | "errorInputBorderStyle"
  | "errorInputBorderWidth"
  | "errorInputTextColor"
  | "onChangeInput"
> & {
  /**
   * Options
   * - label: Option's displayed label name
   * - value: Option's store selected value
   * - startIcon: Icon you want to put in fron of label
   * - endIcon: Icon you want to put behind the label
   * - e.g.
   ```js
   [
      {
          value: "grpc",
          label: "gRPC",
          startIcon: (
            <GrpcIcon
              color="text-instillGrey95"
              width="w-[30px]"
              height="h-[30px]"
              position="m-auto"
            />
          ),
      },
   ]
   ```
   */
  options: SingleSelectOption[];
  value: Nullable<SingleSelectOption>;

  /**
   * The design system use actionMeta to provide additional info about the selection behavior.
   * You could access these info inside the onChnage.
   */
  onChange?: (option: Nullable<SingleSelectOption>) => void;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  readOnly?: boolean | undefined;
  placeholder: Nullable<string>;

  selectPopoverBorderStyle: string;
  selectPopoverBorderWidth: string;
  selectPopoverBorderColor: string;
  selectPopoverBorderRadius: string;
  selectPopoverBgColor: string;
  selectPopoverPadding: string;
  /**
   * The gap between the icon and the text of the item
   */
  selectItemTextIconGap: string;

  // When set to true, the select will be in debug mode, it will always show the popover
  debug?: boolean;
};

const SingleSelectBase = (props: SingleSelectBaseProps) => {
  const {
    value,
    options,
    additionalMessageOnLabel,
    messageFontFamily,
    messageFontSize,
    messageFontWeight,
    messageLineHeight,
    messageTextColor,
    inputLabelType,
    label,
    id,
    required,
    disabled,
    error,
    description,
    onChange,
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
    errorLabelFontFamily,
    errorLabelFontSize,
    errorLabelFontWeight,
    errorLabelLineHeight,
    errorLabelTextColor,
    placeholder,
    inputBorderColor,
    inputBorderStyle,
    inputBorderWidth,
    inputBorderRadius,
    inputBgColor,
    selectPopoverBgColor,
    selectPopoverBorderColor,
    selectPopoverBorderRadius,
    selectPopoverBorderStyle,
    selectPopoverBorderWidth,
    selectPopoverPadding,
    selectItemTextIconGap,
    debug,
  } = props;

  const [triggerWidth, setTriggerWidth] =
    React.useState<Nullable<number>>(null);

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value?.value) || null;
  }, [value, options]);

  return (
    <div className="flex flex-col">
      <div
        className={cn("flex flex-col relative", {
          "mb-2.5": description,
        })}
      >
        <div className={label ? "mb-2.5" : ""}>
          <InputLabelBase
            label={label}
            message={additionalMessageOnLabel}
            required={required}
            htmlFor={id}
            type={inputLabelType}
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
            messageFontFamily={messageFontFamily}
            messageFontSize={messageFontSize}
            messageFontWeight={messageFontWeight}
            messageLineHeight={messageLineHeight}
            messageTextColor={messageTextColor}
          />
        </div>
        <div className="w-full">
          <Select.Root
            value={value?.value}
            onValueChange={(value) => {
              const selectedOption =
                options.find((option) => option.value === value) || null;
              if (onChange) onChange(selectedOption);
            }}
            disabled={disabled || false}
            open={debug}
          >
            <Select.Trigger
              id={id}
              className={cn(
                "w-full px-4 py-2 text-left flex flex-row focus:border-instillGrey50 focus:instill-input-highlight focus:instill-input-focus-shadow",
                inputBorderColor,
                inputBorderRadius,
                inputBorderStyle,
                inputBorderWidth,
                inputBgColor,
                {
                  "bg-instillGrey90 bg-opacity-5 cursor-not-allowed": disabled,
                }
              )}
              aria-label="Food"
              ref={(node) => {
                if (node) setTriggerWidth(node.offsetWidth);
              }}
            >
              <Select.Value placeholder={placeholder}>
                {selectedOption ? (
                  <div className={cn("flex flex-row", selectItemTextIconGap)}>
                    {selectedOption.startIcon ? selectedOption.startIcon : null}
                    <p className={"align-middle my-auto pt-0.5"}>
                      {selectedOption.label}
                    </p>
                    {selectedOption.endIcon ? selectedOption.endIcon : null}
                  </div>
                ) : null}
              </Select.Value>
              <Select.Icon className="SelectIcon ml-auto my-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className={cn(
                  selectPopoverBgColor,
                  selectPopoverBorderColor,
                  selectPopoverBorderRadius,
                  selectPopoverBorderStyle,
                  selectPopoverBorderWidth,
                  selectPopoverPadding,
                  "overflow-hidden max-h-[320px]"
                )}
                position="popper"
                sideOffset={8}
                style={{ width: triggerWidth ? triggerWidth : undefined }}
              >
                <Select.Viewport className="SelectViewport">
                  {options.map((option) => (
                    <SelectItem
                      key={option.value}
                      width={triggerWidth}
                      selectItemTextIconGap={selectItemTextIconGap}
                      option={option}
                    />
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
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

export default SingleSelectBase;
