import type { Meta, StoryObj } from "@storybook/react";
import { LinkButton } from "./LinkButton";

const meta: Meta<typeof LinkButton> = {
  title: "Components/NewUi/LinkButton",
};

export default meta;

type Story = StoryObj<typeof LinkButton>;

export const Primary: Story = {
  render: () => (
    <LinkButton variant="primary" size="lg">
      I am a button
    </LinkButton>
  ),
};

export const Danger: Story = {
  render: () => (
    <LinkButton variant="danger" size="lg">
      I am a button
    </LinkButton>
  ),
};

export const Secondary: Story = {
  render: () => (
    <LinkButton variant="secondary" size="lg">
      I am a button
    </LinkButton>
  ),
};

export const White: Story = {
  render: () => (
    <div className="bg-black p-10">
      <LinkButton variant="white" size="lg">
        I am a button
      </LinkButton>
    </div>
  ),
};

export const PrimaryWithAsChild: Story = {
  render: () => (
    <LinkButton className="gap-x-2" variant="primary" size="lg" asChild>
      <a href="https://www.instill.tech/">Instill AI</a>
    </LinkButton>
  ),
};
