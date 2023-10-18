import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import { State } from "../../../types/general";
import StatefulToggleField from "./StatefulToggleField";

const meta: Meta<typeof StatefulToggleField> = {
  title: "Components/Ui/Input/StatefulToggleField",
  component: StatefulToggleField,
};

export default meta;

const Template: StoryFn<typeof StatefulToggleField> = (args) => {
  const [state, setState] = React.useState<State>("STATE_INACTIVE");
  const [check, setCheck] = React.useState(false);

  return (
    <StatefulToggleField
      {...args}
      id="basic-toggle-field"
      onChange={() => {
        if (state === "STATE_INACTIVE") {
          setState("STATE_LOADING");
          setTimeout(() => {
            setCheck(true);
            setState("STATE_ACTIVE");
          }, 1000);
          return;
        }

        if (state === "STATE_ACTIVE") {
          setState("STATE_LOADING");
          setTimeout(() => {
            setCheck(false);
            setState("STATE_INACTIVE");
          }, 1000);
          return;
        }
      }}
      value={check}
      description="this is a description for basic toggle field <a href='#'>setup guide</a>"
      label="basic-toggle-field"
      error={
        state === "STATE_ERROR" ? "There is an error. Please try again." : null
      }
      state={state}
      loadingLabelText="Loading..."
    />
  );
};

export const Playground: StoryFn<typeof StatefulToggleField> = Template.bind(
  {}
);

Playground.args = {
  disabled: false,
  readOnly: false,
  required: true,
  additionalMessageOnLabel: "text label",
};
