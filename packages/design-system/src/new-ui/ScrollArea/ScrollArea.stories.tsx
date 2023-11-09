import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "./ScrollArea";
import { Separator } from "../Separator";

const meta: Meta<typeof ScrollArea> = {
  title: "Components/NewUi/ScrollArea",
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea.Root className="h-72 w-48 rounded border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea.Root>
  ),
};

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);
