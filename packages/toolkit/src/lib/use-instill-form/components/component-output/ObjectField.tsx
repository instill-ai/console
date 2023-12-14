import { GeneralRecord, Nullable } from "../../../type";
import { FieldRoot } from "./FieldRoot";

export type ObjectFieldProps = {
  title: Nullable<string>;
  object: Nullable<GeneralRecord>;
  hideField?: boolean;
};

export const ObjectField = (props: ObjectFieldProps) => {
  const { title, object, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {object && !hideField ? (
        <div className="flex w-full">
          <pre className="min-h-[36px] w-full flex-1 whitespace-pre-wrap break-all text-semantic-fg-primary product-body-text-4-regular">
            {JSON.stringify(object, null, 2)}
          </pre>
        </div>
      ) : null}
    </FieldRoot>
  );
};
