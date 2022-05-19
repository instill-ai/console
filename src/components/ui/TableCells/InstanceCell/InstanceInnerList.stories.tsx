import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Instance } from "./InstanceCell";
import InstanceInnerList from "./InstanceInnerList";

export default {
  title: "Components/Ui/InstanceInnerList",
  component: InstanceInnerList,
} as ComponentMeta<typeof InstanceInnerList>;

const Template: ComponentStory<typeof InstanceInnerList> = (args) => {
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

export const Playground: ComponentStory<typeof InstanceInnerList> =
  Template.bind({});

Playground.args = {};
