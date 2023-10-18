import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import BasicAccordion from "./BasicAccordion";

const meta: Meta<typeof BasicAccordion> = {
  title: "Components/Ui/Accordion/BasicAccordion",
  component: BasicAccordion,
};

export default meta;

const Template: StoryFn<typeof BasicAccordion> = (args) => {
  const [activeIndex, setActiveIndex] = React.useState<number[]>([]);
  return (
    <BasicAccordion
      {...args}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
    />
  );
};

export const Playground: StoryFn<typeof BasicAccordion> = Template.bind({});

Playground.args = {
  enableHeaderIcon: true,
  allowMultiItems: true,
  items: [
    {
      header: "Pipeline",
      content: (
        <div className="bg-[#23C4E7] w-full">
          <div className="flex flex-col p-5 bg-[#23C4E7] w-full">
            <div className="flex text-base text-white">
              An end-to-end workflow that automates a sequence of sub-components
              to process unstructured data.
            </div>
          </div>
        </div>
      ),
      headerActiveBgColor: "bg-[#23C4E7]",
      headerInActiveBgColor: "bg-[#23C4E7]",
      headerActiveTextColor: "text-white",
      headerInActiveTextColor: "text-instillGrey30",
    },
    {
      header: "Source",
      content: (
        <div className="bg-[#02D085] w-full">
          <div className="flex flex-col p-5 w-full">
            <div className="flex text-base text-white">
              A data connector in charge of ingesting unstructured data into a
              Pipeline.
            </div>
          </div>
        </div>
      ),
      headerActiveBgColor: "bg-[#02D085]",
      headerInActiveBgColor: "bg-[#02D085]",
      headerActiveTextColor: "text-white",
      headerInActiveTextColor: "text-instillGrey30",
    },
    {
      header: "Model",
      content: (
        <div className="bg-[#DEC800] w-full">
          <div className="flex flex-col p-5 bg-[#DEC800] w-full">
            <div className="flex text-base text-white">
              An algorithm that runs on unstructured data to solve a specific AI
              task.
            </div>
          </div>
        </div>
      ),
      headerActiveBgColor: "bg-[#DEC800]",
      headerInActiveBgColor: "bg-[#DEC800]",
      headerActiveTextColor: "text-white",
      headerInActiveTextColor: "text-instillGrey30",
    },
    {
      header: "Destination",
      content: (
        <div className="bg-[#FF8A00] w-full">
          <div className="flex flex-col p-5 bg-[#FF8A00] w-full">
            <div className="flex text-base text-white">
              A data connector to load the standardised AI task output from
              Model to the Destination.
            </div>
          </div>
        </div>
      ),
      headerActiveBgColor: "bg-[#FF8A00]",
      headerInActiveBgColor: "bg-[#FF8A00]",
      headerActiveTextColor: "text-white",
      headerInActiveTextColor: "text-instillGrey30",
    },
  ],
};
