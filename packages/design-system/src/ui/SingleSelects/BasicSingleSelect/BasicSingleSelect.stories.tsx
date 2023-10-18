import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import { BasicSingleSelect, basicSingleSelectConfig } from ".";
import { basicInputDescriptionConfig } from "../../InputDescriptions";
import { Nullable } from "../../../types/general";
import { SingleSelectOption } from "../SingleSelectBase";

const meta: Meta<typeof BasicSingleSelect> = {
  title: "Components/Ui/Input/BasicSingleSelect",
  component: BasicSingleSelect,
};

export default meta;

const Template: StoryFn<typeof BasicSingleSelect> = (args) => {
  const optionsWithoutIcon: SingleSelectOption[] = [
    {
      value: "grpc",
      label: "gRPC-gRPC-gRPC-gRPC-gRPC-gRPC-gRPC-gRPC-gRPC-",
    },
    {
      value: "http",
      label: "HTTP",
    },
    {
      value: "snowflake",
      label: "Snowflake",
    },
    {
      value: "mongodb",
      label: "MongoDB",
    },
  ];

  const onChange = (option: Nullable<SingleSelectOption>) => {
    setValue(option);
  };

  const [value, setValue] = React.useState<SingleSelectOption | null>(null);

  return (
    <BasicSingleSelect
      {...args}
      onChange={onChange}
      options={optionsWithoutIcon}
      value={value}
    />
  );
};

export const Playground: StoryFn<typeof BasicSingleSelect> = Template.bind({});

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
