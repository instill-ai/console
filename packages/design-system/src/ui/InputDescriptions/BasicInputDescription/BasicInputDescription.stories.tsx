import { Meta, StoryFn } from "@storybook/react";
import { BasicInputDescription } from "./BasicInputDescription";

const meta: Meta<typeof BasicInputDescription> = {
  title: "Components/Ui/Input/BasicInputDescription",
  component: BasicInputDescription,
};

export default meta;

const Template: StoryFn<typeof BasicInputDescription> = () => (
  <BasicInputDescription description="this is description <a href='#'>setup guide</a>" />
);

export const Playground: StoryFn<typeof BasicInputDescription> = Template.bind(
  {}
);
