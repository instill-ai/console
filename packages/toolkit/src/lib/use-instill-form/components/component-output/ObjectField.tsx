import { GeneralRecord, Nullable } from "../../../type";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type ObjectFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  object: Nullable<GeneralRecord>;
  hideField?: boolean;
};

export const ObjectField = (props: ObjectFieldProps) => {
  const { nodeType, title, object, hideField } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} fieldKey={`${title}-field`}>
        {object && !hideField ? (
          <div className="flex w-full">
            <pre className="flex min-h-[36px] w-full flex-1 whitespace-pre-line break-all text-semantic-fg-primary product-body-text-4-regular">
              {JSON.stringify(object, null, 2)}
            </pre>
          </div>
        ) : null}
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      {object && !hideField ? (
        <div className="flex w-full">
          <pre className="flex min-h-[36px] w-full flex-1 whitespace-pre-line break-all text-semantic-fg-primary product-body-text-4-regular">
            {JSON.stringify(object, null, 2)}
          </pre>
        </div>
      ) : null}
    </EndNodeFieldRoot>
  );
};
