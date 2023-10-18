import { Meta, StoryFn } from "@storybook/react";
import PythonIcon from "./PythonIcon";

const meta: Meta<typeof PythonIcon> = {
  title: "Components/Ui/Icon/PythonIcon",
  component: PythonIcon,
};

export default meta;

const Template: StoryFn<typeof PythonIcon> = (args) => <PythonIcon {...args} />;

export const Playground: StoryFn<typeof PythonIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
