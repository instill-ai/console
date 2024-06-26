import type { Meta, StoryObj } from "@storybook/react";

import { Resizable } from "./Resizable";

const meta: Meta<typeof Resizable> = {
  title: "Components/NewUi/Resizble",
};

export default meta;

type Story = StoryObj<typeof Resizable>;

export const Regular: Story = {
  render: () => (
    <Resizable.PanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border h-96"
    >
      <Resizable.Panel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </Resizable.Panel>
      <Resizable.Handle />
      <Resizable.Panel defaultSize={50}>
        <Resizable.PanelGroup direction="vertical">
          <Resizable.Panel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </Resizable.Panel>
        </Resizable.PanelGroup>
      </Resizable.Panel>
    </Resizable.PanelGroup>
  ),
};
