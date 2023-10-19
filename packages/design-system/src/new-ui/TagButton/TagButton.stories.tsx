import { TagButton } from "./TagButton";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TagButton> = {
  title: "Components/NewUi/TagButton",
};

export default meta;

type Story = StoryObj<typeof TagButton>;

export const Dafault: Story = {
  render: () => <TagButton>Label</TagButton>,
};

export const PrimaryWithAsChild: Story = {
  render: () => (
    <TagButton className="gap-x-2" variant="default" size="lg" asChild>
      <a href="https://www.instill.tech/">Instill AI</a>
    </TagButton>
  ),
};
