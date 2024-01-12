import { GeneralRecord, Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../type";
import { FieldRoot } from "./FieldRoot";

export type ObjectFieldProps = {
  object: Nullable<GeneralRecord>;
} & ComponentOutputFieldBaseProps;

export const ObjectField = ({
  title,
  object,
  hideField,
  componentID,
  enabledReferenceHint,
  path,
  instillFormat,
}: ObjectFieldProps) => {
  return (
    <FieldRoot
      title={title}
      fieldKey={`${title}-field`}
      componentID={componentID}
      enabledReferenceHint={enabledReferenceHint}
      path={path}
      instillFormat={instillFormat}
    >
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
