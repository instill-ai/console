import * as React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { Icons } from "../Icons";

const meta: Meta = {
  title: "Components/NewUi/Input",
};

export default meta;
type Story = StoryObj<typeof Input>;

export const TextWithIcon: Story = {
  render: () => {
    return (
      <Input.Root>
        <Input.Core disabled={false} type="text" placeholder="Hello world" />
        <Input.LeftIcon
          onClick={() => {
            alert("hi");
          }}
        >
          <Icons.Box className="my-auto h-5 w-5 cursor-pointer stroke-slate-800" />
        </Input.LeftIcon>
      </Input.Root>
    );
  },
};

export const FileInput: Story = {
  render: () => {
    return (
      <Input.Root>
        <Input.LeftIcon>
          <Icons.Chip01 className="my-auto h-5 w-5 stroke-slate-800" />
        </Input.LeftIcon>
        <Input.Core
          disabled={false}
          type="file"
          placeholder="Upload your chip"
        />
      </Input.Root>
    );
  },
};

const AutoresizeInputComp = () => {
  const [value, setValue] = React.useState("");

  return (
    <div className="flex">
      <div className="relative h-10 min-w-[200px] max-w-[400px]">
        <div
          className="invisible !m-0 box-border h-full border-none"
          contentEditable={true}
          suppressContentEditableWarning={true}
        >
          {value}
        </div>
        <Input.Root className="!absolute !bottom-0 !left-0 !right-0 !top-0">
          <Input.Core
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disabled={false}
            type="text"
            placeholder="Hello world"
          />
        </Input.Root>
      </div>
    </div>
  );
};

export const AutoresizeInput: Story = {
  render: () => <AutoresizeInputComp />,
};
