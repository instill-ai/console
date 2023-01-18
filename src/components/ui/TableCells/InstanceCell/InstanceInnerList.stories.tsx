import { Meta, StoryFn } from "@storybook/react";
import { Instance } from "./InstanceCell";
import { InstanceInnerList } from "./InstanceInnerList";

const meta: Meta<typeof InstanceInnerList> = {
  title: "Components/Ui/InstanceInnerList",
  component: InstanceInnerList,
};

export default meta;

const Template: StoryFn<typeof InstanceInnerList> = (args) => {
  const mockItems: Instance[] = [
    {
      state: "STATE_ONLINE",
      name: "modal_1",
    },
    {
      state: "STATE_OFFLINE",
      name: "modal_2",
    },
    {
      state: "STATE_ONLINE",
      name: "model_model_2",
    },
    {
      state: "STATE_ONLINE",
      name: "model_334rrf",
    },
    {
      state: "STATE_ONLINE",
      name: "model_2dddd",
    },
  ];

  return (
    <InstanceInnerList
      {...args}
      items={mockItems}
      listItemsContainerWidth={275}
    />
  );
};

export const Playground: StoryFn<typeof InstanceInnerList> = Template.bind({});

Playground.args = {};
