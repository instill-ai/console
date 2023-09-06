import { Nullable } from "@instill-ai/toolkit";

export type TextFieldProps = {
  title: Nullable<string>;
  text: Nullable<string>;
};

export const TextField = (props: TextFieldProps) => {
  const { title, text } = props;

  return (
    <div className="flex w-full flex-col space-y-2">
      <p className="text-semantic-fg-primary product-body-text-3-semibold">
        {title}
      </p>
      <div className="flex max-w-[200px] break-words border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5 text-semantic-fg-primary product-body-text-4-regular">
        {text}
      </div>
    </div>
  );
};
