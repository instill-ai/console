import { GeneralRecord, Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";

export type ObjectsFieldProps = {
  objects: Nullable<GeneralRecord[]>;
} & ComponentOutputFieldBaseProps;

export const ObjectsField = (props: ObjectsFieldProps) => {
  const { title, objects, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {objects && !hideField ? (
        <div className="flex w-full flex-col flex-wrap gap-2">
          {objects?.map((object) => (
            <div
              key={`${title}-${JSON.stringify(object)}-field`}
              className="flex min-h-[36px] w-full whitespace-pre-wrap break-all rounded border border-semantic-bg-line p-1 text-semantic-fg-primary product-body-text-4-regular"
            >
              {JSON.stringify(object, null, 4)}
            </div>
          ))}
        </div>
      ) : null}
    </FieldRoot>
  );
};
