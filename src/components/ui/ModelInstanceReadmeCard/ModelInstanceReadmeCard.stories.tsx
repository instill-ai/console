import { ComponentStory, ComponentMeta } from "@storybook/react";
import ModelInstanceReadmeCard from "./ModelInstanceReadmeCard";

export default {
  title: "Components/ModelInstanceReadmeCard",
  component: ModelInstanceReadmeCard,
} as ComponentMeta<typeof ModelInstanceReadmeCard>;

const markdown = `# Hi

I am the test string of the markdown

> Feel free to change it
`;

const Template: ComponentStory<typeof ModelInstanceReadmeCard> = (args) => (
  <ModelInstanceReadmeCard {...args} markdown={markdown} />
);

export const Playground: ComponentStory<typeof ModelInstanceReadmeCard> =
  Template.bind({});

Playground.args = {
  isLoading: false,
};
