import { Meta, StoryFn } from "@storybook/react";
import { basicInputDescriptionConfig } from "../../InputDescriptions";
import UploadFileFieldBase from "./UploadFileFieldBase";

const meta: Meta<typeof UploadFileFieldBase> = {
  title: "Components/Base/Input/UploadFileFieldBase",
  component: UploadFileFieldBase,
};

export default meta;

const Template: StoryFn<typeof UploadFileFieldBase> = (args) => (
  <UploadFileFieldBase {...args} />
);

export const Playground: StoryFn<typeof UploadFileFieldBase> = Template.bind(
  {}
);

Playground.args = {
  ...basicInputDescriptionConfig,
  required: true,
  focusHighlight: true,
  id: "upload-file-field-base-playground",
  onChange: () => undefined,
  placeholder: "playground",
  label: "playground",
  additionalMessageOnLabel: null,
  labelFontSize: "text-base",
  labelFontWeight: "font-normal",
  labelTextColor: "text-instillGrey50",
  labelLineHeight: "",
  labelFontFamily: "font-sans",
  error: "",
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
  disabled: false,
  disabledInputBgColor: "bg-white",
  disabledInputBorderColor: "border-instillGrey20",
  disabledInputBorderStyle: "border-dashed",
  disabledInputBorderWidth: "border",
  disabledInputTextColor: "text-instillGrey50",
  readOnly: false,
  readOnlyInputBgColor: "bg-white",
  readOnlyInputBorderColor: "border-instillGrey20",
  readOnlyInputBorderStyle: "border-solid",
  readOnlyInputBorderWidth: "border",
  readOnlyInputTextColor: "text-instillGrey50",
  description: "this is a description about upload file field",
  inputWidth: "w-full",
  inputHeight: "h-[70px]",
  inputFontSize: "text-base",
  inputTextColor: "text-instillGrey95",
  inputFontWeight: "font-normal",
  inputLineHeight: "leading-[28px]",
  inputBgColor: "bg-white",
  inputBorderRadiusBottomLeft: "rounded-bl-[1px]",
  inputBorderRadiusBottomRight: "rounded-br-[1px]",
  inputBorderRadiusTopLeft: "rounded-tl-[1px]",
  inputBorderRadiusTopRight: "rounded-tr-[1px]",
  inputBorderColor: "border-instillGrey20",
  inputBorderStyle: "border-solid",
  inputBorderWidth: "border",
  uploadButtonText: "Upload",
  uploadButtonBgColor: "bg-instillBlue10",
  uploadButtonTextColor: "text-instillBlue50",
  uploadButtonHoverBgColor: "group-hover:bg-instillBlue50",
  uploadButtonHoverTextColor: "group-hover:text-instillGrey05",
};
