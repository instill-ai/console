import { Meta, StoryFn } from "@storybook/react";
import AwsS3Icon from "./AwsS3Icon";

const meta: Meta<typeof AwsS3Icon> = {
  title: "Components/Ui/Icon/AwsS3Icon",
  component: AwsS3Icon,
};

export default meta;

const Template: StoryFn<typeof AwsS3Icon> = (args) => <AwsS3Icon {...args} />;

export const Playground: StoryFn<typeof AwsS3Icon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
