import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import {
  DataDestinationIcon,
  DataSourceIcon,
  ModelIcon,
  PipelineIcon,
} from "../../Icons";
import BgIconAccordion from "./BgIconAccordion";

const meta: Meta<typeof BgIconAccordion> = {
  title: "Components/Ui/Accordion/BgIconAccordion",
  component: BgIconAccordion,
};

export default meta;

const Template: StoryFn<typeof BgIconAccordion> = (args) => {
  const [activeIndex, setActiveIndex] = React.useState<number[]>([]);
  return (
    <BgIconAccordion
      {...args}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
    />
  );
};

export const Playground: StoryFn<typeof BgIconAccordion> = Template.bind({});

const bgIconStyle = {
  width: "w-[250px]",
  height: "h-[250px]",
  color: "fill-white opacity-60",
  position: "m-auto",
};

Playground.args = {
  enableHeaderIcon: true,
  allowMultiItems: true,
  bgIconPosition: "top-0 -right-20",
  items: [
    {
      header: "Pipeline",
      content: (
        <div className="w-full bg-[#285863]">
          <div className="flex w-7/12 flex-col p-5">
            <div className="flex text-base text-white">
              An end-to-end workflow that automates a sequence of sub-components
              to process unstructured data.
            </div>
          </div>
        </div>
      ),
      headerActiveBgColor: "bg-instillNeonBlue",
      headerInActiveBgColor: "bg-[#2596AE]",
      headerActiveTextColor: "text-white",
      headerInActiveTextColor: "text-instillGrey30",
      bgIcon: <PipelineIcon {...bgIconStyle} />,
    },
    {
      header: "Source",
      content: (
        <div className="w-full bg-[#285863]">
          <div className="flex w-7/12 flex-col p-5">
            <div className="flex text-base text-white">
              A data connector in charge of ingesting unstructured data into a
              Pipeline.
            </div>
          </div>
        </div>
      ),
      headerActiveBgColor: "bg-instillNeonBlue",
      headerInActiveBgColor: "bg-[#2596AE]",
      headerActiveTextColor: "text-white",
      headerInActiveTextColor: "text-instillGrey30",
      bgIcon: <DataSourceIcon {...bgIconStyle} />,
    },
    {
      header: "Model",
      content: (
        <div className="w-full bg-[#285863]">
          <div className="flex w-7/12 flex-col p-5">
            <div className="flex text-base text-white">
              An algorithm that runs on unstructured data to solve a specific AI
              task.
            </div>
          </div>
        </div>
      ),
      headerActiveBgColor: "bg-instillNeonBlue",
      headerInActiveBgColor: "bg-[#2596AE]",
      headerActiveTextColor: "text-white",
      headerInActiveTextColor: "text-instillGrey30",
      bgIcon: <ModelIcon {...bgIconStyle} />,
    },
    {
      header: "Destination",
      content: (
        <div className="w-full bg-[#285863]">
          <div className="flex w-7/12 flex-col p-5">
            <div className="flex text-base text-white">
              A data connector to load the standardised AI task output from
              Model to the Destination.
            </div>
          </div>
        </div>
      ),
      headerActiveBgColor: "bg-instillNeonBlue",
      headerInActiveBgColor: "bg-[#2596AE]",
      headerActiveTextColor: "text-white",
      headerInActiveTextColor: "text-instillGrey30",
      bgIcon: <DataDestinationIcon {...bgIconStyle} />,
    },
  ],
};
