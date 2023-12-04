import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TabMenu } from "./TabMenu";

const meta: Meta<typeof TabMenu> = {
  title: "Components/NewUi/TabMenu",
};

export default meta;

type Story = StoryObj<typeof TabMenu>;

export const Regular = () => {
  return (
    <TabMenu.Root defaultValue="Overview">
      <TabMenu.Item value="Overview">Overview</TabMenu.Item>
      <TabMenu.Item value="Template">Template</TabMenu.Item>
      <TabMenu.Item value="Versions">Versions</TabMenu.Item>
    </TabMenu.Root>
  );
};
