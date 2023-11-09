import { Meta, StoryFn } from "@storybook/react";
import { basicInputDescriptionConfig } from "../../InputDescriptions";
import TextAreaBase from "./TextAreaBase";

const meta: Meta<typeof TextAreaBase> = {
  title: "Components/Base/Input/TextAreaBase",
  component: TextAreaBase,
};

export default meta;

const Template: StoryFn<typeof TextAreaBase> = (args) => (
  <TextAreaBase {...args} />
);

export const Playground: StoryFn<typeof TextAreaBase> = Template.bind({});

Playground.args = {
  error: null,
  id: "text-field-playground",
  description: "this is a description for textarea base",
  label: "Playground",
  additionalMessageOnLabel: null,
  required: true,
  inputHeight: "h-[140px]",
  inputWidth: "w-full",
  focusHighlight: true,
  autoComplete: "off",
  inputFontSize: "text-base",
  inputFontWeight: "font-normal",
  inputLineHeight: "leading-[28px]",
  inputTextColor: "text-instillGrey95",
  disabled: false,
  placeholder: "hello",
  readOnly: false,
  bgColor: "bg-white",
  inputBorderRadius: "rounded-[1px]",
  inputBorderColor: "border-instillGrey20",
  inputBorderStyle: "border-solid",
  inputBorderWidth: "border",
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
  placeholderFontFamily: "placeholder:font-sans",
  placeholderFontSize: "placeholder:text-base",
  placeholderFontWeight: "placeholder:font-normal",
  placeholderLineHeight: "",
  placeholderTextColor: "placeholder:text-instillGrey50",
  enableCounter: true,
  counterFontFamily: "font-sans",
  counterFontSize: "text-xs",
  counterFontWeight: "font-normal",
  counterLineHeight: "leanding-[15.6px]",
  counterTextColor: "text-instillGrey20",
  counterWordLimit: 256,
  labelFontSize: "text-base",
  labelFontWeight: "font-normal",
  labelTextColor: "text-instillGrey50",
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
