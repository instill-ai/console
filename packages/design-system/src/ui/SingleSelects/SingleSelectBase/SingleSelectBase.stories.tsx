import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import SingleSelectBase, { type SingleSelectOption } from "./SingleSelectBase";
import { basicInputDescriptionConfig } from "../../InputDescriptions";
import { Nullable } from "../../../types/general";
import { basicSingleSelectConfig } from "../BasicSingleSelect";

const meta: Meta<typeof SingleSelectBase> = {
  title: "Components/Base/Input/SingleSelectBase",
  component: SingleSelectBase,
};

export default meta;

const Template: StoryFn<typeof SingleSelectBase> = (args) => {
  const optionsWithoutIcon: SingleSelectOption[] = [
    { label: "Option 1", value: "option-1" },
    { label: "Option 2", value: "option-2" },
    { label: "Option 3", value: "option-3" },
    { label: "Option 4", value: "option-4" },
    { label: "Option 5", value: "option-5" },
    { label: "Option 6", value: "option-6" },
    { label: "Option 7", value: "option-7" },
    { label: "Option 8", value: "option-8" },
    { label: "Option 9", value: "option-9" },
    { label: "Option 10", value: "option-10" },
    { label: "Option 11", value: "option-11" },
    { label: "Option 12", value: "option-12" },
    { label: "Option 13", value: "option-13" },
    { label: "Option 14", value: "option-14" },
    { label: "Option 15", value: "option-15" },
    { label: "Option 16", value: "option-16" },
    { label: "Option 17", value: "option-17" },
    { label: "Option 18", value: "option-18" },
    { label: "Option 19", value: "option-19" },
    { label: "Option 20", value: "option-20" },
  ];

  const onChange = (option: Nullable<SingleSelectOption>) => {
    setValue(option);
  };

  const [value, setValue] = React.useState<SingleSelectOption | null>(null);

  return (
    <SingleSelectBase
      {...args}
      onChange={onChange}
      options={optionsWithoutIcon}
      value={value}
    />
  );
};

export const Playground: StoryFn<typeof SingleSelectBase> = Template.bind({});

Playground.args = {
  disabled: false,
  readOnly: false,
  required: false,
  additionalMessageOnLabel: null,
  description: "this is a description for auth complete with Icon",
  label: "Single select playground",
  id: "single-select-with-icon",
  ...basicSingleSelectConfig,
  ...basicInputDescriptionConfig,
};
