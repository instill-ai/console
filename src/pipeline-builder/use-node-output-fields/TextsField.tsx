import { Nullable } from "@instill-ai/toolkit";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type TextsFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  texts: Nullable<string>[];
};

export const TextsField = (props: TextsFieldProps) => {
  const { nodeType, title, texts } = props;

  if (nodeType === "connector") {
    <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex w-full flex-col flex-wrap gap-2">
        {texts?.map((text) => (
          <div
            key={`${title}-${text}-field`}
            className="break-words text-semantic-fg-primary product-body-text-4-regular"
          >
            {text}
          </div>
        ))}
      </div>
    </ConnectorNodeFieldRoot>;
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex-row flex-wrap gap-2">
        {texts?.map((text) => (
          <div
            key={`${title}-${text}-field`}
            className="flex border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5 text-semantic-fg-primary product-body-text-4-regular"
          >
            {text}
          </div>
        ))}
      </div>
    </EndNodeFieldRoot>
  );
};
