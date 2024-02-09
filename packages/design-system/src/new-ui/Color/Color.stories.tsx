import type { Meta, StoryObj } from "@storybook/react";
import { Color } from "./Color";

const meta: Meta<typeof Color> = {
  title: "Components/NewUi/Color",
};

export default meta;

type Story = StoryObj<typeof Color>;

export const Default: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-2">
      <Color color="bg-semantic-bg-primary" />
      <Color color="bg-semantic-bg-alt-primary" />
      <Color color="bg-semantic-bg-base-bg" />
      <Color color="bg-semantic-bg-secondary" />
      <Color color="bg-semantic-bg-line" />

      <Color color="bg-semantic-bg-secondary-primary" />
      <Color color="bg-semantic-bg-secondary-alt-primary" />
      <Color color="bg-semantic-bg-secondary-secondary" />
      <Color color="bg-semantic-bg-secondary-base-bg" />
      <Color color="bg-semantic-bg-secondary-line" />

      <Color color="bg-semantic-fg-primary" />
      <Color color="bg-semantic-fg-secondary" />
      <Color color="bg-semantic-fg-disabled" />
      <Color color="bg-semantic-fg-on-default" />
      <Color color="bg-semantic-fg-primary-on-bg-secondary" />
      <Color color="bg-semantic-fg-secondary-on-bg-secondary" />
      <Color color="bg-semantic-fg-disabled-on-secondary-bg" />

      <Color color="bg-semantic-accent-bg" />
      <Color color="bg-semantic-accent-bg-alt" />
      <Color color="bg-semantic-accent-default" />
      <Color color="bg-semantic-accent-hover" />
      <Color color="bg-semantic-accent-pressed" />
      <Color color="bg-semantic-accent-on-bg" />

      <Color color="bg-semantic-warning-bg" />
      <Color color="bg-semantic-warning-bg-alt" />
      <Color color="bg-semantic-warning-default" />
      <Color color="bg-semantic-warning-hover" />
      <Color color="bg-semantic-warning-pressed" />
      <Color color="bg-semantic-warning-on-bg" />

      <Color color="bg-semantic-error-bg" />
      <Color color="bg-semantic-error-bg-secondary" />
      <Color color="bg-semantic-error-bg-alt" />
      <Color color="bg-semantic-error-default" />
      <Color color="bg-semantic-error-hover" />
      <Color color="bg-semantic-error-pressed" />
      <Color color="bg-semantic-error-on-bg" />

      <Color color="bg-semantic-success-bg" />
      <Color color="bg-semantic-success-bg-secondary" />
      <Color color="bg-semantic-success-bg-alt" />
      <Color color="bg-semantic-success-default" />
      <Color color="bg-semantic-success-hover" />
      <Color color="bg-semantic-success-pressed" />
      <Color color="bg-semantic-success-on-bg" />

      <Color color="bg-semantic-secondary-bg" />
      <Color color="bg-semantic-secondary-bg-secondary" />
      <Color color="bg-semantic-secondary-bg-alt" />
      <Color color="bg-semantic-secondary-default" />
      <Color color="bg-semantic-secondary-hover" />
      <Color color="bg-semantic-secondary-pressed" />
      <Color color="bg-semantic-secondary-on-bg" />

      <Color color="bg-semantic-info-bg" />
      <Color color="bg-semantic-info-icon-on-bg" />
      <Color color="bg-semantic-info-bg-alt" />
      <Color color="bg-semantic-secondary-primary-text-on-bg" />
      <Color color="bg-semantic-secondary-secondary-text-on-bg" />

      <Color color="bg-semantic-node-connected-default-stroke" />
      <Color color="bg-semantic-node-connected-hover-stroke" />
      <Color color="bg-semantic-node-connected-selected-stroke" />
      <Color color="bg-semantic-node-connected-bg" />
      <Color color="bg-semantic-node-error-default-stroke" />
      <Color color="bg-semantic-node-error-hover-stroke" />
      <Color color="bg-semantic-node-error-selected-stroke" />
      <Color color="bg-semantic-node-error-bg" />
      <Color color="bg-semantic-node-disconnected-default-stroke" />
      <Color color="bg-semantic-node-disconnected-hover-stroke" />
      <Color color="bg-semantic-node-disconnected-selected-stroke" />
      <Color color="bg-semantic-node-disconnected-bg" />
      <Color color="bg-semantic-node-connector-off" />
      <Color color="bg-semantic-node-connector-on" />
    </div>
  ),
};
