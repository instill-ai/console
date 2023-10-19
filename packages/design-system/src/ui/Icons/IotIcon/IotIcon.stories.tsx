import { Meta, StoryFn } from "@storybook/react";
import IotIcon from "./IotIcon";

const meta: Meta<typeof IotIcon> = {
  title: "Components/Ui/Icon/IotIcon",
  component: IotIcon,
};

export default meta;

const Template: StoryFn<typeof IotIcon> = (args) => <IotIcon {...args} />;

export const Playground: StoryFn<typeof IotIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
