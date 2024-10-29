"use client";

import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Slider } from "@instill-ai/design-system";

import { cn } from "../../utils";

const meta: Meta<typeof Slider.Root> = {
  title: "Components/NewUi/Slider",
  component: Slider.Root,
};

export default meta;

type Story = StoryObj<typeof Slider.Root>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<number>(50);

    const handleValueChange = (newValue: number[]) => {
      setValue(newValue[0]!);
    };

    return (
      <div className="w-full max-w-md p-4">
        <Slider.Root
          value={[value]}
          onValueChange={handleValueChange}
          min={0}
          max={100}
          step={1}
          className={cn("relative flex w-full touch-none select-none")}
        >
          <Slider.Track className="relative h-2 w-full rounded-full bg-semantic-bg-line">
            <Slider.Range className="absolute h-full rounded-full bg-semantic-accent-default" />
          </Slider.Track>
          <Slider.Thumb className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-semantic-accent-default bg-semantic-bg-base-bg" />
        </Slider.Root>
        <div className="mt-4 text-center">Value: {value}</div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = React.useState<number>(30);

    const handleValueChange = (newValue: number[]) => {
      setValue(newValue[0]!);
    };

    return (
      <div className="w-full max-w-md p-4">
        <Slider.Root
          value={[value]}
          onValueChange={handleValueChange}
          min={0}
          max={100}
          step={1}
          disabled
          className={cn(
            "relative flex w-full touch-none select-none cursor-not-allowed opacity-50",
          )}
        >
          <Slider.Track className="relative h-2 w-full rounded-full bg-semantic-bg-line">
            <Slider.Range className="absolute h-full rounded-full bg-semantic-bg-secondary" />
          </Slider.Track>
          <Slider.Thumb className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-semantic-bg-secondary bg-semantic-bg-base-bg" />
        </Slider.Root>
        <div className="mt-4 text-center">Value: {value}</div>
      </div>
    );
  },
};

export const CustomStyling: Story = {
  render: () => {
    const [value, setValue] = React.useState<number>(75);

    const handleValueChange = (newValue: number[]) => {
      setValue(newValue[0]!);
    };

    return (
      <div className="w-full max-w-md p-4">
        <Slider.Root
          value={[value]}
          onValueChange={handleValueChange}
          min={0}
          max={100}
          step={5}
          className={cn("relative flex w-full touch-none select-none")}
        >
          <Slider.Track className="relative h-4 w-full rounded-full bg-gradient-to-r from-semantic-success-default via-semantic-warning-default to-semantic-error-default">
            <Slider.Range className="absolute h-full rounded-full bg-semantic-bg-base-bg opacity-50" />
          </Slider.Track>
          <Slider.Thumb className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-semantic-bg-primary bg-semantic-fg-primary" />
        </Slider.Root>
        <div className="mt-4 text-center">Value: {value}</div>
      </div>
    );
  },
};
