import { GeneralRecord, Nullable } from "../../../type";
import { FieldRoot } from "./FieldRoot";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";

export type ObjectsFieldProps = {
  title: Nullable<string>;
  objects: Nullable<GeneralRecord[]>;
  hideField?: boolean;
};

export const ObjectsField = (props: ObjectsFieldProps) => {
  const { title, objects, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {objects && !hideField ? (
        <div className="flex w-full flex-col flex-wrap gap-2">
          {objects?.map((object) => (
            <JsonView
              key={`${title}-${JSON.stringify(object)}-field`}
              data={object}
              shouldExpandNode={allExpanded}
              style={defaultStyles}
            />
          ))}
        </div>
      ) : null}
    </FieldRoot>
  );
};
