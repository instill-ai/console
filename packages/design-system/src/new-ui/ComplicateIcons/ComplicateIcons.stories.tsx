import { Meta, StoryObj } from "@storybook/react";
import { ComplicateIcons } from ".";

const meta: Meta = {
  title: "Components/NewUi/ComplicateIcons",
};

export default meta;

type Story = StoryObj;

export const Doc: Story = {
  render: () => (
    <ComplicateIcons.Doc
      fillAreaColor="fill-semantic-fg-secondary"
      className="h-5 w-5"
    />
  ),
};

export const TextEmbedding: Story = {
  render: () => (
    <ComplicateIcons.TextEmbedding
      fillAreaColor="fill-semantic-fg-secondary"
      pathColor="stroke-semantic-fg-secondary"
      className="h-5 w-5"
    />
  ),
};

export const ImageToText: Story = {
  render: () => (
    <ComplicateIcons.ImageToText
      fillAreaColor="fill-semantic-fg-secondary"
      className="h-5 w-5"
    />
  ),
};

export const TextGeneration: Story = {
  render: () => (
    <ComplicateIcons.TextGeneration
      fillAreaColor="fill-semantic-fg-secondary"
      className="h-5 w-5"
    />
  ),
};

export const TextToImage: Story = {
  render: () => (
    <ComplicateIcons.TextToImage
      fillAreaColor="fill-semantic-fg-secondary"
      className="h-5 w-5"
    />
  ),
};

export const ImageToImage: Story = {
  render: () => (
    <ComplicateIcons.ImageToImage
      pathColor="stroke-semantic-fg-secondary"
      className="h-5 w-5"
    />
  ),
};
export const Number: Story = {
  render: () => (
    <ComplicateIcons.Number
      fillAreaColor="fill-semantic-fg-secondary"
      className="h-5 w-5"
    />
  ),
};

export const ToogleLeft: Story = {
  render: () => (
    <ComplicateIcons.ToggleLeft
      fillAreaColor="fill-semantic-fg-secondary"
      className="h-5 w-5"
    />
  ),
};

export const Drag: Story = {
  render: () => (
    <ComplicateIcons.Drag
      fillAreaColor="fill-semantic-fg-secondary"
      className="h-5 w-5"
    />
  ),
};
