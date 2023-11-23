import { Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type NumbersFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  numbers: Nullable<number>[];
  hideField?: boolean;
};

export const NumbersField = (props: NumbersFieldProps) => {
  const { nodeType, title, numbers, hideField } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} fieldKey={`${title}-field`}>
        {numbers && !hideField ? (
          <div className="flex w-full flex-row flex-wrap gap-2">
            {numbers.map((number) => (
              <div
                key={`${title}-${number}-field`}
                className="min-h-[36px] w-full items-center break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular"
              >
                {number}
              </div>
            ))}
          </div>
        ) : null}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {numbers && !hideField ? (
        <div className="flex w-full flex-row flex-wrap gap-2">
          {numbers.map((number) => (
            <div
              key={`${title}-${number}-field`}
              className="min-h-[36px] w-full items-center break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular"
            >
              {number}
            </div>
          ))}
        </div>
      ) : null}
    </EndNodeFieldRoot>
  );
};
