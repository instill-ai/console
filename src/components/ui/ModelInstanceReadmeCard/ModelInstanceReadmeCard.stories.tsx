import { Meta, StoryFn } from "@storybook/react";
import { ModelInstanceReadmeCard } from "./ModelInstanceReadmeCard";

const meta: Meta<typeof ModelInstanceReadmeCard> = {
  title: "Components/ModelInstanceReadmeCard",
  component: ModelInstanceReadmeCard,
};

export default meta;

const markdown = `# Hi

I am the test string of the markdown

> Feel free to change it
`;

const Template: StoryFn<typeof ModelInstanceReadmeCard> = (args) => (
  <ModelInstanceReadmeCard {...args} markdown={markdown} />
);

export const Playground: StoryFn<typeof ModelInstanceReadmeCard> =
  Template.bind({});

Playground.args = {
  isLoading: false,
};
