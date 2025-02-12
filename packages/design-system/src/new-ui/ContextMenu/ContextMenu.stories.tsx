import type { Meta, StoryObj } from "@storybook/react";

import { ContextMenu } from "./ContextMenu";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/NewUi/ContextMenu",
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Regular: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenu.Trigger>
      <ContextMenu.Content className="w-64">
        <ContextMenu.Item inset>
          Back
          <ContextMenu.Shortcut>⌘[</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item inset disabled>
          Forward
          <ContextMenu.Shortcut>⌘]</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item inset>
          Reload
          <ContextMenu.Shortcut>⌘R</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger inset>More Tools</ContextMenu.SubTrigger>
          <ContextMenu.SubContent className="w-48">
            <ContextMenu.Item>
              Save Page As...
              <ContextMenu.Shortcut>⇧⌘S</ContextMenu.Shortcut>
            </ContextMenu.Item>
            <ContextMenu.Item>Create Shortcut...</ContextMenu.Item>
            <ContextMenu.Item>Name Window...</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>Developer Tools</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
        <ContextMenu.Separator />
        <ContextMenu.CheckboxItem checked>
          Show Bookmarks Bar
          <ContextMenu.Shortcut>⌘⇧B</ContextMenu.Shortcut>
        </ContextMenu.CheckboxItem>
        <ContextMenu.Item>Show Full URLs</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.RadioGroup value="pedro">
          <ContextMenu.Label inset>People</ContextMenu.Label>
          <ContextMenu.Separator />
          <ContextMenu.RadioItem value="pedro">
            Pedro Duarte
          </ContextMenu.RadioItem>
          <ContextMenu.RadioItem value="colm">Colm Tuite</ContextMenu.RadioItem>
        </ContextMenu.RadioGroup>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
};
