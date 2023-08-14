import React, { ReactElement } from "react";
import { Icons } from "@instill-ai/design-system";

type InputTypeProps = {
  label: string;
  iconElement: ReactElement;
  type: string;
};

const inputs: InputTypeProps[] = [
  {
    type: "text",
    label: "Text",
    iconElement: <Icons.Type02 className="my-auto h-5 w-5" />,
  },
];

export default function InputType({ type }: string) {
  const inputType = inputs.find((input) => input.type === type);

  return (
    <div className="bg-segmatic-bg-primary flex flex-row gap-x-4 rounded-sm">
      {inputType?.iconElement}
      <p className="prod-body-Text-4-semibold">{inputType?.label}</p>
    </div>
  );
}
