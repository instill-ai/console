import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type NumberFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  number: Nullable<number>;
  hideField?: boolean;
};

export const NumberField = (props: NumberFieldProps) => {
  const { nodeType, title, number, hideField } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} fieldKey={`${title}-field`}>
        {number && !hideField ? (
          <div className="flex min-h-[36px] w-full items-center break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular">
            {number}
          </div>
        ) : null}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {number && !hideField ? (
        <div className="flex min-h-[36px] w-full items-center break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular">
          {number}
        </div>
      ) : null}
    </EndNodeFieldRoot>
  );
};
