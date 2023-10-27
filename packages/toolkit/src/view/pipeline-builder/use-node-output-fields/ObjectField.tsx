import { GeneralRecord, Nullable } from "../../../lib";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type ObjectFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  object: Nullable<GeneralRecord>;
};

export const ObjectField = (props: ObjectFieldProps) => {
  const { nodeType, title, object } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        <div className="flex w-full">
          <pre className="flex min-h-[36px] w-full flex-1 whitespace-pre-line break-all text-semantic-fg-primary product-body-text-4-regular">
            {JSON.stringify(object, null, 2)}
          </pre>
        </div>
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex w-full">
        <pre className="flex min-h-[36px] w-full flex-1 whitespace-pre-line break-all text-semantic-fg-primary product-body-text-4-regular">
          {JSON.stringify(object, null, 2)}
        </pre>
      </div>
    </EndNodeFieldRoot>
  );
};
