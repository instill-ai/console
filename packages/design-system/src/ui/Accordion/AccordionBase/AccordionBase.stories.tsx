import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import {
  DataDestinationIcon,
  DataSourceIcon,
  MinusIcon,
  ModelIcon,
  PipelineIcon,
  PlusIcon,
} from "../../Icons";
import AccordionBase from "./AccordionBase";

const meta: Meta<typeof AccordionBase> = {
  title: "Components/Base/Accordion/AccordionBase",
  component: AccordionBase,
};

export default meta;

const Template: StoryFn<typeof AccordionBase> = (args) => {
  const [activeIndex, setActiveIndex] = React.useState<number[]>([]);
  return (
    <AccordionBase
      {...args}
      activeIndex={activeIndex}
      setActiveIndex={setActiveIndex}
    />
  );
};

export const Playground: StoryFn<typeof AccordionBase> = Template.bind({});

const iconStyle = {
  width: "w-[250px]",
  height: "h-[250px]",
  color: "fill-white opacity-60",
  position: "top-0 -right-20",
};

const headerIconStyle = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-white",
  position: "my-auto",
};

const commonHeaderStyle = {
  headerFont: "font-sans",
  headerFontWeight: "font-medium",
  headerTextSize: "text-2xl",
  headerPadding: "p-5",
  headerActiveIcon: <MinusIcon {...headerIconStyle} />,
  headerInActiveIcon: <PlusIcon {...headerIconStyle} />,
  enableHeaderIcon: true,
  bgIconPosition: "top-0 -right-20",
};

Playground.args = {
  type: "withIcon",
  allowMultiItems: false,
  items: [
    {
      header: "Pipeline",
      content: (
        <div className="bg-[#23C4E7] w-full">
          <div className="flex flex-col p-5 bg-[#23C4E7] w-7/12">
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
      bgIcon: <PipelineIcon {...iconStyle} />,
    },
    {
      header: "Source",
      content: (
        <div className="bg-[#02D085] w-full">
          <div className="flex flex-col p-5 w-7/12">
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
      bgIcon: <DataSourceIcon {...iconStyle} />,
    },
    {
      header: "Model",
      content: (
        <div className="bg-[#DEC800] w-full">
          <div className="flex flex-col p-5 bg-[#DEC800] w-7/12">
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
      bgIcon: <ModelIcon {...iconStyle} />,
    },
    {
      header: "Destination",
      content: (
        <div className="bg-[#FF8A00] w-full">
          <div className="flex flex-col p-5 bg-[#FF8A00] w-7/12">
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
      bgIcon: <DataDestinationIcon {...iconStyle} />,
    },
  ],
  ...commonHeaderStyle,
};
