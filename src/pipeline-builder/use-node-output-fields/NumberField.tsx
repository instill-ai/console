import { Nullable } from "@instill-ai/toolkit";
import { ConnectorNodeFieldRoot } from "./FieldRoot";

export type NumberFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  number: Nullable<number>;
};

export const NumberField = (props: NumberFieldProps) => {
  const { nodeType, title, number } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        <div className="flex break-words text-semantic-fg-primary product-body-text-4-regular">
          {number}
        </div>
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <div key={`${title}-field`} className="flex w-full flex-col space-y-2">
      <p className="text-semantic-fg-primary product-body-text-3-semibold">
        {title}
      </p>
      <div className="flex max-w-[200px] break-words border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5 text-semantic-fg-primary product-body-text-4-regular">
        {number}
      </div>
    </div>
  );
};
