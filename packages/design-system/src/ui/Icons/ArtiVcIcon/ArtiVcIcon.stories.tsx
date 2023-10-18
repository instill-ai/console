import { Meta, StoryFn } from "@storybook/react";
import ArtiVcIcon from "./ArtiVcIcon";

const meta: Meta<typeof ArtiVcIcon> = {
  title: "Components/Ui/Icon/ArtiVcIcon",
  component: ArtiVcIcon,
};

export default meta;

const Template: StoryFn<typeof ArtiVcIcon> = (args) => <ArtiVcIcon {...args} />;

export const Playground: StoryFn<typeof ArtiVcIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
