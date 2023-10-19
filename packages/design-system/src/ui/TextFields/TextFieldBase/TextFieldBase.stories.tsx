import { Meta, StoryFn } from "@storybook/react";
import { basicInputDescriptionConfig } from "../../InputDescriptions";
import TextFieldBase from "./TextFieldBase";

const meta: Meta<typeof TextFieldBase> = {
  title: "Components/Base/Input/TextFieldBase",
  component: TextFieldBase,
};

export default meta;

const Template: StoryFn<typeof TextFieldBase> = (args) => (
  <TextFieldBase {...args} />
);

export const Playground: StoryFn<typeof TextFieldBase> = Template.bind({});

Playground.args = {
  error: null,
  id: "text-field-playground",
  description: "this is a description for text field base",
  additionalMessageOnLabel: null,
  disabled: false,
  placeholder: "hello",
  readOnly: false,
  enableProtectedToggle: false,
  label: "Text field base playground",
  required: true,
  focusHighlight: true,
  autoComplete: "off",
  type: "text",
  inputHeight: "h-[70px]",
  inputWidth: "w-full",
  inputFontSize: "text-base",
  inputLineHeight: "leading-[28px]",
  inputFontWeight: "font-normal",
  inputTextColor: "text-instillGrey95",
  bgColor: "bg-white",
  disabledCursor: "cursor-not-allowed",
  disabledInputBgColor: "bg-white",
  disabledInputBorderColor: "border-instillGrey20",
  disabledInputBorderStyle: "border-dashed",
  disabledInputBorderWidth: "border",
  disabledInputTextColor: "text-instillGrey50",
  readOnlyCursor: "cursor-auto",
  readOnlyInputBgColor: "bg-white",
  readOnlyInputBorderColor: "border-instillGrey20",
  readOnlyInputBorderStyle: "border-solid",
  readOnlyInputBorderWidth: "border",
  readOnlyInputTextColor: "text-instillGrey95",
  inputBorderRadius: "rounded-[1px]",
  inputBorderColor: "border-instillGrey20",
  inputBorderStyle: "border-solid",
  inputBorderWidth: "border",
  placeholderFontFamily: "placeholder:font-sans",
  placeholderFontSize: "placeholder:text-base",
  placeholderFontWeight: "placeholder:font-normal",
  placeholderLineHeight: "",
  placeholderTextColor: "placeholder:text-instillGrey50",
  labelFontSize: "text-base",
  labelFontWeight: "font-normal",
  labelTextColor: "text-instillGrey90",
  labelLineHeight: "",
  labelFontFamily: "font-sans",
  errorInputBgColor: "bg-white",
  errorLabelFontFamily: "font-sans",
  errorLabelFontSize: "text-base",
  errorLabelFontWeight: "font-normal",
  errorLabelLineHeight: "",
  errorLabelTextColor: "text-instillRed",
  errorInputBorderColor: "border-instillRed",
  errorInputBorderWidth: "border",
  errorInputBorderStyle: "border-solid",
  errorInputTextColor: "text-instillRed",
  ...basicInputDescriptionConfig,
};
