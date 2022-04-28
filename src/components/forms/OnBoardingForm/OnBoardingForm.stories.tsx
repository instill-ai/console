import { ComponentStory, ComponentMeta } from "@storybook/react";
import OnBoardingForm from "./OnBoardingForm";

export default {
  title: "Components/Form/OnBoardingForm",
  component: OnBoardingForm,
} as ComponentMeta<typeof OnBoardingForm>;

const Template: ComponentStory<typeof OnBoardingForm> = (args) => (
  <OnBoardingForm {...args} />
);

export const Playground: ComponentStory<typeof OnBoardingForm> = Template.bind(
  {}
);

Playground.args = {};
