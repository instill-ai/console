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
      status: "on",
      name: "modal_1",
    },
    {
      status: "off",
      name: "modal_2",
    },
    {
      status: "off",
      name: "model_model_2",
    },
    {
      status: "off",
      name: "model_334rrf",
    },
    {
      status: "off",
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
