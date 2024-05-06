import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible } from "./Collapsible";
import { Button } from "../Button";
import { Icons } from "../Icons";

const meta: Meta<typeof Collapsible> = {
  title: "Components/NewUi/Collapsible",
};

export default meta;

type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible.Root className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          @peduarte starred 3 repositories
        </h4>
        <Collapsible.Trigger asChild>
          <Button variant="tertiaryColour" size="sm">
            <Icons.ChevronSelectorVertical className="h-4 w-4 fill-semantic-fg-primary" />
            <span className="sr-only">Toggle</span>
          </Button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content className="space-y-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          @radix-ui/primitives
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
          @stitches/react
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  ),
};
