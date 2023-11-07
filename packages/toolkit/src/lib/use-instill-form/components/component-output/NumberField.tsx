import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

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
        <div className="flex min-h-[36px] w-full items-center break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular">
          {number}
        </div>
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex min-h-[36px] w-full items-center break-all rounded-sm border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5 text-semantic-fg-primary product-body-text-4-regular">
        {number}
      </div>
    </EndNodeFieldRoot>
  );
};
