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
          <Select.Item value="apple" label="Apple" />
          <Select.Item value="banana" label="Banana" />
          <Select.Item value="blueberry" label="Blueberry" />
          <Select.Item value="grapes" label="Grapes" />
          <Select.Item value="pineapple" label="Pineapple" />
        </Select.Group>
      </Select.Content>
    </Select.Root>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Select.Root>
      <Select.Trigger className="w-full">
        <Select.Value placeholder="Select a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Fruits</Select.Label>
          <Select.Item value="Hello">
            <Select.ItemText>
              <div className="flex flex-row space-x-2">
                <Icons.Box className="h-5 w-5 stroke-semantic-fg-primary group-hover:stroke-semantic-bg-primary" />

                <p className=" text-semantic-fg-primary product-body-text-3-regular group-hover:text-semantic-bg-primary">
                  Hello
                </p>
              </div>
            </Select.ItemText>
          </Select.Item>
          <Select.Item value="YO">
            <Select.ItemText>
              <div className="flex flex-row space-x-2">
                <ModelLogo variant="square" width={20} />

                <p className=" text-semantic-fg-primary product-body-text-3-regular group-hover:text-semantic-bg-primary">
                  YO
                </p>
              </div>
            </Select.ItemText>
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  ),
};
