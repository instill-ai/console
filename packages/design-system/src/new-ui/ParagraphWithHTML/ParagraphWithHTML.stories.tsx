import type { Meta, StoryObj } from "@storybook/react";
import { ParagraphWithHTML } from "./ParagraphWithHTML";

const meta: Meta<typeof ParagraphWithHTML> = {
  title: "Components/NewUi/ParagraphWithHTML",
};

export default meta;
type Story = StoryObj<typeof ParagraphWithHTML>;

export const Default: Story = {
  render: () => (
    <ParagraphWithHTML
      text={`Hi this is a lovely default, this <a href="https://www.instill.tech/">link</a> will take you to the <strong>promising land</strong>. I mean, <em>Where am I</em>! <code>console.log("Hello world")</code>`}
      className="text-xl"
    />
  ),
};
