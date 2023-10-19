import { Nullable } from "../../../lib";
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
        <div className="flex rounded-sm break-all text-semantic-fg-primary product-body-text-4-regular">
          {number}
        </div>
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex rounded-sm max-w-[200px] break-all border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5 text-semantic-fg-primary product-body-text-4-regular">
        {number}
      </div>
    </EndNodeFieldRoot>
  );
};
