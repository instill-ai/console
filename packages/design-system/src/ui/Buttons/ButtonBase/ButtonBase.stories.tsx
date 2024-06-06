import { Meta, StoryFn } from "@storybook/react";
import ButtonBase from "./ButtonBase";

const meta: Meta<typeof ButtonBase> = {
  title: "Components/Base/Button/ButtonBase",
  component: ButtonBase,
};

export default meta;

const Template: StoryFn<typeof ButtonBase> = (args) => (
  <ButtonBase {...args}>Button</ButtonBase>
);
export const Playground: StoryFn<typeof ButtonBase> = Template.bind({});

Playground.args = {
  bgColor: "bg-instillBlue50",
  hoveredBgColor: "hover:bg-instillBlue80",
  textColor: "text-instillGrey05",
  hoveredTextColor: "hover:text-instillBlue10",
  disabledBgColor: "bg-instillGrey15",
  disabledTextColor: "text-semantic-node-disconnected-default-stroke",
  padding: "px-5 py-2.5",
  borderRadius: "rounded-[1px]",
};
