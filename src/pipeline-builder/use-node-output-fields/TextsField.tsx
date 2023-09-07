import { Nullable } from "@instill-ai/toolkit";

export type TextsFieldProps = {
  title: Nullable<string>;
  texts: Nullable<string>[];
};

export const TextsField = (props: TextsFieldProps) => {
  const { title, texts } = props;

  return (
    <div className="flex flex-col space-y-2">
      <p className="text-semantic-fg-primary product-body-text-3-semibold">
        {title}
      </p>
      <div className="flex flex-col space-y-1">
        {texts?.map((text) => (
          <div
            key={text}
            className="flex border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5 text-semantic-fg-primary product-body-text-4-regular"
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};
