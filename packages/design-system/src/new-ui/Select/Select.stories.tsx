import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { Icons } from "../Icons";
import { ModelLogo } from "../../ui";

const meta: Meta<typeof Select> = {
  title: "Components/NewUi/Select",
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Regular: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger className="w-full">
        <Select.Value placeholder="Select a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana">Banana</Select.Item>
          <Select.Item value="blueberry">Blueberry</Select.Item>
          <Select.Item value="grapes">Grapes</Select.Item>
          <Select.Item value="pineapple">Pineapple</Select.Item>
          <Select.Item value="1">1</Select.Item>
          <Select.Item value="2">2</Select.Item>
          <Select.Item value="3">3</Select.Item>
          <Select.Item value="4">4</Select.Item>
          <Select.Item value="5">5</Select.Item>
          <Select.Item value="6">6</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Select.Root open={true}>
      <Select.Trigger className="w-full">
        <Select.Value placeholder="Select a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value="Hello">
            <div className="flex flex-row space-x-2">
              <Icons.Box className="w-5 h-5 stroke-semantic-fg-primary group-hover:stroke-semantic-bg-primary" />
              <p className=" product-body-text-3-regular text-semantic-fg-primary group-hover:text-semantic-bg-primary">
                Hello
              </p>
            </div>
          </Select.Item>
          <Select.Item value="YO">
            <div className="flex flex-row space-x-2">
              <ModelLogo variant="square" width={20} />
              <p className=" product-body-text-3-regular text-semantic-fg-primary group-hover:text-semantic-bg-primary">
                YO
              </p>
            </div>
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  ),
};
