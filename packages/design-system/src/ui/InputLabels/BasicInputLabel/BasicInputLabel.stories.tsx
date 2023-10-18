import { Meta, StoryFn } from "@storybook/react";
import BasicInputLabel from "./BasicInputLabel";

const meta: Meta<typeof BasicInputLabel> = {
  title: "Components/Ui/Input/BasicInputLabel",
  component: BasicInputLabel,
};

export default meta;

const Template: StoryFn<typeof BasicInputLabel> = (args) => {
  return <BasicInputLabel {...args} htmlFor="default" required={false} />;
};

export const Playground: StoryFn<typeof BasicInputLabel> = Template.bind({});

Playground.args = {
  label: "basic input label",
  type: "normal",
  message: null,
};
