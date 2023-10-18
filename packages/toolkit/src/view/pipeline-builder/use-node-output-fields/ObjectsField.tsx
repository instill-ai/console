import { Nullable } from "../../../lib";
import { ConnectorNodeFieldRoot, EndNodeFieldRoot } from "./FieldRoot";

export type ObjectsFieldProps = {
  nodeType: "end" | "connector";
  title: Nullable<string>;
  objects: Nullable<Record<string, any>[]>;
};

export const ObjectsField = (props: ObjectsFieldProps) => {
  const { nodeType, title, objects } = props;

  if (nodeType === "connector") {
    return (
      <ConnectorNodeFieldRoot title={title} key={`${title}-field`}>
        <div className="flex w-full flex-col flex-wrap gap-2">
          {objects?.map((object) => (
            <pre
              key={`${title}-${JSON.stringify(object)}-field`}
              className="min-h-[16px] whitespace-pre-line max-w-[480px] break-all flex flex-1 text-semantic-fg-primary product-body-text-4-regular"
            >
              {JSON.stringify(object, null, 2)}
            </pre>
          ))}
        </div>
      </ConnectorNodeFieldRoot>
    );
  }

  return (
    <EndNodeFieldRoot title={title} key={`${title}-field`}>
      <div className="flex w-full flex-col gap-2">
        {objects?.map((object) => (
          <pre
            key={`${title}-${JSON.stringify(object)}-field`}
            className="min-h-[16px] whitespace-pre-line max-w-[480px] break-all flex flex-1 text-semantic-fg-primary product-body-text-4-regular"
          >
            {JSON.stringify(object, null, 2)}
          </pre>
        ))}
      </div>
    </EndNodeFieldRoot>
  );
};
