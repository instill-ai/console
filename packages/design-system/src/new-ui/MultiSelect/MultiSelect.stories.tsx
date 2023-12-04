import type { Meta } from "@storybook/react";
import { Icons } from "../Icons";
import * as React from "react";
import { SelectOption } from "../../types/general";
import { MultiSelect } from "./MultiSelect";

const meta: Meta<typeof MultiSelect> = {
  title: "Components/NewUi/MultiSelect",
};

export default meta;

const exampleOtions: SelectOption[] = [
  {
    value: "Convert Audio to text",
    label: "Convert Audio to text",
  },
  {
    value: "Generate-text-by-LLM",
    label: "Generate text by LLM",
  },
  {
    value: "Generate-Web3-assets",
    label: "Generate Web3 assets",
  },
  {
    value: "Generate-Images",
    label: "Generate Images",
  },
];

export const Default = () => {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [options, setOptions] = React.useState<SelectOption[]>(exampleOtions);

  return (
    <MultiSelect
      options={options}
      setOptions={setOptions}
      emptyPlaceholder="Create new item"
      selectedOptions={selectedOptions}
      onChange={setSelectedOptions}
      createOnNotFound={true}
      placeholder={
        <div className="flex flex-row gap-x-2">
          <Icons.Plus className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
          <p className="text-semantic-fg-secondary product-body-text-3-medium">
            Add tag
          </p>
        </div>
      }
    />
  );
};
