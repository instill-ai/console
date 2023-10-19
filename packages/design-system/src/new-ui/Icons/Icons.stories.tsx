import { Meta, StoryFn } from "@storybook/react";
import { Icons } from ".";

const meta: Meta = {
  title: "Components/NewUi/Icons",
};

export default meta;

const Template: StoryFn = () => {
  return (
    <div className="grid grid-flow-row grid-cols-8 gap-y-6">
      {Object.entries(Icons).map(([key, Icon]) => {
        return <Icon key={key} className="h-6 w-6 stroke-slate-500" />;
      })}
    </div>
  );
};

export const Default: StoryFn = Template.bind({});
