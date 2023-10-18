import { Nullable } from "../../../lib";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type NumbersFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  numbers: Nullable<number>[];
};

export const NumbersField = (props: NumbersFieldProps) => {
  const { nodeType, title, numbers } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        <div className="flex w-full flex-row flex-wrap gap-2">
          {numbers?.map((number) => (
            <div
              key={`${title}-${number}-field`}
              className="break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular"
            >
              {number}
            </div>
          ))}
        </div>
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex-row flex-wrap gap-2">
        {numbers?.map((number) => (
          <div
            key={`${title}-${number}-field`}
            className="flex break-all rounded-sm border border-semantic-bg-line bg-semantic-bg-primary px-[9px] py-1.5 text-semantic-fg-primary product-body-text-4-regular"
          >
            {number}
          </div>
        ))}
      </div>
    </EndNodeFieldRoot>
  );
};
