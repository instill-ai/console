import type { Meta } from "@storybook/react";
import { Combobox } from "./Combobox";
import { Icons } from "../Icons";
import * as React from "react";
import { Button } from "../Button";
import { SelectOption } from "../../types/general";

const meta: Meta<typeof Combobox> = {
  title: "Components/NewUi/Combobox",
};

export default meta;

const items: SelectOption[] = [
  {
    value: "Convert Audio to text",
    label: "Convert Audio to text",
    startIcon: (
      <Icons.Recording02 className=" h-4 w-4 stroke-semantic-fg-secondary" />
    ),
  },
  {
    value: "Generate-text-by-LLM",
    label: "Generate text by LLM",
    startIcon: (
      <Icons.Recording02 className=" h-4 w-4 stroke-semantic-fg-secondary" />
    ),
  },
  {
    value: "Generate-Web3-assets",
    label: "Generate Web3 assets",
    startIcon: (
      <Icons.Recording02 className=" h-4 w-4 stroke-semantic-fg-secondary" />
    ),
  },
  {
    value: "Generate-Images",
    label: "Generate Images",
    startIcon: (
      <Icons.Recording02 className=" h-4 w-4 stroke-semantic-fg-secondary" />
    ),
  },
];

export const Default = () => {
  const [value, setValue] = React.useState("");
  return (
    <Combobox
      items={items}
      placeholder="Search"
      notFoundPlaceholder="No Item Found"
      value={value}
      setValue={setValue}
      label={
        <Button variant="secondaryGrey" className="w-[300px] justify-between">
          {value ? items.find((item) => item.value === value)?.label : "Select"}
          <Icons.ChevronSelectorVertical className="ml-2 h-4 w-4 stroke-slate-500" />
        </Button>
      }
    />
  );
};
