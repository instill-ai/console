import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import { basicInputDescriptionConfig } from "../../InputDescriptions";
import ToggleFieldBase from "./ToggleFieldBase";

const meta: Meta<typeof ToggleFieldBase> = {
  title: "Components/Base/Input/ToggleFieldBase",
  component: ToggleFieldBase,
};

export default meta;

const Template: StoryFn<typeof ToggleFieldBase> = (args) => {
  const [checked, setChecked] = React.useState(false);
  return (
    <ToggleFieldBase
      {...args}
      value={checked}
      onChange={(event) => {
        setChecked(event.target.checked);
      }}
    />
  );
};
export const Playground: StoryFn<typeof ToggleFieldBase> = Template.bind({});

Playground.args = {
  ...basicInputDescriptionConfig,
  required: true,
  focusHighlight: true,
  id: "toggle-field-base-playground",
  description: "this is a description for toggle field base",
  label: "toggle-field-base-playground",
  additionalMessageOnLabel: null,
  labelFontSize: "text-base",
  labelFontWeight: "font-normal",
  labelTextColor: "text-instillGrey50",
  labelLineHeight: "",
  labelFontFamily: "font-sans",
  inputBgColor: "bg-white",
  inputBorderRadius: "",
  inputBorderColor: "border-instillGrey20",
  inputBorderStyle: "border-solid",
  inputBorderWidth: "border",
  inputFocusBorderColor: "border-instillBlue50",
  inputFocusShadow: "instill-input-focus-shadow",
  inputShadow: null,
  dotColor: "bg-instillGrey30",
  checkedInputBorderColor: "border-instillBlue50",
  checkedDotColor: "bg-instillBlue50",
  disabled: true,
  disabledDotColor: "bg-instillGrey20",
  disabledCheckedDotColor: "bg-[#8DF5FF]",
  disabledCursor: "cursor-not-allowed",
  disabledInputBgColor: "bg-white",
  disabledInputBorderColor: "border-instillGrey20",
  disabledInputBorderStyle: "border-dashed",
  disabledInputBorderWidth: "border",
  disabledCheckedInputBorderColor: "border-instillGrey20",
  readOnly: false,
  readOnlyCursor: "cursor-auto",
  readOnlyInputBgColor: "bg-white",
  readOnlyInputBorderColor: "border-instillGrey20",
  readOnlyInputBorderStyle: "border-solid",
  readOnlyInputBorderWidth: "border",
  readOnlyCheckedInputBorderColor: "border-[#8DF5FF]",
  readOnlyCheckedDotColor: "bg-[#8DF5FF]",
  readOnlyDotColor: "bg-instillGrey20",
  error: "",
  errorLabelFontFamily: "font-sans",
  errorLabelFontSize: "text-base",
  errorLabelFontWeight: "font-normal",
  errorLabelLineHeight: "",
  errorLabelTextColor: "text-instillRed",
};
