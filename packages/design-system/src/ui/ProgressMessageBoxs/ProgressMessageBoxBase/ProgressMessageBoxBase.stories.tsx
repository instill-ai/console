import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import { basicProgressMessageBoxConfig } from "../BasicProgressMessageBox";
import ProgressMessageBoxBase, {
  ProgressMessageBoxState,
} from "./ProgressMessageBoxBase";

const meta: Meta<typeof ProgressMessageBoxBase> = {
  title: "Components/Base/Common/ProgressMessageBoxBase",
  component: ProgressMessageBoxBase,
};

export default meta;

const Template: StoryFn<typeof ProgressMessageBoxBase> = (args) => {
  const [messageBoxState, setMessageBoxState] =
    React.useState<ProgressMessageBoxState>({
      activate: true,
      message: "hi",
      description: "please wait",
      status: "progressing",
    });
  return (
    <>
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
      <ProgressMessageBoxBase
        {...args}
        state={messageBoxState}
        setActivate={(activate) =>
          setMessageBoxState((prev) => ({ ...prev, activate }))
        }
      />
    </>
  );
};
export const Playground: StoryFn<typeof ProgressMessageBoxBase> = Template.bind(
  {}
);

Playground.args = {
  width: "w-[300px]",
  ...basicProgressMessageBoxConfig,
  closable: true,
};
