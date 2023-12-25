import { Meta, StoryFn } from "@storybook/react";
import { Logos } from ".";

const meta: Meta = {
  title: "Components/NewUi/Logos",
};

export default meta;

const Template: StoryFn = () => {
  return (
    <div className="grid grid-flow-row grid-cols-4 gap-x-6 gap-y-6">
      {Object.entries(Logos).map(([key, Logo]) => {
        return <Logo key={key} className="m-auto w-[120px]" />;
      })}
    </div>
  );
};

export const Default: StoryFn = Template.bind({});
