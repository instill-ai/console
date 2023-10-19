import { Nullable } from "../../../lib";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type ObjectFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  object: Nullable<Record<string, any>>;
};

export const ObjectField = (props: ObjectFieldProps) => {
  const { nodeType, title, object } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        <div className="flex w-full">
          <pre className="min-h-[16px] whitespace-pre-line max-w-[480px] break-all flex flex-1 text-semantic-fg-primary product-body-text-4-regular">
            {JSON.stringify(object, null, 2)}
          </pre>
        </div>
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex w-full">
        <pre className="min-h-[16px] whitespace-pre-line max-w-[480px] break-all flex flex-1 text-semantic-fg-primary product-body-text-4-regular">
          {JSON.stringify(object, null, 2)}
        </pre>
      </div>
    </EndNodeFieldRoot>
  );
};
