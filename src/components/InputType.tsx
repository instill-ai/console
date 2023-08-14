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
    iconElement: <Icons.Type02 className="my-auto h-5 w-5 stroke-slate-500" />,
  },
  {
    type: "image",
    label: "Image",
    iconElement: <Icons.Type02 className="my-auto h-5 w-5 stroke-slate-500" />,
  },
  {
    type: "number",
    label: "Number",
    iconElement: <Icons.Type02 className="my-auto h-5 w-5 stroke-slate-500" />,
  },
  {
    type: "audio",
    label: "Audio",
    iconElement: (
      <Icons.Recording02 className="my-auto h-5 w-5 stroke-slate-500" />
    ),
  },
  {
    type: "boolean",
    label: "Boolean",
    iconElement: <Icons.Type02 className="my-auto h-5 w-5 stroke-slate-500" />,
  },
];

export default function InputType({ type }: string) {
  const inputType = inputs.find((input) => input.type === type);

  return (
    <div className="flex flex-row gap-x-2 rounded-sm bg-semantic-bg-primary px-3 py-1">
      {inputType?.iconElement}
      <span className="inline-block align-middle product-body-text-4-semibold">
        {inputType?.label}
      </span>
    </div>
  );
}
