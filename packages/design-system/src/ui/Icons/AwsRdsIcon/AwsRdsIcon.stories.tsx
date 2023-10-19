import { Meta, StoryFn } from "@storybook/react";
import AwsRdsIcon from "./AwsRdsIcon";

const meta: Meta<typeof AwsRdsIcon> = {
  title: "Components/Ui/Icon/AwsRdsIcon",
  component: AwsRdsIcon,
};

export default meta;

const Template: StoryFn<typeof AwsRdsIcon> = (args) => <AwsRdsIcon {...args} />;

export const Playground: StoryFn<typeof AwsRdsIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
