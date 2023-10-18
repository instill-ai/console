import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/NewUi/Tooltip",
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Regular: Story = {
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="IconButton rounded p-2 shadow">Hover</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="TooltipContent" sideOffset={5}>
            <div className="Content inline-flex w-80 flex-col items-start justify-start bg-white p-3">
              <div className="TextAndSupportingText flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="Text self-stretch text-sm font-semibold leading-none text-gray-800">
                  Number of triggers tooltip
                </div>
                <div className="SupportingText self-stretch text-sm font-medium leading-none text-gray-800 text-opacity-80">
                  Tooltips are used to describe or identify an element. In most
                  scenarios, tooltips help the user understand meaning, function
                  or alt-text.
                </div>
              </div>
            </div>
            <Tooltip.Arrow
              className="fill-white"
              offset={10}
              width={18}
              height={12}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const TooltipWithoutArrow: Story = {
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="IconButton rounded p-2 shadow">Hover</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="TooltipContent" sideOffset={5}>
            <div className="Content inline-flex w-80 flex-col items-start justify-start bg-white p-3">
              <div className="TextAndSupportingText flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="Text self-stretch text-sm font-semibold leading-none text-gray-800">
                  Number of triggers tooltip
                </div>
                <div className="SupportingText self-stretch text-sm font-medium leading-none text-gray-800 text-opacity-80">
                  Tooltips are used to describe or identify an element. In most
                  scenarios, tooltips help the user understand meaning, function
                  or alt-text.
                </div>
              </div>
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const TooltipRight: Story = {
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="IconButton rounded p-2 shadow">Hover</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="TooltipContent"
            sideOffset={5}
            side={"right"}
          >
            <div className="Content inline-flex w-80 flex-col items-start justify-start bg-white p-3">
              <div className="TextAndSupportingText flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="Text self-stretch text-sm font-semibold leading-none text-gray-800">
                  Number of triggers tooltip
                </div>
                <div className="SupportingText self-stretch text-sm font-medium leading-none text-gray-800 text-opacity-80">
                  Tooltips are used to describe or identify an element. In most
                  scenarios, tooltips help the user understand meaning, function
                  or alt-text.
                </div>
              </div>
            </div>
            <Tooltip.Arrow
              className="fill-white"
              offset={10}
              width={18}
              height={12}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const TooltipLeft: Story = {
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="IconButton rounded p-2 shadow">Hover</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="TooltipContent"
            sideOffset={5}
            side={"left"}
          >
            <div className="Content inline-flex w-80 flex-col items-start justify-start bg-white p-3">
              <div className="TextAndSupportingText flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="Text self-stretch text-sm font-semibold leading-none text-gray-800">
                  Number of triggers tooltip
                </div>
                <div className="SupportingText self-stretch text-sm font-medium leading-none text-gray-800 text-opacity-80">
                  Tooltips are used to describe or identify an element. In most
                  scenarios, tooltips help the user understand meaning, function
                  or alt-text.
                </div>
              </div>
            </div>
            <Tooltip.Arrow
              className="fill-white"
              offset={10}
              width={18}
              height={12}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};

export const TooltipBottom: Story = {
  render: () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="IconButton rounded p-2 shadow">Hover</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="TooltipContent"
            sideOffset={5}
            side={"bottom"}
          >
            <div className="Content inline-flex w-80 flex-col items-start justify-start bg-white p-3">
              <div className="TextAndSupportingText flex flex-col items-start justify-start gap-1 self-stretch">
                <div className="Text self-stretch text-sm font-semibold leading-none text-gray-800">
                  Number of triggers tooltip
                </div>
                <div className="SupportingText self-stretch text-sm font-medium leading-none text-gray-800 text-opacity-80">
                  Tooltips are used to describe or identify an element. In most
                  scenarios, tooltips help the user understand meaning, function
                  or alt-text.
                </div>
              </div>
            </div>
            <Tooltip.Arrow
              className="fill-white"
              offset={10}
              width={18}
              height={12}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ),
};
