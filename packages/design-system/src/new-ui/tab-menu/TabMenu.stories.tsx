import * as React from "react";
import type { Meta } from "@storybook/react";
import { TabMenu } from "./TabMenu";
import { Nullable } from "../../types/general";

const meta: Meta<typeof TabMenu> = {
  title: "Components/NewUi/TabMenu",
};

export default meta;

export const Regular = () => {
  const [value, setValue] = React.useState<Nullable<string>>("Overview");

  return (
    <TabMenu.Root value={value} onValueChange={(value) => setValue(value)}>
      <TabMenu.Item value="Overview">Overview</TabMenu.Item>
      <TabMenu.Item value="Template">Template</TabMenu.Item>
      <TabMenu.Item value="Versions">Versions</TabMenu.Item>
    </TabMenu.Root>
  );
};
