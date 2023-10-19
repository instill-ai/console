import { Meta, StoryFn } from "@storybook/react";
import SalesforceIcon from "./SalesforceIcon";

const meta: Meta<typeof SalesforceIcon> = {
  title: "Components/Ui/Icon/SalesforceIcon",
  component: SalesforceIcon,
};

export default meta;

const Template: StoryFn<typeof SalesforceIcon> = (args) => (
  <SalesforceIcon {...args} />
);

export const Playground: StoryFn<typeof SalesforceIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
