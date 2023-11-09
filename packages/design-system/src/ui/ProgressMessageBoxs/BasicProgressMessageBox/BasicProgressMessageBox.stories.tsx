import * as React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { ProgressMessageBoxState } from "../ProgressMessageBoxBase";
import BasicProgressMessageBox from "./BasicProgressMessageBox";

const meta: Meta<typeof BasicProgressMessageBox> = {
  title: "Components/Ui/Common/BasicProgressMessageBox",
  component: BasicProgressMessageBox,
};

export default meta;

const Template: StoryFn<typeof BasicProgressMessageBox> = (args) => {
  const [messageBoxState, setMessageBoxState] =
    React.useState<ProgressMessageBoxState>({
      activate: true,
      message: "hi",
      description: "please wait",
      status: "progressing",
    });
  return (
    <React.Fragment>
      <button
        className="mb-10"
        onClick={() =>
          setMessageBoxState((prev) => ({
            ...prev,
            activate: true,
          }))
        }
      >
        Activate message box
      </button>
      <BasicProgressMessageBox
        {...args}
        state={messageBoxState}
        setActivate={(activate) =>
          setMessageBoxState((prev) => ({ ...prev, activate }))
        }
      />
    </React.Fragment>
  );
};
export const Playground: StoryFn<typeof BasicProgressMessageBox> =
  Template.bind({});

Playground.args = {
  width: "w-[300px]",
  closable: true,
};
