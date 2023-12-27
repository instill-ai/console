import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Components/NewUi/Dialog",
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Regular: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>Open Dialog</button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Edit profile</Dialog.Title>
          <Dialog.Description>
            Make changes to your profile here. Click save when you&apos;re done.
          </Dialog.Description>
        </Dialog.Header>
        <div className="flex flex-col space-y-2">
          This is the content of the dialog
        </div>
        <Dialog.Footer>
          <button className="mr-auto flex border px-2 py-1" type="submit">
            Save changes
          </button>
        </Dialog.Footer>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog.Root>
  ),
};
